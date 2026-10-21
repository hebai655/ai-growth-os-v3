'use strict';
const { facts, result } = require('./agent-clone-core.cjs');

function run(input = {}) {
  const { known, assumptions } = facts(input);
  const brand = known.brand || known.product || '待补充品牌';
  const audience = known.audience || '待补充目标受众';
  return result('content-strategist', '内容策略与多平台创作方案', {
    strategy: { goal: known.goal || '建立认知并推动行动', audience, message: `${brand}为${audience}解决一个明确问题` },
    framework: ['品牌定位', '用户需求', '内容支柱', '平台分工', '发布节奏'],
    creation: { hook: '从具体场景或问题切入', structure: ['核心观点', '事实证据', '方法步骤', '行动引导'], formats: ['公众号长文', '小红书笔记', '短视频脚本', '品牌故事'] },
    adaptation: { xiaohongshu: '高密度场景、标题和收藏价值', wechat: '完整论证和关系沉淀', shortVideo: '前三秒钩子、口语化表达和明确行动' },
    review: ['核对事实与来源', '检查逻辑和平台适配度', '记录发布、互动和转化指标']
  }, { facts: Object.keys(known), assumptions });
}

module.exports = { run };
