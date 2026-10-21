-- 第 6 课：用户资料、生成记录、积分账户和积分流水
-- 前置条件：认证迁移已经提供 public.users(id)。本文件不创建用户表，也不保存密码。
-- 安全策略：迁移使用显式 CREATE；如果目标表已存在但结构不一致，应停止并人工检查。

BEGIN;

CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT NOT NULL DEFAULT '',
  timezone TEXT NOT NULL DEFAULT 'Asia/Shanghai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE generation_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  request_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  input_text TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL,
  result_json JSONB,
  title_count INTEGER NOT NULL DEFAULT 0,
  credits_reserved INTEGER NOT NULL DEFAULT 0,
  credits_charged INTEGER NOT NULL DEFAULT 0,
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  latency_ms INTEGER,
  CONSTRAINT generation_records_user_request_unique UNIQUE (user_id, request_id),
  CONSTRAINT generation_records_status_check CHECK (status IN ('processing', 'succeeded', 'failed', 'unknown')),
  CONSTRAINT generation_records_title_count_check CHECK (title_count >= 0),
  CONSTRAINT generation_records_reserved_check CHECK (credits_reserved >= 0),
  CONSTRAINT generation_records_charged_check CHECK (credits_charged >= 0)
);

CREATE TABLE credit_accounts (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  balance INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT credit_accounts_balance_check CHECK (balance >= 0),
  CONSTRAINT credit_accounts_version_check CHECK (version >= 0)
);

CREATE TABLE credit_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  generation_id TEXT REFERENCES generation_records(id),
  delta INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT credit_ledger_balance_check CHECK (balance_after >= 0),
  CONSTRAINT credit_ledger_type_check CHECK (type IN (
    'daily_grant',
    'generation_reserve',
    'generation_charge',
    'generation_release',
    'migration_opening_balance'
  ))
);

CREATE INDEX generation_records_user_created_idx
  ON generation_records (user_id, created_at DESC);

CREATE INDEX generation_records_user_input_hash_idx
  ON generation_records (user_id, input_hash);

CREATE INDEX credit_ledger_user_created_idx
  ON credit_ledger (user_id, created_at DESC);

CREATE INDEX credit_ledger_generation_idx
  ON credit_ledger (generation_id);

COMMIT;
