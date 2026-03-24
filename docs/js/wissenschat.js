// Wissens-Chat -- Gemini-powered Q&A over the research corpus
// Part of Evidence Companion (Pollin, Sackl-Sharif, Klinger & Steiner, 2026)

(function() {
'use strict';

var API_KEY_STORAGE = 'femPrompt_geminiApiKey';
var MODEL = 'gemini-3-flash-preview';
var API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
var MAX_CONTEXT_PAPERS = 30;
var MAX_HISTORY = 6; // last 3 exchanges

var messages = [];
var isStreaming = false;

// ============================================================
// Public init (called by research-app.js on first tab visit)
// ============================================================

window.initWissensChat = function() {
    var container = document.getElementById('chat-container');
    if (!container) return;

    var savedKey = localStorage.getItem(API_KEY_STORAGE) || window.GEMINI_API_KEY || '';
    container.innerHTML = buildChatUI(savedKey);
    bindChatEvents();
};

// ============================================================
// UI Building
// ============================================================

function buildChatUI(savedKey) {
    return '<form class="chat-setup" autocomplete="off" onsubmit="return false;">' +
        '<div class="chat-key-row">' +
            '<label for="gemini-key">Gemini API Key</label>' +
            '<input type="password" id="gemini-key" placeholder="AIza..." value="' + escapeAttr(savedKey) + '" autocomplete="off">' +
            '<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" class="chat-key-help">' +
                '<i class="fas fa-key"></i> Key erstellen' +
            '</a>' +
        '</div>' +
        '<p class="chat-key-note">' +
            '<i class="fas fa-lock"></i> Der Key bleibt lokal im Browser und wird direkt an die Google API gesendet.' +
        '</p>' +
    '</form>' +
    '<div class="chat-messages" id="chat-messages">' +
        '<div class="chat-welcome">' +
            '<p class="chat-welcome-title">Fragen Sie das Wissen</p>' +
            '<p>Ein LLM (Gemini 3 Flash) antwortet auf Basis von LLM-synthetisiertem Wissen aus 326 Papers. ' +
                'Die Antworten sind also zweifach LLM-vermittelt: einmal durch die Wissensextraktion, ' +
                'einmal durch die Antwortgenerierung. Inline-Zitationen verlinken direkt zum Korpus zur Verifikation.</p>' +
            '<div class="chat-suggestions">' +
                '<button class="chat-suggestion">Welche Papers behandeln AI Literacy in der Sozialen Arbeit?</button>' +
                '<button class="chat-suggestion">Was sind die Hauptunterschiede zwischen LLM- und Expert:innen-Bewertung?</button>' +
                '<button class="chat-suggestion">Welche feministischen Perspektiven auf KI-Bias gibt es im Korpus?</button>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="chat-input-row">' +
        '<textarea id="chat-input" placeholder="Frage zum Forschungskorpus stellen..." rows="1"></textarea>' +
        '<button id="chat-send" class="chat-send-btn" title="Senden (Enter)">' +
            '<i class="fas fa-paper-plane"></i>' +
        '</button>' +
    '</div>';
}

function escapeAttr(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// ============================================================
// Event Binding
// ============================================================

function bindChatEvents() {
    var input = document.getElementById('chat-input');
    var sendBtn = document.getElementById('chat-send');
    var keyInput = document.getElementById('gemini-key');

    sendBtn.addEventListener('click', function() { sendMessage(); });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    keyInput.addEventListener('change', function() {
        localStorage.setItem(API_KEY_STORAGE, this.value.trim());
    });

    document.querySelectorAll('.chat-suggestion').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.getElementById('chat-input').value = this.textContent;
            sendMessage();
        });
    });

    // Event delegation for citation links and reference items (survives re-renders)
    document.getElementById('chat-messages').addEventListener('click', function(e) {
        var link = e.target.closest('.cite-link, .chat-ref-item');
        if (link && link.dataset.paperId) {
            e.preventDefault();
            navigateToPaper(link.dataset.paperId);
        }
    });
}

