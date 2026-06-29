// Wissensnetz -- D3 force-directed concept graph with cluster layout,
// divergence mode, ego-network focus, and search.

(function() {
'use strict';

const EC = window.EC;

let graph = null;
let papers = null;
let simulation = null;
let svg = null;
let g = null;
let zoom = null;
let nodeElements = null;
let edgeElements = null;
let labelElements = null;
let labelBgElements = null;
let clusterBgs = null;
let tooltip = null;
let focusedNode = null;
let initialized = false;
let divergenceMode = false;
let freqThreshold10 = 0;
let freqThreshold20 = 0;
let currentZoom = 1;

let neighborMap = {};
let nodeById = {};
let divergeConceptIds = new Set();
let conceptDivergeCounts = {};
let conceptPatterns = {};

const CLUSTER_COLORS = { technik: '#3a7d7e', sozial: '#b0546e', bridge: '#7c6fae' };
const CLUSTER_LABELS = { technik: 'Technik', bridge: 'Bruecke', sozial: 'Sozial' };
const PATTERN_COLORS = {
    'Semantische Expansion': '#4b7bab',
    'Keyword-Inklusion': '#d4943a',
    'Implizite Feldzugehoerigkeit': '#78716c'
};

// D3 resolves an edge endpoint to the node object after the simulation runs, so
// it can be either the raw id string or the resolved node; endId normalizes it.
function endId(end) { return typeof end === 'string' ? end : end.id; }

window.initWissensnetz = function(conceptNodes, conceptEdges, allPapers) {
    if (initialized) return;
    initialized = true;

    graph = {
        nodes: conceptNodes.map(function(n) { return Object.assign({}, n); }),
        edges: conceptEdges.map(function(e) { return Object.assign({}, e); })
    };
    papers = allPapers;

    neighborMap = {};
    nodeById = {};
    graph.nodes.forEach(function(n) { neighborMap[n.id] = new Set(); nodeById[n.id] = n; });
    graph.edges.forEach(function(e) {
        const src = endId(e.source), tgt = endId(e.target);
        if (neighborMap[src]) neighborMap[src].add(tgt);
        if (neighborMap[tgt]) neighborMap[tgt].add(src);
    });

    buildDivergenceData();
    createTooltip();
    renderGraph();
    setupControls();
};

window.focusWissensnetzConcept = function(conceptId) {
    if (!initialized || !graph) return;
    const node = nodeById[conceptId];
    if (node) {
        if (window.switchView) window.switchView('wissensnetz');
        setTimeout(function() {
            focusOnNode(node);
            showConceptDetail(node);
            zoomToNode(node);
        }, 100);
    }
};

function buildDivergenceData() {
    divergeConceptIds = new Set();
    conceptDivergeCounts = {};
    conceptPatterns = {};
    if (!papers) return;

    const mainPapers = EC.getAllPapers();
    papers.forEach(function(p) {
        if (p.stages && p.stages.assessment && p.stages.assessment.agreement === 'disagree') {
            const mainPaper = mainPapers ? mainPapers.find(function(mp) { return mp.id === p.id; }) : null;
            const pattern = mainPaper && mainPaper.divergence ? mainPaper.divergence.pattern : null;

            (p.concepts || []).forEach(function(c) {
                divergeConceptIds.add(c);
                conceptDivergeCounts[c] = (conceptDivergeCounts[c] || 0) + 1;
                if (pattern) {
                    if (!conceptPatterns[c]) conceptPatterns[c] = {};
                    conceptPatterns[c][pattern] = (conceptPatterns[c][pattern] || 0) + 1;
                }
            });
        }
    });
}

function getDominantPattern(conceptId) {
    const pats = conceptPatterns[conceptId];
    if (!pats) return null;
    let best = null, bestCount = 0;
    Object.keys(pats).forEach(function(p) {
        if (pats[p] > bestCount) { best = p; bestCount = pats[p]; }
    });
    return best;
}

function renderGraph() {
    const container = document.getElementById('graph-container');
    if (!container || container.querySelector('svg')) return;

    const width = container.clientWidth || 900;
    const height = Math.max(700, window.innerHeight - 280);
    container.style.height = height + 'px';

    svg = d3.select(container).append('svg')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    g = svg.append('g');

    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const sortedFreqs = graph.nodes.map(function(d) { return d.frequency; }).sort(function(a, b) { return b - a; });
    freqThreshold10 = sortedFreqs.length > 10 ? sortedFreqs[9] : 0;
    freqThreshold20 = sortedFreqs.length > 20 ? sortedFreqs[19] : 0;

    zoom = d3.zoom().scaleExtent([0.3, 5]).on('zoom', function(event) {
        g.attr('transform', event.transform);
        currentZoom = event.transform.k;
        updateLabelVisibility();
    });
    svg.call(zoom);

    const maxFreq = d3.max(graph.nodes, function(d) { return d.frequency; }) || 1;
    const sizeScale = d3.scaleSqrt().domain([2, maxFreq]).range([5, 22]);
    const maxWeight = d3.max(graph.edges, function(d) { return d.weight; }) || 1;
    const edgeScale = d3.scaleLinear().domain([2, maxWeight]).range([0.5, 3]);

    const clusterCenters = {
        technik: { x: width * 0.15, y: height * 0.3 },
        bridge:  { x: width * 0.4,  y: height * 0.5 },
        sozial:  { x: width * 0.72, y: height * 0.5 }
    };

    // Cluster force dominant, link force weakened, strong repulsion.
    simulation = d3.forceSimulation(graph.nodes)
        .force('link', d3.forceLink(graph.edges).id(function(d) { return d.id; }).distance(100).strength(0.06))
        .force('charge', d3.forceManyBody().strength(-180).distanceMax(350))
        .force('collision', d3.forceCollide().radius(function(d) { return sizeScale(d.frequency) + 6; }))
        .force('cluster', function(alpha) {
            graph.nodes.forEach(function(d) {
                const center = clusterCenters[d.cluster] || clusterCenters.bridge;
                d.vx += (center.x - d.x) * alpha * 0.4;
                d.vy += (center.y - d.y) * alpha * 0.4;
            });
        })
        .velocityDecay(0.35);

    simulation.stop();
    for (let i = 0; i < 400; i++) simulation.tick();

    clusterBgs = g.append('g').attr('class', 'cluster-bgs');
    ['technik', 'bridge', 'sozial'].forEach(function(cluster) {
        const clusterNodes = graph.nodes.filter(function(n) { return n.cluster === cluster; });
        if (clusterNodes.length === 0) return;

        const cx = d3.mean(clusterNodes, function(n) { return n.x; });
        const cy = d3.mean(clusterNodes, function(n) { return n.y; });
        const maxDist = d3.max(clusterNodes, function(n) {
            return Math.sqrt(Math.pow(n.x - cx, 2) + Math.pow(n.y - cy, 2));
        }) || 50;

        clusterBgs.append('ellipse')
            .attr('cx', cx).attr('cy', cy)
            .attr('rx', maxDist + 50).attr('ry', maxDist + 40)
            .attr('fill', CLUSTER_COLORS[cluster]).attr('opacity', 0.06)
            .attr('stroke', CLUSTER_COLORS[cluster]).attr('stroke-opacity', 0.15)
            .attr('stroke-width', 1.5).attr('stroke-dasharray', '6,4');

        clusterBgs.append('text')
            .attr('x', cx).attr('y', cy - maxDist - 18)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '600').attr('letter-spacing', '0.05em')
            .attr('fill', CLUSTER_COLORS[cluster]).attr('opacity', 0.5)
            .text(CLUSTER_LABELS[cluster]);
    });

    edgeElements = g.append('g').attr('class', 'edges')
        .selectAll('line').data(graph.edges).join('line')
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; })
        .attr('stroke', '#d1d5db')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', function(d) { return edgeScale(d.weight); });

    const nodeG = g.append('g').attr('class', 'nodes')
        .selectAll('g').data(graph.nodes).join('g')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    nodeG.append('circle')
        .attr('r', function(d) { return sizeScale(d.frequency); })
        .attr('fill', function(d) { return CLUSTER_COLORS[d.cluster] || '#9ca3af'; })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('cursor', 'pointer');

    nodeG.filter(function(d) { return divergeConceptIds.has(d.id); })
        .append('circle')
        .attr('class', 'diverge-ring')
        .attr('r', function(d) { return sizeScale(d.frequency) + 3; })
        .attr('fill', 'none')
        .attr('stroke', function(d) {
            const pat = getDominantPattern(d.id);
            return pat ? (PATTERN_COLORS[pat] || 'var(--danger)') : 'var(--danger)';
        })
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,2')
        .attr('opacity', 0.5);

    nodeElements = nodeG;

    const labelGroup = g.append('g').attr('class', 'labels');

    labelBgElements = labelGroup.selectAll('rect').data(graph.nodes).join('rect')
        .attr('x', function(d) { return d.x - (d.label.length * 3); })
        .attr('y', function(d) { return d.y - sizeScale(d.frequency) - 14; })
        .attr('width', function(d) { return d.label.length * 6; })
        .attr('height', 12)
        .attr('fill', 'white')
        .attr('opacity', 0.75)
        .attr('rx', 2)
        .attr('pointer-events', 'none')
        .style('display', function(d) { return d.frequency >= freqThreshold10 ? 'block' : 'none'; });

    labelElements = labelGroup.selectAll('text').data(graph.nodes).join('text')
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y - sizeScale(d.frequency) - 4; })
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#374151')
        .attr('pointer-events', 'none')
        .style('display', function(d) { return d.frequency >= freqThreshold10 ? 'block' : 'none'; })
        .text(function(d) { return d.label; });

    nodeG.on('mouseover', function(event, d) {
        d3.select(this).select('circle:first-child')
            .attr('filter', 'url(#glow)')
            .transition().duration(150)
            .attr('stroke-width', 2.5);
        showTooltip(event, d);
    }).on('mousemove', function(event) {
        moveTooltip(event);
    }).on('mouseout', function() {
        d3.select(this).select('circle:first-child')
            .attr('filter', null)
            .transition().duration(150)
            .attr('stroke-width', 1.5);
        hideTooltip();
    });

    nodeG.on('click', function(event, d) {
        event.stopPropagation();
        focusOnNode(d);
        showConceptDetail(d);
    });

    svg.on('click', function() {
        resetFocus();
        hideDetail();
    });
}

