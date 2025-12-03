// Research Vault Web App
// Main application logic

// Global state
let allPapers = [];
let filteredPapers = [];
let statistics = {};
let graphData = {};
let network = null;
let fuse = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Research Vault App...');

    try {
        updateLoadingMessage('Loading papers data... (1/4)');
        await loadData();

        updateLoadingMessage('Initializing interface... (2/4)');
        initializeUI();
        initializeKeyboardShortcuts();

        updateLoadingMessage('Rendering statistics... (3/4)');
        renderStatistics();
        renderPapers();

        updateLoadingMessage('Loading dashboard charts... (4/4)');
        initializeDashboard();

        console.log('App initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load research vault data. Please check console for details.');
    }
});

// Update loading message
function updateLoadingMessage(message) {
    const loadingEls = document.querySelectorAll('.loading p');
    loadingEls.forEach(el => el.textContent = message);
}

// Load data from JSON files
async function loadData() {
    console.log('Loading data...');

    // Load papers
    const papersResponse = await fetch('data/research_vault.json');
    if (!papersResponse.ok) throw new Error('Failed to load papers data');
    const papersData = await papersResponse.json();
    allPapers = papersData.papers;
    statistics = papersData.statistics;
    filteredPapers = [...allPapers];

    console.log(`Loaded ${allPapers.length} papers`);

    // Load graph data
    const graphResponse = await fetch('data/graph_data.json');
    if (!graphResponse.ok) throw new Error('Failed to load graph data');
    graphData = await graphResponse.json();

    console.log(`Loaded graph with ${graphData.nodes.length} nodes`);

    // Initialize search
    fuse = new Fuse(allPapers, {
        keys: ['title', 'author_year', 'abstract'],
        threshold: 0.3,
        includeScore: true
    });
}

// Initialize UI event listeners
function initializeUI() {
    // Tab switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Search
    document.getElementById('search-box').addEventListener('input', handleSearch);

    // Filters
    document.getElementById('filter-decision').addEventListener('change', applyFilters);
    document.getElementById('filter-relevance').addEventListener('change', applyFilters);
    document.getElementById('filter-summary').addEventListener('change', applyFilters);
    document.getElementById('filter-year').addEventListener('change', applyFilters);
    document.getElementById('sort-by').addEventListener('change', applyFilters);

    // Graph filters
    document.getElementById('graph-filter-decision').addEventListener('change', updateGraph);
    document.getElementById('graph-filter-relevance').addEventListener('change', updateGraph);

    // Modal close on background click
    document.getElementById('paper-modal').addEventListener('click', (e) => {
        if (e.target.id === 'paper-modal') closePaperModal();
    });
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    // Initialize graph on first view
    if (tabName === 'graph' && !network) {
        setTimeout(initializeGraph, 100);
    }
}

// Render statistics
function renderStatistics() {
    const container = document.getElementById('stats-container');

    const html = `
        <div class="stat">
            <span class="stat-value">${statistics.total_papers}</span>
            <span class="stat-label">Total Papers</span>
        </div>
        <div class="stat">
            <span class="stat-value">${statistics.by_decision.Include || 0}</span>
            <span class="stat-label">Included</span>
        </div>
        <div class="stat">
            <span class="stat-value">${statistics.with_summaries}</span>
            <span class="stat-label">With Summaries</span>
        </div>
        <div class="stat">
            <span class="stat-value">${statistics.by_relevance.high || 0}</span>
            <span class="stat-label">High Relevance</span>
        </div>
        <div class="stat">
            <span class="stat-value">${statistics.average_relevance}</span>
            <span class="stat-label">Avg Relevance</span>
        </div>
    `;

    container.innerHTML = html;
}

// Search papers
function handleSearch(e) {
    const query = e.target.value.trim();

    if (query.length === 0) {
        filteredPapers = [...allPapers];
    } else {
        const results = fuse.search(query);
        filteredPapers = results.map(r => r.item);
    }

    applyFilters();
}

