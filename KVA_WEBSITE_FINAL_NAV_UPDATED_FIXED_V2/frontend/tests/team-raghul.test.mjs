import fs from 'node:fs';
import assert from 'node:assert/strict';

const data = fs.readFileSync(new URL('../src/data.js', import.meta.url), 'utf8');
const imagePath = new URL('../public/team/s-raghul.png', import.meta.url);

assert.match(data, /export const team = \[\s*\{[^}]*name:\s*"S\. Raghul"/s,
  'S. Raghul must be the first team member in the team data.'
);
assert.match(data, /export const team = \[\s*\{[^}]*name:\s*"S\. Raghul"[^}]*role:\s*"Corporate Compliance Professional"[^}]*bio:/s,
  'S. Raghul must have the requested role and biography.'
);
assert.match(data, /export const team = \[\s*\{[^}]*name:\s*"S\. Raghul"[^}]*image:\s*"\/team\/s-raghul\.png"/s,
  'S. Raghul must use the uploaded profile image.'
);
assert.ok(fs.existsSync(imagePath), 'S. Raghul profile image must exist in public/team.');
console.log('team Raghul tests passed');
