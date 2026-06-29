// Wissens-Chat -- Gemini-powered Q&A over the research corpus.
// Answers are doubly LLM-mediated (extraction, then generation); inline
// citations link back to the corpus for verification.

(function() {
'use strict';

const EC = window.EC;
const API_KEY_STORAGE = 'femPrompt_geminiApiKey';
const MODEL = 'gemini-3-flash-preview';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MAX_CONTEXT_PAPERS = 30;
const MAX_HISTORY = 6; // last 3 exchanges
const STREAM_TIMEOUT_MS = 60000;

let messages = [];
let isStreaming = false;
let currentController = null; // AbortController for the in-flight request
let streamTimeout = null;
let renderRaf = null; // coalesces per-chunk markdown re-renders to one per frame

window.initWissensChat = function() {
    const container = document.getElementById('chat-container');
    if (!container) return;

    const savedKey = localStorage.getItem(API_KEY_STORAGE) || window.GEMINI_API_KEY || '';
    container.innerHTML = buildChatUI(savedKey);
    bindChatEvents();
};

function buildChatUI(savedKey) {
    const total = EC.getMeta().total_papers || '';
    return '<form class="chat-setup" autocomplete="off" onsubmit="return false;">' +
        '<div class="chat-key-row">' +
            '<label for="gemini-key">Gemini API Key</label>' +
            '<input type="password" id="gemini-key" placeholder="AIza..." value="' + EC.escapeHtml(savedKey) + '" autocomplete="off">' +
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
            '<p class="chat-welcome-title">Recherche im Forschungskorpus</p>' +
            '<p>Ein LLM (Gemini 3 Flash) antwortet auf Basis von LLM-synthetisiertem Wissen aus ' + total + ' Papers. ' +
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

function bindChatEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const keyInput = document.getElementById('gemini-key');

    sendBtn.addEventListener('click', function() {
        if (isStreaming) stopStreaming(); else sendMessage();
    });

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

    // Delegated so citation links and reference items survive re-renders.
    document.getElementById('chat-messages').addEventListener('click', function(e) {
        const link = e.target.closest('.cite-link, .chat-ref-item');
        if (link && link.dataset.paperId) {
            e.preventDefault();
            EC.navigateToPaper(link.dataset.paperId);
        }
    });
}

function sendMessage() {
    if (isStreaming) return;

    const input = document.getElementById('chat-input');
    const question = input.value.trim();
    if (!question) return;

    const apiKey = document.getElementById('gemini-key').value.trim();
    if (!apiKey) {
        showError('Bitte geben Sie einen Gemini API Key ein.');
        return;
    }
    localStorage.setItem(API_KEY_STORAGE, apiKey);

    messages.push({ role: 'user', text: question });
    renderMessages();
    input.value = '';
    input.style.height = 'auto';

    callGemini(apiKey, question, buildContext(question));
}

// Benchmark marginals recomputed from the confusion matrix, the single source of
// truth, so the prompt never carries a hand-maintained rate that drifts.
function benchmarkStats() {
    const meta = EC.getMeta();
    const cm = meta.confusion_matrix || {};
    const ii = cm.Include_Include || 0, ie = cm.Include_Exclude || 0,
          ei = cm.Exclude_Include || 0, ee = cm.Exclude_Exclude || 0;
    const n = ii + ie + ei + ee;
    return {
        total: meta.total_papers,
        humanN: meta.papers_with_human,
        benchN: n,
        llmRate: n ? (((ii + ei) / n) * 100).toFixed(1) : null,
        humanRate: n ? Math.round(((ii + ie) / n) * 100) : null,
        llmOverHuman: ei,
        humanOverLlm: ie,
        kappa: meta.kappa_overall
    };
}

// Divergence patterns as integer percentages of all classified divergences.
function patternPct() {
    const dp = EC.getDivergencePatterns();
    const pd = dp && dp.pattern_distribution;
    if (!pd) return null;
    const total = Object.keys(pd).reduce(function(s, k) { return s + pd[k]; }, 0) || 1;
    return {
        sem: Math.round((pd['Semantische Expansion'] || 0) / total * 100),
        imp: Math.round((pd['Implizite Feldzugehoerigkeit'] || 0) / total * 100),
        key: Math.round((pd['Keyword-Inklusion'] || 0) / total * 100)
    };
}

function buildContext(question) {
    const papers = EC.getAllPapers();
    const kappas = EC.getKappas();
    const conceptData = EC.getConceptData();

    const queryWords = question.toLowerCase().split(/\s+/).filter(function(w) { return w.length > 2; });
    const scored = papers.map(function(p) {
        const haystack = (p.title + ' ' + (p.author_year || '') + ' ' + (p.abstract || '') +
            ' ' + (p.llm.reasoning || '') + ' ' + p.llm.categories.join(' ')).toLowerCase();
        const score = queryWords.reduce(function(s, w) { return s + (haystack.indexOf(w) >= 0 ? 1 : 0); }, 0);
        return { paper: p, score: score };
    });

    scored.sort(function(a, b) { return b.score - a.score; });
    const relevant = scored.slice(0, MAX_CONTEXT_PAPERS).filter(function(s) { return s.score > 0; });

    // Pad with divergent papers when keyword matches are sparse.
    if (relevant.length < 10) {
        const used = {};
        relevant.forEach(function(r) { used[r.paper.id] = true; });
        papers.filter(function(p) { return p.benchmark.agreement === false && !used[p.id]; })
            .slice(0, 15)
            .forEach(function(p) {
                if (relevant.length < MAX_CONTEXT_PAPERS) relevant.push({ paper: p, score: 0 });
            });
    }

    const papersText = relevant.map(function(r) {
        const p = r.paper;
        const humanDec = p.human && p.human.decision ? p.human.decision : 'nicht bewertet';
        const status = EC.paperStatus(p).label;

        const lines = [
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

    let conceptsText = '';
    if (conceptData && conceptData.nodes) {
        const conceptScored = conceptData.nodes.map(function(n) {
            const text = (n.label + ' ' + (n.definition || '')).toLowerCase();
            const score = queryWords.reduce(function(s, w) { return s + (text.indexOf(w) >= 0 ? 1 : 0); }, 0);
            return { node: n, score: score };
        });
        conceptScored.sort(function(a, b) { return b.score - a.score || b.node.frequency - a.node.frequency; });
        conceptsText = conceptScored.slice(0, 20).map(function(c) {
            return '- **' + c.node.label + '** (Freq: ' + c.node.frequency +
                ', Cluster: ' + (c.node.cluster || 'k.A.') + '): ' +
                (c.node.definition || 'keine Definition');
        }).join('\n');
    }

    const s = benchmarkStats();
    let metaText = 'Korpus-Statistik:\n';
    if (s.total) metaText += '- Gesamt: ' + s.total + ' Papers\n';
    if (s.humanN) metaText += '- Expert:innen bewertet: ' + s.humanN + '\n';
    if (s.llmRate != null) metaText += '- LLM Include-Rate (Benchmark): ' + s.llmRate + '%\n';
    if (s.humanRate != null) metaText += '- Human Include-Rate (Benchmark): ' + s.humanRate + '%\n';
    if (s.kappa != null) metaText += "- Cohen's Kappa: " + s.kappa + ' (Uebereinstimmung nahe Zufallsniveau; PABAK hebt das nicht auf, Kappa je Kategorie aussagekraeftiger)\n';

    if (kappas) {
        metaText += '\nKappa pro Kategorie:\n';
        Object.keys(kappas).forEach(function(cat) {
            const k = kappas[cat];
            const val = (k && typeof k.kappa === 'number') ? k.kappa.toFixed(3)
                : (typeof k === 'number' ? k.toFixed(3) : k);
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

function callGemini(apiKey, question, context) {
    isStreaming = true;
    updateSendButton(true);

    messages.push({ role: 'model', text: '', sources: context.paperObjects, complete: false });
    renderMessages();

    const systemPrompt = buildSystemPrompt(context);

    const contents = [];
    const historyStart = Math.max(0, messages.length - MAX_HISTORY - 1);
    for (let i = historyStart; i < messages.length - 1; i++) {
        contents.push({ role: messages[i].role, parts: [{ text: messages[i].text }] });
    }
    contents.push({ role: 'user', parts: [{ text: question }] });

    const body = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: contents,
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
    };

    const url = API_BASE + '/models/' + MODEL + ':streamGenerateContent?alt=sse&key=' + apiKey;

    currentController = new AbortController();
    streamTimeout = setTimeout(function() {
        if (currentController) currentController.abort();
    }, STREAM_TIMEOUT_MS);

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: currentController.signal
    }).then(function(response) {
        if (!response.ok) {
            return response.json().then(function(err) {
                throw new Error(err.error ? err.error.message : 'API-Fehler: ' + response.status);
            });
        }
        return handleStream(response);
    }).catch(function(err) {
        endStream();
        const lastIsEmptyModel = messages.length > 0 &&
            messages[messages.length - 1].role === 'model' && messages[messages.length - 1].text === '';
        if (err && err.name === 'AbortError') {
            // User stop or timeout: keep whatever streamed, drop an empty bubble.
            // Mark complete so a later full re-render keeps the linkified HTML and
            // reference list instead of falling back to raw markdown.
            if (lastIsEmptyModel) { messages.pop(); renderMessages(); }
            else { messages[messages.length - 1].complete = true; finalizeLastMessage(); }
            return;
        }
        // Re-render first to drop the empty model bubble, then append the error
        // banner so renderMessages does not wipe it (it rebuilds from messages only).
        if (lastIsEmptyModel) messages.pop();
        renderMessages();
        showError(err.message);
    });
}

function buildSystemPrompt(context) {
    const s = benchmarkStats();
    const pat = patternPct();
    const patLine = pat
        ? '1. Semantische Expansion (' + pat.sem + '%): LLM expandiert Begriffe ueber ihre Feldgrenzen hinaus\n' +
          '2. Implizite Feldzugehoerigkeit (' + pat.imp + '%): LLM ordnet Papers einem Feld zu, das implizit mitschwingt\n' +
          '3. Keyword-Inklusion (' + pat.key + '%): LLM vergibt Kategorien basierend auf Oberflaechenstruktur\n\n'
        : '1. Semantische Expansion\n2. Implizite Feldzugehoerigkeit\n3. Keyword-Inklusion\n\n';

    return 'Du bist ein Forschungsassistent fuer den systematischen Review ' +
        '"Feministische AI Literacies" (Pollin, Sackl-Sharif, Klinger & Steiner, 2026).\n\n' +
        'Dieser Review analysiert ' + s.total + ' wissenschaftliche Publikationen zu feministischen AI Literacies ' +
        'im Feld der Sozialen Arbeit. Die Publikationen wurden durch einen fuenfstufigen Workflow verarbeitet ' +
        'und unabhaengig von Expert:innen (' + s.humanN + ' Papers) und einem LLM (Claude Haiku 4.5, ' + s.total + ' Papers) ' +
        'nach 10 identischen Kategorien bewertet.\n\n' +
        'Motivierende Illustration (kein eigenstaendiger Befund): Auf der Schnittmenge beidseitig bewerteter Papers (' + s.benchN + ' Papers mit BEIDEN Bewertungen, NICHT der Gesamtkorpus von ' + s.total + ') liegt die LLM Include-Rate bei ' + s.llmRate + '% gegenueber ' + s.humanRate + '% bei den Expert:innen. ' +
        s.llmOverHuman + ' Faelle LLM-Include/Human-Exclude vs. ' + s.humanOverLlm + ' umgekehrt. ' +
        "Cohen's Kappa " + s.kappa + ' bedeutet Uebereinstimmung nahe dem Zufallsniveau; eine Prevalenz-Korrektur (PABAK) hebt das nicht auf. Aussagekraeftig sind die Konfusionsmatrix und die Kappa-Werte je Kategorie, nicht das einzelne Gesamt-Kappa.\n\n' +
        'WICHTIG: Verwende immer die Benchmark-Zahlen aus ' + s.benchN + ' Papers, ' +
        'NICHT selbst berechnete Raten aus dem Gesamtkorpus.\n\n' +
        'Drei Divergenz-Muster:\n' + patLine +
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
        'Relevante Papers (' + context.paperCount + ' von ' + s.total + '):\n\n' +
        context.papers +
        (context.concepts ? '\n\nKonzept-Definitionen:\n' + context.concepts : '');
}

function handleStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    function read() {
        return reader.read().then(function(result) {
            if (result.done) {
                if (messages.length > 0) messages[messages.length - 1].complete = true;
                endStream();
                finalizeLastMessage();
                return;
            }

            buffer += decoder.decode(result.value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep the incomplete trailing line

            lines.forEach(function(line) {
                if (!line.startsWith('data: ')) return;
                const json = line.slice(6).trim();
                if (!json || json === '[DONE]') return;
                try {
                    const data = JSON.parse(json);
                    const parts = data.candidates && data.candidates[0] &&
                        data.candidates[0].content && data.candidates[0].content.parts;
                    if (parts) {
                        const text = parts.map(function(p) { return p.text || ''; }).join('');
                        if (text && messages.length > 0) {
                            messages[messages.length - 1].text += text;
                            updateLastMessage();
                        }
                    }
                } catch (e) {
                    // Skip malformed SSE chunks.
                }
            });

            return read();
        });
    }

    return read();
}

// Clears the in-flight request state; safe to call more than once.
function endStream() {
    isStreaming = false;
    if (streamTimeout) { clearTimeout(streamTimeout); streamTimeout = null; }
    currentController = null;
    if (renderRaf) { cancelAnimationFrame(renderRaf); renderRaf = null; }
    updateSendButton(false);
}

function stopStreaming() {
    if (currentController) currentController.abort();
}

function renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container || messages.length === 0) return;

    const html = messages.map(function(msg) {
        const cls = msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-model';
        let content;
        if (msg.role === 'model') {
            content = (msg.complete && msg.finalHtml) ? msg.finalHtml : renderMarkdown(msg.text || '');
        } else {
            content = EC.escapeHtml(msg.text);
        }
        let msgHtml = '<div class="chat-msg ' + cls + '">' +
            '<div class="chat-msg-content">' + content + '</div>';
        if (msg.complete && msg.citedPapers && msg.citedPapers.length > 0) {
            msgHtml += buildReferenceListHtml(msg.citedPapers);
        }
        msgHtml += '</div>';
        return msgHtml;
    }).join('');

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

// Re-rendering the whole growing markdown on every SSE chunk is quadratic, so
// coalesce updates to one render per animation frame.
function updateLastMessage() {
    if (renderRaf) return;
    renderRaf = requestAnimationFrame(function() {
        renderRaf = null;
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const msgEls = container.querySelectorAll('.chat-msg');
        if (msgEls.length === 0 || messages.length === 0) return;
        const contentEl = msgEls[msgEls.length - 1].querySelector('.chat-msg-content');
        if (contentEl) {
            contentEl.innerHTML = renderMarkdown(messages[messages.length - 1].text);
            container.scrollTop = container.scrollHeight;
        }
    });
}

// Minimal, deliberately small markdown. Text is escaped first, so the only HTML
// emitted here is the tags this function introduces; this is the trust boundary.
function renderMarkdown(text) {
    if (!text) return '<span class="chat-typing">...</span>';
    let html = EC.escapeHtml(text);

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    html = html.replace(/^####\s+(.+)$/gm, '</p><h5>$1</h5><p>');
    html = html.replace(/^###\s+(.+)$/gm, '</p><h4>$1</h4><p>');
    html = html.replace(/^##\s+(.+)$/gm, '</p><h3>$1</h3><p>');

    // List items must run before the italic rule so a leading "* " is not eaten.
    html = html.replace(/^\* (.+)$/gm, '</p><li>$1</li><p>');
    html = html.replace(/^- (.+)$/gm, '</p><li>$1</li><p>');
    html = html.replace(/^\d+\.\s+(.+)$/gm, '</p><li>$1</li><p>');

    html = html.replace(/\*([^\s*][^*]*?)\*/g, '<em>$1</em>');

    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<\/p>\s*<li>/g, '<li>');
    html = html.replace(/<\/li>\s*<p>/g, '</li>');
    html = html.replace(/((?:<li>[\s\S]*?<\/li>\s*)+)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    return html;
}

function finalizeLastMessage() {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'model' || !lastMsg.text) return;

    const container = document.getElementById('chat-messages');
    if (!container) return;
    const msgEls = container.querySelectorAll('.chat-msg');
    if (msgEls.length === 0) return;
    const lastEl = msgEls[msgEls.length - 1];
    const contentEl = lastEl.querySelector('.chat-msg-content');

    const rendered = renderMarkdown(lastMsg.text);
    const result = linkifyCitations(rendered, lastMsg.sources || []);

    lastMsg.finalHtml = result.html;
    lastMsg.citedPapers = result.cited;
    contentEl.innerHTML = result.html;

    if (result.cited.length > 0) {
        lastEl.insertAdjacentHTML('beforeend', buildReferenceListHtml(result.cited));
    }

    container.scrollTop = container.scrollHeight;
}

function linkifyCitations(html, contextPapers) {
    const allPapers = EC.getAllPapers();
    const cited = [];

    const result = html.replace(/([\wÀ-ɏ][\wÀ-ɏ’'-]+)(\s+et\s+al\.|\s+&amp;\s+[\wÀ-ɏ’'-]+)?\s*\((\d{4})\)/g,
        function(match, surname, suffix, year) {
            const paper = findPaperByAuthorYear(surname, year, contextPapers, allPapers);
            if (paper) {
                if (!cited.some(function(c) { return c.id === paper.id; })) cited.push(paper);
                return '<a class="cite-link" data-paper-id="' +
                    EC.escapeHtml(paper.id) + '" title="' +
                    EC.escapeHtml(paper.title) + '">' + match + '</a>';
            }
            return match;
        });

    return { html: result, cited: cited };
}

function findPaperByAuthorYear(surname, year, contextPapers, allPapers) {
    const sLower = surname.toLowerCase();
    const pools = [contextPapers || [], allPapers];
    for (let p = 0; p < pools.length; p++) {
        for (let i = 0; i < pools[p].length; i++) {
            const paper = pools[p][i];
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

    let html = '<div class="chat-references">' +
        '<div class="chat-ref-label"><i class="fas fa-book-open"></i> Referenzen</div>';

    citedPapers.forEach(function(paper, i) {
        const shortTitle = paper.title.length > 70 ? paper.title.substring(0, 67) + '...' : paper.title;
        const authorShort = (paper.author_year || '').split('(')[0].trim();
        const st = EC.paperStatus(paper);
        const statusClass = 'ref-' + st.cls;

        html += '<a class="chat-ref-item ' + statusClass + '" data-paper-id="' +
            EC.escapeHtml(paper.id) + '" title="Im Korpus ansehen">' +
            '<span class="ref-num">' + (i + 1) + '</span>' +
            '<span class="ref-body">' +
                '<span class="ref-author">' + EC.escapeHtml(authorShort) + '</span> ' +
                '<span class="ref-title">' + EC.escapeHtml(shortTitle) + '</span>' +
            '</span>' +
            '<span class="ref-meta">' +
                '<span class="ref-decision">' + paper.llm.decision + '</span>' +
                '<span class="ref-status ref-status--' + statusClass + '">' + st.label + '</span>' +
            '</span>' +
            '<i class="fas fa-arrow-right ref-arrow"></i>' +
        '</a>';
    });

    html += '</div>';
    return html;
}

function showError(msg) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', '<div class="chat-error">' +
        '<i class="fas fa-exclamation-triangle"></i> ' + EC.escapeHtml(msg) + '</div>');
    container.scrollTop = container.scrollHeight;
}

function updateSendButton(streaming) {
    const btn = document.getElementById('chat-send');
    if (!btn) return;
    btn.title = streaming ? 'Abbrechen' : 'Senden (Enter)';
    btn.innerHTML = streaming
        ? '<i class="fas fa-stop"></i>'
        : '<i class="fas fa-paper-plane"></i>';
}

})();
