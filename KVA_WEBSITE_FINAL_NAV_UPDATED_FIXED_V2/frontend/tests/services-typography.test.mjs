import fs from 'node:fs';
import assert from 'node:assert/strict';

const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

assert.match(css, /@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Inter/,
  'Services typography should load the Inter font.'
);
assert.match(css, /:root\s*\{[^}]*--service-font-size\s*:\s*17px\s*;[^}]*--subservice-font-size\s*:\s*16px\s*;/s,
  'Services font-size variables should be defined at :root for easy editing.'
);
assert.match(css, /\.services-nav[^{}]*\{[^}]*font-family\s*:\s*Inter/s,
  'Services navigation should use Inter consistently.'
);
assert.match(css, /\.mega-submenu-floating[^{}]*\{[^}]*font-family\s*:\s*Inter/s,
  'Floating sub-service panel should use Inter consistently.'
);
console.log('services typography tests passed');
