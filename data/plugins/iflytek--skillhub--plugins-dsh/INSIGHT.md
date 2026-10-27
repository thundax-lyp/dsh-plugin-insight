# SkillHub for DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[89b7991](https://github.com/iflytek/skillhub/tree/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh)

<!-- BEGIN META -->
[![GitHub ★ 5,292](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C292&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iflytek/skillhub) [![npm 30d 257](https://img.shields.io/static/v1?label=npm+30d&message=257&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh)
<!-- END META -->

> **实现功能**：在DSH搜索和查看SkillHub技能，管理用户或项目级安装、升级、卸载及当前可用性。

> **核心亮点**：相对网页下载加手工复制，增量是精确版本与指纹、用户/项目位置、来源和会话范围绑定，以及结果未知时查原操作。它把“安装成功”的多个阶段拆开，避免同名目录认领其他来源或把accepted当完成。业务仍是技能分发维护，不是自动证明技能安全或更好完成用户任务；匿名市场审核不可访问不能当通过。 依据[Q03](#research-q03)。

> **风险与缺陷**：关键质疑是安装文件到模型真正可用之间存在多层状态。Host已经把discovery confirmed/unconfirmed分开，README明确本地文件存在不代表DSH启用、历史完成不代表当前安装。兼容门禁严格到Host/Client发行版和Cordis组合，普通profile隔离也不隔离共享inventory。旧CLI与v2库存混写、或只恢复旧inventory而不恢复技能文件，会破坏管理假设。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要经常从SkillHub发现、固定版本安装和维护技能的DSH用户。原办法是浏览网页、下载归档、复制技能目录和手工记录版本；合格结果应区分文件完成、库存记录、DSH发现与模型实际调用。组件仅是plugins/dsh原生桥接，不将SkillHub服务或CLI整体能力算成插件实现。

相对网页下载加手工复制，增量是精确版本与指纹、用户/项目位置、来源和会话范围绑定，以及结果未知时查原操作。它把“安装成功”的多个阶段拆开，避免同名目录认领其他来源或把accepted当完成。业务仍是技能分发维护，不是自动证明技能安全或更好完成用户任务；匿名市场审核不可访问不能当通过。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 技能搜索 | 发现与查看固定候选 | 搜索不安装 |
| 精确安装 | 按来源版本及位置写技能 | accepted不是完成 |
| 更新卸载 | 管理一个安装位置 | 旧CLI不可混写 |
| 可用性观察 | 区分文件与DSH发现 | 不证明模型实际执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 精确DSH/Host/Client组合 | 必需 | 原生API与写入门禁 | 不匹配拒绝写入 |
| Node>=24.2<25 | 必需 | Host运行 | 低版本不可用 |
| 可信会话与来源 | 写入必需 | 路径及候选授权 | 变化后引用失效 |
| 独立账户/容器 | 初次测试建议 | 隔离共享inventory | profile不能独立隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 核对依赖并选公开测试技能 | 固定版本与范围 |
| 2 | 明确安装并记原回执 | accepted后等完成 |
| 3 | 核对文件、库存和发现 | unknown只查原事务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 网络与宿主资源未知 | 依赖、来源、库存备份 | 严格组合门禁 |
| 持续使用 | 版本查询资源 | 技能复核和位置管理 | 不证明安全或效果 |
| 失败恢复 | 未决写入可能已发生 | 按原回执核验恢复 | 禁用包不卸载技能 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 管理一致性 | scope、指纹与操作回执 | 所有文件事务故障覆盖 |
| 技能可用 | 发现confirmed/unconfirmed区分 | 模型实际使用与安全 |

> **思考**：关键质疑是安装文件到模型真正可用之间存在多层状态。Host已经把discovery confirmed/unconfirmed分开，README明确本地文件存在不代表DSH启用、历史完成不代表当前安装。兼容门禁严格到Host/Client发行版和Cordis组合，普通profile隔离也不隔离共享inventory。旧CLI与v2库存混写、或只恢复旧inventory而不恢复技能文件，会破坏管理假设。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对网页下载加手工复制，增量是精确版本与指纹、用户/项目位置、来源和会话范围绑定，以及结果未知时查原操作。它把“安装成功”的多个阶段拆开，避免同名目录认领其他来源或把accepted当完成。业务仍是技能分发维护，不是自动证明技能安全或更好完成用户任务；匿名市场审核不可访问不能当通过。 依据[Q03](#research-q03)。

相对网页下载加手工复制，增量是精确版本与指纹、用户/项目位置、来源和会话范围绑定，以及结果未知时查原操作。它把“安装成功”的多个阶段拆开，避免同名目录认领其他来源或把accepted当完成。业务仍是技能分发维护，不是自动证明技能安全或更好完成用户任务；匿名市场审核不可访问不能当通过。 依据[Q03](#research-q03)。

值得借鉴的是Host-only selection scope、accepted与完成分离、旧journal转unknown、受理后独立生命周期，以及操作前重新检查路径/策略。移植需连同本地安装核心、指纹与日志契约，不能仅复用UI。归档指纹和来源核验不判断技能指令是否可信；审核和模型真实运行要作为独立验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是安装文件到模型真正可用之间存在多层状态。Host已经把discovery confirmed/unconfirmed分开，README明确本地文件存在不代表DSH启用、历史完成不代表当前安装。兼容门禁严格到Host/Client发行版和Cordis组合，普通profile隔离也不隔离共享inventory。旧CLI与v2库存混写、或只恢复旧inventory而不恢复技能文件，会破坏管理假设。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可供技能维护频繁且能核对宿主依赖的用户在独立账户或容器里试用公开测试技能的固定版本安装。相比手工复制，它多了来源、位置和原事务回执，但不证明技能已运行或安全。出现unknown事务、库存冲突或依赖组合不符时停止新写入，查询并恢复原操作，保留技能文件与日志后退回人工核对。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/README.md、plugins/dsh/src/host/conversation-selections.ts、plugins/dsh/src/host/local-runtime.ts、plugins/dsh/src/host/index.ts、plugins/dsh/src/host/install-tool.ts 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[iflytek/skillhub](https://github.com/iflytek/skillhub)
- **版本号**：0.4.0（[固定提交 89b7991](https://github.com/iflytek/skillhub/tree/89b7991e411733e3ec893acaad4b8f6ffb0c2908)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将“文件已完成、当前发现、允许调用、最近真实使用”并列显示，能减少用户因技能不可用而重复安装。用同名覆盖、禁用用户调用、旧回执、来源变更和Host重启场景，比较当前提示与四状态卡的重复提交数和问题定位时间。若用户仍把历史成功误解为当前可用，或检查扰动文件状态，应停止扩大自动管理。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 6 | 6 | 0 | — |
| .md | source | 3 | 467 | — | — | 8699 |
| .ts | source | 49 | 4289 | 3881 | 151 | — |
| .mjs | source | 2 | 470 | 442 | 23 | — |
| .tsx | source | 31 | 3409 | 3284 | 44 | — |
| .ts | test | 72 | 6750 | 6373 | 138 | — |
| .tsx | test | 10 | 576 | 539 | 7 | — |
| .mjs | test | 69 | 6255 | 6160 | 59 | — |
| .md | test | 1 | 516 | — | — | 18000 |

</details>

**活跃度**

[![Issue 未关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/iflytek/skillhub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=32&color=737b86&logo=github)](https://github.com/iflytek/skillhub/issues?q=is%3Aissue+created%3A2026-09-26T09%3A38%3A01.975Z..2026-10-26T09%3A38%3A01.975Z) [![近30天关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/iflytek/skillhub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A38%3A01.975Z..2026-10-26T09%3A38%3A01.975Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向需要经常从SkillHub发现、固定版本安装和维护技能的DSH用户，采用价值是否由固定机制与边界支持？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向需要经常从SkillHub发现、固定版本安装和维护技能的DSH用户。原办法是浏览网页、下载归档、复制技能目录和手工记录版本；合格结果应区分文件完成、库存记录、DSH发现与模型实际调用。组件仅是plugins/dsh原生桥接，不将SkillHub服务或CLI整体能力算成插件实现。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:5-17](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/README.md#L5-L17)

作者说明管理、位置和使用状态区分。

<details>
<summary>查看原文（13行）</summary>

```text
SkillHub 的 DSH 原生插件。在 DSH 侧栏打开 **技能中心**，匿名浏览、搜索、查看技能详情，并管理安装、升级和卸载；对话中也可搜索和明确请求安装技能。插件内置本地安装核心，无需另装 SkillHub CLI。

`0.2.0` 新增来源可核验的搜索安装状态：广场卡片和对话工具可识别当前来源的受管理安装版本、用户/项目范围及异常记录；对话保留查询时快照。未发现本来源记录不代表其他市场或手工安装不存在，文件存在也不代表 DSH 已启用该技能。按来源、命名空间和技能标识匹配；不按同名目录认领其他来源技能。

`0.2.1` 缺省连接 `https://skill.xfyun.cn`；显式空串或仅空白仍表示断开，已有自定义地址保留。插件不继承 CLI 的默认地址或凭证。

`0.4.0` 使用独立标签 `dsh-v0.4.0`，提供技能案例与原生输入框衔接、对话管理已安装技能及按安装位置独立维护版本。保留 `0.3.1` 的双 RC 兼容范围。公开可用状态以 npm 为准；本地构建的 tarball 可按下文独立验证。

## 使用已安装技能

在已安装卡片、已安装版本详情或安装成功结果点击“使用此技能”。技能中心入口在同一工作区新建对话，对话内入口保留当前会话。核验所选安装后，案例显示在原生输入框上方；确认案例或自定义任务后，带入可编辑的技能调用。原会话草稿不会被覆盖，对话内操作保留已有文字、引用和附件。补充任务和材料后自行发送；点击使用不会自动发送、调用模型或安装文件。

需要当前活动会话。被项目同名技能覆盖、本地文件变更、禁止用户调用或会话/来源变化时会提示原因；历史回执不能代替当前安装状态。此功能自 `0.4.0` 起提供。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

Host通过RegistryAdapter读取目录和详情，ConversationSelections用sessionId、cwd、sourceRevision绑定候选；引用过期拒绝，不改装当前latest。install工具解析唯一selectionRef或坐标，需可信活动会话；LocalRuntime先accept并尽早返回操作回执，随后执行完整安装。旧进程未完成journal呈unknown而不自动重放；当前库存与历史操作结果分开，DSH发现不确定不会推翻已完成文件结果。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/conversation-selections.ts:23-31](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/conversation-selections.ts#L23-L31)

实际scope校验。

```text
  read(reference: string, scope: SelectionScope): Readonly<Candidate> {
    const { sessionId, cwd, sourceRevision, callId, namespace, slug, version } = this.lookup(reference, scope);
    return { sessionId, cwd, sourceRevision, callId, namespace, slug, version };
  }

  private lookup(reference: string, scope: SelectionScope): Search | Fixed {
    const record = this.records.get(reference);
    if (!record || record.sessionId !== scope.sessionId || record.cwd !== scope.cwd || record.sourceRevision !== scope.sourceRevision) this.stale();
    return record;
```

**依据 2 · 源码核查**：[plugins/dsh/src/host/local-runtime.ts:150-170](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/local-runtime.ts#L150-L170)

受理与执行分离，不重放历史。

<details>
<summary>查看原文（21行）</summary>

```text
  /** Acceptance is returned early; the complete admitted workflow remains tracked until execution settles. */
  submitInstall(request: NativeOperationRequest, prepare: () => Promise<PreparedNativeInstall>): Promise<NativeOperation | undefined> {
    const receipt = Promise.withResolvers<NativeOperation | undefined>();
    const input = { ...request, parameters: { ...request.parameters } };
    const workflow = this.call(async runtime => {
      let prepared: PreparedNativeInstall | undefined;
      const accepted = await runtime.acceptInstall(input, async () => {
        this.assertWritableHost();
        const result = await prepare();
        prepared = { acceptance: structuredClone(result.acceptance), execution: { ...result.execution } };
        return prepared.acceptance;
      });
      receipt.resolve(accepted);
      // A retry found in durable state does not replay work or reinterpret expired references.
      if (!accepted || !prepared || accepted.phase !== 'accepted') return;
      const execution = { ...prepared.execution, operationId: accepted.operationId, ownerId: input.ownerId };
      await this.executeAccepted(accepted, () => runtime.executeInstall(execution));
    });
    // Before acceptance this rejects the caller. After acceptance, the durable operation owns the outcome.
    void workflow.catch(error => receipt.reject(error));
    return receipt.promise;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对网页下载加手工复制，增量是精确版本与指纹、用户/项目位置、来源和会话范围绑定，以及结果未知时查原操作。它把“安装成功”的多个阶段拆开，避免同名目录认领其他来源或把accepted当完成。业务仍是技能分发维护，不是自动证明技能安全或更好完成用户任务；匿名市场审核不可访问不能当通过。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/index.ts:901-912](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/index.ts#L901-L912)

文件结果与发现状态分开。

<details>
<summary>查看原文（12行）</summary>

```text
        }));
        const confirmed = await runtime.observeInstallation(operationId, agent.session.id,
          roots.flatMap(root => root ? [root.root] : []),
          paths => observeDshInstallation(agent.ctx, paths, signal,
            name => skills.get(name, { scope: agent, cwd, signal })));
        signal.throwIfAborted();
        if (confirmed && agent.session.header.cwd === cwd && this.localRuntime === runtime
          && this.ctx.get('agents')?.get(SessionId(agent.session.id)) === agent
          && serviceIdentity(agent.ctx.get('fs')) === serviceIdentity(fs)
          && serviceIdentity(this.ctx.get('skills')) === serviceIdentity(skills)) return { ...operation, discovery: 'confirmed' };
      } catch { /* Discovery uncertainty does not replace a successful file result. */ }
      return { ...operation, discovery: 'unconfirmed' };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是安装文件到模型真正可用之间存在多层状态。Host已经把discovery confirmed/unconfirmed分开，README明确本地文件存在不代表DSH启用、历史完成不代表当前安装。兼容门禁严格到Host/Client发行版和Cordis组合，普通profile隔离也不隔离共享inventory。旧CLI与v2库存混写、或只恢复旧inventory而不恢复技能文件，会破坏管理假设。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:20-30](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/README.md#L20-L30)

宿主与真实验证边界。

<details>
<summary>查看原文（11行）</summary>

```text
## 环境与验证范围

| 项目 | 要求或范围 |
| --- | --- |
| DSH | `0.2.0-rc.2` 或 `0.2.1-rc.2`；Host、app-boot 与注入 Client 模块必须属于同一精确发行版 |
| Cordis | `0.2.0-rc.2` 保留以下两组完整组合；`0.2.1-rc.2` 仅使用 `4.0.5 / 1.0.6 / 1.0.10 / 1.1.7` |
| Host Node | `>=24.2.0 <25`；不能使用 Node 24.0.0 |
| 开发包管理器 | Bun `1.3.13`，按锁文件安装 |
| 当前 UI | 中文；支持 DSH 深浅主题和窄屏 |
| 已验证环境 | Linux 两版 DSH Host 严格安装、原生探针及浏览器用户/项目安装、升级、卸载与取消；Windows 浏览器访问真实 Host 的界面和交互 |
| 验证边界 | 功能实现已进行真实模型对话及跨平台 CI；构建产物与公开包的验收分别记录。真实桌面客户端、原生 Windows/macOS 人工交互和 SaaS 验收不由这些结果替代 |
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/host/local-runtime.ts:75-88](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/local-runtime.ts#L75-L88)

原进程未完journal显示unknown。

<details>
<summary>查看原文（14行）</summary>

```text

  getOperation(operationId: string, ownerId: string): Promise<NativeOperation | undefined> {
    return this.call(async runtime => {
      const operation = await runtime.getOperation(operationId, ownerId);
      // A prior process's unfinished journal is not evidence that work is still running.
      // Project uncertainty only: recovery retains its execution lease and all Host checks.
      if (operation && this.startupPending.has(operationId)
        && ['accepted', 'staging', 'revalidating', 'committing', 'recovering'].includes(operation.phase)) {
        return { ...operation, phase: 'unknown', files: 'unknown', recovery: 'unknown' };
      }
      return operation;
    });
  }

```

</details>

#### 缺口

- 本轮未实际覆盖底层安装核心所有文件故障与跨CLI混写场景。
  **影响**：不把桥接守卫视作全事务完整性证明。
  **进一步探讨**：以独立账户对阶段中断、旧CLI和v2库存进行真实生命周期验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要列出的DSH两条RC、Host Node>=24.2<25及完整Cordis依赖组合，来源HTTP可达且会话工作区可信。插件内置本地核心，不要求另装CLI；若同时使用CLI则需升级兼容版本并停止旧后台写入。首次试验要独立账户或容器与测试技能，单独DSH_HOME不能隔离共享库存。退出插件不等于卸载已装技能，应分别清理所选位置并保留操作记录。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:61-68](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/README.md#L61-L68)

完整依赖组合限制。

```text
本版沿用以下完整组合，不接受交叉混装或未列出的补丁版本。DSH 主包中的 `~` 依赖不会因主包版本固定而自动锁定；以实际宿主解析结果为准。

| 组合 | Cordis | Loader | Include | Timer |
| --- | --- | --- | --- | --- |
| 保留基线 | `4.0.4` | `1.0.5` | `1.0.9` | `1.1.6` |
| 新补丁组合 | `4.0.5` | `1.0.6` | `1.0.10` | `1.1.7` |

已发布的 `0.1.0` 尚不包含新补丁组合与历史回执修复；它仍要求原 Cordis `4.0.4` 基线。插件仅从核验后的当前上下文读取历史回执对应的库存，不恢复旧安装引用或计划的写授权。
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

首次是宿主精确版本核对、来源测试、inventory备份及技能确认；持续有更新检查和技能内容复核，失败恢复要按原回执核验事务。安装/卸载技能本身有文件副作用，插件页面关闭不取消已受理任务。费用和人工耗时未知，没有比较证明比手工复制更经济，收益在来源一致与操作可回查，而不是免维护。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/index.ts:958-975](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/index.ts#L958-L975)

受理后执行生命周期及动态授权。

<details>
<summary>查看原文（18行）</summary>

```text
    const { target, snapshot } = await this.resolveInstallationTarget(agentId, detailToken, targetToken, signal);
    const source = this.getContext();
    const cwd = agent.session.header.cwd!;
    const filesystem = agent.ctx.get('fs');
    // An accepted operation owns its lifetime; closing the requesting panel must not cancel it.
    const operationSignal = new AbortController().signal;
    return {
      acceptance: { namespace: snapshot.namespace, slug: snapshot.slug, version: snapshot.version,
        targetLabel: target.scope === 'user' ? '当前用户' : '当前项目', targetPaths: [join(target.root, snapshot.slug)],
        context: { sourceIdentity: source.registryUrl, sourceLabel: source.registryUrl, sourceRevision: source.sourceRevision,
          hostLabel: 'DSH Host', initiatedFrom } },
      execution: { registry: source.registryUrl, namespace: snapshot.namespace, slug: snapshot.slug,
        version: snapshot.version, versionId: snapshot.versionId, fingerprint: snapshot.fingerprint, root: target.root, scope: target.scope,
        authorize: async (paths: readonly string[]) => {
          const fs = agent.ctx.get('fs');
          if (!fs || serviceIdentity(fs) !== serviceIdentity(filesystem) || agent.session.header.cwd !== cwd) throw new Error('Installation session changed');
          const policy = agent.ctx.get('sandboxPolicy')?.resolve({ session: agent.session });
          const current = await resolveInstallationPath({ scope: target.scope, cwd, fs, policy, signal: operationSignal });
```

</details>

#### 缺口

- 固定任务中的安装维护人工时间与重复操作下降未知。
  **影响**：当前收益为可追溯性，非实测节时。
  **进一步探讨**：比较同技能集合手工维护与原事务流程的完整时间和恢复成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的是Host-only selection scope、accepted与完成分离、旧journal转unknown、受理后独立生命周期，以及操作前重新检查路径/策略。移植需连同本地安装核心、指纹与日志契约，不能仅复用UI。归档指纹和来源核验不判断技能指令是否可信；审核和模型真实运行要作为独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/install-tool.ts:69-80](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/install-tool.ts#L69-L80)

参数与可信会话检查。

<details>
<summary>查看原文（12行）</summary>

```text
    async execute(args, exec) {
      const parsed = conversationInstallRequest.safeParse(args);
      if (!parsed.success) throw new Error('Provide either selectionRef or namespace and slug, plus optional user/project scope. No other fields are allowed.');
      const session = exec.agent?.session;
      if (!session?.id || !session.header.cwd || !exec.callId) throw new Error('SkillHub install requires a trusted conversation context.');
      let operation: NativeOperation | PendingConversationInstall | CancelledConversationInstall | undefined;
      try {
        operation = await install(parsed.data, { sessionId: session.id, cwd: session.header.cwd, callId: exec.callId }, exec.signal);
      } catch (error) {
        // Core failures can contain Host paths; they must not enter the model transcript.
        return { schemaVersion: 1 as const, kind: 'skillhub-install' as const, status: 'not-confirmed' as const,
          toolCallId: exec.callId, code: installationFailureCode(error) };
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/host/index.ts:958-975](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/index.ts#L958-L975)

受理后不依赖面板存活并复查路径。

<details>
<summary>查看原文（18行）</summary>

```text
    const { target, snapshot } = await this.resolveInstallationTarget(agentId, detailToken, targetToken, signal);
    const source = this.getContext();
    const cwd = agent.session.header.cwd!;
    const filesystem = agent.ctx.get('fs');
    // An accepted operation owns its lifetime; closing the requesting panel must not cancel it.
    const operationSignal = new AbortController().signal;
    return {
      acceptance: { namespace: snapshot.namespace, slug: snapshot.slug, version: snapshot.version,
        targetLabel: target.scope === 'user' ? '当前用户' : '当前项目', targetPaths: [join(target.root, snapshot.slug)],
        context: { sourceIdentity: source.registryUrl, sourceLabel: source.registryUrl, sourceRevision: source.sourceRevision,
          hostLabel: 'DSH Host', initiatedFrom } },
      execution: { registry: source.registryUrl, namespace: snapshot.namespace, slug: snapshot.slug,
        version: snapshot.version, versionId: snapshot.versionId, fingerprint: snapshot.fingerprint, root: target.root, scope: target.scope,
        authorize: async (paths: readonly string[]) => {
          const fs = agent.ctx.get('fs');
          if (!fs || serviceIdentity(fs) !== serviceIdentity(filesystem) || agent.session.header.cwd !== cwd) throw new Error('Installation session changed');
          const policy = agent.ctx.get('sandboxPolicy')?.resolve({ session: agent.session });
          const current = await resolveInstallationPath({ scope: target.scope, cwd, fs, policy, signal: operationSignal });
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将“文件已完成、当前发现、允许调用、最近真实使用”并列显示，能减少用户因技能不可用而重复安装。用同名覆盖、禁用用户调用、旧回执、来源变更和Host重启场景，比较当前提示与四状态卡的重复提交数和问题定位时间。若用户仍把历史成功误解为当前可用，或检查扰动文件状态，应停止扩大自动管理。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/index.ts:901-912](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/index.ts#L901-L912)

当前发现状态为四态呈现假设基础。

<details>
<summary>查看原文（12行）</summary>

```text
        }));
        const confirmed = await runtime.observeInstallation(operationId, agent.session.id,
          roots.flatMap(root => root ? [root.root] : []),
          paths => observeDshInstallation(agent.ctx, paths, signal,
            name => skills.get(name, { scope: agent, cwd, signal })));
        signal.throwIfAborted();
        if (confirmed && agent.session.header.cwd === cwd && this.localRuntime === runtime
          && this.ctx.get('agents')?.get(SessionId(agent.session.id)) === agent
          && serviceIdentity(agent.ctx.get('fs')) === serviceIdentity(fs)
          && serviceIdentity(this.ctx.get('skills')) === serviceIdentity(skills)) return { ...operation, discovery: 'confirmed' };
      } catch { /* Discovery uncertainty does not replace a successful file result. */ }
      return { ...operation, discovery: 'unconfirmed' };
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

可供技能维护频繁且能核对宿主依赖的用户在独立账户或容器里试用公开测试技能的固定版本安装。相比手工复制，它多了来源、位置和原事务回执，但不证明技能已运行或安全。出现unknown事务、库存冲突或依赖组合不符时停止新写入，查询并恢复原操作，保留技能文件与日志后退回人工核对。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/local-runtime.ts:75-88](https://github.com/iflytek/skillhub/blob/89b7991e411733e3ec893acaad4b8f6ffb0c2908/plugins/dsh/src/host/local-runtime.ts#L75-L88)

未知需原操作核查。

<details>
<summary>查看原文（14行）</summary>

```text

  getOperation(operationId: string, ownerId: string): Promise<NativeOperation | undefined> {
    return this.call(async runtime => {
      const operation = await runtime.getOperation(operationId, ownerId);
      // A prior process's unfinished journal is not evidence that work is still running.
      // Project uncertainty only: recovery retains its execution lease and all Host checks.
      if (operation && this.startupPending.has(operationId)
        && ['accepted', 'staging', 'revalidating', 'committing', 'recovering'].includes(operation.phase)) {
        return { ...operation, phase: 'unknown', files: 'unknown', recovery: 'unknown' };
      }
      return operation;
    });
  }

```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
