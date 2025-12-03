// Phase 2: Advanced Features - Related Papers & Presets

// Find similar papers based on dimension similarity
function findSimilarPapers(paper, topN = 5) {
    const similarities = allPapers
        .filter(p => p.id !== paper.id && p.decision === 'Include')
        .map(p => ({
            paper: p,
            similarity: calculateDimensionSimilarity(paper, p)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topN);

    return similarities;
}

// Calculate cosine similarity on relevance dimensions
function calculateDimensionSimilarity(p1, p2) {
    const dims = ['rel_ai_komp', 'rel_vulnerable', 'rel_bias', 'rel_praxis', 'rel_prof'];
    const v1 = dims.map(d => p1[d] || 0);
    const v2 = dims.map(d => p2[d] || 0);

    const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
    const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

    return mag1 && mag2 ? (dot / (mag1 * mag2)) * 100 : 0;
}

// Add related papers to modal
function addRelatedPapersSection(paper) {
    const similar = findSimilarPapers(paper);

    if (similar.length === 0) return '';

    const htmlItems = similar.map(item => {
        const p = item.paper;
        const sim = Math.round(item.similarity);
        return '<div class="related-paper" onclick="showPaperDetail(allPapers.find(ap => ap.id === \'' + p.id + '\'))"><div class="related-paper-content"><strong>' + p.author_year + '</strong><div class="related-paper-title">' + p.title + '</div></div><div class="similarity-badge">' + sim + '% similar</div></div>';
    }).join('');

    return '<div class="detail-section"><h3><i class="fas fa-link"></i> Related Papers</h3><div class="related-papers-list">' + htmlItems + '</div></div>';
}

// Filter Presets
function saveFilterPreset(name) {
    const preset = {
        decision: document.getElementById('filter-decision').value,
        relevance: document.getElementById('filter-relevance').value,
        summary: document.getElementById('filter-summary').value,
        year: document.getElementById('filter-year').value,
        search: document.getElementById('search-box').value
    };

    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}');
    presets[name] = preset;
    localStorage.setItem('filterPresets', JSON.stringify(presets));

    console.log('Saved preset: ' + name);
}

function loadFilterPreset(name) {
    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}');
    const preset = presets[name];

    if (preset) {
        document.getElementById('filter-decision').value = preset.decision;
        document.getElementById('filter-relevance').value = preset.relevance;
        document.getElementById('filter-summary').value = preset.summary;
        document.getElementById('filter-year').value = preset.year;
        document.getElementById('search-box').value = preset.search || '';

        handleSearch({ target: document.getElementById('search-box') });
        applyFilters();
    }
}

// Quick presets
function initializeQuickPresets() {
    const quickPresets = {
        'high-quality': { decision: 'Include', relevance: 'high', summary: 'yes', year: 'all', search: '' },
        'recent-2024': { decision: 'Include', relevance: 'all', summary: 'all', year: '2024', search: '' },
        'with-summaries': { decision: 'Include', relevance: 'all', summary: 'yes', year: 'all', search: '' }
    };

    Object.keys(quickPresets).forEach(name => {
        const key = 'preset_' + name;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(quickPresets[name]));
        }
    });

    console.log('Quick presets initialized');
}
