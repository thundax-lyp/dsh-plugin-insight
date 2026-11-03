# iosdev-cn

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[44eb4c0](https://github.com/kuangre123/iosdev/tree/44eb4c0e04386899b9f55556d04a3dbe74a16cb6)

<!-- BEGIN META -->
[![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kuangre123/iosdev)
<!-- END META -->

> **功能**：提供面向中国区的 iOS 开发、构建、签名、测试、订阅与 App Store 上架流程 Skill。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将开发、发布、订阅和隐私主题固定路由，帮助复用准备结构；增量是知识组织，不是执行或合规判断能力。

> **主要限制**：[Q02](#research-q02) 清单没有逐项绑定当前规则、环境与项目证据，不能把文字覆盖当测试、签名或审核已通过。优先官方来源的约束存在，但需要实际回源。

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
  - [Q01 · 入口如何按项目场景路由，真实形态是什么？](#detail-section-11)
  - [Q02 · 发布、支付与隐私清单能证明什么？](#detail-section-12)
  - [Q03 · 采用、复核和退出的负担是什么？](#detail-section-13)
  - [Q04 · 如何降低时效清单被当成现行规则的风险？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要整理iOS开发与上架准备的开发者，可据四主题参考生成候选清单；真实构建和审核仍由项目工具与负责人完成。

临时提示与人工官方文档清单可覆盖同主题，本组件提供固定入口和按需读取，未证减少实际遗漏或总准备时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目概况确认 | 识别地区、版本和功能条件 | 依赖用户信息，不读取真实工程验证 |
| 开发与签名清单 | 整理依赖、版本、归档准备 | 文字指导，未构建/签名 |
| 发布清单 | 整理元数据、审核与区域待核项 | 当前官方要求需逐项回源 |
| 订阅与隐私参考 | 辅助发现支付/数据处理检查点 | 不保证端点、测试或法律符合性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持Skill文本的助手和正确路径 | 读取必需 | 匹配入口、按需读参考 | README只写Codex复制，DSH发现未验 |
| 项目类型、地区、功能概况 | 计划必需 | 选择适用清单 | 缺信息只能输出通用范围 |
| 当前官方依据与项目负责人 | 实际使用必需 | 复核时效、适用性和证据 | 不能形成可执行发布结论 |
| Xcode/设备/开发者账号等 | 真正操作时需另备 | 构建、签名、测试和提交 | Skill不提供环境或账号 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选择入口 | 用户确定一个Skill副本并由助手读取 | 标识iosdev-cn和四份相对参考可达 |
| 提供概况 | 用户给脱敏应用类型、地区与功能 | 不填真实密钥，未知条件明确 |
| 形成候选清单 | 助手按主题列所需证据和待核点 | 不声称已构建、购买或提交 |
| 回源与退出 | 开发者核官方依据和项目记录 | 不可核或不适用即停用回答，回人工流程 |

**效果与成本**

[Q03](#research-q03) 区分文本读取、真实开发资源和回源/恢复人工，金额与耗时均未知。

[Q03](#research-q03) 的效果表只有计划覆盖的源码依据，没有发布成功或收益数据。

> **思考**：[Q02](#research-q02) 清单没有逐项绑定当前规则、环境与项目证据，不能把文字覆盖当测试、签名或审核已通过。优先官方来源的约束存在，但需要实际回源。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将开发、发布、订阅和隐私主题固定路由，帮助复用准备结构；增量是知识组织，不是执行或合规判断能力。

[Q01](#research-q01) 简短路由易查，副本内容重复有漂移负担；[Q02](#research-q02)参考是提示不是校验程序，需把时效和适用性显式保留。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 清单没有逐项绑定当前规则、环境与项目证据，不能把文字覆盖当测试、签名或审核已通过。优先官方来源的约束存在，但需要实际回源。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先观察，只用于脱敏项目的只读差距清单。逐项回源前不照做发布/账号步骤；若输出伪装执行或规则不可核实，就回官方流程和项目负责人复核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查文本Skill入口、根与子目录副本及四份参考。未验证当前政策、目标项目或操作效果，当前规则与发布成功保持未知，新增证据表为未验证假设。

- 已检查：作者 README、包清单、源码路径 SKILL.md、README.md、iosdev-cn/SKILL.md、references/ios-development.md、references/app-store-release-cn.md、references/iap-subscription.md、references/privacy-security.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取根/子目录SKILL和README、四份根reference，核仓库文件形态；未执行目标、解包运行或安装，不开展当前Apple规则或法律咨询，不验证真实项目。
- 下一步：用脱敏项目先检验清单适用性与官方依据可追溯，再按 [Q04](#research-q04) 比较遗漏和返工；真实构建/审核记录独立保留。

**分析版本**

- **仓库**：[kuangre123/iosdev](https://github.com/kuangre123/iosdev)
- **版本号**：未声明（[固定提交 44eb4c0](https://github.com/kuangre123/iosdev/tree/44eb4c0e04386899b9f55556d04a3dbe74a16cb6)）
- **版本日期**：2026-01-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设逐项记录适用条件、官方依据与项目证据能减少过期误用，需和现有总入口清单比较正确性与核查负担。

用脱敏项目先检验清单适用性与官方依据可追溯，再按 [Q04](#research-q04) 比较遗漏和返工；真实构建/审核记录独立保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 389 | — | — | 3799 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/kuangre123/iosdev/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/kuangre123/iosdev/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)

暂未获取：近30天关闭。

统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的中国市场iOS开发Skill如何帮助项目形成可核查计划，又有哪些时效和执行边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 入口如何按项目场景路由，真实形态是什么？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

iosdev-cn 是给编码助手读取的文字 Skill，面向需要整理中国市场 iOS 开发和上架步骤的开发者，不是安装后自动完成签名、上传或审核的 DSH 扩展。根目录 SKILL 的 name 与触发描述说明匹配 iOS、签名、TestFlight、订阅等咨询；先问应用类型、目标地区、最低系统和订阅/登录/UGC，再按问题读取四份 references。合格结果应是一份适用范围清楚、有待核项的计划，而不是可上架应用。

入口建议六步流程，将构建、签名、测试、App Store 元数据和审核交接连在同一上下文里。具体机制是自然语言指令和相对文件引用，没有工具注册或平台 API 执行链；Xcode、账号、项目与助手仍承担实际操作。README 的安装路径指向 Codex skills/helloagents，不能据此证明 DSH 会自动发现。

仓库还存一份 iosdev-cn 子目录副本与打包文件，子目录 SKILL 的路由与根基本相同，仅描述略有不同。源码树看不到 DSH bundle/客户端注册；本次根身份记为 skill，不把重复副本当两个独立能力，不用文档数估计功能规模。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:1-25](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/SKILL.md#L1-L25)

Skill元数据、前置问题、六步结构和按需参考路由是实际机制。

<details>
<summary>查看原文（25行）</summary>

```text
---
name: iosdev-cn
description: 通用 iOS App 开发、构建、签名、测试与 App Store 上架流程（中国区）指南。用于当用户询问 iOS 开发/上架/审核/签名/TestFlight/App Store Connect/隐私合规/订阅配置，或输入触发词 iosdev 时。
---

# iOS 开发与上架技能（中国）

## 快速使用
- 先确认：应用类型（个人/企业）、目标地区（中国区）、最低 iOS 版本、是否包含订阅/登录/UGC
- 若只要流程清单，输出“开发 → 构建 → 签名 → 上传 → 审核 → 发布”六步
- 需要细节时按需加载 references 中的对应文件

## 工作流程（建议输出结构）
1. 需求与约束确认（Bundle ID、Team、最低 iOS、功能敏感项）
2. 开发与构建准备（依赖管理、配置、版本号）
3. 签名与归档（证书、Provisioning、Archive）
4. 测试与验证（真机、崩溃、功能清单）
5. App Store Connect 准备（元数据、截图、隐私政策）
6. 提交审核与后续处理（审核备注、拒审处理、版本迭代）

## 参考资料加载指引
- 构建/签名/依赖与版本号 → `references/ios-development.md`
- App Store 上架流程与审核常见问题（中国） → `references/app-store-release-cn.md`
- IAP/订阅配置与测试 → `references/iap-subscription.md`
- 隐私、ATS、安全与合规 → `references/privacy-security.md`
```

</details>

**依据 2 · 作者声明**：[README.md:3-17](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/README.md#L3-L17)

作者定位与Codex复制/打包说明，没有DSH加载保证。

<details>
<summary>查看原文（15行）</summary>

```text
本仓库提供通用的 iOS App 开发与上架流程技能（面向中国区），用于帮助开发者快速梳理从开发、构建、签名、测试到 App Store Connect 提交与审核的全流程。内容涵盖上架前关键清单、常见审核注意事项、隐私合规与 ATS 配置建议，以及订阅/IAP 的创建与测试。

## 包含内容
- `SKILL.md`：技能触发与输出结构（输入 `iosdev` 即可调用）
- `references/`：按主题拆分的参考资料
  - 构建/签名/依赖与版本号管理
  - 上架流程与审核要点（中国区）
  - 订阅（IAP）配置与测试
  - 隐私、ATS 与安全合规
- `iosdev-cn.skill`：可分发的技能包

## 使用方式
1. 将本目录复制到 `~/.codex/skills/helloagents/`
2. 或使用 `iosdev-cn.skill` 进行分发安装
3. 在 Codex 中输入触发词 `iosdev` 即可调用
```

</details>

**依据 3 · 源码核查**：[iosdev-cn/SKILL.md:1-25](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/iosdev-cn/SKILL.md#L1-L25)

子目录副本基本重复同一路由，不是额外执行模块。

<details>
<summary>查看原文（25行）</summary>

```text
---
name: iosdev-cn
description: 通用 iOS App 开发、构建、签名、测试与 App Store 上架流程（中国区）指南。用于当用户询问 iOS 开发/上架/审核/签名/TestFlight/App Store Connect/隐私合规/订阅配置，或输入触发词 iosdev 时。
---

# iOS 开发与上架技能（中国）

## 快速使用
- 先确认：应用类型（个人/企业）、目标地区（中国区）、最低 iOS 版本、是否包含订阅/登录/UGC
- 若只要流程清单，输出“开发 → 构建 → 签名 → 上传 → 审核 → 发布”六步
- 需要细节时按需加载 references 中的对应文件

## 工作流程（建议输出结构）
1. 需求与约束确认（Bundle ID、Team、最低 iOS、功能敏感项）
2. 开发与构建准备（依赖管理、配置、版本号）
3. 签名与归档（证书、Provisioning、Archive）
4. 测试与验证（真机、崩溃、功能清单）
5. App Store Connect 准备（元数据、截图、隐私政策）
6. 提交审核与后续处理（审核备注、拒审处理、版本迭代）

## 参考资料加载指引
- 构建/签名/依赖与版本号 → `references/ios-development.md`
- App Store 上架流程（中国） → `references/app-store-release-cn.md`
- IAP/订阅配置与测试 → `references/iap-subscription.md`
- 隐私、ATS、安全与合规 → `references/privacy-security.md`
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发布、支付与隐私清单能证明什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑、工程质量与复用

#### 完整回答

相对临时让助手自由生成清单，本组件的可见增量是把开发构建、发布、IAP和隐私四个主题固定为可复用参考，并先询问应用特性。构建参考列出版本号、签名和归档检查；发布参考连接元数据、隐私与审核说明；订阅参考列出购买、恢复和状态刷新；隐私参考强调描述和实际行为一致。这些是查漏与分工提示，不是工程实现或自动检测。

关键限制是没有按条目绑定“何时、对哪个系统版本和地区、检查了哪个官方依据”。发布文件仅末尾给出App Store Connect和审核指南入口，并说明以最新政策为准；隐私文件同样提醒最新法规，未给逐条来源。它没有读取真实项目的权限清单、SDK数据行为、证书配置或商店审核结果。因此不能从“参考里提到了”推出实际已满足，更不能保证通过审核或当前法律合规。

IAP文件中存在具体账号/设备操作步骤，但缺目标系统和测试环境范围；本轮只记录文档有这些指令，没有验证或转述成当前操作建议。优先官方链接的要求是正面约束，可作为补证起点；源码里没有自动跟踪官方更新、验证条目适用性或阻止过期建议的机制。这是通用指导的证据边界，不据此断言每一条均过期。

#### 证据与依据

**依据 1 · 源码核查**：[references/ios-development.md:13-29](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/ios-development.md#L13-L29)

版本、签名、归档命令是检查主题，非本仓执行记录。

<details>
<summary>查看原文（17行）</summary>

```text
## 3. 版本号与构建号
- **Version**: `CFBundleShortVersionString`（用户可见）
- **Build**: `CFBundleVersion`（每次上传必须递增）
- 建议规则：`1.2.3` + `YYYYMMDDHHMM` 或 `自增整数`

## 4. 签名与证书（简化原则）
- 开发阶段：Development 证书 + Development Profile
- 发布阶段：Distribution 证书 + App Store Profile
- Xcode 推荐开启 **Automatically manage signing**
- 多目标/多环境需确认签名一致性

## 5. 构建与归档
- Xcode: **Product → Archive**
- CI/命令行：
  - `xcodebuild archive` 生成 `.xcarchive`
  - `xcodebuild -exportArchive` 导出 `ipa`
- 上传前建议 **Validate** 归档
```

</details>

**依据 2 · 源码核查**：[references/app-store-release-cn.md:19-43](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/app-store-release-cn.md#L19-L43)

发布与隐私的流程及最新政策边界，未逐项绑定依据。

<details>
<summary>查看原文（25行）</summary>

```text
## 4. 隐私与合规
- 隐私政策网址（必须是可公开访问网页）
- App Privacy 中如实填写数据收集与用途
- 若使用追踪/广告，需评估 ATT 与弹窗

## 5. 审核信息
- 提供审核备注（如测试账号、登录方式）
- 若功能需要账号，必须提供可用测试账号

## 6. 审核常见问题与规避
- 订阅入口与权益展示要清晰（价格、周期、自动续订、试用、恢复购买、管理订阅入口）
- 若订阅是核心功能，截图与描述中应能看到订阅入口或付费页
- App Privacy、隐私政策、应用描述与权限弹窗文案必须一致
- 不要留下测试内容、占位文案、无效按钮或不可用流程
- 如需登录，审核备注提供可用账号与操作指引

## 7. 提交审核与发布
- Xcode Archive → Validate → Upload
- App Store Connect 选择构建版本并提交审核
- 通过后可手动发布或定时发布

## 8. 中国区注意事项（可能适用）
- 若涉及内容分发、UGC、地图/定位、医疗、教育、金融、游戏等，可能需要额外资质或合规说明
- 建议提供中文隐私政策与用户协议
- 以上要求以最新 Apple 审核政策与监管要求为准
```

</details>

**依据 3 · 源码核查**：[references/app-store-release-cn.md:45-47](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/app-store-release-cn.md#L45-L47)

仅列官方总入口，未给逐条核查时间。

```text
## 官方参考链接
- App Store Connect: https://appstoreconnect.apple.com
- 审核指南: https://developer.apple.com/app-store/review/guidelines/
```

**依据 4 · 源码核查**：[references/iap-subscription.md:20-29](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/iap-subscription.md#L20-L29)

含具体测试步骤与故障线索，环境条件未绑定。

<details>
<summary>查看原文（10行）</summary>

```text
## 4. 测试流程
- 创建沙盒测试账号（App Store Connect）
- 设备退出真实 Apple ID，使用沙盒账号购买
- 验证：购买成功、恢复购买、续订状态刷新

## 5. 常见问题
- 产品加载失败：检查产品 ID 与 Bundle ID 是否匹配
- 购买失败：检查是否登录沙盒账号、网络与设备购买限制
- 订阅展示不明确：补充付费页说明、价格与权益展示
- 审核拒绝：提供清晰的订阅说明与恢复入口
```

</details>

**依据 5 · 源码核查**：[references/privacy-security.md:23-35](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/privacy-security.md#L23-L35)

敏感信息与中国区提示保持通用，非项目合规证明。

<details>
<summary>查看原文（13行）</summary>

```text
## 5. 密钥与敏感信息保护
- 禁止在客户端明文写入 API 密钥
- 使用服务端代理或环境注入
- 日志中避免输出用户隐私与密钥

## 6. 中国区合规提示（可能适用）
- 如涉及个人信息处理，需遵守《个人信息保护法》等要求
- 若涉及内容发布/UGC/地图/金融/医疗等，可能需要额外资质
- 以上以最新法规与审核政策为准

## 7. 审核关注点
- 隐私政策链接必须可访问且内容完整
- 实际行为与 App Privacy 填写不一致是常见拒审原因
```

</details>

**依据 6 · 源码核查**：[SKILL.md:27-30](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/SKILL.md#L27-L30)

占位符与优先官方来源是已有约束，不能说无来源意识。

```text
## 输出约束
- 仅输出通用流程，不引用项目私有信息
- 避免提供真实密钥或账号，使用占位符
- 引用官方链接时优先 Apple Developer / App Store Review Guidelines
```

#### 缺口

- 未逐条核实固定清单与当前Apple规则、目标系统及具体项目一致。
  **影响**：不能把本次源码研究作为当前发布、支付或法律建议，也不能确认可直接照做。
  **进一步探讨**：实际使用时逐项取得相应官方页面、核查日期和项目证据；不适用项写理由，分开技术测试与专业合规判断。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用、复核和退出的负担是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

当前建议观察，把它当候选清单结构而非即用发布流程。适合能够判断Xcode、账号和商店配置的开发者先作只读差距检查；新手若期待自动搭环境、签名或提交，材料不支持。Skill要求仅输出通用流程、不引用项目私有信息，也限制它直接形成项目级验收包的能力。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 文本Skill与助手上下文；模型费未知 | 选择入口、副本与主题，核载入；耗时未知 | 无DSH自动加载接线证明 |
| 持续使用 | 实际开发设备、账号、构建与模型资源另计，金额未知 | 按项目重核规则、签名、隐私和订阅 | 四份短清单不替代当前官方文档 |
| 失败恢复 | 真实构建/支付/审核失败代价依任务而异 | 保存日志、诊断并回原官方流程；时间未知 | Skill无回滚、补偿或自动重试机制 |
| 退出 | 已生成计划和项目资料需保留 | 移除Skill引用，继续人工清单与官方文档 | 无运行服务需要停止，但真实项目副作用另核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 计划覆盖 | 四主题路由与六步结构 | 是否减少真实项目遗漏 |
| 操作执行 | 只有文字与命令示例 | 构建、签名、购买和上传结果 |
| 审核与隐私 | 提醒检查一致性和官方规则 | 当前适用规则、项目符合性与审核通过 |
| 办结成本 | 可复用提示结构 | 相较人工清单的总时间与返工无对照 |

先给无密钥的虚构或脱敏项目概况，要求输出“适用项、所需证据、官方依据待核点”；随后由开发者回源补证。若助手把指导当已执行、引用无法核实、要求照搬敏感账号步骤或无法区分地区条件，应停止采用该回答，改用原始官方流程和项目负责人复核。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:8-19](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/SKILL.md#L8-L19)

前置条件与六步流程适合计划用途。

<details>
<summary>查看原文（12行）</summary>

```text
## 快速使用
- 先确认：应用类型（个人/企业）、目标地区（中国区）、最低 iOS 版本、是否包含订阅/登录/UGC
- 若只要流程清单，输出“开发 → 构建 → 签名 → 上传 → 审核 → 发布”六步
- 需要细节时按需加载 references 中的对应文件

## 工作流程（建议输出结构）
1. 需求与约束确认（Bundle ID、Team、最低 iOS、功能敏感项）
2. 开发与构建准备（依赖管理、配置、版本号）
3. 签名与归档（证书、Provisioning、Archive）
4. 测试与验证（真机、崩溃、功能清单）
5. App Store Connect 准备（元数据、截图、隐私政策）
6. 提交审核与后续处理（审核备注、拒审处理、版本迭代）
```

</details>

**依据 2 · 源码核查**：[SKILL.md:27-30](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/SKILL.md#L27-L30)

通用输出和不含真实密钥的限制影响项目级使用。

```text
## 输出约束
- 仅输出通用流程，不引用项目私有信息
- 避免提供真实密钥或账号，使用占位符
- 引用官方链接时优先 Apple Developer / App Store Review Guidelines
```

**依据 3 · 源码核查**：[README.md:14-17](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/README.md#L14-L17)

安装说明只有复制或包分发，未证明宿主自动注册。

```text
## 使用方式
1. 将本目录复制到 `~/.codex/skills/helloagents/`
2. 或使用 `iosdev-cn.skill` 进行分发安装
3. 在 Codex 中输入触发词 `iosdev` 即可调用
```

**依据 4 · 源码核查**：[references/app-store-release-cn.md:40-47](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/app-store-release-cn.md#L40-L47)

最新官方要求需另核。

```text
## 8. 中国区注意事项（可能适用）
- 若涉及内容分发、UGC、地图/定位、医疗、教育、金融、游戏等，可能需要额外资质或合规说明
- 建议提供中文隐私政策与用户协议
- 以上要求以最新 Apple 审核政策与监管要求为准

## 官方参考链接
- App Store Connect: https://appstoreconnect.apple.com
- 审核指南: https://developer.apple.com/app-store/review/guidelines/
```

#### 缺口

- 没有真实开发/上架任务与人工清单对照。
  **影响**：无法判断固定清单是否净减少遗漏或只是把核查负担转回开发者。
  **进一步探讨**：在同类脱敏项目中比较关键遗漏、错误建议、回源次数与总准备时间，并把最终审核结果与助手计划分开。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何降低时效清单被当成现行规则的风险？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设是给每项发布检查增加“适用条件、核查日期、官方条款和项目证据”的空栏，可能让助手更少把通用文档当当前规则。它从现有“优先官方来源”和“以最新为准”进一步落实到逐项可追溯，而非声称项目完全没有来源约束。

对照保留同一六步结构和四份参考，一组只有现有总入口，另一组要求对过期/条件变化情境填证据或明确未知。选含不同目标地区、支付模式和系统版本的脱敏项目，由有经验人员独立判断建议是否正确，记录误用旧规则、遗漏、回源耗时及阅读负担。若错误未下降，或新增填表只是无依据自动补日期和链接，应否定；未知必须保持未知，不能因格式齐全升级为合规保证。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:27-30](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/SKILL.md#L27-L30)

已有官方来源与不泄露私有信息的约束是比较基线。

```text
## 输出约束
- 仅输出通用流程，不引用项目私有信息
- 避免提供真实密钥或账号，使用占位符
- 引用官方链接时优先 Apple Developer / App Store Review Guidelines
```

**依据 2 · 源码核查**：[references/app-store-release-cn.md:40-47](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/app-store-release-cn.md#L40-L47)

最新要求声明和总链接未绑定逐项证据。

```text
## 8. 中国区注意事项（可能适用）
- 若涉及内容分发、UGC、地图/定位、医疗、教育、金融、游戏等，可能需要额外资质或合规说明
- 建议提供中文隐私政策与用户协议
- 以上要求以最新 Apple 审核政策与监管要求为准

## 官方参考链接
- App Store Connect: https://appstoreconnect.apple.com
- 审核指南: https://developer.apple.com/app-store/review/guidelines/
```

**依据 3 · 源码核查**：[references/privacy-security.md:28-35](https://github.com/kuangre123/iosdev/blob/44eb4c0e04386899b9f55556d04a3dbe74a16cb6/references/privacy-security.md#L28-L35)

通用合规条件支持新增适用性核对，而不构成法律结论。

```text
## 6. 中国区合规提示（可能适用）
- 如涉及个人信息处理，需遵守《个人信息保护法》等要求
- 若涉及内容发布/UGC/地图/金融/医疗等，可能需要额外资质
- 以上以最新法规与审核政策为准

## 7. 审核关注点
- 隐私政策链接必须可访问且内容完整
- 实际行为与 App Privacy 填写不一致是常见拒审原因
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
