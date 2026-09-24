import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import tls from 'node:tls';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

const PORT = Number(process.env.PORT || 3001);
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE = String(process.env.SMTP_SECURE ?? 'true').toLowerCase() !== 'false';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_APP_PASSWORD = String(process.env.SMTP_APP_PASSWORD || '').replace(/\s+/g, '');
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'connect@kvacs.in';
const FROM_EMAIL = process.env.FROM_EMAIL || `Karthick Vijayakumar & Associates <${SMTP_USER || 'connect@kvacs.in'}>`;

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 200_000) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>\"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}

function cleanHeader(value = '') {
  return String(value).replace(/[\r\n]/g, ' ').trim();
}

function cleanEmail(value = '') {
  return cleanHeader(value).replace(/[<>]/g, '');
}

function htmlToText(value = '') {
  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function parseFromAddress(value) {
  const match = String(value).match(/<([^<>\s]+)>/);
  return cleanEmail(match ? match[1] : value);
}

function smtpConnect() {
  return new Promise((resolve, reject) => {
    const socket = SMTP_SECURE
      ? tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST, rejectUnauthorized: true })
      : tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST, rejectUnauthorized: true });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error('SMTP connection timed out.'));
    }, 20_000);
    socket.once('secureConnect', () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.once('error', error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

function smtpResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const onData = chunk => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/);
      const complete = lines.slice(0, -1);
      buffer = lines.at(-1) || '';
      for (const line of complete) {
        if (/^\d{3} /.test(line)) {
          cleanup();
          resolve({ code: Number(line.slice(0, 3)), text: line.slice(4), raw: complete.join('\n') });
          return;
        }
      }
    };
    const onError = error => { cleanup(); reject(error); };
    const onClose = () => { cleanup(); reject(new Error('SMTP connection closed unexpectedly.')); };
    const cleanup = () => {
      socket.off('data', onData);
      socket.off('error', onError);
      socket.off('close', onClose);
    };
    socket.on('data', onData);
    socket.once('error', onError);
    socket.once('close', onClose);
  });
}

async function smtpCommand(socket, command, expectedCodes) {
  socket.write(`${command}\r\n`);
  const response = await smtpResponse(socket);
  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP error ${response.code}: ${response.text}`);
  }
  return response;
}

async function sendWithGmail(data) {
  if (!SMTP_USER || !SMTP_APP_PASSWORD || !CONTACT_EMAIL) {
    throw new Error('Email service is not configured. Add SMTP_USER, SMTP_APP_PASSWORD and CONTACT_EMAIL in backend/.env.');
  }

  const socket = await smtpConnect();
  try {
    let response = await smtpResponse(socket);
    if (![220].includes(response.code)) throw new Error(`SMTP greeting failed: ${response.code} ${response.text}`);

    await smtpCommand(socket, `EHLO kvacs.in`, [250]);
    await smtpCommand(socket, 'AUTH LOGIN', [334]);
    await smtpCommand(socket, Buffer.from(SMTP_USER, 'utf8').toString('base64'), [334]);
    await smtpCommand(socket, Buffer.from(SMTP_APP_PASSWORD, 'utf8').toString('base64'), [235]);

    const fromAddress = parseFromAddress(FROM_EMAIL);
    const replyTo = cleanEmail(data.email);
    const toAddress = cleanEmail(CONTACT_EMAIL);
    await smtpCommand(socket, `MAIL FROM:<${fromAddress}>`, [250]);
    await smtpCommand(socket, `RCPT TO:<${toAddress}>`, [250, 251]);
    await smtpCommand(socket, 'DATA', [354]);

    const subject = cleanHeader(`New KVA website enquiry — ${data.need || 'General enquiry'}`);
    const plain = [
      'New website enquiry',
      `Name: ${cleanHeader(data.name)}`,
      `Email: ${replyTo}`,
      `Phone: ${cleanHeader(data.phone)}`,
      `Requirement: ${cleanHeader(data.need)}`,
      `Message: ${cleanHeader(data.message || '')}`
    ].join('\n');
    const html = `<h2>New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(data.name)}</p><p><strong>Email:</strong> ${escapeHtml(data.email)}</p><p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p><p><strong>Requirement:</strong> ${escapeHtml(data.need)}</p><p><strong>Message:</strong><br>${escapeHtml(data.message || '').replace(/\n/g, '<br>')}</p>`;

    const message = [
      `From: ${FROM_EMAIL}`,
      `To: ${toAddress}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="KVA_BOUNDARY"',
      '',
      '--KVA_BOUNDARY',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      plain,
      '',
      '--KVA_BOUNDARY',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      html,
      '',
      '--KVA_BOUNDARY--'
    ].join('\r\n').replace(/^\./gm, '..');

    socket.write(`${message}\r\n.\r\n`);
    response = await smtpResponse(socket);
    if (response.code !== 250) throw new Error(`SMTP delivery failed: ${response.code} ${response.text}`);
    await smtpCommand(socket, 'QUIT', [221]);
    return true;
  } finally {
    socket.end();
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method === 'GET' && req.url === '/api/health') {
    return sendJson(res, 200, { ok: true, service: 'KVA backend', emailConfigured: Boolean(SMTP_USER && SMTP_APP_PASSWORD && CONTACT_EMAIL) });
  }
  if (req.method === 'POST' && req.url === '/api/contact') {
    try {
      const data = await readJson(req);
      if (data.website) return sendJson(res, 200, { ok: true, message: 'Thanks — your enquiry has been received.' });
      for (const field of ['name', 'email', 'phone', 'need']) {
        if (!String(data[field] || '').trim()) return sendJson(res, 400, { ok: false, message: `Please provide ${field}.` });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) {
        return sendJson(res, 400, { ok: false, message: 'Please provide a valid email address.' });
      }
      if (!/^[+()\-\s0-9]{7,20}$/.test(String(data.phone).trim())) {
        return sendJson(res, 400, { ok: false, message: 'Please provide a valid phone number.' });
      }
      await sendWithGmail(data);
      return sendJson(res, 200, { ok: true, message: 'Thanks — your enquiry has been sent to the KVA team.' });
    } catch (error) {
      return sendJson(res, 500, { ok: false, message: error.message || 'Unable to process the enquiry.' });
    }
  }
  return sendJson(res, 404, { ok: false, message: 'Not found' });
});

server.listen(PORT, () => console.log(`KVA backend listening on http://localhost:${PORT}`));
