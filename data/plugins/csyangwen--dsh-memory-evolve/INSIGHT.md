# DSH Memory Evolve

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[44b6b3e](https://github.com/csyangwen/dsh-memory-evolve/tree/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423)

<!-- BEGIN META -->
[![GitHub ★ 476](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=476&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/csyangwen/dsh-memory-evolve)
<!-- END META -->

> **功能**：为 DSH 提供分轨持久记忆、项目与分支上下文，以及关键记忆确认队列。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把分轨写入、关键建议确认及会话快照接在同一插件。

> **主要限制**：[Q03](#research-q03)确认不覆盖所有mutation，分支未知保留全部项目key；不是隐私隔离。

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
  - [Q01 · 分轨记忆解决什么持续任务？](#detail-section-11)
  - [Q02 · 关键记忆确认和持久化如何完成？](#detail-section-12)
  - [Q03 · 用户确认和分支隔离能承诺到哪里？](#detail-section-13)
  - [Q04 · 怎样可控试用，值得验证何种增量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨会话多项目任务需要稳定事实和项目进展。

手工AGENTS.md、日志和复制聊天。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分轨记忆 | 用户事实/项目/日志 | global不隔离项目 |
| key建议队列 | 新增前确认 | replace/remove不走同队列 |
| 分支快照 | 减少无关key | 未识别分支保留全部 |
| 本地存储 | 可检查Markdown | 备份/清理仍由用户负责 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 相容DSH与Node运行时 | 必需 | 工具/快照/界面注册 | 实装兼容未验 |
| 可写memoryDir/建议文件 | 必需 | 持久化与确认 | 锁/磁盘失败需对账 |
| cwd与Git | 项目/分支需要 | 选取key | 无分支时全部回退 |
| 模型审查/同步服务 | 可选 | 额外自动化 | 本轮未审/费用另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户专用profile/备份 | 原文与队列可恢复 |
| 新增 | Agent建议key，用户批准 | 核目标cwd与主轨 |
| 继续任务 | 宿主生成分支快照 | 核实际注入内容 |
| 异常退出 | 停写/保留文件对账 | 回AGENTS与手工日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地磁盘/profile | 配置/迁移/矩阵验证 | 耗时未测 |
| 持续 | 模型token/可选服务 | 建议复核/纠错 | 费用及净收益未知 |
| 失败恢复 | 主轨/队列备份 | 判断部分成功/恢复 | 崩溃未验 |
| 退出 | 持久文件/同步副本 | 备份/清理/回手工 | 卸载非撤销外发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 组织上下文 | 分轨/cwd/分支快照 | 正确事实使用率 |
| 关键确认 | key add排队 | 全mutation确认不成立 |
| 写入保护 | 锁/rename/漂移拒绝 | 崩溃与跨文件事务 |
| 减少维护 | 同插件工具/队列 | 人工负担与净节时 |

> **思考**：[Q03](#research-q03)确认不覆盖所有mutation，分支未知保留全部项目key；不是隐私隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把分轨写入、关键建议确认及会话快照接在同一插件。

[Q02](#research-q02)目录锁、重读、rename与漂移/唯一匹配保护，非跨主轨队列事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)确认不覆盖所有mutation，分支未知保留全部项目key；不是隐私隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)独立profile与副本项目先做写入矩阵，异常停写回手工日志。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核心工具/建议/store/快照静态核查，未运行DSH或所有可选模块。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/store.js、lib/review.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧findings；README/package与lib/index/store/review关键链。未审全部可选同步/顾问/COI/UI与宿主权限，不运行目标。
- 下一步：主子Agent×各轨×add/replace/remove矩阵，分支切换/未知，崩溃重启和人工基线对照。

**分析版本**

- **仓库**：[csyangwen/dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve)
- **版本号**：0.1.0（[固定提交 44b6b3e](https://github.com/csyangwen/dsh-memory-evolve/tree/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)分支未知暂停有scope记忆可能减少错用，须对照漏用和提示成本，未实现。

主子Agent×各轨×add/replace/remove矩阵，分支切换/未知，崩溃重启和人工基线对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2894 | — | — | 80221 |
| .js | source | 65 | 50901 | 38210 | 13170 | — |
| .mjs | source | 3 | 558 | 411 | 110 | — |
| .ts | source | 17 | 6215 | 3730 | 2220 | — |
| .tsx | source | 27 | 15679 | 13212 | 1839 | — |
| .js | test | 72 | 24004 | 19253 | 3396 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/csyangwen/dsh-memory-evolve/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/csyangwen/dsh-memory-evolve/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/csyangwen/dsh-memory-evolve/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核核心分轨记忆的写入确认、分支快照与采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 分轨记忆解决什么持续任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向反复在多个项目与分支工作的DSH用户，把慢变用户事实、全局记忆、项目关键事项与进展日志分开，并在模型请求前构造当前会话快照。较手工维护AGENTS.md及聊天复制，增量是模型写入工具、关键记忆建议队列和按cwd/分支选取；普通Markdown与自动摘要本身不是新机制。成功应是下次任务使用正确事实而非条目越来越多。README描述更多同步、提示词和审查模块，本轮仅核核心记忆链，不能以13个页面推成全功能有效。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:46-75](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/README.md#L46-L75)

作者分轨与界面声明。

<details>
<summary>查看原文（30行）</summary>

```text
## 认识它（30 秒）

装上插件后，打开任意会话，你会多出一排能力标签：**记忆 · 技能 · 待办 · 无限画板 · COI 调度 · 会话广播 · 提示词 · 记忆同步 · 模型设置 · 书签 · 会话评审 · Web UI 设置 · Memory Evolve 设置**。AI 侧则多了一批工具：记忆读写、待办、技能管理、本地文件搜索、会话编排、会话广播、外部 AI 派单、提示词注入、模型查询……

一句话概括这些能力：**让 AI 记住你、替你管、替你做、互相配合做。**

> 小提示：插件里很多能力默认关闭（不占 AI 的工具清单），需要时在「Memory Evolve 设置」里打开即可。下面的场景大多是组合玩法——**把相关功能都打开，才能串成完整的流水线**。

---

## 场景一：让 AI 真正记住你（长期记忆）

**适合谁**：所有人。这是插件的核心，也是其他一切功能的地基。

AI 的对话是「一次性」的：换项目、隔几天、开新会话，它就忘了你是谁。插件的五轨记忆让 AI 拥有**跨会话的长期工作记忆**：

- **用户档案**：你的偏好、公司、沟通习惯——AI 每回合都能看到；
- **全局事实**：环境、工具、惯例等长期知识；
- **项目关键记忆**：当前项目的约定、决策、架构、踩坑，自动注入上下文，重要结论可标记**只在某个 git 分支生效**；
- **项目日志 / 每日日志**：每回合自动记录进展，按需读取，历史可追溯。

**怎么用**：

1. 正常和 AI 对话即可——每回合结束时它会自动把进展写进项目日志和今日日志；
2. 发现重要事实时对它说「**记一下：这个项目的部署端口是 8080**」，它会写入项目关键记忆，**你确认后**才生效——AI 不会擅自往记忆里写东西；
3. 过几天、换了个会话，直接问「**查一下记忆，上次我们定下的架构决策是什么**」——它能无缝衔接；
4. 记忆多了之后，让 AI「**把 XX 那条记忆归档**」——归档条目不再注入上下文，随时可转回；
5. **情绪反馈记录**：你对工作结果的评价（如「太好了」「怎么还没改对」）会被 AI 记入当日与项目日志（`【反馈】` 行，含情绪、任务分类、你的原话）——积累后随时可以让 AI「**分析一下最近我对哪些方面不满意**」，判断它在哪类任务上做得好/不好。

**会得到什么**：AI 从一个「每次会话都失忆」的对话机器，变成了解你全盘工作的长期伙伴——隔天继续开发，它直接引用昨天的结论，不用你复述。
```

</details>

**依据 2 · 源码核查**：[package.json:1-29](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/package.json#L1-L29)

原生bundle/runtime入口。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "dsh-memory-evolve",
  "version": "0.1.0",
  "description": "为 DeepSeek Harness 带来分层记忆（全局 / 用户 / 项目 / GIT 分支 / 每日）与自我进化（经验沉淀 + 技能自动创建）和技能管理、待办管理、CLI 调度（kimi/codex/grok/hermes 等外部 AI 统一调度）、临时信息便签，带 WebUI 管理界面。Hermes-style long-term memory, self-evolution, skills, todos and external CLI agent dispatch for DeepSeek Harness.",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "scripts": {
    "test": "node --test 'tests/*.test.js'",
    "build": "node scripts/build.mjs"
  },
  "license": "MIT",
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1689-1721](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L1689-L1721)

快照与模型工具实际注册。

<details>
<summary>查看原文（33行）</summary>

```text
  // 1. Memory snapshot injection (frozen-ish: live reads, change-detected
  //    materialization keeps the cache prefix stable).
  if (config.injectMemory) {
    ctx.effect(() => {
      try {
        return ctx.systemPrompt.context({
          name: 'memory:snapshot',
          order: config.snapshotOrder,
          text: (context) => {
            const runtime = getRuntime()
            // 记忆同步无快照状态行（2026-08-13 用户拍板：AI 不参与同步，见
            // renderSnapshot 内注释）
            return renderSnapshot(runtime, store, context.agent, counter, ctx.sessionTitle, writeGap)
          },
        })
      } catch (error) {
        // 幂等保护（issue #23）：DSH 0.1.x 的 loader 曾把插件在无 scope 标签的
        // ctx 上装配两次，system-prompt 的 global 层同名重复插入会抛
        // "already registered"（该层本就该只有一份注册，DSH 报错文案也提示应走
        // per-agent 注册）。命中重复时跳过并告警，避免整个 apply 失败连带
        // 快照注入失效 + /memory-evolve/api/* 404；其余异常照抛。
        if (error instanceof Error && error.message.includes('already registered')) {
          console.warn('[memory-evolve] memory:snapshot 已注册，跳过重复注册（issue #23 幂等保护）')
          return () => {}
        }
        throw error
      }
    }, 'dsh-memory-evolve: memory snapshot')
  }

  // 2. The memory tool (always registered; subagent writes are gated).
  ctx.effect(() => ctx.tools.register(memoryTool(ctx, config, store, queue, getRuntime, archive, writeGap)), 'dsh-memory-evolve: memory tool')

```

</details>

#### 缺口

- 多项目任务真实错用率和维护负担未测。
  **影响**：场景价值仅源码机制支持。
  **进一步探讨**：与手工AGENTS/日志做相同跨会话任务对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关键记忆确认和持久化如何完成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

memory工具的key新增调用enqueueSuggestion而不直接写主轨；确认命令approve读取建议保存的cwd构造writeAgent，store.add成功或重复才移出队列，失败保留。其他轨add直接调用store；批量add只接受daily/project，逐项成功失败而非整体事务。store在目录锁中重读，以临时文件rename替换；replace还检查格式漂移并备份、拒绝零/多匹配。锁超时会报错，不能把工具完成与用户已看到快照混同。下一次systemPrompt.context才重新读取注入。

目录锁、重复检测与原子替换是实有保护，但没有据此证明断电持久性或跨队列/主轨的单事务。确认写主轨后队列重写失败可能需对账，去重有助恢复而不等严格exactly-once。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:941-984](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L941-L984)

key新增排队，其余直接写。

<details>
<summary>查看原文（44行）</summary>

```text
  async function addOne(target, content, feedback, exec, summary) {
    const fbLine = target === 'daily' || target === 'project' ? buildFeedbackLine(feedback) : ''
    let finalContent = String(content ?? '').trim()
    if (fbLine !== '') finalContent = finalContent === '' ? fbLine : `${finalContent}\n${fbLine}`
    if (finalContent === '') return { ok: false, message: mt('msg.emptyContent'), target }
    // 渐进式披露：key 轨支持 summary 参数，拼入 [summary:...] 标签。
    // 清洗（审查修复）：换行会让标签跨行、']' 会让解析正则 [^\]]* 提前
    // 截断（剩余文字漏进正文、stripEntrySummary 失配）——都是 LLM 自由
    // 文本参数常见的字符，必须先去掉再截断。
    if (target === 'key' && summary) {
      const sanitized = String(summary).replace(/[\n\r\t\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)
      if (sanitized !== '') {
        const summaryTag = `[summary:${sanitized}]`
        finalContent = `${summaryTag}\n${finalContent}`
      }
    }
    if (target === 'key') {
      const outcome = enqueueSuggestion(queue, 'key', finalContent, mt('msg.keySuggestReason'), exec?.agent)
      if (outcome.ok) {
        outcome.message = mt('msg.keySuggestionQueued', { queued: outcome.queued })
      }
      // queued 不在输出 schema 内（additionalProperties:false），剥离
      const { queued: _queued, ...rest } = outcome
      return outcomeOnly(rest)
    }
    const addResult = store.add(target, finalContent, exec.agent)
    // 写入看门狗：daily/project 写入成功即重置该会话的连续未写计数
    // （memory/user/key 不算——看门狗盯的是每轮进展日志的欠账；key 走
    // 确认队列、memory/user 是慢变轨，都不承载"本轮做了什么"）。
    if (addResult.ok && (target === 'daily' || target === 'project')) {
      writeGap?.noteWrite?.(exec?.agent)
    }
    return outcomeOnly(addResult)
  }

  return {
    name: config.toolName,
    get description() { return mt('memory.desc') },
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['add', 'replace', 'remove', 'archive', 'list', 'expand'],
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1300-1337](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L1300-L1337)

受限批量与部分失败。

<details>
<summary>查看原文（38行）</summary>

```text
            }
            break
          }
          case 'add': {
            // ── entries 多轨批量（每轮收尾合并写 daily+project）──
            // 仅支持 daily/project 两轨（schema enum 已限；此处程序再兜底，
            // 防绕过 memory/user 的 subagent 门禁与 key 的确认队列）。
            // 逐项独立执行、独立成败，汇总到 multi 返回。
            if (Array.isArray(args.entries) && args.entries.length > 0) {
              const multi = []
              for (const item of args.entries) {
                const t = item?.target
                const c = String(item?.content ?? '').trim()
                if (t !== 'daily' && t !== 'project') {
                  multi.push({ target: String(t ?? '?'), ok: false, message: mt('msg.batchUnsupportedTrack') })
                  continue
                }
                if (c === '') {
                  multi.push({ target: t, ok: false, message: mt('msg.emptyContent') })
                  continue
                }
                // 单轨容错（issue #18 建议第 3 条）：任何一轨写入抛异常
                // （如 Windows 上锁文件删除被占用、记忆目录无法创建等）
                // 只记为该轨失败，不中断循环、不丢弃其余轨道。
                let r
                try {
                  r = await addOne(t, c, item?.feedback, exec)
                } catch (error) {
                  r = { ok: false, message: mt('msg.writeError', { detail: error?.message ?? String(error) }) }
                }
                multi.push({ target: t, ok: r.ok, message: r.message })
              }
              const allOk = multi.every((m) => m.ok)
              result = {
                ok: allOk,
                message: mt('msg.batchSummary', { count: multi.length }) + multi.map((m) => `${m.target}=${m.ok ? mt('msg.ok') : mt('msg.failed')}`).join(' '),
                multi,
              }
```

</details>

**依据 3 · 源码核查**：[lib/review.js:421-483](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/review.js#L421-L483)

批准保留失败与原cwd。

<details>
<summary>查看原文（63行）</summary>

```text
export function approveSuggestions(store, todoStore, queue, indices, agent, edits, targets, options = {}) {
  const isTodoEnabled = options.isTodoEnabled ?? (() => true)
  return queue.mutate((entries) => {
    const kept = []
    const lines = []
    entries.forEach((entry, index) => {
      const number = index + 1
      if (!indices.includes(number)) {
        kept.push(entry)
        return
      }
      // 待办建议只能留在待办轨（待办不能变成记忆）；记忆建议才可改分类
      const target = entry.target.startsWith('todo-')
        ? entry.target
        : (targets?.get(number) ?? entry.target)
      const writeAgent = entry.cwd
        ? { session: { header: { cwd: entry.cwd } } }
        : agent
      // An edit that is empty (or whitespace) means "no edit": fall back to the
      // suggested content instead of attempting to write an empty entry.
      const edited = edits?.get(number)?.trim()
      const content = edited ? edited : entry.content
      const isTodo = target.startsWith('todo-')
      if (isTodo && !isTodoEnabled()) {
        lines.push(`✗ #${number} [${target}] TODO_DISABLED：待办功能未启用`)
        kept.push(entry)
        return
      }
      let outcome
      if (isTodo) {
        outcome = todoStore.addTodo(target.slice(5), content, {}, entry.cwd ?? agent?.session?.header?.cwd)
      } else {
        try {
          // key 轨无 cwd 时 resolveTarget 会抛错——兜住并保留建议
          outcome = store.add(target, content, writeAgent)
        } catch (error) {
          outcome = { ok: false, message: error instanceof Error ? error.message : String(error) }
        }
      }
      if (outcome.duplicate === true || (!outcome.ok && (outcome.message.includes('已存在') || outcome.message.includes('already exists')))) {
        // Duplicate detection is locale-neutral: store.add returns
        // ok:true + duplicate:true for a dup, so the duplicate check must
        // come FIRST; the message-substring fallbacks cover older flows
        // that only carry localized text.
        lines.push(rct('reviewcmd.existsSkip', { n: number, target }))
      } else if (outcome.ok) {
        lines.push(rct(isTodo ? 'reviewcmd.writtenTodo' : 'reviewcmd.writtenMemory', { n: number, target }))
      } else {
        lines.push(rct('reviewcmd.failed', { n: number, target, detail: outcome.message }))
        kept.push(entry)
      }
    })
    entries.length = 0
    entries.push(...kept)
    return { lines, remaining: kept.length }
  })
}

/**
 * Reject suggestions by 1-based index: drop them from the queue.
 * @param {import('./store.js').SuggestionQueue} queue - the suggestion queue.
 * @param {number[]} indices - 1-based indices into the current queue.
 * @returns {{removed: number, remaining: number}} a report for callers.
```

</details>

**依据 4 · 源码核查**：[lib/store.js:415-446](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/store.js#L415-L446)

目录锁/超时。

<details>
<summary>查看原文（32行）</summary>

```text
export function withLock(dir, fn) {
  if (heldLocks.has(dir)) return fn()
  const lockPath = join(dir, '.memory.lock')
  mkdirSync(dir, { recursive: true })
  const deadline = Date.now() + LOCK_TIMEOUT_MS
  for (;;) {
    let acquired = false
    try {
      const fd = openSync(lockPath, 'wx')
      try {
        writeFileSync(lockPath, LOCK_JSON())
      } finally {
        closeSync(fd)
      }
      acquired = true
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
    if (acquired) break
    if (isStaleLock(lockPath)) rmSync(lockPath, { force: true })
    if (Date.now() >= deadline) {
      throw new Error('dsh-memory-evolve: timed out waiting for the memory lock')
    }
    sleep(LOCK_RETRY_MS)
  }
  heldLocks.add(dir)
  try {
    return fn()
  } finally {
    heldLocks.delete(dir)
    rmSync(lockPath, { force: true })
  }
```

</details>

**依据 5 · 源码核查**：[lib/store.js:795-819](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/store.js#L795-L819)

漂移保护与临时rename。

<details>
<summary>查看原文（25行）</summary>

```text
   * Reload one target under the caller's lock.
   * @returns {{kind:'ok', entries: string[]} | {kind:'read-failed'} | {kind:'drift', backup: string}}
   */
  reload(target, agent) {
    const { text, size } = this.readRaw(target, agent)
    // Only a truly unreadable file is refused (non-empty size yet zero bytes
    // read back — e.g. a broken encoding). A whitespace-only file is a normal
    // empty store: rewriting it cannot wipe history.
    if (text === '' && size > 0) return { kind: 'read-failed' }
    if (!isCanonical(text)) {
      const backup = `${this.pathOf(target, agent)}.bak.${Date.now()}`
      writeFileSync(backup, text)
      return { kind: 'drift', backup }
    }
    return { kind: 'ok', entries: parseEntries(text) }
  }

  /** Atomically write entries to one target's file. */
  write(target, entries, agent) {
    const path = this.pathOf(target, agent)
    const tmp = `${path}.tmp.${process.pid}`
    writeFileSync(tmp, serializeEntries(entries))
    renameSync(tmp, path)
  }

```

</details>

**依据 6 · 源码核查**：[lib/store.js:905-930](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/store.js#L905-L930)

replace唯一匹配保护。

<details>
<summary>查看原文（26行）</summary>

```text
    return withLock(loc.dir, () => {
      const reload = this.reload(target, agent)
      if (reload.kind === 'drift') {
        return {
          ok: false,
          message: st('store.driftGuardWrite', { file: loc.file, backup: reload.backup }),
          target, backup: reload.backup,
        }
      }
      if (reload.kind === 'read-failed') {
        return { ok: false, message: st('store.fileUnreadableWrite'), target }
      }
      const entries = reload.entries
      const matches = entries.filter((entry) => entry.includes(oldText))
      if (matches.length === 0) {
        return { ok: false, message: st('store.noMatch', { match: oldText }), target, entries: [...entries] }
      }
      if (matches.length > 1) {
        return {
          ok: false,
          message: st('store.multiMatch', { match: oldText, count: matches.length }),
          target, matches: [...matches], entries: [...entries],
        }
      }
      const index = entries.indexOf(matches[0])
      const next = [...entries]
```

</details>

**依据 7 · 源码核查**：[lib/store.js:1339-1375](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/store.js#L1339-L1375)

队列锁内重写。

<details>
<summary>查看原文（37行）</summary>

```text
      throw error
    }
  }

  /** Atomically write the full suggestion list. */
  write(entries) {
    mkdirSync(dirname(this.file), { recursive: true })
    const tmp = `${this.file}.tmp.${process.pid}`
    writeFileSync(tmp, entries.map((entry) => JSON.stringify(entry)).join('\n') + (entries.length > 0 ? '\n' : ''))
    renameSync(tmp, this.file)
  }

  /** Append one suggestion under the directory lock. */
  append(entry) {
    return withLock(dirname(this.file), () => {
      const entries = this.read()
      entries.push(entry)
      this.write(entries)
      return { ok: true, queued: entries.length }
    })
  }

  /**
   * Mutate the suggestion list under the directory lock.
   * @param {(entries: object[]) => T} fn - the mutation; return value is passed through.
   * @returns {T} the mutation's return value.
   * @template T
   */
  mutate(fn) {
    return withLock(dirname(this.file), () => {
      const entries = this.read()
      const result = fn(entries)
      this.write(entries)
      return result
    })
  }
}
```

</details>

#### 缺口

- 并发/崩溃及跨文件失败恢复未运行。
  **影响**：不能保证确认操作严格单次或断电不丢。
  **进一步探讨**：注入主轨成功/队列保存失败，重启核重复与未丢建议。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 用户确认和分支隔离能承诺到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能把README不会擅自写理解为所有写操作必须用户逐次确认。key新增排队，但replace/remove直接进入store；memory/user在子Agent来源时有reviewMode/approval守卫，主会话不受该分支守卫，daily/project也可直接写。每轮写入开关主要形成快照提示，不是所有mutation硬授权。批准只证明用户接受当时建议，不证明内容正确或后续不变。

快照总会读global memory/user；项目key依赖会话cwd。keyBranchFilter开启且gitBranch成功时才按scope筛选；非Git、detached或git错误返回undefined，代码保留该项目全部key而不是全部拒绝。所以它是上下文组织机制，不能作为租户或保密隔离。最小提示注入正则也不能证明持久记忆可信。本轮未审完整同步、advisor、COI及全部UI路由，不能把这些模块的作者声明并入可靠性结论。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:66-75](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/README.md#L66-L75)

宽泛作者声明须按接线收窄。

<details>
<summary>查看原文（10行）</summary>

```text

**怎么用**：

1. 正常和 AI 对话即可——每回合结束时它会自动把进展写进项目日志和今日日志；
2. 发现重要事实时对它说「**记一下：这个项目的部署端口是 8080**」，它会写入项目关键记忆，**你确认后**才生效——AI 不会擅自往记忆里写东西；
3. 过几天、换了个会话，直接问「**查一下记忆，上次我们定下的架构决策是什么**」——它能无缝衔接；
4. 记忆多了之后，让 AI「**把 XX 那条记忆归档**」——归档条目不再注入上下文，随时可转回；
5. **情绪反馈记录**：你对工作结果的评价（如「太好了」「怎么还没改对」）会被 AI 记入当日与项目日志（`【反馈】` 行，含情绪、任务分类、你的原话）——积累后随时可以让 AI「**分析一下最近我对哪些方面不满意**」，判断它在哪类任务上做得好/不好。

**会得到什么**：AI 从一个「每次会话都失忆」的对话机器，变成了解你全盘工作的长期伙伴——隔天继续开发，它直接引用昨天的结论，不用你复述。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:560-632](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L560-L632)

global/project与分支未知回退。

<details>
<summary>查看原文（73行）</summary>

```text
    const alias = aliases[agent.session.id]
    let title = null
    try {
      title = sessionTitleService?.get?.(agent.session)?.title ?? null
    } catch { /* 标题读取失败置 null（兼容降级） */ }
    if (alias || title) {
      const bits = []
      if (title) bits.push(st('snap.yourName', { title }))
      if (alias) bits.push(st('snap.yourAlias', { alias }))
      bits.push(st('snap.yourId', { id: agent.session.id }))
      parts.push(`${st('snap.sessionNamed')}\n${bits.join('\n')}`)
    } else {
      parts.push(`${st('snap.sessionPlain')}\n${st('snap.yourId', { id: agent.session.id })}`)
    }
  }
  // ⚠️ 2026-08-13 设计反转：不再注入「评审员机制说明」快照段——注入消息
  // 伪装成用户指令（Agent 不知道评审员存在），快照段介绍 Advisor 会暴露
  // 身份、让 Agent 质疑注入来源（实测执行力下降）。
  const memoryEntries = store.entriesOf('memory')
  const userEntries = store.entriesOf('user')
  if (memoryEntries.length > 0) {
    // 展示剥离身份证（Codex 二轮 P1-4）：全局轨启用后补发的 [id:xxxx]
    // 不得进入模型上下文（与 KEY 段同规则）
    parts.push(`${st('snap.memoryHead')}\n${memoryEntries.map((entry) => `- ${stripEntrySummary(stripEntryId(entry))}`).join('\n')}`)
  }
  if (userEntries.length > 0) {
    parts.push(`${st('snap.userHead')}\n${userEntries.map((entry) => `- ${stripEntrySummary(stripEntryId(entry))}`).join('\n')}`)
  }
  // Project KEY facts are injected for the agent's own project only (its
  // session cwd). Same live-read/change-detected mechanism as the global
  // tracks: a KEY write (tool or web tab) surfaces in the next step's tail.
  // When the project is a git worktree and keyBranchFilter is on, the
  // current branch is resolved live and ONLY entries whose scope covers it
  // are injected (untagged entries = "全部" always qualify). Outside git,
  // or when the branch cannot be resolved, every entry is injected — the
  // conservative choice that never hides memory. The branch name itself is
  // injected alongside, so the model knows which branch it is on.
  const keyAgent = agent?.session?.header?.cwd ? agent : undefined
  const branch = keyAgent && config.keyBranchFilter !== false ? gitBranch(keyAgent.session.header.cwd) : undefined
  let keyEntries = keyAgent ? store.entriesOf('key', keyAgent) : []
  if (branch !== undefined) {
    keyEntries = keyEntries.filter((entry) => {
      const scope = parseEntryBranches(entry)
      return scope === null || scope.includes(branch)
    })
  }
  if (keyEntries.length > 0) {
    // 渐进式披露：根据配置决定全量注入还是摘要注入
    const totalChars = keyEntries.reduce((sum, e) => sum + e.length, 0)
    const mode = config.keyProgressiveDisclosure ?? 'off'
    const useFullInject = mode === 'off' || 
      (mode === 'auto' && keyEntries.length <= (config.keyFullInjectThreshold ?? 3) && totalChars <= (config.keyFullInjectCharLimit ?? 1500))
    
    if (useFullInject) {
      // 全量注入（现状逻辑）
      const head = branch !== undefined
        ? st('snap.keyBranchHead', { branch })
        : st('snap.keyHead')
      // 全量注入展示剥离：身份证 [id:…] + 摘要标记 [summary:…]（2026-08-15：
      // 正文已完整，summary 是仅供摘要模式注入用的元数据，不应再显示）
      parts.push(`${head}\n${keyEntries.map((entry) => `- ${stripEntrySummary(stripEntryId(entry))}`).join('\n')}`)
    } else {
      // 摘要注入（渐进式披露）
      const head = branch !== undefined
        ? st('snap.keySummaryBranchHead', { branch })
        : st('snap.keySummaryHead')
      parts.push(`${head}\n${keyEntries.map((entry) => {
        const shortId = extractEntryId(entry) ?? legacyIdFor(entry)
        const summary = parseEntrySummary(entry) || autoSummary(entry)
        return `- [${shortId}] ${summary}`
      }).join('\n')}`)
    }
  }
```

</details>

**依据 3 · 源码核查**：[lib/store.js:513-525](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/store.js#L513-L525)

git错误/空分支返回undefined。

<details>
<summary>查看原文（13行）</summary>

```text
export function gitBranch(cwd) {
  if (!cwd) return undefined
  try {
    const result = spawnSync('git', ['branch', '--show-current'], {
      cwd, encoding: 'utf8', timeout: 1000, stdio: ['ignore', 'pipe', 'ignore'],
    })
    if (result.error || result.status !== 0) return undefined
    const branch = String(result.stdout ?? '').trim()
    return branch === '' ? undefined : branch
  } catch {
    return undefined
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1130-1205](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L1130-L1205)

子Agent/global守卫范围。

<details>
<summary>查看原文（76行）</summary>

```text
          matches: { type: 'array', items: { type: 'string' } },
          chars: { type: 'integer' },
          backup: { type: 'string' },
          // list 元数据：该轨总条目数与最早/最新日期（指导模型合理设置查询范围）
          total: { type: 'integer' },
          earliest: { type: 'string' },
          latest: { type: 'string' },
          // entries 多轨批量写的结果数组（每轨 {target, ok, message}）
          multi: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                target: { type: 'string' },
                ok: { type: 'boolean' },
                message: { type: 'string' },
              },
              required: ['target', 'ok', 'message'],
            },
          },
        },
        required: ['ok', 'message'],
      },
      render: (_args, value) => [{ type: 'text', text: renderMemoryResult(value) }],
    },
    async execute(args, exec) {
      const target = args.target
      const action = args.action
      const origin = exec?.agent?.session?.header?.origin
      // Layered gate for subagent-origin writes: global tracks (memory/user,
      // injected every session) are the high-risk surface — refused in
      // suggest mode, approval-gated in auto mode. The project-scoped tracks
      // (project/key, keyed to one cwd) and daily (never injected) are safe
      // for automatic writes. The main session is never gated here (the review
      // prompt disciplines its global writes instead).
      if (origin === 'subagent' && (target === 'memory' || target === 'user')) {
        if (getRuntime().reviewMode !== 'auto') {
          return {
            ok: false,
            message: mt('msg.subagentGlobalDenied', { suggestTool: getRuntime().suggestToolName }),
            target,
          }
        }
        const approval = ctx.get('approval')
        if (!approval) {
          return { ok: false, message: mt('msg.approvalUnavailable'), target }
        }
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: config.toolName,
          callId: exec.callId,
          reason: '记忆审查建议写入长期记忆',
          signal: exec.signal,
        })
        if (outcome !== 'allowed-once') {
          return { ok: false, message: mt('msg.notApproved', { outcome }), target }
        }
      }
      // target 兜底校验：required 已放宽为仅 ['action']（entries 批量模式
      // 不需要顶层 target），其他操作缺 target 时给出明确错误而非底层报错。
      const isEntriesAdd = action === 'add' && Array.isArray(args.entries) && args.entries.length > 0
      if (!target && !isEntriesAdd) {
        return { ok: false, message: mt('msg.missingTarget') }
      }
      let result
      try {
        switch (action) {
          case 'list': {
            // archived=true：查归档文件（MEMORY-archive.md / USER-archive.md /
            // 项目 KEY-archive.md）——归档内容不注入、主轨 list 看不到，
            // 需要时可在这里检索（移回主记忆走记忆 Tab 或人工转正）。
            if (args.archived === true) {
              if (target !== 'memory' && target !== 'user' && target !== 'key') {
                result = { ok: false, message: mt('msg.archivedQueryOnly'), target }
                break
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1362-1368](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L1362-L1368)

替换和删除直接store。

```text
          }
          case 'replace':
            result = outcomeOnly(store.replace(target, args.match, args.content, exec.agent))
            break
          case 'remove':
            result = outcomeOnly(store.remove(target, args.match, exec.agent))
            break
```

**依据 6 · 源码核查**：[lib/store.js:449-458](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/store.js#L449-L458)

注入短语正则非全面防护。

<details>
<summary>查看原文（10行）</summary>

```text
/** Minimal prompt-injection scan applied to tool-written memory content. */
const THREAT_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|earlier|above|your)\s+(instructions?|prompts?|messages?|rules?)/i,
  /disregard\s+(all\s+)?(previous|prior|earlier|above|your)\s+(instructions?|prompts?|messages?|rules?)/i,
  /forget\s+(all|everything|your\s+instructions)/i,
  /忽略(所有|之前|以上|先前)(的)?(指令|指示|提示|规则)/,
  /无视(所有|之前|以上|先前)(的)?(指令|指示|提示|规则)/,
]

/**
```

</details>

#### 缺口

- 全部可选模块与真实宿主权限链未审。
  **影响**：无法承诺所有写需确认或跨用户隔离。
  **进一步探讨**：专用profile先测主/子Agent及新增/替换/删除矩阵，敏感资料不用此边界隔离。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样可控试用，值得验证何种增量？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

建议专用profile与副本项目，只开核心记忆，先记录cwd和分支，分别测试新增排队、批准、替换/删除、切分支及detached，然后开始低敏感重复任务。先备份memoryDir与建议文件；出现错项目/错分支注入或意外写入就停插件和模型写，保留主轨/队列对账，回手工AGENTS与日志。卸载不会让已写文件、已经发送模型内容或可选同步副本自动消失。

依赖DSH相容接口、可写本地目录、项目Git（分支功能）和人工复核；可选模型审查/同步各有外部依赖及费用，未查现价，不算0成本。首次配置/迁移、持续纠错与上下文token、失败恢复和退出清理都需人工，未测净节时。

可探索分支未知时暂停注入带scope的key并显示原因，同时保留无scope记忆。这相对现有全部回退增加保守性，但可能漏掉必要事实；用detached/无Git/命令失败与正常分支对照当前策略，计错用、漏用、提示负担与任务质量。若现有回退效果更好或提示负担抵消收益便推翻，尚未实现，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:560-632](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L560-L632)

假设由未知分支放宽推导。

<details>
<summary>查看原文（73行）</summary>

```text
    const alias = aliases[agent.session.id]
    let title = null
    try {
      title = sessionTitleService?.get?.(agent.session)?.title ?? null
    } catch { /* 标题读取失败置 null（兼容降级） */ }
    if (alias || title) {
      const bits = []
      if (title) bits.push(st('snap.yourName', { title }))
      if (alias) bits.push(st('snap.yourAlias', { alias }))
      bits.push(st('snap.yourId', { id: agent.session.id }))
      parts.push(`${st('snap.sessionNamed')}\n${bits.join('\n')}`)
    } else {
      parts.push(`${st('snap.sessionPlain')}\n${st('snap.yourId', { id: agent.session.id })}`)
    }
  }
  // ⚠️ 2026-08-13 设计反转：不再注入「评审员机制说明」快照段——注入消息
  // 伪装成用户指令（Agent 不知道评审员存在），快照段介绍 Advisor 会暴露
  // 身份、让 Agent 质疑注入来源（实测执行力下降）。
  const memoryEntries = store.entriesOf('memory')
  const userEntries = store.entriesOf('user')
  if (memoryEntries.length > 0) {
    // 展示剥离身份证（Codex 二轮 P1-4）：全局轨启用后补发的 [id:xxxx]
    // 不得进入模型上下文（与 KEY 段同规则）
    parts.push(`${st('snap.memoryHead')}\n${memoryEntries.map((entry) => `- ${stripEntrySummary(stripEntryId(entry))}`).join('\n')}`)
  }
  if (userEntries.length > 0) {
    parts.push(`${st('snap.userHead')}\n${userEntries.map((entry) => `- ${stripEntrySummary(stripEntryId(entry))}`).join('\n')}`)
  }
  // Project KEY facts are injected for the agent's own project only (its
  // session cwd). Same live-read/change-detected mechanism as the global
  // tracks: a KEY write (tool or web tab) surfaces in the next step's tail.
  // When the project is a git worktree and keyBranchFilter is on, the
  // current branch is resolved live and ONLY entries whose scope covers it
  // are injected (untagged entries = "全部" always qualify). Outside git,
  // or when the branch cannot be resolved, every entry is injected — the
  // conservative choice that never hides memory. The branch name itself is
  // injected alongside, so the model knows which branch it is on.
  const keyAgent = agent?.session?.header?.cwd ? agent : undefined
  const branch = keyAgent && config.keyBranchFilter !== false ? gitBranch(keyAgent.session.header.cwd) : undefined
  let keyEntries = keyAgent ? store.entriesOf('key', keyAgent) : []
  if (branch !== undefined) {
    keyEntries = keyEntries.filter((entry) => {
      const scope = parseEntryBranches(entry)
      return scope === null || scope.includes(branch)
    })
  }
  if (keyEntries.length > 0) {
    // 渐进式披露：根据配置决定全量注入还是摘要注入
    const totalChars = keyEntries.reduce((sum, e) => sum + e.length, 0)
    const mode = config.keyProgressiveDisclosure ?? 'off'
    const useFullInject = mode === 'off' || 
      (mode === 'auto' && keyEntries.length <= (config.keyFullInjectThreshold ?? 3) && totalChars <= (config.keyFullInjectCharLimit ?? 1500))
    
    if (useFullInject) {
      // 全量注入（现状逻辑）
      const head = branch !== undefined
        ? st('snap.keyBranchHead', { branch })
        : st('snap.keyHead')
      // 全量注入展示剥离：身份证 [id:…] + 摘要标记 [summary:…]（2026-08-15：
      // 正文已完整，summary 是仅供摘要模式注入用的元数据，不应再显示）
      parts.push(`${head}\n${keyEntries.map((entry) => `- ${stripEntrySummary(stripEntryId(entry))}`).join('\n')}`)
    } else {
      // 摘要注入（渐进式披露）
      const head = branch !== undefined
        ? st('snap.keySummaryBranchHead', { branch })
        : st('snap.keySummaryHead')
      parts.push(`${head}\n${keyEntries.map((entry) => {
        const shortId = extractEntryId(entry) ?? legacyIdFor(entry)
        const summary = parseEntrySummary(entry) || autoSummary(entry)
        return `- [${shortId}] ${summary}`
      }).join('\n')}`)
    }
  }
```

</details>

**依据 2 · 源码核查**：[README.md:12-42](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/README.md#L12-L42)

安装配置与宽泛卸载声明。

<details>
<summary>查看原文（31行）</summary>

````text

插件包内自带 `cordis.patch.yml`（`dsh.bundle.patch` 声明），`dsh plugin add` 安装后 **host 端自动注册，无需任何手动配置**。以 web profile 为例，两步装好：

```sh
# 1. 安装到 profile（本地目录用 link:，也可用 git/registry 包地址）
dsh plugin --profile web add github:csyangwen/dsh-memory-evolve

# 2. 重启 dsh web 即生效
```

> ⚠️ **不要再往 `~/.dsh/profiles/web/cordis.patch.yml` 手动 insert 本插件**：bundle patch 已自动注册，重复 insert 同 id 会让加载器报 duplicate loader entry id 无法启动。完整说明见 [详细功能说明](README-详细说明.md)「标准安装」章节。

**修改默认配置**（如开启回合内记忆审查）：在 profile 的 `cordis.patch.yml` 用 id 覆盖（顶层写法，非 insert）：

```yaml
- id: dsh-memory-evolve
  config:
    reviewEnabled: true      # 开启回合内记忆审查（默认关）
    reviewInterval: 10       # 每 10 个用户回合审查一次
```

**插件异常导致 DSH 无法启动时，临时禁用**（等修复后取消）：同样在 profile 的 `cordis.patch.yml` 加一行即可，无需卸载：

```yaml
- id: dsh-memory-evolve
  disabled: true
```

**从旧版本升级**：若你此前按旧文档手动 insert 过本插件，请删除 profile patch 里的 insert 行（否则与 bundle 自动注册重复）。

卸载：`dsh plugin --profile web remove dsh-memory-evolve`，一切效果随插件卸载自动清理。
````

</details>

**依据 3 · 源码核查**：[lib/index.js:1543-1583](https://github.com/csyangwen/dsh-memory-evolve/blob/44b6b3eb65a1d50ceba0afb2c13acdd4a8b81423/lib/index.js#L1543-L1583)

本地store/queue实例。

<details>
<summary>查看原文（41行）</summary>

```text
export function apply(ctx, rawConfig = {}) {
  const config = resolveConfig(rawConfig)
  // Host-side locale (English support): resolve once at boot from the DSH
  // Language preference (default 'en' when unset), then follow live changes
  // through the settings commit event. Getter-based tool descriptions and
  // snapshot builders read the active locale per call, so a flip takes
  // effect on the next model request / injected turn without re-registering
  // anything. The 'locale' namespace belongs to DSH's own locale plugin —
  // we only read it here and never write to it.
  //
  // 2026-09-28（DSH 0.2.0 适配）：宿主把 settings 服务的 get() 移除、改为
  // describe()，并把提交事件从 'settings/updated' 改名为
  // 'settings/document-updated'。两个事件名都订阅（未知事件名在 cordis 里
  // 只是永不触发，不会报错），读值统一走 settings-compat 的版本兼容层，
  // 于是新老宿主都能就地跟随语言切换。
  setLocale(resolveLocale(ctx))
  ctx.effect(() => {
    const settings = ctx.get('settings')
    if (!hasSettingsRead(settings)) return () => {}
    const disposers = SETTINGS_CHANGE_EVENTS.map((event) => ctx.on(event, (ns) => {
      if (ns === 'locale') setLocale(resolveLocale(ctx))
    }))
    return () => { for (const dispose of disposers) dispose() }
  }, 'dsh-memory-evolve: locale watcher')
  const store = new MemoryStore(config.memoryDir, {
    ...config,
    // 记忆同步接线（施工图 §4.2/§6）：entryIdMode 随 syncEnabled 动态开关
    // （syncCtrl.sync() 里同步）；projectDirResolver 让 sync 项目（迁移到
    // projectId 目录后）的 store 读写定位到新目录，未启用项目回退原逻辑。
    entryIdMode: config.syncEnabled ? 'on' : 'off',
    projectDirResolver: makeProjectDirResolver(config),
  })
  const archive = new ArchiveStore(config.memoryDir, { projectDirResolver: makeProjectDirResolver(config) })
  const queue = new SuggestionQueue(config.suggestionsFile)
  const todoStore = new TodoStore(config.memoryDir, makeProjectDirResolver(config))
  const stateFile = resolve(config.stateFile ?? join(config.memoryDir, 'plugin-state.json'))
  // 会话别名共享存储（aliases.json 单实例）：api 路由（/api/aliases）与
  // de_session rename 共用，避免多实例内存缓存互覆写
  const aliasStore = new AliasStore(config.memoryDir)

  // Runtime configuration: cordis config (static defaults) overlaid with the
```

</details>

#### 缺口

- 宿主兼容、可选外部费用和完整卸载/任务收益未验。
  **影响**：只推荐隔离试用，不能生产推广。
  **进一步探讨**：备份profile做写入矩阵与真实任务A/B，记录恢复工时/模型token。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
