# AI Growth OS V3

这是根据小红书 AI Growth OS 六屏 UI 继续完善的高保真前端版本。

## 运行方式

无需安装依赖：

1. 解压文件。
2. 直接双击 `index.html`。
3. 或在目录下启动任意静态服务器。

例如：

```bash
python -m http.server 8080
```

然后浏览器打开 `http://localhost:8080`。

## V3 重点完善

- 运营总览、数据分析、内容管理、任务中心、灵感库、账号设置、AI 运营总监完整页面。
- 桌面端三栏布局：左侧导航 + 主工作区 + AI 运营总监。
- 多断点响应式布局。
- Ctrl / Cmd + K 全局命令面板。
- AI 快捷提问、对话模拟、洞察转任务。
- 内容筛选、搜索、排序、批量选择。
- 任务筛选、创建、完成状态和 localStorage 持久化。
- 灵感推荐、选题大纲、选题转任务。
- 账号设置 / AI 偏好 / 通知设置。
- SVG 趋势图和数据卡片。
- Modal、Toast、移动端侧边栏等完整交互细节。

## 下一阶段建议

这版仍是「高保真前端原型」。进入正式产品开发时建议迁移到：

- React + TypeScript + Vite
- React Router
- TanStack Query
- Zustand
- Recharts / ECharts
- 后端 API + PostgreSQL
- AI Agent 服务层
- 小红书数据授权/采集方案

其中小红书真实数据接入、自动发布等能力需要根据可用官方能力、授权与合规方案设计，不能仅靠前端实现。
