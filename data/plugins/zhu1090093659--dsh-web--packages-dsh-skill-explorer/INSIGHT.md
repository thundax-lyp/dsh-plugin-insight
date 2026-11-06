# DSH Skill Explorer

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer)

<!-- BEGIN META -->
[![GitHub ★ 10,117](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C117&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 144,629](https://img.shields.io/static/v1?label=npm+30d&message=144%2C629&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)
<!-- END META -->

> **功能**：在 DSH Web 面板中按来源浏览、开关、编辑、创建和导入技能文件。

> **亮点**：[Q02](#research-q02) 将来源、可编辑路径和现有文件操作汇在Host原生面板，name/path新扫描阻止过期同名回退，普通字段开关与provider本地视图也分开实现；[Q03](#research-q03) wx导入避免目标文件覆盖。贡献是局部维护便利与检查，不能把面板状态当实际权限、原子恢复或已测节时。

> **主要限制**：[Q02](#research-q02) 编辑重建会丢未包含frontmatter，provider关闭只影响视图；[Q03](#research-q03) 嵌套/父目录链接未被统一防护，部分导入失败缺已成功清单且关闭面板不能回滚。如果读者无法核完整字节和会话目录，界面可能比直接编辑更容易误判文件与模型状态。

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
  - [Q01 · 它管理什么，宿主与原生技能目录的边界是什么？](#detail-section-11)
  - [Q02 · 扫描到编辑、开关和删除，真正改变哪些文件或状态？](#detail-section-12)
  - [Q03 · 访问、路径、导入与取消有哪些实际保护和未覆盖边界？](#detail-section-13)
  - [Q04 · 采用和退出的全周期成本是什么，是否只有本地副作用？](#detail-section-14)
  - [Q05 · 已有增量和可证伪的下一步分别是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 管理多个Skill来源的DSH用户需要找到有效文件、核调用状态并恢复误操作；原生会话目录仍是实际可用性的核对对象。

[Q01](#research-q01) 编辑器/文件管理器直接维护多根SKILL.md，配合Host技能目录核生效；本项集中入口并加新扫描路径身份核对，未改变Host加载或提供完整无损编辑。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多来源浏览 | 汇总扫描与registry的Skill | 不含全部preset作用域；complete可能false |
| 编辑/创建/文件开关 | 管理实际SKILL.md | 编辑重建有限字段；开关不等于全字节不变 |
| provider视图开关 | 整理面板显示 | 不改变Host真实模型权限 |
| 目录/zip导入 | 只新建指令文件 | wx仅保护文件，附件不复制；部分失败核盘 |
| 删除 | 把指令文件移入.trash | 不删附件，无已验恢复API |

**流程与依赖**

| 依赖 | 作用 | 版本或条件 |
|---|---|---|
| Skill Explorer | 本组件 | 0.4.15，BSD-3-Clause |
| DSH / React | Host与客户端 | >=0.2.2-rc.1 / ^18.2.0 |
| webServer/skills/sessions | 路由与扫描 | Host必需 |
| slots/locale/layout及shell席位 | 原生面板 | 实际席位未出现时面板可能缺失 |
| 本地或配对访问 | 访问文件管理接口 | socket/Host围栏或有效pairing服务；非workspace角色ACL |
| 技能根与备份 | 实际读写/恢复 | 正确DSH_HOME/agentsHome/custom/cwd，可信副本 |

| 步骤 | 操作 | 核对与失败处理 |
|---|---|---|
| 首次 | 核Host版本、根目录并完整备份 | 先确认遥测偏好和来源信任 |
| 浏览 | 看来源/路径/complete与会话目录 | 面板无不等于模型无 |
| 简单编辑 | 读原文件、提交后比完整diff | 未保留字段立即还原 |
| 导入 | 可信单项，核路径/附件及实际结果 | 失败可能前项已写，先核盘不重试 |
| 退出 | 停写、保存/还原文件和provider状态 | 删除/trash与关面板不是全面回滚 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与风险承担 |
|---|---|---|
| 首次 | 本地存储/网络费未知 | 配根、备份和Host版本，分钟未知 |
| 持续 | 文件IO/可选遥测网络量未知 | 字段/附件/真实生效核对；节时未测 |
| 失败恢复 | 备份/重新导入资源未知 | 部分落盘、误字段和链接/并发需手工恢复 |
| 退出 | 保留备份/trash空间未知 | 已写文件、附件和provider状态不自动还原 |

| 效果项 | 当前源码支持 | 尚不支持 |
|---|---|---|
| 来源定位 | 多根/registry展示与路径复核 | 全preset覆盖和真实Host一致 |
| 文件维护 | create/update/开关/trash实际调用 | 无损字段、并发原子与完整恢复 |
| 导入 | 校验/rank计划/wx及正常outcomes | 全批次事务、所有链接/解压硬内存保护 |
| 采用收益 | 简单可信副本可试用 | 净节时、误改率或长期采用收益 |

> **思考**：[Q02](#research-q02) 编辑重建会丢未包含frontmatter，provider关闭只影响视图；[Q03](#research-q03) 嵌套/父目录链接未被统一防护，部分导入失败缺已成功清单且关闭面板不能回滚。如果读者无法核完整字节和会话目录，界面可能比直接编辑更容易误判文件与模型状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将来源、可编辑路径和现有文件操作汇在Host原生面板，name/path新扫描阻止过期同名回退，普通字段开关与provider本地视图也分开实现；[Q03](#research-q03) wx导入避免目标文件覆盖。贡献是局部维护便利与检查，不能把面板状态当实际权限、原子恢复或已测节时。

[Q02](#research-q02)新扫描身份和开关temp替换有局部保护，非编辑无损/并发事务；[Q03](#research-q03)wx、顶层链接标记与zip限额均有具体作用域，不能由注释扩大保证；[Q04](#research-q04)客户端实际有可抑制遥测，未将服务端声明当独立证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 编辑重建会丢未包含frontmatter，provider关闭只影响视图；[Q03](#research-q03) 嵌套/父目录链接未被统一防护，部分导入失败缺已成功清单且关闭面板不能回滚。如果读者无法核完整字节和会话目录，界面可能比直接编辑更容易误判文件与模型状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先备份独立根并核Host/遥测，选简单字段和可信小样；提交后比完整字节、附件和会话目录。provider技能需从真实provider停用；导入报错先列磁盘新项并还原，改回编辑器；[Q05](#research-q05)差异/收据方向需另做验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持原生管理面板及有限文件保护；建议能备份/核差异者在非敏感独立根试简单Skill，复杂字段/链接/不可信zip及真实provider强禁用先观察；无运行或Host验收。

- 已检查：作者 README、包清单、源码路径 packages/dsh-skill-explorer/README.zh.md、packages/dsh-skill-explorer/package.json、packages/dsh-skill-explorer/src/access.ts、packages/dsh-skill-explorer/src/client/api.ts、packages/dsh-skill-explorer/src/client/index.ts、packages/dsh-skill-explorer/src/client/native-panel.tsx、packages/dsh-skill-explorer/src/client/panel/ImportTab.tsx、packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx、packages/dsh-skill-explorer/src/client/telemetry.ts、packages/dsh-skill-explorer/src/collect.ts、packages/dsh-skill-explorer/src/frontmatter.ts、packages/dsh-skill-explorer/src/import.ts、packages/dsh-skill-explorer/src/index.ts、packages/dsh-skill-explorer/src/loopback.ts、packages/dsh-skill-explorer/src/pair-access.ts、packages/dsh-skill-explorer/src/provider-toggles.ts、packages/dsh-skill-explorer/src/routes.ts 及固定范围 inventory；组件：packages/dsh-skill-explorer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包Host与原生面板/API、来源扫描/registry、frontmatter/文件开关/provider视图、创建/编辑/trash和目录zip导入、配对/loopback与遥测代表链。未审全仓其他包、真实配对服务/上游provider及实际技能内容；前稿五题与全部findings已复核。
- 下一步：只读源码，无目标测试/安装/Host/浏览器/模型或真实资料执行。建议虚构根故障矩阵：复杂字段、嵌套/父链接、并发create/update、后段导入失败和关闭面板后落盘，再核真实会话目录与成本。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.15（[固定提交 1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 候选是写前完整差异/字段损失提示、失败仍可核对的逐项落盘收据及Host实际技能目录对照，以复杂字段/附件/部分失败样本比较现有面板与编辑器备份；错改/误禁用不降或恢复更慢就推翻，尚未实现验收。

只读源码，无目标测试/安装/Host/浏览器/模型或真实资料执行。建议虚构根故障矩阵：复杂字段、嵌套/父链接、并发create/update、后段导入失败和关闭面板后落盘，再核真实会话目录与成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 478 | — | — | 6400 |
| .ts | source | 23 | 3917 | 2400 | 1277 | — |
| .tsx | source | 6 | 1148 | 886 | 201 | — |
| .ts | test | 16 | 4073 | 2981 | 661 | — |
| .tsx | test | 2 | 1026 | 780 | 159 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 158](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=158&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 153](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=153&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨来源管理Skill时，面板、实际文件和模型可调用状态能否一致且可恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它管理什么，宿主与原生技能目录的边界是什么？

**研究主题**：场景与需求、依赖、兼容与流程、贡献与相对优势

#### 完整回答

本条是 Skill 管理插件，不是一个被模型执行的 Skill。子包 @linxin666/dsh-client-ui-skill-explorer 0.4.15、BSD-3-Clause，声明 DSH >=0.2.2-rc.1、React ^18.2.0，服务入口与 web 客户端、bundle patch 分开。Host inject webServer/skills/sessions 并注册 makeRoutes；客户端实际通过 shell 的 sidebar.panellist 与 keyed main 槽注册面板，不是接管聊天DOM。缺服务/槽位或版本不满足不能推定面板存在，具体Host兼容尚未运行。

目标是维护用户、项目、自定义和provider多来源技能的DSH使用者，合格结果不只是列表好看，而是明确改的是哪份文件、哪些字段保留、会话实际能调用什么，并能恢复误写。原办法是编辑器/文件管理器查多个根、直接修改SKILL.md，再用宿主skill目录核生效；本项把扫描和写入入口集中，仍继承宿主加载、权限与模型行为，不因GUI便利就推导工作组织或新增人群。

正式前稿五题、当前报告和全部 findings 已作为前稿复核。本轮核该子包Host、原生面板/API、扫描、读写开关/删除、目录zip导入和访问边界，不全审同仓其他包、上游provider/配对服务或真实技能内容。作者明确preset私有作用域不在全局面板覆盖；面板没显示不证明模型没有，最终目录仍须看具体会话。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:1-18](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/package.json#L1-L18)

真实子包版本、Host与客户端导出。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-skill-explorer",
  "description": "DSH skill center: browse loaded skills by source (bundled / project / user / custom / runtime), enable or disable, create and delete, in a web GUI panel.",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/package.json:23-51](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/package.json#L23-L51)

DSH>=0.2.2-rc.1、web注入与bundle。

<details>
<summary>查看原文（29行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "prepare": "tsdown",
    "watch": "tsdown --watch",
    "test": "vitest run",
    "typecheck": "tsgo --noEmit"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.1.0",
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/package.json:46-49](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/package.json#L46-L49)

真实peer DSH与React范围。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "react": "^18.2.0"
  },
```

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/package.json:82-87](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/package.json#L82-L87)

许可声明和仓库身份。

```text
  "license": "BSD-3-Clause",
  "repository": {
    "type": "git",
    "url": "https://github.com/zhu1090093659/dsh-web.git"
  }
}
```

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:20-25](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/index.ts#L20-L25)

Host必需服务声明。

```text
/** Stable cordis plugin name. */
export const name = 'skill-explorer'

/** Services required before the skill center routes can mount. */
export const inject = ['webServer', 'skills', 'sessions']

```

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:98-116](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/index.ts#L98-L116)

实际makeRoutes与注册/释放。

<details>
<summary>查看原文（19行）</summary>

```text
        .map((session) => session.header?.cwd)
        .filter((cwd): cwd is string => typeof cwd === 'string' && cwd !== '')
    } catch {
      return []
    }
  }

  const routes = makeRoutes(ctx, {
    dshHome,
    agentsHome,
    customSkillDirs,
    registry: skillCtx.skills,
    activeSessionCwds,
    logger: { warn: (error: unknown) => ctx.logger.warn(error) },
  })

  ctx.effect(() => {
    const disposers = routes.map((route) => ctx.webServer.register(route))
    return () => {
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/client/native-panel.tsx:104-125](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/client/native-panel.tsx#L104-L125)

实际shell行和main面板注册。

<details>
<summary>查看原文（22行）</summary>

```text
  }
  const disposers: Array<() => void> = []

  disposers.push(slots.inject('sidebar.panellist', () => slots.register({
    name: 'sidebar.panellist',
    id: SKILL_EXPLORER_PANEL_ID,
    order: PANEL_ORDER,
    // The shell resolves this through resolveSlotLabel on every locale change,
    // so the module-level translate reads the active language at call time.
    label: () => tt('entry.label'),
  }, SkillExplorerPanelIcon)))

  disposers.push(slots.inject('main', () => slots.register({
    name: 'main',
    key: SKILL_EXPLORER_PANEL_ID,
    inject: (): PanelFace => ({ controller, api }),
  }, SkillExplorerPanelPage as never)))

  return () => {
    for (const dispose of disposers.splice(0)) dispose()
  }
}
```

</details>

**依据 8 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:154-160](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/README.zh.md#L154-L160)

作者明确preset作用域覆盖缺口。

```text
  生僻 YAML 特性以官方 dsh-skill-filesystem 提供方为准。
- 面板覆盖它扫描的文件系统根，加上 `ctx.skills` 注册表的全局层（bundled 与
  runtime 条目）。配在 host 平面 `skill-filesystem` 行上的 `customSkillDirs`
  会被扫描，因为宿主会读取该行配置；仅通过**某个 agent preset 自己的**
  `customSkillDirs` 或 preset 作用域提供方到达 agent 的技能不在此覆盖范围内，
  因为面板读取注册表时不带 viewing scope。因此面板里没有的技能，不一定模型也没有：
  会话能加载什么，以官方 `skill` 工具目录为准。
```

#### 缺口

- 没有同Host面板与具体会话目录的对照或目标用户维护任务数据。
  **影响**：不能证明所有技能可管理，也不能证明值得替换编辑器操作。
  **进一步探讨**：隔离profile同时核面板、实际文件和会话skill目录，用相同任务比较误改/时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 扫描到编辑、开关和删除，真正改变哪些文件或状态？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Host 合并插件配置和活动skill-filesystem行的custom根，取活动session cwd；collect扫描项目.dsh/.agents、用户和custom，再合并registry.snapshot，按来源rank及活动workspace处理同名技能。registry失败保留文件扫描但complete=false，且不带viewing scope。list可显式cwd，其他现有文件读写多数按当前panelCwd()重扫描；客户端只发name/path时不持续携带此前显式cwd，重比不符应409，不把共享helper解释为永远同工作区。

read/update/set-enabled/delete 都将name/path当身份声明，以新扫描匹配完全相同路径才操作，过期同名回退拒绝。编辑客户端真正POST，Host读当前disable-model-invocation保留，再overwriteSkillFile；buildSkillContent只重建name/description/可选whenToUse/禁用标记与trim后正文，input、user-invocable及其他未知frontmatter不保留，复杂文件可能改变语义。普通overwrite是直接writeFile，没有内容hash/版本条件或整体原子替换，不能保证并发编辑不覆盖。

文件开关与编辑不同：setFrontmatterField读现文件、只改指定布尔行，独占随机temp再rename，但会规范换行，不能把它当全字节不变。provider-file开关只写provider-toggles.json，collect末尾把面板modelInvocable=false，宿主registry照旧，绝不是让模型收不到；文件坏/读失败时视为空，面板会看成全启用。provider状态本地持久但读改写没有跨请求版本锁，临时文件rename不等于并发无丢更。

删除有浏览器window.confirm，Host仍独立复扫并拒绝linked=true，再把SKILL.md rename到同目录.trash/<时间>-SKILL.md；不删除整个技能目录/附件，未见恢复API。确认只约束此UI，直接授权API请求不带单独确认凭据。根扫描识别到的链接有保护，但不能推为所有嵌套链接受保护，下一题具体收窄。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:65-109](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/index.ts#L65-L109)

实际custom loader根和活动session cwd解析。

<details>
<summary>查看原文（45行）</summary>

```text
  const skillCtx = ctx as unknown as SkillContext
  const dshHome = config?.dshHome ?? process.env.DSH_HOME ?? homedir() + sep + '.dsh'
  const agentsHome = config?.agentsHome ?? process.env.DSH_AGENTS_HOME ?? homedir() + sep + '.agents'
  /**
   * Every custom skill root the panel should scan: this plugin's own config
   * plus whatever the live `skill-filesystem` rows declare. The official
   * documented placement is the provider row (a profile patch), not this
   * plugin, so reading only `config.customSkillDirs` left those skills
   * listed with no editable path — the "Custom directories" group rendered
   * without controls and every write route answered 404.
   */
  const customSkillDirs = (): string[] => {
    const own = Array.isArray(config?.customSkillDirs) ? config.customSkillDirs : []
    let fromRows: string[] = []
    try {
      // Non-strict read: the loader is present in every real composition but
      // is not a declared dependency of this plugin, so a shell without one
      // must degrade to the plugin's own config instead of failing the mount.
      const loader = (ctx as unknown as { get(name: string, strict?: boolean): unknown }).get('loader', false) as LoaderSurface | undefined
      if (typeof loader?.entries === 'function') fromRows = customSkillDirsFromLoader(loader.entries())
    } catch {
      fromRows = []
    }
    return normalizeSkillRoots([...own, ...fromRows])
  }

  /** Active session workspace cwds (degraded to [] when the registry is unavailable). */
  const activeSessionCwds = (): string[] => {
    try {
      const sessions = skillCtx.sessions as SessionList | undefined
      if (typeof sessions?.list !== 'function') return []
      return sessions
        .list()
        .map((session) => session.header?.cwd)
        .filter((cwd): cwd is string => typeof cwd === 'string' && cwd !== '')
    } catch {
      return []
    }
  }

  const routes = makeRoutes(ctx, {
    dshHome,
    agentsHome,
    customSkillDirs,
    registry: skillCtx.skills,
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:491-550](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L491-L550)

实际多根扫描、registry合并、rank和complete状态。

<details>
<summary>查看原文（60行）</summary>

```text
 */
export async function collectSkills(options: CollectOptions): Promise<CollectResult> {
  const { cwd, customSkillDirs, dshHome, agentsHome, registry } = options
  const byName = new Map<string, SkillEntry>()
  const activeProjectRoot = findProjectRoot(cwd)
  const roots = new Set<string>(options.projectRoots !== undefined && options.projectRoots.length > 0 ? [activeProjectRoot, ...options.projectRoots] : [activeProjectRoot])
  // Each root scans independently, in parallel (Map writes are atomic under the single thread).
  const scanTasks: Array<Promise<void>> = []
  for (const root of roots) {
    const isActive = root === activeProjectRoot || root === cwd
    const wsInfo = {
      root,
      name: basename(root) || root,
      active: isActive,
    }
    scanTasks.push(scanSkillRoot(join(root, '.dsh', 'skills'), 'project-dsh', byName, wsInfo))
    scanTasks.push(scanSkillRoot(join(root, '.agents', 'skills'), 'project-agents', byName, wsInfo))
  }
  for (const dir of normalizeSkillRoots(customSkillDirs ?? [])) scanTasks.push(scanSkillRoot(dir, 'custom', byName))
  scanTasks.push(scanSkillRoot(join(dshHome, 'skills'), 'user-dsh', byName, undefined, true))
  scanTasks.push(scanSkillRoot(join(agentsHome, 'skills'), 'user-agents', byName))
  await Promise.all(scanTasks)

  // Registry supplement: same-name skills get whenToUse / invocation flags
  // filled in; registry-only skills (bundled / runtime) join as-is.
  // Query the registry for primary cwd and any other active project roots so
  // project-level providers are captured.
  const snapshotCwds = new Set<string>([cwd, ...roots])
  let complete = true
  for (const snapshotCwd of snapshotCwds) {
    try {
      const snapshot = await registry.snapshot({ cwd: snapshotCwd })
      if (snapshot.complete !== true) complete = false
      for (const skill of snapshot.skills) {
        const existing = byName.get(skill.name)
        const serialized = serializeRegistry(skill)
        if (existing === undefined) {
          byName.set(skill.name, serialized)
          continue
        }
        // The registry outranks a scanned entry of a weaker source, the way
        // the official registry resolves a duplicate by rank. Without this an
        // unquestioned filesystem entry would win even when the official
        // winner is a runtime registration, so the panel would name a different
        // skill than the model receives.
        if (rankOf(serialized.level) < rankOf(existing.level)) {
          byName.set(skill.name, serialized)
          continue
        }
        if (rankOf(serialized.level) > rankOf(existing.level)) continue
        if (serialized.whenToUse !== undefined) existing.whenToUse = serialized.whenToUse
        if (serialized.provider !== undefined) existing.provider = serialized.provider
        // Only let the registry refine invocation when it actually states a
        // policy. scanSkillRoot() already resolved the file frontmatter with
        // the official rule (omitted => allowed), so overwriting it with the
        // serialized default would re-introduce the false-negative that made
        // every skill render as not invocable.
        if (skill.invocation?.modelInvocable !== undefined) existing.modelInvocable = skill.invocation.modelInvocable
        if (skill.invocation?.userInvocable !== undefined) existing.userInvocable = skill.invocation.userInvocable
      }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:183-198](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L183-L198)

panelCwd规则与fresh findSkill。

<details>
<summary>查看原文（16行）</summary>

```text
   * is the DSH install directory they scanned a different project root than
   * the list route had just served and reported 409 for a skill the panel was
   * displaying.
   */
  const panelCwd = (override?: string): string =>
    (override !== undefined && override.trim() !== '' ? override : undefined)
    ?? safeSessionCwds()[0]
    ?? DEFAULT_CWD()

  /** Find a skill by name from a fresh collection pass (trusts scanned paths only). */
  const findSkill = async (name: string, cwd: string): Promise<SkillEntry | undefined> => {
    const { skills } = await collectSkills(await collectOptions(cwd))
    return skills.find((candidate) => candidate.name === name)
  }

  /**
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:216-238](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L216-L238)

name/path重新扫描完全匹配，不接受任意旧路径。

<details>
<summary>查看原文（23行）</summary>

```text

  /** Resolve the exact file the panel showed, rejecting stale same-name fallbacks. */
  const resolveScannedSkill = async (
    name: string,
    expectedPath: string,
    cwd: string,
    res: ServerResponse,
  ): Promise<(SkillEntry & { path: string }) | undefined> => {
    const skill = await findSkill(name, cwd)
    if (skill?.path === undefined) {
      writeJson(res, 404, { error: `skill ${name} has no editable file` })
      return undefined
    }
    if (skill.path !== expectedPath) {
      writeJson(res, 409, { error: `skill ${name} changed since the panel loaded; refresh and retry` })
      return undefined
    }
    return skill as SkillEntry & { path: string }
  }

  const routes: WebRoute[] = [
    {
      kind: 'exact',
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:486-514](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L486-L514)

编辑实际复扫、linked门、读取禁用标记并overwrite。

<details>
<summary>查看原文（29行）</summary>

```text
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '') {
            writeJson(res, 400, { error: 'expected { name, path, description, content }' })
            return
          }
          if (typeof description !== 'string' || description.trim() === '') {
            writeJson(res, 400, { error: 'description is required' })
            return
          }
          if (typeof content !== 'string' || content.trim() === '') {
            writeJson(res, 400, { error: 'content is required' })
            return
          }
          if (Buffer.byteLength(content, 'utf8') > 64 * 1024) {
            writeJson(res, 400, { error: 'content exceeds 64KB limit' })
            return
          }
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink: rewriting it would edit a
          // file outside this skill root, so the panel must not offer it.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be edited` })
            return
          }
          // The enabled state is not part of the edit form: carry it over so an
          // edit never silently re-enables a disabled skill.
          const disabled = parseFrontmatter(readFileSync(skill.path, 'utf8')).disableModelInvocation === true
          const target = await overwriteSkillFile(skill.path, name, description.trim(), typeof whenToUse === 'string' ? whenToUse : undefined, content, disabled)
          writeJson(res, 200, { ok: true, name, path: target, disabled })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:567-595](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L567-L595)

编辑重建固定字段和直接writeFile。

<details>
<summary>查看原文（29行）</summary>

```text

/** Build the new skill file content (create route). */
export function buildSkillContent(name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): string {
  const lines = ['---', `name: ${name}`, `description: ${yamlQuote(description.replace(/[\r\n]/gu, ' '))}`]
  if (typeof whenToUse === 'string' && whenToUse.trim() !== '') lines.push(`whenToUse: ${yamlQuote(whenToUse.replace(/[\r\n]/gu, ' '))}`)
  if (disabled === true) lines.push('disable-model-invocation: true')
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
}
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/frontmatter.ts:116-153](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/frontmatter.ts#L116-L153)

单字段改写与独占temp/rename。

<details>
<summary>查看原文（38行）</summary>

```text
 * @param field - frontmatter field name (e.g. disable-model-invocation).
 * @param value - target boolean value.
 * @returns the parsed frontmatter of the rewritten content.
 */
export function setFrontmatterField(file: string, field: string, value: boolean): Frontmatter {
  const content = readFileSync(file, 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/.exec(content)
  if (match === null) throw new Error(`setFrontmatterField: ${file} has no frontmatter`)
  const blockLines = match[1].split(/\r?\n/)
  const linePattern = new RegExp(`^${field}:`)
  let replaced = false
  const next = blockLines.map((line) => {
    if (linePattern.test(line)) {
      replaced = true
      return `${field}: ${value}`
    }
    return line
  })
  if (!replaced) next.push(`${field}: ${value}`)
  const rewritten = `---\n${next.join('\n')}\n---${match[2]}`
  // Atomic write: tmp file + rename, so a watcher never reads a half-written
  // state. The tmp name is unpredictable and created with O_EXCL ('wx'), so a
  // planted symlink at a guessable name can never redirect the write.
  const tmp = `${file}.${Date.now().toString(36)}.${randomBytes(6).toString('hex')}.tmp`
  try {
    writeFileSync(tmp, rewritten, { encoding: 'utf8', flag: 'wx' })
    renameSync(tmp, file)
  } catch (error) {
    // Best-effort cleanup of a half-written tmp file; the original file is untouched.
    try {
      unlinkSync(tmp)
    } catch {
      // ignore
    }
    throw error
  }
  return parseFrontmatter(rewritten)
}
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:288-313](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L288-L313)

真实set-enabled调用及返回状态。

<details>
<summary>查看原文（26行）</summary>

```text
      },
    },
    {
      kind: 'exact',
      path: ROUTES.setEnabled,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req, { maxBytes: 128 * 1024, objectOnly: true })
          if (body === null) {
            writeJson(res, 400, { error: 'invalid JSON body' })
            return
          }
          const payload = body as Record<string, unknown>
          const { name, path, enabled } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '' || typeof enabled !== 'boolean') {
            writeJson(res, 400, { error: 'expected { name, path, enabled }' })
            return
          }
          // The client path is only an identity claim: a fresh scan must
          // resolve the same effective skill before any file is touched.
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // Disabled = disable-model-invocation: true; enabled = false.
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', enabled ? false : true)
          writeJson(res, 200, {
```

</details>

**依据 9 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:436-444](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L436-L444)

provider开关只改收集输出的modelInvocable。

```text
export function applyProviderToggles(skills: Iterable<SkillEntry>, disabled: readonly ProviderSkillIdentity[]): void {
  if (disabled.length === 0) return
  const keys = new Set(disabled.map((identity) => JSON.stringify([identity.provider, identity.name])))
  for (const skill of skills) {
    if (skill.fileState !== 'provider-file') continue
    if (!keys.has(JSON.stringify([skill.provider ?? '', skill.name]))) continue
    skill.modelInvocable = false
  }
}
```

**依据 10 · 源码核查**：[packages/dsh-skill-explorer/src/provider-toggles.ts:150-176](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/provider-toggles.ts#L150-L176)

读失败为空及temp/fsync写入。

<details>
<summary>查看原文（27行）</summary>

```text
 * shows every provider skill as enabled, which is the state before the user
 * ever used the switch, instead of failing the whole list route.
 * @param dshHome - the DSH home root.
 * @returns the records the panel currently honors.
 */
export async function readProviderToggles(dshHome: string): Promise<ProviderToggleDocument> {
  try {
    return deserializeProviderToggles(await readFile(providerToggleFile(dshHome), 'utf8'))
  } catch {
    return emptyProviderToggles()
  }
}

/** Atomic JSON write: unique temp file, fsync, rename. */
async function writeJsonAtomic(path: string, value: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  tempSeq += 1
  const temp = `${path}.${process.pid}.${tempSeq}.tmp`
  try {
    const handle = await open(temp, 'w')
    try {
      await handle.writeFile(value, 'utf8')
      await handle.sync()
    } finally {
      await handle.close()
    }
    await rename(temp, path)
```

</details>

**依据 11 · 源码核查**：[packages/dsh-skill-explorer/src/provider-toggles.ts:195-210](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/provider-toggles.ts#L195-L210)

provider读改写，没有版本比较或Host取消调用。

<details>
<summary>查看原文（16行）</summary>

```text
export async function setProviderSkillEnabled(
  dshHome: string,
  identity: ProviderSkillIdentity,
  enabled: boolean,
): Promise<ProviderToggleDocument> {
  const doc = await readProviderToggles(dshHome)
  const stored = doc.disabled.some((entry) => keyOf(entry) === keyOf(identity))
  if (stored === !enabled) return doc
  const disabled = (enabled
    ? doc.disabled.filter((entry) => keyOf(entry) !== keyOf(identity))
    : [...doc.disabled, identity]
  ).sort(compareIdentities)
  const next: ProviderToggleDocument = { version: 1, disabled }
  await writeJsonAtomic(providerToggleFile(dshHome), serializeProviderToggles(next))
  return next
}
```

</details>

**依据 12 · 源码核查**：[packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx:154-170](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/client/panel/SkillsTab.tsx#L154-L170)

UI删除确认后真实调用api.remove。

<details>
<summary>查看原文（17行）</summary>

```text

  const remove = async (): Promise<void> => {
    const path = skill.path
    if (path === undefined) return
    if (!window.confirm(tt('list.deleteConfirm', { name: skill.name }))) return
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setError(undefined)
    try {
      await api.remove(skill.name, path)
      onChanged()
    } catch (err) {
      setError(tt('list.deleteFailed', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      busyRef.current = false
      setBusy(false)
```

</details>

**依据 13 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:531-550](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L531-L550)

Host删除复扫和linked门、trash调用。

<details>
<summary>查看原文（20行）</summary>

```text
          }
          const payload = body as Record<string, unknown>
          const { name, path } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '') {
            writeJson(res, 400, { error: 'expected { name, path }' })
            return
          }
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink (mount-of-intent content, not
          // created under this root). Deleting it would move the target's real
          // SKILL.md out of place, escaping this skill root — refuse deletion.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be deleted` })
            return
          }
          const moved = await trashSkillFile(skill.path)
          writeJson(res, 200, { ok: true, name, moved })
        } catch (error) {
          logger.warn(error)
```

</details>

**依据 14 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:598-604](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L598-L604)

删除只rename指令文件到.trash，不清附件或提供恢复。

```text
export async function trashSkillFile(path: string): Promise<string> {
  const trashDir = join(dirname(path), '.trash')
  await mkdir(trashDir, { recursive: true })
  const trashTarget = join(trashDir, `${Date.now()}-SKILL.md`)
  await rename(path, trashTarget)
  return trashTarget
}
```

#### 缺口

- 复杂frontmatter/并发编辑和实际Host热生效没有运行对照。
  **影响**：编辑不能作为无损迁移；provider视图不等于权限禁用，删除恢复仍靠人工。
  **进一步探讨**：用含input/user-invocable/未知字段的副本核字节差异、并发和会话目录，再决定管理正式文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 访问、路径、导入与取消有哪些实际保护和未覆盖边界？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

全部路由实际guard访问与method。默认loopback同时要求socket地址、Host、无CF-Connecting-IP/X-Forwarded-For并核浏览器跨站/Origin；另一条允许live pairing service判定为已配对的请求。有效配对者获得这组文件管理路由，不是逐工作区角色ACL；配对实现本身在外包，本轮没审其cookie/撤销。创建/导入可由可信调用者提交cwd选择项目根，不能说只有当前session目录可写。

普通创建先exists再mkdir/writeFile，非wx；并发或目标目录在检查后变化不能保证不覆盖。扫描只对根下dirent本身为symlink设linked=true，普通子目录中的SKILL.md直接readFile，未lstat该文件；因而不能笼统保证“所有链接都拒绝编辑”：若该SKILL.md自身是链接，update路径可能不触发linked门并跟随写入。set-enabled本来允许根链接，目录链接可改到目标，单文件链接在temp rename时会被替换成普通文件。这些是当前源码范围与未运行风险，不是已发生越界事故；新扫描与写之间也没有realpath锁定或版本事务。

导入真实先提取/解析/计划再逐项execute，名称/description及来源rank检查后只写<name>/SKILL.md，wx保护目标文件不被并发覆盖；但目标父目录没有realpath/防链接检查，wx不约束父目录链接。目录源只跳过顶层dot和symlink条目，普通子目录里的SKILL.md仍直接读取，不能沿用作者“所有符号链接跳过”的宽泛保证。zip只取SKILL.md，不复制附件；有4MB archive/总展开文本、512条、64KB技能上限及zip格式/path检查，但inflateRawSync发生在实际展开长度检查之前，未设maxOutputLength，不能把上限当解压内存硬保护。

批次后续write抛错时先前文件保留，executeImport没有捕获后返回已成功outcomes；路由500仅error，故正常完成才有完整报告，失败不保证用户收到已落盘清单。客户端busyRef防同一UI双击，fetch未带AbortSignal；切tab/关闭面板不是服务器取消或回滚，直接API并发仍可到达。这决定应只导可信小样，失败先核磁盘而非盲重试。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:131-141](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L131-L141)

实际访问guard与method检查。

<details>
<summary>查看原文（11行）</summary>

```text
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isSkillExplorerAllowed(ctx, req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/access.ts:17-20](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/access.ts#L17-L20)

路由信任门实际转到paired/loopback。

```text
 */
export function isSkillExplorerAllowed(ctx: Context, request: IncomingMessage): boolean {
  return isPairedOrLoopbackAllowed(ctx, request)
}
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/pair-access.ts:38-64](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/pair-access.ts#L38-L64)

loopback或已配对分支与可选服务查询。

<details>
<summary>查看原文（27行）</summary>

```text
export function isPairedOrLoopbackAllowed(ctx: LookupCtx, request: IncomingMessage): boolean {
  if (isLoopbackRequest(request)) return true
  return lookupPairing(ctx)?.isPairedDevice(request) === true
}

/**
 * The pairing service, or undefined when this composition does not expose it.
 *
 * Two lookups exist because the fence is shared with test harnesses that hand
 * over a bare object: a real cordis context resolves services through `get`, a
 * harness may carry the property directly. `get(name, false)` is the
 * non-strict form, so an unloaded service answers undefined rather than
 * throwing. Reading an un-injected service as a PROPERTY throws instead
 * (`cannot get property "remoteWebUiPairing" without inject`); a trust fence
 * must answer "not paired" in that case, never leak the error into the route
 * handler, where the host web server turns it into an empty-body 400 (#1942).
 */
function lookupPairing(ctx: LookupCtx): PairingAccess | undefined {
  if (typeof ctx.get === 'function') {
    const viaGet = ctx.get('remoteWebUiPairing', false)
    return isPairingAccess(viaGet) ? viaGet : undefined
  }
  try {
    const viaProperty = ctx.remoteWebUiPairing
    return isPairingAccess(viaProperty) ? viaProperty : undefined
  } catch {
    return undefined
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/loopback.ts:72-92](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/loopback.ts#L72-L92)

实际socket/代理头/Host/Origin围栏。

<details>
<summary>查看原文（21行）</summary>

```text
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  if (isProxiedRequest(request)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:375-418](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L375-L418)

create接受cwd选择项目根，未限定只活动session。

<details>
<summary>查看原文（44行）</summary>

```text
      path: ROUTES.create,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req, { maxBytes: 128 * 1024, objectOnly: true })
          if (body === null) {
            writeJson(res, 400, { error: 'invalid JSON body' })
            return
          }
          const payload = body as Record<string, unknown>
          const { root, name, description, whenToUse, content, cwd } = payload
          if (root !== 'user' && root !== 'project') {
            writeJson(res, 400, { error: 'root must be user (~/.dsh/skills) or project (project .dsh/skills)' })
            return
          }
          if (typeof cwd !== 'string' || cwd.trim() === '') {
            writeJson(res, 400, { error: 'cwd is required (the workspace shown by the panel)' })
            return
          }
          if (typeof name !== 'string' || !isSkillName(name)) {
            writeJson(res, 400, { error: 'name must be kebab-case (lowercase letters/digits first)' })
            return
          }
          if (typeof description !== 'string' || description.trim() === '') {
            writeJson(res, 400, { error: 'description is required' })
            return
          }
          if (typeof content !== 'string' || content.trim() === '') {
            writeJson(res, 400, { error: 'content is required' })
            return
          }
          if (Buffer.byteLength(content, 'utf8') > 64 * 1024) {
            writeJson(res, 400, { error: 'content exceeds 64KB limit' })
            return
          }
          const baseDir = root === 'user'
            ? userSkillRoot(dshHome)
            : projectSkillRoot(findProjectRoot(cwd))
          const target = await writeSkillFile(baseDir, name, description, typeof whenToUse === 'string' ? whenToUse : undefined, content)
          writeJson(res, 200, { ok: true, name, path: target })
        } catch (error) {
          if (error instanceof Error && /already exists/.test(error.message)) {
            writeJson(res, 409, { error: error.message })
            return
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:578-585](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L578-L585)

普通create先存在性检查再普通write。

```text
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}
```

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:315-350](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L315-L350)

linked只看根下一层dirent；子目录SKILL.md未lstat直接读。

<details>
<summary>查看原文（36行）</summary>

```text
    let file: string
    let linked = false
    if (entry.isDirectory()) {
      file = join(root, name, 'SKILL.md')
    } else if (entry.isFile() && name.endsWith('.md')) {
      file = join(root, name)
    } else if (entry.isSymbolicLink()) {
      // A symlink's dirent is neither a directory nor a file, so a plain
      // readdir() skips it and linked-out skills never show up. Follow the
      // target with stat() (cross-platform: Windows symlink/junction, Linux and
      // macOS symlink all resolve the same way) to classify it, then resolve
      // the file path like a real entry — the scan path stays on the link, so
      // the write route (set-enabled) reaches the linked target via the normal
      // fs follow semantics. Dangling or unreadable links are skipped.
      // A linked skill is mount-of-intent content, not created under this root:
      // it stays listable and toggleable, but deletion is refused (see routes).
      linked = true
      let linkedFile: string
      try {
        const target = await stat(join(root, name))
        if (target.isDirectory()) linkedFile = join(root, name, 'SKILL.md')
        else if (target.isFile() && name.endsWith('.md')) linkedFile = join(root, name)
        else continue
      } catch {
        continue
      }
      file = linkedFile
    } else {
      continue
    }
    if (!existsSync(file)) continue
    let content: string
    try {
      content = await readFile(file, 'utf8')
    } catch {
      continue
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/frontmatter.ts:139-147](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/frontmatter.ts#L139-L147)

开关temp rename可替换单文件链接，非统一跟随目标。

```text
  const tmp = `${file}.${Date.now().toString(36)}.${randomBytes(6).toString('hex')}.tmp`
  try {
    writeFileSync(tmp, rewritten, { encoding: 'utf8', flag: 'wx' })
    renameSync(tmp, file)
  } catch (error) {
    // Best-effort cleanup of a half-written tmp file; the original file is untouched.
    try {
      unlinkSync(tmp)
    } catch {
```

**依据 9 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:36-45](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/import.ts#L36-L45)

导入限制真实常量；不能由注释推为解压前硬内存界限。

<details>
<summary>查看原文（10行）</summary>

```text
export const IMPORT_LIMITS = {
  /** Largest archive the route accepts (a base64 body is larger on the wire). */
  archiveBytes: 4 * 1024 * 1024,
  /** Most entries one archive may carry. */
  entries: 512,
  /** Largest one imported SKILL.md (the same cap the create/edit routes use). */
  skillBytes: 64 * 1024,
  /** Largest total uncompressed skill text one import may produce. */
  totalBytes: 4 * 1024 * 1024,
} as const
```

</details>

**依据 10 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:275-299](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/import.ts#L275-L299)

目录导入只跳顶层链接，内层SKILL.md直接读取。

<details>
<summary>查看原文（25行）</summary>

```text
export async function candidatesFromDirectory(dir: string): Promise<RawCandidate[]> {
  let info
  try {
    info = await lstat(dir)
  } catch {
    throw new ImportRequestError(`import source is not a readable directory: ${dir}`)
  }
  if (!info.isDirectory()) throw new ImportRequestError(`import source is not a directory: ${dir}`)
  const entries = await readdir(dir, { withFileTypes: true })
  const candidates: RawCandidate[] = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) {
      const file = join(dir, entry.name, 'SKILL.md')
      if (!existsSync(file)) continue
      candidates.push({ origin: file, content: await readFile(file, 'utf8') })
      continue
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) continue
    const file = join(dir, entry.name)
    candidates.push({ origin: file, content: await readFile(file, 'utf8') })
  }
  return candidates
}
```

</details>

**依据 11 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:223-243](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/import.ts#L223-L243)

实际先inflate再查展开长度与总大小。

<details>
<summary>查看原文（21行）</summary>

```text
    const compressed = archive.subarray(dataStart, dataEnd)
    let data: Buffer
    if (method === 0) {
      data = Buffer.from(compressed)
    } else {
      try {
        data = inflateRawSync(compressed)
      } catch {
        throw new ImportRequestError(`corrupt zip archive: cannot inflate ${rawName}`)
      }
    }
    if (data.length > uncompressedSize) {
      throw new ImportRequestError(`corrupt zip archive: ${rawName} inflates past its declared size`)
    }
    totalBytes += data.length
    if (totalBytes > IMPORT_LIMITS.totalBytes) {
      throw new ImportRequestError(`archive expands past the ${IMPORT_LIMITS.totalBytes} byte import limit`)
    }
    const safe = safeEntryPath(rawName)
    if (safe === undefined) continue
    entries.push({ path: safe, data })
```

</details>

**依据 12 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:381-401](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/import.ts#L381-L401)

wx逐项创建，前项不会因后项失败自动回滚。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
  }
  return outcomes
```

</details>

**依据 13 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:422-449](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/import.ts#L422-L449)

只有execute全部返回后才组装outcomes报告。

<details>
<summary>查看原文（28行）</summary>

```text
  const raw = request.source.kind === 'archive'
    ? candidatesFromArchive(readZipEntries(request.source.data))
    : await candidatesFromDirectory(request.source.path)
  // Validate in source order first; the report then walks the same order, and
  // planImport preserves the relative order of the survivors, so outcome N
  // always describes candidate N as the user listed them.
  const parsed = raw.map(item => ({ item, result: parseCandidate(item) }))
  const valid = parsed.flatMap(entry => entry.result.candidate === undefined ? [] : [entry.result.candidate])
  const plan = planImport(valid, request.existing, request.targetLevel)
  const executed = await executeImport(plan, request.baseDir)
  const outcomes: ImportOutcome[] = []
  let cursor = 0
  for (const entry of parsed) {
    if (entry.result.candidate === undefined) {
      outcomes.push({ name: entry.result.name, origin: entry.item.origin, status: 'skipped', reason: entry.result.reason })
      continue
    }
    const outcome = executed[cursor]
    cursor += 1
    if (outcome !== undefined) outcomes.push(outcome)
  }
  return {
    level: request.targetLevel,
    outcomes,
    imported: outcomes.filter(outcome => outcome.status === 'imported').length,
    skipped: outcomes.filter(outcome => outcome.status === 'skipped').length,
  }
}
```

</details>

**依据 14 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:455-471](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/routes.ts#L455-L471)

导入正常报告与异常400/500路径。

<details>
<summary>查看原文（17行）</summary>

```text
          const workspace = panelCwd(cwd)
          const targetLevel = root === 'user' ? 'user-dsh' : 'project-dsh'
          const baseDir = root === 'user' ? userSkillRoot(dshHome) : projectSkillRoot(findProjectRoot(cwd))
          const { skills } = await collectSkills(await collectOptions(workspace))
          const report = await importSkills({ baseDir, targetLevel, source: resolved, existing: skills })
          writeJson(res, 200, { ok: true, ...report })
        } catch (error) {
          // A malformed archive or an unreadable source directory is the
          // request's problem, not the host's: say so instead of a 500.
          if (error instanceof ImportRequestError) {
            writeJson(res, 400, { error: error.message })
            return
          }
          logger.warn(error)
          writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
```

</details>

**依据 15 · 源码核查**：[packages/dsh-skill-explorer/src/client/panel/ImportTab.tsx:88-103](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/client/panel/ImportTab.tsx#L88-L103)

客户端busy与请求结果，无Host取消/恢复逻辑。

<details>
<summary>查看原文（16行）</summary>

```text
    busyRef.current = true
    setBusy(true)
    setError(undefined)
    setReport(undefined)
    try {
      const workspace = cwd ?? (await api.list()).cwd
      setCwd(workspace)
      setReport(await api.importSkills({ root, cwd: workspace, source }))
    } catch (err) {
      setError(tt('import.failed', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

```

</details>

**依据 16 · 源码核查**：[packages/dsh-skill-explorer/src/client/api.ts:187-210](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/client/api.ts#L187-L210)

真实fetch不传取消signal，HTTP错误仅转ApiError。

<details>
<summary>查看原文（24行）</summary>

```text
  private async request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
    const headers = options.body === undefined
      ? new Headers()
      : new Headers({ 'content-type': 'application/json' })
    const response = await fetch(path, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = undefined
    }
    if (!response.ok) {
      const message = typeof body === 'object' && body !== null && typeof (body as { error?: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `HTTP ${response.status}`
      throw new ApiError(message)
    }
    return body as T
  }
}
```

</details>

#### 缺口

- 配对服务授权、嵌套/父目录链接、并发、解压资源和部分导入失败未注入验证。
  **影响**：不能保证多用户隔离、所有路径约束或导入恢复；当前只适合备份的可信测试根。
  **进一步探讨**：在隔离根分别放嵌套SKILL链接/父目录链接、并发create、第二项写失败和高压缩小包，核拒绝/实际落盘/资源，勿用真实资料。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出的全周期成本是什么，是否只有本地副作用？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次要满足DSH >=0.2.2-rc.1及Host/client服务，确认正确DSH_HOME、agentsHome、自定义根与活动工作区，并备份整个技能目录、附件和provider状态。持续需要核完整文件差异、输入字段/调用标记、preset私有技能以及实际会话目录；开源BSD许可不等于无需恢复劳动。导入只带SKILL.md，依赖脚本/资源的技能仍需人工补齐和审阅指令，不能把成功导入等同技能可执行或安全。

本子包还不是完全无外网：client apply实际调用reportDailyHeartbeat，向https://dsh-market.com/api/telemetry/event发包名、可得版本及localStorage visitor的heartbeat；opt-out或DNT、webdriver/storage不可用等条件会抑制，按UTC日成功去重。当前payload未含技能正文，但服务端是否存IP/如何处理不是本子包静态源码能独立证明。没有启动浏览器或发此请求。

现金/网络/存储量、维护与恢复人工分钟未知；核心面板代码未调用模型，导入后技能自身可能触发外部工具/模型，属于另外的采用责任。删除只移单文件到.trash、退出插件只释放挂载；已有frontmatter、重建后丢字段、导入文件和provider状态不会自动还原。切面板取消读取UI状态也不是撤销已发写入。

能备份、审完整差异和会话目录者可先在独立非敏感根试简单Skill及可信单项导入；避免复杂字段、链接和不可信压缩包。字段丢失、目标/生效不明或任何导入失败就停写，列实际新文件并恢复备份或用编辑器处理；要真正禁provider技能应改它的真实配置，不依赖面板开关。需要完整无损编辑/严格隔离的人先观察。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:23-49](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/package.json#L23-L49)

具体Host/client/peer前提。

<details>
<summary>查看原文（27行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "prepare": "tsdown",
    "watch": "tsdown --watch",
    "test": "vitest run",
    "typecheck": "tsgo --noEmit"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "react": "^18.2.0"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:62-91](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/index.ts#L62-L91)

实际配置根和custom根解析。

<details>
<summary>查看原文（30行）</summary>

```text
 */
function applyImpl(ctx: Context, config?: Config): void {
  if (config?.enabled === false) return
  const skillCtx = ctx as unknown as SkillContext
  const dshHome = config?.dshHome ?? process.env.DSH_HOME ?? homedir() + sep + '.dsh'
  const agentsHome = config?.agentsHome ?? process.env.DSH_AGENTS_HOME ?? homedir() + sep + '.agents'
  /**
   * Every custom skill root the panel should scan: this plugin's own config
   * plus whatever the live `skill-filesystem` rows declare. The official
   * documented placement is the provider row (a profile patch), not this
   * plugin, so reading only `config.customSkillDirs` left those skills
   * listed with no editable path — the "Custom directories" group rendered
   * without controls and every write route answered 404.
   */
  const customSkillDirs = (): string[] => {
    const own = Array.isArray(config?.customSkillDirs) ? config.customSkillDirs : []
    let fromRows: string[] = []
    try {
      // Non-strict read: the loader is present in every real composition but
      // is not a declared dependency of this plugin, so a shell without one
      // must degrade to the plugin's own config instead of failing the mount.
      const loader = (ctx as unknown as { get(name: string, strict?: boolean): unknown }).get('loader', false) as LoaderSurface | undefined
      if (typeof loader?.entries === 'function') fromRows = customSkillDirsFromLoader(loader.entries())
    } catch {
      fromRows = []
    }
    return normalizeSkillRoots([...own, ...fromRows])
  }

  /** Active session workspace cwds (degraded to [] when the registry is unavailable). */
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:253-261](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/import.ts#L253-L261)

zip只选SKILL.md，非完整资源包复制。

```text
 * @param entries - decoded archive entries.
 * @returns one candidate per SKILL.md, in archive order.
 */
export function candidatesFromArchive(entries: readonly ArchiveEntry[]): RawCandidate[] {
  const candidates: RawCandidate[] = []
  for (const entry of entries) {
    if (basename(entry.path).toLowerCase() !== SKILL_FILE) continue
    candidates.push({ origin: entry.path, content: entry.data.toString('utf8') })
  }
```

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/client/index.ts:50-53](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/client/index.ts#L50-L53)

实际启动daily heartbeat，不是只存在辅助函数。

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-skill-explorer' }])
```

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/client/telemetry.ts:29-34](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/client/telemetry.ts#L29-L34)

opt-out键与真实远端endpoint。

```text
/** localStorage key carrying the family-wide telemetry opt-out ('1' = off). */
export const TELEMETRY_OPT_OUT_KEY = 'dsh-web-ui-telemetry-opt-out'

const VISITOR_KEY = 'dsh-web-ui-telemetry-visitor'
const DAY_KEY_PREFIX = 'dsh-web-ui-telemetry-day:'
const ENDPOINT = 'https://dsh-market.com/api/telemetry/event'
```

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/client/telemetry.ts:118-149](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/client/telemetry.ts#L118-L149)

实际guard、visitor/items payload、POST与成功去重。

<details>
<summary>查看原文（32行）</summary>

```text
  try {
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:567-604](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L567-L604)

实际重建/创建/trash副作用不会因插件退出还原。

<details>
<summary>查看原文（38行）</summary>

```text

/** Build the new skill file content (create route). */
export function buildSkillContent(name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): string {
  const lines = ['---', `name: ${name}`, `description: ${yamlQuote(description.replace(/[\r\n]/gu, ' '))}`]
  if (typeof whenToUse === 'string' && whenToUse.trim() !== '') lines.push(`whenToUse: ${yamlQuote(whenToUse.replace(/[\r\n]/gu, ' '))}`)
  if (disabled === true) lines.push('disable-model-invocation: true')
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
}

/** Move a skill file into its .trash sibling directory (recoverable delete). */
export async function trashSkillFile(path: string): Promise<string> {
  const trashDir = join(dirname(path), '.trash')
  await mkdir(trashDir, { recursive: true })
  const trashTarget = join(trashDir, `${Date.now()}-SKILL.md`)
  await rename(path, trashTarget)
  return trashTarget
}
```

</details>

**依据 8 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:154-172](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/README.zh.md#L154-L172)

作者说明preset/provider及zip附件的采用边界。

<details>
<summary>查看原文（19行）</summary>

```text
  生僻 YAML 特性以官方 dsh-skill-filesystem 提供方为准。
- 面板覆盖它扫描的文件系统根，加上 `ctx.skills` 注册表的全局层（bundled 与
  runtime 条目）。配在 host 平面 `skill-filesystem` 行上的 `customSkillDirs`
  会被扫描，因为宿主会读取该行配置；仅通过**某个 agent preset 自己的**
  `customSkillDirs` 或 preset 作用域提供方到达 agent 的技能不在此覆盖范围内，
  因为面板读取注册表时不带 viewing scope。因此面板里没有的技能，不一定模型也没有：
  会话能加载什么，以官方 `skill` 工具目录为准。
- **「由插件提供」**行的开关是**仅本面板生效**的视图决定：它改变的是本面板
  列出的可调用状态，宿主注册表照旧加载该技能，模型仍会收到它。要真正让这类
  技能不再进入模型，需要在它的 provider 获取它的位置（插件配置或随包文件）
  移除或停用它。
- 链接技能不可删除、不可编辑（见安全模型）；启用/禁用对链接技能正常（改写目标
  `SKILL.md` frontmatter）。目录型与「单文件」链接都能正常列出；「单文件」
  符号链接（指向单个 `.md`）在原子改写（rename）时会被替换为一个普通文件
  （链接不再保留），目标文件本身不受影响。
- 目录导入只读取一层、不递归：嵌套的目录树需要指向真正存放技能的那个目录。
  `.zip` 导入接受任意深度的 `SKILL.md`，因此「把技能目录压缩成包」可用，但压缩包里的
  其他文件会被忽略，而不会作为资源一并复制。
- 导入的同名技能若已在同级或更强来源解析，会报告为跳过（`exists` / `shadowed`）
```

</details>

#### 缺口

- 没有真实维护成本/效果、Host生效、恢复与退出残留验收，遥测服务端处理未核。
  **影响**：不能给净收益/无残留或完全本地隐私保证，需备份及明确遥测偏好。
  **进一步探讨**：对同一可信技能样本记录完整diff/附件/会话状态、失败恢复分钟与退出后目录，另按需要核遥测服务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有增量和可证伪的下一步分别是什么？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

当前可归因增量是原生面板把多根扫描、路径身份复核、编辑/导入/删除接到同一管理入口，provider视图和真实文件状态也有独立实现；相对遍历目录/编辑器提供局部操作便利。宿主加载与安全指令、完整来源优先级和模型效果均继承或未验，集中入口不计组织分工/新用户群贡献。

候选方向应是写前完整字节diff、字段保留/丢失提示、真实host可调用目录对照，以及失败时仍能恢复的逐项落盘收据；它们需解决Q02重建字段、Q03部分失败缺报告和provider视图不等于禁用的具体问题，不只是再添加批量按钮。当前单字段开关会保留其他行、正常导入有outcomes，是必须比较的既有机制，不能把这些已有能力说成未来首次实现。

最小验证用包含input/user-invocable/未知字段、附件、同名更强来源及第二项写失败的虚构技能集，对照现有面板与编辑器+备份。按误改字段、错误禁用判断、已落盘清单准确率、恢复分钟和会话实际可调用目录评估；若diff未包含真实改动、部分收据不匹配磁盘，或复核负担比手工更大，就推翻。这是未实现/未验证候选，不能计入当前已交付质量或经济创新。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:567-595](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L567-L595)

编辑重建字段是无损差异方向的直接依据。

<details>
<summary>查看原文（29行）</summary>

```text

/** Build the new skill file content (create route). */
export function buildSkillContent(name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): string {
  const lines = ['---', `name: ${name}`, `description: ${yamlQuote(description.replace(/[\r\n]/gu, ' '))}`]
  if (typeof whenToUse === 'string' && whenToUse.trim() !== '') lines.push(`whenToUse: ${yamlQuote(whenToUse.replace(/[\r\n]/gu, ' '))}`)
  if (disabled === true) lines.push('disable-model-invocation: true')
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:381-401](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/import.ts#L381-L401)

逐项写入当前只有正常返回outcomes，候选需比较既有机制。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
  }
  return outcomes
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:436-444](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/collect.ts#L436-L444)

provider状态只在收集输出改变，须与真实Host目录对照。

```text
export function applyProviderToggles(skills: Iterable<SkillEntry>, disabled: readonly ProviderSkillIdentity[]): void {
  if (disabled.length === 0) return
  const keys = new Set(disabled.map((identity) => JSON.stringify([identity.provider, identity.name])))
  for (const skill of skills) {
    if (skill.fileState !== 'provider-file') continue
    if (!keys.has(JSON.stringify([skill.provider ?? '', skill.name]))) continue
    skill.modelInvocable = false
  }
}
```

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/frontmatter.ts:116-147](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-skill-explorer/src/frontmatter.ts#L116-L147)

已有单字段保留/原子替换，候选不可冒充其新实现。

<details>
<summary>查看原文（32行）</summary>

```text
 * @param field - frontmatter field name (e.g. disable-model-invocation).
 * @param value - target boolean value.
 * @returns the parsed frontmatter of the rewritten content.
 */
export function setFrontmatterField(file: string, field: string, value: boolean): Frontmatter {
  const content = readFileSync(file, 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/.exec(content)
  if (match === null) throw new Error(`setFrontmatterField: ${file} has no frontmatter`)
  const blockLines = match[1].split(/\r?\n/)
  const linePattern = new RegExp(`^${field}:`)
  let replaced = false
  const next = blockLines.map((line) => {
    if (linePattern.test(line)) {
      replaced = true
      return `${field}: ${value}`
    }
    return line
  })
  if (!replaced) next.push(`${field}: ${value}`)
  const rewritten = `---\n${next.join('\n')}\n---${match[2]}`
  // Atomic write: tmp file + rename, so a watcher never reads a half-written
  // state. The tmp name is unpredictable and created with O_EXCL ('wx'), so a
  // planted symlink at a guessable name can never redirect the write.
  const tmp = `${file}.${Date.now().toString(36)}.${randomBytes(6).toString('hex')}.tmp`
  try {
    writeFileSync(tmp, rewritten, { encoding: 'utf8', flag: 'wx' })
    renameSync(tmp, file)
  } catch (error) {
    // Best-effort cleanup of a half-written tmp file; the original file is untouched.
    try {
      unlinkSync(tmp)
    } catch {
```

</details>

#### 缺口

- 写前差异/逐项失败收据和Host生效对照方案尚未实现或实验。
  **影响**：只能形成可证伪方向，不把预期减少误改和恢复劳动计当前收益。
  **进一步探讨**：用虚构故障集比较现有面板、编辑器备份与候选方案，再决定实现。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
