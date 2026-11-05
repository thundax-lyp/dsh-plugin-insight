# DSH Ecosystem Spec

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[effb958](https://github.com/T-Auto/dsh-ecosystem-spec/tree/effb9581687f995841d872304e03627473039957)

<!-- BEGIN META -->
[![GitHub ★ 89](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=89&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ecosystem-spec)
<!-- END META -->

> **功能**：汇集 DSH 社区协议、实现与准入 Profile，并提供索引结构校验。

> **亮点**：[Q01](#research-q01) 为规范和实现提供结构化发现与检查。

> **主要限制**：[Q02](#research-q02) 结构检查与摘要内容验证、运行兼容各是独立证据。

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
  - [Q01 · 根项目提供什么可核验入口？](#detail-section-11)
  - [Q02 · 通过结构检查能证明运行兼容吗？](#detail-section-12)
  - [Q03 · 怎样使用这份资源并检验其价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要统一来源和兼容声明格式的插件及发行版维护者。

各仓库在README分别维护声明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 协议索引 | 定位规范和实现 | 状态照录 |
| 结构校验 | 核对登记与Profile | 不证明运行兼容 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 固定协议与registry | 必需 | 解释声明语义 | 回各原文 |
| Node校验器 | 执行结构检查需要 | 检查登记形状 | 人工对照 |
| 实际Adapter及suite | 运行兼容需要 | 独立证明 | 不宣称兼容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选取 | 一份现有声明 | 记录原字段 |
| 对照 | 核来源和成熟度分支 | 区分语法与运行结果 |
| 退出 | 保留原manifest | 资源仅作参考 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地资源未知 | 映射字段与术语 | 无目标执行 |
| 持续使用 | 请求及存储未知 | 维护revision摘要及suite | 按变化 |
| 失败恢复 | 文档回退成本未知 | 回原声明并修错误引用 | 不改运行时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 索引 | 字段与挂载结构检查 | 生态覆盖 |
| 固定来源 | 要求revision及digest形状 | 实际内容匹配 |
| 兼容 | 登记suite身份 | suite真实结果 |

> **思考**：[Q02](#research-q02) 结构检查与摘要内容验证、运行兼容各是独立证据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 为规范和实现提供结构化发现与检查。

[Q02](#research-q02) 不把形状验证当认证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 结构检查与摘要内容验证、运行兼容各是独立证据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 小样本声明对照后评估维护负担。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根registry和校验分支静态核查；子协议适配效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、docs/profiles/tui-admission-015.md、registry/README.md、scripts/profile-validation.mjs、scripts/verify-structure.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根registry、校验脚本与说明，不替代vendor实现研究。
- 下一步：人工核对来源并在另行授权时执行保留集校验。

**分析版本**

- **仓库**：[T-Auto/dsh-ecosystem-spec](https://github.com/T-Auto/dsh-ecosystem-spec)
- **版本号**：未声明（[固定提交 effb958](https://github.com/T-Auto/dsh-ecosystem-spec/tree/effb9581687f995841d872304e03627473039957)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 真实摘要比对可能减少错误固定引用，收益未测。

人工核对来源并在另行授权时执行保留集校验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 952 | — | — | 12329 |
| .md | example | 1 | 141 | — | — | 1622 |
| .mjs | source | 3 | 518 | 444 | 26 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/T-Auto/dsh-ecosystem-spec/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根规范入口实际校验哪些结构，其结果能支持什么互操作判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目提供什么可核验入口？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要对齐插件与发行版声明的作者可从此根资源找到协议、范例和产品准入Profile。registry登记来源、状态和正文路径，verify-structure核对id、文档存在、类别与挂载路径；Profile另用validateProfileEntry校验。相比只在README散写兼容声明，索引提供一致的机器可读入口。根本身是规范和验证资源，vendor协议以固定gitlink挂载，不能将相关子项目所有适配能力算作根已实现功能。

#### 证据与依据

**依据 1 · 源码核查**：[registry/README.md:1-25](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/registry/README.md#L1-L25)

入口与非认证边界

<details>
<summary>查看原文（25行）</summary>

```text
# registry —— 生态索引（机器可读）

本目录是 `dsh-ecosystem-spec` 作为**生态入口**的数据层：用机器可读的方式登记
“生态里有哪些协议、有哪些范例实现、有哪些产品准入 Profile，它们的正文来源在哪里”。

人和 CI 都读这里。CI 每次提交都会校验索引与 `.gitmodules`、挂载目录、文档路径三者一致
（见 [`../scripts/verify-structure.mjs`](../scripts/verify-structure.mjs)）。

## 1. 索引登记什么、不登记什么

登记事实：

- 条目 **id**、显示名、类别（元协议 / 子协议 / 范例实现 / Profile）；
- **上游仓库**与维护方；
- 协议与范例在本仓库的**挂载路径**（git submodule），或外部 Profile 的固定 `source`；
- **状态 / 成熟度口径**——照录上游或 Profile 归属方自己的声明，索引不发明状态；
- 说明文档路径。

不登记、也不代表：

- 不授予状态：`Candidate` / `Stable` 只能来自协议主管仓库的声明；
- 不认证实现：范例存在不等于被认证、不等于安全；
- 不规定目录：索引描述事实，不要求任何产品长成某种目录形状；
- 不替代协议自身的 registry：例如 `vendor/meta-protocols/dsh-distribution/registry/protocols.json`
  是那个仓库自己的协议目录，与本目录不是同一个东西。
```

</details>

**依据 2 · 源码核查**：[scripts/verify-structure.mjs:184-228](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/scripts/verify-structure.mjs#L184-L228)

结构检查实际分支

<details>
<summary>查看原文（45行）</summary>

```text
  const seen = new Set();
  parsed.entries.forEach((entry, i) => {
    const where = `registry/${name}.json entries[${i}]`;
    for (const field of REQUIRED[name]) {
      if (entry[field] === undefined) fail(`${where} 缺少字段 ${field}`);
    }
    if (name === 'profiles') {
      for (const error of validateProfileEntry(entry, where)) fail(error);
    }
    if (entry.id !== undefined) {
      if (!ID_PATTERN.test(entry.id)) fail(`${where} id "${entry.id}" 必须匹配 ${ID_PATTERN}`);
      if (seen.has(entry.id)) fail(`${where} id "${entry.id}" 重复`);
      seen.add(entry.id);
    }
    if (name !== 'profiles' && entry.status !== undefined && !STATUS.includes(entry.status)) {
      fail(`${where} status "${entry.status}" 不在状态词表内`);
    }
    if (name !== 'profiles' && entry.statusSource !== undefined && entry.statusSource !== 'upstream') {
      fail(`${where} statusSource 必须是 "upstream"（索引不发明状态）`);
    }
    if (entry.upstream !== undefined && !UPSTREAM_PATTERN.test(entry.upstream)) {
      fail(`${where} upstream "${entry.upstream}" 必须是 GitHub 仓库地址并以 .git 结尾`);
    }
    if (entry.doc !== undefined && !existsSync(join(ROOT, entry.doc))) {
      fail(`${where} doc "${entry.doc}" 不存在`);
    }

    // 类别 → 挂载路径前缀
    const prefix = CATEGORY_PREFIX[entry.category];
    if (name === 'profiles') {
      if (entry.category !== 'profile') fail(`${where} category 必须是 "profile"`);
      if (entry.mount !== undefined) fail(`${where} Profile 条目不应有 mount 字段`);
    } else if (!prefix) {
      fail(`${where} category "${entry.category}" 不是合法类别`);
    } else {
      const expected = `${prefix}${entry.id}`;
      if (entry.mount !== expected) {
        fail(`${where} category "${entry.category}" 的挂载路径必须是 "${expected}"，实际为 "${entry.mount}"`);
      }
    }

    if (name === 'protocols' && entry.category === 'sub-protocol' && !entry.buildsOn) {
      fail(`${where} 子协议条目必须写 buildsOn（它依托的元协议 id）`);
    }
  });
```

</details>

**依据 3 · 源码核查**：[scripts/profile-validation.mjs:13-37](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/scripts/profile-validation.mjs#L13-L37)

Profile形状分支

<details>
<summary>查看原文（25行）</summary>

```text
export function validateProfileEntry(entry, where = 'profile entry') {
  const errors = [];
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return [`${where} must be an object`];
  }
  const has = (key) => Object.prototype.hasOwnProperty.call(entry, key);
  const requireField = (key) => {
    if (!has(key)) errors.push(`${where} missing ${key}`);
  };

  for (const key of ['id', 'displayName', 'category', 'scope', 'owner', 'doc']) requireField(key);
  if (has('category') && entry.category !== 'profile') errors.push(`${where} category must be profile`);

  const legacy = has('status');
  const external = has('maturityPolicy') || has('source');
  if (legacy === external || (!legacy && !external)) {
    errors.push(`${where} must use exactly one maturity branch: status or maturityPolicy + source`);
  }
  if (legacy) {
    if (!STATUS.has(entry.status)) errors.push(`${where} status must be a governance status`);
    if (has('statusSource') && entry.statusSource !== 'upstream') {
      errors.push(`${where} statusSource must be upstream`);
    }
    if (has('maturityPolicy') || has('source')) errors.push(`${where} legacy status cannot have external maturity fields`);
  }
```

</details>

**依据 4 · 作者声明**：[README.md:19-31](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/README.md#L19-L31)

作者定位

<details>
<summary>查看原文（13行）</summary>

```text
## 这是什么项目？

这是由[dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)团队和[DSH-Desktop-EAC](https://github.com/zouyuxuan122/DSH-Desktop-EAC)团队联合发起的社区协议，提供一套可选、可验证的互操作共识。有详细文档、验证自动化流程及**开包即用的skill**，力求：

- 遵循此协议完全不影响任何功能开发自由度
- dsh上游更新时，插件需要变更的代码更少
- 插件之间的兼容性更好，不再相互创死对方
- 插件之间可以更好的互相对话
- 多个整合包/独立dsh运行时可以统一管理、互相通讯并相互隔离

dsh-ecosystem-spec 收录了插件元协议[dsh-std](https://github.com/T-Auto/dsh-std)、运行环境元协议[dsh-distribution](https://github.com/T-Auto/dsh-distribution)及相关子协议，前者面向插件作者，后者面向dsh发行版/整合包开发者。在元协议的框架下，**“协议本身”也变成了可拔插的插件——这和dsh本体的理念不谋而合。**

本规范并非官方标准，但我们希望为碎片化的dsh生态，接起插件对话的桥梁。
```

</details>

#### 缺口

- 未独立执行校验器或观察跨项目采用
  **影响**：不能证明减少了版本适配工作
  **进一步探讨**：对两份真实声明人工比对字段和缺失项

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 通过结构检查能证明运行兼容吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。外部Profile分支要求repository、完整revision、安全相对path、contentDigest、productVersions、imports与suite的形状；代码只检查字符串和正则，未在该函数中获取源文件、计算摘要或执行suite。verify-structure检查本地doc路径和登记规则，也不能把这当宿主测试。registry文档明示成熟度照录且不认证实现，README较强的跨宿主不改代码主张仍需具体Adapter与测试。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/profile-validation.mjs:39-74](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/scripts/profile-validation.mjs#L39-L74)

外部来源形状验证

<details>
<summary>查看原文（36行）</summary>

```text
  if (external) {
    if (!has('maturityPolicy') || !entry.maturityPolicy || typeof entry.maturityPolicy !== 'object' || Array.isArray(entry.maturityPolicy) || entry.maturityPolicy.kind !== 'not-applicable') {
      errors.push(`${where} maturityPolicy.kind must be not-applicable`);
    }
    if (entry.maturityPolicy && typeof entry.maturityPolicy === 'object' && typeof entry.maturityPolicy.source !== 'string') {
      errors.push(`${where} maturityPolicy.source is required`);
    }
    const source = entry.source;
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      errors.push(`${where} source is required`);
    } else {
      for (const key of ['repository', 'revision', 'path', 'contentDigest', 'productVersions', 'imports', 'suite']) {
        if (!Object.prototype.hasOwnProperty.call(source, key)) errors.push(`${where} source missing ${key}`);
      }
      if (typeof source.repository !== 'string' || !REPOSITORY.test(source.repository)) {
        errors.push(`${where} source.repository must be a GitHub .git URL`);
      }
      if (typeof source.revision !== 'string' || !REVISION.test(source.revision)) {
        errors.push(`${where} source.revision must be a lowercase 40-hex commit`);
      }
      if (!isSafeRelativePath(source.path)) {
        errors.push(`${where} source.path must be a relative POSIX path without traversal`);
      }
      if (typeof source.contentDigest !== 'string' || !DIGEST.test(source.contentDigest)) {
        errors.push(`${where} source.contentDigest must be sha256:<64 lowercase hex>`);
      }
      if (!Array.isArray(source.productVersions) || source.productVersions.length === 0 || source.productVersions.some((v) => typeof v !== 'string' || !v)) {
        errors.push(`${where} source.productVersions must be a non-empty string array`);
      }
      if (!Array.isArray(source.imports) || source.imports.some((v) => typeof v !== 'string' || !v)) {
        errors.push(`${where} source.imports must be a string array`);
      }
      if (!source.suite || typeof source.suite !== 'object' || typeof source.suite.id !== 'string' || !source.suite.id || typeof source.suite.version !== 'string' || !source.suite.version) {
        errors.push(`${where} source.suite requires id and version`);
      }
    }
```

</details>

**依据 2 · 源码核查**：[scripts/verify-structure.mjs:190-221](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/scripts/verify-structure.mjs#L190-L221)

根结构验证

<details>
<summary>查看原文（32行）</summary>

```text
    if (name === 'profiles') {
      for (const error of validateProfileEntry(entry, where)) fail(error);
    }
    if (entry.id !== undefined) {
      if (!ID_PATTERN.test(entry.id)) fail(`${where} id "${entry.id}" 必须匹配 ${ID_PATTERN}`);
      if (seen.has(entry.id)) fail(`${where} id "${entry.id}" 重复`);
      seen.add(entry.id);
    }
    if (name !== 'profiles' && entry.status !== undefined && !STATUS.includes(entry.status)) {
      fail(`${where} status "${entry.status}" 不在状态词表内`);
    }
    if (name !== 'profiles' && entry.statusSource !== undefined && entry.statusSource !== 'upstream') {
      fail(`${where} statusSource 必须是 "upstream"（索引不发明状态）`);
    }
    if (entry.upstream !== undefined && !UPSTREAM_PATTERN.test(entry.upstream)) {
      fail(`${where} upstream "${entry.upstream}" 必须是 GitHub 仓库地址并以 .git 结尾`);
    }
    if (entry.doc !== undefined && !existsSync(join(ROOT, entry.doc))) {
      fail(`${where} doc "${entry.doc}" 不存在`);
    }

    // 类别 → 挂载路径前缀
    const prefix = CATEGORY_PREFIX[entry.category];
    if (name === 'profiles') {
      if (entry.category !== 'profile') fail(`${where} category 必须是 "profile"`);
      if (entry.mount !== undefined) fail(`${where} Profile 条目不应有 mount 字段`);
    } else if (!prefix) {
      fail(`${where} category "${entry.category}" 不是合法类别`);
    } else {
      const expected = `${prefix}${entry.id}`;
      if (entry.mount !== expected) {
        fail(`${where} category "${entry.category}" 的挂载路径必须是 "${expected}"，实际为 "${entry.mount}"`);
```

</details>

**依据 3 · 源码核查**：[registry/README.md:48-57](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/registry/README.md#L48-L57)

外部摘要语义

<details>
<summary>查看原文（10行）</summary>

```text
协议与范例的状态词与治理层一致，只有五个：`Draft`、`Experimental`、`Candidate`、`Stable`、`Deprecated`。
Profile 选择传统的上游 `status` 分支，或归属方的 `maturityPolicy.kind: "not-applicable"`
与固定 `source` 分支；两者不得混用。`not-applicable` 不是额外的成熟度状态，
也不表示已测试、兼容或认证。

外部 `source` 固定 `repository`、完整 40 位 commit `revision` 和仓库内相对 `path`；
`contentDigest` 是该 revision/path 的**单个文件原始字节**的 `sha256:` 摘要，
不是整个 Profile 目录、仓库树或 conformance 结果的摘要。还需记录适用的
`productVersions`、声明的 `imports` 与 `suite` id/version。依据见
[`ADR 0002`](../decisions/0002-external-profile-source-identity.md)。
```

</details>

**依据 4 · 作者声明**：[docs/profiles/tui-admission-015.md:3-19](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/docs/profiles/tui-admission-015.md#L3-L19)

登记不等运行认证

<details>
<summary>查看原文（17行）</summary>

```text
This entry records the external Profile published with `ccch1mneyyy/dsh-TUI`.
The Profile identity is `tui-admission/0.15`; this registry does not rename it to
an unintroduced `1.0` identity and does not copy its contents into this repository.

The owner declares no ecosystem maturity ladder for this product Profile. The
`not-applicable` owner policy is separate from the five statuses used for
protocols and implementations. It does not imply Stable, Experimental, or
compatibility certification. Any `tested` or `unverified` result must be
recorded by the relevant product suite independently.

The registry source fixes the repository, commit, path, and SHA-256 digest of
the source document. The digest covers the exact bytes of that one JSON file at
the fixed revision, not the whole Profile directory or repository tree. The
source is an external file reference, not a submodule; it therefore does not
change the vendor mount set. The recorded snapshot was checked against the
clean local TUI Profile lane at `e1beaa12d25813be5f328e66dc12685f7eea2d06`;
this does not certify runtime compatibility or maturity.
```

</details>

#### 缺口

- 各独立Adapter的兼容效果与suite结果不在本轮根实现核查范围
  **影响**：不能将规范遵循直接视为兼容或权限证明
  **进一步探讨**：选择实际Adapter与固定suite另行核验

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样使用这份资源并检验其价值？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

插件或发行版维护者可先用一份已有声明按registry规则检查来源与成熟度字段，再比较原项目文档是否少了重复说明。首次需人工映射术语和版本，持续需更新固定revision、文件摘要和suite标识，成本未知；退出可保留原manifest，只把此规范当参考。

可检验的增量是假设“外部source实际摘要核对能减少错误固定引用”。在现有形状检查之外，对同形状但摘要错误、revision错误和正常声明做离线保留集，比较误通过与维护时间。如果维护成本显著增加且错误率不降，则不采用额外门槛。本轮没有实施该验证。

#### 证据与依据

**依据 1 · 源码核查**：[registry/README.md:53-57](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/registry/README.md#L53-L57)

固定文件身份

```text
外部 `source` 固定 `repository`、完整 40 位 commit `revision` 和仓库内相对 `path`；
`contentDigest` 是该 revision/path 的**单个文件原始字节**的 `sha256:` 摘要，
不是整个 Profile 目录、仓库树或 conformance 结果的摘要。还需记录适用的
`productVersions`、声明的 `imports` 与 `suite` id/version。依据见
[`ADR 0002`](../decisions/0002-external-profile-source-identity.md)。
```

**依据 2 · 源码核查**：[scripts/profile-validation.mjs:50-73](https://github.com/T-Auto/dsh-ecosystem-spec/blob/effb9581687f995841d872304e03627473039957/scripts/profile-validation.mjs#L50-L73)

现有形状检查

<details>
<summary>查看原文（24行）</summary>

```text
      for (const key of ['repository', 'revision', 'path', 'contentDigest', 'productVersions', 'imports', 'suite']) {
        if (!Object.prototype.hasOwnProperty.call(source, key)) errors.push(`${where} source missing ${key}`);
      }
      if (typeof source.repository !== 'string' || !REPOSITORY.test(source.repository)) {
        errors.push(`${where} source.repository must be a GitHub .git URL`);
      }
      if (typeof source.revision !== 'string' || !REVISION.test(source.revision)) {
        errors.push(`${where} source.revision must be a lowercase 40-hex commit`);
      }
      if (!isSafeRelativePath(source.path)) {
        errors.push(`${where} source.path must be a relative POSIX path without traversal`);
      }
      if (typeof source.contentDigest !== 'string' || !DIGEST.test(source.contentDigest)) {
        errors.push(`${where} source.contentDigest must be sha256:<64 lowercase hex>`);
      }
      if (!Array.isArray(source.productVersions) || source.productVersions.length === 0 || source.productVersions.some((v) => typeof v !== 'string' || !v)) {
        errors.push(`${where} source.productVersions must be a non-empty string array`);
      }
      if (!Array.isArray(source.imports) || source.imports.some((v) => typeof v !== 'string' || !v)) {
        errors.push(`${where} source.imports must be a string array`);
      }
      if (!source.suite || typeof source.suite !== 'object' || typeof source.suite.id !== 'string' || !source.suite.id || typeof source.suite.version !== 'string' || !source.suite.version) {
        errors.push(`${where} source.suite requires id and version`);
      }
```

</details>

#### 缺口

- 维护者采纳、错误基率与新门槛收益未知
  **影响**：不能把规范数量换算为兼容收益
  **进一步探讨**：用少量固定声明对照并记录人工维护时间

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
