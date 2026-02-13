import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'packages/player/src/index.ts');
const snapshotPath = path.join(root, 'packages/player/api/public-api.snapshot');
const update = process.argv.includes('--update');

const source = fs.readFileSync(sourcePath, 'utf8');

const statements = source
  .split(';')
  .map((segment) => segment.trim())
  .filter((segment) => segment.startsWith('export '))
  .map((segment) => `${segment.replace(/\s+/g, ' ').trim()};`)
  .sort();

const normalized = `${statements.join('\n')}\n`;

if (update) {
  fs.writeFileSync(snapshotPath, normalized, 'utf8');
  console.log(`Updated API snapshot: ${path.relative(root, snapshotPath)}`);
  process.exit(0);
}

if (!fs.existsSync(snapshotPath)) {
  console.error('API snapshot file not found. Run: node scripts/check-api-surface.mjs --update');
  process.exit(1);
}

const snapshot = fs.readFileSync(snapshotPath, 'utf8');
if (snapshot !== normalized) {
  console.error('Public API surface changed.');
  console.error('If expected, run: node scripts/check-api-surface.mjs --update');
  process.exit(1);
}

console.log('Public API surface check passed.');