function updateLabelVisibility() {
    if (!labelElements || focusedNode) return;
    const threshold = currentZoom > 1.8 ? 0 : currentZoom > 1.2 ? freqThreshold20 : freqThreshold10;
    labelElements.style('display', function(d) { return d.frequency >= threshold ? 'block' : 'none'; });
    labelBgElements.style('display', function(d) { return d.frequency >= threshold ? 'block' : 'none'; });
}

function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.display = 'none';
    document.getElementById('graph-container').appendChild(tooltip);
}

function showTooltip(event, d) {
    const rect = document.getElementById('graph-container').getBoundingClientRect();
    const divCount = conceptDivergeCounts[d.id] || 0;
    const pat = getDominantPattern(d.id);
    let html = '<strong>' + EC.escapeHtml(d.label) + '</strong><br>' +
        d.frequency + ' Papers &middot; ' + (d.cluster || '');
    if (divCount > 0) {
        html += '<br><span style="color:#d4943a;">' + divCount + ' Divergenz' + (divCount > 1 ? 'en' : '') + '</span>';
        if (pat) html += ' &middot; ' + EC.escapeHtml(pat);
    }
    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
    tooltip.style.left = (event.clientX - rect.left + 12) + 'px';
    tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
}

function moveTooltip(event) {
    const rect = document.getElementById('graph-container').getBoundingClientRect();
    tooltip.style.left = (event.clientX - rect.left + 12) + 'px';
    tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
}

