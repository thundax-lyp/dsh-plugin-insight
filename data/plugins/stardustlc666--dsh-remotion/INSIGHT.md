# dsh-remotion

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[3567733](https://github.com/STARDUSTLC666/dsh-remotion/tree/35677331d8372eaffac3ceab7beef6cab725f664)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-remotion) [![npm 30d 14,086](https://img.shields.io/static/v1?label=npm+30d&message=14%2C086&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remotion) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remotion)
<!-- END META -->

> **功能**：在 DSH 内使用 Remotion 技能与模板管理视频工程、预览并导出 MP4。

> **亮点**：[Q01](#research-q01) 将短片模板与实际 Remotion 预览、导出串联。[Q02](#research-q02) 任务绑定保存修订并隔离生成目录。

> **主要限制**：[Q03](#research-q03) 准备环境涉及下载与本机进程，Range 仍读整份视频。[Q02](#research-q02) 取消回执不能直接证明所有子进程及缓存已清理。

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
  - [Q01 · 工作台如何从模板和素材产出一个实际 MP4？](#detail-section-11)
  - [Q02 · 修订变化或取消发生时保留什么？](#detail-section-12)
  - [Q03 · 准备环境与下载开放哪些本机能力？](#detail-section-13)
  - [Q04 · 怎样确认模板短视频值得继续采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想用公开素材制作短片的 DSH 用户需要可保存修订、预览和输出。

直接使用 Remotion CLI 自由度高，需手动维护模板、素材、修订和运行环境。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 受管工程 | 编辑模板和有限素材 | 核对修订及素材上限 |
| Studio 预览 | 查看生成作品 | 需准备官方环境 |
| MP4 导出 | 从固定修订渲染 | 播放器核对质量 |
| 技能 | 辅助 Remotion 任务 | 注册状态与实际渲染分开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 和 Node | 必需 | 宿主技能和工具 | 核对 Host 版本 |
| npm 和浏览器 | 渲染必需 | 下载 CLI 与运行 Chromium | 显式准备并检查错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 创建 | 选择短片模板并保存 | 记录修订 |
| 导出 | 准备环境、预览及渲染 | 检查实际画面和时长 |
| 退出 | 停止任务并取回工程 | 确认进程、缓存和源文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖、浏览器与磁盘 | 准备环境 | 下载耗时未知 |
| 持续 | 渲染 CPU、缓存和内存 | 验证输出及迭代 | 节时未验证 |
| 失败 | 临时目录与可能重跑 | 查日志、停止及恢复 | 资源占用未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 视频产出 | 真实调用官方渲染 CLI | 跨平台质量 |
| 修订追溯 | 读取已保存快照并登记产物 | 并发恢复和误交付率 |

> **思考**：[Q03](#research-q03) 准备环境涉及下载与本机进程，Range 仍读整份视频。[Q02](#research-q02) 取消回执不能直接证明所有子进程及缓存已清理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将短片模板与实际 Remotion 预览、导出串联。[Q02](#research-q02) 任务绑定保存修订并隔离生成目录。

以修订与任务目录隔离运行，保留原工程。终态、子进程和下载内存需独立核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 准备环境涉及下载与本机进程，Range 仍读整份视频。[Q02](#research-q02) 取消回执不能直接证明所有子进程及缓存已清理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在私人隔离 Host 用公开素材测试极短片头，先核对修订与成品。异常即停止并回官方 CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持模板、环境准备及实际渲染接线。实机输出质量、权限及资源待验证。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、package.json、src/index.ts、src/media-store.ts、src/media-workbench.ts、src/skill-bundle.ts、templates/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查技能、模板、修订、渲染、下载及失败路径，未执行或安装目标包。
- 下一步：用公开短片检查预览、MP4、资源、错误修订和取消。

**分析版本**

- **仓库**：[STARDUSTLC666/dsh-remotion](https://github.com/STARDUSTLC666/dsh-remotion)
- **版本号**：0.10.5（[固定提交 3567733](https://github.com/STARDUSTLC666/dsh-remotion/tree/35677331d8372eaffac3ceab7beef6cab725f664)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 绑定修订、素材、环境和成品验收记录，测试能否减少错版交付。

用公开短片检查预览、MP4、资源、错误修订和取消。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 13 | 1648 | 1371 | 236 | — |
| .mjs | test | 9 | 695 | 658 | 11 | — |
| .md | source | 189 | 20021 | — | — | 95664 |
| .js | source | 10 | 2515 | 2426 | 89 | — |
| .tsx | source | 20 | 3112 | 2836 | 148 | — |
| .ts | source | 17 | 1413 | 1172 | 187 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-remotion/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-remotion/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/STARDUSTLC666/dsh-remotion/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否从模板和有限素材制作可追溯的短视频，并在环境、权限及失败恢复清楚时采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作台如何从模板和素材产出一个实际 MP4？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合已在 DSH 构思标题、产品介绍或幻灯短片，愿意使用模板和少量素材的制作人。手工 Remotion CLI 也能渲染且更适合任意 React 工程，插件增量是把有限模板、素材与 Host 会话旁的工具和设置面板接起来。Host 既注册随包技能，又提供项目与渲染工具。技能注册是否成功可检查注册表，不能据此推断渲染环境就绪。

开始任务时读取已保存修订，把受管素材与生成的 JSX 写入该任务目录。预览选择本机端口、调用官方 Studio，并等待实际 HTTP 响应才给出预览地址。导出调用 Remotion render，以固定 composition 和浏览器生成 H.264 MP4。完成后检查大小和容器头再记录产物。合格视频还应逐帧检查持续时间、画幅和关键画面，简单头检查只能说明有对应容器信号。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:48-53](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/index.ts#L48-L53)

技能与工作台分别安装。

```text
export function checkBundledSkills() { return bundle.checkFiles() }

/** Register this package's skills and its read-only health tool. */
export function apply(ctx: SkillsPluginContext): void {
  registerUpdates(ctx, { name: "dsh-remotion" })
 bundle.apply(ctx); installMediaWorkbench(ctx, 'remotion') }
```

**依据 2 · 源码核查**：[src/skill-bundle.ts:145-185](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/skill-bundle.ts#L145-L185)

注册和健康检查的边界。

<details>
<summary>查看原文（41行）</summary>

```text
          resourceBase: { kind: 'directory', path: join(resolve(options.directory()), result.check.name) },
          source: 'runtime',
        }
        try {
          const remove = ctx.skills.register(definition)
          if (typeof remove !== 'function') throw new Error('skills.register 未返回卸载函数。')
          disposers.push(remove)
          registration.definition = definition
          registration.fingerprint = result.fingerprint
        } catch (error) {
          registration.error = message(error)
          warn(result.check.name + ' 注册失败：' + registration.error)
        }
      }

      const health = async (): Promise<{ ok: boolean; plugin: string; skills: SkillHealthCheck[] }> => {
        const skills: SkillHealthCheck[] = []
        for (const result of inspectAll()) {
          const registration = registrations.get(result.check.name)!
          let registered = false
          let registryChecked = false
          let registryError: string | undefined
          if (!disposed && registration.definition) {
            if (typeof ctx.skills.get !== 'function') registryError = '宿主未提供 skills.get，无法确认技能是否实际生效。'
            else {
              try {
                registered = matches(await ctx.skills.get(result.check.name), registration.definition)
                registryChecked = true
              } catch (error) { registryError = '读取宿主技能注册表失败：' + message(error) }
            }
          }
          let code: SkillHealthCheck['code'] = 'ready'
          let detail = result.check.file
          let reloadRequired = false
          if (disposed) { code = 'disposed'; registered = false; detail = '插件已卸载。'; reloadRequired = true }
          else if (!result.check.ok) { code = result.check.code; detail = result.check.detail }
          else if (registration.error) { code = 'registration_failed'; detail = '加载时注册失败：' + registration.error; reloadRequired = true }
          else if (!registration.definition) { code = 'not_registered'; detail = '文件现已有效，但加载时未注册；请重载插件。'; reloadRequired = true }
          else if (result.fingerprint !== registration.fingerprint) { code = 'changed'; detail = '文件已变化，当前注册仍是加载时版本；请重载插件。'; reloadRequired = true }
          else if (registryError) { code = 'registry_unavailable'; detail = registryError }
          else if (!registered) { code = 'inactive'; detail = '宿主注册表中的技能缺失或已被其他内容替代；请重载插件。'; reloadRequired = true }
```

</details>

**依据 3 · 源码核查**：[src/media-workbench.ts:290-325](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L290-L325)

工具与 Host 路由实际接线。

<details>
<summary>查看原文（36行）</summary>

```text
export function installMediaWorkbench(ctx: any, engine: MediaEngine): MediaWorkbench {
  const workbench = new MediaWorkbench(engine)
  ctx.inject?.(['connection'], (host: any) => {
    host.connection?.fetch?.register({ path: workbench.route, methods: ['GET','POST'], requestBody: 'buffered', fetch: (request: Request) => workbench.fetch(request) })
    host.connection?.fetch?.register({ path: workbench.route + '/upload', methods: ['POST'], requestBody: 'streaming', fetch: (request: Request) => workbench.fetch(request) })
  })
  ctx.on?.('dispose', () => workbench.dispose())
  for (const action of ['project', 'render']) {
    const dispose = ctx.tools?.register({
    name: engine + '_' + action,
    description: action === 'project' ? '创建或读取本插件受管理视频工程，列出模板与环境。不会自动安装依赖或渲染。' : '准备官方渲染环境、启动预览/MP4任务、查询进度或取消。工程保存在 DSH 本地数据目录；首次准备环境会下载依赖。',
    parameters: { type: 'object', properties: { action: { type: 'string', enum: action === 'project' ? ['list','create','get','update'] : ['prepare','preview','render','job','cancel'] }, id: { type: 'string' }, revision: { type: 'number' }, job: { type: 'string' }, fields: { type: 'object', properties: { template: { type: 'string', enum: ['title','product','slideshow'] }, title: { type: 'string' }, body: { type: 'string' }, format: { type: 'string', enum: ['landscape','portrait','square'] }, duration: { type: 'number' } }, required: ['template','title','body','format','duration'] } }, required: ['action'] },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render(_args: unknown, value: any) {
        const lines = [engine === 'hyperframes' ? 'HyperFrames 视频工作台' : 'Remotion 视频工作台']
        if (Array.isArray(value.projects)) {
          lines.push('已保存工程：' + value.projects.length)
          for (const project of value.projects) lines.push('- ' + project.title + '（版本 ' + project.revision + '；项目编号：' + project.id + '）')
          lines.push(value.environment?.ready ? '渲染环境已就绪。' : '首次预览或导出前，请显式准备渲染环境。')
        } else if (value.title) lines.push('工程：' + value.title + '（版本 ' + value.revision + '）', '项目编号：' + value.id)
        else if (value.state) {
          lines.push('任务状态：' + value.state, '任务编号：' + value.id, value.stage || '')
          if (value.projectId) lines.push('项目编号：' + value.projectId)
          if (value.state === 'running') lines.push('可用 action: job 查询，或 action: cancel 取消；job 参数使用上述任务编号。')
          if (value.url) lines.push('预览：' + value.url)
          if (value.message) lines.push(value.message)
        }
        return [{ type: 'text', text: lines.filter(Boolean).join('\n') }]
      },
    },
    async execute(args: any) {
      const allowed = action === 'project' ? ['list','create','get','update'] : ['prepare','preview','render','job','cancel']
      if (!allowed.includes(args.action)) throw new Error('操作无效。')
      const response = await workbench.fetch(new Request('http://dsh.internal' + workbench.route, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dsh-media': '1' }, body: JSON.stringify(args) }))
      const result: any = await response.json(); if (!result.ok) throw new Error(result.message); return result.value
```

</details>

**依据 4 · 源码核查**：[src/media-workbench.ts:154-160](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L154-L160)

生成任务专属项目源码与素材。

```text
      } else if (snapshot) {
        const p = snapshot.project, dir = join(await this.store.path(p.id), 'runs', job.view.id)
        await mkdir(dirname(dir), { recursive: true })
        if (this.engine === 'hyperframes') await this.run(job, process.execPath, [this.cli(), 'init', dir, '--example', 'blank', '--non-interactive', '--skip-transcribe'], dirname(dir))
        await mkdir(join(dir, 'public/assets'), { recursive: true })
        for (const [file, bytes] of snapshot.assets) await writeFile(join(dir, 'public/assets', file), bytes, { flag: 'wx' })
        for (const [file, content] of Object.entries(projectSources(p, this.engine))) { await mkdir(dirname(join(dir, file)), { recursive: true }); await writeFile(join(dir, file), content) }
```

**依据 5 · 源码核查**：[src/media-workbench.ts:165-197](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L165-L197)

Studio 就绪轮询及 MP4 命令和验收。

<details>
<summary>查看原文（33行）</summary>

```text
        if (job.view.kind === 'preview') {
          const port = await freePort(), url = `http://127.0.0.1:${port}/`
          job.view.stage = '启动官方预览'
          const args = this.engine === 'hyperframes' ? ['preview', '.', '--port', String(port), '--no-open', '--foreground'] : ['studio', 'src/index.jsx', '--port', String(port), '--no-open', '--ipv4', '--disable-ask-ai']
          let exited = false
          const running = this.run(job, process.execPath, ['--require', join(dir, 'loopback.cjs'), this.cli(), ...args], dir).finally(() => { exited = true })
          // Poll the actual server; a chosen port or spawned process is not readiness.
          const poll = async () => {
            for (let i = 0; i < 180; i++) {
              job.controller.signal.throwIfAborted(); if (exited) return
              try { const response = await fetch(url, { signal: AbortSignal.timeout(1500) }); if (response.ok) { job.view.url = this.engine === 'hyperframes' ? url + '#project/' + job.view.id : url; job.view.stage = '官方预览已就绪'; return } } catch {}
              await new Promise(resolve => setTimeout(resolve, 500))
            }
            job.controller.abort()
          }
          await Promise.all([running, poll()])
        } else {
          if (this.engine === 'hyperframes') { job.view.stage = '检查合成'; await this.run(job, process.execPath, [this.cli(), 'lint', '.', '--json'], dir) }
          job.view.stage = '渲染 MP4'
          const output = join(dir, 'final.mp4')
          const browserFile = await this.browserFile(JSON.parse(await readFile(join(this.runtime, 'ready.json'), 'utf8')).browserPath)
          const browserPath = browserFile.length >= 240 ? toNamespacedPath(browserFile) : browserFile
          const chromeMode = /^chrome-headless-shell(?:\.exe)?$/i.test(basename(browserFile)) ? 'headless-shell' : 'chrome-for-testing'
          const args = this.engine === 'hyperframes' ? ['render', '.', '--output', output, '--fps', '24', '--quality', 'draft', '--workers', '1', '--strict', '--no-best-effort', '--no-browser-gpu'] : ['render', 'src/index.jsx', 'ManagedVideo', output, '--codec', 'h264', '--concurrency', '1', '--browser-executable', browserPath, '--chrome-mode', chromeMode]
          await this.run(job, process.execPath, ['--require', join(dir, 'loopback.cjs'), this.cli(), ...args], dir, this.engine === 'hyperframes' ? { HYPERFRAMES_BROWSER_PATH: browserPath } : {})
          const bytes = (await stat(output)).size
          if (bytes < 100 || bytes > 200 * 1024 * 1024) throw new Error('MP4 输出为空或超过 200 MB，请检查运行记录。原工程已保留。')
          const handle = await open(output, 'r'), header = Buffer.alloc(12)
          try { await handle.read(header, 0, 12, 0) } finally { await handle.close() }
          if (header.toString('ascii', 4, 8) !== 'ftyp') throw new Error('渲染器输出不是 MP4 文件，原工程已保留。')
          job.controller.signal.throwIfAborted()
          await this.store.edit(p.id, undefined, current => { current.renders = [{ id: job.view.id, revision: p.revision, bytes, created: new Date().toISOString() }, ...current.renders].slice(0, 5) }, false)
          job.view.output = job.view.id
```

</details>

#### 缺口

- 未渲染固定素材或核对音画质量
  **影响**：无法承诺跨平台 MP4 质量
  **进一步探讨**：导出三秒带素材的测试项目，核对编码、时长和画面

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 修订变化或取消发生时保留什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

素材上传按内容头及扩展名验证，限制单项和工程总量，写入使用随机名称及独占创建。读取受管理项目时检查真实路径位于数据根。编辑在项目锁内比较当前 revision，旧快照不能继续渲染。任务持有跨进程工作台 slot，在任务运行时禁止归档或恢复移动项目，减少目录与任务并发冲突。render 在 task 目录记录产物，保留生成所用修订，继续编辑不会将旧成品变成当前版本。

取消请求先发送 abort 并返回当前快照，子进程退出后任务才收口。Windows 通过 taskkill，其他平台尽量杀进程组。失败信息保留工程和部分日志；取消发生在目录或 MP4 已写入之后时，不能认为所有临时产物已删除。已有的状态可以区分任务取消与工程保留，资源清理仍要查看真实目录及进程。

#### 证据与依据

**依据 1 · 源码核查**：[src/media-store.ts:19-35](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-store.ts#L19-L35)

读取与路径检查。

<details>
<summary>查看原文（17行）</summary>

```text
    const dir = join(this.root, archived ? 'archives' : 'projects', mediaId(id))
    if ((await lstat(dir)).isSymbolicLink()) throw new Error('项目目录不能是符号链接。')
    await this.checkPath(dir)
    return dir
  }
  async checkPath(path: string): Promise<void> {
    const base = await realpath(this.root), actual = await realpath(path), rel = relative(base, actual)
    if (rel === '..' || rel.startsWith('..' + (process.platform === 'win32' ? '\\' : '/')) || isAbsolute(rel)) throw new Error('文件不在本插件项目目录内。')
  }
  async get(id: string, archived = false): Promise<MediaProject> {
    const file = join(await this.path(id, archived), 'project.json'); await this.checkPath(file)
    if ((await stat(file)).size > 65536) throw new Error('工程记录过大，请保留文件后检查。')
    const p = JSON.parse(await readFile(file, 'utf8')) as MediaProject
    validateFields(p)
    if (p.id !== id || !Number.isInteger(p.revision) || p.revision < 1 || !Array.isArray(p.assets) || p.assets.length > 12 || !Array.isArray(p.renders)) throw new Error('工程记录损坏；原文件已保留。')
    for (const a of p.assets) { mediaId(a.id); if (!new RegExp('^' + a.id + '\\.(png|jpg|mp3|wav|mp4)$').test(a.file)) throw new Error('素材记录无效。') }
    for (const r of p.renders) mediaId(r.id)
```

</details>

**依据 2 · 源码核查**：[src/media-store.ts:80-90](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-store.ts#L80-L90)

修订比较与编辑锁。

<details>
<summary>查看原文（11行）</summary>

```text
    const unlock = await lockfile.lock(dir, { retries: { retries: 8, minTimeout: 30, maxTimeout: 60 } })
    try {
      const p = await this.get(id)
      if (revision !== undefined && revision !== p.revision) throw new MediaConflict('工程已在另一窗口更新。你的输入仍保留，请重新打开最新版本后比较。')
      await fn(p); if (bump) p.revision++; p.updated = new Date().toISOString(); await this.write(p); return p
    } finally { await unlock() }
  }
  async update(id: string, revision: unknown, value: unknown): Promise<MediaProject> { return this.edit(id, revision, p => { Object.assign(p, validateFields(value)) }) }
  /** Reorder existing images atomically; audio/video slots and uploaded bytes stay intact. */
  async reorderImages(id: string, revision: unknown, order: unknown): Promise<MediaProject> {
    if (!Number.isInteger(revision) || Number(revision) < 1) throw new Error('调整图片顺序需要当前工程修订号。')
```

</details>

**依据 3 · 源码核查**：[src/media-store.ts:105-122](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-store.ts#L105-L122)

上传限制、类型和受管名称。

<details>
<summary>查看原文（18行）</summary>

```text
  async upload(id: string, revision: unknown, name: string, bytes: Buffer): Promise<MediaProject> {
    if (!bytes.length || bytes.length > 20 * 1024 * 1024) throw new Error('单个素材需为 1 字节–20 MB。')
    const ext = extname(name).toLowerCase(), isPng = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    const isJpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    let kind: MediaAsset['kind'], suffix: string
    if (ext === '.png' && isPng) { kind = 'image'; suffix = '.png' }
    else if (['.jpg','.jpeg'].includes(ext) && isJpg) { kind = 'image'; suffix = '.jpg' }
    else if (ext === '.wav' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE') { kind = 'audio'; suffix = '.wav' }
    else if (ext === '.mp3' && (bytes.toString('ascii', 0, 3) === 'ID3' || bytes[0] === 255 && (bytes[1] & 224) === 224)) { kind = 'audio'; suffix = '.mp3' }
    else if (ext === '.mp4' && bytes.toString('ascii', 4, 8) === 'ftyp') { kind = 'video'; suffix = '.mp4' }
    else throw new Error('仅支持内容与扩展名一致的 PNG、JPEG、MP3、WAV 或 MP4。')
    return this.edit(id, revision, async p => {
      if (p.assets.length >= 12 || p.assets.reduce((n, a) => n + a.bytes, 0) + bytes.length > 40 * 1024 * 1024) throw new Error('每个项目最多 12 个素材、合计 40 MB。')
      if (kind !== 'image' && p.assets.some(a => a.kind === kind)) throw new Error(kind === 'audio' ? '已有背景音频，请先移除再替换。' : '已有背景视频，请先移除再替换。')
      const assetId = randomUUID(), dir = join(await this.path(id), 'assets'); await mkdir(dir, { recursive: true })
      const asset = { id: assetId, name: name.replace(/[\x00-\x1f/\\]/g, '_').slice(0, 100), file: assetId + suffix, kind, bytes: bytes.length }
      await writeFile(join(dir, asset.file), bytes, { flag: 'wx', mode: 0o600 }); p.assets.push(asset)
    })
```

</details>

**依据 4 · 源码核查**：[src/media-store.ts:130-133](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-store.ts#L130-L133)

固定修订的素材快照。

```text
  async snapshot(id: string, revision: unknown): Promise<{ project: MediaProject; assets: Map<string, Buffer> }> {
    const dir = await this.path(id), unlock = await lockfile.lock(dir, { retries: { retries: 8, minTimeout: 30, maxTimeout: 60 } })
    try { const project = await this.get(id); if (project.revision !== revision) throw new MediaConflict('项目已更新，请保存并重新预览。'); const assets = new Map<string, Buffer>(); for (const a of project.assets) assets.set(a.file, await this.assetBytes(id, a)); return { project, assets } }
    finally { await unlock() }
```

**依据 5 · 源码核查**：[src/media-workbench.ts:77-105](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L77-L105)

子进程取消和作业起点。

<details>
<summary>查看原文（29行）</summary>

```text
  private stopChild(job: RunningJob): void {
    const child = job.child; if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return
    if (process.platform === 'win32') execFile(join(process.env.SystemRoot || 'C:/Windows', 'System32/taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, () => {})
    else { try { process.kill(-child.pid, 'SIGKILL') } catch { child.kill('SIGKILL') } }
  }
  private async run(job: RunningJob, file: string, args: string[], cwd: string, environment: NodeJS.ProcessEnv = {}): Promise<void> {
    job.controller.signal.throwIfAborted()
    await mkdir(join(this.store.root, 'tmp'), { recursive: true })
    await mkdir(join(this.store.root, 'user-home/AppData/Roaming'), { recursive: true })
    await mkdir(join(this.store.root, 'user-home/AppData/Local'), { recursive: true })
    return new Promise((resolve, reject) => {
      const child = spawn(file, args, { cwd, env: { ...childEnv(this.store.root), ...environment }, windowsHide: true, shell: false, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] }); job.child = child
      const abort = () => this.stopChild(job); job.controller.signal.addEventListener('abort', abort, { once: true })
      child.stdout?.on('data', data => this.log(job, data.toString())); child.stderr?.on('data', data => this.log(job, data.toString()))
      const finish = () => { job.controller.signal.removeEventListener('abort', abort); if (job.child === child) job.child = undefined }
      child.once('error', e => { finish(); reject(e) })
      child.once('close', code => { finish(); if (job.controller.signal.aborted) reject(new Error('操作已取消。')); else if (code !== 0) { const useful = job.view.lines.filter(line => /^(?:\w*Error:|npm error)|\b(?:ENOENT|EACCES|ECONNRESET)\b|Unknown flag|Failed to |DevTools remote debugging/.test(line)); reject(new Error(`官方 ${this.engine} 命令未完成（退出码 ${code}）。\n` + (useful.length ? useful.slice(0, 3) : job.view.lines.slice(-5)).join('\n'))) } else resolve() })
    })
  }
  private cli(): string { return join(this.runtime, 'node_modules', this.engine === 'hyperframes' ? 'hyperframes/bin/hyperframes.mjs' : '@remotion/cli/remotion-cli.js') }
  async start(kind: MediaJob['kind'], id?: string, revision?: unknown): Promise<MediaJob> {
    if (this.disposed) throw new Error('插件已卸载，请重新加载。')
    if ([...this.jobs.values()].some(j => j.view.state === 'running' && (j.view.kind === kind || j.view.kind === 'prepare' || kind === 'prepare'))) throw new Error('已有同类任务运行，请等待完成或明确取消。')
    if (kind !== 'prepare' && !(await this.environment()).ready) throw new Error('请先点击“准备渲染环境”，完成首次下载。')
    const snapshot = kind === 'prepare' ? undefined : await this.store.snapshot(mediaId(id), revision)
    if (snapshot) projectSources(snapshot.project, this.engine)
    const job: RunningJob = { view: { id: randomUUID(), kind, projectId: snapshot?.project.id, revision: snapshot?.project.revision, state: 'running', stage: kind === 'prepare' ? '下载环境' : '准备修订快照', lines: [] }, controller: new AbortController() }
    if (this.jobs.size >= 30) { const old = [...this.jobs.values()].find(j => j.view.state !== 'running'); if (old) this.jobs.delete(old.view.id); else throw new Error('运行任务过多。') }
    this.jobs.set(job.view.id, job)
```

</details>

**依据 6 · 源码核查**：[src/media-workbench.ts:202-210](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L202-L210)

终态与取消请求回执。

```text
      const message = (e as any)?.code === 'ELOCKED' ? '另一个 DSH 实例正在运行本插件任务，请等待完成或在那个实例中停止任务。' : errorMessage(e)
      job.view.state = job.controller.signal.aborted ? 'cancelled' : 'failed'
      job.view.stage = job.view.state === 'cancelled' ? '已取消；工程已保留' : /^官方 .*命令未完成/.test(message) ? '官方任务未完成，请展开运行记录后重试。工程已保留。' : /spawn ffprobe ENOENT/.test(message) ? '未找到 FFprobe。请安装包含 FFmpeg 和 FFprobe 的完整工具包并加入 PATH，重启 DSH 后重新准备环境。工程已保留。' : /spawn ffmpeg ENOENT/.test(message) ? '未找到 FFmpeg，请安装并加入 PATH，重启 DSH 后重试。工程已保留。' : message
      this.log(job, message)
    }
    finally { clearTimeout(timeout); if (unlock) await unlock().catch(() => {}); job.view.url = job.view.state === 'running' ? job.view.url : undefined }
  }
  cancel(id: string): MediaJob { const job = this.jobs.get(mediaId(id)); if (!job) throw new Error('任务不存在。'); if (job.view.state === 'running') job.controller.abort(); return structuredClone(job.view) }
  dispose(): void { this.disposed = true; for (const job of this.jobs.values()) if (job.view.state === 'running') job.controller.abort() }
```

**依据 7 · 源码核查**：[src/media-workbench.ts:267-277](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L267-L277)

归档共享工作台 slot。

<details>
<summary>查看原文（11行）</summary>

```text
          case 'archive': case 'restore': {
            if (v.confirmed !== true) throw new Error('请明确确认归档或恢复。')
            // The same slot covers jobs from another DSH process, so a project
            // cannot move while its render or preview still writes into it.
            const slot = join(this.store.root, 'workbench-slot'); await this.store.init(); await mkdir(slot, { recursive: true })
            const unlock = await lockfile.lock(slot, { retries: 0, stale: 30000, update: 10000 }).catch(error => {
              if (error.code === 'ELOCKED') throw new MediaConflict('已有预览或渲染正在运行，请先关闭预览或取消渲染，再归档或恢复工程。')
              throw error
            })
            try { value = await this.store.archive(mediaId(v.id), v.revision, v.action === 'restore') } finally { await unlock() }
            break
```

</details>

#### 缺口

- 未复现跨进程锁、取消竞态及缓存增长
  **影响**：不能承诺每次退出都清空残留
  **进一步探讨**：并行从两个窗口提交旧修订，再中断预览及渲染查看进程和文件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 准备环境与下载开放哪些本机能力？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

安装声明要求 Node 22.19 系列或 24+ 和指定 DSH 范围。显式 prepare 在数据目录写依赖清单，使用 npm install --ignore-scripts，随后检查官方 CLI 和下载或定位 Chrome。执行子进程使用参数数组、限制继承环境，把 HOME 和缓存指向工作台目录，并给 Node 服务预载回环限制。这些措施减少宿主状态干扰，仍不能把 shell:false、环境隔离或回环绑定视为完整的文件和网络沙箱。首次运行有包与浏览器下载、磁盘和 CPU 成本。

下载以 Host connection.fetch 注册，局部 guard 拒绝跨站 Origin 并要求 POST 标记头，实际登录边界取决于 Host 载体。导出路由按受管 ID 和真实路径取文件，但 Range 响应也先把整个文件读入内存，重复或并发预览可能有明显内存成本。工具调用 prepare、render 可触发下载和本机子进程，应核对实际 DSH 工具权限与用户意图。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:57-66](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/package.json#L57-L66)

版本、锁及压缩依赖声明。

<details>
<summary>查看原文（10行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.3"
  },
  "dependencies": {
    "fflate": "0.8.3",
    "proper-lockfile": "4.1.2",
    "yaml": "^2.9.0",
    "@stardustlc/dsh-updates": "0.1.4"
  },
```

</details>

**依据 2 · 源码核查**：[src/media-workbench.ts:22-37](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L22-L37)

npm 路径、子进程环境及回环钩子。

<details>
<summary>查看原文（16行）</summary>

```text
function npmCli(): string {
  const paths = [join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'), join(dirname(process.execPath), '../lib/node_modules/npm/bin/npm-cli.js')]
  for (const path of (process.env.PATH || '').split(delimiter)) paths.push(join(path, 'node_modules/npm/bin/npm-cli.js'), join(path, '../node_modules/npm/bin/npm-cli.js'))
  if (process.env.APPDATA) paths.push(join(process.env.APPDATA, 'npm/node_modules/npm/bin/npm-cli.js'))
  const file = paths.find(existsSync); if (!file) throw new Error('没有找到 npm。请安装 Node.js 22.19+ 或 24+，重启 DSH 后再准备环境。'); return file
}
function childEnv(root: string): NodeJS.ProcessEnv {
  const result: NodeJS.ProcessEnv = {}
  for (const [key, value] of Object.entries(process.env)) if (/^(path|pathext|systemroot|windir|userprofile|home|appdata|localappdata|https?_proxy|all_proxy|no_proxy|comspec|programfiles|programfiles\(x86\)|hyperframes_browser_path|puppeteer_download_base_url)$/i.test(key)) result[key] = value
  return { ...result, ELECTRON_RUN_AS_NODE: '1', DSH_DESKTOP_NODE_EXECUTABLE: process.execPath, HOME: join(root, 'user-home'), USERPROFILE: join(root, 'user-home'), APPDATA: join(root, 'user-home', 'AppData/Roaming'), LOCALAPPDATA: join(root, 'user-home', 'AppData/Local'), CI: '1', NO_COLOR: '1', BROWSER: 'none', TEMP: join(root, 'tmp'), TMP: join(root, 'tmp'), TMPDIR: join(root, 'tmp'), npm_config_userconfig: join(root, 'local.npmrc'), npm_config_cache: join(root, 'npm-cache'), PUPPETEER_CACHE_DIR: join(root, 'browser'), HYPERFRAMES_NO_UPDATE_CHECK: '1', HYPERFRAMES_SKIP_SKILLS: '1', HYPERFRAMES_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1', HYPERFRAMES_EXTRACT_CACHE_DIR: join(root, 'frames') }
}
async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => { const server = createServer(); server.once('error', reject); server.listen(0, '127.0.0.1', () => { const address = server.address(); const port = typeof address === 'object' && address ? address.port : 0; server.close(() => resolve(port)) }) })
}
/** Restrict all servers in our renderer child to loopback using Node's public API. */
const LOOPBACK = `const net=require('node:net');const listen=net.Server.prototype.listen;net.Server.prototype.listen=function(...args){if(args[0]&&typeof args[0]==='object'&&'port'in args[0])args[0]={...args[0],host:'127.0.0.1'};else if(typeof args[0]==='number'){if(typeof args[1]==='string')args[1]='127.0.0.1';else args.splice(1,0,'127.0.0.1')}return listen.apply(this,args)};\n`
```

</details>

**依据 3 · 源码核查**：[src/media-workbench.ts:122-153](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L122-L153)

实际依赖、浏览器准备。

<details>
<summary>查看原文（32行）</summary>

```text
        const dependencies = this.engine === 'hyperframes' ? { hyperframes: MEDIA_VERSIONS.hyperframes, gsap: MEDIA_VERSIONS.gsap } : { '@remotion/cli': MEDIA_VERSIONS.remotion, remotion: MEDIA_VERSIONS.remotion, react: '18.3.1', 'react-dom': '18.3.1' }
        await writeFile(join(this.runtime, 'package.json'), JSON.stringify({ private: true, dependencies }))
        job.view.stage = '下载官方依赖'
        await this.run(job, process.execPath, [npmCli(), 'install', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org'], this.runtime)
        job.view.stage = '检查官方环境'
        await this.run(job, process.execPath, [this.cli(), ...(this.engine === 'hyperframes' ? ['--version'] : ['versions'])], this.runtime)
        job.view.stage = '检查或下载 Chrome'
        if (this.engine === 'hyperframes') {
          const configured = process.env.HYPERFRAMES_BROWSER_PATH?.trim()
          if (configured) {
            // An explicit operator path is validated before use, never downloaded over.
            job.view.lines.push(await this.browserFile(configured))
          } else {
            let available = ''
            try {
              await this.run(job, process.execPath, [this.cli(), 'browser', 'path'], this.runtime)
              available = await this.browserFile(job.view.lines.at(-1)!.trim())
            } catch { job.controller.signal.throwIfAborted() }
            if (!available || (process.platform === 'win32' && !/^chrome-headless-shell\.exe$/i.test(basename(available)))) {
              job.view.stage = '下载专用渲染浏览器；可取消后设置 HYPERFRAMES_BROWSER_PATH 使用本机浏览器'
              await this.run(job, process.execPath, [this.cli(), 'browser', 'ensure'], this.runtime)
              await this.run(job, process.execPath, [this.cli(), 'browser', 'path'], this.runtime)
            }
          }
        }
        else {
          const installed = installedChromePaths().find(existsSync)
          if (!installed) await this.run(job, process.execPath, [this.cli(), 'browser', 'ensure'], this.runtime)
          await this.run(job, process.execPath, ['-e', "require('@remotion/renderer').ensureBrowser({logLevel:'error',browserExecutable:process.argv[1]||null}).then(v=>console.log(require('node:fs').realpathSync(v.path))).catch(e=>{console.error(e.message);process.exitCode=1})", installed || ''], this.runtime)
        }
        const browserPath = await this.browserFile(job.view.lines.at(-1)!.trim())
        await writeFile(join(this.runtime, 'ready.json'), JSON.stringify({ version: MEDIA_VERSIONS[this.engine], browserPath, ...(this.engine === 'hyperframes' ? { prerequisites: 2 } : {}) }))
```

</details>

**依据 4 · 源码核查**：[src/media-workbench.ts:211-245](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L211-L245)

局部来源守卫及下载全文件读取。

<details>
<summary>查看原文（35行）</summary>

```text
  private guard(request: Request): void {
    const url = new URL(request.url), origin = request.headers.get('origin'), site = request.headers.get('sec-fetch-site')
    // The official carrier keeps Host but rewrites Request.url to its internal URL.
    if (site && !['same-origin','none'].includes(site)) throw new Error('请从 DSH 页面操作。')
    if (origin) {
      const source = new URL(origin)
      if (!['http:', 'https:'].includes(source.protocol) || source.host !== (request.headers.get('host') || url.host)) throw new Error('请从 DSH 页面操作。')
    }
    if (request.method === 'POST' && request.headers.get('x-dsh-media') !== '1') throw new Error('操作来源无效。')
  }
  async fetch(request: Request): Promise<Response> {
    try {
      this.guard(request)
      const url = new URL(request.url)
      if (request.method === 'GET') {
        const id = mediaId(url.searchParams.get('id')), p = await this.store.get(id), kind = url.searchParams.get('kind')
        if (kind === 'source') {
          const snapshot = await this.store.snapshot(id, p.revision), files: Record<string, Uint8Array> = {}
          for (const [file, content] of Object.entries(projectSources(p, this.engine))) files[file] = strToU8(content)
          for (const [file, bytes] of snapshot.assets) files['public/assets/' + file] = bytes
          const bytes = zipSync(files, { level: 1 })
          return new Response(bytes as any, { headers: { 'content-type': 'application/zip', 'content-disposition': `attachment; filename="${this.engine}-${id}.zip"`, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } })
        }
        let file: string, type: string
        if (kind === 'asset') {
          const a = p.assets.find(a => a.id === mediaId(url.searchParams.get('asset'))); if (!a) throw new Error('素材不存在。')
          file = join(await this.store.path(id), 'assets', a.file); type = mime[a.file.split('.').at(-1) as keyof typeof mime]
        } else if (kind === 'mp4') {
          const r = p.renders.find(r => r.id === mediaId(url.searchParams.get('render'))); if (!r) throw new Error('成品不存在。')
          file = join(await this.store.path(id), 'runs', r.id, 'final.mp4'); type = mime.mp4
        } else throw new Error('下载类型无效。')
        await this.store.checkPath(file)
        const size = (await stat(file)).size; if (size > 200 * 1024 * 1024) throw new Error('成品过大，请从本地工程目录取回。')
        const bytes = await readFile(file), range = request.headers.get('range'), headers: Record<string, string> = { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'accept-ranges': 'bytes' }
        if (range) { const match = /^bytes=(\d+)-(\d*)$/.exec(range); if (!match) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } }); const start = Number(match[1]), end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1; if (start > end || start >= size) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } }); return new Response(bytes.subarray(start, end + 1) as any, { status: 206, headers: { ...headers, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': String(end - start + 1) } }) }
```

</details>

**依据 5 · 源码核查**：[src/media-workbench.ts:290-325](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L290-L325)

Host connection 与模型工具路由。

<details>
<summary>查看原文（36行）</summary>

```text
export function installMediaWorkbench(ctx: any, engine: MediaEngine): MediaWorkbench {
  const workbench = new MediaWorkbench(engine)
  ctx.inject?.(['connection'], (host: any) => {
    host.connection?.fetch?.register({ path: workbench.route, methods: ['GET','POST'], requestBody: 'buffered', fetch: (request: Request) => workbench.fetch(request) })
    host.connection?.fetch?.register({ path: workbench.route + '/upload', methods: ['POST'], requestBody: 'streaming', fetch: (request: Request) => workbench.fetch(request) })
  })
  ctx.on?.('dispose', () => workbench.dispose())
  for (const action of ['project', 'render']) {
    const dispose = ctx.tools?.register({
    name: engine + '_' + action,
    description: action === 'project' ? '创建或读取本插件受管理视频工程，列出模板与环境。不会自动安装依赖或渲染。' : '准备官方渲染环境、启动预览/MP4任务、查询进度或取消。工程保存在 DSH 本地数据目录；首次准备环境会下载依赖。',
    parameters: { type: 'object', properties: { action: { type: 'string', enum: action === 'project' ? ['list','create','get','update'] : ['prepare','preview','render','job','cancel'] }, id: { type: 'string' }, revision: { type: 'number' }, job: { type: 'string' }, fields: { type: 'object', properties: { template: { type: 'string', enum: ['title','product','slideshow'] }, title: { type: 'string' }, body: { type: 'string' }, format: { type: 'string', enum: ['landscape','portrait','square'] }, duration: { type: 'number' } }, required: ['template','title','body','format','duration'] } }, required: ['action'] },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render(_args: unknown, value: any) {
        const lines = [engine === 'hyperframes' ? 'HyperFrames 视频工作台' : 'Remotion 视频工作台']
        if (Array.isArray(value.projects)) {
          lines.push('已保存工程：' + value.projects.length)
          for (const project of value.projects) lines.push('- ' + project.title + '（版本 ' + project.revision + '；项目编号：' + project.id + '）')
          lines.push(value.environment?.ready ? '渲染环境已就绪。' : '首次预览或导出前，请显式准备渲染环境。')
        } else if (value.title) lines.push('工程：' + value.title + '（版本 ' + value.revision + '）', '项目编号：' + value.id)
        else if (value.state) {
          lines.push('任务状态：' + value.state, '任务编号：' + value.id, value.stage || '')
          if (value.projectId) lines.push('项目编号：' + value.projectId)
          if (value.state === 'running') lines.push('可用 action: job 查询，或 action: cancel 取消；job 参数使用上述任务编号。')
          if (value.url) lines.push('预览：' + value.url)
          if (value.message) lines.push(value.message)
        }
        return [{ type: 'text', text: lines.filter(Boolean).join('\n') }]
      },
    },
    async execute(args: any) {
      const allowed = action === 'project' ? ['list','create','get','update'] : ['prepare','preview','render','job','cancel']
      if (!allowed.includes(args.action)) throw new Error('操作无效。')
      const response = await workbench.fetch(new Request('http://dsh.internal' + workbench.route, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dsh-media': '1' }, body: JSON.stringify(args) }))
      const result: any = await response.json(); if (!result.ok) throw new Error(result.message); return result.value
```

</details>

#### 缺口

- 未测 Host 登录拦截、真实下载及峰值资源
  **影响**：不宜直接放到多人远程宿主
  **进一步探讨**：用测试工程记录 npm/浏览器下载和不同身份的下载响应、内存

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样确认模板短视频值得继续采用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

建议只在私人隔离环境用公开图片制作极短标题片。对比直接用 Remotion CLI 所需的配置、保存、预览与导出步骤，记录安装时间、实际渲染时间、手动排错和内存。输出需通过播放器核对画幅、时长和关键帧。素材或项目超出模板范围时回到手工 React 工程。发生非预期下载、项目无法恢复、旧修订被误发或停止后进程不退出，应停止并取回受管源文件。

待验证的设计是将导出前的修订、素材、环境与预计运行资源生成一张可保存的验收记录，再把成品质量和退出结果附在同一记录。与现有项目号、任务号和修订核查对照，比较错版本导出率和排障时间。若不能减少误交付或明显增加交互负担，就保留现有修订校验。

#### 证据与依据

**依据 1 · 源码核查**：[src/media-workbench.ts:183-197](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L183-L197)

成品检查和修订记录作为基线。

<details>
<summary>查看原文（15行）</summary>

```text
          job.view.stage = '渲染 MP4'
          const output = join(dir, 'final.mp4')
          const browserFile = await this.browserFile(JSON.parse(await readFile(join(this.runtime, 'ready.json'), 'utf8')).browserPath)
          const browserPath = browserFile.length >= 240 ? toNamespacedPath(browserFile) : browserFile
          const chromeMode = /^chrome-headless-shell(?:\.exe)?$/i.test(basename(browserFile)) ? 'headless-shell' : 'chrome-for-testing'
          const args = this.engine === 'hyperframes' ? ['render', '.', '--output', output, '--fps', '24', '--quality', 'draft', '--workers', '1', '--strict', '--no-best-effort', '--no-browser-gpu'] : ['render', 'src/index.jsx', 'ManagedVideo', output, '--codec', 'h264', '--concurrency', '1', '--browser-executable', browserPath, '--chrome-mode', chromeMode]
          await this.run(job, process.execPath, ['--require', join(dir, 'loopback.cjs'), this.cli(), ...args], dir, this.engine === 'hyperframes' ? { HYPERFRAMES_BROWSER_PATH: browserPath } : {})
          const bytes = (await stat(output)).size
          if (bytes < 100 || bytes > 200 * 1024 * 1024) throw new Error('MP4 输出为空或超过 200 MB，请检查运行记录。原工程已保留。')
          const handle = await open(output, 'r'), header = Buffer.alloc(12)
          try { await handle.read(header, 0, 12, 0) } finally { await handle.close() }
          if (header.toString('ascii', 4, 8) !== 'ftyp') throw new Error('渲染器输出不是 MP4 文件，原工程已保留。')
          job.controller.signal.throwIfAborted()
          await this.store.edit(p.id, undefined, current => { current.renders = [{ id: job.view.id, revision: p.revision, bytes, created: new Date().toISOString() }, ...current.renders].slice(0, 5) }, false)
          job.view.output = job.view.id
```

</details>

**依据 2 · 源码核查**：[src/media-workbench.ts:202-210](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-workbench.ts#L202-L210)

停止与工程保留观察点。

```text
      const message = (e as any)?.code === 'ELOCKED' ? '另一个 DSH 实例正在运行本插件任务，请等待完成或在那个实例中停止任务。' : errorMessage(e)
      job.view.state = job.controller.signal.aborted ? 'cancelled' : 'failed'
      job.view.stage = job.view.state === 'cancelled' ? '已取消；工程已保留' : /^官方 .*命令未完成/.test(message) ? '官方任务未完成，请展开运行记录后重试。工程已保留。' : /spawn ffprobe ENOENT/.test(message) ? '未找到 FFprobe。请安装包含 FFmpeg 和 FFprobe 的完整工具包并加入 PATH，重启 DSH 后重新准备环境。工程已保留。' : /spawn ffmpeg ENOENT/.test(message) ? '未找到 FFmpeg，请安装并加入 PATH，重启 DSH 后重试。工程已保留。' : message
      this.log(job, message)
    }
    finally { clearTimeout(timeout); if (unlock) await unlock().catch(() => {}); job.view.url = job.view.state === 'running' ? job.view.url : undefined }
  }
  cancel(id: string): MediaJob { const job = this.jobs.get(mediaId(id)); if (!job) throw new Error('任务不存在。'); if (job.view.state === 'running') job.controller.abort(); return structuredClone(job.view) }
  dispose(): void { this.disposed = true; for (const job of this.jobs.values()) if (job.view.state === 'running') job.controller.abort() }
```

**依据 3 · 源码核查**：[src/media-store.ts:130-133](https://github.com/STARDUSTLC666/dsh-remotion/blob/35677331d8372eaffac3ceab7beef6cab725f664/src/media-store.ts#L130-L133)

显式修订快照。

```text
  async snapshot(id: string, revision: unknown): Promise<{ project: MediaProject; assets: Map<string, Buffer> }> {
    const dir = await this.path(id), unlock = await lockfile.lock(dir, { retries: { retries: 8, minTimeout: 30, maxTimeout: 60 } })
    try { const project = await this.get(id); if (project.revision !== revision) throw new MediaConflict('项目已更新，请保存并重新预览。'); const assets = new Map<string, Buffer>(); for (const a of project.assets) assets.set(a.file, await this.assetBytes(id, a)); return { project, assets } }
    finally { await unlock() }
```

#### 缺口

- 没有实际质量及成本对照
  **影响**：只支持受限试用
  **进一步探讨**：以一台机器跑同样的素材和目标规格，记录时间与可播放结果

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