// ============================================================
// Send Message
// ============================================================

function sendMessage() {
    if (isStreaming) return;

    var input = document.getElementById('chat-input');
    var question = input.value.trim();
    if (!question) return;

    var apiKey = document.getElementById('gemini-key').value.trim();
    if (!apiKey) {
        showError('Bitte geben Sie einen Gemini API Key ein.');
        return;
    }
    localStorage.setItem(API_KEY_STORAGE, apiKey);

    messages.push({ role: 'user', text: question });
    renderMessages();
    input.value = '';
    input.style.height = 'auto';

    var context = buildContext(question);
    callGemini(apiKey, question, context);
}

// ============================================================
// Context Building (local RAG-lite)
// ============================================================

function buildContext(question) {
    var papers = window.EC.getAllPapers();
    var meta = window.EC.getMeta();
    var kappas = window.EC.getKappas();
    var conceptData = window.EC.getConceptData();

    // Score papers by keyword overlap with question
    var queryWords = question.toLowerCase().split(/\s+/).filter(function(w) { return w.length > 2; });
    var scored = papers.map(function(p) {
        var haystack = (p.title + ' ' + (p.author_year || '') + ' ' + (p.abstract || '') +
            ' ' + (p.llm.reasoning || '') + ' ' + p.llm.categories.join(' ')).toLowerCase();
        var score = queryWords.reduce(function(s, w) {
            return s + (haystack.indexOf(w) >= 0 ? 1 : 0);
        }, 0);
        return { paper: p, score: score };
    });

    scored.sort(function(a, b) { return b.score - a.score; });
    var relevant = scored.slice(0, MAX_CONTEXT_PAPERS).filter(function(s) { return s.score > 0; });

    // Pad with divergent papers if too few matches
    if (relevant.length < 10) {
        var used = {};
        relevant.forEach(function(r) { used[r.paper.id] = true; });
        papers.filter(function(p) { return p.benchmark.agreement === false && !used[p.id]; })
            .slice(0, 15)
            .forEach(function(p) {
                if (relevant.length < MAX_CONTEXT_PAPERS) {
                    relevant.push({ paper: p, score: 0 });
                }
            });
    }

    // Build papers text
    var papersText = relevant.map(function(r) {
        var p = r.paper;
        var humanDec = p.human && p.human.decision ? p.human.decision : 'nicht bewertet';
        var status = p.benchmark.agreement === false ? 'DIVERGENZ' :
                     p.benchmark.agreement === true ? 'Konsens' : 'nur LLM';

        var lines = [
            '### ' + p.title,
            '- Autor: ' + (p.author_year || 'k.A.') + ' | Jahr: ' + (p.year || 'k.A.'),
            '- LLM: ' + p.llm.decision + ' | Expert:innen: ' + humanDec + ' | Status: ' + status,
            '- Kategorien (LLM): ' + p.llm.categories.join(', ')
        ];
        if (p.abstract) lines.push('- Abstract: ' + p.abstract.substring(0, 400));
        if (p.llm.reasoning) lines.push('- LLM-Begruendung: ' + p.llm.reasoning.substring(0, 250));
        if (p.benchmark.affected_categories && p.benchmark.affected_categories.length > 0) {
            lines.push('- Divergenz-Kategorien: ' + p.benchmark.affected_categories.join(', '));
        }
        return lines.join('\n');
    }).join('\n\n');

    // Build concepts text
    var conceptsText = '';
    if (conceptData && conceptData.nodes) {
        var conceptScored = conceptData.nodes.map(function(n) {
            var text = (n.label + ' ' + (n.definition || '')).toLowerCase();
            var score = queryWords.reduce(function(s, w) {
                return s + (text.indexOf(w) >= 0 ? 1 : 0);
            }, 0);
            return { node: n, score: score };
        });
        conceptScored.sort(function(a, b) { return b.score - a.score || b.node.frequency - a.node.frequency; });
        var topConcepts = conceptScored.slice(0, 20);

        conceptsText = topConcepts.map(function(c) {
            return '- **' + c.node.label + '** (Freq: ' + c.node.frequency +
                ', Cluster: ' + (c.node.cluster || 'k.A.') + '): ' +
                (c.node.definition || 'keine Definition');
        }).join('\n');
    }

    // Build meta text
    var metaText = 'Korpus-Statistik:\n' +
        '- Gesamt: ' + (meta.total_papers || 326) + ' Papers\n' +
        '- LLM bewertet: ' + (meta.total_papers || 326) + ', Expert:innen bewertet: ' + (meta.papers_with_human || 210) + '\n' +
        '- LLM Include-Rate: ' + (meta.llm_include_rate || 68) + '% (' + (meta.llm_include_count || 143) + ')\n' +
        '- Human Include-Rate: ' + (meta.human_include_rate || 42) + '% (' + (meta.human_include_count || 88) + ')\n' +
        '- Cohen\'s Kappa: ' + (meta.kappa_overall || 0.035) + ' (Prevalence-Bias-Artefakt)\n';

    if (kappas) {
        metaText += '\nKappa pro Kategorie:\n';
        Object.keys(kappas).forEach(function(cat) {
            var val = typeof kappas[cat] === 'number' ? kappas[cat].toFixed(3) : kappas[cat];
            metaText += '- ' + cat + ': ' + val + '\n';
        });
    }

    return {
        papers: papersText,
        meta: metaText,
        concepts: conceptsText,
        paperCount: relevant.length,
        paperObjects: relevant.map(function(r) { return r.paper; })
    };
}

