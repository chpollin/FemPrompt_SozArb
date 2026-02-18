// features.js - Benchmark Tab + Helper Features for Research Vault v2.0
// Uses Chart.js (already loaded) for all charts -- no Observable Plot dependency

// =============================================
// BENCHMARK TAB
// =============================================

function initializeBenchmark() {
    if (!vaultMeta || !kappas) { console.warn('[Benchmark] no data -- skipping'); return; }
    const ok = [], fail = [];
    const run = (label, fn) => { try { fn(); ok.push(label); } catch(e) { fail.push(label); console.error(`[Benchmark] ${label}:`, e); } };
    run('metrics', renderBenchmarkMetrics);
    run('kappa-chart', renderKappaChart);
    run('confusion', renderConfusionMatrix);
    run('disagreements', renderDisagreementsTable);
    const cm = vaultMeta.confusion_matrix || {};
    const dis = allPapers.filter(p => p.benchmark.has_human && p.benchmark.agreement === false).length;
    console.log(`[Benchmark] ok=[${ok.join(',')}]${fail.length ? ' FAIL=['+fail.join(',')+']' : ''} | κ=${(vaultMeta.kappa_overall||0).toFixed(3)} dis=${dis} II=${cm.Include_Include} EI=${cm.Exclude_Include}`);

    // Severity filter
    const sev = document.getElementById('filter-severity');
    if (sev) sev.addEventListener('change', renderDisagreementsTable);
}

// ---- Metric Tiles ----

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
            <span class="metric-sub">LLM &ne; Human decision</span>
        </div>
        <div class="metric-tile">
            <span class="metric-value">${llmRate}%</span>
            <span class="metric-label">LLM Include Rate</span>
            <span class="metric-sub">vs. ${humanRate}% Human</span>
        </div>
    `;
}

// ---- Kappa Chart (Chart.js horizontal bar) ----

let kappaChartInstance = null;

function renderKappaChart() {
    const container = document.getElementById('kappa-chart-container');
    if (!container) return;

    // Build sorted data (worst to best kappa, so best is at top of horizontal chart)
    const kappaData = Object.entries(kappas).map(([cat, data]) => ({
        category: cat.replace('_', ' '),
        kappa: data.kappa,
        agreement: data.agreement_pct,
        n: data.n
    })).sort((a, b) => a.kappa - b.kappa); // ascending -> worst at bottom, best at top

    const labels = kappaData.map(d => d.category);
    const values = kappaData.map(d => d.kappa);
    const colors = values.map(v => v > 0 ? '#10b981' : '#ef4444');
    const borderColors = values.map(v => v > 0 ? '#059669' : '#dc2626');

    // Create canvas if it doesn't exist
    container.innerHTML = '<canvas id="kappa-canvas"></canvas>';
    const canvas = document.getElementById('kappa-canvas');

    if (kappaChartInstance) {
        kappaChartInstance.destroy();
        kappaChartInstance = null;
    }

    kappaChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: "Cohen's Kappa",
                data: values,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const d = kappaData[ctx.dataIndex];
                            return [
                                `Kappa: ${d.kappa.toFixed(4)}`,
                                `Agreement: ${d.agreement}%`,
                                `n = ${d.n}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: false,
                    grid: { color: '#e7e5e4' },
                    ticks: { callback: v => v.toFixed(2) }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });

    // Ensure the container has sufficient height
    container.style.height = '300px';
    container.style.position = 'relative';
}

