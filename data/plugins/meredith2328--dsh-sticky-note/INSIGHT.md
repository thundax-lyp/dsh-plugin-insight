# dsh-sticky-note

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[fb36ba7](https://github.com/Meredith2328/dsh-sticky-note/tree/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Meredith2328/dsh-sticky-note)
<!-- END META -->

> **功能**：在DSH对话内保存Markdown便签并送入当前输入框，带历史、归档与自动清理。

> **亮点**：[Q02](#research-q02)对话内保存与草稿；[Q03](#research-q03)普通文件归档；[Q04](#research-q04)真实当前输入框接线。

> **主要限制**：[Q02](#research-q02)保存非跨进程事务；[Q03](#research-q03)旧mtime回收站可同轮删除；[Q04](#research-q04)直接发送替换草稿与Host身份边界。

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
  - [Q01 · 它替谁解决何种问题，当前包和npm同名项目是否一致？](#detail-section-11)
  - [Q02 · 输入如何落到文件和草稿，保存成功能保证什么？](#detail-section-12)
  - [Q03 · 清理/归档/保留和恢复怎样真实作用于文件？](#detail-section-13)
  - [Q04 · 发送和文件访问的身份与副作用到哪里为止？](#detail-section-14)
  - [Q05 · 何时值得试用，什么方向能比继续加UI更有价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是MIT的DSH原生便签插件0.6.1，针对对话时临时记点子/感想/TODO的人，把普通Markdown文件记录、历史查看与当前输入框连接。最低DSH0.2.0-rc.2且排除0.3预发布，客户端依赖connection/slots/workspace与React，服务端依赖connection和可选settings；Host兼容和作者声称的0.2.1-rc.5实测本轮没有复现。

README明确npm同名包不是本项目，应按固定GitHub源归属；材料中的npm1.0.0与171次下载不能当本插件版本或采用证明。相比文本编辑器+目录/剪贴板，贡献是对话内低切换记录与可带走.md文件，成功标准是内容真实读回、不会误删/发错会话，而不是TODO标签已实现任务分工或生产率提升。

普通文本编辑器/Markdown目录+备份+人工复制到会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 保存 | 普通.md便签 | 非原子/跨进程锁 |
| 历史/归档 | 查看/恢复 | rename覆盖/清理需核 |
| 发送 | 当前输入框 | 默认直接submit非完成回执 |
| 清理 | 超龄移除 | 旧mtime可同轮删除 |

**流程与依赖**

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH0.2范围 | 必需 | Host加载/设置 | 本轮未运行 |
| connection/slots/React | UI必需 | RPC/输入 | Host权限继承 |
| 可写目录/备份 | 必需 | .md与恢复 | 无原子版本保证 |
| 系统打开程序 | 可选 | 文件查看 | spawn非查看成功 |

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 来源 | 固定GitHub/Host版本 | 非npm同名包 |
| 配置 | 关清理/备份/append | 不用真实敏感便签 |
| 样例 | 保存/读回/切会话 | 比文件与输入 |
| 退出 | 停用/留备份 | 删除不可回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/存储未知 | 核来源/备份 | 未安装 |
| 持续 | 磁盘/图片网络/发送模型未知 | 整理/核会话 | 无净节时实测 |
| 故障 | 恢复资源未知 | 对账/备份恢复 | 删除不可逆 |
| 退出 | 留存费用未知 | 迁移普通.md | 不自动删除旧文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 临记 | 真写.md | 不丢失/净节时 |
| 整理 | 真归档/清理 | 30天入站保护 |
| 发送 | 真setDraft/submit | 服务端接受/完成 |

> **思考**：[Q02](#research-q02)保存非跨进程事务；[Q03](#research-q03)旧mtime回收站可同轮删除；[Q04](#research-q04)直接发送替换草稿与Host身份边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)对话内保存与草稿；[Q03](#research-q03)普通文件归档；[Q04](#research-q04)真实当前输入框接线。

[Q02](#research-q02)进程内队列非跨进程锁/原子保存；[Q03](#research-q03)真实mtime清理与错误吞下；[Q04](#research-q04)Host继承身份需另核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)保存非跨进程事务；[Q03](#research-q03)旧mtime回收站可同轮删除；[Q04](#research-q04)直接发送替换草稿与Host身份边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)低敏私人Host受限试用；先关清理、备份、append并核实际读回。

README明确npm同名包不是本项目，应按固定GitHub源归属；材料中的npm1.0.0与171次下载不能当本插件版本或采用证明。相比文本编辑器+目录/剪贴板，贡献是对话内低切换记录与可带走.md文件，成功标准是内容真实读回、不会误删/发错会话，而不是TODO标签已实现任务分工或生产率提升。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

真实保存/输入框接线可追，可靠性与清理边界显著，仅低敏受限试用。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项source；核当前包/作者声明、Host与client加载、RPC/设置、保存/指针/队列/真实文件操作、清理/归档/恢复、当前输入框发送、代表Markdown路径；未全审所有UI/测试/Host外围。
- 下一步：只读固定源码；未安装、运行目标/测试/Host/浏览器/模型，无独立兼容、效果、恢复与安全实测。

**分析版本**

- **仓库**：[Meredith2328/dsh-sticky-note](https://github.com/Meredith2328/dsh-sticky-note)
- **版本号**：0.6.1（[固定提交 fb36ba7](https://github.com/Meredith2328/dsh-sticky-note/tree/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)先比较备份/append清单，再验证保存版本、入站时间与发送目标回执。

只读固定源码；未安装、运行目标/测试/Host/浏览器/模型，无独立兼容、效果、恢复与安全实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 173 | — | — | 2182 |
| .mjs | source | 4 | 598 | 547 | 4 | — |
| .js | source | 2 | 3010 | 2749 | 181 | — |
| .js | test | 3 | 693 | 612 | 34 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Meredith2328/dsh-sticky-note/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分对话内便签UI、真实保存/删除/发送及Host权限边界，给出受限采用和可证伪改进方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它替谁解决何种问题，当前包和npm同名项目是否一致？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是MIT的DSH原生便签插件0.6.1，针对对话时临时记点子/感想/TODO的人，把普通Markdown文件记录、历史查看与当前输入框连接。最低DSH0.2.0-rc.2且排除0.3预发布，客户端依赖connection/slots/workspace与React，服务端依赖connection和可选settings；Host兼容和作者声称的0.2.1-rc.5实测本轮没有复现。

README明确npm同名包不是本项目，应按固定GitHub源归属；材料中的npm1.0.0与171次下载不能当本插件版本或采用证明。相比文本编辑器+目录/剪贴板，贡献是对话内低切换记录与可带走.md文件，成功标准是内容真实读回、不会误删/发错会话，而不是TODO标签已实现任务分工或生产率提升。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-12](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/package.json#L1-L12)

实际版本/MIT/DSH范围/入口。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-sticky-note",
  "description": "左下角便签：随手记点子/感想/TODO，实时保存到归档目录，清单+悬浮归档",
  "version": "0.6.1",
  "license": "MIT",
  "author": "Meredith2328",
  "email": "111104745+Meredith2328@users.noreply.github.com",
  "engines": {
    "dsh": ">=0.2.0-rc.2 <0.3.0-0"
  },
  "type": "module",
  "main": "lib/index.js",
```

</details>

**依据 2 · 源码核查**：[package.json:29-69](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/package.json#L29-L69)

客户端与Host依赖声明。

<details>
<summary>查看原文（41行）</summary>

```text
    "runtime": "host",
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-plugin-manager",
        "@deepseek-ai/dsh-client-ui-workspace"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1-rc.1",
    "@deepseek-ai/dsh-settings": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-connection": "*",
    "@deepseek-ai/dsh-client-ui-conversation": "*",
    "@deepseek-ai/dsh-client-ui-plugin-manager": "*",
    "@deepseek-ai/dsh-client-ui-slots": "*",
    "@deepseek-ai/dsh-client-ui-workspace": "*",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": { "optional": true },
    "@deepseek-ai/dsh-settings": { "optional": true },
    "@deepseek-ai/dsh-client-connection": { "optional": true },
    "@deepseek-ai/dsh-client-ui-conversation": { "optional": true },
    "@deepseek-ai/dsh-client-ui-plugin-manager": { "optional": true },
    "@deepseek-ai/dsh-client-ui-slots": { "optional": true },
    "@deepseek-ai/dsh-client-ui-workspace": { "optional": true },
    "react": { "optional": true }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4"
  },
  "devDependencies": {
    "vitest": "3.2.4"
  },
  "files": [
```

</details>

**依据 3 · 作者声明**：[README.md:30-44](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/README.md#L30-L44)

安装源与同名npm归属。

<details>
<summary>查看原文（15行）</summary>

````text

```sh
dsh plugin --profile web add github:Meredith2328/dsh-sticky-note
```

或本地目录：

```sh
dsh plugin --profile web add file:/path/to/dsh-sticky-note
```

安装后重启 DSH（Web 或 Desktop）。

> 请不要使用裸包名 `dsh plugin ... add dsh-sticky-note`；npm 上的同名包不是本项目。

````

</details>

**依据 4 · 作者声明**：[README.md:46-76](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/README.md#L46-L76)

作者兼容范围与实测自报。

<details>
<summary>查看原文（31行）</summary>

````text

安装前可先运行 `dsh --version`，再按实际 DSH 版本选择插件：

| 便签版本 | 支持的 DSH 版本 | 建议 | 说明 |
|---|---|---|---|
| **v0.6.1（当前）** | `0.2.x`，最低 `0.2.0-rc.2` | ✅ 推荐 | 已验证至 `0.2.1-rc.5`；声明 `engines.dsh`，由 DSH 自动拦截不兼容版本 |
| v0.6.0 | `0.2.x`，最低 `0.2.0-rc.2` | 可用 | 已验证 `0.2.0-rc.2` 和 `0.2.1-rc.5`；未声明 `engines.dsh` |
| v0.5.0 / v0.2.4 | `0.1.0-rc.7` ~ `0.1.6-alpha.2` | 旧版 DSH | 使用旧版 settings 接缝，不兼容 DSH `0.2.x` |
| v0.2.2 ~ v0.2.3 | `0.1.0-rc.7` ~ `0.1.1-rc.2` | 旧版 DSH | 仅用于更早的 DSH 环境 |

当前 `v0.6.1` 的机器可读范围为：

```json
"engines": {
  "dsh": ">=0.2.0-rc.2 <0.3.0-0"
}
```

上面的上界包含用于排除 `0.3.0` 预发布版的技术哨兵，实际含义是“只接受 `0.2.x`”。DSH `0.2.1` 及以后会优先读取这个字段；不匹配时，插件管理器会在导入插件代码前拒绝安装或加载。DSH `0.2.0` 仍可回退使用 `peerDependencies` 中的版本范围。因此正常使用匹配版本时，不需要手工修改 `package.json` 或 profile 配置。

首次加载时，设置值来自插件的 `Config` 默认值；用户保存设置后，插件会自动把条目以 `dsh-sticky-note` 为 id 写入当前 profile 的 `cordis.patch.yml`。Read/Write、RPC 和插件详情页配置插槽继续沿用 DSH `0.2` 的接口。

本次兼容性检查在全新的 DSH `0.2.1-rc.5` Web profile 中完成：插件可安装并正常加载，便签按钮和面板可用，保存后重新打开能读回内容，设置页读写会正确落到 profile patch；浏览器控制台、页面脚本和 HTTP 请求均无报错。仓库的自动化测试也全部通过。

## 🗂️ 存储结构

```
<root>/
├── 点子/    ← 以时间戳命名的 .md 文件
├── 感想/
├── TODO/
````

</details>

**依据 5 · 源码核查**：[lib/client.js:2253-2289](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/client.js#L2253-L2289)

真实输入/设置插槽及RPC调用。

<details>
<summary>查看原文（37行）</summary>

```text
    function apply(ctx) {
      const disposeStyle = installStyles()
      const connection = ctx.get('connection')
      if (connection === undefined) return
      const call = (endpoint, payload) => connection.rpc.call(
        '/api', 'dsh-sticky-note/call', { endpoint, payload: payload || {} },
      ).catch(() => connection.rpc.call(CHANNEL, endpoint, payload || {}))
      const rpc = (endpoint, payload) => call(endpoint, payload).then((result) => {
        if (!result.ok) {
          const error = result.error || {}
          throw new Error(error.message || (typeof error.details === 'string' ? error.details : error.code) || 'rpc failed')
        }
        return result.value
      })
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('conversation.input.left', () => slots.register(
        { name: 'conversation.input.left', id: 'sticky-note', order: 20 },
        (zoneProps) => React.createElement(StickyNoteApp, {
          rpc,
          inputActions: (zoneProps && zoneProps.inputActions) || null,
          useInput: (zoneProps && zoneProps.useInput) || null,
        }),
      ))
      const settingsCard = () => React.createElement(SettingsCard, {
        rpc,
        workspaces: ctx.get('uiWorkspace'),
      })
      slots.inject('plugins.bundle.config', () => slots.register(
        // 外部包的设置页收口在插件管理器：key 必须是包名。
        { name: 'plugins.bundle.config', key: 'dsh-sticky-note' },
        ({ view }) => view === 'page' ? settingsCard() : null,
      ))
      ctx.effect(() => disposeStyle, 'dsh-sticky-note: styles')
    }

    // 浏览器 Loader 会按此声明创建可见服务的 Cordis fiber。
```

</details>

#### 缺口

- 当前Host兼容、真实用户需求/读回和作者测试未独立验证。
  **影响**：不能把npm元数据/自报实测当本仓运行和采用证明。
  **进一步探讨**：固定Git源低敏样例比较普通Markdown编辑器，核Host版本和读回。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入如何落到文件和草稿，保存成功能保证什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端在编辑后700ms安排save，另在面板打开且间隔>0时周期保存，Ctrl+S立即请求；关闭/卸载清计时器不等于保证最后未发出的编辑落盘。RPC先走/api，传输reject才退独立channel；服务端save/new/clear/draft共用进程内Promise队列，同文件更新也串行比较后writeFile，内容未变不刷新mtime。它不提供跨进程锁、原子临时rename或版本冲突检查。

save复用当前类别草稿，否则用秒级时间命名；写正文后才写草稿指针，指针失败会返回错误但正文可能已经写入，不能盲当全失败。新建只清指针，清空会直接rm当前文件而非进回收站，rm错误被吞仍成功；恢复读取失败也清指针，不区分暂时权限错误。currentDraft/DSH_HOME指针为模块/宿主全局，未按会话或用户分区，多面板共享和多进程冲突未验证。秒级命名没有wx去重保护，同秒新建可能撞名；不要把成功RPC当独立备份。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1325-1349](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/client.js#L1325-L1349)

卸载清计时器/选项恢复草稿。

<details>
<summary>查看原文（25行）</summary>

```text
        }).catch(() => {})
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current)
          if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current)
          if (saveTimerRef.current) clearInterval(saveTimerRef.current)
        }
      }, [])

      // 仅在用户主动开启时恢复宿主记录的当前草稿；“+”仍显式开启新便签。
      React.useEffect(() => {
        if (!open || !resumeDraft) return
        let cancelled = false
        rpc('draft', {}).then((draft) => {
          if (cancelled || !draft || typeof draft.content !== 'string') return
          setText(draft.content)
          textRef.current = draft.content
          if (draft.kind && ['点子', '感想', 'TODO'].includes(draft.kind)) {
            setKind(draft.kind)
            kindRef.current = draft.kind
          }
          setView('edit')
          setStatus('继续上次草稿')
        }).catch(() => {})
        return () => { cancelled = true }
      }, [open, resumeDraft])
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1372-1388](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/client.js#L1372-L1388)

打开面板才周期保存，失败吞下。

<details>
<summary>查看原文（17行）</summary>

```text
      // 自动保存定时器：按配置间隔定时保存当前内容（面板关闭或间隔 0 = 不跑，避免后台常驻写盘）
      React.useEffect(() => {
        if (!open || saveInterval <= 0) {
          if (saveTimerRef.current) clearInterval(saveTimerRef.current)
          return
        }
        if (saveTimerRef.current) clearInterval(saveTimerRef.current)
        saveTimerRef.current = setInterval(() => {
          const content = textRef.current
          if (content && content.trim()) {
            rpc('save', { kind: kindRef.current, content }).catch(() => {})
          }
        }, saveInterval * 1000)
        return () => {
          if (saveTimerRef.current) clearInterval(saveTimerRef.current)
        }
      }, [open, saveInterval])
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1425-1450](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/client.js#L1425-L1450)

700ms保存、清空请求、立即保存与失败状态。

<details>
<summary>查看原文（26行）</summary>

```text
      function scheduleSave(payload) {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          rpc('save', payload).then(() => {
            setStatus('✓ ' + new Date().toLocaleTimeString('zh-CN', { hour12: false }))
          }).catch(() => setStatus('保存失败'))
        }, 700)
      }

      // 内容被清空：删除当前草稿文件（避免残留旧内容）
      function scheduleClear() {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          rpc('clear', {}).catch(() => {})
        }, 700)
      }

      function saveNow() {
        if (timerRef.current) clearTimeout(timerRef.current)
        const content = textRef.current
        if (!content.trim()) { setStatus('空，未保存'); return }
        rpc('save', { kind: kindRef.current, content }).then(() => {
          setStatus('✓ ' + new Date().toLocaleTimeString('zh-CN', { hour12: false }) + ' (Ctrl+S)')
        }).catch(() => setStatus('保存失败'))
      }

```

</details>

**依据 4 · 源码核查**：[lib/index.js:329-405](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L329-L405)

共享草稿指针/进程内队列与真实writeFile。

<details>
<summary>查看原文（77行）</summary>

```text
let currentDraft = null
let draftOperations = Promise.resolve()
const pendingWrites = new Map()

async function readDraftPointer() {
  try {
    let raw = await readFile(DRAFT_PATH, 'utf8')
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1)
    const value = JSON.parse(raw)
    if (value && TYPES.includes(value.kind) && typeof value.name === 'string'
        && value.name && !/[\\/]|\.\./.test(value.name)) {
      return { kind: value.kind, name: value.name }
    }
  } catch (e) { /* no resumable draft */ }
  return null
}

async function writeDraftPointer(value) {
  await mkdir(DSH_HOME, { recursive: true })
  await writeFile(DRAFT_PATH, JSON.stringify(value, null, 2), 'utf8')
}

async function clearDraftPointer() {
  await rm(DRAFT_PATH, { force: true })
}

function enqueueDraft(operation) {
  const task = draftOperations.catch(() => {}).then(operation)
  draftOperations = task
  return task
}

function enqueuePath(path, operation) {
  const previous = pendingWrites.get(path) || Promise.resolve()
  const task = previous.catch(() => {}).then(operation)
  pendingWrites.set(path, task)
  const cleanup = () => {
    if (pendingWrites.get(path) === task) pendingWrites.delete(path)
  }
  // 同时注册成功/失败处理，避免 finally() 派生出无人接收的 rejection。
  task.then(cleanup, cleanup)
  return task
}

// 同一路径串行比较后再写：保留原始文本，同时避免自动保存反复刷新 mtime。
function writeIfChanged(path, content) {
  return enqueuePath(path, async () => {
    try {
      if (await readFile(path, 'utf8') === content) return false
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error
    }
    await writeFile(path, content, 'utf8')
    return true
  })
}

async function saveNote(args) {
  const kind = args && args.kind
  if (!TYPES.includes(kind)) return { ok: false, error: 'invalid kind' }
  const content = args && typeof args.content === 'string' ? args.content : ''
  if (!content.trim()) return { ok: false, error: 'empty' }
  const root = await rootOf()
  await ensureSubdirs(root)
  // 若当前草稿属于同一类别，覆盖同一文件；否则新建文件并记住指针
  let name
  if (currentDraft && currentDraft.kind === kind && currentDraft.name) {
    name = currentDraft.name
  } else {
    name = safeName(kind)
    currentDraft = { kind, name }
  }
  const changed = await writeIfChanged(join(root, kind, name), content)
  await writeDraftPointer(currentDraft)
  return { ok: true, name, kind, changed }
}

```

</details>

**依据 5 · 源码核查**：[lib/index.js:305-312](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L305-L312)

文件名仅秒级时间。

```text
function safeName(kind) {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const ts = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds())
  return ts + (kind === 'TODO' ? '-todo' : '') + '.md'
}

// 从文件名时间戳（YYYYMMDD-HHMMSS.md）生成紧凑显示文本：
```

**依据 6 · 源码核查**：[lib/index.js:407-460](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L407-L460)

读草稿失败清指针/新建及清空实际删除。

<details>
<summary>查看原文（54行）</summary>

```text
async function readCurrentDraft() {
  if (!currentDraft) currentDraft = await readDraftPointer()
  if (!currentDraft) return { ok: true, draft: null }
  const { kind, name } = currentDraft
  const root = await rootOf()
  try {
    const content = await readFile(join(root, kind, name), 'utf8')
    return { ok: true, draft: { kind, name, content } }
  } catch (e) {
    currentDraft = null
    await clearDraftPointer()
    return { ok: true, draft: null }
  }
}

// 更新指定历史便签文件（查看/编辑后保存）
async function updateNote(args) {
  const kind = args && args.kind
  const name = args && args.name
  const content = args && typeof args.content === 'string' ? args.content : ''
  if (!TYPES.includes(kind) || !name) return { ok: false, error: 'invalid args' }
  if (/[\\/]|\.\./.test(name)) return { ok: false, error: 'bad name' }
  if (!content.trim()) return { ok: false, error: 'empty' }
  const root = await rootOf()
  await ensureSubdirs(root)
  const changed = await writeIfChanged(join(root, kind, name), content)
  return { ok: true, name, kind, changed }
}

// 显式新建：清空草稿指针，下次保存落到新文件
async function newNote() {
  currentDraft = null
  await clearDraftPointer()
  return { ok: true }
}

// 内容清空：删除当前草稿文件并重置指针（不再残留空/旧内容）
async function clearDraft() {
  if (!currentDraft || !currentDraft.name) {
    await clearDraftPointer()
    return { ok: true }
  }
  const { kind, name } = currentDraft
  currentDraft = null
  await clearDraftPointer()
  if (!TYPES.includes(kind)) return { ok: true }
  if (/[\\/]|\.\./.test(name)) return { ok: true }
  const root = await rootOf()
  const path = join(root, kind, name)
  try {
    await enqueuePath(path, () => rm(path, { force: true }))
  } catch (e) { /* file already gone — fine */ }
  return { ok: true }
}
```

</details>

**依据 7 · 源码核查**：[lib/index.js:515-542](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L515-L542)

handler真实队列接线。

<details>
<summary>查看原文（28行）</summary>

```text
async function handler(endpoint, payload) {
  try {
    switch (endpoint) {
      case 'list': {
        const data = await listNotes()
        return { ok: true, value: data }
      }
      case 'save': {
        const r = await enqueueDraft(() => saveNote(payload))
        return r.ok ? { ok: true, value: { name: r.name, kind: r.kind, changed: r.changed } } : { ok: false, error: { code: 'bad', details: r.error } }
      }
      case 'update': {
        const r = await updateNote(payload)
        return r.ok ? { ok: true, value: { name: r.name, kind: r.kind, changed: r.changed } } : { ok: false, error: { code: 'bad', details: r.error } }
      }
      case 'new': {
        const r = await enqueueDraft(() => newNote())
        return { ok: true, value: {} }
      }
      case 'clear': {
        const r = await enqueueDraft(() => clearDraft())
        return { ok: true, value: {} }
      }
      case 'draft': {
        const r = await enqueueDraft(() => readCurrentDraft())
        return { ok: true, value: r.draft }
      }
      case 'read': {
```

</details>

#### 缺口

- 断电/关闭最后编辑、多窗口/跨进程冲突、同秒重名和文件/指针部分失败未测。
  **影响**：自动保存不等于不丢数据或多用户隔离；应保留备份。
  **进一步探讨**：可丢弃样例测最后编辑关闭、只读目录、并发与同秒新建，按实际文件核。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 清理/归档/保留和恢复怎样真实作用于文件？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

默认clearAfter=7天，list和加载后/每小时任务触发清理；活跃三类中按mtime超龄、非.keep且未保留文件rename到已清除，然后同次遍历回收站，以文件mtime超过30天rm。rename未显式重置mtime，因此不是进入回收站再保留30天；已超30天文件可能同次直接删除，clearAfter=0也仍跑回收站删除。应先关闭清理并备份再用，不能把回收站当保护期保证。

归档文件加类别前缀rename，恢复剥前缀rename回原目录；归档目录不属于主动清理三类，保留键按类别/原名在归档中仍识别。保留JSON读错回空，写为直接writeFile无跨调用锁，损坏/并发时保留语义不能保证。移动目标重名先直接rename、仅异常才加时间戳重试，在允许覆盖的系统上不能保证避免覆盖。清理大量错误吞下，查看列表本身也有删除副作用；卸载只清定时器不回滚已移动/删除文件，退出须留目录与备份。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:23-43](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L23-L43)

回收站30天、自动清理7天默认。

<details>
<summary>查看原文（21行）</summary>

```text
// 回收站：自动清除的便签先移入这里，超过 TRASH_KEEP_DAYS 天才真正删除
const TRASH_DIR = '已清除'
const TRASH_KEEP_DAYS = 30
const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
const CONFIG_PATH = join(DSH_HOME, 'sticky-note-config.json')
const DRAFT_PATH = join(DSH_HOME, 'sticky-note-draft.json')
const RETAINED_PATH = join(DSH_HOME, 'sticky-note-retained.json')
// 默认存储路径：DSH 目录下插件专属文件夹（用户已配置的路径保留在配置文件中，优先于默认值）
const DEFAULT_ROOT = join(DSH_HOME, 'sticky-notes')
// 默认查看模式：inline = 便签内显示完整内容；file = 用系统默认程序打开文件
const DEFAULT_VIEW_MODE = 'inline'
// 自动保存间隔（秒）：10 秒 / 1 分钟 / 5 分钟 / 0 = 不自动保存
const DEFAULT_SAVE_INTERVAL = 10
// 自动清除（天）：1 / 3 / 7 / 0 = 永久不清除
const DEFAULT_CLEAR_AFTER = 7
// 默认类别
const DEFAULT_KIND = '点子'
// 发送模式：send = 直接发出；append = 添加到输入框末尾
const DEFAULT_SEND_MODE = 'send'
// 默认不恢复草稿，保持既有打开行为；用户可在插件设置中主动开启。
const DEFAULT_RESUME_DRAFT = false
```

</details>

**依据 2 · 源码核查**：[lib/index.js:140-153](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L140-L153)

保留JSON读错回空/直接写。

<details>
<summary>查看原文（14行）</summary>

```text
async function readRetained() {
  try {
    let raw = await readFile(RETAINED_PATH, 'utf8')
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1)
    const j = JSON.parse(raw)
    if (Array.isArray(j)) return j.filter((x) => typeof x === 'string')
  } catch (e) { /* fall through */ }
  return []
}
async function writeRetained(list) {
  const dir = RETAINED_PATH.slice(0, Math.max(RETAINED_PATH.lastIndexOf('\\'), RETAINED_PATH.lastIndexOf('/')))
  await mkdir(dir, { recursive: true })
  await writeFile(RETAINED_PATH, JSON.stringify(list, null, 2), 'utf8')
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:199-254](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L199-L254)

实际超龄rename/同轮mtime删除与保留键清理。

<details>
<summary>查看原文（56行）</summary>

```text
async function cleanupExpired(root, cfg, retained) {
  const now = Date.now()
  if (cfg.clearAfter > 0) {
    for (const sub of TYPES) {
      let entries = []
      try {
        entries = await readdir(join(root, sub), { withFileTypes: true })
      } catch (e) { continue }
      for (const ent of entries) {
        if (!ent.isFile() || ent.name.endsWith('.keep')) continue
        if (retained.includes(noteKey(sub, ent.name))) continue
        let mtimeMs = 0
        try { mtimeMs = (await stat(join(root, sub, ent.name))).mtimeMs } catch (e) { continue }
        if ((now - mtimeMs) / 86400000 <= cfg.clearAfter) continue
        // 目标重名时追加时间戳前缀，避免 Windows 上 rename 覆盖失败
        try {
          await rename(join(root, sub, ent.name), join(root, TRASH_DIR, ent.name))
        } catch (e) {
          try {
            await rename(join(root, sub, ent.name), join(root, TRASH_DIR, Date.now() + '-' + ent.name))
          } catch (e2) { /* ignore */ }
        }
      }
    }
  }
  let trash = []
  try {
    trash = await readdir(join(root, TRASH_DIR), { withFileTypes: true })
  } catch (e) { trash = [] }
  for (const ent of trash) {
    if (!ent.isFile()) continue
    try {
      const mtimeMs = (await stat(join(root, TRASH_DIR, ent.name))).mtimeMs
      if ((now - mtimeMs) / 86400000 > TRASH_KEEP_DAYS) {
        await rm(join(root, TRASH_DIR, ent.name), { force: true })
      }
    } catch (e) { /* ignore */ }
  }
  // 现存便签键集合：活跃目录 + 归档目录的文件剥掉「类别-」前缀映射回原键。
  // 保留标记跟随便签身份（类别/原始文件名）而非位置——归档期间标记保留，
  // 恢复后依然生效，不会被这里的 prune 当脏键误删（归档/恢复本身不写 retained）
  const existing = new Set()
  for (const sub of TYPES) {
    let names = []
    try { names = await readdir(join(root, sub)) } catch (e) { continue }
    for (const name of names) existing.add(noteKey(sub, name))
  }
  let archived = []
  try { archived = await readdir(join(root, '归档')) } catch (e) { archived = [] }
  for (const name of archived) {
    const m = /^(点子|感想|TODO)-(.+)$/.exec(name)
    if (m) existing.add(noteKey(m[1], m[2]))
  }
  const pruned = retained.filter((k) => existing.has(k))
  if (pruned.length !== retained.length) await writeRetained(pruned)
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:256-262](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L256-L262)

list真实触发清理。

```text
async function listNotes() {
  const root = await rootOf()
  await ensureSubdirs(root)
  const cfg = await readConfig()
  let retained = await readRetained()
  await cleanupExpired(root, cfg, retained)
  retained = await readRetained()
```

**依据 5 · 源码核查**：[lib/index.js:498-512](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L498-L512)

归档真实rename。

<details>
<summary>查看原文（15行）</summary>

```text
async function archiveNote(args) {
  const kind = args && args.kind
  const name = args && args.name
  if (!TYPES.includes(kind) || !name) return { ok: false, error: 'invalid args' }
  if (/[\\/]|\.\./.test(name)) return { ok: false, error: 'bad name' }
  const root = await rootOf()
  await ensureSubdirs(root)
  const src = join(root, kind, name)
  const dst = join(root, '归档', kind + '-' + name)
  try {
    await rename(src, dst)
  } catch (e) {
    return { ok: false, error: 'move failed: ' + (e && e.message) }
  }
  return { ok: true, name, kind }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:549-567](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L549-L567)

恢复真实rename回类别。

<details>
<summary>查看原文（19行）</summary>

```text
      }
      case 'restore': {
        // 从归档恢复：归档文件名带「类别-」前缀，剥掉前缀移回原类别目录
        const name = payload && payload.name
        if (!name || /[\\/]|\.\./.test(name)) return { ok: false, error: { code: 'bad', details: 'bad name' } }
        const idx = name.indexOf('-')
        if (idx <= 0) return { ok: false, error: { code: 'bad', details: 'bad name' } }
        const kind = name.slice(0, idx)
        const orig = name.slice(idx + 1)
        if (!TYPES.includes(kind) || !orig) return { ok: false, error: { code: 'bad', details: 'bad name' } }
        const root = await rootOf()
        await ensureSubdirs(root)
        try {
          await rename(join(root, '归档', name), join(root, kind, orig))
        } catch (e) {
          return { ok: false, error: { code: 'bad', details: 'move failed: ' + (e && e.message) } }
        }
        return { ok: true, value: { name: orig, kind } }
      }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:687-700](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L687-L700)

加载即跑/每小时清理及卸载timer清除。

<details>
<summary>查看原文（14行）</summary>

```text
  // 定时清理跟随插件 fiber 的生命周期，支持插件热卸载。
  ctx.effect(() => {
    const run = () => {
      rootOf().then(async (root) => {
        await ensureSubdirs(root)
        const cfg = await readConfig()
        const retained = await readRetained()
        await cleanupExpired(root, cfg, retained)
      }).catch(() => {})
    }
    run()
    const timer = setInterval(run, 60 * 60 * 1000)
    return () => clearInterval(timer)
  }, 'dsh-sticky-note: cleanup timer')
```

</details>

#### 缺口

- 跨系统rename覆盖、保留损坏/并发、旧文件同轮清除实际行为未运行验证。
  **影响**：源码支持显著丢失边界，作者“回收站保留30天”不能按入站计时解释。
  **进一步探讨**：先clearAfter=0并另备份；可丢弃旧mtime/同名文件测清理和恢复，不用真实资料。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 发送和文件访问的身份与副作用到哪里为止？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

send默认直接发出：真实调用当前输入槽inputActions.setDraft(content.trim())后submit()；append取现有草稿拼接再setDraft，不调用submit。直接发送会替换当前输入框，未见这段等待服务端接受/模型完成的回执或失败补偿。发送是用户按按钮触发而非自动模型任务，但需核当前会话，先用append避免误覆盖/误发；进入Host后模型费用和下游工具副作用由Host治理。

服务端handler检查类别和文件名的斜杠/..，root却允许配置任意非空路径，未做realpath/所有权限制；各RPC无本地principal或会话校验，精确POST Fetch/RPC认证继承Host，外围未审，不能声称公网无认证已证漏洞，也不能宣称用户隔离。open/openRoot真实spawn系统默认打开程序，spawn事件成功不等于用户已看到正确文件。Markdown先转义HTML，再仅接受http(s)图片/链接；可触发外部图片请求，非离线隐私保证，完整渲染安全未审。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:575-585](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L575-L585)

root非空字符串直接设置。

<details>
<summary>查看原文（11行）</summary>

```text
        if (payload && typeof payload.root === 'string' && payload.root.trim()) next.root = payload.root.trim()
        if (payload && payload.viewMode === 'file') next.viewMode = 'file'
        if (payload && payload.viewMode === 'inline') next.viewMode = 'inline'
        if (payload && [0, 10, 60, 300].includes(payload.saveInterval)) next.saveInterval = payload.saveInterval
        if (payload && [0, 1, 3, 7].includes(payload.clearAfter)) next.clearAfter = payload.clearAfter
        if (payload && TYPES.includes(payload.defaultKind)) next.defaultKind = payload.defaultKind
        if (payload && (payload.sendMode === 'send' || payload.sendMode === 'append')) next.sendMode = payload.sendMode
        if (payload && typeof payload.resumeDraft === 'boolean') next.resumeDraft = payload.resumeDraft
        if (payload && (payload.root !== undefined || payload.viewMode !== undefined || payload.saveInterval !== undefined || payload.clearAfter !== undefined || payload.defaultKind !== undefined || payload.sendMode !== undefined || payload.resumeDraft !== undefined)) {
          await writeConfig(next)
        }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:484-496](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L484-L496)

read类别/文件名校验后真实读取。

<details>
<summary>查看原文（13行）</summary>

```text
async function readNote(args) {
  const kind = args && args.kind
  const name = args && args.name
  if (![...TYPES, '归档'].includes(kind) || !name) return { ok: false, error: 'invalid args' }
  if (/[\\/]|\.\./.test(name)) return { ok: false, error: 'bad name' }
  const root = await rootOf()
  try {
    const content = await readFile(join(root, kind, name), 'utf8')
    return { ok: true, content, name, kind }
  } catch (e) {
    return { ok: false, error: 'read failed: ' + (e && e.message) }
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:163-188](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L163-L188)

真实系统程序spawn及返回意义。

<details>
<summary>查看原文（26行）</summary>

```text
function openFileWithSystem(absPath) {
  const platform = process.platform
  let cmd
  let args
  if (platform === 'win32') {
    // 不走 cmd /c start：参数经 cmd 拼接时路径里的特殊字符（& 等）会被解释，
    // explorer 直接接收参数数组，天然规避注入与引号问题（文件用默认程序打开）
    cmd = 'explorer'
    args = [absPath]
  } else if (platform === 'darwin') {
    cmd = 'open'
    args = [absPath]
  } else {
    // linux / 其他 unix
    cmd = 'xdg-open'
    args = [absPath]
  }
  return new Promise((resolve) => {
    try {
      const child = spawn(cmd, args, { detached: true, stdio: 'ignore' })
      child.on('error', () => resolve({ ok: false }))
      child.on('spawn', () => resolve({ ok: true }))
    } catch (e) {
      resolve({ ok: false })
    }
  })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:631-684](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L631-L684)

Fetch封包/实际注册与RPC回退，无handler用户身份字段。

<details>
<summary>查看原文（54行）</summary>

```text
async function handleApiRequest(request) {
  let body
  try {
    body = await request.json()
  } catch (e) {
    body = null
  }
  const rpcId = body && typeof body.rpcId === 'string' ? body.rpcId : 'invalid-request'
  if (!body || body.type !== 'client-request' || body.method !== RPC_ENDPOINT
      || !body.payload || typeof body.payload !== 'object') {
    return Response.json({
      type: 'server-response',
      rpcId,
      result: {
        ok: false,
        error: { code: 'bad-request', message: 'invalid sticky-note request', details: {} },
      },
    })
  }
  const endpoint = body.payload.endpoint
  const payload = body.payload.payload
  const result = typeof endpoint === 'string'
    ? await handler(endpoint, payload && typeof payload === 'object' ? payload : {})
    : { ok: false, error: { code: 'bad-request', details: 'invalid endpoint' } }
  return Response.json({ type: 'server-response', rpcId, result: normalizeRpcResult(result) })
}

export function apply(ctx, config) {
  // Loader 把本插件条目的 Config（volatile 引用）作为第二参数下发，读配置直接看它。
  activeConfig = config || null
  let writer = null
  // settings 服务只在这里接入：它负责把表单编辑写回 profile patch，
  // 并带上本插件条目自己的设置页策略（自带设置卡片，不用自动生成的表单）。
  ctx.inject(['settings'], (child) => {
    const entryId = (ctx.fiber && ctx.fiber.entry && ctx.fiber.entry.options && ctx.fiber.entry.options.id) || SETTINGS_NS
    if (typeof child.settings.update !== 'function') return
    writer = (patch) => child.settings.update(entryId, patch)
    settingsWriter = writer
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber), 'dsh-sticky-note: settings page policy')
    migrateLegacyConfig().catch(() => {})
  })

  ctx.effect(() => {
    // 认证 Web 载体从 /api 分流精确 Fetch route；没有该接缝时退回独立 RPC channel。
    if (ctx.connection.fetch && typeof ctx.connection.fetch.register === 'function') {
      return ctx.connection.fetch.register({
        path: RPC_PATH,
        methods: ['POST'],
        requestBody: 'buffered',
        fetch: handleApiRequest,
      })
    }
    // 0.2.0 的 rpc.handle 只收 (channel, handler)，按通道的 authority 选项已移除。
    return ctx.connection.rpc.handle(CHANNEL, handler)
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1695-1716](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/client.js#L1695-L1716)

真实setDraft/submit或append。

<details>
<summary>查看原文（22行）</summary>

```text
      // 把便签内容发送给当前对话（按发送模式：send = 直接发出；append = 追加到输入框末尾）
      function sendToChat(content) {
        if (!inputActions || !content || !content.trim()) {
          setStatus('无法发送')
          return
        }
        if (sendMode === 'append') {
          const cur = (inputDraft || '').trim()
          inputActions.setDraft(cur ? cur + '\n\n' + content.trim() : content.trim())
          setStatus('已追加到输入框')
          setOpen(false)
          return
        }
        inputActions.setDraft(content.trim())
        inputActions.submit()
        setOpen(false)
      }
      // 双击历史条目：读取内容后发送
      function sendNoteItem(item) {
        rpc('read', { kind: item.kind, name: item.name }).then((v) => {
          if (v && v.content) sendToChat(v.content)
          else setStatus('读取失败')
```

</details>

**依据 6 · 源码核查**：[lib/client.js:934-953](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/client.js#L934-L953)

HTML转义与http(s)图片/链接。

<details>
<summary>查看原文（20行）</summary>

```text
    function esc(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    function inlineMd(s) {
      let r = esc(s)
      // 行内代码
      r = r.replace(/`([^`\n]+)`/g, '<code>$1</code>')
      // 图片 ![alt](url)（先于链接处理）
      r = r.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
      // 链接 [text](url)
      r = r.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
      // 粗体 **x**
      r = r.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      // 斜体 *x*
      r = r.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      // 删除线 ~~x~~
      r = r.replace(/~~([^~\n]+)~~/g, '<del>$1</del>')
      return r
    }
    function renderMarkdown(src) {
```

</details>

#### 缺口

- Host外围认证/多用户隔离、实际submit回执/误发、全部渲染安全与外部请求未测。
  **影响**：限定可信私人Host/低敏便签，不作敏感保密或任务完成保证。
  **进一步探讨**：用无敏感文本核会话与append，再审Host权限/链接策略和实际回执。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得试用，什么方向能比继续加UI更有价值？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议受限试用，只给可信私人DSH中需要临时对话笔记的人，先关闭自动清理并备份低敏.md、选append、核目标会话和实际读回。相对普通编辑器减少窗口切换并保留普通文件交付，但没有已测净节时/需求或协作分工创新；故业务workflow/reach/economics均0，交付便利只低档。首次Host版本/来源/设置核对、持续文件备份/容量/图片网络/人工整理、误删与错发恢复和退出迁移工时未知，现金费用未知；发送后模型费用另计，插件未见模型费用硬封顶。

独立假设：先给保存版本/删除入站时间和发送目标/接受状态提供可核收据，可能比继续加主题/快捷键更减少丢失或误发。优先与关闭清理+文件版本备份+append人工确认比较，固定最后编辑关页、旧mtime同轮清理、两面板并发、指针写失败和切会话样例，测内容丢失、错发率、恢复人时和维护成本；若现有编辑器/备份已经足够或收据负担更高则放弃，不当本插件现有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:33-43](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L33-L43)

自动保存/清理/发送默认。

<details>
<summary>查看原文（11行）</summary>

```text
const DEFAULT_VIEW_MODE = 'inline'
// 自动保存间隔（秒）：10 秒 / 1 分钟 / 5 分钟 / 0 = 不自动保存
const DEFAULT_SAVE_INTERVAL = 10
// 自动清除（天）：1 / 3 / 7 / 0 = 永久不清除
const DEFAULT_CLEAR_AFTER = 7
// 默认类别
const DEFAULT_KIND = '点子'
// 发送模式：send = 直接发出；append = 添加到输入框末尾
const DEFAULT_SEND_MODE = 'send'
// 默认不恢复草稿，保持既有打开行为；用户可在插件设置中主动开启。
const DEFAULT_RESUME_DRAFT = false
```

</details>

**依据 2 · 源码核查**：[lib/index.js:374-404](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L374-L404)

现有非原子正文/指针保存。

<details>
<summary>查看原文（31行）</summary>

```text
function writeIfChanged(path, content) {
  return enqueuePath(path, async () => {
    try {
      if (await readFile(path, 'utf8') === content) return false
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error
    }
    await writeFile(path, content, 'utf8')
    return true
  })
}

async function saveNote(args) {
  const kind = args && args.kind
  if (!TYPES.includes(kind)) return { ok: false, error: 'invalid kind' }
  const content = args && typeof args.content === 'string' ? args.content : ''
  if (!content.trim()) return { ok: false, error: 'empty' }
  const root = await rootOf()
  await ensureSubdirs(root)
  // 若当前草稿属于同一类别，覆盖同一文件；否则新建文件并记住指针
  let name
  if (currentDraft && currentDraft.kind === kind && currentDraft.name) {
    name = currentDraft.name
  } else {
    name = safeName(kind)
    currentDraft = { kind, name }
  }
  const changed = await writeIfChanged(join(root, kind, name), content)
  await writeDraftPointer(currentDraft)
  return { ok: true, name, kind, changed }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:225-238](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/index.js#L225-L238)

回收站按文件mtime实际删除。

<details>
<summary>查看原文（14行）</summary>

```text
  try {
    trash = await readdir(join(root, TRASH_DIR), { withFileTypes: true })
  } catch (e) { trash = [] }
  for (const ent of trash) {
    if (!ent.isFile()) continue
    try {
      const mtimeMs = (await stat(join(root, TRASH_DIR, ent.name))).mtimeMs
      if ((now - mtimeMs) / 86400000 > TRASH_KEEP_DAYS) {
        await rm(join(root, TRASH_DIR, ent.name), { force: true })
      }
    } catch (e) { /* ignore */ }
  }
  // 现存便签键集合：活跃目录 + 归档目录的文件剥掉「类别-」前缀映射回原键。
  // 保留标记跟随便签身份（类别/原始文件名）而非位置——归档期间标记保留，
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1695-1710](https://github.com/Meredith2328/dsh-sticky-note/blob/fb36ba7c3d4a0e85fc993cafd1d3c87481a8a881/lib/client.js#L1695-L1710)

append与直接submit差异。

<details>
<summary>查看原文（16行）</summary>

```text
      // 把便签内容发送给当前对话（按发送模式：send = 直接发出；append = 追加到输入框末尾）
      function sendToChat(content) {
        if (!inputActions || !content || !content.trim()) {
          setStatus('无法发送')
          return
        }
        if (sendMode === 'append') {
          const cur = (inputDraft || '').trim()
          inputActions.setDraft(cur ? cur + '\n\n' + content.trim() : content.trim())
          setStatus('已追加到输入框')
          setOpen(false)
          return
        }
        inputActions.setDraft(content.trim())
        inputActions.submit()
        setOpen(false)
```

</details>

#### 缺口

- 需求/净节时、运行兼容/可靠性、恢复人工/现金总成本和新假设价值未测。
  **影响**：受限试用不能外推团队/敏感资料生产采用。
  **进一步探讨**：同一低敏任务对照文本编辑器+备份+人工append确认，若恢复成本抵消便利即退出。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