function hideTooltip() {
    if (tooltip) tooltip.style.display = 'none';
}

// Applies the visuals for the current divergenceMode without flipping the flag,
// so resetFocus can repaint the mode with a single call.
function applyDivergenceVisuals() {
    if (divergenceMode) {
        nodeElements.select('circle:first-child')
            .transition().duration(300)
            .attr('opacity', function(d) { return divergeConceptIds.has(d.id) ? 1 : 0.15; });

        nodeElements.selectAll('.diverge-ring')
            .transition().duration(300)
            .attr('opacity', 1)
            .attr('stroke-width', 2.5)
            .attr('stroke-dasharray', 'none');

        edgeElements.transition().duration(300)
            .attr('stroke-opacity', function(e) {
                return divergeConceptIds.has(endId(e.source)) && divergeConceptIds.has(endId(e.target)) ? 0.4 : 0.05;
            });

        labelElements.style('display', function(d) { return divergeConceptIds.has(d.id) ? 'block' : 'none'; });
        labelBgElements.style('display', function(d) { return divergeConceptIds.has(d.id) ? 'block' : 'none'; });
    } else {
        nodeElements.select('circle:first-child').transition().duration(300).attr('opacity', 1);

        nodeElements.selectAll('.diverge-ring')
            .transition().duration(300)
            .attr('opacity', 0.5)
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '3,2');

        edgeElements.transition().duration(300).attr('stroke-opacity', 0.4);
        updateLabelVisibility();
    }
}

