import fs from 'node:fs';
import assert from 'node:assert/strict';

const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');

assert.match(css, /--font-primary\s*:\s*["']Inter["']\s*,\s*sans-serif\s*;/,
  'Global typography must expose the Inter font variable.'
);
assert.match(css, /--title-size\s*:\s*48px\s*;/,
  'Title size control must be 48px.'
);
assert.match(css, /--subtitle-size\s*:\s*22px\s*;/,
  'Subtitle size control must be 22px.'
);
assert.match(css, /--body-size\s*:\s*17px\s*;/,
  'Body size control must be 17px.'
);
assert.match(css, /--title-weight\s*:\s*700\s*;/,
  'Title weight control must be 700.'
);
assert.match(css, /--subtitle-weight\s*:\s*600\s*;/,
  'Subtitle weight control must be 600.'
);
assert.match(css, /--body-weight\s*:\s*400\s*;/,
  'Body weight control must be 400.'
);
assert.match(css, /--theme-blue\s*:\s*#168e9c\s*;/,
  'Typography must use the existing KVA theme blue.'
);
assert.match(css, /--body-text-color\s*:\s*#000000\s*;/,
  'Body text color control must be pure black.'
);
assert.match(css, /body\s*,\s*body\s*\*\s*\{[^}]*font-family\s*:\s*var\(--font-primary\)/s,
  'Global typography must apply the primary font consistently.'
);
assert.match(css, /\.section-head h2\s*\{[^}]*font-size\s*:\s*clamp\(/s,
  'Section headings must use responsive sizing and the centralized title size.'
);
assert.match(css, /\.section-head p\s*\{[^}]*font-size\s*:[^;]*var\(--subtitle-size\)/s,
  'Section subtitles must use the centralized subtitle size.'
);
assert.match(css, /\.section-head p\s*\{[^}]*color\s*:\s*var\(--body-text-color\)/s,
  'Section subtitles must default to black.'
);
assert.match(css, /\.body-text\s*\{[^}]*font-size\s*:\s*var\(--body-size\)/s,
  'Body text must use the centralized body size.'
);
assert.match(app, /className="title-highlight"/,
  'Section titles must support a highlighted word.'
);
assert.match(app, /className="section-subtitle-highlight"/,
  'Section subtitles must support a single highlighted word.'
);
console.log('global typography tests passed');
