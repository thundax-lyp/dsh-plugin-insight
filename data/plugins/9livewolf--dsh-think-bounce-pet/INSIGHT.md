# dsh-think-bounce-pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[3bfe9cb](https://github.com/9livewolf/dsh-think-bounce-pet/tree/3bfe9cb32afea176937379351af39dfd46f955f4)

<!-- BEGIN META -->
[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=yellow&logo=github&style=flat)](https://github.com/9livewolf/dsh-think-bounce-pet)
<!-- END META -->

> **实现功能**：在 DSH Web 叠加常驻与思考弹球，可调整物理参数并交互。

> **核心亮点**：把 DSH 可见推理文本变化映射为可交互的装饰弹球，配置和动画生命周期集中在客户端；贡献在趣味交互，不在模型能力。详见[Q01](#research-q01)。

> **风险与缺陷**：reasoning 文本不等于真实推理生命周期，空块/切会话可错过或提前结束动画；默认常驻球无推理时也持续 rAF，性能/遮挡需实测。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 这个纯娱乐组件提供什么体验，是否有可证的生产力价值？](#detail-section-11)
  - [Q02 · 推理信号、球的动画与设置持久化如何接线？](#detail-section-12)
  - [Q03 · 动画状态、误触和资源开销有哪些重要边界？](#detail-section-13)
  - [Q04 · 安装、维护与恢复需要什么，哪些实现可复用？](#detail-section-14)
  - [Q05 · 如何保持娱乐反馈而不误示推理状态或影响工作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：纯娱乐 Web UI 装饰，适合愿接受持续动画的个人用户；不代表模型思考质量。详见[Q01](#research-q01)。

普通网页动画和宿主推理 UI 已能装饰/显示状态；本项需证明趣味价值大于持续资源与干扰成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 常驻球 | 装饰 UI | 默认开启，前台持续动画 |
| 思考球 | 可见推理文本反馈 | 不等于真实模型思考状态 |
| 物理设置 | 调速度/重力/碰撞 | localStorage 坏数据回默认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web sessions/slots | 必需 | 推理信号与 overlay/设置 | 组件不工作 |
| 浏览器 rAF/localStorage | 体验必需 | 动画与偏好 | 无动画或只保内存态 |
| 当前会话 partial 结构 | 思考球必需 | 检出 reasoning 文本 | 无球或错时 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 在 Web profile 装并重启 | 设置页与 overlay 可见 |
| 调整 | 设速度/尺寸/碰撞或关闭 | 偏好持久、无关键 UI 遮挡 |
| 观察 | 新推理文本出现时看思考球 | 不把动画解释为模型内部状态 |
| 恢复 | 关闭或卸载 | DOM/监听/帧循环停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web/browser，金额未知 | 安装、重启和调参数；耗时未知 | 兼容未测 |
| 持续使用 | 常驻前台 rAF、CPU/电量未知 | 因遮挡/分心可能调开关；耗时未知 | 两球共享循环 |
| 失败恢复 | 状态错示/偏好丢失；损失未知 | 关闭插件、重配 localStorage；耗时未知 | 存储失败静默 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 双球动画 | 常驻/思考球源码 | 真实 GUI 呈现与手感 |
| 思考反馈 | partial reasoning 文本沿 | 与实际推理生命周期一致性 |
| 设置/清理 | localStorage 与卸载回调 | 坏存储和不同浏览器行为 |

> **思考**：reasoning 文本不等于真实推理生命周期，空块/切会话可错过或提前结束动画；默认常驻球无推理时也持续 rAF，性能/遮挡需实测。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 DSH 可见推理文本变化映射为可交互的装饰弹球，配置和动画生命周期集中在客户端；贡献在趣味交互，不在模型能力。详见[Q01](#research-q01)。

把 DSH 可见推理文本变化映射为可交互的装饰弹球，配置和动画生命周期集中在客户端；贡献在趣味交互，不在模型能力。详见[Q01](#research-q01)。

共用 rAF、dt 上限、设置与碰撞箱同步可借鉴；性能和真实事件对齐需单独验证。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

reasoning 文本不等于真实推理生命周期，空块/切会话可错过或提前结束动画；默认常驻球无推理时也持续 rAF，性能/遮挡需实测。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅当个人偏好装饰且可接受资源/遮挡时观察；勿把球当真实推理计时，低性能或减动效需求先关闭。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持双球与设置机制；推理边界只是 partial 文本近似，常驻球持续占用前台动画，真实宿主和性能未测；改进是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、package、Host/Client；未执行目标代码、浏览器/宿主或性能测试；旧 META 仅复用。
- 下一步：真实 DSH Web 测推理空块、短/长推理、切会话、后台恢复、坏 localStorage、操作遮挡、帧耗和减动效。

**分析版本**

- **仓库**：[9livewolf/dsh-think-bounce-pet](https://github.com/9livewolf/dsh-think-bounce-pet)
- **版本号**：0.1.0（[固定提交 3bfe9cb](https://github.com/9livewolf/dsh-think-bounce-pet/tree/3bfe9cb32afea176937379351af39dfd46f955f4)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是宿主生命周期驱动的明确标注反馈、默认减动效和空闲暂停，以事件对齐、帧耗与操作遮挡夹具验收。详见[Q05](#research-q05)。

真实 DSH Web 测推理空块、短/长推理、切会话、后台恢复、坏 localStorage、操作遮挡、帧耗和减动效。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1252 | 1058 | 160 | — |
| .md | source | 1 | 50 | — | — | 605 |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/9livewolf/dsh-think-bounce-pet/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9livewolf/dsh-think-bounce-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**思考弹球宠物是否如实响应当前推理状态、可控地使用界面资源并能完整清理？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个纯娱乐组件提供什么体验，是否有可证的生产力价值？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件面向愿在 DSH Web 界面看到装饰性动画的个人用户。作者直接称“无实意”，合格交付是球出现/消失符合预期、不挡主界面操作、设置可恢复、关闭后不残留。宿主半 apply 为空，浏览器半在 shell.overlay 画常驻球与推理球、settings.section 配物理参数，localStorage 保存偏好。相对一般网页动画，增量是接入 DSH 会话 partial reasoning 信号及两球独立物理/交互；不应把动画理解为模型思考质量、速度或真实内部状态仪表。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-14](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/README.md#L1-L14)

作者定位为无实意娱乐插件并列功能。

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-think-bounce-pet

[📺 点击观看效果演示](https://www.bilibili.com/video/BV14d886GEx1)

DeepSeek Harness Web UI 的「思考弹球宠物」插件：让两只大肥鱼在界面里弹来弹去，无实意。

## 功能

- **常驻球**：插件开启期间一直在界面弹跳，不受思考状态影响。
- **思考球**：推理开始时从屏幕边缘飞入，思考结束后缩小消失。
- **交互**：点一下把球拍走，按住拖动再松手可扔出去。
- **鼠标碰撞**：开启后鼠标变成不可推动的障碍，球碰到会被弹开，且不能抓取。
- **重力**：可调 0（无重力）、1 倍、2 倍向下重力。
- **自定义**：初速度、碰撞损耗、摩擦力、球体大小都可实时调整。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-10](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/index.js#L1-L10)

Host 空壳。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Host half of the dsh-think-bounce-pet Web surface.
 *
 * The browser half is discovered from package.json's `dsh.client` declaration.
 * This plugin is purely a client-side UI pet (a ball that bounces while the
 * agent thinks), so the host half stays an empty apply: keeping the row in the
 * host Loader is what lets the client-modules roster scan pick up the browser
 * half. No file/process/network capabilities are needed here today.
 */
export function apply() {}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:248-281](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L248-L281)

两球引擎与共用帧循环。

<details>
<summary>查看原文（34行）</summary>

```text
    // ── Ball engines ─────────────────────────────────────────────────────────
    // 现在有两颗独立的球：
    //   engine       = 原来的「思考球」：think 开始出现、think 结束消失，其他行为不变
    //   alwaysEngine = 新加的「常驻球」：启用插件期间一直显示，不受 think 状态影响
    // 两颗球都走同一套物理，因此都受 MIN_SPEED 保护，永远不会停下。
    function createEngine() {
      return {
        layer: null,
        ball: null,
        core: null,
        state: "idle",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        roll: 0, // 滚动自转角（让高光跟着滚，滚动感可见）
        deformAmp: 0, // 「ber」当前振幅 [0..1]，碰撞/点击时置 1
        deformT: 0, // 距上次触发「ber」的时间（ms）
        heading: 0, // 最近一次运动朝向（静止时保留用于形变轴向）
        spawnedAt: 0,
        dieAt: 0,
        raf: null,
        lastTs: 0,
        lastRadius: 0, // 上次写入 DOM 的球半径，用于避免重复设置 width/height
        grab: null
      };
    }

    var engine = createEngine();
    var alwaysEngine = createEngine();

    // 两颗球共用一个 rAF 主循环：这样同一帧里可以统一积分 + 做球间碰撞，
    // 避免两颗球各自跑一套 rAF 导致碰撞时序不稳定。
    var master = { raf: null, lastTs: 0 };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1190-1207](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L1190-L1207)

设置页与 overlay 槽位。

<details>
<summary>查看原文（18行）</summary>

```text
    // 必需服务：sessions（会话快照/推理流）、slots（overlay + 设置页槽位）。
    // 浏览器半边访问 ctx.<服务名> 前，必须把服务名声明在这里。
    var inject = ["slots", "sessions"];

    function apply(ctx) {
      ctxRef = ctx;
      var disposeList = ctx.sessions.list.subscribe(refresh);
      var disposeStyles = ctx.effect(injectStyles, "think-bounce-pet: styles");

      ctx.slots.inject("settings.section", () =>
        ctx.slots.register(
          { name: "settings.section", id: "think-bounce-pet", order: 12, label: () => "宠物 · 思考弹球" },
          PetSettingsSection
        )
      );
      ctx.slots.inject("shell.overlay", () =>
        ctx.slots.register({ name: "shell.overlay", id: "think-bounce-pet-overlay", order: 85, label: "思考弹球宠物" }, PetOverlay)
      );
```

</details>

#### 缺口

- 未做真实用户体验与 UI 可访问性检查
  **影响：**不能声称提升专注、效率或审美满意度
  **进一步探讨：**目标浏览器比较开关前后操作遮挡、分心和个人偏好

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 推理信号、球的动画与设置持久化如何接线？

**研究主题：**功能与机制

#### 完整回答

客户端订阅 sessions.list，绑定当前会话，历史窗口 openState 首次打开先基线化，随后每次 session snapshot 检查 chat.legacy.partial.blocks 是否有 kind=reasoning 且 text 非空；false→true 生成推理球，true→false 缩小移除。常驻球在启用时一直存在，两球共用 requestAnimationFrame masterFrame 做积分/碰撞，视窗后台 rAF 通常停。设置包含初速、损耗、摩擦、尺寸、鼠标碰撞和重力，有限值被夹到范围后写 localStorage；旧 enabled 键可迁移。关闭和卸载调用清理订阅/样式/监听与球 DOM。代码接线可确认，真实宿主 partial 格式与事件时机本轮未实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:57-113](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L57-L113)

设置默认、迁移与本地读取。

<details>
<summary>查看原文（57行）</summary>

```text
    // ── Settings store（localStorage；开关 + 物理参数 + 球体大小，带订阅给设置页用）──
    var SETTINGS_KEY = "dsh-think-bounce-pet.settings";
    var LEGACY_ENABLED_KEY = "dsh-think-bounce-pet.enabled"; // v0.1 只存 "0"/"1"

    // 默认值 = 当前设置固化：启用开 / 初速 3440 / 碰撞损耗 14% / 摩擦力 0 / 球体大小 86% / 鼠标碰撞 0（关） / 重力 0。
    var PHYSICS_DEFAULTS = { launchSpeed: 3440, lossPct: 14, friction: 0, sizePct: 86, mouseCollide: 0, gravity: 0 };
    var PHYSICS_BOUNDS = {
      launchSpeed: [200, 4000], // 初速 px/s
      lossPct: [0, 90], // 每次碰撞的速度损耗百分比（内部换算成恢复系数）
      friction: [0, 100], // 摩擦力：指数阻尼强度，0 = 无
      sizePct: [20, 200], // 球体大小：以 100% 为当前尺寸基准，20% ~ 200%
      mouseCollide: [0, 100], // 鼠标碰撞：0 = 关闭；50 = 较大推力；100 = 非常大推力
      gravity: [0, 100] // 重力：0 = 当前状态；50 = 1 倍重力；100 = 2 倍重力
    };

    function clampField(value, bounds, fallback) {
      var n = Number(value);
      if (!isFinite(n)) return fallback;
      return Math.min(bounds[1], Math.max(bounds[0], Math.round(n)));
    }

    function normalizeSettings(raw) {
      var out = {
        enabled: true,
        launchSpeed: PHYSICS_DEFAULTS.launchSpeed,
        lossPct: PHYSICS_DEFAULTS.lossPct,
        friction: PHYSICS_DEFAULTS.friction,
        sizePct: PHYSICS_DEFAULTS.sizePct,
        mouseCollide: PHYSICS_DEFAULTS.mouseCollide,
        gravity: PHYSICS_DEFAULTS.gravity
      };
      if (raw !== null && typeof raw === "object") {
        out.enabled = raw.enabled === true;
        out.launchSpeed = clampField(raw.launchSpeed, PHYSICS_BOUNDS.launchSpeed, PHYSICS_DEFAULTS.launchSpeed);
        out.lossPct = clampField(raw.lossPct, PHYSICS_BOUNDS.lossPct, PHYSICS_DEFAULTS.lossPct);
        out.friction = clampField(raw.friction, PHYSICS_BOUNDS.friction, PHYSICS_DEFAULTS.friction);
        out.sizePct = clampField(raw.sizePct, PHYSICS_BOUNDS.sizePct, PHYSICS_DEFAULTS.sizePct);
        // 旧版布尔开关迁移：true → 50（较大推力），false/缺失 → 0（关闭）。
        out.mouseCollide = raw.mouseCollide === true ? 50 : clampField(raw.mouseCollide, PHYSICS_BOUNDS.mouseCollide, PHYSICS_DEFAULTS.mouseCollide);
        out.gravity = clampField(raw.gravity, PHYSICS_BOUNDS.gravity, PHYSICS_DEFAULTS.gravity);
      }
      return out;
    }

    var settings = (function () {
      var state = (function () {
        try {
          var raw = window.localStorage.getItem(SETTINGS_KEY);
          if (raw !== null) return normalizeSettings(JSON.parse(raw));
          // v0.1 迁移：旧版只有 "0"/"1" 的 enabled 键。
          var legacy = window.localStorage.getItem(LEGACY_ENABLED_KEY);
          if (legacy !== null) return normalizeSettings({ enabled: legacy !== "0" });
        } catch {
          // 解析失败按默认处理
        }
        return normalizeSettings(null);
      })();
```

</details>

**依据 2 · 源码核查**：[lib/client.js:125-215](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L125-L215)

设置写入和订阅。

<details>
<summary>查看原文（91行）</summary>

```text
      function persist() {
        try {
          window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
        } catch {
          // 配额/隐私模式：仅保留内存态
        }
      }
      return {
        getSnapshot: function () {
          return snapshot;
        },
        subscribe: function (listener) {
          listeners.push(listener);
          return function () {
            var at = listeners.indexOf(listener);
            if (at !== -1) listeners.splice(at, 1);
          };
        },
        isEnabled: function () {
          return state.enabled === true;
        },
        setEnabled: function (value) {
          var next = value === true;
          if (next === state.enabled) return;
          state.enabled = next;
          snapshot = Object.assign({}, state);
          persist();
          notify();
        },
        /** 更新物理参数（部分字段），值越界会被夹回合法区间。 */
        setPhysics: function (patch) {
          var changed = false;
          if (patch.launchSpeed !== void 0) {
            var ls = clampField(patch.launchSpeed, PHYSICS_BOUNDS.launchSpeed, state.launchSpeed);
            if (ls !== state.launchSpeed) {
              state.launchSpeed = ls;
              changed = true;
            }
          }
          if (patch.lossPct !== void 0) {
            var lp = clampField(patch.lossPct, PHYSICS_BOUNDS.lossPct, state.lossPct);
            if (lp !== state.lossPct) {
              state.lossPct = lp;
              changed = true;
            }
          }
          if (patch.friction !== void 0) {
            var fr = clampField(patch.friction, PHYSICS_BOUNDS.friction, state.friction);
            if (fr !== state.friction) {
              state.friction = fr;
              changed = true;
            }
          }
          if (patch.sizePct !== void 0) {
            var sz = clampField(patch.sizePct, PHYSICS_BOUNDS.sizePct, state.sizePct);
            if (sz !== state.sizePct) {
              state.sizePct = sz;
              changed = true;
            }
          }
          if (patch.gravity !== void 0) {
            var gv = clampField(patch.gravity, PHYSICS_BOUNDS.gravity, state.gravity);
            if (gv !== state.gravity) {
              state.gravity = gv;
              changed = true;
            }
          }
          if (patch.mouseCollide !== void 0) {
            var mc = clampField(patch.mouseCollide, PHYSICS_BOUNDS.mouseCollide, state.mouseCollide);
            if (mc !== state.mouseCollide) {
              state.mouseCollide = mc;
              changed = true;
            }
          }
          if (!changed) return;
          snapshot = Object.assign({}, state);
          persist();
          notify();
        },
        resetPhysics: function () {
          state.launchSpeed = PHYSICS_DEFAULTS.launchSpeed;
          state.lossPct = PHYSICS_DEFAULTS.lossPct;
          state.friction = PHYSICS_DEFAULTS.friction;
          state.sizePct = PHYSICS_DEFAULTS.sizePct;
          state.mouseCollide = PHYSICS_DEFAULTS.mouseCollide;
          state.gravity = PHYSICS_DEFAULTS.gravity;
          snapshot = Object.assign({}, state);
          persist();
          notify();
        }
      };
```

</details>

**依据 3 · 源码核查**：[lib/client.js:607-628](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L607-L628)

两球共用帧循环及后台标志。

<details>
<summary>查看原文（22行）</summary>

```text
    function masterFrame(ts) {
      master.raf = null;
      var dt = master.lastTs === 0 ? 0.016 : Math.min(MAX_DT, (ts - master.lastTs) / 1000);
      master.lastTs = ts;
      step(engine, dt, ts);
      step(alwaysEngine, dt, ts);
      resolveBallCollision(ts);
      resolveMouseCollision(engine, ts);
      resolveMouseCollision(alwaysEngine, ts);
      if (
        (engine.raf !== null && needsAnimation(engine)) ||
        (alwaysEngine.raf !== null && needsAnimation(alwaysEngine))
      ) {
        master.raf = window.requestAnimationFrame(masterFrame);
      }
    }

    /** 生成一只球：随机一条边外的随机点，瞄准界面中部以初始动能射入。 */
    function spawnBall(eng, force) {
      if (!force && !settings.isEnabled()) return;
      removeBall(eng);
      if (!force && document.hidden === true) return; // 后台页不空转，回到前台下次 think 再见
```

</details>

**依据 4 · 源码核查**：[lib/client.js:919-992](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L919-L992)

reasoning partial 触发沿。

<details>
<summary>查看原文（74行）</summary>

```text
    // ── 会话挂钩：只盯推理流的开始/结束两个沿 ────────────────────────────────
    // 语义与 dsh-beautify 一致：partial 里出现带文本的 reasoning 块 = 思考开始；
    // 该信号消失 = 思考结束。openState 安装完成后再基线化，避免页面加载时
    // 把历史思考重放成新球。
    var sessionHook = { id: void 0, unsub: null, opened: false, reasoningOn: false };

    function hasReasoningText(partial) {
      if (partial === null || partial === void 0 || partial.blocks === void 0) return false;
      for (var i = 0; i < partial.blocks.length; i++) {
        var block = partial.blocks[i];
        if (block !== null && block !== void 0 && block.kind === "reasoning" && typeof block.text === "string" && block.text.length > 0) {
          return true;
        }
      }
      return false;
    }

    function detachSession() {
      if (sessionHook.unsub !== null) {
        try {
          sessionHook.unsub();
        } catch {
          // 已经解绑
        }
        sessionHook.unsub = null;
      }
      sessionHook.id = void 0;
      sessionHook.opened = false;
      sessionHook.reasoningOn = false;
      despawnBall(engine, true); // 切换会话时不留悬空的思考球；常驻球不受影响
    }

    function baselineSession(snap) {
      var legacy = snap.chat === void 0 ? void 0 : snap.chat.legacy;
      sessionHook.reasoningOn = hasReasoningText(legacy === void 0 ? null : legacy.partial);
    }

    function attachSession(id) {
      detachSession();
      sessionHook.id = id;
      if (id === void 0) return;
      var binding = ctxSessions().binding(id);
      var session = binding === void 0 ? void 0 : binding.session;
      if (session === void 0) return;
      sessionHook.unsub = session.subscribe(onSessionChange);
      var snap = session.getSnapshot();
      if (snap !== void 0 && snap.openState === "open") {
        sessionHook.opened = true;
        baselineSession(snap);
      }
    }

    function onSessionChange() {
      var binding = ctxSessions().binding(sessionHook.id);
      var session = binding === void 0 ? void 0 : binding.session;
      var snap = session === void 0 ? void 0 : session.getSnapshot();
      if (snap === void 0 || snap.chat === void 0) return;

      // 历史窗口安装完成后才基线 + 判定，防止重放旧思考。
      if (!sessionHook.opened) {
        if (snap.openState === "open") {
          sessionHook.opened = true;
          baselineSession(snap);
        }
        return;
      }
      if (snap.openState !== "open") return;

      var legacy = snap.chat.legacy === void 0 ? void 0 : snap.chat.legacy;
      var reasoningNow = hasReasoningText(legacy === void 0 ? null : legacy.partial);
      if (reasoningNow && !sessionHook.reasoningOn) spawnBall(engine, false);
      else if (!reasoningNow && sessionHook.reasoningOn) despawnBall(engine, false);
      sessionHook.reasoningOn = reasoningNow;
    }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1194-1235](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L1194-L1235)

槽位挂载和清理。

<details>
<summary>查看原文（42行）</summary>

```text
    function apply(ctx) {
      ctxRef = ctx;
      var disposeList = ctx.sessions.list.subscribe(refresh);
      var disposeStyles = ctx.effect(injectStyles, "think-bounce-pet: styles");

      ctx.slots.inject("settings.section", () =>
        ctx.slots.register(
          { name: "settings.section", id: "think-bounce-pet", order: 12, label: () => "宠物 · 思考弹球" },
          PetSettingsSection
        )
      );
      ctx.slots.inject("shell.overlay", () =>
        ctx.slots.register({ name: "shell.overlay", id: "think-bounce-pet-overlay", order: 85, label: "思考弹球宠物" }, PetOverlay)
      );

      function onResize() {
        clampIntoViewport(engine);
        clampIntoViewport(alwaysEngine);
      }
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointerMove);
      document.addEventListener("mouseleave", onMouseLeave);
      // 设置变化时立刻把尺寸应用到现有球（即使球在静止/被抓状态下）。
      var disposeSettings = settings.subscribe(function () {
        applyBallSize(engine);
        applyBallSize(alwaysEngine);
      });
      refresh();
      spawnAlwaysBall();

      ctx.effect(function () {
        return function () {
          disposeList();
          disposeStyles();
          disposeSettings();
          window.removeEventListener("resize", onResize);
          window.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("mouseleave", onMouseLeave);
          destroy();
          ctxRef = null;
        };
      }, "think-bounce-pet: lifecycle");
```

</details>

#### 缺口

- 目标 DSH 实际 partial 事件顺序及浏览器后台行为未测
  **影响：**不能证明所有推理都恰好有一次出现/消失
  **进一步探讨：**真实会话覆盖短推理、长推理、无文本推理、切会话与后台回前台

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 动画状态、误触和资源开销有哪些重要边界？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

判断仅依赖 legacy.partial 中带文本的 reasoning 块，不等于模型真实思考开始/结束；没有文本的推理不会生成球，partial 暂时清空会令球提前消失，切到已在思考的会话会先基线化而不重放球。启用默认 true，常驻球永不停（MIN_SPEED=46）并每帧改 transform/碰撞，即使没有推理也持续占用前台动画资源；真实 CPU/电量未测。图层 pointer-events:none，但球本体 pointer-events:auto，在屏幕上可抓取/碰撞，可能遮挡某些点击；鼠标碰撞模式不能抓球是明确功能取舍。localStorage 读取失败/损坏会回默认启用，用户原先关闭的偏好可能丢失。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:10-20](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L10-L20)

最低速度和物理常量。

<details>
<summary>查看原文（11行）</summary>

```text
    // ── Tuning constants ──────────────────────────────────────────────────────
    // 物理三参数（初速 / 碰撞损耗 / 摩擦力）已搬进设置页，默认值见
    // PHYSICS_DEFAULTS；这里只留结构常量。MIN_SPEED 是「最低速度」：
    // 任何球的速度都不会低于它，因此球永远不会真正停下来。
    var MIN_SPEED = 46;
    var MIN_BOUNCE_HEIGHT = 80; // 重力模式下贴地至少弹起的可见高度（px），避免贴地滚/抽搐
    var RADIUS = 72; // 与 CSS 尺寸 144px 对应
    var SPAWN_POP_MS = 180; // 出生放大动画时长
    var SHRINK_MS = 400; // think 结束后的缩小消失动画时长
    var FRICTION_SCALE = 0.04; // 摩擦力滑条值(0-100) → 阻尼系数(1/s)，100 ⇒ 4/s
    var GRAVITY_BASE = 1500; // 重力滑条 50 ⇒ 1 倍重力基准加速度（px/s²），100 ⇒ 2 倍
```

</details>

**依据 2 · 源码核查**：[lib/client.js:101-113](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L101-L113)

坏设置回默认 enabled true。

<details>
<summary>查看原文（13行）</summary>

```text
    var settings = (function () {
      var state = (function () {
        try {
          var raw = window.localStorage.getItem(SETTINGS_KEY);
          if (raw !== null) return normalizeSettings(JSON.parse(raw));
          // v0.1 迁移：旧版只有 "0"/"1" 的 enabled 键。
          var legacy = window.localStorage.getItem(LEGACY_ENABLED_KEY);
          if (legacy !== null) return normalizeSettings({ enabled: legacy !== "0" });
        } catch {
          // 解析失败按默认处理
        }
        return normalizeSettings(null);
      })();
```

</details>

**依据 3 · 源码核查**：[lib/client.js:607-620](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L607-L620)

前台帧循环。

<details>
<summary>查看原文（14行）</summary>

```text
    function masterFrame(ts) {
      master.raf = null;
      var dt = master.lastTs === 0 ? 0.016 : Math.min(MAX_DT, (ts - master.lastTs) / 1000);
      master.lastTs = ts;
      step(engine, dt, ts);
      step(alwaysEngine, dt, ts);
      resolveBallCollision(ts);
      resolveMouseCollision(engine, ts);
      resolveMouseCollision(alwaysEngine, ts);
      if (
        (engine.raf !== null && needsAnimation(engine)) ||
        (alwaysEngine.raf !== null && needsAnimation(alwaysEngine))
      ) {
        master.raf = window.requestAnimationFrame(masterFrame);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:908-992](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L908-L992)

常驻球和 reasoning 文本信号。

<details>
<summary>查看原文（85行）</summary>

```text
    // ── 常驻球：启用插件期间一直显示，不受 think 状态影响 ───────────────────
    function spawnAlwaysBall() {
      if (!settings.isEnabled()) {
        removeBall(alwaysEngine);
        return;
      }
      // 常驻球用 force=true：只要插件启用就确保存在（即使页面当前在后台，
      // 回到前台也能立即看到；requestAnimationFrame 本身会在后台暂停，不会白耗）。
      if (alwaysEngine.ball === null) spawnBall(alwaysEngine, true);
    }

    // ── 会话挂钩：只盯推理流的开始/结束两个沿 ────────────────────────────────
    // 语义与 dsh-beautify 一致：partial 里出现带文本的 reasoning 块 = 思考开始；
    // 该信号消失 = 思考结束。openState 安装完成后再基线化，避免页面加载时
    // 把历史思考重放成新球。
    var sessionHook = { id: void 0, unsub: null, opened: false, reasoningOn: false };

    function hasReasoningText(partial) {
      if (partial === null || partial === void 0 || partial.blocks === void 0) return false;
      for (var i = 0; i < partial.blocks.length; i++) {
        var block = partial.blocks[i];
        if (block !== null && block !== void 0 && block.kind === "reasoning" && typeof block.text === "string" && block.text.length > 0) {
          return true;
        }
      }
      return false;
    }

    function detachSession() {
      if (sessionHook.unsub !== null) {
        try {
          sessionHook.unsub();
        } catch {
          // 已经解绑
        }
        sessionHook.unsub = null;
      }
      sessionHook.id = void 0;
      sessionHook.opened = false;
      sessionHook.reasoningOn = false;
      despawnBall(engine, true); // 切换会话时不留悬空的思考球；常驻球不受影响
    }

    function baselineSession(snap) {
      var legacy = snap.chat === void 0 ? void 0 : snap.chat.legacy;
      sessionHook.reasoningOn = hasReasoningText(legacy === void 0 ? null : legacy.partial);
    }

    function attachSession(id) {
      detachSession();
      sessionHook.id = id;
      if (id === void 0) return;
      var binding = ctxSessions().binding(id);
      var session = binding === void 0 ? void 0 : binding.session;
      if (session === void 0) return;
      sessionHook.unsub = session.subscribe(onSessionChange);
      var snap = session.getSnapshot();
      if (snap !== void 0 && snap.openState === "open") {
        sessionHook.opened = true;
        baselineSession(snap);
      }
    }

    function onSessionChange() {
      var binding = ctxSessions().binding(sessionHook.id);
      var session = binding === void 0 ? void 0 : binding.session;
      var snap = session === void 0 ? void 0 : session.getSnapshot();
      if (snap === void 0 || snap.chat === void 0) return;

      // 历史窗口安装完成后才基线 + 判定，防止重放旧思考。
      if (!sessionHook.opened) {
        if (snap.openState === "open") {
          sessionHook.opened = true;
          baselineSession(snap);
        }
        return;
      }
      if (snap.openState !== "open") return;

      var legacy = snap.chat.legacy === void 0 ? void 0 : snap.chat.legacy;
      var reasoningNow = hasReasoningText(legacy === void 0 ? null : legacy.partial);
      if (reasoningNow && !sessionHook.reasoningOn) spawnBall(engine, false);
      else if (!reasoningNow && sessionHook.reasoningOn) despawnBall(engine, false);
      sessionHook.reasoningOn = reasoningNow;
    }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1007-1010](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L1007-L1010)

球本体接收指针事件。

```text
.dsh-tbp-layer{position:fixed;inset:0;z-index:9995;pointer-events:none;overflow:hidden}
.dsh-tbp-ball{position:absolute;left:0;top:0;width:144px;height:144px;margin:-72px 0 0 -72px;border-radius:0;pointer-events:auto;cursor:grab;touch-action:none;will-change:transform;opacity:1}
.dsh-tbp-ball[data-grab="1"]{cursor:grabbing}
.dsh-tbp-ball[data-state="dying"]{pointer-events:none}
```

#### 缺口

- 实际 CPU/电量、遮挡率和错误状态频率未测
  **影响：**不能估计持续使用成本或说可完全无干扰
  **进一步探讨：**测前台/后台帧时间、电量、关键操作命中与推理事件对齐

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、维护与恢复需要什么，哪些实现可复用？

**研究主题：**依赖、兼容与流程、工程质量与复用

#### 完整回答

需要 DSH Web 客户端 runtime、sessions/slots 服务和浏览器 requestAnimationFrame、localStorage；首次安装并重启 Web，配置可在设置页调整。持续维护依赖 legacy.partial.blocks 形态和 overlay/settings 槽位，宿主结构变更会使信号或界面失效；重力/碰撞每帧资源可通过设置调低但常驻仍在。失败恢复可在设置中关启用或卸载以移除 DOM/监听；本地存储拒写时偏好仅驻内存。两球共用一个 rAF、dt 上限、尺寸与碰撞箱同步、清理器集中是可复用的动画工程设计，但无独立性能测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-36](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/package.json#L1-L36)

Web 客户端包和注入。

<details>
<summary>查看原文（36行）</summary>

```text
{
  "name": "dsh-think-bounce-pet",
  "version": "0.1.0",
  "description": "Think-step bounce pet for the DeepSeek Harness Web UI: a ball launches in from a random screen edge whenever a reasoning step starts, bounces around with energy loss, can be poked or flung with the mouse, and shrinks away when the think step ends",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/9livewolf/dsh-think-bounce-pet.git"
  },
  "homepage": "https://github.com/9livewolf/dsh-think-bounce-pet",
  "bugs": {
    "url": "https://github.com/9livewolf/dsh-think-bounce-pet/issues"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ]
    }
  }
```

</details>

**依据 2 · 作者声明**：[README.md:16-50](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/README.md#L16-L50)

设置、安装和结构说明。

<details>
<summary>查看原文（35行）</summary>

````text
## 设置

| 参数 | 默认 | 范围 | 说明 |
|---|---|---|---|
| 启用 | 开 | — | 关闭后移除常驻球与思考球，也不再随 think 生成球 |
| 鼠标碰撞 | 0（关） | 0–100 | 0=关闭；50=较大推力（400px/s）；100=50 的 5 倍推力；开启时鼠标为障碍且不能抓取球 |
| 重力 | 0（无） | 0–100 | 0=当前无重力；50=1 倍重力；100=2 倍重力 |
| 初速度 | 3440 px/s | 200–4000 | 发射、拍飞、扔出的初始速率 |
| 碰撞损耗 | 14 % | 0–90 | 每次碰壁损失的速度比例 |
| 摩擦力 | 0（无） | 0–100 | 指数阻尼强度（100 ≈ 每秒速度 ×0.018） |
| 球体大小 | 86 % | 20–200 | 以当前 144px 直径/72px 半径为 100% 基准，实时缩放视觉尺寸与碰撞箱 |

参数改动立即生效（飞行中的球下一帧就按新值计算），持久化在
localStorage 的 `dsh-think-bounce-pet.settings`；v0.1 的旧开关键会自动迁移。
最低速度固定为 46 px/s，不随以上设置项修改；重力模式下贴地时会额外保证竖直方向至少能弹起约 80px 高度，避免球贴地滚/抽搐。

## 安装 / 更新

```powershell
# 从 GitHub 安装
& '.\node_modules\.bin\dsh.cmd' plugin --profile web add github:9livewolf/dsh-think-bounce-pet

# 更新
& '.\node_modules\.bin\dsh.cmd' plugin --profile web update dsh-think-bounce-pet
```

客户端半边改动只需浏览器 F5；本插件无宿主侧逻辑，装好后重启一次 `dsh web`
即可长期生效。

## 结构

标准 DSH 双面插件：宿主半边 `lib/index.js` 为空壳（纯客户端 UI 插件）；
浏览器半边 `lib/client.js` 通过 `shell.overlay` 槽位挂载全屏
`pointer-events:none` 图层（每颗球各自一个图层，球本体 `pointer-events:auto`），通过
`settings.section` 槽位提供设置页。
````

</details>

**依据 3 · 源码核查**：[lib/client.js:218-235](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L218-L235)

尺寸与碰撞半径同步。

<details>
<summary>查看原文（18行）</summary>

```text
    /** 当前设置下的实际半径：以 RADIUS 为 100% 基准，sizePct 动态缩放。 */
    function currentRadius() {
      return RADIUS * settings.getSnapshot().sizePct / 100;
    }

    /** 让 DOM 上的球尺寸与当前设置中的碰撞半径保持一致（拖动滑条实时生效）。 */
    function applyBallSize(eng) {
      var el = eng.ball;
      if (el === null) return;
      var r = currentRadius();
      // 尺寸没变就不重复写 style，避免每帧无谓的样式重算。
      if (eng.lastRadius === r) return;
      eng.lastRadius = r;
      el.style.width = (r * 2).toFixed(2) + "px";
      el.style.height = (r * 2).toFixed(2) + "px";
      el.style.marginLeft = "-" + r.toFixed(2) + "px";
      el.style.marginTop = "-" + r.toFixed(2) + "px";
    }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:279-301](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L279-L301)

共用帧循环。

<details>
<summary>查看原文（23行）</summary>

```text
    // 两颗球共用一个 rAF 主循环：这样同一帧里可以统一积分 + 做球间碰撞，
    // 避免两颗球各自跑一套 rAF 导致碰撞时序不稳定。
    var master = { raf: null, lastTs: 0 };

    function startLoop(eng) {
      if (eng.raf === null && typeof window.requestAnimationFrame === "function") {
        eng.raf = 1;
        if (master.raf === null) {
          master.lastTs = 0;
          master.raf = window.requestAnimationFrame(masterFrame);
        }
      }
    }

    function stopLoop(eng) {
      if (eng.raf !== null) {
        eng.raf = null;
        if (master.raf !== null && engine.raf === null && alwaysEngine.raf === null) {
          window.cancelAnimationFrame(master.raf);
          master.raf = null;
        }
      }
    }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1224-1235](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L1224-L1235)

卸载清理。

<details>
<summary>查看原文（12行）</summary>

```text
      ctx.effect(function () {
        return function () {
          disposeList();
          disposeStyles();
          disposeSettings();
          window.removeEventListener("resize", onResize);
          window.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("mouseleave", onMouseLeave);
          destroy();
          ctxRef = null;
        };
      }, "think-bounce-pet: lifecycle");
```

</details>

#### 缺口

- 真实安装成功率、持续耗电和故障恢复耗时未核
  **影响：**不能量化总体使用代价
  **进一步探讨：**目标浏览器测安装、开关、卸载及资源性能

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何保持娱乐反馈而不误示推理状态或影响工作？

**研究主题：**新假设与验证、采用判断

#### 完整回答

未验证方向是把思考球明确标记为“当前可见 reasoning 文本动画”，由宿主更稳定的推理生命周期事件驱动；为常驻球提供默认关闭、prefers-reduced-motion 和帧率/暂停选项，保存失败给可见提示。最小验证将模型思考事件与球出现/消失逐帧对照，并测无推理闲置、低电量/后台、触控与关键按钮遮挡。当前可作为非关键个人装饰试用，但不要把出现时间当实际推理时长；对低性能/需无障碍减动效的用户建议先观察或关闭。推荐 observe，待性能与可访问性验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:919-992](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L919-L992)

当前基于 partial 文本的近似信号。

<details>
<summary>查看原文（74行）</summary>

```text
    // ── 会话挂钩：只盯推理流的开始/结束两个沿 ────────────────────────────────
    // 语义与 dsh-beautify 一致：partial 里出现带文本的 reasoning 块 = 思考开始；
    // 该信号消失 = 思考结束。openState 安装完成后再基线化，避免页面加载时
    // 把历史思考重放成新球。
    var sessionHook = { id: void 0, unsub: null, opened: false, reasoningOn: false };

    function hasReasoningText(partial) {
      if (partial === null || partial === void 0 || partial.blocks === void 0) return false;
      for (var i = 0; i < partial.blocks.length; i++) {
        var block = partial.blocks[i];
        if (block !== null && block !== void 0 && block.kind === "reasoning" && typeof block.text === "string" && block.text.length > 0) {
          return true;
        }
      }
      return false;
    }

    function detachSession() {
      if (sessionHook.unsub !== null) {
        try {
          sessionHook.unsub();
        } catch {
          // 已经解绑
        }
        sessionHook.unsub = null;
      }
      sessionHook.id = void 0;
      sessionHook.opened = false;
      sessionHook.reasoningOn = false;
      despawnBall(engine, true); // 切换会话时不留悬空的思考球；常驻球不受影响
    }

    function baselineSession(snap) {
      var legacy = snap.chat === void 0 ? void 0 : snap.chat.legacy;
      sessionHook.reasoningOn = hasReasoningText(legacy === void 0 ? null : legacy.partial);
    }

    function attachSession(id) {
      detachSession();
      sessionHook.id = id;
      if (id === void 0) return;
      var binding = ctxSessions().binding(id);
      var session = binding === void 0 ? void 0 : binding.session;
      if (session === void 0) return;
      sessionHook.unsub = session.subscribe(onSessionChange);
      var snap = session.getSnapshot();
      if (snap !== void 0 && snap.openState === "open") {
        sessionHook.opened = true;
        baselineSession(snap);
      }
    }

    function onSessionChange() {
      var binding = ctxSessions().binding(sessionHook.id);
      var session = binding === void 0 ? void 0 : binding.session;
      var snap = session === void 0 ? void 0 : session.getSnapshot();
      if (snap === void 0 || snap.chat === void 0) return;

      // 历史窗口安装完成后才基线 + 判定，防止重放旧思考。
      if (!sessionHook.opened) {
        if (snap.openState === "open") {
          sessionHook.opened = true;
          baselineSession(snap);
        }
        return;
      }
      if (snap.openState !== "open") return;

      var legacy = snap.chat.legacy === void 0 ? void 0 : snap.chat.legacy;
      var reasoningNow = hasReasoningText(legacy === void 0 ? null : legacy.partial);
      if (reasoningNow && !sessionHook.reasoningOn) spawnBall(engine, false);
      else if (!reasoningNow && sessionHook.reasoningOn) despawnBall(engine, false);
      sessionHook.reasoningOn = reasoningNow;
    }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:908-916](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L908-L916)

启用时常驻球。

```text
    // ── 常驻球：启用插件期间一直显示，不受 think 状态影响 ───────────────────
    function spawnAlwaysBall() {
      if (!settings.isEnabled()) {
        removeBall(alwaysEngine);
        return;
      }
      // 常驻球用 force=true：只要插件启用就确保存在（即使页面当前在后台，
      // 回到前台也能立即看到；requestAnimationFrame 本身会在后台暂停，不会白耗）。
      if (alwaysEngine.ball === null) spawnBall(alwaysEngine, true);
```

**依据 3 · 源码核查**：[lib/client.js:125-130](https://github.com/9livewolf/dsh-think-bounce-pet/blob/3bfe9cb32afea176937379351af39dfd46f955f4/lib/client.js#L125-L130)

存储失败静默。

```text
      function persist() {
        try {
          window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
        } catch {
          // 配额/隐私模式：仅保留内存态
        }
```

#### 缺口

- 生命周期 API/减动效和性能策略未实现/测试
  **影响：**不能计作当前插件能力
  **进一步探讨：**隔离原型对照体验和帧耗，并核宿主可用事件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
