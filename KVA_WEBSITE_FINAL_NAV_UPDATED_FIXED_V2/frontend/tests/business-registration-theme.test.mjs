import fs from "node:fs";
const css=fs.readFileSync("./src/styles.css","utf8");
const app=fs.readFileSync("./src/App.jsx","utf8");
for(const token of [".business-registration-page",".business-page-table-wrap",".business-page-cta",".business-page-inline-media",".business-tabs",".business-info-card"]) if(!css.includes(token)) throw new Error(`Missing CSS: ${token}`);
for(const token of ['className="business-tabs"','className="business-info-cards"','className="business-page-cta"']) if(!app.includes(token)) throw new Error(`Missing UI: ${token}`);
console.log("Business Registration theme contract passed.");
