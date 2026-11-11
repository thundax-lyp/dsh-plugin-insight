# Codex Taskboard for DeepSeek Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bdf7698](https://github.com/chuspeeism/dashi-taskboard/tree/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 3,475](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C475&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chuspeeism/dashi-taskboard)
<!-- END META -->

> **功能**：在 DeepSeek Harness Web 侧栏添加任务面板入口，打开启动器当前运行的 Codex Taskboard。

> **亮点**：[Q01](#research-q01) 把已有看板和启动器提供的动态地址接到 DSH Web 侧栏，用户可在会话中按需重新打开当前实例。

> **主要限制**：[Q02](#research-q02) 307 表示路由解析出了地址，仍可能指向过期或浏览器不可达的看板。[Q03](#research-q03) 外链消息在此子包缺少父端处理。

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
  - [Q01 · 从侧栏进看板具体省什么，宿主如何接上既有看板？](#detail-section-11)
  - [Q02 · 动态地址从哪里来，启动、重启或读错文件时会发生什么？](#detail-section-12)
  - [Q03 · 嵌入后的外链和显示范围有什么限制，使用成本由谁承担？](#detail-section-13)
  - [Q04 · 在什么环境值得试用，什么变化可以让失败更易辨认？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已在同一台机器运行 Codex Taskboard 的 DSH Web 用户，可以在会话侧栏打开面板查看现有任务。

独立浏览器已能完成看板任务。侧栏接入省去切换页面及记住可能变动的服务地址，前提是浏览器能够到达描述符中的地址。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH Web 侧栏面板 | 会话中查看已运行的看板 | 依赖 slots、浏览器可达及 iframe 策略 |
| 宿主地址重定向 | 打开启动器当前发布的看板地址 | 可解析描述符不代表目标活跃 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web profile、侧栏 slots 和 webServer | 必需 | 注册入口和重定向路由 | 面板或宿主路由不能按源码路径生效 |
| 已运行的 Taskboard 及可读可信的版本 1 描述符 | 打开看板时必需 | 解析实际地址 | 读文件或格式异常返回 503 |
| 浏览器可访问目标，且页面允许嵌入 | iframe 展示必需 | 呈现已有看板 | 转到已确认可用的独立页面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 使用者先启动独立看板并读一条测试任务 | 记录可复核任务和独立页面 |
| 打开 | 在隔离 Web profile 点击侧栏任务面板 | 检查同一条测试任务及关闭后返回会话 |
| 退出 | 错实例、空白或 503 时关闭面板 | 独立页面仍可访问，优先分辨描述符与嵌入故障 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 既有宿主与看板进程资源，费用未知 | 加本地 bundle、确认地址与测试任务 | 兼容版本和接入时间未验 |
| 持续 | 看板进程与 iframe 占用未测 | 服务或浏览器变化后核对地址和嵌入 | 未测每次查看省下的时间 |
| 失败恢复 | 额外运行资源未知 | 查描述符、回独立页面 | 恢复耗时及外链兼容未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话中查看看板 | slots 注册面板，iframe 请求宿主路由 | 真实宿主加载及同一任务状态 |
| 跟随服务地址 | 启动器发布描述符，路由逐请求读取 | 崩溃残留、换端口后可达时间 |
| 嵌入内打开外链 | 看板发出父窗口消息 | DSH 中是否有接收方 |

> **思考**：[Q02](#research-q02) 307 表示路由解析出了地址，仍可能指向过期或浏览器不可达的看板。[Q03](#research-q03) 外链消息在此子包缺少父端处理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把已有看板和启动器提供的动态地址接到 DSH Web 侧栏，用户可在会话中按需重新打开当前实例。

写端通过临时文件和重命名发布描述符，读端为薄重定向。客户端刷新有明确触发，布局依赖 CSS 类名后缀，且未接入嵌入端的外链消息。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 307 表示路由解析出了地址，仍可能指向过期或浏览器不可达的看板。[Q03](#research-q03) 外链消息在此子包缺少父端处理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅用隔离 Web profile 的已有测试任务确认面板和独立页面读取一致，发现错实例、空白或外链失效时回独立页面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查 Web 注册、描述符写入与读取、iframe 刷新和外链消息路径。实际宿主兼容、跨机可达与故障恢复仍待验证。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/index.js、integrations/deepseek-harness/client.js、integrations/deepseek-harness/cordis.patch.yml、integrations/deepseek-harness/package.json、src-tauri/src/main.rs、scripts/codex-injector.mjs、web/src/App.tsx、web/src/embeddedHost.mjs 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本静态核查限于 DSH 子包和根仓库的启动器描述符及嵌入桥接关键位置。未执行目标代码、测试、安装或实际看板任务。
- 下一步：在同机、隔离 Web profile 和测试看板中检查一次打开与关闭，另测端口切换、描述符失效及同一外链在面板和独立页面的行为。

**分析版本**

- **仓库**：[chuspeeism/dashi-taskboard](https://github.com/chuspeeism/dashi-taskboard)
- **版本号**：1.0.0（[固定提交 bdf7698](https://github.com/chuspeeism/dashi-taskboard/tree/bdf7698f6c3f3737a65377814dbb9db7ce81ea38)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将描述符解析状态与嵌入就绪分开呈现，可能减少重复刷新和故障误判，需以同条件故障注入验证。

在同机、隔离 Web profile 和测试看板中检查一次打开与关闭，另测端口切换、描述符失效及同一外链在面板和独立页面的行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 207 | 193 | 0 | — |
| .md | source | 1 | 11 | — | — | 76 |

</details>

**活跃度**

[![Issue 未关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/chuspeeism/dashi-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已经使用 Codex Taskboard 的 DSH Web 用户能否从侧栏可靠打开当前看板，且能识别嵌入、服务和数据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从侧栏进看板具体省什么，宿主如何接上既有看板？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用人群是已经运行 Codex Taskboard、又在 DSH Web 会话中频繁查看既有任务状态的开发者。合格的一次打开应显示当前看板和已存在的测试任务，关掉面板后仍可回到当前对话。包清单声明 Web 入口及侧栏依赖，Cordis patch 插入子包；客户端向侧栏页脚注册按钮，打开后创建指向宿主同源路由的 iframe。宿主读取启动器描述符并发出 307，把 iframe 导向实际 Taskboard 实例。看板的数据和任务操作仍由已有应用提供。相比将当前地址收藏到独立标签页，增量在入口常驻和打开时解析地址，尤其适合服务可能换端口的情形；使用固定地址且一直保持看板打开的人获得的额外价值较小。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:3-11](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/README.md#L3-L11)

作者明确要求从 DSH Web profile 加本地 bundle，并先启动看板。

````text
This directory is an installable DeepSeek Harness bundle. It adds a Taskboard entry to the Harness sidebar and opens the active installed Codex Taskboard runtime.

From a DeepSeek Harness source checkout, install it into the Web profile:

```sh
pnpm dsh plugin --profile web add /absolute/path/to/codex-taskboard/integrations/deepseek-harness
```

Start Codex Taskboard before opening the entry. The plugin reads the launcher-owned runtime file, so it does not depend on a fixed port.
````

**依据 2 · 源码核查**：[integrations/deepseek-harness/package.json:17-26](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/package.json#L17-L26)

清单声明 bundle patch 和 Web 侧栏注入依赖。

<details>
<summary>查看原文（10行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:1-3](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/cordis.patch.yml#L1-L3)

配置插入 codex-taskboard 包。

```text
- insert:
    - id: codex-taskboard
      name: dsh-codex-taskboard
```

**依据 4 · 源码核查**：[integrations/deepseek-harness/client.js:107-135](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/client.js#L107-L135)

按钮切换面板，iframe 指向同源路由。

<details>
<summary>查看原文（29行）</summary>

```text
        React.createElement("iframe", {
          key: generation,
          className: "dsh-codex-taskboard-frame",
          src: `${ROUTE}?refresh=${generation}`,
          title: "Codex Taskboard",
        }),
      );
    }

    function TaskboardEntry({ wide }) {
      const [open, setOpen] = useState(false);
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "button",
          {
            type: "button",
            className: `dsh-codex-taskboard-trigger${wide ? "" : " rail"}`,
            title: "任务面板",
            "aria-label": "任务面板",
            "aria-expanded": open,
            "aria-controls": PANEL_ID,
            onClick: () => setOpen((value) => !value),
          },
          React.createElement(ChecklistIcon),
          wide && React.createElement("span", { className: "dsh-codex-taskboard-label" }, "任务面板"),
        ),
        open && React.createElement(TaskboardPanel, { onClose: () => setOpen(false) }),
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/client.js:139-159](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/client.js#L139-L159)

通过宿主 slots 注册侧栏页脚。

<details>
<summary>查看原文（21行）</summary>

```text
    const inject = ["slots"];

    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.dataset.plugin = "dsh-codex-taskboard";
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => style.remove();
      }, "codex-taskboard: styles");

      ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
        name: "sidebar.footer.action",
        id: "codex-taskboard",
        order: 0,
      }, TaskboardEntry));
    }

    exports.apply = apply;
    exports.inject = inject;
```

</details>

**依据 6 · 源码核查**：[integrations/deepseek-harness/index.js:22-40](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/index.js#L22-L40)

精确路由发出不可缓存的重定向，读失败时给出 503。

<details>
<summary>查看原文（19行）</summary>

```text
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
        }
```

</details>

#### 缺口

- 缺少同一版本的 DSH Web 安装及 iframe 加载记录。
  **影响**：无法确认当前宿主的加载、权限和浏览器策略均允许这一接线。
  **进一步探讨**：在同机 Web profile 打开隔离看板，核对入口、预置任务、关闭回到会话及独立页面读回。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 动态地址从哪里来，启动、重启或读错文件时会发生什么？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

原生启动入口向注入器传入 launcher-runtime.json 和回环地址，优先端口不可用时可选择系统分配端口。注入器以临时文件写版本、PID 与地址，再重命名并限制权限；清理逻辑只有在 PID 和 URL 仍匹配时才删文件。DSH 读者每次读取自己的环境变量覆盖或默认的 macOS 风格路径，要求版本为 1、URL 为字符串且能构造 URL，添加 host 查询参数后即返回重定向。宿主和启动器若看不到同一文件、格式坏掉或地址无法解析，都显示同一 503 文案。格式正确但已经过时、无法在浏览器网络中访问，或者被改指别处的描述符仍可触发 307，因为读取端没有检查 PID 存活、目标可达或回环范围。正常写入端的私有文件权限和回环配置减少误配置机会，仍须信任文件和启动来源。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/main.rs:861-865](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/src-tauri/src/main.rs#L861-L865)

优先端口失败时，启动器回退到回环随机端口。

```text
fn taskboard_loopback_listener() -> Result<TcpListener, String> {
    TcpListener::bind(("127.0.0.1", TASKBOARD_PREFERRED_PORT))
        .or_else(|_| TcpListener::bind(("127.0.0.1", 0)))
        .map_err(|error| error.to_string())
}
```

**依据 2 · 源码核查**：[src-tauri/src/main.rs:1721-1727](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/src-tauri/src/main.rs#L1721-L1727)

向注入器传递描述符路径及回环服务配置。

```text
        .env("CODEX_TASKBOARD_DATA_DIR", &state.data_directory)
        .env(
            "CODEX_TASKBOARD_RUNTIME_FILE",
            state.data_directory.join("launcher-runtime.json"),
        )
        .env("CODEX_TASKBOARD_HOST", "127.0.0.1")
        .env("CODEX_TASKBOARD_PORT", taskboard_port.to_string())
```

**依据 3 · 源码核查**：[scripts/codex-injector.mjs:279-302](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/scripts/codex-injector.mjs#L279-L302)

原子替换、限制权限和按 PID 与地址核对后清理来自写入端。

<details>
<summary>查看原文（24行）</summary>

```text
async function publishTaskboardRuntime() {
  if (!taskboardRuntimeFile) return;
  const temporaryPath = `${taskboardRuntimeFile}.${process.pid}.tmp`;
  await mkdir(path.dirname(taskboardRuntimeFile), { recursive: true });
  await writeFile(
    temporaryPath,
    `${JSON.stringify({ version: 1, pid: process.pid, url: taskboardBaseUrl })}\n`,
    { mode: 0o600 },
  );
  await chmod(temporaryPath, 0o600);
  await rename(temporaryPath, taskboardRuntimeFile);
  await chmod(taskboardRuntimeFile, 0o600);
}

async function removeTaskboardRuntime() {
  if (!taskboardRuntimeFile) return;
  try {
    const descriptor = JSON.parse(await readFile(taskboardRuntimeFile, "utf8"));
    if (descriptor.pid === process.pid && descriptor.url === taskboardBaseUrl) {
      await unlink(taskboardRuntimeFile);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/index.js:8-19](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/index.js#L8-L19)

读者只验版本、字符串、URL 解析并补查询字段，没有验证本地性及活性。

<details>
<summary>查看原文（12行）</summary>

```text
const ROUTE = "/integrations/codex-taskboard";
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
```

</details>

**依据 5 · 源码核查**：[integrations/deepseek-harness/index.js:27-40](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/index.js#L27-L40)

可解析地址直接 307，读取异常统一为 503。

<details>
<summary>查看原文（14行）</summary>

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
        }
```

</details>

#### 缺口

- 未复现端口变化、崩溃残留或跨机浏览器访问。
  **影响**：不能确认故障时多久收敛到新地址，也不能保证浏览器可达服务所在回环。
  **进一步探讨**：在同机与分离浏览器各记录一次切换端口前后的路由结果，并在隔离环境注入缺失与过期描述符。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 嵌入后的外链和显示范围有什么限制，使用成本由谁承担？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

使用者承担启动看板、配置 DSH profile、核对描述符和排查 iframe 的时间。插件面板扫描页面找类名以 _centerCol 结尾的容器，找不到时回退到整个视口，宿主布局变化因此可能遮挡其他区域。刷新会用新 key 重新挂载 iframe，再请求宿主路由，但仍依赖看板可达。还需留意看板内的外链：host=deepseek-harness 进入嵌入模式，Taskboard 捕获符合条件的绝对 HTTP(S) 新窗口链接、阻止浏览器默认行为并向父窗口发送 taskboard:open-external；这个 DSH 子包只创建 iframe 和注册侧栏，未实现接收该消息的分支。若宿主没有其他监听器，外链有停在原页的风险。查看既有任务可以先走面板，遇到外链或嵌入受限时在独立浏览器访问同一测试看板。交付一次合格查询的人工成本应含失败和回退，资源按已有看板进程与浏览器占用单列，当前均无测量值。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/client.js:25-54](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/client.js#L25-L54)

按布局类名扫描 DOM 并随尺寸变化重新测量，找不到时使用零边距。

<details>
<summary>查看原文（30行）</summary>

```text
    function centerColumnBox() {
      for (const element of document.querySelectorAll("*")) {
        for (const className of element.classList) {
          if (!className.endsWith("_centerCol")) continue;
          const rect = element.getBoundingClientRect();
          return {
            left: rect.left,
            top: rect.top,
            right: window.innerWidth - rect.right,
            bottom: window.innerHeight - rect.bottom,
          };
        }
      }
      return { left: 0, top: 0, right: 0, bottom: 0 };
    }

    function useCenterColumnBox() {
      const [box, setBox] = useState(centerColumnBox);
      useEffect(() => {
        const measure = () => setBox(centerColumnBox());
        const observer = new ResizeObserver(measure);
        const column = [...document.querySelectorAll("*")].find((element) =>
          [...element.classList].some((className) => className.endsWith("_centerCol")),
        );
        if (column) observer.observe(column);
        window.addEventListener("resize", measure);
        return () => {
          observer.disconnect();
          window.removeEventListener("resize", measure);
        };
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/client.js:73-112](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/client.js#L73-L112)

刷新重建 iframe，关闭移除面板。

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

**依据 3 · 源码核查**：[integrations/deepseek-harness/client.js:139-162](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/client.js#L139-L162)

DSH 子包导出样式和 slots 注册，未提供父窗口消息接线。

<details>
<summary>查看原文（24行）</summary>

```text
    const inject = ["slots"];

    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.dataset.plugin = "dsh-codex-taskboard";
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => style.remove();
      }, "codex-taskboard: styles");

      ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
        name: "sidebar.footer.action",
        id: "codex-taskboard",
        order: 0,
      }, TaskboardEntry));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
```

</details>

**依据 4 · 源码核查**：[web/src/App.tsx:731-735](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/web/src/App.tsx#L731-L735)

查询参数把 DSH 路径选为嵌入模式。

```text
export function App() {
  const query = useMemo(() => new URL(document.baseURI).searchParams, []);
  const host = query.get("host");
  const embedded = host === "codex" || host === "deepseek-harness";
  const undoShortcut = navigator.userAgent.includes("Macintosh") ? "⌘Z" : "Ctrl+Z";
```

**依据 5 · 源码核查**：[web/src/App.tsx:1880-1886](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/web/src/App.tsx#L1880-L1886)

嵌入 effect 安装外链捕获并注册消息监听。

```text
    const removeExternalLinkHandler = installEmbeddedExternalLinkHandler();
    window.addEventListener("message", receiveHostMessage);
    postEmbeddedHostMessage({ type: "taskboard:frame-awaiting-challenge" });
    return () => {
      window.removeEventListener("message", receiveHostMessage);
      setEmbeddedFrameChallenge("");
      removeExternalLinkHandler();
```

**依据 6 · 源码核查**：[web/src/embeddedHost.mjs:21-46](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/web/src/embeddedHost.mjs#L21-L46)

符合条件的外链阻止默认打开，改向父窗口发消息。

<details>
<summary>查看原文（26行）</summary>

```text
export function installEmbeddedExternalLinkHandler() {
  const handleClick = (event) => {
    const link = event.target instanceof Element
      ? event.target.closest('a[target="_blank"]')
      : null;
    if (!link) return;

    const rawHref = link.getAttribute("href");
    if (!rawHref) return;

    let url;
    try {
      url = new URL(rawHref);
    } catch {
      return;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    event.preventDefault();
    postEmbeddedHostMessage({
      type: "taskboard:open-external",
      payload: { url: url.href },
    });
  };

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
```

</details>

#### 缺口

- 没有核对其他已安装 DSH 扩展是否接手消息，也没有点击外链验收。
  **影响**：外链断路属于由本包缺少接线推导的条件性风险。
  **进一步探讨**：在隔离 Web profile 对同一测试链接分别在面板和独立网页点击，核对父窗口消息接收与实际打开。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在什么环境值得试用，什么变化可以让失败更易辨认？

**研究主题**：新假设与验证、采用判断

#### 完整回答

同机已运行看板且独立页面可打开的人，可以在隔离 DSH Web profile 用一条现成测试任务验证侧栏入口。先核对面板与独立页面打开的是同一实例，查到同一条任务，再关闭并重新打开；如果出现 503、空白页、错实例或外链不响应，就回独立页面，先区分读文件失败与重定向后连不上服务。对统一错误的改进假设是把“描述符不可读或无效”与“地址已解析、嵌入尚未确认”分开提示。第二项可以通过明确的 iframe 就绪反馈验证，超时保留未知，不自动向描述符中任意 URL 发起额外服务器请求。在隔离环境分别构造缺文件、有效但过期地址、正常嵌入，比对用户定位故障的步骤、耗时和误判。若提示把浏览器策略拦截误判为服务离线，或并未减少排查步骤，应保留原流程和独立页面退路。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:5-11](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/README.md#L5-L11)

作者路径需要 Web profile 与先运行的独立 Taskboard。

````text
From a DeepSeek Harness source checkout, install it into the Web profile:

```sh
pnpm dsh plugin --profile web add /absolute/path/to/codex-taskboard/integrations/deepseek-harness
```

Start Codex Taskboard before opening the entry. The plugin reads the launcher-owned runtime file, so it does not depend on a fixed port.
````

**依据 2 · 源码核查**：[integrations/deepseek-harness/index.js:27-40](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/index.js#L27-L40)

现有错误面区分 307 与统一 503，但不反馈 iframe 就绪。

<details>
<summary>查看原文（14行）</summary>

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
        }
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/client.js:92-112](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/integrations/deepseek-harness/client.js#L92-L112)

刷新只触发重开 iframe，没有 ready 状态或恢复分支。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 4 · 源码核查**：[web/src/App.tsx:1810-1827](https://github.com/chuspeeism/dashi-taskboard/blob/bdf7698f6c3f3737a65377814dbb9db7ce81ea38/web/src/App.tsx#L1810-L1827)

看板已有挑战后发出 ready 的分支，实际 DSH 父窗口握手仍需设计和验收。

<details>
<summary>查看原文（18行）</summary>

```text
    function receiveHostMessage(event: MessageEvent) {
      if (event.source !== window.parent || !event.data || typeof event.data !== "object") return;
      const message = event.data as { type?: string; payload?: unknown; theme?: unknown };

      if (message.type === "taskboard:frame-challenge") {
        const challenge = typeof message.payload === "object"
          && message.payload
          && "challenge" in message.payload
          && typeof message.payload.challenge === "string"
          ? message.payload.challenge
          : "";
        if (!challenge || challenge === acknowledgedFrameChallenge) return;
        acknowledgedFrameChallenge = challenge;
        setEmbeddedFrameChallenge(challenge);
        setEmbeddedFrameChallengeState(challenge);
        postEmbeddedHostMessage({ type: "taskboard:ready" });
        return;
      }
```

</details>

#### 缺口

- 没有同条件错误诊断对照，也没有实际试用。
  **影响**：提示是否能减少排查时间仍是假设。
  **进一步探讨**：按三类故障盲测提示和退路，记录首次正确定位比例与时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
