// Asynchronous persistence checks for PRISM (ADR-031, ADR-040, ADR-042). Each scenario
// runs in a fresh jsdom window over an in-memory folder that behaves like a File System
// Access directory handle, so the real load, merge and write paths are exercised.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPrismaWindow } from './prisma-window.mjs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// An in-memory folder: files maps names to text, writes are recorded in order.
function memoryFolder(files, name = 'screening') {
  const writes = [];
  const fileHandle = (fileName) => ({
    kind: 'file', name: fileName,
    async getFile() { return { async text() { return files[fileName]; } }; },
    async createWritable() {
      let body = '';
      return { async write(text) { body = String(text); }, async close() { files[fileName] = body; writes.push(fileName); } };
    }
  });
  return {
    kind: 'directory', name, files, writes,
    async getDirectoryHandle() { const e = new Error('not found'); e.name = 'NotFoundError'; throw e; },
    async getFileHandle(fileName, options) {
      if (!(fileName in files) && !(options && options.create)) { const e = new Error('not found'); e.name = 'NotFoundError'; throw e; }
      if (!(fileName in files)) files[fileName] = '';
      return fileHandle(fileName);
    },
    async *values() { for (const fileName of Object.keys(files)) yield fileHandle(fileName); }
  };
}

async function settle(T) {
  for (let i = 0; i < 50; i++) {
    await sleep(5);
    if (T.saveStatus().kind !== 'saving') return;
  }
}

function tool(root, papers) {
  const { window } = createPrismaWindow(root);
  const T = window.__PRISMA_TEST__;
  T.setAnalysisFields(JSON.parse(readFileSync(join(root, 'docs/data/analysis_fields.json'), 'utf8')));
  T.setPapers(papers);
  T.setEditMode(true);
  return { window, T };
}

