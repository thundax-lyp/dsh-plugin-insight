# FIU Finance MCP for DeepSeek Harness

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[48cd231](https://github.com/fiu-ai/mcp-server/tree/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fiu-ai/mcp-server)
<!-- END META -->

> **功能**：通过标准输入输出适配器把 FIU 金融数据服务接入 DSH。

> **亮点**：[Q01](#research-q01) 识别的增量是可按子目录安装的配置、固定适配器版本及环境约定；协议转发和金融数据属于外部依赖。

> **主要限制**：[Q03](#research-q03) 显示请求成功仍可能没有业务行；[Q04](#research-q04) 的远端目录也不随adapter版本冻结，不能以配置加载成功证明数据足够完成任务。

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
  - [Q01 · 从子目录安装到远端金融查询，实际由谁执行，组件的增量是什么？](#detail-section-11)
  - [Q02 · 密钥、URL和失败处理如何接线，有哪些不能保证的边界？](#detail-section-12)
  - [Q03 · 一次合格查询有哪些操作和成本，如何识别空结果？](#detail-section-13)
  - [Q04 · 动态远端目录怎样影响能力承诺，可推导什么可证伪改进？](#detail-section-14)
  - [Q05 · 谁值得尝试，何时停止并退回原办法？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 FIU 授权的 DSH 用户，将行情与公告等远端查询接入对话。

直接使用FIU界面或手工填写同一MCP客户端配置。组件简化配置分发，不替代数据复核。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| FIU MCP配置组合 | 将远端金融查询接到DSH profile | 依赖官方客户端、npx和授权；动态工具数量未核实 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH MCP客户端与profile | 必需 | 装载patch和暴露工具 | 不出现对应工具；README只声明0.1.1-rc.2 |
| npx、Node >=20.18.1、adapter1.0.1 | 必需 | 启动stdio代理 | 启动失败不阻止整个profile |
| FIU账号密钥与托管服务 | 数据查询必需 | 授权并返回金融数据 | 缺密钥报错、服务可返回empty；收费和配额未知 |
| FIU_MCP_URL | 可选 | 替换默认端点 | 用户需核对HTTP/HTTPS与目标可信性 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户确认账号权限，设置环境并安装子目录bundle | profile、npx及密钥可识别 |
| 2 | 宿主启动MCP客户端和适配器 | 保存实际目录；缺工具分别排查依赖 |
| 3 | 用户提出一个已知标的只读查询 | 检查市场、时间和业务行；empty不作行情结论 |
| 4 | 用户核对错误与费用，必要时撤回bundle | 返回原服务界面并按账号规则撤销密钥 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 账号/包下载成本未知 | 配置profile和密钥，耗时未知 | 不假定服务免费 |
| 持续使用 | 服务、网络和模型成本未知 | 核对数据时效与空值 | 没有合格率或调用量测量 |
| 失败恢复 | 重试和重新连接资源未知 | 排查环境、权限及结果语义 | 先核对原服务，避免盲目重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一接入 | 固定patch连接stdio与HTTP代理 | 发行包与宿主实际加载 |
| 数据查询 | 作者描述金融目录与empty | 数据准确性、实时性、合格率 |
| 配置复用 | 子目录安装及环境约定 | 端到端节时或总费用下降 |

> **思考**：[Q03](#research-q03) 显示请求成功仍可能没有业务行；[Q04](#research-q04) 的远端目录也不随adapter版本冻结，不能以配置加载成功证明数据足够完成任务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 识别的增量是可按子目录安装的配置、固定适配器版本及环境约定；协议转发和金融数据属于外部依赖。

[Q02](#research-q02) 的认证头临时文件与finally清理值得作为命令行代理的实现参考，但移植时仍需审查异常退出和宿主环境继承；本组件自身保持小型配置组合。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示请求成功仍可能没有业务行；[Q04](#research-q04) 的远端目录也不随adapter版本冻结，不能以配置加载成功证明数据足够完成任务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先核实账号权限、目录和收费，再对一个已知标的核对时间与业务行；信息无法回查时停用并回到原界面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置接线已检查；托管数据、发行包一致性与效果尚未验证，未来检查方案属于假设。

- 已检查：作者 README、包清单、源码路径 plugins/fiu-finance-mcp-dsh/package.json、plugins/fiu-finance-mcp-dsh/cordis.patch.yml、plugins/fiu-finance-mcp-dsh/README.md、package.json、src/cli.js 及固定范围 inventory；组件：plugins/fiu-finance-mcp-dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计只覆盖固定子目录；为解释关键依赖，另读同仓根package.json和src/cli.js，不将其规模算成子组件。托管端实现与npm实物未知。
- 下一步：未运行目标。可在授权后对同一已知标的保存目录与结果，比较空结果识别和人工复核；若新增检查不减误判而增加负担，则否定假设。

**分析版本**

- **仓库**：[fiu-ai/mcp-server](https://github.com/fiu-ai/mcp-server)
- **版本号**：0.1.0（[固定提交 48cd231](https://github.com/fiu-ai/mcp-server/tree/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出保存目录摘要并核对数据时间与empty状态的未验证假设，以误判和额外人工时间共同检验价值。

未运行目标。可在授权后对同一已知标的保存目录与结果，比较空结果识别和人工复核；若新增检查不减误判而增加负担，则否定假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 44 | — | — | 258 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/fiu-ai/mcp-server/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/fiu-ai/mcp-server/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/fiu-ai/mcp-server/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：此配置组件能否让已有FIU账号的DSH用户获得可核对的数据，以及比手工MCP配置多做了什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从子目录安装到远端金融查询，实际由谁执行，组件的增量是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

本组件提供可加载的配置组合，不自带金融数据库或独立工具实现。已有 FIU 账号、希望在 DSH 对话中查行情或公告的用户，可以用同一个子目录安装入口取得配置；合格结果应包括目标市场、标的、数据时间和可核对的原始返回，而不是只收到工具调用成功。

patch 把官方 MCP 客户端挂到 profile，以 npx 启动固定的 fiu-finance-mcp@1.0.1，并传两个 FIU 环境变量。根适配器源码将 URL 和认证头交给 mcp-remote，以 http-only 方式连接托管服务；真正的金融目录和数据在远端。相对自行填写 MCP 配置，增量是可分发的安装位置、固定适配器版本和统一环境变量，MCP 协议、工具转发和数据覆盖不能归功于本组件。

README 所列工具名称是作者举例，不是此组件的静态注册。未核对 npm tarball 与该 Git 源码逐字一致，也未取得托管服务本轮目录，因此不能把作者声称的 104 endpoints 写成实际可用的 104 个 DSH 工具。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/fiu-finance-mcp-dsh/cordis.patch.yml:4-18](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/cordis.patch.yml#L4-L18)

挂载客户端、固定adapter版本、env与启动错误策略。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: mcp-fiu-finance
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: fiu-finance
        transport: stdio
        command: npx
        args:
          - --yes
          - fiu-finance-mcp@1.0.1
        env:
          FIU_API_KEY: !!js process.env.FIU_API_KEY ?? ''
          FIU_MCP_URL: !!js process.env.FIU_MCP_URL ?? ''
        toolCallTimeoutMs: 180000
        failOnStartupError: false
```

</details>

**依据 2 · 源码核查**：[src/cli.js:117-142](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/src/cli.js#L117-L142)

适配器构造HTTP转发参数与授权头。

<details>
<summary>查看原文（26行）</summary>

```text
export function buildProxyInvocation(options, env = process.env) {
  const url = validateUrl(options.url);
  const childEnv = { ...env };
  const hasAuthorizationHeader = options.headers.some((header) =>
    /^authorization\s*:/i.test(header),
  );
  const headers = [...options.headers];

  if (!hasAuthorizationHeader) {
    const apiKey = options.apiKey.trim();
    if (!apiKey) {
      throw new Error(
        "Missing API key. Set FIU_API_KEY or pass --api-key <key>.",
      );
    }
    childEnv[AUTH_ENV_NAME] = `Bearer ${apiKey}`;
    headers.unshift(`Authorization:\${${AUTH_ENV_NAME}}`);
  }

  const proxyArgs = [url, "--transport", "http-only"];
  for (const header of headers) {
    proxyArgs.push("--header", header);
  }
  proxyArgs.push(...options.forwarded);

  return { proxyArgs, childEnv };
```

</details>

**依据 3 · 作者声明**：[plugins/fiu-finance-mcp-dsh/README.md:11-17](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/README.md#L11-L17)

作者描述兼容版本及目录范围。

```text
Compatible with: dsh 0.1.1-rc.2

## What it provides

This bundle injects DeepSeek Harness's `@deepseek-ai/dsh-mcp-client` and starts the published `fiu-finance-mcp` stdio adapter. The adapter forwards MCP calls to `https://ai.szfiu.com/api/mcp/v2` and exposes the current FIU catalog: 26 business toolsets, 104 endpoints and the `describe_tool` and `search` helper tools.

The resulting tools use names such as `mcp__fiu-finance__quote_spot` and `mcp__fiu-finance__company_announcements`.
```

#### 缺口

- 未取得npm适配器实物及托管端工具目录。
  **影响**：无法确认安装后实际工具集合。
  **进一步探讨**：对齐1.0.1包内容，并在已授权账号下保存tools/list与一个只读查询回执。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 密钥、URL和失败处理如何接线，有哪些不能保证的边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

配置将 FIU_API_KEY 与可选 FIU_MCP_URL 从启动环境带入子进程；空值不在 patch 内补造。根适配器优先使用环境值，并允许参数覆盖；未显式提供 Authorization 时，空 API key 会在发起转发前报错。URL只限制为HTTP或HTTPS，并非强制HTTPS，因此修改地址的人还要核对目标和传输条件，不能假定任何覆盖地址都与默认服务同等可信。

适配器没有把默认认证值直接拼到命令行。它将认证头放入权限0600的临时文件，以header-file参数交给mcp-remote，子进程关闭后在finally删除临时目录；这是一种降低进程参数暴露的实现安排，并不能证明所有异常退出都无残留。它使用继承stdio和环境的子进程，不应把README“只接收显式FIU变量”的描述扩大成已核实的宿主环境隔离保证。

patch的180000毫秒调用超时与failOnStartupError=false说明组件选择不让启动错误阻止整份profile；它不证明工具已经连通，也不代表金融数据查询在超时后没有发生。官方MCP客户端和mcp-remote的实际版本行为未在本组件源码中实现，本研究只将这些列为外部依赖。

#### 证据与依据

**依据 1 · 源码核查**：[src/cli.js:45-48](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/src/cli.js#L45-L48)

环境默认值。

```text
export function parseArgs(args, env = process.env) {
  let apiKey = env.FIU_API_KEY?.trim() || "";
  let url = env.FIU_MCP_URL?.trim() || DEFAULT_URL;
  let help = false;
```

**依据 2 · 源码核查**：[src/cli.js:102-142](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/src/cli.js#L102-L142)

HTTP/HTTPS校验、缺密钥报错和授权头占位。

<details>
<summary>查看原文（41行）</summary>

```text
function validateUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid MCP URL: ${value}`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("MCP URL must use http:// or https://");
  }

  return parsed.toString();
}

export function buildProxyInvocation(options, env = process.env) {
  const url = validateUrl(options.url);
  const childEnv = { ...env };
  const hasAuthorizationHeader = options.headers.some((header) =>
    /^authorization\s*:/i.test(header),
  );
  const headers = [...options.headers];

  if (!hasAuthorizationHeader) {
    const apiKey = options.apiKey.trim();
    if (!apiKey) {
      throw new Error(
        "Missing API key. Set FIU_API_KEY or pass --api-key <key>.",
      );
    }
    childEnv[AUTH_ENV_NAME] = `Bearer ${apiKey}`;
    headers.unshift(`Authorization:\${${AUTH_ENV_NAME}}`);
  }

  const proxyArgs = [url, "--transport", "http-only"];
  for (const header of headers) {
    proxyArgs.push("--header", header);
  }
  proxyArgs.push(...options.forwarded);

  return { proxyArgs, childEnv };
```

</details>

**依据 3 · 源码核查**：[src/cli.js:160-183](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/src/cli.js#L160-L183)

继承stdio/env并清理临时目录。

<details>
<summary>查看原文（24行）</summary>

```text
export function runProxy(proxyBin, proxyArgs, childEnv, spawnImpl = spawn) {
  return prepareHeaders(proxyArgs, childEnv).then(
    async ({ args, temporaryDirectory }) => {
      try {
        return await new Promise((resolveExitCode, reject) => {
          const child = spawnImpl(process.execPath, [proxyBin, ...args], {
            stdio: "inherit",
            env: childEnv,
            windowsHide: true,
          });

          child.once("error", reject);
          child.once("close", (code, signal) => {
            if (signal) {
              reject(new Error(`mcp-remote stopped after receiving ${signal}`));
              return;
            }
            resolveExitCode(code ?? 1);
          });
        });
      } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
      }
    },
```

</details>

**依据 4 · 源码核查**：[src/cli.js:216-231](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/src/cli.js#L216-L231)

0600头文件和header-file传递。

<details>
<summary>查看原文（16行）</summary>

```text
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), "fiu-finance-mcp-"),
  );
  const headerFile = join(temporaryDirectory, "headers.txt");
  try {
    await writeFile(headerFile, `${headers.join("\n")}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch (error) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    throw error;
  }
  args.splice(3, 0, "--header-file", headerFile);

  return { args, temporaryDirectory };
```

</details>

**依据 5 · 源码核查**：[plugins/fiu-finance-mcp-dsh/cordis.patch.yml:14-18](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/cordis.patch.yml#L14-L18)

env、超时及非致命启动错误。

```text
        env:
          FIU_API_KEY: !!js process.env.FIU_API_KEY ?? ''
          FIU_MCP_URL: !!js process.env.FIU_MCP_URL ?? ''
        toolCallTimeoutMs: 180000
        failOnStartupError: false
```

#### 缺口

- 宿主客户端注入环境和mcp-remote异常退出行为未独立核实。
  **影响**：不能承诺进程级密钥隔离或所有故障都自动恢复。
  **进一步探讨**：固定实际客户端及mcp-remote版本，检查环境白名单、取消与临时文件异常退出路径。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 一次合格查询有哪些操作和成本，如何识别空结果？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

先准备兼容的DSH profile、npx及账号密钥，再安装子目录bundle并重载环境，随后确认工具出现、发出只读查询并检查数据时间和业务行。缺工具时应分别检查profile、npx、密钥与连接，而不是反复让模型改写同一个问题。README明确成功响应也可能 resultStatus=empty，所以HTTP或MCP成功不能充当有数据的验收。

首次投入包括账号权限核对、运行时配置与可能的包下载；持续投入包括服务、模型和网络资源以及人工解释字段；失败恢复包括对照错误和空结果、重新加载环境。源码没有费率、调用量、耗时和同条件合格率，现金及时间总量均未知。与浏览器或已有MCP配置比较，配置复用可能减少重复填写，但未测出端到端节时或更准确的数据。撤回bundle不等于撤销已经发出的服务请求，退出时还需按账号权限处理密钥。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/fiu-finance-mcp-dsh/README.md:21-40](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/README.md#L21-L40)

密钥设置、npx/profile故障检查和empty语义来自作者说明。

<details>
<summary>查看原文（20行）</summary>

````text
Set the API key before starting or restarting DeepSeek Harness:

```bash
# macOS / Linux
export FIU_API_KEY="YOUR_API_KEY"

# Windows PowerShell
$env:FIU_API_KEY = "YOUR_API_KEY"
```

Request a key at [https://ai.szfiu.com](https://ai.szfiu.com). The optional `FIU_MCP_URL` environment variable overrides the default HTTPS endpoint.

The child process receives only the explicitly configured FIU variables. The API key is never stored in this repository or in the patch file.

## Troubleshooting

- If the FIU tools do not appear, confirm `npx --version`, `FIU_API_KEY`, and the active profile.
- Reload the plugin or restart DeepSeek Harness after changing environment variables.
- The bundle uses the published `fiu-finance-mcp@1.0.1`; update `cordis.patch.yml` when a newer adapter release is ready.
- The remote service requires `Authorization: Bearer <API_KEY>` and may return no business rows with a successful `resultStatus=empty` response.
````

</details>

**依据 2 · 源码核查**：[plugins/fiu-finance-mcp-dsh/cordis.patch.yml:8-18](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/cordis.patch.yml#L8-L18)

进程启动、环境及超时配置。

<details>
<summary>查看原文（11行）</summary>

```text
        serverName: fiu-finance
        transport: stdio
        command: npx
        args:
          - --yes
          - fiu-finance-mcp@1.0.1
        env:
          FIU_API_KEY: !!js process.env.FIU_API_KEY ?? ''
          FIU_MCP_URL: !!js process.env.FIU_MCP_URL ?? ''
        toolCallTimeoutMs: 180000
        failOnStartupError: false
```

</details>

#### 缺口

- 费率、配额和同任务准确率/时延没有材料。
  **影响**：不能估计单位合格查询成本或承诺免费。
  **进一步探讨**：用已授权账号记录一次预先定义的查询的调用量、账单、人工复核和数据时效。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 动态远端目录怎样影响能力承诺，可推导什么可证伪改进？

**研究主题**：新假设与验证、缺陷与关键质疑

#### 完整回答

固定patch注释称28个工具，README则称26个业务工具集、104个端点及两个辅助工具；二者可能只是计数单位不同，不能据此认定实现缺陷，也不能任选较大数字展示。配置只固定适配器版本，远端目录仍可独立变化，这意味着安装版本相同并不保证任务能力集合或字段契约不变。

由此可提出未验证假设：保存会话首次tools/list的目录摘要，并让查询结果显式附带市场、数据时间及empty状态，可能比只固定adapter版本更容易发现服务变化和空结果误读。该机制并非此组件已有功能。最小研究对照是在同样账号及查询集合下，比较当前流程与“目录摘要+结果状态检查”的流程，观察误把空值当有数据的次数、目录变化发现率及额外人工时间。若服务变化从不影响目标任务，或新增检查只增耗时且未减少误判，则该假设不获支持。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/fiu-finance-mcp-dsh/cordis.patch.yml:1-3](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/cordis.patch.yml#L1-L3)

固定注释的工具数量声明。

```text
# Mount the hosted FIU Finance MCP service in DeepSeek Harness through the
# published stdio adapter. The adapter forwards MCP traffic to the HTTPS
# endpoint and exposes the service's 28 MCP tools to the current profile.
```

**依据 2 · 作者声明**：[plugins/fiu-finance-mcp-dsh/README.md:13-17](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/README.md#L13-L17)

README使用另一目录统计单位。

```text
## What it provides

This bundle injects DeepSeek Harness's `@deepseek-ai/dsh-mcp-client` and starts the published `fiu-finance-mcp` stdio adapter. The adapter forwards MCP calls to `https://ai.szfiu.com/api/mcp/v2` and exposes the current FIU catalog: 26 business toolsets, 104 endpoints and the `describe_tool` and `search` helper tools.

The resulting tools use names such as `mcp__fiu-finance__quote_spot` and `mcp__fiu-finance__company_announcements`.
```

**依据 3 · 作者声明**：[plugins/fiu-finance-mcp-dsh/README.md:37-40](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/README.md#L37-L40)

固定适配器与empty语义。

```text
- If the FIU tools do not appear, confirm `npx --version`, `FIU_API_KEY`, and the active profile.
- Reload the plugin or restart DeepSeek Harness after changing environment variables.
- The bundle uses the published `fiu-finance-mcp@1.0.1`; update `cordis.patch.yml` when a newer adapter release is ready.
- The remote service requires `Authorization: Bearer <API_KEY>` and may return no business rows with a successful `resultStatus=empty` response.
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得尝试，何时停止并退回原办法？

**研究主题**：采用判断

#### 完整回答

当前更适合已有FIU授权和DSH使用经验的人观察接入方案；在收费、权限和工具目录得到确认前不建议为了本组件新开服务账号。若要做有界探索，应先用不含私人投资组合的一个已知标的查询，要求市场、数据时间和业务行可回查，再与原服务界面或原有MCP配置对照。数据解释仍由用户负责，本组件不是投资建议系统。

相对手工配置，它提供统一入口和adapter pin，价值主要是接入便利，不是数据质量保证。只要出现工具未注册、empty被包装成确定行情、数据时间缺失、权限或计费无法解释，就停止自动查询并回到原服务界面核对；不要用重试次数代替结果检查。源码支持这种检查路径，但没有结果证据支持持续安装推荐。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/fiu-finance-mcp-dsh/README.md:3-17](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/README.md#L3-L17)

目标市场、安装方式和工具示例。

<details>
<summary>查看原文（15行）</summary>

````text
Connect DeepSeek Harness to FIU Finance MCP for Hong Kong, US, A-share, Japan, IPO and bond data.

Install:

```bash
dsh plugin --profile web add github:fiu-ai/mcp-server#path:plugins/fiu-finance-mcp-dsh
```

Compatible with: dsh 0.1.1-rc.2

## What it provides

This bundle injects DeepSeek Harness's `@deepseek-ai/dsh-mcp-client` and starts the published `fiu-finance-mcp` stdio adapter. The adapter forwards MCP calls to `https://ai.szfiu.com/api/mcp/v2` and exposes the current FIU catalog: 26 business toolsets, 104 endpoints and the `describe_tool` and `search` helper tools.

The resulting tools use names such as `mcp__fiu-finance__quote_spot` and `mcp__fiu-finance__company_announcements`.
````

</details>

**依据 2 · 作者声明**：[plugins/fiu-finance-mcp-dsh/README.md:31-40](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/README.md#L31-L40)

账号、环境和empty的采用前提。

<details>
<summary>查看原文（10行）</summary>

```text
Request a key at [https://ai.szfiu.com](https://ai.szfiu.com). The optional `FIU_MCP_URL` environment variable overrides the default HTTPS endpoint.

The child process receives only the explicitly configured FIU variables. The API key is never stored in this repository or in the patch file.

## Troubleshooting

- If the FIU tools do not appear, confirm `npx --version`, `FIU_API_KEY`, and the active profile.
- Reload the plugin or restart DeepSeek Harness after changing environment variables.
- The bundle uses the published `fiu-finance-mcp@1.0.1`; update `cordis.patch.yml` when a newer adapter release is ready.
- The remote service requires `Authorization: Bearer <API_KEY>` and may return no business rows with a successful `resultStatus=empty` response.
```

</details>

**依据 3 · 源码核查**：[plugins/fiu-finance-mcp-dsh/cordis.patch.yml:4-18](https://github.com/fiu-ai/mcp-server/blob/48cd23192f7fe1e3dd6383e1cfe9422f79ee01c8/plugins/fiu-finance-mcp-dsh/cordis.patch.yml#L4-L18)

配置复用及固定adapter边界。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: mcp-fiu-finance
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: fiu-finance
        transport: stdio
        command: npx
        args:
          - --yes
          - fiu-finance-mcp@1.0.1
        env:
          FIU_API_KEY: !!js process.env.FIU_API_KEY ?? ''
          FIU_MCP_URL: !!js process.env.FIU_MCP_URL ?? ''
        toolCallTimeoutMs: 180000
        failOnStartupError: false
```

</details>

#### 缺口

- 尚无同条件查询结果和实际账号权限证据。
  **影响**：采用结论只能是观察。
  **进一步探讨**：先补齐一项已授权只读查询的目录、数据时间、空结果和费用边界。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
