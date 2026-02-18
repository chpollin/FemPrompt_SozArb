// Research Vault Web App - v2.0 (10K Assessment Schema)
// Main application logic

const CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender',
    'Diversitaet', 'Feministisch', 'Fairness'
];

// Global state
let allPapers = [];
let filteredPapers = [];
let vaultMeta = {};
let kappas = {};
let graphData = {};
let network = null;
let fuse = null;
let activeCategories = new Set(); // for chip multi-select
let benchmarkInitialized = false;
let dashboardInitialized = false;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Research Vault App v2.0...');

    try {
        updateLoadingMessage('Loading data... (1/3)');
        await loadData();

        updateLoadingMessage('Initializing interface... (2/3)');
        initializeUI();
        initializeKeyboardShortcuts();

        updateLoadingMessage('Rendering papers... (3/3)');
        renderStatistics();
        renderCategoryChips();
        renderPapers();

        console.log('App initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load research vault data: ' + error.message);
    }
});

function updateLoadingMessage(message) {
    document.querySelectorAll('.loading p').forEach(el => el.textContent = message);
}

// Load data
async function loadData() {
    const vaultRes = await fetch('data/research_vault_v2.json');
    if (!vaultRes.ok) throw new Error('Failed to load research_vault_v2.json');
    const vaultData = await vaultRes.json();
    allPapers = vaultData.papers;
    vaultMeta = vaultData.meta;
    kappas = vaultData.kappa_by_category;
    filteredPapers = [...allPapers];
    console.log(`Loaded ${allPapers.length} papers`);

    const graphRes = await fetch('data/graph_data.json');
    if (!graphRes.ok) throw new Error('Failed to load graph_data.json');
    graphData = await graphRes.json();
    console.log(`Loaded graph: ${graphData.nodes.length} nodes, ${graphData.edges.length} edges`);

    fuse = new Fuse(allPapers, {
        keys: ['title', 'author_year', 'abstract'],
        threshold: 0.3,
        includeScore: true
    });
}

// Initialize UI
function initializeUI() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    document.getElementById('search-box').addEventListener('input', handleSearch);
    document.getElementById('filter-decision').addEventListener('change', applyFilters);
    document.getElementById('filter-human').addEventListener('change', applyFilters);
    document.getElementById('filter-year').addEventListener('change', applyFilters);
    document.getElementById('sort-by').addEventListener('change', applyFilters);

    document.getElementById('paper-modal').addEventListener('click', (e) => {
        if (e.target.id === 'paper-modal') closePaperModal();
    });
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePaperModal();
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('search-box').focus();
        }
    });
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    if (tabName === 'benchmark' && !benchmarkInitialized) {
        setTimeout(() => { initializeBenchmark(); benchmarkInitialized = true; }, 100);
    }
    if (tabName === 'dashboard' && !dashboardInitialized) {
        setTimeout(() => { initializeDashboard(); dashboardInitialized = true; }, 100);
    }
    if (tabName === 'graph' && !network) {
        setTimeout(initializeGraph, 100);
    }
}

// Stats bar
function renderStatistics() {
    const container = document.getElementById('stats-container');
    const llmInclude = allPapers.filter(p => p.llm.decision === 'Include').length;
    const withHuman = allPapers.filter(p => p.benchmark.has_human).length;
    const disagreements = allPapers.filter(p => p.benchmark.has_human && p.benchmark.agreement === false).length;
    const kappa = (vaultMeta.kappa_overall || 0).toFixed(3);

    container.innerHTML = `
        <div class="stat">
            <span class="stat-value">${allPapers.length}</span>
            <span class="stat-label">Total Papers</span>
        </div>
        <div class="stat">
            <span class="stat-value">${llmInclude}</span>
            <span class="stat-label">LLM Include</span>
        </div>
        <div class="stat">
            <span class="stat-value">${withHuman}</span>
            <span class="stat-label">Human Assessed</span>
        </div>
        <div class="stat">
            <span class="stat-value">${disagreements}</span>
            <span class="stat-label">Disagreements</span>
        </div>
        <div class="stat">
            <span class="stat-value">${kappa}</span>
            <span class="stat-label">Cohen's Kappa</span>
        </div>
    `;
}

