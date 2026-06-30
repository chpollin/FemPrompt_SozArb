#!/usr/bin/env python3
"""
Convert PDFs to JPG images for review tool.

Usage:
    python pdf_to_images.py --input pipeline/pdfs --output pipeline/pdf_images
    python pdf_to_images.py --input pipeline/pdfs --output pipeline/pdf_images --dpi 100
"""

import argparse
import sys
from pathlib import Path

# Fix Windows encoding issues
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

try:
    import fitz  # PyMuPDF
except ImportError:
    print("ERROR: PyMuPDF not installed. Run: pip install PyMuPDF")
    sys.exit(1)


def convert_pdf_to_images(pdf_path: Path, output_dir: Path, dpi: int = 150) -> int:
    """Convert a PDF to JPG images, one per page."""
    try:
        doc = fitz.open(pdf_path)
        pdf_name = pdf_path.stem

        # Create subdirectory for this PDF
        pdf_output_dir = output_dir / pdf_name
        pdf_output_dir.mkdir(parents=True, exist_ok=True)

        zoom = dpi / 72  # 72 is default PDF DPI
        matrix = fitz.Matrix(zoom, zoom)

        page_count = len(doc)
        for page_num in range(page_count):
            page = doc[page_num]
            pix = page.get_pixmap(matrix=matrix)

            output_path = pdf_output_dir / f"page_{page_num + 1:03d}.jpg"
            pix.save(str(output_path))

        doc.close()
        return page_count

    except Exception as e:
        print(f"  ERROR: {e}")
        return 0


def main():
    parser = argparse.ArgumentParser(description="Convert PDFs to JPG images")
    parser.add_argument("--input", "-i", required=True, help="Input directory with PDFs")
    parser.add_argument("--output", "-o", required=True, help="Output directory for images")
    parser.add_argument("--dpi", type=int, default=150, help="Resolution (default: 150)")
    parser.add_argument("--resume", type=int, default=0, help="Resume from PDF number (1-indexed)")

    args = parser.parse_args()

    input_dir = Path(args.input)
    output_dir = Path(args.output)

    if not input_dir.exists():
        print(f"ERROR: Input directory not found: {input_dir}")
        return 1

    output_dir.mkdir(parents=True, exist_ok=True)

    pdf_files = sorted(input_dir.glob("*.pdf"))
    if not pdf_files:
        print(f"ERROR: No PDFs found in {input_dir}")
        return 1

    print(f"Converting {len(pdf_files)} PDFs to images (DPI: {args.dpi})...")
    print(f"Output: {output_dir}")
    print()

    total_pages = 0
    skipped = 0
    for i, pdf_path in enumerate(pdf_files, 1):
        # Skip if resuming
        if args.resume > 0 and i < args.resume:
            skipped += 1
            continue

        print(f"[{i}/{len(pdf_files)}] {pdf_path.name}...", end=" ", flush=True)
        pages = convert_pdf_to_images(pdf_path, output_dir, args.dpi)
        total_pages += pages
        print(f"{pages} pages")

    if skipped > 0:
        print(f"(Skipped {skipped} already converted PDFs)")

    print()
    print(f"Done: {total_pages} total pages from {len(pdf_files)} PDFs")

    return 0


if __name__ == "__main__":
    sys.exit(main())
