// Wissensnetz -- Konzept-Graph fuer Evidence Companion
// D3 Force-directed graph with ego-network focus, search, and detail panel

(function() {
'use strict';

var graph = null;       // { nodes: [], edges: [] }
var papers = null;      // papers array for lookup
var simulation = null;
var svg = null;
var g = null;           // main group (zoom target)
var zoom = null;
var nodeElements = null;
var edgeElements = null;
var labelElements = null;
var tooltip = null;
var focusedNode = null;
var initialized = false;

// Neighbor lookup (precomputed)
var neighborMap = {};   // nodeId -> Set of neighbor nodeIds

// Category colors (same as research-app.js)
var CAT_COLORS = {
    'AI_Literacies':    '#5b8c5a',
    'Generative_KI':    '#3a7d7e',
    'Prompting':        '#4b7bab',
    'KI_Sonstige':      '#7c6fae',
    'Soziale_Arbeit':   '#b0546e',
    'Bias_Ungleichheit':'#c2694e',
    'Gender':           '#d4943a',
    'Diversitaet':      '#8a7542',
    'Feministisch':     '#a24b7a',
    'Fairness':         '#6a8e4e'
};

var CLUSTER_COLORS = {
    'technik': '#3a7d7e',
    'sozial':  '#b0546e',
    'bridge':  '#7c6fae'
};

// ============================================================
// Init (called from research-app.js on tab switch)
// ============================================================

window.initWissensnetz = function(conceptNodes, conceptEdges, allPapers) {
    if (initialized) return;
    initialized = true;

    graph = {
        nodes: conceptNodes.map(function(n) { return Object.assign({}, n); }),
        edges: conceptEdges.map(function(e) { return Object.assign({}, e); })
    };
    papers = allPapers;

    // Build neighbor map
    neighborMap = {};
    graph.nodes.forEach(function(n) { neighborMap[n.id] = new Set(); });
    graph.edges.forEach(function(e) {
        var src = typeof e.source === 'string' ? e.source : e.source.id;
        var tgt = typeof e.target === 'string' ? e.target : e.target.id;
        if (neighborMap[src]) neighborMap[src].add(tgt);
        if (neighborMap[tgt]) neighborMap[tgt].add(src);
    });

    createTooltip();
    renderGraph();
    setupControls();
};

// ============================================================
// Graph Rendering
// ============================================================

function renderGraph() {
    var container = document.getElementById('graph-container');
    if (!container || container.querySelector('svg')) return;

    var width = container.clientWidth || 900;
    var height = 600;

    svg = d3.select(container).append('svg')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    g = svg.append('g');

    // Zoom
    zoom = d3.zoom().scaleExtent([0.3, 5]).on('zoom', function(event) {
        g.attr('transform', event.transform);
        // Semantic zoom: show more labels at higher zoom
        if (labelElements) {
            var k = event.transform.k;
            labelElements.style('display', function(d) {
                if (k > 1.5) return 'block';
                return d.frequency >= freqThreshold20 ? 'block' : 'none';
            });
        }
    });
    svg.call(zoom);

    // Scales
    var maxFreq = d3.max(graph.nodes, function(d) { return d.frequency; }) || 1;
    var sizeScale = d3.scaleSqrt().domain([2, maxFreq]).range([5, 22]);
    var maxWeight = d3.max(graph.edges, function(d) { return d.weight; }) || 1;
    var edgeScale = d3.scaleLinear().domain([2, maxWeight]).range([0.5, 3]);

    // Top-20 frequency threshold
    var sortedFreqs = graph.nodes.map(function(d) { return d.frequency; }).sort(function(a,b) { return b - a; });
    freqThreshold20 = sortedFreqs.length > 20 ? sortedFreqs[19] : 0;

    // Force simulation
    simulation = d3.forceSimulation(graph.nodes)
        .force('link', d3.forceLink(graph.edges).id(function(d) { return d.id; }).distance(80).strength(0.3))
        .force('charge', d3.forceManyBody().strength(-120).distanceMax(250))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function(d) { return sizeScale(d.frequency) + 3; }))
        .velocityDecay(0.4);

    // Pre-compute layout (300 ticks for stability)
    simulation.stop();
    for (var i = 0; i < 300; i++) simulation.tick();

    // Edges
    edgeElements = g.append('g').attr('class', 'edges')
        .selectAll('line').data(graph.edges).join('line')
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; })
        .attr('stroke', '#d1d5db')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', function(d) { return edgeScale(d.weight); });

    // Nodes
    var nodeG = g.append('g').attr('class', 'nodes')
        .selectAll('g').data(graph.nodes).join('g')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    nodeG.append('circle')
        .attr('r', function(d) { return sizeScale(d.frequency); })
        .attr('fill', function(d) { return CLUSTER_COLORS[d.cluster] || '#9ca3af'; })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('cursor', 'pointer');

    // Divergence ring (concepts appearing in disagree papers)
    var divergeConceptIds = new Set();
    if (papers) {
        papers.forEach(function(p) {
            if (p.stages && p.stages.assessment && p.stages.assessment.agreement === 'disagree') {
                (p.concepts || []).forEach(function(c) { divergeConceptIds.add(c); });
            }
        });
    }
    nodeG.filter(function(d) { return divergeConceptIds.has(d.id); })
        .append('circle')
        .attr('r', function(d) { return sizeScale(d.frequency) + 3; })
        .attr('fill', 'none')
        .attr('stroke', 'var(--danger)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,2')
        .attr('opacity', 0.5);

    nodeElements = nodeG;

    // Labels (top-20 by default)
    labelElements = g.append('g').attr('class', 'labels')
        .selectAll('text').data(graph.nodes).join('text')
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y - sizeScale(d.frequency) - 4; })
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#374151')
        .attr('pointer-events', 'none')
        .style('display', function(d) { return d.frequency >= freqThreshold20 ? 'block' : 'none'; })
        .text(function(d) { return d.label; });

    // Interaction: hover
    nodeG.on('mouseover', function(event, d) {
        showTooltip(event, d);
    }).on('mousemove', function(event) {
        moveTooltip(event);
    }).on('mouseout', function() {
        hideTooltip();
    });

    // Interaction: click -> ego-network + detail
    nodeG.on('click', function(event, d) {
        event.stopPropagation();
        focusOnNode(d);
        showConceptDetail(d);
    });

    // Click on background -> reset
    svg.on('click', function() {
        resetFocus();
        hideDetail();
    });

    // Store sizeScale for reuse
    graph._sizeScale = sizeScale;
}