function toggleDivergenceMode() {
    divergenceMode = !divergenceMode;
    const btn = document.getElementById('divergence-toggle');
    if (btn) btn.classList.toggle('active', divergenceMode);
    applyDivergenceVisuals();
}

function focusOnNode(d) {
    focusedNode = d;
    const neighbors = neighborMap[d.id] || new Set();

    nodeElements.select('circle:first-child')
        .attr('opacity', function(n) { return n.id === d.id || neighbors.has(n.id) ? 1 : 0.08; });

    edgeElements
        .attr('stroke-opacity', function(e) {
            return endId(e.source) === d.id || endId(e.target) === d.id ? 0.6 : 0.03;
        })
        .attr('stroke', function(e) {
            return endId(e.source) === d.id || endId(e.target) === d.id ? '#78716c' : '#d1d5db';
        });

    labelElements
        .style('display', function(n) { return n.id === d.id || neighbors.has(n.id) ? 'block' : 'none'; })
        .attr('font-weight', function(n) { return n.id === d.id ? 'bold' : 'normal'; });
    labelBgElements
        .style('display', function(n) { return n.id === d.id || neighbors.has(n.id) ? 'block' : 'none'; });
}

function resetFocus() {
    focusedNode = null;
    if (!nodeElements) return;

    if (divergenceMode) { applyDivergenceVisuals(); return; }

    nodeElements.select('circle:first-child').attr('opacity', 1);
    edgeElements.attr('stroke-opacity', 0.4).attr('stroke', '#d1d5db');
    updateLabelVisibility();
    labelElements.attr('font-weight', 'normal');
}

