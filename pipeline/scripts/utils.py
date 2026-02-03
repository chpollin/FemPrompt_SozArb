"""
Shared utilities for FemPrompt pipeline scripts
Provides common functions for path handling, filename sanitization, and metadata loading
"""

import os
import re
import sys
import json
import hashlib
from pathlib import Path
from typing import Dict, Any, Optional


def setup_windows_encoding():
    """
    Configure Windows console for UTF-8 output.
    Call this at the start of any script that may output unicode characters.
    Safe to call on non-Windows platforms (no-op).
    """
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')


def load_env_file(env_path: Optional[Path] = None) -> Dict[str, str]:
    """
    Load environment variables from .env file.
    Falls back to python-dotenv if available, otherwise manual parsing.

    Args:
        env_path: Path to .env file. If None, searches for .env in project root.

    Returns:
        Dictionary of environment variables loaded
    """
    if env_path is None:
        env_path = get_project_root().parent / '.env'

    loaded = {}

    # Try python-dotenv first (preferred)
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path)
        # Return empty dict since dotenv loads into os.environ directly
        return loaded
    except ImportError:
        pass

    # Fallback: manual parsing
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    os.environ[key] = value
                    loaded[key] = value

    return loaded


def get_env_var(name: str, required: bool = True) -> Optional[str]:
    """
    Get environment variable with optional requirement check.

    Args:
        name: Environment variable name
        required: If True, raises error when variable is missing

    Returns:
        Variable value or None if not required and missing

    Raises:
        SystemExit: If required variable is missing
    """
    value = os.environ.get(name)
    if required and not value:
        print(f"Error: {name} environment variable is required but not set.")
        print("Set it in .env file or as system environment variable.")
        sys.exit(1)
    return value


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


def ensure_pipeline_dirs() -> Dict[str, Path]:
    """
    Ensure all required pipeline directories exist

    Returns:
        Dictionary of directory paths
    """
    root = get_project_root()

    dirs = {
        'pdfs': root / 'pdfs',
        'markdown': root / 'markdown',
        'summaries': root / 'summaries',
        'vault': root / 'vault'
    }

    for dir_path in dirs.values():
        dir_path.mkdir(parents=True, exist_ok=True)

    return dirs