export async function runIntegrityChecks(root) {
  const checks = [];
  const check = (name, ok, detail) => checks.push({ name, ok: !!ok, detail });
  const corpus = JSON.parse(readFileSync(join(root, 'docs/data/research_vault_v2.json'), 'utf8')).papers;
  const ar2Text = readFileSync(join(root, 'docs/data/screening/ar2.json'), 'utf8');
  const ar2 = JSON.parse(ar2Text);

  // 1. A session over the real productive track: confirm one agent record and correct
  // another. The agent file is never written and stays byte-identical.
  {
    const { T } = tool(root, corpus);
    const folder = memoryFolder({ 'ar2.json': ar2Text });
    T.setScreeningHandle(folder);
    T.selectReviewer('ev');
    await T.loadAllReviewers();
    const ids = Object.keys(ar2.decisions).filter((id) => ar2.decisions[id].lifecycle.state === 'ai-agent-reviewed');
    const first = corpus.find((p) => p.id === ids[0]);
    const second = corpus.find((p) => p.id === ids[1]);
    const S = T.getState();
    S.index = corpus.indexOf(first);
    T.setTextSource(ar2.decisions[first.id].text_source);
    T.setWork(T.draftFor(first));
    await T.verifyAgentRecord(first);
    S.index = corpus.indexOf(second);
    T.setTextSource(ar2.decisions[second.id].text_source);
    T.setWork(T.draftFor(second));
    T.getWork().verifyResult = 'rejected';
    T.getWork().verifyNote = 'Fachlich nicht tragfähig.';
    await T.verifyAgentRecord(second);
    await settle(T);
    const expert = JSON.parse(folder.files['ev.json'] || '{}');
    check('ar2 session: the agent file is never written and stays byte-identical',
      folder.files['ar2.json'] === ar2Text && !folder.writes.includes('ar2.json'), folder.writes);
    check('ar2 session: the verifications land in the reviewer file and no decision of the agent papers',
      expert.verifications?.length === 2 && !expert.decisions?.[first.id] && !expert.decisions?.[second.id] &&
        expert.verifications[0].subject.reviewer === 'ar2' && expert.verifications[1].result === 'rejected',
      { verifications: expert.verifications?.map((v) => v.result), decisions: Object.keys(expert.decisions || {}) });
    check('ar2 session: the key of the agent track cannot be chosen', T.selectReviewer('ar2') === false && S.reviewer === 'ev');
  }

  // 2. A file changed outside PRISM (second tab, pull) is re-read and merged before the write.
  {
    const papers = [{ id: 'P1', title: 'one' }, { id: 'P2', title: 'two' }];
    const { T } = tool(root, papers);
    const record = (decision, ts) => ({ decision, reason: decision === 'Exclude' ? 'Duplicate' : null, categories: {}, evidence: {}, ts, reviewer: 'cp', actor: 'human' });
    const initial = JSON.stringify({ schema: 'femprompt-prisma-reviewer/0.4', reviewer: 'cp', actor: 'human', updated: 'x', decisions: { P1: record('Exclude', '2026-09-01T00:00:00Z') } });
    const folder = memoryFolder({ 'cp.json': initial });
    T.setScreeningHandle(folder);
    T.selectReviewer('cp');
    await T.loadAllReviewers();
    folder.files['cp.json'] = JSON.stringify({ schema: 'femprompt-prisma-reviewer/0.4', reviewer: 'cp', actor: 'human', updated: 'y',
      decisions: { P1: record('Exclude', '2026-09-01T00:00:00Z'), P2: record('Exclude', '2026-09-02T00:00:00Z') } });
    T.getState().reviewers.cp.P1 = record('Exclude', '2026-09-03T00:00:00Z');
    await T.save();
    const merged = JSON.parse(folder.files['cp.json']);
    check('external change: a record written by another session survives the next save',
      !!merged.decisions.P2 && merged.decisions.P1.ts === '2026-09-03T00:00:00Z', Object.keys(merged.decisions));
    folder.files['cp.json'] = JSON.stringify({ schema: 'femprompt-prisma-reviewer/0.4', reviewer: 'cp', actor: 'human', updated: 'z',
      decisions: { P1: { ...record('Exclude', '2026-09-03T00:00:00Z'), reason: 'Language' } } });
    const before = folder.files['cp.json'];
    T.getState().reviewers.cp.P1 = { ...record('Exclude', '2026-09-03T00:00:00Z'), reason: 'Not_relevant_topic' };
    const ok = await T.save();
    check('external change: an unordered same-paper divergence blocks the write and offers a choice',
      ok === false && folder.files['cp.json'] === before && !!T.reviewerConflicts().cp, T.saveStatus());
    T.resolveReviewerConflict('cp', 'disk');
    check('external change: keeping the file version resolves the block',
      T.getState().reviewers.cp.P1.reason === 'Language' && !T.reviewerFileErrors().cp);
  }

  // 3. An empty file left by an interrupted first write counts as absent, and a single
  // unusable record is held back without locking the file.
  {
    const papers = [{ id: 'Q1', title: 'q' }];
    const { T } = tool(root, papers);
    const folder = memoryFolder({
      'cp.json': '',
      'kx.json': JSON.stringify({ schema: 'femprompt-prisma-reviewer/0.4', reviewer: 'kx', actor: 'human', updated: 'x', decisions: {
        Q1: { decision: 'Exclude', reason: 'Duplicate', categories: {}, evidence: {} },
        ZZZZZZZZ: { decision: 'Exclude', reason: 'Duplicate', categories: {}, evidence: {} }
      } })
    });
    T.setScreeningHandle(folder);
    T.selectReviewer('cp');
    await T.loadAllReviewers();
    check('empty file: an interrupted first write does not block the key', !T.reviewerFileErrors().cp, T.reviewerFileErrors());
    check('quarantine: an unknown record is held back while the rest of the file loads',
      !T.reviewerFileErrors().kx && !!T.getState().reviewers.kx.Q1 && !T.getState().reviewers.kx.ZZZZZZZZ &&
        !!T.quarantinedRecords().kx.ZZZZZZZZ);
    T.selectReviewer('kx');
    await T.save();
    check('quarantine: the held record is written back unchanged', !!JSON.parse(folder.files['kx.json']).decisions.ZZZZZZZZ);
  }

  // 4. Another working folder starts clean, so records never travel between clones.
  {
    const { T } = tool(root, [{ id: 'R1', title: 'r' }]);
    T.getState().reviewer = 'cp';
    T.getState().reviewers.cp = { R1: { decision: 'Exclude', reason: 'Duplicate', categories: {} } };
    const a = { name: 'clone-a', async isSameEntry(other) { return other === a; } };
    const b = { name: 'clone-b', async isSameEntry(other) { return other === b; } };
    await T.bindFolder(a);
    T.getState().reviewers.cp = { R1: { decision: 'Exclude', reason: 'Duplicate', categories: {} } };
    const switched = await T.bindFolder(b);
    check('folder change: in-memory records of the previous folder are discarded',
      switched === true && !T.getState().reviewers.cp);
  }

  // 5. The assignment file is optional and never read as a reviewer file.
  {
    const assignmentText = readFileSync(join(root, 'docs/data/screening/assignment.json'), 'utf8');
    const { window, T } = tool(root, corpus);
    const unreachable = await T.loadAssignment(); // the harness fetch rejects
    check('assignment: an unreachable file leaves the filter out without an error',
      unreachable === null && !T.assigneeFilterAvailable() && !/pt-assignee-seg/.test(T.filtersHtml()));
    window.fetch = () => Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('404')) });
    const missing = await T.loadAssignment();
    check('assignment: a missing file leaves the filter out without an error', missing === null && !T.assigneeFilterAvailable());
    window.fetch = (url) => Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(assignmentText)), url });
    const loaded = await T.loadAssignment();
    check('assignment: the served file enables the filter with the declared reviewers',
      loaded && loaded.reviewers.map((r) => r.key).join('|') === 'sabine|susi' && /data-assignee="susi"/.test(T.filtersHtml()));
    const folder = memoryFolder({ 'ar2.json': ar2Text, 'assignment.json': assignmentText });
    T.setScreeningHandle(folder);
    T.selectReviewer('ev');
    await T.loadAllReviewers();
    check('assignment: the file beside the reviewer files raises no reviewer error and is never loaded as a track',
      !T.reviewerFileErrors().assignment && !T.getState().reviewers.assignment, T.reviewerFileErrors());
    check('assignment: its name cannot become a reviewer key', T.selectReviewer('assignment') === false);
  }
  return checks;
}
