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
    var cm = m.confusion_matrix || {};
    var lost = m.total_papers - m.knowledge_docs;

    container.innerHTML =
        '<div class="stance-section stance-section--result">' +
            '<span class="stance-label">Was wir gefunden haben</span>' +
            '<p><strong>' + m.total_papers + ' Papers</strong> durch 5 Pipeline-Stufen zu <strong>' + m.knowledge_docs + ' Wissensdokumenten</strong> verdichtet (' + (m.total_papers - m.knowledge_docs) + ' ohne Volltext). ' +
            'Ein LLM (Claude Haiku 4.5) und ein Mensch bewerten unabhaengig nach 10 identischen Kategorien. ' +
            'Ergebnis: <strong>' + m.disagreements + ' Divergenzen</strong> -- Faelle, in denen Mensch und Maschine zu verschiedenen Ergebnissen kommen.</p>' +
        '</div>' +
        '<div class="stance-section stance-section--process">' +
            '<span class="stance-label">Wie wir es gemacht haben</span>' +
            '<p>Deep Research mit 4 LLMs parallel (Perplexity, Claude, ChatGPT, Gemini), ' +
            'PDF-Akquise mit 4 Fallback-Strategien, ' +
            'Wissensextraktion durch eine 3-stufige LLM-Pipeline (Extraktion, Formatierung, Verifikation), ' +
            'duale Bewertung mit identischem Kategorienschema. ' +
            'Gesamtkosten der LLM-Pipeline: ~$10.</p>' +
        '</div>' +
        '<div class="stance-section stance-section--limits">' +
            '<span class="stance-label">Was wir nicht wissen</span>' +
            '<p><strong>' + lost + ' von ' + m.total_papers + ' Papers</strong> ohne Wissensdokument (Paywalls, korrupte PDFs). ' +
            'Human Assessment deckt nur ' + m.human_assessed + ' von ' + m.total_papers + ' Papers ab (64%). ' +
            'Cohen\'s Kappa (' + m.kappa + ') ist ein Prevalence-Bias-Artefakt -- ' +
            'die eigentliche Aussage steckt in der Konfusionsmatrix: ' +
            (cm.Exclude_Include || 78) + ' mal inkludiert das LLM, was der Mensch ausschliesst, ' +
            'nur ' + (cm.Include_Exclude || 23) + ' mal umgekehrt.</p>' +
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
    scrollToElement(panel);
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

    var hasSke = paper.stages.ske !== null;
    var hasAssessment = paper.stages.assessment && (paper.stages.assessment.llm || paper.stages.assessment.human);

    var stages = [
        { key: 'identification', name: 'Identifikation', stance: 'result',
          summary: paper.stages.identification.in_zotero ? 'In Zotero erfasst' : 'Nicht in Zotero',
          available: true },
        { key: 'conversion', name: 'Konversion', stance: paper.stages.conversion.markdown_converted ? 'result' : 'limits',
          summary: paper.stages.conversion.markdown_converted ? 'PDF &rarr; Markdown' : (paper.stages.conversion.pdf_acquired ? 'Konversion fehlgeschlagen' : 'Kein PDF verfuegbar'),
          available: true },
        { key: 'ske', name: 'Wissensextraktion', stance: hasSke ? 'process' : 'unavailable',
          summary: hasSke ? (paper.stages.ske.stage1_arguments_count + ' Argumente' + (paper.stages.ske.stage3_overall ? ', Score ' + paper.stages.ske.stage3_overall + '/100' : ', nicht verifiziert')) : 'Nicht moeglich',
          available: hasSke },
        { key: 'assessment', name: 'Assessment', stance: !hasAssessment ? 'unavailable' : (paper.stages.assessment.agreement === 'disagree' ? 'limits' : 'result'),
          summary: hasAssessment ? buildAssessmentSummary(paper) : 'Kein Assessment',
          available: hasAssessment },
        { key: 'concepts', name: 'Konzepte', stance: (paper.concepts && paper.concepts.length) ? 'result' : 'unavailable',
          summary: (paper.concepts || []).length + ' Konzepte extrahiert',
          available: (paper.concepts && paper.concepts.length > 0) }
    ];

    container.innerHTML = stages.map(function(s, i) {
        var arrow = i < stages.length - 1 ? '<div class="stage-arrow">&rarr;</div>' : '';
        var stageClass = 'journey-stage journey-stage--' + s.stance;
        if (!s.available) stageClass += ' journey-stage--unavailable';
        return '<div class="' + stageClass + '" data-stage="' + s.key + '">' +
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
    var labels = { result: 'Zeigen was ist', process: 'Zeigen wie', limits: 'Zeigen was nicht geht', unavailable: 'Nicht verfuegbar' };
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
        html += '<p><strong>' + escapeHtml(paper.title) + '</strong></p>';
        html += '<p>' + escapeHtml(paper.author_year) + '</p>';
        html += '<p>Zotero-Status: ' + (paper.stages.identification.in_zotero ? '<span class="badge badge--include">Erfasst</span>' : '<span class="badge badge--exclude">Nicht erfasst</span>') + '</p>';
        // Artifact links: DOI, URL, Abstract
        var linkHtml = '';
        if (paper.doi) {
            linkHtml += '<a href="https://doi.org/' + escapeHtml(paper.doi) + '" target="_blank" rel="noopener" class="artifact-link"><i class="fas fa-external-link-alt"></i> DOI: ' + escapeHtml(paper.doi) + '</a> ';
        }
        if (paper.url) {
            linkHtml += '<a href="' + escapeHtml(paper.url) + '" target="_blank" rel="noopener" class="artifact-link"><i class="fas fa-globe"></i> Originalquelle</a>';
        }
        if (linkHtml) {
            html += '<div class="artifact-links">' + linkHtml + '</div>';
        }
        if (paper.abstract) {
            html += '<details class="abstract-toggle"><summary>Abstract anzeigen</summary><div class="reasoning-block">' + escapeHtml(paper.abstract) + '</div></details>';
        }
        html += '</div>';
        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">Wie gefunden</span>';
        html += '<p>Deep Research mit 4 LLMs parallel (Perplexity, Claude, ChatGPT, Gemini). ' +
                'Die Papers wurden aus den Ergebnissen aller vier Anbieter zusammengefuehrt und in Zotero konsolidiert. ' +
                'Zusaetzlich manuelle Ergaenzung durch Snowball-Sampling.</p>';
        html += '</div>';
        html += '<div class="stance-section stance-section--limits">';
        html += '<span class="stance-label">Was wir nicht wissen</span>';
        html += '<p>Der genaue Akquise-Weg (welcher Deep-Research-Provider dieses Paper identifiziert hat) ist nicht dokumentiert ' +
                '-- eine Luecke in der Prozessdokumentation. Wir wissen nicht, ob alle vier Anbieter dieses Paper gefunden haben oder nur einer.</p>';
        html += '</div>';

    } else if (stageKey === 'conversion') {
        var conv = paper.stages.conversion;
        html += '<h3>Konversion (PDF &rarr; Markdown)</h3>';
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Ergebnis</span>';
        html += '<p><span class="badge badge--deterministic">Deterministisch</span> Docling (IBM)</p>';
        html += '<p>PDF akquiriert: ' + (conv.pdf_acquired ? '<strong>Ja</strong>' : '<strong class="text-danger">Nein</strong>') +
                ' &middot; Markdown konvertiert: ' + (conv.markdown_converted ? '<strong>Ja</strong>' : '<strong class="text-danger">Nein</strong>') + '</p>';
        if (!conv.pdf_acquired) {
            html += '<p class="limitation-note">Ohne PDF kann keine Wissensextraktion stattfinden. Haeufigste Ursache: Paywall oder nicht frei zugaenglich.</p>';
        }
        html += '</div>';
        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">Wie konvertiert</span>';
        html += '<p>PDF-Akquise durch 4 Fallback-Strategien (DOI-Link, Unpaywall, Google Scholar, manuell). ' +
                'Konversion durch Docling (IBM): deterministisch, reproduzierbar, kein LLM involviert.</p>';
        html += '</div>';
        html += '<div class="stance-section stance-section--limits">';
        html += '<span class="stance-label">Was verloren geht</span>';
        html += '<p>Tabellen werden zu Fliesstext linearisiert, Abbildungen gehen komplett verloren, ' +
                'Fussnoten verlieren ihren Kontext. Layout-komplexe Papers (Mehrspaltensatz, eingebettete Formeln) produzieren Artefakte. ' +
                'Ein Konversions-Qualitaetsscore fuer dieses spezifische Paper ist nicht verfuegbar.</p>';
        html += '</div>';

    } else if (stageKey === 'ske') {
        var ske = paper.stages.ske;
        html += '<h3>Wissensextraktion (SKE)</h3>';

        // Handle thin papers (no knowledge extraction)
        if (!ske) {
            html += '<div class="stance-section stance-section--limits">';
            html += '<span class="stance-label">Nicht verfuegbar</span>';
            html += '<p>Fuer dieses Paper liegt kein Wissensdokument vor. ';
            if (!paper.stages.conversion.pdf_acquired) {
                html += 'Das PDF konnte nicht beschafft werden (haeufigste Ursache: Paywall oder zugangsbeschraenkte Literatur).';
            } else {
                html += 'Die Markdown-Konversion ist fehlgeschlagen.';
            }
            html += '</p><p>Das LLM-Assessment (wenn vorhanden) basiert auf Titel und Metadaten, nicht auf dem Volltext.</p>';
            html += '</div>';
        } else {
            // Key finding first -- most important paper-specific content
            if (ske.stage1_key_finding) {
                html += '<div class="stance-section stance-section--result">';
                html += '<span class="stance-label">Kernbefund (LLM-extrahiert)</span>';
                html += '<div class="reasoning-block">' + escapeHtml(ske.stage1_key_finding) + '</div>';
                html += '</div>';
            }

            // Categories as decision matrix
            html += '<div class="stance-section stance-section--result">';
            html += '<span class="stance-label">Kategorie-Entscheidungen</span>';
            var allCatKeys = Object.keys(ske.stage1_categories || {});
            var yesCats = allCatKeys.filter(function(k) { return ske.stage1_categories[k]; });
            var noCats = allCatKeys.filter(function(k) { return !ske.stage1_categories[k]; });
            html += '<p>Das LLM hat <strong>' + yesCats.length + ' von ' + allCatKeys.length + ' Kategorien</strong> als zutreffend klassifiziert.</p>';
            html += '<div class="category-chips">' + yesCats.map(function(c) { return '<span class="chip chip--yes">' + c + '</span>'; }).join('') + '</div>';
            if (noCats.length > 0) {
                html += '<p style="margin-top:0.5rem;color:#6b7280">Nicht zutreffend: ' + noCats.map(function(c) { return '<span class="chip chip--no">' + c + '</span>'; }).join(' ') + '</p>';
            }
            html += '<p class="ske-args">' + ske.stage1_arguments_count + ' Hauptargumente extrahiert.</p>';
            html += '</div>';

            // Knowledge document viewer (expandable sections)
            if (paper.knowledge_sections) {
                html += '<div class="stance-section stance-section--result">';
                html += '<span class="stance-label">Wissensdokument</span>';
                var ks = paper.knowledge_sections;
                if (ks.forschungsfrage) {
                    html += '<details class="kd-section"><summary><strong>Forschungsfrage</strong></summary>';
                    html += '<div class="reasoning-block">' + escapeHtml(ks.forschungsfrage) + '</div></details>';
                }
                if (ks.methodik) {
                    html += '<details class="kd-section"><summary><strong>Methodik</strong></summary>';
                    html += '<div class="reasoning-block">' + escapeHtml(ks.methodik) + '</div></details>';
                }
                if (ks.hauptargumente) {
                    html += '<details class="kd-section"><summary><strong>Hauptargumente</strong></summary>';
                    html += '<div class="reasoning-block">' + escapeHtml(ks.hauptargumente) + '</div></details>';
                }
                // Link to full document on GitHub
                if (paper.stem && paper.stem.indexOf('_thin_') !== 0) {
                    html += '<a href="https://github.com/chpollin/FemPrompt_SozArb/blob/main/pipeline/knowledge/distilled/' +
                            encodeURIComponent(paper.stem) + '.md" target="_blank" rel="noopener" class="artifact-link">' +
                            '<i class="fas fa-file-alt"></i> Vollstaendiges Wissensdokument auf GitHub</a>';
                }
                html += '</div>';
            }

            html += '<div class="stance-section stance-section--process">';
            html += '<span class="stance-label">Wie extrahiert</span>';
            html += '<p>3-stufige LLM-Pipeline: (1) JSON-Extraktion durch Claude Haiku 4.5 -- das LLM sieht nur den Markdown-Text, nicht das Original-PDF. ' +
                    'Es klassifiziert 10 binaere Kategorien und extrahiert Kernbefund und Argumente. ' +
                    '(2) Deterministisches Markdown-Formatting. ' +
                    '(3) LLM-Verifikation: ein zweiter LLM-Call prueft Vollstaendigkeit und Korrektheit.</p>';
            html += '</div>';

            html += '<div class="stance-section stance-section--limits">';
            html += '<span class="stance-label">Qualitaetsgrenzen</span>';
            if (ske.stage3_overall) {
                html += '<table class="mini-table">';
                html += '<tr><td>Vollstaendigkeit</td><td>' + (ske.stage3_completeness || '?') + '/100</td></tr>';
                html += '<tr><td>Korrektheit</td><td>' + (ske.stage3_correctness || '?') + '/100</td></tr>';
                html += '<tr><td>Gesamt</td><td><strong>' + ske.stage3_overall + '/100</strong></td></tr>';
                html += '</table>';
                if (ske.stage3_overall < 80) {
                    html += '<p class="limitation-note">Score unter 80: Die LLM-Verifikation hat moegliche Qualitaetsprobleme identifiziert. ' +
                            'Haeufige Ursachen: Tabellen/Abbildungen im Original, die in der Markdown-Konversion verloren gingen, ' +
                            'oder fachspezifische Terminologie, die das LLM nicht korrekt einordnen konnte.</p>';
                }
            } else {
                html += '<p>Nicht verifiziert -- dieses Paper hat die Verifikationsstufe nicht durchlaufen ' +
                        '(kein PDF oder Markdown-Konversion fehlgeschlagen). Die Kategorie-Entscheidungen oben basieren auf der ' +
                        'unverifizierten Erstextraktion.</p>';
            }
            html += '<p>Grundsaetzliche Grenze: Das LLM hat keinen Zugang zum Original-PDF. ' +
                    'Was die Markdown-Konversion nicht uebertraegt (Tabellen, Abbildungen, Seitenlayout), kann das LLM nicht sehen und nicht extrahieren.</p>';
            html += '</div>';
        }

    } else if (stageKey === 'assessment') {
        var a = paper.stages.assessment;
        html += '<h3>Assessment</h3>';

        // Handle papers without any assessment
        if (!a || (!a.llm && !a.human)) {
            html += '<div class="stance-section stance-section--limits">';
            html += '<span class="stance-label">Nicht verfuegbar</span>';
            html += '<p>Fuer dieses Paper liegt kein Assessment vor.</p>';
            html += '</div>';
        } else {

        // Ergebnis
        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Ergebnis</span>';
        html += '<div class="decision-row">';
        if (a.llm) {
        html += '<span class="badge badge--' + a.llm.decision.toLowerCase() + '">LLM: ' + a.llm.decision + '</span>';
        if (a.human) {
            html += ' <span class="badge badge--' + a.human.decision.toLowerCase() + '">Human: ' + a.human.decision + '</span>';
        }
        if (a.llm && a.llm.confidence) {
            html += ' <span style="color:#9ca3af;font-size:0.85rem">(Confidence: ' + a.llm.confidence + ')</span>';
        }
        }
        html += '</div>';
        if (a.llm) {
        html += '<p><strong>LLM-Kategorien:</strong> ' + (a.llm.categories.join(', ') || 'keine') + '</p>';
        }
        if (a.human) {
            html += '<p><strong>Human-Kategorien:</strong> ' + (a.human.categories.join(', ') || 'keine') + '</p>';
        }
        html += '</div>';

        // Prozess -- reasoning prominent
        if (a.llm && a.llm.reasoning) {
            html += '<div class="stance-section stance-section--process">';
            html += '<span class="stance-label">So hat das LLM entschieden</span>';
            html += '<p class="process-context">Das LLM bewertet dasselbe Wissensdokument (nicht das Original-Paper) nach 10 identischen Kategorien. ' +
                    'Jede Kategorie mit Ja fuehrt zur Include-Entscheidung.</p>';
            html += '<div class="reasoning-block">' + escapeHtml(a.llm.reasoning) + '</div>';
            html += '</div>';
        }

        // Grenzen (only if disagree)
        if (a.agreement === 'disagree') {
            html += '<div class="stance-section stance-section--limits">';
            html += '<span class="stance-label">Wo Mensch und Maschine divergieren</span>';
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
            html += '<p><span class="badge badge--agree">Agreement</span> Mensch und Maschine kommen zum gleichen Ergebnis. ' +
                    'Das bedeutet nicht, dass die Entscheidung "korrekt" ist -- es bedeutet, dass beide Bewertungswege zum selben Schluss kommen.</p>';
            html += '</div>';
        } else {
            html += '<div class="stance-section stance-section--limits">';
            html += '<span class="stance-label">Einschraenkung</span>';
            html += '<p>Kein Human-Assessment vorhanden. Dieses Paper wurde nur vom LLM bewertet -- ein Vergleich ist nicht moeglich. ' +
                    'Human Assessment deckt 210 von 326 Papers ab (64%).</p>';
            html += '</div>';
        }

        } // end of: else (has assessment)

    } else if (stageKey === 'concepts') {
        html += '<h3>Konzepte</h3>';

        // Knowledge summary first -- context before list
        if (paper.knowledge_summary) {
            html += '<div class="stance-section stance-section--result">';
            html += '<span class="stance-label">Worum geht es in diesem Paper?</span>';
            html += '<div class="reasoning-block">' + escapeHtml(paper.knowledge_summary) + '</div>';
            html += '</div>';
        }

        html += '<div class="stance-section stance-section--result">';
        html += '<span class="stance-label">Extrahierte Konzepte</span>';
        if (paper.concepts && paper.concepts.length) {
            html += '<p>' + paper.concepts.length + ' Konzepte wurden aus diesem Paper extrahiert:</p>';
            html += '<div class="category-chips">';
            paper.concepts.forEach(function(c) {
                html += '<a href="#" class="chip concept-link" data-concept="' + escapeHtml(c) + '">' + escapeHtml(c) + '</a>';
            });
            html += '</div>';
        } else {
            html += '<p>Keine Konzepte extrahiert.</p>';
        }
        html += '</div>';

        html += '<div class="stance-section stance-section--process">';
        html += '<span class="stance-label">Wie Konzepte entstehen</span>';
        html += '<p>Konzepte werden durch LLM-basierte Extraktion (Claude Haiku 4.5) aus dem Wissensdokument gewonnen ' +
                'und anschliessend ueber alle 249 Papers konsolidiert. Varianten wie "AI Literacy", "KI-Kompetenz" und ' +
                '"Artificial Intelligence Literacy" werden zu einem Konzept zusammengefuehrt. ' +
                'Insgesamt ergeben sich 136 konsolidierte Konzepte aus dem Korpus.</p>';
        html += '</div>';

        html += '<div class="stance-section stance-section--limits">';
        html += '<span class="stance-label">Grenzen der Konzept-Extraktion</span>';
        html += '<p>Das LLM extrahiert Konzepte aus dem Wissensdokument, nicht aus dem Original-Paper. ' +
                'Konzepte, die nur in verlorenen Tabellen oder Abbildungen vorkommen, werden nicht erfasst. ' +
                'Die Konsolidierung (Zusammenfuehrung von Varianten) ist LLM-basiert und kann Nuancen verlieren.</p>';
        html += '</div>';
    }

    detail.innerHTML = html;
    scrollToElement(detail);

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
    scrollToElement(panel);

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
    var exContainer = document.getElementById('exemplary-cases');
    if (exContainer && !exContainer.dataset.rendered) {
        exContainer.dataset.rendered = 'true';
        var exemplary = [
            appData.divergences.find(function(d) { return d.pattern === 'Semantische Expansion' && d.severity >= 3; }),
            appData.divergences.find(function(d) { return d.pattern === 'Keyword-Inklusion'; }),
            appData.divergences.find(function(d) { return d.pattern === 'Implizite Feldzugehoerigkeit'; })
        ].filter(Boolean);

        if (exemplary.length > 0) {
            exContainer.className = 'exemplary-cases';
            exContainer.innerHTML = '<h3>Exemplarische Faelle</h3><p class="exemplary-intro">Drei Muster epistemischer Divergenz:</p>' +
                exemplary.map(function(d) {
                    return '<div class="exemplary-card" data-paper-id="' + escapeHtml(d.paper_id) + '">' +
                        '<span class="pattern-badge pattern-badge--' + patternClass(d.pattern) + '">' + escapeHtml(d.pattern) + '</span> ' +
                        '<strong>' + escapeHtml(truncate(d.title, 60)) + '</strong>' +
                        '<p>' + escapeHtml(truncate(d.justification || '', 200)) + '</p>' +
                    '</div>';
                }).join('');

            exContainer.querySelectorAll('.exemplary-card').forEach(function(card) {
                card.addEventListener('click', function() {
                    var d = appData.divergences.find(function(x) { return x.paper_id === card.dataset.paperId; });
                    if (d) renderDivergenceDetail(d);
                });
            });
        }
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
    html += '<table class="comparison-table"><tr><th>Kategorie</th><th>Human</th><th>LLM</th></tr>';
    Object.keys(d.category_comparison || {}).forEach(function(cat) {
        var vals = d.category_comparison[cat];
        var cls = vals.divergent ? ' class="divergent"' : '';
        html += '<tr' + cls + '><td>' + cat + '</td><td>' + vals.human + '</td><td>' + vals.llm + '</td></tr>';
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
    scrollToElement(panel);

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
function scrollToElement(el) {
    setTimeout(function() { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
}

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
