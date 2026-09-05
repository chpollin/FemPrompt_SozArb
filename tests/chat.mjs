// Exercise the real chat IIFE through the DOM. No live Gemini requests or keys.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const script = readFileSync(fileURLToPath(new URL('../docs/js/wissenschat.js', import.meta.url)), 'utf8');
const sourceId = 'E-0123456789abcdef';
const review = { agent_id: 'fixture-agent', model: 'fixture-model', reviewed_at: '2026-09-05T10:00:00Z' };
const source = {
  id: sourceId, statement_ref: '20_distillates/publications/literacy#^s1',
  record_id: 'LITERACY', work_id: 'work:test', version_id: 'version:test', version_type: 'preprint',
  title: 'AI Literacy in Social Work', author_year: 'Author (2026)', year: '2026',
  statement: 'The authors propose integrating AI literacy into existing competencies.',
  quote: 'AI literacy can be integrated in existing competencies.', locator: 'conclusion',
  source_url: 'https://example.org/paper/v1', status: 'ai-agent-reviewed', review,
};
function index(assertions = [{
  id: 'A-0123456789abcdef', assertion_ref: '30_assertions/literacy', title: 'AI Literacy',
  statement: 'The authors propose integrating AI literacy into existing core competencies.',
  topics: ['AI Literacy', 'Social Work'], status: 'ai-agent-reviewed', review, evidence: [source],
}]) {
  return { schema: 'femprompt-assertion-index/0.1',
    meta: { allowed_states: ['ai-agent-reviewed', 'verified', 'publication-approved'] }, assertions };
}

const pause = (ms = 5) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(predicate) {
  for (let i = 0; i < 150; i++) { if (predicate()) return; await pause(); }
  throw new Error('Chat did not reach expected state');
}
function streamed(text, trailingNewline = true) {
  const data = JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] });
  return new Response('data: ' + data + (trailingNewline ? '\n\n' : ''), {
    status: 200, headers: { 'Content-Type': 'text/event-stream' },
  });
}

async function harness({ data = index(), respond, indexFailure = false } = {}) {
  const dom = new JSDOM('<div id="chat-container"></div>', {
    runScripts: 'dangerously', url: 'https://example.org/', pretendToBeVisual: true,
  });
  const { window } = dom;
  const calls = [], navigations = [];
  window.TextDecoder = TextDecoder;
  window.AbortController = AbortController;
  window.EC = {
    escapeHtml(value) {
      return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    navigateToPaper(id) { navigations.push(id); return true; },
  };
  window.fetch = async (url, options) => {
    if (url === 'data/assertion_index.json') {
      return indexFailure ? { ok: false, status: 404 } : { ok: true, json: async () => data };
    }
    calls.push({ url, body: JSON.parse(options.body), options });
    return respond ? respond(url, options) : streamed('Die Studie schlägt eine Integration vor. [' + sourceId + ']');
  };
  window.eval(script);
  window.initWissensChat();
  await pause();
  return {
    window, document: window.document, calls, navigations, close: () => window.close(),
    send(question, key = '') {
      window.document.getElementById('gemini-key').value = key;
      window.document.getElementById('chat-input').value = question;
      window.document.getElementById('chat-send').click();
    },
  };
}

const tests = [];
async function check(name, test) {
  try { await test(); tests.push({ name, ok: true }); }
  catch (error) { tests.push({ name, ok: false, error: error.stack }); }
}

await check('empty index answers locally without key or Google request', async () => {
  const h = await harness({ data: index([]) });
  try {
    h.send('Welche feministischen Perspektiven gibt es?');
    await waitFor(() => h.document.querySelector('.chat-msg-model'));
    assert.match(h.document.getElementById('chat-messages').textContent, /keine Aussagen mit den erforderlichen Prüfbelegen/);
    assert.equal(h.calls.length, 0);
    assert.equal(h.document.querySelector('.chat-error'), null);
  } finally { h.close(); }
});

await check('irrelevant query gets no padding or Gemini call', async () => {
  const h = await harness();
  try {
    h.send('Quantenchromodynamik');
    await waitFor(() => h.document.querySelector('.chat-msg-model'));
    assert.match(h.document.querySelector('.chat-msg-model').textContent, /keine passenden quellengeprüften Aussagen/);
    assert.equal(h.calls.length, 0);
  } finally { h.close(); }
});

await check('missing or invalid index never falls back to abstracts or Google', async () => {
  for (const options of [{ indexFailure: true }, { data: { schema: 'legacy-corpus', assertions: [] } }]) {
    const h = await harness(options);
    try {
      h.send('AI Literacy', 'fixture-key');
      await waitFor(() => h.document.querySelector('.chat-error'));
      assert.equal(h.calls.length, 0);
      assert.match(h.document.querySelector('.chat-error').textContent, /Quellenindex/);
    } finally { h.close(); }
  }
});

await check('AI-reviewed status without model attribution fails closed', async () => {
  const data = index();
  data.assertions[0].review = null;
  const h = await harness({ data });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-error'));
    assert.equal(h.calls.length, 0);
  } finally { h.close(); }
});

