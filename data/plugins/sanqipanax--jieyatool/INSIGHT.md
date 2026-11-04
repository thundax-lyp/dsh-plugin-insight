# dsh-auto-extract

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[09fd3cb](https://github.com/sanqiPanax/jieyaTool/tree/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sanqiPanax/jieyaTool)
<!-- END META -->

> **功能**：在 DSH 中批量探测和递归解压后缀伪装、嵌套或带密码的归档。

> **亮点**：[Q01](#research-q01) 复用 7-Zip 解码，并编排魔数探测、分层候选与自动入队。

> **主要限制**：[Q02](#research-q02) 明文密码进入进度和结果，合并可覆盖输出；归位失败后清理不等于安全回滚。

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
  - [Q01 · 用户批量处理伪装、多层归档时，工具增加了什么？](#detail-section-11)
  - [Q02 · 密码和输出路径的副作用是什么？](#detail-section-12)
  - [Q03 · 什么情况适合验证，怎样退出？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要处理多个可信但命名混乱的多层归档的 DSH 用户。

使用 7-Zip GUI 或脚本手工确认格式、密码和每层输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 格式探测 | 识别若干魔数和疑似 SFX | 底层格式取决于 7-Zip |
| 递归解压 | 排队尝试密码并扫描产物 | 需隔离输出和日志 |
| 环境状态 | 查可用 7-Zip | 不验证归档可靠性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH、Node 和 7-Zip | 必需 | 挂载工具和执行归档 | 切回手工工具 |
| 合成归档和密码 | 评估必需 | 验证流程与泄漏 | 不使用生产输入 |
| 全新输出及资源限额 | 评估必需 | 隔离覆盖和体积 | 只做探测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户隔离目录并核 7-Zip | 无真实密码 |
| 验证 | 用户探测再执行小样例 | 比较源和输出哈希 |
| 退出 | 用户清理独立输出并禁用 | 核日志与结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 磁盘和工具成本未知 | 准备隔离样本和版本 | 需 7-Zip |
| 持续 | 多密码和嵌套消耗未知 | 核产物与冲突 | 没有完整资源限制 |
| 失败 | 恢复开销未知 | 从备份恢复并核是否泄漏 | 临时目录不等同回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 批量归档 | 源码有队列和格式识别 | 实际覆盖与速度 |
| 输出归位 | 可合并并清理中间层 | 一致性和误覆盖 |

> **思考**：[Q02](#research-q02) 明文密码进入进度和结果，合并可覆盖输出；归位失败后清理不等于安全回滚。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 复用 7-Zip 解码，并编排魔数探测、分层候选与自动入队。

[Q02](#research-q02) 逐密码使用临时目录，但日志含密码，且归位和清理缺少统一事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 明文密码进入进度和结果，合并可覆盖输出；归位失败后清理不等于安全回滚。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 使用虚构密码和一次性样例核副作用。包含真实密码或已有输出的工作保留人工处理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态证据支持自动化与副作用。实际 7-Zip、宿主和作者演示未复验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/archive-core.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件的工具入口、核心和作者材料。未运行 7-Zip 或样本。
- 下一步：在隔离环境对照明文日志、同名覆盖、失败清理、深度与压缩资源上限。

**分析版本**

- **仓库**：[sanqiPanax/jieyaTool](https://github.com/sanqiPanax/jieyaTool)
- **版本号**：0.1.0（[固定提交 09fd3cb](https://github.com/sanqiPanax/jieyaTool/tree/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813)）
- **版本日期**：2026-09-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 脱敏日志与隔离提交可以用同一冲突样本和凭据扫描对照，若泄漏或误覆盖不降则不推广。

在隔离环境对照明文日志、同名覆盖、失败清理、深度与压缩资源上限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 584 | 479 | 63 | — |
| .md | source | 1 | 106 | — | — | 1006 |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/sanqiPanax/jieyaTool/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sanqiPanax/jieyaTool/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：递归解压可节省哪些重复操作，哪些密码和文件副作用阻止采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户批量处理伪装、多层归档时，工具增加了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

对于来源已核对且需重复处理多层压缩包的用户，DSH 工具把格式探测、候选密码与递归扫描合成一次目录任务。代码读取文件头，区分常见魔数；可调用 7-Zip list 探测疑似自解压文件并排除普通 PE 类型。起始扫描只遍历顶层常规文件，按命名规则跳过附属分卷；解压成功后扫描结果树，发现新归档加入队列。所谓自动分卷主要是识别主卷与跳过已知命名的附属卷，实际组合由 7-Zip，规则不能覆盖任意分卷命名。相比手动按包执行 7-Zip，此插件提供可复用的队列和格式线索，没有自建解码。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-25](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/README.md#L15-L25)

作者列出格式、递归和分卷。

<details>
<summary>查看原文（11行）</summary>

```text
## ✨ 核心能力

| 能力 | 说明 |
|---|---|
| 🧬 **魔数识别真实格式** | 不信扩展名。伪装成 `.jpg` / `.mp4` / `.7z删除` / `.7删除z` / `.是7z` / 无后缀,按文件头判断真实格式(7z/rar/zip/gz/xz/sfx) |
| 🔍 **exe 智能探测** | 用 7-Zip 探测 exe 是否为 SFX 自解压;`Type=PE` 的普通程序 exe(游戏成品)绝不误解压 |
| 🔁 **递归下钻** | 解出的新压缩包自动入队继续解,直到不再产出压缩包(实测 4 层套娃全自动) |
| 🔑 **多密码自动尝试** | 全局密码文件(每行一个)+ 动态密码:解出内容出现「第二层密码:xxx」(目录名/文件名/txt)自动学习用于后续层;顺序=动态→全局→空 |
| 📦 **SFX/分卷处理** | `.part2.rar`/`.002`/`.r00` 等附属卷自动跳过,由主卷(`.part1.exe`/`.001`)带出;成功解压的中间压缩包自动清理 |
| 🛡️ **安全** | 输出到源目录旁 `_extracted`,原始文件只读不动;解压先进临时目录,失败只清临时目录;工具运行库目录(`gameSaveBackup`/`node_modules`/`locales`)自动跳过防误递归 |
| 🚫 **私有格式归类** | 7z/WinRAR 都不识别的自定义封装(如 RC-SFX `.sfxv`)识别为普通文件不动,不误删不卡死 |
```

</details>

**依据 2 · 源码核查**：[package.json:2-19](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/package.json#L2-L19)

真实 DSH 插件入口。

<details>
<summary>查看原文（18行）</summary>

```text
  "name": "dsh-auto-extract",
  "version": "0.1.0",
  "description": "DSH 自动解压工具:魔数识别真格式(不信伪装后缀)、递归解压嵌套压缩包、多密码池自动尝试、SFX/分卷配对、私有格式归类报告。核心基于 7-Zip。",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 3 · 源码核查**：[lib/archive-core.js:62-103](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L62-L103)

文件头、7-Zip 探测及分卷启发式。

<details>
<summary>查看原文（42行）</summary>

```text
export async function detectType(file, { sevenZip = null, passwords = [], log = () => {} } = {}) {
  let b
  try { b = await headBytes(file, 8) } catch { return 'none' }
  if (b.length < 4) return 'none'
  const h = hex(b)
  const ext = extname(file).toLowerCase()
  if (h.startsWith('377ABCAF')) return '7z'
  if (h.startsWith('526172211A07')) return 'rar'
  if (h.startsWith('504B0304') || h.startsWith('504B0506') || h.startsWith('504B0708')) {
    return DOC_ZIP_EXTS.has(ext) ? 'none' : 'zip'
  }
  if (h.startsWith('1F8B')) return 'gz'
  if (h.startsWith('FD377A585A00')) return 'xz'
  if (h.startsWith('425A68')) return 'bz2'
  if (h.startsWith('28B52FFD')) return 'zst'
  if (h.startsWith('4D5A')) {
    // exe: 用 7z 带密码逐个 list 探测,Type 非 PE 才算 SFX
    if (ext !== '.exe' || !sevenZip) return 'none'
    const probePws = ['', ...passwords]
    for (const pw of probePws) {
      // 关键:无论有无密码都传 -p(空密码传 -p 不带值),否则 7z 会交互等 stdin 而挂起
      const args = pw ? ['l', '-p' + pw, file] : ['l', '-p', file]
      const r = await run7z(sevenZip, args)
      const m = /^Type\s*=\s*(\S+)/m.exec(r.out)
      const type = m ? m[1] : ''
      if (r.code === 0 && type && !PE_TYPES.has(type)) return 'sfx'
      if (r.code === 0 && type === 'PE') break // 普通程序
      if (r.code !== 2 && r.code !== 255) break // 非"需密码"错误 => 非归档
      // code 2/255:可能加密归档需对密码,继续试
    }
    return 'none'
  }
  return 'none'
}

// ---------- 分卷附属卷 ----------
export function isSplitSlave(name) {
  if (/\.(002|003|004|005|006|007|008|009|010)(\.|$)/i.test(name)) return true
  if (/\.(r00|r01|r02|r03|r04|r05|r06|r07|r08|r09)$/i.test(name)) return true
  if (/\.part(0*[2-9]|[1-9]\d+)\.(rar|7z|exe)$/i.test(name)) return true
  if (/\.sfxv$/i.test(name) && !/\.001\./i.test(name)) return true
  return false
```

</details>

**依据 4 · 源码核查**：[lib/archive-core.js:263-281](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L263-L281)

首层队列与扫描。

<details>
<summary>查看原文（19行）</summary>

```text
  // 队列
  const queue = []
  const results = { success: [], failed: [], unsupported: [], products: [] }
  const seenFiles = new Set()

  const pushTask = (file, depth, baseDir) => {
    if (seenFiles.has(file)) return
    seenFiles.add(file)
    queue.push({ file, depth, baseDir })
  }

  // 初始扫描顶层(只收真压缩,跳过附属卷)
  let topEntries = []
  try { topEntries = await readdir(sourceDir, { withFileTypes: true }) } catch (e) { throw new Error('读源目录失败: ' + e.message) }
  for (const e of topEntries) {
    if (!e.isFile()) continue
    if (isSplitSlave(e.name)) { log(`跳过分卷附属: ${e.name}`); continue }
    const full = join(sourceDir, e.name)
    const t = await detectType(full, { sevenZip, passwords: allPw(), log })
```

</details>

**依据 5 · 源码核查**：[lib/archive-core.js:345-370](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L345-L370)

动态密码和新归档入队。

<details>
<summary>查看原文（26行）</summary>

```text
    // 吸收密码(子项名/txt)+ 扫描新压缩包
    const newPws = await scanPasswords(finalDir, { log })
    for (const p of newPws) if (!dynPw.includes(p)) dynPw.push(p)

    const walkStack = [finalDir]
    // 跳过这些目录(工具备份/存档/运行库/资源,非套娃压缩内容,避免误递归爆炸)
    const SKIP_DIR_RE = /(gameSaveBackup|save_backup|\.git|node_modules|locales|swiftshader|pnacl|www|loaders|_cache|Cache|backup|Backup)/i
    while (walkStack.length) {
      const cur = walkStack.pop()
      let entries = []
      try { entries = await readdir(cur, { withFileTypes: true }) } catch { continue }
      for (const e of entries) {
        const full = join(cur, e.name)
        if (e.isDirectory()) {
          // 跳过工具/存档/运行库目录(里面 zip 多为资源或存档备份,非内容套娃)
          if (SKIP_DIR_RE.test(e.name)) { log(`  [跳过目录] ${e.name}`); continue }
          walkStack.push(full)
        }
        else if (e.isFile() && !isSplitSlave(e.name)) {
          const t2 = await detectType(full, { sevenZip, passwords: allPw(), log })
          if (t2 !== 'none') {
            pushTask(full, depth + 1, dirname(full))
            log(`  发现新压缩包(深度${depth+1}, ${t2}): ${e.name}`)
          }
        }
      }
```

</details>

#### 缺口

- 没有复现归档样本和分卷边界
  **影响**：不能保证任意格式、私有 SFX 与深度
  **进一步探讨**：在隔离环境以合成 zip、rar、SFX 和错后缀对照工具结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 密码和输出路径的副作用是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

密码由动态与全局候选拼接，传给 7-Zip 进程参数；全部全局候选和命中密码也进入日志，而工具将日志用于进度输出和最终尾部。即使解压失败也可能已泄漏候选，不能用真实复用密码试跑。暂存目录隔离单次试解，但成功后 mergeDir 对同名文件覆盖，目录冲突可递归删除旧目标。归位前已计 success，归位异常又记 failed，仍继续扫描并可能清理中间包。中间清理用 file.startsWith(outRoot) 而非路径真实包含校验，用户可指定 outRoot，不能保证所有组合都只清理预期输出。7-Zip 进程没有单次超时或输出字节限制；路径穿越与炸弹防护未在插件代码核到。

#### 证据与依据

**依据 1 · 源码核查**：[lib/archive-core.js:44-55](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L44-L55)

进程参数、不限输出缓冲。

<details>
<summary>查看原文（12行）</summary>

```text
function run7z(sevenZip, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(sevenZip, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    // 立即关闭 stdin,防止 7z 在需密码时交互等待输入而挂起
    try { child.stdin.end() } catch {}
    let out = ''
    let err = ''
    child.stdout.on('data', (d) => (out += d.toString('utf8')))
    child.stderr.on('data', (d) => (err += d.toString('utf8')))
    child.on('error', (e) => resolve({ code: -1, out: '', err: String(e) }))
    child.on('close', (code) => resolve({ code: code == null ? -1 : code, out, err }))
  })
```

</details>

**依据 2 · 源码核查**：[lib/archive-core.js:107-123](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L107-L123)

密码参数和单次失败清理。

<details>
<summary>查看原文（17行）</summary>

```text
export async function extractOne(file, dest, sevenZip, passwords, { log = () => {} } = {}) {
  await mkdir(dest, { recursive: true })
  // 密码顺序:传入的候选(动态在前,全局在后)→ 最后空密码兜底
  // (绝不能空密码优先:大文件无密码试解会跑很久才失败)
  const pws = [...passwords, '']
  for (const pw of pws) {
    const args = ['x', '-y', '-o' + dest]
    if (pw) args.push('-p' + pw); else args.push('-p')
    args.push(file)
    const r = await run7z(sevenZip, args)
    if (r.code === 0) {
      return { ok: true, password: pw || null }
    }
    // 失败:清掉本次部分解压,试下一个密码
    try { await rm(dest, { recursive: true, force: true }); await mkdir(dest, { recursive: true }) } catch {}
  }
  return { ok: false, password: null }
```

</details>

**依据 3 · 源码核查**：[lib/archive-core.js:182-219](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L182-L219)

合并可覆盖和删除输出目标。

<details>
<summary>查看原文（38行）</summary>

```text
async function mergeDir(srcDir, dstDir, { depth = 0 } = {}) {
  if (depth > 40) return
  await mkdir(dstDir, { recursive: true })
  let entries = []
  try { entries = await readdir(srcDir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    const src = join(srcDir, e.name)
    const dst = join(dstDir, e.name)
    if (e.isDirectory()) {
      // 目录:目标同名存在
      let dstIsDir = false
      try { dstIsDir = (await stat(dst)).isDirectory() } catch {}
      if (dstIsDir) {
        // 递归合并
        await mergeDir(src, dst, { depth: depth + 1 })
        await rm(src, { recursive: true, force: true }).catch(() => {})
      } else {
        if (existsSync(dst)) await rm(dst, { recursive: true, force: true }).catch(() => {})
        await rename(src, dst).catch(async () => {
          // rename 失败(跨卷等)则复制
          await copyDir(src, dst)
          await rm(src, { recursive: true, force: true }).catch(() => {})
        })
      }
    } else {
      // 文件:目标同名已存在目录时,把它放进带后缀的路径避免冲突
      if (existsSync(dst)) {
        let dstIsDir = false
        try { dstIsDir = (await stat(dst)).isDirectory() } catch {}
        if (dstIsDir) {
          const alt = dst + ' (duplicate)'
          await rename(src, alt).catch(async () => { await copyFile(src, alt) })
          continue
        }
        // 同名文件:覆盖(解压重复内容,后解覆盖先解)
        await rm(dst, { force: true }).catch(() => {})
      }
      try { await rename(src, dst) } catch { await copyFile(src, dst) }
```

</details>

**依据 4 · 源码核查**：[lib/archive-core.js:248-261](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L248-L261)

明文全局密码池日志。

<details>
<summary>查看原文（14行）</summary>

```text
  // 全局密码
  const globalPw = []
  if (opts.secretFile && existsSync(opts.secretFile)) {
    const raw = await readFile(opts.secretFile, 'utf8')
    for (const l of raw.split(/\r?\n/)) {
      const t = l.trim()
      if (t && !globalPw.includes(t)) globalPw.push(t)
    }
  }
  log(`全局密码池: [${globalPw.join(' | ')}] (${globalPw.length} 条)`)

  // 动态密码
  const dynPw = []
  const allPw = () => [...new Set([...dynPw, ...globalPw])]
```

</details>

**依据 5 · 源码核查**：[lib/archive-core.js:299-343](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L299-L343)

暂存、命中密码日志及归位失败。

<details>
<summary>查看原文（45行）</summary>

```text
    log(`\n[${round}] 深度${depth} 类型=${type}: ${file}`)
    // 临时目录解压,成功再归位(防失败误删源)
    const tmpDir = join(outRoot, '_work_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6))
    await mkdir(tmpDir, { recursive: true })

    let r
    try {
      r = await extractOne(file, tmpDir, sevenZip, allPw(), { log })
    } catch (e) {
      log(`✗ extractOne 异常: ${(e && e.stack) || e}`)
      r = { ok: false, password: null }
    }
    if (!r.ok) {
      log(`✗ 解压失败(密码均错/损坏): ${file}`)
      await rm(tmpDir, { recursive: true, force: true }).catch(() => {})
      results.failed.push(file)
      continue
    }
    log(`✓ 密码命中: ${r.password || '(无密码)'}`)
    results.success.push(file)

    // 归位:去掉扩展名当目录名
    let finalName = stripArchiveExt(basename(file))
    const finalDir = join(baseDir, finalName)
    await mkdir(finalDir, { recursive: true })

    // 上提冗余嵌套:tmpDir 内若是 单目录且名≈finalName,逐层上提
    let cursor = tmpDir
    for (let i = 0; i < 5; i++) {
      let kids = []
      try { kids = await readdir(cursor, { withFileTypes: true }) } catch { break }
      if (kids.length === 1 && kids[0].isDirectory() && (kids[0].name === finalName || kids[0].name.startsWith(finalName))) {
        cursor = join(cursor, kids[0].name)
      } else break
    }
    // cursor 内容并入 finalDir(稳健合并,处理同名冲突)
    try {
      await mergeDir(cursor, finalDir)
      await rm(tmpDir, { recursive: true, force: true }).catch(() => {})
      log(`→ 产物: ${finalDir}`)
    } catch (e) {
      log(`✗ 归位异常: ${(e && e.stack) || e}`)
      // 不致命:保留 tmpDir 内容,记录但继续
      results.failed.push(file)
    }
```

</details>

**依据 6 · 源码核查**：[lib/archive-core.js:373-377](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L373-L377)

中间清理只按字符串前缀。

```text
    // 中间包清理:源在 outRoot 内且成功解压 => 删源(防残留中间层)
    if (opts.deleteIntermediate !== false && file.startsWith(outRoot) && existsSync(file)) {
      log(`[清理中间包] ${file}`)
      await rm(file, { force: true }).catch(() => {})
    }
```

**依据 7 · 源码核查**：[lib/index.js:105-121](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/index.js#L105-L121)

日志转给 Agent 进度。

<details>
<summary>查看原文（17行）</summary>

```text
      async execute(args, exec) {
        const { sourceDir, secretFile, outRoot, maxDepth } = args
        if (!sourceDir || !existsSync(sourceDir)) return '源目录不存在或未提供: ' + sourceDir
        const logLines = []
        const log = (m) => {
          logLines.push(m)
          if (exec && typeof exec.sendMessage === 'function') {
            try { exec.sendMessage({ type: 'progress', message: m }) } catch {}
          }
        }
        try {
          const r = await autoExtractTree(sourceDir, {
            outRoot,
            secretFile,
            maxDepth,
            log,
          })
```

</details>

**依据 8 · 源码核查**：[lib/index.js:141-147](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/index.js#L141-L147)

最终结果附日志。

```text
          lines.push('')
          lines.push('--- 执行日志(截断) ---')
          // 日志尾部 40 行
          lines.push(...logLines.slice(-40))
          return lines.join('\n')
        } catch (e) {
          return '解压失败: ' + ((e && e.message) || e)
```

#### 缺口

- 未验真实 Host 记录层及 7-Zip 解包路径约束
  **影响**：不可假设生产归档、密码或目标目录安全
  **进一步探讨**：用虚构密码、冲突文件、符号链接和资源受限样本在沙箱比较实际副作用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么情况适合验证，怎样退出？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

优先仅用探测工具和一次性合成归档，核 Windows Node 与可控 7-Zip，使用全新输出目录、低权限、资源限额和合成密码。真实源文件与输出需分别备份，检查执行前后哈希，回退时停止插件并丢弃独立输出。对于不可信归档、有复用密码或已有输出的重要目录，保留人工解压；不能把作者演示当作安全或通用性证据。可比较改为脱敏日志、冲突拒绝和真实路径保护后的重复解压，记录泄露与覆盖次数、恢复时间；若边界没改善或正常样本误拒不可接受，放弃扩展。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-105](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/README.md#L87-L105)

作者说明依赖和已知边界。

<details>
<summary>查看原文（19行）</summary>

```text
## ⚙️ 依赖

- Node ≥ 18
- 7-Zip(自动探测 `C:\Program Files\7-Zip\7z.exe` / `E:\7-Zip\7z.exe` 等,或设 `SEVENZIP_PATH`)

## 🧩 与 v1.0 对比

| | jieyaTool v1.0(GUI) | 本插件 v2.0 |
|---|---|---|
| 识别格式 | 手动选后缀强制改名 | 魔数自动识别(伪装/无后缀都行) |
| 嵌套 | 单层 | 自动递归到尽头 |
| 密码 | 单密码记忆 | 多密码列表 + 层内动态发现 |
| 分卷 | 手动 | 自动配对跳过附属卷 |
| SFX | 不支持 | 自动探测(排除成品 exe) |
| 调用方式 | 手动拖文件 | 对 Agent 说一句即可 |

## ⚠️ 已知边界

- **私有自解压格式**(RC 自定义 SFX、`.sfxv` 加密分卷)7-Zip 不识别,无法命令行自动化,需双击 exe 图形解压
```

</details>

**依据 2 · 源码核查**：[lib/index.js:78-97](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/index.js#L78-L97)

工具路径和递归输入。

<details>
<summary>查看原文（20行）</summary>

```text
    tools.register({
      name: 'auto_extract_run',
      description:
        '自动批量递归解压一个目录里的所有压缩包(核心工具):自动识别真实格式(伪装后缀 .jpg/.mp4/.7z删除/无后缀都行)、' +
        '跳过 SFX 分卷附属卷(.part2.rar/.002 等)、递归解压嵌套压缩包直到不再产出压缩包、' +
        '多密码自动尝试(secret 文件每行一个;解出内容里若出现"密码:xxx"或"第二层密码:xxx"(目录名/文件名/txt),自动学习并用于后续层)。' +
        '输出到 sourceDir 旁的 _extracted 目录,原文件只读不动,解压成功的中间压缩包自动清理。' +
        '适合:一次性下载了几十个包、改过后缀、多层套娃、密码可能分层的场景。' +
        '参数: sourceDir=源目录(必填); secretFile=密码文件路径(可选,每行一个密码); outRoot=输出目录(可选,默认 sourceDir/_extracted)。' +
        '执行可能耗时较长(GB 级),完成后返回成功/失败清单与发现的成品。',
      parameters: {
        type: 'object',
        properties: {
          sourceDir: { type: 'string', description: '要批量解压的源目录(绝对路径)' },
          secretFile: { type: 'string', description: '密码文件路径(可选,每行一个密码)' },
          outRoot: { type: 'string', description: '输出目录(可选,默认 sourceDir 旁的 _extracted)' },
          maxDepth: { type: 'number', description: '最大递归深度(可选,默认 50)' },
        },
        required: ['sourceDir'],
      },
```

</details>

**依据 3 · 源码核查**：[lib/archive-core.js:238-246](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L238-L246)

输出根和默认深度。

```text
export async function autoExtractTree(sourceDir, opts = {}) {
  const sevenZip = opts.sevenZip || findSevenZip()
  if (!sevenZip) throw new Error('找不到 7-Zip,请安装或设置 SEVENZIP_PATH')
  if (!existsSync(sourceDir)) throw new Error('源目录不存在: ' + sourceDir)

  const outRoot = opts.outRoot || join(sourceDir, '_extracted')
  await mkdir(outRoot, { recursive: true })
  const log = opts.log || (() => {})
  const maxDepth = opts.maxDepth || 50
```

**依据 4 · 源码核查**：[lib/archive-core.js:289-314](https://github.com/sanqiPanax/jieyaTool/blob/09fd3cb4cb7287b4ebd089f7f972da6ac2e76813/lib/archive-core.js#L289-L314)

深度限制和失败输出。

<details>
<summary>查看原文（26行）</summary>

```text
  while (queue.length > 0) {
    const task = queue.shift()
    const { file, depth, baseDir } = task
    round++
    if (depth > maxDepth) { log(`SKIP 超深: ${file}`); results.failed.push(file); continue }
    if (!existsSync(file)) { log(`SKIP 消失: ${file}`); continue }

    const type = await detectType(file, { sevenZip, passwords: allPw(), log })
    if (type === 'none') continue

    log(`\n[${round}] 深度${depth} 类型=${type}: ${file}`)
    // 临时目录解压,成功再归位(防失败误删源)
    const tmpDir = join(outRoot, '_work_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6))
    await mkdir(tmpDir, { recursive: true })

    let r
    try {
      r = await extractOne(file, tmpDir, sevenZip, allPw(), { log })
    } catch (e) {
      log(`✗ extractOne 异常: ${(e && e.stack) || e}`)
      r = { ok: false, password: null }
    }
    if (!r.ok) {
      log(`✗ 解压失败(密码均错/损坏): ${file}`)
      await rm(tmpDir, { recursive: true, force: true }).catch(() => {})
      results.failed.push(file)
```

</details>

#### 缺口

- 没有实测空间、耗时及恢复
  **影响**：不能评估大归档或生产数据的负担
  **进一步探讨**：用小型合成包核对 7-Zip 退出码、输出哈希和工具日志

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
