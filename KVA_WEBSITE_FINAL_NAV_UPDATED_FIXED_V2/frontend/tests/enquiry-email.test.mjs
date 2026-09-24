import assert from "node:assert/strict";
import fs from "node:fs";

assert.ok(fs.existsSync("../backend/index.mjs"), "backend/index.mjs should exist");
const backend=fs.readFileSync("../backend/index.mjs","utf8");
assert.match(backend,/SMTP_HOST/);
assert.match(backend,/smtp\.gmail\.com/);
assert.match(backend,/SMTP_APP_PASSWORD/);
assert.match(backend,/CONTACT_EMAIL/);
assert.match(backend,/AUTH LOGIN/);
const app=fs.readFileSync("src/App.jsx","utf8");
assert.match(app,/fetch\(`\$\{apiBase\}\/api\/contact`/);
assert.match(app,/connect@kvacs\.in/);
assert.doesNotMatch(app,/wa\.me\/918695008695/);
console.log("Enquiry SMTP backend contract passed.");
