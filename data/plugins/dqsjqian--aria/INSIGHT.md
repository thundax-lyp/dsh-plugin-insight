# Aria

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[778c3d2](https://github.com/dqsjqian/Aria/tree/778c3d2b12ddfb111135f8f52054564fb0dae306)

<!-- BEGIN META -->
[![GitHub ★ 131](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=131&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dqsjqian/Aria)
<!-- END META -->

> **功能**：提供响应式状态、异步和跨平台 UI 绑定的 C++ MVVM 框架。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 组合 C++ 状态与适配器，Web SDK 给出类型边界；与 DSH 插件不同。

> **主要限制**：[Q03](#research-q03) 多端线程、网络鉴权和生命周期不能由局部客户端代码证明。

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
  - [Q01 · 跨平台 C++ 界面开发者相对各端独立实现获得什么？](#detail-section-11)
  - [Q02 · 绑定和 Web 客户端如何交换状态？](#detail-section-12)
  - [Q03 · 网络与并发边界需要什么核验？](#detail-section-13)
  - [Q04 · 采用者要承担哪些工具链与长期维护成本？](#detail-section-14)
  - [Q05 · 如何让重连后状态新鲜度更容易判断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望共享 C++ 状态和 ViewModel 的跨平台 UI 开发者。

各平台原生 UI 状态与绑定方案。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 绑定引擎 | 连接状态与视图 | 平台与线程需验证 |
| Web SDK | SSE 状态与 HTTP 动作 | 服务端安全未审计 |
| 数值处理 | 保留 64 位整数精度 | 调用方需正确处理 BigInt |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| C++23 编译器与构建工具 | 编译需要 | 生成应用 | 构建失败 |
| 对应平台 SDK | 平台接入需要 | 原生 UI | 对应平台不可用 |
| HTTP 服务与浏览器 | Web 适配器需要 | 状态同步 | Web 不可用 |
| 部署的权限与网络策略 | 网络部署需要 | 保护服务 | 风险未受控 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 开发者选择目标工具链 | 版本及依赖兼容 |
| 绑定 | 连接 ViewModel 和适配器 | 验证数据流 |
| 部署 | 配置各平台和网络 | 检查权限与线程 |
| 测试 | 在目标设备验证 | 不符合时回退原生方案 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | C++23 与平台 SDK | 学习与接线 | 编译兼容未知 |
| 持续 | 多端构建与服务 | 升级与线程审查 | 实际维护成本未知 |
| 故障 | 平台诊断环境 | 回滚、修复或重编译 | 恢复效果未测 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 共享绑定接口 | C++ 声明与 README | 多端真实运行 |
| Web 状态协议 | SSE 和 POST 客户端 | 服务端与安全性 |
| 精确 64 位转换 | JS 类型检查 | 跨端完整行为 |

> **思考**：[Q03](#research-q03) 多端线程、网络鉴权和生命周期不能由局部客户端代码证明。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 组合 C++ 状态与适配器，Web SDK 给出类型边界；与 DSH 插件不同。

[Q02](#research-q02) 的 Web SDK 区分不安全数值和字符串；[Q03](#research-q03) 的服务端及跨线程仍需核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 多端线程、网络鉴权和生命周期不能由局部客户端代码证明。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在单一目标平台验证工具链、线程和回滚；不能满足平台或安全条件时保留原生方案。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本局部静态检查；未构建运行或验证 DSH 集成。

- 已检查：作者 README、包清单、源码路径 README.md、modules/binding/include/aria/binding/binding_engine.hpp、modules/adapters/http/web-sdk/aria_client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、绑定接口与 Web 客户端片段；未穷尽全部平台适配器、服务端安全及应用示例。
- 下一步：隔离环境编译目标平台并测试绑定、断线与认证；本轮未执行。

**分析版本**

- **仓库**：[dqsjqian/Aria](https://github.com/dqsjqian/Aria)
- **版本号**：未声明（[固定提交 778c3d2](https://github.com/dqsjqian/Aria/tree/778c3d2b12ddfb111135f8f52054564fb0dae306)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 检查重连状态标记是否补充现有协议，并通过故障实验判断。

隔离环境编译目标平台并测试绑定、断线与认证；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 47 | 12265 | — | — | 76143 |
| .js | source | 1 | 316 | 224 | 65 | — |
| .mjs | source | 1 | 437 | 411 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dqsjqian/Aria/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/dqsjqian/Aria/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dqsjqian/Aria/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查跨平台绑定、Web SDK 与部署条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨平台 C++ 界面开发者相对各端独立实现获得什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Aria 是 C++ MVVM 框架，作者希望共享业务 ViewModel，同时通过不同适配器连接原生界面；各平台直接实现状态逻辑也是替代方案。仓库描述 C++23、绑定与 HTTP 客户端，但不是 DSH 插件或 Agent 运行时；通用项目目录中的收录不能证明 DSH 集成。跨端工作量和正确性尚未按实际应用对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-11](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/README.md#L3-L11)

项目与平台定位。

```text
# ⚡ Aria

[依赖更新完整指南](docs/dependency-updates.zh.md) — 版本固定、选择性更新、离线、回退与提交步骤。

**为工业级跨平台软件而生的现代 C++ MVVM 框架** · C++23 · 响应式 · 协程优先

一套 C++ 核心，六大平台。以优雅架构承载复杂业务，以工程契约支撑长期演进。

Windows / macOS / Linux / iOS / Android / Web
```

**依据 2 · 作者声明**：[README.md:37-64](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/README.md#L37-L64)

ViewModel 和适配器的作者说明。

<details>
<summary>查看原文（28行）</summary>

````text
## 🚀 30 秒看懂 Aria

Aria 把一个界面切成两半：**ViewModel** 是纯 C++，不认识任何 UI 库；**View** 是各平台原生控件。
中间由 `BindingEngine` 连接，它只认 `IViewAdapter` 这个接口，所以换平台只换适配器。

**上半 —— ViewModel（纯 C++，可单元测试，所有平台共用这一份）**

```cpp
// AA 制账单：总额 ÷ 人数 = 每人多少
struct BillViewModel {
    aria::Property<double> bill{100.0};   // 可读写的状态
    aria::Property<int>    people{2};

    // Computed 是只读派生值。它的依赖不用手写：首次求值时读到了
    // bill 和 people，就自动记下这两个依赖。
    aria::Computed<double> per_person{[this] {
        return bill.get() / people.get();
    }};
};
```

这段代码里没有一行 UI，也没有 `#include` 任何界面库 —— 它在命令行下就能测。

**下半 —— View 侧接线（每个平台十几行，界面本身仍用各平台原生方式写）**

先说清最容易误会的一点：**界面不用 C++ 写。** 按钮、布局、动画照旧用 Qt Designer、
Storyboard、Compose、HTML 写。下面这十几行只是"把已经存在的控件交给 engine"的接线代码，
三步永远一样 —— ① 造平台适配器 ② 用它造 `BindingEngine` ③ 把控件和 Property 绑上。
````

</details>

**依据 3 · 作者声明**：[README.md:194-211](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/README.md#L194-L211)

跨端与 ABI 前提。

<details>
<summary>查看原文（18行）</summary>

```text
## 🎯 设计理念与工程实力

Aria 将**响应式状态、异步协程与跨端绑定统一为独立于 UI 工具包的现代 C++ 架构**，让复杂业务只实现一次，让各端界面充分发挥原生能力。

优雅来自清晰的分工：ViewModel 是普通 C++ 类，无需继承框架基类、编写宏或运行代码生成器；
UI 通过 `IViewAdapter` 接入。Qt6 / AppKit / UIKit / JNI / HTTP 五个适配器共享同一套绑定协议，切换 UI 工具包无需改写 ViewModel。

**以世界级工业软件的工程标准打造 C++ 框架**：把生命周期、线程、错误处理与集合事件写成可追踪的[工程契约](docs/index.md#reference)，用自动化测试、模糊测试和可复现的[性能基准](docs/reference/performance.md)检验实现。架构之美，落实到每一次状态更新、异步取消与跨端交付。

| 架构优势 | 工程设计 |
|---|---|
| **现代 C++ 基础** | C++23 基线（GCC 16+ / Clang 23+ / Xcode 27+ 的 AppleClang / MSVC v145，即 Visual Studio 2026），使用完整的协程与 concepts 能力；集成项目需采用 C++23 或更高标准。 |
| **原生 UI 自由** | 控件、布局和动画交给所选 UI 工具包，Aria 统一状态与界面之间的单向/双向数据流；共享业务核心，各端保留原生体验。 |
| **分层兼容策略** | `aria-abi` / `aria-runtime` / `aria-binding` 在主版本号内保持 ABI 稳定，要求编译器、标准库与构建选项一致；`Property<T>` 等模板及其宿主类型更新后需重新编译。 |
| **开放适配协议** | Qt6 / AppKit / UIKit / JNI / HTTP 开箱可用；其他 UI 工具包通过实现 `IViewAdapter` 接入（见[适配器指南](docs/guide/adapters/)）。 |
| **应用实践与开发资料** | AriaTools、AriaAgent 与 AriaRead 展示跨端工作台、Agent GUI 和阅读引擎中的应用实践；[指南](docs/index.md)、[Cookbook](docs/cookbook/README.md) 与工程契约覆盖从入门到扩展的开发路径。 |

**为共享 C++ 业务核心、原生多端 UI 和长期维护而设计。** Aria 负责业务与状态层，控件渲染与界面复用由所选 UI 工具包负责；两层通过明确的适配协议协作。
```

</details>

#### 缺口

- 未比较真实多端实现和成本
  **影响**：无法证明开发效率或跨端兼容
  **进一步探讨**：以同一应用对照原生实现、共享比例和维护成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 绑定和 Web 客户端如何交换状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

BindingEngine 通过 IViewAdapter 提供绑定和可选 dispatcher；Web SDK 使用 EventSource 等待 hello，并为状态订阅提供缓存和回调，写状态或点击经 HTTP POST。SDK 针对 int64/uint64 拒绝不安全 Number，改用精确 decimal string/BigInt。代码说明局部协议，不代表各平台适配器和完整应用行为均已验证。

#### 证据与依据

**依据 1 · 源码核查**：[modules/binding/include/aria/binding/binding_engine.hpp:105-118](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/binding/include/aria/binding/binding_engine.hpp#L105-L118)

绑定引擎与调度配置。

<details>
<summary>查看原文（14行）</summary>

```text
    /// Binding dispatch policy — see the class header for semantics.
    enum class DispatchPolicy {
        Direct,        ///< call inline (default)
        SmartMarshal,  ///< inline iff dispatcher.is_main_thread()
        AlwaysPost,    ///< always post, even from the UI thread
    };

    /// Convenience constructor: no dispatcher, Direct policy.
    explicit BindingEngine(std::shared_ptr<IViewAdapter> adapter);

    /// Constructor that opts into a dispatch policy.
    /// `ui_dispatcher` may be null only when `policy == Direct`.
    BindingEngine(std::shared_ptr<IViewAdapter> adapter,
                  std::shared_ptr<runtime::IDispatcher> ui_dispatcher,
```

</details>

**依据 2 · 源码核查**：[modules/binding/include/aria/binding/binding_engine.hpp:153-168](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/binding/include/aria/binding/binding_engine.hpp#L153-L168)

只读及双向文本绑定入口。

<details>
<summary>查看原文（16行）</summary>

```text
    //   value has no write-back path, so `bind_text(some_computed, view)`
    //   must remain a **compile error** rather than a silently dropped
    //   edit.
    // ══════════════════════════════════════════════════════════════════

    // ══════════════════════════════════════════════════════════════════
    //   Text
    // ══════════════════════════════════════════════════════════════════
    void bind_text_oneway(Property<std::string>& prop, IView& view);

    template<ReadOnlyReactiveOf<std::string> Src>
    void bind_text_oneway(Src& src, IView& view) {
        bind_scalar_oneway_<std::string>(src, view, &IViewAdapter::set_text);
    }

    void bind_text(Property<std::string>& prop, IView& view);
```

</details>

**依据 3 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:22-51](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L22-L51)

64 位整数验证和解码。

<details>
<summary>查看原文（30行）</summary>

```text
// Never convert an unsafe Number to BigInt: precision was already lost
// before this SDK received it. Decimal strings carry the exact wire value.
function integer64(field, value) {
    if (typeof value === 'number') {
        if (!Number.isSafeInteger(value)) {
            throw new RangeError(`${field} requires a safe integer Number, bigint or decimal string`);
        }
    } else if (typeof value === 'string') {
        const decimal = field === 'uint64' ? /^\d+$/ : /^-?\d+$/;
        if (!decimal.test(value) || value.trim() !== value) {
            throw new TypeError(`${field} requires a decimal integer string`);
        }
    } else if (typeof value !== 'bigint') {
        throw new TypeError(`${field} requires a safe integer Number, bigint or decimal string`);
    }
    const integer = BigInt(value);
    const min = field === 'uint64' ? 0n : INT64_MIN;
    const max = field === 'uint64' ? UINT64_MAX : INT64_MAX;
    if (integer < min || integer > max) throw new RangeError(`${field} value is out of range`);
    return integer;
}

function decodeValue(field, value) {
    // Registered but unset views publish null, including after replacement.
    // Preserve it so a snapshot can clear a previously cached integer.
    if (value === null) return null;
    if (field !== 'int64' && field !== 'uint64') return value;
    const integer = integer64(field, value);
    return integer >= -MAX_SAFE_INTEGER && integer <= MAX_SAFE_INTEGER
        ? Number(integer) : integer;
```

</details>

**依据 4 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:79-132](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L79-L132)

SSE 连接和错误。

<details>
<summary>查看原文（54行）</summary>

```text
    /**
     * Open the SSE stream. Resolves when the server's "hello" frame
     * arrives, or rejects on error/close. Concurrent calls share one
     * promise. After a transient error, EventSource reconnects itself;
     * connect() can wait for its next hello without opening another stream.
     */
    connect() {
        if (this._connected) return Promise.resolve();
        if (this._connectAttempt) return this._connectAttempt.promise;

        const attempt = {};
        attempt.promise = new Promise((resolve, reject) => {
            attempt.resolve = resolve;
            attempt.reject = reject;
        });
        this._connectAttempt = attempt;
        if (this._es) return attempt.promise;

        let es;
        try {
            es = new EventSource(this.baseUrl + this.apiPrefix + '/stream');
        } catch (error) {
            this._settleConnect(error);
            return attempt.promise;
        }
        this._es = es;
        es.onmessage = (msg) => {
            if (this._es !== es) return; // a closed/replaced stream's queued callback
            try {
                const env = JSON.parse(msg.data);
                if (env.type === 'hello') {
                    const opened = !this._connected;
                    this._connected = true;
                    this._settleConnect(); // user callbacks cannot prevent settlement
                    if (opened) this._notify(this._onOpen);
                } else {
                    this._dispatch(env);
                }
            } catch (error) {
                console.error('[aria] bad SSE frame:', msg.data, error);
            }
        };
        es.onerror = (event) => {
            if (this._es !== es) return;
            this._connected = false;
            if (es.readyState === EventSource.CLOSED) {
                this._es = null; // terminal failures require a fresh stream
                es.close();
            }
            this._settleConnect(event instanceof Error
                ? event : new Error('Aria SSE connection failed'));
            this._notify(this._onError, event);
        };
        return attempt.promise;
```

</details>

**依据 5 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:180-205](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L180-L205)

状态与命令 POST。

<details>
<summary>查看原文（26行）</summary>

```text
    // ── Outbound (client → server) ──────────────────────────────────────

    setText(viewId, value)   { return this._postState(viewId, 'text',   value); }
    setBool(viewId, value)   { return this._postState(viewId, 'bool',   value); }
    setInt(viewId, value)    { return this._postState(viewId, 'int',    value); }
    setInt64(viewId, value)  { return this._postState(viewId, 'int64',  value); }
    setUInt64(viewId, value) { return this._postState(viewId, 'uint64', value); }
    setFloat(viewId, value)  { return this._postState(viewId, 'float',  value); }
    setDouble(viewId, value) { return this._postState(viewId, 'double', value); }

    /** Fire a click event on a view. */
    click(viewId) {
        return this._fetchJson('/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ view: viewId }),
        });
    }

    /** Invoke a custom command. */
    command(viewId, commandName, args = {}) {
        return this._fetchJson('/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ view: viewId, command: commandName, args }),
        });
```

</details>

#### 缺口

- 未运行框架、服务器或任何平台
  **影响**：不能保证状态同步、线程安全和端到端兼容
  **进一步探讨**：在隔离服务测试断线重连、类型边界和真实平台 UI。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网络与并发边界需要什么核验？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Web SDK 的 EventSource URL 与 fetch 使用调用者给定 baseUrl，样例展示明文 localhost；本次客户端代码片段没有证明服务端鉴权、跨域和外网访问安全，不能由 SDK 无认证参数断言整个服务没有鉴权。绑定引擎的 dispatcher 选项不等同所有状态图跨线程安全；应按服务端配置和平台线程契约验证。

#### 证据与依据

**依据 1 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:54-62](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L54-L62)

base URL 与前缀。

```text
export class AriaClient {
    /**
     * @param {string} baseUrl  e.g. "http://localhost:9090"
     * @param {object} [opts]
     * @param {string} [opts.apiPrefix="/aria"]  Match server config.api_prefix
     */
    constructor(baseUrl, opts = {}) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.apiPrefix = opts.apiPrefix || '/aria';
```

**依据 2 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:97-100](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L97-L100)

事件流地址。

```text
        let es;
        try {
            es = new EventSource(this.baseUrl + this.apiPrefix + '/stream');
        } catch (error) {
```

**依据 3 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:236-255](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L236-L255)

请求和状态写入。

<details>
<summary>查看原文（20行）</summary>

```text
    async _fetchJson(path, options) {
        const response = await fetch(this.baseUrl + this.apiPrefix + path, options);
        if (!response.ok) {
            let detail = '';
            try { detail = (await response.text()).trim(); } catch { /* status still available */ }
            throw new Error(`Aria HTTP ${response.status} ${path}${detail ? ': ' + detail : ''}`);
        }
        return response.json();
    }

    async _postState(viewId, field, value) {
        if (field === 'int64' || field === 'uint64') {
            const integer = integer64(field, value);
            value = integer >= -MAX_SAFE_INTEGER && integer <= MAX_SAFE_INTEGER
                ? Number(integer) : integer.toString();
        }
        return this._fetchJson('/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ view: viewId, field, value }),
```

</details>

**依据 4 · 源码核查**：[modules/binding/include/aria/binding/binding_engine.hpp:55-89](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/binding/include/aria/binding/binding_engine.hpp#L55-L89)

作者写在接口处的线程与调度边界。

<details>
<summary>查看原文（35行）</summary>

```text
/// ── Threading / binding dispatch policy ──────────────────────────────
///   Native UI toolkits are main-thread-affine: AppKit/UIKit explicitly
///   forbid touching `NS/UIView` from a background thread, and Qt requires
///   widget access on the GUI thread. Aria's reactive graph is itself
///   single-threaded. BindingEngine accepts an optional dispatcher for
///   that owning thread and a policy applied in both binding directions.
///   In particular, adapters such as HTTP may deliver input from workers;
///   marshalling keeps those callbacks from accessing the graph there.
///   Application Property writes must still respect graph affinity.
///
///     * `DispatchPolicy::Direct` (default) — every
///       callback is invoked synchronously on its originating thread.
///       Use when every Property write and adapter callback originates
///       on the graph/UI thread (the common single-threaded MVVM case).
///
///     * `DispatchPolicy::SmartMarshal` (recommended for production) —
///       VM→View setters, View→VM edits and commands are invoked
///       directly when `dispatcher.is_main_thread()` is true, otherwise
///       posted to the dispatcher. Zero overhead on the UI thread, and
///       a guaranteed thread-correct path on background threads.
///
///     * `DispatchPolicy::AlwaysPost` — every binding update is posted,
///       even from the UI thread. Useful for tests that want a
///       deterministic "property-emit happens before, view-update
///       happens later" ordering, or to coalesce a synchronous burst
///       of writes into the next event-loop iteration.
///
///   Initial synchronization during bind runs inline on the owning
///   thread. Synchronous setter echoes are suppressed before posting.
///   Binding setup, clear and view/engine destruction also belong on
///   the owning thread; the dispatcher does not make the graph or the
///   binding registry safe for concurrent access.
///
///   Posted callbacks in both directions use a per-view lifetime token:
///   if the view is destroyed between `dispatcher.post(fn)` and
```

</details>

#### 缺口

- 服务端鉴权、TLS 和生命周期未审计
  **影响**：不能判断公开网络风险和并发安全
  **进一步探讨**：检查固定版本 HTTP 路由与部署，在隔离环境测试认证和线程。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用者要承担哪些工具链与长期维护成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要 C++23 工具链、所用 UI 平台 SDK 和各端绑定；作者称 ABI 稳定有编译器、标准库与构建选项前提，模板更新需重编译。Web 使用 HTTP/SSE 服务还需要管理部署、网络安全与恢复。先在单一平台用可丢弃样例核对绑定与许可，不能满足工具链或安全约束时保留原生实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:194-211](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/README.md#L194-L211)

架构与 ABI、编译条件。

<details>
<summary>查看原文（18行）</summary>

```text
## 🎯 设计理念与工程实力

Aria 将**响应式状态、异步协程与跨端绑定统一为独立于 UI 工具包的现代 C++ 架构**，让复杂业务只实现一次，让各端界面充分发挥原生能力。

优雅来自清晰的分工：ViewModel 是普通 C++ 类，无需继承框架基类、编写宏或运行代码生成器；
UI 通过 `IViewAdapter` 接入。Qt6 / AppKit / UIKit / JNI / HTTP 五个适配器共享同一套绑定协议，切换 UI 工具包无需改写 ViewModel。

**以世界级工业软件的工程标准打造 C++ 框架**：把生命周期、线程、错误处理与集合事件写成可追踪的[工程契约](docs/index.md#reference)，用自动化测试、模糊测试和可复现的[性能基准](docs/reference/performance.md)检验实现。架构之美，落实到每一次状态更新、异步取消与跨端交付。

| 架构优势 | 工程设计 |
|---|---|
| **现代 C++ 基础** | C++23 基线（GCC 16+ / Clang 23+ / Xcode 27+ 的 AppleClang / MSVC v145，即 Visual Studio 2026），使用完整的协程与 concepts 能力；集成项目需采用 C++23 或更高标准。 |
| **原生 UI 自由** | 控件、布局和动画交给所选 UI 工具包，Aria 统一状态与界面之间的单向/双向数据流；共享业务核心，各端保留原生体验。 |
| **分层兼容策略** | `aria-abi` / `aria-runtime` / `aria-binding` 在主版本号内保持 ABI 稳定，要求编译器、标准库与构建选项一致；`Property<T>` 等模板及其宿主类型更新后需重新编译。 |
| **开放适配协议** | Qt6 / AppKit / UIKit / JNI / HTTP 开箱可用；其他 UI 工具包通过实现 `IViewAdapter` 接入（见[适配器指南](docs/guide/adapters/)）。 |
| **应用实践与开发资料** | AriaTools、AriaAgent 与 AriaRead 展示跨端工作台、Agent GUI 和阅读引擎中的应用实践；[指南](docs/index.md)、[Cookbook](docs/cookbook/README.md) 与工程契约覆盖从入门到扩展的开发路径。 |

**为共享 C++ 业务核心、原生多端 UI 和长期维护而设计。** Aria 负责业务与状态层，控件渲染与界面复用由所选 UI 工具包负责；两层通过明确的适配协议协作。
```

</details>

**依据 2 · 作者声明**：[README.md:292-308](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/README.md#L292-L308)

构建工具及移动平台条件。

<details>
<summary>查看原文（17行）</summary>

````text
python -m forgedeps init /path/to/shared-dependencies
cmake -B build/flavors/release -DCMAKE_BUILD_TYPE=Release
cmake --build build/flavors/release -j
ctest --test-dir build/flavors/release --output-on-failure
```

> `build/` 是构建树的**容器**，不要直接配置进它。布局约定见 [`CMakeLists.txt`](CMakeLists.txt) 顶部的 build-tree guard。

### 跨平台统一入口

依赖构建由 ForgeDeps 共享工作区和外部 ForgeRecipes 配方统一管理。安装 `requirements-build.txt` 后运行 `python -m forgedeps init /path/to/deps`；使用 `scripts/build.py` 时，配置、编译与测试全程持有依赖图读取租约。详见 [依赖文档](docs/dependencies.md)。

`python scripts/build.py --test` 统一配置、编译和本机 CTest；`--platform qt|web|ios|android` 选择适配器，`--dry-run` 输出完整计划且不写磁盘。默认按平台、工具链、配置和架构隔离目录；`--build-dir` 可显式复用现有缓存，`--offline` 复用已验证依赖。

macOS 的 `--arch x86_64` / `--arch arm64` 选择实际目标架构；Visual Studio 使用 `--generator-platform x64`（或 `ARM64`）。额外定义使用 `--cmake-arg=-DNAME[:TYPE]=VALUE`，不能覆盖入口选择的构建配置和工具链。入口在获取依赖前检查已有缓存的编译器、工具链和架构，冲突时保留原目录并要求另选构建目录。

Android 需 `--ndk`；iOS 需 macOS/Xcode。移动端执行测试仍使用现有模拟器/设备脚本，统一入口不会把交叉编译冒充运行通过。Windows 默认 MSVC，显式 `--toolchain mingw` 使用独立缓存；使用 Ninja/MSVC 时先打开 Developer PowerShell。原有打包脚本仍负责 SDK 安装与归档。
````

</details>

**依据 3 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:79-103](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L79-L103)

客户端连接。

<details>
<summary>查看原文（25行）</summary>

```text
    /**
     * Open the SSE stream. Resolves when the server's "hello" frame
     * arrives, or rejects on error/close. Concurrent calls share one
     * promise. After a transient error, EventSource reconnects itself;
     * connect() can wait for its next hello without opening another stream.
     */
    connect() {
        if (this._connected) return Promise.resolve();
        if (this._connectAttempt) return this._connectAttempt.promise;

        const attempt = {};
        attempt.promise = new Promise((resolve, reject) => {
            attempt.resolve = resolve;
            attempt.reject = reject;
        });
        this._connectAttempt = attempt;
        if (this._es) return attempt.promise;

        let es;
        try {
            es = new EventSource(this.baseUrl + this.apiPrefix + '/stream');
        } catch (error) {
            this._settleConnect(error);
            return attempt.promise;
        }
```

</details>

#### 缺口

- 未测构建、跨端维护及恢复成本
  **影响**：无法估计实际投入
  **进一步探讨**：用目标工具链构建并记录绑定、升级及故障处理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让重连后状态新鲜度更容易判断？

**研究主题**：新假设与验证

#### 完整回答

Web SDK 在 hello 后标记连接并分发状态，但本次只检查客户端片段，尚未核实服务器是否已发送完整快照。可探索以版本或快照标记区分重连前缓存与已同步状态；先检查现有服务端握手，若已完整覆盖则不重复建设。对照网络中断和重连，测旧状态误用、恢复延迟及附加成本；无改进或与现有协议重复则否定。

#### 证据与依据

**依据 1 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:79-115](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L79-L115)

连接及 hello 处理。

<details>
<summary>查看原文（37行）</summary>

```text
    /**
     * Open the SSE stream. Resolves when the server's "hello" frame
     * arrives, or rejects on error/close. Concurrent calls share one
     * promise. After a transient error, EventSource reconnects itself;
     * connect() can wait for its next hello without opening another stream.
     */
    connect() {
        if (this._connected) return Promise.resolve();
        if (this._connectAttempt) return this._connectAttempt.promise;

        const attempt = {};
        attempt.promise = new Promise((resolve, reject) => {
            attempt.resolve = resolve;
            attempt.reject = reject;
        });
        this._connectAttempt = attempt;
        if (this._es) return attempt.promise;

        let es;
        try {
            es = new EventSource(this.baseUrl + this.apiPrefix + '/stream');
        } catch (error) {
            this._settleConnect(error);
            return attempt.promise;
        }
        this._es = es;
        es.onmessage = (msg) => {
            if (this._es !== es) return; // a closed/replaced stream's queued callback
            try {
                const env = JSON.parse(msg.data);
                if (env.type === 'hello') {
                    const opened = !this._connected;
                    this._connected = true;
                    this._settleConnect(); // user callbacks cannot prevent settlement
                    if (opened) this._notify(this._onOpen);
                } else {
                    this._dispatch(env);
```

</details>

**依据 2 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:121-141](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L121-L141)

错误与关闭。

<details>
<summary>查看原文（21行）</summary>

```text
        es.onerror = (event) => {
            if (this._es !== es) return;
            this._connected = false;
            if (es.readyState === EventSource.CLOSED) {
                this._es = null; // terminal failures require a fresh stream
                es.close();
            }
            this._settleConnect(event instanceof Error
                ? event : new Error('Aria SSE connection failed'));
            this._notify(this._onError, event);
        };
        return attempt.promise;
    }

    /** Close the SSE stream. */
    close() {
        const es = this._es;
        this._es = null;
        this._connected = false;
        this._settleConnect(new Error('Aria SSE connection closed'));
        if (es) es.close();
```

</details>

**依据 3 · 源码核查**：[modules/adapters/http/web-sdk/aria_client.js:274-291](https://github.com/dqsjqian/Aria/blob/778c3d2b12ddfb111135f8f52054564fb0dae306/modules/adapters/http/web-sdk/aria_client.js#L274-L291)

本地状态缓存及分发。

<details>
<summary>查看原文（18行）</summary>

```text
    _stateChannel(field) {
        const channel = this._stateChannels.get(field);
        if (!channel) throw new RangeError('state field must be value, visibility or enabled');
        return channel;
    }

    _dispatchState(viewId, field, value) {
        const channel = this._stateChannel(field);
        channel.values.set(viewId, value);
        const subscribers = channel.subscribers.get(viewId);
        if (subscribers) this._notify(subscribers, value);
    }

    _dispatch(env) {
        switch (env.type) {
            case 'state': {
                const value = decodeValue(env.field, env.value);
                this._dispatchState(env.view, 'value', value);
```

</details>

#### 缺口

- 服务端快照契约和恢复方案未验证
  **影响**：不能声称存在数据丢失或新方案有效
  **进一步探讨**：核查服务端并测试断线期间更新和重连结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
