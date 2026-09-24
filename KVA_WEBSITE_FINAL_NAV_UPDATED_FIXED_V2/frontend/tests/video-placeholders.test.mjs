import fs from "node:fs";

const app = fs.readFileSync('src/App.jsx','utf8');
const requiredHero = ['hero-slide-1.mp4','hero-slide-2.mp4','hero-slide-3.mp4','hero-slide-4.mp4'];
for (const file of requiredHero) {
  const path = `public/videos/${file}`;
  assertMedia(path, `missing hero video: ${file}`);
}
if ((app.match(/\/videos\/hero-slide-[1-4]\.mp4/g) || []).length !== 4) {
  throw new Error('hero must use one video per slide');
}

for (const name of ['approach-video.mp4','team-video.mp4','contact-video.mp4']) {
  if (new RegExp(name.replace('.', '\\.'), 'i').test(app)) throw new Error(`${name} must not be referenced`);
  if (fs.existsSync(`public/videos/${name}`)) throw new Error(`${name} must not remain in public videos`);
}

for (const file of [
  'public/videos/hero-slide-3.mp4',
  'public/videos/why-choose-us-video.mp4',
  'public/videos/business-registration/public-limited.mp4',
  'public/cs-logo.png',
  'public/images/services/taxation.jpeg'
]) assertMedia(file, `required media missing or empty: ${file}`);

function assertMedia(path, message) {
  if (!fs.existsSync(path)) throw new Error(message);
  if (fs.statSync(path).size < 1024) throw new Error(`media file is too small/empty: ${path}`);
}

console.log('Media asset contract passed.');
