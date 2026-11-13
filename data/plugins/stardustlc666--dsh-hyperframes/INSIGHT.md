# dsh-hyperframes

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[5f5b43d](https://github.com/STARDUSTLC666/dsh-hyperframes/tree/5f5b43dcedfc792054173c2fbb358f7aebaea02f)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-hyperframes) [![npm 30d 12,879](https://img.shields.io/static/v1?label=npm+30d&message=12%2C879&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hyperframes) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hyperframes)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中编辑 HTML 视频工程，管理素材并预览、导出 MP4。

> **亮点**：[Q01](#research-q01) 的工作台将编辑工程、准备环境、任务回执和 MP4 记录集中在 DSH。

> **主要限制**：[Q02](#research-q02) 的文件检查只到大小和 ftyp，出品仍需播放与修订复核。进程环境限制无法替代系统沙箱。

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
  - [Q01 · 从标题卡模板到预览与 MP4，插件组织了哪些步骤？](#detail-section-11)
  - [Q02 · 输出验证、取消和进程范围能保证哪些结果？](#detail-section-12)
  - [Q03 · 什么条件下值得试用，怎样降低旧导出误交付？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复制作短标题卡或产品介绍的人，可从模板建立保留修订的可编辑工程。

直接使用 HyperFrames CLI 与独立项目目录，也可手工跟踪模板、素材和导出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工程与素材 | 编辑及保存短片修订 | 本机可写目录 |
| 预览与导出 | 调用官方 CLI 生成 MP4 | 须准备环境并验收成片 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Node | 是 | 加载工作台及工具 | 回到原有流程 |
| FFmpeg、FFprobe、浏览器和官方包 | 渲染需要 | 准备并导出 MP4 | 保留工程，查看环境阶段 |
| 可写本机项目目录 | 是 | 保留素材及修订 | 回退到独立项目 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 创建 | 用户从模板建立公开小项目 | 保存并核对修订 |
| 预览 | 准备环境后启动任务 | 真实预览响应并核对画面 |
| 导出 | 执行指定修订导出并播放 | 结果与修订一致或退回原流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载安装、磁盘与网络，金额未知 | 准备 FFmpeg/浏览器 | 真实配置时间未知 |
| 持续 | 渲染 CPU、磁盘与模型，金额未知 | 编辑、复核与重导出 | 单位短片耗时未知 |
| 失败恢复 | 重试及临时文件开销未知 | 回读任务，备份源项目 | 卸载及清理待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工程修订 | 项目更新带修订检测 | 真实跨窗交互 |
| 预览/导出 | HTTP 预览探测及媒体初检 | 可播放性和画面质量 |
| 中断处理 | 取消与失败状态 | 子进程及文件实际回收 |

> **思考**：[Q02](#research-q02) 的文件检查只到大小和 ftyp，出品仍需播放与修订复核。进程环境限制无法替代系统沙箱。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的工作台将编辑工程、准备环境、任务回执和 MP4 记录集中在 DSH。

[Q02](#research-q02) 的任务与项目锁、修订和导出记录支持回读，环境控制属于调用层，实际媒体输出需要补充独立校验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的文件检查只到大小和 ftyp，出品仍需播放与修订复核。进程环境限制无法替代系统沙箱。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用公开短片试用。按 [Q02](#research-q02) 分别核对源修订与实际播放；失败时保留工程和素材。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持技能和工作台接线、修订快照及渲染任务。真实导出、取消与成本待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/media-workbench.js、lib/media-store.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定宿主入口、路由和关键项目/渲染路径；未执行下载、安装、CLI、浏览器或宿主。
- 下一步：在隔离宿主用短标题卡验证环境准备、同版播放、编辑后旧导出、取消及禁用后的数据保留。

**分析版本**

- **仓库**：[STARDUSTLC666/dsh-hyperframes](https://github.com/STARDUSTLC666/dsh-hyperframes)
- **版本号**：0.11.5（[固定提交 5f5b43d](https://github.com/STARDUSTLC666/dsh-hyperframes/tree/5f5b43dcedfc792054173c2fbb358f7aebaea02f)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出下载前显式展示导出修订并增加可选媒体探测，检验能否减少错交旧成片。

在隔离宿主用短标题卡验证环境准备、同版播放、编辑后旧导出、取消及禁用后的数据保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 90 | 12862 | 10353 | 1705 | — |
| .mjs | test | 79 | 12162 | 10826 | 455 | — |
| .md | source | 134 | 15215 | — | — | 125275 |
| .js | source | 10 | 2524 | 2435 | 89 | — |
| .md | example | 2 | 124 | — | — | 319 |
| .ts | source | 11 | 877 | 797 | 56 | — |
| .tsx | source | 20 | 735 | 578 | 96 | — |
| .tsx | example | 2 | 96 | 74 | 13 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/STARDUSTLC666/dsh-hyperframes/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用 DSH 生成可复用的短视频工程时，工作台怎样保证导出对应哪个修订，哪些质量与运行边界仍需用户检查？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从标题卡模板到预览与 MP4，插件组织了哪些步骤？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要反复制作短标题卡或产品说明的用户可在 DSH 选择模板、添加公开素材并保存工程。宿主入口注册技能目录、健康工具和媒体工作台，工作台同时接宿主路由和模型工具。开始渲染先读工程指定修订的快照并返回 job，进程按参数调用官方 CLI；预览要轮询确认 HTTP 成功才公布 URL。工作台负责项目、修订、状态与导出记录，底层视频渲染来自 HyperFrames CLI。与直接开终端管理模板和文件相比，改动是把可编辑项目及回执集中在宿主。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-40](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/README.md#L18-L40)

作者的工作台和用户流程。

<details>
<summary>查看原文（23行）</summary>

````text
## 功能

- 从标题卡、产品介绍和图文轮播模板开始。
- 编辑内容、上传素材并调整图片顺序。
- 使用官方预览与本机渲染，保留可编辑工程。

## 安装

在 DSH 桌面版「插件」面板安装 `dsh-hyperframes`。已配置命令行时也可使用：

```bash
dsh plugin --profile desktop add dsh-hyperframes
```

网页版把 `desktop` 改为 `web`；安装后重启对应的 DSH。宿主要求以包声明 `>=0.2.1-rc.3` 为准。

## 开始使用

1. 从左侧栏打开 HyperFrames，点击“新建视频”，选模板并填写内容。
2. 先保存工程，再上传素材；在“素材”页调整顺序，原始文件保持不变。
3. 首次使用在“环境”页准备渲染环境，等待实际准备完成。
4. 启动预览并检查画面，停止预览后再编辑或导出 MP4。
5. 播放并下载成品；保存可编辑工程备份。以后可在工程库搜索、排序，或从归档恢复。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:39-56](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/index.js#L39-L56)

技能与工作台接线。

<details>
<summary>查看原文（18行）</summary>

```text
/** Absolute resource root shipped in this independently installable package. */
export function bundledSkillsDir() {
    return fileURLToPath(new URL('../skills/', import.meta.url));
}
const bundle = createSkillBundle({
    plugin: 'dsh-hyperframes',
    healthTool: 'hyperframes_health',
    names: SKILL_NAMES,
    directory: bundledSkillsDir,
});
/** Re-read and validate disk resources; runtime state is checked by the health tool. */
export function checkBundledSkills() { return bundle.checkFiles(); }
/** Register this package's skills and its read-only health tool. */
export function apply(ctx) {
    registerUpdates(ctx, { name: "dsh-hyperframes" });
    bundle.apply(ctx);
    installMediaWorkbench(ctx, 'hyperframes');
}
```

</details>

**依据 3 · 源码核查**：[lib/media-workbench.js:137-157](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L137-L157)

读取指定修订并返回任务 ID。

<details>
<summary>查看原文（21行）</summary>

```text
    async start(kind, id, revision) {
        if (this.disposed)
            throw new Error('插件已卸载，请重新加载。');
        if ([...this.jobs.values()].some(j => j.view.state === 'running' && (j.view.kind === kind || j.view.kind === 'prepare' || kind === 'prepare')))
            throw new Error('已有同类任务运行，请等待完成或明确取消。');
        if (kind !== 'prepare' && !(await this.environment()).ready)
            throw new Error('请先点击“准备渲染环境”，完成首次下载。');
        const snapshot = kind === 'prepare' ? undefined : await this.store.snapshot(mediaId(id), revision);
        if (snapshot)
            projectSources(snapshot.project, this.engine);
        const job = { view: { id: randomUUID(), kind, projectId: snapshot?.project.id, revision: snapshot?.project.revision, state: 'running', stage: kind === 'prepare' ? '下载环境' : '准备修订快照', lines: [] }, controller: new AbortController() };
        if (this.jobs.size >= 30) {
            const old = [...this.jobs.values()].find(j => j.view.state !== 'running');
            if (old)
                this.jobs.delete(old.view.id);
            else
                throw new Error('运行任务过多。');
        }
        this.jobs.set(job.view.id, job);
        void this.execute(job, snapshot);
        return structuredClone(job.view);
```

</details>

**依据 4 · 源码核查**：[lib/media-workbench.js:240-260](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L240-L260)

启动并核对预览。

<details>
<summary>查看原文（21行）</summary>

```text
                    const running = this.run(job, process.execPath, ['--require', join(dir, 'loopback.cjs'), this.cli(), ...args], dir).finally(() => { exited = true; });
                    // Poll the actual server; a chosen port or spawned process is not readiness.
                    const poll = async () => {
                        for (let i = 0; i < 180; i++) {
                            job.controller.signal.throwIfAborted();
                            if (exited)
                                return;
                            try {
                                const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
                                if (response.ok) {
                                    job.view.url = this.engine === 'hyperframes' ? url + '#project/' + job.view.id : url;
                                    job.view.stage = '官方预览已就绪';
                                    return;
                                }
                            }
                            catch { }
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                        job.controller.abort();
                    };
                    await Promise.all([running, poll()]);
```

</details>

**依据 5 · 源码核查**：[lib/media-workbench.js:471-482](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L471-L482)

宿主注册两条路由和模型工具。

<details>
<summary>查看原文（12行）</summary>

```text
export function installMediaWorkbench(ctx, engine) {
    const workbench = new MediaWorkbench(engine);
    ctx.inject?.(['connection'], (host) => {
        host.connection?.fetch?.register({ path: workbench.route, methods: ['GET', 'POST'], requestBody: 'buffered', fetch: (request) => workbench.fetch(request) });
        host.connection?.fetch?.register({ path: workbench.route + '/upload', methods: ['POST'], requestBody: 'streaming', fetch: (request) => workbench.fetch(request) });
    });
    ctx.on?.('dispose', () => workbench.dispose());
    for (const action of ['project', 'render']) {
        const dispose = ctx.tools?.register({
            name: engine + '_' + action,
            description: action === 'project' ? '创建或读取本插件受管理视频工程，列出模板与环境。不会自动安装依赖或渲染。' : '准备官方渲染环境、启动预览/MP4任务、查询进度或取消。工程保存在 DSH 本地数据目录；首次准备环境会下载依赖。',
            parameters: { type: 'object', properties: { action: { type: 'string', enum: action === 'project' ? ['list', 'create', 'get', 'update'] : ['prepare', 'preview', 'render', 'job', 'cancel'] }, id: { type: 'string' }, revision: { type: 'number' }, job: { type: 'string' }, fields: { type: 'object', properties: { template: { type: 'string', enum: ['title', 'product', 'slideshow'] }, title: { type: 'string' }, body: { type: 'string' }, format: { type: 'string', enum: ['landscape', 'portrait', 'square'] }, duration: { type: 'number' } }, required: ['template', 'title', 'body', 'format', 'duration'] } }, required: ['action'] },
```

</details>

#### 缺口

- 可编辑工程及真实画面输出未在宿主复核
  **影响**：影响是否能稳定交付
  **进一步探讨**：用固定模板与公开素材复核预览、下载与重新导出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输出验证、取消和进程范围能保证哪些结果？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

项目更新可带预期 revision，持锁后发现不匹配就报冲突；渲染记录写入启动时的 revision，用户不应把旧修订的 MP4 当作当前项目。出品门槛检查大小和文件头的 ftyp，再把记录写进清单；由此无法确认完整编解码、所有帧或画面质量。插件缩减子进程环境、禁用 shell，并预加载 Node 的 loopback 监听限制；这些措施约束当前调用路径，不能凭它们推断存在进程级文件或外网沙箱。取消或失败有状态，日志给出缺 FFmpeg 和锁冲突等原因；已落盘的文件及清理仍需在实际环境回读。

#### 证据与依据

**依据 1 · 源码核查**：[lib/media-store.js:116-134](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-store.js#L116-L134)

锁内按可选 revision 拒绝陈旧编辑。

<details>
<summary>查看原文（19行）</summary>

```text
    async edit(id, revision, fn, bump = true) {
        const dir = await this.path(id);
        const unlock = await lockfile.lock(dir, { retries: { retries: 8, minTimeout: 30, maxTimeout: 60 } });
        try {
            const p = await this.get(id);
            if (revision !== undefined && revision !== p.revision)
                throw new MediaConflict('工程已在另一窗口更新。你的输入仍保留，请重新打开最新版本后比较。');
            await fn(p);
            if (bump)
                p.revision++;
            p.updated = new Date().toISOString();
            await this.write(p);
            return p;
        }
        finally {
            await unlock();
        }
    }
    async update(id, revision, value) { return this.edit(id, revision, p => { Object.assign(p, validateFields(value)); }); }
```

</details>

**依据 2 · 源码核查**：[lib/media-workbench.js:33-43](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L33-L43)

环境与 loopback 的具体边界。

<details>
<summary>查看原文（11行）</summary>

```text
    const result = {};
    for (const [key, value] of Object.entries(process.env))
        if (/^(path|pathext|systemroot|windir|userprofile|home|appdata|localappdata|https?_proxy|all_proxy|no_proxy|comspec|programfiles|programfiles\(x86\)|hyperframes_browser_path|puppeteer_download_base_url)$/i.test(key))
            result[key] = value;
    return { ...result, ELECTRON_RUN_AS_NODE: '1', DSH_DESKTOP_NODE_EXECUTABLE: process.execPath, HOME: join(root, 'user-home'), USERPROFILE: join(root, 'user-home'), APPDATA: join(root, 'user-home', 'AppData/Roaming'), LOCALAPPDATA: join(root, 'user-home', 'AppData/Local'), CI: '1', NO_COLOR: '1', BROWSER: 'none', TEMP: join(root, 'tmp'), TMP: join(root, 'tmp'), TMPDIR: join(root, 'tmp'), npm_config_userconfig: join(root, 'local.npmrc'), npm_config_cache: join(root, 'npm-cache'), PUPPETEER_CACHE_DIR: join(root, 'browser'), HYPERFRAMES_NO_UPDATE_CHECK: '1', HYPERFRAMES_SKIP_SKILLS: '1', HYPERFRAMES_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1', HYPERFRAMES_EXTRACT_CACHE_DIR: join(root, 'frames') };
}
async function freePort() {
    return new Promise((resolve, reject) => { const server = createServer(); server.once('error', reject); server.listen(0, '127.0.0.1', () => { const address = server.address(); const port = typeof address === 'object' && address ? address.port : 0; server.close(() => resolve(port)); }); });
}
/** Restrict all servers in our renderer child to loopback using Node's public API. */
const LOOPBACK = `const net=require('node:net');const listen=net.Server.prototype.listen;net.Server.prototype.listen=function(...args){if(args[0]&&typeof args[0]==='object'&&'port'in args[0])args[0]={...args[0],host:'127.0.0.1'};else if(typeof args[0]==='number'){if(typeof args[1]==='string')args[1]='127.0.0.1';else args.splice(1,0,'127.0.0.1')}return listen.apply(this,args)};\n`;
```

</details>

**依据 3 · 源码核查**：[lib/media-workbench.js:111-133](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L111-L133)

无 shell 子进程、取消与退出码。

<details>
<summary>查看原文（23行）</summary>

```text
    async run(job, file, args, cwd, environment = {}) {
        job.controller.signal.throwIfAborted();
        await mkdir(join(this.store.root, 'tmp'), { recursive: true });
        await mkdir(join(this.store.root, 'user-home/AppData/Roaming'), { recursive: true });
        await mkdir(join(this.store.root, 'user-home/AppData/Local'), { recursive: true });
        return new Promise((resolve, reject) => {
            const child = spawn(file, args, { cwd, env: { ...childEnv(this.store.root), ...environment }, windowsHide: true, shell: false, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
            job.child = child;
            const abort = () => this.stopChild(job);
            job.controller.signal.addEventListener('abort', abort, { once: true });
            child.stdout?.on('data', data => this.log(job, data.toString()));
            child.stderr?.on('data', data => this.log(job, data.toString()));
            const finish = () => { job.controller.signal.removeEventListener('abort', abort); if (job.child === child)
                job.child = undefined; };
            child.once('error', e => { finish(); reject(e); });
            child.once('close', code => { finish(); if (job.controller.signal.aborted)
                reject(new Error('操作已取消。'));
            else if (code !== 0) {
                const useful = job.view.lines.filter(line => /^(?:\w*Error:|npm error)|\b(?:ENOENT|EACCES|ECONNRESET)\b|Unknown flag|Failed to |DevTools remote debugging/.test(line));
                reject(new Error(`官方 ${this.engine} 命令未完成（退出码 ${code}）。\n` + (useful.length ? useful.slice(0, 3) : job.view.lines.slice(-5)).join('\n')));
            }
            else
                resolve(); });
```

</details>

**依据 4 · 源码核查**：[lib/media-workbench.js:271-305](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L271-L305)

输出门槛、修订标记和失败状态。

<details>
<summary>查看原文（35行）</summary>

```text
                    const chromeMode = /^chrome-headless-shell(?:\.exe)?$/i.test(basename(browserFile)) ? 'headless-shell' : 'chrome-for-testing';
                    const args = this.engine === 'hyperframes' ? ['render', '.', '--output', output, '--fps', '24', '--quality', 'draft', '--workers', '1', '--strict', '--no-best-effort', '--no-browser-gpu'] : ['render', 'src/index.jsx', 'ManagedVideo', output, '--codec', 'h264', '--concurrency', '1', '--browser-executable', browserPath, '--chrome-mode', chromeMode];
                    await this.run(job, process.execPath, ['--require', join(dir, 'loopback.cjs'), this.cli(), ...args], dir, this.engine === 'hyperframes' ? { HYPERFRAMES_BROWSER_PATH: browserPath } : {});
                    const bytes = (await stat(output)).size;
                    if (bytes < 100 || bytes > 200 * 1024 * 1024)
                        throw new Error('MP4 输出为空或超过 200 MB，请检查运行记录。原工程已保留。');
                    const handle = await open(output, 'r'), header = Buffer.alloc(12);
                    try {
                        await handle.read(header, 0, 12, 0);
                    }
                    finally {
                        await handle.close();
                    }
                    if (header.toString('ascii', 4, 8) !== 'ftyp')
                        throw new Error('渲染器输出不是 MP4 文件，原工程已保留。');
                    job.controller.signal.throwIfAborted();
                    await this.store.edit(p.id, undefined, current => { current.renders = [{ id: job.view.id, revision: p.revision, bytes, created: new Date().toISOString() }, ...current.renders].slice(0, 5); }, false);
                    job.view.output = job.view.id;
                }
            }
            job.view.state = job.controller.signal.aborted ? 'cancelled' : 'done';
            job.view.stage = job.view.state === 'done' ? '已完成' : '已取消';
        }
        catch (e) {
            const message = e?.code === 'ELOCKED' ? '另一个 DSH 实例正在运行本插件任务，请等待完成或在那个实例中停止任务。' : errorMessage(e);
            job.view.state = job.controller.signal.aborted ? 'cancelled' : 'failed';
            job.view.stage = job.view.state === 'cancelled' ? '已取消；工程已保留' : /^官方 .*命令未完成/.test(message) ? '官方任务未完成，请展开运行记录后重试。工程已保留。' : /spawn ffprobe ENOENT/.test(message) ? '未找到 FFprobe。请安装包含 FFmpeg 和 FFprobe 的完整工具包并加入 PATH，重启 DSH 后重新准备环境。工程已保留。' : /spawn ffmpeg ENOENT/.test(message) ? '未找到 FFmpeg，请安装并加入 PATH，重启 DSH 后重试。工程已保留。' : message;
            this.log(job, message);
        }
        finally {
            clearTimeout(timeout);
            if (unlock)
                await unlock().catch(() => { });
            job.view.url = job.view.state === 'running' ? job.view.url : undefined;
        }
```

</details>

#### 缺口

- 目标系统中的取消、预览进程退出和完整 MP4 可播放性未核
  **影响**：决定工作台能否可靠替代已有 CLI
  **进一步探讨**：用短项目验证取消前后状态、文件及播放

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么条件下值得试用，怎样降低旧导出误交付？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先在隔离 DSH 环境核对版本、Node、FFmpeg、FFprobe 与用于官方渲染的浏览器。安装官方依赖、下载浏览器和运行渲染会消耗网络、CPU 和磁盘，需要与编辑复核时间分开记录。短片可从标题卡开始，准备环境后验证预览，再对同一修订做实际播放和内容核对；失败时保留源工程和素材，回到现有视频流程。一个可检验的改进是把渲染记录与当前修订的差异作为下载入口的明确状态，并可选执行媒体探测。编辑后复用旧 MP4、任务取消和无效文件三个对照若能减少误下载且不显著增加合格导出等待，才值得采用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:57-60](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/package.json#L57-L60)

Node 和 DSH 版本要求。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.3"
  },
```

**依据 2 · 源码核查**：[lib/media-workbench.js:163-185](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L163-L185)

准备环境依赖及下载。

<details>
<summary>查看原文（23行）</summary>

```text
        try {
            await this.store.init();
            await mkdir(this.runtime, { recursive: true });
            const slot = join(this.store.root, 'workbench-slot');
            await mkdir(slot, { recursive: true });
            unlock = await lockfile.lock(slot, { retries: 0, stale: 30000, update: 10000, onCompromised: () => job.controller.abort() });
            if (job.view.kind === 'prepare') {
                await unlink(join(this.runtime, 'ready.json')).catch(() => { });
                if (this.engine === 'hyperframes') {
                    job.view.stage = '检查 FFmpeg';
                    await this.run(job, 'ffmpeg', ['-version'], this.runtime);
                    job.view.stage = '检查 FFprobe';
                    await this.run(job, 'ffprobe', ['-version'], this.runtime);
                }
                const dependencies = this.engine === 'hyperframes' ? { hyperframes: MEDIA_VERSIONS.hyperframes, gsap: MEDIA_VERSIONS.gsap } : { '@remotion/cli': MEDIA_VERSIONS.remotion, remotion: MEDIA_VERSIONS.remotion, react: '18.3.1', 'react-dom': '18.3.1' };
                await writeFile(join(this.runtime, 'package.json'), JSON.stringify({ private: true, dependencies }));
                job.view.stage = '下载官方依赖';
                await this.run(job, process.execPath, [npmCli(), 'install', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org'], this.runtime);
                job.view.stage = '检查官方环境';
                await this.run(job, process.execPath, [this.cli(), ...(this.engine === 'hyperframes' ? ['--version'] : ['versions'])], this.runtime);
                job.view.stage = '检查或下载 Chrome';
                if (this.engine === 'hyperframes') {
                    const configured = process.env.HYPERFRAMES_BROWSER_PATH?.trim();
```

</details>

**依据 3 · 源码核查**：[lib/media-workbench.js:271-289](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/lib/media-workbench.js#L271-L289)

只做媒体外部特征检查及修订绑定。

<details>
<summary>查看原文（19行）</summary>

```text
                    const chromeMode = /^chrome-headless-shell(?:\.exe)?$/i.test(basename(browserFile)) ? 'headless-shell' : 'chrome-for-testing';
                    const args = this.engine === 'hyperframes' ? ['render', '.', '--output', output, '--fps', '24', '--quality', 'draft', '--workers', '1', '--strict', '--no-best-effort', '--no-browser-gpu'] : ['render', 'src/index.jsx', 'ManagedVideo', output, '--codec', 'h264', '--concurrency', '1', '--browser-executable', browserPath, '--chrome-mode', chromeMode];
                    await this.run(job, process.execPath, ['--require', join(dir, 'loopback.cjs'), this.cli(), ...args], dir, this.engine === 'hyperframes' ? { HYPERFRAMES_BROWSER_PATH: browserPath } : {});
                    const bytes = (await stat(output)).size;
                    if (bytes < 100 || bytes > 200 * 1024 * 1024)
                        throw new Error('MP4 输出为空或超过 200 MB，请检查运行记录。原工程已保留。');
                    const handle = await open(output, 'r'), header = Buffer.alloc(12);
                    try {
                        await handle.read(header, 0, 12, 0);
                    }
                    finally {
                        await handle.close();
                    }
                    if (header.toString('ascii', 4, 8) !== 'ftyp')
                        throw new Error('渲染器输出不是 MP4 文件，原工程已保留。');
                    job.controller.signal.throwIfAborted();
                    await this.store.edit(p.id, undefined, current => { current.renders = [{ id: job.view.id, revision: p.revision, bytes, created: new Date().toISOString() }, ...current.renders].slice(0, 5); }, false);
                    job.view.output = job.view.id;
                }
```

</details>

**依据 4 · 作者声明**：[README.md:34-48](https://github.com/STARDUSTLC666/dsh-hyperframes/blob/5f5b43dcedfc792054173c2fbb358f7aebaea02f/README.md#L34-L48)

作者的编辑、导出及重导出流程。

<details>
<summary>查看原文（15行）</summary>

```text
## 开始使用

1. 从左侧栏打开 HyperFrames，点击“新建视频”，选模板并填写内容。
2. 先保存工程，再上传素材；在“素材”页调整顺序，原始文件保持不变。
3. 首次使用在“环境”页准备渲染环境，等待实际准备完成。
4. 启动预览并检查画面，停止预览后再编辑或导出 MP4。
5. 播放并下载成品；保存可编辑工程备份。以后可在工程库搜索、排序，或从归档恢复。

可以这样说：

> 制作一个 HTML 产品介绍视频，先确认文案与结构，再预览和导出 MP4。

## 开始前要知道

首次使用需准备官方渲染环境；工程修改后需要重新导出。
```

</details>

#### 缺口

- 固定版本的成功率、单次渲染资源开销和退出成本未知
  **影响**：影响反复制作的采用价值
  **进一步探讨**：在相同主机和小片素材下比较现有 CLI/工作台

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
