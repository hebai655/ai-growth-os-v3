const ICONS = {
  home:`<svg viewBox="0 0 24 24"><path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M9 21v-7h6v7"/></svg>`,
  chart:`<svg viewBox="0 0 24 24"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>`,
  content:`<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
  task:`<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 2.2 2.2L16 9"/></svg>`,
  bulb:`<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M8.2 15.2A7 7 0 1 1 15.8 15.2c-.7.5-.8 1.1-.8 1.8H9c0-.7-.1-1.3-.8-1.8Z"/></svg>`,
  settings:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>`,
  search:`<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  bell:`<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>`,
  calendar:`<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`,
  x:`<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  refresh:`<svg viewBox="0 0 24 24"><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5"/></svg>`,
  send:`<svg viewBox="0 0 24 24"><path d="m4 4 16 8-16 8 3-8z"/><path d="M7 12h13"/></svg>`,
  plus:`<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  spark:`<svg viewBox="0 0 24 24"><path d="m12 3 1.2 4.3L17 9l-3.8 1.7L12 15l-1.2-4.3L7 9l3.8-1.7z"/><path d="m18 15 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L14 18l2.3-.7z"/></svg>`,
  chevron:`<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>`,
  menu:`<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  filter:`<svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>`,
  export:`<svg viewBox="0 0 24 24"><path d="M12 3v12m0-12 4 4m-4-4L8 7"/><path d="M5 13v7h14v-7"/></svg>`,
  check:`<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>`,
  robot:`<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="13" rx="3"/><path d="M12 3v3M8 11h.01M16 11h.01M8 15h8"/></svg>`
};

const DATA = {
  trend: {
    exposure:[11200,18800,28300,30100,42300,37200,49800],
    interaction:[7200,11600,18200,19500,26700,24100,31200],
    followers:[2620,2654,2701,2739,2786,2817,2846]
  },
  posts:[
    {title:'冬日氛围感穿搭｜小个子也能显高',cat:'穿搭',date:'2024.12.06',views:32400,likes:1820,saves:921,comments:214,rate:9.1,status:'已发布'},
    {title:'年度复盘的 3 个方法｜别让努力白费',cat:'成长',date:'2024.12.04',views:28900,likes:1640,saves:1030,comments:182,rate:8.6,status:'已发布'},
    {title:'3 个提升气质的日常小习惯',cat:'生活',date:'2024.12.02',views:24300,likes:1380,saves:804,comments:169,rate:7.9,status:'已发布'},
    {title:'打工人快速早餐｜5 分钟搞定',cat:'美食',date:'2024.11.30',views:18200,likes:920,saves:608,comments:133,rate:6.8,status:'已发布'},
    {title:'我的高效时间管理分享',cat:'成长',date:'2024.11.28',views:16400,likes:830,saves:551,comments:106,rate:6.1,status:'已发布'},
    {title:'秋冬显白口红合集｜黄皮必看',cat:'美妆',date:'2024.11.26',views:14800,likes:786,saves:498,comments:93,rate:5.9,status:'已发布'},
    {title:'周末 citywalk｜上海小众打卡地',cat:'旅行',date:'2024.11.24',views:12600,likes:643,saves:420,comments:74,rate:5.4,status:'已发布'},
    {title:'自律女孩的日常｜早起 Vlog',cat:'生活',date:'2024.11.22',views:0,likes:0,saves:0,comments:0,rate:0,status:'草稿'},
    {title:'新手化妆教程｜10 分钟出门',cat:'美妆',date:'2024.11.20',views:11200,likes:602,saves:358,comments:78,rate:4.8,status:'已发布'},
    {title:'家里也能做的低卡晚餐',cat:'美食',date:'2024.11.18',views:0,likes:0,saves:0,comments:0,rate:0,status:'草稿'}
  ],
  tasks:[
    {id:1,title:'发布一篇年度复盘笔记',type:'内容发布',priority:'高',status:'待完成',due:'今天',owner:'Alex'},
    {id:2,title:'分析上周内容数据',type:'数据分析',priority:'中',status:'待完成',due:'今天',owner:'Alex'},
    {id:3,title:'优化 3 篇旧笔记标题',type:'内容优化',priority:'中',status:'进行中',due:'明天',owner:'Alex'},
    {id:4,title:'回复高价值评论',type:'互动运营',priority:'低',status:'进行中',due:'12.10',owner:'Alex'},
    {id:5,title:'整理热门话题趋势',type:'内容策划',priority:'中',status:'待完成',due:'本周',owner:'Alex'},
    {id:6,title:'复盘本周内容表现',type:'数据分析',priority:'中',status:'已完成',due:'12.06',owner:'Alex'},
    {id:7,title:'更新账号主页简介',type:'账号优化',priority:'低',status:'已完成',due:'12.05',owner:'Alex'},
    {id:8,title:'发布知识干货笔记',type:'内容发布',priority:'高',status:'已完成',due:'12.04',owner:'Alex'}
  ],
  ideas:[
    {icon:'↗',title:'冬季穿搭：小个子显高公式',desc:'近 7 天相关关键词搜索热度持续上涨，与你的穿搭内容受众匹配度高。',score:92,tags:['高搜索','适合图文','可系列化']},
    {icon:'✦',title:'年底复盘：普通人如何做年度总结',desc:'收藏意图强，适合做步骤型清单和模板型内容。',score:89,tags:['高收藏','成长赛道','清单体']},
    {icon:'AI',title:'AI 效率工具真实体验',desc:'评论讨论度高，可加入横向测评和真实使用场景。',score:84,tags:['热点','高评论','工具测评']},
    {icon:'◎',title:'3 个让我持续早起的方法',desc:'与你现有成长类内容受众高度匹配，适合口播或 Vlog。',score:81,tags:['稳定需求','个人成长','Vlog']}
  ]
};

const initial = {
  page:'dashboard', period:7, metric:'exposure', aiOpen:true, sidebarOpen:false,
  contentTab:'全部', contentQuery:'', contentStatus:'全部状态', contentCategory:'全部分类', contentSort:'最新发布',
  taskTab:'全部任务', taskQuery:'', taskType:'任务类型', taskPriority:'优先级', taskStatus:'状态',
  settingsTab:'账号信息', selectedPosts:[],
  tasks: JSON.parse(localStorage.getItem('growth_tasks') || 'null') || DATA.tasks,
  notifications:true, weeklyReport:true, aiProactive:true,
  messages:[
    {role:'assistant',html:'你好，Alex 👋<br>我是你的 AI 运营总监。你可以直接问我数据分析、内容策划、任务安排等问题。'},
  ]
};
const state = {...initial};

