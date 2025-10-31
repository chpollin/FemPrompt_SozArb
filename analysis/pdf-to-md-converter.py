"""
Simple PDF to Markdown Converter for Research Papers
Converts all PDFs in 'analysis/pdfs' to Markdown files in 'analysis/markdown_papers'
"""

import os
import json
import argparse
from pathlib import Path
from datetime import datetime
import time

from utils import sanitize_filename, get_file_hash, load_json_metadata, save_json_metadata

try:
    from docling.document_converter import DocumentConverter
except ImportError:
    print("ERROR: docling not installed. Install with: pip install docling")
    exit(1)


def should_convert(pdf_path, metadata):
    """Check if PDF should be converted (new or changed)"""
    pdf_name = pdf_path.name
    current_hash = get_file_hash(pdf_path)
    
    # Check if already converted and unchanged
    if pdf_name in metadata:
        stored_hash = metadata[pdf_name].get('file_hash', '')
        if stored_hash == current_hash:
            return False  # Already converted and unchanged
    
    return True


def convert_pdf_to_markdown(pdf_path, converter):
    """Convert a single PDF to Markdown using Docling"""
    try:
        print(f"Converting: {pdf_path.name}")
        
        # Convert using Docling
        result = converter.convert(str(pdf_path))
        doc = result.document
        
        # Export to markdown
        markdown_content = doc.export_to_markdown()
        
        # Add metadata header to markdown
        header = f"""---
source_file: {pdf_path.name}
conversion_date: {datetime.now().isoformat()}
---

"""
        
        return header + markdown_content
        
    except Exception as e:
        print(f"❌ Failed to convert {pdf_path.name}: {str(e)}")
        return None


def main(pdf_dir: str = "analysis/pdfs", output_dir: str = "analysis/markdown_papers"):
    """Main conversion function"""
    # Setup directories
    pdf_dir = Path(pdf_dir)
    output_dir = Path(output_dir)
    
    # Create output directory
    output_dir.mkdir(exist_ok=True)
    
    # Check if PDF directory exists
    if not pdf_dir.exists():
        print(f"❌ PDF directory not found: {pdf_dir}")
        print("Make sure you have an 'analysis/pdfs' folder with PDF files")
        return
    
    # Find all PDF files
    pdf_files = list(pdf_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ No PDF files found in {pdf_dir}")
        return
    
    print(f"📁 Found {len(pdf_files)} PDF files")
    print(f"📂 Output directory: {output_dir}")
    
    # Initialize Docling converter
    print("🚀 Initializing Docling converter...")
    converter = DocumentConverter()

    # Load existing metadata
    metadata_file = Path("conversion_metadata.json")
    metadata = load_json_metadata(metadata_file)
    
    # Statistics
    stats = {
        'total': len(pdf_files),
        'converted': 0,
        'skipped': 0,
        'failed': 0
    }
    
    # Process each PDF
    for i, pdf_path in enumerate(pdf_files, 1):
        print(f"\n📄 [{i}/{len(pdf_files)}] Processing: {pdf_path.name}")
        
        # Check if conversion needed
        if not should_convert(pdf_path, metadata):
            print(f"⏭️  Skipping (already converted): {pdf_path.name}")
            stats['skipped'] += 1
            continue
        
        # Convert PDF to Markdown
        markdown_content = convert_pdf_to_markdown(pdf_path, converter)

        if markdown_content:
            # Save markdown file
            output_filename = sanitize_filename(pdf_path.name) + ".md"
            output_path = output_dir / output_filename
            
            try:
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(markdown_content)
                
                # Update metadata
                metadata[pdf_path.name] = {
                    'file_hash': get_file_hash(pdf_path),
                    'conversion_date': datetime.now().isoformat(),
                    'output_file': output_filename,
                    'file_size': pdf_path.stat().st_size,
                    'status': 'success'
                }
                
                stats['converted'] += 1
                print(f"✅ Converted: {pdf_path.name} → {output_filename}")
                
            except Exception as e:
                print(f"❌ Failed to save: {e}")
                stats['failed'] += 1
        else:
            # Mark as failed in metadata
            metadata[pdf_path.name] = {
                'file_hash': get_file_hash(pdf_path),
                'conversion_date': datetime.now().isoformat(),
                'status': 'failed'
            }
            stats['failed'] += 1
        
        # Small delay between conversions
        time.sleep(0.2)

    # Save metadata
    save_json_metadata(metadata_file, metadata)
    
    # Print final statistics
    print("\n" + "=" * 50)
    print("🎉 CONVERSION COMPLETE")
    print("=" * 50)
    print(f"📊 Total PDFs: {stats['total']}")
    print(f"✅ Successfully converted: {stats['converted']}")
    print(f"⏭️  Already converted (skipped): {stats['skipped']}")
    print(f"❌ Failed: {stats['failed']}")
    
    if stats['total'] > 0:
        success_rate = ((stats['converted'] + stats['skipped']) / stats['total']) * 100
        print(f"📈 Success rate: {success_rate:.1f}%")
    
    print(f"\n📂 Markdown files saved in: {output_dir}")
    print(f"📋 Metadata saved in: conversion_metadata.json")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convert PDFs to Markdown using Docling')
    parser.add_argument('--pdf-dir', default='analysis/pdfs',
                       help='Directory containing PDFs (default: analysis/pdfs)')
    parser.add_argument('--output-dir', default='analysis/markdown_papers',
                       help='Output directory for Markdown files (default: analysis/markdown_papers)')
    args = parser.parse_args()

    print("🔄 PDF to Markdown Converter")
    print(f"Converting PDFs from '{args.pdf_dir}' to '{args.output_dir}'")
    print("-" * 60)
    main(args.pdf_dir, args.output_dir)