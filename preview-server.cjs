const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'dist');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; if (data.length > 2_000_000) reject(new Error('request too large')); });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(new Error('invalid JSON')); } });
    req.on('error', reject);
  });
}
function json(res, status, body) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(body));
}
function endpointUrl(endpoint, suffix) {
  const base = String(endpoint || '').trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(base)) throw new Error('endpoint 必须是 http 或 https 地址');
  return base.endsWith(suffix) ? base : base + suffix;
}
async function proxy(req, res, kind) {
  try {
    const body = await readBody(req);
    if (!body.endpoint) return json(res, 400, {error:'缺少 endpoint'});
    const headers = {'Content-Type':'application/json'};
    if (body.accessToken) headers.Authorization = 'Bearer ' + body.accessToken;
    if (kind === 'ai') {
      const target = endpointUrl(body.endpoint, '/chat/completions');
      const upstream = await fetch(target, {method:'POST', headers:headers, signal:AbortSignal.timeout(15000), body:JSON.stringify({model:body.model || 'deepseek-flash', temperature:.35, messages:body.messages || []})});
      const text = await upstream.text();
      res.writeHead(upstream.status, {'Content-Type':upstream.headers.get('content-type') || 'application/json', 'Cache-Control':'no-store'});
      return res.end(text);
    }
    const action = body.action === 'sync' ? 'sync' : 'health';
    const target = endpointUrl(body.endpoint, '/' + action);
    if (body.accountId) headers['X-XHS-Account'] = body.accountId;
    const upstream = await fetch(target, {method:action === 'sync' ? 'POST' : 'GET', headers:headers, signal:AbortSignal.timeout(15000), body:action === 'sync' ? JSON.stringify({accountId:body.accountId}) : undefined});
    const text = await upstream.text();
    res.writeHead(upstream.status, {'Content-Type':upstream.headers.get('content-type') || 'application/json', 'Cache-Control':'no-store'});
    res.end(text);
  } catch (error) {
    json(res, 502, {error:error.message || 'proxy request failed'});
  }
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'POST' && url.pathname === '/api/ai') return proxy(req, res, 'ai');
  if (req.method === 'POST' && url.pathname === '/api/account') return proxy(req, res, 'account');
  const file = path.resolve(root, url.pathname === '/' ? 'index.html' : '.' + url.pathname);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return json(res, 404, {error:'Not found'});
  res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
});
server.listen(4173, '127.0.0.1', () => console.log('AI Growth OS preview: http://127.0.0.1:4173'));

