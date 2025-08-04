import requests
import json
import time
import os
import re
import logging
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Optional, Tuple
from bs4 import BeautifulSoup
from dataclasses import dataclass
import unittest

# Configuration
@dataclass
class Config:
    max_workers: int = 3
    timeout: int = 15
    retry_attempts: int = 2
    delay_between_requests: float = 0.5
    min_pdf_size: int = 1024
    max_pdf_size: int = 50 * 1024 * 1024  # 50MB
    enable_logging: bool = True

class EnhancedPDFDownloader:
    def __init__(self, config: Config = None):
        self.config = config or Config()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Setup logging with UTF-8 encoding
        if self.config.enable_logging:
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(levelname)s - %(message)s',
                handlers=[
                    logging.FileHandler('pdf_downloader.log', encoding='utf-8'),
                    logging.StreamHandler()
                ],
                force=True  # Override existing configuration
            )
            
            # Fix Windows console encoding
            import sys
            if sys.platform == 'win32':
                try:
                    import codecs
                    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
                    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
                except:
                    pass  # Fallback if encoding fix fails
        self.logger = logging.getLogger(__name__)
        
        # Statistics
        self.stats = {
            'total_items': 0,
            'items_with_urls': 0,
            'pdfs_found': 0,
            'pdfs_downloaded': 0,
            'pdfs_failed': 0,
            'strategy_success': {},
            'failed_urls': []
        }
        
        # Thread lock for statistics
        self.stats_lock = threading.Lock()
    
    def normalize_url(self, url: str) -> str:
        """Enhanced URL normalization"""
        if not url:
            return url
        
        # Common URL fixes
        url_fixes = {
            'arxiv.org/html/': 'arxiv.org/abs/',
            'doi.org/': 'doi.org/',
        }
        
        for old, new in url_fixes.items():
            if old in url:
                url = url.replace(old, new)
        
        # Add schema if missing
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        return url.strip()
    
    def validate_pdf_content(self, filepath: str) -> bool:
        """Validates PDF file content"""
        try:
            file_size = os.path.getsize(filepath)
            
            # Size check
            if file_size < self.config.min_pdf_size or file_size > self.config.max_pdf_size:
                return False
            
            # PDF magic number check
            with open(filepath, 'rb') as f:
                header = f.read(4)
                return header == b'%PDF'
                
        except Exception:
            return False
    
    def retry_request(self, func, *args, **kwargs):
        """Retry mechanism for requests"""
        for attempt in range(self.config.retry_attempts):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt == self.config.retry_attempts - 1:
                    raise e
                time.sleep(0.5 * (attempt + 1))
        
    def is_valid_pdf_url(self, url: str) -> bool:
        """Enhanced PDF URL validation"""
        try:
            response = self.retry_request(self.session.head, url, timeout=self.config.timeout)
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '').lower()
                content_length = response.headers.get('content-length')
                
                # Content type check
                if 'pdf' not in content_type and not url.lower().endswith('.pdf'):
                    return False
                
                # Size check
                if content_length:
                    size = int(content_length)
                    if size < self.config.min_pdf_size or size > self.config.max_pdf_size:
                        return False
                
                return True
        except Exception:
            pass
        return False
    
    def try_sage_journals(self, url: str) -> Optional[str]:
        """Strategy: Sage Publications journals"""
        if 'journals.sagepub.com' not in url.lower():
            return None
        
        try:
            response = self.retry_request(self.session.get, url, timeout=self.config.timeout)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for PDF download link
            pdf_link = soup.find('a', {'class': 'item__link', 'data-item-name': 'pdf'})
            if pdf_link and pdf_link.get('href'):
                pdf_url = urljoin(url, pdf_link['href'])
                if self.is_valid_pdf_url(pdf_url):
                    return pdf_url
        except Exception:
            pass
        return None
    
    def try_acm_digital_library(self, url: str) -> Optional[str]:
        """Strategy: ACM Digital Library"""
        if 'dl.acm.org' not in url.lower():
            return None
        
        try:
            # Extract DOI from ACM URL
            doi_match = re.search(r'doi/(10\.1145/[0-9.]+)', url)
            if doi_match:
                doi = doi_match.group(1)
                pdf_url = f"https://dl.acm.org/doi/pdf/{doi}"
                if self.is_valid_pdf_url(pdf_url):
                    return pdf_url
        except Exception:
            pass
        return None
    
    def try_base_search(self, title: str) -> Optional[str]:
        """Strategy: BASE Academic Search Engine"""
        if not title or len(title) < 10:
            return None
        
        try:
            search_url = "https://www.base-search.net/Search/Results"
            params = {
                'lookfor': title[:100],
                'type': 'all',
                'ling': 'en',
                'oaboost': 1,
                'format': 'json'
            }
            
            response = self.retry_request(self.session.get, search_url, params=params, timeout=self.config.timeout)
            if response.status_code == 200:
                # Parse BASE response and look for PDF links
                soup = BeautifulSoup(response.content, 'html.parser')
                pdf_links = soup.find_all('a', href=lambda x: x and '.pdf' in x.lower())
                
                for link in pdf_links[:3]:
                    href = link.get('href')
                    if href and self.is_valid_pdf_url(href):
                        return href
        except Exception:
            pass
        return None
    
    def try_crossref_api(self, doi: str) -> Optional[str]:
        """Strategy: CrossRef API for metadata"""
        if not doi:
            return None
        
        try:
            api_url = f"https://api.crossref.org/works/{doi}"
            response = self.retry_request(self.session.get, api_url, timeout=self.config.timeout)
            
            if response.status_code == 200:
                data = response.json()
                message = data.get('message', {})
                
                # Look for open access PDF links
                links = message.get('link', [])
                for link in links:
                    if link.get('content-type') == 'application/pdf':
                        pdf_url = link.get('URL')
                        if pdf_url and self.is_valid_pdf_url(pdf_url):
                            return pdf_url
        except Exception:
            pass
        return None
    
    # Previous strategies (enhanced)
    def try_direct_pdf_url(self, url: str) -> Optional[str]:
        """Enhanced direct PDF strategy"""
        if url.endswith('.pdf'):
            return url if self.is_valid_pdf_url(url) else None
        
        base_url = url.split('#')[0].split('?')[0]
        possible_urls = [f"{base_url}.pdf", f"{url}.pdf"]
        
        for pdf_url in possible_urls:
            if self.is_valid_pdf_url(pdf_url):
                return pdf_url
        return None
    
    def try_arxiv_pattern(self, url: str) -> Optional[str]:
        """Enhanced ArXiv strategy"""
        if 'arxiv.org' not in url.lower():
            return None
        
        patterns = [
            r'arxiv\.org/abs/(\d+\.\d+)',
            r'arxiv\.org/html/(\d+\.\d+)',
            r'arxiv\.org/pdf/(\d+\.\d+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                paper_id = match.group(1)
                pdf_url = f"https://arxiv.org/pdf/{paper_id}.pdf"
                if self.is_valid_pdf_url(pdf_url):
                    return pdf_url
        return None
    
    def try_semantic_scholar(self, title: str) -> Optional[str]:
        """Enhanced Semantic Scholar strategy"""
        if not title or len(title) < 10:
            return None
        
        try:
            api_url = "https://api.semanticscholar.org/graph/v1/paper/search"
            params = {
                'query': title[:100],
                'fields': 'title,openAccessPdf,url,externalIds'
            }
            
            response = self.retry_request(self.session.get, api_url, params=params, timeout=self.config.timeout)
            if response.status_code == 200:
                data = response.json()
                papers = data.get('data', [])
                
                for paper in papers[:2]:
                    # Direct PDF from Semantic Scholar
                    open_access = paper.get('openAccessPdf')
                    if open_access and open_access.get('url'):
                        pdf_url = open_access['url']
                        if self.is_valid_pdf_url(pdf_url):
                            return pdf_url
                    
                    # Try ArXiv ID if available
                    external_ids = paper.get('externalIds', {})
                    arxiv_id = external_ids.get('ArXiv')
                    if arxiv_id:
                        arxiv_pdf = f"https://arxiv.org/pdf/{arxiv_id}.pdf"
                        if self.is_valid_pdf_url(arxiv_pdf):
                            return arxiv_pdf
        except Exception:
            pass
        return None
    
    def try_html_parsing(self, url: str) -> Optional[str]:
        """Enhanced HTML parsing strategy"""
        try:
            response = self.retry_request(self.session.get, url, timeout=self.config.timeout)
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Enhanced selectors
            selectors = [
                'a[href$=".pdf"]',
                'a[href*=".pdf"]',
                'a[download][href*="pdf"]',
                'a[title*="PDF" i]',
                'a[title*="Download" i]',
                '.pdf-download a',
                '.download-pdf a',
                'a[class*="pdf" i]',
                'a[data-url*="pdf"]',
                '.obj_galley_link'  # OJS journals
            ]
            
            for selector in selectors:
                links = soup.select(selector)
                for link in links:
                    href = link.get('href')
                    if href:
                        full_url = urljoin(url, href)
                        if self.is_valid_pdf_url(full_url):
                            return full_url
            
            # Enhanced meta tags
            meta_selectors = [
                {'name': 'citation_pdf_url'},
                {'property': 'og:url'},
                {'name': 'DC.identifier.URI'},
                {'name': 'eprints.document_url'},
                {'name': 'bepress_citation_pdf_url'}
            ]
            
            for meta_attrs in meta_selectors:
                meta_tag = soup.find('meta', meta_attrs)
                if meta_tag and meta_tag.get('content'):
                    content = meta_tag['content']
                    if '.pdf' in content.lower():
                        pdf_url = urljoin(url, content)
                        if self.is_valid_pdf_url(pdf_url):
                            return pdf_url
        except Exception:
            pass
        return None
    
    def find_pdf_url_enhanced(self, item_url: str, title: str = "", doi: str = "") -> Tuple[Optional[str], str]:
        """Enhanced PDF URL finding with all strategies"""
        item_url = self.normalize_url(item_url)
        
        strategies = [
            ("direct_pdf", lambda: self.try_direct_pdf_url(item_url)),
            ("arxiv", lambda: self.try_arxiv_pattern(item_url)),
            ("semantic_scholar", lambda: self.try_semantic_scholar(title)),
            ("crossref_api", lambda: self.try_crossref_api(doi)),
            ("sage_journals", lambda: self.try_sage_journals(item_url)),
            ("acm_digital", lambda: self.try_acm_digital_library(item_url)),
            ("base_search", lambda: self.try_base_search(title)),
            ("html_parsing", lambda: self.try_html_parsing(item_url))
        ]
        
        for strategy_name, strategy_func in strategies:
            try:
                pdf_url = strategy_func()
                if pdf_url:
                    return pdf_url, strategy_name
            except Exception as e:
                self.logger.debug(f"Strategy {strategy_name} failed: {e}")
                continue
        
        return None, "none"
    
    def download_pdf_enhanced(self, pdf_url: str, filename: str, output_dir: str = "all_pdf") -> bool:
        """Enhanced PDF download with validation"""
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, filename)
        
        if os.path.exists(filepath):
            if self.validate_pdf_content(filepath):
                self.logger.info(f"Already exists (valid): {filename}")
                return True
            else:
                os.remove(filepath)  # Remove invalid file
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/pdf,*/*',
                'Accept-Language': 'en-US,en;q=0.9'
            }
            
            response = self.retry_request(
                self.session.get, 
                pdf_url, 
                stream=True, 
                timeout=self.config.timeout, 
                headers=headers
            )
            response.raise_for_status()
            
            # Content validation before download
            content_type = response.headers.get('content-type', '').lower()
            if 'html' in content_type and 'pdf' not in content_type:
                self.logger.warning(f"Received HTML instead of PDF: {filename}")
                return False
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Validate downloaded file
            if self.validate_pdf_content(filepath):
                file_size = os.path.getsize(filepath)
                self.logger.info(f"Downloaded: {filename} ({file_size // 1024} KB)")
                return True
            else:
                os.remove(filepath)
                self.logger.warning(f"Invalid PDF downloaded: {filename}")
                return False
                
        except Exception as e:
            self.logger.error(f"Download failed for {filename}: {str(e)}")
            if os.path.exists(filepath):
                os.remove(filepath)
            return False
    
    def process_item(self, item: Dict, output_dir: str) -> Dict:
        """Process single item (for parallel processing)"""
        title = item.get('title', 'Ohne Titel')[:60]
        url = item.get('url', '')
        
        result = {
            'title': title,
            'url': url,
            'success': False,
            'strategy': 'none',
            'pdf_url': None,
            'filename': None
        }
        
        if not url:
            return result
        
        try:
            # Find PDF URL
            pdf_url, strategy = self.find_pdf_url_enhanced(
                url,
                title=item.get('title', ''),
                doi=item.get('DOI', '')
            )
            
            if pdf_url:
                result['pdf_url'] = pdf_url
                result['strategy'] = strategy
                
                # Generate filename
                filename = self.sanitize_filename("", title)
                result['filename'] = filename
                
                # Download PDF
                if self.download_pdf_enhanced(pdf_url, filename, output_dir):
                    result['success'] = True
                    
                    # Update statistics thread-safely
                    with self.stats_lock:
                        self.stats['pdfs_downloaded'] += 1
                        if strategy not in self.stats['strategy_success']:
                            self.stats['strategy_success'][strategy] = 0
                        self.stats['strategy_success'][strategy] += 1
                else:
                    with self.stats_lock:
                        self.stats['pdfs_failed'] += 1
                        
                with self.stats_lock:
                    self.stats['pdfs_found'] += 1
            else:
                with self.stats_lock:
                    self.stats['failed_urls'].append({'title': title, 'url': url})
                    
        except Exception as e:
            self.logger.error(f"Error processing {title}: {e}")
            
        # Rate limiting
        time.sleep(self.config.delay_between_requests)
        return result
    
    def sanitize_filename(self, filename: str, title: str = "") -> str:
        """Enhanced filename sanitization"""
        if not filename:
            filename = title[:50] if title else "document"
        
        # Remove problematic characters
        filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
        filename = re.sub(r'_+', '_', filename)
        filename = filename.strip('_. ')
        
        # Ensure .pdf extension
        if not filename.lower().endswith('.pdf'):
            filename += '.pdf'
        
        # Length limit
        if len(filename) > 200:
            name, ext = os.path.splitext(filename)
            filename = name[:195] + ext
        
        return filename
    
    def process_zotero_library(self, json_file: str = "zotero_vereinfacht.json", output_dir: str = "all_pdf"):
        """Enhanced main processing with parallel downloads"""
        self.logger.info("Starting enhanced PDF downloader")
        
        # Load data
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                items = json.load(f)
        except FileNotFoundError:
            self.logger.error(f"File {json_file} not found!")
            return
        except Exception as e:
            self.logger.error(f"Error loading file: {e}")
            return
        
        # Filter items with URLs
        items_with_urls = [item for item in items if item.get('url')]
        
        self.stats['total_items'] = len(items)
        self.stats['items_with_urls'] = len(items_with_urls)
        
        self.logger.info(f"Processing {len(items_with_urls)} items with URLs")
        self.logger.info(f"Output directory: {output_dir}")
        
        # Process items in parallel
        results = []
        with ThreadPoolExecutor(max_workers=self.config.max_workers) as executor:
            future_to_item = {
                executor.submit(self.process_item, item, output_dir): item 
                for item in items_with_urls
            }
            
            for i, future in enumerate(as_completed(future_to_item), 1):
                try:
                    result = future.result()
                    results.append(result)
                    
                    # Use ASCII-compatible status symbols for Windows
                    status = "[OK]" if result['success'] else "[FAIL]"
                    self.logger.info(f"[{i}/{len(items_with_urls)}] {status} {result['title']}")
                    
                    if result['success']:
                        self.logger.info(f"    Strategy: {result['strategy']}")
                        
                except Exception as e:
                    self.logger.error(f"Future failed: {e}")
        
        # Print statistics
        self.print_enhanced_statistics()
        
        # Save failed URLs for manual processing
        self.save_failed_urls(output_dir)
        
        return results
    
    def save_failed_urls(self, output_dir: str):
        """Save failed URLs for manual processing"""
        if self.stats['failed_urls']:
            failed_file = os.path.join(output_dir, "failed_urls.json")
            with open(failed_file, 'w', encoding='utf-8') as f:
                json.dump(self.stats['failed_urls'], f, indent=2, ensure_ascii=False)
            self.logger.info(f"Saved {len(self.stats['failed_urls'])} failed URLs to {failed_file}")
    
    def print_enhanced_statistics(self):
        """Print enhanced statistics"""
        print("\n" + "=" * 60)
        print("ENHANCED DOWNLOAD STATISTICS")
        print("=" * 60)
        print(f"Total entries: {self.stats['total_items']}")
        print(f"Entries with URLs: {self.stats['items_with_urls']}")
        print(f"PDFs found: {self.stats['pdfs_found']}")
        print(f"PDFs downloaded: {self.stats['pdfs_downloaded']}")
        print(f"Download errors: {self.stats['pdfs_failed']}")
        print(f"Failed URLs: {len(self.stats['failed_urls'])}")
        
        if self.stats['strategy_success']:
            print("\nSuccessful strategies:")
            total_success = sum(self.stats['strategy_success'].values())
            for strategy, count in sorted(self.stats['strategy_success'].items(), key=lambda x: x[1], reverse=True):
                percentage = (count / total_success) * 100
                print(f"  {strategy}: {count} ({percentage:.1f}%)")
        
        if self.stats['items_with_urls'] > 0:
            success_rate = (self.stats['pdfs_downloaded'] / self.stats['items_with_urls']) * 100
            print(f"\nSuccess rate: {success_rate:.1f}%")


# Compact Testing Suite
class TestPDFDownloader(unittest.TestCase):
    def setUp(self):
        self.config = Config(max_workers=1, enable_logging=False)
        self.downloader = EnhancedPDFDownloader(self.config)
    
    def test_url_normalization(self):
        """Test URL normalization"""
        test_cases = [
            ("arxiv.org/html/2312.10833", "https://arxiv.org/abs/2312.10833"),
            ("www.example.com", "https://www.example.com"),
            ("https://example.com", "https://example.com"),
        ]
        for input_url, expected in test_cases:
            with self.subTest(input_url=input_url):
                result = self.downloader.normalize_url(input_url)
                self.assertEqual(result, expected)
    
    def test_filename_sanitization(self):
        """Test filename sanitization"""
        test_cases = [
            ("Test: Paper?", "Test_ Paper_.pdf"),
            ("Very Long Title " * 20, True),  # Should be truncated
            ("", "document.pdf"),
        ]
        for input_name, expected in test_cases:
            with self.subTest(input_name=input_name):
                result = self.downloader.sanitize_filename("", input_name)
                if isinstance(expected, bool):
                    self.assertTrue(len(result) <= 200)
                else:
                    self.assertEqual(result, expected)
    
    def test_arxiv_pattern(self):
        """Test ArXiv URL pattern matching"""
        test_urls = [
            "https://arxiv.org/abs/2312.10833",
            "https://arxiv.org/html/2312.10833v4",
            "https://example.com/not-arxiv"
        ]
        # Mock is_valid_pdf_url to avoid network calls
        self.downloader.is_valid_pdf_url = lambda x: "arxiv.org/pdf" in x
        
        for url in test_urls[:2]:  # First two should work
            with self.subTest(url=url):
                result = self.downloader.try_arxiv_pattern(url)
                self.assertIsNotNone(result)
                self.assertIn("arxiv.org/pdf", result)
        
        # Third should not work
        result = self.downloader.try_arxiv_pattern(test_urls[2])
        self.assertIsNone(result)
    
    def test_pdf_validation(self):
        """Test PDF content validation"""
        # Create test files
        os.makedirs("test_files", exist_ok=True)
        
        # Valid PDF (mock)
        with open("test_files/valid.pdf", "wb") as f:
            f.write(b"%PDF-1.4\n" + b"x" * 2000)  # Mock PDF with header
        
        # Invalid file
        with open("test_files/invalid.txt", "w") as f:
            f.write("Not a PDF")
        
        # Test validation
        self.assertTrue(self.downloader.validate_pdf_content("test_files/valid.pdf"))
        self.assertFalse(self.downloader.validate_pdf_content("test_files/invalid.txt"))
        
        # Cleanup
        os.remove("test_files/valid.pdf")
        os.remove("test_files/invalid.txt")
        os.rmdir("test_files")


def run_tests():
    """Run the test suite"""
    print("Running PDF Downloader Tests...")
    unittest.main(argv=[''], exit=False, verbosity=2)


def main():
    """Main function"""
    config = Config(
        max_workers=3,
        timeout=15,
        retry_attempts=2,
        delay_between_requests=0.5,
        enable_logging=True
    )
    
    downloader = EnhancedPDFDownloader(config)
    downloader.process_zotero_library()


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        run_tests()
    else:
        main()