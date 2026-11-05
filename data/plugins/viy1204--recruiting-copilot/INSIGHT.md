# Recruiting Copilot

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[d802c52](https://github.com/Viy1204/recruiting-copilot/tree/d802c52756a61a90e0b8d0ad704242335193956c)

<!-- BEGIN META -->
[![GitHub ★ 107](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=107&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Viy1204/recruiting-copilot)
<!-- END META -->

> **功能**：将招聘 Skill、平台浏览器观察和本地招聘看板接入 DSH。

> **亮点**：[Q01](#research-q01) 统一招聘流程、回执与本地进展。

> **主要限制**：[Q02](#research-q02) Skill 授权约定与实际外发约束需分别验收。

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
  - [Q01 · 招聘团队获得怎样的工作入口？](#detail-section-11)
  - [Q02 · 授权要求和看板保护落在哪里？](#detail-section-12)
  - [Q03 · 如何在不接触真实候选人的情况下试用？](#detail-section-13)
  - [Q04 · 发送状态未知时能否减少重复联系？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有稳定招聘流程、需要整理岗位和人选的团队。

在招聘站点与台账之间手工整理和核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作流 | 初始化与招聘回执 | 外部操作需授权 |
| 看板 | 读取本地岗位人选及部分编辑 | 回环与来源约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web 与 Node | 看板试用必需 | 启动工作区入口 | 手工台账 |
| 平台 CLI 与账号 | 外部动作需要 | 访问站点 | 先保持停用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 合成岗位与候选人 | 确认工作区 |
| 验证 | 走查回执、看板与误连 | 读回结果 |
| 退出 | 停止服务并禁用 | 核对数据目录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本机资源未知 | 准备合成工作区 | 未测 |
| 持续 | 平台与人工成本未知 | 核对授权及回执 | 按真实规模 |
| 退出 | 保留处理成本未知 | 按留存要求归档 | 验证目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 本地进展 | 看板和回执 | 采用节省 |
| 外发 | Skill 约定回查 | CLI 强制性 |

> **思考**：[Q02](#research-q02) Skill 授权约定与实际外发约束需分别验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一招聘流程、回执与本地进展。

[Q02](#research-q02) 分开核验看板与平台。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Skill 授权约定与实际外发约束需分别验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用独立工作区。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码与作者说明，未执行。

- 已检查：作者 README、包清单、源码路径 README.md、dsh/cordis.patch.yml、package.json、skills/recruit-board/scripts/server.mjs、skills/recruit-daily/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 bundle 与看板代表代码。
- 下一步：用模拟 CLI 验证外发和合成看板。

**分析版本**

- **仓库**：[Viy1204/recruiting-copilot](https://github.com/Viy1204/recruiting-copilot)
- **版本号**：0.8.1（[固定提交 d802c52](https://github.com/Viy1204/recruiting-copilot/tree/d802c52756a61a90e0b8d0ad704242335193956c)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 持久未知状态收据可能减少重复联系。

用模拟 CLI 验证外发和合成看板。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 4725 | — | — | 102129 |
| .js | source | 3 | 4557 | 3923 | 412 | — |
| .mjs | source | 26 | 4587 | 4370 | 32 | — |
| .mjs | test | 21 | 5241 | 4861 | 145 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Viy1204/recruiting-copilot/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/Viy1204/recruiting-copilot/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Viy1204/recruiting-copilot/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：招聘流程、平台动作和本地看板怎样分工？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 招聘团队获得怎样的工作入口？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在 DSH 注册招聘工作流 Skill，平台操作走外部 CLI，宿主另挂浏览器观察面板，本地进展看板读取岗位与候选人记录。相比分开跑 CLI 和手工登记，Skill 约定每人回执、跨轮待决事项和状态；看板将结果集中展示。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cordis.patch.yml:21-46](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/dsh/cordis.patch.yml#L21-L46)

Skill 全局层及平台镜像配置

<details>
<summary>查看原文（26行）</summary>

```text
- id: skill-filesystem
  name: '@deepseek-ai/dsh-skill-filesystem'
  disabled: false
  config:
    customSkillDirs:
      - !!js decodeURIComponent(new URL('node_modules/recruiting-copilot/skills', ctx.baseUrl).pathname).replace(/^\/+([A-Za-z]:)/, '$1')

# 本包作为 cordis 插件 + 客户端模块挂载。headless 等无 webServer 的 profile
# 下 host 插件自动降级（只注册 skill），客户端面板仅 web profile 有意义。
- insert:
    - id: recruiting-copilot
      name: 'recruiting-copilot'
      config:
        # 两个 CLI 各占一个固定 CDP 调试端口，浏览器跨命令常驻，所以面板能一直连着。
        # 端口可分别用 BOSS_BROWSER_REMOTE_DEBUGGING_PORT /
        # LIEPIN_BROWSER_REMOTE_DEBUGGING_PORT 覆盖；改了这里也要跟着改。
        # 其余字段（homeUrl / userDataDir）从 lib/index.js 的 DEFAULT_SOURCES 补。
        sources:
          - name: boss
            port: 53470
            match: zhipin\.com
          - name: liepin
            port: 53471
            match: liepin\.com
        frameIntervalMs: 1000
        jpegQuality: 60
```

</details>

**依据 2 · 作者声明**：[skills/recruit-daily/SKILL.md:13-17](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/skills/recruit-daily/SKILL.md#L13-L17)

工作流与回执约定

```text
网页开工（默认）：确认用户招聘工作区后，按 [`../recruit-board/references/hosts.md`](../recruit-board/references/hosts.md) 统一接入；脚本可用时为 `daily` 先 start、保存 run id 并进入真实步骤，在耗时寻源前确认服务并打开或复用网页，同时交付本轮链接。步骤、降级和记录命令遵循 [`共享进度协议`](../recruit-board/references/progress.md)，按下方完成判据结束各步，跳步写理由，整轮无法继续而等待授权时记 `wait`。

在 unread / screen / greet 等实际步骤中每处理完一人就及时写 `result`，初筛未通过、失败或跳过也写理由，未核实发送不记成功。按 [`跨轮事项与重点`](../recruit-board/references/decisions.md) 开工先读未解决事项和待执行动作；主动任务标 `manual`，定时巡检标 `scheduled`。需要用户拍板时登记独立事项并把返回的 `decisionId` 关联收据；只暂停依赖该决定的动作，其余已授权工作继续。有价值的核实进展立即记 `highlight`；新事项和重点按共享契约写已核实的 `context`，人选使用 `scope:candidate` 与 `candidateId=JSON.stringify([姓名,原岗位])`，岗位／工作区问题分别标 scope，不凭自由文本猜关联。重点的 `details` 只记适用的核实细节，最多 8 项短文本；旧格式仍可读。收尾在结束 run 前写 `summary`，没有变化也明确记录，不能把未记录当成无变化。

普通巡检的执行范围以调度任务原指令为准：只读巡检不会因发现待执行动作获得外发权限。本轮持续打招呼授权不跨轮继承；续办前核对具体授权是否仍有效、动作是否已经完成。用户拍板后更新独立事项，并分别记录标准／台账同步和实际动作结果；不需要重开已经结束的 run。
```

**依据 3 · 作者声明**：[README.md:189-208](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/README.md#L189-L208)

作者说明进展看板用途

<details>
<summary>查看原文（20行）</summary>

```text
## 招聘进展看板

网页现在以“招聘工作台”组织任务与人选。初始化、岗位梳理、每日招聘、人才盘点、简历评估和约面试这六个流程，在进度脚本可用时记录真实步骤，并尽早打开或复用工作台。

![v0.8.1 招聘工作台：待确认事项与近期进展分别展示，人选、岗位和事件细节清晰可读](verification/board-web-only-light.jpg)

*v0.8.1 实际网页，使用隔离的合成岗位、人选与任务。总览的事项和进展各自按内容定高；岗位与人选、执行记录通过导航查看。*

<img src="verification/board-web-only-mobile.jpg" alt="同一招聘工作台在320px窄屏下显示导航和带人岗背景的事项" width="320">

*同一网页的 320px 窄屏截图，不含宿主外框。能否停靠在 AI 工具侧栏取决于宿主，普通浏览器也可打开。*

- 在顶部 **搜索人选** 输入完整或部分姓名，查找全部岗位、阶段和历史岗位中的记录。结果在岗位区显示，清空后恢复原筛选。
- 从 Workspace 定位到岗位或执行记录，直接打开关注岗位；窄栏中的正文仍保留所有入口。
- 查看跨轮待回答／待核对事项，按岗位找到人选与问题；近期进展展示对象和关键细节。进展、关联事项和人选资料可以逐层返回。
- 用 **调整布局** 重排模块，偏好按工作区保存在本机。明确无确认事项时只显示紧凑摘要。

看板读取已写入工作区的数据，不连接招聘平台。读取正常不代表 AI 进程仍在运行；候选台账保持只读，岗位保存只更新本地 `CONTEXT.md` 并备份，不改变平台职位。旧工作区缺少进度脚本时，招聘流程仍可继续，并说明本轮未记录进度。

完整的宽窄布局、搜索、排序、资料和手动打开图解见[招聘工作台使用说明](docs/recruit-board.md)。v0.8.1 按 [ADR 0003](docs/adr/0003-web-only-board.md) 仅维护网页看板，所有 Agent 共用同一入口。已安装的独立原生插件或开发预览不会自动删除，升级与停用步骤见[原生入口退役说明](skills/recruit-board/references/hosts.md#原生入口退役与升级)。
```

</details>

#### 缺口

- 未在宿主中装载或运行真实招聘流程
  **影响**：实际可用性和时长未知
  **进一步探讨**：以合成候选人与模拟 CLI 试走

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 授权要求和看板保护落在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

外发确认、每轮授权和发送后回查写在 Skill 中，不能据此认定 CLI 无法绕过。看板检查本机 Host 及跨站来源，岗位和资料关联写入还校验 CSRF。workspace 标识用于防止误连，缺少时通过此检查，不能当作本地身份认证。

#### 证据与依据

**依据 1 · 作者声明**：[skills/recruit-daily/SKILL.md:76-88](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/skills/recruit-daily/SKILL.md#L76-L88)

确认及实际发送核验约定

<details>
<summary>查看原文（13行）</summary>

```text
   - **完成判据**：今天每个出过「初筛通过」人选的岗位，迭代表都新增了一行。

## 打招呼安全规则（对外不可逆，最重要）

- **默认逐个/批量打招呼前必须用户确认**（不群发）。用户在本轮**明确授权**"合适的直接打招呼"
  即视为本轮的持续授权，可直接打，但**逐一回报**打了谁；跨轮不自动延续，明天要重新授权。
- **boss 搜索池打招呼没有自动模式**（`--greet auto` 不存在）：只能 `boss search` 之后
  `boss greet --index <序号>` 一个一个点，**消耗开聊权益或畅聊卡且不可撤回**（两者并存，VIP 每日权益每次 30 点）。先 `--dry-run` 验证定位，
  再去掉它真打。既然是逐个点，就别指望工具替你筛——**命脉判断在打之前做完**，
  用命脉关键词 + `--degree/--exp-range/--status` 这些筛选参数把池子收窄，再逐个确认。
  ⚠️ **账号权益耗尽会是「静默失败」**（卡片只剩「联系Ta」，点了不报错也不建会话，CLI 却回显 ✅）。
  **boss-cli ≥0.8.3 自动切畅聊卡并重试**；**打完必须回 `boss list` 数新增会话**才算数。
  ⚠️ `boss search` 会残留上次岗位（实测退回「动捕导演」致池子全错、按序号打错人）——每次先看输出头是不是「不限职位」。
```

</details>

**依据 2 · 源码核查**：[skills/recruit-board/scripts/server.mjs:76-110](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/skills/recruit-board/scripts/server.mjs#L76-L110)

来源、工作区和写入校验

<details>
<summary>查看原文（35行）</summary>

```text
    const address = server.address();
    const hosts = new Set([`127.0.0.1:${address.port}`, `localhost:${address.port}`, ...(address.port === 80 ? ['127.0.0.1', 'localhost'] : [])]);
    if (!hosts.has(request.headers.host)) { send(403, 'text/plain; charset=utf-8', '仅允许从本机看板访问'); return; }
    const origin = new URL(`http://${request.headers.host}`).origin;
    const sameOrigin = request.headers.origin === origin || (address.port === 80 && request.headers.origin === `${origin}:80`);
    let url;
    try { url = new URL(request.url, origin); }
    catch { send(400, 'text/plain; charset=utf-8', '请求地址无效'); return; }
    if (url.origin !== origin) { send(400, 'text/plain; charset=utf-8', '请求地址必须同源'); return; }
    const homepageNavigation = request.method === 'GET' && url.pathname === '/' && request.headers['sec-fetch-mode'] === 'navigate' && request.headers['sec-fetch-dest'] === 'document';
    if ((request.headers.origin && !sameOrigin) || (request.headers['sec-fetch-site'] === 'cross-site' && !homepageNavigation)) {
      send(403, 'text/plain; charset=utf-8', '仅允许从本机看板访问'); return;
    }
    if (url.pathname === '/' || url.pathname.startsWith('/api/')) {
      const keys = url.searchParams.getAll('workspace');
      const headerKey = request.headers['x-workspace-key'];
      if (keys.length > 1 || keys.some(key => !/^[a-f0-9]{64}$/.test(key)) || (headerKey !== undefined && (typeof headerKey !== 'string' || !/^[a-f0-9]{64}$/.test(headerKey)))) {
        send(400, 'application/json; charset=utf-8', JSON.stringify({ error: { code: 'WORKSPACE_INPUT_INVALID', message: '工作区标识参数无效' } })); return;
      }
      if (keys.some(key => key !== workspaceKey) || (headerKey !== undefined && headerKey !== workspaceKey)) {
        send(409, 'application/json; charset=utf-8', JSON.stringify({ error: { code: 'WORKSPACE_MISMATCH', message: '此地址的服务属于另一工作区，请重新连接当前工作区看板' } })); return;
      }
    }
    const params = new URLSearchParams(url.searchParams);
    params.delete('workspace');
    const resource = `${url.pathname}${params.size ? `?${params}` : ''}`;
    if (request.method === 'POST' && ['/api/roles/status', '/api/roles/alias', '/api/candidates/materials'].includes(resource)) {
      const token = request.headers['x-csrf-token'];
      if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || !timingSafeEqual(Buffer.from(token), Buffer.from(csrfToken)) || (!sameOrigin && request.headers['sec-fetch-site'] !== 'same-origin')) {
        send(403, 'application/json; charset=utf-8', JSON.stringify({ error: { code: 'CSRF_REJECTED', message: '请从本机看板重新打开岗位管理后保存' } })); return;
      }
      try {
        const materials = resource === '/api/candidates/materials', alias = resource === '/api/roles/alias';
        const input = await readRoleRequest(request, materials ? ['candidateId', 'revision', 'files'] : alias ? ['role', 'target', 'revision'] : ['role', 'status', 'revision']);
        const result = await (materials ? setCandidateMaterials : alias ? setRoleAlias : setRoleStatus)({ workspace: root, ...input });
```

</details>

**依据 3 · 作者声明**：[README.md:210-216](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/README.md#L210-L216)

作者说明外发范围

```text
## 使用边界

- 打招呼、拒绝、通知候选人、发 offer 等对外动作默认先获得你的确认，不自动拒人。本轮打招呼授权只在本轮有效。
- 创建面试日程前，先确认时间、人选、面试官与标题。候选人邀约默认只生成话术，明确要求代发后才发送。
- 两个平台默认使用可见浏览器。保留默认模式，不设 `RECRUIT_BROWSER_HIDDEN=true`。遇到验证码、安全验证、账号限制或不明发送结果时停止，先人工核验，不反复刷新、重登或重发。
- 对内寻源策略、排除信号和商业敏感资料保留在内部笔记中，按已确认口径生成对外 JD、话术与报告。
- 飞书邮箱仅作为简历输入渠道，按指定范围只读收取，不标已读、不移动或删除、不回复或转发。风险附件不自动下载。
```

#### 缺口

- 真实 CLI 身份、宿主审批与本机进程访问未测
  **影响**：不能确定强制审批与候选人数据隔离
  **进一步探讨**：用模拟未授权动作及跨工作区请求检查

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何在不接触真实候选人的情况下试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用 Node 和独立 DSH 工作区，先用合成岗位、简历和台账验证看板。外部寻源依赖各 CLI、登录及平台权限，飞书可选。持续成本主要是核对平台状态、候选人资料和失败动作，金额未实测。退出时停看板、禁用 bundle，按团队留存规则处理测试目录。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-29](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/package.json#L23-L29)

Node 与看板入口

```text
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "test": "node --test \"tests/*.test.mjs\"",
    "board": "node skills/recruit-board/scripts/server.mjs",
    "board:progress": "node skills/recruit-board/scripts/progress.mjs"
```

**依据 2 · 作者声明**：[README.md:128-144](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/README.md#L128-L144)

DSH、平台 CLI 和飞书

<details>
<summary>查看原文（17行）</summary>

````text
### DeepSeek Harness 入口

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 用户在使用 Web profile 的环境中安装：

```bash
dsh plugin --profile web add git+https://github.com/Viy1204/recruiting-copilot.git#v0.8.1
```

重新打开 DSH 会话后，8 个招聘 Skill 在任意工作区可用。首次仍从“帮我初始化招聘工作区”开始，之后打开新建的招聘工作区处理日常任务。

DSH 另有独立的 **招聘浏览器**，用于观察两个 CLI 的平台页面，默认折叠、只读。它显示平台页面，招聘进展看板则显示本地任务和人选记录。日常平台动作走 CLI。安装、更新和该面板的说明见 [DSH 文档](dsh/README.md)。

### 飞书能力按需配置

飞书是可选项。安装并配置 `lark-cli` 后，可生成飞书日报文档、按授权推送日报卡片、查询面试官忙闲和创建带视频会议的日程，也可从飞书邮箱收取简历。

未配置时，日报和批量简历评估汇总保存在 `runtime/reports/`，简历由你提供，约面试给出手动建会清单和邀约话术。寻源、本地简历评估、台账和档案仍可使用。
````

</details>

**依据 3 · 作者声明**：[README.md:206-208](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/README.md#L206-L208)

看板与退役说明

```text
看板读取已写入工作区的数据，不连接招聘平台。读取正常不代表 AI 进程仍在运行；候选台账保持只读，岗位保存只更新本地 `CONTEXT.md` 并备份，不改变平台职位。旧工作区缺少进度脚本时，招聘流程仍可继续，并说明本轮未记录进度。

完整的宽窄布局、搜索、排序、资料和手动打开图解见[招聘工作台使用说明](docs/recruit-board.md)。v0.8.1 按 [ADR 0003](docs/adr/0003-web-only-board.md) 仅维护网页看板，所有 Agent 共用同一入口。已安装的独立原生插件或开发预览不会自动删除，升级与停用步骤见[原生入口退役说明](skills/recruit-board/references/hosts.md#原生入口退役与升级)。
```

#### 缺口

- 平台接入和退出未实测
  **影响**：实际人时和兼容成本未知
  **进一步探讨**：先以无外部账户的只读工作区演练

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 发送状态未知时能否减少重复联系？

**研究主题**：新假设与验证

#### 完整回答

对照当前 CLI 回查约定，可增加工作区持久收据，记录尝试、已核验和结果未知。模拟发出后超时及恢复，只有读回能证明未发且原授权有效时再尝试。比较重复联系和人工补账时间，若无改善则撤回。

#### 证据与依据

**依据 1 · 作者声明**：[skills/recruit-daily/SKILL.md:13-17](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/skills/recruit-daily/SKILL.md#L13-L17)

现有结果记录规则

```text
网页开工（默认）：确认用户招聘工作区后，按 [`../recruit-board/references/hosts.md`](../recruit-board/references/hosts.md) 统一接入；脚本可用时为 `daily` 先 start、保存 run id 并进入真实步骤，在耗时寻源前确认服务并打开或复用网页，同时交付本轮链接。步骤、降级和记录命令遵循 [`共享进度协议`](../recruit-board/references/progress.md)，按下方完成判据结束各步，跳步写理由，整轮无法继续而等待授权时记 `wait`。

在 unread / screen / greet 等实际步骤中每处理完一人就及时写 `result`，初筛未通过、失败或跳过也写理由，未核实发送不记成功。按 [`跨轮事项与重点`](../recruit-board/references/decisions.md) 开工先读未解决事项和待执行动作；主动任务标 `manual`，定时巡检标 `scheduled`。需要用户拍板时登记独立事项并把返回的 `decisionId` 关联收据；只暂停依赖该决定的动作，其余已授权工作继续。有价值的核实进展立即记 `highlight`；新事项和重点按共享契约写已核实的 `context`，人选使用 `scope:candidate` 与 `candidateId=JSON.stringify([姓名,原岗位])`，岗位／工作区问题分别标 scope，不凭自由文本猜关联。重点的 `details` 只记适用的核实细节，最多 8 项短文本；旧格式仍可读。收尾在结束 run 前写 `summary`，没有变化也明确记录，不能把未记录当成无变化。

普通巡检的执行范围以调度任务原指令为准：只读巡检不会因发现待执行动作获得外发权限。本轮持续打招呼授权不跨轮继承；续办前核对具体授权是否仍有效、动作是否已经完成。用户拍板后更新独立事项，并分别记录标准／台账同步和实际动作结果；不需要重开已经结束的 run。
```

**依据 2 · 作者声明**：[skills/recruit-daily/SKILL.md:80-88](https://github.com/Viy1204/recruiting-copilot/blob/d802c52756a61a90e0b8d0ad704242335193956c/skills/recruit-daily/SKILL.md#L80-L88)

回查和跨轮授权

```text
- **默认逐个/批量打招呼前必须用户确认**（不群发）。用户在本轮**明确授权**"合适的直接打招呼"
  即视为本轮的持续授权，可直接打，但**逐一回报**打了谁；跨轮不自动延续，明天要重新授权。
- **boss 搜索池打招呼没有自动模式**（`--greet auto` 不存在）：只能 `boss search` 之后
  `boss greet --index <序号>` 一个一个点，**消耗开聊权益或畅聊卡且不可撤回**（两者并存，VIP 每日权益每次 30 点）。先 `--dry-run` 验证定位，
  再去掉它真打。既然是逐个点，就别指望工具替你筛——**命脉判断在打之前做完**，
  用命脉关键词 + `--degree/--exp-range/--status` 这些筛选参数把池子收窄，再逐个确认。
  ⚠️ **账号权益耗尽会是「静默失败」**（卡片只剩「联系Ta」，点了不报错也不建会话，CLI 却回显 ✅）。
  **boss-cli ≥0.8.3 自动切畅聊卡并重试**；**打完必须回 `boss list` 数新增会话**才算数。
  ⚠️ `boss search` 会残留上次岗位（实测退回「动捕导演」致池子全错、按序号打错人）——每次先看输出头是不是「不限职位」。
```

#### 缺口

- 平台是否支持可靠读回未知
  **影响**：收据本身不能证明远程动作
  **进一步探讨**：用假平台注入超时和延迟可见

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
