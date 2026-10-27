# dsh-backup-sync

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9baff60](https://github.com/Arlenman/dsh-backup-sync/tree/9baff601ee5d086f2ee2e078227bb7617138abfd)

<!-- BEGIN META -->
[![npm 30d 361](https://img.shields.io/static/v1?label=npm+30d&message=361&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-backup-sync) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-backup-sync)
<!-- END META -->

> **实现功能**：按模块备份和恢复 DSH 技能、插件、配置与记忆，支持基线合并及 WebDAV 同步。

> **核心亮点**：相对直接覆盖目录，主要增量是将外置技能与 DSH 资产统一成模块，并让冲突保留为人工裁决；模块缺席不被解释为删除。[Q01](#research-q01) 与 [Q02](#research-q02) 支持这一流程贡献。三方合并为成熟方法，本项价值在资产范围与恢复接线，未核查其他备份插件源码，不能据作者对照宣称全面优于竞品。

> **风险与缺陷**：安全合并是否仍成立取决于扫描后目标有没有继续变化。执行器按既有计划直接 rename，读到的片段未显示在覆盖前重新比较 plan.ours；逐文件回滚也不同于整批事务。[Q03](#research-q03) 因而把保证收窄为静止目标下的保护，不能称永不覆盖新修改。

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
  - [Q01 · 六模块备份服务谁，交付什么，相对复制目录增加什么？](#detail-section-11)
  - [Q02 · 三方分类与恢复如何衔接，何时不会碰未选模块？](#detail-section-12)
  - [Q03 · 哪些边界会使“不冲掉本地修改”的保证变窄？](#detail-section-13)
  - [Q04 · 一次可恢复备份包含哪些持续与失败成本？](#detail-section-14)
  - [Q05 · 可否把目标哈希绑定到可复验恢复计划？](#detail-section-15)
  - [Q06 · 哪些用户值得受控试用，什么结果应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在多台机器维护 DSH 资产的个人用户。交付物是可校验归档及逐文件恢复结果；常规复制 .dsh 会遗漏外置技能目录，也不能判断两边各自修改。

参照人工复制目录与tar归档；作者对dsh-backup的描述仅是作者声明，未核查该竞品固定源码。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模块三方差异 | 区分归档和本地修改 | 依赖可信基线，范围外模块跳过 |
| 逐文件恢复 | 裁决冲突并写入资产 | 默认保留冲突，需暂停并发写入 |
| 定时备份调度 | 无界面时生成备份 | 路径、tar及设置需有效 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.2.0-rc.2、Node>=22 | 声明必需 | 宿主和内置模块 | 其他宿主版本兼容未知 |
| connection服务与Web客户端 | 面板必需 | 路由和设置UI | 定时器仍独立启动，面板不可用 |
| 系统tar、可写归档目录 | 备份必需 | 打包和恢复副本 | 无法形成可用归档 |
| WebDAV账号 | 云端可选 | 上传下载 | 可保留本机归档 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户加载插件并重启宿主 | 面板及接口可用 |
| 备份 | 用户选模块和输出路径 | 归档校验且范围正确 |
| 恢复 | 用户扫描差异并裁决 | 暂停并发写入，先保留副本 |
| 验收 | 用户核对结果与失败项 | 异常用预恢复快照人工恢复 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 归档磁盘；云空间费用未知 | 配置模块、路径、保留独立副本；耗时未知 | Node>=22及系统tar |
| 持续使用 | 增量判断仍需扫描与存储；流量未知 | 检查校验、保留策略与冲突 | 每轮资产量未测 |
| 失败恢复 | 预恢复快照及重新归档空间 | 排查部分失败、核对每文件与基线 | 无整批回滚效果实测 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 防止选择性归档误删 | diff对范围外模块skip | 真实跨机误操作率 |
| 恢复保护 | 默认冲突保留、覆盖前副本和写后哈希 | 并发写入与整批中断一致性 |
| 凭据排除 | 文件名与高信号内容规则 | 自定义格式与大文件秘密覆盖 |

> **思考**：安全合并是否仍成立取决于扫描后目标有没有继续变化。执行器按既有计划直接 rename，读到的片段未显示在覆盖前重新比较 plan.ours；逐文件回滚也不同于整批事务。[Q03](#research-q03) 因而把保证收窄为静止目标下的保护，不能称永不覆盖新修改。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对直接覆盖目录，主要增量是将外置技能与 DSH 资产统一成模块，并让冲突保留为人工裁决；模块缺席不被解释为删除。[Q01](#research-q01) 与 [Q02](#research-q02) 支持这一流程贡献。三方合并为成熟方法，本项价值在资产范围与恢复接线，未核查其他备份插件源码，不能据作者对照宣称全面优于竞品。

相对直接覆盖目录，主要增量是将外置技能与 DSH 资产统一成模块，并让冲突保留为人工裁决；模块缺席不被解释为删除。[Q01](#research-q01) 与 [Q02](#research-q02) 支持这一流程贡献。三方合并为成熟方法，本项价值在资产范围与恢复接线，未核查其他备份插件源码，不能据作者对照宣称全面优于竞品。

差异纯函数与写入器分离，便于独立检查；外置模块白名单与保守冲突默认值得复用。applyPlan 的保留本地分支以归档哈希作共同祖先，避免下次错误覆盖，源码注释与代码需以后者为准。移植需要重做模块根、凭据规则与目标平台路径。当前未检查云端全链路，不能把测试文件存在写成通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

安全合并是否仍成立取决于扫描后目标有没有继续变化。执行器按既有计划直接 rename，读到的片段未显示在覆盖前重新比较 plan.ours；逐文件回滚也不同于整批事务。[Q03](#research-q03) 因而把保证收窄为静止目标下的保护，不能称永不覆盖新修改。

<a id="detail-section-6"></a>

### 1.5 使用建议

先从可丢弃技能目录创建包并异机导入，检查新增、本地修改和冲突各一项；确认未选模块不变，失败文件和基线可解释后扩大范围。遇到扫描后修改被覆盖、快照无法恢复或凭据误入包立即停止。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

模块范围、三方分类和逐文件恢复保护有源码支持；跨机器恢复效果与云端可靠性未实测，未来计划校验是假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/diff.js、lib/apply.js、lib/guard.js、package.json、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的 README、包入口、差异与执行器及凭据守卫；完整组件统计由 inventory 保留，源码检查不等于全部分支证明。
- 下一步：- 已检查固定源码与作者说明。
- 未执行目标代码、测试、云端或真实宿主恢复。
- 扫描后并发修改和全批中断恢复仍有研究缺口。

**分析版本**

- **仓库**：[Arlenman/dsh-backup-sync](https://github.com/Arlenman/dsh-backup-sync)
- **版本号**：0.2.0（[固定提交 9baff60](https://github.com/Arlenman/dsh-backup-sync/tree/9baff601ee5d086f2ee2e078227bb7617138abfd)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将动作计划绑定目标原始哈希，在每个 rename/delete 前重新比对并拒绝漂移，且以事务日志记录批内状态。[Q05](#research-q05) 推导这一未验证方向。以扫描后并发修改、断电和部分失败的恢复演练作对照；若仍出现静默覆盖或无法解释的部分状态，就否定安全增益。

- 已检查固定源码与作者说明。
- 未执行目标代码、测试、云端或真实宿主恢复。
- 扫描后并发修改和全批中断恢复仍有研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 2947 | — | — | 41327 |
| .js | source | 21 | 9362 | 6903 | 1858 | — |
| .mjs | source | 7 | 1502 | 1199 | 164 | — |
| .js | test | 21 | 10356 | 8487 | 851 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arlenman/dsh-backup-sync/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Arlenman/dsh-backup-sync/issues?q=is%3Aissue+created%3A2026-09-24T05%3A56%3A34.656Z..2026-10-24T05%3A56%3A34.656Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arlenman/dsh-backup-sync/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T05%3A56%3A34.656Z..2026-10-24T05%3A56%3A34.656Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本模块备份和三方恢复能否安全支持DSH换机并保留本机修改？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 六模块备份服务谁，交付什么，相对复制目录增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向跨机器维护DSH技能、配置与记忆的人。合格结果不是有一个压缩包，而是目标模块能恢复、未选模块和本地独立修改得到保留。README将技能放在userHome/.agents/skills，把插件配置等放在dshHome，这解释了只复制.dsh的范围缺口。研究识别的增量是资产聚合和恢复裁决，归档压缩本身为既有技术。作者对其他插件覆盖范围的比较尚未独立确认，不能扩大为竞品性能结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-65](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/README.md#L34-L65)

明确资产位置、任务与作者比较，比较部分只支持作者主张。

<details>
<summary>查看原文（32行）</summary>

```text
## 它解决什么问题

DSH 的「资产」散落在**两个地方**：

| 资产 | 位置 |
| --- | --- |
| 技能（工作流本体） | `<userHome>/.agents/skills` |
| 插件清单 / 依赖锁 | `<dshHome>/profiles/<profile>/` |
| 核心配置（provider、模型、主题、插件配置） | `<dshHome>/profiles/<profile>/cordis.patch.yml` |
| 记忆 / 待办 | `<dshHome>/memories/` |
| 对话记录 | `<dshHome>/sessions/` |

其中 `<dshHome>` 默认是 `~/.dsh`，而**技能根本不在它下面**。
换电脑时最容易丢的恰好是技能和配置 —— 而它们又最值钱。

这个插件把上面这些一起打包，并且解决第二个问题：**导入时不要把人家的新东西冲掉**。

## 和 dsh-backup 有什么不同

[`@xiaoyuyu6420/dsh-backup`](https://www.npmjs.com/package/@xiaoyuyu6420/dsh-backup) 是一个成熟的全量备份插件（本插件作者也在用），但它的 `skills` 类型找的是 `~/.dsh/skills`；技能库实际住在 `~/.agents/skills`（`~/.dsh` 之外），所以在技能装在标准位置的机器上，**它备不到技能**。

两者的定位：

| | dsh-backup | dsh-backup-sync（本插件） |
| --- | --- | --- |
| 备份范围 | `~/.dsh` 整棵树（可按类型排除） | 六个模块，**含 `~/.agents/skills`** |
| 导入语义 | 恢复（覆盖） | **带基线的三方合并**，逐文件给差异 |
| 冲突处理 | — | 弹差异预览，逐文件选保留哪边 |
| 云同步 | 内置 GitHub 私有仓库同步 | 推送到「同步目录」（可指向任何被同步工具盯着的目录） |
| 救援 | 有进程外救援脚本 | — |

**两个可以同时装**，互不干扰（备份目录、状态文件都不同名）。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三方分类与恢复如何衔接，何时不会碰未选模块？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

差异器对基线、本地和归档三张哈希表做并集。归档模块清单之外全部skip，避免选择性备份被当作删除；同名新增不同内容和双侧修改不同结果都成为conflict。执行器将未裁决冲突变成keep，allowDelete默认false，随后翻译目标路径、保存原件、临时复制并rename。该路径依赖模块include白名单与可写目录；宿主路由通过connection懒注入，定时器单独启动，因此面板服务缺失不必阻止调度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/diff.js:106-149](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/diff.js#L106-L149)

模块范围、哈希分类和动作清单。

<details>
<summary>查看原文（44行）</summary>

```text
export function diffFiles({
  baseline = {},
  current = {},
  incoming = {},
  modules = null,
  allowDelete = false,
} = {}) {
  const scope = modules ? new Set(modules) : null;
  const keys = new Set([...Object.keys(baseline), ...Object.keys(current), ...Object.keys(incoming)]);

  /** @type {any[]} */
  const actions = [];
  const counts = { import: 0, keep: 0, delete: 0, conflict: 0, same: 0, skip: 0 };

  for (const key of [...keys].sort()) {
    const { moduleId, relPath } = parseKey(key);

    // 归档未声明的模块 → 一律不碰（这是防「选择性备份误删」的唯一屏障）
    if (scope && !scope.has(moduleId)) {
      actions.push({
        key,
        moduleId,
        relPath,
        action: 'skip',
        reason: `归档未包含「${moduleId}」模块，本地保持不动`,
      });
      counts.skip += 1;
      continue;
    }

    const b = shaOf(baseline, key);
    const o = shaOf(current, key);
    const t = shaOf(incoming, key);

    const { action, reason } = classify(b, o, t, allowDelete);
    actions.push({ key, moduleId, relPath, action, reason, base: b, ours: o, theirs: t });
    counts[action] += 1;
  }

  return {
    actions,
    counts,
    conflicts: actions.filter((a) => a.action === 'conflict'),
    pending: actions.filter((a) => a.action === 'import' || a.action === 'delete'),
```

</details>

**依据 2 · 源码核查**：[lib/apply.js:117-164](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/apply.js#L117-L164)

冲突和删除默认值转成真正写入目标。

<details>
<summary>查看原文（48行）</summary>

```text
  // ── 第一步：把计划翻译成「打算做什么」，冲突在这里裁决
  for (const a of plan.actions) {
    const key = a.key;
    const { moduleId, relPath } = a.moduleId !== undefined ? a : parseKey(key);

    let effective = a.action;
    let reason = a.reason ?? '';

    if (a.action === 'conflict') {
      const r = resolutions[key];
      if (r === 'archive') {
        effective = 'import';
        reason = '冲突裁决：采用归档版本';
      } else if (r === 'local') {
        effective = 'keep';
        reason = '冲突裁决：保留本地版本';
      } else {
        effective = 'keep';
        reason = '冲突未裁决 → 保留本地（安全默认）';
      }
    } else if (a.action === 'delete' && !allowDelete) {
      effective = 'keep';
      reason = '未启用删除 → 保守保留本地';
    }

    const rec = { key, moduleId, relPath, action: a.action, effective, applied: false, reason, error: null };
    results.push(rec);

    if (effective === 'import') {
      const abs = resolveAbs(roots, moduleId, relPath);
      const rel = index.paths[key];
      if (!abs) rec.error = `无法确定落点：${key}`;
      else if (!rel) rec.error = `归档清单里没有「${key}」的路径记录`;
      else {
        writes.push({
          rec,
          key,
          abs,
          srcAbs: join(incomingRoot, ...rel.split('/')),
          sha256: index.files[key]?.sha256 ?? null,
          size: index.files[key]?.size ?? null,
        });
      }
    } else if (effective === 'delete') {
      const abs = resolveAbs(roots, moduleId, relPath);
      if (!abs) rec.error = `无法确定落点：${key}`;
      else deletes.push({ rec, key, abs });
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:26-55](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/index.js#L26-L55)

调度与面板连接解耦。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx) {
  // 定时备份的心跳在插件加载时就起，**不等 connection 服务**：
  // 路由是给人点界面用的，而定时备份恰恰要在没人开界面的时候也能跑。
  // 两者解耦，connection 没到位也不影响定时备份。
  const scheduler = createScheduler({
    roots: rootsFromContext(ctx),
    loadSettings,
    runBackup,
    listArchiveDir,
    // 定时备份之后可选自动上传云端（是否真的传由 settings.cloud 的两个开关决定）
    uploadArchive,
    log: (m) => console.log(`[dsh-backup-sync] ${m}`),
  });

  try {
    ctx.effect(() => {
      scheduler.start();
      return () => scheduler.stop();
    }, 'dsh-backup-sync: scheduler');
  } catch (err) {
    console.error(`[dsh-backup-sync] 定时备份心跳启动失败：${err?.message ?? err}`);
  }

  ctx.inject(['connection'], (c) => {
    const connection = c.get('connection');
    const register =
      typeof connection?.fetch?.register === 'function' ? connection.fetch.register.bind(connection.fetch) : undefined;

    if (register === undefined) {
      console.error('[dsh-backup-sync] connection.fetch.register 不可用，备份同步面板的接口未注册');
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些边界会使“不冲掉本地修改”的保证变窄？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最强支持是未裁决冲突保留、写前快照与写后哈希校验；但applyPlan使用传入的旧动作计划写入，写前stat只确认存在和文件类型，片段没有用计划里的ours哈希重新比较目标。因此扫描后其他进程的修改可能失去保护，这属于源码推断的竞态风险，尚未运行复现。写后哈希失败会还原单文件，其他成功文件仍可留下，不能称全批原子恢复。凭据守卫有明确文件名和内容模式，同时内容检查只读至1MiB条件，规则外秘密不能由这些规则保证排除。

#### 证据与依据

**依据 1 · 源码核查**：[lib/apply.js:169-188](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/apply.js#L169-L188)

快照保存当前原件，但没有展示扫描基线重新检查。

<details>
<summary>查看原文（20行）</summary>

```text
  // ── 第二步：先探存在性，再快照（不变量①）
  for (const t of targets) {
    const st = await stat(t.abs).catch(() => null);
    t.existedBefore = Boolean(st?.isFile());
  }

  let snapshotDir = null;
  let snapshotFiles = 0;
  if (snapshot && !dryRun && targets.some((t) => t.existedBefore)) {
    const dir = join(roots.dshHome, 'backup-sync', snapshotDirName(new Date(now)));
    const recorded = [];
    for (const t of targets) {
      if (!t.existedBefore) continue;
      const prefix = prefixForAbs(t.abs, roots);
      if (!prefix) continue; // 不在已知根下，到不了这里；真到了就不快照，绝不乱放
      const dest = join(dir, ...prefix.split('/'));
      await mkdir(dirname(dest), { recursive: true });
      await cp(t.abs, dest);
      t.snapPath = dest;
      snapshotFiles += 1;
```

</details>

**依据 2 · 源码核查**：[lib/apply.js:211-247](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/apply.js#L211-L247)

写入和失败回滚按文件执行。

<details>
<summary>查看原文（37行）</summary>

```text
  // ── 第三步：写（不变量③：写完回算哈希）
  let checked = 0;
  let verifyFailed = 0;

  for (const t of writes) {
    const rec = t.rec;
    if (rec.error) continue;
    if (dryRun) continue;

    const src = await stat(t.srcAbs).catch(() => null);
    if (!src?.isFile()) {
      rec.error = `归档里找不到 ${t.srcAbs}（解包不完整？）`;
      continue;
    }

    const tmp = `${t.abs}.tmp-${randomUUID()}`;
    try {
      await mkdir(dirname(t.abs), { recursive: true });
      await cp(t.srcAbs, tmp);
      await rename(tmp, t.abs);
    } catch (err) {
      await rm(tmp, { force: true });
      rec.error = `写入失败：${err.message}`;
      continue;
    }

    checked += 1;
    const actual = await sha256File(t.abs);
    if (t.sha256 && actual !== t.sha256) {
      verifyFailed += 1;
      // 回滚：有快照就还原，本来不存在就删掉刚写的半成品
      if (t.snapPath) await cp(t.snapPath, t.abs);
      else await rm(t.abs, { force: true });
      rec.error = `写入后哈希不符（期望 ${t.sha256.slice(0, 12)}…，实得 ${actual.slice(0, 12)}…），已回滚`;
      continue;
    }
    rec.applied = true;
```

</details>

**依据 3 · 源码核查**：[lib/guard.js:70-88](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/guard.js#L70-L88)

模式列表及内容检查体积边界。

<details>
<summary>查看原文（19行）</summary>

```text
const SECRET_PATTERNS = [
  { id: '私钥文件头', re: /-----BEGIN [A-Z0-9 ]{0,24}PRIVATE KEY-----/ },
  // 值必须是令牌形态；`_authToken=<YOUR_TOKEN>` 这类占位符不匹配
  { id: 'npm 认证令牌', re: /_auth(?:Token)?\s*=\s*[A-Za-z0-9_-]{16,}/ },
  { id: 'GitHub 令牌', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b/ },
  { id: 'GitHub 细粒度令牌', re: /\bgithub_pat_[A-Za-z0-9_]{30,}\b/ },
  { id: 'OpenAI 风格密钥', re: /\bsk-[A-Za-z0-9_-]{24,}\b/ },
  { id: 'AWS Access Key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: 'Slack 令牌', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/ },
  // JWT 的第三段（签名）在日志里常被截掉，所以签名段可选。
  // `eyJ` 是 `{"` 的 base64，出现两段基本就是 JWT，误报率极低。
  { id: 'JWT', re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.?/ },
  // 同样要求真令牌形态，挡住 `x-access-token:<token>@`
  { id: '带令牌的 git 地址', re: /https?:\/\/x-access-token:[A-Za-z0-9_-]{20,}@/ },
  { id: '字面量 Bearer 令牌', re: /\bBearer\s+[A-Za-z0-9._-]{24,}/ },
];

/** 内容闸的体积上限：凭据都是小文件，巨型文件不读全文（只用文件名闸兜）。 */
export const MAX_GUARD_BYTES = 1024 * 1024;
```

</details>

#### 缺口

- 扫描与执行之间并发修改是否实际被上层锁完全排除未确认。
  **影响**：不能给出不覆盖新修改的无条件保证。
  **进一步探讨**：核对上层互斥并进行扫描后外部改写的故障注入，检查冲突和副本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次可恢复备份包含哪些持续与失败成本？

**研究主题**：效果与总成本

#### 完整回答

按一个选定模块集能在目标机复原并核对为合格任务。首次需要路径和模块选择、磁盘以及tar；持续备份涉及扫描、归档、保留多版本，云端额外使用空间和流量。恢复还包括差异复核、冲突裁决和失败后逐文件核对，不应只算打包时间。预恢复副本额外占空间，并不等于免人工恢复。源码没有给同负载现金和耗时样本，因此无法计算合格交付单位成本，也不把零npm依赖等同于零运维成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:114-140](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/README.md#L114-L140)

安装前提、备份和裁决步骤，支持负担分类。

<details>
<summary>查看原文（27行）</summary>

```text
要求：DSH `0.2.0-rc.2`，Node.js ≥ 22。零 npm 运行时依赖（只用 Node 内置模块 + 平台提供的 `react`；打包那一步调用系统自带的 `tar`）。

## 界面

入口在 **设置 → 备份同步**（与「插件」「技能」并列），四个页签：

| 备份 | 历史版本 |
| --- | --- |
| ![备份](docs/images/01-backup.png) | ![历史版本](docs/images/02-history.png) |

| 导入 | 同步 |
| --- | --- |
| ![导入](docs/images/03-import.png) | ![同步](docs/images/04-sync.png) |

- **备份**：勾模块 → 填输出目录 → 打一个包（可选打包前跑校验）。
  卡片展开后给的是**人话清单**，不是文件路径：技能卡一行一个技能，插件卡一行一个插件
  （显示名 / 真正装上的版本 / `已启用 · 仅依赖 · 未安装 · 内置 · 本地目录` 徽标，悬停看说明、
  单击开详情、双击复制包名），文件明细退成旁边一条「查看 N 个文件」。
- **历史版本**：列出输出目录里的包（时间、体积、来源机器、模块数、文件数），
  可就地**校验**（比对 sha256）、**导入**、**复制路径**。
- **导入**：选一个包 → 扫描 → 逐文件差异预览（新增 / 修改 / 删除 / 冲突）→ 逐项裁决 → 应用。
  应用前自动把当前状态快照到 `<输出目录>/pre-restore-<时间戳>/`。
  「备份包」下拉分**本机**与**云端（WebDAV）**两组，云端每项标着「本机已有 / 本机没有」；
  挑云端那份点「分析差异」时**本机没有的会自动下载**（本机已有就跳过，不白下几百 MB）。
- **同步**：把包推到「同步目录」（OneDrive / 坚果云 / 群晖 / U 盘都行），带 sha256 校验。
  下面还有一张**云端（WebDAV）**卡片：填地址 / 账号 / 口令 / 远端目录 →「保存并测试连接」→
  上传 / 列出远端 / 下载到本机 / 删远端（详见[云端备份](#云端备份webdav)）。
```

</details>

**依据 2 · 源码核查**：[lib/apply.js:175-188](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/apply.js#L175-L188)

覆盖前复制带来额外磁盘与I/O。

<details>
<summary>查看原文（14行）</summary>

```text
  let snapshotDir = null;
  let snapshotFiles = 0;
  if (snapshot && !dryRun && targets.some((t) => t.existedBefore)) {
    const dir = join(roots.dshHome, 'backup-sync', snapshotDirName(new Date(now)));
    const recorded = [];
    for (const t of targets) {
      if (!t.existedBefore) continue;
      const prefix = prefixForAbs(t.abs, roots);
      if (!prefix) continue; // 不在已知根下，到不了这里；真到了就不快照，绝不乱放
      const dest = join(dir, ...prefix.split('/'));
      await mkdir(dirname(dest), { recursive: true });
      await cp(t.abs, dest);
      t.snapPath = dest;
      snapshotFiles += 1;
```

</details>

#### 缺口

- 没有统一资产规模下的耗时、磁盘峰值与云端账单。
  **影响**：不能量化节省或成本回收。
  **进一步探讨**：按固定目录规模记录全次备份、恢复和一次失败补救的资源与人工时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否把目标哈希绑定到可复验恢复计划？

**研究主题**：新假设与验证

#### 完整回答

三方分类已给出每项base、ours、theirs，为覆盖前重新验证提供现成前提。未验证假设是把ours作为执行前置条件，并为每项动作保存状态日志；目标漂移时拒绝执行、要求重新预览，可能降低扫描后并发写入的覆盖风险。新增代价是额外哈希I/O、部分状态日志及中断清理。最小比较在相同归档上插入目标改写与进程中断，观察静默覆盖数、人工恢复步数和重跑幂等性。出现未提示覆盖或日志无法重建状态就削弱假设，不把这一设计记作当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/diff.js:136-149](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/diff.js#L136-L149)

动作已携带三方哈希。

<details>
<summary>查看原文（14行）</summary>

```text
    const b = shaOf(baseline, key);
    const o = shaOf(current, key);
    const t = shaOf(incoming, key);

    const { action, reason } = classify(b, o, t, allowDelete);
    actions.push({ key, moduleId, relPath, action, reason, base: b, ours: o, theirs: t });
    counts[action] += 1;
  }

  return {
    actions,
    counts,
    conflicts: actions.filter((a) => a.action === 'conflict'),
    pending: actions.filter((a) => a.action === 'import' || a.action === 'delete'),
```

</details>

**依据 2 · 源码核查**：[lib/apply.js:211-247](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/apply.js#L211-L247)

现有写入边界提供可插入校验的位置。

<details>
<summary>查看原文（37行）</summary>

```text
  // ── 第三步：写（不变量③：写完回算哈希）
  let checked = 0;
  let verifyFailed = 0;

  for (const t of writes) {
    const rec = t.rec;
    if (rec.error) continue;
    if (dryRun) continue;

    const src = await stat(t.srcAbs).catch(() => null);
    if (!src?.isFile()) {
      rec.error = `归档里找不到 ${t.srcAbs}（解包不完整？）`;
      continue;
    }

    const tmp = `${t.abs}.tmp-${randomUUID()}`;
    try {
      await mkdir(dirname(t.abs), { recursive: true });
      await cp(t.srcAbs, tmp);
      await rename(tmp, t.abs);
    } catch (err) {
      await rm(tmp, { force: true });
      rec.error = `写入失败：${err.message}`;
      continue;
    }

    checked += 1;
    const actual = await sha256File(t.abs);
    if (t.sha256 && actual !== t.sha256) {
      verifyFailed += 1;
      // 回滚：有快照就还原，本来不存在就删掉刚写的半成品
      if (t.snapPath) await cp(t.snapPath, t.abs);
      else await rm(t.abs, { force: true });
      rec.error = `写入后哈希不符（期望 ${t.sha256.slice(0, 12)}…，实得 ${actual.slice(0, 12)}…），已回滚`;
      continue;
    }
    rec.applied = true;
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户值得受控试用，什么结果应停止？

**研究主题**：采用判断

#### 完整回答

已有独立副本、懂得检查冲突的多机用户可先试技能模块，避免直接在唯一生产资产上首次恢复。准备新增、仅本地修改、双方冲突和未选模块四类文件，验证归档校验、裁决、快照还原以及重复导入结果；成功是内容与选定决策一致且未选模块不变。尚不适合要求无人工值守、跨机强一致同步的人。若出现未提示覆盖、凭据入包、失败后快照不可还原，立即停止扩大范围。源码检查只支持这一有限试用路径，不支持持续安装验收结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/diff.js:50-86](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/diff.js#L50-L86)

定义用来验收的冲突分支。

<details>
<summary>查看原文（37行）</summary>

```text
function classify(b, o, t, allowDelete) {
  // —— 基线里没有：要么单边新增，要么双方各自新增
  if (b === null) {
    if (o === null) return { action: 'import', reason: '归档新增，本地没有' };
    if (t === null) return { action: 'keep', reason: '本地新增，归档没有' };
    return o === t
      ? { action: 'same', reason: '双方各自新增，内容一致' }
      : { action: 'conflict', reason: '双方各自新增了同名但内容不同的文件' };
  }

  // —— 基线里有，但两边都没了
  if (o === null && t === null) return { action: 'same', reason: '双方都已删除' };

  // —— 本地删了
  if (o === null) {
    return t === b
      ? { action: 'keep', reason: '本地已删除，归档未改动 → 保持删除' }
      : { action: 'conflict', reason: '本地已删除，但归档改了它 → 需裁决' };
  }

  // —— 归档里删了
  if (t === null) {
    if (o !== b) return { action: 'conflict', reason: '归档已删除，但本地改了它 → 需裁决' };
    return allowDelete
      ? { action: 'delete', reason: '归档已删除，本地未改动 → 跟随删除' }
      : { action: 'keep', reason: '归档已删除，本地未改动（未启用删除，保守保留）' };
  }

  // —— 三方都在
  const oursChanged = o !== b;
  const theirsChanged = t !== b;
  if (!oursChanged && !theirsChanged) return { action: 'same', reason: '双方都没动' };
  if (!oursChanged && theirsChanged) return { action: 'import', reason: '只有归档改了 → 导入' };
  if (oursChanged && !theirsChanged) return { action: 'keep', reason: '只有本地改了 → 保留本地' };
  return o === t
    ? { action: 'same', reason: '双方都改成了同一结果' }
    : { action: 'conflict', reason: '双方都改了 → 需裁决' };
```

</details>

**依据 2 · 源码核查**：[lib/apply.js:125-139](https://github.com/Arlenman/dsh-backup-sync/blob/9baff601ee5d086f2ee2e078227bb7617138abfd/lib/apply.js#L125-L139)

保守默认值支撑受控恢复策略。

<details>
<summary>查看原文（15行）</summary>

```text
    if (a.action === 'conflict') {
      const r = resolutions[key];
      if (r === 'archive') {
        effective = 'import';
        reason = '冲突裁决：采用归档版本';
      } else if (r === 'local') {
        effective = 'keep';
        reason = '冲突裁决：保留本地版本';
      } else {
        effective = 'keep';
        reason = '冲突未裁决 → 保留本地（安全默认）';
      }
    } else if (a.action === 'delete' && !allowDelete) {
      effective = 'keep';
      reason = '未启用删除 → 保守保留本地';
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
