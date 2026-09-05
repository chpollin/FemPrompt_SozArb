import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateManifest } from './validate-run-contract.mjs';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const parent = join(root, 'tmp');
mkdirSync(parent, { recursive: true });
const fixture = mkdtempSync(join(parent, 'source-assets-'));
const outside = mkdtempSync(join(tmpdir(), 'source-assets-'));
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const repoPath = (path) => relative(root, path).replaceAll('\\', '/');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
const pngPath = join(fixture, 'page-2.png');
const sourcePath = join(fixture, 'paper.md');
writeFileSync(pngPath, png);
writeFileSync(sourcePath, '# Synthetic original text\n');
const timestamp = '2026-09-05T12:00:00.000Z';
let cases = 0;

function prepared(withAsset = true) {
  const raw = readFileSync(join(root, 'tests/review-cases/agent-runs/run-template.json'), 'utf8');
  const run = JSON.parse(raw.replaceAll('replace-me', 'fixture'));
  const fillHashes = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const key of Object.keys(value)) {
      if (key === 'sha256' && value[key] === 'fixture') value[key] = 'a'.repeat(64);
      else fillHashes(value[key]);
    }
  };
  fillHashes(run);
  run.baseline.commit = 'b'.repeat(40);
  run.timestamps.created_at = timestamp;
  run.assignment.complete = true;
  const source = run.assignment.papers[0].source;
  source.path = repoPath(sourcePath);
  source.sha256 = digest(readFileSync(sourcePath));
  if (withAsset) source.assets = [{ path: repoPath(pngPath), sha256: digest(png), media_type: 'image/png',
    locator: 'PDF page 2, Figure 1', source_url: 'https://example.org/original-paper.pdf',
    // Deliberately no original PDF file: this provenance digest is declared only.
    source_sha256: 'c'.repeat(64), license: 'CC-BY-4.0' }];
  for (const track of run.tracks) {
    track.source_assignments[0].source_path = source.path;
    track.source_assignments[0].source_sha256 = source.sha256;
  }
  return run;
}

function completed() {
  const run = prepared();
  run.status = run.lifecycle.state = 'completed';
  run.timestamps.started_at = run.timestamps.completed_at = timestamp;
  for (const key of ['coding_packet_validation', 'frontend_roundtrip']) {
    run.execution[key].result = 'pass';
    run.execution[key].records = 2;
  }
  const artifact = (name) => {
    const path = join(fixture, name);
    writeFileSync(path, '{}\n');
    return { path: repoPath(path), sha256: digest(readFileSync(path)) };
  };
  run.outputs = [];
  for (const track of run.tracks) {
    track.started_at = track.completed_at = timestamp;
    const packet = artifact(`${track.reviewer_id}-packet.json`);
    const report = artifact(`${track.reviewer_id}-report.json`);
    track.coding_packet = packet.path;
    track.coding_packet_sha256 = packet.sha256;
    track.report = report.path;
    track.report_sha256 = report.sha256;
    track.output = artifact(`${track.reviewer_id}-output.json`);
    run.outputs.push({ kind: 'agent_track', reviewer_id: track.reviewer_id, ...track.output });
  }
  const review = run.provenance.activities[0];
  review.status = 'completed';
  review.started_at = review.completed_at = timestamp;
  const output = artifact('review.json');
  review.outputs = [output];
  run.outputs.push({ kind: 'ai_agent_review', ...output });
  return run;
}

function accepted(run, message) {
  const result = validateManifest(run);
  assert.equal(result.ok, true, `${message}: ${result.errors.join('; ')}`);
  cases += 1;
}

function rejected(mutate, pattern, message) {
  const run = prepared();
  mutate(run.assignment.papers[0].source, run);
  const result = validateManifest(run);
  assert.equal(result.ok, false, message);
  assert(result.errors.some((error) => pattern.test(error)), `${message}: ${result.errors.join('; ')}`);
  cases += 1;
}

// Fixture deletion is limited to the two exact temporary directories created
// above; never resolve an arbitrary manifest path for filesystem mutation.
function removeFixture(path, expectedParent) {
  const target = resolve(path);
  assert.equal(dirname(target), resolve(expectedParent));
  assert(basename(target).startsWith('source-assets-'));
  rmSync(target, { recursive: true, force: true });
}

