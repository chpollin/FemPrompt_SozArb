/**
 * FemPrompt Knowledge Graph Visualization
 * D3.js force-directed graph
 */

let simulation;
let svg;
let g;
let nodes = [];
let links = [];
let physicsEnabled = true;

// Initialize graph on page load
document.addEventListener('DOMContentLoaded', () => {
  loadGraphData();
});

async function loadGraphData() {
  try {
    const response = await fetch('data/search-index.json');
    const data = await response.json();

    buildGraphData(data);
    renderGraph();
  } catch (error) {
    console.error('Failed to load graph data:', error);
    document.getElementById('graph-container').innerHTML =
      '<p style="text-align: center; padding: 3rem; color: #666;">Failed to load graph data</p>';
  }
}

function buildGraphData(data) {
  const nodeMap = new Map();

  // Create paper nodes
  data.papers.forEach((paper, idx) => {
    const node = {
      id: `paper_${idx}`,
      label: paper.title,
      type: 'paper',
      data: paper,
      x: Math.random() * 800,
      y: Math.random() * 600
    };
    nodes.push(node);
    nodeMap.set(paper.filename, node);
  });

  // Create concept nodes
  data.concepts.forEach((concept, idx) => {
    const node = {
      id: `concept_${idx}`,
      label: concept.title,
      type: concept.category.includes('Bias') ? 'bias' : 'mitigation',
      data: concept,
      x: Math.random() * 800,
      y: Math.random() * 600
    };
    nodes.push(node);
    nodeMap.set(concept.filename, node);
  });

  // Create links based on concept-paper relationships
  // In real implementation, would parse paper summaries to find concept mentions
  // For now, create some representative links based on frequency
  data.concepts.forEach((concept, idx) => {
    const conceptNode = nodes.find(n => n.id === `concept_${idx}`);

    // Connect concept to papers (simplified - would need actual relationship data)
    const numConnections = Math.min(concept.papers, 5);
    for (let i = 0; i < numConnections; i++) {
      const paperIdx = Math.floor(Math.random() * data.papers.length);
      links.push({
        source: conceptNode.id,
        target: `paper_${paperIdx}`,
        value: 1
      });
    }
  });

  console.log(`Graph built: ${nodes.length} nodes, ${links.length} links`);
}

function renderGraph() {
  const container = document.getElementById('graph-container');
  const width = container.clientWidth || 1200;
  const height = 600;

  // Create SVG
  svg = d3.select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', '1px solid #e0e0e0')
    .style('border-radius', '4px');

  // Add zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Create container group
  g = svg.append('g');

  // Create force simulation
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(100))
    .force('charge', d3.forceManyBody()
      .strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30));

  // Create links
  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.3)
    .attr('stroke-width', 1);

  // Create nodes
  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => {
      if (d.type === 'paper') return 8;
      return 6 + Math.min(d.data.frequency || 0, 50) / 10;
    })
    .attr('fill', d => {
      if (d.type === 'paper') return '#0066cc';
      if (d.type === 'bias') return '#cc0000';
      return '#00aa00';
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded))
    .on('click', (event, d) => showNodeInfo(d))
    .on('mouseover', function(event, d) {
      d3.select(this)
        .attr('stroke', '#000')
        .attr('stroke-width', 3);

      // Show tooltip
      const tooltip = g.append('text')
        .attr('class', 'tooltip')
        .attr('x', d.x)
        .attr('y', d.y - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', '#1a1a1a')
        .attr('pointer-events', 'none')
        .text(d.label.length > 40 ? d.label.substring(0, 40) + '...' : d.label);

      // Background for tooltip
      const bbox = tooltip.node().getBBox();
      g.insert('rect', '.tooltip')
        .attr('class', 'tooltip-bg')
        .attr('x', bbox.x - 4)
        .attr('y', bbox.y - 2)
        .attr('width', bbox.width + 8)
        .attr('height', bbox.height + 4)
        .attr('fill', 'white')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr('rx', 4)
        .attr('pointer-events', 'none');
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      g.selectAll('.tooltip').remove();
      g.selectAll('.tooltip-bg').remove();
    });

  // Add labels for concepts (optional, can be toggled)
  const labels = g.append('g')
    .selectAll('text')
    .data(nodes.filter(d => d.type !== 'paper'))
    .join('text')
    .attr('font-size', '10px')
    .attr('fill', '#666')
    .attr('text-anchor', 'middle')
    .attr('dy', 25)
    .attr('pointer-events', 'none')
    .text(d => d.label.length > 15 ? d.label.substring(0, 15) + '...' : d.label);

  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
}

function dragStarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnded(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function showNodeInfo(node) {
  const infoBox = document.getElementById('node-info');
  const infoTitle = document.getElementById('info-title');
  const infoContent = document.getElementById('info-content');

  infoTitle.textContent = node.label;

  if (node.type === 'paper') {
    infoContent.innerHTML = `
      <p><strong>Type:</strong> Paper</p>
      <p><strong>Authors:</strong> ${node.data.authors || 'Unknown'}</p>
      <p><strong>Date:</strong> ${node.data.date || 'Unknown'}</p>
      <p><a href="papers/${node.data.filename}">View paper details →</a></p>
    `;
  } else {
    infoContent.innerHTML = `
      <p><strong>Type:</strong> ${node.type === 'bias' ? 'Bias Type' : 'Mitigation Strategy'}</p>
      <p><strong>Mentions:</strong> ${node.data.frequency || 0}</p>
      <p><strong>Papers:</strong> ${node.data.papers || 0}</p>
      <p><a href="concepts/${node.data.filename}">View concept details →</a></p>
    `;
  }

  infoBox.style.display = 'block';
}

function resetGraph() {
  // Reset zoom
  svg.transition()
    .duration(750)
    .call(d3.zoom().transform, d3.zoomIdentity);

  // Restart simulation
  simulation.alpha(1).restart();
}

function togglePhysics() {
  physicsEnabled = !physicsEnabled;

  if (physicsEnabled) {
    simulation.alpha(0.3).restart();
  } else {
    simulation.stop();
  }
}