// Category chips
function renderCategoryChips() {
    const container = document.getElementById('category-chips');
    const chips = CATEGORIES.map(cat => {
        const label = cat.replace('_', ' ');
        return `<button class="category-chip" data-cat="${cat}" onclick="toggleCategoryChip('${cat}')">${label}</button>`;
    }).join('');
    container.innerHTML = chips;
}

function toggleCategoryChip(cat) {
    if (activeCategories.has(cat)) {
        activeCategories.delete(cat);
    } else {
        activeCategories.add(cat);
    }
    // Update chip appearance
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.toggle('active', activeCategories.has(chip.dataset.cat));
    });
    applyFilters();
}

// Search
function handleSearch(e) {
    const query = e.target.value.trim();
    if (query.length === 0) {
        filteredPapers = [...allPapers];
    } else {
        filteredPapers = fuse.search(query).map(r => r.item);
    }
    applyFilters();
}

// Filters
function applyFilters() {
    const decision = document.getElementById('filter-decision').value;
    const humanStatus = document.getElementById('filter-human').value;
    const year = document.getElementById('filter-year').value;
    const sortBy = document.getElementById('sort-by').value;

    let filtered = [...filteredPapers];

    if (decision !== 'all') {
        filtered = filtered.filter(p => p.llm.decision === decision);
    }

    if (humanStatus === 'has_human') {
        filtered = filtered.filter(p => p.benchmark.has_human);
    } else if (humanStatus === 'agreement') {
        filtered = filtered.filter(p => p.benchmark.has_human && p.benchmark.agreement === true);
    } else if (humanStatus === 'disagreement') {
        filtered = filtered.filter(p => p.benchmark.has_human && p.benchmark.agreement === false);
    } else if (humanStatus === 'no_human') {
        filtered = filtered.filter(p => !p.benchmark.has_human);
    }

    if (year !== 'all') {
        if (year === '2021') {
            filtered = filtered.filter(p => p.year && p.year <= 2021);
        } else {
            filtered = filtered.filter(p => p.year == parseInt(year));
        }
    }

    // Category chip filter: paper must have ALL selected categories (LLM-positive)
    if (activeCategories.size > 0) {
        filtered = filtered.filter(p => {
            return [...activeCategories].every(cat => p.llm.all_categories[cat] === 1);
        });
    }

    // Sort
    if (sortBy === 'year') {
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortBy === 'author') {
        filtered.sort((a, b) => a.author_year.localeCompare(b.author_year));
    } else if (sortBy === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderPapers(filtered);
}

// Render papers
function renderPapers(papers = filteredPapers) {
    const container = document.getElementById('papers-grid');
    const resultsCount = document.getElementById('results-count');
    const totalCount = document.getElementById('total-count');
    if (resultsCount) resultsCount.textContent = papers.length;
    if (totalCount) totalCount.textContent = allPapers.length;

    if (papers.length === 0) {
        container.innerHTML = '<div class="loading"><p>No papers match your filters.</p></div>';
        return;
    }

    container.innerHTML = papers.map(p => createPaperCard(p)).join('');

    document.querySelectorAll('.paper-card').forEach((card, i) => {
        card.addEventListener('click', () => showPaperDetail(papers[i]));
    });
}

// Paper card HTML
function createPaperCard(paper) {
    const llmDec = paper.llm.decision;
    const humanDec = paper.human ? paper.human.decision : null;
    const hasHuman = paper.benchmark.has_human;
    const agreement = paper.benchmark.agreement;

    // Assessment badges
    const llmBadge = llmDec === 'Include'
        ? `<span class="decision-badge badge-llm-include">LLM: Include</span>`
        : `<span class="decision-badge badge-llm-exclude">LLM: Exclude</span>`;

    let humanBadge = '';
    if (hasHuman && humanDec) {
        humanBadge = humanDec === 'Include'
            ? `<span class="decision-badge badge-human-include">Human: Include</span>`
            : `<span class="decision-badge badge-human-exclude">Human: Exclude</span>`;
    } else if (!hasHuman) {
        humanBadge = `<span class="decision-badge badge-llm-only">LLM only</span>`;
    }

    let agreementBadge = '';
    if (hasHuman && humanDec) {
        agreementBadge = agreement === true
            ? `<span class="decision-badge badge-agreement">Agreement</span>`
            : `<span class="decision-badge badge-disagreement">Disagreement</span>`;
    }

    // Category tags (LLM positive only)
    const catTags = paper.llm.categories.slice(0, 4).map(cat =>
        `<span class="cat-tag">${cat.replace('_', '\u202F')}</span>`
    ).join('');
    const moreCats = paper.llm.categories.length > 4
        ? `<span class="cat-tag">+${paper.llm.categories.length - 4}</span>` : '';

    const year = paper.year || '';
    const type = paper.item_type ? paper.item_type.replace('-', '\u2011') : '';
    const journal = paper.journal ? ` | ${escapeHtml(paper.journal).substring(0, 40)}` : '';

    return `
        <div class="paper-card">
            <h3 class="paper-title">${escapeHtml(paper.title)}</h3>
            <div class="paper-meta-row">
                <span class="meta-pill">${escapeHtml(paper.author_year)}</span>
                ${year ? `<span class="meta-sep">|</span><span class="meta-pill">${year}</span>` : ''}
                ${type ? `<span class="meta-sep">|</span><span class="meta-pill">${type}</span>` : ''}
                ${journal ? `<span class="meta-sep">|</span><span class="meta-pill">${journal}</span>` : ''}
            </div>
            <div class="assessment-badges">
                ${llmBadge}${humanBadge}${agreementBadge}
            </div>
            ${catTags || moreCats ? `<div class="category-tags">${catTags}${moreCats}</div>` : ''}
        </div>
    `;
}

// Paper detail modal
function showPaperDetail(paper) {
    const modal = document.getElementById('paper-modal');
    document.getElementById('modal-title').textContent = paper.title;
    document.getElementById('modal-author').textContent =
        `${paper.author_year}${paper.year ? ' | ' + paper.year : ''}${paper.item_type ? ' | ' + paper.item_type : ''}`;

    document.getElementById('modal-body').innerHTML = buildModalContent(paper);
    modal.classList.add('active');
}

function buildModalContent(paper) {
    let html = '';

    // Abstract
    if (paper.abstract && paper.abstract.trim()) {
        html += `
            <div class="detail-section">
                <h3>Abstract</h3>
                <p style="line-height:1.8;color:var(--gray-700);">${escapeHtml(paper.abstract)}&hellip;</p>
            </div>
        `;
    }

    // Links
    const doiLink = paper.doi && paper.doi !== 'nan'
        ? `<a href="https://doi.org/${paper.doi}" target="_blank">DOI: ${paper.doi}</a>` : '';
    const urlLink = paper.url && paper.url !== 'nan' && paper.url !== ''
        ? `<a href="${paper.url}" target="_blank">Link</a>` : '';
    if (doiLink || urlLink) {
        html += `<div class="detail-section" style="padding-bottom:0;">
            <h3>Links</h3><p>${[doiLink, urlLink].filter(Boolean).join(' &bull; ')}</p>
        </div>`;
    }

    // Assessment grid
    html += `<div class="detail-section"><h3>Assessment</h3><div class="modal-assessment-grid">`;

    // LLM panel
    const llmDecClass = paper.llm.decision === 'Include' ? 'decision-include' : 'decision-exclude';
    const catGridLLM = CATEGORIES.map(cat => {
        const active = paper.llm.all_categories[cat] === 1;
        return `<div class="cat-grid-item${active ? ' active' : ''}">
            <span class="cat-dot"></span>
            <span>${cat.replace('_', ' ')}</span>
        </div>`;
    }).join('');

    html += `
        <div class="assessment-panel">
            <h4>LLM Assessment (Claude Haiku 4.5)</h4>
            <div class="assessment-decision ${llmDecClass}">${paper.llm.decision}</div>
            <div style="margin-bottom:0.5rem;">
                <span style="font-size:0.75rem;color:var(--gray-500);">Confidence: ${Math.round(paper.llm.confidence * 100)}%</span>
                <div class="confidence-bar"><div class="confidence-fill" style="width:${paper.llm.confidence * 100}%"></div></div>
            </div>
            <div class="category-grid-10">${catGridLLM}</div>
            ${paper.llm.reasoning ? `<p style="margin-top:0.5rem;font-size:0.7rem;color:var(--gray-400);font-style:italic;">${escapeHtml(paper.llm.reasoning)}&hellip;</p>` : ''}
        </div>
    `;

    // Human panel
    if (paper.benchmark.has_human && paper.human) {
        const hDec = paper.human.decision;
        const hDecClass = hDec === 'Include' ? 'decision-include' : (hDec === 'Exclude' ? 'decision-exclude' : '');
        const catGridHuman = CATEGORIES.map(cat => {
            const active = paper.human.all_categories[cat] === 1;
            return `<div class="cat-grid-item${active ? ' active' : ''}">
                <span class="cat-dot"></span>
                <span>${cat.replace('_', ' ')}</span>
            </div>`;
        }).join('');

        html += `
            <div class="assessment-panel">
                <h4>Human Assessment (Expert Review)</h4>
                <div class="assessment-decision ${hDecClass}">${hDec || 'No decision'}</div>
                <div class="category-grid-10">${catGridHuman}</div>
            </div>
        `;
    } else {
        html += `
            <div class="assessment-panel" style="opacity:0.6;">
                <h4>Human Assessment</h4>
                <p style="color:var(--gray-400);font-size:0.8rem;">No human assessment available for this paper.</p>
            </div>
        `;
    }

    html += `</div>`; // close modal-assessment-grid

    // Benchmark section
    if (paper.benchmark.has_human && paper.human && paper.human.decision) {
        const isAgreement = paper.benchmark.agreement === true;
        const panelClass = isAgreement ? 'agreement' : '';
        const affectedCats = paper.benchmark.affected_categories || [];
        const catKappas = affectedCats.map(cat => {
            const k = kappas[cat] ? kappas[cat].kappa : null;
            return k !== null ? `${cat}: κ = ${k.toFixed(3)}` : cat;
        }).join(', ');

        html += `
            <div class="benchmark-panel ${panelClass}">
                <h4>Benchmark</h4>
                <div style="display:flex;gap:1rem;flex-wrap:wrap;font-size:0.8rem;">
                    <span><strong>Agreement:</strong> ${isAgreement ? 'Yes' : 'No'}</span>
                    ${paper.benchmark.disagreement_type ? `<span><strong>Type:</strong> ${paper.benchmark.disagreement_type.replace(/_/g, ' ')}</span>` : ''}
                    ${paper.benchmark.severity ? `<span><strong>Severity:</strong> ${paper.benchmark.severity}</span>` : ''}
                </div>
                ${affectedCats.length ? `<p style="font-size:0.75rem;color:var(--gray-500);margin-top:0.25rem;">Affected: ${catKappas}</p>` : ''}
            </div>
        `;
    }

    html += `</div>`; // close detail-section

    return html;
}

function closePaperModal() {
    document.getElementById('paper-modal').classList.remove('active');
}

// Utility
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function showError(message) {
    console.error(message);
    document.getElementById('papers-grid').innerHTML =
        `<div class="loading"><p style="color:var(--danger);">${escapeHtml(message)}</p></div>`;
}

// Dashboard charts (new 10K schema)
function initializeDashboard() {
    const llmInclude = allPapers.filter(p => p.llm.decision === 'Include').length;
    const llmExclude = allPapers.filter(p => p.llm.decision === 'Exclude').length;
    const llmOther = allPapers.length - llmInclude - llmExclude;

    // Decision doughnut
    new Chart(document.getElementById('decision-chart'), {
        type: 'doughnut',
        data: {
            labels: ['Include', 'Exclude', 'Other'],
            datasets: [{ data: [llmInclude, llmExclude, llmOther],
                backgroundColor: ['#10b981', '#6b7280', '#f59e0b'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Human vs LLM include rate
    const humanInclude = vaultMeta.human_include_count || 0;
    const humanTotal = vaultMeta.human_total_with_decision || 1;
    const llmRate = Math.round(llmInclude / allPapers.length * 100);
    const humanRate = Math.round(humanInclude / humanTotal * 100);

    new Chart(document.getElementById('include-rate-chart'), {
        type: 'bar',
        data: {
            labels: ['LLM', 'Human'],
            datasets: [{
                label: 'Include Rate (%)',
                data: [llmRate, humanRate],
                backgroundColor: ['#1e40af', '#059669']
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100,
                ticks: { callback: v => v + '%' }
            }},
            plugins: { legend: { display: false } }
        }
    });

    // Category distribution (LLM positive counts)
    const catCounts = CATEGORIES.map(cat =>
        allPapers.filter(p => p.llm.all_categories[cat] === 1).length
    );
    new Chart(document.getElementById('category-chart'), {
        type: 'bar',
        data: {
            labels: CATEGORIES.map(c => c.replace('_', ' ')),
            datasets: [{ label: 'Papers', data: catCounts, backgroundColor: '#1e40af' }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });

    // Year distribution
    const yearCounts = {};
    allPapers.forEach(p => {
        if (p.year) yearCounts[p.year] = (yearCounts[p.year] || 0) + 1;
    });
    const years = Object.keys(yearCounts).sort();
    new Chart(document.getElementById('year-chart'), {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{ label: 'Papers', data: years.map(y => yearCounts[y]), backgroundColor: '#1e40af' }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Confidence histogram
    const confBuckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0.0-0.1, 0.1-0.2, ...
    allPapers.forEach(p => {
        const idx = Math.min(Math.floor(p.llm.confidence * 10), 9);
        confBuckets[idx]++;
    });
    new Chart(document.getElementById('confidence-chart'), {
        type: 'bar',
        data: {
            labels: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            datasets: [{ label: 'Papers', data: confBuckets, backgroundColor: '#3b82f6' }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Agreement by category
    const catAgreement = CATEGORIES.map(cat => {
        const k = kappas[cat];
        return k ? Math.round(k.agreement_pct) : 0;
    });
    new Chart(document.getElementById('agreement-chart'), {
        type: 'bar',
        data: {
            labels: CATEGORIES.map(c => c.replace('_', ' ')),
            datasets: [{ label: 'Agreement %', data: catAgreement, backgroundColor: '#059669' }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } }
        }
    });
}

// Graph (category co-occurrence)
function initializeGraph() {
    const container = document.getElementById('graph-container');
    const options = {
        nodes: {
            shape: 'dot',
            font: { size: 13, face: 'Inter, sans-serif', bold: { mod: 'bold' } },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            smooth: { type: 'continuous' },
            color: { color: '#d6d3d1', highlight: '#1e40af' },
            scaling: { min: 1, max: 8 }
        },
        physics: {
            barnesHut: { gravitationalConstant: -20000, centralGravity: 0.5, springLength: 180 },
            stabilization: { iterations: 200 }
        },
        interaction: { hover: true, tooltipDelay: 100 }
    };

    network = new vis.Network(container, graphData, options);
    console.log('Category graph initialized');
}

// Export
function exportFilteredPapers() {
    const papers = filteredPapers.length > 0 ? filteredPapers : allPapers;
    const headers = ['ID', 'Title', 'Author_Year', 'Year', 'Item_Type', 'DOI',
        'LLM_Decision', 'LLM_Confidence', 'LLM_Categories',
        'Human_Decision', 'Has_Human', 'Agreement'];
    const rows = papers.map(p => [
        p.id, p.title, p.author_year, p.year, p.item_type, p.doi,
        p.llm.decision, p.llm.confidence, p.llm.categories.join(';'),
        p.human ? p.human.decision : '', p.benchmark.has_human,
        p.benchmark.agreement === null ? '' : p.benchmark.agreement
    ]);
    const csv = [headers, ...rows].map(r =>
        r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research_vault_filtered.csv';
    a.click();
    URL.revokeObjectURL(url);
}

window.closePaperModal = closePaperModal;
window.exportFilteredPapers = exportFilteredPapers;
window.toggleCategoryChip = toggleCategoryChip;
