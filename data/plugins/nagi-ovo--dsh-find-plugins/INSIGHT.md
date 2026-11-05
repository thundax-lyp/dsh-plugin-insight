# dsh-find-plugins

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[61b30c6](https://github.com/Nagi-ovo/dsh-find-plugins/tree/61b30c697f12075ac1071418b7b7ca2300de37ac)

<!-- BEGIN META -->
[![GitHub ★ 182](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=182&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-find-plugins)
<!-- END META -->

> **功能**：按 GitHub topic 发现 DSH 插件，比较候选并引导安全检查、安装和挂载验证。

> **亮点**：[Q01](#research-q01) 以公共 topic 当前地址整理候选，[Q02](#research-q02) 将装法和风险复核分为显式步骤。

> **主要限制**：[Q01](#research-q01) 搜索窗口有上限，[Q02](#research-q02) 安装确认是 Agent 流程约定，权限仍由宿主和目标包决定。

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
  - [Q01 · 候选检索比手工查 topic 多完成哪些工作？](#detail-section-11)
  - [Q02 · 安装前的保护由谁执行？](#detail-section-12)
  - [Q03 · 如何试用及回退？](#detail-section-13)
  - [Q04 · 如何降低搜索覆盖误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要按任务寻找 DSH 插件且不了解仓库名和装法的用户。

用户手工搜索 topic、读包声明并在 profile 核对挂载。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 候选发现 | 按 topic 搜索当前仓库 | 需 GitHub API，结果受查询窗口限制 |
| 安装引导 | 比较装法及审查权限 | 需用户确认与宿主执行 |
| 挂载核对 | 查验界面或技能条目 | 需访问目标 profile |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node 和 GitHub API | 检索必需 | 运行查询 | 报告错误或手工核对 |
| GitHub 凭据 | 可选 | 增加查询限额 | 无令牌时使用公开 API |
| DSH 技能发现根 | 宿主使用必需 | 载入技能文本 | 检查 profile 和技能列表 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 加载 | 用户将技能放入测试项目 | 宿主技能列表可见 |
| 检索 | Agent 比较少量候选 | 对照当前仓库与装法 |
| 确认 | 用户复核权限并决定是否继续 | 缺证即停 |
| 验证 | 如获授权安装则检查宿主表面 | 有错误恢复 profile |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网络与宿主模型费用未知 | 选择作用域 | 未测耗时 |
| 持续 | API 和 Agent 阅读消耗 | 复核候选和权限 | 限流和频次未知 |
| 失败恢复 | 重试成本未知 | 检查入口并恢复配置 | 取决于安装类型 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 候选比较 | 脚本输出结构化列表 | 生态覆盖和正确率 |
| 安装复核 | 文本要求双确认 | Agent 是否始终遵循 |
| 挂载验证 | 按实际表面核对 | 真实宿主兼容 |

> **思考**：[Q01](#research-q01) 搜索窗口有上限，[Q02](#research-q02) 安装确认是 Agent 流程约定，权限仍由宿主和目标包决定。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 以公共 topic 当前地址整理候选，[Q02](#research-q02) 将装法和风险复核分为显式步骤。

[Q01](#research-q01) 将确定性发现和人工筛选拆开。[Q04](#research-q04) 覆盖状态仍可改进。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 搜索窗口有上限，[Q02](#research-q02) 安装确认是 Agent 流程约定，权限仍由宿主和目标包决定。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先只读比较候选，再按 [Q02](#research-q02) 的方式明确授权和宿主作用域。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码和技能文档支持检索与流程核查。未执行 GitHub 查询、安装或真实宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、skills/find-plugins/SKILL.md、skills/find-plugins/references/install-methods.md、skills/find-plugins/scripts/search-topic.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Skill、脚本与安装参考，未执行目标代码、登录、安装或宿主测试。
- 下一步：用固定 API 样本与隔离 profile 测试候选、风险报告与恢复。

**分析版本**

- **仓库**：[Nagi-ovo/dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins)
- **版本号**：未声明（[固定提交 61b30c6](https://github.com/Nagi-ovo/dsh-find-plugins/tree/61b30c697f12075ac1071418b7b7ca2300de37ac)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将搜索不完整和截断信息传给上层，检验是否减少把未发现当成不存在。

用固定 API 样本与隔离 profile 测试候选、风险报告与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 248 | — | — | 2712 |
| .mjs | source | 1 | 65 | 57 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-find-plugins/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-find-plugins/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-find-plugins/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：该技能怎样将候选发现、安装风险复核和挂载验证连起来？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 候选检索比手工查 topic 多完成哪些工作？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

想在 DSH 中解决具体任务却不熟悉包名的用户，可以让 Agent 从公共 topic 候选着手，再核对最多三项的安装方式。相对手工打开 topic 页，脚本固定 Search API 查询，按页请求并过滤停用、归档和 fork，以不区分大小写的 full_name 去重，输出当前 URL、描述和更新时间。Skill 再以语义匹配及更新作为阅读线索。Hub 仅补充当前 URL 匹配的条目。未标 topic、私有或被搜索窗口截断的条目不能从空结果判断为不存在。

#### 证据与依据

**依据 1 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:7-19](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L7-L19)

查询条件、页数与令牌优先级

<details>
<summary>查看原文（13行）</summary>

```text
const topic = 'dsh-plugin'
const query = `topic:${topic} is:public archived:false`
const pageSize = 100
const maxPages = 10
let token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''
if (token === '') {
  try {
    token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', timeout: 5_000 }).trim()
  } catch {
    // An authenticated token only raises GitHub's rate limit; public search
    // remains functional when gh is absent or logged out.
    token = ''
  }
```

</details>

**依据 2 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:24-47](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L24-L47)

调用官方 API、超时、状态与过滤

<details>
<summary>查看原文（24行）</summary>

```text
for (let page = 1; page <= maxPages; page += 1) {
  const url = new URL('https://api.github.com/search/repositories')
  url.searchParams.set('q', query)
  url.searchParams.set('sort', 'updated')
  url.searchParams.set('order', 'desc')
  url.searchParams.set('per_page', String(pageSize))
  url.searchParams.set('page', String(page))
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'dsh-find-plugins',
    'x-github-api-version': '2022-11-28',
  }
  if (token !== '') headers.authorization = `Bearer ${token}`
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) })
  if (!response.ok) {
    throw new Error(`GitHub topic search failed (${response.status}); authenticate gh or set GH_TOKEN and retry`)
  }
  const body = await response.json()
  if (!Array.isArray(body.items)) throw new Error('GitHub topic search returned no items array')
  for (const repo of body.items) {
    if (repo?.archived === true || repo?.disabled === true || repo?.fork === true) continue
    if (!Array.isArray(repo?.topics) || !repo.topics.includes(topic)) continue
    if (typeof repo?.full_name !== 'string' || seen.has(repo.full_name.toLowerCase())) continue
    seen.add(repo.full_name.toLowerCase())
```

</details>

**依据 3 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:48-65](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L48-L65)

结构化结果、停止和输出

<details>
<summary>查看原文（18行）</summary>

```text
    repositories.push({
      fullName: repo.full_name,
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? '',
      topics: repo.topics,
      language: repo.language,
      pushedAt: repo.pushed_at,
      updatedAt: repo.updated_at,
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
    })
  }
  const total = typeof body.total_count === 'number' ? body.total_count : body.items.length
  if (page * pageSize >= total || body.items.length < pageSize) break
}

process.stdout.write(`${JSON.stringify({ topic, repositories }, null, 2)}\n`)
```

</details>

**依据 4 · 源码核查**：[skills/find-plugins/SKILL.md:31-52](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/SKILL.md#L31-L52)

候选核对、可选 Hub 及三项比较

<details>
<summary>查看原文（22行）</summary>

```text
## Step 2：筛选并确认装法

先用用户需求对照 `name`、`description`、`topics`，按 `pushedAt` 优先查看较新的
命中项。只对语义最匹配的少量仓库读取 README、`package.json` 和仓库文件树：

- `package.json` 声明 `dsh.bundle.patch`：`bundle`。
- 含一个或多个 `SKILL.md`，且没有 bundle 声明：`skill`。
- README 明确要求写入 `cordis.patch.yml`，但没有 bundle 声明：`cordis`。
- 只有 `.dsh-plugin` / `repository` 旧格式：标成「需迁移」，不能直接安装。
- 仍无法判断：标成「需核对」，不要编造安装命令。

如果当前账号能读取 `dsh-external/hub/catalog.json`，可以把其中的 `note`、
`category`、`managers` 当补充信息；只接受 `url` 与 topic 搜索结果当前 URL 完全匹配
的条目。Hub 缺失、私有或仍指向转移前地址都不影响发现结果，也不能覆盖仓库自身
的当前声明。

产出最多 3 行候选表：名字、一句话用途、最近更新、装法。表后用一句话说明首选
理由。比如「整活 / 复古 / 好玩」可命中
[dsh-ads](https://github.com/Nagi-ovo/dsh-ads)；「把数据、流程和对比画出来」可命中
[dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize)。

一条都不匹配时直说 topic 目录里没有，并问是否转 `make-dsh-plugin` 现写一个。
```

</details>

#### 缺口

- 未实测候选覆盖与命中质量
  **影响**：无法确定是否减少找错插件或漏项
  **进一步探讨**：用含未标注、迁移与重名的已知仓库集对照手工和技能检索

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装前的保护由谁执行？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

用户先选候选，Agent 检查 lifecycle 脚本、网络与子进程、会话数据和凭据读取，再汇报并等待明确继续。执行方式从清单、技能目录或 README 推断，旧格式和未知项需要停止或核对。安装出现未预期的源、写入或提权也要求暂停。确定性脚本只收集候选，授权及判断由宿主 Agent 遵循文本执行，所见材料没有独立策略引擎约束下载、安装和挂载。若 Git 来源锁定提交，可缩小审核与执行版本漂移，但包依赖和宿主权限仍要核对。

#### 证据与依据

**依据 1 · 源码核查**：[skills/find-plugins/SKILL.md:33-45](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/SKILL.md#L33-L45)

类型判断与仓库自述优先级

<details>
<summary>查看原文（13行）</summary>

```text
先用用户需求对照 `name`、`description`、`topics`，按 `pushedAt` 优先查看较新的
命中项。只对语义最匹配的少量仓库读取 README、`package.json` 和仓库文件树：

- `package.json` 声明 `dsh.bundle.patch`：`bundle`。
- 含一个或多个 `SKILL.md`，且没有 bundle 声明：`skill`。
- README 明确要求写入 `cordis.patch.yml`，但没有 bundle 声明：`cordis`。
- 只有 `.dsh-plugin` / `repository` 旧格式：标成「需迁移」，不能直接安装。
- 仍无法判断：标成「需核对」，不要编造安装命令。

如果当前账号能读取 `dsh-external/hub/catalog.json`，可以把其中的 `note`、
`category`、`managers` 当补充信息；只接受 `url` 与 topic 搜索结果当前 URL 完全匹配
的条目。Hub 缺失、私有或仍指向转移前地址都不影响发现结果，也不能覆盖仓库自身
的当前声明。
```

</details>

**依据 2 · 源码核查**：[skills/find-plugins/SKILL.md:54-88](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/SKILL.md#L54-L88)

确认、检查与意外行为时停止

<details>
<summary>查看原文（35行）</summary>

```text
## Step 3：用户拍板

停下来等选择。用户已经点名某个插件时，从 Step 2 核对当前仓库和装法后直接进入
Step 4。

## Step 4：安全检查并汇报

用户点头之后、动手之前，先看一遍这个插件装进来会拿到什么。插件运行在用户的
DSH 进程里，能读会话、调工具、跑命令，装它等于授权，所以这一步不能跳过，也不
能只在发现问题时才出声。

至少看这四处：

- `package.json` 的 lifecycle scripts：`preinstall`、`install`、`postinstall`、
  `prepare` 在 Git / npm 安装时会执行。
- 插件声明和源码里对外的动作：网络请求、子进程、写 `$DSH_HOME` 之外的路径、
  改 shell 配置或系统设置。
- 插件读取的会话数据和凭据：读会话日志、settings、`.env` 或 credentials 的地方。
- 仓库本身的可信度：`pushedAt`、star 数、作者是否还有其他 dsh 插件、README 与
  代码是否对得上。

**不管有没有发现问题，都要汇报**，三到五行讲清：查了哪几处、这个插件实际要什么
权限、有没有和它宣称的用途对不上的动作。有可疑项就把原文贴出来，别转述。

汇报完再问一次是否继续。用户说停就停在这里，不要顺手装完。

完成点：用户看过这份汇报，并明确说继续。

## Step 5：安装

按确认出的安装类型打开 [references/install-methods.md](references/install-methods.md)
并照对应小节操作。多个方式并存时按该文件开头的优先级选一种。

安装过程中冒出 Step 4 没看到的动作（新的下载源、额外的写入路径、要求提权），
停下来把原文交给用户，不要边装边判断。
```

</details>

**依据 3 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:24-65](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L24-L65)

脚本输出候选，不调用安装程序

<details>
<summary>查看原文（42行）</summary>

```text
for (let page = 1; page <= maxPages; page += 1) {
  const url = new URL('https://api.github.com/search/repositories')
  url.searchParams.set('q', query)
  url.searchParams.set('sort', 'updated')
  url.searchParams.set('order', 'desc')
  url.searchParams.set('per_page', String(pageSize))
  url.searchParams.set('page', String(page))
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'dsh-find-plugins',
    'x-github-api-version': '2022-11-28',
  }
  if (token !== '') headers.authorization = `Bearer ${token}`
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) })
  if (!response.ok) {
    throw new Error(`GitHub topic search failed (${response.status}); authenticate gh or set GH_TOKEN and retry`)
  }
  const body = await response.json()
  if (!Array.isArray(body.items)) throw new Error('GitHub topic search returned no items array')
  for (const repo of body.items) {
    if (repo?.archived === true || repo?.disabled === true || repo?.fork === true) continue
    if (!Array.isArray(repo?.topics) || !repo.topics.includes(topic)) continue
    if (typeof repo?.full_name !== 'string' || seen.has(repo.full_name.toLowerCase())) continue
    seen.add(repo.full_name.toLowerCase())
    repositories.push({
      fullName: repo.full_name,
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? '',
      topics: repo.topics,
      language: repo.language,
      pushedAt: repo.pushed_at,
      updatedAt: repo.updated_at,
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
    })
  }
  const total = typeof body.total_count === 'number' ? body.total_count : body.items.length
  if (page * pageSize >= total || body.items.length < pageSize) break
}

process.stdout.write(`${JSON.stringify({ topic, repositories }, null, 2)}\n`)
```

</details>

**依据 4 · 源码核查**：[skills/find-plugins/references/install-methods.md:12-29](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/references/install-methods.md#L12-L29)

建议锁 Git 提交并保留组件路径

<details>
<summary>查看原文（18行）</summary>

````text
## bundle —— 官方 profile bundle

包的 package.json 声明了 `dsh.bundle.patch`，安装进 profile 即挂载它自带的
patch 层：

```sh
cd <dsh-source>
pnpm dsh plugin --profile <profile> add <package-or-git-spec>
```

GitHub 仓库建议使用 topic 搜索返回的当前 owner，并锁定 commit：

```sh
pnpm dsh plugin --profile <profile> add 'github:<owner>/<repo>#<commit>'
```

README 指定 `&path:/<子目录>` 时保留该参数。安装命令会交给 profile 的 pnpm，
成功后自动把声明了 `dsh.bundle.patch` 的包加入 `dsh.profile.bundles`。
````

</details>

#### 缺口

- 未以恶意 README 或安装副作用验证 Agent 执行边界
  **影响**：无法确定确认步骤在提示注入或含糊用户指令下始终执行
  **进一步探讨**：在隔离 profile 用惰性样本评估风险报告、动作和确认记录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用及回退？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

这个项目分发的是含脚本与参考文件的 Skill，试用可放在独立项目的技能发现根。搜索要求可运行 Node 并访问 GitHub API，脚本可借用环境或本机 gh 登录令牌。检索和比较会消耗网络与 Agent 阅读时间。若走到安装，bundle 路径写目标 profile，裸 Cordis 还需写 patch，skill 则复制到发现根。当前参考把命令写成源码 checkout 的 pnpm dsh，目标若使用另一种分发须先确认入口。长驻 Web 的挂载仍按实际 UI、工具或技能验证。可在只读候选模式观察，若出现不可确认的权限或安装版本即停，移走测试 Skill 并恢复独立 profile。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-31](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/README.md#L17-L31)

项目或全局安装及总体工作流

<details>
<summary>查看原文（15行）</summary>

````text
## 安装

把下面这句话发给 DSH：

```text
请从 https://github.com/Nagi-ovo/dsh-find-plugins 安装 dsh-find-plugins skill
```

手动安装时，把 `skills/find-plugins/` 整个目录复制到 `$DSH_HOME/skills/`（默认是 `~/.dsh/skills/`）；只想给当前项目使用，则复制到 `<项目根>/.dsh/skills/`。如果还想与其他 Agent 共用，也可以放在 `<项目根>/.agents/skills/`。目录 watcher 会让它立即生效。

## 它会怎么做

Skill 会先运行自带脚本，获取所有公开、未归档、非 fork 的 `dsh-plugin` 仓库。它只检查最匹配的少量候选，并从 README、`package.json` 和仓库文件判断应该按 bundle、Cordis 插件还是 skill 安装。

你选定之后、开装之前，它会先查一遍这个插件的 lifecycle scripts、对外网络和子进程、读取的会话数据与凭据，以及仓库本身的可信度，然后**无论有没有问题都汇报一次**，再问你要不要继续。插件跑在你的 DSH 进程里，装它等于授权。
````

</details>

**依据 2 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:11-19](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L11-L19)

认证令牌回退

```text
let token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''
if (token === '') {
  try {
    token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', timeout: 5_000 }).trim()
  } catch {
    // An authenticated token only raises GitHub's rate limit; public search
    // remains functional when gh is absent or logged out.
    token = ''
  }
```

**依据 3 · 源码核查**：[skills/find-plugins/references/install-methods.md:8-37](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/references/install-methods.md#L8-L37)

参考文档绑定的 CLI 和 profile 写入

<details>
<summary>查看原文（30行）</summary>

````text
下文 `<profile>` 指目标 profile 名（web 界面对应 `web`），`<dsh-source>` 指
用户当前运行的 DeepSeek Harness 源码 checkout。最新 DSH 不再分发全局 `dsh`
launcher，命令从该 checkout 根目录通过 `pnpm dsh` 运行。

## bundle —— 官方 profile bundle

包的 package.json 声明了 `dsh.bundle.patch`，安装进 profile 即挂载它自带的
patch 层：

```sh
cd <dsh-source>
pnpm dsh plugin --profile <profile> add <package-or-git-spec>
```

GitHub 仓库建议使用 topic 搜索返回的当前 owner，并锁定 commit：

```sh
pnpm dsh plugin --profile <profile> add 'github:<owner>/<repo>#<commit>'
```

README 指定 `&path:/<子目录>` 时保留该参数。安装命令会交给 profile 的 pnpm，
成功后自动把声明了 `dsh.bundle.patch` 的包加入 `dsh.profile.bundles`。

CLI 不可用时手工等价操作：

1. `$DSH_HOME/profiles/<profile>/package.json` 的 `dependencies` 加包
   （GitHub 源写 `github:<owner>/<repo>`，本地开发写 `link:<路径>`）。
2. 同文件 `dsh.profile.bundles` 数组末尾追加包名（列表顺序即 patch 层
   应用顺序，官方 bundle 在前）。
3. 在该 profile 目录执行 `pnpm install`。
````

</details>

**依据 4 · 源码核查**：[skills/find-plugins/references/install-methods.md:45-68](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/references/install-methods.md#L45-L68)

裸 Cordis 和 Skill 的作用域

<details>
<summary>查看原文（24行）</summary>

````text
## cordis —— 裸 cordis 插件挂载

包是普通 Cordis 插件、没有自带 patch 层。先用 `pnpm dsh plugin --profile
<profile> add <package-or-git-spec>` 把包装进 profile；CLI 会提示它是普通依赖。
再在 `$DSH_HOME/profiles/<profile>/cordis.patch.yml` 顶层数组加一个 insert 条目：

```yaml
- insert:
    - name: '<package-name>'
      config: {}
```

`config` 字段照该插件 README 填；README 给了现成挂载片段的以仓库为准。

## skill —— 技能目录

仓库分发的是技能（`SKILL.md` 目录），clone 后把含 `SKILL.md` 的目录整个
拷进任一发现根：

- 只给当前项目：`<项目根>/.agents/skills/<技能名>/`
- 全局：`$DSH_HOME/skills/<技能名>/`
- 共享 agent 根：`${DSH_AGENTS_HOME:-~/.agents}/skills/<技能名>/`

目录有 watcher，放进去即生效，不用重启。
````

</details>

**依据 5 · 源码核查**：[skills/find-plugins/SKILL.md:92-100](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/SKILL.md#L92-L100)

挂载与诊断验收

```text
## Step 6：验证挂载

web 等长驻 surface 监听 patch 文件改动后热载；一次性运行下次启动才生效。请用户
确认相应 UI、工具或技能条目出现。

没出现时依次排查：服务日志中的 `hmr/config-update-failed`、Git spec 是否仍用了
转移前 owner、ref / path 拼写、profile 目录的 `pnpm install` 是否成功。

完成点：用户确认可用；或把具体报错和已排除的原因一并带回。
```

#### 缺口

- 未验证宿主版本的实际发现和挂载耗时
  **影响**：无法确认文档命令适用于本机或可无残留退出
  **进一步探讨**：先只读检索，再用独立 profile 核对发现、挂载与恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何降低搜索覆盖误判？

**研究主题**：新假设与验证

#### 完整回答

输出只有 topic 和仓库列表。固定十页上限与每页一百项，以及基于结果总数或短页停止，让上层无法从输出区分完整搜索窗口、截断或服务端 incomplete_results。可附页数、服务端不完整标记与截断原因，在无法判断覆盖时要求 Agent 把空匹配表述为当前窗口没有命中。以固定 API 样本对照空结果、超上限和不完整页，测用户错误排除候选的比例与额外耗时。若误判不降或提示导致无效重试增加，撤回。

#### 证据与依据

**依据 1 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:7-10](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L7-L10)

固定窗口

```text
const topic = 'dsh-plugin'
const query = `topic:${topic} is:public archived:false`
const pageSize = 100
const maxPages = 10
```

**依据 2 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:41-47](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L41-L47)

仅检查 items 与条目过滤

```text
  const body = await response.json()
  if (!Array.isArray(body.items)) throw new Error('GitHub topic search returned no items array')
  for (const repo of body.items) {
    if (repo?.archived === true || repo?.disabled === true || repo?.fork === true) continue
    if (!Array.isArray(repo?.topics) || !repo.topics.includes(topic)) continue
    if (typeof repo?.full_name !== 'string' || seen.has(repo.full_name.toLowerCase())) continue
    seen.add(repo.full_name.toLowerCase())
```

**依据 3 · 源码核查**：[skills/find-plugins/scripts/search-topic.mjs:61-65](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/scripts/search-topic.mjs#L61-L65)

输出缺少覆盖元数据

```text
  const total = typeof body.total_count === 'number' ? body.total_count : body.items.length
  if (page * pageSize >= total || body.items.length < pageSize) break
}

process.stdout.write(`${JSON.stringify({ topic, repositories }, null, 2)}\n`)
```

**依据 4 · 源码核查**：[skills/find-plugins/SKILL.md:47-52](https://github.com/Nagi-ovo/dsh-find-plugins/blob/61b30c697f12075ac1071418b7b7ca2300de37ac/skills/find-plugins/SKILL.md#L47-L52)

空结果的读者措辞

```text
产出最多 3 行候选表：名字、一句话用途、最近更新、装法。表后用一句话说明首选
理由。比如「整活 / 复古 / 好玩」可命中
[dsh-ads](https://github.com/Nagi-ovo/dsh-ads)；「把数据、流程和对比画出来」可命中
[dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize)。

一条都不匹配时直说 topic 目录里没有，并问是否转 `make-dsh-plugin` 现写一个。
```

#### 缺口

- 未比较提示对真实用户或 Agent 的影响
  **影响**：无法判断覆盖标记是否减少错误排除
  **进一步探讨**：先用固定响应和同一组任务对照错误及时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
