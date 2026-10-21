const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const storeApi = require('./server-store.cjs');
const {SYSTEM_PROMPT: generationSystemPrompt, buildUserPrompt} = require('./prompts/xiaohongshu-generation.cjs');

const envFile = path.join(__dirname, '.env');
if (typeof process.loadEnvFile === 'function' && fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}
const aiServerConfig = {
  apiKey: String(process.env.DEEPSEEK_API_KEY || '').trim(),
  baseUrl: String(process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').trim(),
  model: String(process.env.DEEPSEEK_MODEL || 'deepseek-chat').trim(),
  timeoutMs: Number(process.env.AI_REQUEST_TIMEOUT_MS || 15000),
  maxInputChars: Number(process.env.AI_MAX_INPUT_CHARS || 12000),
  maxOutputTokens: Number(process.env.AI_MAX_OUTPUT_TOKENS || 800)
};
function providerConfigs() {
  const configs = {
    deepseek: {id:'deepseek', name:'DeepSeek', apiKey:String(process.env.DEEPSEEK_API_KEY||'').trim(), baseUrl:String(process.env.DEEPSEEK_BASE_URL||'https://api.deepseek.com').trim(), model:String(process.env.DEEPSEEK_MODEL||'deepseek-chat').trim()},
    openai: {id:'openai', name:'OpenAI', apiKey:String(process.env.OPENAI_API_KEY||'').trim(), baseUrl:String(process.env.OPENAI_BASE_URL||'https://api.openai.com/v1').trim(), model:String(process.env.OPENAI_MODEL||'gpt-4o-mini').trim()},
    qwen: {id:'qwen', name:'通义千问', apiKey:String(process.env.QWEN_API_KEY||'').trim(), baseUrl:String(process.env.QWEN_BASE_URL||'https://dashscope.aliyuncs.com/compatible-mode/v1').trim(), model:String(process.env.QWEN_MODEL||'qwen-plus').trim()},
    custom: {id:'custom', name:'自定义 OpenAI 兼容', apiKey:String(process.env.CUSTOM_AI_API_KEY||'').trim(), baseUrl:String(process.env.CUSTOM_AI_BASE_URL||'').trim(), model:String(process.env.CUSTOM_AI_MODEL||'').trim()}
  };
  const allowed=String(process.env.AI_PROVIDERS||'deepseek,openai,qwen,custom').split(',').map(item=>item.trim()).filter(Boolean);
  return allowed.map(id=>configs[id]).filter(item=>item&&item.baseUrl);
}
function getProviderConfig(provider, userId) { const list=providerConfigs(); const selected=provider||storeApi.aiProviderFor(userId); return list.find(item=>item.id===selected)||list[0]||Object.assign({id:'deepseek',name:'DeepSeek'},aiServerConfig); }
function providerMetadata(userId) { const active=storeApi.aiProviderFor(userId); return {active,providers:providerConfigs().map(item=>({id:item.id,name:item.name,model:item.model,baseUrl:item.baseUrl,configured:Boolean(item.apiKey),selected:item.id===active}))}; }

const allowedPlatforms = new Set(['xiaohongshu']);
const allowedAdvancedStyles = new Set(['storytelling', 'data_driven', 'contrarian', 'premium']);
const aiRateLimit = Number(process.env.AI_RATE_LIMIT || 30);
const aiRateWindowMs = Number(process.env.AI_RATE_WINDOW_MS || 60 * 60 * 1000);
const aiInputCostPerMillion = Number(process.env.AI_INPUT_COST_PER_MILLION || 0.27);
const aiOutputCostPerMillion = Number(process.env.AI_OUTPUT_COST_PER_MILLION || 1.10);
const authDevMode = String(process.env.AUTH_DEV_MODE || (process.env.NODE_ENV === 'production' ? 'false' : 'true')).toLowerCase() === 'true';
const activeGenerationUsers = new Set();

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
function apiError(res, status, code, message) {
  return json(res, status, {ok:false, error:{code:code, message:message}});
}
function apiSuccess(res, data) {
  return json(res, 200, {ok:true, data:data});
}
function healthData() {
  const store = storeApi.readStore();
  return {
    service: 'ai-growth-os-api',
    status: 'ok',
    version: '0.1.0',
    persistence: 'local-json',
    database: process.env.DATABASE_URL ? 'configured-not-connected' : 'not-configured',
    aiProviders: providerConfigs().map(item => ({id:item.id, configured:Boolean(item.apiKey)})),
    counts: {users:store.users.length, accounts:store.accounts.length, generationRecords:store.generationRecords.length},
    checkedAt: new Date().toISOString()
  };
}
function parseCookies(req) {
  return String(req.headers.cookie || '').split(';').reduce((all, part) => { const index = part.indexOf('='); if (index > 0) all[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim()); return all; }, {});
}
function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', 'xhs_session=' + encodeURIComponent(token) + '; HttpOnly; SameSite=Lax; Path=/; Max-Age=1209600' + secure);
}
function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', 'xhs_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' + secure);
}
function csrfGuard(req, res) {
  if (!['POST','PUT','PATCH','DELETE'].includes(req.method)) return true;
  const origin = String(req.headers.origin || '').trim();
  if (!origin) return true;
  const host = String(req.headers.host || '').trim();
  if (origin === 'http://' + host || origin === 'https://' + host) return true;
  apiError(res, 403, 'CSRF_ORIGIN_INVALID', '请求来源未通过安全校验');
  return false;
}
function session(req) { const current = storeApi.sessionUser(parseCookies(req).xhs_session); if (current) current.dailyGrant = storeApi.grantDailyCredits(current.userId); return current; }
function requireSession(req, res) { const current = session(req); if (!current) { apiError(res, 401, 'AUTH_REQUIRED', '请先登录'); return null; } return current; }
function requestKey(req, current) { return current ? current.userId : (req.socket.remoteAddress || 'unknown'); }
function estimateTokens(value) { return Math.max(1, Math.ceil(String(value || '').length / 4)); }
function normalizeModelJson(text) {
  const raw = String(text || '').trim();
  if (!raw || raw.length > 30000) return {error: 'AI_RESPONSE_INVALID', message: 'AI 返回内容为空或超出长度限制'};
  let parsed;
  try { parsed = JSON.parse(raw); } catch { return {error: 'AI_RESPONSE_INVALID', message: 'AI 返回的不是合法 JSON'}; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {error: 'AI_SCHEMA_INVALID', message: 'AI 返回结构必须是 JSON 对象'};
  if (!Array.isArray(parsed.titles) || parsed.titles.length !== 10) return {error: 'AI_SCHEMA_INVALID', message: 'AI 返回的 titles 必须恰好包含 10 条'};
  const seen = new Set();
  const titles = parsed.titles.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return {error: 'AI_SCHEMA_INVALID', message: `第 ${index + 1} 条标题必须是对象`};
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const style = typeof item.style === 'string' ? item.style.trim() : '';
    if (!title || !style) return {error: 'AI_SCHEMA_INVALID', message: `第 ${index + 1} 条标题缺少 title 或 style`};
    if (title.length < 4 || title.length > 80) return {error: 'AI_SCHEMA_INVALID', message: `第 ${index + 1} 条标题长度必须为 4 至 80 个字符`};
    if (style.length > 24) return {error: 'AI_SCHEMA_INVALID', message: `第 ${index + 1} 条标题风格过长`};
    const key = title.replace(/[\\s，。！？、,.!?；;:：“”‘’「」【】（）()《》<>—_\-]/g, '').toLowerCase();
    if (seen.has(key)) return {error: 'AI_SCHEMA_INVALID', message: 'AI 返回了重复标题'};
    seen.add(key);
    return {title, style};
  });
  const invalid = titles.find(item => item && item.error);
  if (invalid) return invalid;
  const stringField = (key, max) => typeof parsed[key] === 'string' ? parsed[key].trim().slice(0, max) : '';
  const listField = (key, itemMax, listMax) => Array.isArray(parsed[key]) ? parsed[key].filter(item => typeof item === 'string').map(item => item.trim().slice(0, itemMax)).filter(Boolean).slice(0, listMax) : [];
  return {value: {
    title: titles[0].title,
    titles,
    summary: stringField('summary', 600),
    positioning: stringField('positioning', 1000),
    angle: stringField('angle', 1000),
    audience: stringField('audience', 1000),
    hook: stringField('hook', 2000),
    structure: stringField('structure', 2000),
    body: stringField('body', 12000),
    visualPlan: listField('visualPlan', 300, 8),
    hashtags: listField('hashtags', 80, 12),
    cta: stringField('cta', 1000),
    publishAdvice: stringField('publishAdvice', 1200)
  }};
}
async function authRegister(req, res) {
  let body; try { body = await readBody(req); } catch (error) { return apiError(res, 400, 'INVALID_JSON', '请求体必须是有效 JSON'); }
  const email = String(body.email || '').trim().toLowerCase(); const password = String(body.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return apiError(res, 400, 'AUTH_EMAIL_INVALID', '请输入有效邮箱');
  if (password.length < 8) return apiError(res, 400, 'AUTH_PASSWORD_WEAK', '密码至少需要 8 位字符');
  const result = storeApi.createUser(email, password, body.name);
  if (result.error) return apiError(res, 409, result.error, '该邮箱已经注册');
  const verificationUrl = authDevMode ? '/api/auth/verify-email?token=' + encodeURIComponent(result.verificationToken) : null;
  return apiSuccess(res, {user: result.user, source: 'server', verificationRequired:true, verificationUrl, message:'注册成功，请先验证邮箱后登录'});
}
async function authLogin(req, res) {
  let body; try { body = await readBody(req); } catch (error) { return apiError(res, 400, 'INVALID_JSON', '请求体必须是有效 JSON'); }
  const result = storeApi.authenticate(body.email, body.password);
  if (result.error === 'AUTH_EMAIL_UNVERIFIED') return apiError(res, 403, result.error, '请先完成邮箱验证');
  if (result.error) return apiError(res, 401, result.error, '邮箱或密码不正确');
  const dailyGrant = storeApi.grantDailyCredits(result.user.id);
  setSessionCookie(res, result.token); return apiSuccess(res, {user: result.user, dailyGrant, source: 'server'});
}
function authVerifyEmail(req, res) {
  const token = new URL(req.url, 'http://127.0.0.1').searchParams.get('token');
  const result = storeApi.verifyEmailToken(token);
  if (result.error === 'AUTH_VERIFICATION_EXPIRED') return apiError(res, 410, result.error, '邮箱验证链接已过期，请重新注册或申请新的验证邮件');
  if (result.error) return apiError(res, 400, result.error, '邮箱验证链接无效');
  return apiSuccess(res, {user:result.user, verified:true, source:'server', message:'邮箱验证成功，请返回登录'});
}
function authSession(req, res) { const current = session(req); if (!current) return apiError(res, 401, 'AUTH_REQUIRED', '当前没有有效登录会话'); return apiSuccess(res, {user: current.user, dailyGrant: current.dailyGrant, source: 'server'}); }
function authLogout(req, res) { storeApi.destroySession(parseCookies(req).xhs_session); clearSessionCookie(res); return apiSuccess(res, {source: 'server'}); }
function getUserData(req, res) { const current = requireSession(req, res); if (!current) return; return apiSuccess(res, storeApi.userData(current.userId)); }
function generationHistory(req, res) { const current = requireSession(req, res); if (!current) return; const params = new URL(req.url, 'http://127.0.0.1').searchParams; return apiSuccess(res, storeApi.listGenerationRecords(current.userId, params.get('page'), params.get('pageSize'), params.get('q'))); }
function generationHistoryDetail(req, res, pathname) { const current = requireSession(req, res); if (!current) return; let recordId; try { recordId = decodeURIComponent(pathname.slice('/api/history/'.length)); } catch { return apiError(res, 400, 'HISTORY_ID_INVALID', '历史记录 ID 无效'); } const record = storeApi.generationRecord(current.userId, recordId); if (!record) return apiError(res, 404, 'HISTORY_NOT_FOUND', '历史记录不存在'); return apiSuccess(res, record); }
async function putUserData(req, res) { const current = requireSession(req, res); if (!current) return; let body; try { body = await readBody(req); } catch (error) { return apiError(res, 400, 'INVALID_JSON', '请求体必须是有效 JSON'); } return apiSuccess(res, storeApi.replaceUserData(current.userId, body || {})); }
function aiUsage(req, res) { const current = requireSession(req, res); if (!current) return; return apiSuccess(res, storeApi.aiUsage(current.userId)); }
function aiProviders(req,res) { const current=requireSession(req,res); if(!current)return; return apiSuccess(res,Object.assign({source:'server'},providerMetadata(current.userId))); }
async function aiProviderSelect(req,res) { const current=requireSession(req,res); if(!current)return;let body;try{body=await readBody(req)}catch{return apiError(res,400,'INVALID_JSON','请求体必须是有效 JSON')}const meta=providerMetadata(current.userId);if(!meta.providers.some(item=>item.id===body.provider))return apiError(res,400,'AI_PROVIDER_UNSUPPORTED','当前供应商未启用');storeApi.setAIProvider(current.userId,body.provider);return apiSuccess(res,Object.assign({source:'server'},providerMetadata(current.userId))); }
async function aiProviderTest(req,res) { const current=requireSession(req,res); if(!current)return;let body;try{body=await readBody(req)}catch{return apiError(res,400,'INVALID_JSON','请求体必须是有效 JSON')}const config=getProviderConfig(body.provider,current.userId);if(!config.apiKey)return apiError(res,503,'AI_CONFIG_MISSING','服务端未配置当前 AI 供应商 API Key');let target;try{target=endpointUrl(config.baseUrl,'/chat/completions')}catch{return apiError(res,500,'AI_CONFIG_INVALID','当前 AI 地址配置无效')}try{const upstream=await fetch(target,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.apiKey},signal:AbortSignal.timeout(aiServerConfig.timeoutMs),body:JSON.stringify({model:config.model,max_tokens:8,messages:[{role:'user',content:'只回复 OK'}]})});if(!upstream.ok)return apiError(res,502,'AI_PROVIDER_ERROR','供应商连接失败');return apiSuccess(res,{provider:config.id,model:config.model,status:'connected',source:'server'})}catch(error){return apiError(res,error&&error.name==='TimeoutError'?504:502,error&&error.name==='TimeoutError'?'AI_TIMEOUT':'AI_NETWORK_ERROR','供应商连接失败')}}
function analyticsData(req, res) { const current = requireSession(req, res); if (!current) return; const range = new URL(req.url, 'http://127.0.0.1').searchParams.get('range') || '7d'; return apiSuccess(res, storeApi.metricsForUser(current.userId, range)); }
function accountSync(req, res) { const current = requireSession(req, res); if (!current) return; const result = storeApi.syncAccountData(current.userId); if (result.error) return apiError(res, 409, result.error, '账号尚未完成授权'); return apiSuccess(res, result); }
async function publishContent(req, res) { const current = requireSession(req, res); if (!current) return; let body; try { body = await readBody(req); } catch { return apiError(res, 400, 'INVALID_JSON', '请求体必须是有效 JSON'); } const result = storeApi.publishJob(current.userId, body.contentId, body.plannedAt, body.mode); if (result.error === 'ACCOUNT_NOT_CONNECTED') return apiError(res, 409, result.error, '请先完成账号授权'); if (result.error) return apiError(res, 404, result.error, '内容不存在'); return apiSuccess(res, Object.assign({source:'server', demo:true}, result)); }
async function publishRetry(req, res) { const current = requireSession(req, res); if (!current) return; let body; try { body = await readBody(req); } catch { return apiError(res, 400, 'INVALID_JSON', '请求体必须是有效 JSON'); } const result = storeApi.retryPublishJob(current.userId, body.jobId); if (result.error) return apiError(res, 404, result.error, '发布任务不存在'); return apiSuccess(res, Object.assign({source:'server', demo:true}, result)); }
async function publishFail(req, res) { const current = requireSession(req, res); if (!current) return; let body; try { body = await readBody(req); } catch { return apiError(res, 400, 'INVALID_JSON', '请求体必须是有效 JSON'); } const result = storeApi.failPublishJob(current.userId, body.jobId, body.reason); if (result.error) return apiError(res, 404, result.error, '发布任务不存在'); return apiSuccess(res, Object.assign({source:'server', demo:true}, result)); }
function notifications(req, res) { const current = requireSession(req, res); if (!current) return; return apiSuccess(res, storeApi.notificationsForUser(current.userId)); }
function accountsData(req, res) { const current=requireSession(req,res); if(!current)return; return apiSuccess(res,{source:'server',items:storeApi.listAccounts(current.userId)}); }
async function accountsCreate(req,res) { const current=requireSession(req,res); if(!current)return; let body;try{body=await readBody(req)}catch{return apiError(res,400,'INVALID_JSON','请求体必须是有效 JSON')}return apiSuccess(res,{source:'server',account:storeApi.createAccount(current.userId,body||{})}); }
function teamsData(req,res) { const current=requireSession(req,res); if(!current)return; return apiSuccess(res,storeApi.teamData(current.userId)); }
async function teamInvite(req,res) { const current=requireSession(req,res); if(!current)return; let body;try{body=await readBody(req)}catch{return apiError(res,400,'INVALID_JSON','请求体必须是有效 JSON')}const result=storeApi.addTeamMember(current.userId,body.email,body.role);if(result.error)return apiError(res,404,result.error,'团队成员不存在或已加入');return apiSuccess(res,{source:'server',member:result}); }
async function teamRole(req,res) { const current=requireSession(req,res); if(!current)return; let body;try{body=await readBody(req)}catch{return apiError(res,400,'INVALID_JSON','请求体必须是有效 JSON')}const result=storeApi.updateTeamMember(current.userId,body.memberId,body.role);if(result.error)return apiError(res,409,result.error,'成员角色无法修改');return apiSuccess(res,{source:'server',member:result}); }
function billingData(req,res) { const current=requireSession(req,res); if(!current)return; return apiSuccess(res,storeApi.billingData(current.userId)); }
async function billingCheckout(req,res) { const current=requireSession(req,res); if(!current)return;let body;try{body=await readBody(req)}catch{return apiError(res,400,'INVALID_JSON','请求体必须是有效 JSON')}const result=storeApi.createPaymentOrder(current.userId,body.planId);if(result.error)return apiError(res,400,result.error,'当前套餐不可购买');return apiSuccess(res,{source:'server',demo:true,...result}); }
function usageData(req,res) { const current=requireSession(req,res); if(!current)return; return apiSuccess(res,storeApi.usageData(current.userId)); }
function auditData(req,res) { const current=requireSession(req,res); if(!current)return; return apiSuccess(res,storeApi.auditData(current.userId)); }
function exportData(req,res) { const current=requireSession(req,res); if(!current)return;return apiSuccess(res,storeApi.exportData(current.userId)); }
async function privacyDelete(req,res) { const current=requireSession(req,res); if(!current)return;const result=storeApi.requestDeletion(current.userId);return apiSuccess(res,{source:'server',request:result,message:'已创建删除请求，正式环境需要二次确认后执行'}); }
function oauthStart(req, res) { const current = requireSession(req, res); if (!current) return; const state = storeApi.createOAuthState(current.userId); return apiSuccess(res, {provider: 'xiaohongshu', state, authorizationUrl: '/api/account/oauth/callback?state=' + encodeURIComponent(state) + '&code=demo_authorization'}); }
function oauthCallback(req, res) { const state = String(new URL(req.url, 'http://127.0.0.1').searchParams.get('state') || ''); const code = String(new URL(req.url, 'http://127.0.0.1').searchParams.get('code') || ''); const value = storeApi.consumeOAuthState(state); if (!value || !code) return apiError(res, 400, 'ACCOUNT_OAUTH_INVALID', '授权状态无效或已过期'); const store = storeApi.readStore(); const account = storeApi.accountFor(store, value.userId); account.status = 'connected'; account.accountId = 'XHS_DEMO_' + crypto.randomBytes(3).toString('hex').toUpperCase(); account.permissions = ['read_metrics', 'read_contents', 'read_comments']; account.lastVerifiedAt = new Date().toISOString(); storeApi.writeStore(store); return apiSuccess(res, {account: storeApi.safeAccount(account), source: 'server', demo: true}); }
function endpointUrl(endpoint, suffix) {
  const base = String(endpoint || '').trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(base)) throw new Error('endpoint 必须是 http 或 https 地址');
  return base.endsWith(suffix) ? base : base + suffix;
}
async function generateContent(req, res) {
  const current = session(req);
  if (!current) return apiError(res, 401, 'AUTH_REQUIRED', '请先登录后使用 AI 生成');
  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    return apiError(res, 400, 'INVALID_JSON', error.message === 'request too large' ? '请求内容过大' : '请求体必须是有效 JSON');
  }
  const rawRequestId = typeof body.requestId === 'string' ? body.requestId.trim() : '';
  if (rawRequestId && !/^[A-Za-z0-9._:-]{1,128}$/.test(rawRequestId)) return apiError(res, 400, 'REQUEST_ID_INVALID', 'requestId 格式无效');
  const requestId = rawRequestId || crypto.randomUUID();
  const previous = storeApi.generationByRequestId(current.userId, requestId);
  if (previous) {
    return apiSuccess(res, {platform:previous.platform, model:previous.model, result:previous.resultJson, content:JSON.stringify(previous.resultJson || {}), requestId, generationId:previous.id, usage:{charged:0, replayed:true}, source:'server'});
  }
  const lockKey = current.userId;
  if (activeGenerationUsers.has(lockKey)) return apiError(res, 409, 'GENERATION_IN_PROGRESS', '当前账号已有生成请求进行中，请稍后重试');
  activeGenerationUsers.add(lockKey);
  try {
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const platform = typeof body.platform === 'string' ? body.platform.trim().toLowerCase() : '';
    const contentType = typeof body.contentType === 'string' && body.contentType.trim() ? body.contentType.trim().slice(0, 80) : 'title';
    const advancedStyle = typeof body.advancedStyle === 'string' ? body.advancedStyle.trim().toLowerCase() : '';
    if (!content) return apiError(res, 400, 'CONTENT_REQUIRED', 'content 不能为空');
    if (content.length > aiServerConfig.maxInputChars) return apiError(res, 400, 'CONTENT_TOO_LONG', 'content 超出长度限制');
    if (!platform) return apiError(res, 400, 'PLATFORM_REQUIRED', 'platform 不能为空');
    if (!allowedPlatforms.has(platform)) return apiError(res, 400, 'PLATFORM_UNSUPPORTED', '当前仅支持 platform=xiaohongshu');
    if (advancedStyle && !allowedAdvancedStyles.has(advancedStyle)) return apiError(res, 400, 'AI_STYLE_UNSUPPORTED', '当前高级风格不可用');
    const membership = storeApi.membershipFor(current.userId);
    if (advancedStyle && membership.level !== 'PRO') return apiError(res, 403, 'MEMBERSHIP_REQUIRED', '该高级风格仅限 PRO 会员');
    const logGeneration = (meta) => storeApi.logAICall(current.userId, Object.assign({kind:'generate', requestId, input:content, platform, contentType, advancedStyle, membership:membership.level}, meta));
    const providerConfig = getProviderConfig(body.provider, current.userId);
    if (!providerConfig.apiKey) { logGeneration({model:providerConfig.model, status:'config_missing'}); return apiError(res, 503, 'AI_CONFIG_MISSING', '服务端未配置当前 AI 供应商 API Key'); }
    const usageBefore = storeApi.usageData(current.userId);
    if (Number(usageBefore.credits || 0) < 1) { logGeneration({model:providerConfig.model, status:'insufficient_credits'}); return apiError(res, 402, 'INSUFFICIENT_CREDITS', '积分余额不足，请升级套餐后再试'); }
    const quota = storeApi.allowAI(current.userId, requestKey(req, current), aiRateLimit, aiRateWindowMs);
    if (!quota.allowed) { logGeneration({model:providerConfig.model, status:'rate_limited'}); res.setHeader('Retry-After', String(quota.retryAfter || 60)); return apiError(res, 429, 'AI_RATE_LIMITED', 'AI 调用次数已达到当前窗口上限'); }
    let target;
    const startedAt = Date.now();
    try {
      target = endpointUrl(providerConfig.baseUrl, '/chat/completions');
    } catch (error) {
      logGeneration({model:providerConfig.model, status:'config_invalid', latencyMs:Date.now()-startedAt});
      return apiError(res, 500, 'AI_CONFIG_INVALID', '服务端 AI 地址配置无效');
    }
    const messages = [
      {role:'system', content:generationSystemPrompt},
      {role:'user', content:buildUserPrompt({content, platform, contentType:body.contentType, advancedStyle, count:10})}
    ];
    try {
      const upstream = await fetch(target, {
        method:'POST',
        headers:{'Content-Type':'application/json', Authorization:'Bearer ' + providerConfig.apiKey},
        signal:AbortSignal.timeout(aiServerConfig.timeoutMs),
        body:JSON.stringify({model:providerConfig.model, temperature:.4, max_tokens:aiServerConfig.maxOutputTokens, response_format:{type:'json_object'}, messages:messages})
      });
      const text = await upstream.text();
      let payload;
      try { payload = text ? JSON.parse(text) : {}; } catch (error) { payload = {}; }
      if (!upstream.ok) { logGeneration({model:providerConfig.model, status:'provider_error', latencyMs:Date.now()-startedAt, inputTokens:estimateTokens(content), outputTokens:0}); return apiError(res, 502, 'AI_PROVIDER_ERROR', 'AI 服务商请求失败'); }
      const choice = payload.choices && payload.choices[0];
      if (choice && choice.finish_reason === 'length') { logGeneration({model:providerConfig.model, status:'ai_response_truncated', latencyMs:Date.now()-startedAt, inputTokens:estimateTokens(content), outputTokens:estimateTokens(choice.message && choice.message.content)}); return apiError(res, 502, 'AI_RESPONSE_TRUNCATED', 'AI 输出被截断，请将 AI_MAX_OUTPUT_TOKENS 调高后重试'); }
      const generated = choice && choice.message && choice.message.content;
      if (typeof generated !== 'string' || !generated.trim()) { logGeneration({model:providerConfig.model, status:'invalid_response', latencyMs:Date.now()-startedAt, inputTokens:estimateTokens(content), outputTokens:0}); return apiError(res, 502, 'AI_RESPONSE_INVALID', 'AI 服务商返回内容无效'); }
      const normalized = normalizeModelJson(generated);
      const outputTokens = estimateTokens(generated);
      if (normalized.error) { logGeneration({model:providerConfig.model, status:normalized.error.toLowerCase(), latencyMs:Date.now()-startedAt, inputTokens:estimateTokens(content), outputTokens}); return apiError(res, 502, normalized.error, normalized.message); }
      const result = normalized.value;
      const latencyMs = Date.now() - startedAt;
      logGeneration({model:providerConfig.model, status:'success', latencyMs, inputTokens:estimateTokens(content), outputTokens, estimatedCost:(estimateTokens(content)/1000000)*aiInputCostPerMillion+(outputTokens/1000000)*aiOutputCostPerMillion});
      const usage = storeApi.recordUsage(current.userId, 'generate', 1, {model:providerConfig.model, platform, requestId});
      const generation = storeApi.createGenerationRecord(current.userId, {requestId, inputText:content, platform, contentType, provider:providerConfig.id, model:providerConfig.model, resultJson:result, creditsCharged:usage.units, createdAt:new Date(startedAt).toISOString(), completedAt:new Date().toISOString(), latencyMs});
      if (generation.error) return apiError(res, 500, 'GENERATION_RECORD_FAILED', '生成结果保存失败，请稍后重试');
      return apiSuccess(res, {platform:platform, model:providerConfig.model, result, content:JSON.stringify(result), requestId, generationId:generation.id, usage:{credits:Math.max(0, Number(usageBefore.credits || 0) - usage.units), charged:usage.units}, source:'server'});
    } catch (error) {
      const code = error && (error.name === 'TimeoutError' || error.name === 'AbortError') ? 'AI_TIMEOUT' : 'AI_NETWORK_ERROR';
      logGeneration({model:providerConfig.model, status:code, latencyMs:Date.now()-startedAt, inputTokens:estimateTokens(content), outputTokens:0});
      if (code === 'AI_TIMEOUT') return apiError(res, 504, code, 'AI 服务请求超时');
      return apiError(res, 502, code, '无法连接 AI 服务商');
    }
  } finally {
    activeGenerationUsers.delete(lockKey);
  }
}
async function proxy(req, res, kind) {
  const current = session(req);
  if (kind === 'ai' && !current) return apiError(res, 401, 'AUTH_REQUIRED', '请先登录后使用 AI');
  if (kind === 'account' && !current) return apiError(res, 401, 'AUTH_REQUIRED', '请先登录后连接账号');
  try {
    const body = await readBody(req);
    const headers = {'Content-Type':'application/json'};
    if (kind === 'ai') {
      const aiServerConfig = getProviderConfig(body.provider, current && current.userId);
      if (!aiServerConfig.apiKey) return json(res, 503, {ok:false, error:{code:'AI_CONFIG_MISSING', message:'服务端未配置当前 AI 供应商 API Key'}});
      const quota = storeApi.allowAI(current && current.userId, requestKey(req, current), aiRateLimit, aiRateWindowMs);
      if (!quota.allowed) { res.setHeader('Retry-After', String(quota.retryAfter || 60)); return json(res, 429, {ok:false, error:{code:'AI_RATE_LIMITED', message:'AI 调用次数已达到当前窗口上限'}}); }
      const target = endpointUrl(aiServerConfig.baseUrl, '/chat/completions');
      headers.Authorization = 'Bearer ' + aiServerConfig.apiKey;
      const startedAt = Date.now(); const inputTokens = estimateTokens(JSON.stringify(body.messages || []));
      const upstream = await fetch(target, {method:'POST', headers:headers, signal:AbortSignal.timeout(aiServerConfig.timeoutMs), body:JSON.stringify({model:aiServerConfig.model, temperature:.35, max_tokens:aiServerConfig.maxOutputTokens, messages:body.messages || []})});
      const text = await upstream.text();
      let parsed; try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = {}; }
      const outputText = parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content || '';
      const outputTokens = estimateTokens(outputText);
      storeApi.logAICall(current && current.userId, {kind:'chat', model:aiServerConfig.model, status:upstream.ok?'success':'provider_error', latencyMs:Date.now()-startedAt, inputTokens, outputTokens, estimatedCost:(inputTokens/1000000)*aiInputCostPerMillion+(outputTokens/1000000)*aiOutputCostPerMillion});
      res.writeHead(upstream.status, {'Content-Type':upstream.headers.get('content-type') || 'application/json', 'Cache-Control':'no-store'});
      return res.end(text);
    }
    if (!body.endpoint) return json(res, 400, {error:'缺少 endpoint'});
    if (body.accessToken) headers.Authorization = 'Bearer ' + body.accessToken;
    const action = body.action === 'sync' ? 'sync' : 'health';
    const target = endpointUrl(body.endpoint, '/' + action);
    if (body.accountId) headers['X-XHS-Account'] = body.accountId;
    const upstream = await fetch(target, {method:action === 'sync' ? 'POST' : 'GET', headers:headers, signal:AbortSignal.timeout(15000), body:action === 'sync' ? JSON.stringify({accountId:body.accountId}) : undefined});
    const text = await upstream.text();
    res.writeHead(upstream.status, {'Content-Type':upstream.headers.get('content-type') || 'application/json', 'Cache-Control':'no-store'});
    res.end(text);
  } catch (error) {
    return apiError(res, 502, kind === 'account' ? 'ACCOUNT_PROVIDER_ERROR' : 'AI_NETWORK_ERROR', kind === 'account' ? '账号服务暂时不可用' : 'AI 服务暂时不可用');
  }
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const incomingRequestId = String(req.headers['x-request-id'] || '').trim();
  const requestId = /^[A-Za-z0-9._:-]{1,128}$/.test(incomingRequestId) ? incomingRequestId : crypto.randomUUID();
  res.setHeader('X-Request-Id', requestId);
  if (!csrfGuard(req, res)) return;
  if (req.method === 'GET' && url.pathname === '/api/health') return apiSuccess(res, healthData());
  if (req.method === 'POST' && url.pathname === '/api/auth/register') return authRegister(req, res);
  if (req.method === 'POST' && url.pathname === '/api/auth/login') return authLogin(req, res);
  if (req.method === 'GET' && url.pathname === '/api/auth/session') return authSession(req, res);
  if (req.method === 'POST' && url.pathname === '/api/auth/logout') return authLogout(req, res);
  if (req.method === 'GET' && url.pathname === '/api/auth/verify-email') return authVerifyEmail(req, res);
  if (req.method === 'GET' && url.pathname === '/api/data') return getUserData(req, res);
  if (req.method === 'GET' && url.pathname === '/api/history') return generationHistory(req, res);
  if (req.method === 'GET' && url.pathname.startsWith('/api/history/')) return generationHistoryDetail(req, res, url.pathname);
  if (req.method === 'PUT' && url.pathname === '/api/data') return putUserData(req, res);
  if (req.method === 'GET' && url.pathname === '/api/analytics') return analyticsData(req, res);
  if (req.method === 'POST' && url.pathname === '/api/account/sync') return accountSync(req, res);
  if (req.method === 'GET' && url.pathname === '/api/notifications') return notifications(req, res);
  if (req.method === 'GET' && url.pathname === '/api/accounts') return accountsData(req, res);
  if (req.method === 'POST' && url.pathname === '/api/accounts') return accountsCreate(req, res);
  if (req.method === 'GET' && url.pathname === '/api/team') return teamsData(req, res);
  if (req.method === 'POST' && url.pathname === '/api/team/invite') return teamInvite(req, res);
  if (req.method === 'POST' && url.pathname === '/api/team/role') return teamRole(req, res);
  if (req.method === 'GET' && url.pathname === '/api/billing') return billingData(req, res);
  if (req.method === 'POST' && url.pathname === '/api/billing/checkout') return billingCheckout(req, res);
  if (req.method === 'GET' && url.pathname === '/api/usage') return usageData(req, res);
  if (req.method === 'GET' && url.pathname === '/api/audit') return auditData(req, res);
  if (req.method === 'GET' && url.pathname === '/api/privacy/export') return exportData(req, res);
  if (req.method === 'POST' && url.pathname === '/api/privacy/delete') return privacyDelete(req, res);
  if (req.method === 'POST' && url.pathname === '/api/content/publish') return publishContent(req, res);
  if (req.method === 'POST' && url.pathname === '/api/content/publish/retry') return publishRetry(req, res);
  if (req.method === 'POST' && url.pathname === '/api/content/publish/fail') return publishFail(req, res);
  if (req.method === 'GET' && url.pathname === '/api/ai/usage') return aiUsage(req, res);
  if (req.method === 'GET' && url.pathname === '/api/ai/providers') return aiProviders(req, res);
  if (req.method === 'POST' && url.pathname === '/api/ai/provider') return aiProviderSelect(req, res);
  if (req.method === 'POST' && url.pathname === '/api/ai/provider/test') return aiProviderTest(req, res);
  if (req.method === 'GET' && url.pathname === '/api/account/oauth/start') return oauthStart(req, res);
  if (req.method === 'GET' && url.pathname === '/api/account/oauth/callback') return oauthCallback(req, res);
  if (req.method === 'POST' && url.pathname === '/api/ai/generate') return generateContent(req, res);
  if (req.method === 'POST' && url.pathname === '/api/ai') return proxy(req, res, 'ai');
  if (req.method === 'POST' && url.pathname === '/api/account') return proxy(req, res, 'account');
  const file = path.resolve(root, url.pathname === '/' ? 'index.html' : '.' + url.pathname);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return json(res, 404, {error:'Not found'});
  res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
});
server.listen(4173, '127.0.0.1', () => console.log('AI Growth OS preview: http://127.0.0.1:4173'));

