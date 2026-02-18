// advanced-features.js - Graph visualization for Research Vault v2.0
// Category co-occurrence network using vis-network

// The main initializeGraph() function is defined in research-app.js.
// This file provides graph-specific helpers if needed in future.

// Graph filter handler (called from index.html graph controls)
function updateGraph() {
    if (!network) return;

    const decisionFilter = document.getElementById('graph-filter-decision');
    const relFilter = document.getElementById('graph-filter-relevance');
    const decision = decisionFilter ? decisionFilter.value : 'all';

    // Filter category nodes based on LLM-include papers in each category
    let visibleNodes = [...graphData.nodes];
    let visibleEdges = [...graphData.edges];

    if (decision !== 'all') {
        // Recalculate node sizes based on filtered papers
        const filteredPapersForGraph = allPapers.filter(p => p.llm.decision === decision);
        visibleNodes = graphData.nodes.map(node => {
            const count = filteredPapersForGraph.filter(
                p => p.llm.all_categories[node.category] === 1
            ).length;
            return { ...node, value: Math.max(count, 1), label: `${node.label.split('\n')[0]}\n(${count})` };
        });
    }

    network.setData({ nodes: visibleNodes, edges: visibleEdges });
}

window.updateGraph = updateGraph;
