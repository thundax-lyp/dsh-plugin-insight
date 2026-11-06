# dsh-godot-skill

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5ff4084](https://github.com/akira399/dsh-godot-skill/tree/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca)

<!-- BEGIN META -->
[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/akira399/dsh-godot-skill)
<!-- END META -->

> **功能**：将 Godot 4 开发速查、工作流与代码模板注册为 DSH 可加载的运行时技能。

> **亮点**：中文参考和模板随插件激活/卸载，统一分发；不增加引擎控制、自主循环或目标平台验收。见 [Q03](#research-q03)。

> **主要限制**：verify只测语法/文件/mock注册，disposer断言不核真实disposer；正文没有绑定Godot小版本或可玩导出回执。见 [Q02](#research-q02)。

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
  - [Q01 · 技能怎样进入会话，又怎样影响游戏开发？](#detail-section-11)
  - [Q02 · 参考和验证脚本能否证明游戏可运行、可导出？](#detail-section-12)
  - [Q03 · 相对本地技能和官方文档，贡献与维护负担在哪里？](#detail-section-13)
  - [Q04 · 什么范围可试用，新增方向怎样证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在DSH开发Godot4小游戏时加载中文节点/API与流程参考。见 [Q01](#research-q01)。

同一SKILL放个人目录，或查官方文档/示例后手工用引擎。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 技能注册 | 会话发现并加载参考 | DSH skills服务必需 |
| 开发流程 | 从玩法定义到导出步骤 | 提示文本非自动执行 |
| 节点/API速查 | 辅助选型 | 按实际小版本复核 |
| 代码模板 | 常见玩法脚本起点 | 未验证可直接运行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20/DSH skills | 插件必需 | 注册技能 | 服务缺失等待，文件坏报错 |
| Godot4实际版本 | 游戏开发必需 | 运行编辑器/项目 | 技能不能代替引擎 |
| 导出模板及平台工具链 | 导出所需 | 生成目标包 | 要按版本准备 |
| 模型文件/终端能力 | AI执行所需 | 写项目、运行命令 | 本包不提供这些工具 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定版本与最小玩法 | 引擎能运行 |
| 加载 | Host注册，模型加载Skill | 只证明可读取参考 |
| 实现 | 模型/用户调用已有工具 | 运行日志无相关错误 |
| 验收 | 人测试玩法和目标导出物 | 不可玩回编辑器/示例 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 依赖/资源未知 | 插件和引擎配置 | 没有运行验收 |
| 持续使用 | 模型/素材/构建未知 | 版本核查与试玩 | 没有节时对照 |
| 失败恢复 | 重构建调用未知 | 日志/官方示例修复 | 保留项目备份 |
| 退出 | 项目与引擎保留 | 卸载技能分开清项目 | 不自动回滚代码 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 技能发现 | 真实skills.register | 宿主加载体验 |
| 参考组织 | 流程与模板正文 | API全面正确 |
| 游戏开发 | 指引已有工具 | 可玩/导出成功 |
| 便利 | 统一分发机制 | 比官方示例净收益 |

> **思考**：verify只测语法/文件/mock注册，disposer断言不核真实disposer；正文没有绑定Godot小版本或可玩导出回执。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：中文参考和模板随插件激活/卸载，统一分发；不增加引擎控制、自主循环或目标平台验收。见 [Q03](#research-q03)。

注册资源目录和生命周期干净；mock断言应与真实注册/引擎契约区分。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

verify只测语法/文件/mock注册，disposer断言不核真实disposer；正文没有绑定Godot小版本或可玩导出回执。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

新项目固定Godot版本，从一关卡开始，人工试玩并打开导出物；不兼容回官方示例。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定注册源码与技能内容已检查；游戏运行、导出和未来验收包未验证。

- 已检查：作者 README、包清单、源码路径 .dsh/skills/godot-4-development/SKILL.md、README.md、lib/index.js、package.json、scripts/verify.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查完整81行Host注册、技能核心工作流/模板线索及verify范围。未逐一校验全部Godot API和平台描述，未运行目标或Godot。
- 下一步：固定引擎小版本对照官方最小示例，查启动/输入碰撞/重生/导出物和修复成本；未执行。

**分析版本**

- **仓库**：[akira399/dsh-godot-skill](https://github.com/akira399/dsh-godot-skill)
- **版本号**：1.0.0（[固定提交 5ff4084](https://github.com/akira399/dsh-godot-skill/tree/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca)）
- **版本日期**：2026-08-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以固定版本的最小可玩原型验收包替代泛化完成承诺；若官方示例更省事或不减不可玩结果即推翻。见 [Q04](#research-q04)。

固定引擎小版本对照官方最小示例，查启动/输入碰撞/重生/导出物和修复成本；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 541 | — | — | 7508 |
| .js | source | 1 | 81 | 53 | 24 | — |
| .mjs | source | 1 | 74 | 56 | 12 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/akira399/dsh-godot-skill/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：技能注册和内容怎样帮助游戏开发，是否替代引擎接入与验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 技能怎样进入会话，又怎样影响游戏开发？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向使用DSH开发Godot4小游戏、需要节点/API速查与开发步骤的个人用户。原办法是放本地SKILL或查官方文档，再让模型使用已有文件/终端工具实现。合格结果是有明确玩法和平台的可玩原型，不是模型读过一篇技能就算完成游戏。

根包确有Host apply，不是仅Markdown：依赖skills服务，读取随包SKILL，解析三个标量frontmatter字段，注册content/resourceBase和元数据，将disposer交宿主生命周期。服务缺失时fiber等待；文件读取失败没有降级为空技能。会话之后通过宿主skill工具加载正文。

正文从类型/目标平台/最小玩法开始，再脚手架、原型、内容、调试和导出，包含节点与GDScript示例。插件自身不注册Godot编辑器、调试器或构建工具，没有独立自主循环；读取文件、运行引擎、继续改错都要模型和宿主已有能力完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:18-25](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/lib/index.js#L18-L25)

硬依赖和随包路径。

```text
export const name = "dsh-godot-skill";

/** Services this plugin requires; the fiber stays pending until they exist. */
export const inject = ["skills"];

const SKILL_NAME = "godot-4-development";
const SKILL_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", ".dsh", "skills", SKILL_NAME);
const SKILL_FILE = join(SKILL_DIR, "SKILL.md");
```

**依据 2 · 源码核查**：[lib/index.js:33-80](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/lib/index.js#L33-L80)

解析、读取、注册及卸载。

<details>
<summary>查看原文（48行）</summary>

```text
function parseFrontmatter(text) {
  const firstLineEnd = text.indexOf("\n");
  const isFenced = firstLineEnd >= 0 && text.slice(0, firstLineEnd).replace(/\r$/, "") === "---";
  if (!isFenced) return { data: {}, body: text.trim() };
  const end = text.indexOf("\n---", firstLineEnd + 1);
  const body = end === -1 ? "" : text.slice(end + 4).trim();
  const header = text.slice(firstLineEnd + 1, end === -1 ? text.length : end);
  const data = {};
  for (const rawLine of header.split("\n")) {
    const line = rawLine.trim();
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key === "name" || key === "description" || key === "whenToUse") data[key] = value;
  }
  return { data, body };
}

export function apply(ctx) {
  const raw = readFileSync(SKILL_FILE, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const description = data.description?.trim() || "Godot Engine 4.x full-stack game development skill for DeepSeek Harness.";
  const skill = {
    name: data.name?.trim() || SKILL_NAME,
    description,
    ...(data.whenToUse?.trim() ? { whenToUse: data.whenToUse.trim() } : {}),
    // Filesystem skills carry the frontmatter-stripped body; mirror that here.
    content: body,
    source: SOURCE,
    metadata: {
      version: "1.0.0",
      sourceRepo: "https://github.com/akira399/dsh-godot-skill",
      docs: "https://docs.godotengine.org/zh-cn/4.x/about/list_of_features.html"
    },
    resourceBase: {
      kind: "directory",
      path: SKILL_DIR
    }
  };

  const disposer = ctx.skills.register(skill);
  // Tie the registration to the plugin fiber's lifecycle: activating and
  // disposing the plugin also (un)registers the skill.
  ctx.effect(() => disposer, `${name}: register skill ${skill.name}`);
```

</details>

**依据 3 · 源码核查**：[.dsh/skills/godot-4-development/SKILL.md:311-337](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/.dsh/skills/godot-4-development/SKILL.md#L311-L337)

正文工作流对开发的提示。

<details>
<summary>查看原文（27行）</summary>

```text
## 5. 完整开发工作流（AI 自主开发）

### 阶段 0：设计决策
1. 明确：游戏类型、核心玩法循环、目标平台、视角（2D/3D）、美术风格、单机/联机。
2. 据此确定渲染器（见 §3）、输入方案、UI 布局策略。
3. 列出最小可玩原型（MVP）范围：一个可玩关卡 + 核心机制 + 胜负条件。

### 阶段 1：项目脚手架
1. 创建目录结构与 `project.godot`（主场景、渲染器、窗口尺寸、输入映射、自动加载单例）。
2. 创建自动加载单例（如 `Game`、`Audio`、`Save`），存放全局状态与服务。
3. 创建主场景 `main.tscn`（可先用脚本生成或手写 tscn，或用 `PackedScene` 节点从零构建）。
4. 确保 `godot --headless --path . --quit` 能无错误启动。

### 阶段 2：核心玩法原型
1. 玩家角色：`CharacterBody2D/3D` + 移动脚本（`Input.get_vector` + `move_and_slide` / `move_and_slide()`）+ 相机跟随。
2. 关卡搭建：`TileMapLayer`/`GridMap`/`StaticBody*` + `CollisionShape*`。
3. 交互：`Area*` 触发（拾取、伤害区、检查点）；信号连接。
4. 敌人/AI：`CharacterBody*` + `NavigationAgent*` 或状态机（`match` 或 `AnimationTree` 状态机）。
5. 游戏流程：生成（`Timer` + 随机位置）、死亡/重生（`queue_free` / `get_tree().reload_current_scene`）、得分/血量 UI。

### 阶段 3：内容实现
- UI（`CanvasLayer` + Control）：主菜单、HUD、暂停、设置（音量/画质/键位重映射）、结算界面；`get_tree().paused` + 处理节点 `process_mode`。
- 音频：背景音乐（`AudioStreamPlayer`，总线“Music”）、音效（总线“SFX”）、`AudioStreamRandomizer` 变化。
- 动画：`AnimationPlayer`（UI/场景/角色动作）、`Tween`（程序式动效）、粒子（死亡/命中/环境）。
- 存档：`ConfigFile`/`JSON` 到 `user://`；设置持久化。
- 网络（如联机）：`MultiplayerSpawner/Synchronizer` + `@rpc`（见 §4.13）。
- 国际化：所有用户可见文本走 `tr()` + CSV/PO 翻译。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 参考和验证脚本能否证明游戏可运行、可导出？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。verify脚本只做入口语法、技能文件/frontmatter和mock ctx注册字段检查；它没有启动Godot、运行模板、测试玩家操作或验证导出。甚至“register returns a disposer”的断言检查的是plugin.apply.toString是否函数，不是实际disposer行为。因此作者验证入口可作为分发结构检查线索，不能当引擎契约验收。

技能要求headless启动、debug和import/export，但这些只是文字步骤，没有自动执行回执或阻止跳步的状态。无错误headless启动也不能代替可玩性、画面、输入和目标平台验收。正文引用滚动4.x文档、未固定具体引擎小版本，本次没有逐个用当前官方API核模板，不宣称所有节点/平台描述都正确；尤其导出/语言/渲染器条件应按用户实际版本复核。

解析器只处理简单标量，正文当前frontmatter符合这一路径；不是通用YAML读取器。注册disposer按ctx.effect生命周期接线可见，但没有真实宿主加载证据。文件存在、字符串长度或覆盖领域数都不能证明模型会正确选型。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/verify.mjs:26-40](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/scripts/verify.mjs#L26-L40)

语法及文件检查。

<details>
<summary>查看原文（15行）</summary>

```text
// 1. Syntax check
try {
  execFileSync(process.execPath, ["--check", PLUGIN], { stdio: "pipe" });
  check("plugin syntax (node --check)", true);
} catch (error) {
  check("plugin syntax (node --check)", false, String(error.stderr ?? error));
}

// 2. Skill file ships and parses
check("SKILL.md exists", existsSync(SKILL_FILE));
if (existsSync(SKILL_FILE)) {
  const raw = readFileSync(SKILL_FILE, "utf8");
  check("SKILL.md starts with --- frontmatter", raw.startsWith("---\n"));
  check("SKILL.md is non-trivial", raw.trim().length > 2000, `${raw.length} bytes`);
}
```

</details>

**依据 2 · 源码核查**：[scripts/verify.mjs:42-74](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/scripts/verify.mjs#L42-L74)

mock注册与错误的disposer断言。

<details>
<summary>查看原文（33行）</summary>

```text
// 3. Runtime registration behavior with a mocked ctx
const plugin = await import(pathToFileURL(PLUGIN).href);
let registered = null;
const disposers = [];
const mockCtx = {
  skills: {
    register(skill) {
      registered = skill;
      const disposer = () => {};
      disposers.push(disposer);
      return disposer;
    }
  },
  effect: (fn) => fn()
};
try {
  plugin.apply(mockCtx);
  check("apply() executed", true);
} catch (error) {
  check("apply() executed", false, error.message);
}
check("inject declares skills service", Array.isArray(plugin.inject) && plugin.inject.includes("skills"));
check("skill name is godot-4-development", registered?.name === "godot-4-development");
check("skill has non-empty description", typeof registered?.description === "string" && registered.description.length > 0);
check("skill has whenToUse", typeof registered?.whenToUse === "string" && registered.whenToUse.length > 0);
check("skill body is frontmatter-stripped", registered?.content?.startsWith("---\n") === false);
check("skill body contains core section", registered?.content?.includes("# Godot 4 游戏开发技能") === true);
check("skill body is substantial", (registered?.content?.length ?? 0) > 5000, `${registered?.content?.length ?? 0} chars`);
check("skill has resourceBase directory", registered?.resourceBase?.kind === "directory");
check("register returns a disposer", typeof plugin.apply.toString === "function");

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
```

</details>

**依据 3 · 源码核查**：[.dsh/skills/godot-4-development/SKILL.md:318-322](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/.dsh/skills/godot-4-development/SKILL.md#L318-L322)

headless启动为文字要求。

```text
### 阶段 1：项目脚手架
1. 创建目录结构与 `project.godot`（主场景、渲染器、窗口尺寸、输入映射、自动加载单例）。
2. 创建自动加载单例（如 `Game`、`Audio`、`Save`），存放全局状态与服务。
3. 创建主场景 `main.tscn`（可先用脚本生成或手写 tscn，或用 `PackedScene` 节点从零构建）。
4. 确保 `godot --headless --path . --quit` 能无错误启动。
```

**依据 4 · 源码核查**：[.dsh/skills/godot-4-development/SKILL.md:344-363](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/.dsh/skills/godot-4-development/SKILL.md#L344-L363)

调试和导出步骤未自动接线。

<details>
<summary>查看原文（20行）</summary>

```text
### 阶段 5：测试与调试
- `godot --path . --debug` 或直接运行；用 `print()`、`print_rich()`、`push_error()` 诊断。
- 远程调试：从编辑器运行项目 + 远程检查器（改动不回写，仅查看）；热重载/热编辑用于迭代。
- 常见错误与修法：
  | 症状 | 原因/修法 |
  | --- | --- |
  | 空引用崩溃 | 节点路径写错；`@onready` 引用不存在的节点；改用 `get_node_or_null()` 或 `is_instance_valid()` |
  | 无碰撞/穿透 | `collision_layer/mask` 位不匹配；子级 CollisionShape 未启用；物理体类型选错 |
  | 信号不触发 | 未 `connect`；在 `_ready` 前发射；对象已释放（自动断开需 `CONNECT_REFERENCE_COUNTED` 或绑定） |
  | 场景切换报错 | 路径写错（`res://` 开头、.tscn 后缀）；场景未保存 |
  | 导入后黑屏/紫 | 资源未导入（跑一次 `--import`）；渲染器不支持的功能（如 Web 用 Forward+） |
  | C# 无法导出 Web | Godot 4 限制，改 GDScript 或用 3.x |
  | 手柄无反应 | InputMap 未映射；死区太大 |

### 阶段 6：导出与发布
1. `项目 → 导出` 创建预设，或手写 `export_presets.cfg`；配置图标、包名、权限、架构。
2. 命令行：`godot --headless --path . --export-release "Windows Desktop" build/game.exe`（先确保导入完成：`godot --headless --path . --import`）。
3. Web：`--export-release "Web" build/index.html`（注意 C# 不支持）。
4. 内容更新：额外 PCK 支持 mod/DLC；`--main-pack` 指定 PCK。
5. CI：GitHub Actions 等跑上述命令自动出包。
```

</details>

**依据 5 · 源码核查**：[.dsh/skills/godot-4-development/SKILL.md:438-444](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/.dsh/skills/godot-4-development/SKILL.md#L438-L444)

4.x滚动文档引用。

```text
## 8. 参考资料
- 特性列表（本文档来源）：<https://docs.godotengine.org/zh-cn/4.x/about/list_of_features.html>
- 类参考（API 权威）：<https://docs.godotengine.org/zh-cn/4.x/classes/>
- 教程索引：<https://docs.godotengine.org/zh-cn/4.x/tutorials/index.html>
- 渲染器概述：<https://docs.godotengine.org/zh-cn/4.x/tutorials/rendering/>
- 导出：<https://docs.godotengine.org/zh-cn/4.x/tutorials/export/>
- 系统需求：<https://docs.godotengine.org/zh-cn/4.x/about/system_requirements.html>
```

#### 缺口

- 具体Godot版本下模板/API与平台导出未逐一核验，游戏完成质量无对照。
  **影响**：不能把全栈参考当可直接生产或全部平台可用。
  **进一步探讨**：固定引擎与目标平台，先审所用模板再实际跑一个最小关卡、输入和导出检查。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对本地技能和官方文档，贡献与维护负担在哪里？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

主要贡献是将中文Godot速查、模板和开发顺序打成可随Host激活的技能，安装/卸载统一管理。相对复制同一SKILL到个人目录，注册包装只提供分发便利；并未增加Godot操作权限或引擎能力。官方资料和宿主模型承担知识及执行基础，不以列出20领域认定全栈能力已兑现。

插件无npm运行依赖但需要Node>=20和DSH skills服务；实际开发还要本机Godot及目标导出模板/工具链，图形验收需要能运行目标画面。首次负担是安装插件、准备引擎和明确最小玩法；持续模型调用、素材/构建资源及人工试玩费用未知。失败时按日志和官方版本文档回退，保留项目Git/备份，卸载只移除技能，生成项目和引擎不自动删除。

当前贡献未识别成本结构、服务方式或资源组织改变；少查文档属于便利而非已证明经济创新。可以用轻量技能分发，但需要更新参考和模板，不能因包体简单就推断整个游戏任务负担低。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-22](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/package.json#L1-L22)

Host技能包及文件范围。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "dsh-godot-skill",
  "version": "1.0.0",
  "description": "Godot Engine 4.x full-stack game development skill for DeepSeek Harness (DSH). A host plugin that registers the `godot-4-development` skill — covering renderers, 2D/3D graphics & physics, GDScript/C#, shaders, audio, input, navigation, networking, i18n, GUI, animation, file formats, mobile/XR and exporting — so any session can load it via the `skill` tool.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    ".dsh/skills/godot-4-development/SKILL.md",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "verify": "node scripts/verify.mjs",
    "prepublishOnly": "node scripts/verify.mjs"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:39-44](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/package.json#L39-L44)

许可证与Node要求。

```text
  },
  "license": "MIT",
  "engines": {
    "node": ">=20"
  }
}
```

**依据 3 · 源码核查**：[lib/index.js:55-80](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/lib/index.js#L55-L80)

注册分发而非引擎操作。

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx) {
  const raw = readFileSync(SKILL_FILE, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const description = data.description?.trim() || "Godot Engine 4.x full-stack game development skill for DeepSeek Harness.";
  const skill = {
    name: data.name?.trim() || SKILL_NAME,
    description,
    ...(data.whenToUse?.trim() ? { whenToUse: data.whenToUse.trim() } : {}),
    // Filesystem skills carry the frontmatter-stripped body; mirror that here.
    content: body,
    source: SOURCE,
    metadata: {
      version: "1.0.0",
      sourceRepo: "https://github.com/akira399/dsh-godot-skill",
      docs: "https://docs.godotengine.org/zh-cn/4.x/about/list_of_features.html"
    },
    resourceBase: {
      kind: "directory",
      path: SKILL_DIR
    }
  };

  const disposer = ctx.skills.register(skill);
  // Tie the registration to the plugin fiber's lifecycle: activating and
  // disposing the plugin also (un)registers the skill.
  ctx.effect(() => disposer, `${name}: register skill ${skill.name}`);
```

</details>

**依据 4 · 源码核查**：[.dsh/skills/godot-4-development/SKILL.md:358-363](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/.dsh/skills/godot-4-development/SKILL.md#L358-L363)

实际导出仍需外部工具链。

```text
### 阶段 6：导出与发布
1. `项目 → 导出` 创建预设，或手写 `export_presets.cfg`；配置图标、包名、权限、架构。
2. 命令行：`godot --headless --path . --export-release "Windows Desktop" build/game.exe`（先确保导入完成：`godot --headless --path . --import`）。
3. Web：`--export-release "Web" build/index.html`（注意 C# 不支持）。
4. 内容更新：额外 PCK 支持 mod/DLC；`--main-pack` 指定 PCK。
5. CI：GitHub Actions 等跑上述命令自动出包。
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么范围可试用，新增方向怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合已装好Godot、能自己试玩的用户，在新项目做一个2D可玩关卡并明确胜负条件。加载技能后核实际引擎版本，只采用本次需要的节点/模板；先导入和启动，再人工测输入、碰撞、重生，最后在目标平台打开导出物。编译/导出失败、API不符或模型只给文字时停止扩大范围，退回官方文档和手工编辑器，不把头less成功当完成。

可验证方向是把参考技能收窄成版本绑定的最小原型验收包：记录引擎版本、所用节点/模板、启动/导出回执和人工玩法检查。相对当前全面速查，增量是让一个小任务的完成边界可查；不必再造引擎控制层。对比有无验收包的相同小游戏，观察API错用、不可玩交付、修复时间及总调用；若直接官方示例已同样可核且更省事，或包只增加清单不减少错误，则不做。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh/skills/godot-4-development/SKILL.md:313-322](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/.dsh/skills/godot-4-development/SKILL.md#L313-L322)

最小原型与启动要求。

<details>
<summary>查看原文（10行）</summary>

```text
### 阶段 0：设计决策
1. 明确：游戏类型、核心玩法循环、目标平台、视角（2D/3D）、美术风格、单机/联机。
2. 据此确定渲染器（见 §3）、输入方案、UI 布局策略。
3. 列出最小可玩原型（MVP）范围：一个可玩关卡 + 核心机制 + 胜负条件。

### 阶段 1：项目脚手架
1. 创建目录结构与 `project.godot`（主场景、渲染器、窗口尺寸、输入映射、自动加载单例）。
2. 创建自动加载单例（如 `Game`、`Audio`、`Save`），存放全局状态与服务。
3. 创建主场景 `main.tscn`（可先用脚本生成或手写 tscn，或用 `PackedScene` 节点从零构建）。
4. 确保 `godot --headless --path . --quit` 能无错误启动。
```

</details>

**依据 2 · 源码核查**：[.dsh/skills/godot-4-development/SKILL.md:344-363](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/.dsh/skills/godot-4-development/SKILL.md#L344-L363)

调试和导出验证线索。

<details>
<summary>查看原文（20行）</summary>

```text
### 阶段 5：测试与调试
- `godot --path . --debug` 或直接运行；用 `print()`、`print_rich()`、`push_error()` 诊断。
- 远程调试：从编辑器运行项目 + 远程检查器（改动不回写，仅查看）；热重载/热编辑用于迭代。
- 常见错误与修法：
  | 症状 | 原因/修法 |
  | --- | --- |
  | 空引用崩溃 | 节点路径写错；`@onready` 引用不存在的节点；改用 `get_node_or_null()` 或 `is_instance_valid()` |
  | 无碰撞/穿透 | `collision_layer/mask` 位不匹配；子级 CollisionShape 未启用；物理体类型选错 |
  | 信号不触发 | 未 `connect`；在 `_ready` 前发射；对象已释放（自动断开需 `CONNECT_REFERENCE_COUNTED` 或绑定） |
  | 场景切换报错 | 路径写错（`res://` 开头、.tscn 后缀）；场景未保存 |
  | 导入后黑屏/紫 | 资源未导入（跑一次 `--import`）；渲染器不支持的功能（如 Web 用 Forward+） |
  | C# 无法导出 Web | Godot 4 限制，改 GDScript 或用 3.x |
  | 手柄无反应 | InputMap 未映射；死区太大 |

### 阶段 6：导出与发布
1. `项目 → 导出` 创建预设，或手写 `export_presets.cfg`；配置图标、包名、权限、架构。
2. 命令行：`godot --headless --path . --export-release "Windows Desktop" build/game.exe`（先确保导入完成：`godot --headless --path . --import`）。
3. Web：`--export-release "Web" build/index.html`（注意 C# 不支持）。
4. 内容更新：额外 PCK 支持 mod/DLC；`--main-pack` 指定 PCK。
5. CI：GitHub Actions 等跑上述命令自动出包。
```

</details>

**依据 3 · 源码核查**：[scripts/verify.mjs:42-74](https://github.com/akira399/dsh-godot-skill/blob/5ff40843e2f9bba8f86e9a76eec3341a9a0e22ca/scripts/verify.mjs#L42-L74)

当前验证仅注册的缺口。

<details>
<summary>查看原文（33行）</summary>

```text
// 3. Runtime registration behavior with a mocked ctx
const plugin = await import(pathToFileURL(PLUGIN).href);
let registered = null;
const disposers = [];
const mockCtx = {
  skills: {
    register(skill) {
      registered = skill;
      const disposer = () => {};
      disposers.push(disposer);
      return disposer;
    }
  },
  effect: (fn) => fn()
};
try {
  plugin.apply(mockCtx);
  check("apply() executed", true);
} catch (error) {
  check("apply() executed", false, error.message);
}
check("inject declares skills service", Array.isArray(plugin.inject) && plugin.inject.includes("skills"));
check("skill name is godot-4-development", registered?.name === "godot-4-development");
check("skill has non-empty description", typeof registered?.description === "string" && registered.description.length > 0);
check("skill has whenToUse", typeof registered?.whenToUse === "string" && registered.whenToUse.length > 0);
check("skill body is frontmatter-stripped", registered?.content?.startsWith("---\n") === false);
check("skill body contains core section", registered?.content?.includes("# Godot 4 游戏开发技能") === true);
check("skill body is substantial", (registered?.content?.length ?? 0) > 5000, `${registered?.content?.length ?? 0} chars`);
check("skill has resourceBase directory", registered?.resourceBase?.kind === "directory");
check("register returns a disposer", typeof plugin.apply.toString === "function");

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
```

</details>

#### 缺口

- 未执行小游戏对照和版本绑定验收包。
  **影响**：不能确认技能比官方示例/本地SKILL有效。
  **进一步探讨**：固定一关卡与引擎版本做可玩性和修复成本对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