await check('German retrieval uses asserted English evidence and asks for key only with a match', async () => {
  const h = await harness();
  try {
    h.send('Kompetenzen in der Sozialen Arbeit');
    await waitFor(() => h.document.querySelector('.chat-error'));
    assert.match(h.document.querySelector('.chat-error').textContent, /API Key/);
    assert.equal(h.calls.length, 0);
    h.send('Kompetenzen in der Sozialen Arbeit', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-references'));
    assert.equal(h.calls.length, 1);
  } finally { h.close(); }
});

await check('current question occurs once and history contains no unfinished placeholder', async () => {
  const h = await harness();
  try {
    h.send('Welche AI Literacy Kompetenzen?', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-references'));
    assert.equal(h.calls[0].body.contents.length, 1);
    assert.equal(h.calls[0].body.contents[0].parts[0].text, 'Welche AI Literacy Kompetenzen?');
    h.send('Was bedeutet das für Social Work?', 'fixture-key');
    await waitFor(() => h.calls.length === 2 && h.document.querySelectorAll('.chat-references').length === 2);
    const contents = h.calls[1].body.contents;
    assert.deepEqual(contents.map((item) => item.role), ['user', 'model', 'user']);
    assert.equal(contents.filter((item) => item.parts[0].text === 'Was bedeutet das für Social Work?').length, 1);
  } finally { h.close(); }
});

await check('system context includes complete source quotes and distinct AI provenance', async () => {
  const h = await harness();
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.calls.length === 1);
    const prompt = h.calls[0].body.systemInstruction.parts[0].text;
    assert.ok(prompt.includes(source.quote));
    assert.ok(prompt.includes(source.version_id));
    assert.ok(prompt.includes(source.work_id));
    assert.ok(prompt.includes(review.model));
    assert.ok(prompt.includes('KI-Quellenprüfung ist keine fachliche Verifikation'));
    assert.ok(!prompt.includes('LLM-Begruendung'));
    assert.ok(!prompt.includes('Divergenz-Muster'));
  } finally { h.close(); }
});

await check('exact source IDs link to version source and expose quote, locator, review', async () => {
  const h = await harness();
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-references'));
    const cite = h.document.querySelector('.cite-source');
    assert.equal(cite.href, source.source_url);
    assert.equal(cite.rel, 'noopener noreferrer');
    const refs = h.document.querySelector('.chat-references').textContent;
    for (const value of [source.quote, source.locator, source.work_id, source.version_id, review.agent_id, review.model]) {
      assert.ok(refs.includes(value));
    }
    h.document.querySelector('.chat-ref-item').click();
    assert.deepEqual(h.navigations, ['LITERACY']);
  } finally { h.close(); }
});

await check('unknown citation is not guessed from corpus author/year', async () => {
  const h = await harness({ respond: () => streamed('Author (2026) [E-ffffffffffffffff]') });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-msg-model')?.textContent.includes('keine gültigen Quellen-IDs'));
    assert.equal(h.document.querySelector('.cite-source'), null);
    assert.equal(h.document.querySelector('.chat-references'), null);
  } finally { h.close(); }
});

