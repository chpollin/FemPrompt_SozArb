#!/usr/bin/env python3
"""
Intelligent PDF Acquisition System with Zotero Integration
Implements hierarchical acquisition strategy with automatic fallback
"""

import os
import json
import csv
import time
import logging
import hashlib
import requests
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse, quote
import re

# Optional imports for enhanced functionality
try:
    from pyzotero import zotero
    PYZOTERO_AVAILABLE = True
except ImportError:
    PYZOTERO_AVAILABLE = False

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)


class PDFAcquisitionPipeline:
    """Intelligent PDF acquisition with Zotero integration and fallback strategies"""

    def __init__(self,
                 output_dir: str = "analysis/pdfs",
                 zotero_storage: str = None,
                 api_key: str = None,
                 library_id: str = None,
                 library_type: str = "user"):
        """
        Initialize PDF acquisition pipeline

        Args:
            output_dir: Directory to save PDFs
            zotero_storage: Path to Zotero storage directory
            api_key: Zotero API key (optional for public libraries)
            library_id: Zotero library ID
            library_type: 'user' or 'group'
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Zotero configuration
        self.zotero_storage = Path(zotero_storage) if zotero_storage else self._find_zotero_storage()
        self.zotero_client = None

        if PYZOTERO_AVAILABLE and library_id:
            try:
                self.zotero_client = zotero.Zotero(library_id, library_type, api_key)
                logger.info(f"✓ Zotero API initialized (Library: {library_id})")
            except Exception as e:
                logger.warning(f"⚠ Zotero API initialization failed: {e}")

        # Statistics tracking
        self.stats = {
            'total': 0,
            'zotero_attachment': 0,
            'metadata_url': 0,
            'unpaywall': 0,
            'arxiv': 0,
            'failed': 0,
            'skipped': 0
        }

        # Failed attempts cache
        self.failed_cache = set()

        # Session for HTTP requests
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'FemPrompt-Research/1.0 (mailto:research@example.com)'
        })

    def _find_zotero_storage(self) -> Optional[Path]:
        """Automatically locate Zotero storage directory"""
        possible_paths = [
            Path.home() / "Zotero" / "storage",
            Path.home() / ".zotero" / "storage",
            Path("C:/Users") / os.environ.get('USERNAME', '') / "Zotero" / "storage",
            Path("/Users") / os.environ.get('USER', '') / "Zotero" / "storage"
        ]

        for path in possible_paths:
            if path.exists():
                logger.info(f"✓ Found Zotero storage: {path}")
                return path

        logger.warning("⚠ Zotero storage directory not found")
        return None

    def process_bibliography(self, json_file: str) -> Dict:
        """
        Process Zotero bibliography JSON file

        Args:
            json_file: Path to zotero_vereinfacht.json

        Returns:
            Dictionary with acquisition results
        """
        logger.info("="*60)
        logger.info("🚀 Starting Intelligent PDF Acquisition")
        logger.info("="*60)

        # Load bibliography
        with open(json_file, 'r', encoding='utf-8') as f:
            bibliography = json.load(f)

        # Handle both formats: direct list or dictionary with 'items' key
        if isinstance(bibliography, list):
            items = bibliography
        elif isinstance(bibliography, dict):
            items = bibliography.get('items', [bibliography])
        else:
            logger.error(f"Unexpected bibliography format: {type(bibliography)}")
            items = []

        self.stats['total'] = len(items)
        logger.info(f"📚 Found {len(items)} papers to process")

        # Process each paper
        results = []
        missing_papers = []

        for i, item in enumerate(items, 1):
            logger.info(f"\n[{i}/{len(items)}] Processing: {item.get('title', 'Unknown')[:60]}...")

            result = self.acquire_pdf(item)
            results.append(result)

            if not result['success']:
                missing_papers.append({
                    'title': item.get('title', ''),
                    'authors': self._format_authors(item.get('creators', [])),
                    'year': item.get('date', ''),
                    'doi': item.get('DOI', ''),
                    'url': item.get('url', ''),
                    'reason': result.get('error', 'Unknown')
                })

            # Rate limiting
            time.sleep(0.5)

        # Save results
        self._save_results(results, missing_papers)

        # Print summary
        self._print_summary()

        return {
            'stats': self.stats,
            'results': results,
            'missing': missing_papers
        }

    def acquire_pdf(self, item: Dict) -> Dict:
        """
        Acquire PDF using hierarchical strategy

        Args:
            item: Zotero item metadata

        Returns:
            Acquisition result dictionary
        """
        result = {
            'title': item.get('title', 'Unknown'),
            'key': item.get('key', ''),
            'success': False,
            'method': None,
            'path': None,
            'error': None
        }

        # Generate safe filename
        filename = self._generate_filename(item)
        output_path = self.output_dir / filename

        # Check if already exists
        if output_path.exists():
            logger.info(f"✓ PDF already exists: {filename}")
            self.stats['skipped'] += 1
            result['success'] = True
            result['method'] = 'already_exists'
            result['path'] = str(output_path)
            return result

        # Priority 1: Zotero attachment
        if self._try_zotero_attachment(item, output_path):
            logger.info(f"✓ Retrieved from Zotero attachment: {filename}")
            self.stats['zotero_attachment'] += 1
            result['success'] = True
            result['method'] = 'zotero_attachment'
            result['path'] = str(output_path)
            return result

        # Priority 2: Metadata URL/DOI
        if self._try_metadata_url(item, output_path):
            logger.info(f"✓ Downloaded from metadata URL: {filename}")
            self.stats['metadata_url'] += 1
            result['success'] = True
            result['method'] = 'metadata_url'
            result['path'] = str(output_path)
            return result

        # Priority 3: Unpaywall (open access)
        if self._try_unpaywall(item, output_path):
            logger.info(f"✓ Downloaded from Unpaywall: {filename}")
            self.stats['unpaywall'] += 1
            result['success'] = True
            result['method'] = 'unpaywall'
            result['path'] = str(output_path)
            return result

        # Priority 4: ArXiv
        if self._try_arxiv(item, output_path):
            logger.info(f"✓ Downloaded from ArXiv: {filename}")
            self.stats['arxiv'] += 1
            result['success'] = True
            result['method'] = 'arxiv'
            result['path'] = str(output_path)
            return result

        # Failed to acquire
        logger.warning(f"✗ Failed to acquire PDF: {filename}")
        self.stats['failed'] += 1
        result['error'] = 'All acquisition methods failed'
        return result

    def _try_zotero_attachment(self, item: Dict, output_path: Path) -> bool:
        """Try to get PDF from Zotero attachment"""

        # Method 1: Check attachments in metadata
        attachments = item.get('attachments', [])
        for attachment in attachments:
            if attachment.get('mimeType') == 'application/pdf':
                # Try storage path
                if 'path' in attachment:
                    storage_path = attachment['path']
                    if storage_path.startswith('storage:'):
                        filename = storage_path.replace('storage:', '')
                        if self.zotero_storage:
                            # Find in storage directory
                            for storage_dir in self.zotero_storage.iterdir():
                                pdf_path = storage_dir / filename
                                if pdf_path.exists():
                                    return self._copy_pdf(pdf_path, output_path)

                # Try URL if present
                if 'url' in attachment:
                    return self._download_pdf(attachment['url'], output_path)

        # Method 2: Use Zotero API if available
        if self.zotero_client and item.get('key'):
            try:
                children = self.zotero_client.children(item['key'])
                for child in children:
                    if child['data'].get('contentType') == 'application/pdf':
                        # Download attachment
                        file_data = self.zotero_client.file(child['key'])
                        if file_data:
                            output_path.write_bytes(file_data)
                            return True
            except Exception as e:
                logger.debug(f"Zotero API error: {e}")

        return False

    def _try_metadata_url(self, item: Dict, output_path: Path) -> bool:
        """Try to download from URL or DOI in metadata"""

        # Try direct URL
        url = item.get('url')
        if url and self._download_pdf(url, output_path):
            return True

        # Try DOI
        doi = item.get('DOI')
        if doi:
            doi_urls = [
                f"https://doi.org/{doi}",
                f"https://dx.doi.org/{doi}"
            ]
            for doi_url in doi_urls:
                if self._download_pdf(doi_url, output_path, follow_redirects=True):
                    return True

        return False

    def _try_unpaywall(self, item: Dict, output_path: Path) -> bool:
        """Try to get open access version via Unpaywall"""
        doi = item.get('DOI')
        if not doi:
            return False

        # Unpaywall API
        email = "research@example.com"  # Should be configured
        url = f"https://api.unpaywall.org/v2/{doi}?email={email}"

        try:
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('is_oa'):
                    pdf_url = data.get('best_oa_location', {}).get('url_for_pdf')
                    if pdf_url and self._download_pdf(pdf_url, output_path):
                        return True
        except Exception as e:
            logger.debug(f"Unpaywall error: {e}")

        return False

    def _try_arxiv(self, item: Dict, output_path: Path) -> bool:
        """Try to download from ArXiv"""

        # Check if URL contains arxiv
        url = item.get('url', '')
        arxiv_match = re.search(r'arxiv\.org/abs/(\d+\.\d+)', url)
        if not arxiv_match:
            # Try to find in title or other fields
            text = f"{item.get('title', '')} {item.get('abstractNote', '')}"
            arxiv_match = re.search(r'arXiv:(\d+\.\d+)', text)

        if arxiv_match:
            arxiv_id = arxiv_match.group(1)
            pdf_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf"
            return self._download_pdf(pdf_url, output_path)

        return False

    def _download_pdf(self, url: str, output_path: Path, follow_redirects: bool = False) -> bool:
        """Download PDF from URL"""

        # Skip if already tried and failed
        if url in self.failed_cache:
            return False

        try:
            response = self.session.get(
                url,
                timeout=30,
                allow_redirects=follow_redirects,
                stream=True
            )

            # Check if it's a PDF
            content_type = response.headers.get('content-type', '')
            if response.status_code == 200:
                if 'pdf' in content_type.lower() or url.endswith('.pdf'):
                    # Download in chunks
                    with open(output_path, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            f.write(chunk)

                    # Validate PDF
                    if self._validate_pdf(output_path):
                        return True
                    else:
                        output_path.unlink()

        except Exception as e:
            logger.debug(f"Download error for {url}: {e}")
            self.failed_cache.add(url)

        return False

    def _copy_pdf(self, source: Path, dest: Path) -> bool:
        """Copy PDF from local source"""
        try:
            import shutil
            shutil.copy2(source, dest)
            return self._validate_pdf(dest)
        except Exception as e:
            logger.debug(f"Copy error: {e}")
            return False

    def _validate_pdf(self, pdf_path: Path) -> bool:
        """Validate PDF file"""

        # Check size
        if pdf_path.stat().st_size < 1024:  # Less than 1KB
            return False

        # Check PDF header
        with open(pdf_path, 'rb') as f:
            header = f.read(5)
            if not header.startswith(b'%PDF-'):
                return False

        # Advanced validation with PyPDF2 if available
        if PYPDF2_AVAILABLE:
            try:
                with open(pdf_path, 'rb') as f:
                    PyPDF2.PdfReader(f)
                return True
            except:
                return False

        return True

    def _generate_filename(self, item: Dict) -> str:
        """Generate safe filename from metadata"""

        # Get first author's last name
        creators = item.get('creators', [])
        if creators:
            first_author = creators[0]
            if 'lastName' in first_author:
                author = first_author['lastName']
            elif 'name' in first_author:
                author = first_author['name'].split()[-1]
            else:
                author = 'Unknown'
        else:
            author = 'Unknown'

        # Get year
        date = item.get('date', '')
        year_match = re.search(r'(\d{4})', date)
        year = year_match.group(1) if year_match else 'XXXX'

        # Create filename
        filename = f"{author}_{year}"

        # Add title fragment if multiple papers same author/year
        title = item.get('title', '')
        if title:
            # Take first meaningful word from title
            title_words = re.findall(r'\b[A-Za-z]{4,}\b', title)
            if title_words:
                filename += f"_{title_words[0]}"

        # Clean filename
        filename = re.sub(r'[^\w\-_]', '_', filename)
        filename = filename[:50]  # Limit length

        return f"{filename}.pdf"

    def _format_authors(self, creators: List[Dict]) -> str:
        """Format author names"""
        if not creators:
            return ''

        names = []
        for creator in creators[:3]:  # First 3 authors
            if 'lastName' in creator:
                names.append(creator['lastName'])
            elif 'name' in creator:
                names.append(creator['name'])

        if len(creators) > 3:
            names.append('et al.')

        return ', '.join(names)

    def _save_results(self, results: List[Dict], missing_papers: List[Dict]):
        """Save acquisition results"""

        # Save detailed log
        log_file = self.output_dir.parent / 'acquisition_log.json'
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'statistics': self.stats,
                'results': results
            }, f, indent=2, ensure_ascii=False)

        # Save missing papers CSV
        if missing_papers:
            csv_file = self.output_dir.parent / 'missing_pdfs.csv'
            with open(csv_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['title', 'authors', 'year', 'doi', 'url', 'reason'])
                writer.writeheader()
                writer.writerows(missing_papers)
            logger.info(f"📋 Missing papers report: {csv_file}")

    def _print_summary(self):
        """Print acquisition summary"""
        logger.info("="*60)
        logger.info("📊 ACQUISITION SUMMARY")
        logger.info("="*60)
        logger.info(f"Total papers:          {self.stats['total']}")
        logger.info(f"✓ Zotero attachments:  {self.stats['zotero_attachment']}")
        logger.info(f"✓ Metadata URLs:       {self.stats['metadata_url']}")
        logger.info(f"✓ Unpaywall:           {self.stats['unpaywall']}")
        logger.info(f"✓ ArXiv:               {self.stats['arxiv']}")
        logger.info(f"⊙ Already existed:     {self.stats['skipped']}")
        logger.info(f"✗ Failed:              {self.stats['failed']}")
        logger.info("-"*60)

        success = self.stats['total'] - self.stats['failed']
        success_rate = (success / self.stats['total'] * 100) if self.stats['total'] > 0 else 0
        logger.info(f"Success rate:          {success_rate:.1f}%")
        logger.info("="*60)


def main():
    """Main execution"""
    import argparse

    parser = argparse.ArgumentParser(description='Intelligent PDF Acquisition with Zotero Integration')
    parser.add_argument('--input', '-i', default='analysis/zotero_vereinfacht.json',
                       help='Input JSON file from Zotero')
    parser.add_argument('--output', '-o', default='analysis/pdfs',
                       help='Output directory for PDFs')
    parser.add_argument('--zotero-storage', help='Path to Zotero storage directory')
    parser.add_argument('--api-key', help='Zotero API key')
    parser.add_argument('--library-id', help='Zotero library ID')
    parser.add_argument('--library-type', default='user', choices=['user', 'group'],
                       help='Zotero library type')

    args = parser.parse_args()

    # Check input file
    if not Path(args.input).exists():
        logger.error(f"❌ Input file not found: {args.input}")
        return

    # Initialize pipeline
    pipeline = PDFAcquisitionPipeline(
        output_dir=args.output,
        zotero_storage=args.zotero_storage,
        api_key=args.api_key,
        library_id=args.library_id,
        library_type=args.library_type
    )

    # Process bibliography
    results = pipeline.process_bibliography(args.input)

    # Exit code based on success
    if results['stats']['failed'] == 0:
        exit(0)
    elif results['stats']['failed'] < results['stats']['total']:
        exit(1)  # Partial success
    else:
        exit(2)  # Complete failure


if __name__ == "__main__":
    main()