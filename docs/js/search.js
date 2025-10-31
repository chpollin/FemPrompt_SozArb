/**
 * FemPrompt Knowledge Vault - Search Functionality
 * Pure vanilla JavaScript implementation
 */

let searchIndex = null;
let searchTimeout = null;

// Load search index on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSearchIndex();
  setupEventListeners();
});

async function loadSearchIndex() {
  try {
    const response = await fetch('data/search-index.json');
    searchIndex = await response.json();
    console.log('Search index loaded:', searchIndex);
  } catch (error) {
    console.error('Failed to load search index:', error);
    document.getElementById('search-stats').innerHTML =
      '<span style="color: var(--color-error)">Failed to load search index</span>';
  }
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  const filterPapers = document.getElementById('filter-papers');
  const filterConcepts = document.getElementById('filter-concepts');

  // Real-time search with debouncing
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300); // 300ms debounce
  });

  // Filter changes trigger immediate re-search
  filterPapers.addEventListener('change', () => {
    performSearch(searchInput.value);
  });

  filterConcepts.addEventListener('change', () => {
    performSearch(searchInput.value);
  });
}

function performSearch(query) {
  if (!searchIndex) {
    document.getElementById('search-stats').textContent = 'Loading...';
    return;
  }

  if (!query || query.trim().length < 2) {
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-stats').textContent = 'Enter at least 2 characters to search';
    return;
  }

  const filterPapers = document.getElementById('filter-papers').checked;
  const filterConcepts = document.getElementById('filter-concepts').checked;

  const results = [];

  // Search papers
  if (filterPapers && searchIndex.papers) {
    searchIndex.papers.forEach(paper => {
      const score = calculateRelevance(query, paper, 'paper');
      if (score > 0) {
        results.push({
          type: 'paper',
          data: paper,
          score: score
        });
      }
    });
  }

  // Search concepts
  if (filterConcepts && searchIndex.concepts) {
    searchIndex.concepts.forEach(concept => {
      const score = calculateRelevance(query, concept, 'concept');
      if (score > 0) {
        results.push({
          type: 'concept',
          data: concept,
          score: score
        });
      }
    });
  }

  // Sort by relevance score
  results.sort((a, b) => b.score - a.score);

  displayResults(results, query);
}

function calculateRelevance(query, item, type) {
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 1);

  let score = 0;

  if (type === 'paper') {
    const title = (item.title || '').toLowerCase();
    const authors = (item.authors || '').toLowerCase();
    const date = (item.date || '').toLowerCase();

    // Title matches
    queryTerms.forEach(term => {
      if (title.includes(term)) {
        score += title.startsWith(term) ? 10 : 5; // Higher score for start matches
      }
      if (authors.includes(term)) {
        score += 3;
      }
      if (date.includes(term)) {
        score += 2;
      }
    });

    // Exact title match bonus
    if (title.includes(lowerQuery)) {
      score += 20;
    }

  } else if (type === 'concept') {
    const title = (item.title || '').toLowerCase();
    const category = (item.category || '').toLowerCase();

    // Title matches
    queryTerms.forEach(term => {
      if (title.includes(term)) {
        score += title.startsWith(term) ? 10 : 5;
      }
      if (category.includes(term)) {
        score += 3;
      }
    });

    // Exact title match bonus
    if (title.includes(lowerQuery)) {
      score += 20;
    }

    // Frequency bonus (more mentioned = more important)
    score += Math.min(item.frequency || 0, 10) * 0.1;
  }

  return score;
}

function displayResults(results, query) {
  const resultsContainer = document.getElementById('search-results');
  const statsContainer = document.getElementById('search-stats');

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-no-results">
        <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
        <p class="text-muted">Try different keywords or check your filters</p>
      </div>
    `;
    statsContainer.textContent = 'No results found';
    return;
  }

  statsContainer.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;

  const html = results.map(result => {
    if (result.type === 'paper') {
      return renderPaperResult(result.data, query);
    } else {
      return renderConceptResult(result.data, query);
    }
  }).join('');

  resultsContainer.innerHTML = html;
}

function renderPaperResult(paper, query) {
  const title = highlightText(paper.title || 'Untitled', query);
  const authors = highlightText(paper.authors || 'Unknown authors', query);
  const date = paper.date || 'Unknown date';

  return `
    <div class="search-result">
      <div class="search-result-type">
        <span class="badge badge-paper">Paper</span>
      </div>
      <h3 class="search-result-title">
        <a href="papers/${paper.filename}">${title}</a>
      </h3>
      <div class="search-result-meta">
        ${authors} • ${date}
      </div>
    </div>
  `;
}

function renderConceptResult(concept, query) {
  const title = highlightText(concept.title || 'Untitled', query);
  const category = concept.category || 'Unknown';
  const categoryClass = category.toLowerCase().replace(/[_\s]/g, '-');

  return `
    <div class="search-result">
      <div class="search-result-type">
        <span class="badge badge-${categoryClass}">${category.replace(/_/g, ' ')}</span>
      </div>
      <h3 class="search-result-title">
        <a href="concepts/${concept.filename}">${title}</a>
      </h3>
      <div class="search-result-meta">
        ${concept.frequency} mentions • ${concept.papers} papers
      </div>
    </div>
  `;
}

function highlightText(text, query) {
  if (!query || !text) return escapeHtml(text);

  const escapedText = escapeHtml(text);
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Try exact phrase match first
  if (lowerText.includes(lowerQuery)) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
  }

  // Highlight individual terms
  const terms = query.split(/\s+/).filter(t => t.length > 1);
  let result = escapedText;

  terms.forEach(term => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  });

  return result;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
