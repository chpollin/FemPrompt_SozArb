(function() { 'use strict';

// ==========================================================================
// State
// ==========================================================================
var appData = null;
var activeView = 'landing';
var selectedPaper = null;
var selectedConcept = null;
var activePatternFilter = 'all';
var activeDtypeFilter = 'all';
var divergenceSearchQuery = '';
var conceptSimulation = null;

// ==========================================================================
// Init
// ==========================================================================
document.addEventListener('DOMContentLoaded', async function() {
    setupViewNavigation();
    setupDivergenceFilters();
    setupConceptControls();

    try {
        var resp = await fetch('data/promptotyping_v2.json');
        if (!resp.ok) throw new Error('Failed to load data');
        appData = await resp.json();
        document.getElementById('loading').style.display = 'none';
        renderActiveView();
    } catch (err) {
        document.getElementById('loading').innerHTML =
            '<p style="color:var(--danger)">Fehler beim Laden: ' + escapeHtml(err.message) + '</p>';
    }
});

// ==========================================================================
// View Navigation
// ==========================================================================
function setupViewNavigation() {
    document.querySelectorAll('.view-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchView(btn.dataset.view);
        });
    });
    // CTA buttons in landing
    document.querySelectorAll('.cta-btn[data-view]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchView(btn.dataset.view);
        });
    });
}

function switchView(viewId) {
    activeView = viewId;
    document.querySelectorAll('.view-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.view === viewId);
    });
    document.querySelectorAll('.view-content').forEach(function(s) {
        s.style.display = s.id === 'view-' + viewId ? '' : 'none';
    });
    renderActiveView();
}

function renderActiveView() {
    if (!appData) return;
    switch (activeView) {
        case 'landing': renderLanding(); break;
        case 'pipeline': renderPipeline(); break;
        case 'journey': renderJourney(); break;
        case 'concepts': renderConcepts(); break;
        case 'divergences': renderDivergences(); break;
    }
}

// ==========================================================================
// Cross-view navigation
// ==========================================================================
function navigateToJourney(paperId) {
    selectedPaper = appData.papers.find(function(p) { return p.id === paperId || p.stem === paperId; });
    switchView('journey');
}

function navigateToConcept(conceptId) {
    selectedConcept = conceptId;
    switchView('concepts');
}

// ==========================================================================
// View 0: Landing
// ==========================================================================
function renderLanding() {
    renderLandingNumbers();
    renderFeaturedPapers();
}

function renderLandingNumbers() {
    var container = document.getElementById('landing-numbers');
    if (!container || container.dataset.rendered) return;
    container.dataset.rendered = 'true';

    var m = appData.meta;
    var patterns = m.pattern_distribution || {};

    container.innerHTML =
        '<div class="metric-card">' +
            '<span class="metric-value">' + m.total_papers + '</span>' +
            '<span class="metric-label">Papers analysiert</span>' +
        '</div>' +
        '<div class="metric-card metric--process">' +
            '<span class="metric-value">5</span>' +
            '<span class="metric-label">Pipeline-Stufen</span>' +
        '</div>' +
        '<div class="metric-card metric--limits">' +
            '<span class="metric-value">' + m.disagreements + '</span>' +
            '<span class="metric-label">Divergenzen</span>' +
            '<span class="metric-detail">' + (patterns['Semantische Expansion'] || 90) + ' davon Semantische Expansion</span>' +
        '</div>';
}

function renderFeaturedPapers() {
    var container = document.getElementById('featured-papers');
    if (!container || container.dataset.rendered) return;
    container.dataset.rendered = 'true';

    var featured = appData.papers.filter(function(p) { return p.featured; });
    if (featured.length === 0) return;

    container.innerHTML = featured.map(function(p) {
        var f = p.featured;
        var humanDecision = p.stages.assessment.human ? p.stages.assessment.human.decision : null;
        return '<div class="featured-card featured--' + f.stance_highlight + '" data-stem="' + escapeHtml(p.stem) + '">' +
            '<div class="featured-stance-bar"></div>' +
            '<h4>' + escapeHtml(truncate(p.title, 80)) + '</h4>' +
            '<p class="featured-author">' + escapeHtml(p.author_year) + '</p>' +
            '<p class="featured-why">' + escapeHtml(f.why) + '</p>' +
            '<div class="featured-badges">' +
                '<span class="badge badge--' + p.stages.assessment.llm.decision.toLowerCase() + '">LLM: ' + p.stages.assessment.llm.decision + '</span>' +
                (humanDecision ? '<span class="badge badge--' + humanDecision.toLowerCase() + '">Human: ' + humanDecision + '</span>' : '') +
            '</div>' +
            '<button class="featured-cta">Journey ansehen</button>' +
        '</div>';
    }).join('');

    container.addEventListener('click', function(e) {
        var card = e.target.closest('.featured-card');
        if (card) navigateToJourney(card.dataset.stem);
    });
}

