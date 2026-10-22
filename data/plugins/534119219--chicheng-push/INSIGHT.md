# 赤诚推送 chicheng-push

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[2aa2b82](https://github.com/534119219/chicheng-push/tree/2aa2b8273183bc91f4cf6d12b1f7121bbee751da)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)
<!-- END META -->

> **实现功能**：统一管理多种推送渠道，通过设置页、pushNotifier服务和HTTP API发送任务通知。

> **核心亮点**：把常见通知适配、配置表单与host/HTTP出口统一，减少其他任务插件重复接多服务商。详见[Q01](#research-q01)。

> **风险与缺陷**：Host围栏不是对端认证且list回明文secret，部分HTTP失败可误记已发；未持久确认/无幂等不能作为可靠到账证明。详见[Q02](#research-q02)。

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
  - [Q01 · 统一推送交付什么，它会自动监听任务完成吗？](#detail-section-11)
  - [Q02 · API围栏、凭证与自定义目标的信任边界是什么？](#detail-section-12)
  - [Q03 · sent能作为收妥证据吗，失败重试会怎样？](#detail-section-13)
  - [Q04 · 保存成功和UI状态是否等于配置已可靠落盘？](#detail-section-14)
  - [Q05 · 启动、使用和恢复要付出哪些成本？](#detail-section-15)
  - [Q06 · 采用建议和可证伪改进方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有后台任务/脚本需要通知出口，不自带任务监听或调度。详见[Q01](#research-q01)。

每个任务插件单独维护推送API或脚本；本项统一出口，不替任务验收与收件回执。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| pushNotifier服务 | 其他host插件通知 | 无自动监听任务，内层结果非到账 |
| push HTTP API | 脚本/界面调用 | Header围栏不等身份，配置含secret |
| 多渠道适配 | 常见机器人/Webhook/SMTP | 协议/费用/受理须分别核 |
| 管理UI | 配置/启停/删除/测试 | test真实外发，编辑会启用 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH webServer/webRuntime/UI | 管理及API | 本机Header围栏不能替认证 |
| 受权账户/目标 | 真实外发 | 明文JSON和API回显需保护 |
| Node fetch | HTTP渠道 | 任意自定义目标，12秒单次预算 |
| nodemailer（邮件可选） | SMTP | 动态库须宿主可解析，非包自带 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 限制端口/文件权限并配渠道 | 操作者 | 可信目的地与最小凭证 |
| 明确授权测试 | 用户 | 测试真实外发，核到账 |
| 在任务落定后调用 | 上游插件/脚本 | 只发脱敏摘要/明确渠道 |
| 核内层结果与恢复 | 调用者 | unknown不盲目整包重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web宿主、推送账户/机器人/自建网关；SMTP另需nodemailer | 配可信目标和凭证、限制端口/文件访问、调用插件接入；工时未知 | 渠道不同收费/配额未知，本插件不包含定时任务触发器 |
| 持续使用 | 多渠道网络请求，逐渠道12秒HTTP预算，SMTP另由库默认 | 核消息内容/目标与接口结果，管理失效凭证和限额 | 不含读者送达回执/去重；金额、可靠送达率与净省时未知 |
| 失败恢复 | 重发请求、原渠道配置备份、凭证轮换资源 | 判断已发未确认渠道、避免重复，恢复文件并核实际收件 | 无持久发送队列/自动重试/幂等事务，超时后是否已发未知；工时金额未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一通知接线 | schema/服务/HTTP出口 | 实际到账和接收处理 |
| 多渠道结果 | 每渠道捕错和汇总 | 部分响应判据可假成功 |
| 渠道持久化 | debounce+tmp rename | 回包不等落盘，失败日志不回传 |

> **思考**：Host围栏不是对端认证且list回明文secret，部分HTTP失败可误记已发；未持久确认/无幂等不能作为可靠到账证明。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把常见通知适配、配置表单与host/HTTP出口统一，减少其他任务插件重复接多服务商。详见[Q01](#research-q01)。

把常见通知适配、配置表单与host/HTTP出口统一，减少其他任务插件重复接多服务商。详见[Q01](#research-q01)。

共享类型驱动表单、逐渠道局部结果与本地HTTP接线测试可借鉴；安全与可靠受理不能只靠命名fence/已发送。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Host围栏不是对端认证且list回明文secret，部分HTTP失败可误记已发；未持久确认/无幂等不能作为可靠到账证明。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，继续从本机认证、最小凭证/目标与脱敏内容及明确受理证据入手。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

统一出口贡献可核；访问围栏/受理与持久确认受限；受权发件箱为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、lib/index.js、lib/client.js、test/smoke.mjs、test/types.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整937行发布host，549行client关键API/编辑/测试/注册，README/SECURITY与本地HTTP测试；未发任何消息或运行目标。
- 下一步：用假Host/坏ack/超时未知/重复或空目标/写盘失败和并发检验授权及可审计发件箱，按有效到账和恢复工时比较。

**分析版本**

- **仓库**：[534119219/chicheng-push](https://github.com/534119219/chicheng-push)
- **版本号**：0.1.0（[固定提交 2aa2b82](https://github.com/534119219/chicheng-push/tree/2aa2b8273183bc91f4cf6d12b1f7121bbee751da)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将目标授权/凭证服务与每渠道受理状态、稳定ID/outbox及unknown恢复结合，用假ack/超时/重复/存储失败反例证伪，未验证。详见[Q06](#research-q06)。

用假Host/坏ack/超时未知/重复或空目标/写盘失败和并发检验授权及可审计发件箱，按有效到账和恢复工时比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 344 | — | — | 2637 |
| .md | example | 1 | 53 | — | — | 300 |
| .js | source | 2 | 1488 | 1312 | 87 | — |
| .mjs | test | 2 | 261 | 202 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-push/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-push/issues?q=is%3Aissue+created%3A2026-09-22T10%3A09%3A17.743Z..2026-10-22T10%3A09%3A17.743Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-push/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A09%3A17.743Z..2026-10-22T10%3A09%3A17.743Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一推送能否在正确目标、凭证授权和受理确认下告知任务结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一推送交付什么，它会自动监听任务完成吗？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向已有定时/后台任务或脚本、需要把完成摘要推到常用通知渠道的DSH操作者。原方案是每插件各写机器人/API调用；本项host提供pushNotifier服务与POST API，设置页用共享类型定义生成表单，适配多种HTTP渠道及可选SMTP。调用方决定何时发送、标题/内容和渠道，本插件没有自动监听任务结束，也不自带调度器。README cron代码是集成示例，不是已连上该插件。

实际贡献是统一配置、渠道适配和逐渠道结果，把其他host插件的通知出口收敛。渠道实现明确参考qinglong notify目录，不能把服务商协议当本项目原创。合格交付是目标渠道和内容正确、接口受理状态可解释；API成功还不等通知到设备、有人阅读或任务业务成功。HTTP层writeOk与内部value.ok分开，调用方须读内层结果，而非只看200或外层ok。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-7](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/README.md#L5-L7)

项目用途。

```text

dsh 消息推送插件：在 Web 设置界面左侧栏新增 **「推送插件」** 入口，可配置管理**多个**推送渠道；同时把推送能力以 `pushNotifier` 服务（host 侧）和 `/push/api/send` HTTP 接口暴露给其他插件，例如定时执行插件在任务完成后调用推送。

```

**依据 2 · 源码核查**：[README.md:28-49](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/README.md#L28-L49)

渠道归属/目录。

<details>
<summary>查看原文（22行）</summary>

```text

渠道实现参考 [whyour/qinglong](https://github.com/whyour/qinglong) 的 notify 目录，默认支持：

| 渠道 | 类型 id | 说明 |
|---|---|---|
| Server酱 | `serverChan` | sctapi / sctp 多通道 |
| PushPlus | `pushPlus` | 支持群组与渠道 |
| Bark | `bark` | iOS 推送 |
| 钉钉机器人 | `dingtalkBot` | 支持加签 |
| 企业微信群机器人 | `weWorkBot` | 群 Webhook |
| 企业微信应用消息 | `weWorkApp` | corpid,corpsecret,touser,agentid |
| Telegram Bot | `telegramBot` | 支持自建 API 域名 |
| 飞书 / Lark 机器人 | `lark` | 支持加签 |
| ntfy | `ntfy` | 支持自建实例与鉴权 |
| iGot | `iGot` | 聚合推送 |
| PushDeer | `pushDeer` | 支持自建 |
| Gotify | `gotify` | 自部署 |
| 自定义 Webhook | `webhook` | `$title` / `$content` 变量 |
| 邮件（SMTP） | `email` | 需要环境可动态加载 `nodemailer` |

## 结构

```

</details>

**依据 3 · 源码核查**：[lib/index.js:590-630](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L590-L630)

统一发送结果。

<details>
<summary>查看原文（41行）</summary>

```text
async function sendChannel(channel, title, content) {
  try {
    const sender = senderForType(channel.type);
    const message = await sender(channel.config ?? {}, title, content);
    return { id: channel.id, name: channel.name, type: channel.type, ok: true, message };
  } catch (error) {
    return { id: channel.id, name: channel.name, type: channel.type, ok: false, error: errorText(error) };
  }
}

/** Resolve the target channel list of a `channels` select (undefined | 'all' | string[]). */
function resolveTargets(channels) {
  const active = store.channels.filter((c) => c.enabled !== false);
  if (channels === undefined || channels === null || channels === "all" || channels === "*") return active;
  const ids = Array.isArray(channels) ? channels.map(String) : [String(channels)];
  if (ids.length === 0) return active;
  if (ids.includes("all") || ids.includes("*")) return active;
  const byId = new Map(active.map((c) => [c.id, c]));
  const byName = new Map(active.map((c) => [c.name, c]));
  return ids.map((id) => byId.get(id) ?? byName.get(id)).filter(Boolean);
}

/**
 * Send a notification. This is the face exposed both as the `pushNotifier`
 * service (host plugins) and as the /push/api/send route (any caller).
 */
async function sendNotification({ title, content, channels }) {
  const titleText = String(title ?? "").trim();
  const contentText = String(content ?? "");
  const targets = resolveTargets(channels);
  const results = [];
  for (const channel of targets) {
    results.push(await sendChannel(channel, titleText, contentText));
  }
  return {
    ok: results.length > 0 && results.every((r) => r.ok),
    total: results.length,
    sent: results.filter((r) => r.ok).length,
    results,
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:865-888](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L865-L888)

服务出口。

<details>
<summary>查看原文（24行）</summary>

```text
    },
    send(payload) {
      if (typeof payload === "string") {
        // Convenience overload: send("标题", "内容", ["ch-..."]) is handled
        // through a separate function below; a bare string means title-only.
        return sendNotification({ title: payload, content: "", channels: undefined });
      }
      if (!isPlainObject(payload)) throw new Error("pushNotifier.send 需要 { title, content, channels? }");
      return sendNotification(payload);
    },
    sendText(title, content, channels) {
      return sendNotification({ title, content, channels });
    },
    async test(id) {
      const channel = store.channels.find((c) => c.id === id);
      if (!channel) throw new Error(`渠道 "${id}" 不存在`);
      return sendChannel(channel, "dsh 推送测试", `这是一条来自 dsh 推送插件的测试消息。\n渠道：${channel.name}（${channel.type}）`);
    },
  };
}

// ---------------------------------------------------------------- plugin body

async function apply(ctx) {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:690-693](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L690-L693)

HTTP包络。

```text

function writeOk(res, value) {
  writeJson(res, 200, { ok: true, value });
}
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · API围栏、凭证与自定义目标的信任边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

fence依Host为loopback或webRuntime.trustedHosts，加可选Origin.host和sec-fetch-site；没有检查真实socket peer、用户认证、token或调用者权限。非浏览器可伪造Host并省Origin/site，所以只要到达端口就不应认为围栏证明来自本机。Origin只比host不比scheme。接口同时暴露list/save/remove/test/send，publicChannel原样返回config含Token/Secret，UI password只是遮罩，不能当API去敏。SECURITY也承认文件明文存储，未设置显式0600或加密，继承目录/umask权限。该组合意味着对不可信网络暴露端口可影响真实凭证/外发能力，本轮静态判断未作请求复现。

Bark/飞书/webhook/自建API等允许配置任意HTTP(S)目标，normalize只核必填非空，不校协议/私网/DNS/授权，httpJson默认follow重定向，不能保证凭证和内容仅到原目的地；正文响应res.text无大小限制，12秒只是网络abort预算。自建私网通知是合法场景，正确边界是操作者明确授权目标、认证配置面及凭证权限，而非统一禁止内网。webhook多次replaceAll会把标题里新出现$content继续展开，JSON模板又先原样插入再parse，含引号/换行时可成为无效JSON或改变结构；不能把它称自动JSON安全编码。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:724-743](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L724-L743)

Header型围栏。

<details>
<summary>查看原文（20行）</summary>

```text
  const host = header(request.headers, "host");
  if (host === undefined) return false;
  const hostUrl = parseAuthority(host);
  if (hostUrl === undefined) return false;
  const hosts = Array.isArray(trustedHosts) ? trustedHosts : [];
  const trusted = hosts.some((entry) => {
    const entryUrl = parseAuthority(entry);
    if (entryUrl === undefined) return false;
    return entryUrl.hostname === hostUrl.hostname && (entryUrl.port === "" || entryUrl.port === hostUrl.port);
  });
  if (!isLoopbackHostname(hostUrl.hostname) && !trusted) return false;
  if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
  const origin = header(request.headers, "origin");
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:634-644](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L634-L644)

config原样回传。

<details>
<summary>查看原文（11行）</summary>

```text
function publicChannel(channel) {
  return {
    id: channel.id,
    name: channel.name,
    type: channel.type,
    enabled: channel.enabled !== false,
    config: channel.config ?? {},
    createdAt: channel.createdAt ?? null,
    updatedAt: channel.updatedAt ?? null,
  };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:748-771](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L748-L771)

仅必填校验。

<details>
<summary>查看原文（24行）</summary>

```text
function normalizeChannel(payload) {
  if (!isPlainObject(payload)) throw new PushError("bad-request", "channel object required");
  const nameValue = payload.name;
  if (typeof nameValue !== "string" || nameValue.trim() === "") {
    throw new PushError("bad-request", "渠道名称不能为空");
  }
  const typeValue = payload.type;
  if (typeof typeValue !== "string" || !TYPE_MAP.has(typeValue)) {
    throw new PushError("bad-request", `不支持的渠道类型 "${typeValue}"`);
  }
  const config = isPlainObject(payload.config) ? payload.config : {};
  const def = TYPE_MAP.get(typeValue);
  for (const field of def.fields) {
    if (field.required && !String(config[field.key] ?? "").trim()) {
      throw new PushError("bad-request", `缺少必填项：${field.label}`);
    }
  }
  return {
    id: typeof payload.id === "string" && payload.id !== "" ? payload.id : null,
    name: nameValue.trim(),
    type: typeValue,
    enabled: payload.enabled !== false,
    config,
  };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:90-124](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L90-L124)

follow和无界读响应。

<details>
<summary>查看原文（35行）</summary>

```text
async function httpJson(url, { method = "POST", json, form, headers = {}, raw } = {}) {
  let body;
  const finalHeaders = { ...headers };
  if (raw !== undefined) {
    body = raw;
  } else if (json !== undefined) {
    body = JSON.stringify(json);
    finalHeaders["content-type"] = "application/json";
  } else if (form !== undefined) {
    body = new URLSearchParams(form).toString();
    finalHeaders["content-type"] = "application/x-www-form-urlencoded";
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body,
      signal: controller.signal,
      redirect: "follow",
    });
    const text = await res.text().catch(() => "");
    let parsed = null;
    try {
      parsed = text === "" ? null : JSON.parse(text);
    } catch {
      parsed = null;
    }
    return { status: res.status, ok: res.ok, text, json: parsed };
  } finally {
    clearTimeout(timer);
  }
}

```

</details>

**依据 5 · 源码核查**：[lib/index.js:520-550](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L520-L550)

模板替换顺序。

<details>
<summary>查看原文（31行）</summary>

```text
async function sendWebhook(config, title, content) {
  const urlTemplate = String(config.webhookUrl ?? "").trim();
  if (urlTemplate === "") throw new Error("缺少 Webhook URL");
  const url = urlTemplate
    .replaceAll("$title", encodeURIComponent(title))
    .replaceAll("$content", encodeURIComponent(content));
  const method = String(config.webhookMethod ?? "").trim() || "POST";
  const contentType = String(config.webhookContentType ?? "").trim() || "application/json";
  const headers = parseHeaders(config.webhookHeaders);
  const bodyTemplate = String(config.webhookBody ?? "");
  const bodyText = bodyTemplate
    .replaceAll("$title", title)
    .replaceAll("$content", content);

  let raw;
  if (contentType === "application/json" && bodyText.trim() !== "") {
    try {
      raw = JSON.stringify(JSON.parse(bodyText));
    } catch {
      raw = bodyText;
    }
    if (!Object.keys(headers).some((k) => k.toLowerCase() === "content-type")) {
      headers["content-type"] = contentType;
    }
  } else {
    raw = bodyText;
    if (!Object.keys(headers).some((k) => k.toLowerCase() === "content-type")) {
      headers["content-type"] = contentType;
    }
  }
  const res = await httpJson(url, { method, headers, raw });
```

</details>

**依据 6 · 源码核查**：[SECURITY.md:15-19](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/SECURITY.md#L15-L19)

作者明文/端口条件。

```text
- 渠道配置（含 SendKey / Token / 授权码等密钥）明文存储在
  `$DSH_HOME/push/channels.json`，请确保该目录仅当前用户可读写。
- `/push/api/*` 接口有 fence 保护（仅同源 / loopback / 受信 host），
  请勿将该端口暴露到不可信网络。
- 邮件渠道的授权码只在调用时用于 SMTP 认证，不写入日志。
```

#### 缺口

- 宿主真实监听/反代认证、文件ACL及各自建目标的出站授权策略
  **影响**：本层Host信任不等用户认证，明文配置回显与外发权限需依部署保障
  **进一步探讨**：核固定宿主端口和认证契约、实际文件权限与受信目标，区分本地UI和其他调用者

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · sent能作为收妥证据吗，失败重试会怎样？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

sendNotification按resolveTargets逐渠道串行，送一个失败也继续收集其他结果。默认all、空数组也等全部启用；显式ID/名称找不到静默过滤，同名按Map最后一个，数组重复同一ID会重复发，容易与调用者“空列表不发/目标不存在报错”的期待冲突。test直接找渠道，不受enabled过滤，禁用的渠道也能真实测试发送，这是UI功能而非沙箱试投递。

不少渠道只在json有特定错误字段时拒绝，且HTTP失败判断写成!res.ok && !res.json。例如ServerChan 500返回{}时errno undefined跳过错误且json truthy，最后报告已发送；200空/HTML在多渠道也可被当成功。ntfy/webhook明确核HTTP，其他渠道须按各接口ack严格核，不能用统一sent替代服务商已受理。SMTP只检查messageId，仍不等到收件箱/阅读。

没有持久outbox、幂等键、自动重试/限速或收件回执；timeout后远端是否已接受未知，整包重发可能给成功渠道重复消息。每HTTP12秒、企业微信应用可两请求、总串行随渠道数增长，SMTP无显式连接/发送预算且仅成功后close，异常链不在finally；无全发送取消signal或总预算。推送内容会交第三方，调用方须避免把原始任务日志/密钥当普通完成摘要。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:601-630](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L601-L630)

渠道选择与串行汇总。

<details>
<summary>查看原文（30行）</summary>

```text
function resolveTargets(channels) {
  const active = store.channels.filter((c) => c.enabled !== false);
  if (channels === undefined || channels === null || channels === "all" || channels === "*") return active;
  const ids = Array.isArray(channels) ? channels.map(String) : [String(channels)];
  if (ids.length === 0) return active;
  if (ids.includes("all") || ids.includes("*")) return active;
  const byId = new Map(active.map((c) => [c.id, c]));
  const byName = new Map(active.map((c) => [c.name, c]));
  return ids.map((id) => byId.get(id) ?? byName.get(id)).filter(Boolean);
}

/**
 * Send a notification. This is the face exposed both as the `pushNotifier`
 * service (host plugins) and as the /push/api/send route (any caller).
 */
async function sendNotification({ title, content, channels }) {
  const titleText = String(title ?? "").trim();
  const contentText = String(content ?? "");
  const targets = resolveTargets(channels);
  const results = [];
  for (const channel of targets) {
    results.push(await sendChannel(channel, titleText, contentText));
  }
  return {
    ok: results.length > 0 && results.every((r) => r.ok),
    total: results.length,
    sent: results.filter((r) => r.ok).length,
    results,
  };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:303-316](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L303-L316)

ServerChan ack逻辑。

<details>
<summary>查看原文（14行）</summary>

```text
async function sendServerChan(config, title, content) {
  const key = String(config.serverChanKey ?? "").trim();
  if (key === "") throw new Error("缺少 ServerChan SendKey");
  const match = /^sctp(\d+)t/i.exec(key);
  const url = match && match[1]
    ? `https://${match[1]}.push.ft07.com/send/${key}.send`
    : `https://sctapi.ftqq.com/${key}.send`;
  const res = await httpJson(url, { form: { title, desp: content } });
  const errno = res.json?.errno ?? res.json?.data?.errno;
  if (res.json && errno !== undefined && errno !== 0) {
    throw new Error(`Server酱返回 errno=${errno}: ${res.text.slice(0, 300)}`);
  }
  if (!res.ok && !res.json) throw new Error(`Server酱 HTTP ${res.status}: ${res.text.slice(0, 300)}`);
  return `Server酱已发送 (${res.status})`;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:418-430](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L418-L430)

Telegram同类判定。

<details>
<summary>查看原文（13行）</summary>

```text
async function sendTelegramBot(config, title, content) {
  const token = String(config.telegramBotToken ?? "").trim();
  const chatId = String(config.telegramBotUserId ?? "").trim();
  if (token === "" || chatId === "") throw new Error("缺少 Telegram Bot Token 或 Chat ID");
  const apiHost = (String(config.telegramBotApiHost ?? "").trim() || "https://api.telegram.org").replace(/\/+$/, "");
  const res = await httpJson(`${apiHost}/bot${token}/sendMessage`, {
    form: { chat_id: chatId, text: `${title}\n\n${content}`, disable_web_page_preview: "true" },
  });
  if (res.json && res.json.ok !== true) {
    throw new Error(`Telegram 返回: ${res.text.slice(0, 300)}`);
  }
  if (!res.ok && !res.json) throw new Error(`Telegram HTTP ${res.status}: ${res.text.slice(0, 300)}`);
  return `Telegram已发送 (${res.status})`;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:455-468](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L455-L468)

ntfy严格HTTP。

<details>
<summary>查看原文（14行）</summary>

```text
async function sendNtfy(config, title, content) {
  const topic = String(config.ntfyTopic ?? "").trim();
  if (topic === "") throw new Error("缺少 ntfy Topic");
  const base = (String(config.ntfyUrl ?? "").trim() || "https://ntfy.sh").replace(/\/+$/, "");
  const headers = { Title: encodeRfc2047(title), Priority: String(config.ntfyPriority ?? "3") || "3" };
  const token = String(config.ntfyToken ?? "").trim();
  const username = String(config.ntfyUsername ?? "").trim();
  const password = String(config.ntfyPassword ?? "");
  if (token !== "") headers.Authorization = `Bearer ${token}`;
  else if (username !== "" && password !== "") headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  const res = await httpJson(`${base}/${topic}`, { headers, raw: content });
  if (!res.ok) throw new Error(`ntfy HTTP ${res.status}: ${res.text.slice(0, 300)}`);
  return `ntfy已发送 (${res.status})`;
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:555-584](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L555-L584)

SMTP资源/结果。

<details>
<summary>查看原文（30行）</summary>

```text
async function sendEmail(config, title, content) {
  const user = String(config.emailUser ?? "").trim();
  const pass = String(config.emailPass ?? "");
  const to = String(config.emailTo ?? "").trim();
  if (user === "" || pass === "" || to === "") throw new Error("缺少邮件发件人、授权码或收件人");
  let nodemailer;
  try {
    nodemailer = (await import("nodemailer")).default ?? (await import("nodemailer"));
  } catch {
    throw new Error("当前环境无法加载 nodemailer，无法发送邮件；请改用其他渠道或安装 nodemailer");
  }
  const service = String(config.emailService ?? "").trim();
  const transporter = nodemailer.createTransport(service !== ""
    ? { service, auth: { user, pass } }
    : {
        host: String(config.emailHost ?? "").trim() || "smtp." + user.split("@")[1],
        port: Number(config.emailPort) > 0 ? Number(config.emailPort) : (String(config.emailSecure ?? "") === "true" ? 465 : 587),
        secure: String(config.emailSecure ?? "") === "true",
        auth: { user, pass },
      });
  const recipients = to.split(/[;；]/).map((s) => s.trim()).filter(Boolean);
  const info = await transporter.sendMail({
    from: `"chicheng-push" <${user}>`,
    to: recipients.join(", "),
    subject: title,
    html: content.replace(/\n/g, "<br/>"),
  });
  transporter.close();
  if (!info.messageId) throw new Error("邮件发送未返回 messageId");
  return `邮件已发送 (${info.messageId})`;
```

</details>

**依据 6 · 源码核查**：[lib/index.js:839-848](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L839-L848)

测试禁用也发送。

<details>
<summary>查看原文（10行）</summary>

```text
      const channel = store.channels.find((c) => c.id === id);
      if (!channel) throw new PushError("not-found", `渠道 "${id}" 不存在`, 404);
      const when = new Date().toLocaleString();
      const result = await sendChannel(channel, "dsh 推送测试", `这是一条来自 dsh 推送插件的测试消息。\n渠道：${channel.name}（${channel.type}）\n发送时间：${when}`);
      return { result };
    },

    send: async (payload) => {
      const title = payload?.title ?? "";
      const content = payload?.content ?? "";
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 保存成功和UI状态是否等于配置已可靠落盘？

**研究主题**：工程质量与复用

#### 完整回答

store、dirtyTimer与DATA_ROOT在模块级共享，DATA_ROOT import时决定，不按Cordis实例/profile隔离。多实例同模块可共享channels，多个进程同文件又无锁。load读错/坏JSON回空无备份，随后保存可覆盖旧原件。scheduleSave150ms合并，save/remove/toggle立即改内存回成功，flush出错只console.error不回传调用方；因此200不是持久确认，崩溃或写失败可丢配置。tmp+rename避免部分写的思路有用，但固定channels.json.tmp无队列，多次flush可重叠/竞争，teardown void flush不await且不清pending timer，也不是退出前持久性保证。

UI两步删除有确认，test显式按钮是真实外发；但编辑save硬写enabled:true，编辑原停用渠道会重新启用。toggle/remove catch吞错误；并发回调根据旧channels闭包map/filter，可能把新操作的列表画面覆盖，refresh无取消/世代。表单password不改变host list回真实secret。smoke用真实模块+fakeCtx/本地HTTP server测webhook与API，可核最小接线，没覆盖远端Host伪造、坏ack/双flush/并发UI等；本次只读不执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:32-73](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L32-L73)

模块store/写入。

<details>
<summary>查看原文（42行）</summary>

```text
const DATA_ROOT = process.env.DSH_HOME
  ? join(process.env.DSH_HOME, "push")
  : join(homedir(), ".dsh", "push");
const STORE_PATH = join(DATA_ROOT, "channels.json");

// ---------------------------------------------------------------- store

const EMPTY_STORE = { version: 1, channels: [] };
let store = structuredClone(EMPTY_STORE);
let storeDirtyTimer = null;

async function loadStore() {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.channels)) store = parsed;
  } catch {
    store = structuredClone(EMPTY_STORE);
  }
  if (!Array.isArray(store.channels)) store.channels = [];
}

/** Debounced atomic persist (tolerates crashes: tmp + rename). */
function scheduleSave() {
  if (storeDirtyTimer !== null) return;
  storeDirtyTimer = setTimeout(() => {
    storeDirtyTimer = null;
    void flushStore();
  }, 150);
}

async function flushStore() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${STORE_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
    await rename(tmp, STORE_PATH);
  } catch (error) {
    console.error(`[chicheng-push] store flush failed:`, error);
  }
}

```

</details>

**依据 2 · 源码核查**：[lib/index.js:785-836](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L785-L836)

立即回包保存/删除/开关。

<details>
<summary>查看原文（52行）</summary>

```text
      const normalized = normalizeChannel(payload?.channel ?? payload);
      const nowIso = new Date().toISOString();
      let savedIndex;
      if (normalized.id !== null) {
        const existing = store.channels.find((c) => c.id === normalized.id);
        if (!existing) throw new PushError("not-found", `渠道 "${normalized.id}" 不存在`, 404);
        savedIndex = store.channels.indexOf(existing);
        Object.assign(existing, {
          name: normalized.name,
          type: normalized.type,
          enabled: normalized.enabled,
          config: normalized.config,
          updatedAt: nowIso,
        });
      } else {
        store.channels.push({
          id: `ch-${randomUUID().slice(0, 8)}`,
          name: normalized.name,
          type: normalized.type,
          enabled: normalized.enabled,
          config: normalized.config,
          createdAt: nowIso,
          updatedAt: nowIso,
        });
        savedIndex = store.channels.length - 1;
      }
      scheduleSave();
      return { channel: publicChannel(store.channels[savedIndex]) };
    },

    remove: async (payload) => {
      const id = payload?.id;
      if (typeof id !== "string" || id === "") throw new PushError("bad-request", "missing id");
      const index = store.channels.findIndex((c) => c.id === id);
      if (index === -1) throw new PushError("not-found", `渠道 "${id}" 不存在`, 404);
      store.channels.splice(index, 1);
      scheduleSave();
      return { id, deleted: true };
    },

    toggle: async (payload) => {
      const id = payload?.id;
      if (typeof id !== "string" || id === "") throw new PushError("bad-request", "missing id");
      const channel = store.channels.find((c) => c.id === id);
      if (!channel) throw new PushError("not-found", `渠道 "${id}" 不存在`, 404);
      channel.enabled = payload.enabled !== false;
      channel.updatedAt = new Date().toISOString();
      scheduleSave();
      return { id, enabled: channel.enabled, channel: publicChannel(channel) };
    },

    test: async (payload) => {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:926-931](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L926-L931)

卸载不await。

```text
  }), "chicheng-push: /push/api routes");

  ctx.effect(() => () => {
    void flushStore();
  }, "chicheng-push: teardown");

```

**依据 4 · 源码核查**：[lib/client.js:357-405](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/client.js#L357-L405)

编辑启用与吞失败。

<details>
<summary>查看原文（49行）</summary>

```text
        if (saving) return;
        if (!formName.trim()) { setFormError(t("needName")); return; }
        var typeDef = null;
        for (var i = 0; i < types.length; i++) if (types[i].id === formType) { typeDef = types[i]; break; }
        if (typeDef) {
          for (var f = 0; f < typeDef.fields.length; f++) {
            var field = typeDef.fields[f];
            if (field.required && !String(formConfig[field.key] || "").trim()) {
              setFormError(field.label + " " + t("fieldRequired"));
              return;
            }
          }
        }
        setSaving(true);
        setFormError("");
        var payload = {
          id: editingId,
          name: formName.trim(),
          type: formType,
          enabled: true,
          config: formConfig,
        };
        api("save", { channel: payload }).then(function () {
          setModalOpen(false);
          setNotice(t("saveOk"));
          refresh();
        }).catch(function (err) {
          setFormError((err && err.message) || t("saveFail"));
        }).finally(function () {
          setSaving(false);
        });
      };

      var toggleChannel = function (channel) {
        api("toggle", { id: channel.id, enabled: channel.enabled !== true }).then(function (value) {
          setChannels(channels.map(function (c) {
            return c.id === value.channel.id ? value.channel : c;
          }));
        }).catch(function () {});
      };

      var removeChannel = function (channel) {
        if (removeArmed !== channel.id) { setRemoveArmed(channel.id); return; }
        setRemoveArmed(null);
        api("remove", { id: channel.id }).then(function () {
          setChannels(channels.filter(function (c) { return c.id !== channel.id; }));
          setNotice("");
        }).catch(function () {});
      };
```

</details>

**依据 5 · 源码核查**：[test/smoke.mjs:11-37](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/test/smoke.mjs#L11-L37)

import与fakeCtx。

<details>
<summary>查看原文（27行）</summary>

```text

// Set DSH_HOME BEFORE importing the plugin (its module top-level computes
// DATA_ROOT from process.env.DSH_HOME).
process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-push-smoke-"));
const { apply } = await import(new URL("../lib/index.js", import.meta.url).href);

// ---------------------------------------------------------------- fake ctx

const registered = [];
const log = [];
const fakeCtx = {
  webServer: {
    register(entry) {
      registered.push(entry);
      return () => {};
    },
  },
  webRuntime: { trustedHosts: [] },
  logger: { info: (...args) => log.push(["info", ...args]) },
  effect(cb) {
    return cb();
  },
  provide(name, value) {
    fakeCtx._provided = fakeCtx._provided || {};
    fakeCtx._provided[name] = value;
    return () => {};
  },
```

</details>

**依据 6 · 源码核查**：[test/smoke.mjs:43-75](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/test/smoke.mjs#L43-L75)

本地HTTP/harness。

<details>
<summary>查看原文（33行）</summary>

```text
const httpServer = createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    pendingHttpBodies.push({ url: req.url, headers: req.headers, body });
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ code: 0, ok: true }));
  });
});

function request(entry, method, path, payload, headers = {}) {
  const req = new Readable({ read() {} });
  req.method = method;
  req.url = path;
  req.headers = { host: "127.0.0.1:3080", ...headers };
  if (payload !== undefined) req.push(JSON.stringify(payload));
  req.push(null);
  const res = {
    _status: 0,
    _body: "",
    writeHead(status, h) { this._status = status; this._headers = h; },
    end(body) { this._body = body; },
  };
  return entry.handler(req, res).then(() => ({
    status: res._status,
    body: JSON.parse(res._body || "{}"),
  }));
}

// ---------------------------------------------------------------- run

let failures = 0;
const check = (label, cond, extra = "") => {
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、使用和恢复要付出哪些成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

host硬依赖webServer/webRuntime，Web客户端需locale/slots/primitives和React宿主模块；HTTP用内置fetch，SMTP动态import nodemailer而包未声明直接依赖，缺库会明确失败。需要渠道账户/机器人/目标ID，签名/Token等由用户配置，包未声明DSH版本范围，不能把仅Cordis peer当完整兼容矩阵。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web宿主、推送账户/机器人/自建网关；SMTP另需nodemailer | 配可信目标和凭证、限制端口/文件访问、调用插件接入；工时未知 | 渠道不同收费/配额未知，本插件不包含定时任务触发器 |
| 持续使用 | 多渠道网络请求，逐渠道12秒HTTP预算，SMTP另由库默认 | 核消息内容/目标与接口结果，管理失效凭证和限额 | 不含读者送达回执/去重；金额、可靠送达率与净省时未知 |
| 失败恢复 | 重发请求、原渠道配置备份、凭证轮换资源 | 判断已发未确认渠道、避免重复，恢复文件并核实际收件 | 无持久发送队列/自动重试/幂等事务，超时后是否已发未知；工时金额未知 |

统一出口可减少每任务插件重复维护，价值要看正确且可控的消息抵达，不是类型数多。HTTP发送本身无模型调用，但上游Agent生成通知的费用另算；服务商免费额/网络/设备到账率均未知。本次不发测试消息，不核外部账户，保持源码边界。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-42](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/package.json#L14-L42)

发布和UI依赖。

<details>
<summary>查看原文（29行）</summary>

```text
  "homepage": "https://github.com/534119219/chicheng-push#readme",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-primitives"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:25-28](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L25-L28)

服务依赖。

```text

const name = "chicheng-push";
const NS = "chicheng-push";
const inject = ["webServer", "webRuntime"];
```

**依据 3 · 源码核查**：[lib/index.js:555-564](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L555-L564)

可选SMTP库。

<details>
<summary>查看原文（10行）</summary>

```text
async function sendEmail(config, title, content) {
  const user = String(config.emailUser ?? "").trim();
  const pass = String(config.emailPass ?? "");
  const to = String(config.emailTo ?? "").trim();
  if (user === "" || pass === "" || to === "") throw new Error("缺少邮件发件人、授权码或收件人");
  let nodemailer;
  try {
    nodemailer = (await import("nodemailer")).default ?? (await import("nodemailer"));
  } catch {
    throw new Error("当前环境无法加载 nodemailer，无法发送邮件；请改用其他渠道或安装 nodemailer");
```

</details>

**依据 4 · 源码核查**：[lib/client.js:128-146](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/client.js#L128-L146)

设置POST。

<details>
<summary>查看原文（19行）</summary>

```text
    // ---- api helper

    function api(method, payload) {
      return fetch("/push/api/" + method, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload || {}),
        credentials: "same-origin",
      }).then(function (res) { return res.json(); }).then(function (body) {
        if (!body || body.ok !== true) {
          var msg = body && body.error && body.error.message ? body.error.message : "api error";
          var err = new Error(msg);
          err.code = body && body.error && body.error.code ? body.error.code : "api-error";
          throw err;
        }
        return body.value;
      });
    }

```

</details>

#### 缺口

- 各渠道当前协议/配额/费用与通知到账率、跨任务集成净节时
  **影响**：适配代码不等所有渠道此时真实可用，接口sent不能替代到账KPI
  **进一步探讨**：由受权操作者选定渠道核服务商协议和受理/到账证据，按消息有效送达计总费用与人工

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 采用建议和可证伪改进方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察。统一出口用途清楚，但Header型围栏配合secret回显、模糊ack假成功、落盘未确认与无幂等重试，会影响“可靠告知任务完成”的核心承诺；不是单纯因为没有冒烟。继续探讨可从严格本机监听/认证、最小权限受信渠道、只发脱敏摘要和人工核真实受理入手，不把此项作为唯一失败告警或任务完成证据。

可推导“受权且可审计的通知发件箱”。参照当前直接send循环，在凭证服务独立secret、目标授权和对端身份之后，以稳定消息ID/渠道ID生成持久outbox，区分prepared/accepted/unknown/failed，按每渠道协议核受理码、保存发送attempt与外部messageId，仅对明确未发送者重试，unknown留人工/幂等查询；配置先持久再发布，UI不重启停用渠道。最小反例用伪Host/缺Origin、500{}和200HTML、丢回包/超时、重复ID、空目标、flush失败/并发和secret跨目标redirect。若仍把unknown记sent、未经授权外发或重复成功渠道，则否定可靠性；若管理复杂度增加但有效消息和恢复工时无改善则否定业务收益。未验证，不计现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:724-743](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L724-L743)

调用者边界参照。

<details>
<summary>查看原文（20行）</summary>

```text
  const host = header(request.headers, "host");
  if (host === undefined) return false;
  const hostUrl = parseAuthority(host);
  if (hostUrl === undefined) return false;
  const hosts = Array.isArray(trustedHosts) ? trustedHosts : [];
  const trusted = hosts.some((entry) => {
    const entryUrl = parseAuthority(entry);
    if (entryUrl === undefined) return false;
    return entryUrl.hostname === hostUrl.hostname && (entryUrl.port === "" || entryUrl.port === hostUrl.port);
  });
  if (!isLoopbackHostname(hostUrl.hostname) && !trusted) return false;
  if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
  const origin = header(request.headers, "origin");
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:303-316](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L303-L316)

受理判据参照。

<details>
<summary>查看原文（14行）</summary>

```text
async function sendServerChan(config, title, content) {
  const key = String(config.serverChanKey ?? "").trim();
  if (key === "") throw new Error("缺少 ServerChan SendKey");
  const match = /^sctp(\d+)t/i.exec(key);
  const url = match && match[1]
    ? `https://${match[1]}.push.ft07.com/send/${key}.send`
    : `https://sctapi.ftqq.com/${key}.send`;
  const res = await httpJson(url, { form: { title, desp: content } });
  const errno = res.json?.errno ?? res.json?.data?.errno;
  if (res.json && errno !== undefined && errno !== 0) {
    throw new Error(`Server酱返回 errno=${errno}: ${res.text.slice(0, 300)}`);
  }
  if (!res.ok && !res.json) throw new Error(`Server酱 HTTP ${res.status}: ${res.text.slice(0, 300)}`);
  return `Server酱已发送 (${res.status})`;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:601-630](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L601-L630)

目标/结果参照。

<details>
<summary>查看原文（30行）</summary>

```text
function resolveTargets(channels) {
  const active = store.channels.filter((c) => c.enabled !== false);
  if (channels === undefined || channels === null || channels === "all" || channels === "*") return active;
  const ids = Array.isArray(channels) ? channels.map(String) : [String(channels)];
  if (ids.length === 0) return active;
  if (ids.includes("all") || ids.includes("*")) return active;
  const byId = new Map(active.map((c) => [c.id, c]));
  const byName = new Map(active.map((c) => [c.name, c]));
  return ids.map((id) => byId.get(id) ?? byName.get(id)).filter(Boolean);
}

/**
 * Send a notification. This is the face exposed both as the `pushNotifier`
 * service (host plugins) and as the /push/api/send route (any caller).
 */
async function sendNotification({ title, content, channels }) {
  const titleText = String(title ?? "").trim();
  const contentText = String(content ?? "");
  const targets = resolveTargets(channels);
  const results = [];
  for (const channel of targets) {
    results.push(await sendChannel(channel, titleText, contentText));
  }
  return {
    ok: results.length > 0 && results.every((r) => r.ok),
    total: results.length,
    sent: results.filter((r) => r.ok).length,
    results,
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:55-73](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js#L55-L73)

未确认持久参照。

<details>
<summary>查看原文（19行）</summary>

```text
function scheduleSave() {
  if (storeDirtyTimer !== null) return;
  storeDirtyTimer = setTimeout(() => {
    storeDirtyTimer = null;
    void flushStore();
  }, 150);
}

async function flushStore() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${STORE_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
    await rename(tmp, STORE_PATH);
  } catch (error) {
    console.error(`[chicheng-push] store flush failed:`, error);
  }
}

```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
