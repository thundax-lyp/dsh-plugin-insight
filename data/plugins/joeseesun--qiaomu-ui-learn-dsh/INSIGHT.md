# 乔木 UI 学习

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[ad7dffd](https://github.com/joeseesun/qiaomu-ui-learn-dsh/tree/ad7dffddcd08fd9878db9d8123559fc6540a77bb)

<!-- BEGIN META -->
[![GitHub ★ 80](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/joeseesun/qiaomu-ui-learn-dsh)
<!-- END META -->

> **功能**：在 DSH 浏览设计参考、学习UI词汇与测验，并保存点评和Markdown。

> **亮点**：[Q01](#research-q01) 新增DSH容器、文件保存及可选Home接线，内容继承原项目。

> **主要限制**：[Q02](#research-q02) revision与etag保护有服务实例边界，不能推出跨进程安全。

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
  - [Q01 · DSH适配增加了什么学习流程？](#detail-section-11)
  - [Q02 · 学习记录和Markdown如何拒绝覆盖？](#detail-section-12)
  - [Q03 · 怎样试用并保留自己的笔记？](#detail-section-13)
  - [Q04 · 多进程保存是否需要文件级版本交换？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在DSH里整理设计参考并写学习笔记的用户。

在独立学习工具中浏览，再复制点评到项目。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 学习界面 | 参考词典与练习 | 内容继承原项目 |
| 记录笔记 | 保存点评及Markdown | 独立目录和冲突核对 |
| 参考源码 | 有界下载公开HTML | 依赖远端 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 固定兼容DSH | 必需 | 界面及remote | 回原学习工具 |
| 独立dataDir与notesRoot | 试用需要 | 隔离学习记录 | 勿与真实记录混用 |
| 远端图库 | 部分预览需要 | 缩略图和源码 | 断网保留本地词典 |
| Home v1 | 可选 | 首页卡片和搜索 | 独立工作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立记录和笔记目录 | 备份已有数据 |
| 学习 | 参考点评及测验 | 检查持久状态 |
| 导出 | Markdown读写与冲突 | 读回内容 |
| 退出 | 备份state和notes后禁用 | 回原工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地磁盘和网络未知 | 准备参考与目录 | 无模型调用路径 |
| 持续使用 | 图库下载资源未知 | 整理点评与导出 | 按素材 |
| 失败恢复 | 数据副本未知 | 处理冲突及独立恢复 | 需读回文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 学习入口 | 继承界面与宿主接线 | 真实学习收益 |
| 文件保存 | revision与etag门 | 跨进程竞争 |
| 源码读取 | 限制目录、重定向和字节 | 远端稳定性 |

> **思考**：[Q02](#research-q02) revision与etag保护有服务实例边界，不能推出跨进程安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 新增DSH容器、文件保存及可选Home接线，内容继承原项目。

[Q02](#research-q02) 存储拒读不覆盖原件，边界仍受进程与外部编辑影响。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) revision与etag保护有服务实例边界，不能推出跨进程安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先独立目录验证一条笔记。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

宿主适配、存储与下载静态核查，学习及恢复效果未知。

- 已检查：作者 README、包清单、源码路径 README.md、src/client.jsx、src/host.js、src/notes.js、src/source.js、src/storage.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定学习适配入口、remote、state/notes与源码下载。
- 下一步：核对导出、版本冲突、断网和双进程保存。

**分析版本**

- **仓库**：[joeseesun/qiaomu-ui-learn-dsh](https://github.com/joeseesun/qiaomu-ui-learn-dsh)
- **版本号**：0.1.4（[固定提交 ad7dffd](https://github.com/joeseesun/qiaomu-ui-learn-dsh/tree/ad7dffddcd08fd9878db9d8123559fc6540a77bb)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 若共享home真实并发丢写，再评估文件级条件提交。

核对导出、版本冲突、断网和双进程保存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 54321 | 47429 | 4884 | — |
| .md | source | 7 | 339 | — | — | 4963 |
| .mjs | source | 2 | 48 | 48 | 0 | — |
| .jsx | source | 3 | 221 | 220 | 0 | — |
| .ts | source | 17 | 3906 | 3436 | 147 | — |
| .mjs | test | 7 | 341 | 338 | 6 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/joeseesun/qiaomu-ui-learn-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：设计学习如何迁入DSH，记录和Markdown保存能否可靠复核？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH适配增加了什么学习流程？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要边看参考边写点评的设计学习者，可在DSH浏览图库、词典及测验，再保存学习状态和Markdown。作者明确沿用Obsidian版的内容与界面，不能把这些语料和训练设计当作本适配原创。host把StateStore、NotesStore和受限参考源码下载暴露为remote方法，客户端注册快捷操作和主视图，并可选对接Home provider。相比来回切Obsidian，变化是宿主入口及文件交付，不是自动提高审美。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-20](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/README.md#L3-L20)

继承界面与功能描述

<details>
<summary>查看原文（18行）</summary>

```text
> v0.1.4：DeepSeek Harness **0.2.2-rc.1** 兼容更新。[本次验证范围](docs/DSH-0.2.2-RC1.md)。

在 DeepSeek Harness 里浏览设计参考、学习 UI 词汇、练习审美，并把自己的点评保存成 Markdown。

直接沿用 [Obsidian 版乔木 UI 学习](https://github.com/joeseesun/qiaomu-ui-learn) 的图库、词典、风格、测验、详情、收藏夹和设置界面，产品 CSS 保持一致。迁移仅替换宿主容器、文件保存、快捷操作和 Home 联动接口。

![原版图库](docs/screenshots/original-gallery.png)

## 功能

- 13,561 条设计参考、184 个分类；搜索、收藏夹、最近浏览、点评筛选和卡片密度。
- UI 词典与风格图鉴：106 个交互标本、双语解释、识别特征、关联风格、代码与实现提示词。
- 审美测验：组件、风格或混合练习，键盘作答、掌握状态与复习记录。
- 五星评价、标签、评论；逐条或批量导出 Markdown，笔记浏览、光标插入和未保存草稿恢复。
- 原版设计灯箱、图片/Markdown/提示词复制、参考页面 HTML 源码读取。
- 导入 Obsidian `data.json` 或本插件备份；覆盖前下载现有记录备份。
- 5 个 Harness 原生快捷操作，可在宿主快捷键设置中绑定。
- 安装支持 v1 provider 服务的乔木 Home 后，提供最近设计卡片、浏览入口和全局设计搜索；没有 Home 时独立工作。
```

</details>

**依据 2 · 源码核查**：[src/host.js:32-80](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/host.js#L32-L80)

宿主服务接线

<details>
<summary>查看原文（49行）</summary>

```text
export default class PluginService extends TypertRemoteService {
  constructor(ctx, config = {}) {
    super(ctx, SERVICE);
    this.store = new StateStore(
      config.dataDir ||
        path.join(
          process.env.DSH_HOME || path.join(homedir(), ".dsh"),
          "qiaomu",
          NAME,
        ),
    );
    this.notes = new NotesStore(
      config.notesRoot || path.join(path.dirname(this.store.file), "notes"),
    );
  }
  notesList(request) {
    return this.notes.list(request?.folder || "");
  }
  notesRead(request) {
    return this.notes.read(request.path);
  }
  notesWrite(request) {
    return this.notes.write(request);
  }
  referenceSource(request) {
    return fetchReference(request);
  }
  load() {
    return this.store.load();
  }
  save(request) {
    return this.store.save(request);
  }
}
for (const name of [
  "load",
  "save",
  "notesList",
  "notesRead",
  "notesWrite",
  "referenceSource",
])
  Remote(name)(PluginService.prototype[name], {
    name,
    private: false,
    static: false,
    addInitializer(fn) {
      fn.call(Object.create(PluginService.prototype));
    },
```

</details>

**依据 3 · 源码核查**：[src/client.jsx:26-48](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/client.jsx#L26-L48)

快捷操作与可选Home

<details>
<summary>查看原文（23行）</summary>

```text
    send(action) { if(runAction)void runAction(action);else pending=action; },
  };
  ctx.inject(["shortcuts","layout"], ready => {
    for(const [action,zh,en] of [
      ["gallery","打开灵感图库","Open design gallery"],
      ["dictionary","打开 UI 词典","Open UI dictionary"],
      ["styles","打开风格图鉴","Open style atlas"],
      ["quiz","打开审美测验","Open design quiz"],
      ["export","导出全部学习笔记","Export all study notes"],
    ]) ready.effect(()=>ready.shortcuts.register({
      id:`${ID}.${action}`,label:()=>`${TITLE} · ${navigator.language.startsWith('zh')?zh:en}`,
      aliases:[en,zh,"Qiaomu UI Learn"],defaults:{},regions:["page","editable"],modals:[],
      resolve:()=>({status:"handled",run:()=>{ready.layout.selectPanel(ID);actions.send(action);}}),
    }));
  });
  const listeners = new Set();
  let api = null,
    error = "";
  const notify = () => {listeners.forEach((f) => f());actions.changed();};
  ctx.inject(["qiaomuHome","layout"],ready=>ready.effect(()=>ready.qiaomuHome.register(NAME,createHomeProvider({
    load:()=>api?.load()??Promise.resolve({data:{}}),
    open:action=>{ready.layout.selectPanel(ID);actions.send(action);},
    subscribe:fn=>{homeListeners.add(fn);return()=>homeListeners.delete(fn);},
```

</details>

**依据 4 · 源码核查**：[src/client.jsx:125-145](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/client.jsx#L125-L145)

主界面注册

<details>
<summary>查看原文（21行）</summary>

```text
        ) : (
          <p role="status">{error || "正在连接本地服务 / Connecting…"}</p>
        )}
      </div>
    );
  }
  ctx.effect(() =>
    ctx.slots.inject("main", () =>
      ctx.slots.register({ name: "main", key: ID, locale: ID }, Panel),
    ),
  );
  ctx.effect(() =>
    ctx.slots.inject("sidebar.panellist", () =>
      ctx.slots.register(
        {
          name: "sidebar.panellist",
          id: ID,
          order: 45,
          locale: ID,
          label: () => TITLE,
        },
```

</details>

#### 缺口

- 学习效果与真实DSH兼容未独立验证
  **影响**：不能宣称测验带来能力提升或减少学习时间
  **进一步探讨**：用一篇参考完成点评、笔记及重开核对

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 学习记录和Markdown如何拒绝覆盖？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

StateStore有本实例队列，加载时校验revision和data；非ENOENT损坏拒读并保留文件。保存要求客户端revision等于当前值，8MB上限，临时文件后rename。笔记根先realpath，拒绝绝对、点段、非Markdown路径并逐段lstat拒symlink；读回2MB上限和etag，写前比etag，再用临时文件与rename。两者保护普通窗口冲突，但队列不跨宿主进程，检查到rename之间还有外部编辑窗口，不能当同权限恶意进程隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/storage.js:9-58](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/storage.js#L9-L58)

revision队列与原子替换

<details>
<summary>查看原文（50行）</summary>

```text
  async load() {
    try {
      const raw = JSON.parse(await readFile(this.file, "utf8"));
      if (
        !Number.isSafeInteger(raw.revision) ||
        raw.revision < 0 ||
        !raw.data ||
        typeof raw.data !== "object" ||
        Array.isArray(raw.data)
      )
        throw Error("Invalid saved data");
      return raw;
    } catch (e) {
      if (e.code === "ENOENT") return { revision: 0, data: {} };
      throw Error("Saved data could not be read. Original file preserved.", {
        cause: e,
      });
    }
  }
  save(input) {
    const task = this.queue
      .catch(() => {})
      .then(async () => {
        if (
          !input ||
          !Number.isSafeInteger(input.revision) ||
          !input.data ||
          typeof input.data !== "object" ||
          Array.isArray(input.data)
        )
          throw Error("Invalid state");
        const current = await this.load();
        if (input.revision !== current.revision)
          throw Error(
            "Another window saved changes. Reopen this panel before saving.",
          );
        const next = { revision: current.revision + 1, data: input.data };
        const text = JSON.stringify(next);
        if (Buffer.byteLength(text) > 8 * 1024 * 1024)
          throw Error(
            "Saved project exceeds 8 MB. Export it as a file instead.",
          );
        await mkdir(path.dirname(this.file), { recursive: true, mode: 0o700 });
        const temp = this.file + "." + randomUUID() + ".tmp";
        await writeFile(temp, text, { mode: 0o600 });
        await rename(temp, this.file);
        return next;
      });
    this.queue = task;
    return task;
```

</details>

**依据 2 · 源码核查**：[src/notes.js:14-54](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/notes.js#L14-L54)

根及链接路径检查

<details>
<summary>查看原文（41行）</summary>

```text
export class NotesStore {
  constructor(root) {
    this.root = path.resolve(root);
    this.queue = Promise.resolve();
    this.ready = mkdir(this.root, { recursive: true, mode: 0o700 })
      .then(() => realpath(this.root))
      .then((root) => {
        this.root = root;
      });
  }
  async resolve(relative, { directory = false } = {}) {
    await this.ready;
    if (
      typeof relative !== "string" ||
      relative.includes("\0") ||
      path.isAbsolute(relative) ||
      relative.split(/[\\/]/).some((x) => x === ".." || x.startsWith("."))
    )
      throw Error("Choose a relative path inside the notes folder");
    if (!directory && !relative.toLowerCase().endsWith(".md"))
      throw Error("Only Markdown notes are supported");
    const target = path.resolve(this.root, relative);
    if (target !== this.root && !target.startsWith(this.root + path.sep))
      throw Error("Invalid note path");
    // The explicit root is canonicalized (macOS /tmp and /var are symlinks).
    // Never follow user-controlled links beneath that root.
    let current = this.root;
    for (const part of target
      .slice(current.length)
      .split(path.sep)
      .filter(Boolean)) {
      current = path.join(current, part);
      try {
        const stat = await lstat(current);
        if (stat.isSymbolicLink())
          throw Error("Symbolic links are not followed");
      } catch (e) {
        if (e.code !== "ENOENT") throw e;
      }
    }
    return target;
```

</details>

**依据 3 · 源码核查**：[src/notes.js:83-129](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/notes.js#L83-L129)

etag与写入

<details>
<summary>查看原文（47行）</summary>

```text
  async read(relative) {
    const filename = await this.resolve(relative);
    const s = await lstat(filename);
    if (!s.isFile() || s.size > 2 * 1024 * 1024)
      throw Error("Note exceeds 2 MB or is not a file");
    const text = await readFile(filename, "utf8");
    return { path: relative, text, etag: hash(text) };
  }
  write(request) {
    const work = this.queue
      .catch(() => {})
      .then(async () => {
        if (
          !request ||
          typeof request.text !== "string" ||
          Buffer.byteLength(request.text) > 2 * 1024 * 1024
        )
          throw Error("Invalid note or note exceeds 2 MB");
        const filename = await this.resolve(request.path);
        let existing = null;
        try {
          existing = await this.read(request.path);
        } catch (e) {
          if (e.code !== "ENOENT") throw e;
        }
        if ((existing?.etag ?? null) !== (request.etag ?? null))
          throw Error(
            "The note has changed or already exists. Open it again before saving.",
          );
        await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
        await this.resolve(request.path);
        const temp = filename + "." + randomUUID() + ".tmp";
        try {
          await writeFile(temp, request.text, { mode: 0o600, flag: "wx" });
          await rename(temp, filename);
        } catch (e) {
          await unlink(temp).catch(() => {});
          throw e;
        }
        return {
          path: request.path,
          text: request.text,
          etag: hash(request.text),
        };
      });
    this.queue = work;
    return work;
```

</details>

#### 缺口

- 跨进程或外部编辑竞争的真实结果未测
  **影响**：共享home可能出现检查后写入冲突
  **进一步探讨**：两测试宿主用同一数据目录在读后延迟保存

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用并保留自己的笔记？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需匹配固定作者要求的DSH版本，Home不是独立工作的必要条件。dataDir与notesRoot可单独设绝对路径，默认跟DSH_HOME，因此不同profile共享home时也共享记录。用测试目录先完成点评、导出、编辑和冲突拒绝；远端缩略图与预览有网络，参考源码只接受目录内key映射的特定HTTPS路径，拒重定向、15秒超时、2MB实际流量上限，并在12万字符处截断。现金与本地磁盘未知，没有模型生成路径；人工要整理参考和核对导出。退出禁用插件前导出记录并备份state及notes，不能只清浏览器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-42](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/README.md#L24-L42)

宿主版本与数据网络

<details>
<summary>查看原文（19行）</summary>

````text
## 安装

要求 DeepSeek Harness **0.2.2-rc.1**。从 [Releases](https://github.com/joeseesun/qiaomu-ui-learn-dsh/releases) 下载 `.tgz` 和 `SHA256SUMS`，核对摘要后，在 Harness 插件管理中安装本地 bundle。按宿主提示重载，然后从侧边栏打开「乔木 UI 学习」。

也可使用 Harness 自带 CLI 安装到指定 profile：

```sh
dsh plugin --profile YOUR_PROFILE add /absolute/path/qiaomu-ui-learn-dsh-0.1.4.tgz
```

`YOUR_PROFILE` 替换为自己的 profile。macOS App 自带 CLI 位于 `/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh`。本项目交付预构建 GitHub Release 包，不需要 npm 账号或 Obsidian。

Home 联动需要提供 `qiaomuHome` v1 服务的版本；Home 0.2.1 的旧发布包尚无此接口。

## 数据与网络

默认学习记录位于 `${DSH_HOME:-~/.dsh}/qiaomu/qiaomu-ui-learn-dsh/state.json`，Markdown 位于同目录 `notes/`。Host 支持绝对路径配置 `dataDir`、`notesRoot`。现有 Obsidian 数据不会被自动修改；需要迁移时在设置中手动选择 JSON。不同 profile 使用同一 DSH_HOME 时默认共享该插件数据，可配置 `dataDir` 隔离。

图库缩略图与参考预览按需从 Kombai 加载；词典、风格与交互标本随包提供。源码下载限定公开参考目录、15 秒超时、2 MB 响应上限。笔记操作限制在所配置的目录内，写入校验版本，冲突时保留现有文件。
````

</details>

**依据 2 · 源码核查**：[src/host.js:8-44](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/host.js#L8-L44)

绝对目录配置

<details>
<summary>查看原文（37行）</summary>

```text
export const Config = {
  "~standard": {
    version: 1,
    vendor: NAME,
    validate(value) {
      if (value == null) return { value: {} };
      if (
        typeof value !== "object" ||
        Array.isArray(value) ||
        Object.keys(value).some((k) => !["dataDir", "notesRoot"].includes(k)) ||
        (value.dataDir !== undefined &&
          (typeof value.dataDir !== "string" ||
            !path.isAbsolute(value.dataDir))) ||
        (value.notesRoot !== undefined &&
          (typeof value.notesRoot !== "string" ||
            !path.isAbsolute(value.notesRoot)))
      )
        return {
          issues: [{ message: "dataDir must be an absolute directory" }],
        };
      return { value };
    },
  },
};
export default class PluginService extends TypertRemoteService {
  constructor(ctx, config = {}) {
    super(ctx, SERVICE);
    this.store = new StateStore(
      config.dataDir ||
        path.join(
          process.env.DSH_HOME || path.join(homedir(), ".dsh"),
          "qiaomu",
          NAME,
        ),
    );
    this.notes = new NotesStore(
      config.notesRoot || path.join(path.dirname(this.store.file), "notes"),
```

</details>

**依据 3 · 源码核查**：[src/source.js:4-31](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/source.js#L4-L31)

固定URL及流量截断

<details>
<summary>查看原文（28行）</summary>

```text
export async function fetchReference(request, fetcher = fetch) {
  const item = lookup.get(request?.key);
  const url = item && previewUrl(item.row, item.cat.k);
  if (
    !url ||
    !/^https:\/\/agent\.kombai\.com\/kombai-inspiration-library\/(?:app-pages|sections)\/[a-z0-9-]+\/web\/\d+\/index\.html$/.test(
      url,
    )
  )
    throw Error("This reference has no downloadable HTML source");
  const response = await fetcher(url, {
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw Error(`Reference download failed (${response.status})`);
  if (Number(response.headers.get("content-length")) > 2 * 1024 * 1024)
    throw Error("Reference source exceeds 2 MB");
  let size = 0,
    text = "";
  const decoder = new TextDecoder();
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024) throw Error("Reference source exceeds 2 MB");
    text += decoder.decode(chunk, { stream: true });
  }
  text += decoder.decode();
  return { url, text: text.slice(0, 120000), truncated: text.length > 120000 };
```

</details>

#### 缺口

- 远端资源、导出恢复和卸载未运行
  **影响**：不能确认离线完整体验或数据迁移成功
  **进一步探讨**：小参考集验证断网、截断及独立目录恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多进程保存是否需要文件级版本交换？

**研究主题**：新假设与验证

#### 完整回答

当前revision和etag已覆盖同服务实例，新增研究应针对共享home的两个host同时保存。以一个旧revision或etag进入的两次操作，在检查后同时继续，比较最终文件与客户端成功回执。若两次都成功而有数据丢失，可试验文件锁或条件提交；若宿主已保证单进程，或增强机制不改善目标环境，就保留现有设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/storage.js:28-58](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/storage.js#L28-L58)

进程内queue及rename

<details>
<summary>查看原文（31行）</summary>

```text
  save(input) {
    const task = this.queue
      .catch(() => {})
      .then(async () => {
        if (
          !input ||
          !Number.isSafeInteger(input.revision) ||
          !input.data ||
          typeof input.data !== "object" ||
          Array.isArray(input.data)
        )
          throw Error("Invalid state");
        const current = await this.load();
        if (input.revision !== current.revision)
          throw Error(
            "Another window saved changes. Reopen this panel before saving.",
          );
        const next = { revision: current.revision + 1, data: input.data };
        const text = JSON.stringify(next);
        if (Buffer.byteLength(text) > 8 * 1024 * 1024)
          throw Error(
            "Saved project exceeds 8 MB. Export it as a file instead.",
          );
        await mkdir(path.dirname(this.file), { recursive: true, mode: 0o700 });
        const temp = this.file + "." + randomUUID() + ".tmp";
        await writeFile(temp, text, { mode: 0o600 });
        await rename(temp, this.file);
        return next;
      });
    this.queue = task;
    return task;
```

</details>

**依据 2 · 源码核查**：[src/notes.js:91-129](https://github.com/joeseesun/qiaomu-ui-learn-dsh/blob/ad7dffddcd08fd9878db9d8123559fc6540a77bb/src/notes.js#L91-L129)

etag读后写入

<details>
<summary>查看原文（39行）</summary>

```text
  write(request) {
    const work = this.queue
      .catch(() => {})
      .then(async () => {
        if (
          !request ||
          typeof request.text !== "string" ||
          Buffer.byteLength(request.text) > 2 * 1024 * 1024
        )
          throw Error("Invalid note or note exceeds 2 MB");
        const filename = await this.resolve(request.path);
        let existing = null;
        try {
          existing = await this.read(request.path);
        } catch (e) {
          if (e.code !== "ENOENT") throw e;
        }
        if ((existing?.etag ?? null) !== (request.etag ?? null))
          throw Error(
            "The note has changed or already exists. Open it again before saving.",
          );
        await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
        await this.resolve(request.path);
        const temp = filename + "." + randomUUID() + ".tmp";
        try {
          await writeFile(temp, request.text, { mode: 0o600, flag: "wx" });
          await rename(temp, filename);
        } catch (e) {
          await unlink(temp).catch(() => {});
          throw e;
        }
        return {
          path: request.path,
          text: request.text,
          etag: hash(request.text),
        };
      });
    this.queue = work;
    return work;
```

</details>

#### 缺口

- 真实多进程丢写未复现
  **影响**：不能把潜在竞争写成已发生数据损失
  **进一步探讨**：先确定部署允许共享home再并发合成记录

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
