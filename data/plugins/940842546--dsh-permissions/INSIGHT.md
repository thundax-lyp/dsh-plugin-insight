# dsh-permissions

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[333e9b1](https://github.com/940842546/dsh-permissions/tree/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/940842546/dsh-permissions) [![npm 30d 429](https://img.shields.io/static/v1?label=npm+30d&message=429&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions)
<!-- END META -->

> **功能**：为DSH工具调用提供分级参数规则、全局/工作区作用域、审批和可视化草稿编辑器。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持分级规则、按workspace合并、规则级会话grant与草稿界面，较粗粒度审批有可解释增量；并不新增宿主权限，也不证明所有秘密资源已保护。

> **主要限制**：[Q03](#research-q03)、[Q04](#research-q04)表明保存先改内存且吞磁盘错误仍可能显示成功，路由认证缺失/异常继续，执行异常交后续链。hard优先只对正常匹配成立；字符串与实际资源不同，不能当唯一安全边界。

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
  - [Q01 · 谁需要这层规则，它相对原生审批改变什么？](#detail-section-11)
  - [Q02 · 规则优先级、双事件与会话授权怎样进入执行？](#detail-section-12)
  - [Q03 · 字符串匹配、配置路由与保存到底保证到哪一步？](#detail-section-13)
  - [Q04 · 草稿编辑、决策记录、维护与退出由谁承担？](#detail-section-14)
  - [Q05 · 怎样检验规范化资源与持久策略能否带来真实保护？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-permissions是双面原生插件，Host在工具执行前匹配规则，Web设置页提供草稿编辑器。适用者是已有明确工具/路径保护需求、能维护规则的DSH操作者，例如禁止write/edit命中密钥文件，而不是仅把全局审批档位开关换个皮肤。基线是宿主原生沙箱/guard与逐次人工审批；合格结果应是具体被保护资源在全部相关工具路径下不可写、普通任务不被误拦，保存规则后重启仍一致，而非规则面板里出现hard字样。

宿主原生沙箱/tools.guard、全局审批姿态和人工确认；规则引擎是附加收窄，字符串模式不是canonical文件或命令解释器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| hard/deny/ask/allow | 附加工具参数门禁 | 正常匹配优先，不替代Host沙箱 |
| scope/grant | 工作区叠加与会话规则授权 | cwd/ws.id依赖，grant不绕hard |
| 草稿/预设/试算 | 明确规则编辑动作 | 保存ok不证明磁盘持久 |
| 自家ask | 一次/会话/拒绝与取消清理 | 服务/路由认证需核，非完整第二引擎 |
| 审计/统计 | 查匹配与参数片段 | 不等执行验收，截断非秘密脱敏 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Host pre-execute/approval与Web | 基础/询问必需 | 真正决策和设置 | 缺agent/错误可next，缺approval回原生ask |
| Workspace registry对象匹配 | workspace规则才需 | cwd→ws.id | 失败只global且缓存 |
| 可写DSH_HOME/state JSON | 持久必需 | 当前策略与bak | 失败内存已改/UI可成功，需独立核 |
| 原生沙箱/tools.guard | 使用前提 | 最终权限边界 | 不能用插件替代 |
| 完整工具schema与平台规则 | 效果必需 | 字符串对应实际资源 | 新工具/命令语义可漏匹配 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者盘工具/资源，保留原生沙箱 | 不用真实秘密/危险命令试验 |
| 编辑 | UI草稿添加规则/预设 | 未保存不应用，先试算模式 |
| 保存 | POST应用后核文件并重启 | ok不等持久，失败检查bak/内存 |
| 决策 | 模拟调用核scope/priority/grant | 确认真正Host结果，不看日志代验收 |
| 退出 | 撤附加插件并核原生审批 | 自管state/bak/history按归属保留/清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/规则存储资源未知 | 威胁模型、工具/平台盘点和对抗 | 无外部调用不等零人工成本 |
| 持续 | 匹配/日志资源未知 | 误拒、ask、工具schema更新 | 审批减负未实测 |
| 失败恢复 | 重试/状态核对资源未知 | 磁盘/内存/UI、认证/原生回退 | 不自动撤命令，保存可能不持久 |
| 退出 | 日志/备份保留未知 | 撤grant/插件，核原生策略 | 参数片段日志需检查敏感性 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 规则粒度 | 优先级、scope、参数与grant真实接线 | 实际资源/全部工具覆盖 |
| 草稿 | POST前只客户端编辑 | UI成功与重启持久一致 |
| 询问负担 | never/grant/allow不同分支 | 合格任务误拒/漏拦及净人审 |

> **思考**：[Q03](#research-q03)、[Q04](#research-q04)表明保存先改内存且吞磁盘错误仍可能显示成功，路由认证缺失/异常继续，执行异常交后续链。hard优先只对正常匹配成立；字符串与实际资源不同，不能当唯一安全边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持分级规则、按workspace合并、规则级会话grant与草稿界面，较粗粒度审批有可解释增量；并不新增宿主权限，也不证明所有秘密资源已保护。

纯匹配函数、清晰规则优先级、规则级会话grant和草稿交互可局部借鉴；错误next、认证条件放行和先内存后吞写失败削弱安全/持久承诺，不用原子rename一词概括整组状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)、[Q04](#research-q04)表明保存先改内存且吞磁盘错误仍可能显示成功，路由认证缺失/异常继续，执行异常交后续链。hard优先只对正常匹配成立；字符串与实际资源不同，不能当唯一安全边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，在无秘密非生产profile盘工具schema和规则对抗，保留原生沙箱。重点核认证缺失/异常、引擎错误和保存失败/重启，未解释这些状态前不保护真实秘密。漏拦或维护超过原生审批收益时撤插件回人工。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持附加规则及草稿/授权机制，也直接支持错误传播与条件放行限制；未执行目标或攻击验证。当前观察，规范化/持久策略为待验假设。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、lib/match.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读match和关键Host决策/approval/加载保存/路由/日志、client草稿保存/预设及作者README/package；未审全部客户端渲染、上游事件/身份实现或运行对抗。
- 下一步：未运行目标、安装、模拟/危险命令或真实Host；普通冒烟为scope_boundary，故障后状态与资源语义的未知单列，不声称已利用或用户已受损。

**分析版本**

- **仓库**：[940842546/dsh-permissions](https://github.com/940842546/dsh-permissions)
- **版本号**：2.1.0（[固定提交 333e9b1](https://github.com/940842546/dsh-permissions/tree/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的共用规范化资源身份与策略提交revision，明确写失败保旧并用对抗/故障集检验漏拦、误拦和重启一致；TOCTOU/兼容成本未解则收窄，不计当前贡献。

未运行目标、安装、模拟/危险命令或真实Host；普通冒烟为scope_boundary，故障后状态与资源语义的未知单列，不声称已利用或用户已受损。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 299 | — | — | 2987 |
| .js | source | 3 | 1803 | 1691 | 69 | — |
| .mjs | test | 3 | 668 | 556 | 55 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/940842546/dsh-permissions/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/940842546/dsh-permissions/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/940842546/dsh-permissions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断分级规则能否可靠收窄工具权限，尤其资源匹配、错误传播与保存一致性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这层规则，它相对原生审批改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-permissions是双面原生插件，Host在工具执行前匹配规则，Web设置页提供草稿编辑器。适用者是已有明确工具/路径保护需求、能维护规则的DSH操作者，例如禁止write/edit命中密钥文件，而不是仅把全局审批档位开关换个皮肤。基线是宿主原生沙箱/guard与逐次人工审批；合格结果应是具体被保护资源在全部相关工具路径下不可写、普通任务不被误拦，保存规则后重启仍一致，而非规则面板里出现hard字样。

相对粗粒度姿态，本插件增加hard/deny/ask/allow、global+workspace叠加、参数模式和一次/会话授权。已有匹配规则时可以少问重复动作，但所有命令别名和真实资源语义并未被自动识别；规则引擎也不替代宿主沙箱。allow返回next，只表示本插件不再拦，不会给宿主新权限。模型注入的摘要帮助解释拒绝，不是另一执行防线。

README仍称settings.yaml持久，而实际2.1.0使用自管JSON并可从旧yaml简易迁移，这影响备份/恢复路径。默认hard主要保护write/edit路径，不保护所有读取、更不代表任意工具都能访问到同一秘密资源时自动命中。没有独立需求/漏拦率结果，安全命名和安装便利不能支撑把它作为唯一安全边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-22](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/README.md#L8-L22)

作者定位、优先级与旧持久化说明。

<details>
<summary>查看原文（15行）</summary>

```text
面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）的 **Claude Code 风格权限规则引擎**。双面 Cordis 插件：宿主侧在 `tools/pre-execute` 瀑布上做拦截判定，浏览器侧提供 **设置 → 权限** 可视化编辑器。

## 亮点

- **四级规则、严格优先级**：`hard` > `deny` > `ask` > `allow`。
- **`hard` 高于全访问**：即使会话处于全访问档（审批策略 `never`），hard 规则依然拦截、不可豁免；`ask` 规则跟随会话策略，全访问下自动放行。
- **作用域**：`global` 规则全局生效；按 `workspace` 的规则叠加合并（冲突时 deny 永远胜出）。
- **通配符匹配**（文件类工具 `read`/`write`/`edit`/`glob`/`grep`/`read_image`）：
  - `write(*.pem)` —— 路径以 `.pem` 结尾
  - `write(*secret*)` —— 路径包含 `secret`
  - `write(.ssh)` —— 路径任意位置出现 `.ssh` 片段（大小写不敏感，`\`/`/` 统一归一化）
  - `write(C:\users\*)` —— 绝对路径前缀
  - 裸 `write` —— 该工具全部调用
- **持久化**：规则存于 `dsh-permissions` 设置命名空间，跨重启保留（`<harness home>/settings.yaml`）。
- **模型透明**：生效规则注入系统提示（`[active-permission-rules]` 段）。
```

</details>

**依据 2 · 源码核查**：[package.json:1-26](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/package.json#L1-L26)

原生Host/client导出、版本。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-permissions",
  "version": "2.1.0",
  "description": "DeepSeek Harness 权限规则引擎：hard/deny/ask/allow 四级规则（hard 高于全访问）、全局与 workspace 作用域、通配符路径保护、可视化草稿式编辑器，规则持久化于自管 JSON",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "permissions",
    "security",
    "approval"
  ],
  "type": "module",
  "main": "lib/index.js",
  "scripts": {
    "test": "node --test test/match.test.mjs test/integration.test.mjs test/contract.test.mjs"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml"
```

</details>

**依据 3 · 源码核查**：[lib/index.js:6-17](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L6-L17)

实际默认规则仅指定工具/字段类别。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = 'permissions-engine'
export const inject = ['webServer']

const DEFAULT_HARD = [
  'write(.ssh)', 'edit(.ssh)', 'write(.aws)', 'edit(.aws)',
  'write(.gnupg)', 'edit(.gnupg)', 'write(appdata)', 'edit(appdata)',
  'write(*.pem)', 'edit(*.pem)', 'write(*.key)', 'edit(*.key)',
  'write(*.env)', 'edit(*.env)', 'write(*.htpasswd)', 'edit(*.htpasswd)',
]
const DEFAULT_DENY = ['pwsh(rm -rf *)']
const DEFAULT_ASK = ['pwsh', 'edit', 'write']
const DEFAULT_ALLOW = ['read', 'glob', 'grep', 'web_search']
```

</details>

**依据 4 · 源码核查**：[lib/index.js:75-88](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L75-L88)

自管JSON路径取代旧settings。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx) {
  // ---------- 自管 JSON 持久化（替代 settings 命名空间，兼容 0.1.7 的 settings 重构） ----------
  // dsh ≥ 0.1.7-alpha.1 移除了 ctx.settings.register（SettingsForms 重构）；
  // 改为自管 JSON 文件，读写路径与旧 settings.yaml 中的规则互不冲突。
  // 迁移：首次运行时若 settings.yaml 有 dsh-permissions 段则一次性导入。
  const dshHome = process.env.DSH_HOME || path.join(homedir(), '.dsh')
  const stateFile = path.join(dshHome, 'dsh-permissions-state.json')
  const defaultState = () => ({
    enabled: true,
    hard: DEFAULT_HARD.slice(),
    deny: DEFAULT_DENY.slice(),
    ask: DEFAULT_ASK.slice(),
    allow: DEFAULT_ALLOW.slice(),
    workspaces: {},
```

</details>

**依据 5 · 源码核查**：[lib/index.js:369-382](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L369-L382)

allow及never仅交后续链，不授宿主权限。

<details>
<summary>查看原文（14行）</summary>

```text
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
```

</details>

#### 缺口

- 目标工具族是否完整覆盖秘密资源和具体操作者重复审批负担未知。
  **影响**：不能把默认规则或界面优先级当全面保护/已省人审。
  **进一步探讨**：按实际工具schema列资源访问路径，构造合法与对抗用例，比较原生策略加本插件的漏拦和误拦。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规则优先级、双事件与会话授权怎样进入执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

match.mergeRules按hard、deny、ask、allow遍历，各scope编译有效规则后evaluate取第一个匹配；因此global和workspace同等级保留顺序，deny在ask/allow之前，hard在deny之前。workspace由Session header.cwd交registry.resolveByPath并取ws.id，失败则只用global，且结果缓存；不能假定所有Host版本的工作区对象一定匹配此字段。

实际工具拦截在tools/pre-execute。enabled false、没有agent或无命中则next；命中hard/deny返回deny，ask才检查never策略和会话grant。需要问时调用approval.request，另一个approval/request监听只接本插件带前缀的询问，保持pending并由Web端三选回答；always按source/action/raw给本会话规则授权，不是永久给任意参数授权，也不绕hard/deny。调用取消会清pending，approval服务不存在则返回原生ask。

两事件不是两个独立完整规则引擎，approval/request主要接管自家询问。执行catch任何异常会记录engine-error并next，仍受宿主后续guard/沙箱限制，但本插件hard层此时并未fail-closed。因此“hard高于full access”只在enabled且执行链正常并匹配到该规则时成立，不是所有故障下绝不可绕过的证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/match.js:22-34](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/match.js#L22-L34)

按action优先合并和编译。

<details>
<summary>查看原文（13行）</summary>

```text
export function mergeRules(scopes) {
  const out = []
  for (const action of ACTIONS) {
    for (const sc of scopes) {
      const rows = sc.set[action] || []
      for (let i = 0; i < rows.length; i++) {
        const c = compileRule(rows[i])
        if (c.ok) out.push({ action, tool: c.tool, match: c.match, source: sc.source, raw: String(rows[i]).trim(), index: i })
      }
    }
  }
  return out
}
```

</details>

**依据 2 · 源码核查**：[lib/match.js:140-148](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/match.js#L140-L148)

evaluate首匹配返回。

```text
export function evaluate(merged, tool, args) {
  for (const rule of merged) if (matchRule(rule, tool, args)) return rule
  return undefined
}

// 引擎需要的便捷封装：合并作用域并求值
export function evaluateScopes(scopes, tool, args) {
  return evaluate(mergeRules(scopes), tool, args)
}
```

**依据 3 · 源码核查**：[lib/index.js:255-284](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L255-L284)

workspace字段/cwd缓存和会话policy。

<details>
<summary>查看原文（30行）</summary>

```text
  // ---------- 作用域解析（Workspace 实体字段是 id；SessionHeader.cwd 锚定） ----------
  async function resolveWorkspaceId(agent) {
    if (agent === undefined || agent === null) return undefined
    const sess = agent.session
    const cwd = sess && sess.header ? sess.header.cwd : undefined
    if (cwd === undefined || cwd === null || cwd === '') return undefined
    if (wsCache.has(cwd)) return wsCache.get(cwd)
    let id
    try {
      const ws = workspaceRegistry ? await workspaceRegistry.resolveByPath(cwd) : undefined
      id = ws && ws.id ? String(ws.id) : undefined
    } catch (e) { id = undefined }
    wsCache.set(cwd, id)
    return id
  }

  // ---------- 会话审批策略（仅 ask 跟随；hard/deny 永不受影响） ----------
  function effectivePolicy(agent) {
    if (approval === undefined) return 'ask'
    let policy
    try {
      const sess = agent && agent.session
      policy = sess ? approval.overrideOf(sess) : undefined
    } catch (e) { policy = undefined }
    if (policy !== undefined && policy !== null) return policy
    const cfg = approval.config
    return cfg && cfg.policy ? cfg.policy : 'ask'
  }

  // ---------- 决策引擎（含审计环形缓冲 + 规则命中计数 + JSONL 持久化） ----------
```

</details>

**依据 4 · 源码核查**：[lib/index.js:190-218](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L190-L218)

自家approval/request前缀和取消清理。

<details>
<summary>查看原文（29行）</summary>

```text
    ctx.on('approval/request', (req, next) => {
      if (req.signal && req.signal.aborted) return next()
      if (typeof req.reason !== 'string' || !req.reason.startsWith(ASK_PREFIX)) return next()
      const callId = String(req.callId !== undefined ? req.callId : Math.random().toString(36).slice(2))
      return new Promise((resolve) => {
        const entry = {
          resolve,
          toolName: req.toolName,
          agent: req.agent,
          rule: req.reason.slice(ASK_PREFIX.length),
          dispose: undefined,
        }
        pendingAsks.set(callId, entry)
        // 回合被取消（用户点停止 / 调用被中止）时必须清理：否则该条目永久驻留，
        // /api/dperm/ask 会一直返回它 → 徽章长期闪"待确认"且用户答了也没用。
        if (req.signal !== undefined) {
          const onAbort = () => {
            if (pendingAsks.get(callId) === entry) pendingAsks.delete(callId)
            resolve('cancelled')
          }
          req.signal.addEventListener('abort', onAbort, { once: true })
          entry.dispose = () => req.signal.removeEventListener('abort', onAbort)
        }
        try { ctx.emit('dsh-permissions/ask-pending', callId) } catch (e) {}
      })
    }, { prepend: true })
  }

  function settleAsk(callId, choice) {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:221-239](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L221-L239)

once/always/reject实际响应。

<details>
<summary>查看原文（19行）</summary>

```text
    pendingAsks.delete(callId)
    if (typeof p.dispose === 'function') p.dispose()
    if (choice === 'always') {
      // rule 字符串就是 grantKey 格式（source|action|raw 由引擎拼装传入 reason）
      const sid = p.agent && p.agent.session ? String(p.agent.session.id) : ''
      if (sid !== '') {
        let set = grants.get(sid)
        if (set === undefined) { set = new Set(); grants.set(sid, set) }
        set.add(p.rule)
      }
      p.resolve('allowed-once')
    } else if (choice === 'once') {
      p.resolve('allowed-once')
    } else {
      p.resolve('rejected')
    }
    return true
  }

```

</details>

**依据 6 · 源码核查**：[lib/index.js:345-405](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L345-L405)

真正pre-execute规则判定和异常next。

<details>
<summary>查看原文（61行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
      }
      countHit(rule)
      if (rule.action === 'hard') {
        pushAudit({ tool, arg, decision: 'hard', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] hard-deny (above full access, not exemptable) [' + sourceLabel(rule.source) + ' · hard]: ' + rule.raw }
      }
      if (rule.action === 'deny') {
        pushAudit({ tool, arg, decision: 'deny', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] denied by rule [' + sourceLabel(rule.source) + ' · deny]: ' + rule.raw }
      }
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
      if (approval !== undefined) {
        pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: tool,
          callId: exec.callId,
          reason: ASK_PREFIX + grantKeyOf(rule),
          signal: exec.signal,
        })
        if (outcome === 'allowed-once') {
          pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
          return next()
        }
        return { kind: 'deny', reason: '[dsh-permissions] user rejected ' + tool + ' (rule [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw + ')' }
      }
      pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
      return { kind: 'ask', reason: '[dsh-permissions] rule requires confirmation [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw }
    } catch (err) {
      pushAudit({ tool, arg: '', decision: 'engine-error', source: 'none' })
      return next()
    }
  })

```

</details>

#### 缺口

- 目标Host事件/Workspace字段和其他监听器顺序、引擎异常时的具体宿主行为未实测。
  **影响**：不能将源码中的hard优先级扩张为完整端到端阻断保证。
  **进一步探讨**：在非生产profile用模拟工具核global/workspace、never/grant、缺approval和异常分支，记录宿主后续决策。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 字符串匹配、配置路由与保存到底保证到哪一步？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

文件工具集固定为read/write/edit/glob/grep/read_image，参数按工具语义字段取command/pattern/file_path/path，其他对象退为第一个字符串；工具名必须精确相等。normPath只trim、统一斜线、压连续斜线、去尾斜线和转小写，没有按cwd解析点段/符号链接或shell解释。绝对路径无星按字符串前缀，非路径命令只折空白、大小写后startswith；管道、包装命令、别名与新工具schema不是完整命令语义。匹配可用作附加粗筛，不能用canonical文件保护承诺来解释。

/api/dperm路由在connection.isAuthenticated存在时检查cookie并拒401，缺服务/方法或检查抛错则继续。规则编辑和ask回答共用该条件；这是源码可见的有条件放行，不是已复现远程利用。POST校验数组字符串与workspace形状，但无效规则字符串可被编译阶段跳过，保存的既有JSON加载也只检查最外对象。启用插件不等已核目标部署认证。

saveState先把next赋给current并递增rev、清缓存，再write临时文件/备份/rename；写异常被吞，POST仍发ok:true/current，客户端据此显示saved。原子rename只保护成功替换那一步，不能证明磁盘持久成功或多请求事务；磁盘错误时本进程新策略与重启后旧策略可不同。这里直接确认的是错误传播/状态顺序，尚未故障注入真实盘满或并发保存，不推断已有用户丢规则。

#### 证据与依据

**依据 1 · 源码核查**：[lib/match.js:36-70](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/match.js#L36-L70)

参数提取与只字符串路径归一化。

<details>
<summary>查看原文（35行）</summary>

```text
// ---------- 参数提取（按工具语义字段，不依赖模型发参顺序） ----------
export function primaryArgOf(tool, args) {
  if (args === undefined || args === null) return ''
  if (typeof args === 'string') return args
  if (Array.isArray(args)) return primaryArgOf(tool, args[0])
  if (typeof args !== 'object') return String(args)
  if (tool === 'pwsh') { const c = args.command; return typeof c === 'string' ? c : '' }
  if (tool === 'grep' || tool === 'glob') { const p = args.pattern; return typeof p === 'string' ? p : '' }
  if (FILE_TOOLS.includes(tool)) {
    const p = args.file_path !== undefined ? args.file_path : args.path
    if (typeof p === 'string') return p
  }
  for (const k of Object.keys(args)) {
    const v = args[k]
    if (typeof v === 'string') return v
  }
  return ''
}

export function pathArgOf(args) {
  if (args === undefined || args === null || typeof args !== 'object' || Array.isArray(args)) return ''
  const v = args.path
  return typeof v === 'string' && v !== '' ? v : ''
}

// ---------- 路径匹配 ----------
export function normPath(p) {
  let s = String(p).trim()
  if (s === '') return s
  s = s.replace(/\\/g, '/')
  while (s.includes('//')) s = s.replace(/\/\//g, '/')
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1)
  return s.toLowerCase()
}

```

</details>

**依据 2 · 源码核查**：[lib/match.js:77-108](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/match.js#L77-L108)

路径匹配前缀/通配逻辑。

<details>
<summary>查看原文（32行）</summary>

```text
}

// *x = 结尾；x* = 片段开头；*x* = 包含；多星按序分段；绝对路径按完整前缀（支持尾星与中间星）
export function matchPathPattern(c, raw) {
  const t = raw.trim()
  if (t === '') return false
  if (t === '*') return true
  if (looksAbsolute(t) && !t.includes('*')) return c.startsWith(normPath(t))
  if (t.includes('*')) {
    const parts = t.split('*')
    const nonEmpty = parts.filter((p) => p !== '')
    if (nonEmpty.length === 1 && t.endsWith('*') && !t.startsWith('*')) {
      return segMatch(c, normPath(t.slice(0, -1)))
    }
    let idx = 0
    let lastSeg = ''
    for (let i = 0; i < parts.length; i++) {
      const seg = normPath(parts[i])
      if (seg === '') continue
      if (i === 0) {
        if (!c.startsWith(seg)) return false
        idx = seg.length
      } else {
        const found = c.indexOf(seg, idx)
        if (found < 0) return false
        idx = found + seg.length
      }
      lastSeg = seg
    }
    if (lastSeg !== '' && !t.endsWith('*')) return c.endsWith(lastSeg)
    return true
  }
```

</details>

**依据 3 · 源码核查**：[lib/match.js:120-138](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/match.js#L120-L138)

精确工具名与非路径前缀。

<details>
<summary>查看原文（19行）</summary>

```text

export function matchRule(rule, tool, args) {
  if (rule.tool !== tool) return false
  if (rule.match === undefined) return true
  const isPathTool = FILE_TOOLS.includes(tool)
  const cands = candidateArgs(tool, args)
  for (const cand of cands) {
    if (isPathTool) {
      if (matchPathPattern(normPath(cand), rule.match.value)) return true
    } else {
      // 命令/查询类匹配：不区分大小写（Windows 命令行大小写不敏感），
      // 并折叠连续空白（"rm   -rf"/Tab 变体不能绕过前缀匹配）
      const squash = (s) => s.replace(/\s+/g, ' ').toLowerCase()
      const v = rule.match.value.endsWith('*') ? rule.match.value.slice(0, -1) : rule.match.value
      if (v === '' || squash(cand).startsWith(squash(v))) return true
    }
  }
  return false
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:47-71](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L47-L71)

请求结构校验范围。

<details>
<summary>查看原文（25行）</summary>

```text
// 校验 POST /api/dperm/rules 的请求体。返回错误描述字符串，合法时返回 undefined。
// 旧实现只检查"是个对象"：传 {"hard":"abc"} 会被原样存盘，之后 mergeRules 去遍历字符串
// 的每个字符，静默产出零可用规则。
function validateSection(section) {
  if (section === null || typeof section !== 'object' || Array.isArray(section)) return 'body must be a JSON object'
  if (section.enabled !== undefined && typeof section.enabled !== 'boolean') return 'enabled must be a boolean'
  const ruleKeys = ['hard', 'deny', 'ask', 'allow']
  for (const k of ruleKeys) {
    const v = section[k]
    if (v === undefined) continue
    if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) return k + ' must be an array of strings'
  }
  const ws = section.workspaces
  if (ws !== undefined) {
    if (ws === null || typeof ws !== 'object' || Array.isArray(ws)) return 'workspaces must be an object'
    for (const id of Object.keys(ws)) {
      const set = ws[id]
      if (set === null || typeof set !== 'object' || Array.isArray(set)) return 'workspaces.' + id + ' must be an object'
      for (const k of ruleKeys) {
        const v = set[k]
        if (v === undefined) continue
        if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) return 'workspaces.' + id + '.' + k + ' must be an array of strings'
      }
    }
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:92-101](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L92-L101)

既有JSON浅对象加载。

<details>
<summary>查看原文（10行）</summary>

```text
  const loadState = async () => {
    if (stateLoaded) return
    stateLoaded = true
    try {
      const text = await readFile(stateFile, 'utf8')
      const parsed = JSON.parse(text)
      if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // 合并到默认值之上：旧版/残缺文件缺少的字段自动补默认，而不是变成 undefined
        current = Object.assign(defaultState(), parsed)
      }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:137-151](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L137-L151)

先切内存、写失败吞掉。

<details>
<summary>查看原文（15行）</summary>

```text
  const saveState = async (next) => {
    current = next
    rulesRev += 1
    wsCache.clear()
    mergedCache.clear()
    try {
      await mkdir(path.dirname(stateFile), { recursive: true })
      // 原子写：先写 .tmp，把旧文件备份为 .bak，再 rename 覆盖（同卷 rename 是原子替换）。
      // 避免写到一半崩溃留下截断 JSON → 下次启动被当成"首次运行"静默丢光规则。
      const tmp = stateFile + '.tmp'
      await writeFile(tmp, JSON.stringify(current, null, 2) + '\n', 'utf8')
      try { await copyFile(stateFile, stateFile + '.bak') } catch (e) { /* 首次保存无旧文件 */ }
      await rename(tmp, stateFile)
    } catch (e) { /* 写失败不阻塞 */ }
  }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:432-445](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L432-L445)

路由认证缺失/异常继续。

<details>
<summary>查看原文（14行）</summary>

```text
        // 浏览器认证（dsh ≥ 0.1.2-alpha.2）：connection.isAuthenticated 只做
        // cookie 校验（authorizeIndex 会写 303/401 响应且仅适用于 / 路径，
        // 对 API 路由会误拦）。旧版无此方法则放行。
        try {
          const connection = ctx.get('connection')
          if (connection !== undefined && typeof connection.isAuthenticated === 'function') {
            if (!connection.isAuthenticated(req)) {
              send(401, { ok: false, error: 'unauthorized' })
              return
            }
          }
        } catch (e) { /* 认证检查异常不阻塞（保守：记录但继续） */ }
        try {
          const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
```

</details>

**依据 8 · 源码核查**：[lib/index.js:539-564](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L539-L564)

POST调用保存后返回成功。

<details>
<summary>查看原文（26行）</summary>

```text
          if (pathname === '/api/dperm/rules') {
            if (req.method === 'GET') {
              await loadState()
              send(200, { ok: true, value: current })
              return
            }
            if (req.method === 'POST') {
              let raw = ''
              for await (const chunk of req) raw += chunk
              let section
              try {
                section = JSON.parse(raw)
              } catch (e) {
                send(400, { ok: false, error: 'invalid JSON body' })
                return
              }
              const invalid = validateSection(section)
              if (invalid !== undefined) {
                send(400, { ok: false, error: invalid })
                return
              }
              // 合并到默认值之上：只提交部分字段时，未提交的规则保留默认而不是被清空
              await saveState(Object.assign(defaultState(), section))
              send(200, { ok: true, value: current })
              return
            }
```

</details>

**依据 9 · 源码核查**：[lib/client.js:508-523](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/client.js#L508-L523)

客户端ok就显示保存并应用。

<details>
<summary>查看原文（16行）</summary>

```text
      function saveDraft() {
        setSaving(true)
        setMsg('')
        setErr('')
        fetch('/api/dperm/rules', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(draft),
        })
          .then((r) => r.json())
          .then((j) => {
            setSaving(false)
            if (j && j.ok) { setDraft(j.value); setSaved(j.value); setMsg(t('saved')); try { window.dispatchEvent(new CustomEvent('dsh-permissions-changed')) } catch (e) {} }
            else setErr((j && j.error) || t('errSave'))
          })
          .catch((e) => { setSaving(false); setErr(String(e)) })
```

</details>

#### 缺口

- 真实执行最终资源、部署cookie/代理认证、磁盘/并发保存与重启一致性尚缺独立结果。
  **影响**：不能把附加门禁、成功提示与安全持久承诺等同，当前不宜依赖保护生产秘密。
  **进一步探讨**：按工具规范化后的资源对照匹配，并在副本目录注入写失败/同时保存/重启，核内存、文件与UI；部署认证异常应另定明确拒绝策略。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 草稿编辑、决策记录、维护与退出由谁承担？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

Web编辑以draft和saved分开，修改规则先留本地React状态，保存POST才应用，放弃回saved；预设只是向草稿hard列表加规则。这个交互减少未保存编辑立即改变执行，但Q03的服务端保存成功语义意味着“已保存”还不能当磁盘持久证明。Host另外把决策写history JSONL，参数仅截80字符而非按秘密内容脱敏，备份/诊断需检查是否含命令片段。

首次要确认Host事件/approval/Workspace/webServer与客户端设置接口、盘点每个工具schema和实际资源语义，给平台建立最小规则；持续维护新工具/路径、误拒、人审ask及全会话grant。决策日志只记插件判断，不证明真实执行未越权；无模型/API调用的匹配也有Host资源和人工成本，金额/耗时未知。禁用/卸载会失去本层附加限制，原生沙箱仍需保留；关闭不撤已执行命令，state JSON、bak和history应按归属备份/清理。

当前建议观察，先修清或独立验证认证、写失败提示与异常放行后，才考虑把它用于实际保护。研究可在无秘密非生产profile仅做规则试算/模拟调用，先验具体hard/deny和恢复，不以真实危险命令证明安全。只有规则误拦/漏拦、重启一致和总审批负担比原生策略可接受，才继续；否则撤插件回原生策略加人工确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:508-531](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/client.js#L508-L531)

保存/放弃草稿。

<details>
<summary>查看原文（24行）</summary>

```text
      function saveDraft() {
        setSaving(true)
        setMsg('')
        setErr('')
        fetch('/api/dperm/rules', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(draft),
        })
          .then((r) => r.json())
          .then((j) => {
            setSaving(false)
            if (j && j.ok) { setDraft(j.value); setSaved(j.value); setMsg(t('saved')); try { window.dispatchEvent(new CustomEvent('dsh-permissions-changed')) } catch (e) {} }
            else setErr((j && j.error) || t('errSave'))
          })
          .catch((e) => { setSaving(false); setErr(String(e)) })
      }
      function discardDraft() {
        setMsg('')
        setErr('')
        setDraft(saved)
      }
      function buildValue() {
        const raw = bValue.trim()
```

</details>

**依据 2 · 源码核查**：[lib/client.js:550-559](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/client.js#L550-L559)

预设进入草稿而非立即服务端生效。

<details>
<summary>查看原文（10行）</summary>

```text
        const list = kind === 'sensitive' ? SENSITIVE_PRESET : kind === 'dangerous' ? DANGEROUS_PRESET : KEYFILE_PRESET
        const next = (currentSet().hard || []).slice()
        let added = 0
        for (const raw of list) if (next.indexOf(raw) < 0) { next.push(raw); added++ }
        setMsg(t('presetApplied', { n: added }))
        writeRuleField('hard', next)
      }
      function pickTool(next) {
        setBTool(next)
        if (!FILE_TOOL_NAMES.includes(next) && ['suffix', 'contains', 'wildcard'].includes(bMatch)) setBMatch('prefix')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:289-298](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L289-L298)

审计参数截断80非语义脱敏。

<details>
<summary>查看原文（10行）</summary>

```text
  function countHit(rule) {
    const key = rule.source + '|' + rule.action + '|' + rule.raw
    ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
  }
  function clipText(text) {
    const s = String(text === undefined || text === null ? '' : text)
    return s.length > 80 ? s.slice(0, 80) : s
  }
  // 启动时重放历史尾部：恢复日志环 + 命中计数（异步，不阻塞启动）
  ;(async () => {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:321-341](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L321-L341)

append日志、容量阈值/裁尾与错误吞掉。

<details>
<summary>查看原文（21行）</summary>

```text
  function pushAudit(entry) {
    const full = Object.assign({ seq: ++auditSeq }, entry)
    audit.push(full)
    if (audit.length > 200) audit.shift()
    // 持久化：追加一行 JSON（含 ruleKey 供重放）；文件超 2MB 时截断为尾部 200 行
    const key = entry.ruleRaw !== undefined && entry.decision !== 'fallback' && entry.decision !== 'engine-error'
      ? ((entry.source !== 'none' && entry.source !== 'policy-never' && entry.source !== 'grant' ? entry.source : 'global') + '|' + (entry.decision === 'allow' ? 'allow' : entry.decision === 'ask' ? 'ask' : entry.decision) + '|' + entry.ruleRaw)
      : undefined
    const line = JSON.stringify(Object.assign({}, full, key !== undefined ? { ruleKey: key } : {})) + '\n'
    historyBytes += line.length
    appendFile(historyFile, line, 'utf8').catch(() => {})
    if (historyBytes > 2 * 1024 * 1024 && !trimScheduled) {
      trimScheduled = true
      ;(async () => {
        try {
          await mkdir(path.dirname(historyFile), { recursive: true })
          const keep = audit.map((e) => JSON.stringify(e) + '\n').join('')
          await writeFile(historyFile, keep, 'utf8')
          historyBytes = keep.length
        } catch (e) { /* 截断失败下次再试 */ }
        trimScheduled = false
```

</details>

**依据 5 · 源码核查**：[lib/index.js:345-358](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L345-L358)

禁用/缺agent/无匹配next。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
```

</details>

**依据 6 · 作者声明**：[README.md:70-77](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/README.md#L70-L77)

作者收窄与路由边界说明。

```text
- 拦截以工具错误呈现给模型（`Error: 权限规则拒绝…`；hard 为 `硬规则拒绝（高于 full access，不可豁免）…`），模型可见完整规则原文，可据此改道。
- 设置页路由（`GET/POST /api/dperm/rules`）是命名空间所有者自建的端点——DSH api-proxy 的 settings 白名单刻意不暴露第三方命名空间。

## 开发与发布

见 [PUBLISH.md](./PUBLISH.md)：发布清单与本插件踩过的坑（客户端包 `exports` 必须含 `./package.json`；bundle 模块 id 必须等于包名；`useSyncExternalStore` 不能传未绑定方法引用等）。

## License
```

#### 缺口

- 具体平台工具覆盖、日志内容敏感性及全周期维护/恢复成本缺实测。
  **影响**：未证安全收益抵消配置/误拒负担，也不支持持续安装推荐。
  **进一步探讨**：在副本profile留原生沙箱，保存/重启/异常与规则对抗一并验收，统计全部人审和错决策后决定。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验规范化资源与持久策略能否带来真实保护？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可借鉴已有设计是明确优先级、把会话grant限定到规则、草稿保存作为用户显式动作以及取消清理pending。它们是常见规则/授权方法在DSH工具链的适配，不因“hard”命名就成为内核级资源边界。主要限制并不只缺更多默认规则，而是匹配的资源语义与错误/持久状态是否可信。

未验证方向是先在少数文件工具把参数解析为与实际执行共用的规范化资源身份，并把策略revision及磁盘提交结果绑定到每次决策；配置写失败保持旧策略并清楚报告。相比当前字符串/先内存后磁盘，增量是使用相同资源语义与可追溯策略版本；但检查到执行间仍有TOCTOU、符号链接/大小写平台差异，不能只调用realpath就宣称沙箱，shell工具应保留独立限制。

实验对同一工具模拟执行路径，加入相对路径、点段、链接、大小写、同前缀目录、嵌套shell、写失败和并发保存，比较漏拦/误拦、决策revision与重启状态。已知保护资源任何漏拦或UI成功但重启丢失即不满足；若正规化误拦/维护超过可控制小范围收益，则只保留明确工具或回原生guard，不扩大成通用安全产品。未实现假设计分为零贡献，不称已验证需求。

#### 证据与依据

**依据 1 · 源码核查**：[lib/match.js:61-70](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/match.js#L61-L70)

现字符串归一化边界。

<details>
<summary>查看原文（10行）</summary>

```text
// ---------- 路径匹配 ----------
export function normPath(p) {
  let s = String(p).trim()
  if (s === '') return s
  s = s.replace(/\\/g, '/')
  while (s.includes('//')) s = s.replace(/\/\//g, '/')
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1)
  return s.toLowerCase()
}

```

</details>

**依据 2 · 源码核查**：[lib/index.js:137-151](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L137-L151)

持久状态与策略revision当前顺序。

<details>
<summary>查看原文（15行）</summary>

```text
  const saveState = async (next) => {
    current = next
    rulesRev += 1
    wsCache.clear()
    mergedCache.clear()
    try {
      await mkdir(path.dirname(stateFile), { recursive: true })
      // 原子写：先写 .tmp，把旧文件备份为 .bak，再 rename 覆盖（同卷 rename 是原子替换）。
      // 避免写到一半崩溃留下截断 JSON → 下次启动被当成"首次运行"静默丢光规则。
      const tmp = stateFile + '.tmp'
      await writeFile(tmp, JSON.stringify(current, null, 2) + '\n', 'utf8')
      try { await copyFile(stateFile, stateFile + '.bak') } catch (e) { /* 首次保存无旧文件 */ }
      await rename(tmp, stateFile)
    } catch (e) { /* 写失败不阻塞 */ }
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:345-405](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L345-L405)

实际决策/异常链。

<details>
<summary>查看原文（61行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
      }
      countHit(rule)
      if (rule.action === 'hard') {
        pushAudit({ tool, arg, decision: 'hard', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] hard-deny (above full access, not exemptable) [' + sourceLabel(rule.source) + ' · hard]: ' + rule.raw }
      }
      if (rule.action === 'deny') {
        pushAudit({ tool, arg, decision: 'deny', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] denied by rule [' + sourceLabel(rule.source) + ' · deny]: ' + rule.raw }
      }
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
      if (approval !== undefined) {
        pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: tool,
          callId: exec.callId,
          reason: ASK_PREFIX + grantKeyOf(rule),
          signal: exec.signal,
        })
        if (outcome === 'allowed-once') {
          pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
          return next()
        }
        return { kind: 'deny', reason: '[dsh-permissions] user rejected ' + tool + ' (rule [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw + ')' }
      }
      pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
      return { kind: 'ask', reason: '[dsh-permissions] rule requires confirmation [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw }
    } catch (err) {
      pushAudit({ tool, arg: '', decision: 'engine-error', source: 'none' })
      return next()
    }
  })

```

</details>

**依据 4 · 源码核查**：[lib/index.js:221-239](https://github.com/940842546/dsh-permissions/blob/333e9b1ebf44f3fdd940d60eba9d5af5dbffd5a4/lib/index.js#L221-L239)

现有规则级会话grant。

<details>
<summary>查看原文（19行）</summary>

```text
    pendingAsks.delete(callId)
    if (typeof p.dispose === 'function') p.dispose()
    if (choice === 'always') {
      // rule 字符串就是 grantKey 格式（source|action|raw 由引擎拼装传入 reason）
      const sid = p.agent && p.agent.session ? String(p.agent.session.id) : ''
      if (sid !== '') {
        let set = grants.get(sid)
        if (set === undefined) { set = new Set(); grants.set(sid, set) }
        set.add(p.rule)
      }
      p.resolve('allowed-once')
    } else if (choice === 'once') {
      p.resolve('allowed-once')
    } else {
      p.resolve('rejected')
    }
    return true
  }

```

</details>

#### 缺口

- 共用资源语义和策略commit能否降低漏拦且不破兼容未知。
  **影响**：不能将未来设计当当前hard保护或已成立商业机会。
  **进一步探讨**：以目标工具与平台的上述对抗/故障集预设零关键漏拦和可接受误拒成本，失败即收窄或停止。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
