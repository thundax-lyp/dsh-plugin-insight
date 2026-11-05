# dsh-persona-dafeiyu

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4af4825](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/tree/4af4825a756521f9188c1b4abb5d95135f57397c)

<!-- BEGIN META -->
[![GitHub ★ 99](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=99&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huaizhuanghub/dsh-persona-dafeiyu) [![npm 30d 23,239](https://img.shields.io/static/v1?label=npm+30d&message=23%2C239&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-persona-dafeiyu) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-persona-dafeiyu)
<!-- END META -->

> **功能**：为 DSH 管理内置及自定义人设，支持导入导出并按全局、工作区或会话切换。

> **亮点**：同一解析函数连起界面状态与动态注入，三档选择和显式“不启用”区分缺省回落，是具体的日常操作增量。[Q01](#research-q01)

> **主要限制**：清理依赖本进程活跃会话集合，非空也可能漏掉尚存在的冷会话；这会丢失个别会话的人设选择，不应按“已失效”措辞直接信任清理。[Q02](#research-q02)

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
  - [Q01 · 三档人设如何从界面变更进入下一次模型请求？](#detail-section-11)
  - [Q02 · 持久化、清理与本地接口有哪些实际边界？](#detail-section-12)
  - [Q03 · 值得什么人试用，成本和改进假设如何验证？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在本地DSH Web中重复切换交流风格的人可按项目或会话选人设，合格结果是作用域不串用。[Q01](#research-q01)

手动粘贴或全局前缀也可表达风格；本组件增加库管理、会话禁用和分层回落，但不证明模型更可靠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分层人设选择 | 全局、工作区和会话风格 | 显式会话禁用阻止回落 |
| 动态注入 | 切换后下一请求使用正文 | 依赖宿主prompt组装，不能保证模型遵从 |
| 本地库管理 | 导入、查看、切换与持久保存 | 坏库回退，手改需备份 |
| 会话选择清理 | 裁剪传入存活集合之外的选择 | 默认仅本进程见过集合，冷会话可能被清除 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH系统提示词服务 | 必需，包声明/源码 | 动态注入 | 不能假定可挂载 |
| Web renderer、locale及对应slots | 界面操作必需 | 设置和会话选择 | 缺slot时相应入口不出现 |
| 本地库可读写 | 持久管理必需 | 保存人设与选择 | 坏JSON回空库，写失败报错 |
| 自定义正文质量 | 效果必需 | 风格指导 | 不保证模型遵从或质量提升 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装并核对本地库备份 | 界面可查看人设与正文 |
| 选择 | 用户选作用域和人设 | 状态解析与下一请求一致 |
| 使用 | 宿主动态组装正文 | 核对目标会话，注意回落 |
| 恢复 | 用户停用或会话不启用 | 不贸然清理冷会话，必要时恢复备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地存储，量未知 | 安装、审查和导入人设，时间未知 | 无另调模型链路 |
| 持续 | 每请求人设输入token，金额未知 | 维护条目和作用域 | 未证明节时 |
| 失败恢复 | 备份占用和重试，量未知 | 核对坏库、回落和冷会话选择 | 清理不等于真实不存在 |
| 退出 | 库可保留 | 禁用人设并恢复手动前缀 | 核对可选suffix仍有独立配置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 切换 | 动态prompt与分层解析 | 实际模型风格遵从 |
| 多窗口保存 | 三方合并及rename | 无锁并发的完整保全 |
| 清理 | 按给定活跃集合裁剪 | 冷会话是否真的不存在 |

> **思考**：清理依赖本进程活跃会话集合，非空也可能漏掉尚存在的冷会话；这会丢失个别会话的人设选择，不应按“已失效”措辞直接信任清理。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：同一解析函数连起界面状态与动态注入，三档选择和显式“不启用”区分缺省回落，是具体的日常操作增量。[Q01](#research-q01)

共享resolvePersona避免界面状态与prompt算法漂移，三方合并比整表覆盖更可维护；无跨进程锁与mtime/size重载仍需验证竞争边界。局部loopback和Origin保护值得读源码，不能推广为任意网络部署认证。

<a id="detail-section-5"></a>

### 1.4 主要限制

清理依赖本进程活跃会话集合，非空也可能漏掉尚存在的冷会话；这会丢失个别会话的人设选择，不应按“已失效”措辞直接信任清理。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先备份库，给两个可复做会话设置不同风格，核对下一请求和显式不启用；清理前确认冷会话状态，出现串用即回手动前缀。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

作用域和动态注入已查源码；清理边界为已确认设计限制，风格效果及清理改进均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查lib/index.js的作用域、存储、热重载、变更路由及client.js请求和slots；未做全量界面审计、兼容或模型实测。
- 下一步：以两个不同会话与一个长期冷会话核对作用域和清理，再做手动前缀对照；未在本次执行。

**分析版本**

- **仓库**：[huaizhuanghub/dsh-persona-dafeiyu](https://github.com/huaizhuanghub/dsh-persona-dafeiyu)
- **版本号**：0.8.0（[固定提交 4af4825](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/tree/4af4825a756521f9188c1b4abb5d95135f57397c)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是先显示清理候选并查询宿主真实存在性，再由用户确认，减少冷会话选择误删；固定冷会话集合若仍误删或负担过大，就否定该流程。[Q03](#research-q03)

以两个不同会话与一个长期冷会话核对作用域和清理，再做手动前缀对照；未在本次执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1161 | — | — | 18016 |
| .md | example | 1 | 27 | — | — | 241 |
| .js | source | 2 | 3789 | 2714 | 856 | — |
| .mjs | source | 2 | 785 | 573 | 157 | — |
| .mjs | test | 1 | 3153 | 2455 | 339 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：人设库能否在多会话间按作用域可靠切换，清理与持久化如何影响长期使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 三档人设如何从界面变更进入下一次模型请求？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它面向需要在同一profile中给不同项目或会话保留不同写作/交流风格的人，合格结果是目标会话下一次请求注入选中正文且其他作用域不串用。手动粘贴提示词或只有全局前缀是简单替代。浏览器设置、输入框小条和新会话chip均有slot注册，变更通过JSON POST交给宿主。宿主注册动态systemPrompt.section，activeText每次取库并用同一resolvePersona解析，session模式按会话、工作区、全局回落，显式“不启用”哨兵阻止回落。贡献在作用域选择和可持续维护的库，而不是证明人设能提升模型正确率。正文动态求值支持切换后下一请求变化，但配置personaFile在apply时读入，不应把personas.json的热重载推广到任意外部配置文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2060-2103](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/client.js#L2060-L2103)

设置、输入框、浮层和新会话入口真实注册。

<details>
<summary>查看原文（44行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-persona-dafeiyu: dictionaries");
			// 悬停 / 按下 / 键盘聚焦的样式表。内联样式命中不到伪类，必须走样式表
			// （issue #6 评论：暗色下按钮没有 hover 反馈）。卸载时一起撤掉。
			ctx.effect(() => injectHoverStyles(), "dsh-persona-dafeiyu: hover styles");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: SECTION_ID,
				order: 18,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({ t }),
			}, PersonaSettingsSection));

			// 输入框上方的「人设」小条：当前人设 + 全局/会话开关。
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "persona-dock",
				order: 60,
				locale: NS,
				inject: () => ({ t }),
			}, PersonaDock));

			// 会话人设选择浮层：注册在 DSH 的整帧浮层插槽上，居中显示，
			// 不往 document.body 追加 DOM。
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "persona-picker",
				order: 50,
				locale: NS,
				inject: () => ({ t }),
			}, PersonaPickerOverlay));

			// 新会话起始页（hero）的人设 chip：issue #2 要的「开始会话前也能挑人设」。
			// `conversation.hero.options` 是 hero 那一行右侧的选项区，与「工作目录」chip 同排。
			// 老宿主没有这个 slot 时，`slots.inject` 不会调用回调，插件在别处照常工作。
			ctx.slots.inject("conversation.hero.options", () => ctx.slots.register({
				name: "conversation.hero.options",
				id: "persona-hero",
				order: 40,
				locale: NS,
				inject: () => ({ t }),
			}, PersonaHeroChip));
```

</details>

**依据 2 · 源码核查**：[lib/client.js:863-874](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/client.js#L863-L874)

界面变更通过JSON请求发送。

<details>
<summary>查看原文（12行）</summary>

```text
		/** 一次变更提交。 */
		function postMutate(payload) {
			if (typeof fetch !== "function") return Promise.reject(new Error("fetch unavailable"));
			return fetch(MUTATE_PATH, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload),
			}).then((response) => response.json().then((body) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				if (!body || body.ok !== true) throw new Error((body && body.error) || "request rejected");
				return body.value;
			}));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:288-309](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L288-L309)

