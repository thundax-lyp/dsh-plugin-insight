# DSH Toolkit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：将时间、编码、数据检索、正则、统计与结构校验等十项工具集合装入 DSH profile。

> **亮点**：把逐个安装的事项压缩为一次 profile 接入，同时为注册冲突加入逆序释放路径。各数据工具的计算逻辑来自包内子组件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：只要一个子包注册报错，集合就停止加载。释放失败会被忽略，报错里的回滚数量不能证明工具目录恢复原状。[Q02](#research-q02)

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
  - [Q01 · 同一团队为何会一次挂载工具集合？根仓库承担了哪些职责？](#detail-section-11)
  - [Q02 · 后装的子包注册失败时，根包如何恢复，能保证全组原子性吗？](#detail-section-12)
  - [Q03 · 一组已注册工具能为数据任务提供什么，首次采用和持续使用各需承担什么？](#detail-section-13)
  - [Q04 · 何时值得试集合包？如何改善同名冲突的可诊断性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在一个 DSH profile 经常处理 CSV、JSON 和文本的用户，可将多个工具一起挂载，固定它们的版本组合。

独立工具可以分别安装、单独升级和回退；简单批处理任务可继续使用已有本地脚本。根聚合的价值在一次接入同一批固定工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| CSV 操作 | 解析、查行、统计或转为 JSON | 需向工具提供受支持的数据输入 |
| 统计分析 | 求描述统计、百分位和相关性 | 依赖数值输入与所选方法 |
| 正则处理 | 匹配、提取、替换和静态解释 | 执行动作使用 worker 超时，超限会报错 |
| Schema 操作 | 校验、列路径、解释及规范化 | 支持范围以该子包实现为准 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH profile 支持 bundle，Cordis 和 DSH peers 满足清单 | 是 | 让宿主加载元包和工具服务 | 目标环境尚未确认会成功解析 |
| 固定子包 lib 产物 | 是 | 由根入口执行相对导入 | 缺失会在工具注册前中止 |
| 空白或已清点名称的 profile | 是 | 避免与独装版本发生注册冲突 | 如冲突，隔离后改用所需单包 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择配置 | 用户准备隔离 web 或 headless profile | 实际使用的入口对应同一 profile |
| 加载整组 | 用户从固定版本添加根 bundle | 宿主可列出期望工具 |
| 对照并回退 | 用户提交已知 CSV 数据并核对结果 | 错误或残留时改回已知配置并单装 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地构建耗用 CPU 与磁盘，金额未知 | 确认 peer 与工具重名 | 若需 pack 先构建 |
| 持续使用 | JSON 数据、模型工具调用和 worker 使用资源 | 维护冻结的子包组合 | Token 与时间未测 |
| 失败恢复 | 未测重启与重新加载成本 | 对照工具列表，改回干净 profile | 释放失败可能未告知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 联合挂载 | 固定源码实现十个工具模块的同组注册 | 实测升级耗时及失败率 |
| 局部失败恢复 | 逆序释放与还原注册方法实现可查 | 真实宿主目录是否一致 |
| 重复数据任务 | CSV、统计、正则和 Schema 动作已配置 | 相对已有本地脚本的正确率和单位成本 |

> **思考**：只要一个子包注册报错，集合就停止加载。释放失败会被忽略，报错里的回滚数量不能证明工具目录恢复原状。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把逐个安装的事项压缩为一次 profile 接入，同时为注册冲突加入逆序释放路径。各数据工具的计算逻辑来自包内子组件。[Q01](#research-q01) [Q02](#research-q02)

在真实产物套一层工具注册捕获并尝试逆序释放，控制同步错误范围。原始 register 会恢复；释放错误仍可能留下实际状态差异。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

只要一个子包注册报错，集合就停止加载。释放失败会被忽略，报错里的回滚数量不能证明工具目录恢复原状。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

有多个工具共同使用需求时，先在干净 profile 核对一项已知 CSV 和一项 JSON 校验。出现重名后以实际工具目录检查是否残留。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已经核查根 bundle、分发范围、真实注册与失败清理机制。目标宿主、工具运行与实际业务收益待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、tests/register.spec.ts、packages/dsh-tool-regex/lib/index.js、packages/dsh-tool-csv/lib/index.js、packages/dsh-tool-stat/lib/index.js、packages/dsh-tool-schema/lib/index.js、scripts/build-all.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根聚合包与所跟踪的代表子包产物均绑定固定提交。未跑宿主或测试，也未对所有子包的全部动作做代码审计。
- 下一步：在同一 DSH 版本建立独立安装和根集合两个 profile，分别验证工具目录、已知 CSV 与 Schema 输入、强制同名失败和恢复；比较实际接入与诊断用时。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在接入前预报工具名称冲突，失败后把释放成功和实际残留分别列出。需用注入错误的同条件对照检查诊断是否变快。[Q04](#research-q04)

在同一 DSH 版本建立独立安装和根集合两个 profile，分别验证工具目录、已知 CSV 与 Schema 输入、强制同名失败和恢复；比较实际接入与诊断用时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 3490 | — | — | 29539 |
| .js | source | 57 | 8064 | 6891 | 1226 | — |
| .ts | source | 58 | 8824 | 6902 | 1333 | — |
| .ts | test | 43 | 5657 | 4726 | 190 | — |
| .mjs | source | 1 | 72 | 65 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 DSH 的团队如何在一个 profile 接入固定的一组本地数据工具，失败影响多大，何时更适合单装？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同一团队为何会一次挂载工具集合？根仓库承担了哪些职责？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常在 DSH 同一会话校验 CSV 和 JSON、统计数据并抽取文本的人，可以在一个隔离 profile 配置固定工具批次。根清单公开 lib/index.js，配有 dsh.bundle.patch；补丁插入 @deepseek-ai/dsh-toolkit。已提交产物在注入 tools 后相对导入包内冻结的 10 个子包，并依次执行各包 apply。根包保留 private，作者给出的分发入口是 Git 仓库或本地 pack，包名前缀不足以证明来自 DeepSeek。相对手工为同一 profile 安装多个独立包，这条路径集中版本冻结与加载；独立包则能逐个切换和更新。根入口未实现 CSV 或正则引擎，增量主要在组装和失败管理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-46](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/package.json#L23-L46)

peer、补丁、产物与 vendored 文件范围。

<details>
<summary>查看原文（24行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "packages",
    "scripts",
    "cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/cordis.patch.yml#L1-L4)

补丁插入根工具包入口。

```text
# dsh bundle patch: inserts the toolkit into a profile's layer stack (0806+).
- insert:
    - id: tool-kit
      name: '@deepseek-ai/dsh-toolkit'
```

**依据 3 · 源码核查**：[lib/index.js:25-59](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/lib/index.js#L25-L59)

实际产物中的导入、注入与子包注册顺序。

<details>
<summary>查看原文（35行）</summary>

```text
const SUBPLUGINS = [
    'dsh-tool-time',
    'dsh-tool-encoding',
    'dsh-tool-json',
    'dsh-tool-calculator',
    'dsh-tool-csv',
    'dsh-tool-regex',
    'dsh-tool-markdown',
    'dsh-tool-diff',
    'dsh-tool-stat',
    'dsh-tool-schema',
];
async function loadSubPlugins() {
    return Promise.all(SUBPLUGINS.map(async (n) => {
        const mod = await import(__rewriteRelativeImportExtension(`../packages/${n}/lib/index.js`));
        return mod;
    }));
}
export const name = '@deepseek-ai/dsh-toolkit';
export const inject = ['tools'];
export async function apply(ctx) {
    const plugins = await loadSubPlugins();
    const disposers = [];
    const originalRegister = ctx.tools.register;
    let patched = false;
    try {
        // 包装 register 捕获 disposer，用于失败回滚
        ctx.tools.register = ((def) => {
            const dispose = originalRegister.call(ctx.tools, def);
            disposers.push(dispose);
            return dispose;
        });
        patched = true;
        for (const p of plugins) {
            p.apply(ctx);
```

</details>

**依据 4 · 作者声明**：[README.md:98-109](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/README.md#L98-L109)

作者说明 Git 形式及独装冲突。

<details>
<summary>查看原文（12行）</summary>

````text
### meta bundle 模型（可选）

需要一次原子挂载全部工具时，挂载根 meta 包：

```sh
dsh plugin --profile web add github:omdsh-dev/dsh-toolkit
dsh --profile web --dump-config | grep tool-kit
```

> ⚠️ 若 profile 已单独挂载过同名插件（tool-time/.../tool-diff/tool-stat/tool-schema），挂 meta 包会注册重名报错——
> 此时先移除旧插件，或用独立 bundle 模型。meta apply 具备原子性（任一子插件失败时
> 逆序回滚已注册工具，不残留部分状态）。
````

</details>

#### 缺口

- 选定 DSH 版本在 Git 安装时的生命周期与包内容未实测
  **影响**：不能确认该目标版本能实际加载提交的所有工具
  **进一步探讨**：在隔离 profile 从固定提交安装并核对实际工具目录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 后装的子包注册失败时，根包如何恢复，能保证全组原子性吗？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

动态导入在替换 register 前完成，缺产物导致这一阶段失败时，根入口尚未捕获或提交工具注册。进入注册阶段后，根包包装 ctx.tools.register，把每次成功返回的释放函数压栈，并顺序调用子插件。同步报错会逆序调用先前释放函数，最后还原原始 register。测试定义模拟 csv 同名失败，构造的释放函数只记录被调用的顺序；实际源码吞掉释放函数自身错误，随后输出以 disposer 数量计算的 rolled back。它未检查失败前后工具清单，日志中的数量也可能大于真正回收量。代理范围仅覆盖所借用的工具注册接口，并未为子插件的其他副作用或插件系统的并发注册提供事务隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:37-78](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/lib/index.js#L37-L78)

导入、包装、逆序释放与跳过释放异常的完整路径。

<details>
<summary>查看原文（42行）</summary>

```text
async function loadSubPlugins() {
    return Promise.all(SUBPLUGINS.map(async (n) => {
        const mod = await import(__rewriteRelativeImportExtension(`../packages/${n}/lib/index.js`));
        return mod;
    }));
}
export const name = '@deepseek-ai/dsh-toolkit';
export const inject = ['tools'];
export async function apply(ctx) {
    const plugins = await loadSubPlugins();
    const disposers = [];
    const originalRegister = ctx.tools.register;
    let patched = false;
    try {
        // 包装 register 捕获 disposer，用于失败回滚
        ctx.tools.register = ((def) => {
            const dispose = originalRegister.call(ctx.tools, def);
            disposers.push(dispose);
            return dispose;
        });
        patched = true;
        for (const p of plugins) {
            p.apply(ctx);
        }
    }
    catch (error) {
        // 逆序回滚已注册工具
        for (const dispose of [...disposers].reverse()) {
            try {
                dispose();
            }
            catch {
                // 回滚失败不掩盖原始错误
            }
        }
        throw new Error(`dsh-toolkit: failed to apply subplugins (${disposers.length} rolled back): ${String(error)}`);
    }
    finally {
        if (patched)
            ctx.tools.register = originalRegister;
    }
}
```

</details>

**依据 2 · 源码核查**：[tests/register.spec.ts:5-21](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/tests/register.spec.ts#L5-L21)

模拟注册失败和仅记录调用的 disposer。

<details>
<summary>查看原文（17行）</summary>

```text
function makeCtx(failAt: string | null): {
  ctx: any
  registered: string[]
  disposed: string[]
} {
  const registered: string[] = []
  const disposed: string[] = []
  const ctx = {
    tools: {
      register: (def: { name: string }) => {
        if (def.name === failAt) throw new Error(`duplicate tool "${def.name}"`)
        registered.push(def.name)
        return () => { disposed.push(def.name) }
      },
    },
  }
  return { ctx, registered, disposed }
```

</details>

**依据 3 · 源码核查**：[tests/register.spec.ts:31-46](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/tests/register.spec.ts#L31-L46)

测试定义中的十项注册与 csv 冲突用例，仅阅读未运行。

<details>
<summary>查看原文（16行）</summary>

```text
  it('registers all 10 tools through apply (real subplugin modules)', async () => {
    const { ctx, registered, disposed } = makeCtx(null)
    await apply(ctx)
    expect(registered).toEqual([
      'time', 'encoding', 'json', 'calculator', 'csv',
      'regex', 'markdown', 'diff', 'stat', 'schema',
    ])
    expect(disposed).toEqual([])
  })

  it('rolls back all prior registrations when a later subplugin fails (TK-06)', async () => {
    const { ctx, registered, disposed } = makeCtx('csv')
    await expect(apply(ctx)).rejects.toThrow(/failed to apply subplugins \(4 rolled back\)/)
    expect(registered).toEqual(['time', 'encoding', 'json', 'calculator'])
    // 逆序回滚：calculator → json → encoding → time
    expect(disposed).toEqual(['calculator', 'json', 'encoding', 'time'])
```

</details>

**依据 4 · 作者声明**：[README.md:104-109](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/README.md#L104-L109)

作者承诺同名冲突后的回滚，需要按已实现边界理解。

````text
dsh --profile web --dump-config | grep tool-kit
```

> ⚠️ 若 profile 已单独挂载过同名插件（tool-time/.../tool-diff/tool-stat/tool-schema），挂 meta 包会注册重名报错——
> 此时先移除旧插件，或用独立 bundle 模型。meta apply 具备原子性（任一子插件失败时
> 逆序回滚已注册工具，不残留部分状态）。
````

#### 缺口

- 实际 host disposer 抛错、嵌套注册或已有同名工具时的目录状态未知
  **影响**：错误即使报告已回滚，仍可能要重建干净 profile
  **进一步探讨**：为释放失败构建隔离验收，在启动错误前后比较工具目录和原有同名工具

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 一组已注册工具能为数据任务提供什么，首次采用和持续使用各需承担什么？

**研究主题**：功能与机制、依赖、兼容与流程、效果与总成本

#### 完整回答

CSV 子包把 parse、query、stats、to_json 注册为可选操作；stat 提供描述统计、百分位数、频数和相关性；schema 提供校验、路径、解释与规范化。Agent 可以把同一数据检查过程交给具声明参数的工具，避免每次让模型编写解析脚本。正则实现还把计算交给 worker，计时后主动终止并拒绝，证明特定耗时输入有可见失败链路。工具结果和超时可供用户核看，真实用户仍需对照业务边界，尤其 Schema 方言或复杂 CSV 的覆盖。首次选择正确的 web 或 headless profile、确认满足 Cordis 和 DSH peers、检查同名安装；本地打包另需构建各子包。实际运行还用 CPU、内存和模型工具调用；固定源码无法推算现金支出、模型用量或比批处理脚本更快。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-csv/lib/index.js:49-66](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/index.js#L49-L66)

csv 的注册能力与动作参数。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'csv',
        description: 'Parse, query, and summarize CSV text. ' +
            'Actions: parse (to JSON array), query (filter rows by exact column value), ' +
            'stats (row/column counts), to_json (alias of parse). ' +
            'RFC 4180, quoted fields with commas/newlines supported, BOM ignored. ' +
            'Pure text processing: no file or network access.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['parse', 'query', 'stats', 'to_json'],
                description: 'Operation to perform.',
            },
            csv: {
                type: 'string',
                required: true,
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-stat/lib/index.js:42-64](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/index.js#L42-L64)

统计动作枚举。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'stat',
        description: 'Deterministic statistics over explicit finite numeric arrays. ' +
            'Actions: describe (count/sum/min/max/mean/median/variance/standardDeviation/q1/q3/iqr, ' +
            'Neumaier compensated sum + Welford variance, population or sample), ' +
            'percentile (one or more percentiles 0..100, linear interpolation h=(n-1)*p, output keeps request order, duplicates kept), ' +
            'frequency (value/count/ratio grouped by strict equality, ascending output, ratio denominators use the original count), ' +
            'correlation (Pearson or Spearman midrank; zero-variance pairs return defined=false with reason "zero-variance"). ' +
            'Rejects NaN/Infinity; -0 is normalized to 0; inputs are never modified; results are re-checked for finiteness ' +
            '(numeric-overflow errors are returned instead of emitting non-finite JSON). ' +
            'Limits: 1..100000 observations, at most 100 percentiles, at most 10000 distinct output entries.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['describe', 'percentile', 'frequency', 'correlation'],
                description: 'Operation to perform.',
            },
            values: {
                type: 'array',
                required: true,
                items: { type: 'number' },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-schema/lib/index.js:115-137](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/index.js#L115-L137)

结构校验相关动作。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'schema',
        description: 'JSON Schema validation over explicit JSON data (draft 2020-12 subset, zero network, zero dynamic code). ' +
            'Actions: validate (verdict with RFC 6901 instancePath/schemaPath errors), paths (failure paths with keyword ' +
            'summaries), explain (static constraint-tree nodes), normalize (deep copy + apply explicit `default` for missing ' +
            'properties, then validate; never mutates input, never coerces types). Supported keywords: type/enum/const, object ' +
            '(required/properties/additionalProperties/minProperties/maxProperties), array (items/minItems/maxItems/' +
            'uniqueItems), string (minLength/maxLength/pattern), number (minimum/maximum/exclusive*/multipleOf), ' +
            'allOf/anyOf/oneOf/not, local $ref (# and #/$defs/...). Unsupported schema keywords are NEVER silently ignored: ' +
            'they are reported as schemaIssues (code unsupported-keyword); with strictSchema=true (default) validation fails, ' +
            'with strictSchema=false the supported subset is validated and valid=null with complete=false is returned. ' +
            'Pattern validation runs in an isolated worker with a shared 1000ms hard budget (ReDoS guard); data/schema size ' +
            '(256KiB each), nesting depth (64), schema nodes (10000), traversal nodes (100000), errors (100 default, max ' +
            '1000), $ref chain (64), and canonical output (1MiB) are all bounded.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['validate', 'paths', 'explain', 'normalize'],
                description: 'Operation to perform.',
            },
            data: {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-regex/lib/index.js:22-49](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-regex/lib/index.js#L22-L49)

worker 与终止计时器。

<details>
<summary>查看原文（28行）</summary>

```text
/** worker 内正则执行的硬预算（毫秒）；到期 terminate 并报错。 */
const WORKER_BUDGET_MS = 1000;
/** 在可终止的 worker 内执行 test/find/replace；超预算硬中断。 */
function executeInWorker(args) {
    return new Promise((resolve, reject) => {
        // 源码态（vitest）引用 ./worker.ts（Node 原生 type-stripping 加载）；
        // 构建态（lib）引用 ./worker.js
        const workerUrl = new URL(import.meta.url.endsWith('.ts') ? './worker.ts' : './worker.js', import.meta.url);
        const worker = new Worker(workerUrl);
        let settled = false;
        const timer = setTimeout(() => {
            if (settled)
                return;
            settled = true;
            void worker.terminate();
            reject(new Error(`regex: execution timed out (${WORKER_BUDGET_MS}ms)`));
        }, WORKER_BUDGET_MS);
        const settle = (fn) => {
            if (settled)
                return;
            settled = true;
            clearTimeout(timer);
            void worker.terminate();
            fn();
        };
        worker.once('message', (msg) => {
            settle(() => {
                if (msg.ok)
```

</details>

**依据 5 · 源码核查**：[package.json:23-27](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/package.json#L23-L27)

宿主 peer 声明。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0"
  },
```

**依据 6 · 源码核查**：[scripts/build-all.sh:21-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/scripts/build-all.sh#L21-L38)

构建脚本检查根和十个子包产物。

<details>
<summary>查看原文（18行）</summary>

```text
for P in packages/dsh-tool-*; do
  echo "== clean/build $P"
  rm -rf "$P/lib"
  (cd "$P" && node "$TSC_ROOT" -p tsconfig.json) || exit 1
done
echo "== clean/build meta (dsh-toolkit)"
# Always remove the root output before compiling so committed entry files are
# produced from the current src tree rather than retained stale artifacts.
rm -rf lib
node "$TSC_ROOT" -p tsconfig.json || exit 1

# 产物完整性验证（TK-01/TK-07）：
# 1) 根 + 10 个子包的 lib/index.js 必须存在
EXPECTED="packages/dsh-tool-calculator packages/dsh-tool-csv packages/dsh-tool-diff packages/dsh-tool-encoding packages/dsh-tool-json packages/dsh-tool-markdown packages/dsh-tool-regex packages/dsh-tool-time packages/dsh-tool-stat packages/dsh-tool-schema"
for P in $EXPECTED; do
  [ -f "$P/lib/index.js" ] || { echo "error: missing $P/lib/index.js" >&2; exit 1; }
done
[ -f "lib/index.js" ] || { echo "error: missing meta lib/index.js" >&2; exit 1; }
```

</details>

**依据 7 · 作者声明**：[README.md:78-95](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/README.md#L78-L95)

作者区分 web/headless 与打包路径。

<details>
<summary>查看原文（18行）</summary>

````text
验证与运行：

```sh
dsh --profile web --dump-config | grep tool-csv     # 行存在即安装成功
dsh run "使用 csv 工具解析 'a,b\n1,2'"               # headless 端到端
```

> ⚠️ web 与 headless 是**不同 profile**：web 安装不会自动覆盖 headless；`dsh run` 默认使用 headless。
> Windows 路径使用正斜杠（`C:/...`）。

### npm pack tarball 安装

本地构建后用 tarball 路径安装（不依赖 GitHub）：

```sh
# tarball 方式（web 为例；headless 同）
npm pack
dsh plugin --profile web add <npm pack 产物 tarball 路径>
````

</details>

#### 缺口

- 无同输入、同验证标准下的对照结果
  **影响**：无法量化多工具调用相比单装或本地脚本的收益
  **进一步探讨**：固定三步 CSV 任务并比较用户操作、正确性和工具调用成本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试集合包？如何改善同名冲突的可诊断性？

**研究主题**：采用判断、新假设与验证

#### 完整回答

多项工具需要在同一 profile 一起升级的团队，可以建立干净 profile，先用已知结果的 CSV 和 JSON 输入查两三项工具，再故意制造同名冲突。每次核对响应及失败前后的工具目录。只有一两项工具时，独立加载保留逐项退路；冲突后的目录状态无法解释时，弃用该试用 profile，在干净 profile 中单装所需子包。由回滚捕获范围可以提出一个未实现方案，先读取完整注册目录，列出可登记工具与所有名称冲突，注册失败时再分别报告成功释放、失败释放和目录残留。若实测的注册列表无法静态确定，或预检后到提交时仍会发生竞争，这种预检只适合诊断，不能取代实际宿主提交机制。比较原路径和该方案能否在相同注入故障下更快确认残留。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:45-77](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/lib/index.js#L45-L77)

当前在错误发生后回收，失败释放没有单独回执。

<details>
<summary>查看原文（33行）</summary>

```text
export async function apply(ctx) {
    const plugins = await loadSubPlugins();
    const disposers = [];
    const originalRegister = ctx.tools.register;
    let patched = false;
    try {
        // 包装 register 捕获 disposer，用于失败回滚
        ctx.tools.register = ((def) => {
            const dispose = originalRegister.call(ctx.tools, def);
            disposers.push(dispose);
            return dispose;
        });
        patched = true;
        for (const p of plugins) {
            p.apply(ctx);
        }
    }
    catch (error) {
        // 逆序回滚已注册工具
        for (const dispose of [...disposers].reverse()) {
            try {
                dispose();
            }
            catch {
                // 回滚失败不掩盖原始错误
            }
        }
        throw new Error(`dsh-toolkit: failed to apply subplugins (${disposers.length} rolled back): ${String(error)}`);
    }
    finally {
        if (patched)
            ctx.tools.register = originalRegister;
    }
```

</details>

**依据 2 · 源码核查**：[tests/register.spec.ts:41-46](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/tests/register.spec.ts#L41-L46)

已有设定可复现 csv 同名错误的控制点。

```text
  it('rolls back all prior registrations when a later subplugin fails (TK-06)', async () => {
    const { ctx, registered, disposed } = makeCtx('csv')
    await expect(apply(ctx)).rejects.toThrow(/failed to apply subplugins \(4 rolled back\)/)
    expect(registered).toEqual(['time', 'encoding', 'json', 'calculator'])
    // 逆序回滚：calculator → json → encoding → time
    expect(disposed).toEqual(['calculator', 'json', 'encoding', 'time'])
```

**依据 3 · 作者声明**：[README.md:61-75](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/README.md#L61-L75)

作者提供独立子包的安装方式。

<details>
<summary>查看原文（15行）</summary>

````text
每个子包独立安装、启用、禁用、卸载：

```sh
# 安装单个工具到 web profile
dsh plugin --profile web add github:omdsh-dev/dsh-tool-csv
# 一次性任务（headless）profile
dsh plugin --profile headless add github:omdsh-dev/dsh-tool-diff
```

批量安装（collection 辅助脚本，幂等——重复执行不会重复添加）：

```sh
./scripts/install-web.sh       # 全部 10 工具 → web profile
./scripts/install-headless.sh  # 全部 10 工具 → headless profile（dsh run 使用面）
./scripts/install-all.sh       # 两个 profile 都装
````

</details>

#### 缺口

- 新的注册预检方案不在固定版本中
  **影响**：不能计入当前工程或采用评分
  **进一步探讨**：先用含同名的预置清单模拟预检，记录诊断时间和误报

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