var freqThreshold20 = 0;

// ============================================================
// Tooltip
// ============================================================

function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.display = 'none';
    document.getElementById('graph-container').appendChild(tooltip);
}

function showTooltip(event, d) {
    var rect = document.getElementById('graph-container').getBoundingClientRect();
    tooltip.innerHTML = '<strong>' + escapeHtml(d.label) + '</strong><br>' +
        d.frequency + ' Papers &middot; ' + (d.cluster || '');
    tooltip.style.display = 'block';
    tooltip.style.left = (event.clientX - rect.left + 12) + 'px';
    tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
}

function moveTooltip(event) {
    var rect = document.getElementById('graph-container').getBoundingClientRect();
    tooltip.style.left = (event.clientX - rect.left + 12) + 'px';
    tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
}

function hideTooltip() {
    if (tooltip) tooltip.style.display = 'none';
}

// ============================================================
// Ego-Network (Focus Mode)
// ============================================================

function focusOnNode(d) {
    focusedNode = d;
    var neighbors = neighborMap[d.id] || new Set();

    // Dim non-connected nodes
    nodeElements.select('circle:first-child')
        .attr('opacity', function(n) {
            return n.id === d.id || neighbors.has(n.id) ? 1 : 0.08;
        });

    // Dim non-connected edges
    edgeElements
        .attr('stroke-opacity', function(e) {
            var src = typeof e.source === 'string' ? e.source : e.source.id;
            var tgt = typeof e.target === 'string' ? e.target : e.target.id;
            return src === d.id || tgt === d.id ? 0.6 : 0.03;
        })
        .attr('stroke', function(e) {
            var src = typeof e.source === 'string' ? e.source : e.source.id;
            var tgt = typeof e.target === 'string' ? e.target : e.target.id;
            return src === d.id || tgt === d.id ? '#78716c' : '#d1d5db';
        });

    // Show labels for focused + neighbors
    labelElements
        .style('display', function(n) {
            return n.id === d.id || neighbors.has(n.id) ? 'block' : 'none';
        })
        .attr('font-weight', function(n) {
            return n.id === d.id ? 'bold' : 'normal';
        });
}

