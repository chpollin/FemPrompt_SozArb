/**
 * Research-Promptotyping-Interface
 * Main application logic: data loading, step navigation, all 5 workflow steps
 */

(function () {
    'use strict';

    // =============================
    // STATE
    // =============================
    let ptData = null;       // promptotyping_data.json
    let vaultData = null;    // research_vault_v2.json (for comparator)
    let activeStep = 1;
    let activeComparatorFilter = 'all';
    let activeCategoryFilters = new Set();
    let comparatorSearchQuery = '';
    let confidenceChart = null;

    // =============================
    // INIT
    // =============================
    document.addEventListener('DOMContentLoaded', async () => {
        setupStepNavigation();
        setupPromptToggles();
        setupExampleTabs();

        try {
            const [ptResp, vaultResp] = await Promise.all([
                fetch('data/promptotyping_data.json'),
                fetch('data/research_vault_v2.json')
            ]);
            ptData = await ptResp.json();
            vaultData = await vaultResp.json();

            renderAll();
        } catch (err) {
            console.error('Data loading failed:', err);
            document.getElementById('main-content').innerHTML =
                '<p style="color:red;padding:2rem;">Fehler beim Laden der Daten. Bitte sicherstellen, dass die JSON-Dateien unter docs/data/ vorhanden sind.</p>';
        }
    });

    // =============================
    // NAVIGATION
    // =============================
    function setupStepNavigation() {
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.dataset.step);
                if (step >= 1 && step <= 5) {
                    switchStep(step);
                }
            });
        });
    }

    function switchStep(step) {
        activeStep = step;
        document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.step-btn[data-step="${step}"]`).classList.add('active');
        document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
        document.getElementById(`step-${step}`).classList.add('active');
    }

    // =============================
    // PROMPT TOGGLES
    // =============================
    function setupPromptToggles() {
        document.querySelectorAll('.prompt-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const promptId = btn.dataset.prompt;
                const panel = document.getElementById(`prompt-${promptId}`);
                const isOpen = panel.classList.contains('open');
                panel.classList.toggle('open');
                btn.classList.toggle('open');
                const label = btn.textContent.includes('Schema') ? 'Schema' : 'Prompt';
                btn.innerHTML = isOpen
                    ? `${label} anzeigen <i class="fas fa-chevron-down"></i>`
                    : `${label} verbergen <i class="fas fa-chevron-up"></i>`;
            });
        });
    }

    // =============================
    // EXAMPLE TABS
    // =============================
    function setupExampleTabs() {
        document.querySelectorAll('.example-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.example-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderExampleContent(tab.dataset.example);
            });
        });
    }

    // =============================
    // RENDER ALL
    // =============================
    function renderAll() {
        renderProviderCards();
        renderStep1Limitations();
        renderPrompts();
        renderConfidenceHistogram();
        renderSKEMetrics();
        renderExampleContent('stage1');
        renderCategories();
        renderCategoryFilters();
        renderComparator();
        renderConfusionMatrix();
        renderStep4Limitations();
        renderLimitationsSection();
        renderVaultStats();
        setupComparatorFilter();
        setupComparatorSearch();
    }

    // =============================
    // STEP 1: PROVIDER CARDS
    // =============================
    function renderProviderCards() {
        const container = document.getElementById('provider-cards');
        const providers = ptData.deep_research_ris.providers;
        const icons = { 'Claude': 'fa-comment-dots', 'Gemini': 'fa-gem', 'OpenAI (ChatGPT)': 'fa-brain', 'Perplexity': 'fa-search' };

        container.innerHTML = providers.map(p => `
            <div class="provider-card">
                <h4><i class="fas ${icons[p.name] || 'fa-robot'}"></i> ${p.name}</h4>
                <div class="provider-count">${p.entries}</div>
                <div class="provider-label">RIS-Eintraege</div>
            </div>
        `).join('');

        const total = providers.reduce((sum, p) => sum + p.entries, 0);
        container.innerHTML += `
            <div class="provider-card" style="border-top: 3px solid var(--primary-light);">
                <h4><i class="fas fa-layer-group"></i> Gesamt</h4>
                <div class="provider-count">${total}</div>
                <div class="provider-label">+ manuelle Ergaenzung = 326</div>
            </div>
        `;
    }

    function renderStep1Limitations() {
        const container = document.getElementById('step1-limitations');
        const lims = ptData.limitations.filter(l => l.affected_step === 1);
        container.innerHTML = lims.map(l => `
            <div class="limitation-banner">
                <div class="limitation-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="limitation-text"><strong>${escapeHtml(l.title)}:</strong> ${escapeHtml(l.description)}</div>
            </div>
        `).join('');
    }

    // =============================
    // STEP 3: PROMPTS WITH HIGHLIGHTING
    // =============================
    function highlightPromptText(text) {
        // Escape HTML first
        let html = escapeHtml(text);

        // Headings: ## lines
        html = html.replace(/^(#{1,3}\s.+)$/gm, '<span class="hl-heading">$1</span>');

        // Important keywords
        html = html.replace(/\b(WICHTIG|KRITISCH|STRIKTE?)\b/g, '<span class="hl-important">$1</span>');

        // Negative constraints
        html = html.replace(/\b(NUR|NICHT|NEIN|KEINE?[RNM]?)\b/g, '<span class="hl-constraint">$1</span>');

        // JSON values
        html = html.replace(/(&quot;Ja&quot;|&quot;Nein&quot;|&quot;Include&quot;|&quot;Exclude&quot;)/g, '<span class="hl-value">$1</span>');

        return html;
    }

    function renderPrompts() {
        const panels = {
            'prompt-stage1': ptData.prompts.stage1_extract,
            'prompt-stage2': ptData.prompts.stage2_format + '\n\n--- HINWEIS ---\n' + ptData.prompts.stage2_note,
            'prompt-stage3': ptData.prompts.stage3_verify,
            'prompt-assessment': ptData.prompts.assessment_10k,
        };

        for (const [id, text] of Object.entries(panels)) {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = highlightPromptText(text);
            }
        }
    }

    // =============================
    // STEP 3: CONFIDENCE HISTOGRAM
    // =============================
    function renderConfidenceHistogram() {
        const scores = ptData.verification_scores.map(s => s.overall);
        const bins = [];
        const binLabels = [];
        for (let i = 50; i < 100; i += 5) {
            bins.push(0);
            binLabels.push(`${i}-${i + 5}`);
        }
        scores.forEach(s => {
            const idx = Math.min(Math.floor((s - 50) / 5), bins.length - 1);
            if (idx >= 0) bins[idx]++;
        });

        const ctx = document.getElementById('confidence-histogram');
        if (!ctx) return;

        // Destroy previous chart to prevent memory leak
        if (confidenceChart) {
            confidenceChart.destroy();
            confidenceChart = null;
        }

        const thresholdIndex = Math.floor((75 - 50) / 5);

        confidenceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: 'Anzahl Papers',
                    data: bins,
                    backgroundColor: bins.map((_, i) => i < thresholdIndex ? '#fca5a5' : '#86efac'),
                    borderColor: bins.map((_, i) => i < thresholdIndex ? '#ef4444' : '#10b981'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Verteilung der Verifikations-Scores (n=' + scores.length + ')',
                        font: { size: 14 }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Confidence Score' } },
                    y: { title: { display: true, text: 'Anzahl' }, beginAtZero: true }
                }
            }
        });
    }

    function renderSKEMetrics() {
        const stats = ptData.pipeline_stats;
        const scores = ptData.verification_scores;
        const passRate = scores.length > 0 ? ((stats.verification_pass / scores.length) * 100).toFixed(1) : 0;
        const avgScore = scores.length > 0 ? (scores.reduce((s, v) => s + v.overall, 0) / scores.length).toFixed(1) : 0;
        const needsCorrection = scores.filter(s => s.needs_correction).length;

        document.getElementById('ske-metrics').innerHTML = `
            <div class="pt-metric-tile">
                <div class="pt-metric-value">${scores.length}</div>
                <div class="pt-metric-label">Verifiziert</div>
            </div>
            <div class="pt-metric-tile">
                <div class="pt-metric-value success">${passRate}%</div>
                <div class="pt-metric-label">Pass-Rate (>= 75)</div>
            </div>
            <div class="pt-metric-tile">
                <div class="pt-metric-value">${avgScore}</div>
                <div class="pt-metric-label">Durchschnitt</div>
            </div>
            <div class="pt-metric-tile">
                <div class="pt-metric-value ${needsCorrection > 0 ? 'warning' : 'success'}">${needsCorrection}</div>
                <div class="pt-metric-label">Korrekturbedarf</div>
            </div>
        `;
    }

    // =============================
    // STEP 3: EXAMPLE WALKTHROUGH
    // =============================
    function renderExampleContent(stage) {
        const panel = document.getElementById('example-content');
        const example = ptData.example_paper;
        if (!example) {
            panel.textContent = 'Kein Beispiel-Paper verfuegbar.';
            return;
        }

        switch (stage) {
            case 'stage1':
                panel.textContent = JSON.stringify(example.stage1_json, null, 2);
                break;
            case 'stage2':
                panel.textContent = example.stage2_markdown || example.final_document || 'Nicht verfuegbar.';
                break;
            case 'verification':
                panel.textContent = JSON.stringify(example.verification, null, 2);
                break;
        }
    }

    // =============================
    // STEP 4: CATEGORIES
    // =============================
    function renderCategories() {
        const container = document.getElementById('category-grid');
        container.innerHTML = ptData.categories.map(cat => `
            <div class="category-card ${cat.group}">
                <div class="category-name">${escapeHtml(cat.name)}</div>
                <div class="category-def">${escapeHtml(cat.definition)}</div>
                <div class="category-examples">
                    ${cat.examples_positive.length > 0 ? '<strong>Ja:</strong> ' + escapeHtml(cat.examples_positive.slice(0, 2).join('; ')) : ''}
                    ${cat.examples_negative.length > 0 ? '<br><strong>Nein:</strong> ' + escapeHtml(cat.examples_negative.slice(0, 1).join('; ')) : ''}
                </div>
            </div>
        `).join('');
    }

    // =============================
    // STEP 4: CATEGORY FILTERS
    // =============================
    function renderCategoryFilters() {
        const container = document.getElementById('category-filters');
        const categories = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
            'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'];
        const technik = new Set(['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige']);

        // Count divergences per category
        const catCounts = {};
        if (vaultData && vaultData.papers) {
            const allCats = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
                'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'];
            vaultData.papers
                .filter(p => p.human && p.human.decision && (p.human.decision === 'Include' || p.human.decision === 'Exclude'))
                .forEach(p => {
                    const hCats = (p.human && p.human.all_categories) || {};
                    const lCats = (p.llm && p.llm.all_categories) || {};
                    allCats.forEach(cat => {
                        if ((hCats[cat] === 1) !== (lCats[cat] === 1)) {
                            catCounts[cat] = (catCounts[cat] || 0) + 1;
                        }
                    });
                });
        }

        // Keep label
        let html = '<span class="filter-toggles-label">Divergenz in mindestens einer Kategorie:</span>';

        html += categories.map(cat => `
            <button class="filter-toggle ${technik.has(cat) ? 'technik' : 'sozial'}" data-category="${cat}">
                ${cat.replace(/_/g, ' ')}
                <span class="filter-count">(${catCounts[cat] || 0})</span>
            </button>
        `).join('');

        // Clear button (hidden by default)
        html += '<button class="filter-clear-btn" id="filter-clear-btn" style="display:none;">Alle zuruecksetzen</button>';

        container.innerHTML = html;

        container.querySelectorAll('.filter-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category;
                if (activeCategoryFilters.has(cat)) {
                    activeCategoryFilters.delete(cat);
                    btn.classList.remove('active');
                } else {
                    activeCategoryFilters.add(cat);
                    btn.classList.add('active');
                }
                updateClearButton();
                renderComparator();
            });
        });

        document.getElementById('filter-clear-btn').addEventListener('click', () => {
            activeCategoryFilters.clear();
            container.querySelectorAll('.filter-toggle').forEach(b => b.classList.remove('active'));
            updateClearButton();
            renderComparator();
        });
    }

    function updateClearButton() {
        const btn = document.getElementById('filter-clear-btn');
        if (btn) {
            btn.style.display = activeCategoryFilters.size > 0 ? 'inline-flex' : 'none';
        }
    }

    // =============================
    // STEP 4: COMPARATOR
    // =============================
    function setupComparatorFilter() {
        document.getElementById('comparator-filter').addEventListener('change', (e) => {
            activeComparatorFilter = e.target.value;
            renderComparator();
        });
    }

    function setupComparatorSearch() {
        const searchBox = document.getElementById('comparator-search');
        if (!searchBox) return;
        let debounceTimer;
        searchBox.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                comparatorSearchQuery = e.target.value.toLowerCase().trim();
                renderComparator();
            }, 200);
        });
    }

    function getComparatorPapers() {
        if (!vaultData || !vaultData.papers) return [];

        const categories = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
            'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'];

        return vaultData.papers
            .filter(p => p.human && p.human.decision &&
                (p.human.decision === 'Include' || p.human.decision === 'Exclude'))
            .map(p => {
                const humanDecision = p.human.decision;
                const llmDecision = (p.llm && p.llm.decision) || 'N/A';
                const isAgreement = humanDecision === llmDecision;

                const humanCats = (p.human && p.human.all_categories) || {};
                const llmCats = (p.llm && p.llm.all_categories) || {};

                const divergentCategories = [];
                categories.forEach(cat => {
                    const hBool = humanCats[cat] === 1;
                    const lBool = llmCats[cat] === 1;
                    if (hBool !== lBool) {
                        divergentCategories.push(cat);
                    }
                });

                return {
                    ...p,
                    humanDecision,
                    llmDecision,
                    humanCats,
                    llmCats,
                    isAgreement,
                    divergentCategories,
                    authorYear: p.author_year || p.title || 'Unknown'
                };
            })
            .filter(p => {
                // Apply decision filter
                switch (activeComparatorFilter) {
                    case 'agreement': return p.isAgreement;
                    case 'divergence': return !p.isAgreement;
                    case 'llm-include-human-exclude': return p.llmDecision === 'Include' && p.humanDecision === 'Exclude';
                    case 'human-include-llm-exclude': return p.humanDecision === 'Include' && p.llmDecision === 'Exclude';
                    default: return true;
                }
            })
            .filter(p => {
                // Apply category filter
                if (activeCategoryFilters.size === 0) return true;
                return [...activeCategoryFilters].some(cat => p.divergentCategories.includes(cat));
            })
            .filter(p => {
                // Apply search filter
                if (!comparatorSearchQuery) return true;
                const searchTarget = (p.authorYear + ' ' + (p.title || '')).toLowerCase();
                return searchTarget.includes(comparatorSearchQuery);
            });
    }

    function renderComparator() {
        const papers = getComparatorPapers();
        const listEl = document.getElementById('comparator-list');
        const countEl = document.getElementById('comparator-count');

        countEl.textContent = `${papers.length} Papers`;

        if (papers.length === 0) {
            listEl.innerHTML = '<p class="placeholder-text">Keine Papers fuer diesen Filter.</p>';
            return;
        }

        listEl.innerHTML = papers.map((p, idx) => `
            <div class="comparator-item ${p.isAgreement ? 'agreement' : 'divergence'}"
                 data-index="${idx}" role="button" tabindex="0">
                <div class="comparator-item-title">${escapeHtml(truncateText(p.authorYear, 60))}</div>
                <div class="comparator-item-meta">
                    H: ${p.humanDecision} | L: ${p.llmDecision}
                    ${p.divergentCategories.length > 0 ? ' | ' + p.divergentCategories.length + ' Kat.-Diff.' : ''}
                </div>
            </div>
        `).join('');

        // Click + keyboard handlers
        listEl.querySelectorAll('.comparator-item').forEach(item => {
            const handler = () => {
                const idx = parseInt(item.dataset.index);
                listEl.querySelectorAll('.comparator-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                renderComparatorDetail(papers[idx]);
            };
            item.addEventListener('click', handler);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handler();
                }
            });
        });
    }

    function renderComparatorDetail(paper) {
        const container = document.getElementById('comparator-detail');
        const categories = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
            'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'];

        const catRows = categories.map(cat => {
            const hBool = paper.humanCats[cat] === 1;
            const lBool = paper.llmCats[cat] === 1;
            const isDivergent = hBool !== lBool;

            return `
                <div class="detail-category-row ${isDivergent ? 'divergent' : ''}">
                    <span>${cat.replace(/_/g, ' ')}</span>
                    <span>
                        <span class="${hBool ? 'cat-yes' : 'cat-no'}">${hBool ? 'Ja' : 'Nein'}</span>
                        /
                        <span class="${lBool ? 'cat-yes' : 'cat-no'}">${lBool ? 'Ja' : 'Nein'}</span>
                    </span>
                </div>
            `;
        }).join('');

        const llmConfidence = paper.llm && paper.llm.confidence;
        const llmReasoning = paper.llm && paper.llm.reasoning;
        const truncatedReasoning = llmReasoning ? truncateText(String(llmReasoning), 300) : '';

        container.innerHTML = `
            <div class="detail-title">${escapeHtml(paper.title || paper.authorYear)}</div>
            <div class="detail-meta">
                ${escapeHtml(paper.authorYear)} | ${paper.year || ''}
            </div>

            <div class="detail-comparison">
                <div class="detail-side human-side">
                    <h5><i class="fas fa-user-graduate"></i> Human</h5>
                    <div class="detail-decision ${paper.humanDecision.toLowerCase()}">${paper.humanDecision}</div>
                </div>
                <div class="detail-side llm-side">
                    <h5><i class="fas fa-microchip"></i> LLM</h5>
                    <div class="detail-decision ${(paper.llmDecision || '').toLowerCase()}">${paper.llmDecision}</div>
                    <div class="detail-meta">Confidence: ${llmConfidence != null ? (llmConfidence * 100).toFixed(0) + '%' : 'N/A'}</div>
                    ${truncatedReasoning ? '<div class="detail-meta">Reasoning: ' + escapeHtml(truncatedReasoning) + '</div>' : ''}
                </div>
            </div>

            <h5 style="margin-top:1rem;font-size:0.85rem;">Kategorien (Human / LLM)</h5>
            ${catRows}

            ${paper.divergentCategories.length > 0 ? `
                <div style="margin-top:0.75rem;font-size:0.8rem;color:var(--danger);">
                    <strong>${paper.divergentCategories.length} Kategorie-Divergenzen:</strong>
                    ${paper.divergentCategories.join(', ')}
                </div>
            ` : '<div style="margin-top:0.75rem;font-size:0.8rem;color:var(--success);">Alle Kategorien uebereinstimmend.</div>'}
        `;
    }

    // =============================
    // STEP 4: CONFUSION MATRIX
    // =============================
    function renderConfusionMatrix() {
        if (!vaultData || !vaultData.meta) return;

        const cm = vaultData.meta.confusion_matrix;
        if (!cm) return;

        // JSON keys: Human_LLM format
        const bothInclude = cm.Include_Include || 63;
        const humanOnlyInclude = cm.Include_Exclude || 19;
        const llmOnlyInclude = cm.Exclude_Include || 80;
        const bothExclude = cm.Exclude_Exclude || 37;
        const total = bothInclude + llmOnlyInclude + humanOnlyInclude + bothExclude;

        document.getElementById('confusion-matrix').innerHTML = `
            <table class="cm-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th colspan="2">Human Assessment</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Include</th>
                        <th>Exclude</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th rowspan="2" style="writing-mode:vertical-rl;">LLM</th>
                        <th>Include</th>
                        <td>
                            <span class="cm-cell agree">${bothInclude}</span>
                            <span class="cm-label">Beide: Include</span>
                        </td>
                        <td>
                            <span class="cm-cell disagree">${llmOnlyInclude}</span>
                            <span class="cm-label">LLM ueberschaetzt</span>
                        </td>
                    </tr>
                    <tr>
                        <th>Exclude</th>
                        <td>
                            <span class="cm-cell disagree">${humanOnlyInclude}</span>
                            <span class="cm-label">LLM unterschaetzt</span>
                        </td>
                        <td>
                            <span class="cm-cell agree">${bothExclude}</span>
                            <span class="cm-label">Beide: Exclude</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="detail-meta" style="margin-top:0.75rem;">
                n = ${total} Papers mit beiden Assessments |
                Uebereinstimmung: ${bothInclude + bothExclude} (${((bothInclude + bothExclude) / total * 100).toFixed(1)}%) |
                Divergenz: ${llmOnlyInclude + humanOnlyInclude} (${((llmOnlyInclude + humanOnlyInclude) / total * 100).toFixed(1)}%)
            </div>
        `;
    }

    function renderStep4Limitations() {
        const container = document.getElementById('step4-limitations');
        const lims = ptData.limitations.filter(l => l.affected_step === 4);
        container.innerHTML = lims.map(l => `
            <div class="limitation-banner">
                <div class="limitation-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="limitation-text"><strong>${escapeHtml(l.title)}:</strong> ${escapeHtml(l.description)}</div>
            </div>
        `).join('');
    }

    // =============================
    // STEP 5: VAULT STATS
    // =============================
    function renderVaultStats() {
        const container = document.getElementById('vault-stats');
        if (!container) return;

        const paperCount = vaultData && vaultData.papers ? vaultData.papers.length : 249;
        const withAssessment = vaultData && vaultData.papers
            ? vaultData.papers.filter(p => p.human && p.human.decision).length
            : 205;
        const agreementCount = vaultData && vaultData.papers
            ? vaultData.papers.filter(p => p.benchmark && p.benchmark.agreement).length
            : 0;

        container.innerHTML = `
            <div class="pt-metric-tile">
                <div class="pt-metric-value">${paperCount}</div>
                <div class="pt-metric-label">Papers im Vault</div>
            </div>
            <div class="pt-metric-tile">
                <div class="pt-metric-value">79</div>
                <div class="pt-metric-label">Concepts</div>
            </div>
            <div class="pt-metric-tile">
                <div class="pt-metric-value">${withAssessment}</div>
                <div class="pt-metric-label">Mit Assessment-Daten</div>
            </div>
            <div class="pt-metric-tile">
                <div class="pt-metric-value success">${agreementCount}</div>
                <div class="pt-metric-label">Agreement (H+L)</div>
            </div>
        `;
    }

    // =============================
    // BOTTOM LIMITATIONS SECTION
    // =============================
    function renderLimitationsSection() {
        const container = document.getElementById('limitations-grid');
        const stepNames = { 1: 'Identifikation', 2: 'Konversion', 3: 'Wissensextraktion', 4: 'Assessment', 5: 'Synthese', 'all': 'Alle Schritte' };

        container.innerHTML = ptData.limitations.map(l => `
            <div class="limitation-card">
                <div class="limitation-card-title">${escapeHtml(l.title)}</div>
                <div class="limitation-card-text">${escapeHtml(l.description)}</div>
                <div class="limitation-card-step">Betrifft: Schritt ${l.affected_step} (${stepNames[l.affected_step] || l.affected_step})</div>
            </div>
        `).join('');
    }

    // =============================
    // HELPERS
    // =============================
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncateText(text, maxLen) {
        if (!text || text.length <= maxLen) return text;
        // Cut at last space before maxLen
        const truncated = text.substring(0, maxLen);
        const lastSpace = truncated.lastIndexOf(' ');
        return (lastSpace > maxLen * 0.5 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }

})();