// ---- Confusion Matrix ----

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
        <p style="font-size:0.7rem;color:var(--gray-400);margin-bottom:0.75rem;text-align:center;">
            Zeilen = Human-Entscheidung &bull; Spalten = LLM-Entscheidung
        </p>

        <!-- Column headers -->
        <div style="display:grid;grid-template-columns:90px 1fr 1fr;gap:4px;margin-bottom:4px;">
            <div></div>
            <div style="text-align:center;font-size:0.7rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;padding:4px 0;">LLM: Include</div>
            <div style="text-align:center;font-size:0.7rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;padding:4px 0;">LLM: Exclude</div>
        </div>

        <!-- Row 1: Human Include -->
        <div style="display:grid;grid-template-columns:90px 1fr 1fr;gap:4px;margin-bottom:4px;">
            <div style="display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:0.7rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;">Human:<br>Include</div>
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
        </div>

        <!-- Row 2: Human Exclude -->
        <div style="display:grid;grid-template-columns:90px 1fr 1fr;gap:4px;">
            <div style="display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:0.7rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;">Human:<br>Exclude</div>
            <div class="confusion-cell disagreement" onclick="filterByQuadrant('Exclude','Include')" title="LLM klassifiziert zu grosszuegig -- Klick zum Filtern" style="border-top-width:4px;">
                <span class="cell-count" style="color:#dc2626;">${ei}</span>
                <span class="cell-label">LLM overclassifies</span>
                <span class="cell-pct">${pct(ei)}</span>
            </div>
            <div class="confusion-cell agreement" onclick="filterByQuadrant('Exclude','Exclude')" title="Click to filter papers">
                <span class="cell-count">${ee}</span>
                <span class="cell-label">Agreement</span>
                <span class="cell-pct">${pct(ee)}</span>
            </div>
        </div>

        <p style="font-size:0.65rem;color:var(--gray-400);margin-top:0.75rem;text-align:center;">
            Klick auf eine Zelle filtert den Papers-Tab &bull; n = ${total} Papers
        </p>
    `;
}

// ---- Quadrant filter (from confusion matrix) ----

function filterByQuadrant(humanDec, llmDec) {
    switchTab('papers');
    // Apply filter directly
    const filtered = allPapers.filter(p => {
        if (!p.benchmark.has_human || !p.human || !p.human.decision) return false;
        const hNorm = p.human.decision === 'Include' ? 'Include' : 'Exclude';
        const lNorm = p.llm.decision === 'Include' ? 'Include' : 'Exclude';
        return hNorm === humanDec && lNorm === llmDec;
    });
    filteredPapers = filtered;
    // Update filter UI to reflect
    const decEl = document.getElementById('filter-decision');
    if (decEl) decEl.value = llmDec;
    const humEl = document.getElementById('filter-human');
    if (humEl) humEl.value = 'has_human';
    // Reset category chips
    activeCategories.clear();
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    renderPapers(filteredPapers);
}

// ---- Disagreements Table ----

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

    const sevOrder = { high: 0, medium: 1, low: 2 };
    disagreements.sort((a, b) => {
        const sa = sevOrder[a.benchmark.severity] ?? 3;
        const sb = sevOrder[b.benchmark.severity] ?? 3;
        return sa !== sb ? sa - sb : a.title.localeCompare(b.title);
    });

    if (disagreements.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-400);padding:1rem;">Keine Disagreements fuer diesen Filter.</p>';
        return;
    }

    const rows = disagreements.map(p => {
        const sev = p.benchmark.severity || '';
        const sevClass = `severity-${sev}`;
        const disType = (p.benchmark.disagreement_type || '').replace(/_/g, ' ');
        const cats = (p.benchmark.affected_categories || []).slice(0, 3).join(', ');
        const humanDec = p.human ? p.human.decision : '';
        const llmDec = p.llm.decision;
        const safeId = p.id.replace(/'/g, "\\'");

        return `<tr onclick="window._openPaper('${safeId}')" style="cursor:pointer;">
            <td class="title-cell" title="${escapeHtml(p.title)}">${escapeHtml(p.title.substring(0, 55))}${p.title.length > 55 ? '...' : ''}</td>
            <td style="font-size:0.75rem;">${escapeHtml((p.author_year || '').substring(0, 22))}</td>
            <td><span class="decision-badge ${llmDec === 'Include' ? 'badge-llm-include' : 'badge-llm-exclude'}" style="font-size:0.65rem;">${llmDec}</span></td>
            <td><span class="decision-badge ${humanDec === 'Include' ? 'badge-human-include' : 'badge-human-exclude'}" style="font-size:0.65rem;">${humanDec}</span></td>
            <td style="font-size:0.7rem;color:var(--gray-500);">${disType}</td>
            <td><span class="severity-badge ${sevClass}">${sev}</span></td>
            <td style="font-size:0.7rem;color:var(--gray-400);">${escapeHtml(cats)}</td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <table class="disagreements-table">
            <thead>
                <tr>
                    <th>Titel</th>
                    <th>Autor</th>
                    <th>LLM</th>
                    <th>Human</th>
                    <th>Typ</th>
                    <th>Severity</th>
                    <th>Kategorien</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <p style="font-size:0.7rem;color:var(--gray-400);margin-top:0.5rem;">
            ${disagreements.length} Disagreements &bull; Klick auf Zeile &rarr; Paper-Detail
        </p>
    `;

    // Helper for row onclick (avoids inline string escaping issues)
    window._openPaper = function(id) {
        const paper = allPapers.find(x => x.id === id);
        if (paper) showPaperDetail(paper);
    };
}

// =============================================
// RELATED PAPERS (used in modal)
// =============================================

function addRelatedPapersSection(paper) {
    if (!paper.llm.categories || paper.llm.categories.length === 0) return '';

    const related = allPapers
        .filter(p => p.id !== paper.id)
        .map(p => ({
            paper: p,
            shared: paper.llm.categories.filter(cat => p.llm.categories.includes(cat)).length
        }))
        .filter(r => r.shared >= 2)
        .sort((a, b) => b.shared - a.shared)
        .slice(0, 3);

    if (related.length === 0) return '';

    const items = related.map(r => {
        const safeId = r.paper.id.replace(/'/g, "\\'");
        return `<li onclick="window._openPaper('${safeId}')" style="cursor:pointer;color:var(--primary);padding:2px 0;list-style:disc;">
            ${escapeHtml(r.paper.author_year)} &mdash; ${escapeHtml(r.paper.title.substring(0, 60))}&hellip;
            <span style="font-size:0.7rem;color:var(--gray-400);">(${r.shared} gemeinsame Kategorien)</span>
        </li>`;
    }).join('');

    return `<div class="detail-section"><h3>Verwandte Papers</h3><ul style="padding-left:1.5rem;">${items}</ul></div>`;
}

window.filterByQuadrant = filterByQuadrant;
window.initializeBenchmark = initializeBenchmark;
window.addRelatedPapersSection = addRelatedPapersSection;
