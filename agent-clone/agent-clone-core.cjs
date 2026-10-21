'use strict';

function facts(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const known = {};
  const assumptions = [];
  for (const [key, value] of Object.entries(raw)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') known[key] = value;
    else assumptions.push(key);
  }
  return { known, assumptions };
}

function result(agent, title, sections, meta = {}) {
  return {
    agent,
    title,
    sections,
    meta: {
      facts: meta.facts || [],
      assumptions: meta.assumptions || [],
      toVerify: meta.toVerify || [],
      generatedAt: new Date().toISOString()
    }
  };
}

function list(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return [];
  return String(value).split(/[,，\n]/).map((item) => item.trim()).filter(Boolean);
}

module.exports = { facts, result, list };