// Apply all filters
function applyFilters() {
    const decision = document.getElementById('filter-decision').value;
    const relevance = document.getElementById('filter-relevance').value;
    const summary = document.getElementById('filter-summary').value;
    const year = document.getElementById('filter-year').value;
    const sortBy = document.getElementById('sort-by').value;

    // Apply filters
    let filtered = [...filteredPapers];

    if (decision !== 'all') {
        filtered = filtered.filter(p => p.decision === decision);
    }

    if (relevance !== 'all') {
        filtered = filtered.filter(p => p.relevance_category === relevance);
    }

    if (summary !== 'all') {
        const hasSummary = summary === 'yes';
        filtered = filtered.filter(p => p.has_summary === hasSummary);
    }

    if (year !== 'all') {
        if (year === '2021') {
            filtered = filtered.filter(p => p.publication_year <= 2021);
        } else {
            filtered = filtered.filter(p => p.publication_year == year);
        }
    }

    // Apply sorting
    if (sortBy === 'relevance') {
        filtered.sort((a, b) => b.total_relevance - a.total_relevance);
    } else if (sortBy === 'year') {
        filtered.sort((a, b) => (b.publication_year || 0) - (a.publication_year || 0));
    } else if (sortBy === 'author') {
        filtered.sort((a, b) => a.author_year.localeCompare(b.author_year));
    }

    renderPapers(filtered);
}

// Render papers grid
function renderPapers(papers = filteredPapers) {
    const container = document.getElementById('papers-grid');

    // Update results counter
    const resultsCount = document.getElementById('results-count');
    const totalCount = document.getElementById('total-count');
    if (resultsCount) resultsCount.textContent = papers.length;
    if (totalCount) totalCount.textContent = allPapers.length;

    if (papers.length === 0) {
        container.innerHTML = '<div class="loading"><p>No papers match your filters.</p></div>';
        return;
    }

    const html = papers.map(paper => createPaperCard(paper)).join('');
    container.innerHTML = html;

    // Add click listeners
    document.querySelectorAll('.paper-card').forEach((card, index) => {
        card.addEventListener('click', () => showPaperDetail(papers[index]));
    });
}

// Create paper card HTML
function createPaperCard(paper) {
    const decisionClass = `decision-${paper.decision.toLowerCase()}`;
    const relevancePercent = (paper.total_relevance / 15) * 100;

    // Decision icons (FontAwesome)
    const decisionIcons = {
        'Include': '<i class="fas fa-check-circle"></i>',
        'Exclude': '<i class="fas fa-times-circle"></i>',
        'Unclear': '<i class="fas fa-question-circle"></i>'
    };

    // Dimension icons mapping
    const dimensionIcons = {
        'AI Literacy': '<i class="fas fa-robot"></i>',
        'Vulnerable Groups': '<i class="fas fa-shield-alt"></i>',
        'Bias Analysis': '<i class="fas fa-balance-scale"></i>',
        'Practical Implementation': '<i class="fas fa-tools"></i>',
        'Professional': '<i class="fas fa-users"></i>',
        'Professional Context': '<i class="fas fa-users"></i>'
    };

    // Top dimensions with icons
    const topDims = paper.top_dimensions.slice(0, 2).map(dim => {
        const icon = dimensionIcons[dim] || '<i class="fas fa-tag"></i>';
        return `<span class="dimension-pill high">${icon} ${dim}</span>`;
    }).join('');

    return `
        <div class="paper-card" data-relevance="${paper.relevance_category}">
            <div class="paper-header">
                <span class="paper-author">${escapeHtml(paper.author_year)}</span>
                <span class="decision-badge ${decisionClass}">
                    ${decisionIcons[paper.decision] || ''} ${paper.decision}
                </span>
            </div>

            <h3 class="paper-title">${escapeHtml(paper.title)}</h3>

            <div class="relevance-bar">
                <div class="relevance-label">
                    <span><i class="fas fa-chart-line"></i> Relevance</span>
                    <span class="relevance-value">${paper.total_relevance}/15</span>
                </div>
                <div class="relevance-progress">
                    <div class="relevance-fill" style="width: ${relevancePercent}%"></div>
                </div>
            </div>

            ${topDims ? `<div class="dimensions-mini">${topDims}</div>` : ''}

            ${paper.has_summary && paper.summary_section && !paper.summary_section.startsWith('![[') ?
                '<div class="summary-indicator"><i class="fas fa-file-alt"></i> AI Summary Available</div>' :
                ''
            }
        </div>
    `;
}

