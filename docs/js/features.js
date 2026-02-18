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
    run('radar', renderPerspectiveRadar);
    run('overlap', renderOverlapTreemap);
    run('kappa-chart', renderKappaChart);
    run('disagreements', renderDisagreementsTable);
    const cm = vaultMeta.confusion_matrix || {};
    const dis = allPapers.filter(p => p.benchmark.has_human && p.benchmark.agreement === false).length;
    console.log(`[Benchmark] ok=[${ok.join(',')}]${fail.length ? ' FAIL=['+fail.join(',')+']' : ''} | κ=${(vaultMeta.kappa_overall||0).toFixed(3)} dis=${dis} II=${cm.Include_Include} EI=${cm.Exclude_Include}`);

    const sev = document.getElementById('filter-severity');
    if (sev) sev.addEventListener('change', renderDisagreementsTable);
}

// ---- Metric Tiles ----

function renderBenchmarkMetrics() {
    const container = document.getElementById('benchmark-metrics');
    if (!container) return;

    const cm = vaultMeta.confusion_matrix || {};
    const ii = cm.Include_Include || 0;
    const ei = cm.Exclude_Include || 0; // nur LLM Include
    const ie = cm.Include_Exclude || 0; // nur Human Include
    const benchPapers = vaultMeta.benchmark_papers || 0;
    const llmRate = vaultMeta.llm_include_rate || 0;
    const humanRate = vaultMeta.human_include_rate || 0;
    const kappa = (vaultMeta.kappa_overall || 0).toFixed(3);

    container.innerHTML = `
        <div class="metric-tile">
            <span class="metric-value" style="color:#10b981;">${ii}</span>
            <span class="metric-label">Gemeinsamer Kern</span>
            <span class="metric-sub">beide: Include</span>
        </div>
        <div class="metric-tile">
            <span class="metric-value" style="color:#3b82f6;">${ei}</span>
            <span class="metric-label">LLM-Kandidaten</span>
            <span class="metric-sub">nur LLM: Include</span>
        </div>
        <div class="metric-tile">
            <span class="metric-value" style="color:#f97316;">${ie}</span>
            <span class="metric-label">Human-Signal</span>
            <span class="metric-sub">nur Human: Include</span>
        </div>
        <div class="metric-tile">
            <span class="metric-value kappa-value">${kappa}</span>
            <span class="metric-label">Cohen's Kappa</span>
            <span class="metric-sub">LLM ${llmRate}% vs. Human ${humanRate}%</span>
        </div>
    `;
}

// ---- Perspektiv-Fingerabdruck: Radar-Chart ----

let radarChartInstance = null;

