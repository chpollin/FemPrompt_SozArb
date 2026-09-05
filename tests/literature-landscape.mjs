// Public Work aggregation and attributed AI review rendering, independent of
// how many production records have reached the current publication policy.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const receipt = {
  agent_id: 'reviewer-1', model: 'test-model', reviewed_at: '2026-09-05T12:00:00Z',
  findings: 'Checked <source> evidence.',
};
const record = {
  id: 'P1', work_id: 'work:one', version_id: 'version:one', title: 'One work',
  author_year: 'Author (2025)', year: 2025, decision: 'Include', text_source: 'raw',
  record_ids: ['P1', 'P2'], work_versions: [], version_type: 'preprint',
  categories: ['Generative_KI', 'Gender'].map(key => ({
    key, level: 1,
    evidence: ['P1', 'P2'].map(source_record_id => ({
      term: 'evidence', snippet: 'A grounded passage.', source_record_id,
      version_id: source_record_id === 'P1' ? 'version:one' : 'version:two',
    })),
  })),
  analysis: { fields: { AN_Bias_Axes: ['Gender'], Studientyp: 'Empirisch' }, notes: '', undecidable: [] },
  source_records: ['P1', 'P2'].map(id => ({ id, ai_verification: receipt, verification: null, publication_approval: null })),
};
const payload = {
  source: { public_label: 'KI-quellengeprüft', provisional: false },
  meta: { annotated_total: 1, source_annotated_total: 2, withheld_total: 0, included_total: 1, unclear_total: 0, excluded_total: 0 },
  category_groups: { object: ['Generative_KI'], perspective: ['Gender'] }, records: [record],
};
record.source_records[0].ai_correction = {
  agent_id: 'correction-agent', model: 'correction-model', corrected_at: '2026-09-05T11:00:00Z',
  changes: [{path:'/analysis/fields/AN_Mitigation_Status', before:'Evaluated', after:'Proposed', reason:'No <evaluated> intervention.'}],
};
const dom = new JSDOM('<div id="literaturbild-root"></div>', { runScripts: 'dangerously', url: 'http://localhost/' });
const { window } = dom;
window.EC = { escapeHtml(value) {
  const element = window.document.createElement('span');
  element.textContent = String(value ?? '');
  return element.innerHTML;
} };
window.fetch = async () => ({ ok: true, json: async () => structuredClone(payload) });
window.eval(readFileSync(new URL('../docs/js/literaturbild.js', import.meta.url), 'utf8'));
window.initLiteraturbild();
await new Promise(resolve => setTimeout(resolve, 20));
const doc = window.document;
const progress = doc.querySelector('.lit-progress').textContent;
assert.match(progress, /1 ki-quellengeprüft \(Werke\)/);
assert.match(progress, /2 bearbeitet \(Einträge\)/);
const matrixCell = doc.querySelector('.lit-matrix-button');
assert.equal(matrixCell.querySelector('strong').textContent, '1');
matrixCell.click();
assert.equal(doc.querySelector('#lit-result-count').textContent, '1 Werk');
assert.equal(doc.querySelectorAll('.lit-paper').length, 1);
assert.match(doc.querySelector('.lit-paper-version').textContent, /P1, P2/);
assert.match(doc.querySelector('.lit-paper-review').textContent, /reviewer-1 · test-model · 2026-09-05T12:00:00Z/);
assert.doesNotMatch(doc.querySelector('.lit-paper-review').textContent, /Fachliche Verifikation|Publikationsfreigabe/);
assert.equal(doc.querySelector('.lit-paper-review source'), null);
assert.match(doc.querySelector('.lit-paper-review').textContent, /correction-agent · correction-model/);
assert.match(doc.querySelector('.lit-paper-review').textContent, /Evaluiert → Vorgeschlagen/);
assert.equal(doc.querySelector('.lit-paper-review evaluated'), null);
assert.match(doc.querySelector('.lit-paper-evidence').textContent, /Eintrag P2 · Fassung version:two/);
window.close();
console.log('OK: Work counts, alias evidence and attributed AI review render correctly');