// Show paper detail modal
function showPaperDetail(paper) {
    const modal = document.getElementById('paper-modal');
    const titleEl = document.getElementById('modal-title');
    const authorEl = document.getElementById('modal-author');
    const bodyEl = document.getElementById('modal-body');

    titleEl.textContent = paper.title;
    authorEl.textContent = `${paper.author_year} | ${paper.publication_year}`;

    // Build modal content
    let html = `
        <div class="detail-section">
            <h3>Assessment</h3>
            <div class="dimension-row">
                <span class="dimension-name">Decision</span>
                <span class="decision-badge decision-${paper.decision.toLowerCase()}">${paper.decision}</span>
            </div>
            <div class="dimension-row">
                <span class="dimension-name">Total Relevance</span>
                <span style="font-weight: 700; color: var(--primary-color);">${paper.total_relevance}/15</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>Relevance Dimensions</h3>
            <div class="dimensions-detail">
                ${createDimensionRow('AI Literacy & Competencies', paper.rel_ai_komp)}
                ${createDimensionRow('Vulnerable Groups & Digital Equity', paper.rel_vulnerable)}
                ${createDimensionRow('Bias & Discrimination Analysis', paper.rel_bias)}
                ${createDimensionRow('Practical Implementation', paper.rel_praxis)}
                ${createDimensionRow('Professional/Social Work Context', paper.rel_prof)}
            </div>
        </div>
    `;

    if (paper.abstract) {
        html += `
            <div class="detail-section">
                <h3>Abstract</h3>
                <p style="line-height: 1.8; color: var(--gray-700);">${escapeHtml(paper.abstract)}</p>
            </div>
        `;
    }

    // AI Summary Section (Enhanced Pipeline v2.0)
    if (paper.has_summary && paper.summary_section && paper.summary_section.trim() &&
        !paper.summary_section.startsWith('![[') &&
        !paper.summary_section.includes('No AI summary available')) {
        html += `
            <div class="detail-section">
                <h3><i class="fas fa-robot"></i> AI-Generated Summary</h3>
                <div class="summary-content" style="line-height: 1.8; color: var(--gray-700); background: var(--gray-50); padding: 1rem; border-radius: 6px; border-left: 3px solid var(--primary);">
                    ${escapeHtml(paper.summary_section)}
                </div>
                ${paper.summary_file ? `<p style="margin-top: 0.75rem; font-size: 0.875rem; color: var(--gray-500);">
                    <i class="fas fa-info-circle"></i> Generated by Enhanced Summarization Pipeline v2.0 • Full summary: <code>${paper.summary_file}</code>
                </p>` : ''}
            </div>
        `;
    } else if (paper.has_summary && paper.decision === 'Include') {
        html += `
            <div class="detail-section">
                <h3><i class="fas fa-hourglass-half"></i> Summary Status</h3>
                <p style="color: var(--gray-600); font-style: italic;">
                    <i class="fas fa-info-circle"></i> This paper has been marked for summarization but processing is pending.
                    Enhanced summaries are generated through multi-pass analysis with quality validation.
                </p>
            </div>
        `;
    }

    // Related Papers (if available)
    if (typeof addRelatedPapersSection === 'function') {
        html += addRelatedPapersSection(paper);
    }

    if (paper.doi || paper.url) {
        html += `<div class="detail-section"><h3>Links</h3>`;
        if (paper.doi) {
            html += `<p><strong>DOI:</strong> <a href="https://doi.org/${paper.doi}" target="_blank">${paper.doi}</a></p>`;
        }
        if (paper.url && paper.url !== 'nan') {
            html += `<p><strong>URL:</strong> <a href="${paper.url}" target="_blank">${paper.url}</a></p>`;
        }
        html += `</div>`;
    }

    bodyEl.innerHTML = html;
    modal.classList.add('active');
}

