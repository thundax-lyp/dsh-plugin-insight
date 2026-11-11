# DSH Plugin Hub

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a80c3d1](https://github.com/dshplugin/dsh-plugin-hub/tree/a80c3d1016110aa2ee6519346a737d44ecdd12fa)

<!-- BEGIN META -->
[![GitHub ★ 506](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=506&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dshplugin/dsh-plugin-hub) [![npm 30d 52,334](https://img.shields.io/static/v1?label=npm+30d&message=52%2C334&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin)
<!-- END META -->

> **功能**：在 DeepSeek Harness 设置中浏览、搜索、安装、升级和卸载社区插件。

> **亮点**：[Q01](#research-q01) 将目录、变更队列和终态日志集中到设置入口。

> **主要限制**：[Q02](#research-q02) 普通目录安装分支的映射失败未拒绝，构建拦截也可能触发自动许可变更。

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
  - [Q01 · 设置页发现和安装相对手工包管理多做成什么？](#detail-section-11)
  - [Q02 · 目录来源与构建授权如何生效？](#detail-section-12)
  - [Q03 · 刷新、取消和失败会留下哪些状态？](#detail-section-13)
  - [Q04 · 如何限定试用并验证确认计划？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户可以从设置查找已知社区包，并核对实际版本、profile 和加载结果。

手工核查仓库与 npm，再运行官方插件命令可得到同样的包操作；市场增加目录发现、进度和任务回查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 目录代理 | 查看社区包 | 网络失败可能回旧缓存 |
| 变更队列 | 安装、更新或卸载 | 必须核对来源、版本、许可与加载 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH webServer 与 profile | 必需 | 接入设置与操作入口 | 手工核查 |
| 目录数据和 npm 源 | 查找或安装需要 | 取得目录或包 | 核对过期缓存和来源 |
| 明确构建许可 | 实际安装前需要 | 限制包脚本执行 | 保留只读浏览 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 浏览 | 用户定位已知包 | 核对原仓库和版本 |
| 核对 | 隔离 profile 观察变更目标 | 检查权限和加载 |
| 退出 | 出现冲突或不明许可时停止 | 回官方命令核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载及环境资源未知 | 核对 profile 和来源 | 目录覆盖未验 |
| 持续 | 更新及构建未知 | 读任务和版本 | 节时未知 |
| 失败恢复 | 缓存与下载未知 | 核对许可和已装文件 | 取消不证明回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发现 | 目录代理和旧缓存 | 最新覆盖 |
| 变更 | 串行任务、日志与校验 | 实际可用性和安全性 |

> **思考**：[Q02](#research-q02) 普通目录安装分支的映射失败未拒绝，构建拦截也可能触发自动许可变更。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将目录、变更队列和终态日志集中到设置入口。

实际入口、队列与诊断分开，来源标记与执行权限仍需要独立绑定。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 普通目录安装分支的映射失败未拒绝，构建拦截也可能触发自动许可变更。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从已知来源的只读查包开始，任何包版本或构建许可不明时回原仓库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码覆盖目录缓存、普通 npm 安装、构建许可与取消，未运行宿主或真实包变更。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/http/install.js、lib/services/install/task-queue.js、lib/http/shared.js、lib/http/catalog.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核查固定构建入口、目录缓存和普通 npm 安装核心路径，未核验线上目录成员、实际 registry、第三方包及宿主运行。
- 下一步：隔离 profile 比较目录映射不符、构建受阻和取消后的实际文件与加载状态。

**分析版本**

- **仓库**：[dshplugin/dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)
- **版本号**：2.3.6（[固定提交 a80c3d1](https://github.com/dshplugin/dsh-plugin-hub/tree/a80c3d1016110aa2ee6519346a737d44ecdd12fa)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 绑定精确目标与构建许可的短期安装计划，可能降低误装和意外放行。

隔离 profile 比较目录映射不符、构建受阻和取消后的实际文件与加载状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 80 | 2814 | — | — | 27274 |
| .js | source | 36 | 12552 | 10390 | 2237 | — |
| .mjs | source | 5 | 401 | 273 | 93 | — |
| .tsx | source | 26 | 5691 | 4519 | 1008 | — |
| .ts | source | 56 | 9265 | 6407 | 2477 | — |
| .ts | test | 30 | 3389 | 2538 | 708 | — |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 556](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=556&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 540](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=540&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户从设置查找一个已知包时，能否核实安装目标、构建许可和实际结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设置页发现和安装相对手工包管理多做成什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

常在 DSH 中发现并管理社区插件的人，可以从设置页寻找已有可信来源的一个包。合格操作应能回读目标包名、版本、profile 及加载状态。宿主注入 webServer，挂载目录与安装路由；安装路由核对目标后进入队列，返回任务 ID 供后续查询。队列将任务置为 running，调用实际插件变更并留终态日志。与手工查仓库、手工运行宿主包管理命令相比，这里增加目录查找、任务排队及日志回查，真正改依赖和加载仍由宿主与包管理器处理。作者宣传的目录规模、人工验证及运行无须重启没有在本轮核实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-53](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/README.md#L27-L53)

作者声明社区市场、操作队列与目录验证。

<details>
<summary>查看原文（27行）</summary>

```text
## 什么是 DSH Plugin Hub

DSH Plugin Hub 是 **DeepSeek Harness 社区插件市场**：一个遵循官方插件开发规范构建的开源插件，安装进「设置 → 插件市场」后，无需离开应用即可浏览、搜索并一键安装社区插件。本项目为独立社区项目，与 DeepSeek Harness 官方无隶属关系。

<p align="center">
  <img src="https://api.dsh-plugin.org/images/releases/2-3-4/dsh-plugin-hub-market-zh.png?v=2.3.4" alt="DSH Plugin Hub 插件市场界面" width="840">
</p>

## 插件市场特性

**一键操作 · 全部可视化**

- **一键安装** — 点击即装：后台队列串行执行，弹窗实时显示安装进度，可随时取消；装完刷新页面即生效，无需重启
- **一键升级** — 目录检测到新版本自动提示，卡片按钮变为「更新」，覆盖安装一键完成
- **一键卸载** — 卸载全程可视化，实时进度一目了然，卸载成功即生效
- **任务留痕** — 每次安装 / 升级 / 卸载的成功与失败都会写入通知中心，随时回查

**通知中心**

- 进行中任务的实时进度与取消、待重启项、成功 / 失败历史记录集中管理
- 失败可一键提交 GitHub Issue，为开源做贡献；装完即生效，仅在刷新无法解决时才提示重启，且只给单个「立即重启」，关闭弹窗即视为稍后

**资源丰富 · 人工精选**

- 主站收录 **20,000+** 个社区插件，其中 **5,000+** 个已发布 NPM 包、可在插件市场一键安装；目录由 [dsh-plugin.org](https://dsh-plugin.org) 每日收录，可安装条目均经人工审核
- 涵盖界面与体验、会话与消息、记忆与上下文、工具能力等分类，按分类浏览、搜索直达
- 每个插件标注人工验证状态（verified）、Star / Fork 评分、版本号与最近更新时间，来源可溯
```

</details>

**依据 2 · 源码核查**：[lib/index.js:17-21](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/index.js#L17-L21)

实际入口待宿主 webServer 可用后挂载路由。

```text
export function apply(ctx, config = {}) {
    const profile = config.profile ?? readProfileArg('web');
    ctx.inject(['webServer'], (host) => {
        host.effect(() => mountPluginHubRoutes(host.webServer, profile, host.loader), 'dsh-plugin: http routes');
    });
```

**依据 3 · 源码核查**：[lib/http/install.js:194-219](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/http/install.js#L194-L219)

入队及返回任务 ID。

<details>
<summary>查看原文（26行）</summary>

```text
                    if (hasQueuedTarget(target)) {
                        sendJson(response, 409, { error: `already queued: ${target}` });
                        return;
                    }
                    // 后台启动 CLI；客户端轮询 /status 获取进度
                    const task = startPluginMutation({
                        // mode=update（已安装目标的覆盖更新）以 update 动作入队：
                        // 日志按 update 类别写入磁盘（update.start/done/fail），实际 CLI 执行仍是 add <target>@latest
                        action: mode === 'update' ? 'update' : 'add',
                        profile,
                        target,
                        // npm 安装时 target 是包名：displayTarget 固定展示仓库名，待重启行/前端恢复不因安装目标形态而变
                        displayTarget: githubRepoOf(displayRepo) ?? undefined,
                        // 覆盖更新：npm 命令显式 @latest（pnpm add 无版本对已存在依赖是幂等的，不加版本不会真更新）
                        updateNpm: mode === 'update',
                        // 运行中 loader：安装成功后把新插件热加载进 loader，非桌面端 + 纯服务端插件无需重启即生效
                        loader,
                        timeoutMs: COMMAND_TIMEOUT_MS,
                        env: mutationEnv(settings),
                        // 候选源（首选在前）：任务内遇到传输层失败时按顺序换源重试
                        registries: ordered,
                        installSpec,
                        // 自定义安装入口渠道：日志/报错据此溯源
                        installChannel,
                    });
                    sendJson(response, 200, { ok: true, task: task.id });
```

</details>

**依据 4 · 源码核查**：[lib/services/install/task-queue.js:313-344](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/services/install/task-queue.js#L313-L344)

队列执行、内部失败处理与终态日志。

<details>
<summary>查看原文（32行）</summary>

```text
        return;
    const item = queue.find((it) => it.task.status === 'pending');
    if (!item)
        return;
    const { task, options } = item;
    task.status = 'running';
    void runPluginMutation({ ...options, task })
        .catch((error) => {
        // runPluginMutation 的恢复路径（如 allowBuilds 写回 pnpm-workspace.yaml）
        // 可能抛出；落到 failed 终态并留痕，否则该 Promise 链成为未处理 rejection
        //（Node >= 15 默认直接终止进程），而队列自身却在 finally 里继续 pump。
        if (task.status !== 'cancelled') {
            task.status = 'failed';
            task.exitCode = null;
            task.progress = 0;
            pushLine(task, `[internal] ${error instanceof Error ? error.message : String(error)}`);
        }
    })
        .finally(() => {
        runningChildren.delete(task.id);
        // 系统日志：任务终态（成功/失败/取消），按动作归类安装/卸载/更新日志
        const show = task.displayTarget ?? task.target;
        const category = mutationCategory(task.action);
        const verb = (v) => task.action === 'remove' ? `卸载${v}` : task.action === 'update' ? `更新${v}` : `安装${v}`;
        if (task.status === 'done') {
            appendLog(options.profile, {
                at: Date.now(),
                level: 'success',
                category,
                event: `${category}.done`,
                message: `${verb('成功')} ${show}${channelLabel(options.installChannel)}${task.needsRestart ? '（待重启生效）' : ''}`,
            });
```

</details>

#### 缺口

- 未运行设置页或确认远端目录覆盖。
  **影响**：无法评估搜索质量、真实运行兼容与节时。
  **进一步探讨**：对一个已知包核对目录、安装版本、profile 和宿主加载。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录来源与构建授权如何生效？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

安装路由要求可信 POST，读取请求携带的 source 字段。目录分支在包与仓库匹配时记录映射，匹配为 false 并未在该分支拒绝；只有非 catalog 请求才受启用 npm 安装开关限制。因此不能以字段名或注释中的目录白名单证明目标经过服务端目录成员强制验证。这一结论限于所查普通 npm 路径和可信 POST 上下文，不表示任意网站可调用。后续 pnpm 返回构建被拦时，恢复路径解析 name@version 或退回目标名，向 profile 写 allowBuilds 再执行，改变了依赖脚本执行许可。目录徽标和最终安装成功均不足以替代对实际来源及构建脚本的逐项核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/http/install.js:34-58](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/http/install.js#L34-L58)

可信 POST 检查与客户端 source 输入。

<details>
<summary>查看原文（25行）</summary>

```text
        {
            kind: 'exact',
            path: '/dsh-plugin-hub/install',
            handler: async (request, response) => {
                if (!requireTrustedPost(request, response))
                    return;
                // 任务自动入队：即使已有插件操作在跑也接受请求（FIFO 串行执行），不做 409 拒绝
                try {
                    const body = await readJsonBody(request);
                    // mode: 'update' = 已安装目标的覆盖更新（放行 add，pnpm 对已存在依赖原位覆盖重装）。
                    let mode = body !== null && typeof body === 'object' && body.mode === 'update'
                        ? 'update'
                        : 'install';
                    // installTargetOf 把完整 DSH 命令剥成裸目标；自定义目标只接受 npm 包名，语法判定交给 validPackageName。
                    const rawRepo = typeof body === 'object' && body !== null && typeof body.repo === 'string'
                        ? installTargetOf(body.repo)
                        : '';
                    // 展示用仓库名（owner/repo）：npm 安装时 body.repo 是包名，display 供待重启行 / 任务恢复展示仓库名。
                    const displayRepo = typeof body === 'object' && body !== null && typeof body.display === 'string'
                        ? body.display.trim()
                        : rawRepo;
                    // 请求来源：目录插件安装（catalog）走目录白名单；命令行安装（custom）受安全开关控制
                    const source = typeof body === 'object' && body !== null && typeof body.source === 'string'
                        ? body.source
                        : '';
```

</details>

**依据 2 · 源码核查**：[lib/http/install.js:130-154](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/http/install.js#L130-L154)

映射校验只在通过时记录，失败未拒绝；开关仅对非 catalog 分支。

<details>
<summary>查看原文（25行）</summary>

```text
                    // 已尝试的安装方式（供失败提 Issue 预填）：保持为空
                    const attempts = [];
                    // 目录插件安装：目录数据可能滞后于打包拆分，确认目录下发的 npm 目标确为该仓库的 DSH 包，
                    // 命中则记录 repo → 包名映射，客户端据此把依赖 key 匹配回仓库、列表立即显示「已安装」。
                    const catalogRepo = source === 'catalog' ? githubRepoOf(displayRepo) : null;
                    if (catalogRepo !== null) {
                        const catalogTargetIsDsh = await isDshNpmPackageForRepo(rawRepo, catalogRepo, settings.npmRegistry, effectiveProxy, pinVersion);
                        if (catalogTargetIsDsh)
                            recordResolvedNpmPackage(profile, catalogRepo, rawRepo);
                    }
                    // 命令行安装（目录外）受「启用 NPM 安装」开关控制；目录插件安装走目录白名单，不受开关影响。
                    if (source !== 'catalog' && !settings.enableNpmInstall) {
                        sendJson(response, 403, { error: 'npm installs are disabled by the security settings' });
                        return;
                    }
                    // 命中已安装目标时按「更新」执行（pnpm add 对已存在依赖即原位覆盖重装）：
                    // 客户端已装列表可能与服务端不同步，覆盖重装比报错更友好且终态一致。
                    const installed = readInstalled(profile);
                    const already = installed[target] !== undefined ? target : null;
                    if (already !== null)
                        mode = 'update';
                    // 队列级去重：同一目标已在排队/执行中时拒绝，避免客户端防重竞态导致重复入队
                    if (hasQueuedTarget(target)) {
                        sendJson(response, 409, { error: `already queued: ${target}` });
                        return;
```

</details>

**依据 3 · 源码核查**：[lib/http/shared.js:150-156](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/http/shared.js#L150-L156)

未通过可信 POST 时返回 403。

```text
export function requireTrustedPost(request, response) {
    if (!requireMethod(request, response, 'POST'))
        return false;
    if (isSameOrigin(request))
        return true;
    sendJson(response, 403, { error: 'untrusted origin' });
    return false;
```

**依据 4 · 源码核查**：[lib/services/install/task-queue.js:884-901](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/services/install/task-queue.js#L884-L901)

解析被阻止脚本、写 allowBuilds 并重试。

<details>
<summary>查看原文（18行）</summary>

```text
        // 依赖原生模块/构建脚本被 pnpm v11 拦截（ERR_PNPM_IGNORED_BUILDS）：git 与 npm 源都会出现。
        // allowBuilds 的 key 是输出里列出的 name@version（如 node-pty@1.1.0），逐个放行后重试一次；
        // 输出解析不到时回退用目标名（插件自身构建脚本被拦的 npm 场景）。
        // 用重试后的最终结果判断：git 源放行 prepare 后可能又在依赖层撞上原生构建拦截。
        if (result.exitCode !== 0 && !result.timedOut && `${result.stderr}\n${result.stdout}`.includes('ERR_PNPM_IGNORED_BUILDS')) {
            const keys = ignoredBuildKeys(`${result.stderr}\n${result.stdout}`);
            if (keys.length === 0 && githubRepoOf(options.target) === null)
                keys.push(options.target);
            if (keys.length > 0) {
                if (options.task) {
                    options.task.status = 'running';
                    options.task.exitCode = null;
                    pushLine(options.task, `[allow build] ${keys.join(', ')}`);
                }
                for (const key of keys)
                    addAllowBuildsKey(options.profile, key);
                result = await spawnMutation(options);
            }
```

</details>

#### 缺口

- 未在宿主中伪造受信请求或实际执行构建。
  **影响**：源码可定位缺少拒绝分支，实际暴露范围与副作用需独立验证。
  **进一步探讨**：在隔离宿主关闭自定义安装，分别发送正常目录目标和不匹配测试目标并回读 profile。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 刷新、取消和失败会留下哪些状态？

**研究主题**：工程质量与复用、效果与总成本、缺陷与关键质疑

#### 完整回答

目录读取可返回一小时缓存，强制刷新也可能在网络失败后返回任意年龄的旧缓存并仍用 200。已排队任务取消会移出队列；运行中取消立即标记 cancelled，再尝试停止子进程。终态显示不表明已回滚先前的依赖或许可变更。安装 CLI 成功后还核对分发入口，缺文件会标失败并清除待重启，不能据此推定整个包已卸载。使用者需要承担下载和可能的构建资源，以及核对锁文件、构建权限、加载状态和清理的人工时间。若为隔离 profile 中已知包，故障时可停队列回读再手工恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/http/catalog.js:108-139](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/http/catalog.js#L108-L139)

缓存命中与拉取失败回退旧内容。

<details>
<summary>查看原文（32行）</summary>

```text
                // 1 小时本地缓存：命中直接返回（跨重启生效，插件市场秒开），未命中才走 curl 拉远程。
                // refresh=1 跳过 TTL 缓存直接回源（「强制刷新」用）；成功后照样覆盖缓存，
                // 失败仍回退旧缓存，所以强制刷新不会把可用的旧数据弄丢。
                const cacheFile = catalogCacheFile(profile, isStats ? 'stats' : `plugins-${lang}`);
                const forceRefresh = url.searchParams.get('refresh') === '1';
                const cached = forceRefresh ? null : readCatalogCache(cacheFile, CATALOG_CACHE_TTL_MS);
                if (cached !== null) {
                    try {
                        sendJson(response, 200, JSON.parse(cached));
                        return;
                    }
                    catch {
                        // 缓存正文损坏：忽略，走重新拉取并覆盖写盘
                    }
                }
                const r = await fetchCatalogOnce(target, proxy);
                if (!r.ok || r.body === '') {
                    // 实时拉取失败：退回任意年龄的本地缓存（上次成功数据），
                    // 避免证书吊销受阻 / 网络抖动时整个插件市场打不开 —— 数据可能过期，但好过空白。
                    const stale = readCatalogCache(cacheFile, Number.POSITIVE_INFINITY);
                    if (stale !== null) {
                        try {
                            sendJson(response, 200, JSON.parse(stale));
                            return;
                        }
                        catch {
                            // 备用缓存也损坏：落到下面的 502
                        }
                    }
                    // 带上 curl 退出码与 stderr 末行：只回 error 字段时，用户贴出来的响应里
                    // 没有任何可诊断信息
                    sendJson(response, 502, { error: 'catalog fetch failed', detail: r.detail });
```

</details>

**依据 2 · 源码核查**：[lib/services/install/task-queue.js:98-117](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/services/install/task-queue.js#L98-L117)

待运行取消与尝试中止运行进程。

<details>
<summary>查看原文（20行）</summary>

```text
export function cancelTask(id) {
    const task = tasks.get(id);
    if (!task)
        return false;
    if (task.status === 'pending') {
        const index = queue.findIndex((it) => it.task === task);
        if (index >= 0)
            queue.splice(index, 1);
        task.status = 'cancelled';
        pushLine(task, '[cancelled]');
        return true;
    }
    if (task.status === 'running') {
        task.status = 'cancelled';
        pushLine(task, '[cancelled]');
        const child = runningChildren.get(id);
        if (child)
            stopChild(child);
        return true;
    }
```

</details>

**依据 3 · 源码核查**：[lib/services/install/task-queue.js:904-920](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/services/install/task-queue.js#L904-L920)

安装完成后的入口检查和待重启清理。

<details>
<summary>查看原文（17行）</summary>

```text
    // 重试会产生新的 operation 日志，运行期抓取到此为止
    const tappedLog = logTap.stop();
    // pnpm 安装本身成功，但目标包声明分发的文件缺失（分发物缺构建产物 / 缺声明的补丁）→ 判为失败：
    // 撤销刚登记的待重启，避免用户重启时宿主加载残缺包直接崩溃。
    // 全局 npm 安装不进 profile（profile deps 里没有这些包），跳过入口校验
    if (options.action !== 'remove' && result.exitCode === 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
        const verified = verifyInstalledEntry(options.profile, options.target);
        if (verified.name !== null && verified.missing !== null) {
            clearPendingRestart(options.displayTarget ?? options.target);
            const detail = `[packaging] ${verified.name}: declared file missing: ${verified.missing} (the published package is missing this file — report it to the author)`;
            if (options.task && options.task.status !== 'cancelled') {
                options.task.status = 'failed';
                options.task.exitCode = null;
                options.task.progress = 0;
                pushLine(options.task, detail);
            }
            return { exitCode: 1, timedOut: false, error: `declared file missing: ${verified.missing}`, stdout: result.stdout, stderr: `${result.stderr}\n${detail}` };
```

</details>

#### 缺口

- 未复现取消窗口和入口缺失。
  **影响**：不知道何时已有写入和额外恢复成本。
  **进一步探讨**：取消前后独立比较依赖、锁文件、构建设置及实际宿主插件列表。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何限定试用并验证确认计划？

**研究主题**：采用判断、新假设与验证

#### 完整回答

已有隔离 profile 的用户可以先用市场查一个自己能从原仓库核实的包，检查精确版本和操作目标后再决定是否使用变更入口。若来源对不上、构建许可发生意外变化或取消后列表不一致，应回手工核查。未验证的设计是在执行前生成短期安装计划，绑定仓库、精确版本、profile、完整性和构建许可；当执行目标或允许的脚本变化时重新确认。给新安装、目录映射不符和 pnpm 构建受阻分别注入测试，比较额外确认负担、误装与无意放行次数。若不能阻止参数漂移或大量阻断已核验操作，维持人工确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/http/install.js:181-219](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/http/install.js#L181-L219)

入队时解析部分精确版本，也可能回退未锁定 spec。

<details>
<summary>查看原文（39行）</summary>

```text
                    }
                    // 新安装锁定「已过发布冷却期」的最高稳定版：pnpm 对发布还不满 24 小时的版本会不提示地回退，
                    // 锁定后装到的就是预期版本。更新已有目标时客户端已按冷却期筛选，继续走 @latest。
                    let installSpec = pinVersion !== '' ? `${target}@${pinVersion}` : undefined;
                    if (installSpec === undefined && already === null) {
                        // 解析源与安装首选源一致，锁定的版本一定存在于真正会用的那个源；解析失败则不锁定，不阻断安装。
                        // 超时 5s：网络刚探测通过，卡住时也不能把安装请求拖到默认的 8s
                        const release = await lookupReleaseAge(target, ordered[0] ?? '', effectiveProxy, 5000);
                        if (release !== null && release.installable !== null)
                            installSpec = `${target}@${release.installable.version}`;
                    }
                    // 入队前复检：网络探测的 await 期间并发请求可能已通过上方检查，而此处到 startPluginMutation
                    // 之间无 await，JS 单线程保证同一目标至多一个任务，杜绝双击/并发双任务。
                    if (hasQueuedTarget(target)) {
                        sendJson(response, 409, { error: `already queued: ${target}` });
                        return;
                    }
                    // 后台启动 CLI；客户端轮询 /status 获取进度
                    const task = startPluginMutation({
                        // mode=update（已安装目标的覆盖更新）以 update 动作入队：
                        // 日志按 update 类别写入磁盘（update.start/done/fail），实际 CLI 执行仍是 add <target>@latest
                        action: mode === 'update' ? 'update' : 'add',
                        profile,
                        target,
                        // npm 安装时 target 是包名：displayTarget 固定展示仓库名，待重启行/前端恢复不因安装目标形态而变
                        displayTarget: githubRepoOf(displayRepo) ?? undefined,
                        // 覆盖更新：npm 命令显式 @latest（pnpm add 无版本对已存在依赖是幂等的，不加版本不会真更新）
                        updateNpm: mode === 'update',
                        // 运行中 loader：安装成功后把新插件热加载进 loader，非桌面端 + 纯服务端插件无需重启即生效
                        loader,
                        timeoutMs: COMMAND_TIMEOUT_MS,
                        env: mutationEnv(settings),
                        // 候选源（首选在前）：任务内遇到传输层失败时按顺序换源重试
                        registries: ordered,
                        installSpec,
                        // 自定义安装入口渠道：日志/报错据此溯源
                        installChannel,
                    });
                    sendJson(response, 200, { ok: true, task: task.id });
```

</details>

**依据 2 · 源码核查**：[lib/services/install/task-queue.js:884-901](https://github.com/dshplugin/dsh-plugin-hub/blob/a80c3d1016110aa2ee6519346a737d44ecdd12fa/lib/services/install/task-queue.js#L884-L901)

当前执行时才发现并新增构建许可。

<details>
<summary>查看原文（18行）</summary>

```text
        // 依赖原生模块/构建脚本被 pnpm v11 拦截（ERR_PNPM_IGNORED_BUILDS）：git 与 npm 源都会出现。
        // allowBuilds 的 key 是输出里列出的 name@version（如 node-pty@1.1.0），逐个放行后重试一次；
        // 输出解析不到时回退用目标名（插件自身构建脚本被拦的 npm 场景）。
        // 用重试后的最终结果判断：git 源放行 prepare 后可能又在依赖层撞上原生构建拦截。
        if (result.exitCode !== 0 && !result.timedOut && `${result.stderr}\n${result.stdout}`.includes('ERR_PNPM_IGNORED_BUILDS')) {
            const keys = ignoredBuildKeys(`${result.stderr}\n${result.stdout}`);
            if (keys.length === 0 && githubRepoOf(options.target) === null)
                keys.push(options.target);
            if (keys.length > 0) {
                if (options.task) {
                    options.task.status = 'running';
                    options.task.exitCode = null;
                    pushLine(options.task, `[allow build] ${keys.join(', ')}`);
                }
                for (const key of keys)
                    addAllowBuildsKey(options.profile, key);
                result = await spawnMutation(options);
            }
```

</details>

#### 缺口

- 确认计划未实现。
  **影响**：不能断言可降低误装或排错成本。
  **进一步探讨**：用同一组测试包和 profile 记录执行前后许可与版本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
