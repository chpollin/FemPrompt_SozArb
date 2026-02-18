// features.js - Additional features for Research Vault v2.0
// Benchmark Tab, related papers, helper utilities

// =============================================
// BENCHMARK TAB
// =============================================

function initializeBenchmark() {
    if (!vaultMeta || !kappas) { console.warn('No data for benchmark'); return; }
    renderBenchmarkMetrics();
    renderKappaChart();
    renderConfusionMatrix();
    renderDisagreementsTable();

    // Severity filter
    const sev = document.getElementById('filter-severity');
    if (sev) sev.addEventListener('change', renderDisagreementsTable);
}

function renderBenchmarkMetrics() {
    const container = document.getElementById('benchmark-metrics');
    if (!container) return;

    const kappa = (vaultMeta.kappa_overall || 0).toFixed(3);
    const kappaInterp = vaultMeta.kappa_interpretation || '';
    const benchPapers = vaultMeta.benchmark_papers || 0;
    const disagreements = allPapers.filter(p => p.benchmark.has_human && p.benchmark.agreement === false).length;
    const llmRate = vaultMeta.llm_include_rate || 0;
    const humanRate = vaultMeta.human_include_rate || 0;

    container.innerHTML = `
        <div class="metric-tile">
            <span class="metric-value kappa-value">${kappa}</span>
            <span class="metric-label">Cohen's Kappa</span>
            <span class="metric-sub">${kappaInterp}</span>
        </div>
        <div class="metric-tile">
            <span class="metric-value">${benchPapers}</span>
            <span class="metric-label">Papers Benchmarked</span>
            <span class="metric-sub">both Human + LLM</span>
        </div>
        <div class="metric-tile">
            <span class="metric-value">${disagreements}</span>
            <span class="metric-label">Disagreements</span>
            <span class="metric-sub">LLM ≠ Human decision</span>
        </div>
        <div class="metric-tile">
            <span class="metric-value">${llmRate}%</span>
            <span class="metric-label">LLM Include Rate</span>
            <span class="metric-sub">vs. ${humanRate}% Human</span>
        </div>
    `;
}

function renderKappaChart() {
    const container = document.getElementById('kappa-chart-container');
    if (!container || typeof Plot === 'undefined') {
        console.warn('Observable Plot not loaded');
        return;
    }

    const kappaData = Object.entries(kappas).map(([cat, data]) => ({
        category: cat.replace('_', ' '),
        kappa: data.kappa,
        agreement: data.agreement_pct,
        n: data.n
    })).sort((a, b) => a.kappa - b.kappa);

    const chart = Plot.plot({
        marginLeft: 120,
        marginRight: 20,
        height: 280,
        style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
        x: { label: "Cohen's Kappa", grid: true },
        y: { label: null },
        marks: [
            Plot.barX(kappaData, {
                x: 'kappa',
                y: 'category',
                fill: d => d.kappa > 0 ? '#10b981' : '#ef4444',
                sort: { y: 'x' },
                tip: true,
                title: d => `${d.category}\nKappa: ${d.kappa.toFixed(3)}\nAgreement: ${d.agreement}%\nn = ${d.n}`
            }),
            Plot.ruleX([0], { stroke: '#6b7280', strokeWidth: 1.5 }),
            Plot.text(kappaData, {
                x: d => d.kappa + (d.kappa >= 0 ? 0.005 : -0.005),
                y: 'category',
                text: d => d.kappa.toFixed(3),
                textAnchor: d => d.kappa >= 0 ? 'start' : 'end',
                fontSize: 10,
                fill: '#44403c'
            })
        ]
    });

    container.innerHTML = '';
    container.appendChild(chart);
}

function renderConfusionMatrix() {
    const container = document.getElementById('confusion-matrix-container');
    if (!container) return;

    const cm = vaultMeta.confusion_matrix || {};
    const ii = cm.Include_Include || 0;
    const ie = cm.Include_Exclude || 0;
    const ei = cm.Exclude_Include || 0;
    const ee = cm.Exclude_Exclude || 0;
    const total = ii + ie + ei + ee;

    function pct(n) { return total ? Math.round(n / total * 100) + '%' : '-'; }

    container.innerHTML = `
        <p style="font-size:0.7rem;color:var(--gray-400);margin-bottom:0.5rem;text-align:center;">
            Rows = Human decision &bull; Columns = LLM decision
        </p>
        <div style="display:grid;grid-template-columns:auto 1fr 1fr;grid-template-rows:auto 1fr 1fr;gap:3px;font-size:0.75rem;">
            <div></div>
            <div style="text-align:center;font-weight:600;color:var(--gray-500);padding:4px;">LLM: Include</div>
            <div style="text-align:center;font-weight:600;color:var(--gray-500);padding:4px;">LLM: Exclude</div>
            <div style="font-weight:600;color:var(--gray-500);padding:4px;writing-mode:vertical-lr;text-align:center;">Human: Include</div>
            <div class="confusion-cell agreement" onclick="filterByQuadrant('Include','Include')" title="Click to filter papers">
                <span class="cell-count">${ii}</span>
                <span class="cell-label">Agreement</span>
                <span class="cell-pct">${pct(ii)}</span>
            </div>
            <div class="confusion-cell disagreement" onclick="filterByQuadrant('Include','Exclude')" title="Click to filter papers">
                <span class="cell-count">${ie}</span>
                <span class="cell-label">Human wins</span>
                <span class="cell-pct">${pct(ie)}</span>
            </div>
            <div style="font-weight:600;color:var(--gray-500);padding:4px;writing-mode:vertical-lr;text-align:center;">Human: Exclude</div>
            <div class="confusion-cell disagreement" onclick="filterByQuadrant('Exclude','Include')" title="Click to filter papers" style="border-width:4px;">
                <span class="cell-count">${ei}</span>
                <span class="cell-label">LLM overclassifies</span>
                <span class="cell-pct">${pct(ei)}</span>
            </div>
            <div class="confusion-cell agreement" onclick="filterByQuadrant('Exclude','Exclude')" title="Click to filter papers">
                <span class="cell-count">${ee}</span>
                <span class="cell-label">Agreement</span>
                <span class="cell-pct">${pct(ee)}</span>
            </div>
        </div>
        <p style="font-size:0.65rem;color:var(--gray-400);margin-top:0.5rem;text-align:center;">Click any cell to filter Papers tab</p>
    `;
}