function showConceptDetail(d) {
    const panel = document.getElementById('graph-detail');
    const conceptPapers = [];
    if (papers) {
        papers.forEach(function(p) {
            if (p.concepts && p.concepts.indexOf(d.id) >= 0) conceptPapers.push(p);
        });
    }

    const neighborList = [];
    graph.edges.forEach(function(e) {
        const src = endId(e.source), tgt = endId(e.target);
        if (src === d.id) neighborList.push({ id: tgt, weight: e.weight });
        if (tgt === d.id) neighborList.push({ id: src, weight: e.weight });
    });
    neighborList.sort(function(a, b) { return b.weight - a.weight; });

    const divergeCount = conceptDivergeCounts[d.id] || 0;
    const dominantPattern = getDominantPattern(d.id);

    const neighborClusters = { technik: 0, sozial: 0, bridge: 0 };
    neighborList.forEach(function(n) {
        const node = nodeById[n.id];
        if (node && neighborClusters[node.cluster] !== undefined) neighborClusters[node.cluster]++;
    });
    const totalNeighbors = neighborList.length || 1;

    let html = '<div class="graph-detail-inner">';
    html += '<button class="graph-detail-close" id="graph-detail-close">&times;</button>';
    html += '<h3>' + EC.escapeHtml(d.label) + '</h3>';
    html += '<p class="detail-meta">' + d.frequency + ' Papers &middot; ' +
        '<span style="color:' + (CLUSTER_COLORS[d.cluster] || '#999') + ';font-weight:600;">' + (d.cluster || '') + '</span>';
    if (divergeCount > 0) {
        html += ' &middot; <span style="color:var(--danger);">' + divergeCount + ' Divergenz' + (divergeCount > 1 ? 'en' : '') + '</span>';
    }
    html += '</p>';

    if (neighborList.length > 0) {
        html += '<div style="display:flex;height:4px;border-radius:2px;overflow:hidden;margin:0.5rem 0;">';
        ['technik', 'sozial', 'bridge'].forEach(function(cl) {
            const pct = (neighborClusters[cl] / totalNeighbors * 100);
            if (pct > 0) html += '<div style="width:' + pct + '%;background:' + CLUSTER_COLORS[cl] + ';"></div>';
        });
        html += '</div>';
        html += '<p style="font-size:0.6rem;color:var(--gray-400);margin-bottom:0.5rem;">' +
            neighborClusters.technik + ' Technik, ' + neighborClusters.sozial + ' Sozial, ' + neighborClusters.bridge + ' Bruecke</p>';
    }

    if (d.definition) html += '<p class="detail-def">' + EC.escapeHtml(d.definition) + '</p>';

    if (divergeCount > 0) {
        html += '<div style="background:#fef3c7;border-radius:4px;padding:0.5rem 0.625rem;margin:0.75rem 0;font-size:0.75rem;">';
        html += '<strong style="color:#92400e;">' + divergeCount + ' Divergenzfall' + (divergeCount > 1 ? 'e' : '') + '</strong>';
        if (dominantPattern) html += ' &middot; <span style="color:#78716c;">' + EC.escapeHtml(dominantPattern) + '</span>';
        html += '<br><a href="#" class="detail-crossview-link" id="detail-to-vergleich" style="color:var(--info);font-size:0.7rem;">Im Bewertungsvergleich anzeigen &rarr;</a>';
        html += '</div>';
    }

    if (conceptPapers.length > 0) {
        html += '<h4>Papers (' + conceptPapers.length + ')</h4>';
        html += '<ul class="graph-papers-list">';
        const mainPapers = EC.getAllPapers();
        conceptPapers.slice(0, 30).forEach(function(p) {
            let statusClass = '', patBadge = '';
            if (p.stages && p.stages.assessment) {
                if (p.stages.assessment.agreement === 'disagree') {
                    statusClass = ' paper-diverge';
                    const mp = mainPapers ? mainPapers.find(function(m) { return m.id === p.id; }) : null;
                    if (mp && mp.divergence && mp.divergence.pattern) {
                        const pcol = mp.divergence.pattern === 'Semantische Expansion' ? 'pattern-badge-semantic'
                                 : mp.divergence.pattern === 'Keyword-Inklusion' ? 'pattern-badge-keyword'
                                 : 'pattern-badge-implicit';
                        patBadge = ' <span class="pattern-badge ' + pcol + '" style="font-size:0.55rem;">' +
                            EC.escapeHtml(mp.divergence.pattern) + '</span>';
                    }
                } else if (p.stages.assessment.agreement === 'agree') {
                    statusClass = ' paper-agree';
                }
            }
            html += '<li class="graph-paper-item' + statusClass + '" data-paper-id="' + EC.escapeHtml(p.id) + '">' +
                EC.escapeHtml((p.author_year || '') + ': ' + (p.title || '').substring(0, 55)) +
                (p.title && p.title.length > 55 ? '...' : '') + patBadge + '</li>';
        });
        if (conceptPapers.length > 30) {
            html += '<li class="graph-paper-more">... und ' + (conceptPapers.length - 30) + ' weitere</li>';
        }
        html += '</ul>';
    }

    if (neighborList.length > 0) {
        html += '<h4>Verbundene Konzepte</h4>';
        html += '<ul class="graph-neighbors-list">';
        neighborList.slice(0, 12).forEach(function(n) {
            const nNode = nodeById[n.id];
            const nColor = nNode ? (CLUSTER_COLORS[nNode.cluster] || '#999') : '#999';
            html += '<li class="graph-neighbor-item" data-concept="' + EC.escapeHtml(n.id) + '">' +
                '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + nColor + ';margin-right:4px;vertical-align:middle;"></span>' +
                EC.escapeHtml(n.id) + ' <span class="neighbor-weight">(' + n.weight + ')</span></li>';
        });
        html += '</ul>';
    }

    html += '</div>';
    panel.innerHTML = html;

    document.getElementById('graph-detail-close').addEventListener('click', function(e) {
        e.stopPropagation();
        hideDetail();
        resetFocus();
    });

    const cvLink = document.getElementById('detail-to-vergleich');
    if (cvLink) {
        cvLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.switchView) window.switchView('vergleich');
        });
    }

    panel.querySelectorAll('.graph-paper-item').forEach(function(li) {
        li.addEventListener('click', function(e) {
            e.stopPropagation();
            EC.navigateToPaper(li.dataset.paperId);
        });
    });

    panel.querySelectorAll('.graph-neighbor-item').forEach(function(li) {
        li.addEventListener('click', function(e) {
            e.stopPropagation();
            const node = nodeById[li.dataset.concept];
            if (node) {
                focusOnNode(node);
                showConceptDetail(node);
                zoomToNode(node);
            }
        });
    });
}