function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function num(n){return Number(n).toLocaleString('en-US')}
function icon(name){return ICONS[name]||''}
function navIcon(name){return `<span class="nav-icon">${icon(name)}</span>`}

function Sidebar(){
  const items=[['dashboard','home','运营总览'],['analytics','chart','数据分析'],['content','content','内容管理'],['tasks','task','任务中心'],['ideas','bulb','灵感库'],['settings','settings','账号设置']];
  return `<aside class="sidebar ${state.sidebarOpen?'open':''}">
    <div class="brand"><div class="brand-logo">小红</div><div><div class="brand-name">AI Growth OS</div><div class="brand-sub">小红书智能运营平台</div></div></div>
    <div class="nav-section-label">工作空间</div>
    <nav class="nav">${items.map(([p,i,t])=>`<button class="nav-item ${state.page===p?'active':''}" data-page="${p}">${navIcon(i)}<span>${t}</span></button>`).join('')}</nav>
    <div class="nav-spacer"></div>
    <div class="sidebar-foot">
      <div class="workspace-card"><div class="workspace-kicker">本周成长进度</div><div class="workspace-title">目标：稳定提升内容质量</div><div class="workspace-progress"><span></span></div><div class="workspace-meta"><span>5 / 7 项</span><span>72%</span></div></div>
      <div class="profile"><div class="profile-row"><div class="avatar"></div><div><div class="name">Alex</div><div class="role">个人创作者</div></div><button class="profile-menu">⌄</button></div></div>
    </div>
  </aside>`
}

function Topbar(){return `<header class="topbar">
  <button class="icon-btn mobile-menu" data-action="mobile-menu">${icon('menu')}</button>
  <button class="search-trigger" data-action="command">${icon('search')}<span class="search-copy">搜索内容、任务，或问问 AI…</span><span class="kbd">⌘ K</span></button>
  <div class="top-actions">
    <button class="icon-btn" data-action="notification">${icon('bell')}<span class="dot"></span></button>
    <button class="date-pill" data-action="period-menu">${icon('calendar')}<span>2024.12.01 - 2024.12.07</span><span>⌄</span></button>
    <button class="icon-btn" data-action="toggle-ai" title="AI 运营总监">${icon('robot')}</button>
    <div class="mini-user"><div class="avatar"><span class="status-dot"></span></div></div>
  </div>
</header>`}

function Shell(content,{ai=false}={}){return `<div class="app-shell">${Sidebar()}<main class="main ${ai&&state.aiOpen?'with-ai':''}">${Topbar()}${content}</main>${ai&&state.aiOpen?AISidebar():''}</div>${Overlays()}`}

function Spark(values,good=true){
  const w=100,h=28,p=2,max=Math.max(...values),min=Math.min(...values),span=max-min||1;
  const pts=values.map((v,i)=>`${(i/(values.length-1))*w},${h-p-((v-min)/span)*(h-p*2)}`).join(' ');
  const color=good?'#ff2442':'#ff2442';
  return `<svg viewBox="0 0 100 28" preserveAspectRatio="none"><defs><linearGradient id="sg${values[0]}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><polygon points="0,28 ${pts} 100,28" fill="url(#sg${values[0]})"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.4" vector-effect="non-scaling-stroke"/></svg>`
}

