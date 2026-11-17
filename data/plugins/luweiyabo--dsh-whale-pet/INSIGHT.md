# DSH Whale Pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0bc1bc4](https://github.com/luweiyabo/dsh-whale-pet/tree/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/luweiyabo/dsh-whale-pet) [![npm 30d 4,658](https://img.shields.io/static/v1?label=npm+30d&message=4%2C658&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@luweiyabo/dsh-whale-pet) [![最新发布 2026-10-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@luweiyabo/dsh-whale-pet)
<!-- END META -->

> **功能**：在 DeepSeek Harness Web 界面展示随会话活动变化的鲸鱼桌宠，支持拖拽和自定义动作。

> **亮点**：将既有宿主活动压缩为可定制动画，可在折叠会话时给出视觉提示。具体状态仍应回原事件。[Q01](#research-q01)

> **主要限制**：动画可能因多会话合并、乱序或优先级而与当前操作不同，余额另有凭据与本机访问面。[Q01](#research-q01) [Q03](#research-q03)

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
  - [Q01 · 会话很长时，鲸鱼动画能给用户提供什么额外的活动提示？](#detail-section-11)
  - [Q02 · 宿主版本和自定义动作存储会怎样影响接入和退出？](#detail-section-12)
  - [Q03 · 余额气泡读取到哪里，能代替账单或共享环境权限吗？](#detail-section-13)
  - [Q04 · 什么结果能证明桌宠值得保留，什么时候该关闭？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿意在本机 DSH Web 保留一个可见角落提示的用户，可扫视工作或等待动画。

用原生会话状态、审批按钮和日志确认发生了什么，不需要持续媒体解码。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 鲸鱼动画 | 查看会话活动与点击反馈 | 需宿主 Web slot，提示会聚合 |
| 动作管理 | 上传和播放用户素材 | 受文件容量及编码限制，卸载不删 |
| 余额气泡 | 查看支持 provider 的上游余额 | 可选凭据和路径，不等账单 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web overlay、会话事件来源 | 提示需 | 挂载和处理宿主活动 | 重回原生状态 |
| Web 服务器与媒体解码 | 素材需 | 播放与上传 | 用随包资源或关闭 |
| provider 与凭据 | 余额才需 | 获取快照 | 关闭客户端余额气泡 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在本机隔离 profile 关闭客户端余额气泡 | 试用只用内置动作，跳过上传；上传路由仍注册 |
| 验证 | 等待一个已知会话事件 | 回查原生状态并看遮挡 |
| 退出 | 关闭叠加或卸载 | 按需恢复原生态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 媒体大小与资源未知 | 检查宿主和动作 | 版本声明待验证 |
| 持续 | 媒体解码、事件链与网络未测 | 复核提示或关掉干扰 | 人时和功耗未知 |
| 恢复 | 上传目录保留空间 | 关闭或移除，并按需处理用户文件 | 卸载不自动清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 活动提示 | 事件驱动与优先级 | 可见性、准确和误看 |
| 自定义素材 | 有限制的上传与资源存储 | 解码和跨卸载状态 |
| 余额 | 已知供应商快照查询 | 实际账目与服务稳定性 |

> **思考**：动画可能因多会话合并、乱序或优先级而与当前操作不同，余额另有凭据与本机访问面。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将既有宿主活动压缩为可定制动画，可在折叠会话时给出视觉提示。具体状态仍应回原事件。[Q01](#research-q01)

感知、仲裁和显示分离，可用日志回放理解状态机。媒体落盘的排他提交及持久目录单独核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

动画可能因多会话合并、乱序或优先级而与当前操作不同，余额另有凭据与本机访问面。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可在本机隔离 profile 关掉客户端余额气泡，用随包动画试查一次审批等待和模型运行，跳过自定义动作上传。宿主上传路由仍注册。遮挡输入、变慢或状态不符时关闭桌宠并回原生提示。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持事件驱动的视觉提示与媒体资源操作，准确率及实际宿主使用尚未测。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/index.js、package.json、scripts/build-client.mjs、src/client/activity.js、src/client/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根，核查事件、视图、媒体与余额路径，未启动宿主。
- 下一步：比较已知四类会话事件、多个会话和多标签中的提示速度、误判与解码资源。

**分析版本**

- **仓库**：[luweiyabo/dsh-whale-pet](https://github.com/luweiyabo/dsh-whale-pet)
- **版本号**：0.1.3（[固定提交 0bc1bc4](https://github.com/luweiyabo/dsh-whale-pet/tree/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在不干扰点击的前提下，角落活动提示或减少审批漏看。比较可返回原生事件的准确性和响应时间，误判上升就不支持。[Q04](#research-q04)

比较已知四类会话事件、多个会话和多标签中的提示速度、误判与解码资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1057 | — | — | 14149 |
| .js | source | 9 | 16626 | 15234 | 1371 | — |
| .mjs | source | 1 | 33 | 31 | 1 | — |
| .js | test | 13 | 1915 | 1708 | 121 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-17），可前往 [GitHub Issues](https://github.com/luweiyabo/dsh-whale-pet/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：常驻 DSH Web 的用户能否从桌宠快速感知会话活动，哪些条件会导致动画、上传或余额显示失真？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话很长时，鲸鱼动画能给用户提供什么额外的活动提示？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

把常驻 DSH 当主要工作区的人，可以在不展开每条输出时看到一个活动提示。客户端把 WhalePet 叠加到 shell.overlay，沿用宿主事件流，不另测模型状态。工具开始用名称映射意图，按 turn/step 压栈，结果弹出最近的项并可能触发错误。审批、用户消息和 turn 的原始事件也有独立意图。活动感知把多个会话的集合合并，current 模式可过滤，最后按优先级和定时规则延后切换动画。鼠标等直接互动是另一类信号。相比看原生进行中标识，插件增加的是占据固定角落的可定制视觉入口。

提示没有反映整个任务是否结束或成功。在同一步有并行工具且完成顺序不同的条件下，按 turn/step 的后进先出配对不能证明动画对应的具体工具身份；多会话合并也可能显示非当前会话的状态。需要采取动作时打开原生审批或回查日志。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:355-367](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/README.md#L355-L367)

作者将动画映射到不同会话活动。

<details>
<summary>查看原文（13行）</summary>

```text
### 事件感知动作

宠物会读取 Harness 会话活动，并通过 9 类意图仲裁器选择合适动作（可配置）：

| Harness 状态 | 默认表现示例 |
|---|---|
| Agent 编码或操作文件 | 坐在电脑前编码 |
| 思考与推理 | 深度思考 |
| 阅读与检索 | 记笔记 |
| 等待审批或用户回答 | 左右张望 |
| 用户发送消息 | 侧耳倾听 |
| 工具或 Agent 出错 | 惊吓回应 |
| 没有活动 | 待机、转向、随机动作或屏幕漫游 |
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:5528-5549](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/index.js#L5528-L5549)

客户端实际叠加 WhalePet 到官方 slot。

<details>
<summary>查看原文（22行）</summary>

```text
            // 官方"叠加式"注册模式：slots.inject 等槽位被声明后，再注册我们的条目。
            // generator + yield 形式不会替换其他条目，而是叠加进列表槽。
            ctx.slots.inject('shell.overlay', function* () {
                yield ctx.slots.register(
                    {
                        name: 'shell.overlay',
                        id: 'whale-pet', // 列表槽的条目 id（唯一）
                        order: 1000, // 排序（大 = 靠后渲染）
                    },
                    (ownerProps) =>
                        h(WhalePet, {
                            config,
                            api,
                            store,
                            locale,
                            customStore,
                            ruleRuntime,
                            layout,
                            ...ownerProps,
                        })
                );
            });
```

</details>

**依据 3 · 源码核查**：[src/client/activity.js:139-190](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/activity.js#L139-L190)

事件分类及按 turn/step 最近项配对。

<details>
<summary>查看原文（52行）</summary>

```text
            var ev = frame.event || {};
            var d = ev.data || {};
            if (ev.type === 'approval/asked') {
                touch(INTENT.WAITING_USER);
                return next;
            }
            if (ev.type === 'approval/decided') {
                clear(INTENT.WAITING_USER);
                return next;
            }
            if (ev.type === 'tool/call') {
                clear(INTENT.LISTENING);
                // 模型请求工具：分类意图 + 按 turn:step 记账（tool/result 无工具名，靠此配对）
                var ti = TOOL_INTENTS[d.name] || null;
                touch(INTENT.WORKING);
                if (ti) {
                    touch(ti);
                    next.toolCounts[ti] = (next.toolCounts[ti] || 0) + 1;
                }
                var stepKey = toolKey(d);
                next.stepTools = {
                    ...next.stepTools,
                    [stepKey]: [...(next.stepTools[stepKey] || []), ti],
                };
                return next;
            }
            if (ev.type === 'tool/result') {
                if (d.error || d.message?.content?.[0]?.isError) touch(INTENT.ERROR);
                // 消退该 turn:step 最近一次调用的工具意图
                var key = toolKey(d);
                var arr = next.stepTools[key];
                if (arr && arr.length) {
                    next.stepTools = { ...next.stepTools, [key]: arr.slice(0, -1) };
                    var done = arr[arr.length - 1];
                    if (done) {
                        next.toolCounts[done] = (next.toolCounts[done] || 1) - 1;
                        if (next.toolCounts[done] <= 0) {
                            delete next.toolCounts[done];
                            clear(done);
                        }
                    }
                }
                return next;
            }
            if (ev.type === 'user/message') {
                touch(INTENT.LISTENING);
                return next;
            }
            if (ev.type === 'turn/start') {
                clear(INTENT.LISTENING);
                touch(INTENT.WORKING);
                return next;
```

</details>

**依据 4 · 源码核查**：[src/client/activity.js:532-578](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/activity.js#L532-L578)

优先级和切换延时。

<details>
<summary>查看原文（47行）</summary>

```text
    function createArbiter(opts) {
        var current = INTENT.IDLE;
        var timer = null;
        var listeners = new Set();
        var active = {};

        var applyNow = () => {
            timer = null;
            var next = highestIntent(active, opts.ruleMeta);
            if (next !== current) {
                current = next;
                listeners.forEach((fn) => fn(next));
            }
        };
        return {
            get current() {
                return current;
            },
            // 感知层每次活跃集合变化时调用
            update(nextActive) {
                active = nextActive;
                var raw = highestIntent(active, opts.ruleMeta);
                if (raw === current) {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    return;
                }
                // 动态读 opts（设置保存后无需重建仲裁器即生效）
                var delay =
                    intentPriorityOf(raw, opts.ruleMeta) > intentPriorityOf(current, opts.ruleMeta)
                        ? opts.debounceMs
                        : opts.lingerMs;
                if (timer) clearTimeout(timer);
                timer = setTimeout(applyNow, delay);
            },
            subscribe(fn) {
                listeners.add(fn);
                return () => listeners.delete(fn);
            },
            dispose() {
                if (timer) clearTimeout(timer);
                timer = null;
                listeners.clear();
            },
        };
```

</details>

**依据 5 · 源码核查**：[src/client/activity.js:592-637](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/activity.js#L592-L637)

每会话聚合及可选过滤。

<details>
<summary>查看原文（46行）</summary>

```text
    function startActivitySensor(api, onState, opts) {
        var ctrl = new AbortController();
        var state = emptyIntentState();
        var sessionStates = new Map();
        var ruleStates = new Map();
        var mergeSessions = () => ({
            ...emptyIntentState(),
            active: Object.assign(
                Object.fromEntries(Object.entries(state.active).filter(([key]) => isRuleIntent(key))),
                ...Array.from(sessionStates.values(), (s) => s.active)
            ),
        });
        var reconnectTimer = null;
        var errorTimer = null;
        var disposed = false;
        // 规则状态（matchRules 纯函数维护：lastFired=冷却记账，
        // lastToolByStep=tool/result 的工具名配对表）+ 脉冲摘除定时器
        var ruleState = { lastFired: {}, lastToolByStep: {} };
        var ruleTimers = {};

        var publish = () => {
            if (!disposed) onState(state);
        };
        var clearError = () => {
            errorTimer = null;
            for (const s of sessionStates.values()) delete s.active[INTENT.ERROR];
            if (state.active[INTENT.ERROR]) {
                state = { ...state, active: { ...state.active } };
                delete state.active[INTENT.ERROR];
                publish();
            }
        };
        var handle = (raw) => {
            // 解包 RpcRequest：api.events 流 yield 的是 { rpcId, payload: Frame }，
            // 业务字段（type/sessionId/event）都在 payload 里。
            var frame = raw && raw.payload ? raw.payload : raw;
            if (!frame) return;
            if (frame.type === 'activity/reset') {
                sessionStates.delete(frame.sessionId);
                ruleStates.delete(frame.sessionId);
                state = mergeSessions();
                publish();
                return;
            }
            // 多会话感知范围过滤（scope=current 时只收当前会话帧）
            if (opts.filter && !opts.filter(frame)) return;
```

</details>

#### 缺口

- 多会话乱序、原生工具事件缺失时的提示准确率未知。
  **影响**：动画只能辅助扫视，不能承担审批或可靠状态职责。
  **进一步探讨**：用当前和其他会话分别发工具、审批和失败事件，核对动画与原生事件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主版本和自定义动作存储会怎样影响接入和退出？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

包补丁在 Host 装载资源和设置，Web 两代分别注入 settings.plugin.item 与 plugins.row.config。旧 Host 有 settings.register 时做 live base，新的版本依赖 loader 从静态 Config 派生命名空间。不同宿主不保证每个设置槽可用，overlay、设置和交互要分开确认。客户端产物有固定构建映射，本轮未比对实际上架包。

上传路径先要求方法、来源和文件名，通过文件数值上限、每次最多 64 MiB 与 512 MiB 总预算分配临时流。预留只在当前实例内累计，用独立随机文件名写入，最后硬链接保证同名不覆盖，清理临时文件。硬链接是否可用跟文件系统有关；文件可存并不证明浏览器可解码。作者说明卸载插件不会清理用户动作目录，所以可逆试用应先保留副本与能移除自定义资源的路径。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:58-84](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/package.json#L58-L84)

版本与 Web 客户端依赖声明。

<details>
<summary>查看原文（27行）</summary>

```text
  "dsh": {
    "compatibility": {
      "dsh": "^0.1.0-rc.6 || ^0.1.2-rc.1 || ^0.2.0-rc.2",
      "node": "^22.19.0 || >=24.0.0",
      "platform": "web",
      "externalCredentials": "optional"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1 || ^4.0.4",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6 || ^0.1.2-rc.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "^0.1.0-rc.6 || ^0.1.2-rc.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-host-webserver": "^0.1.0-rc.6 || ^0.1.2-rc.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6 || ^0.1.2-rc.1 || ^0.2.0-rc.2",
    "@deepseek-ai/schemastery": "^3.18.4",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:472-493](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L472-L493)

旧 Host 手动设置注册，新 Host 依靠 Config。

<details>
<summary>查看原文（22行）</summary>

```text
function apply(ctx, config) {
    // 资源层：初始化用户自定义动作目录（尽力而为，失败由扫描按空处理）
    mkdir(customActionsDir(), { recursive: true }).catch(() => {});
    // 设置命名空间注册。0.1.x：手动注册，patch 配置（size/position）作为 base 层
    // （优先级 = schema 默认 < patch < 用户设置）。0.2.0：register 已移除，命名空间
    // 由静态 Config + loader 条目 id 自动派生，此处跳过即可。
    if (ctx.settings && typeof ctx.settings.register === 'function') {
        ctx.settings.register(SETTINGS_NS, buildSettingsSchema(z), {
            applies: 'live',
            base:
                config && typeof config.size === 'number'
                    ? { size: config.size, position: config.position }
                    : undefined,
        });
    }
    // ctx.effect 包裹：插件卸载时自动注销路由（官方生命周期管理）
    ctx.effect(
        () =>
            ctx.webServer.register({
                kind: 'prefix', // 前缀路由：匹配 /whale-pet 及 /whale-pet/xxx
                path: ROUTE_PREFIX,
                handler: async (req, res) => {
```

</details>

**依据 3 · 源码核查**：[src/client/index.js:5550-5576](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/index.js#L5550-L5576)

两代不同设置槽。

<details>
<summary>查看原文（27行）</summary>

```text
            // 槽位 2a：0.1.x 官方"设置 → 插件"卡片（key = 设置命名空间）
            ctx.slots.inject('settings.plugin.item', function* () {
                yield ctx.slots.register(
                    {
                        name: 'settings.plugin.item',
                        key: SETTINGS_NS,
                        // keyed 槽按 priority 排序；order 仅用于 list 槽。
                        priority: 1000,
                    },
                    (ownerProps) =>
                        h(SettingsCard, { api, store, locale, customStore, ruleRuntime, ...ownerProps })
                );
            });
            // 槽位 2b：0.2.0 插件页"行配置"槽（key = <包名>#<行 id>）。summary 视图
            // 渲染一行简介，page 视图渲染完整表单（bare，去掉折叠外壳）。0.1.x 无此槽 → 不触发。
            ctx.slots.inject('plugins.row.config', function* () {
                yield ctx.slots.register(
                    {
                        name: 'plugins.row.config',
                        key: '@luweiyabo/dsh-whale-pet#whale-pet',
                    },
                    (ownerProps) =>
                        ownerProps && ownerProps.view === 'summary'
                            ? tStatic('desc')
                            : h(SettingsCard, {
                                  ...ownerProps,
                                  api,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:660-701](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L660-L701)

上传输入限制及进程级预算。

<details>
<summary>查看原文（42行）</summary>

```text
    // 自定义动作上传：同源 POST 原始文件体，最大 64 MiB；临时文件写完后原子落盘。
    const MAX_ACTION_UPLOAD_BYTES = 64 * 1024 * 1024;
    const MAX_ACTION_STORAGE_BYTES = 512 * 1024 * 1024;
    let reservedUploadBytes = 0;
    ctx.effect(
        () =>
            ctx.webServer.register({
                kind: 'exact',
                path: '/whale-pet/api/actions/upload',
                handler: async (req, res) => {
                    const send = (status, body) => {
                        res.writeHead(status, {
                            'content-type': 'application/json; charset=utf-8',
                            'cache-control': 'no-store',
                            'x-content-type-options': 'nosniff',
                        });
                        res.end(JSON.stringify(body));
                    };
                    if (req.method !== 'POST') {
                        res.setHeader('allow', 'POST');
                        send(405, { ok: false, error: 'method-not-allowed' });
                        return;
                    }
                    if (!isAllowedApiRequest(req)) {
                        send(403, { ok: false, error: 'forbidden' });
                        return;
                    }
                    const url = new URL(req.url ?? '/', 'http://localhost');
                    const action = validateCustomActionFileName(url.searchParams.get('name'));
                    if (!action) {
                        send(400, { ok: false, error: 'invalid-file-name' });
                        return;
                    }
                    const declared = Number(req.headers['content-length']);
                    const hasDeclaredSize = Number.isFinite(declared);
                    if (hasDeclaredSize && (declared <= 0 || declared > MAX_ACTION_UPLOAD_BYTES)) {
                        send(413, {
                            ok: false,
                            error: 'invalid-file-size',
                            maxBytes: MAX_ACTION_UPLOAD_BYTES,
                        });
                        return;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:704-755](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L704-L755)

临时写入、字节限制与排他发布。

<details>
<summary>查看原文（52行）</summary>

```text
                    await mkdir(dir, { recursive: true });
                    const target = join(dir, action.file);
                    // 快速拒绝常见的同名上传；最终 link 仍是并发竞态下的权威排他检查。
                    try {
                        await lstat(target);
                        send(409, { ok: false, error: 'file-exists' });
                        return;
                    } catch (error) {
                        if (error && error.code !== 'ENOENT') {
                            send(400, { ok: false, error: 'upload-failed' });
                            return;
                        }
                    }
                    const existingActions = await scanCustomActions(dir);
                    const storedBytes = existingActions.reduce((sum, item) => sum + item.size, 0);
                    const availableBytes = MAX_ACTION_STORAGE_BYTES - storedBytes - reservedUploadBytes;
                    if (availableBytes <= 0) {
                        send(413, {
                            ok: false,
                            error: 'storage-quota-exceeded',
                            maxStorageBytes: MAX_ACTION_STORAGE_BYTES,
                        });
                        return;
                    }
                    // 为本次请求预留其最多可写容量；并发上传不能共同越过总配额。
                    // 已声明长度的请求只预留其实际额度，并用同一上限阻止伪造小长度后超额写入。
                    const uploadBudget = Math.min(
                        MAX_ACTION_UPLOAD_BYTES,
                        availableBytes,
                        hasDeclaredSize ? declared : MAX_ACTION_UPLOAD_BYTES
                    );
                    reservedUploadBytes += uploadBudget;
                    const temp = join(dir, '.upload-' + randomUUID() + '.tmp');
                    let received = 0;
                    const limiter = new Transform({
                        transform(chunk, encoding, callback) {
                            received += chunk.length;
                            callback(received > uploadBudget ? new Error('upload-too-large') : null, chunk);
                        },
                    });
                    try {
                        await pipeline(req, limiter, createWriteStream(temp, { flags: 'wx' }));
                        if (received === 0) throw new Error('upload-empty');
                        // link 是排他提交：目标已存在时返回 EEXIST，不会像 rename 一样覆盖。
                        await link(temp, target);
                        await unlink(temp).catch(() => {});
                        actionsCache = { at: 0, data: null };
                        send(201, { ok: true, action: { ...action, size: received } });
                    } catch (error) {
                        await unlink(temp).catch(() => {});
                        if (error && error.code === 'EEXIST') {
                            send(409, { ok: false, error: 'file-exists' });
```

</details>

**依据 6 · 作者声明**：[README.md:280-285](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/README.md#L280-L285)

作者区分卸载与已上传数据清理。

````text

```sh
dsh plugin --profile web remove @luweiyabo/dsh-whale-pet
```

卸载后重新启动 `dsh web`。用户上传的动作保存在 `$DSH_HOME/whale-pet/actions/`，卸载插件不会自动删除这些文件。
````

#### 缺口

- 未验证多个宿主版本、Webview 解码及跨卸载资源状态。
  **影响**：初次只用随包动作可减少未知。
  **进一步探讨**：在隔离配置尝试一个小文件，核真实播放、冲突拒绝与卸载后目录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 余额气泡读取到哪里，能代替账单或共享环境权限吗？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

余额是可选功能。后端优先按当前配置中的 baseURL 识别已知 provider，有配置但未识别时返回 unsupported。它从 provider 的设置路径与预设名字生成凭据引用，走宿主 credentials，再退到环境引用。调用的是支持 provider 的指定 endpoint，单请求超时且拒绝跳转。缓存按 provider 和引用名索引；改了同一引用的值时，短期读数可能仍来自旧值。余额只是一次上游查询快照，包含余额形态和报错，不能等成该会话的实际消费。

路由判断 TCP 对端为回环、Host 字面量和 Origin 或 Fetch Metadata。该机制可阻挡部分浏览器跨站请求，能够从本机回环访问而不带 Origin 的客户端仍可过，代码没有附加用户级验证。局域网域名或代理部署可能被拒绝，也不能从浏览器源匹配推出账户信息对其他本机程序隔离。用于视觉状态时保持余额关闭，可单独判断动画价值。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:395-410](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L395-L410)

TCP peer、Host 和 Origin 实际判断，允许部分本机无 Origin 请求。

<details>
<summary>查看原文（16行）</summary>

```text
export function isAllowedApiRequest(req) {
    const headers = (req && req.headers) || {};
    const remoteAddress = req && req.socket && req.socket.remoteAddress;
    if (!isLoopbackRemoteAddress(remoteAddress)) return false;
    const site = headers['sec-fetch-site'];
    if (site === 'cross-site' || site === 'same-site') return false;
    const host = headers.host;
    if (typeof host !== 'string' || !isLoopbackOrIpLiteralHost(host)) return false;
    const origin = headers.origin;
    if (origin === undefined) return true; // 非浏览器客户端（Electron IPC / curl）
    try {
        return new URL(origin).host === host;
    } catch {
        return false;
    }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:850-903](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L850-L903)

模型路由确定 provider，并按宿主服务或环境解析引用。

<details>
<summary>查看原文（54行）</summary>

```text
    function resolveBalanceConfig(route, model) {
        if (typeof route !== 'string' || !route) return { unsupported: true, route: '', model };
        let profile;
        try {
            const llm = ctx.get('llm');
            const entry = llm && llm.listConfigurableProviders().find((item) => item.provider === route);
            if (entry) {
                profile = readSettingsValue(entry.settingsNs);
                for (const part of entry.settingsPath || []) profile = profile && profile[part];
            }
        } catch {
            /* route 名仍可用于内置服务商识别 */
        }

        const baseURL = profile && (profile.baseURL || profile.baseUrl);
        const byBaseURL = matchBalanceProviderBaseURL(baseURL);
        const providerId = byBaseURL || (!baseURL ? inferBalanceProviderFromRoute(route) : undefined);
        if (!providerId) return { unsupported: true, route, model };

        const provider = getBalanceProvider(providerId);
        const refs = [...provider.refs];
        if (profile && typeof profile.apiKeyEnv === 'string' && profile.apiKeyEnv.trim()) {
            refs.unshift(profile.apiKeyEnv.trim());
        } else {
            for (const ns of provider.settings) {
                try {
                    const cfg = readSettingsValue(ns);
                    if (cfg && typeof cfg.apiKeyEnv === 'string' && cfg.apiKeyEnv.trim()) {
                        refs.unshift(cfg.apiKeyEnv.trim());
                        break;
                    }
                } catch {
                    /* 尝试下一个命名空间 */
                }
            }
        }
        return { ...provider, refs, route, model };
    }

    async function resolveApiKey(refs) {
        const credentials = ctx.get('credentials');
        for (const ref of refs) {
            if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(ref)) continue;
            if (credentials) {
                try {
                    const hit = await credentials.resolve(ref);
                    if (hit && hit.value) return hit.value;
                } catch {
                    /* 回落环境变量 */
                }
            }
            if (process.env[ref]) return process.env[ref];
        }
        return undefined;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:939-974](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L939-L974)

仅支持已知映射，缓存以引用名计，向固定端点发送。

<details>
<summary>查看原文（36行）</summary>

```text
                        const url = new URL(req.url ?? '/', 'http://localhost');
                        const route = url.searchParams.get('route') || '';
                        const model = url.searchParams.get('model') || '';
                        const provider = resolveBalanceConfig(route, model);
                        if (provider.unsupported) {
                            send({
                                ok: false,
                                unsupported: true,
                                route,
                                model,
                                error: '当前模型服务商不支持官方余额查询',
                            });
                            return;
                        }
                        const cacheKey = provider.id + ':' + provider.refs.join('|');
                        const cached = balanceCache.get(cacheKey);
                        if (cached && now - cached.at < BALANCE_CACHE_MS) {
                            send(cached.data);
                            return;
                        }
                        const key = await resolveApiKey(provider.refs);
                        if (!key) {
                            send({
                                ok: false,
                                provider: provider.id,
                                route,
                                model,
                                error: provider.label + ' API key 未配置',
                            });
                            return;
                        }
                        const r = await fetch(provider.endpoint, {
                            headers: { Authorization: 'Bearer ' + key },
                            redirect: 'error',
                            signal: AbortSignal.timeout(8000),
                        });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:975-995](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L975-L995)

响应解析与余额返回。

<details>
<summary>查看原文（21行）</summary>

```text
                        const body = await r.json();
                        const balances = parseProviderBalances(provider.id, body);
                        const upstreamError =
                            body && typeof body === 'object' ? body.error || body.message : undefined;
                        const data = {
                            ok: r.ok && balances.length > 0,
                            provider: provider.id,
                            providerLabel: provider.label,
                            balances,
                            // 保留单余额字段，兼容旧版客户端。
                            balance: balances[0] || null,
                            error: upstreamError
                                ? String(upstreamError.message || upstreamError)
                                : r.ok && balances.length === 0
                                  ? provider.label + ' 余额响应格式无效'
                                  : undefined,
                        };
                        balanceCache.set(cacheKey, { at: now, data });
                        send(data);
                    } catch (e) {
                        send({ ok: false, error: String((e && e.message) || e) });
```

</details>

#### 缺口

- 首次宿主实际暴露的 Socket、代理路径、凭据解析及供应商成功率未知。
  **影响**：共享宿主上不应依赖气泡保护或归因账目。
  **进一步探讨**：先用隔离本地模拟 provider 及赝造值观测拒绝、流向与缓存，真实余额后独立授权验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么结果能证明桌宠值得保留，什么时候该关闭？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

已在本机使用 DSH Web 并乐于保留视觉提示的人，可以在新的本机隔离 profile 关闭客户端余额气泡，只用随包动画并跳过自定义动作上传。宿主仍会注册上传路由，满足请求守卫和参数检查时仍可调用。试用时挑工作、等待人工、完成和出错四类事件备忘。基线只看宿主状态和审批按钮，比较看过提示后选择正确会话和正确动作的比例，以及反应时间。若用户将装饰性反馈误认成任务完成、浮层妨碍点击或多标签播放明显增加资源占用，就关闭动画或卸载，回原生提示。

假设在窗口占用较大而用户未展开消息时，角落提示能降低漏看审批。效果须同时考察干扰和误判，报告每类事件、漏看、复核及重新配置耗时。资源包括媒体传输、解码、通信与多标签行为，现金与人时未测。余额开关控制客户端是否显示气泡及轮询。它也不改变宿主上传和余额路由的注册。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/activity.js:139-177](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/activity.js#L139-L177)

审批及工具错误可以作为各自已知样本。

<details>
<summary>查看原文（39行）</summary>

```text
            var ev = frame.event || {};
            var d = ev.data || {};
            if (ev.type === 'approval/asked') {
                touch(INTENT.WAITING_USER);
                return next;
            }
            if (ev.type === 'approval/decided') {
                clear(INTENT.WAITING_USER);
                return next;
            }
            if (ev.type === 'tool/call') {
                clear(INTENT.LISTENING);
                // 模型请求工具：分类意图 + 按 turn:step 记账（tool/result 无工具名，靠此配对）
                var ti = TOOL_INTENTS[d.name] || null;
                touch(INTENT.WORKING);
                if (ti) {
                    touch(ti);
                    next.toolCounts[ti] = (next.toolCounts[ti] || 0) + 1;
                }
                var stepKey = toolKey(d);
                next.stepTools = {
                    ...next.stepTools,
                    [stepKey]: [...(next.stepTools[stepKey] || []), ti],
                };
                return next;
            }
            if (ev.type === 'tool/result') {
                if (d.error || d.message?.content?.[0]?.isError) touch(INTENT.ERROR);
                // 消退该 turn:step 最近一次调用的工具意图
                var key = toolKey(d);
                var arr = next.stepTools[key];
                if (arr && arr.length) {
                    next.stepTools = { ...next.stepTools, [key]: arr.slice(0, -1) };
                    var done = arr[arr.length - 1];
                    if (done) {
                        next.toolCounts[done] = (next.toolCounts[done] || 1) - 1;
                        if (next.toolCounts[done] <= 0) {
                            delete next.toolCounts[done];
                            clear(done);
```

</details>

**依据 2 · 源码核查**：[src/client/activity.js:546-567](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/activity.js#L546-L567)

仲裁延时必须计入反应时间。

<details>
<summary>查看原文（22行）</summary>

```text
        return {
            get current() {
                return current;
            },
            // 感知层每次活跃集合变化时调用
            update(nextActive) {
                active = nextActive;
                var raw = highestIntent(active, opts.ruleMeta);
                if (raw === current) {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    return;
                }
                // 动态读 opts（设置保存后无需重建仲裁器即生效）
                var delay =
                    intentPriorityOf(raw, opts.ruleMeta) > intentPriorityOf(current, opts.ruleMeta)
                        ? opts.debounceMs
                        : opts.lingerMs;
                if (timer) clearTimeout(timer);
                timer = setTimeout(applyNow, delay);
```

</details>

**依据 3 · 作者声明**：[README.md:280-285](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/README.md#L280-L285)

卸载及持久资源退出边界。

````text

```sh
dsh plugin --profile web remove @luweiyabo/dsh-whale-pet
```

卸载后重新启动 `dsh web`。用户上传的动作保存在 `$DSH_HOME/whale-pet/actions/`，卸载插件不会自动删除这些文件。
````

**依据 4 · 源码核查**：[lib/index.js:664-691](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/lib/index.js#L664-L691)

Host 无条件注册上传路由，随后验证方法、请求源和文件名；试用不操作上传并不改变注册。

<details>
<summary>查看原文（28行）</summary>

```text
    ctx.effect(
        () =>
            ctx.webServer.register({
                kind: 'exact',
                path: '/whale-pet/api/actions/upload',
                handler: async (req, res) => {
                    const send = (status, body) => {
                        res.writeHead(status, {
                            'content-type': 'application/json; charset=utf-8',
                            'cache-control': 'no-store',
                            'x-content-type-options': 'nosniff',
                        });
                        res.end(JSON.stringify(body));
                    };
                    if (req.method !== 'POST') {
                        res.setHeader('allow', 'POST');
                        send(405, { ok: false, error: 'method-not-allowed' });
                        return;
                    }
                    if (!isAllowedApiRequest(req)) {
                        send(403, { ok: false, error: 'forbidden' });
                        return;
                    }
                    const url = new URL(req.url ?? '/', 'http://localhost');
                    const action = validateCustomActionFileName(url.searchParams.get('name'));
                    if (!action) {
                        send(400, { ok: false, error: 'invalid-file-name' });
                        return;
```

</details>

**依据 5 · 源码核查**：[src/client/index.js:1733-1761](https://github.com/luweiyabo/dsh-whale-pet/blob/0bc1bc42a3e89b9bfa157a3f7ef429380ddafcee/src/client/index.js#L1733-L1761)

客户端 meter 关闭会清除气泡并提前返回，开启时才发起此处的周期拉取。

<details>
<summary>查看原文（29行）</summary>

```text
            // ---- 额度气泡常驻：meter 开启时显示常驻气泡并拉取余额；关闭时清除 ----
            useEffect(() => {
                if (!cfg || !isLeader) return;
                if (cfg.meter === false) {
                    // meter 关闭：清除常驻额度气泡（不影响临时文字气泡）
                    setBubble((b) => (b && b.sticky ? null : b));
                    return;
                }
                // 开启时展示当前已识别模型的余额。尚无模型时不再干等首次模型调用：
                // 只要存在当前会话且 session.models 可用，就直接解析其模型选择并
                // 拉余额（见下方"余额模型预取"effect），此处仅显示 loading 态；
                // 确实无法解析（无会话/无接口）才显示"等待模型调用"。
                if (!currentModelRef.current.route) {
                    var canResolve =
                        !!currentSessionRef.current &&
                        !!(api && api.sessions && typeof api.sessions.models === 'function');
                    meterBalanceRef.current = {
                        at: 0,
                        status: canResolve ? 'loading' : 'waiting',
                        providerLabel: null,
                        balances: null,
                    };
                }
                showMeterBubble();
                refreshBalance();
                // 也同步外部产生的消费；服务端仍有 30 秒缓存与限流保护。
                var balanceTimer = setInterval(refreshBalance, 31000);
                return () => clearInterval(balanceTimer);
            }, [cfg && cfg.meter, isLeader]);
```

</details>

#### 缺口

- 没有真实漏看率、CPU 或输入操作影响的对照。
  **影响**：只有采用条件，没有证实收益。
  **进一步探讨**：用短的同一会话序列重复原生与桌宠基线，并记录电量、帧和误判。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
