# QQBot 增强版

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[1f0a51d](https://github.com/zaofan-make/dsh-qqbot/tree/1f0a51d00095ee3124a94045b497021a2475aa5a)

<!-- BEGIN META -->
[![GitHub ★ 221](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=221&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zaofan-make/dsh-qqbot) [![npm 30d 32,354](https://img.shields.io/static/v1?label=npm+30d&message=32%2C354&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zaofan/dsh-qqbot)
<!-- END META -->

> **功能**：把 QQ 消息接入 DSH 会话，并提供富媒体、交付文件发送和 Web 设置。

> **亮点**：[Q01](#research-q01) 把宿主交付事件衔接到当前 QQ 会话，省去重复标记或手动转发。

> **主要限制**：[Q03](#research-q03) 默认访问开放，选定命令的主人回调和群聊访问是两层。

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
  - [Q01 · QQ群任务如何收到 DSH 生成的文件？](#detail-section-11)
  - [Q02 · 去重能否证明文件至少交付一次？](#detail-section-12)
  - [Q03 · 访问控制与管理命令授权是同一层吗？](#detail-section-13)
  - [Q04 · 怎样评估接入而不扩大真实群的操作范围？](#detail-section-14)
  - [Q05 · 让发送去重以最终结果为依据是否有用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 QQ 内给 DSH 发任务并接收文件的使用者，可观察渠道桥的自动交付。

手工在宿主下载再传 QQ 的步骤较多，但上传目标和成功由人核对；上游 QQBot 是现有渠道基线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| QQ 渠道 | 关联消息与宿主会话 | 需 QQ 应用和访问配置 |
| 文件交付 | 自动发送宿主声明文件 | 上限与远端状态影响结果 |
| 主人命令 | 限制选定管理动作 | 依实例配置 OpenID |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| QQ 应用与有效账号配置 | 渠道必需 | 接收和发送消息 | 无法连通 |
| DSH web profile | 设置页必需 | 配置和观察入口 | 其他 profile 可能无界面 |
| 宿主交付事件 | 文件自动发送必需 | 引用当前交付物 | 改用人工交付 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 设置测试群和 OpenID 名单 | 先验证不在名单的输入 |
| 执行 | 对受控群交付一个测试文件 | 在 QQ 端实际查收 |
| 退出 | 关闭访问和对应实例 | 人工转发恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号与运行成本未知 | 安装与权限核对耗时未知 | 上游和 fork 包区分 |
| 持续 | QQ 与模型开销未知 | 群规则及送达复核未知 | 默认开放需检查 |
| 失败 | 重发消耗未知 | 人工核对和恢复耗时未知 | 异步发送失败靠提示 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 自动文件传递 | 交付事件触发发送 | 真实送达和限额 |
| 主人命令边界 | 选定命令拒绝不匹配的 OpenID | 未遍历全部入口 |

> **思考**：[Q03](#research-q03) 默认访问开放，选定命令的主人回调和群聊访问是两层。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把宿主交付事件衔接到当前 QQ 会话，省去重复标记或手动转发。

发送前路径集合与实际发送结果分离，方便去重但不足以作送达台账。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认访问开放，选定命令的主人回调和群聊访问是两层。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在受控群确认名单和静默策略，再测试一个文件并保留人工退路。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持访问、命令回调及文件投递。未验证真实 QQ、宿主和用户收益。

- 已检查：作者 README、包清单、源码路径 README.md、src/transport/events.ts、src/transport/outbound.ts、src/transport/deliverables.ts、src/config.ts、src/gateway/middleware-setup.ts、src/commands/auth.ts、src/commands/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码的群聊配置、命令授权和文件出站代表路径。未核查全部扩展或运行真实 QQ。
- 下一步：对隔离群验证访问拒绝、文件成功、限额与断线回执。

**分析版本**

- **仓库**：[zaofan-make/dsh-qqbot](https://github.com/zaofan-make/dsh-qqbot)
- **版本号**：1.11.39（[固定提交 1f0a51d](https://github.com/zaofan-make/dsh-qqbot/tree/1f0a51d00095ee3124a94045b497021a2475aa5a)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照按安排去重，测试带确认状态的去重和可控重试。

对隔离群验证访问拒绝、文件成功、限额与断线回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 6089 | — | — | 93185 |
| .js | source | 4 | 15228 | 11878 | 3341 | — |
| .mjs | example | 24 | 6956 | 4532 | 2088 | — |
| .md | example | 6 | 746 | — | — | 8769 |
| .js | example | 2 | 349 | 292 | 42 | — |
| .mjs | source | 7 | 706 | 551 | 98 | — |
| .ts | source | 132 | 39052 | 26675 | 10645 | — |
| .ts | test | 31 | 4195 | 3312 | 552 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/zaofan-make/dsh-qqbot/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 QQ 渠道接入时文件交付和管理员边界是否满足小范围试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · QQ群任务如何收到 DSH 生成的文件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户可让模型通过宿主 present 声明交付物，出站处理器收到 deliverables/presented 后投递到当前记录。相比要求模型再写一遍媒体标记，这把发送绑定到宿主交付事件。项目自述为上游 QQ 渠道的增强 fork，交付事件解析源码也注明对齐上游，因此不能把事件桥整体归为本 fork 首创。相较本地手工下载再传，这条路径减少一次搬运，但必须确认目标 QQ 会话有资格接收文件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/README.md#L3-L7)

增强 fork 的范围

```text
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Platform](https://img.shields.io/badge/platform-QQ%20Bot%20(dsh)-blue)

基于 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) 的 QQ Bot IM 插件**增强 fork**：将 QQ 消息平台作为 dsh agent 的前端协议驱动，并加入表情包图库、富媒体收发、定时任务、多实例人格、好感度系统、可视化设置面板等能力。

📦 仓库: [zaofan-make/dsh-qqbot](https://github.com/zaofan-make/dsh-qqbot)（fork 自 [tencent-connect/dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot)；改动都在这一侧，升级/重装上游会被冲掉）
```

**依据 2 · 作者声明**：[README.md:113-124](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/README.md#L113-L124)

作者描述文件发送

<details>
<summary>查看原文（12行）</summary>

```text
## 交付文件直发：`present` → QQ 收到文件（v1.11.7+）

宿主自带 `present` 工具时，模型只要**声明**交付物（`present(文件)`），插件在轮末自动把文件发到当前会话 ——
**正文里不用再写任何 `[MEDIA:file|…]` 标记**。

- 订阅宿主的 `deliverables/presented` 事件（先于 `turn/end` 到达），逐个投递
- 单轮上限读 `sendFile.maxFiles`（默认 4），超出的只提示不发
- 某个文件发失败 → 聚合成一条「📎 已生成文件（未能直接发送）」文字提示，不阻断其余文件
- **自动去重**：同一回合里被 `present` 直发的文件，正文里同路径的 `[MEDIA:file|…]` 标记会被剔除，不会一份文件发两遍
- 走的是与 `send_media` / `[MEDIA:]` **同一条**发送嗓子（表情包闸门、已发送台账、失败降级都在那一层）

> 注意 QQ 侧限制：文件消息受**主动消息频次**约束（`40093002`），被动回复窗口过期时可能发不出去 —— 所以「失败降级成文字」是必须保留的兜底。
```

</details>

**依据 3 · 源码核查**：[src/transport/events.ts:71-86](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/transport/events.ts#L71-L86)

事件类型注明对齐上游

<details>
<summary>查看原文（16行）</summary>

```text
// ── deliverables/presented（宿主 0.2.1+ / present 工具声明交付物；2026-10-27 对齐上游 c28cc4b） ──
//   契约：本事件**先于 turn/end 到达**；文件按引用交付（不复制内容），读取发生在投递时刻；
//   外层轮次失败不撤销已完成的声明。每个文件独立投递，失败降级为文字提示。

/** present 声明的一个文件（path 已是绝对路径） */
export interface PresentedFileRef {
  /** 绝对路径，或相对 Session 工作目录的路径（仅历史声明） */
  path: string;
  /** 模型提供的可选说明 */
  description?: string;
}

/** deliverables/presented 事件 */
export interface DeliverablesPresentedEvent {
  type: 'deliverables/presented';
  turn: number;
```

</details>

**依据 4 · 源码核查**：[src/transport/outbound.ts:451-483](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/transport/outbound.ts#L451-L483)

出站事件实际调用投递器

<details>
<summary>查看原文（33行）</summary>

```text
      case 'deliverables/presented':
        this.onDeliverables(record, event);
        break;
    }
  }

  /**
   * present 声明的交付物：轮末把文件逐个发到当前会话（2026-10-27）。
   *
   * 宿主在 turn/end **之前**发这个事件，所以直接投递即可；不 await（发送失败已内部降级）。
   * 闸门静默的回合不发（模型既然决定不出声，就别甩文件）。
   */
  private onDeliverables(record: SessionRecord, event: DeliverablesPresentedEvent): void {
    if (this.gateSilenced.has(record.sessionKey)) {
      this.logger.debug(`im-qqbot: 闸门静默回合 → 跳过 ${event.files.length} 个交付物`);
      return;
    }
    this.logger.debug(
      `im-qqbot: deliverables/presented turn=${event.turn} callId=${event.callId} files=${event.files.length}`,
    );
    // 登记已交付路径：正文里若还写了 [MEDIA:file|同一文件]，send() 会剔除，避免重复发送
    const key = record.sessionKey;
    let set = this.deliveredFiles.get(key);
    if (set === undefined) {
      set = new Set<string>();
      this.deliveredFiles.set(key, set);
    }
    for (const file of event.files) set.add(normalizePathForCompare(resolvePresentedPath(file.path, this.config.cwd)));
    void this.deliverables.deliver(record, event.files).catch((err: unknown) => {
      this.logger.error(
        `im-qqbot: deliverables deliver failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    });
```

</details>

#### 缺口

- 未比较 QQ 原生和上游版本的完整交付链
  **影响**：不能给出 fork 独有功能或节时的范围
  **进一步探讨**：固定同一宿主条件比较有无自动交付

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 去重能否证明文件至少交付一次？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

静默闸门先阻止交付。允许发送时先把所有事件路径记到集合，再异步调用投递器；投递器另有每轮文件上限。去重标志比投递完成更早建立，所以它表达同一轮已安排的路径，不能作成功凭据。超过限制或失败会依赖文字提示分支，而非重新走正文媒体标记。关注交付的操作者应在 QQ 侧检查文件实际出现。

#### 证据与依据

**依据 1 · 源码核查**：[src/transport/outbound.ts:463-483](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/transport/outbound.ts#L463-L483)

先登记路径后异步投递

<details>
<summary>查看原文（21行）</summary>

```text
  private onDeliverables(record: SessionRecord, event: DeliverablesPresentedEvent): void {
    if (this.gateSilenced.has(record.sessionKey)) {
      this.logger.debug(`im-qqbot: 闸门静默回合 → 跳过 ${event.files.length} 个交付物`);
      return;
    }
    this.logger.debug(
      `im-qqbot: deliverables/presented turn=${event.turn} callId=${event.callId} files=${event.files.length}`,
    );
    // 登记已交付路径：正文里若还写了 [MEDIA:file|同一文件]，send() 会剔除，避免重复发送
    const key = record.sessionKey;
    let set = this.deliveredFiles.get(key);
    if (set === undefined) {
      set = new Set<string>();
      this.deliveredFiles.set(key, set);
    }
    for (const file of event.files) set.add(normalizePathForCompare(resolvePresentedPath(file.path, this.config.cwd)));
    void this.deliverables.deliver(record, event.files).catch((err: unknown) => {
      this.logger.error(
        `im-qqbot: deliverables deliver failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    });
```

</details>

**依据 2 · 源码核查**：[src/transport/deliverables.ts:40-87](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/transport/deliverables.ts#L40-L87)

上限、投递失败和文字提示

<details>
<summary>查看原文（48行）</summary>

```text
  public async deliver(record: SessionRecord, files: PresentedFileRef[]): Promise<void> {
    const limit = Math.max(1, this.config.sendFile?.maxFiles ?? 4);
    const cwd = this.config.cwd || process.cwd();
    const missed: string[] = [];
    let sent = 0;

    for (const [index, file] of files.entries()) {
      // 宿主给的是绝对路径；兼容 file:// 与历史相对路径（交给 resolveSource 统一解析）
      const src = resolveSource(file.path, cwd);
      const absPath = src.kind === 'localPath' ? src.path : src.url;
      const display = basename(absPath);
      if (index >= limit) {
        missed.push(`${display}（超出单轮投递上限 ${limit} 个，未发送）`);
        continue;
      }
      const target = this.resolveTarget ? this.resolveTarget(record) : record.replyTarget;
      try {
        const out = await this.sender.sendMedia(
          target,
          'file',
          src.kind === 'url' ? { url: src.url } : { localPath: src.path },
        );
        const id = out?.id;
        sent += 1;
        this.logger.info(
          `im-qqbot: 交付物已发送 ${display}${id ? ` (id=${id})` : ''} → ${target.scope}:${target.targetId}`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`im-qqbot: 交付物发送失败 ${display}: ${msg}`);
        missed.push(`${display}（${msg.slice(0, 80)}）`);
      }
    }

    if (missed.length > 0) {
      const text = ['📎 已生成文件（未能直接发送）：', ...missed.map((name) => `- ${name}`)].join('\n');
      for (const chunk of chunkMarkdownText(text, this.config.textChunkLimit)) {
        try {
          const target = this.resolveTarget ? this.resolveTarget(record) : record.replyTarget;
          await this.sender.sendMarkdown(target, chunk);
        } catch (err) {
          this.logger.error(
            `im-qqbot: deliverables notice failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    }
    this.logger.debug(`im-qqbot: deliverables delivered sent=${sent} missed=${missed.length}`);
```

</details>

#### 缺口

- 未验证网络超时或多条 present 的重复路径
  **影响**：不能确定重复投递及确认语义
  **进一步探讨**：对同一轮构造超量、失败和重复文件的用例

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 访问控制与管理命令授权是同一层吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

群聊及私聊默认模式为 open，配置传给 SDK accessPolicy，名单为空会传入星号。不能假定改成 allowlist 后留空就自动拒绝，需用实际 SDK 行为验收。人格、模型等选定命令额外挂主人 OpenID 回调，空主人名单、缺身份或不匹配均拒绝；命令列表也明确保留部分普通入口，因此不能把这层保护泛化到所有命令或 Web 路由。应分别核对访问范围、管理入口和宿主权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:840-850](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/config.ts#L840-L850)

群聊与私聊默认开放

<details>
<summary>查看原文（11行）</summary>

```text
  access: Schema.object({
    c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式'),
    c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单'),
    groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式'),
    groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单'),
  }).default({
    c2cMode: 'open',
    c2cAllow: [],
    groupMode: 'open',
    groupAllow: [],
  }).description('访问控制'),
```

</details>

**依据 2 · 源码核查**：[src/gateway/middleware-setup.ts:163-181](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/gateway/middleware-setup.ts#L163-L181)

访问策略及空数组回退

<details>
<summary>查看原文（19行）</summary>

```text
  // 2. 消息过滤：bot 回声 + 消息去重
  bot.use(messageFilter({ skipSelfEcho: false }));

  // 3. 访问控制（白名单/开放/禁用）
  bot.use(accessPolicy({
    c2c: {
      mode: config.access.c2cMode,
      allow: config.access.c2cAllow.length > 0 ? config.access.c2cAllow : ['*'],
    },
    group: {
      mode: config.access.groupMode,
      allow: config.access.groupAllow.length > 0 ? config.access.groupAllow : ['*'],
    },
    onBlock: (_mCtx, reason) => {
      if (config.debug) {
        logger.debug(`Access blocked: ${reason}`);
      }
    },
  }));
```

</details>

**依据 3 · 源码核查**：[src/commands/auth.ts:51-75](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/commands/auth.ts#L51-L75)

主人回调与拒绝条件

<details>
<summary>查看原文（25行）</summary>

```text
export function ownerOnlyAuth(
  config: ImQQBotConfig | undefined,
  logger?: Logger,
): (ctx: { message?: { senderId?: string } }) => boolean | string {
  return (ctx) => {
    const owners = ownerListOf(config);
    // 名单为空 ⇒ 没配过：拒绝 + 告诉用户去哪儿配（不默默放行，也不只丢一句"无权限"）
    if (owners.length === 0) {
      logger?.warn?.('[cmd-auth] 拒绝：主人白名单为空（groupAdmin.owners 未配置）');
      return NOT_CONFIGURED;
    }
    const sender = String(ctx?.message?.senderId ?? '').trim();
    if (!sender) {
      logger?.warn?.('[cmd-auth] 拒绝：拿不到 senderId（身份缺失，fail-closed）');
      return DENIED;
    }
    if (owners.includes(sender)) return true;
    logger?.warn?.(`[cmd-auth] 拒绝：sender=${sender.slice(0, 8)}… 不在主人白名单（${owners.length} 个）`);
    return DENIED;
  };
}

/** 给一个 SlashCommand 套上"仅主人"，返回新对象（不改原对象） */
export function withOwnerOnly<T extends SlashCommand>(cmd: T, config: ImQQBotConfig | undefined, logger?: Logger): T {
  return { ...cmd, authorized: ownerOnlyAuth(config, logger) } as T;
```

</details>

**依据 4 · 源码核查**：[src/commands/index.ts:27-50](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/commands/index.ts#L27-L50)

具体挂载与普通入口

<details>
<summary>查看原文（24行）</summary>

```text
    // 会话
    resetCommand(deps),
    // ── 管理类命令：仅主人白名单（2026-10-30，对齐上游 0f050ec9）──────────
    //   /bot-new、/new、/preset、/bot-model、/model 都会改会话/人格/模型，
    //   等于改「AI 的人格与开销」，不能让群里任何人都能按。
    //   ⚠️ /presets 刻意**不限制**：它只是列出有哪些人格，无害（主人原话）。
    // /bot-new 与 /new（无参）都只是**开新会话**，群友用也不会有风险 ⇒ 不校验（主人 2026-10-30 定）
    newCommand(deps),
    // 人格(preset): /preset <id> 热切换不丢历史, /new <id> 开新档, /presets 查看可用(2026-09-08/10)
    // ⚠️ /new 的**带参**（指定人设开新档）属于管理动作，校验在 handler 里做（见 session.ts newPresetCommand）
    newPresetCommand(deps),
    withOwnerOnly(presetSwitchCommand(deps), deps.config, deps.logger),
    presetsCommand(deps), // 查看当前有哪些人格 —— 无害，放行
    // 模型
    withOwnerOnly(modelCommand(deps), deps.config, deps.logger),
    withOwnerOnly(modelAliasCommand(deps), deps.config, deps.logger), // /model 简写
    // 状态
    statusCommand(deps),
    // 查自己的 openid（配白名单用）—— 不限制，谁都能查自己的
    meCommand(deps),
    // 出站模式(逃生通道: SDK 直通不经 LLM, nothink 也能唤醒)
    outModeCommand(deps),
    // 权限档位切换(宿主 permissionPresets)
    permissionCommand(deps),
```

</details>

#### 缺口

- SDK 对空名单星号以及所有管理入口未审完
  **影响**：不能给出群聊多租户的隔离结论
  **进一步探讨**：在受控账号测试拒绝、空名单和可改变权限的命令

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样评估接入而不扩大真实群的操作范围？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Web 设置面板依赖 web profile，安装包身份要区别上游与 fork，源码安装还涉及构建产物。先观察隔离群内的普通接收与单个测试文件交付，显式配置群与私聊名单，关闭无需的图库自动采集，核对主人身份。若目标群或会话匹配不稳，先关闭访问并停止相应实例，保留原 QQ 手工交付。帐号、宿主兼容、模型费用和配置维护时间本轮没有测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:467-491](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/README.md#L467-L491)

profile、包和构建说明

<details>
<summary>查看原文（25行）</summary>

````text
## 安装

> ## ⚠️ 必须装到 `web` profile
>
> 本插件的**前端设置面板**（dock 球 + 「设置 → QQ 机器人」整页）只在 **`web` profile** 里生效。
> 装到别的 profile 会得到一个 **没有设置面板的裸环境** —— dock 球和设置页都不会出现，
> 表现为"插件装了但看不到任何界面"。
>
> **正常使用 `dsh web` 的用户不用关心**（`dsh web` 默认就是 `web` profile，插件页/插件市场装机也落在它上面）。
> 只有手动指定过 `--profile <其它名字>` 的场景才需要注意。
> 也不要 `add @tencent-connect/dsh-qqbot`——那会装上游官方版（无本 fork 增强功能）。
>
> ✅ **单包自含，装一个就全有**：QQ 机器人 + Web 可视化设置面板（host 桥 + 设置页 UI）都打包在
> 这一个包内——装完它，dsh Web「设置」里就会出现「QQ 机器人 (im-qqbot)」面板（多账号时每个实例各一页），
> **无需再单独安装 dsh-qqbot-settings**。

### 方式一（发布到 npm 后）：一条命令

```powershell
npx @deepseek-ai/dsh plugin --profile web add @zaofan/dsh-qqbot
```

> 尚未发布到 npm 前，请用下面的方式二。

> ⚠️ **从 GitHub 直装（`github:zaofan-make/dsh-qqbot`）需要编译产物 `dist/`，而仓库不提交 `dist`。**
````

</details>

**依据 2 · 源码核查**：[src/config.ts:840-854](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/config.ts#L840-L854)

消息和图库默认设置

<details>
<summary>查看原文（15行）</summary>

```text
  access: Schema.object({
    c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式'),
    c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单'),
    groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式'),
    groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单'),
  }).default({
    c2cMode: 'open',
    c2cAllow: [],
    groupMode: 'open',
    groupAllow: [],
  }).description('访问控制'),
  behavior: behaviorSchema,
  sticker: Schema.object({
    collectEnabled: Schema.boolean().default(true).description('自动下载群图到候选区(只存本地; ⚠️ 这是"采集"不等于"收藏" —— 收藏指打标/挑进正式库)'),
    dataDir: Schema.string().default('').description('图库数据根目录(默认 {agent cwd}/表情包)'),
```

</details>

**依据 3 · 源码核查**：[src/gateway/middleware-setup.ts:166-181](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/gateway/middleware-setup.ts#L166-L181)

明确可禁用模式接线

<details>
<summary>查看原文（16行）</summary>

```text
  // 3. 访问控制（白名单/开放/禁用）
  bot.use(accessPolicy({
    c2c: {
      mode: config.access.c2cMode,
      allow: config.access.c2cAllow.length > 0 ? config.access.c2cAllow : ['*'],
    },
    group: {
      mode: config.access.groupMode,
      allow: config.access.groupAllow.length > 0 ? config.access.groupAllow : ['*'],
    },
    onBlock: (_mCtx, reason) => {
      if (config.debug) {
        logger.debug(`Access blocked: ${reason}`);
      }
    },
  }));
```

</details>

#### 缺口

- 未运行 QQ、模型或宿主
  **影响**：无法验证真实群账号和长时间运行成本
  **进一步探讨**：用测试 QQ 应用和受控群复核进出站与退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 让发送去重以最终结果为依据是否有用？

**研究主题**：新假设与验证

#### 完整回答

当前用已安排路径阻止正文重复发送。可验证将状态拆成待发送、已确认与失败，失败后给操作员明确重试入口，在注入响应丢失和限额时是否能减少用户只见提示却拿不到文件的情况。比较原版与状态化策略的重复数、漏交数和人工介入，若重复更多或失败无改善则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[src/transport/outbound.ts:471-483](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/transport/outbound.ts#L471-L483)

先登记路径是现有去重机制

<details>
<summary>查看原文（13行）</summary>

```text
    // 登记已交付路径：正文里若还写了 [MEDIA:file|同一文件]，send() 会剔除，避免重复发送
    const key = record.sessionKey;
    let set = this.deliveredFiles.get(key);
    if (set === undefined) {
      set = new Set<string>();
      this.deliveredFiles.set(key, set);
    }
    for (const file of event.files) set.add(normalizePathForCompare(resolvePresentedPath(file.path, this.config.cwd)));
    void this.deliverables.deliver(record, event.files).catch((err: unknown) => {
      this.logger.error(
        `im-qqbot: deliverables deliver failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    });
```

</details>

**依据 2 · 源码核查**：[src/transport/deliverables.ts:40-87](https://github.com/zaofan-make/dsh-qqbot/blob/1f0a51d00095ee3124a94045b497021a2475aa5a/src/transport/deliverables.ts#L40-L87)

投递器已有失败收集与提示

<details>
<summary>查看原文（48行）</summary>

```text
  public async deliver(record: SessionRecord, files: PresentedFileRef[]): Promise<void> {
    const limit = Math.max(1, this.config.sendFile?.maxFiles ?? 4);
    const cwd = this.config.cwd || process.cwd();
    const missed: string[] = [];
    let sent = 0;

    for (const [index, file] of files.entries()) {
      // 宿主给的是绝对路径；兼容 file:// 与历史相对路径（交给 resolveSource 统一解析）
      const src = resolveSource(file.path, cwd);
      const absPath = src.kind === 'localPath' ? src.path : src.url;
      const display = basename(absPath);
      if (index >= limit) {
        missed.push(`${display}（超出单轮投递上限 ${limit} 个，未发送）`);
        continue;
      }
      const target = this.resolveTarget ? this.resolveTarget(record) : record.replyTarget;
      try {
        const out = await this.sender.sendMedia(
          target,
          'file',
          src.kind === 'url' ? { url: src.url } : { localPath: src.path },
        );
        const id = out?.id;
        sent += 1;
        this.logger.info(
          `im-qqbot: 交付物已发送 ${display}${id ? ` (id=${id})` : ''} → ${target.scope}:${target.targetId}`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`im-qqbot: 交付物发送失败 ${display}: ${msg}`);
        missed.push(`${display}（${msg.slice(0, 80)}）`);
      }
    }

    if (missed.length > 0) {
      const text = ['📎 已生成文件（未能直接发送）：', ...missed.map((name) => `- ${name}`)].join('\n');
      for (const chunk of chunkMarkdownText(text, this.config.textChunkLimit)) {
        try {
          const target = this.resolveTarget ? this.resolveTarget(record) : record.replyTarget;
          await this.sender.sendMarkdown(target, chunk);
        } catch (err) {
          this.logger.error(
            `im-qqbot: deliverables notice failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    }
    this.logger.debug(`im-qqbot: deliverables delivered sent=${sent} missed=${missed.length}`);
```

</details>

#### 缺口

- 新状态机没有实现或验证
  **影响**：不能宣称可恢复未确认远端结果
  **进一步探讨**：对同一批文件注入延时、超时与限额

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
