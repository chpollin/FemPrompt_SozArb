// Asynchronous persistence checks for PRISM (ADR-031, ADR-040, ADR-042, ADR-044). Each scenario
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

  // 1. A human session over the real productive track (ADR-044): a paper with only an
  // agent record starts empty, its codes never reach the list, an own save writes the
  // reviewer file, a verification entry of an earlier build still loads, validates and
  // survives the write, and the agent file is never written and stays byte-identical.
  {
    const { T } = tool(root, corpus);
    const ids = Object.keys(ar2.decisions).filter((id) => ar2.decisions[id].lifecycle.state === 'ai-agent-reviewed');
    const agentOnly = corpus.filter((p) => ids.includes(p.id) && !(p.human && p.human.decision) &&
      Object.values(ar2.decisions[p.id].categories || {}).some((v) => v));
    const judged = corpus.find((p) => ids.includes(p.id) && p !== agentOnly[0]);
    const working = JSON.parse(JSON.stringify(ar2.decisions[judged.id]));
    const outcome = T.advanceVerification(working, 'verified', {
      reviewer_id: 'ev', actor_ids: ['ev'], activity_id: 'prism-session-legacy', result: 'accepted'
    });
    const legacyEntry = T.verificationEntry(judged.id, { reviewer: 'ar2', record: ar2.decisions[judged.id] },
      ar2.decisions[judged.id].active_annotation_id, outcome.event, 'ev', null);
    const evFile = { schema: 'femprompt-prisma-reviewer/0.5', reviewer: 'ev', actor: 'human', updated: '2026-09-30T00:00:00.000Z',
      decisions: {}, verification_schema: T.VERIFICATION_SCHEMA, verifications: [legacyEntry] };
    const folder = memoryFolder({ 'ar2.json': ar2Text, 'ev.json': JSON.stringify(evFile) });
    T.setScreeningHandle(folder);
    T.selectReviewer('ev');
    await T.loadAllReviewers();
    const S = T.getState();
    const first = agentOnly[0];
    S.index = corpus.indexOf(first);
    const subject = T.paperSubject(first);
    const draft = T.draftFor(first);
    check('ar2 session: an agent-only paper starts empty for a human reviewer',
      agentOnly.length > 0 && subject.kind === 'empty' && Object.keys(draft.cats).length === 0 && !draft.reason,
      { paper: first && first.id, kind: subject.kind, cats: draft.cats });
    T.setCorpusQuery('');
    S.statusFilter = 'alle'; S.catFilter = [];
    const listHtml = T.corpusListHtml();
    const entry = listHtml.split('<button').find((part) => part.includes('data-i="' + corpus.indexOf(first) + '"')) || '';
    check('ar2 session: the list shows neither a mark nor category dots for the agent codes',
      entry.includes('data-state="none"') && !entry.includes('pt-nav-cats') && !listHtml.includes('pt-mark-agent') &&
        !listHtml.includes('Agentenkodierung'), entry.slice(0, 300));
    check('ar2 session: an agent-only paper stays open', !T.isDone(first) && T.listState(first) === 'none');
    check('ar2 session: a verification entry of an earlier build loads and validates',
      !T.reviewerFileErrors().ev && T.verifications('ev').length === 1 &&
        T.validateReviewerPayload(evFile).ok && T.agentTrack().records[judged.id].lifecycle.state === 'verified' &&
        T.paperSubject(judged).kind !== 'agent' && !T.isCaptured(judged), T.reviewerFileErrors());
    T.setTextSource('abstract');
    T.setWork(T.draftFor(first));
    T.getWork().reason = 'Not_relevant_topic';
    T.markDirty();
    const saved = T.commit();
    await settle(T);
    const expert = JSON.parse(folder.files['ev.json'] || '{}');
    check('ar2 session: an own save over an agent-only paper writes an own decision with no agent codes',
      saved === true && expert.decisions?.[first.id]?.decision === 'Exclude' &&
        Object.keys(expert.decisions[first.id].categories || {}).length === 0 &&
        expert.decisions[first.id].provenance?.derived_from?.length === 0 &&
        expert.verifications?.length === 1, { saved, decisions: Object.keys(expert.decisions || {}) });
    check('ar2 session: the agent file is never written and stays byte-identical',
      folder.files['ar2.json'] === ar2Text && !folder.writes.includes('ar2.json') &&
        readFileSync(join(root, 'docs/data/screening/ar2.json'), 'utf8') === ar2Text, folder.writes);
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

  // 6. A first save that failed leaves records only in the browser. With no file on disk
  // they are pending, and the save action writes them beside an untouched open paper.
  {
    const { T } = tool(root, corpus);
    const folder = memoryFolder({ 'ar2.json': ar2Text });
    T.setScreeningHandle(folder);
    T.selectReviewer('bo');
    const held = corpus.find((p) => !(p.human && p.human.decision));
    T.getState().reviewers.bo = { [held.id]: { decision: 'Exclude', reason: 'Duplicate', categories: {}, evidence: {}, ts: '2026-10-02T10:00:00.000Z', reviewer: 'bo', actor: 'human' } };
    await T.loadAllReviewers();
    const other = corpus.findIndex((p) => p !== held && !(p.human && p.human.decision));
    T.getState().index = other;
    T.resetWork(corpus[other]);
    const gate = T.saveGate(corpus[other]);
    check('pending: browser-only records without a file are flagged and offered beside an untouched paper',
      T.reviewerRecoveryPending().bo === true && gate.ok && gate.mode === 'file', { pending: T.reviewerRecoveryPending(), gate });
    await T.save();
    await settle(T);
    const written = folder.files['bo.json'] ? JSON.parse(folder.files['bo.json']).decisions : {};
    check('pending: the save action writes them into the new file', !!written[held.id], Object.keys(written));
  }
  return checks;
}
