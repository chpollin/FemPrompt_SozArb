"""
Shared utilities for FemPrompt pipeline scripts

Provides common functions for:
- Path handling and filename sanitization
- Metadata loading/saving
- Logging setup
- API client creation
- JSON response parsing
- Configuration management

Usage:
    from utils import setup_windows_encoding, setup_logging, create_anthropic_client
"""

import os
import re
import sys
import json
import hashlib
import logging
import time
from pathlib import Path
from typing import Dict, Any, Optional, Tuple, Callable


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
    Get project root directory (parent of pipeline/)

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


# =============================================================================
# LOGGING
# =============================================================================

def setup_logging(
    name: str = __name__,
    level: int = logging.INFO,
    format_str: str = '%(asctime)s - %(levelname)s - %(message)s',
    datefmt: str = '%H:%M:%S'
) -> logging.Logger:
    """
    Setup standardized logging configuration.

    Args:
        name: Logger name (typically __name__)
        level: Logging level (default: INFO)
        format_str: Log format string
        datefmt: Date format string

    Returns:
        Configured logger instance
    """
    logging.basicConfig(
        level=level,
        format=format_str,
        datefmt=datefmt
    )
    return logging.getLogger(name)


# =============================================================================
# API CLIENT
# =============================================================================

def create_anthropic_client(api_key: Optional[str] = None):
    """
    Create Anthropic API client with proper error handling.

    Args:
        api_key: API key (if None, uses ANTHROPIC_API_KEY env var)

    Returns:
        Anthropic client instance

    Raises:
        SystemExit: If anthropic package not installed or API key missing
    """
    try:
        from anthropic import Anthropic
    except ImportError:
        print("Error: anthropic package not installed!")
        print("Install with: pip install anthropic")
        sys.exit(1)

    if api_key is None:
        api_key = get_env_var('ANTHROPIC_API_KEY', required=True)

    return Anthropic(api_key=api_key)


def call_llm_with_retry(
    client,
    prompt: str,
    model: str = "claude-haiku-4-5-20251001",
    max_tokens: int = 2000,
    max_retries: int = 3,
    base_delay: float = 2.0
) -> Tuple[str, Dict[str, int]]:
    """
    Call LLM API with exponential backoff retry.

    Args:
        client: Anthropic client
        prompt: User prompt
        model: Model to use
        max_tokens: Maximum tokens in response
        max_retries: Maximum retry attempts
        base_delay: Base delay in seconds (doubles each retry)

    Returns:
        Tuple of (response_text, usage_dict)

    Raises:
        Exception: If all retries fail
    """
    last_error = None

    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model=model,
                max_tokens=max_tokens,
                messages=[{"role": "user", "content": prompt}]
            )

            usage = {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens
            }

            return response.content[0].text, usage

        except Exception as e:
            last_error = e
            error_str = str(e).lower()

            # Check if it's a rate limit error
            if '429' in error_str or 'rate' in error_str:
                delay = base_delay * (2 ** attempt)
                logging.warning(f"Rate limited, waiting {delay}s (attempt {attempt + 1}/{max_retries})")
                time.sleep(delay)
            else:
                # For other errors, raise immediately
                raise

    raise last_error


# =============================================================================
# JSON PARSING
# =============================================================================

def parse_json_response(text: str) -> Optional[Dict]:
    """
    Parse JSON from LLM response, handling markdown code blocks.

    Args:
        text: Raw LLM response text

    Returns:
        Parsed JSON dict or None if parsing fails
    """
    try:
        text = text.strip()

        # Remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        # Find JSON object boundaries
        start = text.find('{')
        end = text.rfind('}') + 1

        if start >= 0 and end > start:
            json_str = text[start:end]
            return json.loads(json_str)

        return None
    except json.JSONDecodeError:
        return None


def parse_yaml_response(text: str) -> Optional[Dict]:
    """
    Parse YAML from LLM response, handling markdown code blocks.

    Args:
        text: Raw LLM response text

    Returns:
        Parsed YAML dict or None if parsing fails
    """
    try:
        import yaml
    except ImportError:
        logging.warning("PyYAML not installed, cannot parse YAML")
        return None

    try:
        text = text.strip()

        # Remove markdown code blocks if present
        if "```yaml" in text:
            yaml_match = text.split("```yaml")[1].split("```")[0]
        elif "```" in text:
            yaml_match = text.split("```")[1].split("```")[0]
        else:
            yaml_match = text

        return yaml.safe_load(yaml_match.strip())
    except Exception:
        return None


# =============================================================================
# CONFIGURATION
# =============================================================================

def load_config(config_path: Optional[Path] = None) -> Dict[str, Any]:
    """
    Load configuration from YAML file.

    Args:
        config_path: Path to config file. If None, uses config/defaults.yaml

    Returns:
        Configuration dictionary (merged with defaults)
    """
    # Get default config as base
    config = get_default_config()

    # Determine config file path
    if config_path is None:
        # Try project root first (pipeline/scripts -> pipeline -> project root)
        project_root = get_project_root().parent
        config_path = project_root / 'config' / 'defaults.yaml'

    if not config_path.exists():
        return config

    try:
        import yaml
        with open(config_path, 'r', encoding='utf-8') as f:
            file_config = yaml.safe_load(f) or {}
            # Deep merge file config into defaults
            for key, value in file_config.items():
                if key in config and isinstance(config[key], dict) and isinstance(value, dict):
                    config[key].update(value)
                else:
                    config[key] = value
            return config
    except Exception:
        return config


def get_default_config() -> Dict[str, Any]:
    """
    Get default configuration values.

    Returns:
        Default configuration dictionary
    """
    return {
        'api': {
            'model': 'claude-haiku-4-5-20251001',
            'max_tokens': 2000,
            'temperature': 0.3,
            'delay': 1.0
        },
        'paths': {
            'input': 'pipeline/markdown',
            'output': 'pipeline/knowledge/distilled',
            'pdfs': 'pipeline/pdfs'
        },
        'quality': {
            'min_confidence': 70,
            'max_artifacts': 50
        }
    }