function filterByQuadrant(humanDec, llmDec) {
    // Switch to papers tab and filter
    switchTab('papers');

    // Update filter selects
    const decisionFilter = document.getElementById('filter-decision');
    if (decisionFilter) {
        decisionFilter.value = llmDec;
    }

    const humanFilter = document.getElementById('filter-human');
    if (humanFilter) {
        humanFilter.value = 'has_human';
    }

    // Store quadrant filter for applyFilters to pick up
    window._quadrantFilter = { humanDec, llmDec };
    applyFiltersWithQuadrant();
}

function applyFiltersWithQuadrant() {
    const q = window._quadrantFilter;
    let filtered = [...allPapers];

    if (q) {
        filtered = filtered.filter(p => {
            if (!p.benchmark.has_human || !p.human || !p.human.decision) return false;
            const hNorm = p.human.decision === 'Include' ? 'Include' : 'Exclude';
            const lNorm = p.llm.decision === 'Include' ? 'Include' : 'Exclude';
            return hNorm === q.humanDec && lNorm === q.llmDec;
        });
    }

    filteredPapers = filtered;
    renderPapers(filteredPapers);
    window._quadrantFilter = null;
}

function renderDisagreementsTable() {
    const container = document.getElementById('disagreements-table-container');
    if (!container) return;

    const severityFilter = document.getElementById('filter-severity');
    const sevVal = severityFilter ? severityFilter.value : 'all';

    let disagreements = allPapers.filter(p =>
        p.benchmark.has_human && p.benchmark.agreement === false
    );

    if (sevVal !== 'all') {
        disagreements = disagreements.filter(p => p.benchmark.severity === sevVal);
    }

    // Sort by severity (high first), then title
    const sevOrder = { high: 0, medium: 1, low: 2 };
    disagreements.sort((a, b) => {
        const sa = sevOrder[a.benchmark.severity] ?? 3;
        const sb = sevOrder[b.benchmark.severity] ?? 3;
        if (sa !== sb) return sa - sb;
        return a.title.localeCompare(b.title);
    });

    if (disagreements.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-400);padding:1rem;">No disagreements for selected filter.</p>';
        return;
    }

    const rows = disagreements.map((p, i) => {
        const sev = p.benchmark.severity || '';
        const sevClass = `severity-${sev}`;
        const disType = (p.benchmark.disagreement_type || '').replace(/_/g, ' ');
        const cats = (p.benchmark.affected_categories || []).slice(0, 3).join(', ');
        const humanDec = p.human ? p.human.decision : '';
        const llmDec = p.llm.decision;

        return `<tr onclick="showPaperDetail(allPapers.find(x => x.id === '${p.id}'))" style="cursor:pointer;">
            <td class="title-cell" title="${escapeHtml(p.title)}">${escapeHtml(p.title.substring(0, 60))}${p.title.length > 60 ? '...' : ''}</td>
            <td>${escapeHtml(p.author_year.substring(0, 25))}</td>
            <td>${llmDec}</td>
            <td>${humanDec}</td>
            <td style="font-size:0.7rem;color:var(--gray-500);">${disType}</td>
            <td><span class="severity-badge ${sevClass}">${sev}</span></td>
            <td style="font-size:0.7rem;color:var(--gray-400);">${cats}</td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <table class="disagreements-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>LLM</th>
                    <th>Human</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Categories</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <p style="font-size:0.7rem;color:var(--gray-400);margin-top:0.5rem;">
            Showing ${disagreements.length} disagreements. Click a row to see paper details.
        </p>
    `;
}

// =============================================
// RELATED PAPERS (optional, used in modal)
// =============================================

function addRelatedPapersSection(paper) {
    // Find papers sharing the most LLM categories
    if (!paper.llm.categories || paper.llm.categories.length === 0) return '';

    const related = allPapers
        .filter(p => p.id !== paper.id)
        .map(p => {
            const shared = paper.llm.categories.filter(cat => p.llm.categories.includes(cat)).length;
            return { paper: p, shared };
        })
        .filter(r => r.shared >= 2)
        .sort((a, b) => b.shared - a.shared)
        .slice(0, 3);

    if (related.length === 0) return '';

    const items = related.map(r =>
        `<li onclick="showPaperDetail(allPapers.find(x => x.id === '${r.paper.id}'))" style="cursor:pointer;color:var(--primary);padding:2px 0;">
            ${escapeHtml(r.paper.author_year)} &mdash; ${escapeHtml(r.paper.title.substring(0, 60))}...
            <span style="font-size:0.7rem;color:var(--gray-400);">(${r.shared} shared categories)</span>
        </li>`
    ).join('');

    return `<div class="detail-section"><h3>Related Papers</h3><ul style="padding-left:1rem;">${items}</ul></div>`;
}

window.filterByQuadrant = filterByQuadrant;
window.initializeBenchmark = initializeBenchmark;
window.addRelatedPapersSection = addRelatedPapersSection;
