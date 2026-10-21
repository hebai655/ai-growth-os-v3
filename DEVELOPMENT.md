# Development Notes

## 当前技术栈和运行方式

- 前端：`dist/app.js`、`dist/styles.css`，原生 JavaScript 和 CSS。
- 服务端：Node.js 原生 `http`，入口为 `preview-server.cjs`。
- 启动命令：`npm start`；健康检查：`GET /api/health`。
- 每个请求都会返回 `X-Request-Id`，可用于排查服务端错误和 AI 调用链路。
- 当前本地持久化：`.data/store.json`。
- 当前没有 `package.json`、TypeScript、Lint、Build 或自动化测试脚本。
- `migrations/001_lesson6_user_generation_credits.sql` 已生成，但本机没有可用 PostgreSQL 客户端或 `DATABASE_URL`，迁移尚未执行。

## 用户系统

- 注册、邮箱验证、登录、Session 恢复和退出均由服务端处理。
- 密码使用 `crypto.scrypt` 摘要保存，不保存明文密码。
- Session 使用 HttpOnly、SameSite=Lax Cookie；生产环境增加 Secure 属性。
- 受保护页面和 API 从服务端 Session 获取用户 ID，不信任前端提交的 `userId`。
- 用户数据、内容、任务、历史记录和积分均按当前用户 ID 隔离。
- 用户中心读取服务端邮箱、昵称、会员等级、积分和成功生成次数。

## 第 5 课：真实 AI 生成

- 正式路径：`POST /api/ai/generate`。
- 当前供应商：DeepSeek，模型由服务端 `DEEPSEEK_MODEL` 配置，默认 `deepseek-chat`。
- API Key 只从服务端 `.env` 读取，`.env` 和 `.data/` 已加入 `.gitignore`。
- 服务端校验输入、平台、标题数量、标题结构、长度和重复标题。
- 成功结果保存到 `generationRecords`，包含用户 ID、原始输入、平台、内容类型、requestId、生成时间、结果和状态。
- AI 失败或结构校验失败不会写入成功历史，也不会扣积分。

## 第 6 课：积分规则

- 新用户服务端初始积分：10。
- 每次成功生成固定 10 个标题，扣 1 积分。
- AI 配置错误、供应商错误、超时、结构校验失败和余额不足均不扣积分。
- 余额不足返回 `INSUFFICIENT_CREDITS`，余额不会低于 0。
- 生成扣费写入 `usageRecords` 和 `creditLedger`，流水类型为 `generation_charge`，关联稳定 requestId。
- 相同用户和 requestId 重试会返回原生成结果，不重复扣费。
- 当前单进程服务使用用户级并发锁；同一用户同时发起生成时，一个请求执行，其他请求返回 `GENERATION_IN_PROGRESS`。

## 每日赠送

- 统一按 `Asia/Shanghai` 计算自然日。
- 每个用户每天赠送 2 积分，登录、Session 恢复或受保护 API 访问会触发检查。
- `creditGrants` 使用用户和日期作为等效唯一键。
- `creditLedger` 写入 `daily_grant` 流水，包含原因、日期、时区、幂等键和余额快照。
- 同日刷新、重复登录和并发请求不会重复赠送；下一自然日才会再次赠送。

## 基础会员权限

- 会员等级由服务端订阅记录判定：`FREE` 或 `PRO`。
- `FREE` 可使用基础 AI 标题生成。
- `PRO` 可使用高级风格：故事叙事、数据驱动、反常识观点和高级质感。
- 服务端忽略客户端提交的 `membership`、`role` 和积分字段。
- 普通用户使用高级风格返回 `MEMBERSHIP_REQUIRED`。
- 当前没有允许普通用户修改自身角色或会员等级的接口。
- 没有真实支付、支付回调或已支付订单。

## 本次最终验收结果

- 注册、邮箱验证、登录、Session 恢复和退出：通过。
- 未登录接口保护和退出后访问保护：通过。
- A、B 用户数据和历史记录隔离：通过。
- 真实 AI 返回 10 条标题并保存历史：通过。
- 历史记录倒序、分页、详情和复制：通过。
- AI 配置失败不扣积分：通过。
- 余额为 0 拒绝生成：通过。
- 相同 requestId 重放不重复扣费：通过；真实测试余额保持 11。
- 并发生成：一个成功、另一个返回 `GENERATION_IN_PROGRESS`，余额保持非负。
- 每日赠送同日幂等、下一日可再次领取：通过。
- FREE/PRO 服务端权限差异：通过。
- 扣费流水和每日赠送流水均写入 `creditLedger`，余额快照非负：通过。
- `node --check`：前端、服务端、存储模块和 Prompt 文件通过。
- TypeScript、Lint、Build、自动化测试：未执行，项目没有对应配置或脚本。
- PostgreSQL 迁移：未执行，本机没有 PostgreSQL 客户端和连接配置。

## 已知限制和后续任务

1. `.data/store.json` 适合本地教学和单进程内测，不提供多实例数据库事务能力。
2. 用户级并发锁是进程内锁，服务重启或多实例部署需要 Redis 或 PostgreSQL 锁。
3. PostgreSQL 迁移需要先确认本地数据库和 `public.users`，再执行迁移和数据导入。
4. 邮箱验证在本地开发模式返回一次性验证链接；生产环境需关闭 `AUTH_DEV_MODE` 并接入邮件服务。
5. 小红书授权仍是本地内测适配器，不是正式平台 OAuth。
6. 支付、订单回调、正式套餐计费和团队商业权限留到后续课程。

本次验收没有提交或推送 GitHub。