// ==========================================================================
// View 1: Pipeline (Sankey)
// ==========================================================================
function renderPipeline() {
    var container = document.getElementById('sankey-container');
    if (container.querySelector('svg')) return;

    var flow = appData.pipeline.flow;
    var width = container.clientWidth || 1000;
    var height = 450;

    var svg = d3.select(container).append('svg')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    var margin = { top: 20, right: 160, bottom: 20, left: 20 };
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;

    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var sankey = d3.sankey()
        .nodeId(function(d) { return d.id; })
        .nodeWidth(20)
        .nodePadding(12)
        .extent([[0, 0], [innerW, innerH]]);

    var graph = sankey({
        nodes: flow.nodes.map(function(d) { return Object.assign({}, d); }),
        links: flow.links.map(function(d) { return Object.assign({}, d); })
    });

    var nodeColor = function(d) {
        if (d.id.indexOf('missing') >= 0 || d.id.indexOf('fail') >= 0) return '#ef4444';
        if (d.id === 'disagree') return '#ef4444';
        if (d.id === 'agree') return '#10b981';
        return '#1e40af';
    };

    g.append('g').selectAll('.sankey-link')
        .data(graph.links)
        .join('path')
        .attr('class', 'sankey-link')
        .attr('d', d3.sankeyLinkHorizontal())
        .attr('fill', 'none')
        .attr('stroke', function(d) {
            if (d.target.id.indexOf('missing') >= 0 || d.target.id.indexOf('fail') >= 0)
                return 'rgba(239,68,68,0.4)';
            if (d.target.id === 'disagree') return 'rgba(239,68,68,0.4)';
            return 'rgba(30,64,175,0.3)';
        })
        .attr('stroke-width', function(d) { return Math.max(1, d.width); })
        .style('mix-blend-mode', 'multiply');

    var node = g.append('g').selectAll('.sankey-node')
        .data(graph.nodes)
        .join('g')
        .attr('class', 'sankey-node')
        .attr('transform', function(d) { return 'translate(' + d.x0 + ',' + d.y0 + ')'; });

    node.append('rect')
        .attr('height', function(d) { return Math.max(d.y1 - d.y0, 1); })
        .attr('width', sankey.nodeWidth())
        .attr('fill', nodeColor)
        .attr('rx', 3)
        .on('click', function(event, d) { showStageDetail(d.id); });

    node.append('text')
        .attr('x', sankey.nodeWidth() + 6)
        .attr('y', function(d) { return (d.y1 - d.y0) / 2; })
        .attr('dy', '0.35em')
        .text(function(d) { return d.label; })
        .attr('font-size', '11px')
        .attr('fill', '#374151');
}

function showStageDetail(stageId) {
    var panel = document.getElementById('stage-detail');
    var stageMap = {
        'zotero': 'identification', 'pdfs': 'conversion', 'markdown': 'conversion',
        'knowledge': 'ske', 'assessed_both': 'assessment', 'assessed_llm': 'assessment',
        'agree': 'assessment', 'disagree': 'assessment',
    };
    var pipelineStageId = stageMap[stageId] || stageId;
    var stage = appData.pipeline.stages.find(function(s) { return s.id === pipelineStageId; });
    if (!stage) { panel.style.display = 'none'; return; }

    var html = '<h3>' + escapeHtml(stage.name) + '</h3>';

    // Ergebnis section
    html += '<div class="stance-section stance-section--result">';
    html += '<span class="stance-label">Ergebnis</span>';
    html += '<p>' + escapeHtml(stage.description) + '</p>';
    html += '<p><span class="badge badge--' + (stage.type === 'deterministic' ? 'deterministic' : 'probabilistic') + '">' + stage.type + '</span> ';
    html += 'Input: ' + stage.input + ' &rarr; Output: ' + stage.output;
    if (stage.loss) html += ' (Verlust: ' + stage.loss + ')';
    html += '</p></div>';

    // Prozess section (prompts)
    if (stage.prompt) {
        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">Der Prompt</span>';
        html += '<div class="prompt-block">' + escapeHtml(stage.prompt) + '</div>';
        html += '</div>';
    }
    if (stage.prompts) {
        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">Die Prompts</span>';
        if (stage.prompts.stage1) {
            html += '<h4>Stufe 1: Extract & Classify</h4><div class="prompt-block">' + escapeHtml(stage.prompts.stage1) + '</div>';
        }
        if (stage.prompts.stage2_note) {
            html += '<p><em>' + escapeHtml(stage.prompts.stage2_note) + '</em></p>';
        }
        if (stage.prompts.stage3) {
            html += '<h4>Stufe 3: Verify</h4><div class="prompt-block">' + escapeHtml(stage.prompts.stage3) + '</div>';
        }
        html += '</div>';
    }

    // Grenzen section (limitations)
    if (stage.limitations && stage.limitations.length) {
        html += '<div class="stance-section stance-section--limits">';
        html += '<span class="stance-label">Bekannte Grenzen</span>';
        html += '<ul class="limitation-list">';
        stage.limitations.forEach(function(l) { html += '<li>' + escapeHtml(l) + '</li>'; });
        html += '</ul></div>';
    }

    panel.innerHTML = html;
    panel.style.display = '';
}

// ==========================================================================
// View 2: Paper Journey
// ==========================================================================
function renderJourney() {
    setupJourneySearch();
    renderJourneyFeatured();
    if (selectedPaper) {
        renderJourneyTimeline(selectedPaper);
    }
}

function renderJourneyFeatured() {
    var container = document.getElementById('journey-featured');
    if (!container || container.dataset.bound) return;
    container.dataset.bound = 'true';

    var featured = appData.papers.filter(function(p) { return p.featured; });
    var agrees = appData.papers
        .filter(function(p) { return p.stages.assessment.agreement === 'agree'; })
        .sort(function() { return Math.random() - 0.5; })
        .slice(0, 2);

    var picks = featured.concat(agrees);

    container.innerHTML = '<p class="journey-hint">Waehle ein Paper oder suche:</p>' +
        picks.map(function(p) {
            var badge = p.stages.assessment.agreement === 'disagree' ? 'disagree' : 'agree';
            return '<button class="journey-pick journey-pick--' + badge + '" data-stem="' + escapeHtml(p.stem) + '">' +
                escapeHtml(truncate(p.author_year + ': ' + p.title, 60)) +
            '</button>';
        }).join('');

    container.addEventListener('click', function(e) {
        var btn = e.target.closest('.journey-pick');
        if (btn) {
            var paper = appData.papers.find(function(p) { return p.stem === btn.dataset.stem; });
            if (paper) {
                selectedPaper = paper;
                renderJourneyTimeline(paper);
            }
        }
    });
}

