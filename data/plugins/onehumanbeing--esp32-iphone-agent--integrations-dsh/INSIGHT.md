# DSH ESP32 Agent（Handsy）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5a4fddf](https://github.com/onehumanbeing/esp32-iphone-agent/tree/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 4,831](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C831&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/onehumanbeing/esp32-iphone-agent) [![npm 30d 947](https://img.shields.io/static/v1?label=npm+30d&message=947&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-esp32agent) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-esp32agent)
<!-- END META -->

> **功能**：将 ESP32 Agent 的 iPhone 截图、触控和操作指引接入 DSH。

> **亮点**：把已有设备工具和一图一动作的说明组装为 DSH profile 扩展，避免分开配置和说明，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：手机上动作有真实副作用，Skill 的请求确认属于行为指引。截图冻结或板号不明时，动作目标也无法靠一次返回判定，见 [Q03](#research-q03)。

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
  - [Q01 · 接入 DSH 后能减少真实手机回归中的哪一步？](#detail-section-11)
  - [Q02 · 启动时如何锁定工具与技能，缺板时发生什么？](#detail-section-12)
  - [Q03 · 真实屏幕动作受哪些条件约束，提示能否约束副作用？](#detail-section-13)
  - [Q04 · 现有板卡用户何时值得采用，怎样保留人工退出？](#detail-section-14)
  - [Q05 · 动作前检查截图是否过期能否减少误点？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有 Handsy 板和独立测试手机、需要复核真实界面导航的开发者，见 [Q01](#research-q01)。

使用人工手机操作或手动配置同一个 ESP32 Agent MCP 服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设备 MCP | 配置截图及触控入口 | 需 CLI、设备和镜像 |
| handsy Skill | 指导逐屏核对 | 文本规则依赖模型遵循 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH MCP 与 Skill 服务 | 必需 | 挂载工具及指引 | 相应入口不可用 |
| 配对板卡、手机、Node 与 ffmpeg | 任务所需 | 真实画面与动作 | 镜像或工具报错 |
| 设备选择 | 多板时 | 固定任务对象 | 需人工核对设备 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 连接空白手机并核对板号 | 目标和屏幕一致 |
| 执行 | 每次查看一张图再做一步 | 下一屏符合预期 |
| 退出 | 冻结、锁屏或意外页面时停手 | 由人接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 板卡和转接资源 | 刷机与配对 | 费用和时长未量化 |
| 持续 | 模型与设备 | 校准和复核 | 合格任务费用未知 |
| 恢复 | 设备与重新连接 | 人工检查状态 | 不自动扩大操作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工具挂载 | MCP 配置和 Skill 实际注册 | 真实宿主工具状态 |
| 导航 | 有一图一动作指引 | 错触率和持续性 |

> **思考**：手机上动作有真实副作用，Skill 的请求确认属于行为指引。截图冻结或板号不明时，动作目标也无法靠一次返回判定，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把已有设备工具和一图一动作的说明组装为 DSH profile 扩展，避免分开配置和说明，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

技能与 MCP 分离，工具缺失与说明可见可以同时发生。配置显式传递设备选择，首次 npm 下载仍是依赖，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

手机上动作有真实副作用，Skill 的请求确认属于行为指引。截图冻结或板号不明时，动作目标也无法靠一次返回判定，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在空白测试手机检查一个无写入导航。画面异常或设备不明确时回到人工，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认 MCP 和 Skill 挂载；设备运行、截图时序及合格任务成本仍待核对。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/README.md、integrations/dsh/cordis.patch.yml、integrations/dsh/package.json、integrations/dsh/index.js、cli/npm/package.json、integrations/dsh/skills/handsy/SKILL.md 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对 DSH bundle、技能注册及同树 CLI 版本声明。未运行工具或核验手机、固件和发布包同源。
- 下一步：空白测试机核对板号、截图一致性和失效后的停手，再比较人工导航。

**分析版本**

- **仓库**：[onehumanbeing/esp32-iphone-agent](https://github.com/onehumanbeing/esp32-iphone-agent)
- **版本号**：0.1.3（[固定提交 5a4fddf](https://github.com/onehumanbeing/esp32-iphone-agent/tree/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让动作携带设备与上一次画面标识，检验过期动作拒绝能否减少错触，见 [Q05](#research-q05)。

空白测试机核对板号、截图一致性和失效后的停手，再比较人工导航。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 41 | 34 | 2 | — |
| .md | source | 3 | 303 | — | — | 2651 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/onehumanbeing/esp32-iphone-agent/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定 DSH 的 MCP 和 Skill 怎样接入真实 iPhone，以及何时适合做可核验的屏幕导航。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 接入 DSH 后能减少真实手机回归中的哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 Handsy 板和独立测试手机的移动端开发者，可以把截图及输入动作接进 DSH 会话，记录屏幕导航回归。相比手工拿手机操作，增量是 DSH 能直接消费截图与动作结果。相比自行配置同一 MCP，增量是 bundle 同时布置 MCP 与操作说明，真实手机驱动仍来自板卡和上游 CLI。合格结果应是走到目标页面，截图与真实设备状态一致并返回起点。仅有一次截图或模型描述不能证明完成。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:5-11](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/README.md#L5-L11)

作者说明 DSH 的增量能力。

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) plugin that lets the agent see and drive
a real iPhone through an ESP32 Agent (Handsy) board. It adds:

- the `esp32agent` MCP server (`npx -y esp32agent mcp`): `screenshot`, `tap`, `longpress`, `swipe`, `type_text`,
  `press_key`, `press_button`, `device_info`, plus saved intents and history. Tools show up as
  `mcp__esp32agent__<tool>`.
- the `handsy` skill: the see-act loop, how to save what worked, and safety rules.
```

**依据 2 · 作者声明**：[integrations/dsh/README.md:40-51](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/README.md#L40-L51)

给出安装和读取 WLAN 的示例。

<details>
<summary>查看原文（12行）</summary>

````text
5. **Install the plugin** and restart `dsh web`:

   ```sh
   dsh plugin --profile web add dsh-esp32agent
   # or straight from GitHub
   dsh plugin --profile web add "github:onehumanbeing/esp32-iphone-agent#main&path:/integrations/dsh"
   ```

6. **Try a small task** in dsh:

   > Use the esp32agent tools to control my iPhone. Take a screenshot first, then open Settings, go into WLAN, and
   > tell me which Wi-Fi network the phone is connected to. Finally press Home.
````

</details>

**依据 3 · 源码核查**：[integrations/dsh/cordis.patch.yml:2-20](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/cordis.patch.yml#L2-L20)

MCP 与技能各占一条真实挂载。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    # The esp32agent CLI is a stdio MCP server; tools show up as mcp__esp32agent__<tool>.
    - id: esp32agent-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: esp32agent
        transport: stdio
        command: npx
        args: [-y, esp32agent@0.1.5, mcp]
        # dsh scrubs the inherited env before spawning, so pass the board selector through explicitly.
        env: !!js "process.env.ESP32AGENT_DEVICE ? { ESP32AGENT_DEVICE: process.env.ESP32AGENT_DEVICE } : {}"
        # First run downloads the CLI binary; screenshots go through AirPlay decode.
        startupTimeoutMs: 120000
        toolCallTimeoutMs: 120000
        # Keep dsh usable when the board is unplugged; the tools report the error instead.
        failOnStartupError: false
    # Registers the handsy skill (see-act loop, safety rules).
    - id: esp32agent-skill
      name: dsh-esp32agent
```

</details>

#### 缺口

- 与原 MCP 手动配置及人工操作的单任务时间未知
  **影响**：不能声称回归更快或更稳定
  **进一步探讨**：同一测试机执行相同导航并独立核对页面与耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动时如何锁定工具与技能，缺板时发生什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

补丁通过宿主 MCP client 启动 stdio 的 esp32agent npm 0.1.5，只显式把所选板号环境变量转入，并给启动与工具调用各 120 秒。设置 failOnStartupError 为 false 表明此条挂载允许 MCP 启动失败；不能据此断言工具此时能工作。另一行加载本包 JS，启动读本地 SKILL.md，解析描述后注册名为 handsy 的候选，调用时再读正文。缺 frontmatter 或描述会抛错。npm 包元数据的 CLI 包版本和二进制版本不同，版本锁定也仍需确认首次下载到的产物。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/package.json:6-28](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/package.json#L6-L28)

模块出口与 DSH bundle 声明。

<details>
<summary>查看原文（23行）</summary>

```text
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg",
    "./package.json": "./package.json"
  },
  "files": [
    "index.js",
    "cordis.patch.yml",
    "locale/*.json",
    "icon.svg",
    "skills"
  ],
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-skill": "*"
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/cordis.patch.yml:2-20](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/cordis.patch.yml#L2-L20)

实际工具启动条件与软失败设置。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    # The esp32agent CLI is a stdio MCP server; tools show up as mcp__esp32agent__<tool>.
    - id: esp32agent-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: esp32agent
        transport: stdio
        command: npx
        args: [-y, esp32agent@0.1.5, mcp]
        # dsh scrubs the inherited env before spawning, so pass the board selector through explicitly.
        env: !!js "process.env.ESP32AGENT_DEVICE ? { ESP32AGENT_DEVICE: process.env.ESP32AGENT_DEVICE } : {}"
        # First run downloads the CLI binary; screenshots go through AirPlay decode.
        startupTimeoutMs: 120000
        toolCallTimeoutMs: 120000
        # Keep dsh usable when the board is unplugged; the tools report the error instead.
        failOnStartupError: false
    # Registers the handsy skill (see-act loop, safety rules).
    - id: esp32agent-skill
      name: dsh-esp32agent
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/index.js:10-40](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/index.js#L10-L40)

技能解析、拒绝分支、注册和读取。

<details>
<summary>查看原文（31行）</summary>

```text
const SKILL_DIR = fileURLToPath(new URL('./skills/handsy/', import.meta.url))
const SKILL_PATH = `${SKILL_DIR}SKILL.md`
// Same rank as dsh's bundled skills (BUNDLED_SKILL_RANK), so a user's own handsy skill wins.
const RANK = 600

function parse(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  if (!match) throw new Error(`dsh-esp32agent: ${SKILL_PATH} has no frontmatter`)
  const description = /^description:\s*(.+)$/mu.exec(match[1])?.[1]?.trim()
  if (!description) throw new Error(`dsh-esp32agent: ${SKILL_PATH} has no description`)
  return { description, content: raw.slice(match[0].length).trim() }
}

export function apply(ctx) {
  const { description } = parse(readFileSync(SKILL_PATH, 'utf8'))
  const candidate = {
    name: 'handsy', description,
    invocation: { modelInvocable: true, userInvocable: true },
    provider: name, source: 'bundled', rank: RANK,
    resourceBase: { kind: 'directory', path: SKILL_DIR },
    locator: SKILL_PATH,
  }
  ctx.skills.registerProvider(() => ({
    name,
    list: () => Promise.resolve([candidate]),
    async get(c, options) {
      const { rank: _rank, locator, ...summary } = c
      const raw = await readFile(locator, { encoding: 'utf8', signal: options?.signal })
      return { ...summary, content: parse(raw).content }
    },
  }))
```

</details>

**依据 4 · 源码核查**：[cli/npm/package.json:1-14](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/cli/npm/package.json#L1-L14)

同树的 0.1.5 包描述了 0.1.4 二进制及安装钩子。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "esp32agent",
  "version": "0.1.5",
  "mcpName": "io.github.onehumanbeing/esp32agent",
  "binaryVersion": "0.1.4",
  "description": "See and drive an iPhone through an ESP32 Agent board over Bluetooth or Wi-Fi (CLI + MCP server for coding agents)",
  "license": "MIT",
  "repository": { "type": "git", "url": "git+https://github.com/onehumanbeing/esp32-iphone-agent.git", "directory": "cli" },
  "bin": { "esp32agent": "bin/esp32agent.js" },
  "scripts": { "postinstall": "node install.js" },
  "files": ["bin/esp32agent.js", "install.js"],
  "os": ["darwin", "linux", "win32"],
  "cpu": ["x64", "arm64"],
  "engines": { "node": ">=18" }
```

</details>

#### 缺口

- 未核实 npm 下载产物与当前树一致，未试宿主如何呈现软失败
  **影响**：不能将配置证据当成可用性
  **进一步探讨**：在隔离 profile 分别用已连接及无板条件核查实际工具目录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 真实屏幕动作受哪些条件约束，提示能否约束副作用？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

作者要求 ESP32S3、配对、手机解锁、镜像和 AssistiveTouch，电脑需 Node、ffmpeg 及可用连接。截图与输入不同步时，应按一图一动作再拍核对；镜像冻结、板卡忙或设备锁定时停在当前步骤。技能明确要求在敏感动作前向用户确认，但插件 JS 只注册技能，补丁只配置 MCP 连接，没有动作逐次审批字段。涉及发送、支付和改设置的操作必须在任务范围外保留给用户。多板环境应先绑定设备并独立核验，不能从模型文字推断选择准确。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:21-39](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/README.md#L21-L39)

作者给出接线、配对、镜像及固件条件。

<details>
<summary>查看原文（19行）</summary>

````text
## Quick start

1. **Get a board.** Seeed Studio XIAO ESP32S3 (standard 8 MB flash / 8 MB PSRAM) with its antenna, and a short
   USB-C data cable (Lightning iPhones: a Lightning to USB Camera Adapter):
   [hardware guide](https://handsy.tech/docs/hardware).
2. **Flash the firmware** from your browser (Chrome or Edge, board on USB):
   [handsy.tech/install?build=testflight](https://handsy.tech/install?build=testflight). Firmware v0.2.3 or
   later (v0.2.2 works over Bluetooth only).
3. **Pair the computer** within 3 minutes of plugging the board into the iPhone (needs Node.js 18+ and `ffmpeg`):

   ```sh
   npx -y esp32agent pair
   ```

4. **Set up the iPhone:** join the board's Wi-Fi hotspot (`npx -y esp32agent net` shows its name and password),
   turn on **Control Center → Screen Mirroring → ESP32 Agent**, and enable
   **Settings → Accessibility → Touch → AssistiveTouch**.
   Optional: `npx -y esp32agent net join` puts the board on your home Wi-Fi instead, so dsh's commands and screenshots
   go over Wi-Fi rather than Bluetooth.
````

</details>

**依据 2 · 作者声明**：[integrations/dsh/README.md:61-69](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/README.md#L61-L69)

多板选择及宿主缺逐动作审批。

```text
With several boards, set `ESP32AGENT_DEVICE` to the board id before starting dsh; the plugin passes it to the MCP
server (dsh drops the rest of the inherited environment).

## Safety

dsh has no per-action confirmation for MCP tools, and these tools act on a real phone. The `handsy` skill tells the
agent to ask before anything that spends money, sends a message, calls someone, deletes data or changes security
settings, and to hand passwords and one-time codes to you. Review
the [skill](skills/handsy/SKILL.md) before you give the agent open-ended tasks.
```

**依据 3 · 作者声明**：[integrations/dsh/skills/handsy/SKILL.md:106-113](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/skills/handsy/SKILL.md#L106-L113)

一图一动作流程。

```text
## The see-act loop

1. Take a screenshot (`screenshot` tool, or `esp32agent screenshot` and read the PNG at `filePath`).
   It waits until the screen has settled after your last action.
2. Decide one action from what you see.
3. Do that one action, with coordinates in pixels of that full-size screenshot. If you used `--scale` or
   `--max-size`, convert the coordinates back to full size.
4. Take another screenshot and check the result before the next step. Never chain several taps blind.
```

**依据 4 · 作者声明**：[integrations/dsh/skills/handsy/SKILL.md:136-155](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/skills/handsy/SKILL.md#L136-L155)

作者的提示约束与失败信号。

<details>
<summary>查看原文（20行）</summary>

```text
## Safety

You are using a real phone with the owner's accounts, money and contacts.
- Ask the user to confirm before anything that spends money, sends a message, email or post, calls someone,
  deletes data, changes passwords or security settings, or accepts terms.
- Do not read or copy private content (messages, photos, codes, passwords) beyond what the task needs.
- If a screen asks for a password, passcode, Face ID or a one-time code, stop and hand it to the user.
- Stop and ask when the screen is not what you expected.

## Troubleshooting

| Error or symptom | What to do |
|---|---|
| `not paired` | Replug the board into the iPhone and run `pair` within 3 minutes |
| `screen mirroring is off` | Ask the user to start Screen Mirroring to ESP32 Agent |
| `video frozen` | Ask the user to stop and restart Screen Mirroring |
| `phone usb asleep` | The phone is locked; ask the user to unlock it |
| `busy: the app is using the phone` | The ESP32 Agent iOS app is driving the phone. Wait and retry later |
| `no cli service (firmware too old?)` | Update the board firmware to v0.2.2 or later at https://handsy.tech/install |
| `not supported on ESP32 Agent` | There is no app list, UI tree or file access; work from screenshots |
```

</details>

**依据 5 · 源码核查**：[integrations/dsh/cordis.patch.yml:6-17](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/cordis.patch.yml#L6-L17)

实际运行配置未提供逐动作审批。

<details>
<summary>查看原文（12行）</summary>

```text
      config:
        serverName: esp32agent
        transport: stdio
        command: npx
        args: [-y, esp32agent@0.1.5, mcp]
        # dsh scrubs the inherited env before spawning, so pass the board selector through explicitly.
        env: !!js "process.env.ESP32AGENT_DEVICE ? { ESP32AGENT_DEVICE: process.env.ESP32AGENT_DEVICE } : {}"
        # First run downloads the CLI binary; screenshots go through AirPlay decode.
        startupTimeoutMs: 120000
        toolCallTimeoutMs: 120000
        # Keep dsh usable when the board is unplugged; the tools report the error instead.
        failOnStartupError: false
```

</details>

#### 缺口

- 固定宿主和固件组合的截图时序、设备选择与权限边界未知
  **影响**：未验证任务过程中能持续对准同一设备
  **进一步探讨**：在空白测试机核对状态、误设备、冻结和恢复，不接真实账户

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 现有板卡用户何时值得采用，怎样保留人工退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已经具备板卡及无个人账户测试机的开发者，可以观察同一低风险页面导航是否可重复。先确认板号和屏幕状态，再完成一次无写入的导航，最后独立比对手机页面及截图并返回起点。相同任务用手动导航作基线。现金资源包括板、适配器和可能的模型输入，人工另计刷机、镜像、校准和处理断连。遇到意外页面、镜像冻结或不明确目标设备就停止，回到人工操作。现有证据不足以把扩展直接用于带账户设备的开放任务。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:21-51](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/README.md#L21-L51)

作者说明硬件、配置和低风险任务。

<details>
<summary>查看原文（31行）</summary>

````text
## Quick start

1. **Get a board.** Seeed Studio XIAO ESP32S3 (standard 8 MB flash / 8 MB PSRAM) with its antenna, and a short
   USB-C data cable (Lightning iPhones: a Lightning to USB Camera Adapter):
   [hardware guide](https://handsy.tech/docs/hardware).
2. **Flash the firmware** from your browser (Chrome or Edge, board on USB):
   [handsy.tech/install?build=testflight](https://handsy.tech/install?build=testflight). Firmware v0.2.3 or
   later (v0.2.2 works over Bluetooth only).
3. **Pair the computer** within 3 minutes of plugging the board into the iPhone (needs Node.js 18+ and `ffmpeg`):

   ```sh
   npx -y esp32agent pair
   ```

4. **Set up the iPhone:** join the board's Wi-Fi hotspot (`npx -y esp32agent net` shows its name and password),
   turn on **Control Center → Screen Mirroring → ESP32 Agent**, and enable
   **Settings → Accessibility → Touch → AssistiveTouch**.
   Optional: `npx -y esp32agent net join` puts the board on your home Wi-Fi instead, so dsh's commands and screenshots
   go over Wi-Fi rather than Bluetooth.
5. **Install the plugin** and restart `dsh web`:

   ```sh
   dsh plugin --profile web add dsh-esp32agent
   # or straight from GitHub
   dsh plugin --profile web add "github:onehumanbeing/esp32-iphone-agent#main&path:/integrations/dsh"
   ```

6. **Try a small task** in dsh:

   > Use the esp32agent tools to control my iPhone. Take a screenshot first, then open Settings, go into WLAN, and
   > tell me which Wi-Fi network the phone is connected to. Finally press Home.
````

</details>

**依据 2 · 作者声明**：[integrations/dsh/skills/handsy/SKILL.md:56-62](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/skills/handsy/SKILL.md#L56-L62)

配对与指针校准。

```text
## Pair (once per computer)

1. Plug the board into the iPhone. Within 3 minutes run `npx -y esp32agent pair`.
2. Start Screen Mirroring on the iPhone to ESP32 Agent.
3. `npx -y esp32agent screenshot` should now save a PNG of the phone's screen.
4. `npx -y esp32agent calibrate` measures the pointer. It also runs by itself before the earliest tap. It needs
   the pointer visible on screen.
```

**依据 3 · 作者声明**：[integrations/dsh/skills/handsy/SKILL.md:136-155](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/skills/handsy/SKILL.md#L136-L155)

停止及故障条件。

<details>
<summary>查看原文（20行）</summary>

```text
## Safety

You are using a real phone with the owner's accounts, money and contacts.
- Ask the user to confirm before anything that spends money, sends a message, email or post, calls someone,
  deletes data, changes passwords or security settings, or accepts terms.
- Do not read or copy private content (messages, photos, codes, passwords) beyond what the task needs.
- If a screen asks for a password, passcode, Face ID or a one-time code, stop and hand it to the user.
- Stop and ask when the screen is not what you expected.

## Troubleshooting

| Error or symptom | What to do |
|---|---|
| `not paired` | Replug the board into the iPhone and run `pair` within 3 minutes |
| `screen mirroring is off` | Ask the user to start Screen Mirroring to ESP32 Agent |
| `video frozen` | Ask the user to stop and restart Screen Mirroring |
| `phone usb asleep` | The phone is locked; ask the user to unlock it |
| `busy: the app is using the phone` | The ESP32 Agent iOS app is driving the phone. Wait and retry later |
| `no cli service (firmware too old?)` | Update the board firmware to v0.2.2 or later at https://handsy.tech/install |
| `not supported on ESP32 Agent` | There is no app list, UI tree or file access; work from screenshots |
```

</details>

#### 缺口

- 真实设备合格任务成本及人工纠偏频率未知
  **影响**：无法判断能否摊薄前置成本
  **进一步探讨**：同一空白手机重复做一个页面任务，对照人工耗时与错触

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 动作前检查截图是否过期能否减少误点？

**研究主题**：新假设与验证

#### 完整回答

可让测试动作携带上一张截图的设备和状态标识，服务端遇到设备变更或画面过期先要求重新截图。现有技能要求再看一张图，假设的增量是工具级拒绝无法确认的动作。用测试机在两个步骤间人为改变页面并对照普通单步指引和拒绝策略，记录错误点击、重新截图次数与完成率。若错误未降，或正常页面动画造成大量误拒，就不采用严格锁定。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/skills/handsy/SKILL.md:106-113](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/skills/handsy/SKILL.md#L106-L113)

当前观察与动作靠技能指导。

```text
## The see-act loop

1. Take a screenshot (`screenshot` tool, or `esp32agent screenshot` and read the PNG at `filePath`).
   It waits until the screen has settled after your last action.
2. Decide one action from what you see.
3. Do that one action, with coordinates in pixels of that full-size screenshot. If you used `--scale` or
   `--max-size`, convert the coordinates back to full size.
4. Take another screenshot and check the result before the next step. Never chain several taps blind.
```

**依据 2 · 作者声明**：[integrations/dsh/skills/handsy/SKILL.md:132-143](https://github.com/onehumanbeing/esp32-iphone-agent/blob/5a4fddfbb1f2ce25fee9de816f93259ec5e3b9fa/integrations/dsh/skills/handsy/SKILL.md#L132-L143)

记录复用和意外状态处理也是文本规则。

<details>
<summary>查看原文（12行）</summary>

```text
To reuse one, `intent show NAME`, convert its 0-1000 coordinates to pixels (x * width / 1000,
y * height / 1000), and check each screen against the step's reference screen. If the screen looks different,
drop the recorded steps and continue with the normal loop.

## Safety

You are using a real phone with the owner's accounts, money and contacts.
- Ask the user to confirm before anything that spends money, sends a message, email or post, calls someone,
  deletes data, changes passwords or security settings, or accepts terms.
- Do not read or copy private content (messages, photos, codes, passwords) beyond what the task needs.
- If a screen asks for a password, passcode, Face ID or a one-time code, stop and hand it to the user.
- Stop and ask when the screen is not what you expected.
```

</details>

#### 缺口

- 是否可取得可靠设备和屏幕时序标识未知
  **影响**：会影响拒绝规则可实现性
  **进一步探讨**：先测滚动和动画下的状态漂移，再试拒绝

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
