(function() { 'use strict';

// ==========================================================================
// State
// ==========================================================================
let appData = null;
let activeView = 'pipeline';
let selectedPaper = null;
let selectedConcept = null;
let activePatternFilter = 'all';
let activeDtypeFilter = 'all';
let divergenceSearchQuery = '';
let conceptSimulation = null;

// ==========================================================================
// Init
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    setupViewNavigation();
    setupDivergenceFilters();
    setupConceptControls();

    try {
        const resp = await fetch('data/promptotyping_v2.json');
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
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.dataset.view;
            switchView(viewId);
        });
    });
}

function switchView(viewId) {
    activeView = viewId;
    document.querySelectorAll('.view-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.view === viewId);
    });
    document.querySelectorAll('.view-content').forEach(s => {
        s.style.display = s.id === 'view-' + viewId ? '' : 'none';
    });
    renderActiveView();
}

function renderActiveView() {
    if (!appData) return;
    switch (activeView) {
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
    selectedPaper = appData.papers.find(p => p.id === paperId || p.stem === paperId);
    switchView('journey');
}

function navigateToConcept(conceptId) {
    selectedConcept = conceptId;
    switchView('concepts');
}

// ==========================================================================
// View 1: Pipeline (Sankey)
// ==========================================================================
function renderPipeline() {
    const container = document.getElementById('sankey-container');
    if (container.querySelector('svg')) return;

    const flow = appData.pipeline.flow;
    const width = container.clientWidth || 1000;
    const height = 450;

    const svg = d3.select(container).append('svg')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    const margin = { top: 20, right: 160, bottom: 20, left: 20 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const sankey = d3.sankey()
        .nodeId(function(d) { return d.id; })
        .nodeWidth(20)
        .nodePadding(12)
        .extent([[0, 0], [innerW, innerH]]);

    const graph = sankey({
        nodes: flow.nodes.map(function(d) { return Object.assign({}, d); }),
        links: flow.links.map(function(d) { return Object.assign({}, d); })
    });

    var nodeColor = function(d) {
        if (d.id.indexOf('missing') >= 0 || d.id.indexOf('fail') >= 0 || d.id.indexOf('not_assessed') >= 0)
            return '#ef4444';
        if (d.id === 'disagree') return '#ef4444';
        if (d.id === 'agree') return '#10b981';
        return '#1e40af';
    };

    // Links
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

    // Nodes
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
    html += '<p>' + escapeHtml(stage.description) + '</p>';
    html += '<p><span class="badge badge--' + (stage.type === 'deterministic' ? 'deterministic' : 'probabilistic') + '">' + stage.type + '</span> ';
    html += 'Input: ' + stage.input + ' &rarr; Output: ' + stage.output;
    if (stage.loss) html += ' (Verlust: ' + stage.loss + ')';
    html += '</p>';

    if (stage.prompt) {
        html += '<h4>Prompt</h4><div class="prompt-block">' + escapeHtml(stage.prompt) + '</div>';
    }
    if (stage.prompts) {
        if (stage.prompts.stage1) {
            html += '<h4>Stufe 1: Extract & Classify</h4><div class="prompt-block">' + escapeHtml(stage.prompts.stage1) + '</div>';
        }
        if (stage.prompts.stage2_note) {
            html += '<p><em>' + escapeHtml(stage.prompts.stage2_note) + '</em></p>';
        }
        if (stage.prompts.stage3) {
            html += '<h4>Stufe 3: Verify</h4><div class="prompt-block">' + escapeHtml(stage.prompts.stage3) + '</div>';
        }
    }

    if (stage.limitations && stage.limitations.length) {
        html += '<h4>Limitationen</h4><ul class="limitation-list">';
        stage.limitations.forEach(function(l) { html += '<li>' + escapeHtml(l) + '</li>'; });
        html += '</ul>';
    }

    panel.innerHTML = html;
    panel.style.display = '';
}

// ==========================================================================
// View 2: Paper Journey
// ==========================================================================
function renderJourney() {
    setupJourneySearch();
    if (selectedPaper) {
        renderJourneyTimeline(selectedPaper);
    }
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
        { key: 'identification', name: 'Identifikation', type: 'mixed',
          summary: paper.stages.identification.in_zotero ? 'In Zotero' : 'Nicht in Zotero' },
        { key: 'conversion', name: 'Konversion', type: 'deterministic',
          summary: 'PDF + Markdown' },
        { key: 'ske', name: 'SKE', type: 'probabilistic',
          summary: 'Conf: ' + (paper.stages.ske.stage3_overall || '?') },
        { key: 'assessment', name: 'Assessment', type: 'probabilistic',
          summary: paper.stages.assessment.agreement === 'disagree'
              ? 'Divergenz' : paper.stages.assessment.agreement === 'agree'
                  ? 'Agreement' : 'LLM only' },
        { key: 'concepts', name: 'Konzepte', type: 'mixed',
          summary: paper.concepts.length + ' Konzepte' },
    ];

    container.innerHTML = stages.map(function(s, i) {
        var arrow = i < stages.length - 1 ? '<div class="journey-arrow"><i class="fas fa-chevron-right"></i></div>' : '';
        return '<div class="journey-stage ' + s.type + '" data-stage="' + s.key + '">' +
            '<div class="journey-stage-name">' + s.name + '</div>' +
            '<div class="journey-stage-summary">' + s.summary + '</div>' +
            '</div>' + arrow;
    }).join('');

    container.querySelectorAll('.journey-stage').forEach(function(el) {
        el.addEventListener('click', function() {
            container.querySelectorAll('.journey-stage').forEach(function(e) { e.classList.remove('active'); });
            el.classList.add('active');
            renderJourneyStageDetail(paper, el.dataset.stage);
        });
    });

    var first = container.querySelector('.journey-stage');
    if (first) { first.classList.add('active'); renderJourneyStageDetail(paper, 'identification'); }
}

function renderJourneyStageDetail(paper, stageKey) {
    var panel = document.getElementById('journey-detail');
    panel.style.display = '';
    var html = '';

    var allCats = ['AI_Literacies','Generative_KI','Prompting','KI_Sonstige','Soziale_Arbeit','Bias_Ungleichheit','Gender','Diversitaet','Feministisch','Fairness'];

    switch (stageKey) {
        case 'identification':
            html = '<h3>Identifikation</h3>';
            html += '<p><strong>Titel:</strong> ' + escapeHtml(paper.title) + '</p>';
            html += '<p><strong>Autor/Jahr:</strong> ' + escapeHtml(paper.author_year) + '</p>';
            html += '<p><strong>In Zotero:</strong> ' + (paper.stages.identification.in_zotero ? 'Ja' : 'Nein') + '</p>';
            break;

        case 'conversion':
            html = '<h3>Konversion (PDF &rarr; Markdown)</h3>';
            html += '<p><span class="badge badge--deterministic">Deterministisch</span> Docling (IBM)</p>';
            html += '<p>PDF akquiriert: Ja &middot; Markdown konvertiert: Ja</p>';
            html += '<p style="color:#d97706;font-size:0.85rem">Limitation: Tabellen und Abbildungen gehen verloren</p>';
            break;

        case 'ske':
            var ske = paper.stages.ske;
            html = '<h3>Structured Knowledge Extraction</h3>';
            html += '<p><span class="badge badge--probabilistic">Probabilistisch</span> 3-Stage LLM-Pipeline</p>';

            var s1cats = Object.entries(ske.stage1_categories || {}).filter(function(e) { return e[1]; }).map(function(e) { return e[0]; });
            html += '<p><strong>Stufe 1 -- Kategorien:</strong> ' + (s1cats.join(', ') || 'keine') + '</p>';
            html += '<p><strong>Stufe 1 -- Argumente:</strong> ' + (ske.stage1_arguments_count || 0) + '</p>';
            if (ske.stage1_key_finding) {
                html += '<div class="reasoning-block">' + escapeHtml(ske.stage1_key_finding) + '</div>';
            }

            html += '<h4>Stufe 3 -- Verifikation</h4>';
            html += '<table class="comparison-table"><tr><th>Metrik</th><th>Score</th></tr>';
            html += '<tr><td>Completeness</td><td>' + (ske.stage3_completeness || '?') + '</td></tr>';
            html += '<tr><td>Correctness</td><td>' + (ske.stage3_correctness || '?') + '</td></tr>';
            html += '<tr><td><strong>Overall</strong></td><td><strong>' + (ske.stage3_overall || '?') + '</strong></td></tr>';
            html += '</table>';
            break;

        case 'assessment':
            var assess = paper.stages.assessment;
            html = '<h3>Duales Assessment</h3>';

            if (assess.llm) {
                html += '<p><strong>LLM:</strong> <span class="badge badge--' + (assess.llm.decision === 'Include' ? 'include' : 'exclude') + '">' + assess.llm.decision + '</span> (Confidence: ' + assess.llm.confidence + ')</p>';
                html += '<p>Kategorien: ' + (assess.llm.categories.join(', ') || 'keine') + '</p>';
            }
            if (assess.human) {
                html += '<p><strong>Human:</strong> <span class="badge badge--' + (assess.human.decision === 'Include' ? 'include' : 'exclude') + '">' + assess.human.decision + '</span></p>';
                html += '<p>Kategorien: ' + (assess.human.categories.join(', ') || 'keine') + '</p>';
            }

            if (assess.agreement === 'disagree') {
                html += '<p><span class="badge badge--disagree">Disagreement</span>';
                if (assess.divergence_pattern) {
                    html += ' <span class="pattern-badge pattern-badge--' + patternClass(assess.divergence_pattern) + '">' + escapeHtml(assess.divergence_pattern) + '</span>';
                }
                html += '</p>';

                if (assess.llm && assess.human) {
                    html += '<table class="comparison-table"><tr><th>Kategorie</th><th>Human</th><th>LLM</th></tr>';
                    allCats.forEach(function(cat) {
                        var h = assess.human.categories.indexOf(cat) >= 0;
                        var l = assess.llm.categories.indexOf(cat) >= 0;
                        var cls = h !== l ? ' class="divergent"' : '';
                        html += '<tr' + cls + '><td>' + cat + '</td><td>' + (h ? 'Ja' : 'Nein') + '</td><td>' + (l ? 'Ja' : 'Nein') + '</td></tr>';
                    });
                    html += '</table>';
                }

                if (assess.llm && assess.llm.reasoning) {
                    html += '<h4>LLM Reasoning</h4><div class="reasoning-block">' + escapeHtml(assess.llm.reasoning) + '</div>';
                }
            } else if (assess.agreement === 'agree') {
                html += '<p><span class="badge badge--agree">Agreement</span></p>';
            } else {
                html += '<p><span class="badge" style="background:#f3f4f6;color:#6b7280">Nur LLM</span></p>';
            }
            break;

        case 'concepts':
            html = '<h3>Konzepte</h3>';
            if (paper.concepts.length) {
                html += '<ul>';
                paper.concepts.forEach(function(c) {
                    html += '<li><a href="#" class="concept-link" data-concept="' + escapeHtml(c) + '" style="color:#1e40af;cursor:pointer">' + escapeHtml(c) + '</a></li>';
                });
                html += '</ul>';
            } else {
                html += '<p>Keine Konzepte extrahiert.</p>';
            }
            if (paper.knowledge_summary) {
                html += '<h4>Kernbefund</h4><div class="reasoning-block">' + escapeHtml(paper.knowledge_summary) + '</div>';
            }
            break;
    }

    panel.innerHTML = html;

    panel.querySelectorAll('.concept-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToConcept(link.dataset.concept);
        });
    });
}

