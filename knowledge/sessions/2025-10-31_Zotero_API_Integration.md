# Zotero API Integration - Complete Documentation

**Date:** 2025-10-31
**Status:** Operational
**Pipeline Stage:** Stage 1 - Literature Collection

## Overview

Integration of Zotero Group Library API to automatically fetch all bibliographic entries, replacing manual JSON export workflow.

## Configuration

### Zotero Group Details
- **Group ID:** 6080294
- **Group URL:** https://www.zotero.org/groups/6080294/femprompt_sozarb
- **Library Type:** group
- **Total Items:** 326 publications

### API Credentials
- **API Key:** Stored in `analysis/fetch_zotero_group.py` (hardcoded)
- **Library ID:** 6080294
- **Library Type:** group

**Security Note:** API key is read-only access to public group library.

## Implementation

### Script: `fetch_zotero_group.py`

**Location:** `analysis/fetch_zotero_group.py`

**Functionality:**
1. Connects to Zotero API using pyzotero
2. Fetches all items from group library
3. Filters out notes and attachments
4. Extracts essential metadata fields
5. Saves to `analysis/zotero_vereinfacht.json`

**Key Metadata Fields Extracted:**
- `key`: Zotero item identifier
- `version`: Item version number
- `itemType`: Publication type (journalArticle, report, etc.)
- `title`: Publication title
- `creators`: Authors list
- `date`: Publication date
- `url`: Publication URL
- `DOI`: Digital Object Identifier
- `abstractNote`: Abstract text
- `tags`: Keyword tags
- `collections`: Zotero collection membership
- `relations`: Related items

### Execution

```bash
# Fetch all items from Zotero Group
python analysis/fetch_zotero_group.py

# Output: analysis/zotero_vereinfacht.json (326 items)
```

**Processing Time:** ~5 seconds for 326 items

## Results

### Export Statistics (2025-10-31 20:00)

**Total Items:** 326

**Item Type Distribution:**
- Journal Articles: 190 (58.3%)
- Reports: 69 (21.2%)
- Conference Papers: 43 (13.2%)
- Book Sections: 10 (3.1%)
- Books: 6 (1.8%)
- Webpages: 5 (1.5%)
- Blog Posts: 1 (0.3%)
- Theses: 1 (0.3%)
- Documents: 1 (0.3%)

**Output File:**
- Path: `analysis/zotero_vereinfacht.json`
- Size: 408 KB
- Encoding: UTF-8
- Format: JSON array of simplified item objects

### Comparison with Previous Export

**Old Export (`zotero_vereinfacht.json.old`):**
- Date: 2024-08-07
- Size: 54 KB
- Items: 43 publications
- Source: Manual Zotero export

**New Export (`zotero_vereinfacht.json`):**
- Date: 2025-10-31
- Size: 408 KB
- Items: 326 publications
- Source: Zotero API (automated)

**Growth:** +283 publications (+658% increase)

## Integration with Pipeline

### Stage 1 Replacement

**Old Workflow:**
1. Manual export from Zotero Desktop
2. Save as `zotero_vereinfacht.json`
3. Commit to repository

**New Workflow:**
1. Run `python analysis/fetch_zotero_group.py`
2. Automatic API fetch
3. Automatic save to `zotero_vereinfacht.json`

**Benefit:** Fully automated, always up-to-date with Zotero Group

### Downstream Impact

All pipeline stages use `analysis/zotero_vereinfacht.json`:

1. **PDF Acquisition** (`getPDF_intelligent.py`):
   - Reads metadata for 326 publications
   - Attempts PDF download for each

2. **Vault Generation** (`generate_obsidian_vault_improved.py`):
   - Uses metadata for paper linking
   - Creates bibliographic references

3. **Summary Processing** (`summarize-documents.py`):
   - Uses title/author for filename generation

## Technical Details

### Dependencies

```python
from pyzotero import zotero  # >= 1.5.0
```

### Error Handling

**Windows Encoding Issue:**
- Problem: Unicode symbols (✓, ✗) cause UnicodeEncodeError on Windows cp1252
- Solution: Replace with ASCII alternatives ([OK], [ERROR])

**API Rate Limiting:**
- Zotero API limit: 1000 requests/hour
- Current usage: 1 request for all items (uses pagination internally)
- No rate limiting issues expected

### Data Validation

**Required Fields Presence:**
- `itemType`: 100% (326/326)
- `title`: 99.7% (325/326) - 1 item "Untitled"
- `creators`: 98.2% (320/326)
- `date`: 95.1% (310/326)
- `DOI`: 62.3% (203/326)
- `url`: 78.5% (256/326)

**Missing Data Strategy:**
- Use fallback values for missing fields
- Log warnings for items without essential metadata
- Continue processing with available data

## Maintenance

### Updating Bibliography

```bash
# Re-fetch latest from Zotero
python analysis/fetch_zotero_group.py

# Verify item count
python -c "import json; print(len(json.load(open('analysis/zotero_vereinfacht.json'))))"
```

### API Key Rotation

**If API key needs to be rotated:**

1. Generate new key at https://www.zotero.org/settings/keys
2. Update `analysis/fetch_zotero_group.py` line 13:
   ```python
   API_KEY = "new-api-key-here"
   ```
3. Test connection:
   ```bash
   python analysis/fetch_zotero_group.py
   ```

### Monitoring

**Check for new publications:**
```bash
# Compare item counts
OLD_COUNT=$(python -c "import json; print(len(json.load(open('analysis/zotero_vereinfacht.json.old'))))")
NEW_COUNT=$(python -c "import json; print(len(json.load(open('analysis/zotero_vereinfacht.json'))))")
echo "Old: $OLD_COUNT, New: $NEW_COUNT, Diff: $((NEW_COUNT - OLD_COUNT))"
```

## Future Enhancements

### Potential Improvements

1. **Environment Variable for API Key:**
   - Store in `.env` file
   - Load via `python-dotenv`
   - Better security practice

2. **Incremental Updates:**
   - Track `version` field per item
   - Only fetch modified items
   - Faster updates for large libraries

3. **Collection Filtering:**
   - Fetch only specific Zotero collections
   - Support multiple groups
   - Configurable via YAML

4. **Attachment Metadata:**
   - Include PDF availability info
   - Track attachment URLs
   - Pre-validate PDF access

5. **Automated Scheduling:**
   - Cron job for daily updates
   - Git commit on changes
   - Notification on new publications

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Main technical documentation
- [PDF_ACQUISITION_WORKFLOW.md](../analysis/PDF_ACQUISITION_WORKFLOW.md) - PDF download specs
- [Zotero API Documentation](https://www.zotero.org/support/dev/web_api/v3/start)
- [pyzotero Documentation](https://pyzotero.readthedocs.io/)

## Change Log

### 2025-10-31: Initial Implementation
- Created `fetch_zotero_group.py`
- Replaced manual export with API automation
- Exported 326 publications from Zotero Group 6080294
- Updated `CLAUDE.md` documentation
- File size: 54KB → 408KB (+654% increase)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-31
**Author:** Claude (Automated Documentation)
