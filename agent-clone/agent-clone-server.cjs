'use strict';
const http = require('node:http');
const { URL } = require('node:url');
const agents = {
  'xhs-operator': require('./agent-xhs-operator.cjs'),
  'content-strategist': require('./agent-content-strategist.cjs'),
  'wechat-operator': require('./agent-wechat-operator.cjs'),
  'xhs-analyzer': require('./agent-xhs-analyzer.cjs')
};

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });
  const url = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/api/agents') return send(res, 200, { agents: Object.keys(agents) });
  const match = url.pathname.match(/^\/api\/agents\/([^/]+)$/);
  if (!match) return send(res, 404, { error: 'not_found' });
  const agent = agents[match[1]];
  if (!agent) return send(res, 404, { error: 'unknown_agent', agents: Object.keys(agents) });
  let data = '';
  req.on('data', (chunk) => { data += chunk; });
  req.on('end', () => {
    let input = {};
    try { input = data ? JSON.parse(data) : {}; } catch { return send(res, 400, { error: 'invalid_json' }); }
    return send(res, 200, agent.run(input));
  });
});

const port = Number(process.env.AGENT_CLONE_PORT || 4180);
server.listen(port, '127.0.0.1', () => console.log(`Agent clone server: http://127.0.0.1:${port}`));
