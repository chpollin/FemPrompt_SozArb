// features.js - Bewertungsvergleich Tab for Evidence Companion
// Uses Chart.js (already loaded) for all charts

(function() {
'use strict';

var EC = window.EC;

// Design system colors (mirroring CSS variables)
var COLORS = {
    success: '#5b8c5a',    // var(--success) sage green
    info: '#4b7bab',       // var(--info) steel blue
    warning: '#d4943a',    // var(--warning) amber
    gray400: '#a8a29e',    // var(--gray-400)
    gray500: '#78716c',    // var(--gray-500)
};

// =============================================
// BENCHMARK TAB
// =============================================

function initializeBenchmark() {
    var meta = EC.getMeta();
    var kappas = EC.getKappas();
    if (!meta || !kappas) { console.warn('[Benchmark] no data -- skipping'); return; }

    var ok = [], fail = [];
    var run = function(label, fn) {
        try { fn(); ok.push(label); }
        catch(e) { fail.push(label); console.error('[Benchmark] ' + label + ':', e); }
    };
    run('metrics', renderBenchmarkMetrics);
    run('patterns', renderDivergencePatterns);
    run('slope', renderSlopeChart);
    run('overlap', renderOverlapTreemap);
    run('kappa-chart', renderKappaChart);
    run('disagreements', renderDisagreementsTable);

    var cm = meta.confusion_matrix || {};
    var dis = EC.getAllPapers().filter(function(p) {
        return p.benchmark.has_human && p.benchmark.agreement === false;
    }).length;
    console.log('[Benchmark] ok=[' + ok.join(',') + ']' +
        (fail.length ? ' FAIL=[' + fail.join(',') + ']' : '') +
        ' | k=' + (meta.kappa_overall || 0).toFixed(3) + ' dis=' + dis +
        ' II=' + (cm.Include_Include || 0) + ' EI=' + (cm.Exclude_Include || 0));

    var sev = document.getElementById('filter-severity');
    if (sev) sev.addEventListener('change', renderDisagreementsTable);

    var patFilter = document.getElementById('filter-pattern');
    if (patFilter) patFilter.addEventListener('change', renderDisagreementsTable);

    // Lazy-render kappa chart on details open
    var kappaDetails = document.getElementById('kappa-details');
    if (kappaDetails) {
        kappaDetails.addEventListener('toggle', function() {
            if (kappaDetails.open && !kappaChartInstance) renderKappaChart();
        });
    }
}

// ---- Metric Tiles ----

function renderBenchmarkMetrics() {
    var container = document.getElementById('benchmark-metrics');
    if (!container) return;

    var meta = EC.getMeta();
    var cm = meta.confusion_matrix || {};
    var ii = cm.Include_Include || 0;
    var ei = cm.Exclude_Include || 0;
    var ie = cm.Include_Exclude || 0;
    var kappa = (meta.kappa_overall || 0).toFixed(3);
    var llmRate = meta.llm_include_rate || 0;
    var humanRate = meta.human_include_rate || 0;

    container.innerHTML =
        '<div class="metric-tile">' +
            '<span class="metric-value" style="color:var(--success);">' + ii + '</span>' +
            '<span class="metric-label">Gemeinsamer Kern</span>' +
            '<span class="metric-sub">beide: Include</span>' +
        '</div>' +
        '<div class="metric-tile">' +
            '<span class="metric-value" style="color:var(--info);">' + ei + '</span>' +
            '<span class="metric-label">LLM-Kandidaten</span>' +
            '<span class="metric-sub">nur LLM: Include</span>' +
        '</div>' +
        '<div class="metric-tile">' +
            '<span class="metric-value" style="color:var(--warning);">' + ie + '</span>' +
            '<span class="metric-label">Human-Signal</span>' +
            '<span class="metric-sub">nur Human: Include</span>' +
        '</div>' +
        '<div class="metric-tile">' +
            '<span class="metric-value kappa-value">' + kappa + '</span>' +
            '<span class="metric-label">Cohen\'s Kappa</span>' +
            '<span class="metric-sub">LLM ' + llmRate + '% vs. Human ' + humanRate + '%</span>' +
        '</div>';
}

// ---- Divergenz-Muster Visualization ----

var PATTERN_COLORS = {
    'Semantische Expansion': { bg: '#4b7bab', badge: 'pattern-badge-semantic' },
    'Keyword-Inklusion':     { bg: '#d4943a', badge: 'pattern-badge-keyword' },
    'Implizite Feldzugehoerigkeit': { bg: '#78716c', badge: 'pattern-badge-implicit' }
};

var PATTERN_DESCRIPTIONS = {
    'Semantische Expansion': 'Das LLM interpretiert Kategorien breiter -- es erkennt Relevanz, wo disziplinaeres Fachwissen engere Grenzen zieht.',
    'Keyword-Inklusion': 'Das LLM schliesst von Schluesselwoertern auf Relevanz, ohne den inhaltlichen Kontext zu pruefen.',
    'Implizite Feldzugehoerigkeit': 'Das LLM ordnet Papers einem Feld zu, das implizit mitschwingt, aber nicht explizit adressiert wird.'
};

var activePattern = null;

function renderDivergencePatterns() {
    var container = document.getElementById('pattern-viz-container');
    if (!container) return;

    var patterns = EC.getDivergencePatterns();
    if (!patterns || !patterns.pattern_distribution) {
        document.getElementById('pattern-viz-card').style.display = 'none';
        return;
    }

    var dist = patterns.pattern_distribution;
    var total = 0;
    var order = ['Semantische Expansion', 'Keyword-Inklusion', 'Implizite Feldzugehoerigkeit'];
    order.forEach(function(k) { total += (dist[k] || 0); });
    if (total === 0) return;

    // Proportional bar
    var barHtml = '<div class="pattern-bar">';
    order.forEach(function(name) {
        var count = dist[name] || 0;
        var pct = (count / total * 100).toFixed(1);
        var col = PATTERN_COLORS[name] || { bg: '#999' };
        barHtml += '<div class="pattern-segment" data-pattern="' + EC.escapeHtml(name) + '" ' +
            'style="width:' + pct + '%;background:' + col.bg + ';">' +
            '<span>' + count + ' (' + Math.round(pct) + '%)</span></div>';
    });
    barHtml += '</div>';

    // Cards
    var cardsHtml = '<div class="pattern-cards">';
    order.forEach(function(name) {
        var count = dist[name] || 0;
        var pct = Math.round(count / total * 100);
        var col = PATTERN_COLORS[name] || { bg: '#999' };
        cardsHtml += '<div class="pattern-card" data-pattern="' + EC.escapeHtml(name) + '">' +
            '<div class="pattern-card-header">' +
                '<span class="pattern-card-dot" style="background:' + col.bg + ';"></span>' +
                '<span class="pattern-card-name">' + EC.escapeHtml(name) + '</span>' +
                '<span class="pattern-card-count">' + count + ' (' + pct + '%)</span>' +
            '</div>' +
            '<p class="pattern-card-desc">' + (PATTERN_DESCRIPTIONS[name] || '') + '</p>' +
        '</div>';
    });
    cardsHtml += '</div>';

    container.innerHTML = barHtml + cardsHtml;

    // Click handlers: filter disagreements table by pattern
    container.querySelectorAll('[data-pattern]').forEach(function(el) {
        el.addEventListener('click', function() {
            var pat = el.dataset.pattern;
            if (activePattern === pat) {
                activePattern = null;
            } else {
                activePattern = pat;
            }
            // Update active state on cards
            container.querySelectorAll('.pattern-card').forEach(function(c) {
                c.classList.toggle('active', c.dataset.pattern === activePattern);
            });
            // Update pattern filter dropdown if present
            var patFilter = document.getElementById('filter-pattern');
            if (patFilter) patFilter.value = activePattern || 'all';
            renderDisagreementsTable();
        });
    });
}

// ---- Kategorie-Divergenz: Slope Chart ----

var radarChartInstance = null;

var highlightedCategory = null;

function renderSlopeChart() {
    var canvas = document.getElementById('radar-chart');
    if (!canvas) return;

    var kappas = EC.getKappas();
    var CATS = Object.keys(kappas);

    var datasets = CATS.map(function(cat) {
        var d = kappas[cat];
        var diff = d.agent_yes_rate - d.human_yes_rate;
        var color = Math.abs(diff) < 5 ? COLORS.gray400
                  : diff > 0 ? COLORS.info
                  : COLORS.warning;
        return {
            label: cat.replace(/_/g, ' '),
            data: [d.human_yes_rate, d.agent_yes_rate],
            borderColor: color,
            backgroundColor: 'transparent',
            borderWidth: Math.abs(diff) > 20 ? 2.5 : 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: color,
            tension: 0,
            _catKey: cat,
            _diff: diff
        };
    });

    if (radarChartInstance) { radarChartInstance.destroy(); radarChartInstance = null; }

    radarChartInstance = new Chart(canvas, {
        type: 'line',
        data: { labels: ['Human', 'LLM'], datasets: datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'nearest', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: {
                    label: function(ctx) {
                        var cat = CATS[ctx.datasetIndex];
                        var d = kappas[cat];
                        var diff = (d.agent_yes_rate - d.human_yes_rate).toFixed(1);
                        return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + '% (' + (diff > 0 ? '+' : '') + diff + 'pp)';
                    }
                }}
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: false, min: 0, max: 100,
                     ticks: { callback: function(v) { return v + '%'; } },
                     title: { display: true, text: 'Anteil Ja-Klassifikationen (%)' } }
            },
            onHover: function(evt, elements) {
                if (highlightedCategory) return; // don't override click highlight
                if (elements.length > 0) {
                    var idx = elements[0].datasetIndex;
                    slopeHighlight(idx);
                } else {
                    slopeReset();
                }
            },
            onClick: function(evt, elements) {
                if (elements.length > 0) {
                    var idx = elements[0].datasetIndex;
                    var cat = CATS[idx];
                    if (highlightedCategory === cat) {
                        highlightedCategory = null;
                        slopeReset();
                    } else {
                        highlightedCategory = cat;
                        slopeHighlight(idx);
                        filterDisagreementsByCategory(cat);
                    }
                } else {
                    highlightedCategory = null;
                    slopeReset();
                }
            }
        },
        plugins: [{
            id: 'slope-labels',
            afterDatasetsDraw: function(chart) {
                var ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px Inter, sans-serif';
                ctx.textAlign = 'left';
                var labels = [];
                chart.data.datasets.forEach(function(ds, i) {
                    var meta = chart.getDatasetMeta(i);
                    if (!meta.data.length) return;
                    var last = meta.data[meta.data.length - 1];
                    var diff = ds._diff;
                    var diffLabel = Math.abs(diff) > 15 ? ' ' + (diff > 0 ? '+' : '') + Math.round(diff) + 'pp' : '';
                    labels.push({ text: ds.label + diffLabel, x: last.x + 6, y: last.y + 3, color: ds.borderColor, idx: i });
                });
                labels.sort(function(a, b) { return a.y - b.y; });
                for (var i = 1; i < labels.length; i++) {
                    if (labels[i].y - labels[i - 1].y < 13) {
                        labels[i].y = labels[i - 1].y + 13;
                    }
                }
                labels.forEach(function(l) {
                    ctx.fillStyle = l.color;
                    ctx.fillText(l.text, l.x, l.y);
                });
                ctx.restore();
            }
        }]
    });
}

