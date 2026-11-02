# Mobius

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0f74ca8](https://github.com/nutshellai-tech/mobius/tree/0f74ca8412f42f65bcb68c7cd2be7f4978acef29)

<!-- BEGIN META -->
[![GitHub ★ 208](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=208&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nutshellai-tech/mobius)
<!-- END META -->

> **功能**：以项目工作台连接团队、编码 Agent、模型与设备，组织会话、任务、知识和执行记录。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多项目成员、模型白名单、会话消息和不同Agent记录集中，降低人工跨终端跟踪的组织负担。此为工作台与适配层贡献，不把上游Agent编程或自进化演示当已验业务效果。

> **主要限制**：[Q02](#research-q02) RPC超时不取消执行，失败／stop后setIdle不证进程树停止；[Q03](#research-q03) download允许共享tmp/upload且词法路径非symlink隔离，模型限制仅新Session。正式团队接管须先解决授权、UNKNOWN结果和恢复，不能据JWT或界面角色承诺租户安全。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 固定根工作台向谁交付什么，迁仓和自进化怎样界定？](#detail-section-11)
  - [Q02 · 用户到会话与DSH投递如何接线，失败和停止是否证明未执行？](#detail-section-12)
  - [Q03 · 权限、文件下载和模型限制支持团队采用吗？](#detail-section-13)
  - [Q04 · 自进化演示以外，下一项可证伪改进是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多项目维护者希望集中模型、Agent会话与设备工作记录；原办法多个CLI/Web人工汇总。合格结果需正确授权、可追溯投递与真实成果，ok或在线不等任务完成。

单CLI／Harness Web加人工项目记录、SSH和tmux；底层推理／编程继承上游，根增量为成员策略、统一消息与工作台投影。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目/session治理 | 成员和操作范围 | viewer gate有环境开关，非OS隔离 |
| Agent投递与JSONL | 统一后台消息和观察 | ok非完成，超时可能结果未知 |
| 文件与使用限制 | 用户文件接口及新会话次数 | 共享tmp/upload范围、非账单封顶 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 服务端Node/Python、配置与数据库 | 必需 | Web/API与记录 | 浏览器零安装不等零部署 |
| 模型账号与对应CLI/tmux | 对应Agent需 | 实际推理执行 | 启动/认证失败需查真实状态 |
| DSH runtime与匹配Node | DSH后端需 | JSON-RPC编码Agent | 固定路径缺失报错 |
| SSH/AIMUX与设备权限 | 远端可选 | 连接设备算力 | 另有OS／网络授权边界 |
| 成员、文件owner及真实取消验收 | 团队接管前需 | 防跨用户与重复执行 | 本轮未完成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定旧版或另定新仓版本，测试项目/账户 | 不继承新仓修复 |
| 授权 | 核viewer gate、session owner与文件矩阵 | JWT登录非租户隔离 |
| 投递 | 提交消息并核backend/JSONL | ok仅接收，后续核真实成果 |
| 失败 | timeout/stop后查runtime与副作用 | 不因setIdle盲目重跑 |
| 退出 | 停后台、核外部任务、撤销SSH/模型key并备份 | 回CLI与人工核验 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 服务器/容器、模型、设备 | 配账户/目录/Agent和权限 | 金额工时未知 |
| 持续 | 推理、巡检、存储与网络 | 升级兼容和跨设备核验 | 创建次数限制非账单封顶 |
| 失败恢复 | 重试和可能重复副作用 | 核UNKNOWN、runtime与日志 | timeout非取消保证 |
| 退出 | DB/JSONL/项目归档 | 停进程、收凭据和设备暴露 | UI退出不代表外部任务停 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中协作 | 项目成员/模型/session统一入口 | 真实任务收益与自进化可靠性 |
| 消息追踪 | backend回执和JSONL | exactly-once或成果正确 |
| 权限 | JWT/成员/session检查 | 全路由/文件/OS租户隔离 |
| 使用限制 | 新Session次数检查 | 每次推理或金额硬上限 |

> **思考**：[Q02](#research-q02) RPC超时不取消执行，失败／stop后setIdle不证进程树停止；[Q03](#research-q03) download允许共享tmp/upload且词法路径非symlink隔离，模型限制仅新Session。正式团队接管须先解决授权、UNKNOWN结果和恢复，不能据JWT或界面角色承诺租户安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多项目成员、模型白名单、会话消息和不同Agent记录集中，降低人工跨终端跟踪的组织负担。此为工作台与适配层贡献，不把上游Agent编程或自进化演示当已验业务效果。

[Q02](#research-q02) 服务层重核、错误分类和投递记录可追溯；但pending超时不取消、直接child清句柄和状态setIdle应保留UNKNOWN语义。[Q03](#research-q03)文件词法scope与共享tmp范围不构成严格租户隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) RPC超时不取消执行，失败／stop后setIdle不证进程树停止；[Q03](#research-q03) download允许共享tmp/upload且词法路径非symlink隔离，模型限制仅新Session。正式团队接管须先解决授权、UNKNOWN结果和恢复，不能据JWT或界面角色承诺租户安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)正式团队多设备场景observe，先独立做两用户/权限/文件与真实终止恢复矩阵。只读架构探索不等生产批准，核心边界未清保留原CLI与人工核验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持统一会话投递、项目成员和DSH adapter；根README已迁仓，当前服务维护未知。本轮无运行，多用户文件边界、取消与成本存在未核／设计限制，建议观察。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、docs/tutorial/11_limit_model_usage.md、mobius/backend/agents/deepseek-harness-protocol.js、mobius/backend/agents/deepseek-harness.js、mobius/backend/middleware/auth.ts、mobius/backend/routes/files.ts、mobius/backend/routes/sessions.ts、mobius/backend/services/access-control.ts、mobius/backend/services/model-prompt-limits.ts、mobius/backend/services/session-message-runner.ts、mobius/package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定旧根client source研究，定向JWT、项目/session ACL、消息runner、DSH spawn/RPC/stop、文件下载/read和模型创建限制。未全审其他Agent、SSH/AIMUX、科研/自进化、全部Web路由与新仓；无运行。
- 下一步：[Q04](#research-q04)建议先两用户/readonly/symlink/tmp拒绝矩阵，再DSH丢响应/重启/停进程故障，查真实副作用与费用。本轮未执行，作者演示和test文件不作通过。

**分析版本**

- **仓库**：[nutshellai-tech/mobius](https://github.com/nutshellai-tech/mobius)
- **版本号**：未声明（[固定提交 0f74ca8](https://github.com/nutshellai-tech/mobius/tree/0f74ca8412f42f65bcb68c7cd2be7f4978acef29)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 从超时和空闲投影不一致推导稳定operation id、UNKNOWN与query/reconcile，可能减少重复副作用。以丢响应、重启和退出延迟比较重复/误空闲/恢复；不改善或锁死即否定，尚未实现不计贡献。

[Q04](#research-q04)建议先两用户/readonly/symlink/tmp拒绝矩阵，再DSH丢响应/重启/停进程故障，查真实副作用与费用。本轮未执行，作者演示和test文件不作通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 90 | 7757 | — | — | 71097 |
| .js | source | 90 | 32701 | 28900 | 1951 | — |
| .ts | source | 208 | 61578 | 51943 | 5319 | — |
| .cjs | source | 1 | 178 | 143 | 2 | — |
| .mjs | source | 1 | 123 | 114 | 0 | — |
| .ts | test | 7 | 525 | 431 | 30 | — |
| .js | test | 52 | 4677 | 4000 | 151 | — |
| .tsx | source | 122 | 66007 | 59176 | 3606 | — |
| .mjs | test | 9 | 1581 | 1271 | 170 | — |
| .js | example | 1 | 37 | 35 | 0 | — |
| .tsx | test | 9 | 2479 | 1976 | 392 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/nutshellai-tech/mobius/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/nutshellai-tech/mobius/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/nutshellai-tech/mobius/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：限定已迁仓根的团队工作台贡献，核会话授权、DSH投递失败与文件／费用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定根工作台向谁交付什么，迁仓和自进化怎样界定？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Mobius根是服务端加Web工作台，真实类型client，面向维护多个项目、会话、模型与设备的开发团队／个人。原办法是分别开CLI或Harness Web，再人工汇总任务、文件与远端会话。合格成果是能在权限内跟进正确项目、向正确Agent投递和读取可追溯结果，不能把“在线”或发送ok当任务完成。当前固定英文README只声明迁到mobius-system/mobius；本研究不跟随新仓、不把其维护与修复继承本旧ID。中文README和教程留存项目／团队／科研／设备工作台描述，但“首个自进化OS”与全平台可用属作者定位而非本轮事实。

实际增量可在服务端项目成员策略、统一session消息服务与DSH adapter到合并JSONL观察到；底层Agent的推理／编程、SSH、tmux与操作系统执行并不是本根原创。固定package为mobius-system1.9.0，外部DSH只是其中后端，不构成DSH原生插件。复杂科研、自动自改系统是否稳定交付，没有本轮运行和独立结果证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-14](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/README.md#L9-L14)

固定根明确迁仓声明。

```text
# <img src="logo.png" alt="Mobius logo" height="42" valign="middle" /> Mobius

>
> This repo has moved to 
> https://github.com/mobius-system/mobius
>
```

**依据 2 · 作者声明**：[README.zh.md:32-57](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/README.zh.md#L32-L57)

作者自进化工作台定位和演示主张。

<details>
<summary>查看原文（26行）</summary>

```text
>
> Mobius 是全球首个**自进化**的开源 Agent OS。它不是一套固定的工具箱，而是一个持续生长的生产力系统，把项目、团队、模型、设备、算力和应用连成一个可追溯的工作空间。



## 最新动态

- **2026-08-09** — **Windows 一键安装**：一条 PowerShell 命令，即可在全新的 Windows 机器上装好 Mobius TUI。
- **2026-08-02** — **简易模式上线**：可选的无干扰布局（跨项目近期会话 + JSONL + 悬浮输入框）。首次使用时会在简易与常规两种模式之间做一次选择，之后随时可从主题菜单切换。
- **2026-08-02** — **TUI 发布**：在任意终端通过 TUI 连接 Mobius，像使用 Codex 一样使用它。
- **2026-07-26** — **搜索优化**：搜索结果经 SSE 流式返回，支持大小写/全字匹配，点击任一结果即可跳转到对应的 JSONL 卡片。
- **2026-07-14** — **代码对话 v2** 工作空间模式：三栏布局——文件浏览器、内置 CodeMirror 编辑器（支持语法高亮与就地保存）、对话面板。



## 自进化

Mobius 会根据你的输入改写自身。发一个**修改需求**、一张**截图**，或一个**参考链接**——Mobius 把它们变成真实的代码、界面、插件或流程更新，全程不打断你的工作。每一次迭代，都在后台悄悄替换“忒修斯之船”上的一块木板。

<p align="center">
  <img src="https://serve.nutshellai.cn/publish/auto/readme/can-do-agent-os.gif" alt="自进化 Agent OS 演示" width="480" />
</p>

[查看自进化示例](https://mobius-system.github.io/mobius/self-evo-demo/)


```

</details>

**依据 3 · 源码核查**：[mobius/package.json:1-9](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/package.json#L1-L9)

私有服务端工作台1.9.0启动入口。

```text
{
  "name": "mobius-system",
  "version": "1.9.0",
  "private": true,
  "description": "The world's first self-evolving open-source agent operating system, an AI workbench that can continuously self-iterate according to personalized needs.",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
```

**依据 4 · 源码核查**：[mobius/backend/routes/sessions.ts:1641-1679](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/routes/sessions.ts#L1641-L1679)

HTTP会话消息走统一runner并返回启动错误。

<details>
<summary>查看原文（39行）</summary>

```text
router.post('/:id/messages', auth, async (req: express.Request, res: express.Response) => {
  const sessionId = String(req.params.id);
  const user = userOf(req);
  const content = typeof req.body?.content === 'string' ? req.body.content : '';
  const requestId = typeof req.body?.request_id === 'string' ? req.body.request_id : null;
  const hasInputText = Object.prototype.hasOwnProperty.call(req.body || {}, 'input_text');
  const inputText = hasInputText ? String(req.body.input_text || '') : '';
  const pendingMentions = SessionPendingMentions.find(sessionId);
  const directMentions = Array.isArray(req.body?.mentions) ? req.body.mentions : [];
  const effectiveMentions = pendingMentions.length > 0
    ? [...pendingMentions, ...directMentions]
    : directMentions;

  try {
    const result = await runSessionMessage({
      user,
      sessionId,
      content,
      inputText,
      hasInputText,
      requestId,
      attachments: req.body?.attachments,
      mentions: effectiveMentions,
      source: 'http.session.messages',
      logger: console,
      urgent: req.body?.urgent === true,
    } as any);
    if (pendingMentions.length > 0) SessionPendingMentions.clear(sessionId);
    auditSessionAccess(user, 'send_session_message', Sessions.findById(sessionId) as any);
    // 1v1 推送钩子: agent 回复 settle 后, 若用户此时离线(无 SSE) → 远程推送.
    try {
      const sess = Sessions.findById(sessionId) as any;
      watch1v1ReplyForPush({ backend: backendForSession(sess), sessionId, user, sessionName: sess?.name });
    } catch {}
    res.json(result);
    return;
  } catch (e) {
    const err = e as any;
    res.status(err.status || 500).json({ error: err.message || '启动失败', category: err.category || undefined });
```

</details>

#### 缺口

- 实际团队需求、完整多设备／自进化效果及迁仓后兼容未研究。
  **影响**：不能以演示或新仓状态证明本固定版本可接管业务。
  **进一步探讨**：在此固定版选择单项目无敏感数据任务核正确投递与结果，若评新仓须独立固定新版本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 用户到会话与DSH投递如何接线，失败和停止是否证明未执行？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

auth先JWT verify再从Users取当前用户，无token／无用户／非法返回401。session创建查issue并调用canCreateSessionForIssue，模型解析来自管理白名单，再checkCreateAllowed；普通消息路由交runSessionMessage，后者重新核canOperateSession和workspace，选后端投递。项目read、manage和write角色分开，但canCreateSessionForIssue只有v3_run_session_gate启用才要求项目写权限，否则回退canReadIssue；开关由env显式truthy决定，不能仅凭viewer名称保证全路径只读。会话操作则限定admin、session owner或project creator，不能以项目可读直接推断全员可操作会话。

runner向backend.pauseCurrentAndResume或noPauseCurrentAndQueue投递，返回ok和queued桥接消息意味着接收／投递结果，不是成果验收。DSH adapter实际spawn独立runtime、初始化、发session/prompt，并从status/event映射JSONL；环境复制process.env并覆盖模型key／cwd／session root等，不是最小权限隔离。默认runtime依赖特定本机Node路径和包，缺失报错。

JSON-RPC超时只从pending删id并reject，没有向runtime发送取消；调用可能已执行或继续运行。runner捕获后写failed flag／setIdle并返回启动失败，这种UI状态不证明子进程和外部副作用停止。stop路由即便backend调用失败也尝试setIdle，另返回ok信息；DSH _stopRuntime先shutdown，再对直接child SIGTERM，3秒后SIGKILL但计时器立即resolve，随后清child/peer。不是可证明的进程树join／远端取消。恢复应查询真实runtime和副作用，不盲目重复同一有副作用命令。

#### 证据与依据

**依据 1 · 源码核查**：[mobius/backend/middleware/auth.ts:11-39](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/middleware/auth.ts#L11-L39)

JWT与当前用户校验。

<details>
<summary>查看原文（29行）</summary>

```text
function loadUser(token: string): unknown {
  const payload = jwt.verify(token, JWT_SECRET) as AuthPayload | string;
  const id = typeof payload === 'string' ? payload : payload.id;
  return Users.findAuthById(id);
}

function extractToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  const fromHeader = header ? header.replace(/^Bearer\s+/i, '') : '';
  return fromHeader || undefined;
}

function auth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: 'No token' });
    return;
  }
  try {
    const dbUser = loadUser(token);
    if (!dbUser) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    (req as any).user = dbUser;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
```

</details>

**依据 2 · 源码核查**：[mobius/backend/services/access-control.ts:72-83](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/services/access-control.ts#L72-L83)

v3会话gate由环境开关决定。

<details>
<summary>查看原文（12行）</summary>

```text
function envFlagEnabled(name: string): boolean {
  const candidates = [
    process.env[name],
    process.env[name.toUpperCase()],
    process.env[`FEATURE_${name.toUpperCase()}`],
  ];
  return candidates.some((value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase()));
}

function isV3RunSessionGateEnabled(): boolean {
  return envFlagEnabled('v3_run_session_gate');
}
```

</details>

**依据 3 · 源码核查**：[mobius/backend/services/access-control.ts:259-296](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/services/access-control.ts#L259-L296)

项目成员读／管理／写角色区分。

<details>
<summary>查看原文（38行）</summary>

```text
function canReadProject(user: any, projectOrId: any): boolean {
  const project = projectById(projectOrId);
  if (!project || !user?.id) return false;
  // 纯成员制 (项目可见性 public/team/allowlist 已退役): admin 全局可见; 创建者可见; 项目成员(任意角色)可读.
  if (user.role === 'admin') return true;
  if (project.created_by === user.id) return true;
  if (ProjectMemberships.roleFor(project.id, user.id)) return true;
  // 受限群组白名单: 管理员授权给该群组的项目, 视同间接成员.
  const visCtx = ensureGroupVisCtx(user);
  if (visCtx.restricted && visCtx.whitelist.has(project.id)) return true;
  // 项目级 ACL 显式 allow (遗留 allowlist 授权), 保留.
  if (hasAclEffect(user, 'project', project.id, 'allow')) return true;
  // 其余非成员一律不可见.
  return false;
}

function canManageProject(user: any, projectOrId: any): boolean {
  const project = projectById(projectOrId);
  if (!project || !user?.id) return false;
  if (user.role === 'admin' || project.created_by === user.id) return true;
  // 项目负责人 / 项目管理员可管理团队与项目设置.
  const role = ProjectMemberships.roleFor(project.id, user.id);
  return role === 'owner' || role === 'manager';
}

function canCreateIssue(user: any, projectOrId: any): boolean {
  return projectAllowsReaderWrite(user, projectOrId, 'can_post_issue');
}

function projectAllowsReaderWrite(user: any, projectOrId: any, _flagColumn: string): boolean {
  const project = projectById(projectOrId);
  if (!project || !user?.id) return false;
  if (user.role === 'admin' || project.created_by === user.id) return true;
  // 成员制写权限 (读者开关 can_post_issue/can_run_session 已退役):
  // owner/manager/member 可写(建任务单/跑会话); viewer 只读; 非成员不可写.
  const role = ProjectMemberships.roleFor(project.id, user.id);
  if (role === 'owner' || role === 'manager' || role === 'member') return true;
  return false;
```

</details>

**依据 4 · 源码核查**：[mobius/backend/services/access-control.ts:362-389](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/services/access-control.ts#L362-L389)

create-session开关回退与session实际操作策略。

<details>
<summary>查看原文（28行）</summary>

```text
function canCreateSessionForIssue(user: any, issueOrId: any): boolean {
  if (!isV3RunSessionGateEnabled()) return canReadIssue(user, issueOrId);
  const issue = issueById(issueOrId);
  if (!issue || !user?.id) return false;
  if (!canReadIssue(user, issue)) return false;
  return projectAllowsReaderWrite(user, issue.project_id, 'can_run_session');
}

function canCreateSessionForResearch(user: any, researchOrId: any): boolean {
  return canReadResearch(user, researchOrId);
}

function canReadSession(user: any, sessionOrId: any): boolean {
  const session = sessionById(sessionOrId);
  if (!session || !user?.id) return false;
  if (user.role === 'admin' || session.user_id === user.id) return true;
  // 固定“验收完成案例”是全员可读教程素材；仅放开读取，不放开操作权限。
  if (isFixedLogoReviewSession(session)) return true;
  const project = projectById(session.project_id);
  return !!(project && project.created_by === user.id);
}

function canOperateSession(user: any, sessionOrId: any): boolean {
  const session = sessionById(sessionOrId);
  if (!session || !user?.id) return false;
  if (user.role === 'admin' || session.user_id === user.id) return true;
  const project = projectById(session.project_id);
  return !!(project && project.created_by === user.id);
```

</details>

**依据 5 · 源码核查**：[mobius/backend/routes/sessions.ts:1793-1826](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/routes/sessions.ts#L1793-L1826)

创建权限和模型／次数前置。

<details>
<summary>查看原文（34行）</summary>

```text
issueScoped.post('/', auth, async (req: express.Request, res: express.Response) => {
  const user = userOf(req);
  const issueId = String(req.params.issueId);
  const issue = Issues.findById(issueId) as any;
  if (!issue) { res.status(404).json({ error: '未找到' }); return; }
  if (!canCreateSessionForIssue(user, issue)) { res.status(403).json({ error: '无权在此 Issue 创建 Session' }); return; }

  const { name, description, excluded_skill_ids, excluded_memory_ids, model, language } = (req.body || {}) as {
    name?: string;
    description?: string;
    excluded_skill_ids?: any;
    excluded_memory_ids?: any;
    model?: any;
    language?: string;
  };
  // 用户在创建表单手填过名称 → 标记 name_human_edited=1, AI 标题生成器不再覆盖此名 (仅 global-create 顶栏快捷菜单传入).
  const nameHumanEdited = req.body?.name_touched === true ? 1 : 0;
  if (!name) { res.status(400).json({ error: '请填写会话名称' }); return; }

  // 前端传内置短键或管理员导入模型 key; 非法/缺省回退默认模型.
  // 导入模型仍来自管理员白名单, 不直接把用户串塞进 --model.
  const resolvedModel = modelRegistry.resolveSessionModelForCreate(model);
  if (!resolvedModel) {
    res.status(503).json({ error: '没有可用的模型，请先在管理后台配置模型（或检查 ~/.claude/mobiusdefault.settings.json 是否存在）' });
    return;
  }
  const limitCheck = modelPromptLimits.checkCreateAllowed(user.id, resolvedModel.key);
  if (!limitCheck.allowed) {
    res.status(limitCheck.status as any).json({
      error: limitCheck.error,
      code: limitCheck.code,
      usage: limitCheck.usage,
    });
    return;
```

</details>

**依据 6 · 源码核查**：[mobius/backend/services/session-message-runner.ts:239-260](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/services/session-message-runner.ts#L239-L260)

服务层重新核会话操作／工作区。

<details>
<summary>查看原文（22行）</summary>

```text
  if (!user?.id) throw httpError('用户不可用', 401);

  const sess = findSessionOperable(normalizedSessionId, user);
  if (!sess) throw httpError(`session ${normalizedSessionId} 不存在或不属于你`, 404);

  const workspace = resolveSessionWorkspace(user, normalizedSessionId);
  if (workspace.error) {
    try { Sessions.setIdle(normalizedSessionId, user.id); } catch {}
    try { Messages.insertSystem(normalizedSessionId, workspace.error, null as any, '工作目录不可用'); } catch {}
    throw httpError(workspace.error, 400, 'workspace');
  }
  const workDir = workspace.workDir;
  const flagRoot = workspace.projectRoot || workspace.workDir;
  const normalizedAttachments = isExternalEvent ? [] : normalizeSessionAttachments(
    attachments,
    user,
    [workspace.projectRoot, workspace.workDir],
  );
  const normalizedMentions = isExternalEvent ? [] : normalizeAgentMentions(mentions, normalizedContent);
  const mentionMetadata = isExternalEvent ? [] : sessionMentionMetadata(user, normalizedSessionId, normalizedMentions);
  if (!isExternalEvent && !normalizedContent.trim() && normalizedAttachments.length === 0) {
    throw httpError('content 不能为空', 400);
```

</details>

**依据 7 · 源码核查**：[mobius/backend/services/session-message-runner.ts:466-535](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/services/session-message-runner.ts#L466-L535)

后端投递ok含义和失败状态写入。

<details>
<summary>查看原文（70行）</summary>

```text
      codexConfigPath: launch.codexConfigPath || undefined,
      codexSecretEnvKey: launch.codexSecretEnvKey || undefined,
      codexSecretValue: launch.codexSecretValue || undefined,
      harnessProvider: launch.harnessProvider || undefined,
      harnessBaseUrl: launch.harnessBaseUrl || undefined,
      harnessSecretValue: launch.harnessSecretValue || undefined,
      harnessMaxTokens: launch.harnessMaxTokens || undefined,
      harnessRuntimeVersion: launch.harnessRuntimeVersion || undefined,
      displayName: sess.name,
      agentSessionId: sess.claude_session_id || undefined,
      mobiusJsonl,
      suppressRunningFlag: isExternalEvent,
      aimuxRemoteName: aimuxRemoteNameFromMeta(sess?.pc_client_metadata),
    };
    if (urgent) {
      // 加急: 中断当前推理/输出再投递. pauseCurrentAndResumeFromSession 带 prompt =
      // _pauseImpl 的 urgent 分支 (单次 C-c + Alt+Enter 换行 + paste 提交).
      // 空闲/未存活时 _pauseImpl 自带兜底 (不中断直接投递 / respawn-if-dead).
      await backend.pauseCurrentAndResumeFromSession({ ...dispatchOpts, urgent: true });
    } else {
      await backend.noPauseCurrentAndQueueQueryAtSession(dispatchOpts);
    }
    const runtimeInfo = backend.listSessions().find((s: any) => s.sessionId === normalizedSessionId);
    const newAgentSid = runtimeInfo?.agentSessionId || null;
    if (newAgentSid && newAgentSid !== sess.claude_session_id) {
      try {
        db.prepare('UPDATE sessions_v2 SET claude_session_id=? WHERE session_id=?').run(newAgentSid, normalizedSessionId);
      } catch (e) {
        logger?.warn?.(`[sessions/messages] save agent session id: ${e.message}`);
      }
    }
    for (const kickoff of bridgeKickoffs) {
      const queued = recordAgentBridgeMessage({
        channelId: kickoff.channelId,
        requestId: `initial-${normalizedRequestId || `${normalizedSessionId}-${Date.now()}`}`,
        fromSessionId: normalizedSessionId,
        toSessionId: kickoff.targetSession.session_id,
        content: kickoff.content,
        batchId: kickoff.batchId,
        threadId: kickoff.batchId,
      });
      kickoff.messageId = queued.id;
    }
    return {
      ok: true,
      session_id: normalizedSessionId,
      turn_number: turnNum,
      request_id: normalizedRequestId,
      backend: backend.name,
      external_messages_queued: bridgeKickoffs.map((kickoff) => ({
        message_id: kickoff.messageId || null,
        channel_id: kickoff.channelId,
        target_session_id: kickoff.targetSession.session_id,
        delivery: 'queued',
        batch_id: kickoff.batchId,
      })),
    };
  } catch (e) {
    for (const kickoff of bridgeKickoffs) {
      try { closeAgentBridgeChannel(kickoff.channelId); } catch {}
    }
    const { userMessage: detail, rawMessage } = formatBackendSendFailure(e);
    logger?.warn?.(`[sessions/messages] ${rawMessage}${rawMessage !== detail ? `; user_message=${detail}` : ''} (session=${normalizedSessionId})`);
    const failedFields: any = { backend: backend.name, reason: detail };
    if (rawMessage !== detail) failedFields.raw_reason = rawMessage;
    safeRemoveRunningFlag(flagRoot, normalizedSessionId, 'sessions/messages');
    safeWriteFailedFlag(flagRoot, normalizedSessionId, failedFields, 'sessions/messages');
    try { Sessions.setIdle(normalizedSessionId, user.id); } catch {}
    try { Messages.insertSystem(normalizedSessionId, detail, turnNum, '启动失败'); } catch {}
    throw httpError(detail, 500, 'backend');
```

</details>

**依据 8 · 源码核查**：[mobius/backend/agents/deepseek-harness.js:155-190](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/agents/deepseek-harness.js#L155-L190)

实际spawn、继承环境和runtime信息。

<details>
<summary>查看原文（36行）</summary>

```text
    const nativeRoot = this._nativeRoot(sessionId)
    fs.mkdirSync(nativeRoot, { recursive: true })
    if (!fs.existsSync(jsonlPath)) fs.writeFileSync(jsonlPath, '')
    const command = resolveRuntimeCommand({ ...this.runtimeOptions, ...opts, useProxy: !!opts.useProxy })
    const env = {
      ...process.env,
      DEEPSEEK_API_KEY: String(opts.harnessSecretValue || ''),
      DEEPSEEK_BASE_URL: String(opts.harnessBaseUrl || 'https://api.deepseek.com'),
      DSH_CWD: cwd,
      DSH_SESSION_ROOT: nativeRoot,
      DSH_MAX_TOKENS_AS_SUCCESS: 'false',
      DSH_SYSTEM_PROMPT: String(opts.systemPrompt || 'You are a coding agent operating inside Mobius.'),
    }
    const child = this.spawn(command.command, command.args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'] })
    const entry = {
      sessionId, agentSessionId, cwd, flagRoot, jsonlPath, nativeRoot, pid: child.pid || null,
      model: opts.model, provider: opts.harnessProvider || 'deepseek-official', maxTokens: opts.harnessMaxTokens || null,
      runtimeVersion: opts.harnessRuntimeVersion || '0.0.1-rc.5', useProxy: !!opts.useProxy,
      startedAt: Date.now(), child, peer: null, working: false, pending: [], stderr: '', recentError: null, watcher: null,
    }
    this.runtime.set(sessionId, entry)
    const peer = new HarnessJsonRpcPeer(child, {
      requestTimeoutMs: Number(opts.harnessRequestTimeoutMs) || 30000,
      onNotification: (method, params) => this._onNotification(sessionId, method, params),
      onProtocolError: (error) => this._captureError(sessionId, error),
    })
    entry.peer = peer
    child.stderr.on('data', (chunk) => {
      entry.stderr = (entry.stderr + chunk.toString('utf8')).slice(-MAX_STDERR_BYTES)
    })
    child.once('exit', (code, signal) => {
      entry.working = false
      entry.pending = []
      entry.pid = null
      if (code && !entry.terminating) this._captureError(sessionId, new Error(`DeepSeek Harness runtime exited with code ${code}`), entry.stderr)
      this._persistEntry(sessionId, { pid: null, lastExitCode: code, lastExitSignal: signal || null })
```

</details>

**依据 9 · 源码核查**：[mobius/backend/agents/deepseek-harness-protocol.js:44-61](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/agents/deepseek-harness-protocol.js#L44-L61)

超时只reject不发取消。

<details>
<summary>查看原文（18行）</summary>

```text
  request(method, params, timeoutMs = this.requestTimeoutMs) {
    if (this.closed || !this.child.stdin?.writable) return Promise.reject(new HarnessProtocolError('runtime transport is closed'))
    const id = String(this.nextId++)
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new HarnessProtocolError(`${method} timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      this.pending.set(id, { resolve, reject, timer })
      this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, ...(params === undefined ? {} : { params }) })}\n`, (error) => {
        if (!error) return
        const pending = this.pending.get(id)
        if (!pending) return
        this.pending.delete(id)
        clearTimeout(timer)
        reject(error)
      })
    })
```

</details>

**依据 10 · 源码核查**：[mobius/backend/agents/deepseek-harness.js:265-283](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/agents/deepseek-harness.js#L265-L283)

只停直接child、超时KILL后清句柄。

<details>
<summary>查看原文（19行）</summary>

```text
  async _stopRuntime(entry, graceful = true) {
    if (!entry?.child) return
    entry.terminating = true
    if (graceful && entry.peer && !entry.peer.closed) {
      try { await entry.peer.request('shutdown', undefined, 5000) } catch {}
    }
    if (pidAlive(entry.child.pid)) entry.child.kill('SIGTERM')
    await new Promise((resolve) => {
      if (entry.child.exitCode != null || entry.child.signalCode) return resolve()
      const timer = setTimeout(() => { if (pidAlive(entry.child.pid)) entry.child.kill('SIGKILL'); resolve() }, 3000)
      entry.child.once('exit', () => { clearTimeout(timer); resolve() })
    })
    entry.peer?.close()
    entry.watcher?.stop?.()
    entry.child = null
    entry.peer = null
    entry.pid = null
    entry.working = false
    entry.pending = []
```

</details>

**依据 11 · 源码核查**：[mobius/backend/routes/sessions.ts:744-780](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/routes/sessions.ts#L744-L780)

stop失败仍setIdle，不能据UI判断终止。

<details>
<summary>查看原文（37行）</summary>

```text
router.post('/:id/stop', auth, async (req: express.Request, res: express.Response) => {
  const id = String(req.params.id);
  const user = userOf(req);
  const session = findSessionOperable(id, user);
  if (!session) { res.status(404).json({ error: '未找到' }); return; }
  auditSessionAccess(user, 'stop_session', session);

  const sessionId = id;
  const backend = backendForSession(session);
  let workDir: string | undefined;
  let flagRoot: string | undefined;
  try {
    const workspace = resolveSessionWorkspace(user, sessionId);
    if (!workspace.error) {
      workDir = workspace.workDir;
      flagRoot = workspace.projectRoot || workspace.workDir;
    }
  } catch {}

  let ok = true;
  try {
    await backend.pauseCurrentAndResumeFromSession({
      sessionId,
      prompt: '',
      cwd: workDir || undefined,
      flagRoot: flagRoot || workDir || undefined,
    });
  } catch (e) {
    ok = false;
    console.warn('[sessions/stop] stop failed:', (e as Error).message);
  }

  try { Sessions.setIdle(sessionId, session.user_id || user.id); } catch {}
  try {
    Messages.insertSystem(
      sessionId,
      ok ? '已发 C-c × 3 给后台智能体 (软停).' : 'Stop 失败.',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、文件下载和模型限制支持团队采用吗？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

部署需服务端Node／Python、数据库与配置、模型账号、选定CLI／tmux／DSH runtime；远端设备另有SSH/AIMUX与网络权限。中文README给Docker或直接部署，均不是浏览器用户零后端维护。迁仓后的升级路线和安全修复不在本固定版保证中，本轮不执行配置生成、服务、Agent或远端命令。

文件路由有JWT认证但范围不是严格项目隔离：resolveScopedPath只做path.resolve前缀和替换..，不做realpath/symlink containment；download还允许用户work_dir以外的共享upload与整个os.tmpdir范围，无逐文件owner检查。给定合法登录身份和可读路径的实际接线支持这一范围判断，未本轮构造读取复现，也不推断任意系统文件都可读。多成员生产前需独立验证文件所有权、链接与上传/临时目录，不能把账户认证当租户隔离。

“模型使用限制”实际checkCreateAllowed只阻新Session，错误文案明确已有Session可继续提问；不是token／每次推理现金硬上限。4个时间窗次数和UI标红不等账单封顶，持续会话、巡检和重试仍可能消费。首次是账号／项目／模型／设备与权限配置，持续有运行时兼容、日志存储和人工核验，失败恢复需查未知执行结果，退出要停后台Agent、收回SSH／模型key和备份数据库／JSONL／项目文件。现金与工时都未知。对要正式多用户／多设备接管的团队建议observe，先完成权限与终止/恢复验收；单机架构探索不是生产采用批准。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:174-215](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/README.zh.md#L174-L215)

作者Docker／直接部署与CLI依赖。

<details>
<summary>查看原文（42行）</summary>

````text
## 快速开始

完整部署指南见[文档](https://mobius-system.github.io/mobius/)。

### 容器（推荐）

```bash
# 1. 克隆仓库（建议先 fork 再 clone，这样自进化后可以直接提交到自己的仓库）
git clone https://github.com/mobius-system/mobius.git && cd mobius

# 2. 生成配置（随机密钥/密码；也可手动配置以跳过此步）
python3 conf_prepare.py --docker && python3 conf_check.py --docker

# 3. 构建镜像（base 镜像仅含环境，不含代码）
docker build -t mobius-system-base:latest -f deploy/Dockerfile .
docker build -t mobius-system-exe:latest .

# 4. 启动
docker compose up
```

### 直接部署（Linux / macOS）

```bash
# 1. 安装前置依赖（tmux、git 等）
sudo apt install tmux python3 git curl proxychains openssh-server build-essential

# 2. 安装编码 Agent（任选其一，建议两者都装）
npm install -g @anthropic-ai/claude-code @openai/codex

# 3. 克隆仓库（建议先 fork 再 clone，这样自进化后可以直接提交到自己的仓库）
git clone https://github.com/mobius-system/mobius.git && cd mobius

# 4. 生成并校验配置（会把 .env.default 复制为 .env 并生成随机密码）
python3 conf_prepare.py && python3 conf_check.py

# 5. 安装依赖（前端 + 后端）
cd ./mobius && npm install && cd ./frontend && npm install && cd ../..

# 6. 运行
python3 start.py
```
````

</details>

**依据 2 · 源码核查**：[mobius/backend/agents/deepseek-harness.js:32-67](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/agents/deepseek-harness.js#L32-L67)

DSH runtime、Node及proxy依赖与缺失报错。

<details>
<summary>查看原文（36行）</summary>

```text
const DEFAULT_RUNTIME_BIN = path.join(RUNTIME_PACKAGE, 'node_modules', '.bin', 'dsh-jsonrpc-agent')
const DEFAULT_CONFIG = path.join(RUNTIME_PACKAGE, 'cordis.yml')
const DEFAULT_NODE = path.join(os.homedir(), '.nvm', 'versions', 'node', 'v22.22.2', 'bin', 'node')
const DEFAULT_PROXY_BIN = '/usr/bin/proxychains'
const DEFAULT_PROXY_CONFIG = path.join(os.homedir(), 'proxy_claude.conf')
const MAX_STDERR_BYTES = 64 * 1024

function pidAlive(pid) {
  if (!Number.isFinite(Number(pid)) || Number(pid) <= 0) return false
  try { process.kill(Number(pid), 0); return true } catch (error) { return error?.code === 'EPERM' }
}

function resolveRuntimeCommand(opts = {}) {
  const explicit = opts.runtimeCommand || process.env.DEEPSEEK_HARNESS_RUNTIME_COMMAND
  let command
  let args
  if (explicit) {
    command = explicit
    args = Array.isArray(opts.runtimeArgs) ? opts.runtimeArgs : []
  } else {
    const node = opts.runtimeNode || process.env.DEEPSEEK_HARNESS_NODE || DEFAULT_NODE
    if (!fs.existsSync(node)) throw new Error(`DeepSeek Harness requires Node 22/24 runtime: ${node}`)
    if (!fs.existsSync(DEFAULT_RUNTIME_BIN)) throw new Error(`DeepSeek Harness runtime is not installed: ${DEFAULT_RUNTIME_BIN}`)
    command = node
    args = [DEFAULT_RUNTIME_BIN, opts.runtimeConfig || DEFAULT_CONFIG]
  }
  if (!opts.useProxy) return { command, args }
  const proxyBin = opts.proxyBin || DEFAULT_PROXY_BIN
  const proxyConfig = opts.proxyConfig || DEFAULT_PROXY_CONFIG
  if (!fs.existsSync(proxyBin) || !fs.existsSync(proxyConfig)) {
    throw new Error(`DeepSeek Harness proxy prerequisites missing: ${proxyBin}, ${proxyConfig}`)
  }
  return { command: proxyBin, args: ['-q', '-f', proxyConfig, command, ...args] }
}

function appendJsonl(file, entry) {
```

</details>

**依据 3 · 源码核查**：[mobius/backend/routes/files.ts:33-73](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/routes/files.ts#L33-L73)

词法scope和download共享upload／tmp允许范围。

<details>
<summary>查看原文（41行）</summary>

```text
// 解析 path query 到绝对路径并做 root 越界检查 (限制在用户 work_dir 内)
function resolveScopedPath(req: express.Request, rawPath: string = '/'): ResolveResult {
  const user = (req as any).user as ScopedUser;
  const root = path.resolve(user.work_dir);
  const relPath = String(rawPath || '/').replace(/\.\./g, '');
  const absPath = path.resolve(root, relPath.replace(/^\//, ''));
  if (absPath !== root && !absPath.startsWith(root + path.sep)) {
    return { error: 'Access denied' };
  }
  return { root, relPath, absPath };
}

function isExtensionUserDataPath(absPath: string, userId: string | number): boolean {
  const resolved = path.resolve(absPath);
  const root = path.resolve(EXTENSION_DATA_ROOT);
  const rel = path.relative(root, resolved);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return false;
  const parts = rel.split(path.sep);
  return parts.length >= 4 && parts[1] === 'users' && parts[2] === String(userId);
}

function isMobiusUploadPath(absPath: string): boolean {
  const resolved = path.resolve(absPath);
  const root = path.resolve(APP_DIR, HIDDEN_FOLDER_NAME, 'upload');
  return resolved === root || resolved.startsWith(root + path.sep);
}

function isSystemTempPath(absPath: string): boolean {
  const resolved = path.resolve(absPath);
  const tmpRoot = path.resolve(os.tmpdir());
  return resolved === tmpRoot || resolved.startsWith(tmpRoot + path.sep);
}

function canDownloadPath(req: express.Request, absPath: string): boolean {
  const user = (req as any).user as ScopedUser;
  const userRoot = path.resolve(user.work_dir);
  return absPath === userRoot
    || absPath.startsWith(userRoot + path.sep)
    || isExtensionUserDataPath(absPath, user.id)
    || isMobiusUploadPath(absPath)
    || isSystemTempPath(absPath);
```

</details>

**依据 4 · 源码核查**：[mobius/backend/routes/files.ts:115-148](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/routes/files.ts#L115-L148)

实际download使用范围判断后交res.download。

<details>
<summary>查看原文（34行）</summary>

```text
router.get('/download', downloadAuth, (req: express.Request, res: express.Response) => {
  const filePath = req.query.path as string | undefined;
  if (!filePath) {
    res.status(400).json({ error: 'Path required' });
    return;
  }
  const absPath = path.resolve(filePath);
  if (!canDownloadPath(req, absPath)) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  if (!fs.existsSync(absPath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.download(absPath);
});

router.get('/files/download', downloadAuth, (req: express.Request, res: express.Response) => {
  const filePath = req.query.path as string | undefined;
  if (!filePath) {
    res.status(400).json({ error: 'Path required' });
    return;
  }
  const absPath = path.resolve(filePath);
  if (!canDownloadPath(req, absPath)) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  if (!fs.existsSync(absPath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.download(absPath);
```

</details>

**依据 5 · 源码核查**：[mobius/backend/routes/files.ts:220-244](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/routes/files.ts#L220-L244)

read真实使用词法解析与fs读取。

<details>
<summary>查看原文（25行）</summary>

```text
router.get('/files/read', auth, (req: express.Request, res: express.Response) => {
  const resolved = resolveScopedPath(req, (req.query.path as string | undefined) || '');
  if ('error' in resolved) {
    res.status(403).json({ error: resolved.error });
    return;
  }
  const { absPath } = resolved;
  if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const stat = fs.statSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
  if (imageExts.includes(ext)) {
    res.json({ type: 'image', url: `/api/download?path=${encodeURIComponent(absPath)}`, size: stat.size, ext });
    return;
  }
  if (stat.size > 1024 * 1024) {
    res.status(413).json({ error: 'File too large (>1MB)' });
    return;
  }
  try {
    const content = fs.readFileSync(absPath, 'utf8');
    res.json({ type: 'text', content, size: stat.size, ext });
```

</details>

**依据 6 · 源码核查**：[mobius/backend/services/model-prompt-limits.ts:268-279](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/services/model-prompt-limits.ts#L268-L279)

仅新Session创建限制，已有会话可继续。

<details>
<summary>查看原文（12行）</summary>

```text
function checkCreateAllowed(userId: any, modelOrKey: any): any {
  const entry = usageEntryForUserModel(userId, modelOrKey, WINDOW_HOURS)
  if (!entry.blocked) return { allowed: true, usage: entry }
  const state = entry.usage?.[entry.blocked_by] || {}
  const label = LIMIT_LABELS[entry.blocked_by] || '管理员模型提问次数'
  return {
    allowed: false,
    usage: entry,
    status: 429,
    code: 'MODEL_PROMPT_LIMIT_EXCEEDED',
    error: `${entry.label || entry.title || entry.key} 的${label}已达管理员限制 (${state.count}/${state.limit}), 暂不能创建该模型的新 Session。已有 Session 可继续提问。`,
  }
```

</details>

**依据 7 · 作者声明**：[docs/tutorial/11_limit_model_usage.md:13-26](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/docs/tutorial/11_limit_model_usage.md#L13-L26)

作者次数窗口说明不是金额。

<details>
<summary>查看原文（14行）</summary>

```text
## 2. 两类设置

- **全局默认模型**：当项目没设默认模型、用户也没手选时，新建会话回落到的模型。
- **每个模型 4 个硬限制**（留空 = 不限制）：
  - **所有用户 5h** —— 全体用户合起来，每 5 小时最多 N 次
  - **所有用户 5m** —— 全体用户合起来，每 5 分钟最多 N 次（防瞬时洪峰）
  - **单用户 5h** —— 每个用户每 5 小时最多 N 次
  - **单用户 5m** —— 每个用户每 5 分钟最多 N 次

## 3. 超限会怎样

- 某个模型对你达到上限后，它会在**模型选择菜单里被标红禁用**（鼠标悬停可见剩余 / 上限）。
- 5 分钟级的限制会在窗口结束后自动恢复；5 小时级的要等下一个 5 小时窗口。
- 改完点「保存」即时生效，不需要重启。
```

</details>

#### 缺口

- 生产多用户文件/设备隔离、跨租户拒绝与所有路由授权未全量验收。
  **影响**：不能推荐正式多租户部署，是observe依据。
  **进一步探讨**：先做两用户／viewer／symlink／共享tmp和upload拒绝矩阵，再审各路由与执行OS身份。
- 实际DSH、tmux、远端设备取消恢复与持续会话费用没有运行证据。
  **影响**：不能承诺取消停止或财务封顶。
  **进一步探讨**：固定后端做断线／超时／重启／退出与重复请求试验，核操作ID及服务端结果并记录真实用量。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自进化演示以外，下一项可证伪改进是什么？

**研究主题**：新假设与验证

#### 完整回答

当前自进化／自动科研描述说明作者愿景和演示，不证明每次修改安全、论文结论正确或多设备长期任务可靠；测试脚本存在也不等本轮通过。源码支持项目成员和会话投递机制，并同时揭示未知执行结果和文件授权边界，不能从功能数量把这些缺口平均掉。

Q02超时reject／setIdle与真实runtime可能不一致，推导一个未实现假设：给投递操作稳定operation id、持久未知状态与显式query/reconcile接口，可能比把RPC故障写“启动失败/空闲”更少诱发重复执行。相对已有request_id回显与JSONL，新增是远端执行确认／幂等责任，不只是更多日志。最小试验在DSH接收后丢RPC响应、服务重启和child退出延迟三反例，比较现状态和UNKNOWN/reconcile方案的重复副作用、误报空闲、恢复时间；若重复不降或合法任务被长期锁死则否定。它尚未实现或验证，不能计为当前可靠性。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:48-57](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/README.zh.md#L48-L57)

作者自进化演示仅作者声明。

<details>
<summary>查看原文（10行）</summary>

```text

Mobius 会根据你的输入改写自身。发一个**修改需求**、一张**截图**，或一个**参考链接**——Mobius 把它们变成真实的代码、界面、插件或流程更新，全程不打断你的工作。每一次迭代，都在后台悄悄替换“忒修斯之船”上的一块木板。

<p align="center">
  <img src="https://serve.nutshellai.cn/publish/auto/readme/can-do-agent-os.gif" alt="自进化 Agent OS 演示" width="480" />
</p>

[查看自进化示例](https://mobius-system.github.io/mobius/self-evo-demo/)


```

</details>

**依据 2 · 源码核查**：[mobius/backend/agents/deepseek-harness-protocol.js:44-61](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/agents/deepseek-harness-protocol.js#L44-L61)

超时无远端确认是状态协调假设来源。

<details>
<summary>查看原文（18行）</summary>

```text
  request(method, params, timeoutMs = this.requestTimeoutMs) {
    if (this.closed || !this.child.stdin?.writable) return Promise.reject(new HarnessProtocolError('runtime transport is closed'))
    const id = String(this.nextId++)
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new HarnessProtocolError(`${method} timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      this.pending.set(id, { resolve, reject, timer })
      this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, ...(params === undefined ? {} : { params }) })}\n`, (error) => {
        if (!error) return
        const pending = this.pending.get(id)
        if (!pending) return
        this.pending.delete(id)
        clearTimeout(timer)
        reject(error)
      })
    })
```

</details>

**依据 3 · 源码核查**：[mobius/backend/services/session-message-runner.ts:509-535](https://github.com/nutshellai-tech/mobius/blob/0f74ca8412f42f65bcb68c7cd2be7f4978acef29/mobius/backend/services/session-message-runner.ts#L509-L535)

ok回执与失败setIdle没有持久执行结果确认。

<details>
<summary>查看原文（27行）</summary>

```text
    return {
      ok: true,
      session_id: normalizedSessionId,
      turn_number: turnNum,
      request_id: normalizedRequestId,
      backend: backend.name,
      external_messages_queued: bridgeKickoffs.map((kickoff) => ({
        message_id: kickoff.messageId || null,
        channel_id: kickoff.channelId,
        target_session_id: kickoff.targetSession.session_id,
        delivery: 'queued',
        batch_id: kickoff.batchId,
      })),
    };
  } catch (e) {
    for (const kickoff of bridgeKickoffs) {
      try { closeAgentBridgeChannel(kickoff.channelId); } catch {}
    }
    const { userMessage: detail, rawMessage } = formatBackendSendFailure(e);
    logger?.warn?.(`[sessions/messages] ${rawMessage}${rawMessage !== detail ? `; user_message=${detail}` : ''} (session=${normalizedSessionId})`);
    const failedFields: any = { backend: backend.name, reason: detail };
    if (rawMessage !== detail) failedFields.raw_reason = rawMessage;
    safeRemoveRunningFlag(flagRoot, normalizedSessionId, 'sessions/messages');
    safeWriteFailedFlag(flagRoot, normalizedSessionId, failedFields, 'sessions/messages');
    try { Sessions.setIdle(normalizedSessionId, user.id); } catch {}
    try { Messages.insertSystem(normalizedSessionId, detail, turnNum, '启动失败'); } catch {}
    throw httpError(detail, 500, 'backend');
```

</details>

#### 缺口

- UNKNOWN与reconcile能否减少重复副作用未试验。
  **影响**：仅未来机制，不是现有保证。
  **进一步探讨**：三故障注入比较重复／误空闲／恢复，无改善或锁死则否定。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
