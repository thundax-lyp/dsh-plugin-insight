# Engramory DSH 适配目录

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f346ee2](https://github.com/tinqiao-oss/engramory/tree/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh)

<!-- BEGIN META -->
[![GitHub ★ 198](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=198&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tinqiao-oss/engramory)
<!-- END META -->

> **功能**：Engramory 仓库中存放 DeepSeek Harness 插件实现的适配器分组目录。

> **亮点**：[Q01](#research-q01)本目录提供DSH适配实现的组织位置，没有独立可归因功能；实际发布、apply、client和patch均在plugin。不能把根协议或子包记忆能力重复算本项贡献。

> **主要限制**：[Q02](#research-q02)根发现清单和递归源码容易让目录看似可安装插件，实际无自己的运行入口。采用需转真实子包，目录单独观察，不继承下游兼容或记忆效果。

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
  - [Q01 · DSH适配目录自身是否可安装，实际能力入口在哪里？](#detail-section-11)
  - [Q02 · 真实发现清单与patch如何接到子包，目录有无独立工程责任？](#detail-section-12)
  - [Q03 · 独立采用这层目录能完成记忆任务吗，成本如何退出？](#detail-section-13)
  - [Q04 · 目录另列有无新增价值，怎样证伪去重导航假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者在仓库中寻找DSH适配代码；目录只供导航，用户实际安装目标是子包dsh-engramory。

直接访问adapters/dsh/plugin已能找到完整包；本目录无独立入口，未识别运行增量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 适配代码导航 | 定位DSH plugin源码 | 无独立执行/工具注册，能力归下游 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 仓库浏览／源码访问 | 目录导航需 | 找适配代码 | 本项无运行入口 |
| plugin实际发布包 | 要运行记忆时需 | 真正DSH接入 | 须独立验收，非本目录能力 |
| Node/DSH版本 | 仅下游需 | 子包执行 | 兼容声明不作本目录验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定位 | 维护者看目录与根发现说明 | 区分根/容器/发布包 |
| 转向 | 进入plugin核package/main/patch | 不安装容器 |
| 判断 | 另读子包贡献与限制 | 不重复计分 |
| 退出 | 停止使用导航 | 已装子包另走其卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 源码访问 | 辨正确发布位置 | 金额工时未知 |
| 持续 | 无本目录独立服务 | 跟踪实际包版本 | 不用无服务推0成本 |
| 失败恢复 | 下游另计 | 纠正误装/重复归因 | 本目录不修运行状态 |
| 退出 | 下游数据另计 | 核是否曾装真实包 | 导航退出不删记忆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 源码导航 | DSH实现归于plugin子目录 | 用户查找效率 |
| 独立运行 | 未发现入口 | 下游效果须另评 |
| 去重理解 | 清单明确发布位置 | 标识是否减少误装 |

> **思考**：[Q02](#research-q02)根发现清单和递归源码容易让目录看似可安装插件，实际无自己的运行入口。采用需转真实子包，目录单独观察，不继承下游兼容或记忆效果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)本目录提供DSH适配实现的组织位置，没有独立可归因功能；实际发布、apply、client和patch均在plugin。不能把根协议或子包记忆能力重复算本项贡献。

[Q01](#research-q01)目录组织不等独立工程模块；下游清单和apply可定位，所有运行错误/恢复责任归实际包，不在容器伪造能力。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)根发现清单和递归源码容易让目录看似可安装插件，实际无自己的运行入口。采用需转真实子包，目录单独观察，不继承下游兼容或记忆效果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q02](#research-q02)仅observe资源导航，运行需求直接转固定plugin子包；不要把根和容器重复安装或把一份运行贡献计三次。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码与清单支持分组目录判断；非独立可安装插件，真实子包能力另评。导航假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、adapters/dsh/plugin/cordis.patch.yml、adapters/dsh/plugin/index.js、adapters/dsh/plugin/package.json、package.json 及固定范围 inventory；组件：adapters/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定adapters/dsh范围为分组目录；定向核根发现清单、子包manifest/patch及apply定位，未在本项重复审子包全部guard/injection/UI或根Python工具，无目标执行。
- 下一步：[Q04](#research-q04)陌生用户找包任务可检验导航假设；真实运行必须转子包固定版本，本项无运行。

**分析版本**

- **仓库**：[tinqiao-oss/engramory](https://github.com/tinqiao-oss/engramory)
- **版本号**：未声明（[固定提交 f346ee2](https://github.com/tinqiao-oss/engramory/tree/f346ee2facd39720289101a594ec77ffdce9b366)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)明确分组标记与唯一安装导航可能减少误装／重复计数；陌生用户任务比较错误与查找时间，无改善则否定。未实施不计当前贡献。

[Q04](#research-q04)陌生用户找包任务可检验导航假设；真实运行必须转子包固定版本，本项无运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4353 | 3172 | 1016 | — |
| .js | test | 2 | 4368 | 3678 | 503 | — |
| .md | source | 2 | 391 | — | — | 6445 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/tinqiao-oss/engramory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/tinqiao-oss/engramory/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)

暂未获取：近30天关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认DSH适配目录是否独立组件，防根与真实plugin多重收录重复归因。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH适配目录自身是否可安装，实际能力入口在哪里？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

adapters/dsh自身是源码分组目录，真实类型resource，没有独立package、README或apply入口；固定树只包含plugin子目录。它帮助维护者定位DSH适配实现，不能让用户再安装一个独立适配器。简单基线是直接访问adapters/dsh/plugin；就当前目录本身，没有额外记忆机制或操作流程增量。

根package明确DISCOVERY MANIFEST ONLY、private且不从根发布，真正npm包在adapters/dsh/plugin。根bundle patch也直接指向子包patch，子包package有main/index.js、client与自身bundle。子包index.js的apply才创建索引配置、workingDirectory等宿主接线。因此“目录收录”“根发现清单”“真实发布包”是三个不同位置；不把子包的索引注入、写前上限、侧栏或根项目跨宿主规则重复归因本目录。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/package.json#L1-L8)

根发现清单显式说明发布位置在子包。

```text
{
  "//": [
    "DISCOVERY MANIFEST ONLY — never published from the repo root (private: true).",
    "The installable npm package is adapters/dsh/plugin/ (same name, published from there).",
    "Registry crawlers (e.g. plugin.dshdesk.com) verify a dsh.bundle object in the ROOT",
    "package.json and that its patch file exists, so this file declares the same bundle",
    "patch the plugin ships. tests/test_dsh_plugin.py pins name/version/patch in sync",
    "with the plugin's own package.json — bump both together."
```

**依据 2 · 源码核查**：[package.json:19-25](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/package.json#L19-L25)

根bundle指向plugin patch。

```text
  },
  "homepage": "https://github.com/tinqiao-oss/engramory/tree/master/adapters/dsh/plugin#readme",
  "dsh": {
    "bundle": {
      "patch": "./adapters/dsh/plugin/cordis.patch.yml"
    }
  }
```

**依据 3 · 源码核查**：[adapters/dsh/plugin/package.json:15-29](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/package.json#L15-L29)

可加载main/client/bundle在子包。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "main": "index.js",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-plugin-manager"
      ]
    },
    "compatibility": {
      "dsh": ">=0.1.0-rc.7 <0.3.0-0",
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/plugin/package.json:64-74](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/package.json#L64-L74)

npm repository.directory为plugin且Node要求。

<details>
<summary>查看原文（11行）</summary>

```text
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tinqiao-oss/engramory.git",
    "directory": "adapters/dsh/plugin"
  },
  "homepage": "https://github.com/tinqiao-oss/engramory/tree/master/adapters/dsh/plugin#readme",
  "bugs": {
    "url": "https://github.com/tinqiao-oss/engramory/issues"
  },
  "engines": {
    "node": ">=18"
```

</details>

**依据 5 · 源码核查**：[adapters/dsh/plugin/index.js:82-120](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L82-L120)

实际apply在plugin文件，目录本身不执行。

<details>
<summary>查看原文（39行）</summary>

```text
export function apply(ctx, config = {}) {
  // `indexPath` pins the guard to ONE file. Without it the only signal is the
  // basename, so an unrelated MEMORY.md in any other project is gated too — a real
  // refusal on a file that is not a memory index at all, with no way to opt out
  // (renaming `indexName` would just unguard the real index). The Claude Code hook
  // has had ENGRAMORY_INDEX_PATH for exactly this; this is its counterpart.
  //
  // Its identity is found on every gated write (pinnedKey), as the target's is: a key
  // found once at start went stale when a folder on its path became a link or a drive
  // was mapped later, and a relative pin names a file in each session's directory.
  const indexPath = typeof config.indexPath === 'string' && config.indexPath.trim()
    ? config.indexPath.trim()
    : undefined
  // dsh's profile editor, where dsh keeps the language the user chose, may come up after
  // this plugin: the language is settled again then (below), so the text is read per use.
  const language = { current: memoryLanguage(ctx, config) }
  const settings = {
    indexName: indexNameOf(config.indexName),
    indexPath,
    // When pinned, the name to match is the pinned file's own basename.
    matchName: (indexPath === undefined
      ? indexNameOf(config.indexName)
      : basename(indexPath)).toLowerCase(),
    maxLines: positive(config.maxLines, DEFAULT_MAX_LINES),
    maxBytes: positive(config.maxBytes, DEFAULT_MAX_BYTES),
    get text() {
      return TEXT[language.current]
    },
    // Companion mode (大肥鱼模式, SKILL.md §2.2): three more types for a companion
    // character's own life, and recall in character.
    companion: config.companion === true,
    // Social mode, a choice inside companion mode: others can talk to the character too, so
    // only the user's own conversations get the memory (speakerOf). Private, the default:
    // every conversation does.
    social: config.companion === true && config.audience === 'social',
    // Whether the index goes into the runtime context (below); the skill says where to look
    // when it does not.
    injectIndex: config.injectIndex !== false,
  }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实发现清单与patch如何接到子包，目录有无独立工程责任？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

目录只是DSH实现分组。根发现清单private，dsh.bundle.patch指向adapters/dsh/plugin/cordis.patch.yml；该patch插入engramory并给200行/25600字节配置，包名dsh-engramory由子包main/index.js导出apply。这里没有额外转发层或目录级生命周期，用户运行效果、错误和恢复责任都由实际子包及宿主承担。

工程上要区分清单负责发现、patch负责装配、apply负责运行。patch注释明确覆盖行config需重述保留的键，不能把分组目录当独立配置隔离。子包兼容清单只是它自己的声明，本目录没有额外适配和验收证据，不把递归材料里的代码数量当容器规模或贡献。是否正确注入、拦写和显示UI应在真实子包逐题核查，本题只核到真实入口，不继承其效果。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/plugin/cordis.patch.yml:1-16](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/cordis.patch.yml#L1-L16)

真实bundle一条子包入口和上限配置。

<details>
<summary>查看原文（16行）</summary>

```text
# The dsh-engramory bundle patch: one row, inserted over whatever layers came before
# it. A patch replaces the targeted row's whole `config`, so a profile overriding this
# row must restate every key it means to keep.
#
# The numbers below are the protocol's own caps, not this port's opinion: 200 lines /
# 25 KB is what keeps MEMORY.md cheap enough to load at the start of every session, and
# it is the same limit hooks/engramory_index_guard.py enforces on Claude Code. They live
# here, beside the row, so a deployment can raise or lower them without touching code.

- insert:
    - id: engramory
      name: dsh-engramory
      config:
        indexName: MEMORY.md
        maxLines: 200
        maxBytes: 25600
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/plugin/package.json:28-43](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/package.json#L28-L43)

兼容声明是子包字段，非目录运行证明。

<details>
<summary>查看原文（16行）</summary>

```text
    "compatibility": {
      "dsh": ">=0.1.0-rc.7 <0.3.0-0",
      "dshReleases": {
        "0.1.5-rc.3": "compatible",
        "0.1.7-alpha.1": "compatible",
        "0.1.7-alpha.2": "compatible",
        "0.1.7-rc.1": "compatible",
        "0.1.7-rc.2": "compatible",
        "0.2.1-alpha.5": "compatible",
        "0.2.1-rc.1": "compatible",
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.1-rc.4": "compatible",
        "0.2.1-rc.5": "compatible",
        "0.2.2-alpha.2": "compatible"
      }
```

</details>

#### 缺口

- 真实子包宿主加载、记忆效果和兼容尚不属于本目录独立能力证明。
  **影响**：目录不能支持任何新增运行能力承诺。
  **进一步探讨**：转向adapters/dsh/plugin的固定组件研究和宿主验收，避免重复安装或三份结论合并计分。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 独立采用这层目录能完成记忆任务吗，成本如何退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

不能独立采用本目录完成记忆任务：它不发布包、没有会话或存储生命周期。维护者的可做动作是核真实子包版本与安装来源，再进入该组件自己的研究与宿主验收；不要删除仓库分组目录来模拟卸载插件。单独目录不会替用户加载记忆或修改文件，因此不对其伪造运行步骤、依赖安装或失败恢复。

首次辨认入口与持续版本跟踪是人工负担，现金和时间没有本轮测量，不能写成零。若已经安装下游包，卸载和记忆库保留需依照实际子包/宿主，根卸载规则明确记忆不删。原先直接访问plugin子包是更直接退路，本目录observe仅供源码导航，不推荐多装一层。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/package.json#L1-L8)

根明确可安装包在plugin，不从根发布。

```text
{
  "//": [
    "DISCOVERY MANIFEST ONLY — never published from the repo root (private: true).",
    "The installable npm package is adapters/dsh/plugin/ (same name, published from there).",
    "Registry crawlers (e.g. plugin.dshdesk.com) verify a dsh.bundle object in the ROOT",
    "package.json and that its patch file exists, so this file declares the same bundle",
    "patch the plugin ships. tests/test_dsh_plugin.py pins name/version/patch in sync",
    "with the plugin's own package.json — bump both together."
```

**依据 2 · 作者声明**：[README.md:116-124](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L116-L124)

根卸载说明明确只删安装器自有内容、记忆库永远不删；非本目录自动清理。

````text
## 卸载

dsh 插件：`dsh plugin --profile <名字> remove dsh-engramory`。用安装脚本装的，用安装时的宿主和路径再跑一次，加 `--uninstall`（先加 `--dry-run` 看计划）：

```sh
python tools/engramory_init.py codex --uninstall
```

只删安装器自己的东西：规则块、skill 副本、Codex hook。**记忆库永远不删**，真想清空请自己删。
````

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 目录另列有无新增价值，怎样证伪去重导航假设？

**研究主题**：新假设与验证

#### 完整回答

当前没有识别到独立功能贡献；不能因为目录下有代码就给它重复记忆创新分。由根发现清单与子包发布位置分离，可推导一个未验证导航假设：在收录页显著标注“分组目录、实际包在plugin”并合并安装入口，可能减少读者误以为三个不同记忆插件。相对当前目录跳转，增量只是信息架构，不是目标项目已实现的新运行功能。

最小验证让不了解仓库的用户完成“找到可安装DSH包并解释根与适配器区别”，比较普通目录页与明确分组标识，记录误装、重复计数和查找时间；若错误不降或查找更慢则否定。该方向未实施不计当前创新；未来目录若添加真实入口，需重新固定版本研究，不能从当前空容器预先推断。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/package.json#L1-L8)

发现清单/发布位置分离是导航假设来源。

```text
{
  "//": [
    "DISCOVERY MANIFEST ONLY — never published from the repo root (private: true).",
    "The installable npm package is adapters/dsh/plugin/ (same name, published from there).",
    "Registry crawlers (e.g. plugin.dshdesk.com) verify a dsh.bundle object in the ROOT",
    "package.json and that its patch file exists, so this file declares the same bundle",
    "patch the plugin ships. tests/test_dsh_plugin.py pins name/version/patch in sync",
    "with the plugin's own package.json — bump both together."
```

**依据 2 · 源码核查**：[adapters/dsh/plugin/package.json:64-69](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/package.json#L64-L69)

真实包目录可作为明确导航目的地。

```text
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tinqiao-oss/engramory.git",
    "directory": "adapters/dsh/plugin"
  },
  "homepage": "https://github.com/tinqiao-oss/engramory/tree/master/adapters/dsh/plugin#readme",
```

#### 缺口

- 分组标识是否减少误装与重复理解未测。
  **影响**：仅未来信息架构假设。
  **进一步探讨**：执行上述陌生用户任务对照，无改善则不新增标识。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
