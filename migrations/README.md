# 第 6 课数据库迁移

## 当前状态

项目当前仍使用 Node 原生 HTTP 和 `.data/store.json`，本机尚未配置 PostgreSQL 客户端、服务或 `DATABASE_URL`。因此迁移文件已生成，但没有执行。

## 前置条件

迁移依赖认证服务已经维护：

```sql
public.users(id TEXT PRIMARY KEY)
```

迁移不会创建用户表，不会保存密码，也不会删除或覆盖 `.data/store.json`。

## 预检

配置本地 PostgreSQL 后，先确认连接和认证用户表：

```sql
SELECT current_database(), current_user;
SELECT to_regclass('public.users');
```

只有 `public.users` 存在且连接目标确认是本地开发库时，才可以执行：

```powershell
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_lesson6_user_generation_credits.sql
```

## 执行后检查

```sql
SELECT to_regclass('public.user_profiles');
SELECT to_regclass('public.generation_records');
SELECT to_regclass('public.credit_accounts');
SELECT to_regclass('public.credit_ledger');

SELECT conname
FROM pg_constraint
WHERE conrelid IN (
  'public.generation_records'::regclass,
  'public.credit_accounts'::regclass,
  'public.credit_ledger'::regclass
);
```

## 数据保留策略

执行迁移前备份 `.data/store.json`。现有用户、账号、内容、任务和订阅数据需要通过单独的导入脚本迁移；本 SQL 文件只建立结构，不自动导入或删除业务数据。

积分初始化时应写入 `migration_opening_balance` 流水，之后所有每日赠送、预留、扣除和释放都必须使用唯一 `idempotency_key`。
