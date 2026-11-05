# DSH 红队模式

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7b3de2d](https://github.com/Jueze-2019/dsh-redteam-mode/tree/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle)

<!-- BEGIN META -->
[![GitHub ★ 147](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=147&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jueze-2019/dsh-redteam-mode) [![npm 30d 4,478](https://img.shields.io/static/v1?label=npm+30d&message=4%2C478&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-redteam-mode) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-redteam-mode)
<!-- END META -->

> **功能**：为经授权的安全演练提供角色预设、范围检查、事实库和报告工具。

> **亮点**：[Q01](#research-q01) 关联角色、项目和发现记录。

> **主要限制**：[Q03](#research-q03) 范围结果不是硬授权，未解析也可能返回 ok。

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
  - [Q01 · 对演练团队有什么组织价值？](#detail-section-11)
  - [Q02 · 工作角色如何限制进一步委派？](#detail-section-12)
  - [Q03 · scope check 能强制防止越界吗？](#detail-section-13)
  - [Q04 · 何种试用有可控退路？](#detail-section-14)
  - [Q05 · 未知范围的 UI 能避免误判吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：授权安全演练团队可评估会话内的事实与报告组织。

人工台账能控制记录但需重复整理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 范围诊断 | 读取匹配结果 | 未知不等于授权 |
| 事实库 | 组织演练证据 | 实际发现需复核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 明确授权 | 执行必需 | 定义操作范围 | 不执行 |
| 兼容 DSH | 插件必需 | 挂载角色和事实库 | 回人工记录 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离并核对书面范围 | 使用合成样本 |
| 核查 | 验证角色与拒绝 | 区分诊断和硬限制 |
| 退出 | 关闭预设 | 保留受控台账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境资源未知 | 配置耗时未知 | 仅封闭演练 |
| 持续 | 维护成本未知 | 审阅耗时未知 | 事实需复核 |
| 恢复 | 恢复资源未知 | 排查耗时未知 | 不能依赖范围提示阻断 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 事实组织 | 范围和写入状态可定位 | 安全与报告收益未验 |

> **思考**：[Q03](#research-q03) 范围结果不是硬授权，未解析也可能返回 ok。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 关联角色、项目和发现记录。

角色预设、记录和实际宿主边界各自独立。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 范围结果不是硬授权，未解析也可能返回 ok。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在封闭测试配置验证，缺授权不执行。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的授权范围提示、角色挂载和实际隔离的区别。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 packages/redteam-bundle/README.md、packages/redteam-bundle/lib/tools.js、packages/redteam-bundle/cordis.patch.yml 及固定范围 inventory；组件：packages/redteam-bundle。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的授权范围提示、角色挂载和实际隔离的区别。未执行目标代码或实际宿主验证。
- 下一步：用合成拒绝样例比较

**分析版本**

- **仓库**：[Jueze-2019/dsh-redteam-mode](https://github.com/Jueze-2019/dsh-redteam-mode)
- **版本号**：0.15.8（[固定提交 7b3de2d](https://github.com/Jueze-2019/dsh-redteam-mode/tree/7b3de2d278fb317bd9c0adebd08b54b4137459d6)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较明确标记未知状态的误判率。

用合成拒绝样例比较

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 14 | 18761 | 15070 | 2893 | — |
| .mjs | source | 5 | 785 | 575 | 169 | — |
| .md | source | 42 | 4506 | — | — | 48088 |
| .mjs | test | 3 | 534 | 410 | 93 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Jueze-2019/dsh-redteam-mode/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Jueze-2019/dsh-redteam-mode/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Jueze-2019/dsh-redteam-mode/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：授权范围提示、角色挂载和实际隔离的区别

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对演练团队有什么组织价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

有明确书面授权的团队可以在同一项目下记录资产、发现及报告。相比散落文本，绑定信息和批量记录帮助组织证据，但记录并不代替独立复核。

#### 证据与依据

**依据 1 · 作者声明**：[packages/redteam-bundle/README.md:3-5](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/README.md#L3-L5)

作者说明范围

```text
DeepSeek Harness 的**红队作战模式**插件：给一个靶标单位名称，就拉起一支红队智能体
（信息收集 → 漏洞检测 → 漏洞利用 → 内网渗透），所有发现落进本机 SQLite 事实库，
右侧常驻控制台实时看资产、得分与报告。
```

**依据 2 · 源码核查**：[packages/redteam-bundle/lib/tools.js:643-670](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L643-L670)

会话绑定和范围工具

<details>
<summary>查看原文（28行）</summary>

```text
        note: '本会话已绑定到「' + hit.name + '」；后续工具与报告都只作用于它。',
      }, null, 2)
    },
  })))

  registerTool(withStructuredErrors(defineTool({
    name: 'redteam_scope_check',
    description: '检查一个 IP/URL/域名是否在当前靶标的授权 scope 内（scope 来自 redteam_engagement_open）。域名无法解析时返回 unresolved；scope 为空时返回 unscoped（不阻断，但提示用户补范围）。',
    parameters: {
      engagement: { type: 'string' },
      target: { type: 'string', required: true, description: '要检查的 IP / URL / 域名' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => text(value) },
    async execute(args, exec) {
      const id = resolveEngagement(store, exec, args.engagement)
      const check = scopeCheck(store, id, args.target)
      const ok = check.status === 'in' || check.status === 'unscoped' || check.status === 'unresolved'
      return JSON.stringify({ ok, engagement: id, target: args.target, ...check }, null, 2)
    },
  })))

  registerTool(withStructuredErrors(defineTool({
    name: 'redteam_session_info',
    description: '查看**当前会话绑定的是哪个靶标**（会话 id、父会话、根会话、绑定链）。多会话同时开工时，先跑它确认自己没串到别人的靶标上。',
    parameters: {},
    output: { schema: { type: 'string' }, render: (_args, value) => text(value) },
    async execute(_args, exec) {
      const view = bindingViewOf(exec, store)
```

</details>

**依据 3 · 源码核查**：[packages/redteam-bundle/lib/tools.js:1034-1054](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L1034-L1054)

批量记录与拒绝

<details>
<summary>查看原文（21行）</summary>

```text
      const rejected = []
      const results = []
      if (kind === 'assets') {
        const accepted = []
        for (const it of items) {
          const check = scopeCheck(store, id, it && it.ip)
          if (check.status === 'out') { rejected.push({ ip: it && it.ip, reason: 'out_of_scope', scope: check.scope }); continue }
          if (!it || typeof it.ip !== 'string' || it.ip.trim() === '') { rejected.push({ item: it, reason: 'ip required' }); continue }
          accepted.push(it)
        }
        const out = accepted.length > 0
          ? store.importBundle(id, { scan: { tool: 'redteam_batch', argv: ['assets'] }, assets: accepted })
          : { counts: { assets: 0 } }
        return JSON.stringify({ ok: true, engagement: id, kind, accepted: accepted.length, rejected: rejected.length, counts: out.counts, rejected }, null, 2)
      }
      if (kind === 'assess') {
        for (const it of items) {
          try { results.push(store.assessAsset(id, it || {})) }
          catch (error) { rejected.push({ item: it, reason: error && error.message ? error.message : String(error) }) }
        }
        return JSON.stringify({ ok: true, engagement: id, kind, assessed: results.length, rejected: rejected.length, results, rejected }, null, 2)
```

</details>

#### 缺口

- 未评估真实团队
  **影响**：不能确定报告省时
  **进一步探讨**：用合成事件比较可追溯性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作角色如何限制进一步委派？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

固定补丁用 worker 预设并传 maxDepth 1，允许选择列出的角色。宿主版本必须支持相应字段，工作工具、沙箱和审批由宿主平面决定。该配置约束角色组织，不能证明执行边界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/redteam-bundle/cordis.patch.yml:385-403](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/cordis.patch.yml#L385-L403)

预设和深度

<details>
<summary>查看原文（19行）</summary>

```text
                  provider: spawn
                  toolName: subagent
                  modelSelectionSettings: true
                  backgroundMode: continuable
                  # 子智能体是角色执行者（信息收集/资产梳理/漏洞发现/漏洞利用/内网渗透），**必须是叶子节点**。
                  # DSH 0.2.1 起 tool-subagent 移除了 toolFilter/persona：再写这两个字段会在 apply() 直接抛错
                  # "toolFilter is no longer supported"。新版的做法是把子会话的人设与工具集放进一个独立的
                  # Agent Preset（见 preset/worker.cordis.yml），再用 agentPreset 指过去（spawn 专用）。
                  # redteam-worker 只挂执行侧工具、**不挂任何委派工具**（subagent / subagent_fork /
                  # workflow / ralph 都没有），子智能体连看都看不到；maxDepth: 1 同时作为二道保险。
                  agentPreset: redteam-worker
                  allowedAgentPresets:
                    - redteam-worker
                    - redteam-worker-recon
                    - redteam-worker-assess
                    - redteam-worker-vuln-scan
                    - redteam-worker-exploit
                    - redteam-worker-internal
                  maxDepth: 1
```

</details>

**依据 2 · 源码核查**：[packages/redteam-bundle/cordis.patch.yml:580-587](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/cordis.patch.yml#L580-L587)

宿主管理执行边界

```text
          # ── shell ───────────────────────────────────────────────────────────────────

          # `shell-env` / sandbox / approval 都在 host 平面；这里只挂模型可见的工具行。
          - id: tool-bash
            name: '@deepseek-ai/dsh-tool-bash'
            disabled: !!js process.platform === 'win32'

          - id: tool-pwsh
```

**依据 3 · 作者声明**：[packages/redteam-bundle/README.md:16-27](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/README.md#L16-L27)

作者版本限制

<details>
<summary>查看原文（12行）</summary>

```text
> **版本对应**：DSH **0.2.1 及以上**用 **0.15.8 及更新的版本**；DSH **0.1.7–0.2.0** 用
> 0.12.1–0.13.1；DSH **0.1.6 及更低**用 0.12.0 及更早版本。0.12.0 及更早的插件在
> DSH 0.1.7+ 上，新建会话的模式列表里不会出现「红队模式」（资产库、控制台、工具与技能都不受影响）。
>
> **DSH 0.2.1 的破坏性变更**：`@deepseek-ai/dsh-tool-subagent` 移除了 `toolFilter` / `persona`，
> 再写会在 `apply()` 直接抛错 `toolFilter is no longer supported`，`subagent` 委派工具不再注册。
> 0.13.2 起红队预设改用独立的 `redteam-worker` 执行角色预设 + `agentPreset`；升级 DSH 后请同时
> 升级本插件。旧版 DSH 仍可加载本版（未知字段被忽略），但子智能体的叶子约束只剩 `maxDepth: 1`。

使用：新建会话 → 选预设 **红队模式** → 直接发靶标单位名称。

> **关于工具链**：本包包含全部 39 个技能；不包含任何自动下载/安装安全工具的脚本、二进制、安装链接或教程。工具由用户自行准备。
```

</details>

#### 缺口

- 未运行宿主
  **影响**：角色限制未验收
  **进一步探讨**：用无外部访问的测试配置确认工具可见性

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · scope check 能强制防止越界吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

范围工具对空范围或无法解析目标返回 unscoped 或 unresolved，外层 ok 仍为真；资产写入代表分支只拒绝 out。这是诊断与记录门槛，不能把 ok 当作授权结论，也没有证据显示能替代执行和网络层硬限制。

#### 证据与依据

**依据 1 · 源码核查**：[packages/redteam-bundle/lib/tools.js:325-332](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L325-L332)

范围状态

```text
function scopeCheck(store, id, target) {
  const scope = scopeOfEngagement(store, id)
  if (scope.length === 0) return { status: 'unscoped', scope, ip: null }
  const ip = targetIpv4(target)
  if (ip === null) return { status: 'unresolved', scope, ip: null }
  const hit = scope.find((cidr) => ipInCidr(ip, cidr))
  return { status: hit === undefined ? 'out' : 'in', scope, ip, cidr: hit || null }
}
```

**依据 2 · 源码核查**：[packages/redteam-bundle/lib/tools.js:648-661](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L648-L661)

未知仍 ok

<details>
<summary>查看原文（14行）</summary>

```text
  registerTool(withStructuredErrors(defineTool({
    name: 'redteam_scope_check',
    description: '检查一个 IP/URL/域名是否在当前靶标的授权 scope 内（scope 来自 redteam_engagement_open）。域名无法解析时返回 unresolved；scope 为空时返回 unscoped（不阻断，但提示用户补范围）。',
    parameters: {
      engagement: { type: 'string' },
      target: { type: 'string', required: true, description: '要检查的 IP / URL / 域名' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => text(value) },
    async execute(args, exec) {
      const id = resolveEngagement(store, exec, args.engagement)
      const check = scopeCheck(store, id, args.target)
      const ok = check.status === 'in' || check.status === 'unscoped' || check.status === 'unresolved'
      return JSON.stringify({ ok, engagement: id, target: args.target, ...check }, null, 2)
    },
```

</details>

**依据 3 · 源码核查**：[packages/redteam-bundle/lib/tools.js:1034-1047](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L1034-L1047)

代表写入门槛

<details>
<summary>查看原文（14行）</summary>

```text
      const rejected = []
      const results = []
      if (kind === 'assets') {
        const accepted = []
        for (const it of items) {
          const check = scopeCheck(store, id, it && it.ip)
          if (check.status === 'out') { rejected.push({ ip: it && it.ip, reason: 'out_of_scope', scope: check.scope }); continue }
          if (!it || typeof it.ip !== 'string' || it.ip.trim() === '') { rejected.push({ item: it, reason: 'ip required' }); continue }
          accepted.push(it)
        }
        const out = accepted.length > 0
          ? store.importBundle(id, { scan: { tool: 'redteam_batch', argv: ['assets'] }, assets: accepted })
          : { counts: { assets: 0 } }
        return JSON.stringify({ ok: true, engagement: id, kind, accepted: accepted.length, rejected: rejected.length, counts: out.counts, rejected }, null, 2)
```

</details>

**依据 4 · 作者声明**：[packages/redteam-bundle/README.md:92-95](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/README.md#L92-L95)

作者要求书面授权

```text
## 授权与合规

**仅在获得明确书面授权的范围内使用**。本插件是作战工具：它本身不替你做授权判断，
请自行确认目标范围、时间窗与允许手段，并遵守所在司法辖区法律。
```

#### 缺口

- 未穷尽宿主权限策略
  **影响**：不能确认出站约束
  **进一步探讨**：用封闭环境验证拒绝且不发真实流量

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种试用有可控退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

仅在明确授权的隔离演练配置中验证事实库、范围标志和角色可见性。包不自带外部执行工具，宿主版本与权限需分开验收。若 scope 缺失或执行边界不可确认，关闭预设并改用人工台账。

#### 证据与依据

**依据 1 · 作者声明**：[packages/redteam-bundle/README.md:7-27](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/README.md#L7-L27)

环境及工具前提

<details>
<summary>查看原文（21行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add dsh-redteam-mode
```

装完重启一次 `dsh web`，然后在**设置 → 插件市场**里就能看到它（也可以直接在上面搜
`redteam`）。插件自带 `红队模式` 与 39 个技能（含 AD/云/网络设备/数据/C2 等专项技能），不需要手动拷任何文件。

> **版本对应**：DSH **0.2.1 及以上**用 **0.15.8 及更新的版本**；DSH **0.1.7–0.2.0** 用
> 0.12.1–0.13.1；DSH **0.1.6 及更低**用 0.12.0 及更早版本。0.12.0 及更早的插件在
> DSH 0.1.7+ 上，新建会话的模式列表里不会出现「红队模式」（资产库、控制台、工具与技能都不受影响）。
>
> **DSH 0.2.1 的破坏性变更**：`@deepseek-ai/dsh-tool-subagent` 移除了 `toolFilter` / `persona`，
> 再写会在 `apply()` 直接抛错 `toolFilter is no longer supported`，`subagent` 委派工具不再注册。
> 0.13.2 起红队预设改用独立的 `redteam-worker` 执行角色预设 + `agentPreset`；升级 DSH 后请同时
> 升级本插件。旧版 DSH 仍可加载本版（未知字段被忽略），但子智能体的叶子约束只剩 `maxDepth: 1`。

使用：新建会话 → 选预设 **红队模式** → 直接发靶标单位名称。

> **关于工具链**：本包包含全部 39 个技能；不包含任何自动下载/安装安全工具的脚本、二进制、安装链接或教程。工具由用户自行准备。
````

</details>

**依据 2 · 作者声明**：[packages/redteam-bundle/README.md:92-95](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/README.md#L92-L95)

授权边界

```text
## 授权与合规

**仅在获得明确书面授权的范围内使用**。本插件是作战工具：它本身不替你做授权判断，
请自行确认目标范围、时间窗与允许手段，并遵守所在司法辖区法律。
```

**依据 3 · 源码核查**：[packages/redteam-bundle/lib/tools.js:648-661](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L648-L661)

结果显式状态

<details>
<summary>查看原文（14行）</summary>

```text
  registerTool(withStructuredErrors(defineTool({
    name: 'redteam_scope_check',
    description: '检查一个 IP/URL/域名是否在当前靶标的授权 scope 内（scope 来自 redteam_engagement_open）。域名无法解析时返回 unresolved；scope 为空时返回 unscoped（不阻断，但提示用户补范围）。',
    parameters: {
      engagement: { type: 'string' },
      target: { type: 'string', required: true, description: '要检查的 IP / URL / 域名' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => text(value) },
    async execute(args, exec) {
      const id = resolveEngagement(store, exec, args.engagement)
      const check = scopeCheck(store, id, args.target)
      const ok = check.status === 'in' || check.status === 'unscoped' || check.status === 'unresolved'
      return JSON.stringify({ ok, engagement: id, target: args.target, ...check }, null, 2)
    },
```

</details>

#### 缺口

- 未运行演练
  **影响**：效果和成本未知
  **进一步探讨**：只用合成目标和存储验证记录

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 未知范围的 UI 能避免误判吗？

**研究主题**：新假设与验证

#### 完整回答

对照当前 ok/status 与只把已匹配授权显示为可继续的界面，用合成场景记录误判和人工确认。若未知仍被视为可继续或误阻断显著，就不通过。

#### 证据与依据

**依据 1 · 源码核查**：[packages/redteam-bundle/lib/tools.js:648-661](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L648-L661)

结果有可混淆的布尔值

<details>
<summary>查看原文（14行）</summary>

```text
  registerTool(withStructuredErrors(defineTool({
    name: 'redteam_scope_check',
    description: '检查一个 IP/URL/域名是否在当前靶标的授权 scope 内（scope 来自 redteam_engagement_open）。域名无法解析时返回 unresolved；scope 为空时返回 unscoped（不阻断，但提示用户补范围）。',
    parameters: {
      engagement: { type: 'string' },
      target: { type: 'string', required: true, description: '要检查的 IP / URL / 域名' },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => text(value) },
    async execute(args, exec) {
      const id = resolveEngagement(store, exec, args.engagement)
      const check = scopeCheck(store, id, args.target)
      const ok = check.status === 'in' || check.status === 'unscoped' || check.status === 'unresolved'
      return JSON.stringify({ ok, engagement: id, target: args.target, ...check }, null, 2)
    },
```

</details>

**依据 2 · 源码核查**：[packages/redteam-bundle/lib/tools.js:325-332](https://github.com/Jueze-2019/dsh-redteam-mode/blob/7b3de2d278fb317bd9c0adebd08b54b4137459d6/packages/redteam-bundle/lib/tools.js#L325-L332)

精确状态可用于提示

```text
function scopeCheck(store, id, target) {
  const scope = scopeOfEngagement(store, id)
  if (scope.length === 0) return { status: 'unscoped', scope, ip: null }
  const ip = targetIpv4(target)
  if (ip === null) return { status: 'unresolved', scope, ip: null }
  const hit = scope.find((cidr) => ipInCidr(ip, cidr))
  return { status: hit === undefined ? 'out' : 'in', scope, ip, cidr: hit || null }
}
```

#### 缺口

- 无可用性对照
  **影响**：收益未知
  **进一步探讨**：用合成拒绝样例比较

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
