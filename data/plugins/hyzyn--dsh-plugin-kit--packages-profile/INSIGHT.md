# @hyzyn/dsh-profile

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 3,253](https://img.shields.io/static/v1?label=npm+30d&message=3%2C253&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-profile) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-profile)
<!-- END META -->

> **功能**：在 DSH Web 中查看、创建、复制、重命名和删除 profile，并生成带端口的启动命令。

> **亮点**：已有贡献是把模板、目录操作和命令生成收在一张管理卡片，降低操作分散；依赖安装与profile机制归上游工具，未证明管理更快或无损，见 [Q01](#research-q01)。

> **主要限制**：复制目标若已存在但没有package.json，会被recursive mkdir后错误标为本次创建，后续安装或复制失败可能递归删除原有目录。改名也会吞manifest更新失败，故管理成功与无损不等价；触发条件和未复现边界见 [Q02](#research-q02)。

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
  - [Q01 · 谁需要profile卡片，增量属于哪一步？](#detail-section-11)
  - [Q02 · 创建、复制、改名如何落盘，失败能否无损？](#detail-section-12)
  - [Q03 · 路由权限、删除确认和端口生效边界是什么？](#detail-section-13)
  - [Q04 · 全周期成本与采用条件是什么？](#detail-section-14)
  - [Q05 · 可从失败路径推导什么改进假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要维护多个DSH运行环境的人可通过卡片组织profile目录与启动参数；合格结果要求目录与manifest一致，失败不影响既有内容，见 [Q01](#research-q01)。

原办法是DSH CLI与手工维护各profile的manifest、patch和启动参数。插件增加图形入口与模板，不替代宿主加载和实际监听端口验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 查看profile | 列表显示目录、bundle与端口 | initialized仅依manifest存在，不代表能运行 |
| 模板创建 | 写基本profile文件 | 可写目录，部分失败需核查 |
| 复制与重命名 | 组织多环境目录 | 回滚与manifest更新不具完整事务保证 |
| 端口与命令复制 | 生成启动参数 | 不检测占用、不直接改运行中监听 |
| 删除 | 递归移除profile | 不可撤销，UI确认不是API层批准票据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19.0、兼容DSH、React与共享kit | 启动必需 | Host和管理卡片 | package声明不等于本轮运行验收 |
| 可写DSH_HOME/profiles | 变更必需 | profile目录与配置读写 | 操作失败可能留下部分状态 |
| pnpm与依赖网络 | 复制后安装必需 | 重建依赖 | 无此处超时，失败触发目录回滚 |
| 完整目录备份 | 有价值环境操作前必需 | 失败恢复 | 不应只依赖面板成功与回滚声明 |
| 可用且独立端口 | 同跑实例必需 | 实际启动服务 | 插件仅记录端口，不探测占用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认DSH_HOME并备份全部目标目录 | 目标即使无manifest也不能当可丢弃 |
| 加载 | 客户端卡片连接本机管理路由 | 列表只说明可读，不说明可安全变更 |
| 观察 | 用户核对列表、模板和启动命令 | 暂缓复制有价值目录 |
| 后续验证 | 在独立可丢弃根中检查失败矩阵 | 既有内容不变才可进一步评估 |
| 退出 | 停用管理入口并改回CLI | 从备份恢复部分完成目录，核对实际端口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 插件与备份存储，金额未知 | 确认路径、备份及核对profile格式，耗时未知 | 不能把未初始化目录当空目录 |
| 持续使用 | 新profile依赖、pnpm网络与磁盘，量未知 | 维护版本、端口及机器资源冲突 | 跳过lockfile不保证复制相同依赖解析 |
| 失败恢复 | 可能的数据恢复与安装进程资源，金额未知 | 恢复目录、manifest并查部分完成 | 无损回滚不普遍成立 |
| 退出 | 备份保留资源未知 | 回原CLI并核对启动参数 | 停用不自动修复已变更目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 管理便利 | 模板与命令生成已实现 | 相对CLI净节时 |
| 复制恢复 | 已初始化目标提前拒绝 | 无manifest既有目录可能被失败回滚删除 |
| 启动端口 | 写文件并拼入命令 | 占用检测、实际监听及其他资源冲突 |

> **思考**：复制目标若已存在但没有package.json，会被recursive mkdir后错误标为本次创建，后续安装或复制失败可能递归删除原有目录。改名也会吞manifest更新失败，故管理成功与无损不等价；触发条件和未复现边界见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：已有贡献是把模板、目录操作和命令生成收在一张管理卡片，降低操作分散；依赖安装与profile机制归上游工具，未证明管理更快或无损，见 [Q01](#research-q01)。

名称白名单和本机围栏比裸目录接口更明确，但用manifest存在性判断目录所有权不充分；created标记并不能证明recursive mkdir真的创建了新目录。改名吞错与安装无本地截止时间增加排障责任，见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

复制目标若已存在但没有package.json，会被recursive mkdir后错误标为本次创建，后续安装或复制失败可能递归删除原有目录。改名也会吞manifest更新失败，故管理成功与无损不等价；触发条件和未复现边界见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先完整备份profiles根，暂缓在有价值目录上使用复制和改名管理。目标已有文件即使无package.json也应停下；安装久等或目录/manifest不一致时保留错误材料，用CLI与备份恢复。可丢弃环境的后续验证条件见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

模板和目录管理链路有源码支持；复制失败的数据保全存在具体静态缺口，未运行复现。暂存发布为研究者未验证设计，不是插件已有机制。

- 已检查：作者 README、包清单、源码路径 packages/profile/README.md、packages/profile/package.json、packages/profile/cordis.patch.yml、packages/profile/src/index.ts、packages/profile/lib/index.js、packages/profile/client.js 及固定范围 inventory；组件：packages/profile。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已读本组件Host TS全部逻辑，定向核对发布lib复制/回滚分支、客户端操作与确认/命令生成、README、package与补丁。完整统计由INVENTORY提供；未核对宿主profile加载源码。
- 下一步：- 已检查固定版本源码。
- 未运行插件、pnpm、profile变更或宿主验收。
- 回滚误删是按明确输入条件推导的静态缺陷，未执行复现。
- 作者无损复制表述不视为本轮验证结果。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.2.15（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是独占暂存目录完成复制、安装与manifest校验后再原子发布，只回滚自己持有的暂存目录。它针对目录所有权错误，不能仅靠增加确认解决，验证与否定条件见 [Q05](#research-q05)。

- 已检查固定版本源码。
- 未运行插件、pnpm、profile变更或宿主验收。
- 回滚误删是按明确输入条件推导的静态缺陷，未执行复现。
- 作者无损复制表述不视为本轮验证结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1311 | 1135 | 134 | — |
| .md | source | 2 | 189 | — | — | 2054 |
| .ts | source | 1 | 622 | 522 | 64 | — |
| .ts | test | 1 | 286 | 210 | 42 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：可视化管理profile是否减少手工配置负担，同时守住复制失败与目录变更的数据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要profile卡片，增量属于哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向需要在同一台DSH主机维护web、headless等多个profile，又不想手工组织目录和启动参数的人。原办法是使用DSH命令或编辑每个profile的package、patch与工作区文件；合格结果是目录内容、manifest名称和实际启动选择一致，复制失败不伤已有内容。插件提供模板化目录操作和启动命令复制，属于操作入口与配置组织增量，没有改变宿主profile加载机制。

端口信息单独保存在profile.runtime.json，客户端拼进复制出的dsh --profile命令。它没有在此处启动服务，也没有检测端口占用，因此“保存端口”不等于运行实例已经换端口。对只用一个稳定profile的人，额外管理层可能不如既有CLI简单；是否更省时间没有本轮对照。

#### 证据与依据

**依据 1 · 作者声明**：[packages/profile/README.md:5-12](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/README.md#L5-L12)

作者定位profile可视化与端口记录。

```text
> DSH 的「Profile 管理」卡片：查看、创建、复制、重命名、删除 DSH profile，不用记命令。

## 特性

- **模板化创建，不手抄清单**：三种模板一键创建（`@deepseek-ai/dsh-base` 仅核心，或再加 `dsh-web-app` / `dsh-headless`）；复制跳过 `node_modules` 与 lockfile 并自动 `pnpm install`。
- **端口随 profile 落盘**：为每个 profile 记录启动端口，复制出的启动命令自动带 `--port`，多个 web profile 不再撞端口。
- **重命名同步目录与 manifest**：一次操作同时完成目录移动与 `package.json` 改名；删除在面板内二次确认（不可撤销）。
- **状态与结构直读**：初始化徽章、bundle 层、依赖数、目录路径；缺 `cordis.patch.yml` 会提示。
```

**依据 2 · 源码核查**：[packages/profile/src/index.ts:150-196](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L150-L196)

模板生成manifest和补丁/工作区文件。

<details>
<summary>查看原文（47行）</summary>

```text
  const dir = profileDir(name)
  ensureProfilesRoot()
  if (existsSync(join(dir, 'package.json'))) {
    throw new Error('profile 已存在: ' + name)
  }
  mkdirSync(dir, { recursive: true })
  const bundles = (template !== undefined && PROFILE_TEMPLATES[template] !== undefined)
    ? PROFILE_TEMPLATES[template]
    : DEFAULT_BUNDLES
  const manifest = {
    name: `dsh-profile-${name}`,
    private: true,
    dependencies: {},
    dsh: {
      profile: {
        bundles,
      },
    },
  }
  writeFileSync(join(dir, 'package.json'), JSON.stringify(manifest, null, 2) + '\n')
  const patchPath = join(dir, 'cordis.patch.yml')
  if (!existsSync(patchPath)) {
    writeFileSync(
      patchPath,
      [
        '# Your patch layer for this dsh profile, applied after every bundle layer:',
        '# a top-level YAML array of loader patch entries (id-targeted config',
        '# overrides, disables, and insert lists; `!!js` expressions allowed).',
        '',
        '[]',
        '',
      ].join('\n'),
    )
  }
  const workspacePath = join(dir, 'pnpm-workspace.yaml')
  if (!existsSync(workspacePath)) {
    writeFileSync(
      workspacePath,
      [
        'packages:',
        '  - .',
        '',
        'nodeLinker: hoisted',
        'autoInstallPeers: false',
        '',
      ].join('\n'),
    )
```

</details>

**依据 3 · 源码核查**：[packages/profile/client.js:539-552](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/client.js#L539-L552)

端口进入复制命令，不直接启动进程。

<details>
<summary>查看原文（14行）</summary>

```text
      if (action === 'copy-command') {
        if (!name) return
        const profile = state.profiles.find((item) => item.name === name)
        const port = profile && profile.port != null ? ' --port ' + profile.port : ''
        const cmd = 'dsh --profile ' + name + port
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cmd).then(() => {
            toast(t('msg.copiedCommand', { cmd }), 'ok')
          }).catch(() => {
            window.prompt(t('btn.copyCommand'), cmd)
          })
        } else {
          window.prompt(t('btn.copyCommand'), cmd)
        }
```

</details>

#### 缺口

- 缺少多profile管理的真实任务耗时对照。
  **影响**：不能量化可视化相对CLI的收益。
  **进一步探讨**：比较创建相同环境与恢复错误配置的完整耗时及误操作。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 创建、复制、改名如何落盘，失败能否无损？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

创建会写manifest和缺失的补丁/工作区文件；复制跳过node_modules与lockfile，再改manifest名称并调用pnpm install。路由用created标记决定安装失败是否删除目标目录，这比无条件删除已初始化目标多了一道保护，但“要么成功要么没发生”的作者描述并不普遍成立。

具体触发条件是目标目录已经存在却没有package.json。copyProfile只检查目标manifest是否存在，随后recursive mkdir在已有目录上成功，也照样调用onCreated将它标为本次创建；一旦复制或pnpm安装失败，catch就递归删除整个目标目录，包括原有文件。该判断来自实际TS与发布lib一致的分支，未执行复现，不能把它扩大为每次复制都丢数据。正常不存在的目标和已有完整manifest的目标走不同分支，后者会被提前拒绝。

重命名先移动目录，再尝试改manifest；后一步失败被吞掉，所以目录名与manifest名可能不一致却返回成功。复制时改manifest失败也不阻塞安装。pnpm子进程没有本地超时和输出缓存上限，网络或安装挂起会让请求等待；这是额外的恢复负担，而不是已测出一定挂起。

#### 证据与依据

**依据 1 · 源码核查**：[packages/profile/src/index.ts:245-283](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L245-L283)

只检查目标package.json，recursive mkdir后无条件onCreated，复制后安装。

<details>
<summary>查看原文（39行）</summary>

```text
  const dest = profileDir(target)
  /*
   * 两条前置校验放在 try 外面（调用方也不再对它们做回滚）：它们失败时**目标目录
   * 可能是用户早就存在的那个**，删它就是数据丢失。顺序也重要——先判源、再判目标，
   * 否则「源不存在 + 目标存在」会先报目标已存在，掩盖真正的原因。
   */
  if (!existsSync(join(src, 'package.json'))) {
    throw new Error('源 profile 不存在或未初始化: ' + source)
  }
  if (existsSync(join(dest, 'package.json'))) {
    throw new Error('目标 profile 已存在: ' + target)
  }
  ensureProfilesRoot()
  mkdirSync(dest, { recursive: true })
  // 从这一刻起目录是「本次请求建的」：此后任何失败都可以安全回滚
  onCreated?.()
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'pnpm-lock.yaml') continue
    const from = join(src, entry.name)
    const to = join(dest, entry.name)
    if (entry.isDirectory()) {
      cpSync(from, to, { recursive: true })
    } else {
      cpSync(from, to)
    }
  }
  const manifestPath = join(dest, 'package.json')
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { name?: string }
      manifest.name = `dsh-profile-${target}`
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    } catch {
      /* 复制后改名失败不阻塞，目录仍可用 */
    }
  }
  await installProfileDependencies(dest)
}
```

</details>

**依据 2 · 源码核查**：[packages/profile/src/index.ts:465-490](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L465-L490)

created为true时失败递归删除目标。

<details>
<summary>查看原文（26行）</summary>

```text
         * 原先这里无条件 `rmSync(profileDir(name), { recursive: true, force: true })`。
         * 而 `copyProfile` 会在**创建任何东西之前**抛出两条前置校验（源不存在 /
         * 目标已存在）——于是「把目标名填成一个已存在的 profile」这种最常见的误操作，
         * 结果是**用户那个 profile 被整目录删掉**（package.json、bundle 列表、自己的
         * cordis.patch.yml、端口配置、node_modules 全没），同时还绕过了 `deleteProfile`
         * 对 `web` 的保护。接口返回 400，看起来像「被拒绝了」，用户不会意识到目录已经没了。
         *
         * 现在的判据是「这个目录是不是**我**建的」：
         *   - 前置校验在 copyProfile 里、且在 mkdir 之前 → 抛错时目标目录没被动过，`created` 为 false；
         *   - mkdir 成功之后才置 `created = true`，此后任何失败（复制中途、装依赖）都回滚。
         */
        let created = false
        try {
          // copyProfile 在 mkdir 之前就抛的前置校验，此时目标目录一个字节都没动
          await copyProfile(from, name, () => { created = true })
        } catch (error) {
          if (created) {
            try {
              rmSync(profileDir(name), { recursive: true, force: true })
            } catch {
              /* 回滚失败不改变响应：错误原因仍然要如实回给用户 */
            }
          }
          writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          return
        }
```

</details>

**依据 3 · 源码核查**：[packages/profile/lib/index.js:215-225](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/lib/index.js#L215-L225)

发布入口同样以manifest判断并标记目录创建。

<details>
<summary>查看原文（11行）</summary>

```text
     */
    if (!existsSync(join(src, 'package.json'))) {
        throw new Error('源 profile 不存在或未初始化: ' + source);
    }
    if (existsSync(join(dest, 'package.json'))) {
        throw new Error('目标 profile 已存在: ' + target);
    }
    ensureProfilesRoot();
    mkdirSync(dest, { recursive: true });
    // 从这一刻起目录是「本次请求建的」：此后任何失败都可以安全回滚
    onCreated?.();
```

</details>

**依据 4 · 源码核查**：[packages/profile/lib/index.js:437-450](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/lib/index.js#L437-L450)

发布入口同样递归回滚目录。

<details>
<summary>查看原文（14行）</summary>

```text
                    // copyProfile 在 mkdir 之前就抛的前置校验，此时目标目录一个字节都没动
                    await copyProfile(from, name, () => { created = true; });
                }
                catch (error) {
                    if (created) {
                        try {
                            rmSync(profileDir(name), { recursive: true, force: true });
                        }
                        catch {
                            /* 回滚失败不改变响应：错误原因仍然要如实回给用户 */
                        }
                    }
                    writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) });
                    return;
```

</details>

**依据 5 · 源码核查**：[packages/profile/src/index.ts:296-318](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L296-L318)

先移动目录，manifest更新失败被捕获忽略。

<details>
<summary>查看原文（23行）</summary>

```text

function renameProfile(oldName: string, newName: string): void {
  const oldDir = profileDir(oldName)
  const newDir = profileDir(newName)
  if (!existsSync(oldDir)) {
    throw new Error('profile 不存在: ' + oldName)
  }
  if (existsSync(newDir)) {
    throw new Error('目标 profile 已存在: ' + newName)
  }
  ensureProfilesRoot()
  renameSync(oldDir, newDir)
  const manifestPath = join(newDir, 'package.json')
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { name?: string }
      manifest.name = `dsh-profile-${newName}`
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    } catch {
      /* 改名后更新 manifest 失败不阻塞，目录已移动 */
    }
  }
}
```

</details>

**依据 6 · 源码核查**：[packages/profile/src/index.ts:206-229](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L206-L229)

pnpm install收集输出并等待close，没有此处超时。

<details>
<summary>查看原文（24行）</summary>

```text
 * `ENOENT`，于是「复制 Profile」在 Windows 上**一定失败**（与已修的
 * codegraph / mcp 是同一类缺陷）。
 */
async function installProfileDependencies(dir: string): Promise<void> {
  const outcome = await new Promise<{ code: number | null; error?: string; output: string }>((resolve) => {
    let child: ReturnType<typeof spawnPortable>
    try {
      child = spawnPortable('pnpm', ['install'], { cwd: dir })
    } catch (error) {
      resolve({ code: null, error: error instanceof Error ? error.message : String(error), output: '' })
      return
    }
    let output = ''
    child.stdout?.on('data', (chunk: Buffer) => (output += chunk.toString()))
    child.stderr?.on('data', (chunk: Buffer) => (output += chunk.toString()))
    child.on('error', (error: Error) => resolve({ code: null, error: error.message, output }))
    child.on('close', (code: number | null) => resolve({ code, output }))
  })
  if (outcome.error !== undefined) throw new Error('复制后安装依赖失败: ' + outcome.error)
  if (outcome.code !== 0) {
    const detail = outcome.output.trim()
    throw new Error('复制后安装依赖失败（pnpm 退出码 ' + String(outcome.code) + '）' + (detail ? ': ' + detail.slice(-600) : ''))
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路由权限、删除确认和端口生效边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

路由仅接受环回地址、限定Host、拒绝cross-site并在存在Origin时核对同源，再验证HTTP方法和JSON体。名称使用白名单并拒绝保留名，减少路径逃逸，但这是本地访问围栏，不是多用户授权系统；同机有能力发请求的进程仍可调用管理接口。

删除会递归删除目录，只明确保护web名称；面板有window.confirm，服务端delete只需要name，没有单次确认票据，也未检查目标是否正被另一个运行中的宿主使用。因此“面板二次确认”不能泛化为API层不可绕过的批准或运行态保护。端口文件只保存数值且不探测占用，复制会连同该文件一起复制，必须在新实例启动前主动换端口并验证实际监听。

#### 证据与依据

**依据 1 · 源码核查**：[packages/profile/src/index.ts:335-356](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L335-L356)

本机与同源围栏的实际条件。

<details>
<summary>查看原文（22行）</summary>

```text

function isLoopbackRequest(request: ReqLike): boolean {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
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

**依据 2 · 源码核查**：[packages/profile/src/index.ts:51-55](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L51-L55)

名称白名单。

```text

function isValidProfileName(name: unknown): name is string {
  if (typeof name !== 'string') return false
  const trimmed = name.trim()
  return PROFILE_NAME_RE.test(trimmed) && !RESERVED_PROFILE_NAMES.has(trimmed)
```

**依据 3 · 源码核查**：[packages/profile/src/index.ts:284-294](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L284-L294)

删除递归及web名称保护。

<details>
<summary>查看原文（11行）</summary>

```text

function deleteProfile(name: string): void {
  if (PROTECTED_PROFILE_NAMES.has(name)) {
    throw new Error('默认 profile 不能删除: ' + name)
  }
  const dir = profileDir(name)
  if (!existsSync(dir)) {
    throw new Error('profile 不存在: ' + name)
  }
  rmSync(dir, { recursive: true, force: true })
}
```

</details>

**依据 4 · 源码核查**：[packages/profile/src/index.ts:554-577](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L554-L577)

服务端delete直接按name操作。

<details>
<summary>查看原文（24行）</summary>

```text
      },
    },


    {
      kind: 'exact',
      path: '/api/dsh-profile/delete',
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        const body = await readJsonBody(req)
        if (body === undefined) {
          writeJson(res, 400, { error: 'invalid JSON body' })
          return
        }
        const name = typeof body.name === 'string' ? body.name.trim() : ''
        if (!isValidProfileName(name)) {
          writeJson(res, 400, { error: '非法 profile 名称: ' + JSON.stringify(name) })
          return
        }
        try {
          deleteProfile(name)
        } catch (error) {
          writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          return
```

</details>

**依据 5 · 源码核查**：[packages/profile/client.js:563-567](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/client.js#L563-L567)

二次确认在客户端。

```text
      if (action === 'delete') {
        if (!name) return
        if (!window.confirm(t('confirm.delete', { name }))) return
        run(() => apiDelete(name), t('msg.deleted', { name }), t('msg.deleting'))
      }
```

**依据 6 · 源码核查**：[packages/profile/src/index.ts:69-76](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L69-L76)

端口文件仅写入JSON。

```text
function writeProfileRuntime(name: string, port: number | null): void {
  const file = runtimeFilePath(name)
  if (port === null) {
    if (existsSync(file)) rmSync(file, { force: true })
    return
  }
  writeFileSync(file, JSON.stringify({ port }, null, 2) + '\n')
}
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 全周期成本与采用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议观察，暂缓把它用于有价值的profile复制和批量管理。核心价值是减少手工步骤，但复制回滚在未初始化的已有目录上可能删除原文件，改名也不是manifest与目录的事务；这两项触及管理结果的可靠性。想继续评估的人必须能完整备份profiles根，并先在与真实环境分开的可丢弃目录中核对失败路径；不能把这种未来验证描述为本轮已经安全试用。

首次成本是安装、确认DSH_HOME指向和备份；持续成本包括新增profile依赖、pnpm网络和存储，以及端口、机器资源与版本漂移的维护。复制跳过lockfile意味着依赖重建不保证与源解析结果一致。失败恢复可能涉及从备份找回目录、核对manifest及停止等待中的安装进程，金额、空间和人工时间均未测。看到安装长时间未结束、目录内容变化超出预期或改名后不一致时应停止管理操作，保留错误材料并用原CLI和备份恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/profile/src/index.ts:245-283](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L245-L283)

复制重建依赖与目标目录所有权边界。

<details>
<summary>查看原文（39行）</summary>

```text
  const dest = profileDir(target)
  /*
   * 两条前置校验放在 try 外面（调用方也不再对它们做回滚）：它们失败时**目标目录
   * 可能是用户早就存在的那个**，删它就是数据丢失。顺序也重要——先判源、再判目标，
   * 否则「源不存在 + 目标存在」会先报目标已存在，掩盖真正的原因。
   */
  if (!existsSync(join(src, 'package.json'))) {
    throw new Error('源 profile 不存在或未初始化: ' + source)
  }
  if (existsSync(join(dest, 'package.json'))) {
    throw new Error('目标 profile 已存在: ' + target)
  }
  ensureProfilesRoot()
  mkdirSync(dest, { recursive: true })
  // 从这一刻起目录是「本次请求建的」：此后任何失败都可以安全回滚
  onCreated?.()
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'pnpm-lock.yaml') continue
    const from = join(src, entry.name)
    const to = join(dest, entry.name)
    if (entry.isDirectory()) {
      cpSync(from, to, { recursive: true })
    } else {
      cpSync(from, to)
    }
  }
  const manifestPath = join(dest, 'package.json')
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { name?: string }
      manifest.name = `dsh-profile-${target}`
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    } catch {
      /* 复制后改名失败不阻塞，目录仍可用 */
    }
  }
  await installProfileDependencies(dest)
}
```

</details>

**依据 2 · 源码核查**：[packages/profile/src/index.ts:296-318](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L296-L318)

改名部分完成路径。

<details>
<summary>查看原文（23行）</summary>

```text

function renameProfile(oldName: string, newName: string): void {
  const oldDir = profileDir(oldName)
  const newDir = profileDir(newName)
  if (!existsSync(oldDir)) {
    throw new Error('profile 不存在: ' + oldName)
  }
  if (existsSync(newDir)) {
    throw new Error('目标 profile 已存在: ' + newName)
  }
  ensureProfilesRoot()
  renameSync(oldDir, newDir)
  const manifestPath = join(newDir, 'package.json')
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { name?: string }
      manifest.name = `dsh-profile-${newName}`
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    } catch {
      /* 改名后更新 manifest 失败不阻塞，目录已移动 */
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[packages/profile/src/index.ts:206-229](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L206-L229)

依赖安装消耗与等待。

<details>
<summary>查看原文（24行）</summary>

```text
 * `ENOENT`，于是「复制 Profile」在 Windows 上**一定失败**（与已修的
 * codegraph / mcp 是同一类缺陷）。
 */
async function installProfileDependencies(dir: string): Promise<void> {
  const outcome = await new Promise<{ code: number | null; error?: string; output: string }>((resolve) => {
    let child: ReturnType<typeof spawnPortable>
    try {
      child = spawnPortable('pnpm', ['install'], { cwd: dir })
    } catch (error) {
      resolve({ code: null, error: error instanceof Error ? error.message : String(error), output: '' })
      return
    }
    let output = ''
    child.stdout?.on('data', (chunk: Buffer) => (output += chunk.toString()))
    child.stderr?.on('data', (chunk: Buffer) => (output += chunk.toString()))
    child.on('error', (error: Error) => resolve({ code: null, error: error.message, output }))
    child.on('close', (code: number | null) => resolve({ code, output }))
  })
  if (outcome.error !== undefined) throw new Error('复制后安装依赖失败: ' + outcome.error)
  if (outcome.code !== 0) {
    const detail = outcome.output.trim()
    throw new Error('复制后安装依赖失败（pnpm 退出码 ' + String(outcome.code) + '）' + (detail ? ': ' + detail.slice(-600) : ''))
  }
}
```

</details>

**依据 4 · 源码核查**：[packages/profile/package.json:6-40](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/package.json#L6-L40)

运行时和共享kit依赖声明。

<details>
<summary>查看原文（35行）</summary>

```text
  "engines": {
    "node": ">=22.19.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "engines": {
      "dsh": ">=0.1.7-rc.2"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": "^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.0-rc.2 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-alpha.5 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.3 || ^0.2.2-rc.1",
    "react": "^18.2.0"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4",
    "@hyzyn/dsh-kit": "0.8.0"
  },
  "devDependencies": {
```

</details>

#### 缺口

- 没有实际失败恢复、依赖解析一致性和管理收益的对照结果。
  **影响**：不能证明管理操作可无损恢复或净负担较低。
  **进一步探讨**：在单独可丢弃profiles根记录已有空manifest目录、安装失败、改名写失败的前后快照，再评估是否满足恢复标准。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从失败路径推导什么改进假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把profile变更改成“独占暂存目录→完成依赖安装和manifest校验→原子发布”，并让回滚只持有它自己创建的暂存目录句柄或唯一标记。推导依据是目前package.json被用作目录所有权证明，而recursive mkdir并不证明目录此前不存在；单纯增加UI确认无法解决失败回滚误删。

候选设计应拒绝任何已存在目标路径，在同文件系统新建唯一暂存目录，将源配置复制与依赖安装的结果验证后再发布；改名也需将manifest更新纳入可恢复事务。最小对照覆盖目标完全不存在、已有非空无manifest目录、已有完整profile、安装失败和manifest写入失败。成功标准是既有目录字节不变、失败不留下可被宿主当完整profile的半成品；若仍伤已有内容或恢复复杂性更高，就否定设计。它是工程假设，没有产品需求和商业意愿证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/profile/src/index.ts:251-260](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L251-L260)

现状以manifest而非目录独占作为所有权判断。

<details>
<summary>查看原文（10行）</summary>

```text
  if (!existsSync(join(src, 'package.json'))) {
    throw new Error('源 profile 不存在或未初始化: ' + source)
  }
  if (existsSync(join(dest, 'package.json'))) {
    throw new Error('目标 profile 已存在: ' + target)
  }
  ensureProfilesRoot()
  mkdirSync(dest, { recursive: true })
  // 从这一刻起目录是「本次请求建的」：此后任何失败都可以安全回滚
  onCreated?.()
```

</details>

**依据 2 · 源码核查**：[packages/profile/src/index.ts:465-490](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L465-L490)

失败删除依赖created标记。

<details>
<summary>查看原文（26行）</summary>

```text
         * 原先这里无条件 `rmSync(profileDir(name), { recursive: true, force: true })`。
         * 而 `copyProfile` 会在**创建任何东西之前**抛出两条前置校验（源不存在 /
         * 目标已存在）——于是「把目标名填成一个已存在的 profile」这种最常见的误操作，
         * 结果是**用户那个 profile 被整目录删掉**（package.json、bundle 列表、自己的
         * cordis.patch.yml、端口配置、node_modules 全没），同时还绕过了 `deleteProfile`
         * 对 `web` 的保护。接口返回 400，看起来像「被拒绝了」，用户不会意识到目录已经没了。
         *
         * 现在的判据是「这个目录是不是**我**建的」：
         *   - 前置校验在 copyProfile 里、且在 mkdir 之前 → 抛错时目标目录没被动过，`created` 为 false；
         *   - mkdir 成功之后才置 `created = true`，此后任何失败（复制中途、装依赖）都回滚。
         */
        let created = false
        try {
          // copyProfile 在 mkdir 之前就抛的前置校验，此时目标目录一个字节都没动
          await copyProfile(from, name, () => { created = true })
        } catch (error) {
          if (created) {
            try {
              rmSync(profileDir(name), { recursive: true, force: true })
            } catch {
              /* 回滚失败不改变响应：错误原因仍然要如实回给用户 */
            }
          }
          writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          return
        }
```

</details>

**依据 3 · 源码核查**：[packages/profile/src/index.ts:296-318](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/profile/src/index.ts#L296-L318)

改名存在部分完成，提供事务设计参照。

<details>
<summary>查看原文（23行）</summary>

```text

function renameProfile(oldName: string, newName: string): void {
  const oldDir = profileDir(oldName)
  const newDir = profileDir(newName)
  if (!existsSync(oldDir)) {
    throw new Error('profile 不存在: ' + oldName)
  }
  if (existsSync(newDir)) {
    throw new Error('目标 profile 已存在: ' + newName)
  }
  ensureProfilesRoot()
  renameSync(oldDir, newDir)
  const manifestPath = join(newDir, 'package.json')
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { name?: string }
      manifest.name = `dsh-profile-${newName}`
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    } catch {
      /* 改名后更新 manifest 失败不阻塞，目录已移动 */
    }
  }
}
```

</details>

#### 缺口

- 尚未验证暂存发布与宿主profile发现、pnpm链接兼容。
  **影响**：无法承诺原子目录发布能覆盖所有平台和链接形式。
  **进一步探讨**：先核对宿主发现规则，再用上述失败矩阵验证字节保全与可恢复性。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
