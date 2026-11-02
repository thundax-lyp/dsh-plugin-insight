# dsh-skill-mcp-panel

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6481a72](https://github.com/Fishquito7/dsh-skill-mcp-panel/tree/6481a72f216298ef0a26250342c4ea1d54c04f4f)

<!-- BEGIN META -->
[![GitHub ★ 241](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=241&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fishquito7/dsh-skill-mcp-panel) [![npm 30d 5,726](https://img.shields.io/static/v1?label=npm+30d&message=5%2C726&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-mcp-panel) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-mcp-panel)
<!-- END META -->

> **功能**：在 DSH 侧栏与 dsh-panel 命令行管理工作区技能及 profile 的 MCP 服务器配置。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03) 把多作用域技能操作、精确MCP条目编辑与CLI组织在同一管理面，避免仅按同名误改其他工作区。管理便利不能推出配置即生效或服务业务成功。

> **主要限制**：[Q02](#research-q02) 删除撤销只回填SKILL.md，不能恢复脚本/资源；注册表异常时导入仍可能记added。[Q03](#research-q03) 测试连接会求值!!js并启动进程/网络，配置写入、loader协调与业务可用须分别确认。

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
  - [Q01 · 谁管理什么，面板/CLI相对手改增加什么？](#detail-section-11)
  - [Q02 · Skill导入、启停、删除和迁移实际写到哪里？](#detail-section-12)
  - [Q03 · MCP配置、连接测试与CLI如何选择profile？](#detail-section-13)
  - [Q04 · 全周期成本与采用建议是什么？](#detail-section-14)
  - [Q05 · 怎样验证范围回读与迁移结果的改进假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：管理多个工作区Skill和MCP服务器的DSH用户可在侧栏或CLI读写配置，合格结果须文件/作用域正确且宿主实际发现预期能力。

手工编辑Skill目录与cordis.patch是直接替代；本包集中范围化操作和逐项回执，执行/发现/HMR仍继承宿主。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill全文/列表 | 查看多作用域技能 | 发现依赖宿主注册表 |
| Skill启停 | 原地改.disabled后缀 | 指定作用域不回退 |
| 导入与迁移 | 文件/目录/zip添加与批量copy/move | 逐项成功，非整批事务 |
| 删除与正文撤销 | 删除技能并尝试回填正文 | 脚本/资源无法靠撤销恢复 |
| MCP条目管理 | 表单/原文编辑及启停删除 | patch已写与reconciled分开 |
| MCP测试连接 | 临时连接并列工具 | 可执行!!js、进程或网络 |
| dsh-panel CLI | 命令行管理同类资源 | MCP需显式已有profile |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH0.2.x及Typert/skills/loader | 必需 | UI与远程管理、发现及HMR | 声明不等于运行验收 |
| 文件与profile写权限 | 变更必需 | rename、导入、删除和patch写 | 异常需回读实际状态 |
| 完整独立备份 | 恢复真实技能必需 | 保留脚本/资源和patch | 正文撤销不能代替 |
| 可信MCP命令/地址/表达式 | 测试前必需 | 可在宿主执行/联网 | 不信任配置不直接测试 |
| 明确CLI入口和profile | CLI MCP必需 | 全局shim与已有profile选取 | Skill不是profile隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份完整Skill/patch，选临时作用域 | 不以撤销按钮替备份 |
| 读取 | 面板/CLI核对名称、作用域及入口 | 同名项定位明确 |
| 变更 | 导入/启停/MCP保存 | 逐项查added/skipped、reconciled和实际发现 |
| 测试 | 仅信任配置做临时MCP连接 | 列工具不等于业务成功 |
| 恢复 | 停写后按独立备份还原 | 重新发现并核对资源完整 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包/备份/宿主资源未知 | 重启、范围与入口核对 | 时长未知 |
| 持续 | MCP进程/HTTP初始化资源未知 | 服务凭据、分组和多作用域维护 | 无节时对照 |
| 失败恢复 | 文件/服务重载资源未知 | 逐项回读、恢复完整目录与patch | 删除资源不可由正文撤销恢复 |
| 退出 | 面板和全局shim处理 | 继续手工配置并核对宿主 | 禁用面板不回滚既有配置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 范围化管理 | 指定作用域不回退、MCP精确行 | 实际误改率/总耗时 |
| 导入发现 | 暂存/逐项回执与轮询 | 注册表异常不能确认生效 |
| 删除撤销 | 回填正文 | 不支持恢复整目录资源 |
| MCP连接 | SDK列工具与close | 业务调用及外部副作用 |

> **思考**：[Q02](#research-q02) 删除撤销只回填SKILL.md，不能恢复脚本/资源；注册表异常时导入仍可能记added。[Q03](#research-q03) 测试连接会求值!!js并启动进程/网络，配置写入、loader协调与业务可用须分别确认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03) 把多作用域技能操作、精确MCP条目编辑与CLI组织在同一管理面，避免仅按同名误改其他工作区。管理便利不能推出配置即生效或服务业务成功。

[Q02](#research-q02)、[Q03](#research-q03) 作用域不回退、暂存逐项落位、精确条目与reconciled值得借鉴。锁只协调遵守约定的写者，Windows rm+rename有间隙；不能把局部原子写和正文撤销称全量事务恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 删除撤销只回填SKILL.md，不能恢复脚本/资源；注册表异常时导入仍可能记added。[Q03](#research-q03) 测试连接会求值!!js并启动进程/网络，配置写入、loader协调与业务可用须分别确认。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可在完整备份和临时作用域中试用管理便利，先只读再导入可丢弃Skill；测试MCP前核对命令/地址/表达式。文件已改但发现或协调未知、误作用域或资源恢复失败时停写，按独立备份回原路径并核对宿主。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持管理接线与范围定位，也支持撤销/发现/测试副作用的具体边界；未运行宿主或目标代码。状态与恢复改进是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/skill-files.ts、src/client.ts、src/mcp/gateway.ts、src/mcp/probe.ts、src/patch-editor.ts、src/profiles.ts、src/global-shim.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定服务、Skill文件约定、前端撤销、MCP保存/探针、patch锁、profile与shim代表链路；未全量审计zip/path、OAuth和宿主RPC鉴权，不执行目标。
- 下一步：按 [Q05](#research-q05) 在隔离目录对注册表异常、重复名、部分导入和带资源撤销比较错误成功判断、恢复时间与新增操作。

**分析版本**

- **仓库**：[Fishquito7/dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel)
- **版本号**：2.3.6（[固定提交 6481a72](https://github.com/Fishquito7/dsh-skill-mcp-panel/tree/6481a72f216298ef0a26250342c4ea1d54c04f4f)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是把落盘/发现/协调分层，异常发现保留未知，并提供完整目录恢复依据；已有added/skipped及reconciled不能被忽略，对照误判与恢复投入无改善就不增加操作负担。

按 [Q05](#research-q05) 在隔离目录对注册表异常、重复名、部分导入和带资源撤销比较错误成功判断、恢复时间与新增操作。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1144 | — | — | 24321 |
| .md | example | 1 | 39 | — | — | 228 |
| .js | source | 24 | 11754 | 10216 | 1557 | — |
| .mjs | source | 1 | 15 | 11 | 3 | — |
| .ts | source | 24 | 11950 | 9782 | 1608 | — |
| .mjs | test | 26 | 5680 | 4827 | 489 | — |
| .md | test | 1 | 22 | — | — | 250 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/Fishquito7/dsh-skill-mcp-panel/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：集中管理是否减少配置摩擦，写盘、删除恢复与服务启动的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁管理什么，面板/CLI相对手改增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向管理多个工作区Skill和profile MCP配置的DSH用户，把列表、全文、启停、导入、迁移与服务器编辑放到侧栏页面，并提供dsh-panel CLI。合格结果是目标作用域的文件或目标profile配置正确变化，宿主实际发现预期能力，其他作用域保持原意；不能只以面板显示保存成功验收。

对照手工改SKILL.md和cordis.patch，本包的具体便利是范围化列表、同名项按作用域定位、表单与原文编辑、批量逐项结果，以及CLI/Web共享文件约定。技能发现、MCP加载和热重载仍主要依赖宿主服务，不应算新执行引擎。README的“改完即生效”是作者目标，源码存在未确认状态，需按Q02/Q03收窄。没有用户操作时间与错误率对照，不承诺减少总负担。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-27](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/README.md#L19-L27)

作者说明管理范围和CLI/profile区别。

```text
DSH 插件：把**技能**与 **MCP 服务器**的管理搬进 DSH Web 的主页侧边栏——点左栏的「Skill / MCP」，中央主区直接切到整页面板（不是弹窗，也不是设置页里的 tab），改完即生效。随包附带统一终端命令 `dsh-panel`：面板能做的事命令行都能做，另外多一个跨 profile 升级。

- 🗂️ **技能管理** —— 列表预览、搜索、工作区分栏与分组筛选、卡片展开查看全文、热启停 / 删除，支持 `.md` / `.zip` / 技能文件夹的添加与批量迁移
- 🔌 **MCP 服务器管理** —— 接管 profile `cordis.patch.yml` 里的每一条 MCP 服务器（表单 + 原文），Stdio / HTTP 两种调用方式，支持测试连接，保存后由 DSH HMR 热加载
- 🧩 **整页面板** —— 与宿主内置「插件」页同一套槽位机制，点左栏即在中央主区切页，页面左上角另有「← 返回会话」
- ⌨️ **`dsh-panel` 命令行** —— `dsh-panel skill …` 与 `dsh-panel mcp …` 覆盖两个面板的全部能力
- 📦 **装上就能用** —— npm 与 Release tarball 安装的都是预构建产物

> **profile 提示**：`mcp` 子命令**必须**显式写 `--profile <name>`，且名字必须已存在——打错会被拒绝，不会新建 profile。`skill` 不按 profile 分家（技能按用户根 / 工作区存放），不需要该参数。不带 `--profile` 的 `dsh-panel update` 升级全部已安装本插件的 profile（`desktop` 由桌面应用独占，自动跳过）。
```

**依据 2 · 源码核查**：[src/index.ts:1062-1073](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L1062-L1073)

宿主实际注册Skill与MCP服务并安装shim。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx: any) {
  ensureGlobalShim(ctx.logger);
  new SkillsViewerGateway(ctx);
  // 单工具禁用（Issue #44）：控制器按 agent 作用域施加限制，网关只负责读写配置。
  // 配置要异步读盘，所以先给网关一个转接器，控制器就位后它自动开始回话。
  const filterRef: { current: ToolFilterController | undefined } = { current: undefined };
  const toolFilterAdapter = {
    denyOf: () => filterRef.current?.deny,
    setDeny: (deny: string[]) => filterRef.current?.setDeny(deny),
    activeCount: () => filterRef.current?.activeCount() ?? 0
  };
  new McpManagerGateway(ctx, toolFilterAdapter);
```

</details>

**依据 3 · 源码核查**：[src/index.ts:748-769](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L748-L769)

指定作用域不回退其他工作区，支持具体管理增量。

<details>
<summary>查看原文（22行）</summary>

```text
  async setEnabled(name, sessionId, enabled, scope) {
    const scoped = typeof scope === "string" && scope !== "";
    if (scoped) {
      const entry = await this.entryInScope(name, scope);
      if (entry !== undefined) return this.setEntryEnabled(name, entry, enabled);
      // 工作区作用域下只有文件条目，找不到就是不存在；global 允许落到下面的
      // 在线技能分支（插件贡献等非文件技能仍以注册表路径为准）。
      if (scope !== "global") throw new Error('技能 "' + name + '" 在指定作用域中不存在');
    }
    const located = await this.locate(name, sessionId);
    if (located.kind === "missing") throw new Error('技能 "' + name + '" 不存在');
    if (located.kind === "live") {
      const skill = located.skill;
      this.assertEditable(skill);
      if (enabled) return { name, enabled: true };
      const target = skill.path + DISABLED_SUFFIX;
      if (await pathExists(target)) throw new Error("目标文件已存在：" + target);
      await rename(skill.path, target);
      return { name, enabled: false };
    }
    if (scoped) throw new Error('技能 "' + name + '" 在指定作用域中不存在');
    return this.setEntryEnabled(name, located.entry, enabled);
```

</details>

#### 缺口

- 无管理任务的端到端耗时和误改率对照
  **影响**：不能证明相对手工编辑的净收益
  **进一步探讨**：在临时工作区比较导入、启停、同名技能定位和MCP配置，计入回读与恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Skill导入、启停、删除和迁移实际写到哪里？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

文件Skill的启停是SKILL.md或单文件原地加/去.disabled后缀，并检查目标不存在；指定工作区找不到即报错，不回退同名全局副本。删除则是rm，目录束会递归删除整个技能目录。前端所谓撤销只快照正文，通过addSkill重新添加SKILL.md；源码注释及实际files数组明确不能恢复脚本和资源，不能把“删除可撤销”理解成完整目录恢复。

导入先分类/校验，单技能写暂存目录后rename就位，逐条失败记skipped，已成功项保留；随后轮询注册表，未发现项删除回滚。但waitForDiscovery捕获注册表异常时返回空missing集合，调用方会把已写项记为added。故added在这条异常路径不等于已经核实宿主发现，这个条件可由源码直接确认，不是本次运行复现。

批量迁移显式只允许move一个目标，copy可多目标，逐项返回结果，不是整批事务。以上范围定位与逐项结果值得借鉴，但原件备份、资源恢复和最终发现状态仍由用户核对；本次没有把路径扫描与zip处理全量审计为安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:734-769](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L734-L769)

启停rename及工作区不回退。

<details>
<summary>查看原文（36行）</summary>

```text
  /** 文件条目的原地启停改名。 */
  async setEntryEnabled(name, entry, enabled) {
    if (enabled === entry.enabled) return { name, enabled };
    const target = enabled ? entry.file.slice(0, -DISABLED_SUFFIX.length) : entry.file + DISABLED_SUFFIX;
    if (await pathExists(target)) throw new Error("目标文件已存在：" + target);
    await rename(entry.file, target);
    return { name, enabled };
  }

  /**
   * 热启用/停用：把技能文件原地改名 *.disabled（或改回）。
   * 指定作用域时只操作该作用域里的那一份（同名技能可能存在于多个作用域），
   * 找不到即报错——绝不回退去操作别的作用域的副本。
   */
  async setEnabled(name, sessionId, enabled, scope) {
    const scoped = typeof scope === "string" && scope !== "";
    if (scoped) {
      const entry = await this.entryInScope(name, scope);
      if (entry !== undefined) return this.setEntryEnabled(name, entry, enabled);
      // 工作区作用域下只有文件条目，找不到就是不存在；global 允许落到下面的
      // 在线技能分支（插件贡献等非文件技能仍以注册表路径为准）。
      if (scope !== "global") throw new Error('技能 "' + name + '" 在指定作用域中不存在');
    }
    const located = await this.locate(name, sessionId);
    if (located.kind === "missing") throw new Error('技能 "' + name + '" 不存在');
    if (located.kind === "live") {
      const skill = located.skill;
      this.assertEditable(skill);
      if (enabled) return { name, enabled: true };
      const target = skill.path + DISABLED_SUFFIX;
      if (await pathExists(target)) throw new Error("目标文件已存在：" + target);
      await rename(skill.path, target);
      return { name, enabled: false };
    }
    if (scoped) throw new Error('技能 "' + name + '" 在指定作用域中不存在');
    return this.setEntryEnabled(name, located.entry, enabled);
```

</details>

**依据 2 · 源码核查**：[src/index.ts:772-803](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L772-L803)

删除实际递归rm，不是回收站。

<details>
<summary>查看原文（32行）</summary>

```text
  /** 删除一个文件条目（目录束连目录一起删）。 */
  async removeEntry(entry) {
    if (entry.dirBundle) await rm(dirname(entry.file), { recursive: true, force: true });
    else await rm(entry.file, { force: true });
  }

  /**
   * 永久删除技能。指定作用域时只删除该作用域里的那一份（同名技能可能存在于
   * 多个作用域），找不到即报错——绝不回退去删除别的作用域的副本。
   */
  async deleteSkill(name, sessionId, scope) {
    const scoped = typeof scope === "string" && scope !== "";
    if (scoped) {
      const entry = await this.entryInScope(name, scope);
      if (entry !== undefined) {
        await this.removeEntry(entry);
        return { name };
      }
      if (scope !== "global") throw new Error('技能 "' + name + '" 在指定作用域中不存在');
    }
    const located = await this.locate(name, sessionId);
    if (located.kind === "missing") throw new Error('技能 "' + name + '" 不存在');
    if (located.kind === "live") {
      const skill = located.skill;
      this.assertEditable(skill);
      if (basename(skill.path) === "SKILL.md") await rm(dirname(skill.path), { recursive: true, force: true });
      else await rm(skill.path, { force: true });
      return { name };
    }
    if (scoped) throw new Error('技能 "' + name + '" 在指定作用域中不存在');
    await this.removeEntry(located.entry);
    return { name };
```

</details>

**依据 3 · 源码核查**：[src/client.ts:1719-1744](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/client.ts#L1719-L1744)

撤销只回填正文，资源脚本不会恢复。

<details>
<summary>查看原文（26行）</summary>

```text
			// ── 删除：乐观删除 + Toast「撤销」，不再二次确认（v2.1.6）─────────
			// 为什么撤销是「尽力还原」而不是「原样恢复」：
			//   宿主只给了 deleteSkill / addSkill 两条 RPC，没有「读原始技能目录里的任意
			//   文件」的能力——content 只回 SKILL.md 正文。所以撤销走 addSkill 把删除前
			//   抓到的正文按原来的 rel 路径回填：单文件技能与「只有一个 SKILL.md 的技能
			//   目录」能完整回来，带脚本/资源的技能目录只能拿回 SKILL.md。
			//   正文也抓不到（技能在删除前的 content 调用就失败）时不做假承诺，
			//   Toast 的撤销按钮会明确回报「还原失败，请重新添加」。
			const sameKeySelected = (rows, key) => rows.filter((s) => opKeyOf(s) !== key);
			const undoDelete = (snapshot) => {
				if (snapshot.content === null) {
					showToast(t("toastUndoFailed"));
					return;
				}
				const files = [{ path: snapshot.rel === "" ? snapshot.name + "/SKILL.md" : snapshot.rel, base64: utf8ToBase64(snapshot.content) }];
				Promise.resolve().then(() => addSkill({ kind: "auto", files: files, workspace: snapshot.scope === "global" ? null : snapshot.scope })).then((result) => {
					const added = result !== null && typeof result === "object" && Array.isArray(result.added) ? result.added : [];
					if (added.length === 0) {
						showToast(t("toastUndoFailed"));
						return;
					}
					showToast(t("toastUndoDone").replace("{name}", snapshot.name));
					reloadAfterHot();
				}, () => {
					showToast(t("toastUndoFailed"));
				});
```

</details>

**依据 4 · 源码核查**：[src/index.ts:998-1036](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L998-L1036)

暂存落位、逐项失败和注册表缺项回滚。

<details>
<summary>查看原文（39行）</summary>

```text
    // ── 落盘：每个技能在自己的暂存目录里写好再改名就位；逐条成功/失败 ─────
    const stagingBase = join(targetRoot, ".dsh-skill-staging-" + process.pid + "-" + Math.random().toString(36).slice(2, 8));
    const written: any[] = [];
    for (let index = 0; index < accepted.length; index++) {
      const skill = accepted[index];
      const staging = join(stagingBase, String(index));
      try {
        for (const write of skill.writes) {
          const filePath = join(staging, write.relative);
          await mkdir(dirname(filePath), { recursive: true });
          await writeFile(filePath, write.relative.toLowerCase().endsWith(".md") ? normalizeSkillText(write.data) : write.data);
        }
        if (skill.kind === "bundle") {
          await rename(staging, skill.target);
        } else {
          await rename(join(staging, skill.writes[0].relative), skill.target);
          await rm(staging, { recursive: true, force: true }).catch(() => {});
        }
        written.push({ name: skill.name, kind: skill.kind, target: skill.target });
      } catch (error) {
        await rm(staging, { recursive: true, force: true }).catch(() => {});
        skipped.push({ name: skill.name, reason: "写入失败（已回滚该技能）：" + (error instanceof Error ? error.message : String(error)) });
      }
    }
    await rm(stagingBase, { recursive: true, force: true }).catch(() => {});

    // ── DSH 做最终裁判：未被注册表接收的单独回滚，其余保留 ────────────────
    const missing = await this.waitForDiscovery(written.map((item) => item.name), sessionId, targetProject ?? cwd);
    const added: any[] = [];
    for (const item of written) {
      if (missing.has(item.name)) {
        await rm(item.target, { recursive: true, force: true }).catch(() => {});
        skipped.push({ name: item.name, reason: "DSH 未接受（frontmatter 校验未通过或不可发现），已回滚" });
        continue;
      }
      added.push({ name: item.name, kind: item.kind });
    }
    if (added.length === 0) throw new Error("没有技能被 DSH 接受，已全部回滚：" + describeSkips(skipped));
    return { added, skipped, warnings, scope: targetProject === undefined ? { kind: "global" } : await this.scopeForTarget(targetRoot, targetProject) };
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1040-1058](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L1040-L1058)

注册表异常视为已接收，是added语义边界。

<details>
<summary>查看原文（19行）</summary>

```text
   * 轮询注册表直到这批技能全部出现；返回**未被发现的名字集合**。
   * 注册表不可用时不阻塞：返回空集合（视为已接收）。
   */
  async waitForDiscovery(names, sessionId, probeCwd) {
    const { registry, scope } = this.viewFor(sessionId);
    const pending = new Set(names);
    for (let attempt = 0; attempt < 12; attempt++) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
      try {
        for (const name of [...pending]) {
          if ((await registry.get(name, { cwd: probeCwd, scope })) !== undefined) pending.delete(name);
        }
        if (pending.size === 0) return pending;
      } catch {
        // 注册表不可用：视为已接收（没有可核对的依据）
        return new Set();
      }
    }
    return pending;
```

</details>

**依据 6 · 源码核查**：[src/index.ts:837-868](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L837-L868)

迁移按目标/条目独立结果，move限制。

<details>
<summary>查看原文（32行）</summary>

```text
  /** 把一批技能迁移到一个或多个目标工作区；逐条返回结果。 */
  async batchMigrate(sessionId, payload) {
    this.invalidateWorkspaces();
    const { from: rawFrom, targets: rawTargets, mode, names } = payload;
    if (mode === "move" && rawTargets.length > 1) throw new Error("移动模式只能选择一个目标工作区（多个目标请改用复制）");
    const { dshHome, agentsHome } = this.homes();
    const fromProject = rawFrom === null || rawFrom === undefined ? null : await normalizeWorkspace(rawFrom);
    const fromRoots = fromProject === null
      ? [{ path: join(dshHome, "skills"), source: "user-dsh" }, { path: join(agentsHome, "skills"), source: "user-agents" }]
      : [{ path: workspaceSkillRoot(fromProject), source: "project-dsh", projectRoot: fromProject }];

    const byName = new Map();
    for (const entry of await collectSkillEntries(fromRoots)) if (!byName.has(entry.name)) byName.set(entry.name, entry);
    const chosen: any[] = [];
    const results: any[] = [];
    for (const name of names) {
      const entry = byName.get(name);
      if (entry === undefined) results.push({ name, ok: false, error: '技能 "' + name + '" 不在源工作区中' });
      else chosen.push(entry);
    }
    for (const rawTarget of rawTargets) {
      const targetProject = rawTarget === null || rawTarget === undefined ? null : await normalizeWorkspace(rawTarget);
      const targetRoot = scopeRootOf(targetProject, dshHome);
      if (fromRoots.some((root) => resolvePath(root.path) === resolvePath(targetRoot))) {
        for (const entry of chosen) results.push({ name: entry.name, target: rawTarget ?? null, ok: false, error: "目标工作区与源工作区相同" });
        continue;
      }
      for (const item of await batchMigrateEntries(chosen, targetRoot, mode)) {
        results.push({ name: item.name, target: rawTarget ?? null, ok: item.ok, ...(item.error === undefined ? {} : { error: item.error }) });
      }
    }
    return { results };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · MCP配置、连接测试与CLI如何选择profile？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

MCP服务按serverName与可选entryId定位行；同名多条且无精确身份时拒绝。保存写patch后尝试与loader状态协调，并返回reconciled；删除也等待loader条目消失并单独返回协调结果。因此文件已写、loader同步与外部服务器可用是不同状态，不能只看ok。patch编辑有.panel.lock和同目录临时文件；Windows覆盖失败时先rm再rename，不应描述成所有平台绝对原子且永不丢原件。锁30秒判旧，不能证明与不遵守此锁的其他编辑者完全互斥。

“测试连接”不是无副作用的静态校验。它可执行配置中的!!js表达式，Stdio启动指定进程或HTTP连接指定地址，再分页列工具；结束close，不写patch也不注册DSH工具。只读工具发现仍可能触发服务启动和初始化，不能对不信任配置直接测试。成功列出工具不证明实际业务调用成功。

CLI requireProfile验证已有package.json与合法名，避免拼错自动新建；Skill按用户/工作区，不按profile隔离。宿主启动会写全局shim，实际入口与最后启动profile有关，维护者需核对CLI入口和目标profile。宿主版本/API、权限与服务端行为未运行验证，RPC鉴权继承链未做完整审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp/gateway.ts:231-282](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/mcp/gateway.ts#L231-L282)

精确行定位、保存和删除后的reconciled。

<details>
<summary>查看原文（52行）</summary>

```text
  async save(rawPayload: unknown) {
    const payload = parseWirePayload(mcpSavePayloadSchema, rawPayload, "MCP 配置无效");
    const input = payload.input;
    const { managed, all } = await this.readRows();
    let previous: PatchRow | undefined;
    if (payload.previousServerName !== undefined || payload.previousEntryId !== undefined) {
      previous = this.resolveRow(all, { serverName: payload.previousServerName, entryId: payload.previousEntryId });
    } else {
      const same = all.filter((row) => this.serverNameOf(row) === input.serverName);
      if (same.length > 1) {
        throw new Error('serverName "' + input.serverName + '" 对应多条 MCP 行，可编辑的卡片带 entryId，请从卡片进入');
      }
      previous = same[0];
    }
    const previousName = previous !== undefined ? this.serverNameOf(previous) : undefined;
    for (const row of all) {
      if (row === previous) continue;
      if (this.serverNameOf(row) !== input.serverName) continue;
      // 编辑且没改名：文件里可能本来就有重名，允许保存（用 entryId 精确定位那一条）。
      if (previous !== undefined && previousName === input.serverName) continue;
      throw new Error('serverName "' + input.serverName + '" 已存在（' + String(row.id ?? "未命名行") + "）");
    }
    // !!js disabled 不是「未禁用」。卡片按停用展示，也不要等 loader 给出某个布尔值。
    const enabled = previous !== undefined ? rowEnabled(previous) : payload.enabled;
    const nextRow = applyServerEdit(previous, input, enabled);
    const shownEnabled = rowEnabled(nextRow);
    if (previous === undefined) {
      if (all.some((row) => row.id === nextRow.id)) throw new Error('id "' + String(nextRow.id) + '" 已存在');
      const nextRows = [...managed, nextRow];
      nextRows.sort((a, b) => String(a.config?.serverName ?? "").localeCompare(String(b.config?.serverName ?? "")));
      await writeManagedRows(this.patchPath(), nextRows);
    } else {
      await replaceMcpEntryWithRow(this.patchPath(), this.locatorOf(previous), nextRow);
    }

    const reconciled = await reconcileToggle(this.C, nextRow.id, nextRow.disabled);

    const entry = typeof nextRow.id === "string" ? getLoaderEntry(this.C, nextRow.id) : undefined;
    const server = this.decorate(nextRow, true, entry, shownEnabled);
    if (server === undefined) throw new Error("写入成功但生成的 MCP 行无效");
    return { server, reconciled };
  }

  async removeServer(rawPayload: unknown) {
    const payload = parseWirePayload(mcpRemovePayloadSchema, rawPayload, "删除参数无效");
    const { all } = await this.readRows();
    const row = this.resolveRow(all, { serverName: payload.serverName, entryId: payload.entryId });
    await removeMcpEntry(this.patchPath(), this.locatorOf(row));
    const reconciled = typeof row.id === "string"
      ? await waitForLoaderState(this.C, row.id, (entry) => entry === undefined)
      : false;
    return { ok: true, reconciled };
```

</details>

**依据 2 · 源码核查**：[src/patch-editor.ts:331-376](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/patch-editor.ts#L331-L376)

临时写、Windows删除覆盖及30秒陈旧锁规则。

<details>
<summary>查看原文（46行）</summary>

```text
/** 同目录临时文件 + rename 原子写；Windows 上 rename 覆盖失败时退化为 rm+rename。 */
export async function writeFileAtomic(path: string, content: string): Promise<void> {
  const temp = join(dirname(path), ".dsh-panel-tmp-" + process.pid + "-" + Math.random().toString(36).slice(2, 8));
  try {
    await writeFile(temp, content, "utf8");
    try {
      await rename(temp, path);
    } catch (error) {
      if (error === null || typeof error !== "object" || !["EPERM", "EEXIST", "EACCES"].includes((error as NodeJS.ErrnoException).code ?? "")) throw error;
      await rm(path, { force: true });
      await rename(temp, path);
    }
  } finally {
    await rm(temp, { force: true }).catch(() => {});
  }
}

/**
 * 以 `<path>.panel.lock` 为锁执行 fn。锁文件记录 pid + 时间；超过 30 秒视为
 * 陈旧锁自动清理。获取超时 5 秒。
 */
export async function withPatchLock<T>(path: string, fn: () => Promise<T> | T): Promise<T> {
  const lockPath = path + ".panel.lock";
  const started = Date.now();
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  while (handle === undefined) {
    try {
      handle = await open(lockPath, "wx");
    } catch (error) {
      if (error === null || typeof error !== "object" || (error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      try {
        const info = await stat(lockPath);
        if (Date.now() - info.mtimeMs > 30000) await rm(lockPath, { force: true }).catch(() => {});
      } catch {
        // 锁在检查间隙被释放：继续重试。
      }
      if (Date.now() - started > 5000) throw new Error("等待 cordis.patch.yml 写锁超时（可能有其他 dsh-panel 进程正在写入）");
      await delay(50);
    }
  }
  try {
    await handle.writeFile(process.pid + "\n" + Date.now() + "\n", "utf8");
    return await fn();
  } finally {
    await handle.close().catch(() => {});
    await rm(lockPath, { force: true }).catch(() => {});
```

</details>

**依据 3 · 源码核查**：[src/mcp/probe.ts:27-48](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/mcp/probe.ts#L27-L48)

测试表达式在当前进程求值。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * 求值 !!js 表达式：与宿主 cordis 配置层的语义一致（with (ctx) { return eval(expr) }），
 * 区别只是测试连接跑在本进程、没有 loader 上下文。ctx 传空对象，表达式能拿到的
 * 全部来自全局（process.env 等）。
 */
function evaluateJsExpr(expression: string): unknown {
  return new Function("ctx", "expr", "with (ctx) { return eval(expr) }")({}, expression);
}

/** 把单个配置值解析成真正的字符串：!!js 表达式在这里求值，失败给出可读原因。 */
function resolveScalar(value: WireScalar | null | undefined, label: string): string | undefined {
	if (isJsExprValue(value)) {
		let resolved: unknown;
		try {
			resolved = evaluateJsExpr(value.__jsExpr);
		} catch (error) {
			throw new Error(label + " 的 !!js 表达式求值失败：" + (error instanceof Error ? error.message : String(error)));
		}
		if (resolved === undefined || resolved === null) return undefined;
		return typeof resolved === "string" ? resolved : String(resolved);
	}
	return typeof value === "string" ? value : "";
```

</details>

**依据 4 · 源码核查**：[src/mcp/probe.ts:70-120](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/mcp/probe.ts#L70-L120)

启动Stdio/HTTP、列工具与close，不等业务验证。

<details>
<summary>查看原文（51行）</summary>

```text
function createTransport(input: McpServerInput) {
  if (input.transport === "stdio") {
    return new StdioClientTransport({
      command: resolveRequired(input.command, "命令"),
      args: input.args.map((item) => resolveRequired(item, "参数")),
      env: {
        ...scrubbedParentEnv(),
        ...stringMap(input.env, "环境变量")
      },
      cwd: input.cwd === "" || input.cwd === undefined ? undefined : resolveRequired(input.cwd, "工作目录")
    });
  }
  return new StreamableHTTPClientTransport(new URL(resolveRequired(input.url, "服务器地址")), {
    requestInit: { headers: stringMap(input.headers, "请求头") }
  });
}

export async function probeMcpServer(raw: unknown, timeoutMs = PROBE_TIMEOUT_MS): Promise<McpProbeResult> {
  let input: McpServerInput;
  try {
    input = mcpServerInputSchema.parse(raw);
  } catch (error) {
    return { ok: false, tools: [], error: "配置无效：" + (error instanceof Error ? error.message : String(error)) };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const client = new Client({ name: "dsh-skill-mcp-panel", version: "2.0.0" });
  let transport: StdioClientTransport | StreamableHTTPClientTransport | undefined;
  try {
    transport = createTransport(input);
    await raceWithAbort(client.connect(transport), controller.signal);
    const tools: McpProbeTool[] = [];
    let cursor: string | undefined;
    do {
      const page = await client.listTools(cursor === undefined ? undefined : { cursor }, { signal: controller.signal });
      for (const tool of page.tools) {
        tools.push({
          name: typeof tool.name === "string" ? tool.name : String(tool.name),
          ...(typeof tool.description === "string" ? { description: tool.description } : {})
        });
      }
      cursor = page.nextCursor;
    } while (cursor !== undefined && cursor !== "");
    return { ok: true, tools };
  } catch (error) {
    const reason = controller.signal.aborted ? "连接测试超时（" + timeoutMs + "ms）" : error instanceof Error ? error.message : String(error);
    return { ok: false, tools: [], error: reason };
  } finally {
    clearTimeout(timer);
    await Promise.allSettled([client.close().catch(() => {}), transport?.close().catch(() => {})]);
```

</details>

**依据 5 · 源码核查**：[src/profiles.ts:114-137](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/profiles.ts#L114-L137)

CLI现有profile校验。

<details>
<summary>查看原文（24行）</summary>

```text
/** 读一个 profile；不存在或名字非法返回 undefined。 */
export function readProfile(name: string, home?: string): ProfileInfo | undefined {
  if (!isValidProfileName(name)) return undefined;
  if (!existsSync(join(profilesRoot(home), name, "package.json"))) return undefined;
  return profileInfo(name, home);
}

/** 可读的有效 profile 清单，用于报错信息。 */
export function knownProfileList(home?: string): string {
  const known = profileNames(home);
  return known.length === 0 ? "（$DSH_HOME/profiles 下还没有任何 profile）" : known.join("、");
}

/**
 * 取一个必须存在的 profile；不存在就抛 ProfileError。
 * 调用方必须在派发 pnpm / dsh plugin 之前调用它——否则 dsh 会新建 profile。
 */
export function requireProfile(name: string, home?: string): ProfileInfo {
  if (!isValidProfileName(name)) {
    throw new ProfileError('非法的 profile 名 "' + name + '"（不能为空、不能含路径分隔符）。有效：' + knownProfileList(home));
  }
  const found = readProfile(name, home);
  if (found !== undefined) return found;
  throw new ProfileError('profile "' + name + '" 不存在（有效：' + knownProfileList(home) + '）。本命令只操作已存在的 profile，绝不新建——要新建请用 dsh --from-default-profile <模板>。');
```

</details>

**依据 6 · 源码核查**：[src/global-shim.ts:1-10](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/global-shim.ts#L1-L10)

全局shim自动写入的副作用。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-skill-mcp-panel —— 全局命令 shim 安装。
 *
 * profile 安装只会在 <profile>/node_modules/.bin 生成 dsh-panel，该目录不在
 * 用户 PATH 中。宿主启动时把 shim 写入 npm 全局 bin 目录，使用户能在
 * PowerShell / CMD / bash 中直接调用 `dsh-panel`。
 *
 * Windows 上必须写**三种**：.cmd（CMD）、.ps1（PowerShell）、以及无扩展名的
 * sh 脚本（Git Bash / MSYS2 / Cygwin）。bash 不认 .cmd，只按无扩展名查找，
 * 少一个就是 `dsh-panel: command not found`。
```

</details>

**依据 7 · 作者声明**：[README.md:137-151](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/README.md#L137-L151)

作者解释最后profile入口及Skill/profile语义。

<details>
<summary>查看原文（15行）</summary>

````text
> **全局 shim**：宿主启动时会在 npm 全局 bin 目录写入 `dsh-panel`。Windows 下写三份——`dsh-panel.cmd`（CMD）、`dsh-panel.ps1`（PowerShell）、以及**无扩展名**的 `dsh-panel` sh 脚本（Git Bash / MSYS2 / Cygwin 靠它，v2.1.5 之前缺这一份，bash 里会报 `command not found`）；macOS / Linux 写一份可执行的 `dsh-panel`。三份都指向「最后启动的那个 profile」装的插件副本。

`mcp` 子命令**必须**用 `--profile <name>` 指定目标 profile，名字必须已存在（判据是
`$DSH_HOME/profiles/<name>/package.json`）。打错名字会以退出码 2 被拒绝，**不会**像 `dsh plugin`
那样顺手新建一个 profile。`skill` 子命令**不需要** `--profile`——技能按用户根 / 工作区存放，不按
profile 分家。`dsh-panel update` 不带 `--profile` 时升级全部已安装本插件的 profile。

### profile 概览

```bash
dsh-panel profiles        # 每个 profile 的已装版本 / bundles 挂载情况 / 安装 spec
```

输出的第一行是**当前 dsh-panel 入口**的路径与版本。这条信息是必要的：`dsh-panel` 是全局单例 shim，
由最后启动的那个 profile 写入（`src/global-shim.ts`），因此它与表中任何一行都没有必然关系。
````

</details>

#### 缺口

- 宿主RPC权限继承、实际热重载和外部服务器行为未运行核验
  **影响**：不能承诺远程管理权限隔离或配置即生效
  **进一步探讨**：先在受控本地profile核对宿主RPC边界、reconciled和工具实际可用，再扩大管理范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 全周期成本与采用建议是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可以备份完整技能目录与patch，在临时工作区/profile试用非敏感配置管理。先只列和读，确认作用域与CLI入口，再导入一个可丢弃Skill并回读注册表；MCP只对自己信任的命令/地址测试，保存后核对reconciled和实际能力。不要用删除按钮试验带资源的真实技能，即使有撤销也须完整备份。

首次投入是安装重启、宿主版本和范围核对；持续投入是多作用域配置维护、服务凭据与实际连接测试；失败恢复需看逐项skipped、文件/注册表和loader状态，不按整批回滚理解。现金、耗时、外部MCP初始化资源均未知，工具数不代表任务收益。若作用域意外、文件已改却发现/协调未知、删除资源无法恢复，应停止写操作，从独立备份回原路径并由宿主重新发现，必要时停用面板继续手工管理。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:998-1058](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L998-L1058)

逐项落盘与发现未知状态决定恢复步骤。

<details>
<summary>查看原文（61行）</summary>

```text
    // ── 落盘：每个技能在自己的暂存目录里写好再改名就位；逐条成功/失败 ─────
    const stagingBase = join(targetRoot, ".dsh-skill-staging-" + process.pid + "-" + Math.random().toString(36).slice(2, 8));
    const written: any[] = [];
    for (let index = 0; index < accepted.length; index++) {
      const skill = accepted[index];
      const staging = join(stagingBase, String(index));
      try {
        for (const write of skill.writes) {
          const filePath = join(staging, write.relative);
          await mkdir(dirname(filePath), { recursive: true });
          await writeFile(filePath, write.relative.toLowerCase().endsWith(".md") ? normalizeSkillText(write.data) : write.data);
        }
        if (skill.kind === "bundle") {
          await rename(staging, skill.target);
        } else {
          await rename(join(staging, skill.writes[0].relative), skill.target);
          await rm(staging, { recursive: true, force: true }).catch(() => {});
        }
        written.push({ name: skill.name, kind: skill.kind, target: skill.target });
      } catch (error) {
        await rm(staging, { recursive: true, force: true }).catch(() => {});
        skipped.push({ name: skill.name, reason: "写入失败（已回滚该技能）：" + (error instanceof Error ? error.message : String(error)) });
      }
    }
    await rm(stagingBase, { recursive: true, force: true }).catch(() => {});

    // ── DSH 做最终裁判：未被注册表接收的单独回滚，其余保留 ────────────────
    const missing = await this.waitForDiscovery(written.map((item) => item.name), sessionId, targetProject ?? cwd);
    const added: any[] = [];
    for (const item of written) {
      if (missing.has(item.name)) {
        await rm(item.target, { recursive: true, force: true }).catch(() => {});
        skipped.push({ name: item.name, reason: "DSH 未接受（frontmatter 校验未通过或不可发现），已回滚" });
        continue;
      }
      added.push({ name: item.name, kind: item.kind });
    }
    if (added.length === 0) throw new Error("没有技能被 DSH 接受，已全部回滚：" + describeSkips(skipped));
    return { added, skipped, warnings, scope: targetProject === undefined ? { kind: "global" } : await this.scopeForTarget(targetRoot, targetProject) };
  }

  /**
   * 轮询注册表直到这批技能全部出现；返回**未被发现的名字集合**。
   * 注册表不可用时不阻塞：返回空集合（视为已接收）。
   */
  async waitForDiscovery(names, sessionId, probeCwd) {
    const { registry, scope } = this.viewFor(sessionId);
    const pending = new Set(names);
    for (let attempt = 0; attempt < 12; attempt++) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
      try {
        for (const name of [...pending]) {
          if ((await registry.get(name, { cwd: probeCwd, scope })) !== undefined) pending.delete(name);
        }
        if (pending.size === 0) return pending;
      } catch {
        // 注册表不可用：视为已接收（没有可核对的依据）
        return new Set();
      }
    }
    return pending;
```

</details>

**依据 2 · 源码核查**：[src/client.ts:1719-1744](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/client.ts#L1719-L1744)

带资源技能删除的恢复成本不能忽略。

<details>
<summary>查看原文（26行）</summary>

```text
			// ── 删除：乐观删除 + Toast「撤销」，不再二次确认（v2.1.6）─────────
			// 为什么撤销是「尽力还原」而不是「原样恢复」：
			//   宿主只给了 deleteSkill / addSkill 两条 RPC，没有「读原始技能目录里的任意
			//   文件」的能力——content 只回 SKILL.md 正文。所以撤销走 addSkill 把删除前
			//   抓到的正文按原来的 rel 路径回填：单文件技能与「只有一个 SKILL.md 的技能
			//   目录」能完整回来，带脚本/资源的技能目录只能拿回 SKILL.md。
			//   正文也抓不到（技能在删除前的 content 调用就失败）时不做假承诺，
			//   Toast 的撤销按钮会明确回报「还原失败，请重新添加」。
			const sameKeySelected = (rows, key) => rows.filter((s) => opKeyOf(s) !== key);
			const undoDelete = (snapshot) => {
				if (snapshot.content === null) {
					showToast(t("toastUndoFailed"));
					return;
				}
				const files = [{ path: snapshot.rel === "" ? snapshot.name + "/SKILL.md" : snapshot.rel, base64: utf8ToBase64(snapshot.content) }];
				Promise.resolve().then(() => addSkill({ kind: "auto", files: files, workspace: snapshot.scope === "global" ? null : snapshot.scope })).then((result) => {
					const added = result !== null && typeof result === "object" && Array.isArray(result.added) ? result.added : [];
					if (added.length === 0) {
						showToast(t("toastUndoFailed"));
						return;
					}
					showToast(t("toastUndoDone").replace("{name}", snapshot.name));
					reloadAfterHot();
				}, () => {
					showToast(t("toastUndoFailed"));
				});
```

</details>

**依据 3 · 源码核查**：[src/mcp/gateway.ts:266-282](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/mcp/gateway.ts#L266-L282)

配置写成功仍需核对reconciled。

<details>
<summary>查看原文（17行）</summary>

```text
    const reconciled = await reconcileToggle(this.C, nextRow.id, nextRow.disabled);

    const entry = typeof nextRow.id === "string" ? getLoaderEntry(this.C, nextRow.id) : undefined;
    const server = this.decorate(nextRow, true, entry, shownEnabled);
    if (server === undefined) throw new Error("写入成功但生成的 MCP 行无效");
    return { server, reconciled };
  }

  async removeServer(rawPayload: unknown) {
    const payload = parseWirePayload(mcpRemovePayloadSchema, rawPayload, "删除参数无效");
    const { all } = await this.readRows();
    const row = this.resolveRow(all, { serverName: payload.serverName, entryId: payload.entryId });
    await removeMcpEntry(this.patchPath(), this.locatorOf(row));
    const reconciled = typeof row.id === "string"
      ? await waitForLoaderState(this.C, row.id, (entry) => entry === undefined)
      : false;
    return { ok: true, reconciled };
```

</details>

**依据 4 · 源码核查**：[src/mcp/probe.ts:70-84](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/mcp/probe.ts#L70-L84)

测试可启动进程和网络，资源成本非零假定。

<details>
<summary>查看原文（15行）</summary>

```text
function createTransport(input: McpServerInput) {
  if (input.transport === "stdio") {
    return new StdioClientTransport({
      command: resolveRequired(input.command, "命令"),
      args: input.args.map((item) => resolveRequired(item, "参数")),
      env: {
        ...scrubbedParentEnv(),
        ...stringMap(input.env, "环境变量")
      },
      cwd: input.cwd === "" || input.cwd === undefined ? undefined : resolveRequired(input.cwd, "工作目录")
    });
  }
  return new StreamableHTTPClientTransport(new URL(resolveRequired(input.url, "服务器地址")), {
    requestInit: { headers: stringMap(input.headers, "请求头") }
  });
```

</details>

#### 缺口

- 无全周期管理效率、恢复时长和外部服务成本对照
  **影响**：不能认定轻量或节时
  **进一步探讨**：记录一次导入/启停/MCP保存的全部核对与恢复，再与手工编辑比较。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证范围回读与迁移结果的改进假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将落盘、发现、loader协调明确分开，注册表异常保留未知，并让操作回执附目标作用域与完整目录恢复依据，可减少用户将局部成功当全部生效。已有实现已经有added/skipped和reconciled，不应重造统一“成功”字段；增量集中在发现异常不能确认的状态，以及带资源目录撤销的真实边界。

对照当前面板，在隔离工作区注入注册表异常、目标重名、一次导入失败和带资源技能删除；记录错误成功判断、资源丢失、恢复时间和额外操作。先看现有UI是否已充分解释reconciled与撤销限制；若已等价或新增确认只增加负担而没有减少误判，就否定。不能在现用技能上做删除实验，也不能把这项假设写成已实现完整恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1040-1058](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/index.ts#L1040-L1058)

发现异常空missing是状态分层的推导。

<details>
<summary>查看原文（19行）</summary>

```text
   * 轮询注册表直到这批技能全部出现；返回**未被发现的名字集合**。
   * 注册表不可用时不阻塞：返回空集合（视为已接收）。
   */
  async waitForDiscovery(names, sessionId, probeCwd) {
    const { registry, scope } = this.viewFor(sessionId);
    const pending = new Set(names);
    for (let attempt = 0; attempt < 12; attempt++) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
      try {
        for (const name of [...pending]) {
          if ((await registry.get(name, { cwd: probeCwd, scope })) !== undefined) pending.delete(name);
        }
        if (pending.size === 0) return pending;
      } catch {
        // 注册表不可用：视为已接收（没有可核对的依据）
        return new Set();
      }
    }
    return pending;
```

</details>

**依据 2 · 源码核查**：[src/mcp/gateway.ts:266-282](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/mcp/gateway.ts#L266-L282)

已有reconciled限制新方案的增量。

<details>
<summary>查看原文（17行）</summary>

```text
    const reconciled = await reconcileToggle(this.C, nextRow.id, nextRow.disabled);

    const entry = typeof nextRow.id === "string" ? getLoaderEntry(this.C, nextRow.id) : undefined;
    const server = this.decorate(nextRow, true, entry, shownEnabled);
    if (server === undefined) throw new Error("写入成功但生成的 MCP 行无效");
    return { server, reconciled };
  }

  async removeServer(rawPayload: unknown) {
    const payload = parseWirePayload(mcpRemovePayloadSchema, rawPayload, "删除参数无效");
    const { all } = await this.readRows();
    const row = this.resolveRow(all, { serverName: payload.serverName, entryId: payload.entryId });
    await removeMcpEntry(this.patchPath(), this.locatorOf(row));
    const reconciled = typeof row.id === "string"
      ? await waitForLoaderState(this.C, row.id, (entry) => entry === undefined)
      : false;
    return { ok: true, reconciled };
```

</details>

**依据 3 · 源码核查**：[src/client.ts:1719-1744](https://github.com/Fishquito7/dsh-skill-mcp-panel/blob/6481a72f216298ef0a26250342c4ea1d54c04f4f/src/client.ts#L1719-L1744)

正文撤销无法恢复资源是恢复依据需求。

<details>
<summary>查看原文（26行）</summary>

```text
			// ── 删除：乐观删除 + Toast「撤销」，不再二次确认（v2.1.6）─────────
			// 为什么撤销是「尽力还原」而不是「原样恢复」：
			//   宿主只给了 deleteSkill / addSkill 两条 RPC，没有「读原始技能目录里的任意
			//   文件」的能力——content 只回 SKILL.md 正文。所以撤销走 addSkill 把删除前
			//   抓到的正文按原来的 rel 路径回填：单文件技能与「只有一个 SKILL.md 的技能
			//   目录」能完整回来，带脚本/资源的技能目录只能拿回 SKILL.md。
			//   正文也抓不到（技能在删除前的 content 调用就失败）时不做假承诺，
			//   Toast 的撤销按钮会明确回报「还原失败，请重新添加」。
			const sameKeySelected = (rows, key) => rows.filter((s) => opKeyOf(s) !== key);
			const undoDelete = (snapshot) => {
				if (snapshot.content === null) {
					showToast(t("toastUndoFailed"));
					return;
				}
				const files = [{ path: snapshot.rel === "" ? snapshot.name + "/SKILL.md" : snapshot.rel, base64: utf8ToBase64(snapshot.content) }];
				Promise.resolve().then(() => addSkill({ kind: "auto", files: files, workspace: snapshot.scope === "global" ? null : snapshot.scope })).then((result) => {
					const added = result !== null && typeof result === "object" && Array.isArray(result.added) ? result.added : [];
					if (added.length === 0) {
						showToast(t("toastUndoFailed"));
						return;
					}
					showToast(t("toastUndoDone").replace("{name}", snapshot.name));
					reloadAfterHot();
				}, () => {
					showToast(t("toastUndoFailed"));
				});
```

</details>

#### 缺口

- 无用户误判与恢复对照，UI解释未全量核实
  **影响**：不能判断应增加状态或目录备份功能
  **进一步探讨**：先核对当前UI对这些回执的呈现，再比较错误判断、丢失与总操作成本。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
