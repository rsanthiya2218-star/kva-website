import fs from "node:fs";
const app=fs.readFileSync("./src/App.jsx","utf8");
const data=fs.readFileSync("./src/data.js","utf8");
for(const title of ["Company Registration","Private Limited Company Registration","Public Limited Company Registration","LLP Registration","Section 8 Company Registration"]) if(!data.includes(`title: "${title}"`)) throw new Error(`Missing Business Registration subtitle: ${title}`);
for(const token of ["BusinessRegistrationPage","business-tabs","Overview","Benefits","Requirement","Documents","Process","Fees","Timeline","Why Karthick Vijayakumar & Associates","FAQ","business-page-table","business-page-cta"]) if(!app.includes(token)) throw new Error(`Missing ${token}`);
if(!fs.existsSync("./public/team/team-2.png")) throw new Error("Second team member image missing");
console.log("Business Registration page contract passed.");
