# DSH Chat Import

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[080dc99](https://github.com/Nwflower/dsh-chat-import/tree/080dc99c64630a628d3a744983e1856d0600d478)

<!-- BEGIN META -->
[![GitHub ★ 273](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=273&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-chat-import) [![npm 30d 13,577](https://img.shields.io/static/v1?label=npm+30d&message=13%2C577&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import)
<!-- END META -->

> **功能**：把其他 AI 编码助手的会话历史导入 DeepSeek Harness 并继续对话。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将外部会话转换为宿主记录并接入工作区；不转移原运行环境。

> **主要限制**：[Q03](#research-q03) 创建、挂接和记账不是已证明的单一事务；[Q04](#research-q04) 空结果补齐与图片占位限制无损主张。

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
  - [Q01 · 迁入用户为何需要导入旧会话，与保留原始日志相比增加什么？](#detail-section-11)
  - [Q02 · 来源如何转换成宿主事件并挂入工作区？](#detail-section-12)
  - [Q03 · 重复导入和续聊后重导如何处理，失败能否整体撤销？](#detail-section-13)
  - [Q04 · 哪些内容会修补、跳过或占位，隐私与采用成本是什么？](#detail-section-14)
  - [Q05 · 能否让用户逐项核对迁移保真与未知？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：迁入 DSH 的开发者需要查询并接续已有编码会话。

保留并手工检索原始日志无需转换，但不能直接在宿主中续聊。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话转换 | 适配外部记录 | 格式差异可能需补齐或占位 |
| 宿主写入 | 创建或追加 DSH 会话 | 需要会话持久化 |
| 预览 | 导入前查看内容 | 不能证明全部附件保真 |
| 重导决策 | 避免重复并处理续聊 | registry 损坏时基线可能缺失 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH 与会话持久化 | 导入需要 | 创建及追加会话 | 报错或需刷新 |
| 可读取的原会话 | 转换需要 | 提取消息和工具事件 | 跳过或降级 |
| 工作区与文件权限 | 挂接需要 | 放置目标会话 | 可能未分组 |
| 原始备份 | 核对与恢复需要 | 比较缺失内容 | 无法确认保真 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并选非敏感来源 | 确认目标 DSH 和工作区 |
| 预览 | 查看解析结果和可见缺失 | 来源不支持则停止 |
| 导入 | 创建或追加宿主会话 | 核对实际日志与 registry |
| 验收 | 对照原消息、附件及工具结果 | 不一致时回原日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 存储与安装资源未知 | 备份、选择和预览 | 兼容未知 |
| 持续 | 续聊模型费用未知 | 对照原始信息 | 保真率未知 |
| 恢复 | 副本及备份资源未知 | 核对部分结果和去重 | 中断恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话导入 | 事件转换和宿主写入 | 全格式无损 |
| 去重 | 持久长度及 registry 决策 | 跨步骤中断无重复 |
| 续聊 | 生成宿主会话 | 原工具与模型状态自动恢复 |

> **思考**：[Q03](#research-q03) 创建、挂接和记账不是已证明的单一事务；[Q04](#research-q04) 空结果补齐与图片占位限制无损主张。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将外部会话转换为宿主记录并接入工作区；不转移原运行环境。

[Q02](#research-q02) 显式修补与宿主代次写入，[Q03](#research-q03) 区分部分落盘和最终 registry。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 创建、挂接和记账不是已证明的单一事务；[Q04](#research-q04) 空结果补齐与图片占位限制无损主张。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先备份和预览非敏感单个来源，再核对原文与目标会话；缺项或状态不明时暂停重导。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本代表转换、宿主写入与 registry 分支已查；未运行宿主或全部格式。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、lib/host-session.mjs、lib/import-core.mjs、lib/convert/events.mjs、lib/imports.mjs、lib/convert/codex.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读 README、清单、代表 Codex 转换、事件合成、宿主写入和 registry；未运行宿主或目标，未穷尽所有解析器、附件和隐私路径。
- 下一步：以隔离宿主注入缺图、缺结果、重导、registry 损坏及中断，按 [Q05](#research-q05) 比较错误保真判断。

**分析版本**

- **仓库**：[Nwflower/dsh-chat-import](https://github.com/Nwflower/dsh-chat-import)
- **版本号**：0.26.3（[固定提交 080dc99](https://github.com/Nwflower/dsh-chat-import/tree/080dc99c64630a628d3a744983e1856d0600d478)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设逐对象迁移清单可降低无损误判；需先核现有界面且未验证。

以隔离宿主注入缺图、缺结果、重导、registry 损坏及中断，按 [Q05](#research-q05) 比较错误保真判断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 3860 | — | — | 98839 |
| .mjs | source | 164 | 35520 | 26090 | 7542 | — |
| .js | source | 16 | 9408 | 7560 | 1680 | — |
| .mjs | test | 165 | 37605 | 31878 | 3194 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Nwflower/dsh-chat-import/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/Nwflower/dsh-chat-import/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/Nwflower/dsh-chat-import/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查会话转换、导入去重、保真及隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 迁入用户为何需要导入旧会话，与保留原始日志相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

package.json:1-4 描述将其他编码助手对话导入 DSH 续聊；README:89-97 提供预览、选择与工作区目标。用户也可保留原始日志手动查找，但不能直接在 DSH 中接着同一段记录。插件将代表格式转换为宿主事件并建立会话，提供接续的入口；原工具、凭据、工作目录和模型状态不会因历史导入自动恢复。作者宣称 25+ 来源和内容保留，未穷尽解析器，也未对照真实迁移效果。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-4](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/package.json#L1-L4)

作者描述来源与目标。

```text
{
  "name": "dsh-chat-import",
  "description": "Import conversation history from 25+ AI coding agents into DeepSeek Harness as resumable sessions — tool calls, reasoning and results kept intact, with reverse export. | 把 25+ AI 编程 Agent 的聊天记录导入 DeepSeek Harness 继续对话，保留工具调用、推理与结果，支持反向导出。",
  "version": "0.26.3",
```

**依据 2 · 作者声明**：[README.md:89-97](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/README.md#L89-L97)

作者描述预览和导入。

```text
## Usage

1. Import conversations from the GUI

  Click the **Import sessions** button at the bottom of the left sidebar to open the import window. With the DSH Claude Style theme, that button lives in the account menu at the bottom left. Pick the conversations you want and import them in one click.

  Rows carry their own tools: **double-click** a row to preview the conversation (a read-only dry-run — plugin injections skipped, tool calls folded into one line), switch the search box to **In content** to search message bodies instead of titles, **hide** a row reversibly, move a single-session source file to the Recycle Bin, or **drag the row onto a workspace** in the left sidebar to import it there with its timestamps shifted so it sorts to the top. The exact rules are in [docs/USAGE.md](docs/USAGE.md).

  If the file came from somewhere else — a web-app export, a script you wrote, a tool this plugin does not list — use **Import from file** at the top of the same window. Type a local path and press Enter, or press **Choose…** to pick files. When the path is a directory, it asks whether to search subfolders. Check the preview, then import. If detection fails, it lists why each candidate parser gave up and points you at the skill that converts the format.
```

**依据 3 · 源码核查**：[lib/host-session.mjs:479-505](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/host-session.mjs#L479-L505)

写入宿主持久会话。

<details>
<summary>查看原文（27行）</summary>

```text
 * 新宿主 create(header) 返回写句柄，事件经 handle.append(events) 落盘、flush 建持久化
 * 屏障，最后关句柄释放写租约；旧宿主 create(header) 无返回值，续写走 append(id, events)。 */
export async function writeSession(ctx, header, events) {
  const sp = ctx.get('sessionPersistence')
  if (!sp || typeof sp.create !== 'function') throw new Error('sessionPersistence 不可用（缺少 create）')
  const handle = await sp.create(header)
  if (handle && typeof handle.append === 'function') {
    try {
      await handle.append(events)
      if (typeof handle.flush === 'function') await handle.flush()
    } finally {
      if (typeof handle.close === 'function') {
        try {
          await handle.close()
        } catch (err) {
          // 数据已 flush；关句柄失败只影响写租约释放，上报而不改判导入结果
          console.error('会话写句柄关闭失败（' + header.id + '）: ' + String((err && err.message) || err))
        }
      }
    }
    return
  }
  if (typeof sp.append === 'function') {
    await sp.append(header.id, events)
    return
  }
  throw new Error('sessionPersistence 写入面不可用（create 未返回写句柄，且没有 append(id, events)）')
```

</details>

#### 缺口

- 未验证全部来源和实际续聊效果
  **影响**：不能保证无损迁移或节时
  **进一步探讨**：固定两种来源和宿主，逐轮与原始日志对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源如何转换成宿主事件并挂入工作区？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

import-core.mjs:320-335 将转换事件中的图片材料化、规划工作区，再调用宿主创建；host-session.mjs:479-505 对新式持久化句柄 append、可用时 flush 并关闭，旧式使用 append(id, events)。events.mjs:310-335 对缺失工具结果补空以满足事件配对，不能把补齐当原始输出。导入成功表示该路径完成，不证明原系统工具、环境及附件均可重现；不同宿主版本及所有格式未运行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/import-core.mjs:320-335](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/import-core.mjs#L320-L335)

材料化、规划和创建调用。

<details>
<summary>查看原文（16行）</summary>

```text
  // 一条会话的完整落盘序列（create / replace / multi 两圈的共用实现）：图片材料化 →
  // 落点规划（写进 header.cwd）→ create（幽灵 id 撞车时另铸后缀 id 重试一次）→ 结构校验
  // → 挂接工作区 → 预热投影缓存，并把**实测**日志长度写回该条记录（D13 的重导基线）。
  //   retryGhost=false 用于 replace：同 id 覆盖重导前已清掉目标工件，不存在宿主内存索引残留；
  //   onGhost(previous, current) 由调用方把新 id 同步回决策载荷（单会话改 decision，多会话
  //   改父记录子表与 results 条目）——同步口径是各路径唯一的差异，故留在调用方。
  const writeOneSession = async ({ events, meta, record, replace = false, retryGhost = true, onGhost }) => {
    await materialize(events)
    const prepared = await prepareGrouping(meta)
    let target = prepared.meta
    if (replace) await clearSessionArtifactsForReplace(ctx, target.id)
    try {
      await createSession(ctx, target, events)
    } catch (err) {
      // 宿主内存索引残留同名会话（幽灵，list 未暴露但 create 拒绝）：另铸后缀新 id 重试
      // 一次，registry 记录 / 决策载荷由 onGhost 同步到新 id；其它 create 错误（meta 非法
```

</details>

**依据 2 · 源码核查**：[lib/host-session.mjs:479-505](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/host-session.mjs#L479-L505)

新旧宿主写入路径。

<details>
<summary>查看原文（27行）</summary>

```text
 * 新宿主 create(header) 返回写句柄，事件经 handle.append(events) 落盘、flush 建持久化
 * 屏障，最后关句柄释放写租约；旧宿主 create(header) 无返回值，续写走 append(id, events)。 */
export async function writeSession(ctx, header, events) {
  const sp = ctx.get('sessionPersistence')
  if (!sp || typeof sp.create !== 'function') throw new Error('sessionPersistence 不可用（缺少 create）')
  const handle = await sp.create(header)
  if (handle && typeof handle.append === 'function') {
    try {
      await handle.append(events)
      if (typeof handle.flush === 'function') await handle.flush()
    } finally {
      if (typeof handle.close === 'function') {
        try {
          await handle.close()
        } catch (err) {
          // 数据已 flush；关句柄失败只影响写租约释放，上报而不改判导入结果
          console.error('会话写句柄关闭失败（' + header.id + '）: ' + String((err && err.message) || err))
        }
      }
    }
    return
  }
  if (typeof sp.append === 'function') {
    await sp.append(header.id, events)
    return
  }
  throw new Error('sessionPersistence 写入面不可用（create 未返回写句柄，且没有 append(id, events)）')
```

</details>

**依据 3 · 源码核查**：[lib/convert/events.mjs:310-335](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/convert/events.mjs#L310-L335)

缺失工具结果补齐。

<details>
<summary>查看原文（26行）</summary>

```text
          const ev = push('tool/call', {
            turn,
            step: stepNum,
            callId: tc.id,
            name: tc.name,
            arguments: tc.arguments,
          })
          callSeqs.push(ev.seq)
        }
        // 配对不变量：每个 tool/call 在其广告的同一 step 内闭合——真实结果（预扫描
        // 已按调用归位）优先，全程无结果的调用（Cursor 无 tool_result、Claude/Codex/
        // Reasonix/Gemini 中断）补发空 result；content 用空数组：不虚构文本，wire
        // 适配器会把空内容归一为 "(no output)"（dsh-llm-deepseek / dsh-llm-pi-ai 的
        // serialize 均 `|| "(no output)"`）。不闭合则 resume 时模型 API 拒绝
        // （assistant 带 tool_calls 但缺 tool 消息），V4 迁移也在 step/end 拒载。
        // 结果的发射顺序：默认按 toolCalls 声明顺序；resultOrder='source' 时同一步内
        // 按源记录里结果的到达顺序（Kimi 并行工具），未收到结果的调用仍在末尾补空。
        const callIndex = new Map(step.toolCalls.map((tc, i) => [tc.id, i]))
        const orderedCallIndexes = []
        if (resultOrder === 'source') {
          const seenCall = new Set()
          for (const tr of step.toolResults) {
            const ci = callIndex.get(tr.toolCallId)
            if (ci === undefined || seenCall.has(tr.toolCallId)) continue
            seenCall.add(tr.toolCallId)
            orderedCallIndexes.push(ci)
```

</details>

#### 缺口

- 未运行宿主各代与全部来源格式
  **影响**：不能保证所有消息或工具执行环境可恢复
  **进一步探讨**：隔离宿主导入两类记录并比较原文和事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重复导入和续聊后重导如何处理，失败能否整体撤销？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

imports.mjs:453-526 在已知目标、归档、持久会话长度等条件下选择替换、新副本或已导入，未知已存长度会跳过追加；import-core.mjs:350-358、378-390 对尾部追加调用宿主，410-428 在后续挂接处理后写 registry。registry 读损坏时 imports.mjs:58-71 告警并视为空，可能失去去重基线。创建、工作区挂接和最终记账跨多个步骤，不能据此认定全局原子；异常或中断后应核实际会话、原文及 registry，避免盲目重导。

#### 证据与依据

**依据 1 · 源码核查**：[lib/imports.mjs:453-526](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/imports.mjs#L453-L526)

目标、持久长度和重导条件。

<details>
<summary>查看原文（74行）</summary>

```text
  if (known && (!persisted.has(known.dshId) || archived.has(known.dshId))) {
    if (!persisted.has(known.dshId) && typeof known.dshId === 'string') {
      base.staleRegistry = { previous: known.dshId, reason: 'session-log-missing' }
    }
    known = null
  }

  // 已知记录且为可续写形态（有 dshId + turns）时走增量状态机；缺 turns 的
  // legacy/残缺记录（unwrapRecord 解出的旧 string 记录只有 dshId）被挡在此守卫外，
  // 落进下方「无记录」分支做 legacy 回填。
  if (known && typeof known.dshId === 'string' && typeof known.turns === 'number') {
    const targetId = known.dshId
    // replace：同 id 删工件后全量重导（面板「刷新已导入」）；不新建副本。
    if (args.replace === true) {
      return {
        ...base,
        sessionId: targetId,
        status: 'replaced',
        __action: 'replace',
        __meta: { ...meta, id: targetId },
        __events: events,
        __itemRecord: itemRecord(targetId, turns.length, events.length, importFormat, { copies: known.copies }),
      }
    }
    // 显式 sessionId 变更（或源 sessionId 变更）→ 副本语义；「targetId 由避让产生
    // 且显式 id 是其前缀」视为同一会话（撞 id 后的后缀避让），不重复建副本
    const explicitChanged = isSessionIdChange(args, targetId)
    if (explicitChanged || args.force === true) {
      const baseId = explicitChanged ? args.sessionId : targetId
      const newId = persisted.has(baseId) ? mintForceSessionId(persisted, baseId) : baseId
      return {
        ...base,
        sessionId: newId,
        status: 'imported',
        __action: 'create',
        __meta: { ...meta, id: newId },
        __events: events,
        __itemRecord: itemRecord(newId, turns.length, events.length, importFormat, { copies: supersededEntry(known) }),
        reimported: { previous: targetId, current: newId, reason: explicitChanged ? 'session-id-changed' : 'forced' },
      }
    }

    // 源增长：判据是「DSH 侧这条会话还是不是我们上次写完的样子」——storedEvents 是上次落盘
    // 后实测的日志长度（缺它 = 无基线）：相等 → 纯镜像，续写尾部；大于 → 用户已在 DSH 续聊，
    // 追加会污染他自己的对话 → 另铸副本；小于 → 日志被外部截短 → 不写、跳过上报；无基线 →
    // 不可判定 → 保守另铸副本一次并回填基线。用户心智：重复导入 = 要一份新副本。
    if (turns.length > known.turns) {
      const fromSeq = await storedEventCount(ctx, targetId)
      if (fromSeq === null) {
        // 连日志长度都读不到（后端不可用）：绝不冒险 append 错误 seq，也不复制会话
        return { ...base, sessionId: targetId, status: 'already-imported', alreadyImported: true, appendedSkipped: 'stored-length-unknown' }
      }
      const baseline = typeof known.storedEvents === 'number' ? known.storedEvents : null
      if (baseline === null || fromSeq > baseline) {
        const reason = baseline === null ? 'baseline-missing' : 'continued-in-dsh'
        const newId = persisted.has(meta.id) ? mintForceSessionId(persisted, meta.id) : meta.id
        return {
          ...base,
          sessionId: newId,
          status: 'imported',
          __action: 'create',
          __meta: { ...meta, id: newId },
          __events: events,
          __itemRecord: itemRecord(newId, turns.length, events.length, importFormat, { copies: supersededEntry(known) }),
          reimported: { previous: targetId, current: newId, reason },
        }
      }
      if (fromSeq < baseline) {
        return { ...base, sessionId: targetId, status: 'already-imported', alreadyImported: true, storedShrunk: true }
      }
      const tail = tailSessionEvents(converted, { fromTurn: known.turns + 1, fromSeq })
      if (tail.events.length === 0) {
        // 轮数增加但没有可截取事件（理论不可达）：保守跳过
        return { ...base, sessionId: targetId, status: 'already-imported', alreadyImported: true }
```

</details>

**依据 2 · 源码核查**：[lib/import-core.mjs:350-358](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/import-core.mjs#L350-L358)

尾部材料化与追加。

```text
    await stampStoredEvents(ctx, record, target.id, stored)
    return target.id
  }
  // 续写一段尾部（单会话 append 与多会话 appends 同口径）：图片按目标会话代次落地 →
  // 宿主 append → 结构校验。
  const appendTail = async (targetId, events) => {
    await materialize(events, targetId)
    await appendHostEvents(ctx, targetId, events)
    check(events)
```

**依据 3 · 源码核查**：[lib/import-core.mjs:378-390](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/import-core.mjs#L378-L390)

按决策写入或追加。

<details>
<summary>查看原文（13行）</summary>

```text
      record: decision.__record,
      replace: true,
      retryGhost: false,
    })
  } else if (decision.__action === 'append') {
    await appendTail(decision.__targetId, decision.__tailEvents)
  } else if (decision.__action === 'multi') {
    for (const r of decision.__replaces || []) {
      const sub = decision.__record && r.subTable ? decision.__record[r.subTable] : null
      await writeOneSession({
        events: r.events,
        meta: r.meta,
        record: sub && sub[r.key],
```

</details>

**依据 4 · 源码核查**：[lib/import-core.mjs:410-428](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/import-core.mjs#L410-L428)

后续工作区处理与最后记账。

<details>
<summary>查看原文（19行）</summary>

```text
            }
          }
        },
      })
    }
    for (const a of decision.__appends) await appendTail(a.targetId, a.events)
  }
  // 被删工作区出现新会话：解除工作区忽略（旧会话的 'workspace-deleted' 墓碑保留，
  // 不会把已删除的源带回来）；失败只告警，不影响本次导入结果。
  if (Array.isArray(decision.__restoreWorkspaces)) {
    for (const cwd of decision.__restoreWorkspaces) {
      try {
        await forgetWorkspaceIgnore(registryDir, cwd)
      } catch (err) {
        console.warn('[dsh-chat-import] 恢复工作区忽略失败（' + cwd + '）：' + String((err && err.message) || err))
      }
    }
  }
  if (decision.__record) await rememberImport(registryDir, sourcePath, decision.__record)
```

</details>

**依据 5 · 源码核查**：[lib/imports.mjs:58-71](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/imports.mjs#L58-L71)

损坏 registry 警告及空回退。

<details>
<summary>查看原文（14行）</summary>

```text
async function readRegistry(registryDir) {
  try {
    const parsed = JSON.parse(await readFile(join(registryDir, 'imports.json'), 'utf8'))
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      && parsed.imports && typeof parsed.imports === 'object') {
      lastRegistrySnapshot = parsed
      return parsed
    }
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      console.warn('[dsh-chat-import] imports registry 损坏，按空 registry 处理：' + String((err && err.message) || err))
    }
  }
  const empty = { version: REGISTRY_VERSION, imports: {} }
```

</details>

#### 缺口

- 未注入创建、挂接和记账间断电
  **影响**：不能保证无重复和完整回滚
  **进一步探讨**：隔离宿主逐阶段中断并核对会话与 registry。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些内容会修补、跳过或占位，隐私与采用成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

events.mjs:310-335 对无配对结果的工具调用合成空结果；codex.mjs:381-382 报告不可获取图片的占位降级，属于代表来源而非所有格式。package.json:57-63 声明 DSH 及工具依赖，README:77-79 给出最低版本；导入意味着本机来源对话进入目标宿主持久化与备份，后续发送给模型的范围依用户操作和宿主而定，不能当作原运行环境复现。适合先备份非敏感副本、预览并核工作区及关键消息；缺图片、来源或工具结果时回原日志查验。运行、存储、续聊费用与人工复核时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/convert/events.mjs:310-335](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/convert/events.mjs#L310-L335)

合成缺失工具结果。

<details>
<summary>查看原文（26行）</summary>

```text
          const ev = push('tool/call', {
            turn,
            step: stepNum,
            callId: tc.id,
            name: tc.name,
            arguments: tc.arguments,
          })
          callSeqs.push(ev.seq)
        }
        // 配对不变量：每个 tool/call 在其广告的同一 step 内闭合——真实结果（预扫描
        // 已按调用归位）优先，全程无结果的调用（Cursor 无 tool_result、Claude/Codex/
        // Reasonix/Gemini 中断）补发空 result；content 用空数组：不虚构文本，wire
        // 适配器会把空内容归一为 "(no output)"（dsh-llm-deepseek / dsh-llm-pi-ai 的
        // serialize 均 `|| "(no output)"`）。不闭合则 resume 时模型 API 拒绝
        // （assistant 带 tool_calls 但缺 tool 消息），V4 迁移也在 step/end 拒载。
        // 结果的发射顺序：默认按 toolCalls 声明顺序；resultOrder='source' 时同一步内
        // 按源记录里结果的到达顺序（Kimi 并行工具），未收到结果的调用仍在末尾补空。
        const callIndex = new Map(step.toolCalls.map((tc, i) => [tc.id, i]))
        const orderedCallIndexes = []
        if (resultOrder === 'source') {
          const seenCall = new Set()
          for (const tr of step.toolResults) {
            const ci = callIndex.get(tr.toolCallId)
            if (ci === undefined || seenCall.has(tr.toolCallId)) continue
            seenCall.add(tr.toolCallId)
            orderedCallIndexes.push(ci)
```

</details>

**依据 2 · 源码核查**：[lib/convert/codex.mjs:375-382](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/convert/codex.mjs#L375-L382)

图片退化计数。

```text
  const finalTitle = normalizeTitle(titleTopic || (turns.length > 0 ? turns[0].prompt : ''))
  return finishSession(turns, args.budget, { meta, provider: 'codex', model, skipped, records: recs.length, skippedLines, secrets, systemPrompt }, {
    title: finalTitle,
    droppedMalformedArgs,
    // 工具输出块数组中的未知块类型个数（>0 才占键；失败要大声）
    ...(droppedMalformedOutputs > 0 ? { droppedMalformedOutputs } : {}),
    // 图片降级数（>0 才占键）：拿不到字节、以 [image] 文本占位导入的图片张数
    ...(imagesDegraded > 0 ? { imagesDegraded } : {}),
```

**依据 3 · 源码核查**：[package.json:57-63](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/package.json#L57-L63)

宿主依赖声明。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-client-locale": ">=0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.6 <0.3.0",
    "@deepseek-ai/schemastery": ">=3.0.0",
    "react": ">=18.0.0"
```

**依据 4 · 作者声明**：[README.md:77-79](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/README.md#L77-L79)

作者宿主版本说明。

```text
## Install

> Requires dsh 0.1.5-rc.1 or newer. Verified on the 0.1.x line and on the 0.2.x line; dsh-tools must satisfy `>=0.1.0-rc.6 <0.3.0`.
```

**依据 5 · 作者声明**：[README.md:91-97](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/README.md#L91-L97)

作者描述预览和选择。

```text
1. Import conversations from the GUI

  Click the **Import sessions** button at the bottom of the left sidebar to open the import window. With the DSH Claude Style theme, that button lives in the account menu at the bottom left. Pick the conversations you want and import them in one click.

  Rows carry their own tools: **double-click** a row to preview the conversation (a read-only dry-run — plugin injections skipped, tool calls folded into one line), switch the search box to **In content** to search message bodies instead of titles, **hide** a row reversibly, move a single-session source file to the Recycle Bin, or **drag the row onto a workspace** in the left sidebar to import it there with its timestamps shifted so it sorts to the top. The exact rules are in [docs/USAGE.md](docs/USAGE.md).

  If the file came from somewhere else — a web-app export, a script you wrote, a tool this plugin does not list — use **Import from file** at the top of the same window. Type a local path and press Enter, or press **Choose…** to pick files. When the path is a directory, it asks whether to search subfolders. Check the preview, then import. If detection fails, it lists why each candidate parser gave up and points you at the skill that converts the format.
```

#### 缺口

- 未核所有格式、真实图片与隐私路径
  **影响**：不能声称无损、脱敏或兼容全部宿主
  **进一步探讨**：以合成会话核对附件、权限和后续模型请求。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让用户逐项核对迁移保真与未知？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有预览、事件配对修补、图片降级计数及导入历史，简单展示导入数量不构成增量。未验证设想是在每次导入后生成用户可查的逐对象清单，区分原样转写、合成空结果、图片占位、来源跳过和未核验，并绑定原文件位置与目标会话序列；缺少原文或读取失败标 unknown，用户显式确认后再续聊。依赖各解析器保留来源映射，不应记录敏感正文；先核所有 UI 是否已有等价报告。以现有预览/计数为对照，使用含断裂工具对、损坏图片、重复导入和截断文件的合成数据，比较无损误判、核对时间和泄露；若缺项被标原样、隐私泄露或收益不足抵人工负担则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:91-97](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/README.md#L91-L97)

已有预览和来源选择。

```text
1. Import conversations from the GUI

  Click the **Import sessions** button at the bottom of the left sidebar to open the import window. With the DSH Claude Style theme, that button lives in the account menu at the bottom left. Pick the conversations you want and import them in one click.

  Rows carry their own tools: **double-click** a row to preview the conversation (a read-only dry-run — plugin injections skipped, tool calls folded into one line), switch the search box to **In content** to search message bodies instead of titles, **hide** a row reversibly, move a single-session source file to the Recycle Bin, or **drag the row onto a workspace** in the left sidebar to import it there with its timestamps shifted so it sorts to the top. The exact rules are in [docs/USAGE.md](docs/USAGE.md).

  If the file came from somewhere else — a web-app export, a script you wrote, a tool this plugin does not list — use **Import from file** at the top of the same window. Type a local path and press Enter, or press **Choose…** to pick files. When the path is a directory, it asks whether to search subfolders. Check the preview, then import. If detection fails, it lists why each candidate parser gave up and points you at the skill that converts the format.
```

**依据 2 · 源码核查**：[lib/convert/events.mjs:310-335](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/convert/events.mjs#L310-L335)

已有补齐行为。

<details>
<summary>查看原文（26行）</summary>

```text
          const ev = push('tool/call', {
            turn,
            step: stepNum,
            callId: tc.id,
            name: tc.name,
            arguments: tc.arguments,
          })
          callSeqs.push(ev.seq)
        }
        // 配对不变量：每个 tool/call 在其广告的同一 step 内闭合——真实结果（预扫描
        // 已按调用归位）优先，全程无结果的调用（Cursor 无 tool_result、Claude/Codex/
        // Reasonix/Gemini 中断）补发空 result；content 用空数组：不虚构文本，wire
        // 适配器会把空内容归一为 "(no output)"（dsh-llm-deepseek / dsh-llm-pi-ai 的
        // serialize 均 `|| "(no output)"`）。不闭合则 resume 时模型 API 拒绝
        // （assistant 带 tool_calls 但缺 tool 消息），V4 迁移也在 step/end 拒载。
        // 结果的发射顺序：默认按 toolCalls 声明顺序；resultOrder='source' 时同一步内
        // 按源记录里结果的到达顺序（Kimi 并行工具），未收到结果的调用仍在末尾补空。
        const callIndex = new Map(step.toolCalls.map((tc, i) => [tc.id, i]))
        const orderedCallIndexes = []
        if (resultOrder === 'source') {
          const seenCall = new Set()
          for (const tr of step.toolResults) {
            const ci = callIndex.get(tr.toolCallId)
            if (ci === undefined || seenCall.has(tr.toolCallId)) continue
            seenCall.add(tr.toolCallId)
            orderedCallIndexes.push(ci)
```

</details>

**依据 3 · 源码核查**：[lib/convert/codex.mjs:375-382](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/convert/codex.mjs#L375-L382)

已有图片降级计数。

```text
  const finalTitle = normalizeTitle(titleTopic || (turns.length > 0 ? turns[0].prompt : ''))
  return finishSession(turns, args.budget, { meta, provider: 'codex', model, skipped, records: recs.length, skippedLines, secrets, systemPrompt }, {
    title: finalTitle,
    droppedMalformedArgs,
    // 工具输出块数组中的未知块类型个数（>0 才占键；失败要大声）
    ...(droppedMalformedOutputs > 0 ? { droppedMalformedOutputs } : {}),
    // 图片降级数（>0 才占键）：拿不到字节、以 [image] 文本占位导入的图片张数
    ...(imagesDegraded > 0 ? { imagesDegraded } : {}),
```

**依据 4 · 源码核查**：[lib/import-core.mjs:410-428](https://github.com/Nwflower/dsh-chat-import/blob/080dc99c64630a628d3a744983e1856d0600d478/lib/import-core.mjs#L410-L428)

导入后记账。

<details>
<summary>查看原文（19行）</summary>

```text
            }
          }
        },
      })
    }
    for (const a of decision.__appends) await appendTail(a.targetId, a.events)
  }
  // 被删工作区出现新会话：解除工作区忽略（旧会话的 'workspace-deleted' 墓碑保留，
  // 不会把已删除的源带回来）；失败只告警，不影响本次导入结果。
  if (Array.isArray(decision.__restoreWorkspaces)) {
    for (const cwd of decision.__restoreWorkspaces) {
      try {
        await forgetWorkspaceIgnore(registryDir, cwd)
      } catch (err) {
        console.warn('[dsh-chat-import] 恢复工作区忽略失败（' + cwd + '）：' + String((err && err.message) || err))
      }
    }
  }
  if (decision.__record) await rememberImport(registryDir, sourcePath, decision.__record)
```

</details>

#### 缺口

- 未穷尽已有 UI 与来源映射，也没有原型
  **影响**：不能证明方案增量和用户收益
  **进一步探讨**：先核现有报告，再用合成记录盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