function setupJourneySearch() {
    var input = document.getElementById('journey-search');
    var results = document.getElementById('journey-results');

    if (input.dataset.bound) return;
    input.dataset.bound = 'true';

    var debounce = null;
    input.addEventListener('input', function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
            var q = input.value.trim().toLowerCase();
            if (q.length < 2) { results.style.display = 'none'; return; }

            var matches = appData.papers.filter(function(p) {
                return p.title.toLowerCase().indexOf(q) >= 0 ||
                       p.author_year.toLowerCase().indexOf(q) >= 0 ||
                       p.stem.toLowerCase().indexOf(q) >= 0;
            }).slice(0, 15);

            if (matches.length === 0) {
                results.innerHTML = '<div class="journey-result-item"><span class="result-title">Keine Ergebnisse</span></div>';
            } else {
                results.innerHTML = matches.map(function(p) {
                    var agrBadge = '';
                    if (p.stages.assessment.agreement === 'disagree')
                        agrBadge = '<span style="color:#ef4444">Disagree</span>';
                    else if (p.stages.assessment.agreement === 'agree')
                        agrBadge = '<span style="color:#10b981">Agree</span>';
                    else agrBadge = 'LLM only';

                    return '<div class="journey-result-item" data-stem="' + escapeHtml(p.stem) + '">' +
                        '<div class="result-title">' + escapeHtml(truncate(p.title, 80)) + '</div>' +
                        '<div class="result-meta">' + escapeHtml(p.author_year) + ' &middot; ' + agrBadge + '</div>' +
                        '</div>';
                }).join('');
            }
            results.style.display = '';
        }, 200);
    });

    results.addEventListener('click', function(e) {
        var item = e.target.closest('.journey-result-item');
        if (!item || !item.dataset.stem) return;
        selectedPaper = appData.papers.find(function(p) { return p.stem === item.dataset.stem; });
        input.value = selectedPaper ? selectedPaper.title : '';
        results.style.display = 'none';
        if (selectedPaper) renderJourneyTimeline(selectedPaper);
    });

    input.addEventListener('blur', function() {
        setTimeout(function() { results.style.display = 'none'; }, 200);
    });
}

function renderJourneyTimeline(paper) {
    var container = document.getElementById('journey-timeline');
    container.style.display = '';

    var stages = [
        { key: 'identification', name: 'Identifikation', stance: 'result',
          summary: paper.stages.identification.in_zotero ? 'In Zotero erfasst' : 'Nicht in Zotero' },
        { key: 'conversion', name: 'Konversion', stance: 'result',
          summary: paper.stages.conversion.markdown_converted ? 'PDF &rarr; Markdown' : 'Fehlgeschlagen' },
        { key: 'ske', name: 'Wissensextraktion', stance: 'process',
          summary: paper.stages.ske.stage1_arguments_count + ' Argumente, Score ' + (paper.stages.ske.stage3_overall || '?') + '/100' },
        { key: 'assessment', name: 'Assessment', stance: paper.stages.assessment.agreement === 'disagree' ? 'limits' : 'result',
          summary: buildAssessmentSummary(paper) },
        { key: 'concepts', name: 'Konzepte', stance: 'result',
          summary: (paper.concepts || []).length + ' Konzepte extrahiert' }
    ];

    container.innerHTML = stages.map(function(s, i) {
        var arrow = i < stages.length - 1 ? '<div class="stage-arrow">&rarr;</div>' : '';
        return '<div class="journey-stage journey-stage--' + s.stance + '" data-stage="' + s.key + '">' +
            '<div class="stage-stance-indicator" title="' + stanceLabel(s.stance) + '"></div>' +
            '<div class="stage-name">' + s.name + '</div>' +
            '<div class="stage-summary">' + s.summary + '</div>' +
        '</div>' + arrow;
    }).join('');

    container.querySelectorAll('.journey-stage').forEach(function(el) {
        el.addEventListener('click', function() {
            container.querySelectorAll('.journey-stage').forEach(function(e) { e.classList.remove('active'); });
            el.classList.add('active');
            renderJourneyStageDetail(paper, el.dataset.stage);
        });
    });

    // Auto-select: assessment if disagree, else identification
    var autoSelect = paper.stages.assessment.agreement === 'disagree' ? 'assessment' : 'identification';
    var autoEl = container.querySelector('[data-stage="' + autoSelect + '"]');
    if (autoEl) autoEl.click();
}

function buildAssessmentSummary(paper) {
    var a = paper.stages.assessment;
    if (a.agreement === 'disagree') {
        return 'Divergenz: LLM ' + a.llm.decision + ' / Human ' + (a.human ? a.human.decision : '?');
    } else if (a.agreement === 'agree') {
        return 'Uebereinstimmung: ' + a.llm.decision;
    }
    return 'Nur LLM: ' + a.llm.decision;
}

function stanceLabel(stance) {
    var labels = { result: 'Zeigen was ist', process: 'Zeigen wie', limits: 'Zeigen was nicht geht' };
    return labels[stance] || '';
}

