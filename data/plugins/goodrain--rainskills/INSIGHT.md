# RainSkills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d670ec1](https://github.com/goodrain/rainskills/tree/d670ec145d39019939eec305dddeedf8380f2ed5)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/goodrain/rainskills) [![npm 30d 2,378](https://img.shields.io/static/v1?label=npm+30d&message=2%2C378&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rainskills) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rainskills)
<!-- END META -->

> **功能**：在多种 Agent 中提供 Rainbond 部署、排障与交付验证流程，DSH 包注册引导 Skill。

> **亮点**：把单应用内的步骤范围、部分写入和访问探测分开表达，便于定位需人工核对的环节。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：批量失败不会回滚前面的成功步骤，HTTP verified 不能替代业务请求断言。见 [Q02](#research-q02)。

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
  - [Q01 · DSH 包安装后获得哪些部署能力？](#detail-section-11)
  - [Q02 · 部分写入及探测结果怎样解释？](#detail-section-12)
  - [Q03 · 怎样把首次试用限制在可核验范围？](#detail-section-13)
  - [Q04 · 交付探测能减少错误宣告完成吗？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多组件项目和 Rainbond 环境的维护者，可按应用范围核对部署与交付状态。

对照临时 SSH 脚本与平台原生页面。没有 Rainbond 或仅单一组件时额外引导可能不划算。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 引导 Skill | 进入安装和环境选择 | 仅 bootstrap |
| 执行状态与探测 | 区分写入和访问 | 需平台回读 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Node 与 DSH | 加载 bootstrap | 需实际 Profile 验证 |
| 测试 Rainbond | 验证部署 | 核对 app 和权限 |

| 步骤 | 操作 | 退出 |
| --- | --- | --- |
| 准备 | 选非生产应用 | 范围不明停止 |
| 验证 | 查平台对象和目标 API | 未知先回读 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 准备测试环境 | 环境和人时 |
| 持续 | 资源与复核 | 云费和人工分记 |
| 恢复 | 回到平台原生 | 逐项核对资源 |

| 结果 | 判据 | 边界 |
| --- | --- | --- |
| 可验证交付 | 实际页面与 API | HTTP 状态不涵盖业务 |

> **思考**：批量失败不会回滚前面的成功步骤，HTTP verified 不能替代业务请求断言。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把单应用内的步骤范围、部分写入和访问探测分开表达，便于定位需人工核对的环节。见 [Q01](#research-q01)、[Q02](#research-q02)。

校验单应用范围并对部分完成显式建模；HTTP 重定向单独处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

批量失败不会回滚前面的成功步骤，HTTP verified 不能替代业务请求断言。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在测试租户验证一个应用，先回读权限，未知写入先查询，最后检查目标 API。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码证实 bootstrap 注册、批次状态和探测分支，真实部署和回收尚未验证。

- 已检查：作者 README、包清单、源码路径 package.json、dsh/index.mjs、README.md、bin/confirmed-batch.js、bin/delivery-probe.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根分发、DSH 引导与两个桥接脚本，未运行真实 Rainbond、安装器和全部技能。
- 下一步：固定测试租户，核对状态回读、访问探测和失败后的资源回收。

**分析版本**

- **仓库**：[goodrain/rainskills](https://github.com/goodrain/rainskills)
- **版本号**：0.1.50（[固定提交 d670ec1](https://github.com/goodrain/rainskills/tree/d670ec145d39019939eec305dddeedf8380f2ed5)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在错误路由与未知写入下，对照平台启动状态和交付探测的误报率。见 [Q04](#research-q04)。

固定测试租户，核对状态回读、访问探测和失败后的资源回收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 226 | 17399 | — | — | 157040 |
| .js | source | 35 | 17024 | 16132 | 88 | — |
| .mjs | source | 16 | 3802 | 3558 | 29 | — |
| .js | test | 60 | 21561 | 20036 | 350 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/goodrain/rainskills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/goodrain/rainskills/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/goodrain/rainskills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 接入如何区分引导、部署与交付验证，批量变更失败时怎样识别已执行范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 包安装后获得哪些部署能力？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

已有多组件项目、需要交付到 Rainbond 的开发者可让 DSH 加载 bootstrap，再按任务连接目标环境。固定 Host 入口读取打包的 rainskills Skill，校验 frontmatter，用 ctx.skills.register 注册给用户和模型。它只挂一个引导 Skill；README 明确完整 rainbond-* 套件还需安装器。相较用 SSH 把项目上下文重新翻成临时脚本，套件尝试保留组件关系，但 Profile 安装成功不能证明已配置 Rainbond 或已部署应用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-6](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/package.json#L2-L6)

包版本与作者用途

```text
  "name": "rainskills",
  "version": "0.1.50",
  "description": "Agent Skills for deploying, troubleshooting, and verifying applications on Rainbond from Codex, Claude Code, and other AI coding agents",
  "license": "Apache-2.0",
  "homepage": "https://www.rainbond.com/rainskills",
```

**依据 2 · 源码核查**：[package.json:32-56](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/package.json#L32-L56)

独立安装器及随包资源

<details>
<summary>查看原文（25行）</summary>

```text
  "bin": {
    "rainskills": "bin/rainskills.js"
  },
  "files": [
    "SKILL.md",
    "agents/",
    "bin/",
    "install.sh",
    "dsh/",
    "marketplace/",
    "contracts/",
    "rainbond-ai-assistant/",
    "rainbond-app-assistant/",
    "rainbond-app-version-assistant/",
    "rainbond-delivery-verifier/",
    "rainbond-env-sync/",
    "rainbond-fullstack-bootstrap/",
    "rainbond-fullstack-troubleshooter/",
    "rainbond-opensource-app-deploy/",
    "rainbond-platform-installer/",
    "rainbond-platform-plugin-manager/",
    "rainbond-platform-query/",
    "rainbond-project-init/",
    "rainbond-scheduled-task/",
    "rainbond-template-installer/",
```

</details>

**依据 3 · 源码核查**：[dsh/index.mjs:46-73](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/dsh/index.mjs#L46-L73)

真实 Host 注册仅一个定义

<details>
<summary>查看原文（28行）</summary>

```text
function readSkillDefinition() {
  return parseSkillSource(readFileSync(skillPath, "utf8"), skillPath);
}

export function apply(ctx) {
  const definition = readSkillDefinition();
  const registration = {
    name: definition.name,
    description: definition.description,
    invocation: {
      modelInvocable: true,
      userInvocable: true,
    },
    source: "bundled",
    provider: name,
    resourceBase: {
      kind: "directory",
      path: skillDirectory,
    },
    path: skillPath,
    content: definition.content,
  };

  ctx.effect(
    () => ctx.skills.register(registration),
    "rainskills-dsh: register bootstrap skill",
  );
}
```

</details>

**依据 4 · 作者声明**：[README.md:67-85](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/README.md#L67-L85)

bootstrap 与环境选择边界

<details>
<summary>查看原文（19行）</summary>

````text
DeepSeek Harness 用户也可以把 RainSkills bootstrap 作为 profile bundle 安装：

```bash
dsh plugin --profile web add rainskills
```

安装后调用 `/rainskills`，或直接告诉 Agent“安装 RainSkills”。该 bundle 只注册
bootstrap Skill；完整的 `rainbond-*` Skills 仍由官方安装器统一安装和更新。

`npx` 安装方式需要 Node.js 18 或更高版本。建议使用仍在维护的 Node.js 22 或 24。

安装完成后，在项目目录告诉 Agent：

```text
帮我部署当前项目，并验证页面和 API。
```

如果还没有可用的 Rainbond，Agent 会在第一次需要运行环境时让你选择 Cloud、
已有私有环境、本机或服务器，不会在安装 Skill 时替你决定目标环境。
````

</details>

#### 缺口

- 未运行固定包和安装器
  **影响**：未知 Profile 实际加载与子 Skill 安装
  **进一步探讨**：隔离 Profile 核对 bootstrap 可见性，再独立核对完整套件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 部分写入及探测结果怎样解释？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

确认批次校验单一 team、region、app，限制工具与操作，顺序执行并可跳过已满足状态。传输失败等情况标 unknown，要求 query_state；已有成功时的失败可能 partial，代码并没有撤销之前成功项。交付探测对重定向重新解析，拒绝 HTTPS 降级和不安全目标，跨主机转人工核验。最终 verified 依据 HTTP 状态，不能单独证明真实登录、业务 API 数据或端到端操作。相较把命令退出码当交付，可得到更清楚的阶段和阻断原因。

#### 证据与依据

**依据 1 · 源码核查**：[bin/confirmed-batch.js:15-34](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/bin/confirmed-batch.js#L15-L34)

一应用范围与工具白名单

<details>
<summary>查看原文（20行）</summary>

```text
function validateBatch(input) {
  if (Buffer.byteLength(JSON.stringify(input) || "") > 128 * 1024) invalid();
  keys(input, ["schema", "scope", "steps"]);
  if (input.schema !== SCHEMA) invalid();
  keys(input.scope, ["team_name", "region_name", "app_id"]);
  const scope = input.scope;
  if (!validString(scope.team_name) || !validString(scope.region_name) || !Number.isInteger(scope.app_id) || scope.app_id < 1) invalid();
  if (!Array.isArray(input.steps) || input.steps.length < 1 || input.steps.length > 32) invalid();
  const names = new Set();
  return input.steps.map((step) => {
    keys(step, ["key", "tool", "arguments"]);
    if (!validString(step.key) || Buffer.byteLength(step.key) > 64 || names.has(step.key) || !plain(step.arguments)) invalid();
    names.add(step.key);
    if (!Object.hasOwn(CONFIG_OPERATIONS, step.tool) || !CONFIG_OPERATIONS[step.tool].includes(step.arguments.operation)) invalid();
    if (!validString(step.arguments.service_id)) invalid();
    for (const [key, value] of Object.entries(scope)) {
      if (Object.hasOwn(step.arguments, key) && step.arguments[key] !== value) invalid();
    }
    return { key: step.key, tool: step.tool, arguments: { ...step.arguments, ...scope } };
  });
```

</details>

**依据 2 · 源码核查**：[bin/confirmed-batch.js:87-118](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/bin/confirmed-batch.js#L87-L118)

顺序、跳过及 unknown/partial 分支

<details>
<summary>查看原文（32行）</summary>

```text
async function executeBatch(input, { validate, call, signal, isSatisfied = async () => false, onProgress = async () => {} }) {
  const steps = validateBatch(input);
  for (const step of steps) await validate(step.tool, step.arguments);
  const output = { schema: "rainskills.confirmed-batch.v1.result", status: "succeeded", completed: 0, skipped: 0, steps: steps.map(({ key }) => ({ key, status: "not_executed" })), blocker: null };
  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    try {
      if (signal?.aborted) throw Object.assign(new Error("cancelled"), { code: "E_CANCELLED" });
      if (await isSatisfied(step)) {
        output.skipped += 1;
        output.steps[index] = { key: step.key, status: "skipped" };
        await onProgress(output);
        continue;
      }
      if (signal?.aborted) throw Object.assign(new Error("cancelled"), { code: "E_CANCELLED" });
      const value = await call(step.tool, step.arguments);
      output.steps[index] = { key: step.key, status: "succeeded", ...projectResult(value) };
      // The batch status describes execution, not a platform-specific status field.
      output.steps[index].status = "succeeded";
      output.completed += 1;
    } catch (error) {
      const unknown = error.code === "E_WRITE_RESULT_UNKNOWN" || error.exitCode === EXIT.TRANSPORT;
      output.steps[index] = { key: step.key, status: unknown ? "unknown" : "failed" };
      output.status = unknown ? "unknown" : output.completed ? "partial" : "failed";
      const code = unknown ? "E_WRITE_RESULT_UNKNOWN" : ["E_CANCELLED", "E_PLAN_STALE"].includes(error.code) ? error.code : "E_PLATFORM";
      output.blocker = { key: step.key, code, next_action: unknown ? "query_state" : "inspect_error" };
      await onProgress(output);
      return boundedResult(output);
    }
    await onProgress(output);
  }
  return boundedResult(output);
```

</details>

**依据 3 · 源码核查**：[bin/delivery-probe.js:245-291](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/bin/delivery-probe.js#L245-L291)

重定向约束和 HTTP 判据

<details>
<summary>查看原文（47行）</summary>

```text
        }
        let next;
        try {
          next = parseTarget(new URL(response.location, current).href);
        } catch (_error) {
          next = null;
        }
        if (!next) return { policy_version: POLICY_VERSION, status: "rejected", reason: "unsafe_redirect", candidate_url: candidateUrl };
        const nextResolved = await resolveSafeAddresses(next);
        if (nextResolved.error) {
          return { policy_version: POLICY_VERSION, status: "rejected", reason: "unsafe_redirect", candidate_url: candidateUrl };
        }
        if (current.protocol === "https:" && next.protocol !== "https:") {
          return { policy_version: POLICY_VERSION, status: "rejected", reason: "redirect_downgrade", candidate_url: candidateUrl };
        }
        const sameEndpoint = next.host === current.host && next.protocol === current.protocol;
        const httpUpgrade = current.protocol === "http:"
          && next.protocol === "https:"
          && normalizedHostname(next) === normalizedHostname(current)
          && (current.port || "80") === "80"
          && (next.port || "443") === "443";
        if (!sameEndpoint && !httpUpgrade) {
          return {
            policy_version: POLICY_VERSION,
            status: "manual_validation_required",
            reason: "cross_host_redirect",
            candidate_url: candidateUrl,
            redirect_target: next.href,
          };
        }
        redirects.push(next.href);
        current = next;
        prefetchedResolution = nextResolved;
        continue;
      }

      return {
        policy_version: POLICY_VERSION,
        status: statusCode >= 200 && statusCode < 400 ? "verified" : "failed",
        reason: statusCode >= 200 && statusCode < 400 ? null : "http_status",
        candidate_url: candidateUrl,
        final_url: current.href,
        status_code: statusCode,
        content_type: String(response.contentType || ""),
        body_bytes: Number(response.bodyBytes || 0),
        redirects,
      };
```

</details>

#### 缺口

- 未对真实平台做部分写和探测
  **影响**：未知应用实际状态、可逆性与业务体验
  **进一步探讨**：在测试应用模拟第二步失败并回读平台对象

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样把首次试用限制在可核验范围？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已有测试 Rainbond 的维护者先验证 bootstrap、环境归属和权限，在单一非生产应用上试最小项目。不把未知写结果直接重试，先查询实际应用状态；探测跨主机时人工验证。首次需 Node 18+、宿主及可连接的 Rainbond；持续成本包括运行资源、变更审阅和诊断。若无法确认 app 范围、数据副作用或页面功能，停止批量写并回到平台原生界面。移除 DSH Skill 不会由本轮证据推出删除远端应用。按一次页面和目标 API 都人工可确认的交付记录人工与云支出。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:64-70](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/package.json#L64-L70)

Node 和运行平台

```text
  "engines": {
    "node": ">=18"
  },
  "os": [
    "darwin",
    "linux",
    "win32"
```

**依据 2 · 作者声明**：[README.md:39-49](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/README.md#L39-L49)

运行环境连接阶段

<details>
<summary>查看原文（11行）</summary>

````text
```text
当前项目或部署目标
  → Codex、Claude Code 等 AI Agent
  → RainSkills 选择对应的部署、排障或验证 Skill
  → 首次需要时选择并连接一个 Rainbond 运行环境
  → Rainbond 构建并运行应用
  → RainSkills 验证页面、API 和最终访问地址
```

RainSkills 安装与运行环境连接是两个阶段。安装完成后可以直接提出部署任务；
第一次需要 Rainbond 时，Agent 再引导你选择 Cloud、已有私有环境、本机或服务器。
````

</details>

**依据 3 · 作者声明**：[README.md:110-121](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/README.md#L110-L121)

项目来源与转换限制

<details>
<summary>查看原文（12行）</summary>

```text
### 项目来源

- 当前本地项目
- 普通 Git 仓库
- 本地软件包
- 私有容器镜像或单镜像组件
- Compose、Helm 或多镜像描述
- Dify、n8n、Harbor 等第三方开源应用
- Rainbond 应用模板

Compose、Helm 和第三方应用中的特权容器、Operator、CRD、Job、主机网络或主机目录等语义，
需要根据当前 Rainbond 能力单独判断，不承诺原样转换所有 Kubernetes 配置。
```

</details>

**依据 4 · 源码核查**：[bin/confirmed-batch.js:102-114](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/bin/confirmed-batch.js#L102-L114)

未知写要求回读

<details>
<summary>查看原文（13行）</summary>

```text
      const value = await call(step.tool, step.arguments);
      output.steps[index] = { key: step.key, status: "succeeded", ...projectResult(value) };
      // The batch status describes execution, not a platform-specific status field.
      output.steps[index].status = "succeeded";
      output.completed += 1;
    } catch (error) {
      const unknown = error.code === "E_WRITE_RESULT_UNKNOWN" || error.exitCode === EXIT.TRANSPORT;
      output.steps[index] = { key: step.key, status: unknown ? "unknown" : "failed" };
      output.status = unknown ? "unknown" : output.completed ? "partial" : "failed";
      const code = unknown ? "E_WRITE_RESULT_UNKNOWN" : ["E_CANCELLED", "E_PLAN_STALE"].includes(error.code) ? error.code : "E_PLATFORM";
      output.blocker = { key: step.key, code, next_action: unknown ? "query_state" : "inspect_error" };
      await onProgress(output);
      return boundedResult(output);
```

</details>

#### 缺口

- 未测真实权限和退出后的云资源
  **影响**：生产部署或回滚保证不足
  **进一步探讨**：用测试租户核对开始、失败、停止和资源回收

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 交付探测能减少错误宣告完成吗？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在构建完成但路由或 API 故障时，要求探测再回读应用能减少错误宣告。用同一非生产应用对比只看启动状态与探测加人工 API 验证，注入错误路由、跨域跳转和二步配置传输失败。统计误报、确认时间和重复写次数。若探测把错误页面当成功，或人工复核成本高于定位收益，就保留平台原生检查并调整业务断言。

#### 证据与依据

**依据 1 · 源码核查**：[bin/delivery-probe.js:266-290](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/bin/delivery-probe.js#L266-L290)

探测可能要求人工或按状态判成功

<details>
<summary>查看原文（25行）</summary>

```text
        if (!sameEndpoint && !httpUpgrade) {
          return {
            policy_version: POLICY_VERSION,
            status: "manual_validation_required",
            reason: "cross_host_redirect",
            candidate_url: candidateUrl,
            redirect_target: next.href,
          };
        }
        redirects.push(next.href);
        current = next;
        prefetchedResolution = nextResolved;
        continue;
      }

      return {
        policy_version: POLICY_VERSION,
        status: statusCode >= 200 && statusCode < 400 ? "verified" : "failed",
        reason: statusCode >= 200 && statusCode < 400 ? null : "http_status",
        candidate_url: candidateUrl,
        final_url: current.href,
        status_code: statusCode,
        content_type: String(response.contentType || ""),
        body_bytes: Number(response.bodyBytes || 0),
        redirects,
```

</details>

**依据 2 · 源码核查**：[bin/confirmed-batch.js:102-114](https://github.com/goodrain/rainskills/blob/d670ec145d39019939eec305dddeedf8380f2ed5/bin/confirmed-batch.js#L102-L114)

写入不明时的回读节点

<details>
<summary>查看原文（13行）</summary>

```text
      const value = await call(step.tool, step.arguments);
      output.steps[index] = { key: step.key, status: "succeeded", ...projectResult(value) };
      // The batch status describes execution, not a platform-specific status field.
      output.steps[index].status = "succeeded";
      output.completed += 1;
    } catch (error) {
      const unknown = error.code === "E_WRITE_RESULT_UNKNOWN" || error.exitCode === EXIT.TRANSPORT;
      output.steps[index] = { key: step.key, status: unknown ? "unknown" : "failed" };
      output.status = unknown ? "unknown" : output.completed ? "partial" : "failed";
      const code = unknown ? "E_WRITE_RESULT_UNKNOWN" : ["E_CANCELLED", "E_PLAN_STALE"].includes(error.code) ? error.code : "E_PLATFORM";
      output.blocker = { key: step.key, code, next_action: unknown ? "query_state" : "inspect_error" };
      await onProgress(output);
      return boundedResult(output);
```

</details>

#### 缺口

- 未做配对故障注入
  **影响**：误报与时间收益未知
  **进一步探讨**：预定义业务断言和失败阈值再比较

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