function hideDetail() {
    const panel = document.getElementById('graph-detail');
    if (!panel) return;
    const conceptCount = graph ? graph.nodes.length : '';
    const kdCount = (EC.getAllPapers() || []).filter(function(p) { return p.knowledge_doc; }).length;
    panel.innerHTML = '<div class="graph-detail-placeholder">' +
        '<p class="placeholder-icon"><i class="fas fa-project-diagram"></i></p>' +
        '<p class="placeholder-text">Konzept anklicken</p>' +
        '<p class="placeholder-hint">' + conceptCount + ' Konzepte aus ' + kdCount +
        ' Wissensdokumenten. Groesse = Haeufigkeit, Verbindung = gemeinsame Papers.</p>' +
        '</div>';
}

function zoomToNode(node) {
    if (!svg || !zoom) return;
    const container = document.getElementById('graph-container');
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 700;
    const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(2)
        .translate(-node.x, -node.y);
    svg.transition().duration(600).call(zoom.transform, transform);
}

function searchConcept(query) {
    if (!query || !nodeElements) { resetFocus(); return; }
    const q = query.toLowerCase();
    const matches = graph.nodes.filter(function(n) {
        return n.id.toLowerCase().indexOf(q) >= 0 || n.label.toLowerCase().indexOf(q) >= 0;
    });

    if (matches.length === 0) { resetFocus(); return; }

    if (matches.length === 1) {
        focusOnNode(matches[0]);
        showConceptDetail(matches[0]);
        zoomToNode(matches[0]);
        return;
    }

    const matchIds = new Set(matches.map(function(m) { return m.id; }));
    nodeElements.select('circle:first-child')
        .attr('opacity', function(n) { return matchIds.has(n.id) ? 1 : 0.08; });
    edgeElements.attr('stroke-opacity', 0.03);
    labelElements.style('display', function(n) { return matchIds.has(n.id) ? 'block' : 'none'; });
    labelBgElements.style('display', function(n) { return matchIds.has(n.id) ? 'block' : 'none'; });
}

function setupControls() {
    const searchInput = document.getElementById('graph-search');
    if (searchInput) {
        let debounce = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounce);
            debounce = setTimeout(function() { searchConcept(searchInput.value.trim()); }, 250);
        });
    }

    const slider = document.getElementById('freq-slider');
    const freqValue = document.getElementById('freq-value');
    if (slider) {
        // Coalesce slider drags to one repaint per frame; each repaint walks all
        // nodes, edges, and labels.
        let raf = null;
        slider.addEventListener('input', function() {
            if (freqValue) freqValue.textContent = slider.value;
            if (raf) return;
            raf = requestAnimationFrame(function() {
                raf = null;
                const minFreq = parseInt(slider.value, 10);
                nodeElements.style('display', function(d) { return d.frequency >= minFreq ? '' : 'none'; });
                edgeElements.style('display', function(e) {
                    const src = nodeById[endId(e.source)], tgt = nodeById[endId(e.target)];
                    return src && tgt && src.frequency >= minFreq && tgt.frequency >= minFreq ? '' : 'none';
                });
                labelElements.style('display', function(d) {
                    return d.frequency >= minFreq && d.frequency >= freqThreshold10 ? 'block' : 'none';
                });
                labelBgElements.style('display', function(d) {
                    return d.frequency >= minFreq && d.frequency >= freqThreshold10 ? 'block' : 'none';
                });
            });
        });
    }

    const resetBtn = document.getElementById('graph-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (divergenceMode) toggleDivergenceMode();
            resetFocus();
            hideDetail();
            if (searchInput) searchInput.value = '';
            nodeElements.style('display', '');
            edgeElements.style('display', '');
            svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
        });
    }

    const divToggle = document.getElementById('divergence-toggle');
    if (divToggle) divToggle.addEventListener('click', function() { toggleDivergenceMode(); });
}

})();
