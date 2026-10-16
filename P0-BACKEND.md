# P0 内测后端说明

当前本地内测后端使用 Node 原生 HTTP 服务和 `.data/store.json` 文件适配器。`.data/` 已加入 Git 忽略，后续迁移到 PostgreSQL 时保留同一组领域字段即可。

## 数据模型

- `users`：邮箱、密码摘要、创建时间
- `sessions`：服务端 HttpOnly 会话、过期时间
- `accounts`：用户账号、平台、绑定状态、权限和授权时间
- `contents`：用户内容和生命周期字段
- `tasks`：用户任务和执行字段
- `aiCalls`：模型、状态、延迟、输入/输出 token、估算成本
- `oauthStates`：一次性授权状态，10 分钟过期

## 接口

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/session`
- `POST /api/auth/logout`
- `GET /api/data`
- `PUT /api/data`
- `GET /api/ai/usage`
- `POST /api/ai`
- `POST /api/ai/generate`
- `GET /api/ai/providers`
- `POST /api/ai/provider`
- `POST /api/ai/provider/test`
- `GET /api/analytics?range=7d`
- `POST /api/account/sync`
- `GET /api/notifications`
- `POST /api/content/publish`
- `POST /api/content/publish/retry`
- `POST /api/content/publish/fail`
- `GET /api/account/oauth/start`
- `GET /api/account/oauth/callback`

所有接口统一返回 `{ ok, data }` 或 `{ ok:false, error:{ code, message } }`。AI 目前仍使用 DeepSeek 服务端代理，账号 OAuth 回调是本地内测模拟适配器，接入正式小红书授权时替换该适配器即可。

## 内测边界

本地文件适配器用于验证产品闭环，不适合多实例部署。正式内测前需要替换数据库、加入 HTTPS、密码找回、CSRF 防护、审计日志、正式小红书 OAuth 和后台任务队列。