// ============================================================
// Gemini API (Streaming)
// ============================================================

function callGemini(apiKey, question, context) {
    isStreaming = true;
    updateSendButton(true);

    // Placeholder for streaming response (with context papers for citation linking)
    messages.push({ role: 'model', text: '', sources: context.paperObjects, complete: false });
    renderMessages();

    var systemPrompt = buildSystemPrompt(context);

    // Build conversation history (last N messages)
    var contents = [];
    var historyStart = Math.max(0, messages.length - MAX_HISTORY - 1);
    for (var i = historyStart; i < messages.length - 1; i++) {
        contents.push({
            role: messages[i].role,
            parts: [{ text: messages[i].text }]
        });
    }
    contents.push({ role: 'user', parts: [{ text: question }] });

    var body = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: contents,
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096
        }
    };

    var url = API_BASE + '/models/' + MODEL + ':streamGenerateContent?alt=sse&key=' + apiKey;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(function(response) {
        if (!response.ok) {
            return response.json().then(function(err) {
                throw new Error(err.error ? err.error.message : 'API-Fehler: ' + response.status);
            });
        }
        return handleStream(response);
    }).catch(function(err) {
        // Remove empty model message on error
        if (messages.length > 0 && messages[messages.length - 1].role === 'model' &&
            messages[messages.length - 1].text === '') {
            messages.pop();
        }
        showError(err.message);
        isStreaming = false;
        updateSendButton(false);
    });
}