function createDimensionRow(name, score) {
    // FontAwesome stars
    const stars = Array(3).fill(0).map((_, i) => {
        const filled = i < score ? 'filled' : '';
        const icon = i < score ? 'fas' : 'far';
        return `<span class="star ${filled}"><i class="${icon} fa-star"></i></span>`;
    }).join('');

    // Dimension icons
    const icons = {
        'AI Literacy & Competencies': '<i class="fas fa-robot"></i>',
        'Vulnerable Groups & Digital Equity': '<i class="fas fa-shield-alt"></i>',
        'Bias & Discrimination Analysis': '<i class="fas fa-balance-scale"></i>',
        'Practical Implementation': '<i class="fas fa-tools"></i>',
        'Professional/Social Work Context': '<i class="fas fa-users"></i>'
    };

    const icon = icons[name] || '';

    return `
        <div class="dimension-row">
            <span class="dimension-name">${icon} ${name}</span>
            <div class="dimension-score">${stars}</div>
        </div>
    `;
}

function closePaperModal() {
    document.getElementById('paper-modal').classList.remove('active');
}

// Initialize dashboard charts
function initializeDashboard() {
    // Decision chart
    new Chart(document.getElementById('decision-chart'), {
        type: 'doughnut',
        data: {
            labels: ['Include', 'Exclude', 'Unclear'],
            datasets: [{
                data: [
                    statistics.by_decision.Include || 0,
                    statistics.by_decision.Exclude || 0,
                    statistics.by_decision.Unclear || 0
                ],
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Relevance distribution
    new Chart(document.getElementById('relevance-chart'), {
        type: 'bar',
        data: {
            labels: ['High (≥10)', 'Medium (5-9)', 'Low (<5)'],
            datasets: [{
                label: 'Papers',
                data: [
                    statistics.by_relevance.high || 0,
                    statistics.by_relevance.medium || 0,
                    statistics.by_relevance.low || 0
                ],
                backgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
        }
    });

    // Dimension charts
    const dimensions = ['ai_komp', 'vulnerable', 'bias', 'praxis', 'prof'];
    const chartIds = ['ai-chart', 'vulnerable-chart', 'bias-chart', 'praxis-chart'];
    const dimData = statistics.by_dimension;

    dimensions.slice(0, 4).forEach((dim, i) => {
        new Chart(document.getElementById(chartIds[i]), {
            type: 'bar',
            data: {
                labels: ['High (3)', 'Medium (2)', 'Low (1)', 'None (0)'],
                datasets: [{
                    label: 'Papers',
                    data: [
                        dimData[dim].high,
                        dimData[dim].medium,
                        dimData[dim].low,
                        dimData[dim].none
                    ],
                    backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#d1d5db']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    });
}

// Initialize graph visualization
function initializeGraph() {
    console.log('Initializing graph...');

    const container = document.getElementById('graph-container');

    const options = {
        nodes: {
            shape: 'dot',
            font: {
                size: 12,
                face: 'Arial'
            }
        },
        edges: {
            smooth: {
                type: 'continuous'
            },
            color: {
                color: '#e5e7eb',
                highlight: '#2563eb'
            }
        },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -30000,
                centralGravity: 0.3,
                springLength: 200,
                springConstant: 0.04
            },
            stabilization: {
                iterations: 150
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 100
        }
    };

    network = new vis.Network(container, graphData, options);

    network.on('click', (params) => {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const paper = allPapers.find(p => p.id === nodeId);
            if (paper) showPaperDetail(paper);
        }
    });

    console.log('Graph initialized');
}

// Update graph filters
function updateGraph() {
    if (!network) return;

    const decision = document.getElementById('graph-filter-decision').value;
    const minRelevance = parseInt(document.getElementById('graph-filter-relevance').value);

    // Filter nodes
    const filteredNodes = graphData.nodes.filter(node => {
        if (decision !== 'all' && node.decision !== decision) return false;
        if (node.relevance < minRelevance) return false;
        return true;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));

    // Filter edges
    const filteredEdges = graphData.edges.filter(edge => {
        return nodeIds.has(edge.from) && nodeIds.has(edge.to);
    });

    // Update network
    network.setData({
        nodes: filteredNodes,
        edges: filteredEdges
    });
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    alert(message);
}

// Export for global access
window.closePaperModal = closePaperModal;
