# DSH 终末地工作台

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d9d5c72](https://github.com/rison114514/dsh-endfield-ui/tree/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8)

<!-- BEGIN META -->
[![GitHub ★ 97](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=97&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/rison114514/dsh-endfield-ui)
<!-- END META -->

> **功能**：工业风界面及原生 Goal 工作台接入

> **亮点**：[Q01](#research-q01) 主题工作台内复用宿主目标状态。

> **主要限制**：[Q03](#research-q03) 指定版本及附属组件边界要核对。

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
  - [Q01 · 用户交付是什么？](#detail-section-11)
  - [Q02 · 目标操作如何同步？](#detail-section-12)
  - [Q03 · 主题的边界？](#detail-section-13)
  - [Q04 · 采用和退出成本？](#detail-section-14)
  - [Q05 · 怎样否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望使用工业风 DSH 并聚焦目标。

默认主题加 GoalBar。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 默认主题加 GoalBar。 | 可直接比较 | 保留人工步骤 |
| DSH 终末地工作台 | 主题工作台内复用宿主目标状态。 | 指定版本及附属组件边界要核对。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 主题与 sidebar 挂接会话原生 Goal。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户希望使用工业风 DSH 并聚焦目标。 | 保留原流程 |
| 试验 | 主题与 sidebar 挂接会话原生 Goal。 | 观察固定版本 |
| 复核 | 隔离 profile 检查目标并发与输入。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在主题内查看和修改同一会话目标 | 可在保持目标一致的同时满足界面偏好。 | 隔离 profile 检查目标并发与输入。 |

> **思考**：[Q03](#research-q03) 指定版本及附属组件边界要核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 主题工作台内复用宿主目标状态。

使用 session 投影和 CAS ref。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 指定版本及附属组件边界要核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 检查目标并发与输入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在主题内查看和修改同一会话目标。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、endfield-ui-plugin/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在主题内查看和修改同一会话目标。未执行目标代码或实际宿主验证。
- 下一步：保留两端目标与截图。

**分析版本**

- **仓库**：[rison114514/dsh-endfield-ui](https://github.com/rison114514/dsh-endfield-ui)
- **版本号**：未声明（[固定提交 d9d5c72](https://github.com/rison114514/dsh-endfield-ui/tree/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可在保持目标一致的同时满足界面偏好。

保留两端目标与截图。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 2 | 808 | 702 | 45 | — |
| .js | source | 3 | 1059 | 910 | 85 | — |
| .md | source | 8 | 645 | — | — | 7972 |
| .mjs | source | 10 | 1288 | 1063 | 112 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/rison114514/dsh-endfield-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/rison114514/dsh-endfield-ui/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/rison114514/dsh-endfield-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在主题内查看和修改同一会话目标

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

偏好工业风的用户可使用主题和右栏工作台，目标卡与原生 Goal 共享。验收需核对界面可读、输入正常及目标和 GoalBar 同步。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-19](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/README.md#L7-L19)

作者列功能与基线

<details>
<summary>查看原文（13行）</summary>

```text
为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 制作的终末地工业风工作台插件。它通过 DSH 标准 Cordis Bundle 加载，不修改 DSH 核心文件，可直接用于官方 macOS / Windows Desktop 与 Web。

## 主要功能

- 终末地风格开屏、工业网格、等高线侧栏与黄黑工业组件。
- better-sidebar 右侧工作台：文件、编辑器、浏览器、终端、Git、任务和子代理。
- `OBJECTIVE` 直接读取 DSH 原生 Goal，与 `/goal` 和 GoalBar 保持同一份状态。
- 使用 DSH 官方 Vision 附件链路，兼容浅色、深色与跟随系统三种外观。
- 修复长文本、换行、斜杠命令、选区、输入光标和右栏遮罩等可用性问题。

## 官方 Desktop 安装（推荐）

适配基线：DSH `0.2.0-rc.2`、Node.js `>=22.19.0`、`dsh-better-sidebar@0.24.1`。
```

</details>

**依据 2 · 源码核查**：[endfield-ui-plugin/client.js:451-455](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/endfield-ui-plugin/client.js#L451-L455)

明确读取原生 goal

```text
    // Native Goal projection -> dsh-better-sidebar OBJECTIVE tab.
    //
    // There is deliberately no Goal store here. Every render and mutation
    // reads the authoritative, session-scoped `goal` projection. Mutations
    // use the same CAS ref ({id, revision}) and Remote service as GoalBar.
```

#### 缺口

- 新宿主视觉兼容未实测。
  **影响**：兼顾个性化和目标可见。
  **进一步探讨**：比较原生目标与工作台。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标操作如何同步？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

读取 session 的 goal 投影，修改时读取最新目标并用含 ID 与 revision 的 ref 调用远程目标服务，失败显示错误。

#### 证据与依据

**依据 1 · 源码核查**：[endfield-ui-plugin/client.js:470-516](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/endfield-ui-plugin/client.js#L470-L516)

投影订阅与清理

<details>
<summary>查看原文（47行）</summary>

```text
    function goalFace(ctx, sessionId) {
      try {
        const binding = ctx.sessions && ctx.sessions.binding(sessionId)
        const projections = binding && binding.session && binding.session.projections
        return projections && typeof projections.faceOf === 'function'
          ? projections.faceOf('goal')
          : undefined
      } catch (e) { return undefined }
    }

    function readGoal(ctx, sessionId) {
      const face = goalFace(ctx, sessionId)
      try {
        const projection = face && typeof face.getSnapshot === 'function' ? face.getSnapshot() : undefined
        return projection == null ? projection : projection.goal
      } catch (e) { return undefined }
    }

    function useNativeGoal(ctx, sessionId) {
      const [goal, setGoal] = React.useState(() => readGoal(ctx, sessionId))
      React.useEffect(() => {
        let disposed = false
        let unsubscribe = null
        let retry = null
        let attempts = 0
        const update = () => {
          if (!disposed) setGoal(readGoal(ctx, sessionId))
        }
        const attach = () => {
          if (disposed) return
          const face = goalFace(ctx, sessionId)
          if (face && typeof face.subscribe === 'function') {
            unsubscribe = face.subscribe(update)
            update()
            return
          }
          update()
          if (attempts++ < 12) retry = setTimeout(attach, 250)
        }
        attach()
        return () => {
          disposed = true
          if (retry) clearTimeout(retry)
          if (unsubscribe) { try { unsubscribe() } catch (e) {} }
        }
      }, [ctx, sessionId])
      return goal
```

</details>

**依据 2 · 源码核查**：[endfield-ui-plugin/client.js:560-577](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/endfield-ui-plugin/client.js#L560-L577)

原生目标修改路径

<details>
<summary>查看原文（18行）</summary>

```text
        const latest = readGoal(ctx, scope.sessionId)
        if (!latest || !latest.id || latest.revision == null) {
          setError('当前会话没有可操作的 Goal')
          return false
        }
        const ref = { id: latest.id, revision: latest.revision }
        pendingRef.current = true
        setPending(true)
        setError(null)
        try {
          let result
          if (verb === 'edit') result = await ctx.remote.goals.edit(scope.sessionId, ref, { objective })
          else if (verb === 'pause') result = await ctx.remote.goals.pause(scope.sessionId, ref)
          else if (verb === 'resume') result = await ctx.remote.goals.resume(scope.sessionId, ref)
          else result = await ctx.remote.goals.clear(scope.sessionId, ref)
          if (!result || !result.ok) {
            const detail = result && result.error
            setError(detail ? `${detail.message} (${detail.code})` : 'Goal 操作失败')
```

</details>

#### 缺口

- 并发变更须核对服务返回。
  **影响**：避免维护第二份目标。
  **进一步探讨**：双窗口修改同一目标。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 主题的边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

插件的工作台依赖指定 better-sidebar，仓库还包含桌面封装和连接器。当前结论仅覆盖主题及 Goal 接入，其他组件不能由主题截图推断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-19](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/README.md#L11-L19)

依赖和版本基线

```text
- 终末地风格开屏、工业网格、等高线侧栏与黄黑工业组件。
- better-sidebar 右侧工作台：文件、编辑器、浏览器、终端、Git、任务和子代理。
- `OBJECTIVE` 直接读取 DSH 原生 Goal，与 `/goal` 和 GoalBar 保持同一份状态。
- 使用 DSH 官方 Vision 附件链路，兼容浅色、深色与跟随系统三种外观。
- 修复长文本、换行、斜杠命令、选区、输入光标和右栏遮罩等可用性问题。

## 官方 Desktop 安装（推荐）

适配基线：DSH `0.2.0-rc.2`、Node.js `>=22.19.0`、`dsh-better-sidebar@0.24.1`。
```

**依据 2 · 源码核查**：[endfield-ui-plugin/client.js:538-538](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/endfield-ui-plugin/client.js#L538-L538)

缺 Goal 能力显示不可用

```text
        React.createElement('p', null, 'Goal 工作台暂时不可用；原生 GoalBar 与 /goal 不受影响。'))
```

#### 缺口

- 附属程序独立风险待审。
  **影响**：应限定实际安装包。
  **进一步探讨**：核对 tarball 的依赖。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按作者指定宿主及 sidebar 版本安装，先固定 profile。成本含素材载入、界面回归和升级适配。退出移除主题后检查目标仍在原生服务，输入和 sidebar 可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-27](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/README.md#L17-L27)

作者安装要求

<details>
<summary>查看原文（11行）</summary>

````text
## 官方 Desktop 安装（推荐）

适配基线：DSH `0.2.0-rc.2`、Node.js `>=22.19.0`、`dsh-better-sidebar@0.24.1`。

1. 安装并至少启动一次 DeepSeek Harness 官方 Desktop。
2. 完全退出 Desktop；Windows 还需从系统托盘退出。
3. 在官方 Desktop 中使用“管理 dsh 命令…”注册或修复官方 CLI。
4. 下载 Release 中的 `rison-dsh-endfield-ui-1.1.0.tgz`，在其所在目录执行：

```bash
dsh plugin --profile desktop add dsh-better-sidebar@0.24.1 ./rison-dsh-endfield-ui-1.1.0.tgz
````

</details>

**依据 2 · 源码核查**：[endfield-ui-plugin/client.js:451-455](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/endfield-ui-plugin/client.js#L451-L455)

Goal 状态来自宿主

```text
    // Native Goal projection -> dsh-better-sidebar OBJECTIVE tab.
    //
    // There is deliberately no Goal store here. Every render and mutation
    // reads the authoritative, session-scoped `goal` projection. Mutations
    // use the same CAS ref ({id, revision}) and Remote service as GoalBar.
```

#### 缺口

- 素材授权和卸载交互未知。
  **影响**：主题停用应不改变目标数据。
  **进一步探讨**：保存目标 revision 后对账。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样否定采用？

**研究主题**：新假设与验证

#### 完整回答

比较默认主题与本主题，覆盖窄屏、长文、键盘和目标竞争。若输入被遮、目标跨会话或失败仍显示成功，则当前配置不满足任务。

#### 证据与依据

**依据 1 · 源码核查**：[endfield-ui-plugin/client.js:560-577](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/endfield-ui-plugin/client.js#L560-L577)

目标失败路径

<details>
<summary>查看原文（18行）</summary>

```text
        const latest = readGoal(ctx, scope.sessionId)
        if (!latest || !latest.id || latest.revision == null) {
          setError('当前会话没有可操作的 Goal')
          return false
        }
        const ref = { id: latest.id, revision: latest.revision }
        pendingRef.current = true
        setPending(true)
        setError(null)
        try {
          let result
          if (verb === 'edit') result = await ctx.remote.goals.edit(scope.sessionId, ref, { objective })
          else if (verb === 'pause') result = await ctx.remote.goals.pause(scope.sessionId, ref)
          else if (verb === 'resume') result = await ctx.remote.goals.resume(scope.sessionId, ref)
          else result = await ctx.remote.goals.clear(scope.sessionId, ref)
          if (!result || !result.ok) {
            const detail = result && result.error
            setError(detail ? `${detail.message} (${detail.code})` : 'Goal 操作失败')
```

</details>

**依据 2 · 作者声明**：[README.md:11-15](https://github.com/rison114514/dsh-endfield-ui/blob/d9d5c722cdb63e8c78d455af5a4896f7c3817cc8/README.md#L11-L15)

作者可用性目标

```text
- 终末地风格开屏、工业网格、等高线侧栏与黄黑工业组件。
- better-sidebar 右侧工作台：文件、编辑器、浏览器、终端、Git、任务和子代理。
- `OBJECTIVE` 直接读取 DSH 原生 Goal，与 `/goal` 和 GoalBar 保持同一份状态。
- 使用 DSH 官方 Vision 附件链路，兼容浅色、深色与跟随系统三种外观。
- 修复长文本、换行、斜杠命令、选区、输入光标和右栏遮罩等可用性问题。
```

#### 缺口

- 未运行实际 GUI。
  **影响**：外观与数据正确性分别验收。
  **进一步探讨**：保留两端目标与截图。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