function buildSystemPrompt(context) {
    return 'Du bist ein Forschungsassistent fuer den systematischen Review ' +
        '"Feministische AI Literacies" (Pollin, Sackl-Sharif, Klinger & Steiner, 2026).\n\n' +
        'Dieser Review analysiert 326 wissenschaftliche Publikationen zu feministischen AI Literacies ' +
        'im Feld der Sozialen Arbeit. Die Publikationen wurden durch eine LLM-Pipeline verarbeitet ' +
        'und unabhaengig von Expert:innen (210 Papers) und einem LLM (Claude Haiku 4.5, 326 Papers) ' +
        'nach 10 identischen Kategorien bewertet.\n\n' +
        'Kernergebnis: Epistemische Asymmetrie -- LLM Include-Rate 68% vs. Human 42% ' +
        '(Benchmark-Basis: 210 Papers mit BEIDEN Bewertungen, NICHT der Gesamtkorpus von 326). ' +
        '78 Faelle LLM-Include/Human-Exclude vs. 23 umgekehrt. ' +
        "Cohen's Kappa 0.035 ist ein Prevalence-Bias-Artefakt (Byrt et al. 1993), " +
        'NICHT primaerer Indikator.\n\n' +
        'WICHTIG: Verwende immer die Benchmark-Zahlen (68%/42% aus 210 Papers), ' +
        'NICHT selbst berechnete Raten aus dem Gesamtkorpus.\n\n' +
        'Drei Divergenz-Muster:\n' +
        '1. Semantische Expansion (81%): LLM expandiert Begriffe ueber ihre Feldgrenzen hinaus\n' +
        '2. Keyword-Inklusion (11%): LLM vergibt Kategorien basierend auf Oberflaechenstruktur\n' +
        '3. Implizite Feldzugehoerigkeit (8%): Expert:innen erkennen implizite Relevanz, ' +
        'die der LLM nicht sieht\n\n' +
        '10 Bewertungskategorien:\n' +
        'Gegenstand: AI_Literacies, Generative_KI, Prompting, KI_Sonstige\n' +
        'Perspektive: Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness\n\n' +
        'Regeln:\n' +
        '- Antworte auf Deutsch\n' +
        '- ZITIERE IMMER im Format "Autor et al. (Jahr)" oder "Autor (Jahr)" wenn du dich auf Papers beziehst\n' +
        '- Nenne den vollen Titel beim ersten Erwaehnen eines Papers\n' +
        '- Unterscheide klar zwischen LLM-Bewertung und Expert:innen-Bewertung\n' +
        '- Wenn du etwas nicht aus dem Korpus beantworten kannst, sage das ehrlich\n' +
        '- Halte Antworten praezise und fokussiert\n\n' +
        context.meta + '\n\n' +
        'Relevante Papers (' + context.paperCount + ' von 326):\n\n' +
        context.papers +
        (context.concepts ? '\n\nKonzept-Definitionen:\n' + context.concepts : '');
}

function handleStream(response) {
    var reader = response.body.getReader();
    var decoder = new TextDecoder();
    var buffer = '';

    function read() {
        return reader.read().then(function(result) {
            if (result.done) {
                if (messages.length > 0) messages[messages.length - 1].complete = true;
                isStreaming = false;
                updateSendButton(false);
                finalizeLastMessage();
                return;
            }

            buffer += decoder.decode(result.value, { stream: true });
            var lines = buffer.split('\n');
            buffer = lines.pop(); // keep incomplete line in buffer

            lines.forEach(function(line) {
                if (line.startsWith('data: ')) {
                    var json = line.slice(6).trim();
                    if (json && json !== '[DONE]') {
                        try {
                            var data = JSON.parse(json);
                            if (data.candidates && data.candidates[0] &&
                                data.candidates[0].content && data.candidates[0].content.parts) {
                                var text = data.candidates[0].content.parts
                                    .map(function(p) { return p.text || ''; }).join('');
                                if (text && messages.length > 0) {
                                    messages[messages.length - 1].text += text;
                                    updateLastMessage();
                                }
                            }
                        } catch(e) {
                            // Skip malformed SSE chunks
                        }
                    }
                }
            });

            return read();
        });
    }

    return read();
}

// ============================================================
// Message Rendering
// ============================================================