作用域优先级与显式禁用。

<details>
<summary>查看原文（22行）</summary>

```text
export function resolvePersona(catalog, store, runtime = {}) {
  const mode = modeOf(store)
  const usable = (id) => {
    if (typeof id !== 'string' || id.length === 0) return undefined
    const found = catalog.find((persona) => persona.id === id)
    return found !== undefined && found.enabled ? found : undefined
  }
  const ladder = []
  if (mode === 'session') {
    // 会话档下，「不启用」是一个明确的选择，必须先于任何回落判断。
    if (sessionDisabled(store, runtime.sessions, runtime.sessionId)) {
      return { persona: undefined, source: 'session' }
    }
    ladder.push(['session', usable(runtime.sessions?.get(runtime.sessionId))])
    ladder.push(['workspace', usable(workspacePickOf(store, runtime.cwd))])
  } else if (mode === 'workspace') {
    ladder.push(['workspace', usable(workspacePickOf(store, runtime.cwd))])
  }
  for (const [source, persona] of ladder) {
    if (persona !== undefined) return { persona, source }
  }
  return { persona: currentPersonaOf(catalog, store), source: 'global' }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1494-1518](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L1494-L1518)

动态正文解析并注册systemPrompt段落。

<details>
<summary>查看原文（25行）</summary>

```text
  const activeText = (context) => {
    recordProbe(context)
    if (resolved.enabled === false) return ''
    // 走 currentStore()：手改 personas.json 之后，**下一个请求**就用新内容，
    // 不必重启。这是提示词注入路径，漏了这里热重载就等于没做。
    const live = currentStore()
    const catalog = buildCatalog(configPersona, live)
    const { persona } = resolvePersona(catalog, live, {
      sessionId: sessionIdOf(context),
      cwd: cwdOf(context),
      sessions,
    })
    return persona && persona.enabled ? persona.text : ''
  }

  if (resolved.enabled === false) {
    loggerOf(ctx)?.info?.('人设注入已停用（enabled: false）')
  } else {
    ctx.effect(
      () => ctx.systemPrompt.section({
        name: PERSONA_SECTION,
        order,
        text: activeText,
        interpolate: false,
      }),
```

</details>

**依据 5 · 源码核查**：[lib/index.js:852-862](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L852-L862)

config人设文件只在构造configPersona时读取。

<details>
<summary>查看原文（11行）</summary>

```text
export function configPersonaOf(ctx, config) {
  const prefix = typeof config.prefix === 'string' ? config.prefix.trim() : ''
  if (prefix.length > 0) {
    return { id: 'config', name: '自定义人设（config）', source: 'config', text: config.prefix, file: undefined }
  }
  const file = typeof config.personaFile === 'string' ? config.personaFile.trim() : ''
  if (file.length > 0) {
    const text = readPersonaFile(ctx, file)
    if (text !== undefined) {
      const base = path.basename(path.resolve(file))
      return { id: 'config', name: base.replace(/\.(md|markdown|txt)$/i, ''), source: 'config', text, file: path.resolve(file) }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久化、清理与本地接口有哪些实际边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

库写入先按基线/磁盘/本进程三方合并，再写临时文件rename，能减少非同条修改整表覆盖；它没有跨进程锁，不能据此保证同时读写永不丢更新。personas.json重载只比较mtime和size，坏JSON回退空库；这让界面继续运行但可能暂时失去已导入条目，手改前应备份。最影响长期会话的是清理：默认存活集合只包含本次进程见过的会话，空集合会拒绝清理，但非空时仍可删除尚存在却本次没用过的会话选择，源码注释已说明这一边界。每类选择上限200，超限淘汰也不等于宿主会话删除。变更路由确有回环地址、JSON类型和Origin检查，但没有建立新的认证体系，不能把本地限制解释成任意代理部署都安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:706-729](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L706-L729)

坏库回退与mtime/size签名。

<details>
<summary>查看原文（24行）</summary>

```text
export function readStore() {
  let store
  try {
    store = normalizeStore(JSON.parse(fs.readFileSync(personaStorePath(), 'utf8')))
  } catch {
    store = emptyStore()
  }
  storeBaselines.set(store, cloneStore(store))
  return store
}

/** 把合并结果灌回调用方正在用的那个对象，保证内存与磁盘一致。 */
function reflowStore(target, source) {
  for (const key of Object.keys(target)) delete target[key]
  Object.assign(target, source)
}

/** 取文件的「签名」，用于判断磁盘上的库有没有被别人改过；取不到返回 undefined。 */
function statSignature(file) {
  try {
    const stat = fs.statSync(file)
    return `${stat.mtimeMs}:${stat.size}`
  } catch {
    return undefined
```

</details>

**依据 2 · 源码核查**：[lib/index.js:814-832](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L814-L832)

三方合并、临时文件及rename，未见跨进程锁。

<details>
<summary>查看原文（19行）</summary>

```text
export function writeStore(store) {
  const file = personaStorePath()
  const baseline = storeBaselines.get(store)
  if (baseline !== undefined) {
    let disk
    try {
      disk = normalizeStore(JSON.parse(fs.readFileSync(file, 'utf8')))
    } catch {
      // 磁盘上没有 / 坏了：以本进程为准（baseline 仍然有效，等于「从零合并」）。
      disk = emptyStore()
    }
    reflowStore(store, mergeStore(baseline, disk, store))
  }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  fs.renameSync(tmp, file)
  // 写完即成为新的公共祖先：下次合并以「我刚写下去的内容」为基准。
  storeBaselines.set(store, cloneStore(store))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:312-316](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L312-L316)

两类作用域选择上限。

```text
/** 最多记住多少个工作目录的选择；超出时丢最早的那条。 */
export const MAX_WORKSPACE_PICKS = 200

/** 最多记住多少个会话的选择；超出时丢最早的那条。 */
export const MAX_SESSION_PICKS = 200
```

**依据 4 · 源码核查**：[lib/index.js:1435-1443](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L1435-L1443)

本次进程活跃集合可能漏掉仍存在的会话。

```text
  /**
   * 本次进程里见过、且**仍在活动**的会话 id。
   *
   * 设置页「清理已失效会话」要拿它当存活集合（P1-4）。这里只统计提示词组装时
   * 出现过会话——也就是真的在用的人设会话。配合那个上限淘汰，它本身就是有界的。
   *
   * 注意这是**保守**集合：一个很久没发消息、但尚未删除的会话不在里面，因此
   * 对它的选择会被当成孤儿。为了让这条操作不误伤，界面把它做成显式按钮、
   * 而不是自动清理；用户点之前能看到「已记录 N 个」。
```

**依据 5 · 源码核查**：[lib/index.js:1222-1246](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L1222-L1246)

空集合拒绝，非空按集合裁剪。

<details>
<summary>查看原文（25行）</summary>

```text
    case 'prune-sessions': {
      // 清掉「会话已经不存在」的选择。
      //
      // 存活集合有两种来源，优先级从高到低：
      //  1. 调用方显式给的 `liveSessionIds`（测试与将来更准确的宿主信息都走这条）；
      //  2. `runtime.liveSessionIds`（apply 里维护的「本次进程见过的会话」）。
      // 两者都没有就报错，而不是猜——猜错会清掉用户的活选择。
      if (!sessions) return { ok: false, error: '当前运行时不支持会话级人设' }
      const explicit = payload.liveSessionIds
      const fallback = runtime?.liveSessionIds
      let live
      if (Array.isArray(explicit)) {
        live = new Set(explicit.filter((id) => typeof id === 'string' && id.length > 0))
      } else if (fallback instanceof Set && fallback.size > 0) {
        live = fallback
      } else if (fallback instanceof Set) {
        // 回落集合是空的 = 本进程还没见过任何会话（例如刚启动、一条消息都还没发）。
        // 这时「整张表都是孤儿」是个**危险**的结论：会把用户所有会话的选择一次清光。
        // 宁可什么都不做，也不基于空白证据做不可逆的删除。
        return { ok: false, error: '还没有足够信息判断哪些会话仍在使用，请先发一条消息再清理' }
      } else {
        return { ok: false, error: '缺少 liveSessionIds（存活会话 id 列表）' }
      }
      const removed = sessions.prune((sessionId) => live.has(sessionId))
      return { ok: true, removed }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1575-1607](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L1575-L1607)

变更路由的实际保护检查。

<details>
<summary>查看原文（33行）</summary>

```text
      scope.effect(
        () => scope.webServer.register({
          kind: 'exact',
          path: BRIDGE_MUTATE_PATH,
          handler: async (request, response) => {
            if (!isLoopbackRequest(request)) {
              writeJson(response, 403, { ok: false, error: 'loopback requests only' })
              return
            }
            if ((request.method ?? '') !== 'POST') {
              writeJson(response, 405, { ok: false, error: 'method not allowed' })
              return
            }
            // CSRF 防护：只接受带 JSON content-type 的同源请求。
            // 只靠 isLoopbackRequest 挡不住「本机浏览器里的恶意网页」——那条路径
            // 用 text/plain 就绕过了 CORS 预检，见 hasJsonContentType 的注释。
            if (!hasJsonContentType(request)) {
              writeJson(response, 415, { ok: false, error: 'content-type must be application/json' })
              return
            }
            if (!isSameOriginRequest(request)) {
              writeJson(response, 403, { ok: false, error: 'cross-origin requests are not allowed' })
              return
            }
            const body = await readJsonBody(request)
            if (body === undefined) {
              writeJson(response, 400, { ok: false, error: 'malformed JSON body' })
              return
            }
            // 变更前先热重载一次：如果用户在别的窗口 / 手动改过库，这里要基于最新状态改，
            // 否则 mutatePersona 会在旧视图上操作，写完还可能把对方的改动覆盖掉。
            const live = currentStore()
            const result = mutatePersona(body, resolved, configPersona, live, sessions, { liveSessionIds })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 值得什么人试用，成本和改进假设如何验证？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

适合在本地DSH Web中反复切换风格、能备份人设库的用户先试用。首次成本是安装匹配宿主、导入或审查人设并检查作用域；持续成本包括每次请求多出人设token、维护条目及遇到回退时核对实际注入。插件未另调用模型，但人设文本进入主模型请求不等于零费用；金额和人工时间未知。失败时先导出/备份库，停用对应人设或设会话不启用，再核对后续请求；不要在未确认全部会话清单时点击清理。由活跃集合限制可推导未验证假设：清理前显示候选会话及其选择，并以宿主真实存在性查询复核，可能减少误删。用包含冷会话的固定集合对比现流程与预览流程，若仍误删或复核负担过大就推翻。没有风格一致性或任务质量对照，不能宣称人设带来增效。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1494-1518](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L1494-L1518)

正文每次进入system prompt，主模型输入负担真实存在。

<details>
<summary>查看原文（25行）</summary>

```text
  const activeText = (context) => {
    recordProbe(context)
    if (resolved.enabled === false) return ''
    // 走 currentStore()：手改 personas.json 之后，**下一个请求**就用新内容，
    // 不必重启。这是提示词注入路径，漏了这里热重载就等于没做。
    const live = currentStore()
    const catalog = buildCatalog(configPersona, live)
    const { persona } = resolvePersona(catalog, live, {
      sessionId: sessionIdOf(context),
      cwd: cwdOf(context),
      sessions,
    })
    return persona && persona.enabled ? persona.text : ''
  }

  if (resolved.enabled === false) {
    loggerOf(ctx)?.info?.('人设注入已停用（enabled: false）')
  } else {
    ctx.effect(
      () => ctx.systemPrompt.section({
        name: PERSONA_SECTION,
        order,
        text: activeText,
        interpolate: false,
      }),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1202-1219](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L1202-L1219)

清除选择与显式不启用的不同操作。

<details>
<summary>查看原文（18行）</summary>

```text
    case 'set-session-persona': {
      if (!sessions) return { ok: false, error: '当前运行时不支持会话级人设' }
      const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId.trim() : ''
      if (sessionId.length === 0) return { ok: false, error: '缺少 sessionId' }
      // `none: true` = 本会话不启用人设（会话档的第三态）。
      // 它是有意的选择，与「清除选择、回落上层」不同，所以用哨兵值存而不是 clear()。
      if (payload.none === true) {
        sessions.set(sessionId, SESSION_NO_PERSONA)
        break
      }
      // personaId 传 null / 空串 = 清除该会话的选择，回落到工作区 / 全局人设。
      if (payload.personaId === null || payload.personaId === undefined || payload.personaId === '') {
        sessions.clear(sessionId)
        break
      }
      const target = byId(payload.personaId)
      if (!target) return { ok: false, error: `找不到人设「${payload.personaId}」` }
      sessions.set(sessionId, target.id)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1435-1443](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/lib/index.js#L1435-L1443)

清理候选预览假设的具体依据。

```text
  /**
   * 本次进程里见过、且**仍在活动**的会话 id。
   *
   * 设置页「清理已失效会话」要拿它当存活集合（P1-4）。这里只统计提示词组装时
   * 出现过会话——也就是真的在用的人设会话。配合那个上限淘汰，它本身就是有界的。
   *
   * 注意这是**保守**集合：一个很久没发消息、但尚未删除的会话不在里面，因此
   * 对它的选择会被当成孤儿。为了让这条操作不误伤，界面把它做成显式按钮、
   * 而不是自动清理；用户点之前能看到「已记录 N 个」。
```

**依据 4 · 作者声明**：[README.md:50-51](https://github.com/huaizhuanghub/dsh-persona-dafeiyu/blob/4af4825a756521f9188c1b4abb5d95135f57397c/README.md#L50-L51)

作者Node与DSH条件。

```text
- Node.js ≥ 20
- DSH —— 已实测的版本见文末「[兼容性](#兼容性)」
```

#### 缺口

- 没有同任务风格合格率、token和人工维护数据。
  **影响**：不能判断比手动提示词是否更划算，不能保证模型遵守风格。
  **进一步探讨**：固定短任务与相同模型，对比手动前缀和人设库，记录串用、合格回答与总输入。
- 清理预览与宿主存在性复核方案未实现验证。
  **影响**：不能把改进假设当现有数据保全能力。
  **进一步探讨**：在冷会话集合验证候选预览，观察误删率和额外人工步骤。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
