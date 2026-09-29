// Third-party full texts are excluded from Git (operator decision of 2026-09-29).
// Historical run manifests keep their recorded source paths and hashes. Where a
// source is absent, generated/local-fulltext-ledger.json supplies its recorded hash
// and the quotation re-check is skipped; a checkout holding the texts runs it.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const LEDGER = 'generated/local-fulltext-ledger.json';
const ledgers = new Map();

function ledgerFiles(root) {
  if (!ledgers.has(root)) {
    const path = resolve(root, LEDGER);
    ledgers.set(root, existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')).files || {} : {});
  }
  return ledgers.get(root);
}

function recorded(root, path) {
  if (existsSync(resolve(root, path))) return null;
  return ledgerFiles(root)[String(path).replaceAll('\\', '/')] || null;
}

export function sourceSha256(root, path) {
  return recorded(root, path) || createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

// Returns null for an absent, ledgered local full text.
export function sourceText(root, path) {
  return recorded(root, path) ? null : readFileSync(resolve(root, path), 'utf8');
}
