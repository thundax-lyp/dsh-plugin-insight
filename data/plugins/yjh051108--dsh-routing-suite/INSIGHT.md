# dsh-routing-suite

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[1952733](https://github.com/yjh051108/dsh-routing-suite/tree/195273352f23bff7f9023ebe2ec0cdbdf9c98f10)

<!-- BEGIN META -->
[![GitHub ★ 6,997](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C997&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjh051108/dsh-routing-suite)
<!-- END META -->

> **实现功能**：组合运行时注入器、思维模式路由预设与分级任务协议。

> **核心亮点**：相对单纯提示词，分级模块为任务编辑与锁定提供结构约束；相对每次重启开发，注入器试图缩短调试链。组合也增加了装配和状态责任，不能把三个部分的声明相加成整体收益。核心增量是开发时热装配与规格化交接，路由优于原生行为仍主要来自作者实验。 依据[Q03](#research-q03)。

> **风险与缺陷**：核心限制有两项。README声明目标宿主<0.2.0，注入器实际访问loader.internal.loadCache并用registry.delete/plugin重建fiber，所以不能从目录收录推断当前0.2.x兼容。持久化调用链现已核清：mode-state.saveState捕获写错返回false，而index的setState不传播返回值；tools的revise_do调用saveState后直接返回ok:true，lock_stage也不检查保存结果。因此写失败时至少部分工具可能给出成功文本而磁盘仍旧，属于源码可见的错误传播缺口，尚未进行权限故障注入确认表现。不能把内存迁移和回执称为持久成功。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复调试DSH插件、调节任务persona并维护较长开发清单的高级用户。原办法是重启宿主、手工复制预设及聊天中打卡；合格结果是插件正确加载、当前路由可解释、任务按明确验收完成。它是三个组件的套装，不能把根包的收录理解为三个组件已经兼容当前宿主。

相对单纯提示词，分级模块为任务编辑与锁定提供结构约束；相对每次重启开发，注入器试图缩短调试链。组合也增加了装配和状态责任，不能把三个部分的声明相加成整体收益。核心增量是开发时热装配与规格化交接，路由优于原生行为仍主要来自作者实验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 热装配 | 开发时加载插件 | 依赖loader及registry |
| 分级清单 | 规格、锁定与验收 | 持久失败需核对 |
| persona路由 | 调节任务提示 | 效果依赖模型版本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH | 必需 | 宿主内部接口 | 超范围先观察 |
| profile与状态目录写入 | 必需 | 装配和清单 | 失败停止推进 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 核对组件与宿主范围 | 隔离profile备份 |
| 2 | 逐组件加载并核对磁盘清单 | 失败回原生预设 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建资源未知 | 安装与复制耗时未知 | 三个装配面 |
| 持续使用 | 模型调用未知 | 协议维护与兼容排查 | 无端到端成本 |
| 失败恢复 | 可能重复调用 | 核对profile和状态文件 | 读写失败可能隐藏 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态约束 | 结构化工具字段与锁定 | 真正业务验收 |
| 路由效果 | 作者实验声明 | 当前宿主同条件收益 |

> **思考**：核心限制有两项。README声明目标宿主<0.2.0，注入器实际访问loader.internal.loadCache并用registry.delete/plugin重建fiber，所以不能从目录收录推断当前0.2.x兼容。持久化调用链现已核清：mode-state.saveState捕获写错返回false，而index的setState不传播返回值；tools的revise_do调用saveState后直接返回ok:true，lock_stage也不检查保存结果。因此写失败时至少部分工具可能给出成功文本而磁盘仍旧，属于源码可见的错误传播缺口，尚未进行权限故障注入确认表现。不能把内存迁移和回执称为持久成功。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对单纯提示词，分级模块为任务编辑与锁定提供结构约束；相对每次重启开发，注入器试图缩短调试链。组合也增加了装配和状态责任，不能把三个部分的声明相加成整体收益。核心增量是开发时热装配与规格化交接，路由优于原生行为仍主要来自作者实验。 依据[Q03](#research-q03)。

相对单纯提示词，分级模块为任务编辑与锁定提供结构约束；相对每次重启开发，注入器试图缩短调试链。组合也增加了装配和状态责任，不能把三个部分的声明相加成整体收益。核心增量是开发时热装配与规格化交接，路由优于原生行为仍主要来自作者实验。 依据[Q03](#research-q03)。

可借鉴的是graded把纯状态迁移与工具定义分离，锁阶段不依赖字符串解析；这比让模型承诺不改任务更可审查。移植要补足持久化错误传播（saveState返回false当前被工具忽略）和版本兼容检查。注入器的大模块同时承担scaffold、安装和loader重建，依赖宿主细节较多，不能仅复制热重载逻辑就获得跨版本可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心限制有两项。README声明目标宿主<0.2.0，注入器实际访问loader.internal.loadCache并用registry.delete/plugin重建fiber，所以不能从目录收录推断当前0.2.x兼容。持久化调用链现已核清：mode-state.saveState捕获写错返回false，而index的setState不传播返回值；tools的revise_do调用saveState后直接返回ok:true，lock_stage也不检查保存结果。因此写失败时至少部分工具可能给出成功文本而磁盘仍旧，属于源码可见的错误传播缺口，尚未进行权限故障注入确认表现。不能把内存迁移和回执称为持久成功。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察套装整体；先核对目标宿主版本与组件独立装配结果，再决定是否在隔离profile做开发实验。相对手动预设，它有结构化任务锁定及热装配增量，但版本与状态失败链尚未形成可控整体。若宿主超出声明范围或保存失败，不继续注入和推进任务，保留profile与清单并回到原生预设。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、graded/src/mode-state.js、injector/src/index.ts、graded/src/tools.js、graded/src/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[yjh051108/dsh-routing-suite](https://github.com/yjh051108/dsh-routing-suite)
- **版本号**：0.3.3（[固定提交 1952733](https://github.com/yjh051108/dsh-routing-suite/tree/195273352f23bff7f9023ebe2ec0cdbdf9c98f10)）
- **版本日期**：2026-09-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将分级状态提交与工具成功结果绑定，磁盘失败时拒绝宣告阶段锁定，可以避免内存状态与重启后清单分歧。用同一清单分别注入写权限拒绝、截断JSON和热重载，检查用户看到的阶段及重载后的状态；若只能靠人工重建或工具仍报告成功，则假设未实现。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 4308 | — | — | 58663 |
| .js | source | 14 | 5523 | 4589 | 743 | — |
| .mjs | test | 8 | 1952 | 1690 | 161 | — |
| .mjs | source | 31 | 8174 | 6088 | 1693 | — |
| .ts | source | 3 | 3562 | 2631 | 818 | — |
| .cjs | source | 1 | 129 | 82 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/yjh051108/dsh-routing-suite/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向反复调试DSH插件、调节任务persona并维护较长开发清单的高级用户，采用价值是否由固定机制与边界支持？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向反复调试DSH插件、调节任务persona并维护较长开发清单的高级用户。原办法是重启宿主、手工复制预设及聊天中打卡；合格结果是插件正确加载、当前路由可解释、任务按明确验收完成。它是三个组件的套装，不能把根包的收录理解为三个组件已经兼容当前宿主。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-14](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/README.md#L3-L14)

作者介绍三个组件的任务。

<details>
<summary>查看原文（12行）</summary>

```text
一个仓库装齐三件套：**运行时注入器**（免重启运行时管理层）+
**思维模式路由预设**（任务感知推理模式，P1-P23 实测）+
**分级任务协议**（脑暴出题 → 规格化计划 → 打卡制 → 组收官 → 终验，含红队门与审计端点）。

[中文](README.md) | [English](README.en.md)

## 组件入口（快速跳转）

| 组件 | 说明 | 入口 |
|---|---|---|
| **injector** | 运行时注入器：`dev_*` 工具全家桶（注入/热重载/卸载/侧挂转正/路由自愈） | [injector/README.md](injector/README.md) · [文档](injector/docs/SPEC.md) |
| **preset** | 思维模式路由预设（router-standard / router-spec，按模型 persona 路由） | [preset/README.md](preset/README.md) · [实验报告](preset/docs/experiments.md) |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

注入器通过Cordis loader/registry加载本地模块，涉及junction、import缓存与整包重建；graded模块用结构化plan.groups维护大类、小类、锁定和审核状态。状态写入DSH_HOME/graded-state，不写官方todo。锁定靠工具层迁移校验，而任务是否真正达标仍依赖验收方。预设再以persona改变模型行为，这与工具强制约束有不同强度。

#### 证据与依据

**依据 1 · 源码核查**：[injector/src/index.ts:1158-1188](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/injector/src/index.ts#L1158-L1188)

坏缓存分支清理、import并通过registry重建fiber；失败恢复缓存但无旧代回滚保证。

<details>
<summary>查看原文（31行）</summary>

```text
      const backup = new Map<string, any>()
      for (const u of urls) {
        backup.set(u, loadCache.get(u))
        Map.prototype.delete.call(loadCache, u)
      }
      try {
        const fresh = ctx.loader.unwrapExports(await ctx.loader.import(entryUrlFinal, () => []))
        for (const entry of ctx.loader.entries()) {
          const opts = entry.options as { name?: string; id?: string }
          if (opts?.name && String(opts.name).includes(match)) {
            const fiber = entry.fiber
            if (fiber && typeof fiber === 'object') {
              // 尝试用新插件导出重建 fiber（entry 的 plugin 引用替换）
              // ⚠️ 先 await 旧 fiber dispose（异步清理防注册竞态）
              if (typeof fiber.dispose === 'function') {
                try { await fiber.dispose() } catch { /* 忽略 */ }
              }
              const registry = (ctx as any).registry
              if (registry && typeof registry.delete === 'function' && typeof registry.plugin === 'function') {
                registry.delete(fiber)
                const nf = registry.plugin(fresh, entry.options.config ?? {}, () => [])
                nf.entry = entry
                entry.fiber = nf
              }
            }
          }
        }
        return `OK: ${match} 坏缓存兜底重载完成（无旧代回滚）`
      } catch (e) {
        for (const [u, job] of backup) loadCache.set(u, job)
        return 'ERROR: 兜底 import 失败，已恢复原缓存: ' + (e instanceof Error ? e.stack : String(e))
```

</details>

**依据 2 · 源码核查**：[graded/src/mode-state.js:202-218](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/mode-state.js#L202-L218)

实际锁定迁移到l2-edit与review。

<details>
<summary>查看原文（17行）</summary>

```text
/** 锁定 L1 → 进入 L2 编辑。 */
export function onLockL1(prev) {
  return {
    ...(prev || initMode()),
    l1Locked: true,
    stage: 'l2-edit',
  }
}

/** 锁定 L2 → 所有门关闭 → 审核。 */
export function onLockL2(prev) {
  return {
    ...(prev || initMode()),
    l2Locked: true,
    stage: 'review',
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对单纯提示词，分级模块为任务编辑与锁定提供结构约束；相对每次重启开发，注入器试图缩短调试链。组合也增加了装配和状态责任，不能把三个部分的声明相加成整体收益。核心增量是开发时热装配与规格化交接，路由优于原生行为仍主要来自作者实验。

#### 证据与依据

**依据 1 · 源码核查**：[graded/src/tools.js:47-67](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/tools.js#L47-L67)

结构化规格与验收字段。

<details>
<summary>查看原文（21行）</summary>

```text
/* 标准 raw JSON Schema 子节点（无属性级 required 键）；3.1 小类规格化：spec/accept/do/verify 必填 */
const groupItemSchema = {
  type: 'object', additionalProperties: false, required: ['title', 'spec', 'accept', 'do', 'verify'],
  properties: {
    title: { type: 'string', description: '小类名（纯名词短语,不要重复大类词）' },
    concepts: { type: 'array', items: { type: 'string' }, description: `核心概念（≤${loadConceptLimit(null)} 个——面板设置实时值；超限仅提示非错误）` },
    spec: { type: 'string', description: '小类任务说明（多行；可提及参考文档/文件，注入时自然引用）' },
    accept: { type: 'array', items: { type: 'string' }, description: '验收标准（按模式文法：correct=可测量断言/experience=感受断言+可复现动作/research=可复核断言;探索型须带退路占位）' },
    mode: { type: 'string', enum: ['correct', 'experience', 'research'], description: '本小类验收模式（可缺省=继承会话模式——全栈任务可按小类粒度换重心）' },
    do: { type: 'string', enum: ['self', 'subagent', 'workflow', 'daemon', 'mixed'], description: '开发增量执行形态（选项内自主抉择,注入给摘要）' },
    verify: { type: 'string', enum: ['self', 'subagent', 'redteam', 'dual', 'workflow'], description: '验证执行形态（开发期只读；redteam 走裁决门）' },
  },
}
const groupSchema = {
  type: 'object', additionalProperties: false, required: ['title', 'items'],
  properties: {
    title: { type: 'string', description: '大类名（须与已锁定的大类一致）' },
    spec: { type: 'string', description: '组任务描述（可选；缺省保留 L1 已定值）' },
    accept: { type: 'array', items: { type: 'string' }, description: '组级验收标准（可选；缺省保留 L1 已定值）' },
    verify: { type: 'string', enum: ['self', 'subagent', 'redteam', 'user'], description: '组收官验证方（可选；缺省保留 L1 已定值）' },
    items: { type: 'array', items: groupItemSchema },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心限制有两项。README声明目标宿主<0.2.0，注入器实际访问loader.internal.loadCache并用registry.delete/plugin重建fiber，所以不能从目录收录推断当前0.2.x兼容。持久化调用链现已核清：mode-state.saveState捕获写错返回false，而index的setState不传播返回值；tools的revise_do调用saveState后直接返回ok:true，lock_stage也不检查保存结果。因此写失败时至少部分工具可能给出成功文本而磁盘仍旧，属于源码可见的错误传播缺口，尚未进行权限故障注入确认表现。不能把内存迁移和回执称为持久成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-41](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/README.md#L35-L41)

目标宿主范围。

````text

> DSH 目前处于 developer preview，官方明示会有破坏性变更（breaking changes）。
> 本仓库的版本跟进记录见 `preset/CHANGELOG.md`。

## 安装链（三步）

```powershell
````

**依据 2 · 源码核查**：[graded/src/mode-state.js:27-45](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/mode-state.js#L27-L45)

保存及读取失败行为。

<details>
<summary>查看原文（19行）</summary>

```text
export function saveState(sid, s) {
  try {
    mkdirSync(stateDirFor(), { recursive: true })
    writeFileSync(stateFileFor(sid), JSON.stringify(serializeState(s)), 'utf-8')
    return true
  } catch (e) {
    console.warn('[graded] saveState failed:', sid, e?.message || e)
    return false
  }
}
export function loadState(sid) {
  try {
    const f = stateFileFor(sid)
    if (!existsSync(f)) return null
    const s = deserializeState(JSON.parse(readFileSync(f, 'utf-8')))
    return s.stage === 'off' ? null : s
  } catch {
    return null
  }
```

</details>

**依据 3 · 源码核查**：[graded/src/index.js:147-149](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/index.js#L147-L149)

setState忽略saveState返回值。

```text
  function state(sid) { return loadState(sid) || initMode() }
  function setState(sid, s) { saveState(sid, s) }
  function getState(sid) { return loadState(sid) }
```

**依据 4 · 源码核查**：[graded/src/tools.js:210-213](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/tools.js#L210-L213)

保存后不检查布尔结果直接返回ok:true。

```text
      const res = onReviseDo(s, title, doNext)
      if (!res.ok) throw new Error(res.error)
      saveState(sid, res.state)
      return { ok: true, text: `已修订「${title}」执行形态 → do=${doNext}（轨迹登记在案）。\n⚠️ 温和提醒：verify 不变——验收承诺不因形态变化而打折；形态不符时先自纠再干。` }
```

**依据 5 · 源码核查**：[graded/src/tools.js:313-316](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/tools.js#L313-L316)

lock_stage保存后读回或回退s，不检查false。

```text
        const gBad = (s.plan.groups || []).find((g) => !String(g.spec || '').trim() || (g.accept || []).length === 0)
        if (gBad) throw new Error(`大类「${gBad.title}」规格不全（组任务描述 spec / 组验收标准 accept 缺失）——补全后再锁定。`)
        saveState(sid, onLockL1(s))
        const cur = loadState(sid) || s
```

#### 缺口

- 错误传播静态缺口在权限失败、磁盘满时的用户表现未复现。
  **影响**：不能视阶段成功回执为已持久化；与宿主范围一起支持观察。
  **进一步探讨**：在隔离profile注入写失败，核对回执和磁盘状态，再验证修复后的失败闭合。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要三组件各自安装或复制到正确一级预设目录，PowerShell安装链、匹配DSH版本和可写profile/graded-state。涉及本地链接和包管理，用户需了解源码与安装副本区别。卸载要移除所选组件和预设，不直接删除任务状态当作成功退出；试验前保存profile和清单原件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-76](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/README.md#L58-L76)

组件安装和一级预设复制。

<details>
<summary>查看原文（19行）</summary>

````text
$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\router-standard'
Copy-Item -Recurse .\preset\router-standard $target

$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\router-spec'
Copy-Item -Recurse .\preset\router-spec $target

# 步骤 3：重启 DSH → 新会话选择 Router Standard / Router Spec (experimental)
```

> 注意：不要复制 `preset` 整目录（会多套一层，DSH 发现不了预设）。

## 组件

| 路径 | 仓库 | 版本 | 作用 |
|---|---|---|---|
| `injector/` | [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) | [v0.3.3](https://github.com/yjh051108/dsh-super-injector/releases/tag/v0.3.3) | 运行时注入器：dev_* 工具全家桶（注入/热重载/侧挂转正/卸载/路由自愈）；`github:` 装配由 prepare 钩子自动构建 |
| `preset/` | [dsh-router-standard](https://github.com/yjh051108/dsh-router-standard) | [v0.3.0 … 主线 v1.19.1/v34](https://github.com/yjh051108/dsh-router-standard/releases/tag/v0.3.0) | 思维模式路由预设：router-standard（分类 persona + 完整 sections）/ router-spec（深度思考优先）。router-pro 为规划中（planned），未随 v0.3.0 发布 |
| `graded/` | [dsh-graded-mode](https://github.com/yjh051108/dsh-routing-suite/tree/main/graded) | [v0.0.1-rc1](https://github.com/yjh051108/dsh-routing-suite/releases/tag/v0.0.1-rc1) | graded 模式：会话级两级任务协议（脑暴选择题对齐 → 北极星定稿 → 规格化计划 → 按规格注入 → 打卡制 → 组收官 → 终验）；6 工具 + 三模式 + 小类模式粒度 + 红队门 + 审计端点；`graded/dsh-graded-mode-3.2.0.tgz` 可直接 `dsh plugin --profile web add` |

````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

首次是源码构建、组件安装和重载排查；持续是persona协议token、任务细粒度维护和热注入兼容适配；失败恢复要核对profile、链接和磁盘清单。没有同条件全流程账单与人工耗时，作者协议对比不能证明所有任务节约。旧版本边界与持久化异常使当前采用负担显著。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:81-88](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/README.md#L81-L88)

作者路由效果主张。

```text
## router-standard 预设能力（P1-P23 实测摘要）

- **三行为带 + weak 内路由**：spec（计划-集体）/ react（执行者）/ mixed（陷阱，回避）/ weak（模型自分类）
- **按模型选 persona**：Pro=spec 句+few-shot（区分度 +5.0）；Flash=neutral+classify（+5.7）
- **近距离引导**：每轮用户消息后注入固定引导（缓存 92-94% 命中），路由 96% + 收敛 100% + 反稀释
- **单任务三锚**（persona 静态）：回顾 + 收敛 + 反跑题 —— 开放任务完成率 0% → 100%
- **plan-mode 保留**：只替换 persona section，plan 边界不失忆
- **AI 自优化工具**：`dev_router_status` / `dev_router_mode` / `dev_mode_subagent`
```

#### 缺口

- 完整任务的协议开销和合格率缺少同条件结果。
  **影响**：不引用作者局部效果为整体节约。
  **进一步探讨**：比较同模型同任务的费用及人工维护清单时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴的是graded把纯状态迁移与工具定义分离，锁阶段不依赖字符串解析；这比让模型承诺不改任务更可审查。移植要补足持久化错误传播和版本兼容检查。注入器的大模块同时承担scaffold、安装和loader重建，依赖宿主细节较多，不能仅复制热重载逻辑就获得跨版本可靠性。

#### 证据与依据

**依据 1 · 源码核查**：[graded/src/mode-state.js:2-10](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/mode-state.js#L2-L10)

纯状态迁移模块边界。

```text
 * mode-state — 分级模式 v4 状态机（工具驱动,顺序强制,零字符串解析）。
 *
 * v4 心智模型（用户拍板）：
 *   - 顺序强制：大类编辑 → 大类锁定 → 小类编辑 → 小类锁定 → 审核。
 *   - 阶段推进 = 工具调用事件（lock_stage 成功即切阶段），不做任何内容识别。
 *   - 锁了就是锁了：已锁层 edit 被拒（工具层校验）；解锁唯一入口 = 审核拒绝（全解锁回 L1 编辑）。
 *   - 数据面独立：清单只存在于结构化 tree 对象（graded/plan 事件快照），不写官方 todo_write。
 *
 * 本模块只做状态迁移 + 树规范化（纯函数，可单测）。
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将分级状态提交与工具成功结果绑定，磁盘失败时拒绝宣告阶段锁定，可以避免内存状态与重启后清单分歧。用同一清单分别注入写权限拒绝、截断JSON和热重载，检查用户看到的阶段及重载后的状态；若只能靠人工重建或工具仍报告成功，则假设未实现。

#### 证据与依据

**依据 1 · 源码核查**：[graded/src/mode-state.js:27-45](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/graded/src/mode-state.js#L27-L45)

持久错误为改进假设的来源。

<details>
<summary>查看原文（19行）</summary>

```text
export function saveState(sid, s) {
  try {
    mkdirSync(stateDirFor(), { recursive: true })
    writeFileSync(stateFileFor(sid), JSON.stringify(serializeState(s)), 'utf-8')
    return true
  } catch (e) {
    console.warn('[graded] saveState failed:', sid, e?.message || e)
    return false
  }
}
export function loadState(sid) {
  try {
    const f = stateFileFor(sid)
    if (!existsSync(f)) return null
    const s = deserializeState(JSON.parse(readFileSync(f, 'utf-8')))
    return s.stage === 'off' ? null : s
  } catch {
    return null
  }
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

当前建议观察套装整体；先核对目标宿主版本与组件独立装配结果，再决定是否在隔离profile做开发实验。相对手动预设，它有结构化任务锁定及热装配增量，但版本与状态失败链尚未形成可控整体。若宿主超出声明范围或保存失败，不继续注入和推进任务，保留profile与清单并回到原生预设。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-41](https://github.com/yjh051108/dsh-routing-suite/blob/195273352f23bff7f9023ebe2ec0cdbdf9c98f10/README.md#L35-L41)

声明版本限制影响采用。

````text

> DSH 目前处于 developer preview，官方明示会有破坏性变更（breaking changes）。
> 本仓库的版本跟进记录见 `preset/CHANGELOG.md`。

## 安装链（三步）

```powershell
````

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