function resetFocus() {
    focusedNode = null;
    if (!nodeElements) return;

    nodeElements.select('circle:first-child').attr('opacity', 1);
    edgeElements.attr('stroke-opacity', 0.4).attr('stroke', '#d1d5db');
    labelElements
        .style('display', function(d) { return d.frequency >= freqThreshold20 ? 'block' : 'none'; })
        .attr('font-weight', 'normal');
}

// ============================================================
// Concept Detail Panel
// ============================================================

function showConceptDetail(d) {
    var panel = document.getElementById('graph-detail');
    var neighbors = neighborMap[d.id] || new Set();

    // Find papers containing this concept
    var conceptPapers = [];
    if (papers) {
        papers.forEach(function(p) {
            if (p.concepts && p.concepts.indexOf(d.id) >= 0) {
                conceptPapers.push(p);
            }
        });
    }

    // Find neighbor concepts with co-occurrence counts
    var neighborList = [];
    graph.edges.forEach(function(e) {
        var src = typeof e.source === 'string' ? e.source : e.source.id;
        var tgt = typeof e.target === 'string' ? e.target : e.target.id;
        if (src === d.id) neighborList.push({ id: tgt, weight: e.weight });
        if (tgt === d.id) neighborList.push({ id: src, weight: e.weight });
    });
    neighborList.sort(function(a, b) { return b.weight - a.weight; });

    // Count divergence papers
    var divergeCount = conceptPapers.filter(function(p) {
        return p.stages && p.stages.assessment && p.stages.assessment.agreement === 'disagree';
    }).length;

    var html = '<div class="graph-detail-inner">';
    html += '<button class="graph-detail-close" id="graph-detail-close">&times;</button>';
    html += '<h3>' + escapeHtml(d.label) + '</h3>';
    html += '<p class="detail-meta">' + d.frequency + ' Papers &middot; ' +
        '<span style="color:' + (CLUSTER_COLORS[d.cluster] || '#999') + ';font-weight:600;">' + (d.cluster || '') + '</span>';
    if (divergeCount > 0) {
        html += ' &middot; <span style="color:var(--danger);">' + divergeCount + ' Divergenz</span>';
    }
    html += '</p>';

    if (d.definition) {
        html += '<p class="detail-def">' + escapeHtml(d.definition) + '</p>';
    }

    // Papers list
    if (conceptPapers.length > 0) {
        html += '<h4>Papers (' + conceptPapers.length + ')</h4>';
        html += '<ul class="graph-papers-list">';
        conceptPapers.slice(0, 30).forEach(function(p) {
            var statusClass = '';
            if (p.stages && p.stages.assessment) {
                if (p.stages.assessment.agreement === 'disagree') statusClass = ' paper-diverge';
                else if (p.stages.assessment.agreement === 'agree') statusClass = ' paper-agree';
            }
            html += '<li class="graph-paper-item' + statusClass + '" data-paper-id="' + escapeHtml(p.id) + '">' +
                escapeHtml((p.author_year || '') + ': ' + (p.title || '').substring(0, 60)) +
                (p.title && p.title.length > 60 ? '...' : '') + '</li>';
        });
        if (conceptPapers.length > 30) {
            html += '<li class="graph-paper-more">... und ' + (conceptPapers.length - 30) + ' weitere</li>';
        }
        html += '</ul>';
    }

    // Neighbor concepts
    if (neighborList.length > 0) {
        html += '<h4>Verbundene Konzepte</h4>';
        html += '<ul class="graph-neighbors-list">';
        neighborList.slice(0, 12).forEach(function(n) {
            html += '<li class="graph-neighbor-item" data-concept="' + escapeHtml(n.id) + '">' +
                escapeHtml(n.id) + ' <span class="neighbor-weight">(' + n.weight + ')</span></li>';
        });
        html += '</ul>';
    }

    html += '</div>';
    panel.innerHTML = html;
    panel.style.display = 'block';

    // Event: close button
    document.getElementById('graph-detail-close').addEventListener('click', function(e) {
        e.stopPropagation();
        hideDetail();
        resetFocus();
    });

    // Event: click paper -> switch to Korpus + open detail
    panel.querySelectorAll('.graph-paper-item').forEach(function(li) {
        li.addEventListener('click', function(e) {
            e.stopPropagation();
            var paperId = li.dataset.paperId;
            // Find paper in allPapers (research-app.js global)
            if (window.allPapers) {
                var paper = window.allPapers.find(function(p) { return p.id === paperId; });
                if (paper) {
                    // Switch to Korpus tab
                    document.querySelectorAll('.view-tab').forEach(function(t) {
                        t.classList.toggle('active', t.dataset.view === 'korpus');
                    });
                    document.querySelectorAll('.view-content').forEach(function(v) {
                        v.classList.toggle('active', v.id === 'view-korpus');
                        v.style.display = v.id === 'view-korpus' ? '' : 'none';
                    });
                    if (window.showPaperDetail) window.showPaperDetail(paper);
                }
            }
        });
    });

    // Event: click neighbor -> focus that node
    panel.querySelectorAll('.graph-neighbor-item').forEach(function(li) {
        li.addEventListener('click', function(e) {
            e.stopPropagation();
            var conceptId = li.dataset.concept;
            var node = graph.nodes.find(function(n) { return n.id === conceptId; });
            if (node) {
                focusOnNode(node);
                showConceptDetail(node);
                zoomToNode(node);
            }
        });
    });
}

