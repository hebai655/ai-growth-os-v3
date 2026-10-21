'use strict';
const { facts, result, list } = require('./agent-clone-core.cjs');

function run(input = {}) {
  const { known, assumptions } = facts(input);
  const mode = known.mode || 'note';
  const samples = list(known.samples || known.notes);
  return result('xhs-analyzer', '小红书数据拆解报告', {
    scope: { mode, target: known.url || known.accountId || known.keyword || '待补充链接、账号或关键词', sampleCount: samples.length || '待接口返回' },
    factsToCollect: ['粉丝与互动', '发布时间', '标题和关键词', '内容结构', '评论反馈', '样本量和统计时间'],
    analysis: ['选题与用户需求', '标题承诺是否兑现', '内容结构与互动关系', '竞品或达人匹配度', '投放与内容动作'],
    deliverables: ['带图片的 HTML 报告', 'Excel 数据表', '结论、证据、推断和行动建议'],
    metricDefinitions: ['统计时间', '互动量', '阅读量', '样本量', '数据来源'],
    limits: ['只使用平台接口实际返回数据', '数据缺失时明确标注', '不承诺销售、转化或合作效果', '不提供刷量、养号和批量搬运操作']
  }, { facts: Object.keys(known), assumptions, toVerify: ['平台接口可用性', '链接是否触发风控', '样本量是否足够'] });
}

module.exports = { run };
