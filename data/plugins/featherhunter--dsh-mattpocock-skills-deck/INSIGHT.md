# Matt Skills Deck

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fb5eb97](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/tree/fb5eb97bc2ff869514f3edeffa1359f4a7abd332)

<!-- BEGIN META -->
[![GitHub ★ 251](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=251&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck)
<!-- END META -->

> **功能**：在 DSH 中分发工程 Skills，并提供任务板、后端票据读写、关系核对和开发流程入口。

> **亮点**：随包Skill provider与真实票据工具形成宿主控制面，代表建票链区分父容器校验、幂等复用、部分成功和写后关系证据；相对只生成工单文本有具体工程增量，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：通道失败不代表后端没有写，五分钟建票锚不覆盖所有改票与Git操作；票据状态也不是实际交付验收。本次仅核代表链，尚不足以采信完整多后端和效率主张，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 组件身份、Skills归属和加载边界是什么？](#detail-section-11)
  - [Q02 · 任务工具怎样接入当前会话并实际写后端？](#detail-section-12)
  - [Q03 · 任务面板状态、成本与采用条件是什么？](#detail-section-13)
  - [Q04 · 能否形成新的可证伪假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Issue开发流程的DSH用户可集中使用工程Skills、任务层级和后端票据；合格交付须另核代码/测试，不以工单数量判断效率，见 [Q01](#research-q01)。

参照直接安装上游mattpocock Skills、人工Issue和原生开发流程。Skill方法归上游，本项目增量是分发、任务界面和写后证据组织；10倍效率属于未经本轮验证的作者主张。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 随包Skills | 向DSH提供工程方法入口 | 方法主要继承上游，注册期望不等于全量实跑 |
| 任务工具 | 从当前会话上下文访问票据后端 | 身份、仓库、权限与授权须明确 |
| GitHub建票 | 校父容器、幂等查询后创建 | 五分钟自动锚范围有限，超时结果不明需查 |
| 关系核对 | 读回结构判断父子边 | 回包自述不足，未读回保持未确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH profile与发布包 | 启动必需 | Host/Client/tools组合 | 装错profile无效，README示例版本不能当当前 |
| skills、subprocess、timer等服务 | 对应功能必需 | Skill provider和工具执行 | 入口有等待/降级，需核查实际注册 |
| Git/gh与账号仓库权限 | GitHub写入必需 | REST读写票据及Git流程 | 查询未知保留未知，只读不应写 |
| 明确仓库与本次写授权 | 写操作必需 | 限定实际目标与副作用 | 持有push/triage不是用户授权 |
| GitLab/Markdown条件 | 对应后端必需 | 替代票据存储 | 本轮未完整验收，不承诺一致 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定profile、版本、仓库和后端 | provider/工具已实际出现 |
| 只读核对 | 用户检查权限、父票和任务范围 | 未知不填可写，目标不明先停 |
| 写入 | Agent在明确授权下调用具体工具 | 核对票号、标签及结构回读 |
| 不明恢复 | 用户查实际对象和幂等锚 | 超时不直接重建，不跨通道盲重放 |
| 交付 | 人独立核代码、测试和业务结果 | 不以票据关闭或面板活动代替 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/后端资源金额未知 | profile、Skills、CLI、仓库绑定耗时未知 | 依赖面较宽 |
| 持续使用 | API配额、模型及缓存资源未知 | 管票、规则、权限与版本维护 | 效率收益未量化 |
| 失败恢复 | 重试与副作用处理成本未知 | 查票、关系、部分成功及通道状态 | 五分钟锚不等于全流程事务 |
| 退出 | 既有票据和本地数据保留未知 | 停写并回手工流程 | 外部票据不会自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| Skill分发 | 随包provider和元数据核对 | 逐技能宿主可用性与上游归因全量 |
| 票据写回 | 代表GitHub链校验与回读 | 全后端一致、通道不明恢复 |
| 开发效率 | 控制面组织机制 | 合格交付、节时、节费或10倍提升 |

> **思考**：通道失败不代表后端没有写，五分钟建票锚不覆盖所有改票与Git操作；票据状态也不是实际交付验收。本次仅核代表链，尚不足以采信完整多后端和效率主张，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：随包Skill provider与真实票据工具形成宿主控制面，代表建票链区分父容器校验、幂等复用、部分成功和写后关系证据；相对只生成工单文本有具体工程增量，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

[Q02](#research-q02) 父票先核、锚查询拿不准不创建和写后关系证据值得借鉴；[Q03](#research-q03) 权限未知保留null也比猜测更可靠。移植需解决宿主多通道、后端身份与副作用恢复，不能只拷贝状态话术。

<a id="detail-section-5"></a>

### 1.4 主要限制

通道失败不代表后端没有写，五分钟建票锚不覆盖所有改票与Git操作；票据状态也不是实际交付验收。本次仅核代表链，尚不足以采信完整多后端和效率主张，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先只读观察任务与环境，待测试仓库验证目标、权限、超时、部分写入及回读后再考虑写流程。当前重要仓库继续用原生Skills和手工Issue，任何结果不明先查实际对象，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认Skills提供者、工具注册及代表GitHub建票/回读链。建议先观察及只读核对，未运行宿主、后端写入或收益实验；统一操作ID与业务验收是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package/bundled-skills/tdd/SKILL.md、package/cordis.patch.yml、package/package.json、src/deck/registration/agent-row.ts、src/deck/tools/issue-create.ts、src/host/bootstrap.ts、src/host/index.ts、src/shared/tracker/backendWritePermissions.ts、src/tracker/rooms/github/issues-write.ts、src/tracker/rooms/github/repo-permissions.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计完整根工程，人工抽读发布包/bundle、Host/工具行、Skill provider与tdd样例、代表GitHub创建/权限/关系回读；未完整审计GitLab、Markdown、全部Git写链、刷新系统和UI。
- 下一步：在可丢弃仓库用同一需求比较上游Skills加手工Issue与插件，记录代码/测试/业务合格、返工、写入次数、API/模型费用和人工恢复；注入写后丢响应、关系失败和权限未知。本轮未执行目标或写外部。

**分析版本**

- **仓库**：[FeatherHunter/dsh-mattpocock-skills-deck](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck)
- **版本号**：1.9.0-beta.31（[固定提交 fb5eb97](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/tree/fb5eb97bc2ff869514f3edeffa1359f4a7abd332)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索跨通道共享操作ID、可查询未知结果，并将票据写回确认与业务交付验收分开。此方案未实现，故障注入若不减少重复/误报或人工负担更高则停止，见 [Q04](#research-q04)。

在可丢弃仓库用同一需求比较上游Skills加手工Issue与插件，记录代码/测试/业务合格、返工、写入次数、API/模型费用和人工恢复；注入写后丢响应、关系失败和权限未知。本轮未执行目标或写外部。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 638 | 127339 | 82741 | 39539 | — |
| .md | source | 539 | 86480 | — | — | 2181132 |
| .mts | source | 45 | 13803 | 9397 | 3808 | — |
| .js | source | 5 | 11598 | 11432 | 124 | — |
| .ts | example | 12 | 1432 | 1146 | 209 | — |
| .md | example | 10 | 284 | — | — | 2565 |
| .ts | test | 488 | 138393 | 105575 | 25345 | — |
| .js | example | 3 | 21 | 10 | 11 | — |
| .md | test | 4 | 375 | — | — | 4369 |
| .mts | test | 1 | 174 | 114 | 45 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 800](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=800&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 809](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=809&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：既有Skills与任务板如何接入真实后端，其写操作、完成状态和效率主张有什么可核查边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 组件身份、Skills归属和加载边界是什么？

**研究主题**：场景与需求、依赖、兼容与流程、贡献与相对优势

#### 完整回答

这是把工程Skills、任务板和后端工具接入DSH的原生插件工程，根包为开发工作区，实际发布包位于package。bundle插入Host主行和tools行，发布包声明Client与>=0.2.0-rc.2宿主；根版本与发布包为1.9.0-beta.31，但README安装示例仍写beta.22，用户不能把示例“最新版”当固定版本事实。

作者明确以mattpocock/skills为来源，bootstrap通过registerProvider读取随包SKILL.md并检查目录名/元数据，把它们作为bundled来源交宿主；例如tdd文档定义行为测试方法。贡献应归于技能分发、中文适配与任务板组织，不能把上游教学方法算本项目原创。源里注册日志写“27 expected”只是期望，不是本轮逐技能加载验收。目标人群是已有Issue开发流程、反复把目标拆成探索/规格/实施票的DSH用户，合格结果是代码和可核验任务闭环，而不是多出工单或计时。发布包描述声称10倍效率，没有同条件证据，本次不采信为效果事实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-8](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/README.md#L7-L8)

作者承认上游技能来源。

```text
**拨开战争迷雾看见终点，剩下的交给 MattSkillsDeck。**  
让 [mattpocock/skills](https://github.com/mattpocock/skills) 在 DSH 里化作游戏系统的任务面板。
```

**依据 2 · 作者声明**：[README.md:27-38](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/README.md#L27-L38)

安装示例和后端权限条件。

<details>
<summary>查看原文（12行）</summary>

````text
# ② 安装 MattSkillsDeck —— --profile 必填：装进你实际使用的 DSH 入口对应的 profile
#    （装错 profile 等于没装，重启多少次都不会加载）
dsh plugin --profile web add dsh-mattpocock-skills-deck     # 用自启 web 服务（dsh web）
#     或者
dsh plugin --profile desktop add dsh-mattpocock-skills-deck   # 用 DSH Desktop 桌面应用
# 锁定最新版更稳（当前 1.9.0-beta.22）：
dsh plugin --profile web add dsh-mattpocock-skills-deck@1.9.0-beta.22 --registry https://registry.npmjs.org
#     或者
dsh plugin --profile desktop add dsh-mattpocock-skills-deck@1.9.0-beta.22 --registry https://registry.npmjs.org
```

> **用 GitHub 后端前的权限前提**：插件替你改 ISSUE，用的是本机 `gh` 已登录账号的权限——建标签、改票需要仓库的 `push` 权限；改指派、流转标签需要 `triage` 权限。账号在该仓库只有 `只读` 权限时，插件会把仓库如实标成只读：改票、打标签与标签流转不可用，浏览与刷新照常。
````

</details>

**依据 3 · 源码核查**：[package/package.json:1-20](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/package/package.json#L1-L20)

实际发布包、版本、宿主和入口。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-mattpocock-skills-deck",
  "version": "1.9.0-beta.31",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/FeatherHunter/dsh-mattpocock-skills-deck.git"
  },
  "description": "🌹安装即自带mattpocock/skills v1.3.1的27个工程与效率技能，无需手动装技能。520亿token打造本插件，在原始技能之上提供10倍的开发效率，也能帮助新手更快上手该技能套件。支持 GitHub 与 GitLab 的 issue；本地 Markdown 为预览版。感谢您的使用和支持💗",
  "engines": {
    "dsh": ">=0.2.0-rc.2"
  },
  "type": "module",
  "main": "lib/index.js",
  "scripts": {
    "prepublishOnly": "node ../scripts/build.mts --pkg-only"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./tools": "./deck/registration/agent-row.js",
```

</details>

**依据 4 · 源码核查**：[package/cordis.patch.yml:8-14](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/package/cordis.patch.yml#L8-L14)

主行和tools行的加载。

```text
- insert:
    - id: dsh-mattpocock-skills-deck
      name: 'dsh-mattpocock-skills-deck'
      config: {}
    - id: dsh-mattpocock-skills-deck-tools
      name: 'dsh-mattpocock-skills-deck/tools'
      config: {}
```

**依据 5 · 源码核查**：[src/host/bootstrap.ts:146-181](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/host/bootstrap.ts#L146-L181)

实际技能provider读取及校验。

<details>
<summary>查看原文（36行）</summary>

```text
          const PROVIDER_NAME: string = 'bundled-mattpocock'
          const createBundledProvider = (control: unknown): any => {
            return {
              name: PROVIDER_NAME,
              async list(opts: any): Promise<any[]> {
                try {
                  // @ts-expect-error —— 见上，node:fs/promises 同理。
                  const fsp: any = await import('node:fs/promises')
                  // @ts-expect-error —— 见上，node:path 同理。
                  const pathMod2: any = await import('node:path')
                  if (opts && opts.signal && opts.signal.aborted) throw opts.signal.reason
                  let entries: any[] = []
                  try { entries = await fsp.readdir(bundledDir, { withFileTypes: true }) } catch { return [] }
                  const out: any[] = []
                  for (const ent of entries) {
                    if (!ent.isDirectory()) continue
                    const dirName: string = ent.name
                    if (!isValidSkillName(dirName)) continue
                    const mdPath: string = pathMod2.join((bundledDir as string), dirName, 'SKILL.md')
                    try {
                      const raw: string = await fsp.readFile(mdPath, 'utf8')
                      const parsed: any = parseSkillRaw(raw)
                      if (!parsed) continue
                      if (parsed.name !== dirName) continue
                      out.push({
                        name: parsed.name,
                        description: parsed.description,
                        ...(parsed.whenToUse ? { whenToUse: parsed.whenToUse } : {}),
                        invocation: parsed.invocation,
                        source: 'bundled',
                        provider: PROVIDER_NAME,
                        rank: BUNDLED_RANK,
                        locator: { path: mdPath, directory: pathMod2.join((bundledDir as string), dirName) },
                        resourceBase: { kind: 'directory', path: pathMod2.join((bundledDir as string), dirName) },
                        path: mdPath
                      })
```

</details>

**依据 6 · 源码核查**：[src/host/bootstrap.ts:225-232](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/host/bootstrap.ts#L225-L232)

registerProvider和expected日志。

```text
          let dispose: any = null
          try {
            dispose = skills.registerProvider(createBundledProvider)
            try { ctx.effect(() => () => { try { dispose && dispose() } catch {} }) } catch {}
            try { ctx.get('logger')?.info?.('[bundled] provider registered at ' + bundledDir + ' rank ' + BUNDLED_RANK) } catch {}
            console.log('[bundled] provider registered at ' + bundledDir + ' rank ' + BUNDLED_RANK + ' (27 skills expected)')
          } catch (e: unknown) {
            try { console.warn('[bundled] registerProvider failed ' + String((e as any) && (e as any).message || e)) } catch {}
```

**依据 7 · 作者声明**：[package/bundled-skills/tdd/SKILL.md:1-22](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/package/bundled-skills/tdd/SKILL.md#L1-L22)

固定随包方法示例，作为研究材料非本轮操作指令。

<details>
<summary>查看原文（22行）</summary>

```text
---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.
```

</details>

#### 缺口

- 没有逐技能加载、上游逐文件归因和效率对照。
  **影响**：不能承诺全部Skills运行可用或效率提升。
  **进一步探讨**：在固定宿主核对实际provider清单、版本及代表技能，再比较同任务交付与人工成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 任务工具怎样接入当前会话并实际写后端？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

工具不是只生成提示词。agent-row注册任务上下文、读票、建票、改票等定义，SessionHint从exec的Agent/session读取cwd与sessionId，不由模型参数指定；调用可先尝试进程内宿主格，再Connection RPC，最后fetch。Host需要connection、llm、sessionQuery，并等待subprocess/timer等执行依赖。建票工具先校验kind/父容器，父票读不到则拒绝，有类型时校类型，缺类型时仅确认存在并保留降级说明；然后调tracker.create。GitHub后端实际用gh api POST创建Issue，再处理标签和关系，使用当前gh登录账号，不是新隔离身份。

代码对不明结果有可借鉴处理：建票含幂等锚，后端先按锚查询、拿不准不创建；自动锚仅覆盖同会话同标题同标签的五分钟窗口。超时返回“是否建上说不清，先查再续”；父子关系需写后get结构字段证实，不以创建回包自述为准。另一方面agent-row对进程内格超时/异常可继续尝试其他通道，取消能否真正停止已经发出的后端写请求未独立核验；应防止把通道失败误当无副作用再执行，幂等创建也不能泛化覆盖所有改票/Git命令。

#### 证据与依据

**依据 1 · 源码核查**：[src/deck/registration/agent-row.ts:200-235](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/registration/agent-row.ts#L200-L235)

从执行上下文取会话线索。

<details>
<summary>查看原文（36行）</summary>

```text
  try {
    const e = (exec || {}) as UnknownRecord;
    const agent = (e.agent || {}) as UnknownRecord;
    const session = (agent.session || e.session || null) as UnknownRecord | null;
    const cands: unknown[] = []
    try {
      if (session && typeof session === 'object') {
        cands.push(session.cwd)
        cands.push(session.workspaceRoot)
        if (session.workspace && typeof session.workspace === 'object') cands.push((session.workspace as UnknownRecord).cwd)
        const header = session.header as UnknownRecord | null | undefined;
        if (header && typeof header === 'object') { cands.push(header.cwd); cands.push(header.workspaceRoot) }
      }
      cands.push(agent.cwd)
      if (e.session && typeof e.session === 'object') cands.push((e.session as UnknownRecord).cwd)
      cands.push(e.cwd)
    } catch (ePick) {}
    let cwd = ''
    for (let i = 0; i < cands.length; i++) {
      if (typeof cands[i] === 'string' && (cands[i] as string).trim()) { cwd = (cands[i] as string).trim(); break }
    }
    if (!cwd) return null
    let id = ''
    try {
      if (session && typeof session === 'object') {
        if (typeof session.id === 'string' && session.id) id = session.id
        else if (typeof session.sessionId === 'string' && session.sessionId) id = session.sessionId
        else if (session.header && typeof session.header === 'object') {
          const header = session.header as UnknownRecord;
          if (typeof header.id === 'string' && header.id) id = header.id
          else if (typeof header.sessionId === 'string' && header.sessionId) id = header.sessionId
        }
      }
      if (!id && typeof agent.sessionId === 'string') id = agent.sessionId
    } catch (eId) {}
    return { cwd: cwd, sessionId: id }
```

</details>

**依据 2 · 源码核查**：[src/deck/registration/agent-row.ts:352-391](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/registration/agent-row.ts#L352-L391)

超时/取消与多通道回退。

<details>
<summary>查看原文（40行）</summary>

```text
            try { const e = exec as { signal?: AbortLike } | null | undefined; return (e && e.signal) || null } catch (e2) { return null }
          })()
          const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null
          const execLike = { agent: { session: { cwd: hint.cwd, id: hint.sessionId } }, signal: (ctrl ? ctrl.signal : callerSig) as unknown }
          let timer: ReturnType<typeof setTimeout> | null = null
          let onCallerAbort: (() => void) | null = null
          const timeoutP = new Promise<never>(function (_, reject) {
            timer = setTimeout(function () {
              try { if (ctrl) ctrl.abort() } catch (eT) {}
              reject(new Error('cell-run-timeout'))
            }, cellCap)
          })
          try {
            if (ctrl && callerSig && typeof callerSig.addEventListener === 'function') {
              onCallerAbort = function (): void { try { ctrl.abort() } catch (eA) {} }
              callerSig.addEventListener('abort', onCallerAbort, { once: true })
            }
            try { if (ctrl && callerSig && callerSig.aborted) ctrl.abort() } catch (eB) {}
            let back: unknown = null
            try { back = await Promise.race([(run as (exec: unknown, args: unknown) => Promise<unknown>)(execLike, args), timeoutP]) } catch (eRun) { back = null }
            const backObj = back as { value?: unknown } | null;
            const value = (backObj && backObj.value !== undefined ? backObj.value : back) as HostValue | null;
            if (value && typeof value.status === 'string' && typeof value.text === 'string') { notePath('cell'); return value }
          } finally {
            try { if (timer !== null) clearTimeout(timer) } catch (eT2) {}
            try { if (callerSig && typeof callerSig.removeEventListener === 'function' && onCallerAbort) callerSig.removeEventListener('abort', onCallerAbort) } catch (eR) {}
          }
        }
      }
    } catch (eCell) {}
    try {
      const viaConn = await callViaConnection(ctx, payload)
      if (viaConn) { notePath('connection'); return viaConn }
    } catch (e2) {}
    try {
      const execObj = exec as { signal?: unknown } | null | undefined;
      const viaFetch = await callViaFetch(payload, execObj && execObj.signal)
      if (viaFetch) { notePath('fetch'); return viaFetch }
    } catch (e3) {}
    return fallthrough()
```

</details>

**依据 3 · 源码核查**：[src/deck/registration/agent-row.ts:395-405](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/registration/agent-row.ts#L395-L405)

工具实际注册。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx: unknown): void {
  const toolsSvc = (ctx as { tools?: { register?: (tool: UnknownRecord) => unknown } } | null)?.tools;
  if (!toolsSvc || typeof toolsSvc.register !== 'function') {
    throw new Error('[deckToolsRow] 工具服务不在，行起不来（注入声明了 tools，框架本应保证就绪）。')
  }
  for (const d of NINE) {
    const raw = toRawRegistration(d, ctx)
    if (!raw) continue
    try {
      toolsSvc.register(raw)
    } catch (e) { continue }
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:14-28](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/host/index.ts#L14-L28)

Host依赖与启动门。

<details>
<summary>查看原文（15行）</summary>

```text
export default {
  name: 'dsh-mattpocock-skills-deck',
  // 声明 connection + llm + sessionQuery：webServer 仍不加（#596）；llm 给首轮摘要调模型用，
  // sessionQuery 给读首轮两段用（读而不激活），缺任何一个对应功能静默降级（#746）。
  inject: ['connection', 'llm', 'sessionQuery'],
  // 宿主插件主入口：为什么留在单文件装配——集中注册 61 条宿主电话与启动门，所有具体实现按需动态引入；
  // 什么约定不能改——subprocess/timer 未就绪时必须挂起等待而非直接放弃，且本文件总行数受门禁上限 400 行与电话精确计数 61 条约束；
  // 反例——若在 subprocess 未就绪时直接 return 退出而不挂 ctx.inject，慢启动机器上 deck 工具将永远无法注册且无日志可查。
  apply(ctx: HostCtx) {
    // 启动门（2026-09-26）：subprocess/timer 晚到时不再静默跳过——旧代码直接 return， wiring 与工具注册 hook 从没跑起来，deck 工具永不注册还查无对证。 先试一次；不齐就挂到框架依赖门上等人齐（官方 ctx.inject 写法，见 dsh-tool-pwsh）； 30 秒还没齐落一条 warn。 为何只能留在入口，见账本 §1。
    const bootBody = () => {
    const subprocess = ctx.get('subprocess')
    const timer = ctx.get('timer')
    const fs = ctx.get('fs')
    if (subprocess === undefined || timer === undefined) return false
```

</details>

**依据 5 · 源码核查**：[src/deck/tools/issue-create.ts:203-244](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/tools/issue-create.ts#L203-L244)

父票校验到后端create。

<details>
<summary>查看原文（42行）</summary>

```text
      if (rel) {
        parentCheck = { requests: 1, points: 2 }
        const refuse = (text: string, claimed: { requests: number, points: number }) => ({
          value: { status: DECK_STATUS.UNSUPPORTED, reason: REFUSAL_REASONS.BAD_ARGS, text: text, data: { error: { kind: 'parent', message: text.slice(0, 300) } }, notes: notes },
          claimed: claimed,
        })
        if (sc.outOfBudget()) return refuse('额度不够，没读父票：这张票没建。先核对父票号，再续。', { requests: 0, points: 0 })
        const parentRead = await t.get(repo, rel, {}, opCtx)
        const parentTimeout = timeoutMessage(parentRead as TransportResult)
        if (parentTimeout) return refuse('父票 ' + rel + ' 没读回来（超时：' + String(parentTimeout).slice(0, 160) + '）：这张票没建。先按票号核对父票，再续。', parentCheck)
        if (!parentRead || parentRead.ok !== true) {
          const why = String((parentRead && parentRead.error && parentRead.error.message) || '后端没给出原因').slice(0, 200)
          return refuse('父票 ' + rel + ' 读不到（后端原话：' + why + '）：这张票没建。父票必须已经存在。', parentCheck)
        }
        const parentData = (parentRead.data || {}) as Record<string, unknown>
        const declaredType = (typeof parentData.type === 'string') ? String(parentData.type) : ''
        const parentBody = (typeof parentData.body === 'string') ? parentData.body : ''
        const declaredMarker = markerKindInHeader(parentBody)
        // 契约类型优先；后端没回类型字段时退回票面标记（T1 的读侧判据），两个都没有才算「读不到类型」。
        const parentKind = declaredType || (declaredMarker === 'map' ? 'map' : declaredMarker === 'spec' ? 'spec' : (declaredMarker ? 'issue' : ''))
        if (!parentKind) {
          notes.push('父票类型读不到，只核了存在性：父票 ' + rel + ' 已经在了，但它是不是该有的容器没法确认。')
        } else if (parentRule === 'map') {
          if (parentKind !== 'map') return refuse('父票 ' + rel + ' 不是探索地图（读到的是 ' + parentKind + '）：地图工单的父必须是探索地图。这张票没建。', parentCheck)
        } else if (parentRule === 'spec') {
          if (parentKind !== 'spec') return refuse('父票 ' + rel + ' 不是规格（读到的是 ' + parentKind + '）：实施票的父必须是规格。这张票没建。', parentCheck)
        } else if (parentKind !== 'map' && parentKind !== 'spec') {
          return refuse('父票 ' + rel + ' 不是探索地图或规格（读到的是 ' + parentKind + '）：普通票的父只能是这两种容器。这张票没建。', parentCheck)
        } else {
          notes.push('父票 ' + rel + ' 已核对：它是' + (parentKind === 'map' ? '探索地图' : '规格') + '。')
        }
      }
      // 建票入参是本文件自己拼的，两个可选字段（parentKey / assignees）下面按条件补：
      // 先声明成一张表，补字段时编译器才不拦（运行时拼出来的形状一字不变）。
      // 调后端传的是契约三值（位置表算好的 contractType），不是位置值本身。
      // typeLine 是本地 markdown 文件头 Type 行该写什么：地图工单写 label 去前缀的那一个，其余位置明确给空串；
      // 远端后端不读它，契约类型仍由 type 走。给空串是为了让「issue 兜底也带了 wayfinder 标签」不会漏成 Type 行。
      const typeLine = kind === 'map-ticket' ? String(argued.label || '').replace(/^wayfinder:/, '') : ''
      const input: Record<string, unknown> = { title: title, body: body.body, type: contractType, typeLine: typeLine, labels: ensured.labels, idempotencyKey: anchor }
      if (rel) input.parentKey = rel
      if (Array.isArray(a.assignees) && a.assignees.length) input.assignees = a.assignees
      const created = await t.create(repo, input, opCtx)
```

</details>

**依据 6 · 源码核查**：[src/deck/tools/issue-create.ts:247-259](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/tools/issue-create.ts#L247-L259)

自动幂等窗口和超时不明。

<details>
<summary>查看原文（13行）</summary>

```text
      if (!a.idempotencyKey) notes.push('这次用的是自动幂等锚（同会话 + 同标题 + 同标签，5 分钟窗口内重复调用复用同一张票）。')
      // 执行层失败原样抛给壳（走 backend-threw，可重试）；后端诚实失败才走下面的部分成功。
      // 只有超时单列：直接回独立原因码 backend-timeout（是否生效说不清，重试前先核对）。
      const createdTimeout = timeoutMessage(created as TransportResult)
      if (createdTimeout) return {
        value: { status: DECK_STATUS.UNSUPPORTED, reason: REFUSAL_REASONS.BACKEND_TIMEOUT, text: '这张票这次没建成（超时了：在限时内没等到后端回话，票建上没有说不清；先按标题查一次再续，不要直接重建）。', data: { error: { kind: 'timeout', message: createdTimeout.slice(0, 300) } }, notes: notes },
        claimed: { requests: 1, points: 4 },
      }
      const createdTransport = transportMessage(created as TransportResult)
      if (createdTransport) throw new Error(createdTransport)
      // #1171：后端诚实失败的整支收在同目录 issue-create-failure.ts，只为把本文件压回 350 有效行以内。
      // explicitKey 只传「有没有自带键」这一位布尔：回执话术只需要知道该说「同一个幂等键」还是「同一个 5 分钟窗口」。
      if (!created || created.ok !== true) return backendCreateFailure(created as TransportResult, !!a.idempotencyKey, notes)
```

</details>

**依据 7 · 源码核查**：[src/deck/tools/issue-create.ts:297-321](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/tools/issue-create.ts#L297-L321)

关系写后回读。

<details>
<summary>查看原文（25行）</summary>

```text
      // 父子边的判决（landed / not-landed / unconfirmed）要留到下面的回执抬头用，所以在块外先立一格。
      let parentVerdict = 'unconfirmed'
      if (rel) {
        // 父子边：写入已在 create 里做过（contract 的 parentKey 输入），这里只判它落上了没有。
        // #790 的教训：判据只有一条 —— 写后读回的结构字段里能看到这条父子（纯侧的 edgeVerdict）。
        //   建票回包里的 parentKey 是「这次写动作自称写了什么」，正文里出现票号是「作者写了这行字」，
        //   两者都不是「盘上有这条边」的证据；它们与读回不一致时按没挂上算，并把不一致写进证据里。
        const readBack = (typeof t.get === 'function' && !sc.outOfBudget()) ? await t.get(repo, issue.key, {}, opCtx) : null
        const after = (readBack && readBack.ok === true) ? { issue: readBack.data } : null
        let ev: EdgeEvidence = after ? classifyEdgeLanding('parent', rel, after) : unsupportedEvidence('写后没读回来，判不了这条父子落点')
        const verdict = edgeVerdict('parent', rel, after)
        parentVerdict = verdict
        parentLanded = verdict === 'landed'
        const landedKey = (after && after.issue && after.issue.parentKey !== undefined && after.issue.parentKey !== null) ? String(after.issue.parentKey) : ''
        const createdKey = (issue && issue.parentKey !== undefined && issue.parentKey !== null) ? String(issue.parentKey) : ''
        const createdError = (issue && issue.parentError && issue.parentError.message) ? String(issue.parentError.message).slice(0, 200) : ''
        if (!parentLanded) {
          const echo = (createdKey === String(rel))
            ? '；建票回包里写着父票 ' + createdKey + '，但写后读回里没有这条父子 —— 回包是写动作的自述，不算落上'
            : ''
          const roomWords = createdError ? '；房自己记下的原话：' + createdError : ''
          const base = (verdict === 'unconfirmed')
            ? '写后没读回来，判不了这条父子落上了没有'
            : ('写后读回：票的 parentKey 读到的是 ' + (landedKey || '空') + '，要的是 ' + rel)
          ev = { kind: verdict === 'unconfirmed' ? 'unknown' : 'missing', ok: false, text: base + echo + roomWords + '。' + String(ev.text || '') }
```

</details>

**依据 8 · 源码核查**：[src/tracker/rooms/github/issues-write.ts:72-98](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/tracker/rooms/github/issues-write.ts#L72-L98)

按幂等锚查找后真实REST写入。

<details>
<summary>查看原文（27行）</summary>

```text
async function createIssueInner(repo: RepositoryRef, input: CreateInput, ctx: MemoContext, trail: WriteTrail): Promise<OpResult<Issue>> {
  try {
    const parsed = parseRepo(repo)
    if (!parsed) return fail(ERROR_KIND.NOTFOUND, `create: repo.refId missing: ${repoId(repo)}`, repo)
    if (!input || typeof input.title !== 'string' || !input.title.trim()) return fail(ERROR_KIND.PARSE, 'create: title required', input)
    // 幂等键当场检查：不合规（空、超长、带换行或注释收尾符）绝不落到正文上，
    // 而且必须比「回查」更早失败 —— 键不合法时连回查都无从做起。
    const wantKey = input.idempotencyKey === undefined || input.idempotencyKey === null ? null : checkIdempotencyKey(input.idempotencyKey)
    // 键本身不合规时，原文就交那个不合规的键值（为什么不合规已经写在给人看的那句话里）。
    if (wantKey && !wantKey.ok) return fail(ERROR_KIND.PARSE, `create: idempotencyKey 不能用：${wantKey.reason}`, input.idempotencyKey)
    const idemKey = wantKey ? wantKey.key : ''
    if (idemKey) {
      const found = await lookupByAnchor(repo, idemKey, ctx, normalizeIssue)
      if (!found.ok) return { ok: false, error: found.error }
      // 幂等命中：这一趟一张票都没建，把已有一张交回去 —— 结论线由出口按「一条写命令都没发」算成「复用」。
      if (found.hit) return { ok: true, data: found.issue }
    }
    const c = ghClient(ctx)
    const body = withAnchor(typeof input.body === 'string' ? input.body : '', idemKey)
    // 主路用 REST 建票：gh api 不支持经 stdin 传整包（执行层没有 stdin 口），改用 -f 逐字段传；
    // gh issue create 不认 --json，所以不走它。标签与认领建后另补（已有现成函数）。
    const createArgs = ['api', `repos/${parsed.owner}/${parsed.name}/issues`, '--method', 'POST', '-f', `title=${input.title.trim()}`, '-f', `body=${body}`, '--jq', '.']
    // 到这一步才真会发出写命令：route 记下走的是 gh api（REST），written 记下真发出去一条 ——
    // 发出去了就算一条，成没成由结论线的 ok 那一格说。
    trail.route = 'rest'
    trail.written += 1
    const r = await c.execGh(createArgs, { cwd: ctx && ctx.cwd })
```

</details>

#### 缺口

- 多通道超时后后端是否已写及各操作去重未运行验证。
  **影响**：不能承诺所有重试无重复副作用。
  **进一步探讨**：对测试仓库分别制造请求已写但响应丢失，核对同锚创建、改票和关系是否重复或部分完成。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 任务面板状态、成本与采用条件是什么？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

当前建议观察，优先只读任务浏览和环境核对，不直接交给重要仓库写流程。优势是把技能入口、票据层级和写后证据放在同一控制面；但主张跨度包括GitHub/GitLab/Markdown、任务关联和Git操作，本次只深入代表性GitHub建票链，不应由一个成功回执概括全流程已经验收。面板上的在办、关闭或报告反映票据状态，不证明实现、测试、用户交付或效率改善。

权限读侧查询gh repos permissions并区分push/triage，字段缺失和网络失败保留null，不猜成无权或可写；本地Markdown被标为无远端权限模型，文件可写性另管。持有gh写权限只代表服务器允许，不代表本次用户已授权建票/推送；实际应用要审核工具目标和副作用。首次需匹配profile、宿主、Skills/provider、Git/gh/glab和仓库绑定；持续有票据、缓存、权限、API配额、规则及升级维护。失败后需核对实际票号、标签、父子边和不明写入，人工时间与模型/网络费用未知。无法可靠对齐仓库、权限或写后状态时，停止自动写并退回原生Skills加手动Issue。

#### 证据与依据

**依据 1 · 源码核查**：[src/tracker/rooms/github/repo-permissions.ts:39-49](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/tracker/rooms/github/repo-permissions.ts#L39-L49)

permissions真值解析。

<details>
<summary>查看原文（11行）</summary>

```text
function pickPermissions(raw: unknown): RepoPermissions | null {
  if (!raw || typeof raw !== 'object') return null
  // 为什么转成键值袋再读：回包是 gh 吐的原始形状，本函数只认 permissions 下 push/triage 两格是否为布尔值。
  const bag = raw as Record<string, unknown>;
  const p = (bag.permissions && typeof bag.permissions === 'object' ? bag.permissions : null) as Record<string, unknown> | null;
  if (!p || typeof p !== 'object') {
    // --jq .permissions 在仓库不存在时 gh 直接报错走失败分支；能到这里却没字段，视为问不出来
    return null
  }
  if (typeof p.push !== 'boolean' || typeof p.triage !== 'boolean') return null
  return { push: p.push, triage: p.triage }
```

</details>

**依据 2 · 源码核查**：[src/tracker/rooms/github/repo-permissions.ts:87-110](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/tracker/rooms/github/repo-permissions.ts#L87-L110)

权限未知和降级。

<details>
<summary>查看原文（24行）</summary>

```text
async function queryPermissions(c: GhClient, spec: string, ctx: OpContext): Promise<RepoPermissions | null> {
  const cwd = ctx && typeof ctx.cwd === 'string' ? ctx.cwd : undefined
  // 这一笔的起点：下面每一行降级日志带的是「从本函数入口到这里花掉的毫秒数」。
  const t0 = Date.now()
  const r = await c.execGh(['api', 'repos/' + spec, '--jq', '.permissions'], { cwd: cwd, via: 'permissions.api' })
  if (!r || !r.ok) {
    // 命令没跑成这一路，gh.exec 那行已经写了退出码；这里再补一行，好让「权限问不出来」整条链在日志里是一条线。
    emitReadDegraded(ctx, 'permissions', 'permissions:api', Date.now() - t0)
    return null
  }
  // text 兜底保留（理由同 backend.ts：上游仍有 text 这一格，stdout 为空时老代码走它）。
  const text = String((r.data && (r.data.stdout || (r.data as { text?: unknown }).text)) || '').trim()
  if (!text || text === 'null') {
    emitReadDegraded(ctx, 'permissions', 'permissions:empty', Date.now() - t0)
    return null
  }
  try {
    const picked = pickPermissions({ permissions: JSON.parse(text) })
    // 回包能解析、命令也成功，可 push/triage 两格不在里面：这一条原先一个字都不留，最容易被当成「没权限」。
    if (!picked) emitReadDegraded(ctx, 'permissions', 'permissions:no-fields', Date.now() - t0)
    return picked
  } catch {
    emitReadDegraded(ctx, 'permissions', 'permissions:unknown', Date.now() - t0)
    return null
```

</details>

**依据 3 · 源码核查**：[src/shared/tracker/backendWritePermissions.ts:18-32](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/shared/tracker/backendWritePermissions.ts#L18-L32)

本地文件权限区别。

<details>
<summary>查看原文（15行）</summary>

```text
/** 票就存在本地文件里的后端 id：这类后端没有远端权限模型。 */
const LOCAL_FILE_BACKEND_IDS: ReadonlySet<string> = new Set(['markdown'])

// 不用问远端就能确定的写权限：只有票文本直接落在本地文件的后端才能在这里下定论。
// 约定：有远端权限模型的后端一律返回 null 交给调用方去问真值；反例是把 GitHub 也写成恒可写，面板会把只读仓库说成可写。
type KnownWritePermissions = { push: boolean, triage: boolean } | null

/**
 * 不用问远端就能确定的写权限。
 * @param {string} backendId 当前后端 id
 * @returns {{push: boolean, triage: boolean}|null} 不用问远端就是这一份；要问远端、或按未知处理时回 null
 */
export function knownWritePermissions(backendId: string | null | undefined): KnownWritePermissions {
  const id = (backendId === null || backendId === undefined) ? '' : String(backendId)
  return LOCAL_FILE_BACKEND_IDS.has(id) ? { push: true, triage: true } : null
```

</details>

**依据 4 · 源码核查**：[src/deck/tools/issue-create.ts:297-321](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/tools/issue-create.ts#L297-L321)

部分关系状态需回读。

<details>
<summary>查看原文（25行）</summary>

```text
      // 父子边的判决（landed / not-landed / unconfirmed）要留到下面的回执抬头用，所以在块外先立一格。
      let parentVerdict = 'unconfirmed'
      if (rel) {
        // 父子边：写入已在 create 里做过（contract 的 parentKey 输入），这里只判它落上了没有。
        // #790 的教训：判据只有一条 —— 写后读回的结构字段里能看到这条父子（纯侧的 edgeVerdict）。
        //   建票回包里的 parentKey 是「这次写动作自称写了什么」，正文里出现票号是「作者写了这行字」，
        //   两者都不是「盘上有这条边」的证据；它们与读回不一致时按没挂上算，并把不一致写进证据里。
        const readBack = (typeof t.get === 'function' && !sc.outOfBudget()) ? await t.get(repo, issue.key, {}, opCtx) : null
        const after = (readBack && readBack.ok === true) ? { issue: readBack.data } : null
        let ev: EdgeEvidence = after ? classifyEdgeLanding('parent', rel, after) : unsupportedEvidence('写后没读回来，判不了这条父子落点')
        const verdict = edgeVerdict('parent', rel, after)
        parentVerdict = verdict
        parentLanded = verdict === 'landed'
        const landedKey = (after && after.issue && after.issue.parentKey !== undefined && after.issue.parentKey !== null) ? String(after.issue.parentKey) : ''
        const createdKey = (issue && issue.parentKey !== undefined && issue.parentKey !== null) ? String(issue.parentKey) : ''
        const createdError = (issue && issue.parentError && issue.parentError.message) ? String(issue.parentError.message).slice(0, 200) : ''
        if (!parentLanded) {
          const echo = (createdKey === String(rel))
            ? '；建票回包里写着父票 ' + createdKey + '，但写后读回里没有这条父子 —— 回包是写动作的自述，不算落上'
            : ''
          const roomWords = createdError ? '；房自己记下的原话：' + createdError : ''
          const base = (verdict === 'unconfirmed')
            ? '写后没读回来，判不了这条父子落上了没有'
            : ('写后读回：票的 parentKey 读到的是 ' + (landedKey || '空') + '，要的是 ' + rel)
          ev = { kind: verdict === 'unconfirmed' ? 'unknown' : 'missing', ok: false, text: base + echo + roomWords + '。' + String(ev.text || '') }
```

</details>

**依据 5 · 作者声明**：[README.md:111-116](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/README.md#L111-L116)

多后端是作者声明，未全部验收。

```text
根据办公环境不同提供多样后端：GitHub、本地 Markdown、GitLab。

<table width="100%">
  <tr>
    <td valign="top" width="50%">👇 在不同后端中进行切换。<br><img src="assets/readme/中文-深色-右侧面板-切换后端.png" width="100%" alt="设置页后端选择器" style="border:1px solid #30363d;border-radius:6px"></td>
    <td valign="top" width="50%">👇 环境逐项自检。如果不准确点击刷新重新检测。<br><img src="assets/readme/中文-深色-右侧面板-环境检查-列表.png" width="100%" alt="环境检查列表" style="border:1px solid #30363d;border-radius:6px"></td>
```

**依据 6 · 作者声明**：[README.md:126-132](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/README.md#L126-L132)

Git写操作界面属于作者能力声明。

```text
提供简化的版本管理页面，方便查看。

<table width="100%">
  <tr>
    <td valign="top" width="33%">👇 改动：fetch、pull、push、add、commit<br><img src="assets/readme/中文-深色-右侧面板-版本管理-改动.png" width="100%" alt="版本管理改动" style="border:1px solid #30363d;border-radius:6px"></td>
    <td valign="top" width="33%">👇 提交历史<br><img src="assets/readme/中文-深色-右侧面板-版本管理-提交历史.png" width="100%" alt="版本管理提交历史" style="border:1px solid #30363d;border-radius:6px"></td>
    <td valign="top" width="33%">👇 工作树<br><img src="assets/readme/中文-深色-右侧面板-版本管理-worktree.png" width="100%" alt="版本管理工作树" style="border:1px solid #30363d;border-radius:6px"></td>
```

#### 缺口

- 全后端、Git写链、真实任务交付和采用成本没有同条件验证。
  **影响**：不宜承诺跨平台一致或提升效率。
  **进一步探讨**：先在可丢弃仓库记录一条需求到代码/测试/关闭的完整链，与原生Skills加手工Issue比较错误、返工和费用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否形成新的可证伪假设？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

由建票链已经区分写回包与写后结构回读，可以推导未验证方向：将每次写操作统一成可查询操作ID、目标版本和结果不明状态，在所有通道复用同一操作ID；界面把“票据写回已确认”和“实际交付已验收”分成两个状态。这样可能减轻通道回退与自动续跑下的重复写入，以及把关票误当完成的认知风险，而不必改变上游Skills教学内容。

新增代价是服务器幂等状态、结果查询和用户处理pending操作，不能靠加提示词完成。最小验证在测试仓库注入已写响应丢失、标签部分失败、父子边不明和重复调用，与当前五分钟建票锚对照，比较重复对象、误报成功、人工核对时间，再观察是否正确区分业务验收。若操作ID仍不能解决未知结果，或减少重复但运维/确认负担超过手工方案，应停止。当前代码已有的写后回读是一种可复用工程贡献；统一操作协议和独立业务验收是研究假设，不计为已实现能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/deck/tools/issue-create.ts:247-254](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/tools/issue-create.ts#L247-L254)

当前窗口与不明结果缺口。

```text
      if (!a.idempotencyKey) notes.push('这次用的是自动幂等锚（同会话 + 同标题 + 同标签，5 分钟窗口内重复调用复用同一张票）。')
      // 执行层失败原样抛给壳（走 backend-threw，可重试）；后端诚实失败才走下面的部分成功。
      // 只有超时单列：直接回独立原因码 backend-timeout（是否生效说不清，重试前先核对）。
      const createdTimeout = timeoutMessage(created as TransportResult)
      if (createdTimeout) return {
        value: { status: DECK_STATUS.UNSUPPORTED, reason: REFUSAL_REASONS.BACKEND_TIMEOUT, text: '这张票这次没建成（超时了：在限时内没等到后端回话，票建上没有说不清；先按标题查一次再续，不要直接重建）。', data: { error: { kind: 'timeout', message: createdTimeout.slice(0, 300) } }, notes: notes },
        claimed: { requests: 1, points: 4 },
      }
```

**依据 2 · 源码核查**：[src/deck/tools/issue-create.ts:297-321](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/tools/issue-create.ts#L297-L321)

写后结构验证可推广。

<details>
<summary>查看原文（25行）</summary>

```text
      // 父子边的判决（landed / not-landed / unconfirmed）要留到下面的回执抬头用，所以在块外先立一格。
      let parentVerdict = 'unconfirmed'
      if (rel) {
        // 父子边：写入已在 create 里做过（contract 的 parentKey 输入），这里只判它落上了没有。
        // #790 的教训：判据只有一条 —— 写后读回的结构字段里能看到这条父子（纯侧的 edgeVerdict）。
        //   建票回包里的 parentKey 是「这次写动作自称写了什么」，正文里出现票号是「作者写了这行字」，
        //   两者都不是「盘上有这条边」的证据；它们与读回不一致时按没挂上算，并把不一致写进证据里。
        const readBack = (typeof t.get === 'function' && !sc.outOfBudget()) ? await t.get(repo, issue.key, {}, opCtx) : null
        const after = (readBack && readBack.ok === true) ? { issue: readBack.data } : null
        let ev: EdgeEvidence = after ? classifyEdgeLanding('parent', rel, after) : unsupportedEvidence('写后没读回来，判不了这条父子落点')
        const verdict = edgeVerdict('parent', rel, after)
        parentVerdict = verdict
        parentLanded = verdict === 'landed'
        const landedKey = (after && after.issue && after.issue.parentKey !== undefined && after.issue.parentKey !== null) ? String(after.issue.parentKey) : ''
        const createdKey = (issue && issue.parentKey !== undefined && issue.parentKey !== null) ? String(issue.parentKey) : ''
        const createdError = (issue && issue.parentError && issue.parentError.message) ? String(issue.parentError.message).slice(0, 200) : ''
        if (!parentLanded) {
          const echo = (createdKey === String(rel))
            ? '；建票回包里写着父票 ' + createdKey + '，但写后读回里没有这条父子 —— 回包是写动作的自述，不算落上'
            : ''
          const roomWords = createdError ? '；房自己记下的原话：' + createdError : ''
          const base = (verdict === 'unconfirmed')
            ? '写后没读回来，判不了这条父子落上了没有'
            : ('写后读回：票的 parentKey 读到的是 ' + (landedKey || '空') + '，要的是 ' + rel)
          ev = { kind: verdict === 'unconfirmed' ? 'unknown' : 'missing', ok: false, text: base + echo + roomWords + '。' + String(ev.text || '') }
```

</details>

**依据 3 · 源码核查**：[src/deck/registration/agent-row.ts:371-391](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/fb5eb97bc2ff869514f3edeffa1359f4a7abd332/src/deck/registration/agent-row.ts#L371-L391)

多通道回退需要共享执行语义。

<details>
<summary>查看原文（21行）</summary>

```text
            try { back = await Promise.race([(run as (exec: unknown, args: unknown) => Promise<unknown>)(execLike, args), timeoutP]) } catch (eRun) { back = null }
            const backObj = back as { value?: unknown } | null;
            const value = (backObj && backObj.value !== undefined ? backObj.value : back) as HostValue | null;
            if (value && typeof value.status === 'string' && typeof value.text === 'string') { notePath('cell'); return value }
          } finally {
            try { if (timer !== null) clearTimeout(timer) } catch (eT2) {}
            try { if (callerSig && typeof callerSig.removeEventListener === 'function' && onCallerAbort) callerSig.removeEventListener('abort', onCallerAbort) } catch (eR) {}
          }
        }
      }
    } catch (eCell) {}
    try {
      const viaConn = await callViaConnection(ctx, payload)
      if (viaConn) { notePath('connection'); return viaConn }
    } catch (e2) {}
    try {
      const execObj = exec as { signal?: unknown } | null | undefined;
      const viaFetch = await callViaFetch(payload, execObj && execObj.signal)
      if (viaFetch) { notePath('fetch'); return viaFetch }
    } catch (e3) {}
    return fallthrough()
```

</details>

#### 缺口

- 统一操作ID和业务验收状态未实现，对用户价值未知。
  **影响**：不能声称解决重复写入或找到市场方向。
  **进一步探讨**：以隔离故障链测重复/误报/人工成本，先取得真实操作问题再开发。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