function slopeHighlight(idx) {
    if (!radarChartInstance) return;
    radarChartInstance.data.datasets.forEach(function(ds, i) {
        var meta = radarChartInstance.getDatasetMeta(i);
        if (i === idx) {
            meta.dataset.options.borderWidth = 3;
            meta.dataset.options.borderColor = ds.borderColor;
        } else {
            meta.dataset.options.borderWidth = 1;
            meta.dataset.options.borderColor = ds.borderColor + '26'; // ~15% opacity
        }
    });
    radarChartInstance.update('none');
}

function slopeReset() {
    if (!radarChartInstance) return;
    radarChartInstance.data.datasets.forEach(function(ds, i) {
        var meta = radarChartInstance.getDatasetMeta(i);
        var diff = ds._diff || 0;
        meta.dataset.options.borderWidth = Math.abs(diff) > 20 ? 2.5 : 1.5;
        meta.dataset.options.borderColor = ds.borderColor;
    });
    radarChartInstance.update('none');
}

function filterDisagreementsByCategory(cat) {
    // Scroll to disagreements table and set visual hint
    var tableCard = document.getElementById('disagreements-table-container');
    if (tableCard) {
        tableCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ---- Overlap-Treemap (Confusion Matrix) ----

function renderOverlapTreemap() {
    var container = document.getElementById('confusion-matrix-container');
    if (!container) return;

    var meta = EC.getMeta();
    var cm = meta.confusion_matrix || {};
    var ii = cm.Include_Include || 0;
    var ei = cm.Exclude_Include || 0;
    var ie = cm.Include_Exclude || 0;
    var ee = cm.Exclude_Exclude || 0;
    var total = ii + ei + ie + ee;

    function pct(n) { return total ? Math.round(n / total * 100) : 0; }

    var colLeft = ii + ie;
    var colRight = ei + ee;

    function cell(count, label, desc, cssColor, lightBg, quadrant) {
        var parts = quadrant.split(',');
        return '<div onclick="filterByQuadrant(\'' + parts[0] + '\',\'' + parts[1] + '\')"' +
            ' title="' + desc + ' -- Klick zum Filtern"' +
            ' style="background:' + lightBg + ';border:2px solid ' + cssColor + ';border-radius:6px;padding:0.75rem 0.5rem;' +
            'cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
            'min-height:90px;transition:opacity 0.15s;"' +
            ' onmouseover="this.style.opacity=\'0.8\'" onmouseout="this.style.opacity=\'1\'">' +
            '<span style="font-size:1.6rem;font-weight:700;color:' + cssColor + ';">' + count + '</span>' +
            '<span style="font-size:0.75rem;font-weight:600;color:' + cssColor + ';text-align:center;margin-top:2px;">' + label + '</span>' +
            '<span style="font-size:0.65rem;color:var(--gray-500);text-align:center;margin-top:2px;">' + pct(count) + '% &bull; ' + desc + '</span>' +
        '</div>';
    }

    container.innerHTML =
        '<div style="display:grid;grid-template-columns:auto ' + colLeft + 'fr ' + colRight + 'fr;gap:6px;margin-bottom:6px;">' +
            '<div></div>' +
            '<div style="text-align:center;font-size:0.65rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;padding:2px 0;">Human: Include</div>' +
            '<div style="text-align:center;font-size:0.65rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;padding:2px 0;">Human: Exclude</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:auto ' + colLeft + 'fr ' + colRight + 'fr;grid-template-rows:' + Math.max(ii,ei) + 'fr ' + Math.max(ie,ee) + 'fr;gap:6px;">' +
            '<div style="writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);text-align:center;font-size:0.65rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;padding:0 4px;display:flex;align-items:center;justify-content:center;">LLM: Include</div>' +
            cell(ii, 'Gemeinsamer Kern', 'beide Include', 'var(--success)', '#d1fae5', 'Include,Include') +
            cell(ei, 'LLM-Kandidaten', 'nur LLM Include', 'var(--info)', '#dbeafe', 'Exclude,Include') +
            '<div style="writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);text-align:center;font-size:0.65rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.04em;padding:0 4px;display:flex;align-items:center;justify-content:center;">LLM: Exclude</div>' +
            cell(ie, 'Human-Signal', 'nur Human Include', 'var(--warning)', '#ffedd5', 'Include,Exclude') +
            cell(ee, 'Beide Exclude', 'Konsens-Ausschluss', 'var(--gray-500)', 'var(--gray-100)', 'Exclude,Exclude') +
        '</div>' +
        '<p style="font-size:0.65rem;color:var(--gray-400);margin-top:0.5rem;text-align:center;">' +
            'Zellgroesse proportional zur Anzahl &bull; n=' + total + ' Papers &bull; Klick filtert Papers-Tab' +
        '</p>';
}

// ---- Kappa Chart (horizontal bar) ----

var kappaChartInstance = null;

function renderKappaChart() {
    var container = document.getElementById('kappa-chart-container');
    if (!container) return;

    var kappas = EC.getKappas();
    var kappaData = Object.keys(kappas).map(function(cat) {
        var data = kappas[cat];
        return {
            category: cat.replace(/_/g, ' '),
            kappa: data.kappa,
            agreement: data.agreement_pct,
            humanRate: Math.round(data.human_yes_rate),
            agentRate: Math.round(data.agent_yes_rate),
            n: data.n
        };
    }).sort(function(a, b) { return a.kappa - b.kappa; });

    container.innerHTML = '<canvas id="kappa-canvas"></canvas>';
    var canvas = document.getElementById('kappa-canvas');

    if (kappaChartInstance) { kappaChartInstance.destroy(); kappaChartInstance = null; }

    var colors = kappaData.map(function(d) {
        var diff = d.agentRate - d.humanRate;
        if (Math.abs(diff) < 5) return COLORS.gray400;
        return diff > 0 ? COLORS.info : COLORS.warning;
    });

    kappaChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: kappaData.map(function(d) { return d.category; }),
            datasets: [{
                label: "Cohen's Kappa",
                data: kappaData.map(function(d) { return d.kappa; }),
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
                    label: function(ctx) {
                        var d = kappaData[ctx.dataIndex];
                        var diff = d.agentRate - d.humanRate;
                        return [
                            'Kappa: ' + d.kappa.toFixed(3),
                            'Human: ' + d.humanRate + '% | LLM: ' + d.agentRate + '% (' + (diff > 0 ? '+' : '') + diff + 'pp)',
                            'n = ' + d.n
                        ];
                    }
                }}
            },
            scales: {
                x: { beginAtZero: false, ticks: { callback: function(v) { return v.toFixed(2); } } },
                y: { grid: { display: false }, ticks: { font: { size: 11 } } }
            }
        }
    });

    container.style.height = '300px';
    container.style.position = 'relative';
}

