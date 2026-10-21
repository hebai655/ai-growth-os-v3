const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '.data');
const dataFile = path.join(dataDir, 'store.json');
const sessionTtlMs = 1000 * 60 * 60 * 24 * 14;

function emptyStore() {
  return {users: [], sessions: [], accounts: [], teams: [], teamMembers: [], contents: [], tasks: [], aiCalls: [], generationRecords: [], creditGrants: [], creditLedger: [], oauthStates: [], publishJobs: [], metricSnapshots: [], notifications: [], auditLogs: [], subscriptions: [], paymentOrders: [], usageRecords: [], deletionRequests: []};
}
function ensureStore() {
  fs.mkdirSync(dataDir, {recursive: true});
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(emptyStore(), null, 2), 'utf8');
}
function readStore() {
  ensureStore();
  try {
    const value = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return Object.assign(emptyStore(), value || {});
  } catch {
    return emptyStore();
  }
}
function writeStore(store) {
  ensureStore();
  const tmp = dataFile + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(tmp, dataFile);
}
function id(prefix) { return prefix + '_' + crypto.randomUUID(); }
function hashToken(value) { return crypto.createHash('sha256').update(String(value || '')).digest('hex'); }
function emailVerificationToken() { return crypto.randomBytes(32).toString('base64url'); }
function hashPassword(password, salt) {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return {salt: actualSalt, hash};
}
function verifyPassword(password, record) {
  const salt = record && (record.passwordSalt || record.salt);
  if (!record || !salt || !record.passwordHash) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(record.passwordHash, 'hex'));
}
function publicUser(user) { return {id: user.id, email: user.email, name: user.name, role: user.role || 'user', emailVerifiedAt: user.emailVerifiedAt || null, createdAt: user.createdAt}; }
function setAIProvider(userId, provider) { const store=readStore(); const user=store.users.find(item=>item.id===userId); if(!user)return {error:'AUTH_USER_NOT_FOUND'}; user.aiProvider=String(provider||'deepseek'); audit(userId,'ai.provider_select',user.aiProvider,{}); writeStore(store); return user.aiProvider; }
function aiProviderFor(userId) { const store=readStore(); const user=store.users.find(item=>item.id===userId); return user&&user.aiProvider||'deepseek'; }
function accountFor(store, userId) {
  let account = store.accounts.find(item => item.userId === userId);
  if (!account) {
    account = {id: id('account'), userId, platform: 'xiaohongshu', name: '', accountId: '', status: 'unbound', permissions: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()};
    store.accounts.push(account);
  }
  return account;
}
function listAccounts(userId) { return readStore().accounts.filter(item => item.userId === userId).map(safeAccount); }
function createAccount(userId, payload) {
  const store = readStore(); const account = {id:id('account'), userId, platform:String(payload.platform || 'xiaohongshu'), name:String(payload.name || '未命名账号').slice(0,80), accountId:String(payload.accountId || ''), status:'unbound', permissions:[], createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()}; store.accounts.push(account); audit(userId, 'account.create', account.id, {platform:account.platform}); writeStore(store); return safeAccount(account);
}
function ensureTeam(store, userId) { let team=store.teams.find(item=>item.ownerId===userId); if(!team){team={id:id('team'),ownerId:userId,name:'我的运营团队',createdAt:new Date().toISOString()};store.teams.push(team);store.teamMembers.push({id:id('member'),teamId:team.id,userId,email:store.users.find(item=>item.id===userId)?.email,role:'owner',status:'active',createdAt:new Date().toISOString()});} return team; }
function teamFor(userId) { const store=readStore(); const team=ensureTeam(store,userId); writeStore(store); return team; }
function teamData(userId) { const store=readStore(); const team=ensureTeam(store,userId); writeStore(store); return {team, members:store.teamMembers.filter(item=>item.teamId===team.id).map(item=>Object.assign({},item,{userId:undefined}))}; }
function addTeamMember(userId, email, role) { const store=readStore(); const team=ensureTeam(store,userId); const normalized=String(email||'').trim().toLowerCase(); const user=store.users.find(item=>item.email===normalized); if(!user)return {error:'TEAM_MEMBER_NOT_FOUND'}; if(store.teamMembers.some(item=>item.teamId===team.id&&item.userId===user.id))return {error:'TEAM_MEMBER_EXISTS'}; const member={id:id('member'),teamId:team.id,userId:user.id,email:normalized,role:['admin','editor','viewer'].includes(role)?role:'viewer',status:'invited',createdAt:new Date().toISOString()};store.teamMembers.push(member);audit(userId,'team.member_invite',member.id,{email:normalized,role:member.role});writeStore(store);return Object.assign({},member,{userId:undefined}); }
function updateTeamMember(userId, memberId, role) { const store=readStore(); const team=ensureTeam(store,userId); const member=store.teamMembers.find(item=>item.teamId===team.id&&item.id===memberId); if(!member)return {error:'TEAM_MEMBER_NOT_FOUND'}; if(member.role==='owner')return {error:'TEAM_OWNER_PROTECTED'}; member.role=['admin','editor','viewer'].includes(role)?role:member.role;audit(userId,'team.member_role_update',member.id,{role:member.role});writeStore(store);return Object.assign({},member,{userId:undefined}); }
function planCatalog() { return [{id:'free',name:'免费版',credits:10,monthlyCredits:10,price:0,features:['基础 AI 创作','基础数据分析']},{id:'basic',name:'基础版',credits:300,monthlyCredits:300,price:29,features:['历史记录','内容诊断','任务提醒']},{id:'pro',name:'专业版',credits:1500,monthlyCredits:1500,price:99,features:['高级 AI 能力','多账号矩阵','团队协作']}]; }
function subscriptionFor(userId) { const store=readStore();let sub=store.subscriptions.find(item=>item.userId===userId);if(!sub){const plan=planCatalog()[0];sub={id:id('sub'),userId,planId:plan.id,credits:plan.credits,monthlyUsed:0,status:'active',renewAt:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};store.subscriptions.push(sub);writeStore(store);}return sub; }
function membershipFor(userId) { const sub=subscriptionFor(userId); const plan=planCatalog().find(item=>item.id===sub.planId)||planCatalog()[0]; const level=plan.id==='pro'?'PRO':'FREE'; return {level,planId:plan.id,planName:plan.name,advancedStyles:level==='PRO'}; }
function billingData(userId) { const store=readStore();const sub=subscriptionFor(userId);const plan=planCatalog().find(item=>item.id===sub.planId)||planCatalog()[0];return {source:'server',plans:planCatalog(),subscription:Object.assign({},sub),plan,membership:membershipFor(userId)}; }
function createPaymentOrder(userId, planId) { const plan=planCatalog().find(item=>item.id===planId);if(!plan||plan.id==='free')return {error:'PLAN_NOT_PAYABLE'};const store=readStore();const order={id:id('order'),userId,planId,amount:plan.price,currency:'CNY',status:'pending',provider:'payment-adapter-required',createdAt:new Date().toISOString()};store.paymentOrders.push(order);audit(userId,'billing.checkout_create',order.id,{planId,amount:plan.price});writeStore(store);return {order,provider:'payment-adapter-required',message:'支付适配器尚未配置，不会产生真实扣款'}; }
function recordUsage(userId, type, units, meta) { const store=readStore();let sub=store.subscriptions.find(item=>item.userId===userId);if(!sub){const plan=planCatalog()[0];sub={id:id('sub'),userId,planId:plan.id,credits:plan.credits,monthlyUsed:0,status:'active',renewAt:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};store.subscriptions.push(sub);}const metadata=meta&&typeof meta==='object'?meta:{};const row={id:id('usage'),userId,type,units:Math.max(1,Number(units||1)),meta:metadata,createdAt:new Date().toISOString()};store.usageRecords.push(row);sub.monthlyUsed=Number(sub.monthlyUsed||0)+row.units;sub.credits=Math.max(0,Number(sub.credits||0)-row.units);sub.updatedAt=new Date().toISOString();if(type==='generate'){const idempotencyKey='generation_charge:'+(metadata.requestId||row.id);if(!store.creditLedger.some(item=>item.idempotencyKey===idempotencyKey))store.creditLedger.push({id:id('ledger'),userId,delta:-row.units,balanceAfter:sub.credits,type:'generation_charge',idempotencyKey,metadata:Object.assign({reason:'AI 成功生成扣费'},metadata),createdAt:row.createdAt});}audit(userId,'usage.consume',row.id,{type,units:row.units});writeStore(store);return row; }
function localDateInShanghai(now) { const parts = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date(now == null ? Date.now() : now)).reduce((all, part) => { all[part.type] = part.value; return all; }, {}); return parts.year + '-' + parts.month + '-' + parts.day; }
function grantDailyCredits(userId, now) {
  const store = readStore();
  const grantDate = localDateInShanghai(now);
  const idempotencyKey = 'daily_grant:' + userId + ':' + grantDate;
  const existing = store.creditGrants.find(item => item.userId === userId && item.grantDate === grantDate);
  let sub = store.subscriptions.find(item => item.userId === userId); if (!sub) { const plan=planCatalog()[0]; sub={id:id('sub'),userId,planId:plan.id,credits:plan.credits,monthlyUsed:0,status:'active',renewAt:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}; store.subscriptions.push(sub); }
  if (existing) return {granted:false, amount:0, grantDate, balance:Number(sub.credits || 0), idempotencyKey};
  const amount = 2;
  sub.credits = Number(sub.credits || 0) + amount;
  sub.updatedAt = new Date().toISOString();
  const createdAt = new Date(now == null ? Date.now() : now).toISOString();
  const grant = {id:id('grant'), userId, grantDate, amount, idempotencyKey, createdAt};
  const ledger = {id:id('ledger'), userId, delta:amount, balanceAfter:sub.credits, type:'daily_grant', idempotencyKey, metadata:{reason:'每日登录/访问赠送', timezone:'Asia/Shanghai', grantDate}, createdAt};
  store.creditGrants.push(grant);
  store.creditLedger.push(ledger);
  writeStore(store);
  return {granted:true, amount, grantDate, balance:sub.credits, idempotencyKey};
}
function usageData(userId) { const store=readStore();const sub=subscriptionFor(userId);const since=Date.now()-30*24*60*60*1000;const rows=store.usageRecords.filter(item=>item.userId===userId&&new Date(item.createdAt).getTime()>=since);return {source:'server',credits:sub.credits,monthlyUsed:sub.monthlyUsed,monthlyLimit:(planCatalog().find(item=>item.id===sub.planId)||planCatalog()[0]).monthlyCredits,byType:rows.reduce((all,item)=>{all[item.type]=(all[item.type]||0)+item.units;return all;},{})}; }
function audit(userId, action, resourceId, meta) { const store=readStore();store.auditLogs.push({id:id('audit'),userId,action,resourceId:resourceId||null,meta:meta||{},createdAt:new Date().toISOString()});if(store.auditLogs.length>20000)store.auditLogs=store.auditLogs.slice(-20000); }
function auditData(userId) { return {source:'server',items:readStore().auditLogs.filter(item=>item.userId===userId).slice(-100).reverse()}; }
function exportData(userId) { const store=readStore();return {source:'server',exportedAt:new Date().toISOString(),user:publicUser(store.users.find(item=>item.id===userId)),accounts:store.accounts.filter(item=>item.userId===userId).map(safeAccount),contents:userContents(store,userId).map(stripOwner),tasks:store.tasks.filter(item=>item.userId===userId).map(stripOwner),usage:store.usageRecords.filter(item=>item.userId===userId),audit:store.auditLogs.filter(item=>item.userId===userId)}; }
function requestDeletion(userId) { const store=readStore();const request={id:id('deletion'),userId,status:'requested',createdAt:new Date().toISOString()};store.deletionRequests.push(request);audit(userId,'privacy.deletion_request',request.id,{});writeStore(store);return request; }
function createUser(email, password, name) {
  const store = readStore();
  const normalized = String(email || '').trim().toLowerCase();
  if (store.users.some(item => item.email === normalized)) return {error: 'AUTH_EMAIL_EXISTS'};
  const credential = hashPassword(password);
  const verificationToken = emailVerificationToken();
  const user = {id: id('user'), email: normalized, name: String(name || normalized.split('@')[0] || '创作者').slice(0, 40), role:'user', passwordHash: credential.hash, passwordSalt: credential.salt, emailVerifiedAt:null, emailVerificationTokenHash:hashToken(verificationToken), emailVerificationExpiresAt:Date.now()+24*60*60*1000, createdAt: new Date().toISOString()};
  store.users.push(user);
  accountFor(store, user.id);
  ensureTeam(store, user.id);
  writeStore(store);
  subscriptionFor(user.id);
  return {user: publicUser(user), verificationToken};
}
function authenticate(email, password) {
  const store = readStore();
  const user = store.users.find(item => item.email === String(email || '').trim().toLowerCase());
  if (!verifyPassword(password, user)) return {error: 'AUTH_INVALID_CREDENTIALS'};
  if (user.emailVerificationTokenHash && !user.emailVerifiedAt) return {error: 'AUTH_EMAIL_UNVERIFIED'};
  return {user: publicUser(user), token: createSession(user.id, store)};
}
function verifyEmailToken(token) {
  const value = String(token || '').trim();
  if (!value) return {error:'AUTH_VERIFICATION_INVALID'};
  const store = readStore();
  const user = store.users.find(item => item.emailVerificationTokenHash === hashToken(value));
  if (!user || !user.emailVerificationExpiresAt || Number(user.emailVerificationExpiresAt) < Date.now()) return {error:'AUTH_VERIFICATION_EXPIRED'};
  user.emailVerifiedAt = new Date().toISOString();
  delete user.emailVerificationTokenHash;
  delete user.emailVerificationExpiresAt;
  writeStore(store);
  return {user:publicUser(user)};
}
function createSession(userId, store) {
  const token = crypto.randomBytes(32).toString('base64url');
  store.sessions = store.sessions.filter(item => item.expiresAt > Date.now());
  store.sessions.push({id: id('session'), tokenHash: crypto.createHash('sha256').update(token).digest('hex'), userId, createdAt: Date.now(), expiresAt: Date.now() + sessionTtlMs});
  writeStore(store);
  return token;
}
function sessionUser(token) {
  if (!token) return null;
  const store = readStore();
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const session = store.sessions.find(item => item.tokenHash === tokenHash && item.expiresAt > Date.now());
  if (!session) return null;
  const user = store.users.find(item => item.id === session.userId);
  return user ? {user: publicUser(user), userId: user.id, sessionId: session.id} : null;
}
function destroySession(token) {
  if (!token) return;
  const store = readStore();
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  store.sessions = store.sessions.filter(item => item.tokenHash !== tokenHash);
  writeStore(store);
}
function userData(userId) {
  const store = readStore();
  const account = accountFor(store, userId);
  writeStore(store);
  return {source: 'server', user: publicUser(store.users.find(item => item.id === userId)), account: safeAccount(account), contents: store.contents.filter(item => item.userId === userId).map(stripOwner), tasks: store.tasks.filter(item => item.userId === userId).map(stripOwner)};
}
function safeAccount(account) { return Object.assign({}, account, {userId: undefined}); }
function stripOwner(item) { const copy = Object.assign({}, item); delete copy.userId; return copy; }
function replaceUserData(userId, payload) {
  const store = readStore();
  const account = accountFor(store, userId);
  if (payload.account && typeof payload.account === 'object') {
    ['name', 'accountId', 'bio', 'status', 'permissions', 'platform'].forEach(key => { if (payload.account[key] !== undefined) account[key] = payload.account[key]; });
    account.updatedAt = new Date().toISOString();
  }
  for (const key of ['contents', 'tasks']) {
    if (!Array.isArray(payload[key])) continue;
    store[key] = store[key].filter(item => item.userId !== userId).concat(payload[key].slice(0, 500).map(item => Object.assign({}, item, {userId, updatedAt: new Date().toISOString()})));
  }
  writeStore(store);
  return userData(userId);
}
function userContents(store, userId) { return store.contents.filter(item => item.userId === userId); }
function metricsForUser(userId, range) {
  const store = readStore(); const contents = userContents(store, userId).filter(item => item.status === 'published');
  const current = contents.reduce((sum, item) => ({views: sum.views + Number(item.views || 0), likes: sum.likes + Number(item.likes || 0), saves: sum.saves + Number(item.saves || 0), comments: sum.comments + Number(item.comments || 0)}), {views:0, likes:0, saves:0, comments:0});
  const interaction = current.views ? Number(((current.likes + current.saves + current.comments) / current.views * 100).toFixed(1)) : 0;
  const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
  const previous = store.metricSnapshots.filter(item => item.userId === userId && item.range === (range || '7d')).sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  const base = previous || (contents.length ? {views: Math.max(1, Math.round(current.views * .82)), likes: Math.max(1, Math.round(current.likes * .84)), saves: Math.max(1, Math.round(current.saves * .78)), comments: Math.max(1, Math.round(current.comments * 1.04))} : null);
  const pct = (now, before) => before == null ? null : Number((((now - before) / Math.max(1, before)) * 100).toFixed(1));
  const ranking = contents.slice().sort((a,b) => Number(b.views || 0) - Number(a.views || 0)).slice(0, 20).map(stripOwner);
  return {source:'server', range:range || '7d', updatedAt:new Date().toISOString(), days, hasData: contents.length > 0, cards:{exposure:current.views, likes:current.likes, saves:current.saves, comments:current.comments, interaction, followers:0}, comparison:{exposure:pct(current.views, base && base.views), likes:pct(current.likes, base && base.likes), saves:pct(current.saves, base && base.saves), comments:pct(current.comments, base && base.comments)}, ranking};
}
function syncAccountData(userId) {
  const store = readStore(); const account = accountFor(store, userId);
  if (account.status !== 'connected') return {error:'ACCOUNT_NOT_CONNECTED'};
  const contents = userContents(store, userId); const now = new Date().toISOString();
  contents.forEach(item => { if (item.status === 'published') { item.dataSyncedAt = now; item.dataSource = 'server-sync'; } });
  const metrics = metricsForUser(userId, '7d'); store.metricSnapshots.push({userId, range:'7d', createdAt:now, views:metrics.cards.exposure, likes:metrics.cards.likes, saves:metrics.cards.saves, comments:metrics.cards.comments});
  account.lastSyncedAt = now; account.updatedAt = now; store.accounts = store.accounts.map(item => item.id === account.id ? account : item); writeStore(store);
  return Object.assign({account:safeAccount(account), contents:contents.map(stripOwner)}, metrics);
}
function publishJob(userId, contentId, plannedAt, mode) {
  const store = readStore(); const account = accountFor(store, userId); if (account.status !== 'connected') return {error:'ACCOUNT_NOT_CONNECTED'}; const content = userContents(store, userId).find(item => item.id === contentId);
  if (!content) return {error:'CONTENT_NOT_FOUND'};
  const job = {id:id('publish'), userId, contentId, mode:mode || 'schedule', plannedAt:plannedAt || new Date().toISOString(), status:'scheduled', attempts:0, lastError:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()};
  store.publishJobs.push(job); content.status = 'scheduled'; content.plannedAt = job.plannedAt; content.publishJobId = job.id; content.dataSource = 'server'; writeStore(store); return {job:stripOwner(job), content:stripOwner(content)};
}
function retryPublishJob(userId, jobId) {
  const store = readStore(); const job = store.publishJobs.find(item => item.userId === userId && item.id === jobId); if (!job) return {error:'PUBLISH_JOB_NOT_FOUND'};
  job.attempts += 1; job.status = 'scheduled'; job.lastError = ''; job.updatedAt = new Date().toISOString(); writeStore(store); return {job:stripOwner(job)};
}
function failPublishJob(userId, jobId, reason) {
  const store = readStore(); const job = store.publishJobs.find(item => item.userId === userId && item.id === jobId); if (!job) return {error:'PUBLISH_JOB_NOT_FOUND'};
  const content = userContents(store, userId).find(item => item.id === job.contentId); job.attempts += 1; job.status = 'failed'; job.lastError = String(reason || '发布服务返回失败'); job.updatedAt = new Date().toISOString(); if (content) { content.status = 'failed'; content.publishError = job.lastError; content.publishJobId = job.id; } writeStore(store); return {job:stripOwner(job), content:content && stripOwner(content)};
}
function notificationsForUser(userId) {
  const store = readStore(); const now = new Date().toISOString().slice(0,10); const tasks = store.tasks.filter(item => item.userId === userId && item.status !== 'done' && item.dueAt && item.dueAt <= now).map(item => ({id:'task_due_'+item.id,type:'task_due',title:'任务到期提醒',message:item.title,dueAt:item.dueAt}));
  const failed = store.publishJobs.filter(item => item.userId === userId && item.status === 'failed').map(item => ({id:'publish_failed_'+item.id,type:'publish_failed',title:'内容发布失败',message:item.lastError,contentId:item.contentId})); return {source:'server',items:tasks.concat(failed).slice(0,50),updatedAt:new Date().toISOString()};
}
function logAICall(userId, meta) {
  const store = readStore();
  store.aiCalls.push(Object.assign({id: id('ai_call'), userId: userId || null, createdAt: new Date().toISOString()}, meta));
  if (store.aiCalls.length > 10000) store.aiCalls = store.aiCalls.slice(-10000);
  writeStore(store);
}
function createGenerationRecord(userId, record) {
  const store = readStore();
  const requestId = String(record && record.requestId || '').trim();
  if (!requestId) return {error: 'GENERATION_REQUEST_ID_REQUIRED'};
  const existing = store.generationRecords.find(item => item.userId === userId && item.requestId === requestId);
  if (existing) return existing;
  const now = new Date().toISOString();
  const result = record.resultJson && typeof record.resultJson === 'object' ? record.resultJson : null;
  const row = {
    id: id('generation'), userId, requestId,
    platform: String(record.platform || '').slice(0, 40),
    contentType: String(record.contentType || '').slice(0, 80),
    inputText: String(record.inputText || '').slice(0, 12000),
    inputHash: hashToken(record.inputText || ''),
    provider: String(record.provider || '').slice(0, 40),
    model: String(record.model || '').slice(0, 120),
    status: 'succeeded', resultJson: result,
    titleCount: Array.isArray(result && result.titles) ? result.titles.length : 0,
    creditsCharged: Math.max(0, Number(record.creditsCharged || 0)),
    createdAt: record.createdAt || now,
    completedAt: record.completedAt || now,
    latencyMs: Math.max(0, Number(record.latencyMs || 0))
  };
  store.generationRecords.push(row);
  writeStore(store);
  return row;
}
function generationSummary(record) {
  return {id:record.id, requestId:record.requestId, platform:record.platform, contentType:record.contentType, inputSummary:String(record.inputText || '').slice(0, 140), titleCount:record.titleCount, status:record.status, createdAt:record.createdAt, completedAt:record.completedAt};
}
function listGenerationRecords(userId, page, pageSize, query) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.min(50, Math.max(1, Number(pageSize) || 20));
  const search = String(query || '').trim().toLowerCase();
  const store = readStore();
  const records = store.generationRecords.filter(item => item.userId === userId && item.status === 'succeeded').filter(item => !search || String(item.inputText || '').toLowerCase().includes(search) || String(item.platform || '').toLowerCase().includes(search) || String(item.contentType || '').toLowerCase().includes(search)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safePageSize;
  return {source:'server', page:currentPage, pageSize:safePageSize, total, totalPages, items:records.slice(start, start + safePageSize).map(generationSummary)};
}
function generationRecord(userId, recordId) {
  const store = readStore();
  const record = store.generationRecords.find(item => item.userId === userId && item.id === String(recordId || '') && item.status === 'succeeded');
  if (!record) return null;
  const copy = Object.assign({}, record);
  delete copy.userId;
  return copy;
}
function generationByRequestId(userId, requestId) {
  const store = readStore();
  const record = store.generationRecords.find(item => item.userId === userId && item.requestId === String(requestId || '') && item.status === 'succeeded');
  if (!record) return null;
  const copy = Object.assign({}, record);
  delete copy.userId;
  return copy;
}
function aiUsage(userId) {
  const store = readStore();
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const calls = store.aiCalls.filter(item => item.userId === userId && new Date(item.createdAt).getTime() >= since);
  const successfulGenerations = store.generationRecords.filter(item => item.userId === userId && item.status === 'succeeded').length;
  return {source: 'server', period: '30d', calls: calls.length, successfulGenerations, inputTokens: calls.reduce((sum, item) => sum + Number(item.inputTokens || 0), 0), outputTokens: calls.reduce((sum, item) => sum + Number(item.outputTokens || 0), 0), estimatedCost: calls.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0), lastCallAt: calls.length ? calls[calls.length - 1].createdAt : null};
}
function allowAI(userId, key, limit, windowMs) {
  const store = readStore();
  const since = Date.now() - windowMs;
  const calls = store.aiCalls.filter(item => (item.userId || key) === (userId || key) && new Date(item.createdAt).getTime() >= since);
  return {allowed: calls.length < limit, remaining: Math.max(0, limit - calls.length), retryAfter: calls.length ? Math.ceil((new Date(calls[0].createdAt).getTime() + windowMs - Date.now()) / 1000) : 0};
}
function createOAuthState(userId) {
  const store = readStore();
  const state = crypto.randomBytes(24).toString('base64url');
  store.oauthStates.push({state, userId, createdAt: Date.now(), expiresAt: Date.now() + 10 * 60 * 1000});
  writeStore(store);
  return state;
}
function consumeOAuthState(state) {
  const store = readStore();
  const index = store.oauthStates.findIndex(item => item.state === state && item.expiresAt > Date.now());
  if (index < 0) return null;
  const value = store.oauthStates[index];
  store.oauthStates.splice(index, 1);
  writeStore(store);
  return value;
}
module.exports = {readStore, writeStore, publicUser, createUser, authenticate, verifyEmailToken, sessionUser, destroySession, userData, replaceUserData, logAICall, createGenerationRecord, listGenerationRecords, generationRecord, generationByRequestId, aiUsage, allowAI, accountFor, safeAccount, createOAuthState, consumeOAuthState, metricsForUser, syncAccountData, publishJob, retryPublishJob, failPublishJob, notificationsForUser, listAccounts, createAccount, teamData, addTeamMember, updateTeamMember, planCatalog, membershipFor, billingData, createPaymentOrder, usageData, recordUsage, localDateInShanghai, grantDailyCredits, auditData, exportData, requestDeletion, setAIProvider, aiProviderFor};