function renderJourneyStageDetail(paper, stageKey) {
    var detail = document.getElementById('journey-detail');
    detail.style.display = '';
    var html = '';

    if (stageKey === 'identification') {
        html += '<h3>Identifikation</h3>';
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Ergebnis</span>';
        html += '<p><strong>Titel:</strong> ' + escapeHtml(paper.title) + '</p>';
        html += '<p><strong>Autor/Jahr:</strong> ' + escapeHtml(paper.author_year) + '</p>';
        html += '<p><strong>In Zotero:</strong> ' + (paper.stages.identification.in_zotero ? 'Ja' : 'Nein') + '</p>';
        html += '</div>';
        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">Wie gefunden</span>';
        html += '<p>Deep Research mit 4 Anbietern (Perplexity, Elicit, Semantic Scholar, Consensus) + manuelle Ergaenzung.</p>';
        html += '</div>';

    } else if (stageKey === 'conversion') {
        html += '<h3>Konversion (PDF &rarr; Markdown)</h3>';
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Ergebnis</span>';
        html += '<p><span class="badge badge--deterministic">Deterministisch</span> Docling (IBM)</p>';
        html += '<p>PDF akquiriert: Ja &middot; Markdown konvertiert: Ja</p>';
        html += '</div>';
        html += '<div class="stance-section stance-section--limits">';
        html += '<span class="stance-label">Verluste</span>';
        html += '<p>Tabellen und Abbildungen gehen verloren. Layout-komplexe Papers produzieren Artefakte.</p>';
        html += '</div>';

    } else if (stageKey === 'ske') {
        var ske = paper.stages.ske;
        html += '<h3>Wissensextraktion (SKE)</h3>';

        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Ergebnis</span>';
        html += '<h4>Extrahierte Kategorien</h4>';
        var cats = Object.entries(ske.stage1_categories || {}).filter(function(e) { return e[1]; }).map(function(e) { return e[0]; });
        html += '<div class="category-chips">' + cats.map(function(c) { return '<span class="chip">' + c + '</span>'; }).join('') + '</div>';
        if (ske.stage1_key_finding) {
            html += '<h4>Kernbefund</h4><div class="reasoning-block">' + escapeHtml(ske.stage1_key_finding) + '</div>';
        }
        html += '</div>';

        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">Wie extrahiert</span>';
        html += '<p>3-Stufen-Pipeline: JSON-Extraktion (LLM) &rarr; Markdown-Formatierung (deterministisch) &rarr; Verifikation (LLM)</p>';
        html += '</div>';

        html += '<div class="stance-section stance-section--limits">';
        html += '<span class="stance-label">Qualitaetsgrenzen</span>';
        html += '<table class="mini-table">';
        html += '<tr><td>Vollstaendigkeit</td><td>' + (ske.stage3_completeness || '?') + '/100</td></tr>';
        html += '<tr><td>Korrektheit</td><td>' + (ske.stage3_correctness || '?') + '/100</td></tr>';
        html += '<tr><td>Gesamt</td><td><strong>' + (ske.stage3_overall || '?') + '/100</strong></td></tr>';
        html += '</table>';
        if (ske.stage3_overall && ske.stage3_overall < 80) {
            html += '<p class="limitation-note">Score unter 80: moegliche Qualitaetsprobleme bei der Extraktion.</p>';
        }
        html += '</div>';

    } else if (stageKey === 'assessment') {
        var a = paper.stages.assessment;
        html += '<h3>Assessment</h3>';

        // Ergebnis
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Ergebnis</span>';
        html += '<div class="decision-row">';
        html += '<span class="badge badge--' + a.llm.decision.toLowerCase() + '">LLM: ' + a.llm.decision + '</span>';
        if (a.human) {
            html += ' <span class="badge badge--' + a.human.decision.toLowerCase() + '">Human: ' + a.human.decision + '</span>';
        }
        if (a.llm.confidence) {
            html += ' <span style="color:#9ca3af;font-size:0.85rem">(Confidence: ' + a.llm.confidence + ')</span>';
        }
        html += '</div>';
        html += '<p><strong>LLM-Kategorien:</strong> ' + (a.llm.categories.join(', ') || 'keine') + '</p>';
        if (a.human) {
            html += '<p><strong>Human-Kategorien:</strong> ' + (a.human.categories.join(', ') || 'keine') + '</p>';
        }
        html += '</div>';

        // Prozess
        if (a.llm.reasoning) {
            html += '<div class="stance-section stance-section--process">';
            html += '<span class="stance-label">Wie entschieden</span>';
            html += '<div class="reasoning-block">' + escapeHtml(a.llm.reasoning) + '</div>';
            html += '</div>';
        }

        // Grenzen (only if disagree)
        if (a.agreement === 'disagree') {
            html += '<div class="stance-section stance-section--limits">';
            html += '<span class="stance-label">Wo es divergiert</span>';
            if (a.divergence_pattern) {
                html += '<span class="pattern-badge pattern-badge--' + patternClass(a.divergence_pattern) + '">' + escapeHtml(a.divergence_pattern) + '</span> ';
            }
            if (a.divergence_justification) {
                html += '<p class="divergence-story">' + escapeHtml(a.divergence_justification) + '</p>';
            }
            // Category comparison table
            html += buildCategoryComparisonFromPaper(paper);
            html += '</div>';
        } else if (a.agreement === 'agree') {
            html += '<div class="stance-section stance-section--result" style="border-left-color:#10b981">';
            html += '<span class="stance-label" style="color:#10b981">Uebereinstimmung</span>';
            html += '<p><span class="badge badge--agree">Agreement</span> Mensch und Maschine kommen zum gleichen Ergebnis.</p>';
            html += '</div>';
        } else {
            html += '<div class="stance-section stance-section--limits">';
            html += '<span class="stance-label">Einschraenkung</span>';
            html += '<p>Kein Human-Assessment vorhanden. Nur LLM-Bewertung verfuegbar.</p>';
            html += '</div>';
        }

    } else if (stageKey === 'concepts') {
        html += '<h3>Konzepte</h3>';
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Ergebnis</span>';
        if (paper.concepts && paper.concepts.length) {
            html += '<ul class="concept-list">';
            paper.concepts.forEach(function(c) {
                html += '<li><a href="#" class="concept-link" data-concept="' + escapeHtml(c) + '">' + escapeHtml(c) + '</a></li>';
            });
            html += '</ul>';
        } else {
            html += '<p>Keine Konzepte extrahiert.</p>';
        }
        html += '</div>';

        if (paper.knowledge_summary) {
            html += '<div class="stance-section stance-section--process">';
            html += '<span class="stance-label">Kernbefund</span>';
            html += '<div class="reasoning-block">' + escapeHtml(paper.knowledge_summary) + '</div>';
            html += '</div>';
        }
    }

    detail.innerHTML = html;

    // Event delegation for concept links
    detail.querySelectorAll('.concept-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToConcept(link.dataset.concept);
        });
    });
}

