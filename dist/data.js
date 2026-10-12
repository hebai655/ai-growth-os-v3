/* Shared demo state. Mutations stay in this browser; no account is connected. */
const Growth = (() => {
  const key = 'growth-os-demo-v1';
  const defaults = {
    profile: {name:'Alex的成长笔记', id:'XHS_DEMO_001', bio:'分享个人成长、效率工具和生活方式'},
    preferences: {action:true, digest:true, reminders:false},
    tasks: [
      ['发布一篇知识型内容','高','待完成','今天','AI 推荐'],
      ['优化三篇内容标题','中','待完成','今天','AI 推荐'],
      ['分析评论下降原因','高','进行中','明天','AI 推荐'],
      ['准备下周内容选题','低','进行中','10.15','手动创建'],
      ['整理评论区高频问题','中','待完成','10.14','AI 推荐'],
      ['拍摄教程系列封面','中','待完成','10.15','手动创建'],
      ['测试晚间发布时间','低','待完成','10.16','AI 推荐'],
      ...['发布本周复盘','优化账号简介','回复核心粉丝评论','整理封面模板','检查笔记标签','归档历史内容','记录上周数据','完成选题调研'].map((title,i)=>[title,i%2?'中':'低','已完成','10.11','手动创建'])
    ],
    notes: [
      {id:1,title:'普通人如何开始做个人 IP？',category:'职场',date:'2026.10.12',status:'已发布',views:32400,likes:1702,saves:921,comments:214,rate:9.1,cover:0},
      {id:2,title:'我用这 3 个方法提升内容质量',category:'效率工具',date:'2026.10.10',status:'已发布',views:18230,likes:1045,saves:608,comments:162,rate:9.8,cover:1},
      {id:3,title:'小红书流量逻辑到底是什么？',category:'运营经验',date:'2026.10.08',status:'已发布',views:12680,likes:398,saves:420,comments:95,rate:7.2,cover:2},
      {id:4,title:'打工人快速早餐｜5 分钟搞定',category:'生活',date:'2026.10.06',status:'已发布',views:11820,likes:518,saves:226,comments:61,rate:6.8,cover:3},
      {id:5,title:'我的书架好物分享',category:'生活',date:'2026.10.04',status:'已发布',views:9420,likes:274,saves:253,comments:48,rate:6.1,cover:4},
      {id:6,title:'下一篇教程：如何找到自己的内容定位',category:'运营经验',date:'2026.10.12',status:'草稿',views:0,likes:0,saves:0,comments:0,rate:0,cover:5}
    ],
    ideas: [
      {title:'从 0 到 1 的个人 IP 教程',tag:'趋势机会',description:'教程类内容表现高于平均 34%，适合把入门方法扩展成一个连续系列。',category:'教程'},
      {title:'把评论问题变成运营清单',tag:'评论灵感',description:'整理评论区的高频问题，以真实案例回答，把内容变成可收藏的实用清单。',category:'运营经验'},
      {title:'一天里的 3 个效率工具',tag:'生活方式',description:'把效率工具放进真实使用场景，让用户看到方法如何帮助日常创作。',category:'效率工具'},
      {title:'一个失败案例的真实复盘',tag:'个人 IP',description:'从一次具体的失误说起，分享调整过程和可复用的经验。',category:'复盘'},
      {title:'封面信息密度测试',tag:'增长实验',description:'测试简洁、中等和密集三种封面，记录点击率与收藏率的差异。',category:'实验'},
      {title:'把读书笔记变成 5 个行动',tag:'待完善',description:'从最近的一本书中选 5 个方法，用自己的体验补充实际使用建议。',category:'读书'}
    ]
  };
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(key)); } catch {}
  const data = saved && saved.version === 1 ? saved.data : structuredClone(defaults);
  const state = {view:'dashboard',period:7,metric:'曝光量',analyticsTab:'整体概览',settingsTab:'账号信息',ranking:'views',taskStatus:'全部状态',taskPriority:'全部优先级',taskSource:'全部来源',taskSearch:'',contentCategory:'全部分类',contentStatus:'全部状态',contentSearch:'',contentSort:'最新发布'};
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = value => Number(value).toLocaleString('en-US');
  function save(){try{localStorage.setItem(key,JSON.stringify({version:1,data}));return true;}catch{return false;}}
  const paths = {dashboard:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',analytics:'M5 20V10 M12 20V4 M19 20v-8',content:'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5',tasks:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M7 12l3 3 7-7',ideas:'M9 18h6 M10 21h4 M8 15a7 7 0 1 1 8 0l-1 2H9z',settings:'M12 3l2 2 3-.2 1 3 3 1v6l-3 1-1 3-3-.2-2 2-2-2-3 .2-1-3-3-1V9l3-1 1-3 3 .2z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',search:'M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15 M16 16l5 5',bell:'M5 9a7 7 0 0 1 14 0c0 7 2 7 2 9H3c0-2 2-2 2-9 M9 21h6',calendar:'M4 5h16v16H4z M8 2v6 M16 2v6 M4 10h16',chart:'M3 3v18h18 M6 15l5-5 4 3 5-7',arrow:'M5 12h14 M14 7l5 5-5 5'};
  const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+(paths[name]||paths.chart)+'"/></svg>';
  const navigation = [['dashboard','运营总览'],['analytics','数据分析'],['content','内容管理'],['tasks','任务中心'],['ideas','灵感库'],['settings','账号设置']];
  return {data,state,escape,num,save,icon,navigation};
})();