try {
  accepted(prepared(false), 'schema 1.3 without assets remains compatible');
  accepted(prepared(), 'prepared run validates PNG bytes without requiring the declared original PDF');
  const historical = prepared(false);
  historical.schema = 'femprompt-prisma-agent-run/1.2';
  accepted(historical, 'historical 1.2 remains compatible');
  const legacy = prepared(false);
  legacy.schema = 'femprompt-prisma-agent-run/0.2';
  const legacyOptions = { path: 'tests/review-cases/agent-runs/ratification-ar2-20260822/run.json' };
  assert.equal(validateManifest(legacy, legacyOptions).ok, true, 'unchanged legacy exception remains compatible');
  legacy.assignment.papers[0].source.assets = [];
  assert.equal(validateManifest(legacy, legacyOptions).ok, false, 'legacy exception cannot bypass newly declared asset validation');
  cases += 2;
  for (const invalid of [[], null, {}, 'image.png'])
    rejected((source) => { source.assets = invalid; }, /non-empty array/, 'provided assets must be a non-empty array');
  rejected((source) => { source.assets = [null]; }, /must be an object/, 'asset must be an object');
  for (const field of ['path', 'sha256', 'media_type', 'locator', 'source_url', 'source_sha256', 'license'])
    rejected((source) => { delete source.assets[0][field]; }, new RegExp(field.replaceAll('.', '\\.')), `missing ${field}`);
  for (const path of ['../outside.png', 'tmp/../outside.png', '/absolute.png', 'C:\\absolute.png', 'C:relative.png', '\\\\server\\share\\file.png', 'tmp/page.png:stream', 'tmp/./page.png'])
    rejected((source) => { source.assets[0].path = path; }, /safe relative repository PNG path/, `unsafe path ${path}`);
  rejected((source) => { source.assets[0].path = repoPath(join(fixture, 'absent.png')); }, /not an accessible repository PNG/, 'missing PNG');
  rejected((source) => { source.assets[0].sha256 = 'd'.repeat(64); }, /does not match PNG bytes/, 'incorrect PNG hash');
  rejected((source) => { source.assets[0].source_sha256 = 'not-a-hash'; }, /declared original-source digest/, 'malformed original digest');
  rejected((source) => { source.assets[0].media_type = 'image/jpeg'; }, /media_type/, 'wrong media type');
  rejected((source) => { source.assets[0].license = 'CC-BY-NC-4.0'; }, /license/, 'wrong license');
  for (const url of ['file:///original.pdf', 'javascript:alert(1)', '/relative.pdf', 'https://user:pass@example.org/a.pdf'])
    rejected((source) => { source.assets[0].source_url = url; }, /absolute HTTP\(S\)/, 'invalid original source URL');
  rejected((source) => { source.assets.push({ ...source.assets[0] }); }, /duplicates another assigned asset/, 'duplicate path');
  rejected((source) => { source.assets.push({ ...source.assets[0], path: source.assets[0].path.replaceAll('/', '\\') }); }, /duplicates another assigned asset/, 'separator alias duplicates the same file');
  const fake = join(fixture, 'not-image.png');
  writeFileSync(fake, 'not a PNG');
  rejected((source) => { source.assets[0].path = repoPath(fake); source.assets[0].sha256 = digest(readFileSync(fake)); }, /no PNG signature/, 'matching hash is insufficient for a non-PNG');
  const short = join(fixture, 'short.png');
  writeFileSync(short, png.subarray(0, 7));
  rejected((source) => { source.assets[0].path = repoPath(short); source.assets[0].sha256 = digest(readFileSync(short)); }, /no PNG signature/, 'truncated signature');
  writeFileSync(join(outside, 'page.png'), png);
  symlinkSync(outside, join(fixture, 'external'), process.platform === 'win32' ? 'junction' : 'dir');
  rejected((source) => { source.assets[0].path = repoPath(join(fixture, 'external/page.png')); }, /escapes the repository through a symlink/, 'external symlink escape');
  const finished = completed();
  const unchanged = structuredClone(finished);
  accepted(finished, 'completed run verifies assets as well as outputs');
  assert.deepEqual(finished, unchanged, 'asset checks must not change source text assignments, annotations or lifecycle');
  cases += 1;
  writeFileSync(pngPath, Buffer.concat([png, Buffer.from('changed after capture')]));
  for (const run of [prepared(), finished]) {
    const result = validateManifest(run);
    assert.equal(result.ok, false, 'mutated PNG must be rejected before and after completion');
    assert(result.errors.some((error) => /does not match PNG bytes/.test(error)));
    cases += 1;
  }
  console.log(`PASS source assets: ${cases} compatibility, provenance, path, signature and before/after integrity checks`);
} finally {
  removeFixture(fixture, parent);
  removeFixture(outside, tmpdir());
}