function buildCategoryComparisonFromPaper(paper) {
    var a = paper.stages.assessment;
    if (!a.llm || !a.human) return '';
    var llmCats = {};
    (a.llm.categories || []).forEach(function(c) { llmCats[c] = true; });
    var humanCats = {};
    (a.human.categories || []).forEach(function(c) { humanCats[c] = true; });
    var allCats = ['AI_Literacies','Generative_KI','Prompting','KI_Sonstige',
                   'Soziale_Arbeit','Bias_Ungleichheit','Gender','Diversitaet','Feministisch','Fairness'];

    var html = '<table class="comparison-table"><thead><tr><th>Kategorie</th><th>Human</th><th>LLM</th></tr></thead><tbody>';
    allCats.forEach(function(c) {
        var h = !!humanCats[c];
        var l = !!llmCats[c];
        var div = h !== l;
        html += '<tr class="' + (div ? 'divergent' : '') + '">';
        html += '<td>' + c + '</td><td>' + (h ? 'Ja' : 'Nein') + '</td><td>' + (l ? 'Ja' : 'Nein') + '</td>';
        html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
}

// ==========================================================================
// View 3: Concept Explorer
// ==========================================================================
function renderConcepts() {
    renderConceptGraph();
    renderConceptLegend();
    if (selectedConcept) {
        renderConceptDetail(selectedConcept);
    }
}

function setupConceptControls() {
    var slider = document.getElementById('concept-freq-slider');
    var valueSpan = document.getElementById('concept-freq-value');
    var search = document.getElementById('concept-search');

    if (slider) {
        slider.addEventListener('input', function() {
            valueSpan.textContent = slider.value;
            var container = document.getElementById('concept-graph-container');
            container.innerHTML = '';
            if (conceptSimulation) { conceptSimulation.stop(); conceptSimulation = null; }
            renderConceptGraph();
        });
    }

    if (search) {
        search.addEventListener('input', function() {
            var q = search.value.trim().toLowerCase();
            d3.selectAll('.concept-node circle')
                .attr('stroke', function(d) {
                    if (q && d.id.toLowerCase().indexOf(q) >= 0) return '#ef4444';
                    return disagreeConceptIds.has(d.id) ? 'var(--pt-disagree)' : '#fff';
                })
                .attr('stroke-width', function(d) {
                    if (q && d.id.toLowerCase().indexOf(q) >= 0) return 4;
                    return disagreeConceptIds.has(d.id) ? 3 : 2;
                });
        });
    }
}

// Set of concepts appearing in disagree papers (computed once)
var disagreeConceptIds = new Set();

function renderConceptGraph() {
    var container = document.getElementById('concept-graph-container');
    if (container.querySelector('svg')) return;
    if (!appData) return;

    // Build disagree concept set
    disagreeConceptIds = new Set();
    appData.papers.filter(function(p) { return p.stages.assessment.agreement === 'disagree'; })
        .forEach(function(p) { (p.concepts || []).forEach(function(c) { disagreeConceptIds.add(c); }); });

    var minFreq = parseInt(document.getElementById('concept-freq-slider').value || '3');
    var conceptData = appData.concepts;

    var filteredNodes = conceptData.nodes.filter(function(n) { return n.frequency >= minFreq; });
    var nodeIds = {};
    filteredNodes.forEach(function(n) { nodeIds[n.id] = true; });
    var filteredEdges = conceptData.edges.filter(function(e) {
        return nodeIds[e.source] && nodeIds[e.target];
    });

    filteredNodes = filteredNodes.map(function(n) { return Object.assign({}, n); });
    filteredEdges = filteredEdges.map(function(e) { return Object.assign({}, e); });

    var width = container.clientWidth || 800;
    var height = 500;

    var svg = d3.select(container).append('svg')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    var g = svg.append('g');

    svg.call(d3.zoom().scaleExtent([0.3, 4]).on('zoom', function(event) {
        g.attr('transform', event.transform);
    }));

    var maxFreq = d3.max(filteredNodes, function(d) { return d.frequency; }) || 1;
    var sizeScale = d3.scaleSqrt().domain([2, maxFreq]).range([6, 28]);
    var maxWeight = d3.max(filteredEdges, function(d) { return d.weight; }) || 1;
    var edgeScale = d3.scaleLinear().domain([2, maxWeight]).range([1, 5]);

    // Cluster colors
    var clusterColor = {
        'technik': '#3b82f6',
        'sozial': '#8b5cf6',
        'bridge': '#f59e0b'
    };

    conceptSimulation = d3.forceSimulation(filteredNodes)
        .force('link', d3.forceLink(filteredEdges).id(function(d) { return d.id; }).distance(80).strength(0.3))
        .force('charge', d3.forceManyBody().strength(-150))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function(d) { return sizeScale(d.frequency) + 4; }));

    var link = g.append('g').selectAll('line')
        .data(filteredEdges)
        .join('line')
        .attr('stroke', '#d1d5db')
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', function(d) { return edgeScale(d.weight); });

    var nodeG = g.append('g').selectAll('g')
        .data(filteredNodes)
        .join('g')
        .attr('class', 'concept-node')
        .call(d3.drag()
            .on('start', function(event, d) {
                if (!event.active) conceptSimulation.alphaTarget(0.3).restart();
                d.fx = d.x; d.fy = d.y;
            })
            .on('drag', function(event, d) { d.fx = event.x; d.fy = event.y; })
            .on('end', function(event, d) {
                if (!event.active) conceptSimulation.alphaTarget(0);
                d.fx = null; d.fy = null;
            })
        );

    nodeG.append('circle')
        .attr('r', function(d) { return sizeScale(d.frequency); })
        .attr('fill', function(d) { return clusterColor[d.cluster] || '#9ca3af'; })
        .attr('stroke', function(d) { return disagreeConceptIds.has(d.id) ? '#ef4444' : '#fff'; })
        .attr('stroke-width', function(d) { return disagreeConceptIds.has(d.id) ? 3 : 2; })
        .on('click', function(event, d) {
            selectedConcept = d.id;
            renderConceptDetail(d.id);
        });

    // Show labels for top-30 by frequency
    var freqThreshold = filteredNodes.length > 30
        ? filteredNodes.sort(function(a, b) { return b.frequency - a.frequency; })[29].frequency
        : 0;
    nodeG.append('text')
        .text(function(d) { return d.frequency >= freqThreshold ? d.label : ''; })
        .attr('text-anchor', 'middle')
        .attr('dy', function(d) { return -sizeScale(d.frequency) - 4; })
        .attr('font-size', '10px')
        .attr('fill', '#374151')
        .attr('pointer-events', 'none');

    conceptSimulation.on('tick', function() {
        link.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
        nodeG.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    });
}

