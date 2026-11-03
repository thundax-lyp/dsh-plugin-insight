# TapTap DSH Maker

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6cc6ad2](https://github.com/taptap/instant-games-open-mcp/tree/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taptap/instant-games-open-mcp) [![npm 30d 719](https://img.shields.io/static/v1?label=npm+30d&message=719&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/dsh-maker) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/dsh-maker)
<!-- END META -->

> **功能**：将 TapTap Maker MCP、工作流与功能技能以及固定 CLI 路径接入 DSH 的 bundle 插件。

> **亮点**：[Q01](#research-q01) 固定依赖解析、非重复扫描的技能挂载和CLI发现合并为DSH原生入口，减少路径猜测与手工配置责任。

> **主要限制**：[Q02](#research-q02) 宽容启动只作用外部MCP阶段，缺包可先throw；1小时等待不是取消，target_dir与意图约束是指南，不能当服务端权限保证。

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
  - [Q01 · DSH子包真实挂载什么，集成增量与Maker运行时能力如何分开归属？](#detail-section-11)
  - [Q02 · 启动失败、超时和项目身份边界是否由本插件强制保证？](#detail-section-12)
  - [Q03 · 什么条件下值得试用这个桥接子包，成本与可证伪的改进方向是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向已有或准备使用Maker的DSH游戏开发者，以明确项目的可解释状态作为接入验收。

[Q01](#research-q01) 对照裸MCP注册和临时npx路径；游戏构建/生成能力归Maker运行时，不归本子包原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Maker MCP桥接 | 在DSH访问Maker工具 | 实际能力由固定0.0.32 runtime提供，未运行 |
| 四份技能挂载 | 引导工作流、广告、存档、排行榜 | 指南不等于服务端授权或执行成功 |
| CLI路径发现 | 一次性初始化与诊断不猜路径 | 只解决入口，无网络下载不等于操作离线 |
| 宽容MCP启动配置 | 让外部客户端处理重连 | 路径解析先失败时尚未挂技能 |

**流程与依赖**

[Q03](#research-q03) 依赖表区分宿主peer、固定Maker运行时、目录与账号，路径可发现不等于离线操作。

[Q03](#research-q03) 步骤表先去重注册和只读状态，再依用户本地/远端意图操作。

**效果与成本**

[Q03](#research-q03) 分阶段表说明包、进程、服务和恢复成本未知；长超时不能消除远端未知结果。

[Q03](#research-q03) 效果表只确认集成和指南，未验证游戏交付或节时。

> **思考**：[Q02](#research-q02) 宽容启动只作用外部MCP阶段，缺包可先throw；1小时等待不是取消，target_dir与意图约束是指南，不能当服务端权限保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 固定依赖解析、非重复扫描的技能挂载和CLI发现合并为DSH原生入口，减少路径猜测与手工配置责任。

[Q01](#research-q01) require.resolve与shellEnv消除硬编码profile路径，技能provider隔离减少重复扫描；[Q02](#research-q02) 外部子插件持有重连/取消责任，启动解析失败仍可能阻断技能。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 宽容启动只作用外部MCP阶段，缺包可先throw；1小时等待不是取消，target_dir与意图约束是指南，不能当服务端权限保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 备份profile并确认L1/L2不重复，核实际Maker0.0.32入口；先显式target_dir读取状态。不因本地预览意图执行远端提交；缺CLI、重复注册或状态不匹配时停止并恢复配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包完整入口与四份技能材料核查，source；仅有试用集成，不宣称精确Maker制品或宿主运行通过，根仓能力不继承为本包验收。

- 已检查：作者 README、包清单、源码路径 packages/dsh-maker/package.json、packages/dsh-maker/cordis.patch.yml、packages/dsh-maker/lib/index.js、packages/dsh-maker/README.md、packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md、packages/dsh-maker/skills/taptap-ads/SKILL.md、packages/dsh-maker/skills/taptap-cloud-save/SKILL.md、packages/dsh-maker/skills/taptap-leaderboard/SKILL.md 及固定范围 inventory；组件：packages/dsh-maker。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅packages/dsh-maker完整inventory与实际lib入口、package/patch/README及DSH工作流；其他runtime包功能不混算，未核npm0.0.32制品。
- 下一步：未运行包、DSH、MCP或项目操作；后续隔离核缺包、MCP秒退、重复注册、错误目录和超时后远端状态。

**分析版本**

- **仓库**：[taptap/instant-games-open-mcp](https://github.com/taptap/instant-games-open-mcp)
- **版本号**：0.1.1（[固定提交 6cc6ad2](https://github.com/taptap/instant-games-open-mcp/tree/6cc6ad255adda2bebb84f0b92b5f21675c1038eb)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 未验证能力快照绑定实际runtime、工具、CLI与项目，比较现有inspect，测版本错用和恢复；无改善或误导即否定。

未运行包、DSH、MCP或项目操作；后续隔离核缺包、MCP秒退、重复注册、错误目录和超时后远端状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 407 | — | — | 6059 |
| .js | source | 1 | 124 | 72 | 43 | — |

</details>

**活跃度**

[![Issue 未关闭 34](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=34&color=737b86&logo=github)](https://github.com/taptap/instant-games-open-mcp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 293](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=293&color=737b86&logo=github)](https://github.com/taptap/instant-games-open-mcp/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 299](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=299&color=737b86&logo=github)](https://github.com/taptap/instant-games-open-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH集成子包能否在不混淆远端授权和运行时版本的前提下提供Maker工具、技能与CLI入口？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH子包真实挂载什么，集成增量与Maker运行时能力如何分开归属？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

这是原生DSH bundle插件，组件范围仅packages/dsh-maker。patch插入taptap-maker模块，apply首先解析随包@taptap/maker入口，检查必须是dist/maker.js并确认bin/taptap-maker存在，然后挂载skill-filesystem、shellEnv变量和stdio mcp-client。技能providerName为maker且includeDefaultRoots=false，只贡献本包guides而不再重复扫描用户/项目根；CLI路径通过shellEnv提供给模型，而不是假设node_modules/.bin在PATH。

目标用户是已有Maker项目或准备使用Maker的DSH游戏开发者。对照手动写裸MCP配置和临时npx执行，本包把固定依赖、工作流技能和CLI发现组合成单入口，减少路径猜测及重复技能配置。绝对路径随Node解析，不绑定一个profile的目录。这属于宿主集成贡献，不是本子包自己实现构建、素材生成或游戏预览。

package精确依赖@taptap/maker 0.0.32。仓库根最新Maker源码不等于安装得到的0.0.32制品；本次没有下载或运行该npm制品，不能把根仓所有功能直接列成本子包已验证能力。这里只确认工具桥接和指南挂载，具体工具清单及外部服务结果由运行时负责。本子包提供4份独立Skill文件，但它们被发现不等于模型会遵守所有流程或API已经可用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-maker/cordis.patch.yml:9-11](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/cordis.patch.yml#L9-L11)

bundle真实单入口。

```text
- insert:
    - id: taptap-maker
      name: '@taptap/dsh-maker'
```

**依据 2 · 源码核查**：[packages/dsh-maker/lib/index.js:43-56](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/lib/index.js#L43-L56)

运行时解析并校验Maker与CLI路径。

<details>
<summary>查看原文（14行）</summary>

```text
function resolveMakerPaths() {
  const mcpEntry = require.resolve('@taptap/maker');
  const expectedSuffix = path.join('dist', 'maker.js');
  if (!mcpEntry || !mcpEntry.endsWith(expectedSuffix)) {
    throw new Error(
      `@taptap/dsh-maker: unexpected @taptap/maker entry "${mcpEntry}"; expected .../${expectedSuffix}`
    );
  }
  const packageRoot = path.dirname(path.dirname(mcpEntry));
  const cliEntry = path.join(packageRoot, 'bin', 'taptap-maker');
  if (!existsSync(cliEntry)) {
    throw new Error(`@taptap/dsh-maker: @taptap/maker CLI missing at "${cliEntry}"`);
  }
  return { mcpEntry, cliEntry };
```

</details>

**依据 3 · 源码核查**：[packages/dsh-maker/lib/index.js:83-110](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/lib/index.js#L83-L110)

技能provider和CLI环境变量实际注册。

<details>
<summary>查看原文（28行）</summary>

```text
export async function apply(ctx, config = {}) {
  const makerPaths = resolveMakerPaths();

  // 1. Skills — host-plane repository-plugin pattern. Isolated provider name and
  //    default-roots disabled so it only contributes this package's own guides,
  //    never double-scanning the project/user roots owned by the standard preset.
  ctx.plugin(skillFilesystem, {
    providerName: 'maker',
    includeDefaultRoots: false,
    bundledSkillDir: path.join(PACKAGE_ROOT, 'skills'),
  });

  // 2. CLI discoverability — expose the bundled `taptap-maker` CLI to the model
  //    shell so one-time init / upgrade / report commands work with zero network
  //    and zero path guessing. The profile's node_modules/.bin is not on the
  //    shell PATH, so this DSH shell-env fact is the reliable channel.
  ctx.shellEnv.register({
    name: 'taptap-maker',
    variables: {
      DSH_TAPTAP_MAKER_BIN: {
        description:
          'Absolute path to the bundled TapTap Maker CLI (bin/taptap-maker); run `node "$DSH_TAPTAP_MAKER_BIN" <subcommand>`.',
      },
    },
    resolve() {
      return { DSH_TAPTAP_MAKER_BIN: makerPaths.cliEntry };
    },
  });
```

</details>

**依据 4 · 源码核查**：[packages/dsh-maker/lib/index.js:112-123](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/lib/index.js#L112-L123)

以绝对Node+Maker入口挂stdio MCP。

<details>
<summary>查看原文（12行）</summary>

```text
  // 3. Maker MCP — self-contained stdio bridge over the bundled @taptap/maker.
  const mcp = resolveMcpConfig(config);
  await ctx.plugin(mcpClient, {
    transport: 'stdio',
    command: process.execPath,
    args: [makerPaths.mcpEntry],
    serverName: mcp.serverName,
    env: mcp.env,
    toolCallTimeoutMs: mcp.toolCallTimeoutMs,
    failOnStartupError: mcp.failOnStartupError,
    ...(mcp.cwd ? { cwd: mcp.cwd } : {}),
  });
```

</details>

**依据 5 · 源码核查**：[packages/dsh-maker/package.json:45-47](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/package.json#L45-L47)

依赖固定到0.0.32。

```text
  "dependencies": {
    "@taptap/maker": "0.0.32"
  },
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动失败、超时和项目身份边界是否由本插件强制保证？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

默认工具超时1小时，是传给mcp-client的调用等待预算，不是远端构建取消或事务回滚保证。默认failOnStartupError=false意图让MCP失败时技能仍存在，重连由外部子插件负责；但resolveMakerPaths在挂技能之前执行，包解析失败、入口后缀不符或CLI不存在会先throw，不能概括成“所有启动失败都保留技能”。外部mcp-client的重连、取消和宿主生命周期没有在此子包中重新实现。

DSH使用约束写在技能和README中：无MCP Roots，需要每次项目工具显式target_dir；不读MCP Resources，应改用状态工具；初始化要--skip-mcp-install，避免再写L1裸MCP注册。README明确L1与L2不要同时启用，否则serverName冲突。插件默认不设置cwd，避免将全局MCP绑死一个项目，但这也意味着项目选择不能依靠启动目录代填。

流程指南明确将本地控制台/预览与远端commit/push/build分开，远端动作依用户意图。它是给Agent的文字政策，apply没有每次调用审批或项目授权校验逻辑，因此不能当成服务端强制许可。技能声称Maker构建工具有remote-sync安全门，也不能用技能原文替代对精确runtime的核查。其正向价值是减少常见误用，核心限制是指导、桥接与实际执行保证分属不同层。

同样，“CLI入口零网络”只说明无需npx临时下载来找到CLI，不表示init、构建或素材服务离线运行。账号、网络与服务资源仍由Maker实际操作决定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-maker/lib/index.js:64-80](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/lib/index.js#L64-L80)

1小时超时、宽容启动和默认环境/cwd。

<details>
<summary>查看原文（17行）</summary>

```text
function resolveMcpConfig(config) {
  const mcp = config && typeof config.mcp === 'object' ? config.mcp : {};
  return {
    serverName: mcp.serverName ?? 'taptap-maker',
    toolCallTimeoutMs: mcp.toolCallTimeoutMs ?? DEFAULT_TOOL_CALL_TIMEOUT_MS,
    // Keep the Maker MCP child lenient on startup: this plugin also mounts the
    // skills, and a transient Maker startup failure must neither dispose those
    // skills nor block DSH startup. The mcp-client still logs the failure and
    // keeps reconnecting, so a broken server is loud without being fatal.
    failOnStartupError: mcp.failOnStartupError ?? false,
    env: {
      TAPTAP_MCP_CLIENT_IDE: 'dsh',
      TAPTAP_MAKER_DISTRIBUTION: 'dsh_plugin',
      ...(mcp.env ?? {}),
    },
    cwd: mcp.cwd,
  };
```

</details>

**依据 2 · 源码核查**：[packages/dsh-maker/lib/index.js:83-93](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/lib/index.js#L83-L93)

路径解析先于技能挂载。

<details>
<summary>查看原文（11行）</summary>

```text
export async function apply(ctx, config = {}) {
  const makerPaths = resolveMakerPaths();

  // 1. Skills — host-plane repository-plugin pattern. Isolated provider name and
  //    default-roots disabled so it only contributes this package's own guides,
  //    never double-scanning the project/user roots owned by the standard preset.
  ctx.plugin(skillFilesystem, {
    providerName: 'maker',
    includeDefaultRoots: false,
    bundledSkillDir: path.join(PACKAGE_ROOT, 'skills'),
  });
```

</details>

**依据 3 · 作者声明**：[packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md:9-15](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md#L9-L15)

target_dir与Resources的宿主约束。

```text

## DSH 特有约束（必须遵守）

- **无 MCP Roots**：DSH 不广播工作区，每次项目相关的 Maker 工具调用都要**显式传 `target_dir`**（当前游戏工程目录）。不要依赖客户端注入的 workspace。
- **无 MCP Resources**：DSH 只桥接 tools，读不到 `maker://status` 等资源。用工具补位：状态用 `maker_status_lite`，广告用 `get_ad_config`，不要尝试读 `maker://*` 资源。
- **AGENTS.md 已自动加载**：工程根 `AGENTS.md`（含 Maker 管理的策略块）已由 DSH 自动注入为上下文，本 skill 不再重复其中的策略；冲突时以 `AGENTS.md` 为准。
- 其它功能（广告/云存档/排行榜）另有专项 skill：`taptap-ads`、`taptap-cloud-save`、`taptap-leaderboard`，按需加载。
```

**依据 4 · 作者声明**：[packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md:46-57](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md#L46-L57)

明确本地与远端操作意图。

<details>
<summary>查看原文（12行）</summary>

```text
| 初始化 / 配置 / 继续 Maker 本地开发  | 运行 `node "$DSH_TAPTAP_MAKER_BIN" init --skip-mcp-install`（插件已提供 MCP，不重复安装）                                        |
| clone / 下载 Maker 项目              | 走“初始化流程”（`init --skip-mcp-install`），不要直接索要 app_id                                                                 |
| 状态 / 是否就绪                      | 调 `maker_status_lite`，显式传 `target_dir=<PROJECT>`，再按 `AGENTS.md` 的同步提示处理                                           |
| 升级 Maker 插件                      | 走 DSH 插件渠道：`dsh plugin --profile <profile> update @taptap/dsh-maker`，不跑独立 MCP 安装                                    |
| 升级旧项目策略 / 工程 AGENTS 块      | 跑 `node "$DSH_TAPTAP_MAKER_BIN" agents update --target-dir <PROJECT>`                                                           |
| 打开本地控制台                       | 跑 `node "$DSH_TAPTAP_MAKER_BIN" console open --target-dir <PROJECT> --json`，不触发远端构建                                     |
| 本地预览 / 刷新 / 停止               | 分别调用 `preview status`、`preview start`、`preview refresh` 或 `preview stop`，每次都带 `--target-dir <PROJECT>`，不提交或推送 |
| 远端提交 / 推送 / 构建               | 先展示本地 Git 状态和变更摘要，得到对应用户意图后再调用 `maker_build_current_directory`                                          |
| 拉取 / 更新                          | 先看本地改动；工作区有未提交内容时，先说明选项再拉取                                                                             |
| 冲突 / 合并失败                      | 解释冲突原因、列出冲突文件、查看冲突 hunk、给出方案并询问后再改                                                                  |
| 预览 / 跑一下 / 看效果               | 先澄清用户要本地还是远端；本地走 CLI，不提交或推送；远端只有明确确认后才调用 `maker_build_current_directory`                     |
| 验证代码 / 跑测试 / lint             | 不触发 Maker 远端构建，除非用户明确要求远端构建、远端运行或远端预览                                                              |
```

</details>

**依据 5 · 作者声明**：[packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md:64-77](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md#L64-L77)

防重复安装与远端安全门的指南声明。

<details>
<summary>查看原文（14行）</summary>

```text
> 初始化一律带 `--skip-mcp-install`：本插件已通过 DSH 注册 Maker MCP，重复安装会写入 L1 的
> `mcp-taptap-maker` 行并造成双激活。

## 构建 / 提交策略（覆盖通用 Git 流程）

- 绑定 Maker 项目（存在 `.maker-mcp/config.json`）时，远端提交/推送/构建才走
  `maker_build_current_directory`；调用时显式传当前工程的 `target_dir`。
- 打开本地控制台和窗口预览是本地 CLI 能力，不提交、不推送、不启动远端构建。只有随包
  Maker runtime 实际支持对应本地命令时才报告本地预览可用；不支持时说明限制并等待用户
  明确选择远端流程。
- 本地窗口预览不要求 Git clean；联网项目只复用已有 Maker 登录和远端测试版本，不自动上传
  Server 代码。Server 改动必须显式执行远端构建后才生效。
- 不要为 Maker 提交/构建建 feature 分支、task 分支或 PR/MR，不要用通用 git commit/push 作为替代。
- `maker_build_current_directory` 拥有安全门：提交前校验 remote sync，本地落后/分叉/不在 main/无法验证时会阻止。
```

</details>

**依据 6 · 作者声明**：[packages/dsh-maker/README.md:14-25](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/README.md#L14-L25)

L1/L2冲突与固定版本迁移。

<details>
<summary>查看原文（12行）</summary>

````text
本插件是仓库 DSH 集成的 **L2 形态**（bundle 插件）。它区别于已有的
**L1 形态**（`taptap-maker install --ide dsh` 写入 `$DSH_HOME/cordis.patch.yml`）：
L1 只注册一个裸的 Maker MCP；本插件则把 **MCP + 技能** 打包成可分发、可一键安装、可 HMR 的
DSH bundle。两者不要同时启用，避免同 `serverName` 冲突。已用 L1 时，不要手改 YAML；安装前用
Maker CLI 的结构化命令检查并迁移旧注册：

```bash
npx -y --package @taptap/maker@<maker-version> taptap-maker plugin inspect --client dsh --json
npx -y --package @taptap/maker@<maker-version> taptap-maker plugin migrate --client dsh --confirm --json
```

`<maker-version>` 使用本包 `package.json` 中 `dependencies["@taptap/maker"]` 的精确值；固定版本
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么条件下值得试用这个桥接子包，成本与可证伪的改进方向是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证、依赖、兼容与流程

#### 完整回答

已有Maker工作流且希望在DSH中继续的用户，可先以本地只读状态验证集成。没有Maker项目或只想接普通小游戏API的人，应先区分根MCP和Maker，不因同仓而安装错入口。试用成功判据是技能能被读取、CLI路径存在、唯一的Maker MCP注册可列工具并对明确target_dir返回可解释状态，而不是自动生成或发布游戏。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH/Cordis及mcp-client、shell-env、skill-filesystem peers | 启动必需 | 子插件与shell环境 | profile兼容未运行，按生效配置与日志核对 |
| @taptap/maker 0.0.32及本机Node | 启动必需 | MCP与CLI可解析入口 | 缺包或CLI直接失败，指南可能也尚未挂载 |
| pnpm及对应profile权限 | 安装时必需 | 材料化依赖和bundle | 本次不执行安装 |
| target_dir与Maker项目配置 | 项目调用必需 | 明确操作对象 | 不依赖MCP Roots，错误目录需停止 |
| Maker账号、网络及资源权限 | 特定操作必需 | 登录、远端构建或素材服务 | 费用/额度未核，不称零成本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 检查 | 用户备份profile，确认无旧L1重复注册 | inspect结果可解释，迁移由用户明确执行 |
| 加载 | 用户装固定插件并检查生效配置 | 只有一个serverName，CLI变量指向固定依赖 |
| 只读验收 | Agent显式target_dir查状态，用户核对目录 | 状态匹配实际项目，不先提交或构建 |
| 后续操作 | 用户逐项给出本地或远端意图 | 不用本地预览请求代替远端构建授权 |
| 退出 | 用户移除bundle，核旧注册与子进程 | 必要时恢复profile；另核账号/项目配置不自动删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包与依赖存储，下载用量未知 | profile迁移、依赖与项目核对 | 无安装耗时实测 |
| 持续使用 | MCP子进程与具体Maker服务 | 指定目录、检查意图和输出 | 不由本地CLI路径推定无网络费用 |
| 失败恢复 | 远端请求可能仍运行 | 查MCP日志、进程及远端结果 | 1小时超时不等于停止 |
| 升级/退出 | 固定依赖更新及保留文件 | 重验包能力、去重注册和清理 | 不依赖latest自动兼容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 接入便利 | 固定包路径+技能+CLI单入口 | 实际少多少配置错误或耗时 |
| 工作流约束 | target_dir与本地/远端指南明确 | 模型是否遵守、runtime是否阻止误操作 |
| 游戏交付 | 只确认桥接 | 构建、素材质量、预览和发布效果 |

未验证改进是假设在现有inspect/状态之外返回一份不含秘密的能力快照，绑定实际Maker版本、CLI入口、可用工具和目标项目，并将指南要求与runtime实际能力并列。现有绝对路径和inspect是参照，不重复制造新安装器。对照当前流程，用旧L1、缺CLI、较老runtime和错误target_dir四类场景，测错误指令、错误目录操作和恢复时间；若现有诊断已足够或新增快照误导版本能力，则否定。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-maker/README.md:112-126](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/README.md#L112-L126)

官方移除与排障入口。

<details>
<summary>查看原文（15行）</summary>

````text
## 卸载

```bash
dsh plugin --profile web remove @taptap/dsh-maker
```

## 排障

| 现象                                 | 处理                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `dsh plugin` 报 `pnpm not found`     | 先装 pnpm（或 `npm i -g pnpm`）                                                                        |
| 工具列表没有 `mcp__taptap-maker__*`  | `dsh --profile web --dump-config` 确认 patch 合成；看 DSH 日志里的 `mcp-client(taptap-maker)` 重连信息 |
| 工具调用约 60s 超时                  | 确认生效的是本插件的 1h 超时配置，而非旧的裸 `npx` 行                                                  |
| 广告/云存档等接口用错                | 触发 `taptap-ads`/`taptap-cloud-save` 等技能，读工程内 `engine-docs`，不要网上搜索                     |
| 与 L1 同时存在导致 `serverName` 冲突 | 运行 `plugin inspect --client dsh` 检查，再用 `plugin migrate --client dsh --confirm` 结构化禁用旧注册 |
````

</details>

**依据 2 · 源码核查**：[packages/dsh-maker/lib/index.js:43-56](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/lib/index.js#L43-L56)

可核验能力快照的固定入口基础。

<details>
<summary>查看原文（14行）</summary>

```text
function resolveMakerPaths() {
  const mcpEntry = require.resolve('@taptap/maker');
  const expectedSuffix = path.join('dist', 'maker.js');
  if (!mcpEntry || !mcpEntry.endsWith(expectedSuffix)) {
    throw new Error(
      `@taptap/dsh-maker: unexpected @taptap/maker entry "${mcpEntry}"; expected .../${expectedSuffix}`
    );
  }
  const packageRoot = path.dirname(path.dirname(mcpEntry));
  const cliEntry = path.join(packageRoot, 'bin', 'taptap-maker');
  if (!existsSync(cliEntry)) {
    throw new Error(`@taptap/dsh-maker: @taptap/maker CLI missing at "${cliEntry}"`);
  }
  return { mcpEntry, cliEntry };
```

</details>

**依据 3 · 源码核查**：[packages/dsh-maker/lib/index.js:64-80](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/lib/index.js#L64-L80)

等待与实际停止不是同一机制。

<details>
<summary>查看原文（17行）</summary>

```text
function resolveMcpConfig(config) {
  const mcp = config && typeof config.mcp === 'object' ? config.mcp : {};
  return {
    serverName: mcp.serverName ?? 'taptap-maker',
    toolCallTimeoutMs: mcp.toolCallTimeoutMs ?? DEFAULT_TOOL_CALL_TIMEOUT_MS,
    // Keep the Maker MCP child lenient on startup: this plugin also mounts the
    // skills, and a transient Maker startup failure must neither dispose those
    // skills nor block DSH startup. The mcp-client still logs the failure and
    // keeps reconnecting, so a broken server is loud without being fatal.
    failOnStartupError: mcp.failOnStartupError ?? false,
    env: {
      TAPTAP_MCP_CLIENT_IDE: 'dsh',
      TAPTAP_MAKER_DISTRIBUTION: 'dsh_plugin',
      ...(mcp.env ?? {}),
    },
    cwd: mcp.cwd,
  };
```

</details>

**依据 4 · 作者声明**：[packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md:46-57](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/packages/dsh-maker/skills/taptap-maker-dsh/SKILL.md#L46-L57)

试用步骤的既有指南。

<details>
<summary>查看原文（12行）</summary>

```text
| 初始化 / 配置 / 继续 Maker 本地开发  | 运行 `node "$DSH_TAPTAP_MAKER_BIN" init --skip-mcp-install`（插件已提供 MCP，不重复安装）                                        |
| clone / 下载 Maker 项目              | 走“初始化流程”（`init --skip-mcp-install`），不要直接索要 app_id                                                                 |
| 状态 / 是否就绪                      | 调 `maker_status_lite`，显式传 `target_dir=<PROJECT>`，再按 `AGENTS.md` 的同步提示处理                                           |
| 升级 Maker 插件                      | 走 DSH 插件渠道：`dsh plugin --profile <profile> update @taptap/dsh-maker`，不跑独立 MCP 安装                                    |
| 升级旧项目策略 / 工程 AGENTS 块      | 跑 `node "$DSH_TAPTAP_MAKER_BIN" agents update --target-dir <PROJECT>`                                                           |
| 打开本地控制台                       | 跑 `node "$DSH_TAPTAP_MAKER_BIN" console open --target-dir <PROJECT> --json`，不触发远端构建                                     |
| 本地预览 / 刷新 / 停止               | 分别调用 `preview status`、`preview start`、`preview refresh` 或 `preview stop`，每次都带 `--target-dir <PROJECT>`，不提交或推送 |
| 远端提交 / 推送 / 构建               | 先展示本地 Git 状态和变更摘要，得到对应用户意图后再调用 `maker_build_current_directory`                                          |
| 拉取 / 更新                          | 先看本地改动；工作区有未提交内容时，先说明选项再拉取                                                                             |
| 冲突 / 合并失败                      | 解释冲突原因、列出冲突文件、查看冲突 hunk、给出方案并询问后再改                                                                  |
| 预览 / 跑一下 / 看效果               | 先澄清用户要本地还是远端；本地走 CLI，不提交或推送；远端只有明确确认后才调用 `maker_build_current_directory`                     |
| 验证代码 / 跑测试 / lint             | 不触发 Maker 远端构建，除非用户明确要求远端构建、远端运行或远端预览                                                              |
```

</details>

#### 缺口

- 未做同任务接入/故障对照与精确制品验收
  **影响**：试用是条件判断，改进与成本收益未知
  **进一步探讨**：固定profile和runtime后按本题四类异常测误操作与恢复时间，未改善即放弃。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
