'use strict';
const { facts, result, list } = require('./agent-clone-core.cjs');

function run(input = {}) {
  const { known, assumptions } = facts(input);
  const audience = known.audience || known.targetAudience || '待补充目标人群';
  const product = known.product || known.brand || '待补充品牌或产品';
  const goal = known.goal || '提升内容触达并积累有效互动';
  const topics = list(known.topics || known.topicPool);
  return result('xhs-operator', '小红书运营方案', {
    accountPositioning: {
      oneLine: `${product}｜面向${audience}｜围绕${goal}`,
      contentPillars: ['用户问题解决', '真实使用场景', '案例与方法', '互动答疑'],
      differentiation: '以真实素材和可验证结果建立信任'
    },
    topicPlan: topics.length ? topics : ['用户最常见的一个问题', '使用前后对比', '选购或避坑指南', '真实案例拆解', '评论区高频问题'],
    noteTemplate: {
      titleOptions: ['把一个具体结果写进标题', '用户痛点 + 解决方式', '场景 + 可验证收益'],
      body: ['开场：直接说用户场景', '正文：问题、方法、证据、步骤', '结尾：给出低门槛行动引导'],
      tags: ['按品类', '按场景', '按人群'],
      cover: '突出一个结果或核心问题，避免信息堆叠'
    },
    operationReview: ['检查标题承诺是否被正文兑现', '记录曝光、点赞、收藏、评论、关注和转化', '下一轮只调整一个变量'],
    executionGate: '发布、评论、回复、点赞、收藏等改变账号状态的动作需要本次明确确认。'
  }, { facts: Object.keys(known), assumptions });
}

module.exports = { run };
