# dsh-model-auto-enricher

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[4c18dc2](https://github.com/66rapper/dsh-model-auto-enricher/tree/4c18dc2a231f336a31d49dccfff9606edc6456c9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher)
<!-- END META -->

> **实现功能**：按模型名称规则批量补齐 DSH 上下文、输出、图片与推理配置并默认自动写盘。

> **核心亮点**：把重复模型字段配置和状态展示集中化，减少人工点击；仅改变本地配置，不扩展供应商实际能力。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：未知模型默认1M/图片/思考，且启动自动巡检会直接备份并覆盖 YAML；只升不降不等于安全，备份也不保护并发写。详见[Q03](#research-q03)。

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
  - [Q01 · 哪种配置工作负担被减少？](#detail-section-11)
  - [Q02 · 规则如何推断并改写上下文/模态/思考档位？](#detail-section-12)
  - [Q03 · 自动写盘和恢复有什么保证及缺口？](#detail-section-13)
  - [Q04 · 怎样试用或替代及验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护大量 DSH 模型渠道的用户减少逐项配置工作。

逐个模型在 DSH 设置中填写字段或由供应商模型目录导入；插件改为名称规则批量写入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 规则规划 | 批量字段建议 | 名称不证明供应商能力 |
| 自动写入 | 备份后覆盖 YAML | 默认启用、非原子/无并发保护 |
| 管理面板 | 查看和手动执行 | 宿主未验 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH profile patch 与 webServer | 读取/写入及 UI API | 功能失效 |
| YAML 依赖 | 解析/序列化 | 无法运行 |
| 模型真实规格/代理限制 | 正确配置 | 误赋能或请求失败 |
| 备份目录可写 | 恢复 | 写入前失败或备份碰撞 |


#### 审慎试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 隔离 | 复制 profile 并关 autoWatch | 原配置不动 |
| 预览 | inspect/dryRun 看字段 diff | 来源可核 |
| 验证 | 逐模型查文档/实际请求 | 模态与窗口可达 |
| 写入 | 复制目录下应用 | 备份/语义对照成功 |
| 恢复 | 回滚测试 | 可复原原配置 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 首次 | 安装、关闭自动、复制配置 | 默认自动改写 |
| 校验 | 查每个真实模型能力并发请求 | 名称不足为证 |
| 持续 | 重核新模型/代理、维护备份 | 错误配置/费用/恢复 |


#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 批量规划 | 规则表/逐模型 diff | 真实规格正确率 |
| 备份/写入 | 秒级 copy 与 YAML 重序列化 | 并发/崩溃恢复 |
| 自动触发 | 启动/保存/reload | 用户净收益 |

> **思考**：未知模型默认1M/图片/思考，且启动自动巡检会直接备份并覆盖 YAML；只升不降不等于安全，备份也不保护并发写。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把重复模型字段配置和状态展示集中化，减少人工点击；仅改变本地配置，不扩展供应商实际能力。详见[Q01](#research-q01)、[Q02](#research-q02)。

把重复模型字段配置和状态展示集中化，减少人工点击；仅改变本地配置，不扩展供应商实际能力。详见[Q01](#research-q01)、[Q02](#research-q02)。

Host 端回环/同源门控、YAML 解析与规则表；预览零写。真实写直接覆盖、无 hash/CAS，保留顶部注释但重排主体；自动与手动写不共用锁。

<a id="detail-section-5"></a>

### 1.4 主要限制

未知模型默认1M/图片/思考，且启动自动巡检会直接备份并覆盖 YAML；只升不降不等于安全，备份也不保护并发写。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

默认不推荐自动模式。若试用先关 autoWatch、只读预览、逐模型核规格后在复制 profile 中验证。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

批量改写与备份路径可静态核查；名称推断不证明真实模型能力，自动写盘存在配置误赋能与竞态边界。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、lib/core.js、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态阅读固定版 README、package、core、Host 和客户端入口；未运行目标插件、写用户配置或调用模型。
- 下一步：在隔离 profile 用已知/未知/文本/图像/嵌入模型及并发设置保存、同秒备份、写失败验证误赋能与恢复。

**分析版本**

- **仓库**：[66rapper/dsh-model-auto-enricher](https://github.com/66rapper/dsh-model-auto-enricher)
- **版本号**：2.0.0（[固定提交 4c18dc2](https://github.com/66rapper/dsh-model-auto-enricher/tree/4c18dc2a231f336a31d49dccfff9606edc6456c9)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

默认保守、逐项可审 diff 与能力来源，配 CAS/原子替换；用真实模型/并发矩阵比较误配置与省时，现版未实现。详见[Q04](#research-q04)。

在隔离 profile 用已知/未知/文本/图像/嵌入模型及并发设置保存、同秒备份、写失败验证误赋能与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 2031 | 1640 | 246 | — |
| .md | source | 2 | 180 | — | — | 3102 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+created%3A2026-09-22T05%3A40%3A59.052Z..2026-10-22T05%3A40%3A59.052Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/66rapper/dsh-model-auto-enricher/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A40%3A59.052Z..2026-10-22T05%3A40%3A59.052Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实自动补齐模型配置的规则、写盘/备份边界及未知模型误标风险。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种配置工作负担被减少？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH profile 里维护大量第三方模型渠道、逐个填写 contextWindow、maxTokens、图片输入和推理档位的用户。固定版在 Web 提供状态/执行路由和管理面板，读取 cordis.patch.yml 的 llm provider 模型，既能预览，也可手动或在模型设置保存/启动后自动写回。相对逐项点设置，它把批量配置、备份和状态展示集中化；但其输入是名称与已有本地配置，不通过模型提供方 API 核验真实能力。合格交付应保持 YAML 语义与用户选择，不能让前端出现并不受上游支持的图片、推理或超长上下文开关。README 的“全部拉满”“100%安全”属于作者宣传，不能从写入成功推出请求可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:7-47](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/README.zh.md#L7-L47)

作者描述逐模型配置负担、自动补齐和可视面板。

<details>
<summary>查看原文（41行）</summary>

```text
## 😫 为什么做这个插件？（真实痛点）

在 DSH 里每添加一个新的中转站或第三方 API 渠道，里面往往有十几个甚至几十个模型。
但是在 DSH 默认设置界面里，拉取或添加完模型后，**每一个模型都得你自己手动点开去调**：
- 要一个个手填 **上下文窗口**（默认是空的，或者被限制在 128k / 200k，不改很快就会爆上下文）；
- 要一个个手填 **最大输出 Token**（默认是空的）；
- 要一个个手动勾选 **「图片」多模态开关**（默认只勾了纯文本，不勾根本发不了截图）；
- 要一个个手动打开 **「推理等级」开关** 并添加 `max` 档位（默认没开，开了也只有 `low / medium / high`，没有最高 `max` 档）。

**十几个模型一个个点开改下来，又麻烦又累；以后每次往渠道里新加一两个模型，还得再重复折腾一遍！**

装上 **「DSH 模型补齐助手」** 后：
👉 **你只需要在设置里把渠道和模型加进去、点一下保存，剩下的调上下文（100 万）、开多模态发图、配思考强度档位（`low / high / max`）全部由插件在后台自动帮你一次性搞定！**

---

## 🛠️ 具体帮你省掉哪些手动操作？

| 你以前要手动挨个调的项 | DSH 默认刚加进来时 | 装上本插件后（全自动） |
|---|---|---|
| **1. 调上下文容量** | 空白未填，或被截断在 `128k` / `200k` / `256k` | 自动全部拉满到 **100 万长上下文（`1,000,000`）** |
| **2. 调最大输出** | 空白未填 | 自动按系列补齐 **`64,000` / `128,000`** 最大输出 |
| **3. 调多模态（发图）** | 默认只勾了「文本」，聊天框发不了图 | 自动为所有模型勾选 **「文本 + 图片」（`[text, image]`）** |
| **4. 调思考强度档位** | 默认关闭，或手动打开后缺少 `max` 档 | 自动配齐 **`{ low, high, max }` 思考强度档位**（并保留已有自定义档位） |

---

## ✨ 核心亮点（v2.0 中文友好 · 全自动版）

1. **⚡ 添加新模型保存即自动生效（无需手动点按钮、无需重启 DSH）**
   - 插件在后台自动监听 DSH 的模型设置保存事件。
   - 只要你在 **「设置 → 模型」** 里添加了新模型并点击「应用」，插件会在 **0.6 秒内自动在后台帮你把百万上下文、64k+ 最大输出、发图支持、思考档位全部补齐**，并立即热重载生效！
2. **🧠 认识所有新模型（内置全系列规则 + 通用新模型兜底）**
   - 不仅完整识别 **GPT-4o / GPT-5 / GPT-6 / o1~o9 / Codex**、**Claude 4 / 4.5 / 4.6 / 5 / 5.5+ (Opus / Sonnet)**、**Gemini 2.5 / 3 / 3.5 / 4**、**DeepSeek V3 / V4 / V4.1 / R1 / R2**、**GLM 5 / 5.2 / 5.3 / Z1**、**Kimi K2.6 / K2.7 / K2.8 / K3**、**腾讯混元 Hy3 / Hy4**、**MiniMax / Step / Qwen / Grok / 豆包 / Llama / Mistral** 等全系模型；
   - **哪怕是你以后新加的、名字从来没见过的全新模型或内部代号模型**（如 `space-bunny`、`argon`、`astra`、`sol` 等），也会自动触发**「通用新模型规则」**，默认按顶配规格（`1M 上下文 + 64k 最大输出 + 支持发图 + low/high/max 思考档位`）一步到位补齐！
3. **🛡️ 100% 安全，只升不降，写前自动备份**
   - **只升不降**：如果你某个模型已经设了更大的上下文或更大的输出（如 `128000`），绝不会给你改小；已有的自定义思考档位（如 `off`、`medium`、`xhigh`）一律原样保留。
   - **自动备份**：每次修改配置文件前，都会自动在同目录生成带时间戳的备份文件（`cordis.patch.yml.bak-auto-enrich-YYYYMMDD-HHmmss`）。
   - **严格幂等**：所有模型已经是最佳状态时，不会改动任何字节，也不会产生多余备份。
4. **🖥️ 内置可视化管理面板（设置 → 模型补齐助手）**
   - 在 DSH 设置页左侧导航栏新增 **「模型补齐助手」** 面板，随时查看所有渠道与模型的健康状态、识别系列标签、上下文容量、多模态与思考档位明细，也支持手动一键补齐。
```

</details>

**依据 2 · 源码核查**：[lib/core.js:420-433](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L420-L433)

只扫描 patch 中的 providers 模型条目。

<details>
<summary>查看原文（14行）</summary>

```text
 * 遍历配置里的全部 `llm-*` provider 条目，产出 `{ entry, providerId, provider }` 三元组。
 * 只认 `config.providers` 结构 —— 其他 patch 行完全不被触碰。
 */
export function* iterateProviders(data) {
  const list = Array.isArray(data) ? data : [];
  for (const entry of list) {
    const providers = isPlainObject(entry?.config?.providers) ? entry.config.providers : null;
    if (!providers) continue;
    for (const [providerId, provider] of Object.entries(providers)) {
      if (!isPlainObject(provider)) continue;
      yield { entry, providerId, provider };
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:149-233](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/index.js#L149-L233)

状态和手动执行 API。

<details>
<summary>查看原文（85行）</summary>

```text
/**
 * 构建 `/api/model-enricher` 前缀处理器。
 * @param ctx 宿主 cordis 上下文
 * @param config 插件配置（可选 `{ file }` 覆盖目标配置文件）
 * @param state 运行期共享状态（记录最近一次自动补齐信息）
 */
export function createHandler(ctx, config = {}, state = {}) {
  const configuredFile = typeof config?.file === 'string' && config.file.trim() ? config.file.trim() : undefined;

  return async function modelEnricherHandler(req, res) {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const rel = url.pathname.slice(API_PREFIX.length).replace(/^\/+/, '');
    const segments = rel.split('/').filter(Boolean);

    if (!isLoopbackRequest(req)) {
      sendJson(res, 403, { ok: false, error: 'forbidden: loopback-only' });
      return;
    }

    try {
      // GET /api/model-enricher — 端点索引
      if (segments.length === 0) {
        if (req.method !== 'GET') {
          sendJson(res, 405, { ok: false, error: `method not allowed: ${req.method}` });
          return;
        }
        sendJson(res, 200, {
          ok: true,
          engine: PLUGIN_ID,
          file: resolveConfigPath(configuredFile),
          autoWatch: state.autoWatch !== false,
          lastAutoEnrich: state.lastAutoEnrich ?? null,
          endpoints: [
            { method: 'GET', path: `${API_PREFIX}/status`, description: '只读体检：渠道数 / 模型数 / 待优化清单' },
            { method: 'POST', path: `${API_PREFIX}/run`, description: '执行补齐（写前自动时间戳备份）；body { dryRun?: boolean }' },
          ],
        });
        return;
      }

      // GET /api/model-enricher/status
      if (segments[0] === 'status') {
        if (req.method !== 'GET') {
          sendJson(res, 405, { ok: false, error: `method not allowed: ${req.method}` });
          return;
        }
        const status = await inspectConfig({ file: configuredFile });
        sendJson(res, 200, {
          ...status,
          readOnly: true,
          autoWatch: state.autoWatch !== false,
          lastAutoEnrich: state.lastAutoEnrich ?? null,
        });
        return;
      }

      // POST /api/model-enricher/run
      if (segments[0] === 'run') {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: `method not allowed: ${req.method}` });
          return;
        }
        const body = await readJsonBody(req);
        const result = await runEnrich({ file: configuredFile, dryRun: body.dryRun === true });
        if (result.changed && !body.dryRun) {
          state.lastAutoEnrich = {
            at: new Date().toISOString(),
            trigger: 'manual',
            changedCount: result.changedCount,
            changedModelCount: result.changedModelCount,
            backupPath: result.backupPath,
            summary: result.summary,
          };
          // 异步通知宿主热重载，不阻塞 HTTP 响应返回
          setTimeout(() => {
            notifyHostConfigReload(ctx).catch(() => {});
          }, 80);
        }
        sendJson(res, 200, {
          ...result,
          autoWatch: state.autoWatch !== false,
          lastAutoEnrich: state.lastAutoEnrich ?? null,
        });
        return;
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:268-341](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/index.js#L268-L341)

自动巡检/启动及设置保存事件触发。

<details>
<summary>查看原文（74行）</summary>

```text
  // 后台自动巡检与补齐（带重入锁与幂等保护：若 pendingCount === 0 则 0 写入、0 副作用）
  async function checkAndAutoEnrich(trigger) {
    if (!state.autoWatch || state.running) return;
    state.running = true;
    try {
      const status = await inspectConfig({ file: configuredFile });
      if (status && status.pendingCount > 0) {
        log.info?.(
          `[${PLUGIN_ID}] 检测到新加入或待优化的模型（触发源: ${trigger}，共 ${status.pendingModelCount} 个模型 / ${status.pendingCount} 处），正在自动智能补齐...`,
        );
        const result = await runEnrich({ file: configuredFile, dryRun: false });
        if (result.changed) {
          state.lastAutoEnrich = {
            at: new Date().toISOString(),
            trigger,
            changedCount: result.changedCount,
            changedModelCount: result.changedModelCount,
            backupPath: result.backupPath,
            summary: result.summary,
          };
          log.info?.(`[${PLUGIN_ID}] 自动补齐完成：${result.summary}`);
          await notifyHostConfigReload(ctx);
        }
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 自动巡检补齐失败（${trigger}）：${error instanceof Error ? error.message : String(error)}`);
    } finally {
      state.running = false;
    }
  }

  ctx.effect(() => {
    const disposers = [];
    let debounceTimer = null;

    const scheduleAutoEnrich = (trigger, delayMs = 600) => {
      if (!state.autoWatch) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        checkAndAutoEnrich(trigger).catch(() => {});
      }, delayMs);
    };

    const disposeRoute = webServer.register({
      kind: 'prefix',
      path: API_PREFIX,
      handler,
    });
    if (typeof disposeRoute === 'function') disposers.push(disposeRoute);

    // 监听设置页保存事件（当用户在「模型」设置页新增或修改模型时，ns === 'llm-pi-ai'）
    try {
      if (typeof ctx.on === 'function') {
        const offSettings = ctx.on('settings/document-updated', (ns) => {
          if (!ns || String(ns).startsWith('llm')) {
            scheduleAutoEnrich(`settings/document-updated(${ns})`, 650);
          }
        });
        if (typeof offSettings === 'function') disposers.push(offSettings);

        const offReload = ctx.on('app-boot/config-reload', () => {
          scheduleAutoEnrich('app-boot/config-reload', 800);
        });
        if (typeof offReload === 'function') disposers.push(offReload);
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 注册配置变更监听失败：${error instanceof Error ? error.message : String(error)}`);
    }

    // 插件挂载后做一次初始巡检，若当前已有未补齐的新模型则立即自动补齐
    scheduleAutoEnrich('plugin-startup', 500);

    log.info?.(`[${PLUGIN_ID}] 已注册路由 ${API_PREFIX} 并开启新模型自动监听补齐`);
```

</details>

#### 缺口

- 没有真实模型服务商能力和 DSH 宿主请求结果对照。
  **影响**：不能证明自动配置带来可工作的上下文/图片/推理支持。
  **进一步探讨**：选择有官方规格的多类模型，在隔离 profile 对照配置、请求成功率与错误。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规则如何推断并改写上下文/模态/思考档位？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

引擎按 id+name 的小写串依次匹配系列正则，首个命中决定目标窗口/输出/图片/推理档位；未知名称落入 universal，默认1M上下文、64k最大输出、[text,image]，绝大多数名称还补 low/high/max。已有数值通过 Math.max 只升不降，input 取并集，已有思考档位保留并补齐缺的标准三档。对于名称与能力不一致的代理、中转站、文本模型或未来代号，这会把“可配置字段”误当“上游实有能力”；提高字段值无法扩展模型服务端硬上限，可能引发请求拒绝、截断、费用或用户误判。README 有些规则表与代码细节也可能漂移，例如作者把全新模型兜底表述为必有完整推理，代码对 lite/image/embed 等名称有排除。应把这些视为启发式默认值，绝非模型规格认证。源码没有对每个 model 做远程探测或能力协商。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:75-211](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L75-L211)

系列规则、通用兜底及正则条件。

<details>
<summary>查看原文（137行）</summary>

```text
/* ------------------------------------------------------------------ 规则矩阵 */

/**
 * 系列规则矩阵。按序匹配 `id + ' ' + name` 的小写拼接串，**命中即停**，
 * 因此顺序有意义：`gpt-oss` 与 `non-chat` 必须放在最前。
 *
 * 字段语义：
 *  - `test`          命中该系列的正则
 *  - `contextWindow` 目标上下文（number 或 `(key) => number`）
 *  - `maxTokens`     目标最大输出（number 或 `(key) => number`）
 *  - `input`         目标模态（与现有模态取并集，绝不删减已有模态）
 *  - `reasoning`     boolean / RegExp / `(key) => boolean`，命中即要求补齐 reasoningEfforts
 */
export const SERIES_RULES = [
  {
    id: 'gpt-oss',
    label: 'GPT 开源版',
    test: /gpt-oss/,
    contextWindow: 128000,
    maxTokens: 64000,
    input: ['text'],
    reasoning: null,
  },
  {
    id: 'non-chat',
    label: '专用向量/语音模型',
    test: /\b(embed|embedding|rerank|reranker|bge-|whisper|tts|asr)\b/,
    contextWindow: null,
    maxTokens: null,
    input: ['text'],
    reasoning: null,
  },
  {
    id: 'claude',
    label: 'Claude 系列',
    test: /claude/,
    // 除老款 Claude 2/3 外，Claude 4 / 4.5 / 4.6 / 5 / 5.5+ 及所有 opus / sonnet 一律 1M
    contextWindow: (key) =>
      /claude-[123]\b|haiku-3/.test(key) && !/4|5|6|7|8|9|opus|sonnet/.test(key) ? 200000 : 1000000,
    maxTokens: 64000,
    input: ['text', 'image'],
    // Claude 4.5 / 4.6 / 5 / 5.5+ / Opus / Sonnet / Thinking / High 全系支持思考档位
    reasoning: /thinking|high|opus|sonnet|4-5|4-6|4\.5|4\.6|claude-[456789]|[56789]-[0-9]/,
  },
  {
    id: 'gemini',
    label: 'Gemini 系列',
    test: /gemini|\bgemma\b/,
    contextWindow: 1000000,
    maxTokens: 64000,
    input: ['text', 'image'],
    // 除纯 lite 轻量版与纯 image 生图版外，Gemini 全系（Flash / Pro / High / Thinking / Argon / 2.5 / 3 / 3.5 / 4+）均支持思考档位
    reasoning: (key) => !/\blite\b|-lite|\bimage\b|-image/.test(key) || /high|thinking|pro/.test(key),
  },
  {
    id: 'deepseek',
    label: 'DeepSeek 系列',
    test: /deepseek/,
    contextWindow: 1000000,
    maxTokens: 128000,
    input: ['text', 'image'],
    reasoning: /v4|v5|v6|r1|r2|r3|reasoner|thinking|pro|flash|high/,
  },
  {
    id: 'glm',
    label: 'GLM 系列',
    test: /\bglm|chatglm/,
    contextWindow: 1000000,
    // flash 版输出更大（128k），其余 64k
    maxTokens: (key) => (/flash/.test(key) ? 128000 : 64000),
    input: ['text', 'image'],
    reasoning: /5\.2|5\.3|5\.4|5\.5|glm-[6789]|z1|flash|high|thinking|zero/,
  },
  {
    id: 'kimi',
    label: 'Kimi 系列',
    test: /kimi|moonshot/,
    // k2.6 / k2.7 是特化 256k 窗口，其余（k3 / k2.8 / 未来版本）1M
    contextWindow: (key) => (/k2\.6|k2\.7/.test(key) ? 256000 : 1000000),
    maxTokens: (key) => (/k2\.6|k2\.7|k3-1/.test(key) ? 32000 : 64000),
    input: ['text', 'image'],
    reasoning: /k2\.8|k3|k4|k5|preview|thinking|high/,
  },
  {
    id: 'gpt',
    label: 'GPT 系列',
    test: /\bgpt[-_.\d]|\bchatgpt|\bo[13456789]\b|\bcodex\b/,
    contextWindow: 1000000,
    maxTokens: 64000,
    input: ['text', 'image'],
    // GPT-5 / GPT-6 / GPT-7+ / o1~o9 / Codex 及带推理标识的模型全系开启思考档位
    reasoning: /gpt-[56789]|\bo[13456789]\b|codex|thinking|high|pro|astra|sol|max/,
  },
  {
    id: 'hunyuan',
    label: '混元系列',
    test: /\bhy\d|hunyuan/,
    contextWindow: (key) => (/\bhy3\b/.test(key) ? 192000 : 1000000),
    maxTokens: 64000,
    input: ['text', 'image'],
    reasoning: /hy[3456789]|hunyuan|thinking|high|preview/,
  },
  {
    id: 'mainstream',
    label: '主流大模型系列',
    test: /minimax|\bstep[-_.\d]|qwen|qwq|grok|doubao|seed|llama|mistral|pixtral|codestral|ernie|\byi[-_.\d]|nova|nemotron|\bphi[-_.\d]/,
    contextWindow: 1000000,
    maxTokens: 64000,
    input: ['text', 'image'],
    reasoning: /thinking|reasoner|r1|r2|high|qwq|step-[56789]|grok-[3456789]|qwen-?[345]|m[345]\b|preview|pro|max/,
  },
];

/**
 * 通用新模型全量兜底规则（当新加入的模型名字不属于任何已知系列，如内部代号模型 space-bunny / argon / astra / 未来新架构）：
 * 默认按旗舰多模态推理模型补齐（1M 上下文 + 64k 最大输出 + [text, image] 多模态 + { low, high, max } 思考档位），
 * 严格遵守「只升不降」单调原则，彻底解决「新加入的模型不认识、不优化」的问题。
 */
export const FALLBACK_SERIES_RULE = {
  id: 'universal',
  label: '通用新模型规则',
  contextWindow: DEFAULT_CONTEXT_CAP,
  maxTokens: DEFAULT_MAX_TOKENS,
  input: ['text', 'image'],
  reasoning: (key) => !/\blite\b|-lite|\bimage\b|-image|\bembed|\brerank|\bwhisper|\btts|\basr/.test(key),
};

/**
 * 通用底线规则（作用于任何系列，包括未命中任何系列规则的模型）。
 *  - `modality` 命中 → 保证 `input` 含 `image`
 *  - `thinking` 命中 → 保证 `reasoningEfforts` 含 `{ low, high, max }` 且保留自定义档位
 *  - 上下文底线见 `planModel()`：缺失或 ≤ CONTEXT_FLOOR 时按「规则上限」突破，
 *    且已有更大值绝不回退。
 */
export const UNIVERSAL_RULES = {
  modality: /vl|vision|image|multimodal/,
  thinking: /thinking|reasoner|r1|r2|high|qwq|pro|max|preview/,
```

</details>

**依据 2 · 源码核查**：[lib/core.js:445-535](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L445-L535)

名称匹配、只升数值、模态并集和推理档位补齐。

<details>
<summary>查看原文（91行）</summary>

```text
export function planModel(providerId, model, apply = false) {
  const mutable = isPlainObject(model) ? model : {};
  const id = typeof mutable.id === 'string' ? mutable.id : String(mutable.id ?? '');
  const name = typeof mutable.name === 'string' ? mutable.name : '';
  const key = `${id} ${name}`.toLowerCase();

  // 优先匹配已知系列规则；若为全新/未知代号模型，自动落入 FALLBACK_SERIES_RULE 全量兜底规则
  const matchedSeries = SERIES_RULES.find((rule) => rule.test.test(key)) ?? null;
  const series = matchedSeries ?? FALLBACK_SERIES_RULE;
  const targetContext = numOrNull(pickValue(series.contextWindow, key));
  const targetMaxTokens = numOrNull(pickValue(series.maxTokens, key));
  const targetInput = Array.isArray(series.input) ? series.input.slice() : null;
  const seriesWantsReasoning = matchReasoning(series.reasoning, key);
  const modalityFloor = series.id !== 'gpt-oss' && series.id !== 'non-chat' && UNIVERSAL_RULES.modality.test(key);
  const thinkingFloor = series.id !== 'gpt-oss' && series.id !== 'non-chat' && UNIVERSAL_RULES.thinking.test(key);

  const before = {
    contextWindow: numOrNull(mutable.contextWindow),
    maxTokens: numOrNull(mutable.maxTokens),
    input: Array.isArray(mutable.input) ? mutable.input.filter((m) => typeof m === 'string') : null,
    reasoningEfforts: isPlainObject(mutable.reasoningEfforts) ? { ...mutable.reasoningEfforts } : null,
  };

  // 若模型本身已带有部分 reasoningEfforts（如手动开启了部分档位但缺 max 或 high），必定补全标准三档
  const alreadyHasReasoning =
    before.reasoningEfforts !== null && Object.keys(before.reasoningEfforts).length > 0;

  const changes = [];
  const push = (field, label, from, to) => {
    changes.push({ field, label, from: from === undefined ? null : from, to: to === undefined ? null : to });
  };

  /* --- 1) contextWindow：只升不降；缺失补齐；≤ 地板或低于目标上限时自动拉升 --- */
  let nextContext = before.contextWindow;
  if (before.contextWindow === null) {
    nextContext = targetContext ?? DEFAULT_CONTEXT_CAP;
  } else if (targetContext !== null) {
    nextContext = Math.max(targetContext, before.contextWindow);
  }
  if (nextContext !== before.contextWindow) {
    push('contextWindow', '上下文窗口', before.contextWindow, nextContext);
  }

  /* --- 2) maxTokens：同样只升不降，未知新模型兜底补齐 64,000 --- */
  let nextMaxTokens = before.maxTokens;
  if (before.maxTokens === null) {
    nextMaxTokens = targetMaxTokens;
  } else if (targetMaxTokens !== null) {
    nextMaxTokens = Math.max(targetMaxTokens, before.maxTokens);
  }
  if (nextMaxTokens !== before.maxTokens) {
    push('maxTokens', '最大输出', before.maxTokens, nextMaxTokens);
  }

  /* --- 3) input：并集补齐（绝不删减已有模态），保证多模态底线 --- */
  const desired = [];
  if (targetInput) desired.push(...targetInput);
  if (modalityFloor) desired.push('image');
  let nextInput = before.input;
  if (desired.length > 0) {
    const merged = before.input ? before.input.slice() : [];
    for (const modality of desired) if (!merged.includes(modality)) merged.push(modality);
    const canonical = sortedModalities([...new Set(merged)]);
    if (!sameStringArray(canonical, before.input ?? [])) nextInput = canonical;
  }
  if (!sameStringArray(nextInput ?? [], before.input ?? [])) {
    push('input', '模态支持', before.input, nextInput);
  }

  /* --- 4) reasoningEfforts：补齐 { low, high, max }，保留已有自定义档位 --- */
  const wantsReasoning = alreadyHasReasoning || seriesWantsReasoning || thinkingFloor;
  let nextReasoning = before.reasoningEfforts;
  const addedTiers = [];
  if (wantsReasoning) {
    const merged = before.reasoningEfforts ? { ...before.reasoningEfforts } : {};
    for (const tier of REASONING_TIERS) {
      if (!Object.prototype.hasOwnProperty.call(merged, tier)) {
        merged[tier] = tier;
        addedTiers.push(tier);
      }
    }
    if (addedTiers.length > 0) nextReasoning = merged;
  }
  if (addedTiers.length > 0) {
    push('reasoningEfforts', '思考档位', before.reasoningEfforts, nextReasoning);
  }

  /* --- 5) 写回（仅在 apply 时；预览零副作用） --- */
  if (apply && changes.length > 0) {
    for (const change of changes) mutable[change.field] = change.to;
  }
```

</details>

**依据 3 · 源码核查**：[lib/core.js:552-582](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L552-L582)

返回 before/after 与界面派生值。

<details>
<summary>查看原文（31行）</summary>

```text
  return {
    provider: providerId,
    id,
    name: name || id,
    series: series ? series.id : null,
    seriesLabel: series ? series.label : null,
    // 「缺上下文 / 缺多模态 / 缺思考档位」三项检测结论
    hasContext: before.contextWindow !== null,
    hasMultimodal: Array.isArray(before.input) && before.input.includes('image'),
    hasReasoning: before.reasoningEfforts !== null && Object.keys(before.reasoningEfforts).length > 0,
    contextLimited,
    needsContext: changes.some((c) => c.field === 'contextWindow'),
    needsMultimodal: changes.some((c) => c.field === 'input'),
    needsReasoning: changes.some((c) => c.field === 'reasoningEfforts'),
    needsMaxTokens: changes.some((c) => c.field === 'maxTokens'),
    needsEnrich: changes.length > 0,
    issues,
    changes,
    before,
    after: {
      contextWindow: changes.some((c) => c.field === 'contextWindow') ? nextContext : before.contextWindow,
      maxTokens: changes.some((c) => c.field === 'maxTokens') ? nextMaxTokens : before.maxTokens,
      input: changes.some((c) => c.field === 'input') ? nextInput : before.input,
      reasoningEfforts: effectiveReasoning,
    },
    // 折叠面板直接可用的展示派生值
    contextLabel: formatContext(effectiveContext),
    effectiveContext: numOrNull(effectiveContext),
    modalities: effectiveInput ?? [],
    reasoningTiers: effectiveReasoning ? Object.keys(effectiveReasoning) : [],
  };
```

</details>

**依据 4 · 作者声明**：[README.zh.md:34-45](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/README.zh.md#L34-L45)

作者宣称未知模型按旗舰能力兜底。

<details>
<summary>查看原文（12行）</summary>

```text
## ✨ 核心亮点（v2.0 中文友好 · 全自动版）

1. **⚡ 添加新模型保存即自动生效（无需手动点按钮、无需重启 DSH）**
   - 插件在后台自动监听 DSH 的模型设置保存事件。
   - 只要你在 **「设置 → 模型」** 里添加了新模型并点击「应用」，插件会在 **0.6 秒内自动在后台帮你把百万上下文、64k+ 最大输出、发图支持、思考档位全部补齐**，并立即热重载生效！
2. **🧠 认识所有新模型（内置全系列规则 + 通用新模型兜底）**
   - 不仅完整识别 **GPT-4o / GPT-5 / GPT-6 / o1~o9 / Codex**、**Claude 4 / 4.5 / 4.6 / 5 / 5.5+ (Opus / Sonnet)**、**Gemini 2.5 / 3 / 3.5 / 4**、**DeepSeek V3 / V4 / V4.1 / R1 / R2**、**GLM 5 / 5.2 / 5.3 / Z1**、**Kimi K2.6 / K2.7 / K2.8 / K3**、**腾讯混元 Hy3 / Hy4**、**MiniMax / Step / Qwen / Grok / 豆包 / Llama / Mistral** 等全系模型；
   - **哪怕是你以后新加的、名字从来没见过的全新模型或内部代号模型**（如 `space-bunny`、`argon`、`astra`、`sol` 等），也会自动触发**「通用新模型规则」**，默认按顶配规格（`1M 上下文 + 64k 最大输出 + 支持发图 + low/high/max 思考档位`）一步到位补齐！
3. **🛡️ 100% 安全，只升不降，写前自动备份**
   - **只升不降**：如果你某个模型已经设了更大的上下文或更大的输出（如 `128000`），绝不会给你改小；已有的自定义思考档位（如 `off`、`medium`、`xhigh`）一律原样保留。
   - **自动备份**：每次修改配置文件前，都会自动在同目录生成带时间戳的备份文件（`cordis.patch.yml.bak-auto-enrich-YYYYMMDD-HHmmss`）。
   - **严格幂等**：所有模型已经是最佳状态时，不会改动任何字节，也不会产生多余备份。
```

</details>

#### 缺口

- 未逐一核系列规则对应模型实际版本和提供方限制。
  **影响**：无法证明任一名称到能力映射正确，特别是代理重命名。
  **进一步探讨**：建立来源可追溯的模型规格矩阵；对未知模型默认不启用未验证能力。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动写盘和恢复有什么保证及缺口？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

inspectConfig 与 dryRun 不写盘；真实 runEnrich 先基于文件读入规划，若有变更就再对内存数据 apply，按秒级时间戳 copyFileSync 备份，随后 yaml.dump 序列化并 writeFileSync 直接覆盖原文件。只保留顶部连续注释块；主体内行注释/排版不会逐字保留。写入不是临时文件+原子 rename，也无源文件版本或 hash 比对；读取到覆盖间若另有设置进程写入，存在覆盖新改动的竞态。秒级同名备份可能在同一秒多次执行时被 copyFileSync 覆盖，而自动/手动两路径的 state.running 锁并不统一：手动 POST 直接 runEnrich。自动监听默认开启，插件挂载后500ms 初检、设置保存后650ms 以及配置 reload 后800ms 可触发真实写入，用户不必先点击“补齐”。路由只用回环 socket/Host/Origin/Fetch-site 栅栏，没有用户身份核验代码；宿主既有认证若适用需另验。备份有价值，但不是语义正确或无竞态保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:370-415](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L370-L415)

只保留文件顶部注释，YAML 主体重序列化。

<details>
<summary>查看原文（46行）</summary>

```text
/* ------------------------------------------------------------ 读 / 序列化 */

/**
 * 拆出文件顶部的注释块（含紧邻空行），与其余 YAML 主体。
 * 主体之外的一切字节都由这里原样保留 —— 注释头部保真的唯一实现点。
 */
export function splitCommentHeader(raw) {
  const lines = String(raw).split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed === '' || trimmed.startsWith('#')) i += 1;
    else break;
  }
  return { header: lines.slice(0, i).join('\n'), body: lines.slice(i).join('\n') };
}

/**
 * 用 js-yaml 序列化 YAML 主体，并回贴注释头部。
 * dump 选项与验证过的往返无损配置逐字一致（`indent: 2` / `lineWidth: -1` / `noRefs: true`）。
 */
export function serializeConfig(header, data, yaml) {
  const dumped = yaml.dump(data, { indent: 2, lineWidth: -1, noRefs: true });
  const body = dumped.endsWith('\n') ? dumped : `${dumped}\n`;
  const head = header && header.length > 0 ? `${header}\n` : '';
  return head + body;
}

/** 读取 + 解析配置文件（只读，永不写盘）。 */
export async function readConfig(explicitPath) {
  const file = resolveConfigPath(explicitPath);
  if (!existsSync(file)) {
    throw new Error(`配置文件不存在：${file}`);
  }
  const raw = readFileSync(file, 'utf8');
  const { header, body } = splitCommentHeader(raw);
  const yaml = await loadYaml();
  let data;
  try {
    data = yaml.load(body);
  } catch (error) {
    throw new Error(`cordis.patch.yml 解析失败（${file}）：${error instanceof Error ? error.message : String(error)}`);
  }
  if (!Array.isArray(data)) {
    throw new Error(`cordis.patch.yml 顶层结构不是数组（期望 patch 行列表）：${file}`);
  }
```

</details>

**依据 2 · 源码核查**：[lib/core.js:701-769](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L701-L769)

dryRun、秒级备份和直接覆盖写入。

<details>
<summary>查看原文（69行）</summary>

```text
export async function runEnrich(options = {}) {
  const dryRun = options.dryRun === true;
  const ctx = await readConfig(options.file);
  const analysis = analyze(ctx.data, false);

  const base = {
    ok: true,
    engine: PLUGIN_ID,
    engineVersion: ENGINE_VERSION,
    file: ctx.file,
    dryRun,
    providerCount: analysis.providerCount,
    modelCount: analysis.modelCount,
    changedCount: analysis.changes.length,
    changedModelCount: analysis.modelReports.filter((r) => r.needsEnrich).length,
    changes: analysis.changes,
    providers: analysis.providers,
  };

  if (analysis.changes.length === 0) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: Buffer.byteLength(ctx.raw, 'utf8'),
      summary: '✨ 所有模型规格已是最新最优状态，无需修改！',
    };
  }

  if (dryRun) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: null,
      summary:
        `🔍 预览模式（零写入）：共发现 ${analysis.changes.length} 处可补齐项，` +
        `涉及 ${base.changedModelCount} 个模型；未生成备份、未改动任何字节。`,
    };
  }

  // 真实写入路径：重新在 apply 模式下规划（同一份 data 就地补齐）+ 写前备份
  const applied = analyze(ctx.data, true);
  if (applied.changes.length === 0) {
    return { ...base, changed: false, backupPath: null, summary: '✨ 无需修改（二次规划为空，已跳过写入）。' };
  }

  const backupPath = `${ctx.file}.bak-auto-enrich-${timestamp()}`;
  copyFileSync(ctx.file, backupPath);

  const next = serializeConfig(ctx.header, ctx.data, ctx.yaml);
  writeFileSync(ctx.file, next, 'utf8');

  return {
    ...base,
    providers: applied.providers,
    changed: true,
    backupPath,
    backupCreated: true,
    bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
    bytesAfter: Buffer.byteLength(next, 'utf8'),
    summary:
      `✅ 补齐完成：共修复 ${applied.changes.length} 处、涉及 ` +
      `${applied.modelReports.filter((r) => r.needsEnrich).length} 个模型；` +
      `备份已生成：${backupPath}`,
  };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:80-103](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/index.js#L80-L103)

本地回环/同源请求门控。

<details>
<summary>查看原文（24行）</summary>

```text
/** loopback 围栏：与 DSH 既有路由同一口径（本机 127.0.0.1 / ::1 且同源）。 */
function isLoopbackRequest(req) {
  const address = req?.socket?.remoteAddress;
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false;
  const host = req.headers?.host;
  if (typeof host !== 'string') return false;
  let hostUrl;
  try {
    hostUrl = new URL(`http://${host}`);
  } catch {
    return false;
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') {
    return false;
  }
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:205-233](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/index.js#L205-L233)

手动 POST 写入路径。

<details>
<summary>查看原文（29行）</summary>

```text
      // POST /api/model-enricher/run
      if (segments[0] === 'run') {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: `method not allowed: ${req.method}` });
          return;
        }
        const body = await readJsonBody(req);
        const result = await runEnrich({ file: configuredFile, dryRun: body.dryRun === true });
        if (result.changed && !body.dryRun) {
          state.lastAutoEnrich = {
            at: new Date().toISOString(),
            trigger: 'manual',
            changedCount: result.changedCount,
            changedModelCount: result.changedModelCount,
            backupPath: result.backupPath,
            summary: result.summary,
          };
          // 异步通知宿主热重载，不阻塞 HTTP 响应返回
          setTimeout(() => {
            notifyHostConfigReload(ctx).catch(() => {});
          }, 80);
        }
        sendJson(res, 200, {
          ...result,
          autoWatch: state.autoWatch !== false,
          lastAutoEnrich: state.lastAutoEnrich ?? null,
        });
        return;
      }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:249-341](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/index.js#L249-L341)

自动初检、设置保存及 reload 触发。

<details>
<summary>查看原文（93行）</summary>

```text
export function apply(ctx, config = {}) {
  const log = loggerOf(ctx);
  const webServer = readService(ctx, 'webServer');
  const configuredFile = typeof config?.file === 'string' && config.file.trim() ? config.file.trim() : undefined;
  const autoWatch = config?.autoWatch !== false;

  const state = {
    autoWatch,
    lastAutoEnrich: null,
    running: false,
  };

  if (!webServer || typeof webServer.register !== 'function') {
    log.warn?.(`[${PLUGIN_ID}] webServer 服务不可用：跳过 ${API_PREFIX} 路由注册`);
    return;
  }

  const handler = createHandler(ctx, config, state);

  // 后台自动巡检与补齐（带重入锁与幂等保护：若 pendingCount === 0 则 0 写入、0 副作用）
  async function checkAndAutoEnrich(trigger) {
    if (!state.autoWatch || state.running) return;
    state.running = true;
    try {
      const status = await inspectConfig({ file: configuredFile });
      if (status && status.pendingCount > 0) {
        log.info?.(
          `[${PLUGIN_ID}] 检测到新加入或待优化的模型（触发源: ${trigger}，共 ${status.pendingModelCount} 个模型 / ${status.pendingCount} 处），正在自动智能补齐...`,
        );
        const result = await runEnrich({ file: configuredFile, dryRun: false });
        if (result.changed) {
          state.lastAutoEnrich = {
            at: new Date().toISOString(),
            trigger,
            changedCount: result.changedCount,
            changedModelCount: result.changedModelCount,
            backupPath: result.backupPath,
            summary: result.summary,
          };
          log.info?.(`[${PLUGIN_ID}] 自动补齐完成：${result.summary}`);
          await notifyHostConfigReload(ctx);
        }
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 自动巡检补齐失败（${trigger}）：${error instanceof Error ? error.message : String(error)}`);
    } finally {
      state.running = false;
    }
  }

  ctx.effect(() => {
    const disposers = [];
    let debounceTimer = null;

    const scheduleAutoEnrich = (trigger, delayMs = 600) => {
      if (!state.autoWatch) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        checkAndAutoEnrich(trigger).catch(() => {});
      }, delayMs);
    };

    const disposeRoute = webServer.register({
      kind: 'prefix',
      path: API_PREFIX,
      handler,
    });
    if (typeof disposeRoute === 'function') disposers.push(disposeRoute);

    // 监听设置页保存事件（当用户在「模型」设置页新增或修改模型时，ns === 'llm-pi-ai'）
    try {
      if (typeof ctx.on === 'function') {
        const offSettings = ctx.on('settings/document-updated', (ns) => {
          if (!ns || String(ns).startsWith('llm')) {
            scheduleAutoEnrich(`settings/document-updated(${ns})`, 650);
          }
        });
        if (typeof offSettings === 'function') disposers.push(offSettings);

        const offReload = ctx.on('app-boot/config-reload', () => {
          scheduleAutoEnrich('app-boot/config-reload', 800);
        });
        if (typeof offReload === 'function') disposers.push(offReload);
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 注册配置变更监听失败：${error instanceof Error ? error.message : String(error)}`);
    }

    // 插件挂载后做一次初始巡检，若当前已有未补齐的新模型则立即自动补齐
    scheduleAutoEnrich('plugin-startup', 500);

    log.info?.(`[${PLUGIN_ID}] 已注册路由 ${API_PREFIX} 并开启新模型自动监听补齐`);
```

</details>

#### 缺口

- 未模拟并发保存、断电/写盘失败或备份碰撞。
  **影响**：不能确认真实用户配置在竞争/故障时可恢复。
  **进一步探讨**：隔离文件下交错启动自动与手动写，注入写失败/同秒操作，逐字对照备份和修复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用或替代及验证？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前不推荐默认自动补齐。若要降低批量工作，先关闭 autoWatch、只读预览并将每个待改字段与模型供应商文档/真实 API capability 对照，人工确认后在复制的 profile 上写入并跑图片、推理档位、长上下文和最大输出的可达性测试。成本不只是一次安装：错误配置可能导致请求失败、额外费用或误导用户，且每次模型/代理更新都需重核。更稳妥的未实现方案是默认只补显然缺失且可证实的字段，对未知模型不宣称1M/image/reasoning；写前展示 diff、人工逐项批准，使用 hash/CAS、唯一备份和原子替换。最小验证覆盖文本/图像/推理/嵌入模型、别名、不同中转站和并发设置保存，量化误赋能率、成功请求比例、回滚恢复率与节省的人工点击。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:18-47](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/README.zh.md#L18-L47)

作者主张自动补齐、省人工并写前备份。

<details>
<summary>查看原文（30行）</summary>

```text
装上 **「DSH 模型补齐助手」** 后：
👉 **你只需要在设置里把渠道和模型加进去、点一下保存，剩下的调上下文（100 万）、开多模态发图、配思考强度档位（`low / high / max`）全部由插件在后台自动帮你一次性搞定！**

---

## 🛠️ 具体帮你省掉哪些手动操作？

| 你以前要手动挨个调的项 | DSH 默认刚加进来时 | 装上本插件后（全自动） |
|---|---|---|
| **1. 调上下文容量** | 空白未填，或被截断在 `128k` / `200k` / `256k` | 自动全部拉满到 **100 万长上下文（`1,000,000`）** |
| **2. 调最大输出** | 空白未填 | 自动按系列补齐 **`64,000` / `128,000`** 最大输出 |
| **3. 调多模态（发图）** | 默认只勾了「文本」，聊天框发不了图 | 自动为所有模型勾选 **「文本 + 图片」（`[text, image]`）** |
| **4. 调思考强度档位** | 默认关闭，或手动打开后缺少 `max` 档 | 自动配齐 **`{ low, high, max }` 思考强度档位**（并保留已有自定义档位） |

---

## ✨ 核心亮点（v2.0 中文友好 · 全自动版）

1. **⚡ 添加新模型保存即自动生效（无需手动点按钮、无需重启 DSH）**
   - 插件在后台自动监听 DSH 的模型设置保存事件。
   - 只要你在 **「设置 → 模型」** 里添加了新模型并点击「应用」，插件会在 **0.6 秒内自动在后台帮你把百万上下文、64k+ 最大输出、发图支持、思考档位全部补齐**，并立即热重载生效！
2. **🧠 认识所有新模型（内置全系列规则 + 通用新模型兜底）**
   - 不仅完整识别 **GPT-4o / GPT-5 / GPT-6 / o1~o9 / Codex**、**Claude 4 / 4.5 / 4.6 / 5 / 5.5+ (Opus / Sonnet)**、**Gemini 2.5 / 3 / 3.5 / 4**、**DeepSeek V3 / V4 / V4.1 / R1 / R2**、**GLM 5 / 5.2 / 5.3 / Z1**、**Kimi K2.6 / K2.7 / K2.8 / K3**、**腾讯混元 Hy3 / Hy4**、**MiniMax / Step / Qwen / Grok / 豆包 / Llama / Mistral** 等全系模型；
   - **哪怕是你以后新加的、名字从来没见过的全新模型或内部代号模型**（如 `space-bunny`、`argon`、`astra`、`sol` 等），也会自动触发**「通用新模型规则」**，默认按顶配规格（`1M 上下文 + 64k 最大输出 + 支持发图 + low/high/max 思考档位`）一步到位补齐！
3. **🛡️ 100% 安全，只升不降，写前自动备份**
   - **只升不降**：如果你某个模型已经设了更大的上下文或更大的输出（如 `128000`），绝不会给你改小；已有的自定义思考档位（如 `off`、`medium`、`xhigh`）一律原样保留。
   - **自动备份**：每次修改配置文件前，都会自动在同目录生成带时间戳的备份文件（`cordis.patch.yml.bak-auto-enrich-YYYYMMDD-HHmmss`）。
   - **严格幂等**：所有模型已经是最佳状态时，不会改动任何字节，也不会产生多余备份。
4. **🖥️ 内置可视化管理面板（设置 → 模型补齐助手）**
   - 在 DSH 设置页左侧导航栏新增 **「模型补齐助手」** 面板，随时查看所有渠道与模型的健康状态、识别系列标签、上下文容量、多模态与思考档位明细，也支持手动一键补齐。
```

</details>

**依据 2 · 源码核查**：[lib/core.js:188-211](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L188-L211)

未知模型旗舰兜底为对照基线。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * 通用新模型全量兜底规则（当新加入的模型名字不属于任何已知系列，如内部代号模型 space-bunny / argon / astra / 未来新架构）：
 * 默认按旗舰多模态推理模型补齐（1M 上下文 + 64k 最大输出 + [text, image] 多模态 + { low, high, max } 思考档位），
 * 严格遵守「只升不降」单调原则，彻底解决「新加入的模型不认识、不优化」的问题。
 */
export const FALLBACK_SERIES_RULE = {
  id: 'universal',
  label: '通用新模型规则',
  contextWindow: DEFAULT_CONTEXT_CAP,
  maxTokens: DEFAULT_MAX_TOKENS,
  input: ['text', 'image'],
  reasoning: (key) => !/\blite\b|-lite|\bimage\b|-image|\bembed|\brerank|\bwhisper|\btts|\basr/.test(key),
};

/**
 * 通用底线规则（作用于任何系列，包括未命中任何系列规则的模型）。
 *  - `modality` 命中 → 保证 `input` 含 `image`
 *  - `thinking` 命中 → 保证 `reasoningEfforts` 含 `{ low, high, max }` 且保留自定义档位
 *  - 上下文底线见 `planModel()`：缺失或 ≤ CONTEXT_FLOOR 时按「规则上限」突破，
 *    且已有更大值绝不回退。
 */
export const UNIVERSAL_RULES = {
  modality: /vl|vision|image|multimodal/,
  thinking: /thinking|reasoner|r1|r2|high|qwq|pro|max|preview/,
```

</details>

**依据 3 · 源码核查**：[lib/core.js:701-769](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/core.js#L701-L769)

可只读预览和真实写入。

<details>
<summary>查看原文（69行）</summary>

```text
export async function runEnrich(options = {}) {
  const dryRun = options.dryRun === true;
  const ctx = await readConfig(options.file);
  const analysis = analyze(ctx.data, false);

  const base = {
    ok: true,
    engine: PLUGIN_ID,
    engineVersion: ENGINE_VERSION,
    file: ctx.file,
    dryRun,
    providerCount: analysis.providerCount,
    modelCount: analysis.modelCount,
    changedCount: analysis.changes.length,
    changedModelCount: analysis.modelReports.filter((r) => r.needsEnrich).length,
    changes: analysis.changes,
    providers: analysis.providers,
  };

  if (analysis.changes.length === 0) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: Buffer.byteLength(ctx.raw, 'utf8'),
      summary: '✨ 所有模型规格已是最新最优状态，无需修改！',
    };
  }

  if (dryRun) {
    return {
      ...base,
      changed: false,
      backupPath: null,
      bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
      bytesAfter: null,
      summary:
        `🔍 预览模式（零写入）：共发现 ${analysis.changes.length} 处可补齐项，` +
        `涉及 ${base.changedModelCount} 个模型；未生成备份、未改动任何字节。`,
    };
  }

  // 真实写入路径：重新在 apply 模式下规划（同一份 data 就地补齐）+ 写前备份
  const applied = analyze(ctx.data, true);
  if (applied.changes.length === 0) {
    return { ...base, changed: false, backupPath: null, summary: '✨ 无需修改（二次规划为空，已跳过写入）。' };
  }

  const backupPath = `${ctx.file}.bak-auto-enrich-${timestamp()}`;
  copyFileSync(ctx.file, backupPath);

  const next = serializeConfig(ctx.header, ctx.data, ctx.yaml);
  writeFileSync(ctx.file, next, 'utf8');

  return {
    ...base,
    providers: applied.providers,
    changed: true,
    backupPath,
    backupCreated: true,
    bytesBefore: Buffer.byteLength(ctx.raw, 'utf8'),
    bytesAfter: Buffer.byteLength(next, 'utf8'),
    summary:
      `✅ 补齐完成：共修复 ${applied.changes.length} 处、涉及 ` +
      `${applied.modelReports.filter((r) => r.needsEnrich).length} 个模型；` +
      `备份已生成：${backupPath}`,
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:249-341](https://github.com/66rapper/dsh-model-auto-enricher/blob/4c18dc2a231f336a31d49dccfff9606edc6456c9/lib/index.js#L249-L341)

autoWatch 可关闭，默认开启。

<details>
<summary>查看原文（93行）</summary>

```text
export function apply(ctx, config = {}) {
  const log = loggerOf(ctx);
  const webServer = readService(ctx, 'webServer');
  const configuredFile = typeof config?.file === 'string' && config.file.trim() ? config.file.trim() : undefined;
  const autoWatch = config?.autoWatch !== false;

  const state = {
    autoWatch,
    lastAutoEnrich: null,
    running: false,
  };

  if (!webServer || typeof webServer.register !== 'function') {
    log.warn?.(`[${PLUGIN_ID}] webServer 服务不可用：跳过 ${API_PREFIX} 路由注册`);
    return;
  }

  const handler = createHandler(ctx, config, state);

  // 后台自动巡检与补齐（带重入锁与幂等保护：若 pendingCount === 0 则 0 写入、0 副作用）
  async function checkAndAutoEnrich(trigger) {
    if (!state.autoWatch || state.running) return;
    state.running = true;
    try {
      const status = await inspectConfig({ file: configuredFile });
      if (status && status.pendingCount > 0) {
        log.info?.(
          `[${PLUGIN_ID}] 检测到新加入或待优化的模型（触发源: ${trigger}，共 ${status.pendingModelCount} 个模型 / ${status.pendingCount} 处），正在自动智能补齐...`,
        );
        const result = await runEnrich({ file: configuredFile, dryRun: false });
        if (result.changed) {
          state.lastAutoEnrich = {
            at: new Date().toISOString(),
            trigger,
            changedCount: result.changedCount,
            changedModelCount: result.changedModelCount,
            backupPath: result.backupPath,
            summary: result.summary,
          };
          log.info?.(`[${PLUGIN_ID}] 自动补齐完成：${result.summary}`);
          await notifyHostConfigReload(ctx);
        }
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 自动巡检补齐失败（${trigger}）：${error instanceof Error ? error.message : String(error)}`);
    } finally {
      state.running = false;
    }
  }

  ctx.effect(() => {
    const disposers = [];
    let debounceTimer = null;

    const scheduleAutoEnrich = (trigger, delayMs = 600) => {
      if (!state.autoWatch) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        checkAndAutoEnrich(trigger).catch(() => {});
      }, delayMs);
    };

    const disposeRoute = webServer.register({
      kind: 'prefix',
      path: API_PREFIX,
      handler,
    });
    if (typeof disposeRoute === 'function') disposers.push(disposeRoute);

    // 监听设置页保存事件（当用户在「模型」设置页新增或修改模型时，ns === 'llm-pi-ai'）
    try {
      if (typeof ctx.on === 'function') {
        const offSettings = ctx.on('settings/document-updated', (ns) => {
          if (!ns || String(ns).startsWith('llm')) {
            scheduleAutoEnrich(`settings/document-updated(${ns})`, 650);
          }
        });
        if (typeof offSettings === 'function') disposers.push(offSettings);

        const offReload = ctx.on('app-boot/config-reload', () => {
          scheduleAutoEnrich('app-boot/config-reload', 800);
        });
        if (typeof offReload === 'function') disposers.push(offReload);
      }
    } catch (error) {
      log.warn?.(`[${PLUGIN_ID}] 注册配置变更监听失败：${error instanceof Error ? error.message : String(error)}`);
    }

    // 插件挂载后做一次初始巡检，若当前已有未补齐的新模型则立即自动补齐
    scheduleAutoEnrich('plugin-startup', 500);

    log.info?.(`[${PLUGIN_ID}] 已注册路由 ${API_PREFIX} 并开启新模型自动监听补齐`);
```

</details>

#### 缺口

- 无模型能力、费用或人工节省的对照数据。
  **影响**：不能证明自动化净收益大于误配置损失。
  **进一步探讨**：建立经过供应商/代理验证的模型清单与请求矩阵，比较现版自动写与逐项批准。
- CAS/原子写和未知模型保守策略未实现。
  **影响**：属于改进假设，不计现有能力。
  **进一步探讨**：原型后注入并发/断写故障并核可恢复性。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
