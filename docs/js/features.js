// ========================================
// Additional Features for Research Vault
// Keyboard Shortcuts, CSV Export, Year Filter
// ========================================

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-box').focus();
        }

        // Escape: Close modal
        if (e.key === 'Escape') {
            closePaperModal();
        }

        // 1, 2, 3: Switch tabs
        if (e.key >= '1' && e.key <= '3' && !e.target.matches('input, select')) {
            const tabs = ['papers', 'dashboard', 'graph'];
            switchTab(tabs[parseInt(e.key) - 1]);
        }
    });

    console.log('✓ Keyboard shortcuts enabled: Ctrl+K (search), Esc (close), 1-3 (tabs)');
}

// CSV Export
function exportFilteredPapers() {
    const csvData = filteredPapers.map(p => ({
        Title: p.title,
        Author: p.author_year,
        Year: p.publication_year,
        Decision: p.decision,
        TotalRelevance: p.total_relevance,
        AILiteracy: p.rel_ai_komp,
        VulnerableGroups: p.rel_vulnerable,
        BiasAnalysis: p.rel_bias,
        PracticalImpl: p.rel_praxis,
        ProfessionalContext: p.rel_prof,
        HasSummary: p.has_summary ? 'Yes' : 'No',
        DOI: p.doi || '',
        URL: p.url || ''
    }));

    const headers = Object.keys(csvData[0]);
    const csvRows = [
        headers.join(','),
        ...csvData.map(row => headers.map(h => {
            const value = row[h] || '';
            const escaped = String(value).replace(/"/g, '""');
            return '"' + escaped + '"';
        }).join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = 'sozarb_papers_' + date + '.csv';
    link.click();
    URL.revokeObjectURL(url);

    console.log('✓ Exported ' + filteredPapers.length + ' papers to CSV');
}
