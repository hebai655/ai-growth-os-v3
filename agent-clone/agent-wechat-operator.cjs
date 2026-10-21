'use strict';
const { facts, result, list } = require('./agent-clone-core.cjs');

function run(input = {}) {
  const { known, assumptions } = facts(input);
  const account = known.account || known.brand || '待补充公众号';
  const audience = known.audience || '待补充读者';
  const topics = list(known.topics);
  return result('wechat-operator', '微信公众号运营方案', {
    diagnosis: { account, audience, stage: known.stage || '待确认', priority: '先明确定位和业务目标，再安排栏目与文章' },
    contentPillars: ['问题解决', '专业知识', '案例复盘', '用户关系'],
    editorialCalendar: topics.length ? topics : ['行业问题解释', '用户常见误区', '案例或方法拆解', '产品与服务答疑'],
    article: { titleOptions: ['明确读者和结果', '问题 + 方法', '场景 + 观点'], outline: ['开头结论', '事实和证据', '方法步骤', '行动引导'] },
    growth: ['阅读和打开率', '读完率', '互动率', '关注转化', '取消关注', '用户分层与自动回复'],
    review: ['区分内容增长、用户关系和商业转化', '为下一轮设定验证指标']
  }, { facts: Object.keys(known), assumptions });
}

module.exports = { run };