function renderConceptLegend() {
    var legend = document.getElementById('concept-legend');
    if (!legend || legend.dataset.rendered) return;
    legend.dataset.rendered = 'true';

    legend.innerHTML =
        '<div class="legend-item"><span class="legend-circle" style="background:#3b82f6"></span> Technik-Konzepte</div>' +
        '<div class="legend-item"><span class="legend-circle" style="background:#8b5cf6"></span> Sozial-Konzepte</div>' +
        '<div class="legend-item"><span class="legend-circle" style="background:#f59e0b"></span> Grenzgaenger (Technik+Sozial)</div>' +
        '<div class="legend-item"><span class="legend-circle legend-circle--ring"></span> In Divergenz-Papers</div>';
}

function renderConceptDetail(conceptId) {
    var panel = document.getElementById('concept-detail');
    var node = appData.concepts.nodes.find(function(n) { return n.id === conceptId; });
    if (!node) { panel.style.display = 'none'; return; }

    var related = appData.concepts.edges
        .filter(function(e) {
            var src = typeof e.source === 'string' ? e.source : e.source.id;
            var tgt = typeof e.target === 'string' ? e.target : e.target.id;
            return src === conceptId || tgt === conceptId;
        })
        .map(function(e) {
            var src = typeof e.source === 'string' ? e.source : e.source.id;
            var tgt = typeof e.target === 'string' ? e.target : e.target.id;
            var otherId = src === conceptId ? tgt : src;
            return { name: otherId, weight: e.weight };
        })
        .sort(function(a, b) { return b.weight - a.weight; })
        .slice(0, 8);

    var conceptPapers = appData.papers.filter(function(p) { return (p.concepts || []).indexOf(conceptId) >= 0; });

    var html = '<h3>' + escapeHtml(conceptId) + ' <span style="color:#9ca3af;font-weight:normal">(' + node.frequency + ' Papers)</span></h3>';

    // Cluster badge
    var clusterLabels = { technik: 'Technik', sozial: 'Sozial', bridge: 'Grenzgaenger' };
    var clusterColors = { technik: '#3b82f6', sozial: '#8b5cf6', bridge: '#f59e0b' };
    html += '<span class="badge" style="background:' + (clusterColors[node.cluster] || '#9ca3af') + ';color:white">' + (clusterLabels[node.cluster] || 'Unbekannt') + '</span>';

    // Definition
    if (node.definition) {
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Definition</span>';
        html += '<p>' + escapeHtml(node.definition) + '</p>';
        html += '</div>';
    }

    // Co-occurrence
    if (related.length) {
        html += '<h4>Co-occurrence</h4><table class="comparison-table"><tr><th>Konzept</th><th>Gemeinsame Papers</th></tr>';
        related.forEach(function(r) {
            html += '<tr><td><a href="#" class="concept-link" data-concept="' + escapeHtml(r.name) + '" style="color:#1e40af">' + escapeHtml(r.name) + '</a></td><td>' + r.weight + '</td></tr>';
        });
        html += '</table>';
    }

    // Papers
    if (conceptPapers.length) {
        html += '<h4>Papers (' + conceptPapers.length + ')</h4><ul class="concept-papers-list">';
        conceptPapers.slice(0, 20).forEach(function(p) {
            html += '<li data-stem="' + escapeHtml(p.stem) + '">' + escapeHtml(truncate(p.title, 70)) + ' <span style="color:#9ca3af">(' + escapeHtml(p.author_year) + ')</span></li>';
        });
        if (conceptPapers.length > 20) html += '<li style="color:#9ca3af">... und ' + (conceptPapers.length - 20) + ' weitere</li>';
        html += '</ul>';
    }

    // Epistemische Divergenz section
    var disagrees = conceptPapers.filter(function(p) { return p.stages.assessment.agreement === 'disagree'; });
    html += '<div class="stance-section stance-section--limits">';
    html += '<span class="stance-label">Epistemische Divergenz</span>';
    html += '<p>' + disagrees.length + ' von ' + conceptPapers.length + ' Papers mit diesem Konzept zeigen Divergenz (' + Math.round(disagrees.length / Math.max(conceptPapers.length, 1) * 100) + '%).</p>';
    if (disagrees.length > 0) {
        var patternCounts = {};
        disagrees.forEach(function(p) {
            var pat = p.stages.assessment.divergence_pattern;
            if (pat) patternCounts[pat] = (patternCounts[pat] || 0) + 1;
        });
        var topPattern = Object.entries(patternCounts).sort(function(a, b) { return b[1] - a[1]; })[0];
        if (topPattern) {
            html += '<p>Haeufigstes Muster: <span class="pattern-badge pattern-badge--' + patternClass(topPattern[0]) + '">' + escapeHtml(topPattern[0]) + '</span> (' + topPattern[1] + 'x)</p>';
        }
    }
    html += '</div>';

    panel.innerHTML = html;
    panel.style.display = '';

    panel.querySelectorAll('.concept-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            selectedConcept = link.dataset.concept;
            var cContainer = document.getElementById('concept-graph-container');
            cContainer.innerHTML = '';
            if (conceptSimulation) { conceptSimulation.stop(); conceptSimulation = null; }
            renderConceptGraph();
            renderConceptDetail(link.dataset.concept);
        });
    });

    panel.querySelectorAll('.concept-papers-list li[data-stem]').forEach(function(li) {
        li.style.cursor = 'pointer';
        li.addEventListener('click', function() { navigateToJourney(li.dataset.stem); });
    });
}

