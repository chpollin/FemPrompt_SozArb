// Simple Vault Viewer
const GITHUB_RAW = 'https://raw.githubusercontent.com/chpollin/FemPrompt_SozArb/main/FemPrompt_Vault';

const app = {
    vault: { papers: [], concepts: [] },
    
    async init() {
        this.setupNav();
        await this.loadHome();
    },
    
    setupNav() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadPage(btn.dataset.page);
            });
        });
    },
    
    showLoading() {
        return `
            <div class="loading">
                <div class="spinner"></div>
                <span>Loading content...</span>
            </div>
        `;
    },

    showError(message) {
        return `
            <div class="error">
                <h3>⚠️ Error Loading Content</h3>
                <p>${message}</p>
                <p><small>Please check your internet connection or try again later.</small></p>
            </div>
        `;
    },

    async loadHome() {
        const content = document.getElementById('content');
        content.innerHTML = this.showLoading();

        const url = GITHUB_RAW + '/MASTER_MOC.md';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const markdown = await response.text();
            content.innerHTML = marked.parse(markdown);
        } catch (e) {
            content.innerHTML = this.showError(e.message || 'Failed to load MASTER_MOC.md');
        }
    },
    
    loadPage(page) {
        const content = document.getElementById('content');
        const graph = document.getElementById('graph');
        
        graph.style.display = 'none';
        content.style.display = 'block';
        
        if (page === 'home') this.loadHome();
        else if (page === 'graph') {
            content.style.display = 'none';
            graph.style.display = 'block';
            this.renderGraph();
        } else {
            content.innerHTML = '<h1>' + page + '</h1><p>Coming soon...</p>';
        }
    },
    
    renderGraph() {
        const nodes = [
            {id: 1, label: 'Intersectionality', value: 107, color: '#f28482'},
            {id: 2, label: 'Feminist AI', value: 21, color: '#84a59d'},
            {id: 3, label: 'Bias Mitigation', value: 19, color: '#84a59d'}
        ];
        const edges = [{from: 1, to: 2}, {from: 2, to: 3}];
        const data = {nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges)};
        new vis.Network(document.getElementById('graph'), data, {});
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
