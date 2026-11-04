# DSH Armory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[90c6dca](https://github.com/2026heshao/dsh-armory/tree/90c6dcaa96985329521903b53dd22b8fa4b8277f)

<!-- BEGIN META -->
[![GitHub ★ 80](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-armory) [![npm 30d 3,041](https://img.shields.io/static/v1?label=npm+30d&message=3%2C041&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory)
<!-- END META -->

> **功能**：为 DSH 提供 MCP、技能、专家与插件的统一管理面板、市场入口和工具使用账本。

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 显示面板把扩展管理和使用账本接到宿主注册表和日志；相对分别查配置和会话日志，减少分散查找的机制有据，净收益仍需对照。

> **主要限制**：[Q02](#research-q02) 中技能更新先删除旧目录再换入，失败清理不会恢复旧内容；条件式摘要校验和文件存在检查也不等同宿主已加载，故应先备份并核实发现结果。

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
  - [Q01 · 这个组件为谁集中管理什么，替代原来的哪些步骤？](#detail-section-11)
  - [Q02 · 技能安装、更新和删除如何落盘，失败会保留什么？](#detail-section-12)
  - [Q03 · 使用账本能证明哪些工具可安全禁用或能节省多少费用？](#detail-section-13)
  - [Q04 · MCP 导入的配置写入和运行连接是否同时成功？](#detail-section-14)
  - [Q05 · 什么人可以试用，遇到哪些现象应停止？](#detail-section-15)
  - [Q06 · 可恢复替换和宿主回读是否值得增加复杂度？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个 MCP 连接和技能的 DSH 用户可集中查看和管理扩展；只有少量扩展时额外面板的价值未确定。

宿主插件命令、配置文件及各市场可分别完成相应管理；本组件把入口和部分状态集中，未证明比原流程节时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 技能安装 | 下载技能文件到用户目录 | 条件式摘要校验；替换失败无旧目录回滚 |
| 技能删除 | 从受限来源的目录移除技能 | 普通目录会递归删除，应先备份 |
| MCP 导入 | 更新全局或项目配置 | 项目连接对齐可能失败并滞留 |
| 工具账本 | 结合日志与注册表查看使用情况 | 日志缺失或跳过影响覆盖，token 为粗估 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 启动需要 | 宿主服务和 Web 面板 | 无法假定可加载 |
| 可写 profile 与技能目录 | 写入操作需要 | 保存配置或技能 | 写入失败或需要人工恢复 |
| SkillHub 和网络 | 市场技能操作需要 | 下载清单与文件 | 下载失败不代表已安装 |
| MCP 服务及凭据 | 相应连接需要 | 建立远端工具连接 | 配置存在不保证连接成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 profile 和技能目录 | 备份可恢复，再选隔离环境 |
| 启动 | 用户安装并完全重启宿主 | 能打开面板才继续 |
| 操作 | 用户选择非关键技能并核查来源 | 核对目录、宿主发现与实际连接 |
| 恢复 | 用户检查错误与原配置 | 状态异常时停止并从备份恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网络和存储费用未知 | 备份、核对宿主版本，耗时未知 | 需兼容宿主及可写目录 |
| 持续 | 外部服务费用未知 | 审核来源、观察连接与使用账本 | 无同任务时间对照 |
| 失败恢复 | 备份存储和服务费用未知 | 对照目录、连接及恢复配置 | 先删后替换无法自动保留旧目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一入口 | 面板与 Remote 的技能安装链已接线 | 实际节时与全部市场可用性 |
| 使用观察 | 读取窗口日志并粗估 Schema 长度 | 精确计费、零调用后是否安全删除 |
| 配置更新 | profile 写入前比较版本，项目写入后尝试对齐 | 目标宿主实时连接及故障恢复 |

> **思考**：[Q02](#research-q02) 中技能更新先删除旧目录再换入，失败清理不会恢复旧内容；条件式摘要校验和文件存在检查也不等同宿主已加载，故应先备份并核实发现结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 显示面板把扩展管理和使用账本接到宿主注册表和日志；相对分别查配置和会话日志，减少分散查找的机制有据，净收益仍需对照。

[Q02](#research-q02) 的目录内串行、来源与 realpath 校验，以及 [Q04](#research-q04) 的写前版本检查有明确边界；技能更新不保留旧目录，不能将这些局部防护外推为整体事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 中技能更新先删除旧目录再换入，失败清理不会恢复旧内容；条件式摘要校验和文件存在检查也不等同宿主已加载，故应先备份并核实发现结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议有多项扩展的用户先准备可恢复备份，在隔离 profile 用非关键技能核对完整过程；若发现状态与目录不一致，停止并恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前提交源码支持有条件的机制判断；假设、跨平台兼容与真实收益没有本次运行证据。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js、lib/wb-market.js、lib/skill-remove.js、lib/tool-ledger.js、lib/import-admission.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查宿主插件入口、技能安装与删除、日志账本和 MCP 导入；未全面审计 OAuth、专家、其他市场或所有 UI，也未运行目标。
- 下一步：隔离 profile 中比较原生命令与面板，注入下载和换入失败，逐一检查磁盘、宿主发现与连接；不要使用真实凭据或关键技能。

**分析版本**

- **仓库**：[2026heshao/dsh-armory](https://github.com/2026heshao/dsh-armory)
- **版本号**：2.4.8（[固定提交 90c6dca](https://github.com/2026heshao/dsh-armory/tree/90c6dcaa96985329521903b53dd22b8fa4b8277f)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出保留旧目录直至新目录得到宿主发现确认的未验证方案；若普通备份更可靠或事务成本更高，则不推广。

隔离 profile 中比较原生命令与面板，注入下载和换入失败，逐一检查磁盘、宿主发现与连接；不要使用真实凭据或关键技能。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 320 | 264 | 37 | — |
| .md | source | 30 | 2815 | — | — | 60581 |
| .js | source | 35 | 30908 | 24186 | 6006 | — |
| .mjs | test | 84 | 20651 | 15954 | 3512 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH Armory 管理多项扩展的具体接线、写入恢复边界及采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个组件为谁集中管理什么，替代原来的哪些步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常维护多个 MCP 连接、技能和插件的 DSH 用户可以从同一看板查找或管理对象；原办法包括宿主命令、配置文件和独立市场。README 明确把多对象收进面板并说明偶尔聊天且没有这些扩展的人不需要，属于作者定位。package.json 的 bundle patch 和 Web 客户端声明、Gateway 的 Remote 注册及客户端调用表明至少技能安装这条路径确实接线。增量是把入口、来源及状态检查集中在已有宿主流程中；项目继承了上游 MCP 管理 UI 与 DSH 的宿主能力，不能把这些算成原创，也不能由源码推断管理时间或采用需求的实际改善。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-6](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/README.md#L1-L6)

作者描述面板对象。

```text
# dsh-armory · 军械库

中文 | [English](README.en.md)

> **你不需要记住 DSH 里装过什么。**
> 军械库把 MCP、技能、专家、插件和四个市场收进一块面板：316 个连接器、19 万+ 技能、429 位专家。装过什么、连没连上、哪些工具在吃 token，打开就能看见；会话里要用什么，也能直接叫出来。
```

**依据 2 · 作者声明**：[README.md:93-101](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/README.md#L93-L101)

适用和不适用场景。

```text
### 装过什么，有账

`~/.dsh/armory/install-state.json` 记下每条连接器、技能、插件来自哪个市场，并把「军械库装的」和「手动配的」分开。市场页可以跨页筛出已安装项。

「装备清单」能把本机的 MCP、技能、专家、插件导出成一份 JSON。换机时粘贴或选文件导入，逐项比较「已安装 / 可更新 / 本机没有」。清单只含名称、类型、来源、版本和必要的身份字段，不写密钥、header、环境变量值，也不带技能正文和人设。

## 不适合谁

如果你只是偶尔用 DSH 聊天，没装 MCP、技能或专家，这块面板确实用不上。它解决的是装得多了以后记不住、找不到、关不掉的问题。
```

**依据 3 · 源码核查**：[package.json:13-16](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/package.json#L13-L16)

宿主入口及 Node 版本。

```text
  "type": "module",
  "main": "lib/index.js",
  "engines": {
    "node": ">=22.15"
```

**依据 4 · 源码核查**：[package.json:74-83](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/package.json#L74-L83)

bundle 与客户端声明。

<details>
<summary>查看原文（10行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-api-remotes"
      ]
    }
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/cordis.patch.yml#L1-L3)

宿主 patch 加入组件。

```text
- insert:
  - id: dsh-armory
    name: dsh-armory
```

**依据 6 · 源码核查**：[lib/index.js:1392-1401](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L1392-L1401)

注册技能相关 Remote。

<details>
<summary>查看原文（10行）</summary>

```text
			_wbSkillCatalog_decorators = [Remote("wbSkillCatalog")];
			__esDecorate(this, null, _wbSkillCatalog_decorators, { kind: "method", name: "wbSkillCatalog", static: false, private: false, access: { has: (obj) => "wbSkillCatalog" in obj, get: (obj) => obj.wbSkillCatalog }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbSkillDetail_decorators = [Remote("wbSkillDetail")];
			__esDecorate(this, null, _wbSkillDetail_decorators, { kind: "method", name: "wbSkillDetail", static: false, private: false, access: { has: (obj) => "wbSkillDetail" in obj, get: (obj) => obj.wbSkillDetail }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbSkillInstall_decorators = [Remote("wbSkillInstall")];
			__esDecorate(this, null, _wbSkillInstall_decorators, { kind: "method", name: "wbSkillInstall", static: false, private: false, access: { has: (obj) => "wbSkillInstall" in obj, get: (obj) => obj.wbSkillInstall }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbSkillUninstall_decorators = [Remote("wbSkillUninstall")];
			__esDecorate(this, null, _wbSkillUninstall_decorators, { kind: "method", name: "wbSkillUninstall", static: false, private: false, access: { has: (obj) => "wbSkillUninstall" in obj, get: (obj) => obj.wbSkillUninstall }, metadata: _metadata }, null, _instanceExtraInitializers);
			_wbSkillInstalled_decorators = [Remote("wbSkillInstalled")];
			__esDecorate(this, null, _wbSkillInstalled_decorators, { kind: "method", name: "wbSkillInstalled", static: false, private: false, access: { has: (obj) => "wbSkillInstalled" in obj, get: (obj) => obj.wbSkillInstalled }, metadata: _metadata }, null, _instanceExtraInitializers);
```

</details>

**依据 7 · 源码核查**：[lib/client.js:12020-12031](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/client.js#L12020-L12031)

客户端发起调用并刷新。

<details>
<summary>查看原文（12行）</summary>

```text
    }
    skillInstallInFlight.current.add(flightKey);
    setBusy(true); setBusyLabel(t('正在下载并校验 {0}…', [skill.name])); setError('');
    try {
      const res = await call('wbSkillInstall', { slug: skill.slug, namespace: skill.namespace, name: skill.name });
      if (!res?.ok) throw new Error(res?.error || t('安装失败'));
      setNote(t('{0}：{1}', [skill.name, res.note || t('已安装')]));
      closeSkillDetail();
      // 磁盘上的 skill 集合已经变了：广播出去，顶部分类计数与（切回时的）Skill 看板
      // 立即按新集合重算，不再等用户离开看板/重挂载。市场自己的列表照旧局部刷新。
      emitSkillChange('market-install');
      await loadInstalled();
```

</details>

#### 缺口

- 没有同任务用户对照
  **影响**：无法确认重复需求强度、收益或节时
  **进一步探讨**：比较同一批扩展在原生命令与面板中的完整管理和恢复成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 技能安装、更新和删除如何落盘，失败会保留什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

客户端调用 wbSkillInstall，宿主 Remote 再调用市场模块；成功后记录安装状态，记录失败仅警告，不撤销已安装目录。市场模块按最终目录在进程内排队；先检查文件数量、总大小、SKILL.md 和路径，再下载至 staging。仅当清单提供摘要且响应非空时才计算 SHA-256；它并非无条件逐文件完整性证明。替换先 rm 旧目录再 rename staging，rename 失败时 catch 只清理 staging，旧目录已无法由该路径恢复；随后 stat 不到清单文件又删除新目录，仍无旧版本回滚。另一条普通技能删除检查来源、根路径和 realpath，符号链接只 unlink，普通目录确认清单后递归删除。以上是源码所示条件性故障结果，不声称实际发生过故障；跨进程并发及宿主重新发现技能未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:12012-12031](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/client.js#L12012-L12031)

界面防重复并调用 Host。

<details>
<summary>查看原文（20行）</summary>

```text
  const skillInstallInFlight = useRef(new Set());
  const installSkill = async (skill) => {
    // 同一技能的上一次安装还在飞时直接挡回：宿主侧已有按目录的互斥锁兜底串行，
    // 这里再挡一层是为了不给用户制造「点了两次、两次都报成功」的错觉。
    const flightKey = skillInstalledKey(skill);
    if (skillInstallInFlight.current.has(flightKey)) {
      setNote(t('该技能正在安装中，请等当前任务结束'));
      return;
    }
    skillInstallInFlight.current.add(flightKey);
    setBusy(true); setBusyLabel(t('正在下载并校验 {0}…', [skill.name])); setError('');
    try {
      const res = await call('wbSkillInstall', { slug: skill.slug, namespace: skill.namespace, name: skill.name });
      if (!res?.ok) throw new Error(res?.error || t('安装失败'));
      setNote(t('{0}：{1}', [skill.name, res.note || t('已安装')]));
      closeSkillDetail();
      // 磁盘上的 skill 集合已经变了：广播出去，顶部分类计数与（切回时的）Skill 看板
      // 立即按新集合重算，不再等用户离开看板/重挂载。市场自己的列表照旧局部刷新。
      emitSkillChange('market-install');
      await loadInstalled();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2236-2259](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L2236-L2259)

调用市场安装及记录状态的失败处理。

<details>
<summary>查看原文（24行）</summary>

```text
	async wbSkillInstall(payload) {
		const marketApi = await loadMarket();
		// 安装进度经 ctx.logger 落到宿主日志（Remote 单次调用没有流式回传通道，面板按
		// 阶段提示「正在下载与校验」，完成后一次拿到结果与 note）。
		const result = await marketApi.wbSkillInstall(payload || {}, {
			onProgress: (progress) => this.ctx.logger?.debug?.(`wb-market: ${progress.phase} ${progress.index}/${progress.total}`),
		});
		// T04/R8：装成功后登记本地状态。key 取不到就跳过（record 对空 key 会抛错）。
		const key = result?.name || payload?.slug || payload?.name || "";
		if (key) {
			try {
				await recordInstallState({
					kind: "skill",
					key,
					name: result?.name || payload?.name || key,
					version: result?.version || "",
					installPath: result?.dir || "",
					source: { kind: "marketplace", marketplace: "workbuddy-skills" },
				});
			} catch (error) {
				this.ctx.logger?.warn?.(`wb-market: 技能 ${key} 安装状态登记失败（不影响安装结果）：${error?.message || error}`);
			}
		}
		return result;
```

</details>

**依据 3 · 源码核查**：[lib/wb-market.js:840-870](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/wb-market.js#L840-L870)

按目标串行与清单前置检查。

<details>
<summary>查看原文（31行）</summary>

```text
const skillInstallLocks = new Map();
export async function wbSkillInstall(payload = {}, { onProgress } = {}) {
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  if (!slug || !namespace) throw new Error("缺少 slug 或 namespace");
  const finalDir = join(homedir(), ".agents", "skills", skillTargetName(namespace, slug));
  const previous = skillInstallLocks.get(finalDir);
  let run;
  // 前序任务失败不该连坐后序：catch 吞掉前序拒绝后再排自己的。
  const queued = previous ? previous.catch(() => {}) : Promise.resolve();
  run = queued
    .then(() => installSkillLocked(payload, { onProgress }, finalDir))
    .finally(() => {
      if (skillInstallLocks.get(finalDir) === run) skillInstallLocks.delete(finalDir);
    });
  skillInstallLocks.set(finalDir, run);
  return run;
}
async function installSkillLocked(payload = {}, { onProgress } = {}, finalDir) {
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  const requestedName = String(payload?.name || "").trim();
  const listing = await wbSkillFiles(payload);
  if (!listing.files.length) throw new Error("该技能没有可下载的文件");
  if (listing.files.length > 400) throw new Error(`文件数超出上限（${listing.files.length} > 400）`);
  const stagingDir = `${finalDir}.installing`;
  const totalBytes = listing.files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > 32 * 1024 * 1024) throw new Error(`技能总体积超过 32MB 上限（${Math.round(totalBytes / 1024 / 1024)}MB）`);
  // 必须有 SKILL.md，否则装了也不会被注册表发现——直接拒绝而不是装个哑包。
  const hasSkillMd = listing.files.some((file) => file.path === "SKILL.md");
  if (!hasSkillMd) throw new Error("清单里没有 SKILL.md，不是标准技能包，拒绝安装");
```

</details>

**依据 4 · 源码核查**：[lib/wb-market.js:871-907](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/wb-market.js#L871-L907)

下载、条件摘要校验和先删后替换与失败清理。

<details>
<summary>查看原文（37行）</summary>

```text
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });
  let doneBytes = 0;
  try {
    for (const [index, file] of listing.files.entries()) {
      const relative = file.path;
      // 路径安全：解析后必须落在 staging 内（拒绝 ../、绝对路径、盘符）。
      const target = resolve(stagingDir, relative);
      if (target !== stagingDir && !target.startsWith(stagingDir + sep)) throw new Error(`清单里的非法路径：${relative}`);
      const params = new URLSearchParams({ namespace, path: relative });
      if (listing.version) params.set("version", listing.version);
      const buffer = await fetchWithLimits(`${SKILLHUB_ORIGIN}/api/v1/skills/${encodeURIComponent(slug)}/file?${params.toString()}`);
      if (file.sha256 && buffer.length) {
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (digest !== file.sha256) throw new Error(`文件校验失败（${relative}）：sha256 不匹配`);
      }
      await mkdir(resolve(stagingDir, relative, ".."), { recursive: true });
      await writeFile(target, buffer);
      doneBytes += buffer.length;
      onProgress?.({ phase: "downloading", index: index + 1, total: listing.files.length, bytes: doneBytes, totalBytes });
    }
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
```

</details>

**依据 5 · 源码核查**：[lib/skill-remove.js:68-88](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/skill-remove.js#L68-L88)

限定来源和根路径。

<details>
<summary>查看原文（21行）</summary>

```text
export async function removeSkillFromDisk(skill, options = {}) {
	const source = typeof skill?.source === "string" ? skill.source : "";
	const root = skillRootFor(source, options);
	if (!root) {
		if (source === "project-agents" || source === "project-dsh") {
			throw new Error(`卸载项目级 skill 需要当前项目路径（来源：${describeSource(source)}）`);
		}
		throw new Error(`这个 skill 来自${describeSource(source)}，不在可卸载范围内（只支持用户级/项目级的 .dsh/skills 与 .agents/skills）`);
	}
	if (!isAbsolute(root)) throw new Error("拒绝卸载：无法确定 skills 根目录的绝对路径");
	const raw = typeof skill?.path === "string" ? skill.path.trim() : "";
	if (!raw) throw new Error("这个 skill 没有可卸载的磁盘路径（运行时注册的 skill 不落盘）");
	if (!isAbsolute(raw)) throw new Error("拒绝卸载：skill 路径不是绝对路径");

	const rawAbs = resolve(raw);
	// 注册表把 skill.path 指向清单文件（<skill>/SKILL.md），删除目标是它所在的目录。
	// 若直接拿清单路径去删，只会得到「该路径不是目录」——真实 GUI 首跑就撞上了。
	const target = basename(rawAbs).toLowerCase() === "skill.md" ? dirname(rawAbs) : rawAbs;
	const rootAbs = resolve(root);
	if (!isInside(rootAbs, target)) {
		throw new Error(`拒绝卸载：skill 路径不在预期的 skills 根目录内（${rootAbs}）`);
```

</details>

**依据 6 · 源码核查**：[lib/skill-remove.js:99-124](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/skill-remove.js#L99-L124)

realpath 与符号链接、目录删除。

<details>
<summary>查看原文（26行）</summary>

```text
	// 父目录的 realpath 校验：防「根内路径 → 祖先符号链接实际指向根外」。根目录本身是
	// 符号链接（例如 ~/.agents → 别处）是允许的，所以比的是 realpath 后的根。
	const rootReal = await realpath(rootAbs);
	const parentReal = await realpath(dirname(target));
	if (!isInsideOrEqual(rootReal, parentReal)) {
		throw new Error("拒绝卸载：skill 路径经符号链接指向了 skills 根目录之外");
	}

	if (info.isSymbolicLink()) {
		// 只删链接本身。链接可能指向任意位置（例如 tabbit 这种外部安装的 skill），
		// rm/lstat 都不会跟随，但我们仍显式只用 unlink，语义一目了然。
		await unlink(target);
		return { path: target, kind: "symlink" };
	}
	if (!info.isDirectory()) throw new Error("拒绝卸载：该路径不是目录（也不是符号链接）");

	const targetReal = await realpath(target);
	if (!isInside(rootReal, targetReal)) {
		throw new Error("拒绝卸载：skill 目录经符号链接指向了 skills 根目录之外");
	}
	const manifest = await stat(join(target, "SKILL.md")).catch(() => null);
	if (!manifest || !manifest.isFile()) {
		throw new Error("拒绝卸载：目录里没有 SKILL.md，看起来不是 skill 目录");
	}
	await rm(target, { recursive: true, force: false });
	return { path: target, kind: "dir" };
```

</details>

#### 缺口

- 没有故障注入和跨进程并发验证
  **影响**：不能断言实际恢复和宿主发现行为
  **进一步探讨**：隔离目录模拟下载、删除后替换失败及宿主重新发现，检查旧目录与备份。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用账本能证明哪些工具可安全禁用或能节省多少费用？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

账本读取本机会话调用与结果事件，并把当前注册表 Schema 投影合并为使用信息；index.js 也尝试纳入各项目 MCP，单个工作区读取失败则跳过。窗口前的调用会被过滤，无法识别时间的调用仍计入并单列，超大日志跳过并报失败。Schema token 以字符串长度除四向上取整，源码明确仅为粗估；因此窗口内零调用只能提示复核，既不证明未来任务不需要该工具，也不证明实际计费节省。用户应确认覆盖和失败信息、记录原配置，并在目标任务中验证后再裁剪。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1040-1064](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L1040-L1064)

采集 MCP 名称和 Schema，并容忍单工作区读取失败。

<details>
<summary>查看原文（25行）</summary>

```text
async function scanToolTailor(ctx, days) {
	const mcpServerNames = [];
	const disabledServers = new Set();
	for (const entry of allMcpEntries(ctx)) {
		const name = entry.options.config.serverName;
		if (!mcpServerNames.includes(name)) mcpServerNames.push(name);
		if (entry.disabled === true) disabledServers.add(name);
	}
	// 项目级服务器不在 loader 里（挂在共享作用域层），但工具名同样是 mcp__<server>__<tool>，
	// 归属判定必须把它们也算进去，否则项目工具会被误判成内置工具。
	for (const record of await listWorkspaceRecords(ctx)) {
		try {
			const config = await readWorkspaceConfigCached(ctx, record.path);
			if (config.error || config.missing) continue;
			for (const server of config.servers) {
				if (!mcpServerNames.includes(server.name)) mcpServerNames.push(server.name);
				if (server.disabled === true) disabledServers.add(server.name);
			}
		} catch {
			// 单个工作区配置读不了不挡全局账本。
		}
	}
	const schemas = [...ctx.tools.schemas()].map(projectToolSchema);
	const report = await scanSessionLedger({ days, mcpServerNames, schemas, disabledServers });
	return attachRegisteredSkills(ctx, report);
```

</details>

**依据 2 · 源码核查**：[lib/tool-ledger.js:180-201](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/tool-ledger.js#L180-L201)

统一投影并以字符数粗估 token。

<details>
<summary>查看原文（22行）</summary>

```text

/**
 * 上下文 token 估算。Schema 以 ASCII 为主，4 字符 ≈ 1 token 是公开常用的粗估；
 * 只用于相对比较与量级感知，不承诺精确计费。
 * @param {string} text
 * @returns {number}
 */
function estimateTokens(text) {
	return Math.ceil(text.length / 4);
}

/**
 * 单个工具 Schema 投影成「要下发的那段 JSON」后的上下文税。
 *
 * 注册表侧与日志真实下发侧**必须共用这一个投影**：两处各写一遍 `{name, description,
 * parameters}` 时，任何一侧改了键集合或兜底写法，「注册表快照 vs 真实下发」的偏差里就会
 * 混进口径差而不是真差异，那个偏差卡就成了长期误报的假告警。
 * @param {{name: string, description?: string, parameters?: unknown}} tool
 * @returns {number} 估算 token 数。
 */
function schemaTokensOf(tool) {
	return estimateTokens(JSON.stringify({ name: tool.name, description: tool.description || "", parameters: tool.parameters ?? null }));
```

</details>

**依据 3 · 源码核查**：[lib/tool-ledger.js:391-418](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/tool-ledger.js#L391-L418)

过期与超大文件跳过和失败记录。

<details>
<summary>查看原文（28行）</summary>

```text
			for (const logName of logFiles) {
				const logPath = join(sessDir, logName);
				let st;
				try {
					// mtime 早于窗口起点 → 里面不可能有窗口内事件，整个文件跳过。
					// 依据：日志是追加写，追加必然抬升 mtime。
					st = await stat(logPath);
				} catch {
					failures(`${logPath}: stat failed`);
					continue;
				}
				if (st.mtimeMs < cutoffMs) {
					filesSkippedStale += 1;
					continue;
				}
				// 尺寸闸门放在读盘之前（OPT-06）：超限就降级跳过，并把原因交给 failures()
				// 上屏，而不是先整块读进来再发现内存不够。
				if (st.size > MAX_LOG_BYTES) {
					filesSkippedOversize += 1;
					failures(`${logPath}: 日志 ${formatMB(st.size)} 超过 ${formatMB(MAX_LOG_BYTES)} 上限，已跳过`);
					continue;
				}
				let loaded;
				try {
					loaded = await readLogTextCached(logPath, st);
				} catch (error) {
					failures(`${logPath}: ${error instanceof Error ? error.message : String(error)}`);
					continue;
```

</details>

**依据 4 · 源码核查**：[lib/tool-ledger.js:432-461](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/tool-ledger.js#L432-L461)

窗口、无日期事件和调用计数。

<details>
<summary>查看原文（30行）</summary>

```text
					const time = typeof event.time === "number" ? event.time : null;
					// §6.3 先记时间跨度，再做窗口过滤：被窗口丢掉的事件同样是「本机日志里真实存在过的
					// 调用记录」，界面要用它解释「把窗口从 30 天加到 90 天为什么什么都没变」。
					if (event.type === "tool/call" && time !== null) {
						if (scannedEventsOldestMs === null || time < scannedEventsOldestMs) scannedEventsOldestMs = time;
						if (scannedEventsNewestMs === null || time > scannedEventsNewestMs) scannedEventsNewestMs = time;
					}
					if (time !== null && time < cutoffMs) continue;
					if (event.type === "tool/call") {
						const name = typeof event.data?.name === "string" ? event.data.name : null;
						const callId = typeof event.data?.callId === "string" ? event.data.callId : null;
						if (!name) continue;
						// §6.2 计到账上了但没有 time → 这条落在哪个窗口都无法判定，它已经在**任何**窗口
						// 里被计数（含下面的 1 天窗口）。这是口径失配，必须单独报出去。
						if (time === null) undatedCalls += 1;

						let record = usage.get(name);
						if (!record) {
							record = emptyToolRecord();
							usage.set(name, record);
						}
						record.calls += 1;
						totalCalls += 1;
						dirHadCall = true;
						const bucket = dayIndex(time);
						if (bucket !== null) dayBuckets[bucket] += 1;
						if (callId) record.seenCallIds.add(callId);
						if (time !== null) {
							if (record.firstUsedMs === null || time < record.firstUsedMs) record.firstUsedMs = time;
							if (record.lastUsedMs === null || time > record.lastUsedMs) record.lastUsedMs = time;
```

</details>

#### 缺口

- 没有目标用户日志覆盖率及计费对照
  **影响**：无法把零调用或粗估转成安全禁用或实际节省
  **进一步探讨**：先检查扫描失败与窗口，再对照同任务的真实请求与结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · MCP 导入的配置写入和运行连接是否同时成功？

**研究主题**：依赖、兼容与流程、功能与机制、缺陷与关键质疑

#### 完整回答

全局导入先在 Host 重新准入、解析冲突，再在写锁下读取当前状态并写 profile patch；写入前比较内容摘要并调用原子写入，外部变化会返回 FS_STALE_VERSION。准入会规范环境表达式并保留同名第一项、跳过后续条目。项目导入把配置写盘后在锁外对齐连接；对齐失败被记录到日志但不回滚已写配置，源码注明已删除的连接可能留到空闲超时或插件卸载。因此写入成功只证明该路径完成配置修改，不能据此证明实时连接已收敛；用户应检查作用域、跳过项和实际连接。

#### 证据与依据

**依据 1 · 源码核查**：[lib/import-admission.js:30-44](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/import-admission.js#L30-L44)

递归处理表达式并拒绝不支持值。

<details>
<summary>查看原文（15行）</summary>

```text
function canonicalizeAt(value, path) {
  if (typeof value === 'string') {
    if (!value.startsWith('!!js ') || isTotalExpression(value)) return value
    const canonical = canonicalizeExpression(value)
    // 不静默放行：写下去就是宿主求值时的失败，而不是解析失败。正常路径到这里之前已被
    // `expressionValue` 拒过；这条是给"以后有人把手工拼的 spec 塞进准入"兜底。
    // 报文只给字段路径，不回显值本身——值可能来自用户主目录里的配置。
    if (canonical === null) throw new Error(`导入结果的 ${path} 含不受支持的 !!js 表达式`)
    return canonical
  }
  if (Array.isArray(value)) return value.map((item, index) => canonicalizeAt(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, canonicalizeAt(item, path ? `${path}.${key}` : key)]))
  }
  return value
```

</details>

**依据 2 · 源码核查**：[lib/import-admission.js:56-69](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/import-admission.js#L56-L69)

同名过滤及跳过报告。

<details>
<summary>查看原文（14行）</summary>

```text
export function admitImportedServers(normalized) {
  const servers = (normalized?.servers ?? []).map((server, index) => canonicalizeAt(server, `servers[${index}]`))
  const duplicates = duplicateServerNames(servers)
  const seen = new Set()
  const unique = servers.filter((server) => (seen.has(server.name) ? false : Boolean(seen.add(server.name))))
  // `skipped` 只累加：预览与写盘各自准入一次（幂等），第二次不该丢掉第一次记下的名字——否则
  // 导入结果的"跳过 N 条"会变成空话。提示只在**本次**真的跳过时追加，重复调用不会重复报警。
  const skipped = [...(normalized?.skipped ?? []), ...duplicates]
  const warnings = [...(normalized?.warnings ?? [])]
  if (duplicates.length) {
    warnings.push(`同名条目只保留先出现的那条，已跳过：${duplicates.join('、')}（同一作用域内 serverName 只能有一条）`)
  }
  return { ...normalized, servers: unique, skipped, warnings }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:403-431](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L403-L431)

锁、版本比较与原子写入。

<details>
<summary>查看原文（29行）</summary>

```text
function patchVersion(content) {
	return createHash("sha256").update(content).digest("hex");
}
async function readProfilePatchFile(path) {
	const [content, info] = await Promise.all([readFile(path, "utf8"), stat(path)]);
	if (!info.isFile()) throw new Error("profile patch is not a regular file");
	return { content, target: path, version: patchVersion(content), mode: info.mode & 0o777 || 0o600 };
}
function withPatchWrite(ctx, operation) {
	const previous = patchWriteQueues.get(ctx) || Promise.resolve();
	const run = async () => {
		const path = patchPath(ctx);
		if (!path) throw new Error("root include unavailable; cannot locate profile patch");
		return withFileLock(path, operation);
	};
	const current = previous.then(run, run);
	patchWriteQueues.set(ctx, current.catch(() => {}));
	return current;
}
async function readPatch(ctx) {
	const path = patchPath(ctx);
	if (!path) throw new Error("root include unavailable; cannot locate profile patch");
	return readProfilePatchFile(path);
}
async function writePatch(state, content, version = state.version) {
	const current = await readProfilePatchFile(state.target);
	if (current.version !== version) throw new Error(`FS_STALE_VERSION: profile patch changed since it was read: ${state.target}`);
	await writeFileAtomic(state.target, content, { mode: current.mode });
	return { operation: "update", version: patchVersion(content), before: current.content, after: content };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:883-900](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L883-L900)

全局导入先准入并更新配置。

<details>
<summary>查看原文（18行）</summary>

```text
async function applyManagedImport(ctx, normalized, mode) {
	// 写盘口自己再准入一次（幂等）：不依赖调用方记得做，以后新增的入口也过不去。
	const admitted = admitImportedServers(normalized);
	return withPatchWrite(ctx, async () => {
		const state = await managedState(ctx);
		// 与预览走同一条解析：同名冲突在这里只影响"写哪几条"，不再让整批失败。
		const { importable, conflicts } = resolveManagedImport(ctx, state, admitted);
		const preview = mergePreview(state.servers, importable, conflicts);
		const releasedNames = mode === "replace" ? state.servers.map((server) => server.name) : preview.updated;
		const releasedIds = new Set(releasedNames.map((name) => state.entryIds.get(name)).filter(Boolean));
		await writePatch(state, updateManagedMcpPatch(state.content, importable.servers, { replace: mode === "replace", reservedIds: reservedEntryIds(ctx, releasedIds) }));
		return {
			added: preview.added,
			updated: preview.updated,
			removed: mode === "replace" ? preview.removed : [],
			warnings: preview.warnings,
			note: withSkipped(mode === "replace" ? "已替换当前 profile 管理的 MCP 配置" : "已合并 MCP 配置", [...admitted.skipped, ...conflicts]),
		};
```

</details>

**依据 5 · 源码核查**：[lib/index.js:908-920](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L908-L920)

对齐失败的日志及删除连接滞留边界。

<details>
<summary>查看原文（13行）</summary>

```text
// 项目导入的写盘路径，同样是粘贴 JSON 与来源导入共用。
// 写盘之后、**锁外**对齐连接。两件事必须这样安排：
//   1. reconcile 会 await 整条 teardown（dsh-scope 释放 + mcp-client 子进程关闭），放进写锁里会让
//      「移除一个卡住的 server」把该项目之后的每一次保存都一起卡住；
//   2. 它的失败不该把一个**已经落盘**的写报成失败 —— 写是既成事实，对齐失败只意味着"没立刻生效"。
//      所以吞成日志，不吞事实（面板按真实连接态显示）。
// **注意这里没有"下次挂载会重试"这条兜底**：挂载路径只遍历配置里**现存**的 server，所以
// 「新增/改配置」在下一次会话挂载时确实会被重新对齐，但**被删除**的 server 不在任何后续挂载里，
// 而 reconcile 是唯一会回收"配置里已不存在"的连接的路径 —— 对齐失败时它会留到空闲超时或卸载。
// 这是有意的取舍（写已经成功，不该因为一次 teardown 失败就报错），所以日志要如实说清后果。
async function alignWorkspaceConnections(ctx, wsPath) {
	try { await reconcileWorkspaceConnections(ctx, wsPath); }
	catch (error) { ctx.logger?.error?.(`mcp-manager: 项目 MCP 配置已写入，但对齐连接失败（下次会话挂载会重新对齐现存条目；若本次是删除，该连接要等空闲超时或插件卸载才回收）: ${error?.message ?? error}`); }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:922-948](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L922-L948)

项目写盘后对齐。

<details>
<summary>查看原文（27行）</summary>

```text
async function applyWorkspaceImport(ctx, wsPath, normalized, mode) {
	// 同 applyManagedImport：写盘口自己准入，唯一的写盘路径因此不可能写出重名集合。
	const admitted = admitImportedServers(normalized);
	const result = await withWorkspaceWrite(wsPath, async () => {
		const config = await readWorkspaceConfigCached(ctx, wsPath);
		if (config.error) throw new Error(config.error);
		const preview = workspaceImportPreview(config, admitted);
		let servers;
		if (mode === "replace") {
			servers = admitted.servers.slice();
		} else {
			const byName = new Map(config.servers.map((server) => [server.name, server]));
			for (const server of admitted.servers) byName.set(server.name, server);
			servers = [...byName.values()];
		}
		await writeWorkspaceConfigFile(wsPath, servers, config.exclude);
		return {
			added: preview.added,
			updated: preview.updated,
			removed: preview.removed,
			warnings: preview.warnings,
			note: withSkipped(mode === "replace" ? "已替换项目 MCP 配置" : "已合并项目 MCP 配置", admitted.skipped),
		};
	});
	// 导入同样是写盘：就地对齐存活会话（新增即挂、删除即撤、改动即重载）——但在锁外做。
	await alignWorkspaceConnections(ctx, wsPath);
	return result;
```

</details>

#### 缺口

- 未执行连接对齐与锁竞争实验
  **影响**：无法确认具体宿主的实时状态、错误表现和恢复时间
  **进一步探讨**：在隔离 profile 使用两个非关键服务器，模拟对齐失败并检查文件、日志和连接。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么人可以试用，遇到哪些现象应停止？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 Node >=22.15 和 DSH 相关 peer 依赖，README 要求安装或升级后完全退出再启动，DSH 版本和 Windows 运行是作者声明，并非本次验收。已有多项扩展的用户可先备份 profile 配置及技能目录，在隔离 profile 中只选非关键技能，比较安装前后目录及宿主能否发现，再试项目级 MCP。市场操作依赖网络和对应服务，连接器可能还需凭据；人工需核对来源、权限和恢复路径，金额、耗时与实际收益未知。若旧技能目录消失、宿主找不到已安装内容、作用域与预期不符或删减后任务失败，应停止写入，从备份恢复并回到原生管理；不将面板 success 等同业务成功。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-16](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/package.json#L13-L16)

Node 和包入口。

```text
  "type": "module",
  "main": "lib/index.js",
  "engines": {
    "node": ">=22.15"
```

**依据 2 · 源码核查**：[package.json:49-58](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/package.json#L49-L58)

宿主 peer 依赖声明。

<details>
<summary>查看原文（10行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.2",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.3",
    "@deepseek-ai/dsh-agent": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-agent-loop": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-atomic-write": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-scope": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-tools": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.5-rc.1"
```

</details>

**依据 3 · 作者声明**：[README.md:19-33](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/README.md#L19-L33)

安装及完全重启说明。

<details>
<summary>查看原文（15行）</summary>

````text
## 装上一块面板

```sh
# npm（推荐，免构建授权）
dsh plugin --profile web add dsh-armory

# 从 GitHub
dsh plugin --profile web add github:2026heshao/dsh-armory
```

装完**完全退出 DSH 再启动**。左上角「全局面板」里会多一行「大肥鱼军械库」，点开就是；右下角悬浮按钮和左侧栏底部也能进。桌面端把 `--profile web` 换成 `--profile desktop`。

三个入口可以只留一个，也可以全开。面板右上角「入口」里切，不会出现三个都关掉、自己开不了的局面。

> 不要把 `dsh-armory` 手工插进 profile 的 `cordis.patch.yml`、Agent preset 或额外的 `--patch` 文件。插件命令已经完成这件事，重复装配会明确报错。
````

</details>

**依据 4 · 作者声明**：[README.md:111-115](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/README.md#L111-L115)

升级和兼容性为作者声明。

```text
## 升级与兼容

升级：npm 安装的可以在面板提示条上点「升级」，或执行 `dsh plugin --profile web update dsh-armory`。升级后**完全退出 DSH 再启动**，宿主侧模块只在进程启动时加载一次。卸载：`dsh plugin --profile web remove dsh-armory`，已有的 MCP 条目不会被删除。

兼容：DSH `0.1.5-rc.1` 及以上，已验证到 `0.2.1-rc.2`（DSH 44.7.0）。Windows 实测；Linux 和 macOS 走同一套 DSH Web 契约。
```

**依据 5 · 源码核查**：[lib/wb-market.js:892-907](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/wb-market.js#L892-L907)

替换失败和清理影响恢复。

<details>
<summary>查看原文（16行）</summary>

```text
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
```

</details>

**依据 6 · 源码核查**：[lib/index.js:908-920](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/index.js#L908-L920)

项目连接对齐失败可能残留。

<details>
<summary>查看原文（13行）</summary>

```text
// 项目导入的写盘路径，同样是粘贴 JSON 与来源导入共用。
// 写盘之后、**锁外**对齐连接。两件事必须这样安排：
//   1. reconcile 会 await 整条 teardown（dsh-scope 释放 + mcp-client 子进程关闭），放进写锁里会让
//      「移除一个卡住的 server」把该项目之后的每一次保存都一起卡住；
//   2. 它的失败不该把一个**已经落盘**的写报成失败 —— 写是既成事实，对齐失败只意味着"没立刻生效"。
//      所以吞成日志，不吞事实（面板按真实连接态显示）。
// **注意这里没有"下次挂载会重试"这条兜底**：挂载路径只遍历配置里**现存**的 server，所以
// 「新增/改配置」在下一次会话挂载时确实会被重新对齐，但**被删除**的 server 不在任何后续挂载里，
// 而 reconcile 是唯一会回收"配置里已不存在"的连接的路径 —— 对齐失败时它会留到空闲超时或卸载。
// 这是有意的取舍（写已经成功，不该因为一次 teardown 失败就报错），所以日志要如实说清后果。
async function alignWorkspaceConnections(ctx, wsPath) {
	try { await reconcileWorkspaceConnections(ctx, wsPath); }
	catch (error) { ctx.logger?.error?.(`mcp-manager: 项目 MCP 配置已写入，但对齐连接失败（下次会话挂载会重新对齐现存条目；若本次是删除，该连接要等空闲超时或插件卸载才回收）: ${error?.message ?? error}`); }
```

</details>

#### 缺口

- 现金支出、操作时间与真实宿主兼容尚未测量
  **影响**：不能推断总成本或净收益
  **进一步探讨**：隔离环境记录一次安装、更新失败恢复、宿主发现和对照流程时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可恢复替换和宿主回读是否值得增加复杂度？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出未验证假设：保留旧目录作为备份，在新目录换入并由宿主确认可发现后才提交清理，失败则恢复旧目录；与当前先删旧目录以及用户手工备份相比，潜在增量是把切换和发现之间的失败处理显式化，但需要存储、恢复状态与并发治理。应比较下载中断、替换失败、发现失败和用户自行修改等故障下的数据保留率与人工恢复时间；如果原生备份已足够或状态管理本身引入更高失败率，则不推广。当前没有原型或效果实验，不能把设想计入插件现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wb-market.js:871-907](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/wb-market.js#L871-L907)

现有替换与失败清理是推导基础。

<details>
<summary>查看原文（37行）</summary>

```text
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });
  let doneBytes = 0;
  try {
    for (const [index, file] of listing.files.entries()) {
      const relative = file.path;
      // 路径安全：解析后必须落在 staging 内（拒绝 ../、绝对路径、盘符）。
      const target = resolve(stagingDir, relative);
      if (target !== stagingDir && !target.startsWith(stagingDir + sep)) throw new Error(`清单里的非法路径：${relative}`);
      const params = new URLSearchParams({ namespace, path: relative });
      if (listing.version) params.set("version", listing.version);
      const buffer = await fetchWithLimits(`${SKILLHUB_ORIGIN}/api/v1/skills/${encodeURIComponent(slug)}/file?${params.toString()}`);
      if (file.sha256 && buffer.length) {
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (digest !== file.sha256) throw new Error(`文件校验失败（${relative}）：sha256 不匹配`);
      }
      await mkdir(resolve(stagingDir, relative, ".."), { recursive: true });
      await writeFile(target, buffer);
      doneBytes += buffer.length;
      onProgress?.({ phase: "downloading", index: index + 1, total: listing.files.length, bytes: doneBytes, totalBytes });
    }
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
```

</details>

**依据 2 · 源码核查**：[lib/client.js:12023-12031](https://github.com/2026heshao/dsh-armory/blob/90c6dcaa96985329521903b53dd22b8fa4b8277f/lib/client.js#L12023-L12031)

成功后广播并刷新列表但不证明注册表实际加载。

```text
    try {
      const res = await call('wbSkillInstall', { slug: skill.slug, namespace: skill.namespace, name: skill.name });
      if (!res?.ok) throw new Error(res?.error || t('安装失败'));
      setNote(t('{0}：{1}', [skill.name, res.note || t('已安装')]));
      closeSkillDetail();
      // 磁盘上的 skill 集合已经变了：广播出去，顶部分类计数与（切回时的）Skill 看板
      // 立即按新集合重算，不再等用户离开看板/重挂载。市场自己的列表照旧局部刷新。
      emitSkillChange('market-install');
      await loadInstalled();
```

#### 缺口

- 假设无原型及对照实验
  **影响**：无法证明可减少损失或值得额外复杂度
  **进一步探讨**：以隔离目录对照现有备份方案与候选事务，注入同样故障并测量恢复。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