await check('uncited generation is withheld and not replayed as supported history', async () => {
  let attempts = 0;
  const h = await harness({ respond: () => streamed(++attempts === 1 ? 'An unsupported claim.' : 'Ein Vorschlag. [' + sourceId + ']') });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-msg-model')?.textContent.includes('keine gültigen Quellen-IDs'));
    assert.ok(!h.document.querySelector('.chat-msg-model').textContent.includes('An unsupported claim.'));
    h.send('Social Work', 'fixture-key');
    await waitFor(() => h.calls.length === 2);
    assert.equal(h.calls[1].body.contents.length, 1);
  } finally { h.close(); }
});

await check('complete final SSE event without a newline is processed', async () => {
  const h = await harness({ respond: () => streamed('Präzise Ergänzung. [' + sourceId + ']', false) });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-references'));
    assert.match(h.document.querySelector('.chat-msg-model').textContent, /Präzise Ergänzung/);
  } finally { h.close(); }
});

await check('review rationale is not supplied as additional substantive study evidence', async () => {
  const data = index();
  data.assertions[0].review = { ...review, findings: 'PRIVATE_RATIONALE_SENTINEL' };
  data.assertions[0].evidence = [{ ...source, review: { ...review, findings: 'PRIVATE_RATIONALE_SENTINEL' } }];
  const h = await harness({ data });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.calls.length === 1);
    assert.ok(!h.calls[0].body.systemInstruction.parts[0].text.includes('PRIVATE_RATIONALE_SENTINEL'));
  } finally { h.close(); }
});

await check('unsafe source URLs fail index validation', async () => {
  const data = index();
  data.assertions[0].evidence = [{ ...source, source_url: 'javascript:alert(1)' }];
  const h = await harness({ data });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-error'));
    assert.equal(h.calls.length, 0);
  } finally { h.close(); }
});

await check('HTML in model text and in source quotes remains escaped', async () => {
  const data = index();
  data.assertions[0].evidence = [{ ...source, quote: '<img src=x onerror="alert(1)">AI literacy' }];
  const h = await harness({ data, respond: () => streamed('<script>bad()</script> [' + sourceId + ']') });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-references'));
    assert.equal(h.document.querySelector('#chat-messages script'), null);
    assert.equal(h.document.querySelector('#chat-messages img'), null);
    assert.match(h.document.querySelector('.chat-msg-model').textContent, /<script>bad\(\)<\/script>/);
  } finally { h.close(); }
});

await check('API errors retain visible banner and restore send button', async () => {
  const h = await harness({ respond: () => new Response(JSON.stringify({ error: { message: 'Fixture API failure' } }), { status: 400 }) });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.document.querySelector('.chat-error'));
    await pause(20);
    assert.match(h.document.querySelector('.chat-error').textContent, /Fixture API failure/);
    assert.equal(h.document.getElementById('chat-send').title, 'Senden (Enter)');
    assert.equal(h.document.querySelector('.chat-msg-model'), null);
  } finally { h.close(); }
});

await check('API key stays session-scoped', async () => {
  const h = await harness();
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.calls.length === 1);
    assert.equal(h.window.sessionStorage.getItem('femPrompt_geminiApiKey/session'), 'fixture-key');
    assert.equal(h.window.localStorage.length, 0);
  } finally { h.close(); }
});

await check('stream abort restores controls without a spurious API error', async () => {
  const h = await harness({ respond: (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }) });
  try {
    h.send('AI literacy', 'fixture-key');
    await waitFor(() => h.calls.length === 1);
    h.document.getElementById('chat-send').click();
    await waitFor(() => h.document.getElementById('chat-send').title === 'Senden (Enter)');
    assert.equal(h.document.querySelector('.chat-error'), null);
    assert.equal(h.document.querySelector('.chat-msg-model'), null);
  } finally { h.close(); }
});

for (const result of tests) if (!result.ok) console.error('FAIL ' + result.name + '\n' + result.error);
const passed = tests.filter((result) => result.ok).length;
console.log(`${passed === tests.length ? 'PASS' : 'FAIL'} ${passed}/${tests.length} grounded chat tests`);
process.exitCode = passed === tests.length ? 0 : 1;