function Chart(values=DATA.trend.exposure){
  const W=720,H=230,left=48,right=18,top=20,bottom=32; const max=Math.max(...values)*1.16; const min=0;
  const x=i=>left+i*((W-left-right)/(values.length-1)); const y=v=>top+(max-v)/(max-min)*(H-top-bottom);
  const points=values.map((v,i)=>[x(i),y(v)]); const line=points.map(p=>p.join(',')).join(' '); const area=`${left},${H-bottom} ${line} ${W-right},${H-bottom}`;
  const yTicks=[0,.25,.5,.75,1].map(t=>Math.round(max*t/1000)*1000); const labels=['12.01','12.02','12.03','12.04','12.05','12.06','12.07'];
  const hi=values.indexOf(Math.max(...values));
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2442" stop-opacity=".18"/><stop offset="1" stop-color="#ff2442" stop-opacity=".01"/></linearGradient></defs>
    ${yTicks.map((v,idx)=>{const yy=H-bottom-idx*((H-top-bottom)/4);return `<line class="grid-line" x1="${left}" y1="${yy}" x2="${W-right}" y2="${yy}"/><text class="axis-text" x="2" y="${yy+3}">${v>=1000?Math.round(v/1000)+',000':v}</text>`}).join('')}
    ${labels.map((l,i)=>`<line class="grid-line" x1="${x(i)}" y1="${top}" x2="${x(i)}" y2="${H-bottom}" opacity=".55"/><text class="axis-text" x="${x(i)-14}" y="${H-9}">${l}</text>`).join('')}
    <polygon class="trend-area" points="${area}"/><polyline class="trend-line" points="${line}"/>
    ${points.map((p,i)=>`<circle class="point" cx="${p[0]}" cy="${p[1]}" r="${i===hi?4:2.6}"/>`).join('')}
    <g transform="translate(${Math.min(W-95,Math.max(left+5,x(hi)-31))},${Math.max(4,y(values[hi])-54)})"><rect class="tooltip-card" width="73" height="40" rx="7"/><text x="11" y="15" class="axis-text" fill="#667085">${labels[hi].slice(3)}</text><text x="11" y="30" font-size="12" font-weight="700" fill="#344054">${num(values[hi])}</text></g>
  </svg>`
}

function Dashboard(){
  const stats=[
    ['粉丝数','2,846','+8.4%','up',[2,4,3,6,5,10,9,14]],['曝光量','128,400','+23.1%','up',[3,5,6,10,7,12,10,15]],['互动率','8.7%','+1.6%','up',[2,3,3,5,6,9,8,12]],['点赞','6,421','+12.3%','up',[2,4,5,8,6,11,9,14]],['收藏','3,180','+36.2%','up',[1,4,3,7,5,10,8,13]],['评论','824','-4.1%','down',[6,8,7,10,8,12,11,9]]
  ];
  const miniTasks=state.tasks.filter(t=>t.status!=='已完成').slice(0,4);
  return `<div class="page compact">
    <div class="hero-grid"><div class="hero-copy"><h1>下午好，Alex</h1><p>今天账号整体表现稳定，有 <b style="color:#344054">2</b> 个事项值得关注。</p></div>
      <div class="panel ai-summary"><h3><span style="color:var(--red)">▮▮▮</span> AI 运营总监为你总结</h3><p>过去 7 天，账号曝光增长 23%，主要来自知识干货类内容。建议继续保持该方向，同时优化笔记结尾的互动引导。</p><button class="summary-link" data-page="ai">查看分析 →</button></div>
    </div>
    <section class="stats">${stats.map(s=>`<div class="panel stat"><div class="stat-label">${s[0]}</div><div class="stat-value">${s[1]}</div><div class="stat-change ${s[3]}">${s[2]} ${s[3]==='up'?'↗':'↘'}</div><div class="spark">${Spark(s[4],s[3]==='up')}</div></div>`).join('')}</section>
    <section class="dashboard-grid">
      <div class="panel panel-pad"><div class="panel-head"><div class="panel-title">数据趋势</div><div class="panel-tools"><div class="tabs"><button class="tab ${state.metric==='exposure'?'active':''}" data-metric="exposure">曝光量</button><button class="tab ${state.metric==='interaction'?'active':''}" data-metric="interaction">互动量</button><button class="tab ${state.metric==='followers'?'active':''}" data-metric="followers">粉丝数</button></div><div class="tabs"><button class="tab ghost ${state.period===7?'active':''}" data-period="7">7 天</button><button class="tab ghost ${state.period===30?'active':''}" data-period="30">30 天</button><button class="tab ghost ${state.period===90?'active':''}" data-period="90">90 天</button></div></div></div><div class="chart-wrap">${Chart(DATA.trend[state.metric])}<div class="chart-note">示例数据 · 每日更新</div></div></div>
      <div class="side-stack">
        <div class="panel panel-pad"><div class="panel-head"><div class="panel-title">AI 今日洞察</div><button class="text-link" data-page="ai">查看全部 ›</button></div><div class="insight-list">
          ${[['↗','增长机会','知识类内容收藏率高于账号平均水平 36%。'],['△','需要关注','最近三篇内容的评论率有所下降。'],['✦','内容建议','未来 3 天建议继续发布知识型内容。'],['♧','互动建议','在结尾加入问题式 CTA，促进评论。']].map(x=>`<button class="insight" data-action="ask-insight" data-question="${esc(x[1])}"><span class="insight-icon">${x[0]}</span><span><h4>${x[1]}</h4><p>${x[2]}</p></span><span class="chev">›</span></button>`).join('')}
        </div></div>
        <div class="panel panel-pad"><div class="panel-head"><div class="panel-title">今日任务</div><button class="text-link" data-page="tasks">查看全部 ›</button></div><div class="tasks-mini"><div><strong style="color:var(--red)">${state.tasks.filter(t=>t.status==='待完成').length}</strong><span>待完成</span></div><div><strong>${state.tasks.filter(t=>t.status==='进行中').length}</strong><span>进行中</span></div><div><strong>${state.tasks.filter(t=>t.status==='已完成').length}</strong><span>已完成</span></div></div><div class="mini-task-list">${miniTasks.map(t=>`<div class="mini-task"><button class="checkbox ${t.status==='已完成'?'checked':''}" data-toggle-task="${t.id}">${t.status==='已完成'?'✓':''}</button><span>${esc(t.title)}</span><span class="badge ${t.priority==='高'?'high':t.priority==='低'?'low':'medium'}">${t.priority}</span><span>${t.due}</span></div>`).join('')}</div></div>
      </div>
      <div class="panel table-panel content-list"><div class="panel-head"><div class="panel-title">近期内容表现</div><button class="text-link" data-page="content">查看全部 ›</button></div>${PostTable(DATA.posts.slice(0,5),false)}</div>
    </section>
  </div>`
}

function PostTable(posts,full=true){
  return `<div class="table-wrap"><table class="table"><thead><tr>${full?'<th><input type="checkbox" data-action="select-all"></th><th>封面</th>':''}<th>内容标题</th><th>分类</th><th>发布时间</th><th>状态</th><th>曝光量</th><th>互动率</th>${full?'<th>操作</th>':''}</tr></thead><tbody>${posts.length?posts.map((p,i)=>`<tr>${full?`<td><input type="checkbox" class="post-select" data-post-index="${DATA.posts.indexOf(p)}" ${state.selectedPosts.includes(DATA.posts.indexOf(p))?'checked':''}></td><td><span class="thumb t${(DATA.posts.indexOf(p)%6)+1}"></span></td>`:''}<td><div class="post-cell">${!full?`<span class="thumb t${(i%6)+1}"></span>`:''}<span>${esc(p.title)}</span></div></td><td>${p.cat}</td><td>${p.date}</td><td><span class="badge ${p.status==='已发布'?'success':'gray'}">${p.status}</span></td><td>${p.status==='草稿'?'-':num(p.views)}</td><td>${p.status==='草稿'?'-':p.rate+'%'}</td>${full?'<td><button class="row-action" title="更多">•••</button></td>':''}</tr>`).join(''):`<tr><td colspan="10"><div class="empty"><strong>没有找到匹配内容</strong>尝试调整筛选条件或搜索关键词。</div></td></tr>`}</tbody></table></div>`
}

function Analytics(){
  return `<div class="page"><div class="page-head"><div><h1 class="page-title">数据分析</h1><div class="page-sub">从多个维度分析你的小红书账号表现，发现增长机会。</div></div><div class="head-actions"><button class="btn">${icon('export')}导出报告</button><button class="date-pill">${icon('calendar')}2024.12.01 - 2024.12.07⌄</button></div></div>
  <div class="subtabs"><button class="subtab active">整体概览</button><button class="subtab">内容分析</button><button class="subtab">粉丝分析</button><button class="subtab">互动分析</button></div>
  <div class="analytics-metrics">${[['曝光量','128,400','+23.1%',82],['互动量','84,230','+18.6%',70],['互动率','8.7%','+1.6%',64],['点赞','6,421','+12.3%',76]].map(m=>`<div class="panel analytics-metric"><div class="label">${m[0]}</div><strong>${m[1]}</strong><div class="metric-foot"><span class="up" style="font-size:10px">${m[2]} ↗</span><div class="mini-bar"><span style="width:${m[3]}%"></span></div></div></div>`).join('')}</div>
  <div class="panel panel-pad"><div class="panel-head"><div class="panel-title">趋势分析</div><div class="panel-tools"><select class="select" data-analytics-metric><option value="exposure">曝光量</option><option value="interaction">互动量</option><option value="followers">粉丝数</option></select><div class="tabs"><button class="tab ghost active">7 天</button><button class="tab ghost">30 天</button><button class="tab ghost">90 天</button></div></div></div><div class="chart-wrap">${Chart(DATA.trend.exposure)}</div></div>
  <div class="panel table-panel" style="margin-top:13px"><div class="panel-head"><div class="panel-title">内容排行榜</div><button class="text-link" data-page="content">查看全部 ›</button></div><div class="tabs" style="margin-bottom:9px"><button class="tab active">按曝光量</button><button class="tab">按互动量</button><button class="tab">按点赞数</button><button class="tab">按收藏数</button><button class="tab">按评论数</button></div>${PostTable([...DATA.posts].filter(p=>p.status==='已发布').sort((a,b)=>b.views-a.views).slice(0,6),false)}</div>
  </div>`
}

function filteredPosts(){
  let rows=[...DATA.posts];
  if(state.contentTab==='已发布') rows=rows.filter(p=>p.status==='已发布');
  if(state.contentTab==='草稿箱') rows=rows.filter(p=>p.status==='草稿');
  if(state.contentStatus!=='全部状态') rows=rows.filter(p=>p.status===state.contentStatus);
  if(state.contentCategory!=='全部分类') rows=rows.filter(p=>p.cat===state.contentCategory);
  if(state.contentQuery) rows=rows.filter(p=>p.title.toLowerCase().includes(state.contentQuery.toLowerCase()));
  if(state.contentSort==='曝光最高') rows.sort((a,b)=>b.views-a.views);
  return rows;
}
function Content(){
  const tabs=['全部','已发布','草稿箱','待发布','回收站']; const rows=filteredPosts();
  return `<div class="page"><div class="page-head"><div><h1 class="page-title">内容管理</h1><div class="page-sub">管理你的小红书笔记，查看数据表现，优化内容策略。</div></div><div class="head-actions"><button class="btn" data-action="bulk-analyze" ${state.selectedPosts.length?'':'disabled'}>${icon('spark')}AI 批量分析${state.selectedPosts.length?` (${state.selectedPosts.length})`:''}</button><button class="btn btn-primary" data-action="publish">${icon('plus')}发布笔记</button></div></div>
  <div class="subtabs">${tabs.map(t=>`<button class="subtab ${state.contentTab===t?'active':''}" data-content-tab="${t}">${t}</button>`).join('')}</div>
  <div class="panel content-shell"><div class="content-toolbar"><div class="filters"><select class="select" id="contentCategory"><option>全部分类</option>${['穿搭','成长','生活','美食','美妆','旅行'].map(x=>`<option ${state.contentCategory===x?'selected':''}>${x}</option>`).join('')}</select><select class="select" id="contentStatus"><option>全部状态</option><option ${state.contentStatus==='已发布'?'selected':''}>已发布</option><option ${state.contentStatus==='草稿'?'selected':''}>草稿</option></select><input class="filter-input" id="contentQuery" value="${esc(state.contentQuery)}" placeholder="搜索笔记标题..."/><select class="select" id="contentSort" style="margin-left:auto"><option>最新发布</option><option ${state.contentSort==='曝光最高'?'selected':''}>曝光最高</option></select></div></div><div class="content-table-wrap">${PostTable(rows,true)}</div><div class="pagination"><span class="pagination-meta">共 ${rows.length} 条</span><button class="page-dot">‹</button><button class="page-dot active">1</button><button class="page-dot">2</button><button class="page-dot">3</button><button class="page-dot">›</button></div></div>
  </div>`
}

function filteredTasks(){
  let rows=[...state.tasks];
  if(state.taskTab!=='全部任务') rows=rows.filter(t=>t.status===state.taskTab.replace('已延期','已延期'));
  if(state.taskType!=='任务类型') rows=rows.filter(t=>t.type===state.taskType);
  if(state.taskPriority!=='优先级') rows=rows.filter(t=>t.priority===state.taskPriority);
  if(state.taskStatus!=='状态') rows=rows.filter(t=>t.status===state.taskStatus);
  if(state.taskQuery) rows=rows.filter(t=>t.title.toLowerCase().includes(state.taskQuery.toLowerCase()));
  return rows;
}
function Tasks(){
  const rows=filteredTasks(); const counts={all:state.tasks.length,pending:state.tasks.filter(t=>t.status==='待完成').length,doing:state.tasks.filter(t=>t.status==='进行中').length,done:state.tasks.filter(t=>t.status==='已完成').length};
  return `<div class="page"><div class="page-head"><div><h1 class="page-title">任务中心</h1><div class="page-sub">将 AI 建议转化为可执行任务，持续提升账号表现。</div></div><button class="btn btn-primary" data-action="new-task">${icon('plus')}创建任务</button></div>
  <div class="subtabs">${['全部任务','待完成','进行中','已完成','已延期'].map(t=>`<button class="subtab ${state.taskTab===t?'active':''}" data-task-tab="${t}">${t}</button>`).join('')}</div>
  <div class="task-stats">${[[counts.all,'全部任务','#111827',100],[counts.pending,'待完成','#ff2442',Math.round(counts.pending/counts.all*100)],[counts.doing,'进行中','#2f7cf6',Math.round(counts.doing/counts.all*100)],[counts.done,'已完成','#18a46b',Math.round(counts.done/counts.all*100)]].map(s=>`<div class="panel task-stat" style="color:${s[2]}"><strong>${s[0]}</strong><span>${s[1]}</span><div class="progress"><i style="width:${s[3]}%"></i></div></div>`).join('')}</div>
  <div class="panel table-panel task-main"><div class="filters"><select class="select" id="taskType"><option>任务类型</option>${[...new Set(state.tasks.map(t=>t.type))].map(x=>`<option ${state.taskType===x?'selected':''}>${x}</option>`).join('')}</select><select class="select" id="taskPriority"><option>优先级</option>${['高','中','低'].map(x=>`<option ${state.taskPriority===x?'selected':''}>${x}</option>`).join('')}</select><select class="select" id="taskStatus"><option>状态</option>${['待完成','进行中','已完成'].map(x=>`<option ${state.taskStatus===x?'selected':''}>${x}</option>`).join('')}</select><input class="filter-input" id="taskQuery" value="${esc(state.taskQuery)}" style="margin-left:auto" placeholder="搜索任务..."/></div><div class="table-wrap"><table class="table"><thead><tr><th></th><th>任务标题</th><th>任务类型</th><th>优先级</th><th>状态</th><th>截止时间</th><th>负责人</th><th>操作</th></tr></thead><tbody>${rows.length?rows.map(t=>`<tr><td><button class="checkbox ${t.status==='已完成'?'checked':''}" data-toggle-task="${t.id}">${t.status==='已完成'?'✓':''}</button></td><td><div class="task-title-cell ${t.status==='已完成'?'done':''}">${esc(t.title)}</div></td><td>${t.type}</td><td><span class="badge ${t.priority==='高'?'high':t.priority==='低'?'low':'medium'}">${t.priority}</span></td><td><span class="badge ${t.status==='已完成'?'success':t.status==='进行中'?'low':'gray'}">${t.status}</span></td><td style="${t.due==='今天'?'color:#ff2442;font-weight:650':''}">${t.due}</td><td>${t.owner}</td><td><button class="row-action" data-action="task-menu" data-task="${t.id}">•••</button></td></tr>`).join(''):`<tr><td colspan="8"><div class="empty"><strong>暂无匹配任务</strong>调整筛选条件，或创建一个新任务。</div></td></tr>`}</tbody></table></div></div>
  </div>`
}

function Ideas(){
  const keywords=[['年度复盘',94,'+42%'],['冬季穿搭',86,'+31%'],['AI 效率工具',78,'+27%'],['早起习惯',63,'+18%'],['低卡晚餐',51,'+12%']];
  return `<div class="page"><div class="page-head"><div><h1 class="page-title">灵感库</h1><div class="page-sub">AI 根据近期趋势、账号画像与历史表现，为你筛选更值得做的内容方向。</div></div><button class="btn btn-primary" data-action="generate-ideas">${icon('spark')}生成灵感</button></div>
  <div class="ideas-grid"><div><div class="panel panel-pad"><div class="panel-head"><div class="panel-title">今日推荐选题</div><div class="tabs"><button class="tab active">高匹配</button><button class="tab">高热度</button><button class="tab">高收藏</button></div></div><div style="display:grid;gap:9px">${DATA.ideas.map((x,i)=>`<div class="idea-card" style="border:1px solid var(--line);border-radius:11px"><div class="idea-top"><div class="idea-icon">${x.icon}</div><div><div class="idea-title">${x.title}</div><div class="idea-desc">${x.desc}</div></div><div class="idea-score"><strong>${x.score}</strong><span>匹配分</span></div></div><div class="idea-tags">${x.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><div class="idea-actions"><button class="btn" data-action="idea-outline" data-idea="${i}">生成大纲</button><button class="btn" data-action="idea-task" data-idea="${i}">加入任务</button><button class="btn" data-page="ai">问问 AI</button></div></div>`).join('')}</div></div></div>
  <div class="side-stack"><div class="panel panel-pad"><div class="panel-head"><div class="panel-title">近期热词趋势</div><span style="font-size:9px;color:#98a2b3">近 7 天</span></div><div class="trend-keywords">${keywords.map(k=>`<div class="keyword-row"><span>${k[0]}</span><span class="keyword-bar"><i style="width:${k[1]}%"></i></span><b>${k[2]}</b></div>`).join('')}</div></div><div class="panel panel-pad"><div class="panel-title">选题策略建议</div><div class="message-rich" style="margin-top:10px;color:#667085">当前账号更适合采用「<strong>70% 稳定内容 + 20% 趋势内容 + 10% 实验内容</strong>」的组合。优先扩展已经验证过的成长与知识干货方向，再用趋势选题提高新增曝光。</div><button class="btn btn-primary" style="width:100%;margin-top:12px" data-page="ai">让 AI 帮我排下周选题</button></div></div></div>
  </div>`
}

function Settings(){
  return `<div class="page"><div class="page-head"><div><h1 class="page-title">账号设置</h1><div class="page-sub">配置账号资料、AI 工作偏好与消息提醒。</div></div></div><div class="settings-tabs">${['账号信息','AI 偏好','通知设置'].map(t=>`<button class="settings-tab ${state.settingsTab===t?'active':''}" data-settings-tab="${t}">${t}</button>`).join('')}</div>${state.settingsTab==='账号信息'?SettingsAccount():state.settingsTab==='AI 偏好'?SettingsAI():SettingsNotifications()}</div>`
}
function SettingsAccount(){return `<div class="settings-grid"><div class="panel settings-card"><div class="section-title">基本信息</div><div class="identity"><div class="avatar large"></div><div><strong>Alex</strong><span>个人创作者</span></div><button class="btn" style="margin-left:auto">更换头像</button></div><div class="field"><label>小红书账号名称</label><input id="accountName" value="Alex的成长笔记"/><div class="field-meta"><span>建议保持与小红书账号一致</span><span>8/20</span></div></div><div class="field"><label>账号 ID</label><input value="xhs_demo_001" disabled/></div><div class="field"><label>个人简介</label><textarea id="bioText">分享个人成长、效率工具和生活方式</textarea><div class="field-meta"><span>让 AI 更准确理解你的内容定位</span><span>16/100</span></div></div><button class="btn btn-primary" data-action="save-settings">保存修改</button></div><div class="panel preview-card"><div class="preview-cover"></div><div class="preview-body"><div class="avatar preview-avatar"></div><div class="preview-name">Alex的成长笔记</div><div class="preview-id">小红书号：xhs_demo_001</div><div class="preview-stats"><div><strong>2,846</strong><span>粉丝</span></div><div><strong>128,400</strong><span>近 7 天曝光</span></div><div><strong>8.7%</strong><span>互动率</span></div></div><div style="font-size:10px;color:#667085;margin-bottom:12px">分享个人成长、效率工具和生活方式</div><button class="follow">关注</button></div></div></div>`}
function SettingsAI(){return `<div class="settings-grid"><div class="panel settings-card"><div class="section-title">AI 工作方式</div><div class="switch-row"><div class="switch-copy"><strong>主动发现问题</strong><span>当数据出现异常时，AI 主动提醒并给出建议。</span></div><button class="switch ${state.aiProactive?'on':''}" data-toggle="aiProactive"></button></div><div class="switch-row"><div class="switch-copy"><strong>自动生成周复盘</strong><span>每周汇总账号增长、内容表现和下一步建议。</span></div><button class="switch ${state.weeklyReport?'on':''}" data-toggle="weeklyReport"></button></div><div class="field" style="margin-top:14px"><label>AI 回答风格</label><select class="select" style="width:100%;height:38px"><option>专业、简洁、可执行</option><option>详细分析型</option><option>创意脑暴型</option></select></div><div class="field"><label>优先增长目标</label><select class="select" style="width:100%;height:38px"><option>AI 根据阶段自动调整</option><option>曝光增长</option><option>互动增长</option><option>粉丝增长</option></select></div></div><div class="panel settings-card"><div class="section-title">AI 运营总监角色</div><div class="message-rich" style="color:#667085">AI 会以「运营总监」的方式持续理解账号数据、内容表现和任务进度。默认由 AI 负责分析、规划与提醒，涉及发布、删除、批量修改等关键操作时仍由你确认。</div><div style="margin-top:14px;padding:12px;border:1px solid var(--line);border-radius:10px;background:#fafbfc"><div style="font-size:10px;font-weight:700">当前工作原则</div><div style="font-size:9px;color:#98a2b3;line-height:1.8;margin-top:6px">• 先解释原因，再给行动建议<br>• 优先参考你自己的历史数据<br>• 建议必须尽量转化为任务<br>• 重要操作保持人工审批</div></div></div></div>`}
function SettingsNotifications(){return `<div class="settings-grid"><div class="panel settings-card"><div class="section-title">通知设置</div><div class="switch-row"><div class="switch-copy"><strong>站内通知</strong><span>任务到期、数据异常、AI 洞察更新时提醒。</span></div><button class="switch ${state.notifications?'on':''}" data-toggle="notifications"></button></div><div class="switch-row"><div class="switch-copy"><strong>每周复盘提醒</strong><span>每周一提醒查看上周复盘和本周计划。</span></div><button class="switch ${state.weeklyReport?'on':''}" data-toggle="weeklyReport"></button></div><div class="switch-row"><div class="switch-copy"><strong>增长机会提醒</strong><span>发现内容方向或热词机会时及时通知。</span></div><button class="switch on"></button></div></div><div class="panel settings-card"><div class="section-title">提醒强度</div><div class="field"><label>通知频率</label><select class="select" style="width:100%;height:38px"><option>仅重要提醒</option><option>标准</option><option>全部动态</option></select></div><div class="field"><label>免打扰时间</label><div style="display:flex;gap:7px"><input value="23:00"/><input value="08:00"/></div></div></div></div>`}

function AIPage(){return `<div class="app-shell">${Sidebar()}<main class="main ai-page"><div class="ai-page-head"><button class="icon-btn mobile-menu" data-action="mobile-menu">${icon('menu')}</button><div class="ai-page-title"><div class="robot">${icon('robot')}</div><div><h1>AI 运营总监 <span class="online">● 在线</span></h1><p>基于账号数据与运营策略，为你提供分析、规划和执行建议。</p></div></div><div class="ai-page-actions"><button class="btn" data-action="clear-chat">新建对话</button><button class="btn" data-page="dashboard">返回工作台</button></div></div><div class="ai-page-content"><div class="ai-quick-row">${['为什么最近流量下降？','分析最近 7 天的数据','推荐下周的内容选题','如何提升互动率？','帮我做本周复盘'].map(q=>`<button class="quick" data-quick="${esc(q)}">${q}</button>`).join('')}</div><div class="ai-conversation" id="aiMessages">${renderMessages(true)}</div></div><div class="ai-composer"><textarea id="aiPageInput" placeholder="输入你的问题，例如：帮我分析最近 7 天的数据…"></textarea><div class="composer-foot"><span>Shift + Enter 换行</span><button class="send-btn" data-action="send-ai" data-input="aiPageInput">${icon('send')}</button></div></div></main></div>${Overlays()}`}

function renderMessages(full=false){return state.messages.map((m,i)=>m.role==='user'?`<div class="message-row user"><div class="chat-bubble">${esc(m.text||'')}</div><div class="avatar"></div></div>`:`<div class="message-row"><div class="robot">${icon('robot')}</div><div class="chat-bubble ${m.rich?'message-rich':''}">${m.html||esc(m.text||'')}${m.actions?`<div class="message-actions"><button class="btn btn-primary" data-action="new-task">${icon('plus')}创建任务</button><button class="btn" data-page="analytics">查看数据分析</button></div>`:''}${i>0?'<div class="feedback"><button>♡</button><button>♧</button></div>':''}</div></div>`).join('')}

function AISidebar(){return `<aside class="ai-side"><div class="ai-side-head"><div class="avatar"></div><div><div class="ai-title">AI 运营总监 <span class="online">● 在线</span></div><div class="ai-role">基于数据的专业运营顾问</div></div><div class="ai-head-actions"><button class="plain-icon" data-page="ai">↗</button><button class="plain-icon" data-action="toggle-ai">${icon('x')}</button></div></div><div class="ai-side-body" id="aiSideBody"><div class="ai-welcome"><div class="avatar"></div><div class="chat-bubble">你好，Alex 👋<br>我会持续关注账号数据，并把值得处理的问题整理成可执行建议。</div></div><div class="quick-list">${['为什么最近流量下降？','分析最近 7 天的数据','我今天应该做什么？','哪些内容值得继续做？'].map(q=>`<button class="quick" data-quick="${q}">${q}</button>`).join('')}</div><div class="chat-time">今天 14:32</div>${renderMessages(false)}</div><div class="ai-composer"><textarea id="aiSideInput" placeholder="输入你的问题…"></textarea><div class="composer-foot"><span>Shift + Enter 换行</span><button class="send-btn" data-action="send-ai" data-input="aiSideInput">${icon('send')}</button></div></div></aside>`}

function Command(){const entries=[['dashboard','home','运营总览','查看账号整体表现'],['analytics','chart','数据分析','趋势、内容、粉丝与互动'],['content','content','内容管理','管理笔记与表现'],['tasks','task','任务中心','查看和推进运营任务'],['ideas','bulb','灵感库','发现选题与趋势'],['ai','robot','AI 运营总监','直接提问与生成策略']];return `<div class="command-overlay" data-action="close-command"><div class="command" onclick="event.stopPropagation()"><div class="command-search">${icon('search')}<input id="cmdInput" autofocus placeholder="搜索页面、内容或任务…"/><span class="kbd">ESC</span></div><div class="command-results"><div class="cmd-label">快速前往</div>${entries.map(e=>`<button class="cmd-item" data-page="${e[0]}">${navIcon(e[1])}<span>${e[2]}</span><span class="cmd-meta">${e[3]}</span></button>`).join('')}<div class="cmd-label">快捷操作</div><button class="cmd-item" data-action="new-task">${navIcon('task')}<span>创建运营任务</span><span class="cmd-meta">任务中心</span></button><button class="cmd-item" data-action="ask-analysis">${navIcon('spark')}<span>让 AI 分析最近 7 天</span><span class="cmd-meta">AI</span></button></div></div></div>`}
function TaskModal(prefill=''){return `<div class="modal-overlay"><div class="modal"><div class="modal-head"><h3>创建任务</h3><button class="modal-close" data-action="close-modal">×</button></div><div class="modal-body"><div class="form-grid"><div class="field full"><label>任务标题</label><input id="newTaskTitle" value="${esc(prefill)}" placeholder="例如：发布一篇年度复盘笔记"/></div><div class="field"><label>任务类型</label><select id="newTaskType" class="select" style="width:100%;height:36px"><option>内容发布</option><option>内容优化</option><option>数据分析</option><option>互动运营</option><option>内容策划</option></select></div><div class="field"><label>优先级</label><select id="newTaskPriority" class="select" style="width:100%;height:36px"><option>高</option><option selected>中</option><option>低</option></select></div><div class="field"><label>截止时间</label><select id="newTaskDue" class="select" style="width:100%;height:36px"><option>今天</option><option selected>明天</option><option>本周</option><option>12.10</option></select></div><div class="field"><label>负责人</label><input value="Alex" disabled/></div></div></div><div class="modal-foot"><button class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" data-action="save-task">创建任务</button></div></div></div>`}
function PeriodMenu(){return `<div class="modal-overlay"><div class="modal" style="width:360px"><div class="modal-head"><h3>选择分析周期</h3><button class="modal-close" data-action="close-modal">×</button></div><div class="modal-body"><div style="display:grid;gap:7px"><button class="cmd-item" data-period="7"><span>近 7 天</span><span class="cmd-meta">2024.12.01 - 12.07</span></button><button class="cmd-item" data-period="30"><span>近 30 天</span><span class="cmd-meta">更适合观察趋势</span></button><button class="cmd-item" data-period="90"><span>近 90 天</span><span class="cmd-meta">更适合阶段复盘</span></button></div></div></div></div>`}
function Overlays(){return `${state.overlay==='command'?Command():''}${state.overlay==='task'?TaskModal(state.taskPrefill||''):''}${state.overlay==='period'?PeriodMenu():''}<div class="toast-stack" id="toastStack"></div>`}

function route(){const app=document.getElementById('app'); app.innerHTML=state.page==='ai'?AIPage():Shell(pageContent(),{ai:state.page==='dashboard'}); bind();}
function pageContent(){return ({dashboard:Dashboard,analytics:Analytics,content:Content,tasks:Tasks,ideas:Ideas,settings:Settings}[state.page]||Dashboard)()}
function setPage(p){state.page=p;state.sidebarOpen=false;state.overlay=null;route();window.scrollTo(0,0)}
function saveTasks(){localStorage.setItem('growth_tasks',JSON.stringify(state.tasks))}
function toast(title,desc=''){const stack=document.getElementById('toastStack'); if(!stack)return; const el=document.createElement('div');el.className='toast';el.innerHTML=`<div class="toast-icon">✓</div><div><strong>${esc(title)}</strong>${desc?`<span>${esc(desc)}</span>`:''}</div>`;stack.appendChild(el);setTimeout(()=>el.remove(),2600)}

function aiResponse(q){
  const lower=q.toLowerCase();
  if(q.includes('7 天')||q.includes('数据')||q.includes('分析')) return {html:`<strong>最近 7 天的核心结论：</strong><ol><li>曝光量达到 <b>128,400</b>，较上周增长 <b>23.1%</b>。</li><li>知识干货与经验总结类内容的收藏表现最好。</li><li>评论率略有下降，建议在结尾增加问题式 CTA。</li></ol><strong>接下来建议：</strong> 保持 3–4 篇稳定更新，并优先复用已经验证过的知识型选题。`,rich:true,actions:true};
  if(q.includes('流量')||q.includes('下降')) return {html:`从当前演示数据看，整体曝光并没有下降，但<strong>最近 3 篇内容的评论深度偏弱</strong>。如果你指的是单篇笔记流量，我建议先检查：首图点击率、发布后 2 小时互动速度、关键词覆盖和账号内容一致性。`,rich:true,actions:true};
  if(q.includes('选题')||q.includes('内容')) return {html:`下周可以优先做 3 个方向：<ol><li><b>年底复盘</b>：收藏意图强，适合清单体。</li><li><b>AI 效率工具</b>：讨论度高，适合真实体验。</li><li><b>个人成长方法</b>：与你现有受众匹配度最高。</li></ol>我建议采用 70% 稳定内容 + 20% 趋势内容 + 10% 实验内容。`,rich:true,actions:true};
  if(q.includes('今天')||q.includes('任务')) return {html:`今天优先做这 3 件事：<ol><li>完成年度复盘笔记并发布。</li><li>复盘上周内容数据，记录高收藏结构。</li><li>回复 10 条高价值评论，提高互动深度。</li></ol>其中第 1 项对增长影响最大。`,rich:true,actions:true};
  return {html:`收到。我会优先结合账号历史表现、近期内容结构和当前任务状态来判断。就这个问题，建议先明确<strong>目标指标 → 找到影响变量 → 形成一个可验证动作</strong>，然后在 3–7 天后复盘结果。`,rich:true,actions:true};
}
function sendAI(inputId,forced){const input=document.getElementById(inputId);const q=forced||(input?input.value.trim():'');if(!q)return;state.messages.push({role:'user',text:q});const r=aiResponse(q);state.messages.push({role:'assistant',...r});if(input)input.value='';route();setTimeout(()=>{const el=document.getElementById(state.page==='ai'?'aiMessages':'aiSideBody');if(el)el.scrollTop=el.scrollHeight},0)}

function bind(){
  document.querySelectorAll('[data-page]').forEach(el=>el.onclick=()=>setPage(el.dataset.page));
  document.querySelectorAll('[data-metric]').forEach(el=>el.onclick=()=>{state.metric=el.dataset.metric;route()});
  document.querySelectorAll('[data-period]').forEach(el=>el.onclick=()=>{state.period=Number(el.dataset.period);state.overlay=null;route();toast('分析周期已切换',`当前显示近 ${state.period} 天视图（演示数据）`)});
  document.querySelectorAll('[data-content-tab]').forEach(el=>el.onclick=()=>{state.contentTab=el.dataset.contentTab;route()});
  document.querySelectorAll('[data-task-tab]').forEach(el=>el.onclick=()=>{state.taskTab=el.dataset.taskTab;route()});
  document.querySelectorAll('[data-settings-tab]').forEach(el=>el.onclick=()=>{state.settingsTab=el.dataset.settingsTab;route()});
  document.querySelectorAll('[data-toggle-task]').forEach(el=>el.onclick=()=>{const t=state.tasks.find(x=>x.id===Number(el.dataset.toggleTask));if(!t)return;t.status=t.status==='已完成'?'待完成':'已完成';saveTasks();route();toast(t.status==='已完成'?'任务已完成':'任务恢复为待完成',t.title)});
  document.querySelectorAll('[data-toggle]').forEach(el=>el.onclick=()=>{state[el.dataset.toggle]=!state[el.dataset.toggle];route();toast('设置已更新')});
  document.querySelectorAll('.post-select').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.postIndex); if(el.checked){if(!state.selectedPosts.includes(i))state.selectedPosts.push(i)}else state.selectedPosts=state.selectedPosts.filter(x=>x!==i); route()});
  document.querySelectorAll('[data-quick]').forEach(el=>el.onclick=()=>sendAI(state.page==='ai'?'aiPageInput':'aiSideInput',el.dataset.quick));
  document.querySelectorAll('[data-action="ask-insight"]').forEach(el=>el.onclick=()=>{state.aiOpen=true;route();setTimeout(()=>sendAI('aiSideInput',`请详细解释：${el.dataset.question}`),20)});
  document.querySelectorAll('[data-action]').forEach(el=>{
    const a=el.dataset.action;
    if(a==='command') el.onclick=()=>{state.overlay='command';route();setTimeout(()=>document.getElementById('cmdInput')?.focus(),10)};
    if(a==='close-command') el.onclick=()=>{state.overlay=null;route()};
    if(a==='new-task') el.onclick=()=>{state.overlay='task';state.taskPrefill='';route()};
    if(a==='close-modal') el.onclick=()=>{state.overlay=null;route()};
    if(a==='period-menu') el.onclick=()=>{state.overlay='period';route()};
    if(a==='toggle-ai') el.onclick=()=>{state.aiOpen=!state.aiOpen;route()};
    if(a==='mobile-menu') el.onclick=()=>{state.sidebarOpen=!state.sidebarOpen;route()};
    if(a==='save-settings') el.onclick=()=>toast('账号信息已保存','演示版已完成前端交互');
    if(a==='notification') el.onclick=()=>toast('暂无新的重要通知','最近一次 AI 洞察已在运营总览展示');
    if(a==='publish') el.onclick=()=>toast('发布流程已预留','下一阶段可接入小红书发布与审批流程');
    if(a==='bulk-analyze') el.onclick=()=>{if(state.selectedPosts.length){state.page='ai';state.messages.push({role:'user',text:`分析我选中的 ${state.selectedPosts.length} 篇内容`});state.messages.push({role:'assistant',...aiResponse('分析数据')});route()}};
    if(a==='generate-ideas') el.onclick=()=>toast('已生成 4 个新选题','根据账号画像与近期趋势排序');
    if(a==='idea-outline') el.onclick=()=>{const x=DATA.ideas[Number(el.dataset.idea)];state.page='ai';state.messages.push({role:'user',text:`请为「${x.title}」生成小红书笔记大纲`});state.messages.push({role:'assistant',html:`可以。这个选题建议采用「<strong>痛点开场 → 3 个核心方法 → 个人案例 → 问题式 CTA</strong>」的结构。<br><br>我已经把方向带到 AI 对话页，你可以继续让我扩写标题、正文和首图文案。`,rich:true,actions:true});route()};
    if(a==='idea-task') el.onclick=()=>{const x=DATA.ideas[Number(el.dataset.idea)];state.overlay='task';state.taskPrefill=`制作选题：${x.title}`;route()};
    if(a==='clear-chat') el.onclick=()=>{state.messages=[initial.messages[0]];route();toast('已创建新对话')};
    if(a==='send-ai') el.onclick=()=>sendAI(el.dataset.input);
    if(a==='ask-analysis') el.onclick=()=>{state.overlay=null;state.page='ai';state.messages.push({role:'user',text:'分析最近 7 天的数据'});state.messages.push({role:'assistant',...aiResponse('分析最近 7 天的数据')});route()};
    if(a==='save-task') el.onclick=()=>{const title=document.getElementById('newTaskTitle')?.value.trim();if(!title){toast('请输入任务标题');return}state.tasks.unshift({id:Date.now(),title,type:document.getElementById('newTaskType').value,priority:document.getElementById('newTaskPriority').value,status:'待完成',due:document.getElementById('newTaskDue').value,owner:'Alex'});saveTasks();state.overlay=null;state.taskPrefill='';route();toast('任务已创建',title)};
  });
  const cq=document.getElementById('contentQuery'); if(cq)cq.oninput=e=>{state.contentQuery=e.target.value;debouncedRoute()};
  const cc=document.getElementById('contentCategory');if(cc)cc.onchange=e=>{state.contentCategory=e.target.value;route()};
  const cs=document.getElementById('contentStatus');if(cs)cs.onchange=e=>{state.contentStatus=e.target.value;route()};
  const csort=document.getElementById('contentSort');if(csort)csort.onchange=e=>{state.contentSort=e.target.value;route()};
  const tq=document.getElementById('taskQuery');if(tq)tq.oninput=e=>{state.taskQuery=e.target.value;debouncedRoute()};
  const tt=document.getElementById('taskType');if(tt)tt.onchange=e=>{state.taskType=e.target.value;route()};
  const tp=document.getElementById('taskPriority');if(tp)tp.onchange=e=>{state.taskPriority=e.target.value;route()};
  const ts=document.getElementById('taskStatus');if(ts)ts.onchange=e=>{state.taskStatus=e.target.value;route()};
  const sideInput=document.getElementById('aiSideInput');if(sideInput)sideInput.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAI('aiSideInput')}};
  const pageInput=document.getElementById('aiPageInput');if(pageInput)pageInput.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAI('aiPageInput')}};
}
let debounceTimer;function debouncedRoute(){clearTimeout(debounceTimer);debounceTimer=setTimeout(()=>{const active=document.activeElement?.id;const pos=document.activeElement?.selectionStart;route();if(active){const el=document.getElementById(active);if(el){el.focus();if(typeof pos==='number')el.setSelectionRange(pos,pos)}}},160)}
window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();state.overlay='command';route();setTimeout(()=>document.getElementById('cmdInput')?.focus(),10)}if(e.key==='Escape'&&state.overlay){state.overlay=null;route()}})
route();