// ==========================================================================
// View 4: Divergence Navigator
// ==========================================================================
function renderDivergences() {
    renderDivergenceSummary();
    renderDivergenceList();
}

function renderDivergenceSummary() {
    var div = document.getElementById('divergence-summary');
    if (div.dataset.rendered) return;
    div.dataset.rendered = 'true';

    var meta = appData.meta;
    var cm = meta.confusion_matrix || {};
    var patterns = meta.pattern_distribution || {};

    div.innerHTML =
        '<div class="summary-card"><div class="summary-value">' + meta.disagreements + '</div><div class="summary-label">Disagreements</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (cm.Exclude_Include || 78) + '</div><div class="summary-label">LLM Include / Human Exclude</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (cm.Include_Exclude || 23) + '</div><div class="summary-label">Human Include / LLM Exclude</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + meta.kappa + '</div><div class="summary-label">Cohen\'s Kappa</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (patterns['Semantische Expansion'] || 0) + '</div><div class="summary-label">Semantische Expansion</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (patterns['Keyword-Inklusion'] || 0) + '</div><div class="summary-label">Keyword-Inklusion</div></div>';

    // Exemplarische Faelle
    var exemplary = [
        appData.divergences.find(function(d) { return d.pattern === 'Semantische Expansion' && d.severity >= 3; }),
        appData.divergences.find(function(d) { return d.pattern === 'Keyword-Inklusion'; }),
        appData.divergences.find(function(d) { return d.pattern === 'Implizite Feldzugehoerigkeit'; })
    ].filter(Boolean);

    if (exemplary.length > 0) {
        var exDiv = document.createElement('div');
        exDiv.className = 'exemplary-cases';
        exDiv.innerHTML = '<h3>Exemplarische Faelle</h3><p class="exemplary-intro">Drei Muster epistemischer Divergenz:</p>' +
            exemplary.map(function(d) {
                return '<div class="exemplary-card" data-paper-id="' + escapeHtml(d.paper_id) + '">' +
                    '<span class="pattern-badge pattern-badge--' + patternClass(d.pattern) + '">' + escapeHtml(d.pattern) + '</span> ' +
                    '<strong>' + escapeHtml(truncate(d.title, 60)) + '</strong>' +
                    '<p>' + escapeHtml(truncate(d.justification || '', 200)) + '</p>' +
                '</div>';
            }).join('');
        div.parentNode.insertBefore(exDiv, div.nextSibling);

        exDiv.querySelectorAll('.exemplary-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var d = appData.divergences.find(function(x) { return x.paper_id === card.dataset.paperId; });
                if (d) renderDivergenceDetail(d);
            });
        });
    }
}

function setupDivergenceFilters() {
    document.querySelectorAll('.filter-btn[data-pattern]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-pattern]').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activePatternFilter = btn.dataset.pattern;
            renderDivergenceList();
        });
    });

    document.querySelectorAll('.filter-btn[data-dtype]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-dtype]').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeDtypeFilter = btn.dataset.dtype;
            renderDivergenceList();
        });
    });

    var search = document.getElementById('divergence-search');
    if (search) {
        search.addEventListener('input', function() {
            divergenceSearchQuery = search.value.trim().toLowerCase();
            renderDivergenceList();
        });
    }
}