function hideDetail() {
    var panel = document.getElementById('graph-detail');
    if (panel) panel.style.display = 'none';
}

// ============================================================
// Search + Zoom
// ============================================================

function zoomToNode(node) {
    if (!svg || !zoom) return;
    var container = document.getElementById('graph-container');
    var width = container.clientWidth || 900;
    var height = 600;
    var transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(2)
        .translate(-node.x, -node.y);
    svg.transition().duration(600).call(zoom.transform, transform);
}

function searchConcept(query) {
    if (!query || !nodeElements) {
        resetFocus();
        return;
    }
    var q = query.toLowerCase();
    var matches = graph.nodes.filter(function(n) {
        return n.id.toLowerCase().indexOf(q) >= 0 || n.label.toLowerCase().indexOf(q) >= 0;
    });

    if (matches.length === 0) {
        resetFocus();
        return;
    }

    // If exactly one match, focus + zoom
    if (matches.length === 1) {
        focusOnNode(matches[0]);
        showConceptDetail(matches[0]);
        zoomToNode(matches[0]);
        return;
    }

    // Multiple matches: highlight all, dim rest
    var matchIds = new Set(matches.map(function(m) { return m.id; }));
    nodeElements.select('circle:first-child')
        .attr('opacity', function(n) { return matchIds.has(n.id) ? 1 : 0.08; });
    edgeElements.attr('stroke-opacity', 0.03);
    labelElements.style('display', function(n) { return matchIds.has(n.id) ? 'block' : 'none'; });
}

// ============================================================
// Controls
// ============================================================

function setupControls() {
    // Search
    var searchInput = document.getElementById('graph-search');
    if (searchInput) {
        var debounce = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounce);
            debounce = setTimeout(function() {
                searchConcept(searchInput.value.trim());
            }, 250);
        });
    }

    // Frequency slider
    var slider = document.getElementById('freq-slider');
    var freqValue = document.getElementById('freq-value');
    if (slider) {
        slider.addEventListener('input', function() {
            freqValue.textContent = slider.value;
            var minFreq = parseInt(slider.value);
            // Show/hide nodes based on frequency
            nodeElements.style('display', function(d) { return d.frequency >= minFreq ? '' : 'none'; });
            edgeElements.style('display', function(e) {
                var src = typeof e.source === 'string' ? e.source : e.source;
                var tgt = typeof e.target === 'string' ? e.target : e.target;
                return src.frequency >= minFreq && tgt.frequency >= minFreq ? '' : 'none';
            });
            labelElements.style('display', function(d) {
                return d.frequency >= minFreq && d.frequency >= freqThreshold20 ? 'block' : 'none';
            });
        });
    }

    // Reset button
    var resetBtn = document.getElementById('graph-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFocus();
            hideDetail();
            if (searchInput) searchInput.value = '';
            if (slider) { slider.value = 2; freqValue.textContent = '2'; }
            nodeElements.style('display', '');
            edgeElements.style('display', '');
            // Reset zoom
            svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
        });
    }
}

// ============================================================
// Utility
// ============================================================

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

})();