// ---- Quadrant filter ----

function filterByQuadrant(humanDec, llmDec) {
    if (window.switchView) window.switchView('korpus');
    var filtered = EC.getAllPapers().filter(function(p) {
        if (!p.benchmark.has_human || !p.human || !p.human.decision) return false;
        var hNorm = p.human.decision === 'Include' ? 'Include' : 'Exclude';
        var lNorm = p.llm.decision === 'Include' ? 'Include' : 'Exclude';
        return hNorm === humanDec && lNorm === llmDec;
    });
    EC.setFilteredPapers(filtered);
    var decEl = document.getElementById('filter-decision');
    if (decEl) decEl.value = llmDec;
    var humEl = document.getElementById('filter-human');
    if (humEl) humEl.value = 'has_human';
    EC.getActiveCategories().clear();
    document.querySelectorAll('.category-chip').forEach(function(c) { c.classList.remove('active'); });
    EC.renderPapers(filtered);
}

// ---- Divergenz-Faelle Tabelle ----

function renderDisagreementsTable() {
    var container = document.getElementById('disagreements-table-container');
    if (!container) return;

    var severityFilter = document.getElementById('filter-severity');
    var sevVal = severityFilter ? severityFilter.value : 'all';
    var patternFilter = document.getElementById('filter-pattern');
    var patVal = activePattern || (patternFilter ? patternFilter.value : 'all');

    var disagreements = EC.getAllPapers().filter(function(p) {
        return p.benchmark.has_human && p.benchmark.agreement === false;
    });

    if (sevVal !== 'all') {
        disagreements = disagreements.filter(function(p) {
            // Use enriched severity (numeric) or benchmark severity
            var sev = p.divergence ? p.divergence.severity : null;
            var sevLabel = sev === 3 ? 'high' : sev === 2 ? 'medium' : sev === 1 ? 'low' : (p.benchmark.severity || '');
            return sevLabel === sevVal;
        });
    }

    if (patVal !== 'all') {
        disagreements = disagreements.filter(function(p) {
            return p.divergence && p.divergence.pattern === patVal;
        });
    }

    // Sort by pattern group, then severity
    var patOrder = { 'Semantische Expansion': 0, 'Keyword-Inklusion': 1, 'Implizite Feldzugehoerigkeit': 2 };
    disagreements.sort(function(a, b) {
        var pa = a.divergence ? (patOrder[a.divergence.pattern] !== undefined ? patOrder[a.divergence.pattern] : 3) : 3;
        var pb = b.divergence ? (patOrder[b.divergence.pattern] !== undefined ? patOrder[b.divergence.pattern] : 3) : 3;
        if (pa !== pb) return pa - pb;
        var sa = a.divergence ? (4 - (a.divergence.severity || 0)) : 3;
        var sb = b.divergence ? (4 - (b.divergence.severity || 0)) : 3;
        return sa !== sb ? sa - sb : a.title.localeCompare(b.title);
    });

    if (disagreements.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-400);padding:1rem;">Keine Eintraege fuer diesen Filter.</p>';
        return;
    }

    var rows = [];
    var lastPattern = null;
    disagreements.forEach(function(p) {
        var pattern = p.divergence ? p.divergence.pattern : null;
        var patBadge = '';
        if (pattern) {
            var cls = PATTERN_COLORS[pattern] ? PATTERN_COLORS[pattern].badge : '';
            patBadge = '<span class="pattern-badge ' + cls + '">' + EC.escapeHtml(pattern) + '</span>';
        }

        var sev = p.divergence ? p.divergence.severity : null;
        var sevLabel = sev === 3 ? 'high' : sev === 2 ? 'medium' : sev === 1 ? 'low' : (p.benchmark.severity || '');
        var sevClass = 'severity-' + sevLabel;
        var humanDec = p.human ? p.human.decision : '';
        var llmDec = p.llm.decision;
        var safeId = p.id.replace(/'/g, "\\'");
        var divType = llmDec === 'Include' ? 'LLM-Kandidat' : 'Human-Signal';
        var cats = p.divergence && p.divergence.affected_categories
            ? (typeof p.divergence.affected_categories === 'string'
                ? p.divergence.affected_categories.split(',').slice(0, 3).map(function(s) { return s.trim(); }).join(', ')
                : p.divergence.affected_categories.slice(0, 3).join(', '))
            : (p.benchmark.affected_categories || []).slice(0, 3).join(', ');

        rows.push('<tr onclick="window._openPaper(\'' + safeId + '\')" style="cursor:pointer;">' +
            '<td class="title-cell" title="' + EC.escapeHtml(p.title) + '">' + EC.escapeHtml(p.title.substring(0, 50)) + (p.title.length > 50 ? '...' : '') + '</td>' +
            '<td style="font-size:0.75rem;">' + EC.escapeHtml((p.author_year || '').substring(0, 22)) + '</td>' +
            '<td><span class="decision-badge ' + (llmDec === 'Include' ? 'badge-llm-include' : 'badge-llm-exclude') + '" style="font-size:0.65rem;">' + llmDec + '</span></td>' +
            '<td><span class="decision-badge ' + (humanDec === 'Include' ? 'badge-human-include' : 'badge-human-exclude') + '" style="font-size:0.65rem;">' + humanDec + '</span></td>' +
            '<td>' + patBadge + '</td>' +
            '<td><span class="severity-badge ' + sevClass + '">' + sevLabel + '</span></td>' +
            '<td style="font-size:0.7rem;color:var(--gray-400);">' + EC.escapeHtml(cats) + '</td>' +
        '</tr>');
    });

    container.innerHTML =
        '<table class="disagreements-table">' +
            '<thead><tr>' +
                '<th>Titel</th><th>Autor</th><th>LLM</th><th>Human</th><th>Muster</th><th>Severity</th><th>Kategorien</th>' +
            '</tr></thead>' +
            '<tbody>' + rows.join('') + '</tbody>' +
        '</table>' +
        '<p style="font-size:0.7rem;color:var(--gray-400);margin-top:0.5rem;">' +
            disagreements.length + ' Divergenz-Faelle' +
            (patVal !== 'all' ? ' (' + EC.escapeHtml(patVal) + ')' : '') +
            ' &bull; Klick auf Zeile &rarr; Paper-Detail' +
        '</p>';

    window._openPaper = function(id) {
        var paper = EC.getAllPapers().find(function(x) { return x.id === id; });
        if (paper) EC.showPaperDetail(paper);
    };
}

// Cross-view: filter divergences by pattern (called from wissensnetz)
window.filterDivergencePattern = function(pattern) {
    activePattern = pattern || null;
    var patFilter = document.getElementById('filter-pattern');
    if (patFilter) patFilter.value = activePattern || 'all';
    var container = document.getElementById('pattern-viz-container');
    if (container) {
        container.querySelectorAll('.pattern-card').forEach(function(c) {
            c.classList.toggle('active', c.dataset.pattern === activePattern);
        });
    }
    renderDisagreementsTable();
};

// Expose for HTML onclick and research-app.js lazy-init
window.filterByQuadrant = filterByQuadrant;
window.initializeBenchmark = initializeBenchmark;

})();