function renderMessages() {
    var container = document.getElementById('chat-messages');
    if (!container || messages.length === 0) return;

    var html = messages.map(function(msg) {
        var cls = msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-model';
        var content;
        if (msg.role === 'model') {
            // Use finalized HTML (with citation links) if available
            content = (msg.complete && msg.finalHtml) ? msg.finalHtml : renderMarkdown(msg.text || '');
        } else {
            content = window.EC.escapeHtml(msg.text);
        }
        var msgHtml = '<div class="chat-msg ' + cls + '">' +
            '<div class="chat-msg-content">' + content + '</div>';

        // Include reference list for completed model messages
        if (msg.complete && msg.citedPapers && msg.citedPapers.length > 0) {
            msgHtml += buildReferenceListHtml(msg.citedPapers);
        }

        msgHtml += '</div>';
        return msgHtml;
    }).join('');

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

function updateLastMessage() {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    var msgEls = container.querySelectorAll('.chat-msg');
    if (msgEls.length === 0) return;
    var last = msgEls[msgEls.length - 1];
    var contentEl = last.querySelector('.chat-msg-content');
    if (contentEl && messages.length > 0) {
        contentEl.innerHTML = renderMarkdown(messages[messages.length - 1].text);
        container.scrollTop = container.scrollHeight;
    }
}

function renderMarkdown(text) {
    if (!text) return '<span class="chat-typing">...</span>';
    var html = window.EC.escapeHtml(text);

    // 1. Bold (must come first -- before italic and list processing)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 2. Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // 3. Headers (#### before ### before ##)
    html = html.replace(/^####\s+(.+)$/gm, '</p><h5>$1</h5><p>');
    html = html.replace(/^###\s+(.+)$/gm, '</p><h4>$1</h4><p>');
    html = html.replace(/^##\s+(.+)$/gm, '</p><h3>$1</h3><p>');

    // 4. List items: *, -, or numbered (MUST come before italic)
    html = html.replace(/^\* (.+)$/gm, '</p><li>$1</li><p>');
    html = html.replace(/^- (.+)$/gm, '</p><li>$1</li><p>');
    html = html.replace(/^\d+\.\s+(.+)$/gm, '</p><li>$1</li><p>');

    // 5. Italic: *text* where text doesn't start with space (avoids stray * bullets)
    html = html.replace(/\*([^\s*][^*]*?)\*/g, '<em>$1</em>');

    // 6. Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // 7. Clean up: merge list items into <ul>, remove empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<\/p>\s*<li>/g, '<li>');
    html = html.replace(/<\/li>\s*<p>/g, '</li>');
    html = html.replace(/((?:<li>[\s\S]*?<\/li>\s*)+)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    return html;
}

// ============================================================
// Citation Linking & Reference List
// ============================================================

function finalizeLastMessage() {
    var lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'model' || !lastMsg.text) return;

    var container = document.getElementById('chat-messages');
    if (!container) return;
    var msgEls = container.querySelectorAll('.chat-msg');
    if (msgEls.length === 0) return;
    var lastEl = msgEls[msgEls.length - 1];
    var contentEl = lastEl.querySelector('.chat-msg-content');

    // Render markdown, then link citations
    var rendered = renderMarkdown(lastMsg.text);
    var result = linkifyCitations(rendered, lastMsg.sources || []);

    // Store for re-rendering
    lastMsg.finalHtml = result.html;
    lastMsg.citedPapers = result.cited;
    contentEl.innerHTML = result.html;

    // Append reference list
    if (result.cited.length > 0) {
        lastEl.insertAdjacentHTML('beforeend', buildReferenceListHtml(result.cited));
    }

    container.scrollTop = container.scrollHeight;
}

function linkifyCitations(html, contextPapers) {
    var allPapers = window.EC.getAllPapers();
    var cited = [];

    // Match patterns: "Author (Year)", "Author et al. (Year)", "Author &amp; Author (Year)"
    var result = html.replace(/([\w\u00C0-\u024F][\w\u00C0-\u024F\u2019'-]+)(\s+et\s+al\.|\s+&amp;\s+[\w\u00C0-\u024F\u2019'-]+)?\s*\((\d{4})\)/g,
        function(match, surname, suffix, year) {
            var paper = findPaperByAuthorYear(surname, year, contextPapers, allPapers);
            if (paper) {
                if (!cited.some(function(c) { return c.id === paper.id; })) {
                    cited.push(paper);
                }
                return '<a class="cite-link" data-paper-id="' +
                    window.EC.escapeHtml(paper.id) + '" title="' +
                    window.EC.escapeHtml(paper.title) + '">' + match + '</a>';
            }
            return match;
        });

    return { html: result, cited: cited };
}

function findPaperByAuthorYear(surname, year, contextPapers, allPapers) {
    var sLower = surname.toLowerCase();
    // Search context papers first (more likely matches), then all papers
    var pools = [contextPapers || [], allPapers];
    for (var p = 0; p < pools.length; p++) {
        for (var i = 0; i < pools[p].length; i++) {
            var paper = pools[p][i];
            if (paper.year == year && paper.author_year &&
                paper.author_year.toLowerCase().indexOf(sLower) >= 0) {
                return paper;
            }
        }
    }
    return null;
}

function buildReferenceListHtml(citedPapers) {
    if (!citedPapers || citedPapers.length === 0) return '';

    var html = '<div class="chat-references">' +
        '<div class="chat-ref-label"><i class="fas fa-book-open"></i> Referenzen</div>';

    citedPapers.forEach(function(paper, i) {
        var shortTitle = paper.title.length > 70 ? paper.title.substring(0, 67) + '...' : paper.title;
        var authorShort = (paper.author_year || '').split('(')[0].trim();
        var statusClass = paper.benchmark.agreement === false ? 'ref-diverge' :
                          paper.benchmark.agreement === true ? 'ref-agree' : 'ref-llmonly';
        var statusLabel = paper.benchmark.agreement === false ? 'Divergenz' :
                          paper.benchmark.agreement === true ? 'Konsens' : 'nur LLM';

        html += '<a class="chat-ref-item ' + statusClass + '" data-paper-id="' +
            window.EC.escapeHtml(paper.id) + '" title="Im Korpus ansehen">' +
            '<span class="ref-num">' + (i + 1) + '</span>' +
            '<span class="ref-body">' +
                '<span class="ref-author">' + window.EC.escapeHtml(authorShort) + '</span> ' +
                '<span class="ref-title">' + window.EC.escapeHtml(shortTitle) + '</span>' +
            '</span>' +
            '<span class="ref-meta">' +
                '<span class="ref-decision">' + paper.llm.decision + '</span>' +
                '<span class="ref-status ref-status--' + statusClass + '">' + statusLabel + '</span>' +
            '</span>' +
            '<i class="fas fa-arrow-right ref-arrow"></i>' +
        '</a>';
    });

    html += '</div>';
    return html;
}

function navigateToPaper(paperId) {
    var papers = window.EC.getAllPapers();
    var paper = papers.find(function(p) { return p.id === paperId; });
    if (!paper) return;

    // Switch to Korpus view via global switchView
    if (window.switchView) window.switchView('korpus');

    // Open detail panel
    window.EC.showPaperDetail(paper, papers);

    // Scroll to top
    var korpus = document.getElementById('view-korpus');
    if (korpus) korpus.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// Helpers
// ============================================================

function showError(msg) {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML += '<div class="chat-error">' +
        '<i class="fas fa-exclamation-triangle"></i> ' +
        window.EC.escapeHtml(msg) +
    '</div>';
    container.scrollTop = container.scrollHeight;
}

function updateSendButton(streaming) {
    var btn = document.getElementById('chat-send');
    if (!btn) return;
    btn.disabled = streaming;
    btn.innerHTML = streaming
        ? '<i class="fas fa-circle-notch fa-spin"></i>'
        : '<i class="fas fa-paper-plane"></i>';
}

})();