function renderPerspectiveRadar() {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;

    const CATS = Object.keys(kappas);
    const humanRates = CATS.map(cat => Math.round(kappas[cat].human_yes_rate * 100));
    const agentRates = CATS.map(cat => Math.round(kappas[cat].agent_yes_rate * 100));
    const labels = CATS.map(c => c.replace(/_/g, ' '));

    if (radarChartInstance) { radarChartInstance.destroy(); radarChartInstance = null; }

    radarChartInstance = new Chart(canvas, {
        type: 'radar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Human-Perspektive',
                    data: humanRates,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5,150,105,0.12)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#059669'
                },
                {
                    label: 'LLM-Perspektive',
                    data: agentRates,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.10)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#3b82f6'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 } } },
                tooltip: { callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.r}%`
                }}
            },
            scales: {
                r: {
                    beginAtZero: true, max: 100,
                    ticks: { stepSize: 25, callback: v => v + '%', font: { size: 9 } },
                    pointLabels: { font: { size: 10 } }
                }
            }
        }
    });
}

// ---- Overlap-Treemap (ersetzt Confusion Matrix) ----

function renderOverlapTreemap() {
    const container = document.getElementById('confusion-matrix-container');
    if (!container) return;

    const cm = vaultMeta.confusion_matrix || {};
    const ii = cm.Include_Include || 0;  // Gemeinsamer Kern
    const ei = cm.Exclude_Include || 0;  // nur LLM Include
    const ie = cm.Include_Exclude || 0;  // nur Human Include
    const ee = cm.Exclude_Exclude || 0;  // beide Exclude
    const total = ii + ei + ie + ee;

    function pct(n) { return total ? Math.round(n / total * 100) : 0; }

    // Proportionale Zellgroessen via fr-Einheiten
    const colLeft = ii + ie;   // Human-Include-Seite
    const colRight = ei + ee;  // Human-Exclude-Seite

    function cell(count, label, desc, color, light, quadrant) {
        const safeQ = quadrant.replace(/,/g, "','");
        return `
        <div onclick="filterByQuadrant('${safeQ.split("','")[0]}','${safeQ.split("','")[1]}')"
             title="${desc} -- Klick zum Filtern"
             style="background:${light};border:2px solid ${color};border-radius:6px;padding:0.75rem 0.5rem;
                    cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;
                    min-height:90px;transition:opacity 0.15s;"
             onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
            <span style="font-size:1.6rem;font-weight:700;color:${color};">${count}</span>
            <span style="font-size:0.75rem;font-weight:600;color:${color};text-align:center;margin-top:2px;">${label}</span>
            <span style="font-size:0.65rem;color:#6b7280;text-align:center;margin-top:2px;">${pct(count)}% &bull; ${desc}</span>
        </div>`;
    }

    container.innerHTML = `
        <div style="display:grid;grid-template-columns:${colLeft}fr ${colRight}fr;gap:6px;margin-bottom:6px;">
            <div style="text-align:center;font-size:0.65rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;padding:2px 0;">Human: Include</div>
            <div style="text-align:center;font-size:0.65rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;padding:2px 0;">Human: Exclude</div>
        </div>
        <div style="display:grid;grid-template-columns:${colLeft}fr ${colRight}fr;grid-template-rows:${Math.max(ii,ei)}fr ${Math.max(ie,ee)}fr;gap:6px;">
            ${cell(ii, 'Gemeinsamer Kern', 'beide Include', '#10b981', '#d1fae5', 'Include,Include')}
            ${cell(ei, 'LLM-Kandidaten', 'nur LLM Include', '#3b82f6', '#dbeafe', 'Exclude,Include')}
            ${cell(ie, 'Human-Signal', 'nur Human Include', '#f97316', '#ffedd5', 'Include,Exclude')}
            ${cell(ee, 'Beide Exclude', 'Konsens-Ausschluss', '#6b7280', '#f3f4f6', 'Exclude,Exclude')}
        </div>
        <p style="font-size:0.65rem;color:#9ca3af;margin-top:0.5rem;text-align:center;">
            Zellgroesse proportional zur Anzahl &bull; n=${total} Papers &bull; Klick filtert Papers-Tab
        </p>
    `;
}

// ---- Kappa Chart (technisches Detail, Chart.js horizontal bar) ----

let kappaChartInstance = null;

function renderKappaChart() {
    const container = document.getElementById('kappa-chart-container');
    if (!container) return;

    const kappaData = Object.entries(kappas).map(([cat, data]) => ({
        category: cat.replace(/_/g, ' '),
        kappa: data.kappa,
        agreement: data.agreement_pct,
        humanRate: Math.round(data.human_yes_rate * 100),
        agentRate: Math.round(data.agent_yes_rate * 100),
        n: data.n
    })).sort((a, b) => a.kappa - b.kappa);

    container.innerHTML = '<canvas id="kappa-canvas"></canvas>';
    const canvas = document.getElementById('kappa-canvas');

    if (kappaChartInstance) { kappaChartInstance.destroy(); kappaChartInstance = null; }

    // Color by divergence direction (not by kappa sign alone)
    const colors = kappaData.map(d => {
        const diff = d.agentRate - d.humanRate;
        if (Math.abs(diff) < 5) return '#94a3b8';      // grau: kein relevanter Unterschied
        return diff > 0 ? '#3b82f6' : '#f97316';        // blau: LLM mehr / orange: Human mehr
    });

    kappaChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: kappaData.map(d => d.category),
            datasets: [{
                label: "Cohen's Kappa",
                data: kappaData.map(d => d.kappa),
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: {
                    label: (ctx) => {
                        const d = kappaData[ctx.dataIndex];
                        const diff = d.agentRate - d.humanRate;
                        return [
                            `Kappa: ${d.kappa.toFixed(3)}`,
                            `Human: ${d.humanRate}% | LLM: ${d.agentRate}% (${diff > 0 ? '+' : ''}${diff}pp)`,
                            `n = ${d.n}`
                        ];
                    }
                }}
            },
            scales: {
                x: { beginAtZero: false, ticks: { callback: v => v.toFixed(2) } },
                y: { grid: { display: false }, ticks: { font: { size: 11 } } }
            }
        }
    });

    container.style.height = '300px';
    container.style.position = 'relative';
}

// ---- Quadrant filter ----

function filterByQuadrant(humanDec, llmDec) {
    switchTab('papers');
    const filtered = allPapers.filter(p => {
        if (!p.benchmark.has_human || !p.human || !p.human.decision) return false;
        const hNorm = p.human.decision === 'Include' ? 'Include' : 'Exclude';
        const lNorm = p.llm.decision === 'Include' ? 'Include' : 'Exclude';
        return hNorm === humanDec && lNorm === llmDec;
    });
    filteredPapers = filtered;
    const decEl = document.getElementById('filter-decision');
    if (decEl) decEl.value = llmDec;
    const humEl = document.getElementById('filter-human');
    if (humEl) humEl.value = 'has_human';
    activeCategories.clear();
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    renderPapers(filteredPapers);
}

// ---- Divergenz-Faelle Tabelle ----

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
        container.innerHTML = '<p style="color:var(--gray-400);padding:1rem;">Keine Eintraege fuer diesen Filter.</p>';
        return;
    }

    const rows = disagreements.map(p => {
        const sev = p.benchmark.severity || '';
        const sevClass = `severity-${sev}`;
        const cats = (p.benchmark.affected_categories || []).slice(0, 3).join(', ');
        const humanDec = p.human ? p.human.decision : '';
        const llmDec = p.llm.decision;
        const safeId = p.id.replace(/'/g, "\\'");
        // Divergenztyp aus Daten: LLM Include / Human Exclude oder umgekehrt
        const divType = llmDec === 'Include' ? 'LLM-Kandidat' : 'Human-Signal';

        return `<tr onclick="window._openPaper('${safeId}')" style="cursor:pointer;">
            <td class="title-cell" title="${escapeHtml(p.title)}">${escapeHtml(p.title.substring(0, 55))}${p.title.length > 55 ? '...' : ''}</td>
            <td style="font-size:0.75rem;">${escapeHtml((p.author_year || '').substring(0, 22))}</td>
            <td><span class="decision-badge ${llmDec === 'Include' ? 'badge-llm-include' : 'badge-llm-exclude'}" style="font-size:0.65rem;">${llmDec}</span></td>
            <td><span class="decision-badge ${humanDec === 'Include' ? 'badge-human-include' : 'badge-human-exclude'}" style="font-size:0.65rem;">${humanDec}</span></td>
            <td style="font-size:0.7rem;color:var(--gray-500);">${divType}</td>
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
            ${disagreements.length} Divergenz-Faelle &bull; Klick auf Zeile &rarr; Paper-Detail
        </p>
    `;

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
