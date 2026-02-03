"""
Shared utilities for Literature Review pipeline scripts
Provides common functions for path handling, filename sanitization, and metadata loading
"""

import re
import json
import hashlib
from pathlib import Path
from typing import Dict, Any, Optional


def sanitize_filename(filename: str, max_length: int = 100) -> str:
    """
    Create safe filename by removing problematic characters

    Args:
        filename: Original filename
        max_length: Maximum length of sanitized filename

    Returns:
        Sanitized filename safe for filesystem use
    """
    # Remove file extension and get stem
    name = Path(filename).stem

    # Replace problematic characters with underscores
    safe_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
    sanitized = ''.join(c if c in safe_chars else '_' for c in name)

    # Limit length and ensure it's not empty
    sanitized = sanitized[:max_length] if sanitized else "document"

    return sanitized


def get_file_hash(filepath: Path) -> str:
    """
    Generate MD5 hash of file to detect changes

    Args:
        filepath: Path to file

    Returns:
        MD5 hash as hex string, empty string on error
    """
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception:
        return ""


def load_json_metadata(filepath: Path) -> Dict[str, Any]:
    """
    Load JSON metadata file with error handling

    Args:
        filepath: Path to JSON file

    Returns:
        Parsed JSON as dict, empty dict on error
    """
    if not filepath.exists():
        return {}

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


def save_json_metadata(filepath: Path, data: Dict[str, Any]) -> bool:
    """
    Save metadata to JSON file

    Args:
        filepath: Path to save JSON
        data: Dictionary to save

    Returns:
        True if successful, False otherwise
    """
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False


def simplify_title(title: str, max_length: int = 50) -> str:
    """
    Simplify title for matching (remove punctuation, normalize whitespace)

    Args:
        title: Original title
        max_length: Maximum length

    Returns:
        Simplified title for fuzzy matching
    """
    simple = re.sub(r'[^\w\s]', '', title)
    simple = re.sub(r'\s+', '_', simple)
    return simple[:max_length]


def get_project_root() -> Path:
    """
    Get project root directory (parent of analysis/)

    Returns:
        Path to project root
    """
    return Path(__file__).parent.parent


def ensure_analysis_dirs() -> Dict[str, Path]:
    """
    Ensure all required analysis directories exist

    Returns:
        Dictionary of directory paths
    """
    root = get_project_root()

    dirs = {
        'pdfs': root / 'analysis' / 'pdfs',
        'markdown_papers': root / 'analysis' / 'markdown_papers',
        'summaries_final': root / 'analysis' / 'summaries_final'
    }

    for dir_path in dirs.values():
        dir_path.mkdir(parents=True, exist_ok=True)

    return dirs
