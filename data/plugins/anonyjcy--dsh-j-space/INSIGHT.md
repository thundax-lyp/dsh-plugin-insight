# dsh-j-space

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d2bb1b8](https://github.com/AnonyJcy/dsh-j-space/tree/d2bb1b8fb708bc01a0bc5d883164d857e5fde653)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AnonyJcy/dsh-j-space) [![npm 30d 2,043](https://img.shields.io/static/v1?label=npm+30d&message=2%2C043&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anonyjcy/dsh-j-space)
<!-- END META -->

> **功能**：将 J-Space Cognition Suite 接入 DSH 原生 Agent Preset 并保留证据控制器

> **亮点**：原生preset声明、包内Skill定位和DSH执行authority覆盖让上游协议可进入现有宿主；复杂度不自动授权团队，证据参与者不冒充宿主身份。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：来源hash、轮次和独立review字段只能约束记录，不能证明结论正确；没有可信hook时依赖agent主动调用，不能称自动强制治理，也不能借上游成绩证明适配效果。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 真正注册什么，适配贡献在哪里？](#detail-section-11)
  - [Q02 · 控制器能保证什么，不能保证什么？](#detail-section-12)
  - [Q03 · 团队和权限属于谁，是否会自动扩展代理？](#detail-section-13)
  - [Q04 · 原版保真与升级带来什么成本？](#detail-section-14)
  - [Q05 · 谁值得试用，怎样检验改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：复杂多阶段工程任务中需要持久来源、问题、报告与验收记录的开发者。

DSH原生goal/todo与人工证据清单；上游J-Space协议是被适配对象，非本包原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生Agent Preset | 新会话加载J-Space与官方工具 | 模型/权限沿用DSH |
| 证据controller | 持久来源、问题和报告gate | 默认合作调用，无自动host hook |
| 原版完整性保全 | 校验与恢复固定上游文件 | 不证明模型认知或token收益 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 相容DSH/Cordis原生preset | 启动必需 | bundle加载 | 作者验rc.3/rc.4/alpha.2，不等于全部后续兼容 |
| Python3.10+ | controller/校验必需 | 持久gate与归档完整性 | 无解释器不能声称gate运行 |
| 模型与shell/fs权限 | 工程任务必需 | 证据阅读与执行 | 沿用DSH，不由controller授予 |
| 官方团队插件及用户显式授权 | 团队任务才需 | 真实成员/消息/生命周期 | 无授权solo，不造独立review |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在实际profile安装固定版本并重启 | 新会话菜单出现预设；旧CLI status不是注册证明 |
| 2 | 用户备份并处理旧工具覆盖 | 不沿用已删除subagent/Ralph列表 |
| 3 | Agent按复杂度调用原版controller | goal/source/read/checkpoint当前，真实solo或授权成员 |
| 4 | 独立核最终报告和来源 | 有变化重开，不能删义务使gate通过 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、包和Python资源未知 | 学习协议、备份配置 | 实际注册与旧文件副本分开 |
| 持续使用 | 全文重读、报告增加模型消耗未知 | checkpoint、二轮和独立验收 | 压缩归档不等于token节省 |
| 失败恢复 | 刷新与重做资源未知 | 来源变化重开问题、恢复记录 | hash不保证理解 |
| 升级/退出 | 迁移资源未知 | 处理旧覆盖，保留账本，切回原preset | 不用旧uninstall推断原生bundle退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH接入 | 原生preset与包内Skill路径 | 本轮真实安装/菜单加载 |
| 证据纪律 | hash、round2、独立review绑定和atomic写 | 模型遵循、实质正确与恢复可靠性 |
| 任务收益 | 明确来源刷新与验收流程 | 缺陷减少、token/人工净收益 |

> **思考**：来源hash、轮次和独立review字段只能约束记录，不能证明结论正确；没有可信hook时依赖agent主动调用，不能称自动强制治理，也不能借上游成绩证明适配效果。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：原生preset声明、包内Skill定位和DSH执行authority覆盖让上游协议可进入现有宿主；复杂度不自动授权团队，证据参与者不冒充宿主身份。[Q01](#research-q01) [Q03](#research-q03)

原生注册与legacy复制明确分离；上游固定来源、可移除authority覆盖、gate对来源和报告摘要绑定值得复用。迁移需真实身份、trusted hook与失败关闭，不能仅复制提示词就声称自动控制。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

来源hash、轮次和独立review字段只能约束记录，不能证明结论正确；没有可信hook时依赖agent主动调用，不能称自动强制治理，也不能借上游成绩证明适配效果。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

兼容环境的复杂任务先单agent受控试用，明确合作协议与宿主强制门禁区别；简单任务用原生记录，重读/复核负担不能换来质量时停止扩展。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生预设、包内Skill与gate结构为源码支持；安装验收是作者报告，本轮未运行。认知/质量收益未知；定向复核是假设，不改变原版协议。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、src/index.ts、src/installer.ts、preset/skills/j-space/SKILL.md、preset/skills/j-space/integration/dsh.md、preset/skills/j-space/scripts/control.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件36个tracked文件统计；读bundle/preset入口、DSH覆盖、旧installer和Python gate关键路径。未运行controller/测试/真实host或模型，不复现上游认知实验。
- 下一步：同模型/任务/预算对照原生goal/todo+人工清单，注入有关与无关来源改动，记录最终缺陷、漏复核、恢复分钟、总token和人工；任何伪独立参与者不计验收成功。

**分析版本**

- **仓库**：[AnonyJcy/dsh-j-space](https://github.com/AnonyJcy/dsh-j-space)
- **版本号**：1.2.5（[固定提交 d2bb1b8](https://github.com/AnonyJcy/dsh-j-space/tree/d2bb1b8fb708bc01a0bc5d883164d857e5fde653)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是来源依赖图提出定向复核建议，以原版全文刷新为保真对照；在有关/无关来源改动故障集上比较漏复核和全成本，漏检增加或成本不降即否定。[Q05](#research-q05)

同模型/任务/预算对照原生goal/todo+人工清单，注入有关与无关来源改动，记录最终缺陷、漏复核、恢复分钟、总token和人工；任何伪独立参与者不计验收成功。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 159 | 142 | 4 | — |
| .md | source | 27 | 5273 | — | — | 46540 |
| .ts | source | 3 | 303 | 192 | 83 | — |
| .mjs | test | 2 | 259 | 228 | 26 | — |
| .ts | test | 3 | 272 | 231 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AnonyJcy/dsh-j-space/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/AnonyJcy/dsh-j-space/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AnonyJcy/dsh-j-space/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：原生预设与保真controller如何约束证据，安装不能推出哪些权限或效果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真正注册什么，适配贡献在哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是带原生 Agent Preset 的DSH插件包1.2.5，不是新的模型。bundle直接插入preset-j-space，config.id=j-space，组合personа、shell、fs、skills、goal与plan等官方组件，filesystem从已安装包package.json定位preset/skills。src/index.ts的apply仅部署旧文件副本，不是新版注册；旧CLI status/verify不能证明菜单预设已出现。目标是复杂工程任务的来源、问题、状态和二次验收记录，合格交付是可重读并能核查的任务证据。认知模块与control.py来自固定上游SV1，适配增量是原生预设、包内Skill定位与DSH权限映射，不能把上游认知假说或模型成绩归本包原创。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:29-46](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/cordis.patch.yml#L29-L46)

原生预设声明及host/agent职责。

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: preset-j-space
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: j-space
        name: J-Space Cognition Suite
        description: J-Space Cognition Suite SV1 认知工作空间 Agent，具备深层推理路由、持久控制器（control.py）、状态外化账本与自适应验证能力。
        order: 5
        plugins:
          # The `j-space` agent preset: J-Space Cognition Suite SV1 coding agent.
          #
          # This file is an AGENT-PLANE composition. The roster mounts it ONCE under a
          # standing scope; every session naming it joins by scope parentage, so the
          # tools, prompt sections, and J-Space skills registered here cover each joined
          # agent while a session's own state stays keyed per Session/Agent inside the
          # plugins. The host composition keeps everything a preset must not own: the
          # registries themselves, the sandbox and approval stack, persistence, and the
          # model route.
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:98-110](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/cordis.patch.yml#L98-L110)

包内Skill真实定位和tool-skill。

<details>
<summary>查看原文（13行）</summary>

```text
          # ── skills ──────────────────────────────────────────────────────────────────

          # Skills remain inside this installed package, not under the profile root.
          # Resolve exported package metadata from the profile before locating them.
          # Both rows register into THIS preset's layer of the host skill registry.
          - id: skill-filesystem
            name: '@deepseek-ai/dsh-skill-filesystem'
            config:
              customSkillDirs:
                - !!js "process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(new URL('package.json', baseUrl)).resolve('@anonyjcy/dsh-j-space/package.json')), 'preset/skills')"

          - id: tool-skill
            name: '@deepseek-ai/dsh-tool-skill'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:31-52](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/src/index.ts#L31-L52)

旧apply只复制，不负责注册。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Apply the J-Space plugin to a Cordis Context.
 * Deploys the legacy preset files if missing; DSH 0.2.1 registration is
 * handled separately by the package's bundle patch.
 * @param ctx - Cordis context.
 * @param config - plugin configuration.
 */
export async function apply(ctx: Context, config: Config = {}): Promise<void> {
  const autoDeploy = config.autoDeploy ?? true
  if (!autoDeploy) return

  // Cordis awaits async plugin application, including mounts in an active host.
  // It does not emit the old `ready` event in Cordis 4.
  try {
    const installed = await isJSpacePresetInstalled()
    if (!installed) {
      await installJSpacePreset()
      ctx.logger.info('J-Space Cognition Suite SV1 preset deployed to DSH user presets directory.')
    }
  } catch (error) {
    ctx.logger.warn(`Failed to auto-deploy J-Space preset: ${String(error)}`)
  }
```

</details>

**依据 4 · 源码核查**：[README.md:67-88](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/README.md#L67-L88)

旧CLI边界、上游来源与无hook。

<details>
<summary>查看原文（22行）</summary>

````text
[旧版 CLI](<bin/cli.js>) 仍随包保留，但只管理 `$DSH_HOME/.agent-presets/j-space` 中的文件副本。它的 `status` / `verify` 不能判断当前 DSH 是否已经注册预设；请以新建会话菜单为准。旧的独立 Cordis 部署插件也是文件复制用途，不是新版的注册方式。

版本变更见 [更新日志](<CHANGELOG.md>)。

## 原版内容与校验

当前使用上游 SV1 的固定提交 [b2023124](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/tree/b2023124a1fa08278e3ee82aefa8ed9faeade995)。13 个模块、7 个参考文档，以及原版控制器、示例和完整重读流程都保留。

26 个原版技能文件中，25 个逐字节不变；只有 [技能入口](<preset/skills/j-space/SKILL.md>) 加入了一段可移除的 DSH 说明，另附一份 [适配说明](<preset/skills/j-space/integration/dsh.md>)。原文和校验信息保存在 [压缩归档](<vendor/j-space/canonical.tar.gz>) 与 [清单](<vendor/j-space/manifest.json>) 中。

这里的压缩用于保存和还原源文件，不会减少解压后送给模型的 token，也不会用摘要代替原文。原版的重复提示和定期完整重读方式没有改。

在已安装包的根目录运行以下命令，可以校验文件或还原归档：

```bash
python3 -B tools/upstream_integrity.py verify --runtime preset/skills/j-space --adapters vendor/j-space/adapters.json

# 输出目录必须尚不存在
python3 -B tools/upstream_integrity.py expand --output /tmp/j-space-original-restored
```

控制器仍需要智能体按协议调用；安装预设不会自动装上宿主事件拦截器。
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 控制器能保证什么，不能保证什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

control.py gate检查goal/next、读收据、repo fingerprint、checkpoint和closed question证据的当前摘要，ship要求无开放问题、root completion、来源不变，delegate在high/xhigh须round2且独立验收绑定当前report摘要。atomic写用临时文件、flush/fsync和replace，减少半写状态。这是“记录与依赖是否仍当前”的可执行约束，不证明模型理解、论证正确或独立review实质充分。DSH overlay明示安装不装event hooks，没有可信接线时由agent在seam主动调用，属于合作控制；不能声称每个工具调用被宿主强制阻断。可选adapter还必须把真实host身份映射到现有证据ID，失败/超时/allow=false阻断依赖操作；提供设计契约不等于已部署hook。

#### 证据与依据

**依据 1 · 源码核查**：[preset/skills/j-space/scripts/control.py:105-115](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/scripts/control.py#L105-L115)

状态原子写的具体机制。

<details>
<summary>查看原文（11行）</summary>

```text
def atomic(path, data):
    fd, tmp = tempfile.mkstemp(prefix='.control-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)
```

</details>

**依据 2 · 源码核查**：[preset/skills/j-space/scripts/control.py:435-487](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/scripts/control.py#L435-L487)

证据/轮次/独立验收的实际gate。

<details>
<summary>查看原文（53行）</summary>

```text
def gate(root, state, aid, stage):
    require(nonempty(state['goal']) and nonempty(state['next']), 'Goal and next action are required.')
    check_reads(state, aid)
    agent = get_agent(state, aid)
    if repo_enabled(state):
        repo = check_repo(root, state)
        require(agent.get('view') == repo['fingerprint'], aid + ' must run repo view before work.')
    for checkpoint in state['checkpoints']:
        if checkpoint.get('active', True):
            require(current_evidence(root, checkpoint['evidence'], 'Active checkpoint ' + str(checkpoint['id'])),
                    'Active checkpoint evidence changed: ' + str(checkpoint['id']) +
                    '. Reopen a dependent question or record a new checkpoint with --supersede ID.')
    for qid, question in state['questions'].items():
        if question['closed']:
            checkpoint = next(item for item in state['checkpoints'] if item['id'] == question['checkpoint'])
            require(current_evidence(root, checkpoint['evidence']),
                    'Closed question evidence changed: ' + qid + '. Use note --reopen ' + qid + ' and reverify.')
    if stage == 'ship':
        require(not any(not question['closed'] for question in state['questions'].values()), 'Open questions require evidence-backed closure.')
        require(state['level'] != 'xhigh' or len(active_agents(state)) > 1 or nonempty(state['solo_reason']),
                'xhigh needs participating agents or an explicit --solo-reason describing unavailable host delegation.')
        for member, details in active_agents(state).items():
            check_reads(state, member)
            if repo_enabled(state):
                require(details.get('view') == repo['fingerprint'], member + ' must run repo view before shipment.')
            require(details['reports'], member + ' has no delivery report.')
            report = details['reports'][-1]
            if member != 'root':
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        member + ' task contract changed; begin a fresh two-round report cycle and review.')
            require(current_evidence(root, report['evidence']), member + ' report evidence changed.')
            for source in report['sources']:
                require(current_evidence(root, source), member + ' report source changed: ' + source['path'])
            if repo_enabled(state):
                require(bool(report['sources']), member + ' needs explicit --source dependencies.')
            if member == 'root':
                require(report.get('completion') and current_evidence(root, report['completion']),
                        'Root needs current --completion evidence checking the goal and deliverable.')
                require(report.get('goal') == state['goal'], 'Goal changed after root completion; submit a fresh root report.')
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        'Task contract or route changed after root completion; submit a fresh root report.')
                require(all(report.get('time', 0) >= a.get('retirement', {}).get('time', 0)
                            for a in state['agents'].values()),
                        'Agent retirement changed integration scope; submit a fresh root completion report.')
                continue
            if state['level'] in ('high', 'xhigh'):
                require(report['round'] == 2, member + ' requires a second-thinking report.')
            review = report.get('review')
            require(review and review['verdict'] == 'accepted', member + ' latest report is not independently accepted.')
            require(review['agent'] in state['agents'] and review['agent'] != member and
                    review['report_sha256'] == digest(encoded({k: v for k, v in report.items() if k != 'review'})),
                    member + ' review is not bound to the current report.')
            require(current_evidence(root, review['evidence']), member + ' review evidence changed.')
```

</details>

**依据 3 · 源码核查**：[preset/skills/j-space/integration/dsh.md:79-99](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/integration/dsh.md#L79-L99)

全文刷新、hash非理解与无自动hook的边界。

<details>
<summary>查看原文（21行）</summary>

```text
## Refresh, gates, and host wiring

`high` and `xhigh` retain default controller use, source refresh, persistence, checkpoints,
and applicable repository/security obligations. DSH native task tracking is execution
coordination; it does not make the strict cognition controller optional at these levels.
Retain the verbatim premise and drills. Due pulses reread and emit **full current sources**,
including unchanged bodies; unchanged-hash markers are not the original reinforcement.
Keep recovery events immediate and refresh each affected actual participant. A hash proves
byte identity, not comprehension, retention, scientific validity, or task correctness.

Installing this preset installs no event hooks. Without trusted wiring, invoke the original
controller explicitly at the documented seams and describe it as cooperative control.
An optional host adapter may map trusted live DSH identities to existing local evidence IDs;
it must deliver returned full context to the correct participant and fail the dependent
operation closed on any nonzero exit, timeout, malformed output, or `allow=false`. Never
accept a model-supplied non-root identity as a gate bypass. The original bridge rejects
unknown evidence participants rather than granting unconditional child passthrough.
Controller reads, evidence collection, and map/state repair must remain available while
blocked; do not recursively intercept the bridge's own subprocesses. Use
[host integration](../references/host-integration.md) for deadlines and event contracts. No hook, timing,
or delivery guarantee exists until tested against the actual host.
```

</details>

#### 缺口

- 真实模型遵循controller协议程度和host hook实际强制性未测试。
  **影响**：不能以成功安装宣称自动治理或质量提升。
  **进一步探讨**：隔离任务故意跳调用/改证据，观察host能否阻断；没有可信hook就按合作协议标注并保留人工验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 团队和权限属于谁，是否会自动扩展代理？

**研究主题**：依赖、兼容与流程、功能与机制

#### 完整回答

DSH拥有权限、模型、进程、消息、调度和生命周期；controller agent add/retire仅记实际参与者证据，不能创建/停止成员或释放宿主task owner。overlay要求用户显式请求官方团队，只有Lead建/停，逻辑递归是子问题而非嵌套Team；无授权不能用占位身份伪造独立review，xhigh须真实solo_reason和顺序独立方法。patch使用官方plan-mode及相应隔离realm，而不是另设权限系统。安装官方team为可选，单agent可使用，复杂度不产生授权；工作流批处理也不能冒充团队。贡献是执行权与认知记录的分工，仍取决于agent真实遵循，不能把提示词当安全隔离。

#### 证据与依据

**依据 1 · 源码核查**：[preset/skills/j-space/integration/dsh.md:12-49](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/integration/dsh.md#L12-L49)

执行authority、显式团队授权、flat roster和solo限制。

<details>
<summary>查看原文（38行）</summary>

```text
| Portable term | DSH interpretation |
|---|---|
| Host launches an agent | Use the available, authorized official DSH delegation tools. A controller command never launches anything. |
| Registered agent | A task-scoped local evidence identity for an actual participant, not a Team roster row or permission grant. |
| Parent, depth, and owned paths | Logical evidence provenance and bounded subquestions, not nested Teams, host parentage, filesystem locks, or write authorization. |
| Shared agent/depth/credit limits | Additional bounds on this evidence protocol. DSH deployment limits also apply; neither permits bypassing the other. |
| Retire an agent | Archive its local evidence participation and transfer unfinished scope. Actual interruption, messaging, and task ownership remain host operations. |
| Accept a report | Accept its cognitive evidence for this task, not a Team lifecycle transition or task-board completion. |

DSH owns permissions, identity, providers, processes, inboxes, roster, task-board revisions,
continuation, cancellation, compaction, goals, todos, and jobs. The cognition record owns
verified claims and their dependencies, not a competing execution task board. Host tools
cannot replace missing cognitive evidence; controller receipts cannot replace host authority.

## Delegation authorization and the flat Team

Assess useful independent work proactively at `high` and use the stronger collaboration
protocol at `xhigh` when authorized. **Complexity never authorizes spawning.** The official
Team tool policy creates teammates only when the user explicitly requests a team or
teammates. Follow the actual tool catalog and host policy, not names inferred from this
reference. Only the Team Lead creates or interrupts teammates; teammates can send peer
messages and use the shared board. The immutable flat roster provides no nested Team,
rename, deletion, automatic owner release, or isolated checkout.

A child needing another bounded investigation sends that proposal to the Lead. The Lead
may assign an existing actual participant or, when authorized, create a direct teammate.
Represent recursive decomposition as logical subquestions, not invented host descendants.
Use real targets returned by host tools; Team target names are not Session IDs. A send
receipt proves inbox acceptance, not processing, completed work, or durable report quality.
An inactive teammate is not thereby finished. Shared cwd and advisory write scopes require
coordinated writes and final seam checks; workflow is not filesystem isolation.

Without available or user-requested delegation, do not create placeholder participants.
At `xhigh`, record the concrete restriction with `--solo-reason`, preserve sequential
independent-method passes and their evidence, and disclose that no independent agent
review or parallel execution occurred. At `high`, root-only work can pass with current
completion evidence. Do not downgrade complexity to hide an obligation. The controller
validates a nonempty solo reason structurally; the agent must make its explanation truthful.
```

</details>

**依据 2 · 源码核查**：[preset/skills/j-space/integration/dsh.md:51-77](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/integration/dsh.md#L51-L77)

真实参与者、二轮报告与retire不是host中断。

<details>
<summary>查看原文（27行）</summary>

```text
## Actual participants and original acceptance

The full skill directory remains available to every actual participant. Provide its absolute
path, the shared task root, bounded question, actual host target, authorized write boundary,
acceptance criteria, and local evidence ID. Record actual identity mapping in task evidence.
For participating delegates, `agent add` records that mapping's evidence role; it is **not**
a required host registration command. Never populate it from the entire immutable Team
roster or add a second identity for the same root to counterfeit independent review.

Each participant consumes its own full `read`/`pulse` output and applicable `repo view`.
Parent reads and inherited context do not establish child receipts. Source/contract changes
must reach the affected participants, whose evidence cycles are then refreshed. Preserve
the original protocol: first report, focused second consideration by the same participant,
a distinct second artifact without overwriting the first, and independent acceptance of
the exact latest report. At `high`/`xhigh`, delegate shipment requires round two. Root or
another actual participant checks evidence independently; a delegate cannot accept itself.
Changed reports, cited sources, review artifacts, goal/core/route, or final map reopen the
corresponding checks. A superficial second message is not a substantive second consideration.

Every active local evidence participant is subject to the original ship gate. Abandoned
participation must be retired explicitly only after inspecting host status and transferring
unfinished work; retain reports and history. The Team roster entry remains intact. A local
retirement does not stop a host turn, release a Team task owner, refund credits, prove the
process stopped, or clear open questions/security findings. If actual work needs stopping,
the authorized Lead uses host interruption separately and observes its outcome. Refresh
root completion after an evidence retirement changes the integration scope. Do not retire
unfinished obligations merely to make shipment pass.
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:120-142](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/cordis.patch.yml#L120-L142)

官方planMode组合的实际接线。

<details>
<summary>查看原文（23行）</summary>

```text
          # ── plan mode ───────────────────────────────────────────────────────────────

          - id: planning
            name: cordis:group
            group: true
            isolate:
              planMode: true
            config:
              - id: plan-mode
                name: '@deepseek-ai/dsh-plan-mode'
                config:
                  section: |
                        You are in plan mode. Stay in plan mode until the user approves your plan through exit_plan_mode or switches the session mode. Imperative language to implement changes means plan the implementation, not execute it. A user's conversational agreement — including an answer confirming something you asked — approves nothing and does not end plan mode; fold the confirmed decision into the plan and submit it through exit_plan_mode.

                        Explore first. Use non-mutating reads, searches, static analysis, and checks to ground the plan in the actual repository. Do not edit or write files, change configuration, run formatters or code generation that rewrites tracked files, commit, or otherwise carry out the plan. Prefer existing functions and patterns over new machinery.

                        The tool catalog stays the same across modes for request-cache stability. These plan-mode rules override any later tool description or guidance that suggests using mutation tools; those tools remain listed to keep the tool catalog unchanged. Do not use todo_write to track this planning phase: it tracks implementation after an approved plan, while the plan itself belongs in exit_plan_mode.

                        Resolve discoverable facts by inspection. Use ask_user_question only for user-owned choices or material ambiguity that inspection cannot answer. Do not ask the user where code lives or how current behavior works when you can find out.

                        Make the plan decision-complete: state the goal and success criteria; group implementation changes by subsystem; identify public API, schema, and data-flow changes; cover edge cases, failure modes, tests, acceptance criteria, and explicit assumptions. Keep it concise enough to review but detailed enough that another engineer can implement it without making design decisions.

                        When ready, call exit_plan_mode with the complete plan markdown, starting with a # title. Make exit_plan_mode the only and final tool call in that assistant response: it presents the plan for approval, and implementation begins only in a later step after approval. Do not paste the final plan as a plain reply or ask "should I proceed?" through prose or ask_user_question. If review rejects it, incorporate the feedback and present again. If the review channel is unavailable or aborted, stay in plan mode and ask the user to switch modes manually; do not proceed with implementation.
```

</details>

**依据 4 · 源码核查**：[preset/skills/j-space/SKILL.md:15-30](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/SKILL.md#L15-L30)

入口强制DSH覆盖与不自动开团队。

<details>
<summary>查看原文（16行）</summary>

```text
- Official DSH tools own actual permissions, identity, scheduling, messaging, and lifecycle.
  Complexity is not spawning authorization. Official Teams require a user request; only
  their Lead creates or interrupts real teammates, in the host's flat roster.
- Controller `agent add` / `retire` maintain task-local evidence participation, not a second
  host roster. Use only actual participants; parent/depth describe logical subquestions.
  Never counterfeit independent review with another identity for the same agent.
- Keep the original high/xhigh controller, full source refresh, maps, checkpoints, report,
  second consideration, and independent acceptance obligations. Native goals/todos/jobs
  coordinate execution; they do not replace this cognitive evidence or its gates.
- If delegation is unavailable or not user-requested, record the truthful xhigh solo
  limitation and use sequential independent-method passes without claiming agent review.
  Workflow is only for explicitly requested batch orchestration, never synthetic Teams.

Repeated premise and scheduled full-source reinjection remain intentional. The packaged
lossless source archive is for exact reconstruction, not a shorter replacement prompt.
No host event hooks or official Team activation are installed automatically.
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 原版保真与升级带来什么成本？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

启动需要相容DSH/Cordis、原生预设及Skill；运行controller/完整性工具还要Python3.10+。作者报告rc.3/rc.4/0.2.2-alpha.2安装及Skill加载，未做模型A/B、真实团队对话、浏览器或定时投递，因此只作作者范围。高/xhigh坚持完整来源重读、checkpoint、二轮报告与独立验收，会增加上下文和人工核查；canonical.tar.gz保存字节并不减少解压后送模型token。旧配置覆盖可能保留过时tool-subagent/Ralph列表，升级须备份并重置覆盖，再新建会话；旧账本不必删除。旧installer cp默认force=true，uninstall递归rm旧目录，只是文件复制路径，不可用来推断新版预设退出。恢复应重开被来源变化影响问题、保留原报告，不能靠删未完成参与者让gate通过。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:17-30](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/README.md#L17-L30)

具体host安装、重启与Python依赖。

<details>
<summary>查看原文（14行）</summary>

````text
1.2.5 的验证环境是 **DSH 0.2.1-rc.4 / Cordis 4.0.5**，另外在 `0.2.1-rc.3` 和 `0.2.2-alpha.2`（Cordis `4.0.6-alpha.1`）上验证过安装和预设加载。下面固定使用 rc.4 这个版本，不依赖 npm 标签的指向；`next` 标签现在也指向它，而 `latest` 仍是较早的 `0.2.1-rc.2`。更旧的 `0.2.0-rc.2` 缺少本预设需要的定时工具，不能完整加载，请先升级。

```bash
# 已使用对应 DSH 版本时，可以跳过这一条
npm install -g @deepseek-ai/dsh@0.2.1-rc.4

dsh plugin --profile web add @anonyjcy/dsh-j-space@1.2.5
```

已有 DSH 部署时，请在启动该部署的安装环境中升级，并先备份自定义配置。使用自定义 profile 的话，把 `web` 换成实际名称。

安装后重启 DSH Web，新建会话，在 **Agent Preset** 中选择 **J-Space Cognition Suite**。只在普通项目里安装 npm 包，不会把预设注册到 DSH；也不用再运行旧版 `install` 命令。

使用原版控制器或校验脚本需要 **Python 3.10+**。
````

</details>

**依据 2 · 源码核查**：[README.md:59-88](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/README.md#L59-L88)

旧覆盖、归档与完整重读负担。

<details>
<summary>查看原文（30行）</summary>

````text
## 从旧版升级

在同一个 profile 更新包，重启 DSH Web，再新建会话。

如果曾在 Web 编辑器中保存过 J-Space 的插件配置，请先备份，再重置该预设的覆盖配置，或手动移除旧的 `tool-subagent*`、Ralph 配置。否则，即使包已经更新，会话仍可能沿用旧的工具列表。官方团队层应放在 base / web 层之后加载。

已有的 `.jspace/control.json` 和任务记录不用删除。

[旧版 CLI](<bin/cli.js>) 仍随包保留，但只管理 `$DSH_HOME/.agent-presets/j-space` 中的文件副本。它的 `status` / `verify` 不能判断当前 DSH 是否已经注册预设；请以新建会话菜单为准。旧的独立 Cordis 部署插件也是文件复制用途，不是新版的注册方式。

版本变更见 [更新日志](<CHANGELOG.md>)。

## 原版内容与校验

当前使用上游 SV1 的固定提交 [b2023124](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/tree/b2023124a1fa08278e3ee82aefa8ed9faeade995)。13 个模块、7 个参考文档，以及原版控制器、示例和完整重读流程都保留。

26 个原版技能文件中，25 个逐字节不变；只有 [技能入口](<preset/skills/j-space/SKILL.md>) 加入了一段可移除的 DSH 说明，另附一份 [适配说明](<preset/skills/j-space/integration/dsh.md>)。原文和校验信息保存在 [压缩归档](<vendor/j-space/canonical.tar.gz>) 与 [清单](<vendor/j-space/manifest.json>) 中。

这里的压缩用于保存和还原源文件，不会减少解压后送给模型的 token，也不会用摘要代替原文。原版的重复提示和定期完整重读方式没有改。

在已安装包的根目录运行以下命令，可以校验文件或还原归档：

```bash
python3 -B tools/upstream_integrity.py verify --runtime preset/skills/j-space --adapters vendor/j-space/adapters.json

# 输出目录必须尚不存在
python3 -B tools/upstream_integrity.py expand --output /tmp/j-space-original-restored
```

控制器仍需要智能体按协议调用；安装预设不会自动装上宿主事件拦截器。
````

</details>

**依据 3 · 源码核查**：[README.md:104-115](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/README.md#L104-L115)

作者安装验证与未测效果。

<details>
<summary>查看原文（12行）</summary>

````text
另行安装隔离的 DSH 宿主后，可以检查官方配置和真实安装流程：

```bash
pnpm run test:host /path/to/isolated-host/node_modules 0.2.1-rc.4
pnpm run test:install /path/to/isolated-host/node_modules /absolute/plugin.tgz 0.2.1-rc.4
```

安装测试只创建新的临时 profile，不会修改正在使用的配置。1.2.5 已在 rc.3、rc.4 和 `0.2.2-alpha.2` 上验证原生安装、预设与技能加载，以及官方团队开关两种配置；没有做模型 A/B、真实团队对话、浏览器操作或定时投递测试。

## 相关评测

上游作者发布了 [GLM-5.3-Flash 报告](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report) 和 [DeepSeek-V4 报告](https://github.com/Tiger3807861189/DeepSeek-V4-J-Space-Capability-Realization-Report)。这些是上游实验，不是这份 DSH 适配的实测成绩；本项目没有复现其中的性能或 token 收益。
````

</details>

**依据 4 · 源码核查**：[src/installer.ts:102-130](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/src/installer.ts#L102-L130)

旧复制/卸载实际副作用。

<details>
<summary>查看原文（29行）</summary>

```text
export async function installJSpacePreset(options: InstallOptions = {}): Promise<string> {
  const templateDir = getJSpaceTemplatePath()
  const targetDir = targetUserPresetDir(options.dshHome)

  await mkdir(dirname(targetDir), { recursive: true })
  await cp(templateDir, targetDir, {
    recursive: true,
    force: options.force ?? true,
  })

  return targetDir
}

/**
 * Uninstall the J-Space preset from DSH home.
 * @param dshHome - optional explicit DSH home directory path.
 * @returns true if the directory was deleted, false if it did not exist.
 */
export async function uninstallJSpacePreset(dshHome?: string): Promise<boolean> {
  const targetDir = targetUserPresetDir(dshHome)
  try {
    const s = await stat(targetDir)
    if (s.isDirectory() || s.isFile()) {
      await rm(targetDir, { recursive: true, force: true })
      return true
    }
    return false
  } catch {
    return false
```

</details>

#### 缺口

- 每个合格任务的token、人工分钟、错误率及中断恢复未独立测量。
  **影响**：不能宣称节省token、提升智能或降低净成本。
  **进一步探讨**：同模型同工程任务对照原生goal/todo加人工清单，计全轮重读/失败/复核后比较缺陷和投入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得试用，怎样检验改进？

**研究主题**：采用判断、新假设与验证

#### 完整回答

复杂多阶段工程且已愿维护证据的个人开发者可以先单agent试用；简单问答用原生工具即可，不为符合协议增加形式记录。试用以相同模型、任务、预算对照原生goal/todo和手工证据清单，验收最终缺陷、来源变动漏复核、恢复时间、总token与人工分钟。任何控制器记录被当成实际权限、虚构独立参与者或重读负担超过质量收益，停止扩展。未验证假设是用明确来源依赖图提出定向复核建议，同时保留原版全文刷新作对照，可能降低无关重做；不能直接删除原版刷新再称保真。故意改有关/无关来源并注入摘要不变但语义误解，若漏复核增加或成本不降，否定建议；hash门禁不能替代实质验收。

#### 证据与依据

**依据 1 · 源码核查**：[preset/skills/j-space/scripts/control.py:442-487](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/scripts/control.py#L442-L487)

依赖变化重开与验收绑定提供假设基础。

<details>
<summary>查看原文（46行）</summary>

```text
    for checkpoint in state['checkpoints']:
        if checkpoint.get('active', True):
            require(current_evidence(root, checkpoint['evidence'], 'Active checkpoint ' + str(checkpoint['id'])),
                    'Active checkpoint evidence changed: ' + str(checkpoint['id']) +
                    '. Reopen a dependent question or record a new checkpoint with --supersede ID.')
    for qid, question in state['questions'].items():
        if question['closed']:
            checkpoint = next(item for item in state['checkpoints'] if item['id'] == question['checkpoint'])
            require(current_evidence(root, checkpoint['evidence']),
                    'Closed question evidence changed: ' + qid + '. Use note --reopen ' + qid + ' and reverify.')
    if stage == 'ship':
        require(not any(not question['closed'] for question in state['questions'].values()), 'Open questions require evidence-backed closure.')
        require(state['level'] != 'xhigh' or len(active_agents(state)) > 1 or nonempty(state['solo_reason']),
                'xhigh needs participating agents or an explicit --solo-reason describing unavailable host delegation.')
        for member, details in active_agents(state).items():
            check_reads(state, member)
            if repo_enabled(state):
                require(details.get('view') == repo['fingerprint'], member + ' must run repo view before shipment.')
            require(details['reports'], member + ' has no delivery report.')
            report = details['reports'][-1]
            if member != 'root':
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        member + ' task contract changed; begin a fresh two-round report cycle and review.')
            require(current_evidence(root, report['evidence']), member + ' report evidence changed.')
            for source in report['sources']:
                require(current_evidence(root, source), member + ' report source changed: ' + source['path'])
            if repo_enabled(state):
                require(bool(report['sources']), member + ' needs explicit --source dependencies.')
            if member == 'root':
                require(report.get('completion') and current_evidence(root, report['completion']),
                        'Root needs current --completion evidence checking the goal and deliverable.')
                require(report.get('goal') == state['goal'], 'Goal changed after root completion; submit a fresh root report.')
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        'Task contract or route changed after root completion; submit a fresh root report.')
                require(all(report.get('time', 0) >= a.get('retirement', {}).get('time', 0)
                            for a in state['agents'].values()),
                        'Agent retirement changed integration scope; submit a fresh root completion report.')
                continue
            if state['level'] in ('high', 'xhigh'):
                require(report['round'] == 2, member + ' requires a second-thinking report.')
            review = report.get('review')
            require(review and review['verdict'] == 'accepted', member + ' latest report is not independently accepted.')
            require(review['agent'] in state['agents'] and review['agent'] != member and
                    review['report_sha256'] == digest(encoded({k: v for k, v in report.items() if k != 'review'})),
                    member + ' review is not bound to the current report.')
            require(current_evidence(root, review['evidence']), member + ' review evidence changed.')
```

</details>

**依据 2 · 源码核查**：[preset/skills/j-space/integration/dsh.md:79-99](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/preset/skills/j-space/integration/dsh.md#L79-L99)

原版刷新义务不可暗改与合作控制边界。

<details>
<summary>查看原文（21行）</summary>

```text
## Refresh, gates, and host wiring

`high` and `xhigh` retain default controller use, source refresh, persistence, checkpoints,
and applicable repository/security obligations. DSH native task tracking is execution
coordination; it does not make the strict cognition controller optional at these levels.
Retain the verbatim premise and drills. Due pulses reread and emit **full current sources**,
including unchanged bodies; unchanged-hash markers are not the original reinforcement.
Keep recovery events immediate and refresh each affected actual participant. A hash proves
byte identity, not comprehension, retention, scientific validity, or task correctness.

Installing this preset installs no event hooks. Without trusted wiring, invoke the original
controller explicitly at the documented seams and describe it as cooperative control.
An optional host adapter may map trusted live DSH identities to existing local evidence IDs;
it must deliver returned full context to the correct participant and fail the dependent
operation closed on any nonzero exit, timeout, malformed output, or `allow=false`. Never
accept a model-supplied non-root identity as a gate bypass. The original bridge rejects
unknown evidence participants rather than granting unconditional child passthrough.
Controller reads, evidence collection, and map/state repair must remain available while
blocked; do not recursively intercept the bridge's own subprocesses. Use
[host integration](../references/host-integration.md) for deadlines and event contracts. No hook, timing,
or delivery guarantee exists until tested against the actual host.
```

</details>

**依据 3 · 源码核查**：[README.md:111-115](https://github.com/AnonyJcy/dsh-j-space/blob/d2bb1b8fb708bc01a0bc5d883164d857e5fde653/README.md#L111-L115)

无模型A/B，不能借上游报告放大收益。

```text
安装测试只创建新的临时 profile，不会修改正在使用的配置。1.2.5 已在 rc.3、rc.4 和 `0.2.2-alpha.2` 上验证原生安装、预设与技能加载，以及官方团队开关两种配置；没有做模型 A/B、真实团队对话、浏览器操作或定时投递测试。

## 相关评测

上游作者发布了 [GLM-5.3-Flash 报告](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report) 和 [DeepSeek-V4 报告](https://github.com/Tiger3807861189/DeepSeek-V4-J-Space-Capability-Realization-Report)。这些是上游实验，不是这份 DSH 适配的实测成绩；本项目没有复现其中的性能或 token 收益。
```

#### 缺口

- 定向建议能否降低成本而保持缺陷检出未知。
  **影响**：新设计不计本包已实现贡献或商业机会。
  **进一步探讨**：固定故障集对照，漏复核不增且总成本下降才继续；否则维持原协议或退出重流程。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
