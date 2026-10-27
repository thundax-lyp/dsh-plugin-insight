# DSH Codex Taskboard 侧栏集成

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9aa1f4e](https://github.com/chuspeeism/dashi-taskboard/tree/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 3,401](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C401&color=yellow&logo=github&style=flat)](https://github.com/chuspeeism/dashi-taskboard)
<!-- END META -->

> **实现功能**：在DeepSeek Harness侧栏嵌入已启动的Codex Taskboard本地看板。

> **核心亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把启动器拥有的运行时描述符接到DSH入口，相对写死端口或手工打开URL减少地址维护；不包含独立看板引擎或自动启动能力。

> **风险与缺陷**：[Q02](#research-q02) 统一503会把描述符格式、权限和服务未运行混为一类，动态发现不等于健康验证；读取者依赖启动器维护正确可信的URL。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 侧栏集成实际提供什么能力？](#detail-section-15)
  - [Q02 · 动态地址与统一异常的便利和边界是什么？](#detail-section-16)
  - [Q03 · 薄入口的全周期负担与退出是否支持试用？](#detail-section-17)
  - [Q04 · 区分描述符错误能否减少排障？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已运行Taskboard的DSH Web使用者在工作界面查看与管理原有任务。

简单替代是浏览器打开Taskboard运行地址；侧栏只减少切换，不能据此声称任务完成更可靠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 侧栏面板 | 查看已有Taskboard | 外部服务预先运行 |
| 动态运行地址 | 跟随启动器描述符 | 只校验描述符，不证明健康与认证 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 失败处理 |
|---|---|---|
| Taskboard启动器与服务 | 提供实际看板和描述符 | 先验证独立页面 |
| DSH Web/sidebar与webServer | 挂侧栏及路由 | 核对组件加载 |
| 可读运行描述符 | 解析活跃地址 | 非macOS配置路径，检查格式 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与成功判据 | 失败退路 |
|---|---|---|
| 启动根看板 | 用户直接URL可开 | 排查服务 |
| 接本地bundle | 用户看到侧栏入口 | 检查宿主依赖 |
| 点击入口 | iframe显示同一看板 | 关闭并直开已知URL |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 已有Taskboard与DSH资源，费用未知 | 启动服务、加组件、核对路径，时长未知 |
| 持续 | 外部服务运行资源，未知 | 维护启动器与宿主兼容，未知 |
| 失败恢复 | 重载与服务排障资源，未知 | 区分文件/格式/服务错误并直开，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 工作界面打开看板 | 侧栏、iframe、动态重定向 | 未验证嵌入兼容与登录 |
| 跟随活跃端口 | 每次路由读取描述符 | 未做重启与旧文件实验 |

> **思考**：[Q02](#research-q02) 统一503会把描述符格式、权限和服务未运行混为一类，动态发现不等于健康验证；读取者依赖启动器维护正确可信的URL。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把启动器拥有的运行时描述符接到DSH入口，相对写死端口或手工打开URL减少地址维护；不包含独立看板引擎或自动启动能力。

[Q01](#research-q01)、[Q02](#research-q02) 把启动器拥有的运行时描述符接到DSH入口，相对写死端口或手工打开URL减少地址维护；不包含独立看板引擎或自动启动能力。

前后端职责较清晰，路由只解析描述符，界面只嵌入；可借鉴运行时所有权与no-store，但复制时要明确URL信任边界和错误分类，不能当通用服务发现方案。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q02](#research-q02) 统一503会把描述符格式、权限和服务未运行混为一类，动态发现不等于健康验证；读取者依赖启动器维护正确可信的URL。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q03](#research-q03) 仅建议已有Taskboard服务的人试用这一薄入口；首次接触者先确认独立浏览器看板工作，再接DSH。503或嵌入异常先回独立页面，不能用反复刷新替代诊断。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查侧栏与动态重定向；未运行宿主，诊断分流是未验证假设。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/README.md、integrations/deepseek-harness/package.json、integrations/deepseek-harness/index.js、integrations/deepseek-harness/client.js、integrations/deepseek-harness/cordis.patch.yml 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查DSH integration组件及其根工程依赖声明；没有执行看板、目标测试、CDP注入或宿主安装。
- 下一步：隔离服务下检查正常、描述符缺失、损坏和服务停止；再检查宿主停用时样式、入口和路由清理。尚未执行。

**分析版本**

- **仓库**：[chuspeeism/dashi-taskboard](https://github.com/chuspeeism/dashi-taskboard)
- **版本号**：1.0.0（[固定提交 9aa1f4e](https://github.com/chuspeeism/dashi-taskboard/tree/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是在受限本地健康探测下区分描述符故障，以故障注入比较定位时间；无改善或出现额外误报即停止。

隔离服务下检查正常、描述符缺失、损坏和服务停止；再检查宿主停用时样式、入口和路由清理。尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 207 | 193 | 0 | — |
| .md | source | 1 | 11 | — | — | 76 |

</details>

**活跃度**

[![Issue 未关闭 20](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=20&color=grey&logo=github&style=flat)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=grey&logo=github&style=flat)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH薄入口的动态运行时绑定与故障边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 侧栏集成实际提供什么能力？

**研究主题**：场景与需求、功能与机制

#### 完整回答

这是已有Codex Taskboard服务的DSH Web侧栏入口，适合同时在DSH工作与查看本地任务的人。它没有自己的任务数据库、任务工具或服务启动逻辑。client用slots挂入口，点击后显示iframe，iframe访问固定的宿主路由；服务端每次读launcher-runtime.json，校验version与url后补host=deepseek-harness，返回307到实际运行地址。合格结果是打开原有看板并能按既有方式查看任务。简单替代是直接在浏览器打开看板URL；插件增量是减少切换和记端口，而非新增任务管理引擎。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/client.js:73-112](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/client.js#L73-L112)

iframe和刷新按钮是真实页面链路，未运行确认。

<details>
<summary>查看原文（40行）</summary>

```text
    function TaskboardPanel({ onClose }) {
      const box = useCenterColumnBox();
      const [generation, setGeneration] = useState(0);
      return React.createElement(
        "aside",
        {
          id: PANEL_ID,
          className: "dsh-codex-taskboard-panel",
          style: box,
          "aria-label": "任务面板",
        },
        React.createElement(
          "div",
          { className: "dsh-codex-taskboard-header" },
          React.createElement("strong", null, "任务面板"),
          React.createElement(
            "div",
            { className: "dsh-codex-taskboard-actions" },
            React.createElement(
              "button",
              {
                type: "button",
                className: "dsh-codex-taskboard-action",
                onClick: () => setGeneration((value) => value + 1),
              },
              "刷新",
            ),
            React.createElement(
              "button",
              { type: "button", className: "dsh-codex-taskboard-action", onClick: onClose },
              "关闭",
            ),
          ),
        ),
        React.createElement("iframe", {
          key: generation,
          className: "dsh-codex-taskboard-frame",
          src: `${ROUTE}?refresh=${generation}`,
          title: "Codex Taskboard",
        }),
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/index.js:9-39](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/index.js#L9-L39)

运行描述符与307/503路径。

<details>
<summary>查看原文（31行）</summary>

```text
const RUNTIME_FILE = process.env.CODEX_TASKBOARD_RUNTIME_FILE
  ?? path.join(os.homedir(), "Library/Application Support/Codex Taskboard/launcher-runtime.json");

async function activeTaskboardUrl() {
  const descriptor = JSON.parse(await readFile(RUNTIME_FILE, "utf8"));
  if (descriptor?.version !== 1 || typeof descriptor.url !== "string") {
    throw new Error("The active Codex Taskboard runtime is invalid");
  }
  const url = new URL(`${descriptor.url.replace(/\/$/, "")}/`);
  url.searchParams.set("host", "deepseek-harness");
  return url.href;
}

export function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: ROUTE,
      handler: async (_request, response) => {
        try {
          response.writeHead(307, {
            location: await activeTaskboardUrl(),
            "cache-control": "no-store",
          });
          response.end();
        } catch {
          response.writeHead(503, {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          });
          response.end("Codex Taskboard is not running.");
```

</details>

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:1-11](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/README.md#L1-L11)

作者把它限定为已安装运行时的入口。

<details>
<summary>查看原文（11行）</summary>

````text
# DeepSeek Harness plugin

This directory is an installable DeepSeek Harness bundle. It adds a Taskboard entry to the Harness sidebar and opens the active installed Codex Taskboard runtime.

From a DeepSeek Harness source checkout, install it into the Web profile:

```sh
pnpm dsh plugin --profile web add /absolute/path/to/codex-taskboard/integrations/deepseek-harness
```

Start Codex Taskboard before opening the entry. The plugin reads the launcher-owned runtime file, so it does not depend on a fixed port.
````

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 动态地址与统一异常的便利和边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

相对写死端口的iframe，读启动器拥有的描述符可以随活跃服务变更而改变跳转目标，no-store减少浏览器沿用旧目标的机会。这是常规但可解释的接入便利，不代表插件会发现所有进程或验证服务健康。运行描述符默认位于macOS Application Support；其他系统需设置环境变量指向正确文件。解析失败、版本或URL不合法等异常统一被catch转成503和not running，因此用户看见未运行提示时，真实原因也可能是文件不可读或格式错误，不能据提示断言进程已退出。代码只检查URL可解析，没有在所查函数限制loopback或HTTP协议；安全边界由描述符写入者和本地环境承担。该设计风险没有被本轮运行复现。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/index.js:9-39](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/index.js#L9-L39)

动态描述符、URL解析、no-store及统一503可直接定位。

<details>
<summary>查看原文（31行）</summary>

```text
const RUNTIME_FILE = process.env.CODEX_TASKBOARD_RUNTIME_FILE
  ?? path.join(os.homedir(), "Library/Application Support/Codex Taskboard/launcher-runtime.json");

async function activeTaskboardUrl() {
  const descriptor = JSON.parse(await readFile(RUNTIME_FILE, "utf8"));
  if (descriptor?.version !== 1 || typeof descriptor.url !== "string") {
    throw new Error("The active Codex Taskboard runtime is invalid");
  }
  const url = new URL(`${descriptor.url.replace(/\/$/, "")}/`);
  url.searchParams.set("host", "deepseek-harness");
  return url.href;
}

export function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: ROUTE,
      handler: async (_request, response) => {
        try {
          response.writeHead(307, {
            location: await activeTaskboardUrl(),
            "cache-control": "no-store",
          });
          response.end();
        } catch {
          response.writeHead(503, {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          });
          response.end("Codex Taskboard is not running.");
```

</details>

#### 缺口

- 没有真实宿主的iframe、服务存活与身份验证链路记录
  **影响**：不能确认登录、嵌入策略或不同平台完整兼容
  **进一步探讨**：先用隔离服务检查正常、文件缺失、JSON损坏和停止服务四种路径

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 薄入口的全周期负担与退出是否支持试用？

**研究主题**：效果与总成本、工程质量与复用、采用判断

#### 完整回答

已有Taskboard且能管理本地配置的人可以隔离试用，原因是组件自身只添加路由和侧栏，不承担额外数据库迁移。但首次仍需安装根Taskboard服务、DSH Web组件并确认描述符路径，持续需启动器与服务保持可用；外部看板的依赖、状态和运维成本不能被薄入口的代码量掩盖。刷新只重建iframe，并不修复描述符或重启服务。effect为注册和样式提供清理钩子值得借鉴，但卸载与slots清理的实际行为还需宿主验收。失败时可关闭面板直接打开已知服务地址；描述符异常应先核对文件而非反复重装插件。费用、配置耗时和失败排查时长没有本轮实测。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/client.js:91-112](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/client.js#L91-L112)

刷新键仅改变generation并重建iframe。

<details>
<summary>查看原文（22行）</summary>

```text
            React.createElement(
              "button",
              {
                type: "button",
                className: "dsh-codex-taskboard-action",
                onClick: () => setGeneration((value) => value + 1),
              },
              "刷新",
            ),
            React.createElement(
              "button",
              { type: "button", className: "dsh-codex-taskboard-action", onClick: onClose },
              "关闭",
            ),
          ),
        ),
        React.createElement("iframe", {
          key: generation,
          className: "dsh-codex-taskboard-frame",
          src: `${ROUTE}?refresh=${generation}`,
          title: "Codex Taskboard",
        }),
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/client.js:141-148](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/client.js#L141-L148)

样式effect返回remove清理。

```text
    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.dataset.plugin = "dsh-codex-taskboard";
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => style.remove();
```

**依据 3 · 作者声明**：[integrations/deepseek-harness/README.md:5-11](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/README.md#L5-L11)

启动前置与组件安装说明。

````text
From a DeepSeek Harness source checkout, install it into the Web profile:

```sh
pnpm dsh plugin --profile web add /absolute/path/to/codex-taskboard/integrations/deepseek-harness
```

Start Codex Taskboard before opening the entry. The plugin reads the launcher-owned runtime file, so it does not depend on a fixed port.
````

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 区分描述符错误能否减少排障？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将文件缺失、JSON无效、描述符版本不符与服务不可达分开呈现，并在客户端给出直接浏览器退路，可减少把配置错误当服务未启动的排障反复。推导依据是Q02的统一catch以及Q03的刷新仅重载iframe。新增探测会产生超时与本地网络边界，应由宿主端执行限时健康检查，避免读取任意描述符URL造成额外访问范围。最小验证以四类注入故障比较现有503与细分诊断，让三位已有服务的使用者定位原因，记录正确定位率和分钟；如果没有改善或引入误报便停止，不将设想计入已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/index.js:27-39](https://github.com/chuspeeism/dashi-taskboard/blob/9aa1f4e7936d841748ed4e0fc7781b57ae6ae6cc/integrations/deepseek-harness/index.js#L27-L39)

catch将不同故障压成同一提示，为假设提供具体缺口。

<details>
<summary>查看原文（13行）</summary>

```text
      handler: async (_request, response) => {
        try {
          response.writeHead(307, {
            location: await activeTaskboardUrl(),
            "cache-control": "no-store",
          });
          response.end();
        } catch {
          response.writeHead(503, {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          });
          response.end("Codex Taskboard is not running.");
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
