# dsh-temptask

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1116ec7](https://github.com/Aeroscis/dsh-temptask/tree/1116ec7ff1af2dcf104dc34d883548c413064e25)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aeroscis/dsh-temptask) [![npm 30d 1,309](https://img.shields.io/static/v1?label=npm+30d&message=1%2C309&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aeroscis/dsh-temptask) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aeroscis/dsh-temptask)
<!-- END META -->

> **功能**：一键创建临时目录、工作区与会话，支持清理和搬迁转正，并以已完成事件前缀复刻对话。

> **亮点**：串起临时到保留的目录/会话流程，少做手工接线。详见[Q01](#research-q01)。

> **主要限制**：目录未独占预留，实例队列不能防多进程覆盖，转正非事务且取消失败仍可删除。详见[Q04](#research-q04)。

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
  - [Q01 · 临时任务改变什么工作流程？](#detail-section-11)
  - [Q02 · 创建、打开和生命周期由哪些宿主契约支撑？](#detail-section-12)
  - [Q03 · 转正是否真的搬走全部对话？](#detail-section-13)
  - [Q04 · HTTP、并发和清理保护的边界在哪里？](#detail-section-14)
  - [Q05 · 工程检查和三阶段成本如何判断？](#detail-section-15)
  - [Q06 · 什么情况下采用，进一步从何处入手？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：一次性探索不污染长期工作区，有价值成果再转正。详见[Q01](#research-q01)。

手工mkdir、工作区/会话创建和搬迁复刻，统一入口便利不等原子迁移。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 临时工作区 | 短任务 | 非沙箱 |
| 转正/repair | 搬文件与复刻历史 | 单来源完成前缀 |
| 清理/归档 | 管目录杂物 | 永久删文件且日志保留 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node/DSH匹配版本 | host/client契约 | 多旧新API维护面 |
| workspaceRegistry/controller | 节点会话 | 创建降级或失败 |
| sessionQuery/agents/preset | 历史seed | 可退空会话 |
| 可写根/数据目录 | 文件与清单 | 并发/跨卷需策略 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 设独立临时根 | 用户 | 无唯一重要数据 |
| 创建探索 | 用户 | 目录/会话归属正确 |
| 备份后转正 | 用户 | 目标与历史分别核对 |
| 确认清理 | 用户 | rm不可恢复，日志仍留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容宿主/临时根与备份 | 核准入、单host策略 | 临时根/备份/远程准入和单host策略需核；准备工时未知 |
| 持续使用 | 目录、日志、状态轮询及宿主模型会话 | 管理任务增长/备份与清理 | 会话按宿主计费；日志/目录增长与2.5秒轮询资源量未知 |
| 失败恢复 | 跨卷双份空间/原会话 | 盘点目录节点seed清单后恢复 | 跨卷源目标双份空间；清单/seed/目录盘点恢复时间未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 临时即开 | 目录/节点/会话编排 | 非权限沙箱 |
| 成果转正 | 搬目录与seed新会话 | 只取一个完成前缀 |
| 清理杂物 | rm并归档 | 日志仍留，非事务 |

> **思考**：目录未独占预留，实例队列不能防多进程覆盖，转正非事务且取消失败仍可删除。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：串起临时到保留的目录/会话流程，少做手工接线。详见[Q01](#research-q01)。

模块分层、能力降级和阶段回执可借鉴，顺序mock不能证明并发安全。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

目录未独占预留，实例队列不能防多进程覆盖，转正非事务且取消失败仍可删除。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；单host可丢弃数据、独立备份、默认关自动清理可作对照。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

完整生命周期和降级源码可查；目录竞争、跨进程更新、非事务搬迁与外部准入限制安全采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/host.js、lib/paths.js、lib/store.js、lib/config.js、lib/tasks.js、lib/promote.js、lib/seed.js、lib/workspaces.js、lib/routes.js、lib/hooks.js、lib/commands.js、src/client.tsx、scripts/smoke.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定lib入口、host配置、paths/store、创建/清理/转正及seed完整关键链，routes/命令/钩子、README与smoke定向检查，客户端仅交互契约。
- 下一步：进一步从同秒并发、双进程写、跨卷双副本和cancel失败探讨租约/恢复状态机。

**分析版本**

- **仓库**：[Aeroscis/dsh-temptask](https://github.com/Aeroscis/dsh-temptask)
- **版本号**：0.5.0（[固定提交 1116ec7](https://github.com/Aeroscis/dsh-temptask/tree/1116ec7ff1af2dcf104dc34d883548c413064e25)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究独占目录租约、跨进程CAS与持久化阶段日志，把删除/转正做成可恢复状态机。当前未验证。详见[Q06](#research-q06)。

进一步从同秒并发、双进程写、跨卷双副本和cancel失败探讨租约/恢复状态机。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1067 | — | — | 19636 |
| .js | source | 16 | 5577 | 4322 | 1255 | — |
| .mjs | source | 7 | 3881 | 3170 | 389 | — |
| .tsx | source | 1 | 3157 | 2355 | 626 | — |
| .ts | source | 15 | 4392 | 3032 | 974 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aeroscis/dsh-temptask/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aeroscis/dsh-temptask/issues?q=is%3Aissue+created%3A2026-09-22T06%3A01%3A11.214Z..2026-10-22T06%3A01%3A11.214Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aeroscis/dsh-temptask/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A01%3A11.214Z..2026-10-22T06%3A01%3A11.214Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：临时目录到正式工作区的完整生命周期如何运作，删除/并发/历史迁移对采用有什么约束？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 临时任务改变什么工作流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

为一次性想法、临时文件处理和短探索创建时间戳目录、对应工作区与会话，成果值得保留时搬到正式父目录并复刻一段已完成对话。相对手工mkdir、添加工作区、开会话、搬目录/重建对话，它统一临时到保留的生命周期，侧栏及/temptask命令提供入口。成功需区分目录搬迁、工作区创建、历史复刻和旧会话归档，而不是只看转正ok。

所谓隔离首先是不同cwd和目录组织，不是执行权限沙箱。默认根在DSH_HOME/dsh-temptask，清理删除任务文件，归档会话仍留日志；卸载不会自动删除目录/清单。核心价值是少污染长期工作区与减少转正接线，不是新会话存储或数据擦除。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-11](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/README.md#L3-L11)

作者的临时到转正定位。

```text
给 DeepSeek Harness 加一个「**临时任务**」入口：一键开一个隔离的临时工作目录，在里面聊。
实验、临时调试、一次性问题——即开即用、用完就清。

- **一个任务 = 一个目录 = 一个工作区**（侧边栏里的那一项）：`<DSH_HOME>/dsh-temptask/<时间戳>/`。所以侧边栏长成
  DSH 原生的样子：**任务工作区 → 它的会话**，展开、归档、搜索、拖拽都是官方能力。
- **不用起名**：工作区名就是那个时间戳目录；会话标题由 DSH 按首条消息自动总结，显示在会话行上。
- **聊出成果了就转正**：改名、搬到你要的正式目录、**连这段对话一起带过去**，从此不再被自动清理。
- 侧边栏一行：**主区点击 = 新建**，右边五个按钮（清理 / 转正 / 打开根目录 / 说明 / 设置）；也有 `/temptask` 命令。
- 清理有二次确认，**只删任务根目录下的子目录**，根目录里你自己放的东西不会被碰。
```

**依据 2 · 作者声明**：[README.md:32-39](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/README.md#L32-L39)

卸载保留。

```text
主区整块可点 = **新建**；右边五个按钮依次是 **清理 / 转正 / 打开（或复制）任务根目录 / 说明 / 设置**。
窄栏折叠时它就收成一个 ＋ 图标。

> **`desktop` 是 Electron 保留的 profile 名**，终端里的 `dsh plugin` 会拒绝管理它。
> 桌面版请在**应用内的插件管理界面**装卸；想在终端操作就换一个自建 profile。

**卸载**：`dsh plugin --profile <profile> remove @aeroscis/dsh-temptask`。
卸载**不会**删除任务目录与 `tasks.json`——要清就先用「清理临时任务」或手动删。
```

**依据 3 · 源码核查**：[lib/paths.js:11-24](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/paths.js#L11-L24)

根与数据目录。

<details>
<summary>查看原文（14行）</summary>

```text
 * 平台默认任务根目录：**DSH 自己的目录** `<DSH_HOME>/dsh-temptask`
 * （Windows 即 `C:\Users\<你>\.dsh\dsh-temptask`）。
 */
export function defaultRootDir(home = homedir(), env = process.env) {
    return join(dshHome(home, env), 'dsh-temptask');
}
/** DSH_HOME：环境变量优先，其次 `~/.dsh`。 */
export function dshHome(home = homedir(), env = process.env) {
    const fromEnv = env.DSH_HOME?.trim();
    return fromEnv !== undefined && fromEnv.length > 0 ? fromEnv : join(home, '.dsh');
}
/** 插件数据目录默认值：`<DSH_HOME>/plugin-data/dsh-temptask`。 */
export function defaultDataDir(home = homedir(), env = process.env) {
    return join(dshHome(home, env), 'plugin-data', 'dsh-temptask');
```

</details>

**依据 4 · 源码核查**：[lib/workspaces.js:97-112](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/workspaces.js#L97-L112)

删除节点不删除日志。

<details>
<summary>查看原文（16行）</summary>

```text
export async function removeTaskWorkspace(ctx, workspaceId) {
    if (workspaceId === undefined || workspaceId.length === 0)
        return { removed: false };
    const registry = registryOf(ctx);
    if (registry === undefined)
        return { removed: false, reason: '宿主未提供 workspaceRegistry' };
    try {
        const removed = await registry.delete(workspaceId);
        return { removed };
    }
    catch (error) {
        return { removed: false, reason: messageOf(error) };
    }
}
/**
 * 该任务工作区名下的**全部**会话（删除前必须用这个，而不是只记着的最后一条）。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 创建、打开和生命周期由哪些宿主契约支撑？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

包main经index转host，按能力探测可选服务，配置新宿主走Config/configEditor，旧宿主settings或config.json。manager创建依次挑目录名、mkdir/resolveByPath/create工作区、以其回传realpath建会话并attach，再写任务清单；attach失败会告警但保留已建会话。会话事件收养根内会话、更新closed/打开状态，默认autoCleanDays=0，启用后只清理closed且上次打开早于阈值记录。

依赖workspaceRegistry、sessionController/agents/sessionQuery等实际契约，缺服务有降级而非保证功能等价。package支持Node ^22.19或>=24及两个DSH候选版本区间；新宿主引用配置和旧注册表路径增加维护面。客户端同源API、slots/React入口与命令是交互通道，并非独立Agent预设或模型工具。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:94-202](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/host.js#L94-L202)

配置与能力探测。

<details>
<summary>查看原文（109行）</summary>

```text
export function apply(ctx, config) {
    /** 行配置原样（0.2.0 上是引用对象）；每次要值时现读，见 `rowConfigNow`。 */
    const rowInput = config;
    /** 首帧的行配置快照：只用来定初始配置与初始来源，之后一律现读。 */
    const initialRowConfig = rowConfigNow(rowInput);
    const log = (level, message) => {
        const logger = ctx.logger;
        if (logger === undefined)
            return;
        const write = logger[level] ?? logger.info;
        try {
            write?.call(logger, `[dsh-temptask] ${message}`);
        }
        catch {
            /* 日志失败绝不影响业务 */
        }
    };
    /* ── 配置状态（0.2.0 起字段是活引用：值在「读」的那一刻才取） ── */
    const initialConfig = normalizeConfigInput(initialRowConfig);
    let currentConfig = initialConfig;
    let currentSource = initialRowConfig === undefined ? 'defaults' : 'cordis-row';
    /** 旧宿主：`ctx.settings.register` 命名空间作用域（新宿主没有这个 API）。 */
    let settingsScope;
    let settingsReady = false;
    /** 旧宿主：config.json 里读到的补丁（settings 不可用时的降级通道）。 */
    let fileConfig;
    let dataDirNote;
    /**
     * 生效配置 = 「宿主配置层」叠在行配置上。
     *
     * 宿主配置层按宿主能力选择：新宿主用 `configEditor`（官方表单与齿轮面板都写进同一处
     * profile 补丁，Config 引用会自动跟着变），旧宿主用 settings 命名空间或 config.json。
     * 行配置每次**现读**：0.2.0 的 volatile 字段是活引用，官方表单改完值就在引用里，
     * 缓存一份普通对象会让热更新看不见。
     */
    function computeConfig() {
        const row = rowConfigNow(rowInput) ?? {};
        const host = settingsScopeValue() ?? fileConfig;
        return normalizeConfigInput(host === undefined ? row : { ...row, ...host });
    }
    /* ── 持久化与业务核心 ── */
    /** 挂载状态：能力探测必须如实反映，UI 据此提示降级。 */
    const mounted = { webServer: false, commands: false };
    /**
     * 运行期告警出口。
     * TaskStoreFile 必须先于 TaskManager 构造（manager 依赖它），所以用一个可后置填充的
     * 槽位把 store 的告警接到 manager 的告警列表上（面板顶部会显示）。
     */
    let storeWarningSink;
    const store = new TaskStoreFile(storeFileIn(initialConfig.dataDir), initialConfig.rootDir, {
        onWarning: (message) => storeWarningSink?.(message),
    });
    const manager = new TemptaskManager({
        ctx,
        store,
        version,
        config: () => currentConfig,
        configSource: () => currentSource,
        log,
        sideSessionDetected: detectSideSession,
        capabilities: () => ({
            sessionController: ctx.get('sessionController') !== undefined,
            agents: ctx.get('agents') !== undefined,
            /**
             * 宿主是否托管本插件配置：
             * 0.1.x = settings 命名空间注册成功；0.2.0-rc.1 起 = 有 configEditor
             * （插件自己的 Config schema 就是官方「设置 → 插件」表单）。
             */
            settings: settingsReady || ctx.get('configEditor') !== undefined,
            webServer: mounted.webServer,
            commands: mounted.commands,
            workspaceRegistry: ctx.get('workspaceRegistry') !== undefined,
            canOpenPath: canOpenPath(ctx),
        }),
        home: homedir,
    });
    storeWarningSink = (message) => manager.recordWarning(message);
    /** 启动流程：先解析配置（宿主配置层 → 行配置），再载入清单。 */
    const ready = (async () => {
        try {
            await loadSettings();
        }
        catch (error) {
            log('warn', `settings 初始化失败，改用 config.json：${messageOf(error)}`);
        }
        if (!settingsReady) {
            try {
                await loadLocalConfig();
            }
            catch (error) {
                log('warn', `读取 config.json 失败：${messageOf(error)}`);
            }
        }
        currentConfig = computeConfig();
        currentSource = resolveSource();
        try {
            await manager.initialize();
            log('info', `v${version} 已就绪：根目录 ${manager.rootDir()}，共 ${store.list().length} 个任务，配置来源 ${currentSource}`);
        }
        catch (error) {
            // 根目录不可建等致命问题：不阻塞加载，而是把原因显式暴露给 UI 与命令。
            const message = `任务根目录不可用：${messageOf(error)}`;
            manager.recordWarning(message);
            log('error', message);
        }
    })();
    /**
     * 重新读一遍配置（新宿主上官方设置表单改了 Config 引用就会走这里）。
     * 根目录变了要重新载入清单——这是「改完设置立刻生效」的关键一步。
```

</details>

**依据 2 · 源码核查**：[lib/tasks.js:190-260](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/tasks.js#L190-L260)

创建链。

<details>
<summary>查看原文（71行）</summary>

```text
    async create() {
        const root = this.rootDir();
        await this.ensureRoot().catch(() => undefined);
        let dirName;
        let dirPath;
        try {
            dirName = uniqueDirName(root, taskDirName());
            dirPath = resolveTaskPath(root, dirName);
        }
        catch (error) {
            return this.toFailure(error);
        }
        // 1) 目录 + 工作区（ensureTaskWorkspace 内部会 mkdir）
        const ensured = await ensureTaskWorkspace(this.deps.ctx, dirPath);
        if (!ensured.ok) {
            await this.rollbackDirectory(dirPath);
            return failure(ERROR_CODES.noWorkspace, ensured.message, ensured.hint);
        }
        const workspace = ensured.workspace;
        // 2) 会话：cwd 用工作区回传的归一化路径（realpath），否则 attach 会因路径不等而失败
        const session = await createSessionForDir(this.deps.ctx, workspace.path);
        const sessionId = session.sessionId;
        if (sessionId === undefined) {
            await this.rollbackDirectory(workspace.path);
            if (workspace.created)
                await removeTaskWorkspace(this.deps.ctx, workspace.workspaceId);
            return failure(ERROR_CODES.noSession, '任务目录已回滚：无法创建会话', session.reason ?? '当前 DSH 未提供可用于创建会话的服务');
        }
        // 3) 挂进工作区 —— 这一步决定它出现在侧边栏哪个节点下
        const attached = await attachSessionToWorkspace(this.deps.ctx, workspace.workspaceId, sessionId);
        if (!attached.attached) {
            this.recordWarning(`会话已创建但未能挂进任务节点（${attached.reason ?? '未知原因'}），它可能出现在「未分组」下`);
        }
        // 4) 记录（按目录去重：另一个进程若刚为同一目录写过记录，复用它）
        const now = Date.now();
        const task = {
            id: mintTaskId(),
            dirName,
            path: workspace.path,
            workspaceId: workspace.workspaceId,
            createdAt: now,
            lastOpenedAt: now,
            sessionId,
            status: 'active',
        };
        const persisted = await this.deps.store.mutate((draft) => {
            draft.rootDir = root;
            const clash = draft.tasks.find((row) => normalizeRoot(row.path) === normalizeRoot(task.path));
            if (clash !== undefined) {
                clash.workspaceId = workspace.workspaceId;
                clash.sessionId = sessionId;
                clash.status = 'active';
                clash.lastOpenedAt = now;
                delete clash.closedAt;
                return { ...clash };
            }
            draft.tasks.push(task);
            return { ...task };
        });
        this.requestOpen(persisted.id, sessionId);
        this.deps.log('info', `created task ${persisted.id} at ${workspace.path} (session ${sessionId})`);
        return {
            ok: true,
            task: this.toView(persisted),
            sessionId,
            workspaceId: workspace.workspaceId,
            workspaceCreated: workspace.created,
        };
    }
    /**
     * 打开任务：目录缺失报 MISSING_DIR；会话还活着就复用，否则在同一目录新建一条会话。
```

</details>

**依据 3 · 源码核查**：[lib/workspaces.js:22-72](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/workspaces.js#L22-L72)

工作区realpath。

<details>
<summary>查看原文（51行）</summary>

```text
export async function ensureTaskWorkspace(ctx, path) {
    const registry = registryOf(ctx);
    if (registry === undefined) {
        return {
            ok: false,
            message: '当前宿主未提供 workspaceRegistry，无法把任务做成侧边栏节点',
            hint: '任务目录仍会创建，但不会出现在侧边栏；请升级 DSH 或改用 /temptask list 查看。',
        };
    }
    // create() 要求目标目录已经存在（内部 realpath 会对不存在的路径 ENOENT）。
    try {
        await mkdir(path, { recursive: true });
    }
    catch (error) {
        return { ok: false, message: `无法创建任务目录：${path}`, hint: messageOf(error) };
    }
    try {
        const existing = await registry.resolveByPath(path);
        if (existing !== undefined) {
            return {
                ok: true,
                workspace: {
                    workspaceId: existing.id,
                    path: existing.path,
                    title: existing.title,
                    created: false,
                },
            };
        }
    }
    catch (error) {
        return { ok: false, message: `查找已有工作区失败：${path}`, hint: messageOf(error) };
    }
    try {
        // 不传 title：注册表会用目录 basename（也就是时间戳）当默认标题，
        // 之后只有用户显式 rename 才会变——本插件不会去改写它。
        const created = await registry.create(path);
        return {
            ok: true,
            workspace: {
                workspaceId: created.id,
                path: created.path,
                title: created.title,
                created: true,
            },
        };
    }
    catch (error) {
        return { ok: false, message: `无法为任务创建临时工作区：${path}`, hint: messageOf(error) };
    }
}
```

</details>

**依据 4 · 源码核查**：[lib/hooks.js:56-68](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/hooks.js#L56-L68)

事件注册。

<details>
<summary>查看原文（13行）</summary>

```text
                run('session/event(session/title)', () => manager.onSessionTitleChanged(session));
            }
        },
    };
}
/** 把处理器挂到 ctx 上（返回 disposer 由调用方的 effect 统一回收）。 */
export function registerHooks(ctx, handlers) {
    return [
        ctx.on('session/created', handlers.onCreate),
        ctx.on('session/disposed', handlers.onDisposed),
        ctx.on('session/event', handlers.onEvent),
    ];
}
```

</details>

**依据 5 · 源码核查**：[lib/tasks.js:779-795](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/tasks.js#L779-L795)

自动清理。

<details>
<summary>查看原文（17行）</summary>

```text
    async runAutoClean() {
        const days = this.deps.config().autoCleanDays;
        if (!Number.isFinite(days) || days <= 0)
            return;
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        const stale = this.deps.store
            .list()
            .filter((task) => task.status === 'closed' && (task.lastOpenedAt ?? task.createdAt) < cutoff);
        if (stale.length === 0)
            return;
        const result = await this.clean({ ids: stale.map((task) => task.id) });
        if (result.ok && result.removed.length > 0) {
            this.recordWarning(`自动清理：已删除 ${result.removed.length} 个超过 ${days} 天未使用的已关闭任务` +
                `（归档了 ${result.sessionsArchived} 条会话）`);
        }
    }
    /* ─────────────────────────── 内部工具 ─────────────────────────── */
```

</details>

**依据 6 · 源码核查**：[package.json:49-91](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/package.json#L49-L91)

运行版本和peer依赖。

<details>
<summary>查看原文（43行）</summary>

```text
    "dsh": "^0.1.5-rc.2 || ^0.2.0-rc.1"
  },
  "scripts": {
    "build": "npm run build:host && npm run build:client",
    "build:host": "tsc -p tsconfig.json",
    "build:client": "tsc -p tsconfig.client.json && node scripts/build-client.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.client.json --noEmit",
    "prepare": "node scripts/prepare.mjs",
    "prepack": "node scripts/check-pack.mjs",
    "check:pack": "node scripts/check-pack.mjs",
    "smoke": "npm run smoke:host && npm run smoke:client",
    "smoke:host": "node scripts/smoke.mjs",
    "smoke:client": "node scripts/smoke-client.mjs",
    "check:registration": "node scripts/check-registration.mjs",
    "check:seed-parity": "node scripts/check-seed-parity.mjs",
    "check": "npm run typecheck && npm run build && npm run check:pack && npm run smoke && npm run check:registration && npm run check:seed-parity"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": "^0.1.5-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/schemastery": "^3.18.1",
    "@deepseek-ai/dsh-settings": "^0.1.5-rc.2 || ^0.2.0-rc.1"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-settings": {
      "optional": true
    }
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "@types/react": "~18.3.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^7.0.2"
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 转正是否真的搬走全部对话？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

转正检查名称/目标、阻止目标在任务根或原任务内、检查未占用，先读旧会话账目并尝试cancel，再搬目录。优先rename，跨卷cp后rm；新工作区创建失败尽力搬回，后续历史创建失败会降级新空会话并说明，不阻止转正。旧会话按archive策略归档，旧节点删除失败记warn，最后forget任务记录。整个序列跨文件系统、宿主节点、会话与清单，不是一个事务；后段失败可能目录已搬/会话已归档而任务记录还在，重试不可只看原请求失败。

历史不是所有会话合并，只按候选找到第一条有完成前缀的来源。buildSeed要求事件seq连续，截取最后turn/end之后且未开启下一回合的前缀，补session/end-seed；新cwd建seeded会话并恢复可获取的preset/default model，未完成尾巴不带走。注释声称对齐官方fork是作者解释，本次查目标实现与自带parity脚本入口，没有引入宿主另一版本源码独立证明等价。跨卷复制成功旧源删除失败会明确返回双副本；目标占用检查与rename之间仍有竞争窗口。

#### 证据与依据

**依据 1 · 源码核查**：[lib/promote.js:119-165](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/promote.js#L119-L165)

跨卷与回滚。

<details>
<summary>查看原文（47行）</summary>

```text
async function moveDirectory(from, to) {
    try {
        await rename(from, to);
        return 'rename';
    }
    catch (error) {
        const code = error.code;
        if (code === 'EXDEV') {
            try {
                // errorOnExist + force:false：目标已经被我们在上面查过不存在，这里再兜一层。
                await cp(from, to, { recursive: true, errorOnExist: true, force: false });
            }
            catch (copyError) {
                throw new PromoteError(ERROR_CODES.fs, `跨卷复制失败：${from} → ${to}`, messageOf(copyError));
            }
            try {
                await rm(from, { recursive: true, force: true });
            }
            catch (removeError) {
                // 新家已经就位，旧目录删不掉只是留个副本——不算失败，但必须说清楚。
                throw new PromoteError(ERROR_CODES.fs, `已复制到 ${to}，但旧目录删不掉：${from}`, `${messageOf(removeError)}\n新旧两份都在磁盘上；确认新家内容无误后手动删除旧目录即可。`);
            }
            return 'copy';
        }
        if (isBusyError(error)) {
            throw new PromoteError(ERROR_CODES.dirBusy, `搬不动这个目录（被占用）：${from}`, 'Windows 上目录会被「正在使用它的进程」锁住：先关掉该任务的会话与终端（或先结束它正在跑的回合），再重试。');
        }
        throw new PromoteError(ERROR_CODES.fs, `搬目录失败：${from} → ${to}`, messageOf(error));
    }
}
/** 第 4/5 步失败时的回滚：把目录搬回去（best-effort，失败只记日志）。 */
async function rollbackMove(from, to) {
    try {
        await rename(to, from);
        return true;
    }
    catch {
        try {
            await cp(to, from, { recursive: true, errorOnExist: true, force: false });
            await rm(to, { recursive: true, force: true });
            return true;
        }
        catch {
            return false;
        }
    }
}
```

</details>

**依据 2 · 源码核查**：[lib/promote.js:180-309](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/promote.js#L180-L309)

选第一条种子与降级。

<details>
<summary>查看原文（130行）</summary>

```text
async function carryHistory(deps, candidates, targetCwd, targetWorkspaceId, withHistory) {
    const { ctx } = deps;
    const ids = [...new Set(candidates.filter((id) => typeof id === 'string' && id.length > 0))];
    /** 降级：不带历史地在同一目录建一条会话（官方 sessionController 路径）。 */
    const plain = async (reason) => {
        const created = await createSessionForDir(ctx, targetCwd);
        if (created.sessionId === undefined) {
            return {
                carried: false,
                reason: `${reason === undefined ? '' : `${reason}；`}并且新会话也没建成：${created.reason ?? '未知原因'}`,
            };
        }
        const attached = await attachSessionToWorkspace(ctx, targetWorkspaceId, created.sessionId);
        if (!attached.attached) {
            deps.log('warn', `转正：新会话 ${created.sessionId} 未能挂进新工作区（${attached.reason ?? ''}）`);
        }
        return reason === undefined
            ? { sessionId: created.sessionId, carried: false }
            : { sessionId: created.sessionId, carried: false, reason };
    };
    // 「不带历史」不是「不开会话」：新家总要有一条能立刻用的会话，否则节点是空的。
    if (!withHistory)
        return await plain('按你的选择：不继承旧对话');
    if (ids.length === 0)
        return await plain('原任务没有可继承的会话');
    const query = ctx.get('sessionQuery');
    if (query === undefined || typeof query.observeSession !== 'function') {
        return await plain('当前宿主未提供 sessionQuery，读不到旧会话的事件流');
    }
    /* 逐条试：第一条能造出「已完成前缀」的就是来源（空会话自然被跳过）。 */
    let observed;
    let built;
    let sourceSessionId;
    const skipped = [];
    for (const id of ids) {
        try {
            // 不传 projectionMode：默认投影才有 `agentPreset`（官方 fork 也是这么读来源会话的）。
            const candidate = await query.observeSession(id);
            const seed = buildSeed(candidate.events);
            if (seed === undefined) {
                skipped.push(id);
                continue;
            }
            observed = candidate;
            built = seed;
            sourceSessionId = id;
            break;
        }
        catch (error) {
            skipped.push(`${id}（${messageOf(error)}）`);
        }
    }
    if (observed === undefined || built === undefined || sourceSessionId === undefined) {
        return await plain(`试了 ${ids.length} 条会话都没有「已完成的一轮对话」可继承` +
            (skipped.length > 0 ? `（${skipped.length} 条为空或读不到）` : ''));
    }
    if (skipped.length > 0) {
        deps.log('info', `转正：跳过 ${skipped.length} 条没有完整回合的会话，改用 ${sourceSessionId} 做种子来源`);
    }
    const agents = ctx.get('agents');
    if (agents === undefined || typeof agents.create !== 'function') {
        return await plain('当前宿主未提供 agents 服务，无法用种子重建会话');
    }
    const sessionId = mintSessionId();
    try {
        const presets = ctx.get('agentPresets');
        const requested = observed.projections?.values.agentPreset;
        let agentPreset;
        let setup;
        if (presets !== undefined && typeof presets.resolve === 'function') {
            try {
                const resolved = await presets.resolve(requested);
                agentPreset = resolved.id;
                if (typeof presets.mount === 'function') {
                    const presetId = resolved.id;
                    setup = async (agentCtx) => {
                        await presets.mount(agentCtx, presetId);
                    };
                }
            }
            catch (error) {
                deps.log('warn', `转正：解析 Agent 预设失败，按默认装配建会话（${messageOf(error)}）`);
            }
        }
        const defaultModel = ctx.get('agentDefaultModel');
        let agentOptions;
        if (defaultModel !== undefined && typeof defaultModel.currentSelection === 'function') {
            try {
                const selection = defaultModel.currentSelection();
                agentOptions = { provider: selection.provider, model: selection.model };
            }
            catch {
                /* 拿不到就用宿主默认 */
            }
        }
        await agents.create({
            sessionId,
            seed: built.seed,
            inheritedEventCount: built.inheritedEventCount,
            meta: {
                cwd: targetCwd,
                parentSession: sourceSessionId,
                isSeeded: true,
                ...(agentPreset === undefined ? {} : { agentPreset }),
            },
            ...(agentOptions === undefined ? {} : { agentOptions }),
            ...(setup === undefined ? {} : { setup }),
        });
    }
    catch (error) {
        return await plain(`用种子重建会话失败：${messageOf(error)}`);
    }
    const attached = await attachSessionToWorkspace(ctx, targetWorkspaceId, sessionId);
    if (!attached.attached) {
        deps.log('warn', `转正：复刻的会话 ${sessionId} 未能挂进新工作区（${attached.reason ?? ''}）`);
        return {
            sessionId,
            carried: true,
            reason: `历史已复刻，但会话未能挂进新节点：${attached.reason ?? '未知原因'}`,
        };
    }
    return {
        sessionId,
        carried: true,
        sourceSessionId,
        ...(observed.projections?.values.title === undefined ||
            observed.projections.values.title === null
            ? {}
            : { sourceTitle: observed.projections.values.title }),
    };
```

</details>

**依据 3 · 源码核查**：[lib/promote.js:328-435](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/promote.js#L328-L435)

跨资源编排。

<details>
<summary>查看原文（108行）</summary>

```text
export async function promoteTask(deps, view, request) {
    const task = view;
    const { ctx } = deps;
    const fail = (error) => {
        if (error instanceof PromoteError) {
            const payload = { ok: false, code: error.code, message: error.message };
            if (error.hint !== undefined)
                payload.hint = error.hint;
            return payload;
        }
        return { ok: false, code: ERROR_CODES.fs, message: messageOf(error) };
    };
    try {
        /* 1) 校验源：记录里的路径必须仍然等于「根目录 + 目录名」（与删除任务同一套三重校验）。 */
        const from = sourcePath(task);
        if (!existsSync(from)) {
            return fail(new PromoteError(ERROR_CODES.missingDir, `任务目录不存在：${from}`, '目录已被手动删除；可在清理里移除这条记录。'));
        }
        /* 2) 校验落点。 */
        const nameIssue = validateName(request.name);
        if (nameIssue !== undefined)
            return fail(new PromoteError(ERROR_CODES.badRequest, nameIssue));
        const name = request.name.trim();
        const parentDir = await resolveParentDir(request.parentDir);
        if (parentDir.length === 0) {
            return fail(new PromoteError(ERROR_CODES.badRequest, '请填写目标父目录', `例如 ${join(deps.home?.() ?? homedir(), 'projects')}`));
        }
        const to = resolve(parentDir, name);
        if (normalizeRoot(to) === normalizeRoot(from)) {
            return fail(new PromoteError(ERROR_CODES.badRequest, '新路径和原路径相同，不需要转正'));
        }
        // 落在任务根目录里是禁止的：adoptSession 会把「cwd 在根目录下的会话」自动登记成临时任务，
        // 于是刚转正的正式工作区会在下一轮会话里被重新变回临时任务（自相矛盾）。
        const taskRoot = taskRootOf(task);
        if (isInsideRoot(taskRoot, to)) {
            return fail(new PromoteError(ERROR_CODES.badRequest, `目标会落在任务根目录里：${to}`, `任务根目录（${taskRoot}）下的一切都会被本插件当成临时任务；请换一个目录，或先改「任务根目录」设置。`));
        }
        if (isInsideRoot(from, to)) {
            return fail(new PromoteError(ERROR_CODES.badRequest, '目标不能放在原任务目录内部'));
        }
        if (occupied(to)) {
            return fail(new PromoteError(ERROR_CODES.targetExists, `目标已存在：${to}`, '本插件绝不覆盖已有内容；换个名字或换个父目录。'));
        }
        /* 3) 会话账目（必须在删工作区记录之前读）+ 中止活着的回合。 */
        const account = sessionAccountOf(ctx, task.workspaceId);
        const sessionIds = account.length > 0 ? account : task.sessionId === undefined ? [] : [task.sessionId];
        let sessionsCanceled = 0;
        for (const sessionId of sessionIds) {
            if (!isSessionLive(ctx, sessionId))
                continue;
            if (await cancelSession(ctx, sessionId))
                sessionsCanceled += 1;
        }
        /* 4) 搬目录（唯一的破坏性动作，且最早：失败则什么都没变）。 */
        const moved = await moveDirectory(from, to);
        /* 5) 新家建工作区记录；失败把目录搬回去，不留半状态。 */
        const ensured = await ensureTaskWorkspace(ctx, to);
        if (!ensured.ok) {
            const rolledBack = await rollbackMove(from, to);
            return fail(new PromoteError(ERROR_CODES.noWorkspace, `${ensured.message}${rolledBack ? '（目录已搬回原位）' : ''}`, rolledBack
                ? ensured.hint
                : `目录现在在 ${to}，但没能建出节点；可在侧边栏手动把该目录添加为工作区。${ensured.hint ?? ''}`));
        }
        const workspace = ensured.workspace;
        /* 6) 复刻对话（尽力而为，不影响转正本身）；不带历史时至少开一条空会话。 */
        // 候选按"新→旧"逐条试：任务记录里最后一条常常是空会话（见 carryHistory 的说明）。
        const carry = await carryHistory(deps, sessionIds.length > 0 ? sessionIds : task.sessionId === undefined ? [] : [task.sessionId], workspace.path, workspace.workspaceId, request.carry);
        /* 7) 按策略处理旧会话。 */
        let sessionsArchived = 0;
        if (deps.policy() === 'archive') {
            for (const sessionId of sessionIds) {
                if (await archiveSessionQuietly(ctx, sessionId))
                    sessionsArchived += 1;
            }
        }
        /* 8) 删旧工作区记录（此时它的会话已经转移或归档）。 */
        const removed = await removeTaskWorkspace(ctx, task.workspaceId);
        if (task.workspaceId !== undefined && !removed.removed) {
            deps.log('warn', `转正：旧工作区记录未能删除（${removed.reason ?? '未知原因'}）`);
        }
        /* 9) 删任务记录（此后它不再是临时任务，也不会被自动清理）。 */
        await deps.forget(task.id);
        deps.log('info', `promoted task ${task.id} → ${to} (history: ${String(carry.carried)}, source: ${carry.sourceSessionId ?? '-'}, archived: ${sessionsArchived}, moved: ${moved})`);
        const result = {
            task: { ...view, sessionIds },
            from,
            to: workspace.path,
            workspaceId: workspace.workspaceId,
            historyCarried: carry.carried,
            sessionsArchived,
            sessionsCanceled,
            moved,
        };
        if (carry.sessionId !== undefined)
            result.sessionId = carry.sessionId;
        if (carry.reason !== undefined)
            result.historyReason = carry.reason;
        return { ok: true, ...result };
    }
    catch (error) {
        return fail(error);
    }
}
/** 源目录：记录里的 path 必须与「根目录 + dirName」解析结果一致（防记录被手改）。 */
function sourcePath(task) {
    const root = taskRootOf(task);
    const expected = resolveTaskPath(root, task.dirName);
    if (normalizeRoot(task.path) !== normalizeRoot(expected)) {
```

</details>

**依据 4 · 源码核查**：[lib/seed.js:38-86](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/seed.js#L38-L86)

边界与seed。

<details>
<summary>查看原文（49行）</summary>

```text
    let end = -1;
    for (let index = 0; index < events.length; index += 1) {
        if (events[index]?.type === 'turn/end')
            end = index;
    }
    if (end < 0)
        return undefined;
    let boundary = end;
    for (let index = end + 1; index < events.length; index += 1) {
        const next = events[index];
        if (next === undefined)
            break;
        if (next.type === 'turn/start' ||
            (next.type === 'user/message' && next.surfaceOp === 'append') ||
            next.type === 'agent/inbox/spliced') {
            break;
        }
        boundary = index;
    }
    return boundary;
}
/**
 * 由来源会话的完整事件流造一份 fork 种子。
 *
 * @returns 可用的种子；`undefined` = 这段对话没有可继承的已完成前缀（调用方降级为「不带历史」）。
 */
export function buildSeed(events) {
    // seq == 下标：官方 fork 也用 `events[boundary].seq !== boundary` 做前置校验，
    // 不成立时那一层会直接抛错。我们这里退回 undefined，让调用方走降级链。
    for (let index = 0; index < events.length; index += 1) {
        if (events[index]?.seq !== index)
            return undefined;
    }
    const boundary = completedPrefixBoundary(events);
    if (boundary === undefined)
        return undefined;
    const last = events[boundary];
    if (last === undefined)
        return undefined;
    const seed = events
        .slice(0, boundary + 1)
        .map((event) => ({ ...event }));
    seed.push({
        type: 'session/end-seed',
        seq: boundary + 1,
        time: last.time,
        data: { inherited: true },
    });
    return { seed, inheritedEventCount: boundary + 1 };
```

</details>

#### 缺口

- 固定宿主的seed/预设装配语义与目标手写fork是否持续一致
  **影响**：不能把历史已复刻等同全会话完整迁移或将来版本兼容
  **进一步探讨**：逐事件对照对应宿主fork契约，明确来源会话与丢弃尾巴

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · HTTP、并发和清理保护的边界在哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

API限制方法、16KB body、Host/Origin与Sec-Fetch-Site，删除/清理/转正还需confirm；这是浏览器来源防护，不是调用者认证。Host可以来自客户端，缺Origin直接放行且无remoteAddress/token校验，因此远程暴露需宿主/反代单独认证，不能凭loopback Host判远程用户可信。body流没有专用读取deadline，需宿主连接限额。

清理先读会话账目、尝试cancel、删除目录，再归档/删节点；cancel失败不会阻止rm，活跃进程不一定已停止。删除路径检查root+dirName和记录词法一致、拒绝根本身，但无物理路径身份锁；不将其夸大为任意符号链接目标都会被rm，因为Node rm本身通常删链接，但根父级替换/挂载与并发目录复用仍需控制。uniqueDirName先exists再mkdir recursive，不是独占保留，同秒并发创建可复用目录；失败回滚未按created所有权判断目录，另一个操作写入时存在删其内容风险。

TaskStoreFile排队仅实例内，写前重读减少顺序覆盖但没有跨进程锁/CAS。writeJsonAtomic用同名.tmp，不同进程同时写还会争用临时文件，不能从rename原子推出更新不丢失。损坏文件备份失败被吞，mutate仍可用内存覆盖，.bak固定名也不能保留多次历史。

#### 证据与依据

**依据 1 · 源码核查**：[lib/routes.js:5-28](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/routes.js#L5-L28)

body上限。

<details>
<summary>查看原文（24行）</summary>

```text
/** 请求体上限（这些接口的载荷都很小）。 */
const MAX_BODY_BYTES = 16 * 1024;
/* ─────────────────────────── HTTP 工具 ─────────────────────────── */
function sendJson(res, status, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(status, {
        'cache-control': 'no-store',
        'content-type': 'application/json; charset=utf-8',
    });
    res.end(body);
}
async function readJsonBody(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        size += buffer.length;
        if (size > MAX_BODY_BYTES)
            throw new Error('请求体过大');
        chunks.push(buffer);
    }
    if (size === 0)
        return {};
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
```

</details>

**依据 2 · 源码核查**：[lib/routes.js:41-105](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/routes.js#L41-L105)

Host/Origin guard。

<details>
<summary>查看原文（65行）</summary>

```text
/** 判断 Host 是否是 loopback authority。 */
function isLoopbackAuthority(host) {
    const lower = host.toLowerCase();
    const name = lower.startsWith('[')
        ? lower.slice(0, lower.indexOf(']') + 1)
        : (lower.split(':')[0] ?? '');
    return name === '127.0.0.1' || name === 'localhost' || name === '[::1]';
}
/** 请求是否可信（同源 + 非跨站 + loopback/已声明 authority）。 */
function isTrustedRequest(req, trustedHosts) {
    const host = req.headers.host;
    if (typeof host === 'string' && host.length > 0) {
        const trusted = isLoopbackAuthority(host) ||
            trustedHosts.some((entry) => entry.toLowerCase() === host.toLowerCase());
        if (!trusted)
            return false;
    }
    if (req.headers['sec-fetch-site'] === 'cross-site')
        return false;
    const origin = req.headers.origin;
    // 浏览器一定会带 Origin；缺失说明请求不是页面发出的（中间层代理会剥离它）。
    if (origin === undefined)
        return true;
    try {
        return new URL(origin).host === host;
    }
    catch {
        return false;
    }
}
/** 统一异常 → ApiError，保证接口永远返回 JSON。 */
function toApiError(error) {
    return { ok: false, code: ERROR_CODES.badRequest, message: messageOf(error) };
}
/* ─────────────────────────── 路由构造 ─────────────────────────── */
export function createRoutes(host) {
    const { manager } = host;
    /** 统一的处理器包装：方法检查 + 同源检查 + 启动等待 + JSON 响应。 */
    function route(path, method, impl) {
        return {
            path,
            async handle(req, res) {
                try {
                    if ((req.method ?? 'GET').toUpperCase() !== method) {
                        res.setHeader('allow', method);
                        sendJson(res, 405, { ok: false, code: ERROR_CODES.badRequest, message: `本接口只接受 ${method}` });
                        return;
                    }
                    if (!isTrustedRequest(req, host.trustedHosts())) {
                        sendJson(res, 403, {
                            ok: false,
                            code: ERROR_CODES.badRequest,
                            message: 'untrusted origin：请求来源不是本机回环或已声明的 authority',
                        });
                        return;
                    }
                    const body = method === 'POST' ? asObject(await readJsonBody(req)) : {};
                    await host.ready;
                    const result = await impl(body, req);
                    sendJson(res, 200, result);
                }
                catch (error) {
                    host.log('warn', `${path} 处理失败：${messageOf(error)}`);
                    sendJson(res, 200, toApiError(error));
                }
```

</details>

**依据 3 · 源码核查**：[lib/tasks.js:562-636](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/tasks.js#L562-L636)

cancel、删除和回滚。

<details>
<summary>查看原文（75行）</summary>

```text
    async disposeTask(task) {
        // 1) 会话账目必须在删工作区之前读
        const account = sessionAccountOf(this.deps.ctx, task.workspaceId);
        const sessionIds = account.length > 0 ? account : task.sessionId === undefined ? [] : [task.sessionId];
        // 2) 活着的会话先中止当轮
        let sessionsCanceled = 0;
        for (const sessionId of sessionIds) {
            if (!isSessionLive(this.deps.ctx, sessionId))
                continue;
            if (await cancelSession(this.deps.ctx, sessionId))
                sessionsCanceled += 1;
        }
        // 3) 删目录（失败则整体中止，不留半清理状态）
        const dirRemoved = await this.removeDirectory(task);
        if (dirRemoved instanceof TaskError)
            return dirRemoved;
        // 4) 按策略处理会话
        let sessionsArchived = 0;
        if (this.deps.config().onDeleteSessions === 'archive') {
            for (const sessionId of sessionIds) {
                if (await archiveSessionQuietly(this.deps.ctx, sessionId))
                    sessionsArchived += 1;
            }
        }
        // 5) 删节点记录
        const workspace = await removeTaskWorkspace(this.deps.ctx, task.workspaceId);
        if (task.workspaceId !== undefined && !workspace.removed) {
            this.recordWarning(`任务目录已删除，但侧边栏节点未能移除${workspace.reason === undefined ? '' : `（${workspace.reason}）`}；可在侧边栏手动删除该节点`);
        }
        return { dirRemoved, workspaceRemoved: workspace.removed, sessionsArchived, sessionsCanceled };
    }
    /**
     * 安全删除任务目录。
     * @returns true 表示目录已删/本就不存在；TaskError 表示拒绝或失败。
     */
    async removeDirectory(task) {
        const root = this.rootDir();
        let target;
        try {
            // 三重校验：记录里的 path 必须在根目录内，且必须与「根目录 + dirName」解析一致。
            const expected = resolveTaskPath(root, task.dirName);
            if (normalizeRoot(task.path) !== normalizeRoot(expected)) {
                throw new TaskError(ERROR_CODES.outsideRoot, `拒绝删除：任务路径与目录名不一致（${task.path} ≠ ${expected}）`);
            }
            if (!isInsideRoot(root, expected) || normalizeRoot(expected) === normalizeRoot(root)) {
                throw new TaskError(ERROR_CODES.outsideRoot, `拒绝删除：${expected} 不在任务根目录内`);
            }
            target = expected;
        }
        catch (error) {
            return error instanceof TaskError
                ? error
                : new TaskError(ERROR_CODES.outsideRoot, `拒绝删除：${messageOf(error)}`);
        }
        if (!existsSync(target))
            return true;
        try {
            await rm(target, { recursive: true, force: true });
            return true;
        }
        catch (error) {
            return new TaskError(ERROR_CODES.fs, `删除任务目录失败：${target}`, messageOf(error));
        }
    }
    /** 会话创建失败后的回滚：只用 rm 删掉刚刚创建的目录。 */
    async rollbackDirectory(path) {
        try {
            if (existsSync(path))
                await rm(path, { recursive: true, force: true });
            this.deps.log('warn', `rolled back task directory ${path}`);
        }
        catch (error) {
            this.deps.log('error', `回滚目录失败 ${path}: ${messageOf(error)}`);
        }
    }
```

</details>

**依据 4 · 源码核查**：[lib/paths.js:64-85](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/paths.js#L64-L85)

词法检查与先探后建。

<details>
<summary>查看原文（22行）</summary>

```text
export function resolveTaskPath(rootDir, dirName) {
    if (dirName.length === 0 || basename(dirName) !== dirName || isAbsolute(dirName)) {
        throw new Error(`非法的任务目录名：${JSON.stringify(dirName)}`);
    }
    const path = resolve(normalizeRoot(rootDir), dirName);
    if (!isInsideRoot(rootDir, path)) {
        throw new Error(`任务路径越界：${path} 不在任务根目录 ${rootDir} 内`);
    }
    return path;
}
/** 目录已存在时追加 `-1`、`-2`…（绝不覆盖已有目录）。 */
export function uniqueDirName(rootDir, base) {
    const root = normalizeRoot(rootDir);
    let candidate = base;
    let index = 1;
    while (existsSync(resolve(root, candidate))) {
        candidate = `${base}-${index}`;
        index += 1;
        if (index > 1000)
            throw new Error(`无法为 ${base} 找到可用目录名（尝试超过 1000 次）`);
    }
    return candidate;
```

</details>

**依据 5 · 源码核查**：[lib/store.js:154-195](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/store.js#L154-L195)

实例队列与重读。

<details>
<summary>查看原文（42行）</summary>

```text
    async mutate(mutate) {
        return this.enqueue(async () => {
            const read = await this.readFromDisk(this.store.rootDir);
            let base;
            if (read.kind === 'ok') {
                base = read.store;
            }
            else if (read.kind === 'missing') {
                base = { version: TASK_STORE_VERSION, rootDir: this.store.rootDir, tasks: [] };
            }
            else {
                // 磁盘上是坏内容：先留下证据，再以本进程已知的记录为基准继续。
                await this.backupCorrupt();
                this.note(`${read.message}（已备份，本次以内存中的清单为基准）`);
                base = {
                    version: TASK_STORE_VERSION,
                    rootDir: this.store.rootDir,
                    tasks: this.store.tasks.map((task) => ({ ...task })),
                };
            }
            const before = JSON.stringify(base);
            const result = await mutate(base);
            // 幂等写：内容没变就不落盘（例如 session/disposed 落在一个非任务会话上）。
            if (JSON.stringify(base) !== before) {
                await writeJsonAtomic(this.file, base);
            }
            this.store = base;
            return result;
        });
    }
    /** 立即把当前内存态落盘（启动修复路径用）。 */
    async persist() {
        await writeJsonAtomic(this.file, this.store);
    }
    /* ─────────────────────────── 内部 ─────────────────────────── */
    /** 把一笔工作排进串行锁；锁本身不会因为某次失败而永久 reject。 */
    enqueue(work) {
        const run = this.tail.then(work);
        this.tail = run.then(() => undefined, () => undefined);
        return run;
    }
    /**
```

</details>

**依据 6 · 源码核查**：[lib/config.js:80-86](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/config.js#L80-L86)

固定临时文件。

```text
}
/** 读取降级配置文件；不存在或损坏都返回 undefined（调用方继续用默认值）。 */
export async function readConfigFile(file) {
    try {
        const text = await readFile(file, 'utf8');
        const parsed = JSON.parse(text);
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed))
```

**依据 7 · 源码核查**：[lib/store.js:242-250](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/store.js#L242-L250)

备份失败吞掉。

```text
    async backupCorrupt() {
        try {
            await copyFile(this.file, `${this.file}.bak`);
            return true;
        }
        catch {
            return false;
        }
    }
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程检查和三阶段成本如何判断？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

TypeScript源与lib发布产物并存，host/client版本注入、pack/registration/seed-parity和mock smoke脚本覆盖许多降级与回滚分支，源码模块按paths/store/tasks/promote分离，值得复用。smoke中“两个host并发写不会覆盖”实际先await A create再await B create，只证明顺序重读，不证明重叠read-modify-write安全；检查名称不能替代执行时序证据。本次只读脚本没有运行。

首次需对齐Node/宿主版本，选择仅临时数据根与备份策略，确认远程API准入。持续插件不直接调用LLM，但会话仍按宿主计费，目录/清单/原会话日志持续占盘；GUI约2.5秒轮询，任务很多时状态构造和读盘增加。跨卷转正会完整复制，空间峰值至少含源与目标，量化耗时取决体积；失败恢复需辨认两副本、旧节点、seed来源和清单是否forget，不能当自动回滚已经恢复所有资源。清理为永久rm，归档不擦除日志，备份/敏感信息生命周期要额外管理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:56-74](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/package.json#L56-L74)

检查链。

<details>
<summary>查看原文（19行）</summary>

```text
    "prepare": "node scripts/prepare.mjs",
    "prepack": "node scripts/check-pack.mjs",
    "check:pack": "node scripts/check-pack.mjs",
    "smoke": "npm run smoke:host && npm run smoke:client",
    "smoke:host": "node scripts/smoke.mjs",
    "smoke:client": "node scripts/smoke-client.mjs",
    "check:registration": "node scripts/check-registration.mjs",
    "check:seed-parity": "node scripts/check-seed-parity.mjs",
    "check": "npm run typecheck && npm run build && npm run check:pack && npm run smoke && npm run check:registration && npm run check:seed-parity"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "peerDependencies": {
```

</details>

**依据 2 · 源码核查**：[scripts/smoke.mjs:790-810](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/scripts/smoke.mjs#L790-L810)

实际顺序await双host。

<details>
<summary>查看原文（21行）</summary>

```text
  const peerA = createStubContext(newState());
  const peerB = createStubContext(newState());
  plugin.apply(peerA.ctx, { rootDir, dataDir: sharedData, autoCleanDays: 0 });
  plugin.apply(peerB.ctx, { rootDir, dataDir: sharedData, autoCleanDays: 0 });

  const peerATask = await call(peerA.routes, `${API}/create`, 'POST', {});
  const peerBTask = await call(peerB.routes, `${API}/create`, 'POST', {});
  const sharedStore = JSON.parse(await readFile(join(sharedData, 'tasks.json'), 'utf8'));
  check('两个 host 并发写清单不会互相覆盖（写入前重读磁盘）', () => {
    const paths = sharedStore.tasks.map((row) => row.path);
    assert.ok(paths.includes(peerATask.task.path), 'B 的整份覆盖把 A 刚写的记录抹掉了');
    assert.ok(paths.includes(peerBTask.task.path));
    assert.equal(sharedStore.tasks.length, 2);
  });

  const peerAView = await call(peerA.routes, `${API}/state`);
  check('GET /state 会先重读磁盘，看得到另一个 host 建的任务', () => {
    assert.ok(peerAView.tasks.some((task) => task.id === peerBTask.task.id));
  });

  const beforeDisposed = await readFile(join(sharedData, 'tasks.json'), 'utf8');
```

</details>

**依据 3 · 作者声明**：[README.md:185-202](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/README.md#L185-L202)

作者限制与轮询。

<details>
<summary>查看原文（18行）</summary>

```text
| 打开了任务但页面没跳 | 直接点侧边栏对应的工作区即可（自动跳转有约 2.5 秒的轮询延迟） |
| 转正后新工作区里只有空会话 | 当时没勾「把对话带过去」，或那条会话没有已完成的一轮 → 用 `/temptask repair <新工作区路径>` 把历史接回来 |
| 临时目录被删后对话打不开 | 同上：`/temptask repair <某个正常的工作区路径>` |
| 转正报「目录被占用」 | 关掉那个任务的会话/终端（Windows 上只要还有程序待在那个目录里就搬不动）；此时不会有任何改动 |

## 7. 已知限制

- **不能真正删除会话**：DSH 没提供这个能力，只能归档（日志留在磁盘上）。
- **转正只复刻"已完成的一轮"**：最后一个回合还没收尾的内容不会被带过去；一个已完成回合都没有时
  会退化成空会话并如实说明。
- **转正的目标不能落在任务根目录内部**：那会被自动登记成新的临时任务，等于原地打转。
- **侧边栏那一行内部的按钮**屏幕阅读器读不到（这一行是官方按"导航按钮"渲染的，内部内容被标成
  装饰性内容）；同样的动作在「设置 → 插件 → 临时任务」与 `/temptask` 命令里都能用键盘完成。
- **多个 profile 同时运行**时共用一份 `tasks.json`：写入前会在锁内重读磁盘、按 id 合并，
  极端情况下仍有亚毫秒级的覆盖窗口。

## 8. 给维护者

```

</details>

**依据 4 · 源码核查**：[lib/promote.js:119-165](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/promote.js#L119-L165)

跨卷和恢复成本。

<details>
<summary>查看原文（47行）</summary>

```text
async function moveDirectory(from, to) {
    try {
        await rename(from, to);
        return 'rename';
    }
    catch (error) {
        const code = error.code;
        if (code === 'EXDEV') {
            try {
                // errorOnExist + force:false：目标已经被我们在上面查过不存在，这里再兜一层。
                await cp(from, to, { recursive: true, errorOnExist: true, force: false });
            }
            catch (copyError) {
                throw new PromoteError(ERROR_CODES.fs, `跨卷复制失败：${from} → ${to}`, messageOf(copyError));
            }
            try {
                await rm(from, { recursive: true, force: true });
            }
            catch (removeError) {
                // 新家已经就位，旧目录删不掉只是留个副本——不算失败，但必须说清楚。
                throw new PromoteError(ERROR_CODES.fs, `已复制到 ${to}，但旧目录删不掉：${from}`, `${messageOf(removeError)}\n新旧两份都在磁盘上；确认新家内容无误后手动删除旧目录即可。`);
            }
            return 'copy';
        }
        if (isBusyError(error)) {
            throw new PromoteError(ERROR_CODES.dirBusy, `搬不动这个目录（被占用）：${from}`, 'Windows 上目录会被「正在使用它的进程」锁住：先关掉该任务的会话与终端（或先结束它正在跑的回合），再重试。');
        }
        throw new PromoteError(ERROR_CODES.fs, `搬目录失败：${from} → ${to}`, messageOf(error));
    }
}
/** 第 4/5 步失败时的回滚：把目录搬回去（best-effort，失败只记日志）。 */
async function rollbackMove(from, to) {
    try {
        await rename(to, from);
        return true;
    }
    catch {
        try {
            await cp(to, from, { recursive: true, errorOnExist: true, force: false });
            await rm(to, { recursive: true, force: true });
            return true;
        }
        catch {
            return false;
        }
    }
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么情况下采用，进一步从何处入手？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，具体限制来自可破坏文件操作与实例内锁/目录预留竞争、非事务转正和API依赖外部认证。可信单用户、单host、只放可丢弃数据并保留独立备份可作隔离对照；默认不启自动清理，不把临时目录组织当代码沙箱。重要成果先备份再转正，核对目标文件、historyCarried/source及旧记录，失败后先盘点再重试。共享多profile写同一数据目录、远程无认证暴露、唯一重要数据或跨卷大批迁移不宜直接采用。

继续可研究mkdir独占目录租约、跨进程锁/版本CAS与唯一tmp文件，以及持久化阶段日志/幂等操作ID；取消未确认完成时拒绝删除，转正用可恢复状态机记录目录/节点/seed阶段，route接宿主身份准入。基线为当前exists+recursive mkdir、顺序重读/多资源try-catch，反例包括同步创建、两个进程读同版再写、复制后源删失败、建新节点后forget失败、cancel失败仍运行和伪造Host。比较错删、丢记录、重复seed/副本与恢复工时，当前为未验证方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tasks.js:190-247](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/tasks.js#L190-L247)

目录创建和记录时序。

<details>
<summary>查看原文（58行）</summary>

```text
    async create() {
        const root = this.rootDir();
        await this.ensureRoot().catch(() => undefined);
        let dirName;
        let dirPath;
        try {
            dirName = uniqueDirName(root, taskDirName());
            dirPath = resolveTaskPath(root, dirName);
        }
        catch (error) {
            return this.toFailure(error);
        }
        // 1) 目录 + 工作区（ensureTaskWorkspace 内部会 mkdir）
        const ensured = await ensureTaskWorkspace(this.deps.ctx, dirPath);
        if (!ensured.ok) {
            await this.rollbackDirectory(dirPath);
            return failure(ERROR_CODES.noWorkspace, ensured.message, ensured.hint);
        }
        const workspace = ensured.workspace;
        // 2) 会话：cwd 用工作区回传的归一化路径（realpath），否则 attach 会因路径不等而失败
        const session = await createSessionForDir(this.deps.ctx, workspace.path);
        const sessionId = session.sessionId;
        if (sessionId === undefined) {
            await this.rollbackDirectory(workspace.path);
            if (workspace.created)
                await removeTaskWorkspace(this.deps.ctx, workspace.workspaceId);
            return failure(ERROR_CODES.noSession, '任务目录已回滚：无法创建会话', session.reason ?? '当前 DSH 未提供可用于创建会话的服务');
        }
        // 3) 挂进工作区 —— 这一步决定它出现在侧边栏哪个节点下
        const attached = await attachSessionToWorkspace(this.deps.ctx, workspace.workspaceId, sessionId);
        if (!attached.attached) {
            this.recordWarning(`会话已创建但未能挂进任务节点（${attached.reason ?? '未知原因'}），它可能出现在「未分组」下`);
        }
        // 4) 记录（按目录去重：另一个进程若刚为同一目录写过记录，复用它）
        const now = Date.now();
        const task = {
            id: mintTaskId(),
            dirName,
            path: workspace.path,
            workspaceId: workspace.workspaceId,
            createdAt: now,
            lastOpenedAt: now,
            sessionId,
            status: 'active',
        };
        const persisted = await this.deps.store.mutate((draft) => {
            draft.rootDir = root;
            const clash = draft.tasks.find((row) => normalizeRoot(row.path) === normalizeRoot(task.path));
            if (clash !== undefined) {
                clash.workspaceId = workspace.workspaceId;
                clash.sessionId = sessionId;
                clash.status = 'active';
                clash.lastOpenedAt = now;
                delete clash.closedAt;
                return { ...clash };
            }
            draft.tasks.push(task);
            return { ...task };
```

</details>

**依据 2 · 源码核查**：[lib/tasks.js:562-592](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/tasks.js#L562-L592)

取消与删除。

<details>
<summary>查看原文（31行）</summary>

```text
    async disposeTask(task) {
        // 1) 会话账目必须在删工作区之前读
        const account = sessionAccountOf(this.deps.ctx, task.workspaceId);
        const sessionIds = account.length > 0 ? account : task.sessionId === undefined ? [] : [task.sessionId];
        // 2) 活着的会话先中止当轮
        let sessionsCanceled = 0;
        for (const sessionId of sessionIds) {
            if (!isSessionLive(this.deps.ctx, sessionId))
                continue;
            if (await cancelSession(this.deps.ctx, sessionId))
                sessionsCanceled += 1;
        }
        // 3) 删目录（失败则整体中止，不留半清理状态）
        const dirRemoved = await this.removeDirectory(task);
        if (dirRemoved instanceof TaskError)
            return dirRemoved;
        // 4) 按策略处理会话
        let sessionsArchived = 0;
        if (this.deps.config().onDeleteSessions === 'archive') {
            for (const sessionId of sessionIds) {
                if (await archiveSessionQuietly(this.deps.ctx, sessionId))
                    sessionsArchived += 1;
            }
        }
        // 5) 删节点记录
        const workspace = await removeTaskWorkspace(this.deps.ctx, task.workspaceId);
        if (task.workspaceId !== undefined && !workspace.removed) {
            this.recordWarning(`任务目录已删除，但侧边栏节点未能移除${workspace.reason === undefined ? '' : `（${workspace.reason}）`}；可在侧边栏手动删除该节点`);
        }
        return { dirRemoved, workspaceRemoved: workspace.removed, sessionsArchived, sessionsCanceled };
    }
```

</details>

**依据 3 · 源码核查**：[lib/store.js:154-195](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/store.js#L154-L195)

版本竞争。

<details>
<summary>查看原文（42行）</summary>

```text
    async mutate(mutate) {
        return this.enqueue(async () => {
            const read = await this.readFromDisk(this.store.rootDir);
            let base;
            if (read.kind === 'ok') {
                base = read.store;
            }
            else if (read.kind === 'missing') {
                base = { version: TASK_STORE_VERSION, rootDir: this.store.rootDir, tasks: [] };
            }
            else {
                // 磁盘上是坏内容：先留下证据，再以本进程已知的记录为基准继续。
                await this.backupCorrupt();
                this.note(`${read.message}（已备份，本次以内存中的清单为基准）`);
                base = {
                    version: TASK_STORE_VERSION,
                    rootDir: this.store.rootDir,
                    tasks: this.store.tasks.map((task) => ({ ...task })),
                };
            }
            const before = JSON.stringify(base);
            const result = await mutate(base);
            // 幂等写：内容没变就不落盘（例如 session/disposed 落在一个非任务会话上）。
            if (JSON.stringify(base) !== before) {
                await writeJsonAtomic(this.file, base);
            }
            this.store = base;
            return result;
        });
    }
    /** 立即把当前内存态落盘（启动修复路径用）。 */
    async persist() {
        await writeJsonAtomic(this.file, this.store);
    }
    /* ─────────────────────────── 内部 ─────────────────────────── */
    /** 把一笔工作排进串行锁；锁本身不会因为某次失败而永久 reject。 */
    enqueue(work) {
        const run = this.tail.then(work);
        this.tail = run.then(() => undefined, () => undefined);
        return run;
    }
    /**
```

</details>

**依据 4 · 源码核查**：[lib/promote.js:378-417](https://github.com/Aeroscis/dsh-temptask/blob/1116ec7ff1af2dcf104dc34d883548c413064e25/lib/promote.js#L378-L417)

转正阶段。

<details>
<summary>查看原文（40行）</summary>

```text
            if (await cancelSession(ctx, sessionId))
                sessionsCanceled += 1;
        }
        /* 4) 搬目录（唯一的破坏性动作，且最早：失败则什么都没变）。 */
        const moved = await moveDirectory(from, to);
        /* 5) 新家建工作区记录；失败把目录搬回去，不留半状态。 */
        const ensured = await ensureTaskWorkspace(ctx, to);
        if (!ensured.ok) {
            const rolledBack = await rollbackMove(from, to);
            return fail(new PromoteError(ERROR_CODES.noWorkspace, `${ensured.message}${rolledBack ? '（目录已搬回原位）' : ''}`, rolledBack
                ? ensured.hint
                : `目录现在在 ${to}，但没能建出节点；可在侧边栏手动把该目录添加为工作区。${ensured.hint ?? ''}`));
        }
        const workspace = ensured.workspace;
        /* 6) 复刻对话（尽力而为，不影响转正本身）；不带历史时至少开一条空会话。 */
        // 候选按"新→旧"逐条试：任务记录里最后一条常常是空会话（见 carryHistory 的说明）。
        const carry = await carryHistory(deps, sessionIds.length > 0 ? sessionIds : task.sessionId === undefined ? [] : [task.sessionId], workspace.path, workspace.workspaceId, request.carry);
        /* 7) 按策略处理旧会话。 */
        let sessionsArchived = 0;
        if (deps.policy() === 'archive') {
            for (const sessionId of sessionIds) {
                if (await archiveSessionQuietly(ctx, sessionId))
                    sessionsArchived += 1;
            }
        }
        /* 8) 删旧工作区记录（此时它的会话已经转移或归档）。 */
        const removed = await removeTaskWorkspace(ctx, task.workspaceId);
        if (task.workspaceId !== undefined && !removed.removed) {
            deps.log('warn', `转正：旧工作区记录未能删除（${removed.reason ?? '未知原因'}）`);
        }
        /* 9) 删任务记录（此后它不再是临时任务，也不会被自动清理）。 */
        await deps.forget(task.id);
        deps.log('info', `promoted task ${task.id} → ${to} (history: ${String(carry.carried)}, source: ${carry.sourceSessionId ?? '-'}, archived: ${sessionsArchived}, moved: ${moved})`);
        const result = {
            task: { ...view, sessionIds },
            from,
            to: workspace.path,
            workspaceId: workspace.workspaceId,
            historyCarried: carry.carried,
            sessionsArchived,
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