function renderDivergenceList() {
    var container = document.getElementById('divergence-list');
    if (!appData) return;

    var filtered = appData.divergences;

    if (activePatternFilter !== 'all') {
        filtered = filtered.filter(function(d) { return d.pattern === activePatternFilter; });
    }

    if (activeDtypeFilter !== 'all') {
        filtered = filtered.filter(function(d) { return d.disagreement_type === activeDtypeFilter; });
    }

    if (divergenceSearchQuery) {
        filtered = filtered.filter(function(d) {
            return d.title.toLowerCase().indexOf(divergenceSearchQuery) >= 0 ||
                   d.author_year.toLowerCase().indexOf(divergenceSearchQuery) >= 0;
        });
    }

    container.innerHTML = filtered.map(function(d) {
        return '<div class="divergence-card divergence-card--' + patternClass(d.pattern) + '" data-paper-id="' + escapeHtml(d.paper_id) + '">' +
            '<div class="divergence-story-bar"></div>' +
            '<div class="divergence-content">' +
                '<h4>' + escapeHtml(truncate(d.title, 70)) + '</h4>' +
                '<p class="divergence-meta">' + escapeHtml(d.author_year) + '</p>' +
                '<p class="divergence-narrative">' + escapeHtml(truncate(d.justification || d.llm_reasoning || '', 150)) + '</p>' +
                '<div class="divergence-badges">' +
                    (d.pattern ? '<span class="pattern-badge pattern-badge--' + patternClass(d.pattern) + '">' + escapeHtml(d.pattern) + '</span>' : '') +
                    '<span class="badge badge--' + (d.human_decision === 'Include' ? 'include' : 'exclude') + '">H: ' + d.human_decision + '</span>' +
                    '<span class="badge badge--' + (d.llm_decision === 'Include' ? 'include' : 'exclude') + '">L: ' + d.llm_decision + '</span>' +
                    '<span class="divergence-count">' + d.n_affected + ' Kat.</span>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    container.querySelectorAll('.divergence-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var d = appData.divergences.find(function(x) { return x.paper_id === card.dataset.paperId; });
            if (d) renderDivergenceDetail(d);
        });
    });
}

function renderDivergenceDetail(d) {
    var panel = document.getElementById('divergence-detail');

    var html = '<h3>' + escapeHtml(d.title) + '</h3>';
    html += '<p>' + escapeHtml(d.author_year) + ' &middot; Schweregrad: ' + d.severity + '</p>';

    html += '<p>' +
        '<span class="badge badge--' + (d.human_decision === 'Include' ? 'include' : 'exclude') + '">Human: ' + d.human_decision + '</span> ' +
        '<span class="badge badge--' + (d.llm_decision === 'Include' ? 'include' : 'exclude') + '">LLM: ' + d.llm_decision + '</span> ' +
        (d.pattern ? '<span class="pattern-badge pattern-badge--' + patternClass(d.pattern) + '">' + escapeHtml(d.pattern) + '</span>' : '') +
        '</p>';

    // Kategorie-Vergleich
    html += '<h4>Kategorie-Vergleich</h4>';
    html += '<table class="comparison-table"><tr><th>Kategorie</th><th>Human</th><th>LLM</th><th>Divergent</th></tr>';
    Object.keys(d.category_comparison || {}).forEach(function(cat) {
        var vals = d.category_comparison[cat];
        var cls = vals.divergent ? ' class="divergent"' : '';
        html += '<tr' + cls + '><td>' + cat + '</td><td>' + vals.human + '</td><td>' + vals.llm + '</td><td>' + (vals.divergent ? 'X' : '') + '</td></tr>';
    });
    html += '</table>';

    // LLM Reasoning
    if (d.llm_reasoning) {
        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">LLM-Reasoning</span>';
        html += '<div class="reasoning-block">' + escapeHtml(d.llm_reasoning) + '</div>';
        html += '</div>';
    }

    // Muster-Begruendung
    if (d.justification) {
        html += '<div class="stance-section stance-section--limits">';
        html += '<span class="stance-label">Divergenz-Muster</span>';
        html += '<p>' + escapeHtml(d.justification) + '</p>';
        html += '</div>';
    }

    // Knowledge summary (find matching paper)
    var paper = appData.papers.find(function(p) {
        return p.title === d.title || p.author_year === d.author_year;
    });
    if (paper && paper.knowledge_summary) {
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Worum geht es?</span>';
        html += '<div class="reasoning-block">' + escapeHtml(paper.knowledge_summary) + '</div>';
        html += '</div>';
    }

    // Link to Paper Journey
    if (paper) {
        html += '<button class="journey-link-btn" data-stem="' + escapeHtml(paper.stem) + '">Vollstaendige Paper Journey ansehen &rarr;</button>';
    }

    panel.innerHTML = html;
    panel.style.display = '';

    // Journey link handler
    var journeyBtn = panel.querySelector('.journey-link-btn');
    if (journeyBtn) {
        journeyBtn.addEventListener('click', function() {
            navigateToJourney(journeyBtn.dataset.stem);
        });
    }
}

// ==========================================================================
// Helpers
// ==========================================================================
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function truncate(text, maxLen) {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

function patternClass(pattern) {
    if (!pattern) return 'semantic';
    if (pattern.indexOf('Keyword') >= 0) return 'keyword';
    if (pattern.indexOf('Semantisch') >= 0 || pattern.indexOf('Expansion') >= 0) return 'semantic';
    if (pattern.indexOf('Implizit') >= 0 || pattern.indexOf('Feld') >= 0) return 'implicit';
    return 'semantic';
}

})();