// ==========================================================================
// View 3: Concept Explorer
// ==========================================================================
function renderConcepts() {
    renderConceptGraph();
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
                    return q && d.id.toLowerCase().indexOf(q) >= 0 ? '#ef4444' : '#fff';
                })
                .attr('stroke-width', function(d) {
                    return q && d.id.toLowerCase().indexOf(q) >= 0 ? 3 : 2;
                });
        });
    }
}

function renderConceptGraph() {
    var container = document.getElementById('concept-graph-container');
    if (container.querySelector('svg')) return;
    if (!appData) return;

    var minFreq = parseInt(document.getElementById('concept-freq-slider').value || '3');
    var conceptData = appData.concepts;

    var filteredNodes = conceptData.nodes.filter(function(n) { return n.frequency >= minFreq; });
    var nodeIds = {};
    filteredNodes.forEach(function(n) { nodeIds[n.id] = true; });
    var filteredEdges = conceptData.edges.filter(function(e) {
        return nodeIds[e.source] && nodeIds[e.target];
    });

    // Deep copy for D3 mutation
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

    var colorScale = d3.scaleLinear()
        .domain([2, maxFreq / 2, maxFreq])
        .range(['#9ca3af', '#3b82f6', '#1e40af']);

    var sizeScale = d3.scaleSqrt().domain([2, maxFreq]).range([6, 28]);

    var maxWeight = d3.max(filteredEdges, function(d) { return d.weight; }) || 1;
    var edgeScale = d3.scaleLinear().domain([2, maxWeight]).range([1, 5]);

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
        .attr('fill', function(d) { return colorScale(d.frequency); })
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('click', function(event, d) {
            selectedConcept = d.id;
            renderConceptDetail(d.id);
        });

    nodeG.append('text')
        .text(function(d) { return d.frequency >= minFreq + 2 ? d.label : ''; })
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

    var papers = appData.papers.filter(function(p) { return p.concepts.indexOf(conceptId) >= 0; });

    var html = '<h3>' + escapeHtml(conceptId) + ' <span style="color:#9ca3af;font-weight:normal">(' + node.frequency + ' Papers)</span></h3>';

    if (node.definition) {
        html += '<p>' + escapeHtml(node.definition) + '</p>';
    }

    if (related.length) {
        html += '<h4>Co-occurrence</h4><table class="comparison-table"><tr><th>Konzept</th><th>Gemeinsame Papers</th></tr>';
        related.forEach(function(r) {
            html += '<tr><td><a href="#" class="concept-link" data-concept="' + escapeHtml(r.name) + '" style="color:#1e40af">' + escapeHtml(r.name) + '</a></td><td>' + r.weight + '</td></tr>';
        });
        html += '</table>';
    }

    if (papers.length) {
        html += '<h4>Papers (' + papers.length + ')</h4><ul class="concept-papers-list">';
        papers.slice(0, 20).forEach(function(p) {
            html += '<li data-stem="' + escapeHtml(p.stem) + '">' + escapeHtml(truncate(p.title, 70)) + ' <span style="color:#9ca3af">(' + escapeHtml(p.author_year) + ')</span></li>';
        });
        if (papers.length > 20) html += '<li style="color:#9ca3af">... und ' + (papers.length - 20) + ' weitere</li>';
        html += '</ul>';
    }

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
    if (div.innerHTML) return;

    var meta = appData.meta;
    var cm = meta.confusion_matrix || {};

    var patterns = {};
    appData.divergences.forEach(function(d) {
        var p = d.pattern || 'unklassifiziert';
        patterns[p] = (patterns[p] || 0) + 1;
    });

    div.innerHTML =
        '<div class="summary-card"><div class="summary-value">' + meta.disagreements + '</div><div class="summary-label">Disagreements</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (cm.Exclude_Include || 78) + '</div><div class="summary-label">LLM Include / Human Exclude</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (cm.Include_Exclude || 23) + '</div><div class="summary-label">Human Include / LLM Exclude</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + meta.kappa + '</div><div class="summary-label">Cohen\'s Kappa</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (patterns['Semantische Expansion'] || 0) + '</div><div class="summary-label">Semantische Expansion</div></div>' +
        '<div class="summary-card"><div class="summary-value">' + (patterns['Keyword-Inklusion'] || 0) + '</div><div class="summary-label">Keyword-Inklusion</div></div>';
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
        return '<div class="divergence-card" data-paper-id="' + escapeHtml(d.paper_id) + '">' +
            '<div>' +
            '<div class="divergence-card-title">' + escapeHtml(truncate(d.title, 70)) + '</div>' +
            '<div class="divergence-card-meta">' + escapeHtml(d.author_year) + ' &middot; ' +
                'H: ' + d.human_decision + ' / L: ' + d.llm_decision + ' &middot; ' +
                d.n_affected + ' Kategorien</div>' +
            '</div>' +
            '<div class="divergence-card-badges">' +
            (d.pattern ? '<span class="pattern-badge pattern-badge--' + patternClass(d.pattern) + '">' + escapeHtml(d.pattern) + '</span>' : '') +
            '<span class="badge badge--' + (d.human_decision === 'Include' ? 'include' : 'exclude') + '">H: ' + d.human_decision + '</span>' +
            '<span class="badge badge--' + (d.llm_decision === 'Include' ? 'include' : 'exclude') + '">L: ' + d.llm_decision + '</span>' +
            '</div></div>';
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

    html += '<h4>Kategorie-Vergleich</h4>';
    html += '<table class="comparison-table"><tr><th>Kategorie</th><th>Human</th><th>LLM</th><th>Divergent</th></tr>';
    Object.keys(d.category_comparison || {}).forEach(function(cat) {
        var vals = d.category_comparison[cat];
        var cls = vals.divergent ? ' class="divergent"' : '';
        html += '<tr' + cls + '><td>' + cat + '</td><td>' + vals.human + '</td><td>' + vals.llm + '</td><td>' + (vals.divergent ? 'X' : '') + '</td></tr>';
    });
    html += '</table>';

    if (d.llm_reasoning) {
        html += '<h4>LLM-Reasoning</h4><div class="reasoning-block">' + escapeHtml(d.llm_reasoning) + '</div>';
    }

    if (d.justification) {
        html += '<h4>Muster-Begruendung</h4><p>' + escapeHtml(d.justification) + '</p>';
    }

    panel.innerHTML = html;
    panel.style.display = '';
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
