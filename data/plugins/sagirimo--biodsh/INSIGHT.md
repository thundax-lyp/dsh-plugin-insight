# BioDSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[77f5b17](https://github.com/sagirimo/BioDSH/tree/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sagirimo/BioDSH)
<!-- END META -->

> **功能**：内嵌 DSH 与 Python 环境的桌面生信分析工具，组织项目、脚本和可复跑交付。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 根组件把项目文件、工作区、模型对话和分析环境放入桌面端。按公开合同触发的脚本回放与交付记录来自内嵌的独立 DSH bundle。

> **主要限制**：[Q03](#research-q03) 没有合同的会话可结束而不跑交付检查。通过回放可说明同脚本按声明复现，科学结论仍依赖方法、数据和独立对照。

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
  - [Q01 · 根桌面组件和独立 DSH 插件分别能交付什么？](#detail-section-11)
  - [Q02 · 桌面请求如何进入 DSH 和分析产物流程？](#detail-section-12)
  - [Q03 · 通过文件检查或作者基准能证明哪些科学结论？](#detail-section-13)
  - [Q04 · 运行、数据路径、模型与人工复核需要什么？](#detail-section-14)
  - [Q05 · 怎样用合成数据验收复跑和失败交付？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要交接一项有明确输入和输出合同的研究分析的用户，希望保留会话、代码、表和验证记录，并能让同事独立复跑。[Q01](#research-q01)

现有手写 Python 或 R 项目可用锁定环境、命令和独立参考脚本交付。熟悉脚本的团队可直接运行，界面组织、会话和校验需自行接线。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面项目与内嵌会话 | 组织数据、会话和结果 | 需已启动 DSH 与兼容 WebView |
| Python 环境 | 执行分析和校验 | 需可用依赖及已核对数据范围 |
| 合同校验和重放 | 核对已声明的产物 | 只在条件适用时执行 |
| 审阅及工作流入口 | 向现有会话提交任务 | 人工审阅和独立参考仍需单列 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Tauri 应用与嵌入 DSH | 桌面运行需要 | 启动项目和对话 | 核对实际发行包 |
| Node、uv、锁定 Python 环境 | 本地分析需要 | 宿主、库及复跑 | 验证环境后再运行 |
| 工作区、允许模型及数据路径 | 对话任务需要 | 定位输入并生成脚本 | 不明时停止提交 |
| 公开合同和独立参考 | 有条件的检查和科学对照需要 | 核验结构、重放与数值 | 手工核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 设样本 | 研究者准备无真实数据的固定输入和合同 | 记录摘要及预期输出 |
| 产生结果 | 从桌面会话运行并记录脚本和产物 | 检查交付 receipt 及错误 |
| 独立复核 | 复跑同脚本并与另写参考比较 | 各检查独立通过才计为合成验收 |
| 退出 | 留脚本、锁、报告和会话 | 失败时停止交付并人工审核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 客户端、DSH、Python 和依赖 | 配置模型、输入和合同 | 耗时未知 |
| 持续 | 模型、重放和输出存储 | 独立核验方法及数值 | 用量和净收益未测 |
| 失败恢复 | 重放可能再占资源 | 核查脚本、输入与输出 | 失败分支的实际恢复未知 |
| 退出 | 保留必要版本及日志 | 转回原脚本并核对数据副本 | 真实存留与清理未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 桌面交接 | 专用项目、Host 与分析环境接线 | 真实项目复跑和使用成本 |
| 有合同交付 | 声明校验及清洁目录重放 | 科学假设、选择方法及任意输入 |
| 作者数据 | 报告有限基准和模拟对照 | 独立复现与现实数据有效性 |

> **思考**：[Q03](#research-q03) 没有合同的会话可结束而不跑交付检查。通过回放可说明同脚本按声明复现，科学结论仍依赖方法、数据和独立对照。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 根组件把项目文件、工作区、模型对话和分析环境放入桌面端。按公开合同触发的脚本回放与交付记录来自内嵌的独立 DSH bundle。

[Q02](#research-q02) Tauri 启动嵌入 DSH 并配置独立 profile，PTC preset 接产物检查。[Q03](#research-q03) 回放、校验和会话结束状态各有独立判据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 没有合同的会话可结束而不跑交付检查。通过回放可说明同脚本按声明复现，科学结论仍依赖方法、数据和独立对照。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 仅用合成数据比较固定脚本及参考输出。分别检查合同触发、重放、产物、数据去向和独立对照。任何一项不明时停止交付。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持桌面接线和有条件的交付回放。作者基准及 R 对照是作者证据，未复现。没有真实科学或临床有效性证据。

- 已检查：作者 README、包清单、源码路径 README.md、desktop/src-tauri/tauri.conf.json、packages/dsh-biodsh/package.json、desktop/src-tauri/src/dsh.rs、desktop/src/renderer/src/views/ChatView.tsx、desktop/src/renderer/src/tauri-bridge.ts、desktop/src-tauri/src/lib.rs、packages/dsh-biodsh/cordis.patch.yml、packages/dsh-biodsh/lib/delivery.js、packages/dsh-biodsh/lib/select.js、packages/dsh-biodsh/lib/task_policy.js、packages/dsh-biodsh/lib/settings.js、packages/dsh-biodsh/lib/delivery_check.py、packages/dsh-biodsh/lib/guard.js、biodsh-core/skills/survival-km-cox/VALIDATION.md、desktop/src-tauri/src/paths.rs、desktop/src-tauri/src/pyenv.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：首次源码研究，固定根桌面组件、内嵌 DSH 启动和公开合同代表流程。未运行目标、复现作者基准或对方法提出科学和临床判断。
- 下一步：[Q05](#research-q05) 使用合成输入做匹配与反例，核对脚本、receipt、表及独立参考。对照无合同、合同被改、稳定复现错误和无结果四条路径。

**分析版本**

- **仓库**：[sagirimo/BioDSH](https://github.com/sagirimo/BioDSH)
- **版本号**：未声明（[固定提交 77f5b17](https://github.com/sagirimo/BioDSH/tree/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将合同是否适用、重放是否一致与独立参考是否通过分别交付，可能减少把运行完毕当作科学验证的判断错误。

[Q05](#research-q05) 使用合成输入做匹配与反例，核对脚本、receipt、表及独立参考。对照无合同、合同被改、稳定复现错误和无结果四条路径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 2558 | — | — | 37585 |
| .js | source | 24 | 1489 | 1265 | 155 | — |
| .ts | source | 18 | 1995 | 1833 | 68 | — |
| .mjs | source | 22 | 1329 | 1094 | 202 | — |
| .tsx | source | 28 | 3171 | 2903 | 129 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sagirimo/BioDSH/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/sagirimo/BioDSH/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sagirimo/BioDSH/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究者如何在桌面端组织一项可复跑的分析，根产品、独立 DSH 插件和科学验证各承担什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根桌面组件和独立 DSH 插件分别能交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要把一项分析的代码、输出表、任务会话和核对结果交给同事复跑的研究者，可比较 BioDSH 桌面和现有手工 Python 或 R 脚本流程。合格交付应能重新得到同一表，并用预先定义的参考值检查。桌面根产品组合项目界面、内嵌 DSH 与 Python 环境。独立的 `packages/dsh-biodsh` 提供预设、技能选择和收敛与交付钩子，桌面会把该 bundle 复制进自有 profile。能在原 DSH 只装预设的用户可直接用子包。既有团队若已有环境锁、脚本和审阅，桌面增量主要是组织项目和交付界面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-17](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/README.md#L15-L17)

作者区分桌面与 DSH 包。

```text
You add your data (single-cell `h5ad`, count matrices, clinical tables, gene lists…) and ask a question such as *"Do responders and non-responders differ in CD8A expression?"* The agent loads the data, picks the right method, writes and runs the code, and reports the conclusion along with the figures, the tables and every step it took.

BioDSH runs on your own computer and is built on [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness). It comes in two forms: a one-click **desktop app** and a **dsh plugin** (`dsh-biodsh`).
```

**依据 2 · 作者声明**：[README.md:51-61](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/README.md#L51-L61)

作者说明独立插件和 Skill 入口。

<details>
<summary>查看原文（11行）</summary>

````text
## Use it inside DeepSeek Harness

If you already use dsh, you can install the BioDSH agent as a plugin without the desktop app:

```bash
dsh plugin --profile web add dsh-biodsh
```

You can also install it from the dsh web UI: **Plugins → Install → `dsh-biodsh`**. Restart dsh, then pick **BioDSH** in the agent preset menu. Your other presets are left unchanged. The plugin requires dsh 0.2.1+ and pnpm. For details, see [`packages/dsh-biodsh`](packages/dsh-biodsh).

If you only want the skills, the official skills are plain dsh `SKILL.md` folders. `./scripts/install-into-dsh.sh <your-project>/.agents/skills` copies them in (use `install-into-dsh.ps1` on Windows).
````

</details>

**依据 3 · 作者声明**：[README.md:97-101](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/README.md#L97-L101)

作者明确 desktop、plugin、skills 子路径。

```text
| Path | Contents |
| --- | --- |
| `desktop/` | The desktop app: React UI (`src/`), Rust backend (`src-tauri/`) and build scripts. |
| `packages/dsh-biodsh/` | The `dsh-biodsh` plugin: BioDSH presets, skill selection and the convergence guard. |
| `biodsh-core/skills/` | Official skills. |
```

**依据 4 · 源码核查**：[desktop/src-tauri/tauri.conf.json:2-10](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/tauri.conf.json#L2-L10)

独立 Tauri 应用及构建版本。

```text
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "BioDSH",
  "version": "1.0.0",
  "identifier": "org.biodsh.desktop",
  "build": {
    "frontendDist": "../dist-tauri",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "npx vite --config vite.tauri.config.ts",
    "beforeBuildCommand": "npx vite build --config vite.tauri.config.ts"
```

**依据 5 · 源码核查**：[packages/dsh-biodsh/package.json:2-11](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/package.json#L2-L11)

单独发布的 DSH package 与目录。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "dsh-biodsh",
  "version": "1.0.0",
  "description": "BioDSH for DeepSeek Harness: a bioinformatics agent preset with BioDSH skills, a 2000+ skill library, automatic skill selection and a convergence guard",
  "icon": "./icon.svg",
  "license": "MIT",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sagirimo/BioDSH.git",
    "directory": "packages/dsh-biodsh"
```

</details>

**依据 6 · 源码核查**：[desktop/src-tauri/src/dsh.rs:99-116](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/dsh.rs#L99-L116)

桌面把 bundle 安装进自己创建的 DSH profile。

<details>
<summary>查看原文（18行）</summary>

```text
fn install_bundle(home: &Path, template: &Path) {
    let profile = home.join("profiles").join("web");
    let dst = profile.join("node_modules").join("dsh-biodsh");
    if template.join("package.json").exists() {
        let _ = fs::remove_dir_all(&dst);
        let _ = copy_dir(template, &dst);
    }
    let pj = profile.join("package.json");
    let mut v: serde_json::Value = fs::read_to_string(&pj).ok().and_then(|t| serde_json::from_str(&t).ok())
        .unwrap_or_else(|| serde_json::json!({ "name": "dsh-profile-web", "private": true, "dependencies": {},
            "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app"] } } }));
    let bundles = v.pointer_mut("/dsh/profile/bundles").and_then(|b| b.as_array_mut());
    match bundles {
        Some(list) => { if !list.iter().any(|b| b == "dsh-biodsh") { list.push(serde_json::json!("dsh-biodsh")); } }
        None => { v["dsh"] = serde_json::json!({ "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-biodsh"] } }); }
    }
    let _ = fs::create_dir_all(&profile);
    let _ = fs::write(&pj, serde_json::to_string_pretty(&v).unwrap_or_default() + "\n");
```

</details>

#### 缺口

- 没有真实团队交接或分析时长记录。
  **影响**：桌面交接比已有脚本流能节省多少待测。
  **进一步探讨**：固定同一合成输入和参考结果，比较首次设置、复跑及审阅工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面请求如何进入 DSH 和分析产物流程？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

ChatView 启动时调用 Tauri IPC，Rust 准备应用专用 profile 和资源，默认 preset 设 `biodsh-ptc`，以打包 Node 启动 DSH Web。把工作区作为 cwd 并加入 Python 虚拟环境路径，通过进程输出找到回环 URL，再嵌入 Tauri WebView。桌面侧的审阅或工作流快捷按钮把文本排入已有会话，IPC 补 requestId 后走 DSH HTTP RPC；主聊天在 WebView 内由 DSH 承担。PTC preset 实际挂技能、交付和步数守卫。默认自适应技能选择发现公开产物合同时会跳过模型选技能。根 Agent 的 pre-step 记录指定合同，turn-stopping 若存在合同或读取错误就调用 Python 校验；回传 receipt 并尝试注入修复，达到限制时抛出拒绝。单独阅读按钮代码可见审阅入口发送同一会话的提示，不能据此视为独立人审。

#### 证据与依据

**依据 1 · 源码核查**：[desktop/src/renderer/src/views/ChatView.tsx:14-29](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src/renderer/src/views/ChatView.tsx#L14-L29)

聊天页触发 Host 启动与挂载。

<details>
<summary>查看原文（16行）</summary>

```text
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => { if (dsh.state === 'stopped') void startDsh(); }, []);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const report = () => {
      const r = el.getBoundingClientRect();
      window.biodsh.dshBounds({ x: r.left, y: r.top, width: r.width, height: r.height }, dsh.state === 'running' && !overlayOpen);
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    window.addEventListener('resize', report);
    return () => { ro.disconnect(); window.removeEventListener('resize', report); window.biodsh.dshBounds({ x: 0, y: 0, width: 0, height: 0 }, false); };
```

</details>

**依据 2 · 源码核查**：[desktop/src/renderer/src/tauri-bridge.ts:16-30](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src/renderer/src/tauri-bridge.ts#L16-L30)

启动与 RPC 实际映射到 Tauri。

<details>
<summary>查看原文（15行）</summary>

```text
    dshStatus: () => invoke('dsh_status'),
    dshStart: () => invoke('dsh_start'),
    dshRestart: () => invoke('dsh_restart'),
    dshStop: () => invoke('dsh_stop'),
    dshReload: () => invoke('dsh_reload'),
    dshBounds: (rect: Rect, visible: boolean) => { void invoke('dsh_bounds', { rect, visible }); },
    skillsCatalog: () => invoke('skills_catalog'),
    skillsStatuses: () => invoke('skills_statuses'),
    skillReadme: (id: string) => invoke('skills_readme', { id }),
    skillInstall: (id: string) => invoke('skills_install', { id }),
    skillUninstall: (id: string) => invoke('skills_uninstall', { id }),
    openPath: (p: string) => invoke('open_path', { path: p }),
    openExternal: (u: string) => invoke('open_external', { url: u }),
    pickFolder: () => invoke('pick_folder'),
    dshRpc: (method: string, payload: unknown = {}) => invoke('dsh_rpc', { method, payload }),
```

</details>

**依据 3 · 源码核查**：[desktop/src-tauri/src/lib.rs:339-343](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/lib.rs#L339-L343)

调用 Rust DSH manager。

```text
    let st = tauri::async_runtime::spawn_blocking(move || d.start_with(&app2, &paths, &ws2, key, extra_env, &mcp)).await.map_err(|e| e.to_string())?;
    if st.state == "running" {
        if let Some(u) = &st.url {
            // 让默认工作区在 dsh 里注册（幂等：已存在则原样返回）
            let (u2, ws3) = (u.clone(), ws.clone());
```

**依据 4 · 源码核查**：[desktop/src-tauri/src/dsh.rs:188-199](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/dsh.rs#L188-L199)

准备 profile 与默认 PTC。

<details>
<summary>查看原文（12行）</summary>

```text
    fn ensure_home(paths: &AppPaths, official_skills: &Path, library_skills: &Path, bundle_template: &Path, mcp: &[crate::settings::McpServer]) {
        let home = &paths.dsh_home;
        let _ = fs::remove_dir_all(home.join(".agent-presets").join("biodsh")); // 0.1.2 遗留
        install_bundle(home, bundle_template);

        let mut body: Vec<String> = MINIMAL_PLUGINS.iter().map(|id| format!("- id: {id}\n  disabled: true")).collect();
        // 补丁对已有条目的 config 是整体替换:agent-preset-registry 只有 default 一个必填字段;biodsh 行是我们自己的。
        // 默认用 PTC 版(程序化工具调用,同 dsh 自带 ptc 预设):开发循环 15 题步数中位 23→16、耗时 129→97 s,正确率不变。
        body.push("- id: agent-preset-registry\n  config:\n    default: biodsh-ptc".into());
        let json = |v: &str| serde_json::to_string(v).unwrap_or_else(|_| "\"\"".into());
        body.push(format!("- id: biodsh\n  config:\n    officialSkillsDir: {}\n    librarySkillsDir: {}\n    appContext: {}",
            json(&official_skills.to_string_lossy()), json(&library_skills.to_string_lossy()), json(APP_CONTEXT)));
```

</details>

**依据 5 · 源码核查**：[desktop/src-tauri/src/dsh.rs:234-267](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/dsh.rs#L234-L267)

准备路径并启动 Node DSH。

<details>
<summary>查看原文（34行）</summary>

```text
    pub fn start_with(self: &Arc<Self>, app: &AppHandle, paths: &AppPaths, workspace: &str, offline_key: Option<String>, extra_env: Vec<(String, String)>, mcp: &[crate::settings::McpServer]) -> DshStatus {
        if self.child.lock().unwrap().is_some() { return self.status.lock().unwrap().clone(); }
        Self::ensure_home(paths, &crate::paths::resource(app, "skills"), &crate::paths::resource(app, "community-skills"), &crate::paths::resource(app, "dsh/node_modules").join("@biodsh").join("dsh-biodsh"), mcp);
        crate::settings::migrate_credentials(paths);
        ensure_sitecustomize(&paths.bioenv);
        *self.status.lock().unwrap() = DshStatus { state: "starting".into(), ..Default::default() };
        self.emit(app);
        let node = node_binary(app);
        let bin = dsh_bin(app);
        if !node.exists() {
            *self.status.lock().unwrap() = DshStatus { state: "error".into(), error: Some(format!("找不到自带的 Node 运行时：{}", node.display())), ..Default::default() };
            self.push(app, paths, &format!("[error] node not found at {}", node.display()));
            return self.status.lock().unwrap().clone();
        }
        let bin_dir = venv_bin_dir(&paths.bioenv);
        let uv_dir = uv_binary(app).parent().map(Path::to_path_buf).unwrap_or_default();
        let sep = if cfg!(windows) { ";" } else { ":" };
        let node_dir = node.parent().map(Path::to_path_buf).unwrap_or_default();
        let path_env = format!("{}{sep}{}{sep}{}{sep}{}", bin_dir.display(), uv_dir.display(), node_dir.display(), std::env::var("PATH").unwrap_or_default());
        let _ = fs::create_dir_all(workspace);
        self.push(app, paths, &format!("[spawn] {} --expose-internals {} web (cwd {workspace})", node.display(), bin.display()));
        let mut cmd = Command::new(&node);
        cmd.arg("--expose-internals").arg(&bin).args(["web", "--port", "0", "--no-open"])
            .current_dir(workspace)
            .env("DSH_HOME", &paths.dsh_home)
            .env("BIODSH_HOME", &paths.root)
            .env("BIODSH_PYTHON", venv_python(&paths.bioenv))
            .env("UV_PROJECT_ENVIRONMENT", paths.bioenv.join(".venv"))
            .env("VIRTUAL_ENV", paths.bioenv.join(".venv"))
            .env("PATH", path_env)
            .env("DSH_TELEMETRY_DISABLED", "1")
            // 技能、技能精选与收敛护栏都由 dsh-biodsh bundle 提供并通过 `biodsh` 设置配置(见 ensure_home);不要再设
            // DSH_BUNDLED_SKILL_DIR,否则 2000+ 社区技能会经 skill-filesystem 进入会话目录。
            .env_remove("NODE_OPTIONS");
```

</details>

**依据 6 · 源码核查**：[desktop/src-tauri/src/dsh.rs:289-303](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/dsh.rs#L289-L303)

定位回环地址。

<details>
<summary>查看原文（15行）</summary>

```text
            std::thread::spawn(move || {
                for line in BufReader::new(stream).lines().map_while(Result::ok) {
                    if line.trim().is_empty() { continue; }
                    if let Some(i) = line.find("http://127.0.0.1:") {
                        // 稳健解析：host + 数字端口 + 可选 /path?query(含 0.1.2 的 ?token=)，遇空白即止；
                        // 两条 URL 粘在一行(快速重启时 stdout 交错)也只取到干净的一条，绝不把 "4307dsh" 当 URL 送进 webview。
                        let rest = &line[i..];
                        let b = rest.as_bytes();
                        let mut end = "http://127.0.0.1:".len();
                        while end < b.len() && b[end].is_ascii_digit() { end += 1; }
                        if end < b.len() && b[end] == b'/' { while end < b.len() && !b[end].is_ascii_whitespace() { end += 1; } }
                        let url = rest[..end].to_string();
                        let mut s = me.status.lock().unwrap();
                        if s.state == "starting" && end > "http://127.0.0.1:".len() { s.state = "running".into(); s.url = Some(url); }
                    }
```

</details>

**依据 7 · 源码核查**：[desktop/src-tauri/src/lib.rs:194-217](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/lib.rs#L194-L217)

嵌入 DSH WebView。

<details>
<summary>查看原文（24行）</summary>

```text
fn ensure_dsh_view(app: &AppHandle, state: &AppState, url: &str) {
    if std::env::var_os("BIODSH_NO_DSH_VIEW").is_some() { return; }
    if let Some(view) = app.get_webview("dsh") {
        let _ = view.navigate(url.parse().unwrap());
        layout_dsh(app, state);
        return;
    }
    let Some(window) = app.get_window("main") else { return };
    let opener = app.clone();
    let builder = tauri::webview::WebviewBuilder::new("dsh", WebviewUrl::External(url.parse().unwrap()))
        // 关键:关掉 Tauri 自带的拖放拦截。开着时(默认 true)WebView2 会吞掉 dsh 网页里
        // <input type=file>/文件夹选择的原生对话框 → dsh 那边"新增本地文件夹/附件"的选项框弹不出来。
        // 关掉后原生选择框恢复,且网页自身的 HTML5 拖放(ondrop)照常可用。
        .disable_drag_drop_handler()
        .initialization_script(DSH_INIT_SCRIPT)
        .on_navigation(move |u| {
            if u.host_str() == Some("127.0.0.1") || u.scheme() == "about" { return true; }
            let _ = opener.opener().open_url(u.to_string(), None::<&str>);
            false
        });
    let (r, _) = *state.dsh_bounds.lock().unwrap();
    if window.add_child(builder, LogicalPosition::new(r.x, r.y), LogicalSize::new(r.width.max(1.0), r.height.max(1.0))).is_ok() {
        layout_dsh(app, state);
    }
```

</details>

**依据 8 · 源码核查**：[desktop/src/renderer/src/views/ChatView.tsx:32-50](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src/renderer/src/views/ChatView.tsx#L32-L50)

桌面按钮在同一会话发送审阅、工作流提示。

<details>
<summary>查看原文（19行）</summary>

```text
  const send = async (text: string, ok: string) => {
    if (!taskMeta) return;
    try { await window.biodsh.dshRpc('session.prompt', { sessionId: taskMeta.sessionId, mode: 'queue', content: [{ type: 'text', text }] }); setNotice(ok); }
    catch (e) { setNotice(t('发送失败：{msg}', { msg: String(e).slice(0, 80) })); }
    setTimeout(() => setNotice(null), 3500);
  };
  const review = () => send(t('请以独立审稿人的身份审阅你在本任务里给出的最终结论。逐条列出每个结论及其依据（对应的文件、表格或数值），标注：证据充分 / 证据不足 / 有问题，并说明理由。检查统计单位、多重检验、对照与混杂、样本量和数据质量。最后用一段话说明哪些问题会改变结论、哪些只影响表述。不要修改任何文件。'), t('已请求审阅，结果会出现在对话里'));
  const toPipeline = () => send(t('/pipeline-builder 请把本任务整理成一条可复现的工作流。先列出你从本任务里提取到的实际执行步骤，等我确认保留哪些、哪些参数开放给新数据，再问我要哪些验证选项，最后写入项目的 pipelines 文件夹并做一次复现验证。'), t('已开始构建工作流，按对话里的提示确认步骤'));

  const busyTask = !!taskMeta?.running;
  return (
    <div className="h-full flex flex-col">
      <TopBar actions={
        <>
          {notice && <span className="pill pill-on rise">{notice}</span>}
          {!credential.hasKey && <button className="btn btn-ghost" style={{ color: 'var(--orange)' }} onClick={() => setTab('settings')}><BioIcon name="ui-warning" size={14} /> {t('还没填 API Key')}</button>}
          {taskMeta && !taskMeta.blank && <>
            <button className="btn btn-ghost" onClick={review} disabled={busyTask} title={busyTask ? t('任务运行中，结束后再审阅') : undefined}><BioIcon name="ui-review" size={15} />{t('审阅结论')}</button>
            <button className="btn btn-line" onClick={toPipeline} disabled={busyTask}><BioIcon name="ui-save-workflow" size={15} />{t('存为工作流')}</button>
```

</details>

**依据 9 · 源码核查**：[desktop/src-tauri/src/lib.rs:680-685](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/lib.rs#L680-L685)

补原生 request ID 并派送会话 prompt。

```text
        "session.prompt" => {
            let mut p = payload;
            if p.get("requestId").is_none() {
                if let Some(o) = p.as_object_mut() { o.insert("requestId".into(), json!(uuid::Uuid::new_v4().to_string())); }
            }
            dsh_raw(url, "session/prompt", "request", p)
```

**依据 10 · 源码核查**：[packages/dsh-biodsh/cordis.patch.yml:255-262](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/cordis.patch.yml#L255-L262)

PTC preset 真正接入交付和步数守卫。

```text
          - id: biodsh-skills
            name: dsh-biodsh/skills
          - id: biodsh-skill-select
            name: dsh-biodsh/select
          - id: biodsh-delivery
            name: dsh-biodsh/delivery
          - id: biodsh-step-guard
            name: dsh-biodsh/guard
```

**依据 11 · 源码核查**：[packages/dsh-biodsh/lib/delivery.js:52-75](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery.js#L52-L75)

pre-step 记录合同，停止时按条件检查。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.on('agent/pre-step',async(payload,next)=>{
    const roots=ctx.get?.('agents')?.roots?.();
    // Child agents are skipped, except BioDSH-MAGI's Replicator and Arbiter (marked by a role file in their workspace).
    if (roots && !roots.includes(payload?.agent) && !roleOf(workspaceRoot(ctx,payload?.agent) || '.')) return next();
    if (get('deliveryEnabled') && payload?.agent) {
      const previous=states.get(payload.agent);
      if (!previous || previous.turn!==payload.turn) {
        const root=workspaceRoot(ctx,payload.agent);
        if (root) {
          let docs={},error=null;try{docs=snapshotContracts(root);}catch(e){error=String(e);}
          const semantic=get('semanticEnabled') && Object.keys(docs).length ? snapshotPublicSources(root) : null;
          states.set(payload.agent,{turn:payload.turn,root,docs,error,semantic,repairs:0,steps:0,t0:Date.now(),role:roleOf(root)});
          if(semantic?.applicable || (semantic && get('coverageReviewEnabled')))payload.agent.inject({id:randomUUID(),role:'user',content:[{type:'text',text:SEMANTIC_INSTRUCTIONS}],source:{kind:'biodsh-semantic-plan',form:'notice',summary:'declare public source consistency checks'}});
        }
      }
      const st=states.get(payload.agent);
      if(st?.semantic?.applicable)observePlan(st.root,st.semantic,'pre-step:'+st.steps++);
    }
    return next();
  });
  ctx.on('agent/turn-stopping',async({agent,turn,signal})=>{
    if (!get('deliveryEnabled')) return;
    const st=states.get(agent);
    if (!st || st.turn!==turn || (!st.error && !Object.keys(st.docs).length))return;
```

</details>

**依据 12 · 源码核查**：[packages/dsh-biodsh/lib/delivery.js:81-96](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery.js#L81-L96)

运行校验并保留 receipt。

<details>
<summary>查看原文（16行）</summary>

```text
      result=await check(st.root,st.docs,{python:get('deliveryPython') || process.env.BIODSH_PYTHON || 'python3',
        args:get('deliveryPythonArgs') || [],seconds:get('deliveryReplaySeconds'),reconcileChecks:get('reconcileChecks') || st.role==='arbiter',semantic:st.semantic?.applicable ? st.semantic : null},signal);
      if(result.ok && st.semantic && get('coverageReviewEnabled')){
        result.coverage_review=await reviewCoverage(ctx,agent,st.root,st.docs,st.semantic,result,{python:get('deliveryPython')||process.env.BIODSH_PYTHON||'python3',args:get('deliveryPythonArgs')||[]},signal);
        if(!result.coverage_review.ok){result.ok=false;result.errors.push('Independent public-contract coverage review requires repair: '+JSON.stringify({issues:result.coverage_review.issues,uncertain_columns:result.coverage_review.uncertain_columns,error:result.coverage_review.error}));}
      }
    } catch(e) {
      if(signal?.aborted)throw e;
      result={ok:false,errors:[String(e)],infrastructureError:true};
    }
    const reviewError=Boolean(result.coverage_review?.error);
    if(reviewError)result.infrastructureError=true;
    const exhausted=!result.ok && (reviewError || st.repairs>=get('deliveryMaxRepairs'));
    const receipt={...result,turn,recorded_at:new Date().toISOString(),repairs:st.repairs,semantic_applicable:st.semantic?.applicable ?? false,semantic_source_manifest:st.semantic?.public_files ?? {},semantic_plan_history:st.semantic?.plan_history ?? [],status:result.ok?'accepted':exhausted?'rejected':'repair-required'};
    fs.appendFileSync(path.join(st.root,'.biodsh-delivery-events.jsonl'),JSON.stringify(receipt)+'\n');
    fs.writeFileSync(path.join(st.root,'.biodsh-delivery.json'),JSON.stringify(receipt,null,2));
```

</details>

**依据 13 · 源码核查**：[packages/dsh-biodsh/lib/delivery.js:107-114](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery.js#L107-L114)

错误修复通知及耗尽拒绝。

```text
    if(result.ok)return;
    if(exhausted)throw new Error('BIODSH_DELIVERY_REJECTED: public contract/replay check failed; repair limit reached');
    st.repairs++;
    const feedback=result.coverage_review ? {...result,coverage_review:{ok:result.coverage_review.ok,issues:result.coverage_review.issues,uncertain_columns:result.coverage_review.uncertain_columns,error:result.coverage_review.error,required_columns:result.coverage_review.required_columns,reviewed_columns:result.coverage_review.reviewed_columns}} : result;
    // A deterministic tool-result notice. Do not fabricate a tool-call ID absent from the transcript.
    agent.inject({id:randomUUID(),role:'user',content:[{type:'text',text:
      'Delivery validator result: '+JSON.stringify(feedback)+'\nDelivery is blocked. Fix these public-contract/source-consistency/replay errors, save the code and rerun before finishing. Do not alter the contracts or source inputs. Repair round '+st.repairs+'/'+get('deliveryMaxRepairs')+'.'}],
      source:{kind:'biodsh-delivery',form:'notice',summary:'deterministic delivery validation failed'}});
```

**依据 14 · 源码核查**：[packages/dsh-biodsh/lib/select.js:116-134](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/select.js#L116-L134)

pre-step 按策略决定是否选择技能。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.on('agent/pre-step', async (payload, next) => {
    if (!get('selectEnabled')) return next();
    let picked = null;
    try {
      const query = payload?.agent ? humanText(payload.messages) : '';
      if (query) {
        const policy=selectorPolicy({enabled:get('selectEnabled'),adaptive:get('selectAdaptive'),root:workspaceRoot(ctx,payload.agent),query});
        dbg('policy '+policy.reason);
        if (!policy.enabled) return next();
        const t0 = Date.now();
        picked = await select(payload.agent, query, payload.signal);
        dbg(`picked ${JSON.stringify(picked)} in ${Date.now() - t0}ms`);
      }
    } catch (e) {
      if (payload?.signal?.aborted || /\b(?:402|429)\b|insufficient.balance|rate.limit/i.test(String(e?.message || e))) throw e;
      dbg('fallback: ' + (e?.message || e));
    }
    const decision = await next();
    if (!picked?.length || !decision || decision.kind !== 'enter') return decision;
```

</details>

**依据 15 · 源码核查**：[packages/dsh-biodsh/lib/task_policy.js:3-12](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/task_policy.js#L3-L12)

识别合同文件并在默认自适应模式停选技能。

<details>
<summary>查看原文（10行）</summary>

```text
export const CONTRACT_FILES = ['TABLE_CONTRACT.json', 'ROW_SETS.json', 'PUBLIC_OUTPUT_NAMING_AND_TYPES.json', 'CLAIMS.json'];
export function workspaceRoot(ctx, agent) {
  // The working-directory service knows a child's own cwd; a subagent's session header still records its parent's.
  let wd; try { wd = ctx.get('workingDirectory')?.get(agent?.session); } catch {}
  return (typeof wd === 'string' && wd) || agent?.session?.header?.cwd;
}
export function selectorPolicy({ enabled = true, adaptive = true, root, query = '', hasFile = existsSync }) {
  if (!enabled) return { enabled: false, reason: 'disabled-by-setting' };
  if (!adaptive) return { enabled: true, reason: 'adaptive-disabled' };
  if (root && CONTRACT_FILES.some(n => hasFile(path.join(root, n)))) return { enabled: false, reason: 'public-output-contract' };
```

</details>

#### 缺口

- 没有实际 DSH 运行和产物证据。
  **影响**：UI 连接、技能和钩子在目标版本的端到端尚未验收。
  **进一步探讨**：留每次启动、请求 ID、可回读产物、校验记录与错误事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 通过文件检查或作者基准能证明哪些科学结论？

**研究主题**：缺陷与关键质疑

#### 完整回答

没有识别到合同文件且无读合同错误时，交付钩子直接返回。存在合同时检查声明的表、行键、JSON、声明绑定，部分非机器规则只会警告；可选语义按公共数据检查有限关系。无外部参考时，脚本重新生成相同数值只能证明复跑一致，可以稳定重复错误算法或错误分组。干净目录、输入复制、有限环境及 POSIX 资源限制减少干扰，代码仍以当前权限执行包含标准库的 Python，未见该分支建立完整 OS 或网络沙箱。覆盖评审和 MAGI 默认关。步数守卫软提示和硬拒绝不同，硬拒绝未证明已产生最终结果。作者列 120 题同模型 BioDSH 98、原生 DSH 101、BioDSH 加盲复核 102，报告无显著差异且每配置一次。生存技能与 R 的模拟数值对照也是作者对所列范围与容差的证据，未覆盖任意数据、模型选择或临床有效性。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-biodsh/lib/delivery.js:72-90](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery.js#L72-L90)

无合同时跳过，可选覆盖评审与报错。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.on('agent/turn-stopping',async({agent,turn,signal})=>{
    if (!get('deliveryEnabled')) return;
    const st=states.get(agent);
    if (!st || st.turn!==turn || (!st.error && !Object.keys(st.docs).length))return;
    let result;
    try {
      if(st.error)throw new Error(st.error);
      if(st.semantic?.error)throw new Error(st.semantic.error);
      if(st.semantic?.applicable)observePlan(st.root,st.semantic,'turn-stopping');
      result=await check(st.root,st.docs,{python:get('deliveryPython') || process.env.BIODSH_PYTHON || 'python3',
        args:get('deliveryPythonArgs') || [],seconds:get('deliveryReplaySeconds'),reconcileChecks:get('reconcileChecks') || st.role==='arbiter',semantic:st.semantic?.applicable ? st.semantic : null},signal);
      if(result.ok && st.semantic && get('coverageReviewEnabled')){
        result.coverage_review=await reviewCoverage(ctx,agent,st.root,st.docs,st.semantic,result,{python:get('deliveryPython')||process.env.BIODSH_PYTHON||'python3',args:get('deliveryPythonArgs')||[]},signal);
        if(!result.coverage_review.ok){result.ok=false;result.errors.push('Independent public-contract coverage review requires repair: '+JSON.stringify({issues:result.coverage_review.issues,uncertain_columns:result.coverage_review.uncertain_columns,error:result.coverage_review.error}));}
      }
    } catch(e) {
      if(signal?.aborted)throw e;
      result={ok:false,errors:[String(e)],infrastructureError:true};
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-biodsh/lib/settings.js:15-36](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/settings.js#L15-L36)

默认启用交付，关闭独立覆盖评审和 MAGI。

<details>
<summary>查看原文（22行）</summary>

```text
export const DEFAULTS = {
  coverageReviewEnabled: false,
  semanticEnabled: true,
  selectEnabled: true, selectAdaptive: true,
  deliveryEnabled: true, reconcileChecks: false, magiMode: 'off', magiSteps: 60, magiSeconds: 900, deliveryMaxRepairs: 3, deliveryReplaySeconds: 120, deliveryPython: '', deliveryPythonArgs: [], selectProvider: '', selectModel: '', selectMaxInject: 2,
  guardEnabled: true, guardSoftSteps: 60, guardSoftSeconds: 900, guardHardSteps: 80, guardHardSeconds: 1100, guardMaxSteps: 90,  // v18 (evaluated) thresholds
  library: true, librarySearchLimit: 8, officialSkillsDir: '', librarySkillsDir: '', appContext: '', debug: false,
};

export default class BioDSHSettings extends Service {
  static Config = z.object({
    coverageReviewEnabled: z.boolean().default(false).volatile().description('Require independent public-contract coverage review before accepting scientific outputs.'),
    selectEnabled: z.boolean().default(DEFAULTS.selectEnabled).volatile().description('Pick and inject fitting skills for each new message.'),
    selectAdaptive: z.boolean().default(true).volatile(),
    deliveryEnabled: z.boolean().default(true).volatile(),
    magiMode: z.union([z.const('off'), z.const('adaptive'), z.const('always')]).default('off').volatile().description('Experimental, off by default. BioDSH-MAGI (Multi-Analyst Gated Inspection) for tasks with a public output contract: off = single analyst; adaptive = a blind replicator and an arbiter with executable checks only when the analyst run shows risk; always = review every such task.'),
    magiSteps: z.natural().default(60).volatile().description('MAGI adaptive: review a run that used at least this many steps.'),
    magiSeconds: z.natural().default(900).volatile().description('MAGI adaptive: review a run that took at least this many seconds.'),
    reconcileChecks: z.boolean().default(false).volatile().description('Require submission/reconcile_checks.py to pass on the clean replay (v17 reconciliation).'),
    semanticEnabled: z.boolean().default(true).volatile().description('Experimental partial checks derived from original public inputs.'),
    deliveryMaxRepairs: z.natural().default(3).volatile(),
    deliveryReplaySeconds: z.natural().default(120).volatile(),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:76-103](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L76-L103)

表、行键与非可执行规则提示。

<details>
<summary>查看原文（28行）</summary>

```text
def validate(public,submission,docs=None):
    docs=contracts(public) if docs is None else docs
    result={'triggered':bool(docs),'ok':True,'errors':[],'warnings':[],'tables':{}}
    if not docs:return result
    errors=result['errors'];warn=result['warnings'];loaded={}
    try:specs,defs=table_specs(docs)
    except (KeyError,ValueError,TypeError) as e:
        result.update(ok=False,errors=['invalid public contract: '+str(e)]);return result
    if not specs:warn.append('No machine-readable table schema; only declared JSON checks apply.')
    for name,spec in specs.items():
        try:
            header,rows,issues=load_table(safe_path(submission,name),spec)
            loaded[name]=(spec,rows)
            errors.extend(name+': '+i for i in issues[:10])
            entry={'rows':len(rows),'key_set_checked':False};result['tables'][name]=entry
            for r in [spec.get('row_set',{}),spec.get('external_row_set',{})]:
                if not r:continue
                try:expected=expected_keys(dict(spec,row_set=r),defs)
                except (KeyError,ValueError,TypeError,RecursionError) as e:
                    errors.append(name+': cannot expand declared row set: '+str(e));continue
                if expected is not None:
                    entry['key_set_checked']=True;actual=set(rows)
                    if actual!=expected:
                        errors.append(name+': key_set mismatch '+json.dumps({'missing_count':len(expected-actual),'extra_count':len(actual-expected),'missing':sorted(expected-actual)[:5],'extra':sorted(actual-expected)[:5]},ensure_ascii=False))
                if type(r.get('row_count')) is int and r['row_count']!=len(rows):errors.append(name+': row_count mismatch')
                elif 'row_count' in r and type(r['row_count']) is not int:warn.append(name+': prose row-count rule not executable')
            if not entry['key_set_checked']:warn.append(name+': no public exact key set; uniqueness only')
            cell_errors=[];unspecified_missing=set()
```

</details>

**依据 4 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:143-171](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L143-L171)

结构和声明绑定按公开合同验证。

<details>
<summary>查看原文（29行）</summary>

```text
    if 'CLAIMS.json' in docs:
        try:
            c=read_json(safe_path(submission,'interpretation_claims.json'))
            if not isinstance(c,dict) or set(c)!={'schema_version','claims','narrative'}:raise ValueError('expected schema_version, claims, narrative object')
            if type(c['schema_version']) is not int or c['schema_version']!=2:raise ValueError('schema_version must be integer 2')
            if not isinstance(c['narrative'],str) or not c['narrative'].strip():raise ValueError('narrative must be nonempty')
            declarations=docs['CLAIMS.json']['claims']
            if not isinstance(c['claims'],dict) or set(c['claims'])!={s['id'] for s in declarations}:raise ValueError('claims exact key set mismatch')
            for s in declarations:
                name=s['id'];v=c['claims'][name];typ=s['type']
                if typ=='number':
                    if type(v) not in (int,float) or not math.isfinite(v):errors.append('claim '+name+': expected finite number');continue
                    if 'binding' in s:
                        try:
                            n=binding_value(s['binding'],loaded)
                            if not math.isclose(v,n,rel_tol=s.get('rel_tol',0),abs_tol=s.get('abs_tol',0)):errors.append('claim '+name+': table binding mismatch')
                        except (ValueError,KeyError,TypeError):errors.append('claim '+name+': invalid table binding')
                elif typ in ('derived','choice'):
                    if not isinstance(v,str) or v not in s.get('options',[]):errors.append('claim '+name+': not a declared option')
                    if typ=='derived' and 'rule' in s:
                        rule=s['rule'];ops={'lt':operator.lt,'le':operator.le,'gt':operator.gt,'ge':operator.ge,'eq':operator.eq,'ne':operator.ne}
                        try:
                            flag=ops[rule['op']](binding_value(rule['binding'],loaded),rule['threshold'])
                            if v!=rule['outcomes'][str(flag).lower()]:errors.append('claim '+name+': public derived rule mismatch')
                        except (ValueError,KeyError,TypeError):errors.append('claim '+name+': unsupported or invalid public rule')
                else:errors.append('claim '+name+': unsupported type')
        except (OSError,ValueError,KeyError,TypeError) as e:errors.append('interpretation_claims.json: '+str(e))
    result['ok']=not errors
    return result
```

</details>

**依据 5 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:203-246](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L203-L246)

隔离重放及同产物对照，资源限制按平台。

<details>
<summary>查看原文（44行）</summary>

```text
def replay(public,submission,docs,seconds=120,temp_root=None):
    start=time.monotonic();root=Path(tempfile.mkdtemp(prefix='v13_delivery_',dir=temp_root))
    # Retain evidence; no deletion of user files or prior replay artifacts.
    inp=root/'inputs';out=root/'out';out.mkdir();cwd=root/'cwd';cwd.mkdir()
    result={'ok':False,'root':str(root),'seconds':None}
    try:
        source=safe_path(submission,'analysis.py')
        if not source.is_file():raise ValueError('analysis.py missing')
        shutil.copy2(source,root/'submitted.py')
        source_inputs=Path(public)/'inputs'
        if any(p.is_symlink() for p in source_inputs.rglob('*')):raise ValueError('input symlink unsupported')
        shutil.copytree(source_inputs,inp)
        bootstrap=root/'replay_bootstrap.py'
        bootstrap.write_text('''import sys, runpy, importlib.abc
class AllowedImports(importlib.abc.MetaPathFinder):
 def find_spec(self, fullname, path=None, target=None):
  top=fullname.split('.')[0]
  if not top.startswith('_sysconfigdata_') and top not in sys.stdlib_module_names and top not in {'numpy','scipy','pandas','dateutil','pytz','tzdata','six'}:
   raise ImportError('Replay dependency outside numpy/scipy/pandas: '+top)
sys.meta_path.insert(0,AllowedImports())
script=sys.argv.pop(1)
runpy.run_path(script,run_name='__main__')
''')
        env={k:v for k,v in os.environ.items() if k in ('PATH','SYSTEMROOT','WINDIR','LANG','LC_ALL')}
        env.update(OPENBLAS_NUM_THREADS='1',OMP_NUM_THREADS='1',MKL_NUM_THREADS='1',NUMEXPR_NUM_THREADS='1',PYTHONDONTWRITEBYTECODE='1',HOME=str(root))
        def limits():
            import resource
            resource.setrlimit(resource.RLIMIT_CPU,(max(1,int(seconds)),max(2,int(seconds)+1)))
            resource.setrlimit(resource.RLIMIT_AS,(1024**3,1024**3))
            resource.setrlimit(resource.RLIMIT_FSIZE,(8*1024**2,8*1024**2))
        cmd=[sys.executable,'-I','-B',str(bootstrap),str(root/'submitted.py'),'--inputs',str(inp),'--out',str(out)]
        with (root/'stdout.log').open('wb') as so,(root/'stderr.log').open('wb') as se:
            p=subprocess.Popen(cmd,cwd=cwd,env=env,stdout=so,stderr=se,start_new_session=(os.name=='posix'),preexec_fn=limits if os.name=='posix' else None)
            try:p.wait(timeout=seconds)
            except subprocess.TimeoutExpired:
                if os.name=='posix':os.killpg(p.pid,signal.SIGKILL)
                else:p.kill()
                p.wait();raise ValueError('replay wall-clock timeout')
        result['returncode']=p.returncode
        if p.returncode:raise ValueError('replay exit '+str(p.returncode)+': '+(root/'stderr.log').read_text(errors='replace')[-2000:])
        structure=validate(public,out,docs);result['validation']=structure
        comparison=compare_deliveries(public,submission,out,docs,use_contract_tolerance=True);result['comparison']=comparison
        if not (out/'analysis.py').is_file():structure['errors'].append('replay did not deliver analysis.py');structure['ok']=False
        result['ok']=structure['ok'] and comparison['agree']
```

</details>

**依据 6 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:288-308](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L288-L308)

合同变更拒绝，语义检查和重放有条件触发。

<details>
<summary>查看原文（21行）</summary>

```text
        docs=contracts(a.public);semantic=None
        if a.snapshot_stdin:
            snapshot=json.load(sys.stdin)
            if snapshot.get('__biodsh_snapshot_version')==14:
                semantic=snapshot['semantic'];snapshot=snapshot['contracts']
            if docs!=snapshot:raise ValueError('public contract changed after session start')
            docs=snapshot
        submission=a.submission or str(Path(a.public)/'submission')
        r=validate(a.public,submission,docs)
        if semantic is not None:
            r['semantic']=check_semantics(a.public,submission,semantic,table_specs(docs)[0])
            r['ok']=r['ok'] and r['semantic']['ok']
            r['errors'].extend('semantic: '+e for e in r['semantic']['errors'])
        if r['triggered'] and r['ok'] and not a.no_replay:
            r['replay']=replay(a.public,submission,docs,a.seconds,a.temp_root)
            r['ok']=r['ok'] and r['replay']['ok']
            if not r['replay']['ok']:r['errors'].append('replay failed: '+json.dumps(r['replay'],ensure_ascii=False))
            elif a.reconcile_checks:
                r['reconcile_checks']=run_reconcile_checks(submission,r['replay'],a.seconds)
                r['ok']=r['ok'] and r['reconcile_checks']['ok']
                if not r['reconcile_checks']['ok']:r['errors'].append('reconcile_checks failed: '+json.dumps(r['reconcile_checks'],ensure_ascii=False))
```

</details>

**依据 7 · 源码核查**：[packages/dsh-biodsh/lib/guard.js:26-48](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/guard.js#L26-L48)

回合最多步数拒绝，软硬时间处理是提示。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on('agent/pre-step', async (payload, next) => {
    if (payload?.agent && !roles.has(payload.agent)) roles.set(payload.agent, roleOf(workspaceRoot(ctx, payload.agent) || '.'));
    const role = payload?.agent ? roles.get(payload.agent) : null;
    const get = (k) => (role === 'arbiter' && k in ARBITER) ? ARBITER[k] : base(k);
    if (!get('guardEnabled')) return next();
    const step = Number(payload?.step) || 0;
    const max = get('guardMaxSteps');
    if (max > 0 && step > max) {
      dbg(`turn ${payload.turn}: step ${step} > ${max}, rejecting`);
      return { kind: 'reject' };
    }
    const decision = await next();
    try {
      if (!decision || decision.kind !== 'enter' || !payload?.agent) return decision;
      let st = state.get(payload.agent);
      if (!st || st.turn !== payload.turn) { st = { turn: payload.turn, t0: Date.now(), soft: false, hard: false }; state.set(payload.agent, st); }
      const sec = Math.round((Date.now() - st.t0) / 1000);
      let m = null;
      if (!st.hard && (step >= get('guardHardSteps') || sec >= get('guardHardSeconds'))) { st.hard = st.soft = true; m = notice(HARD(step, sec), `final answer now (${step} steps, ${sec}s)`); }
      else if (!st.soft && (step >= get('guardSoftSteps') || sec >= get('guardSoftSeconds'))) { st.soft = true; m = notice(SOFT(step, sec), `wrap up (${step} steps, ${sec}s)`); }
      if (!m) return decision;
      dbg(`turn ${payload.turn} step ${step} ${sec}s -> ${st.hard ? 'hard' : 'soft'}`);
      return { ...decision, messages: [...(decision.messages || []), m] };
```

</details>

**依据 8 · 作者声明**：[README.md:63-79](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/README.md#L63-L79)

作者基准的设计、样本和差异。

<details>
<summary>查看原文（17行）</summary>

```text
## Results

From our preprint (*arXiv link coming*). The benchmark is BioDSH-Bench-120: 120 analysis tasks in 10 subdomains, graded by replaying each submitted script against a public table contract, with no LLM judge. Every agent runs in the same read-isolated sandbox, one run per configuration.

**Same model, different agent: a tie.** With every agent on DeepSeek V4 Flash:

| Agent (DeepSeek V4 Flash) | Correct / 120 |
| --- | --- |
| BioDSH + blind second analysis | 102 |
| DeepSeek Harness without BioDSH | 101 |
| BioDSH | 98 |
| Codex CLI | 98 |
| Claude Code | 96 |

No pairwise difference is statistically significant.

**The model matters more than the agent.** With their own models, Codex ranges from 76 to 116 and Claude Code from 95 to 103. On BixBench-Verified-50, run behind a network allow-list, all four agents score 33–34/50.
```

</details>

**依据 9 · 作者声明**：[biodsh-core/skills/survival-km-cox/VALIDATION.md:5-22](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/biodsh-core/skills/survival-km-cox/VALIDATION.md#L5-L22)

作者的模拟覆盖、比较数量和容差。

<details>
<summary>查看原文（18行）</summary>

```text
## Fixtures and scope

These are generic independently generated simulations, with no benchmark questions or answers read.

- Seed 20261020: n=257, group sizes 191/66, 170 events, continuous times, independent random right censoring; 3 unequal strata, 52 clusters of up to 5 subjects crossing strata.
- Seed 20261021: n=403, group sizes 274/129, 268 events; times rounded to half-units, with tied events/censors and time-zero events; 3 unequal strata, 81 clusters crossing strata.
- Edge fixture: 8 records, follow-up at 0/1/2/3/4, tied event/censor times, a terminal risk set in which everybody fails, tau exactly on an event; additionally all-censored and all-event-at-zero curves.
- Both seeds: KM log/log-log CIs before/after administrative censoring at tau=10; independent-arm RMST and difference; 2- and 3-group log-rank with/without strata. Cox crosses both tie methods × stratified/unstratified × model/cluster covariance (16 full fits). Fixed beta=(0.23,−0.17) and beta=0 are also evaluated. Additional one-covariate and no-event-stratum Cox fits run for both tie methods and both seeds.

R settings: `coxph.control(eps=1e-12,toler.chol=1e-14,iter.max=60,timefix=FALSE)`, `nocenter=NULL` to center binary columns consistently; Python uses its default score convergence tolerance 1e-10. No point-estimate mismatch was hidden by changing the mathematical estimand.

## Comparison criterion and complete result

**1,145 array/scalar comparisons, 101,587 numeric entries, zero failures.** NaN and ±Inf masks are checked exactly, as are shapes.

For every entry we retain raw relative error `abs(P−R)/max(abs(R),1e−12)` and absolute error. The pass threshold is 1e−8 relative for `abs(R)>1e−7`, and 1e−8 absolute near zero; scaled error `abs(P−R)/max(1,abs(R))` must also be ≤1e−8. This prevents an effectively zero fitted score or a zero information entry from being judged by unstable relative division. It does not omit those entries.

Global maxima: absolute **5.002e-12**, scaled **2.826e-13**, relative on nonzero references **4.629e-12**, absolute near zero **2.826e-13**. The literal relative maximum is **0.282573**, from a fitted score whose absolute difference is only 2.826e-13; thus the literal relative-only 1e−8 goal is not met at numerical zeros, and this exception is explicit.
```

</details>

#### 缺口

- 无独立复现、目标样本统计方法审阅或用户结果。
  **影响**：不能把文件合格、稳定重放或作者基准用于结论采信。
  **进一步探讨**：以人为设置的错误单位、组标签或符号做阴性对照，并让独立脚本算参考值。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行、数据路径、模型与人工复核需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

桌面子目录 Tauri 为 1.0.0，根无 npm 包清单。安装资源包括技能、数据和 DSH；Python 环境使用 uv 准备 3.12、venv 和锁定依赖，下载和导入失败需单独修复。应用把 DSH_HOME、bioenv、workspace、logs 分置在应用根下；项目 cwd 可由用户配置。离线是路由选择，远端 DSH 配置可走远程服务，模型地址也由用户填。路由配置调用中的错误被忽略，工具可另配置 MCP，均不能由 UI 标记推断断网。退出应留输入版本、脚本、锁、日志和结果，复核传到何处。模型、复跑、临时目录和人工验证消耗未知。

#### 证据与依据

**依据 1 · 源码核查**：[desktop/src-tauri/tauri.conf.json:34-45](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/tauri.conf.json#L34-L45)

桌面分发资源和嵌入宿主。

<details>
<summary>查看原文（12行）</summary>

```text
    "category": "Medical",
    "shortDescription": "BioDSH 生信智能体桌面版",
    "resources": {
      "../resources/skills": "skills",
      "../resources/demos": "demos",
      "../resources/scripts": "scripts",
      "../resources/community-skills": "community-skills",
      "../resources/embed": "embed",
    "../resources/databases": "databases",
      "../resources/bioenv": "bioenv",
      "../dsh-runtime/node_modules": "dsh/node_modules"
    },
```

</details>

**依据 2 · 源码核查**：[desktop/src-tauri/src/paths.rs:17-34](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/paths.rs#L17-L34)

专用数据路径。

<details>
<summary>查看原文（18行）</summary>

```text
impl AppPaths {
    pub fn detect(app: &AppHandle) -> AppPaths {
        let root = strip_unc(std::env::var_os("BIODSH_HOME")
            .map(PathBuf::from)
            .unwrap_or_else(|| app.path().home_dir().expect("home dir").join("BioDSH")));
        let dsh_home = root.join("dsh-home");
        let p = AppPaths {
            skills: dsh_home.join("skills"),
            bioenv: root.join("bioenv"),
            workspace: root.join("workspace"),
            logs: root.join("logs"),
            dsh_home,
            root,
        };
        for d in [&p.root, &p.dsh_home, &p.bioenv, &p.workspace, &p.skills, &p.logs] {
            let _ = std::fs::create_dir_all(d);
        }
        p
```

</details>

**依据 3 · 源码核查**：[desktop/src-tauri/src/pyenv.rs:111-129](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/pyenv.rs#L111-L129)

安装 Python、创建 venv 并锁定依赖。

<details>
<summary>查看原文（19行）</summary>

```text
    pub fn install(&self, app: &AppHandle, paths: &AppPaths, china: bool) -> EnvStatus {
        { let mut r = self.running.lock().unwrap(); if *r { return self.status.lock().unwrap().clone(); } *r = true; }
        let result = (|| -> Result<(), String> {
            if !uv_binary(app).exists() { return Err(format!("找不到 uv：{}", uv_binary(app).display())); }
            fs::create_dir_all(&paths.bioenv).map_err(|e| e.to_string())?;
            for f in ["pyproject.toml", "uv.lock"] {
                fs::copy(resource(app, "bioenv").join(f), paths.bioenv.join(f)).map_err(|e| format!("复制 {f} 失败：{e}"))?;
            }
            let env = self.uv_env(paths, china);
            self.set(app, |s| { s.ready = false; s.step = "python".into(); s.message = "正在下载 Python 3.12…".into(); s.progress = 0.05; s.log.clear(); });
            self.run(app, paths, &["python", "install", "3.12"], &env, &mut |_| {}).map_err(|_| "Python 下载失败，请检查网络后重试".to_string())?;
            self.set(app, |s| { s.step = "venv".into(); s.message = "正在创建虚拟环境…".into(); s.progress = 0.2; });
            let venv = paths.bioenv.join(".venv").to_string_lossy().to_string();
            self.run(app, paths, &["venv", "--python", "3.12", "--allow-existing", &venv], &env, &mut |_| {}).map_err(|_| "创建虚拟环境失败".to_string())?;
            self.set(app, |s| { s.step = "packages".into(); s.message = "正在安装分析软件包（scanpy 等，约需几分钟）…".into(); s.progress = 0.3; });
            let mut n: f64 = 0.0;
            let app2 = app.clone();
            let status = &self.status;
            self.run(app, paths, &["sync", "--frozen", "--python", "3.12"], &env, &mut |l| {
```

</details>

**依据 4 · 源码核查**：[desktop/src-tauri/src/lib.rs:284-321](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/lib.rs#L284-L321)

离线设置可走已配置远端 DSH。

<details>
<summary>查看原文（38行）</summary>

```text
async fn dsh_start(app: AppHandle, state: State<'_, AppState>) -> Result<dsh::DshStatus, String> {
    let (d, paths, ws) = (Arc::clone(&state.dsh), state.paths.clone(), workspace_of(&state));
    let app2 = app.clone();
    let ws2 = ws.clone();
    let (offline, offline_key, remote) = {
        let st = state.settings.lock().unwrap();
        dsh::set_theme(&state.paths, &st.theme);
        dsh::set_locale(&state.paths, &st.language);
        let offline = st.mode == "offline";
        dsh::set_llm_override(&state.paths);
        (offline, st.offline_api_key.clone(), st.remote_dsh_url.trim().to_string())
    };
    let offline_route = {
        let st = state.settings.lock().unwrap();
        (offline && !st.offline_base_url.trim().is_empty()).then(|| (st.offline_base_url.trim().to_string(), st.offline_model.trim().to_string(), st.offline_api_key.clone()))
    };
    let (extra_env, mcp, seed_demos) = {
        let st = state.settings.lock().unwrap();
        let env = vec![
            ("BIODSH_FILES_URL".to_string(), state.files.as_ref().map(|f| f.base_url()).unwrap_or_default()),
            ("BIODSH_IMAGE_BASE_URL".to_string(), st.image_base_url.clone()),
            ("BIODSH_IMAGE_API_KEY".to_string(), st.image_api_key.clone()),
            ("BIODSH_IMAGE_MODEL".to_string(), st.image_model.clone()),
            ("BIODSH_REFDATA".to_string(), refdata::dir(&state.paths).to_string_lossy().to_string()),
        ];
        // 技能精选默认跟随智能体当前的模型路由(dsh-biodsh),离线模式无需另配。
        (env, st.mcp_servers.clone(), !st.demos_seeded)
    };
    // 离线模式 + 配置了远程服务器：不在本机启动，直接连服务器上的 dsh
    if offline && !remote.is_empty() {
        let mut s = state.dsh.status.lock().unwrap();
        s.state = "running".into();
        s.url = Some(remote.clone());
        s.log.push(format!("[remote] using {remote}"));
        drop(s);
        let st2 = state.inner();
        ensure_dsh_view(&app, st2, &remote);
        return Ok(state.dsh.status.lock().unwrap().clone());
```

</details>

**依据 5 · 源码核查**：[desktop/src-tauri/src/lib.rs:718-743](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/lib.rs#L718-L743)

可选模型路由写入，未强制传播写错误。

<details>
<summary>查看原文（26行）</summary>

```text
fn sync_offline_route(url: &str, offline: Option<(String, String, String)>) {
    use serde_json::json;
    let Ok(desc) = dsh_args(url, "settings/describe", json!({})) else { return };
    let ns = |name: &str| desc.get("namespaces").and_then(|v| v.as_array()).and_then(|a| a.iter().find(|n| n.get("ns").and_then(|x| x.as_str()) == Some(name)).cloned());
    let rev = |n: &Option<serde_json::Value>| n.as_ref().and_then(|v| v.get("revision")).cloned().unwrap_or(serde_json::Value::Null);
    let (pi, adm) = (ns("llm-pi-ai"), ns("agent-default-model"));
    let has_route = pi.as_ref().and_then(|v| v.pointer(&format!("/user/providers/{}", dsh::OFFLINE_PROVIDER))).is_some();
    let default_is_offline = adm.as_ref().and_then(|v| v.pointer("/value/provider")).and_then(|x| x.as_str()) == Some(dsh::OFFLINE_PROVIDER);
    match offline {
        Some((base, model, key)) => {
            let mut route = json!({ "displayName": "本地/内网模型", "api": "openai-completions", "baseURL": base, "apiKeyEnv": "BIODSH_OFFLINE_KEY" });
            if !model.is_empty() { route["models"] = json!([{ "id": model, "name": model }]); }
            let _ = dsh_args(url, "credentials/set", json!({ "ref": "BIODSH_OFFLINE_KEY", "value": if key.trim().is_empty() { "local".to_string() } else { key.trim().to_string() } }));
            let _ = dsh_args(url, "settings/mutate", json!({ "ns": "llm-pi-ai", "ops": [{ "op": "set", "path": ["providers", dsh::OFFLINE_PROVIDER], "value": route }], "expectedRevision": rev(&pi) }));
            if !model.is_empty() {
                let _ = dsh_args(url, "settings/mutate", json!({ "ns": "agent-default-model", "ops": [
                    { "op": "set", "path": ["provider"], "value": dsh::OFFLINE_PROVIDER }, { "op": "set", "path": ["model"], "value": model }, { "op": "unset", "path": ["reasoningEffort"] }], "expectedRevision": rev(&adm) }));
            }
        }
        None => {
            if has_route { let _ = dsh_args(url, "settings/mutate", json!({ "ns": "llm-pi-ai", "ops": [{ "op": "unset", "path": ["providers", dsh::OFFLINE_PROVIDER] }], "expectedRevision": rev(&pi) })); }
            if default_is_offline {
                let _ = dsh_args(url, "settings/mutate", json!({ "ns": "agent-default-model", "ops": [
                    { "op": "set", "path": ["provider"], "value": "deepseek-official" }, { "op": "set", "path": ["model"], "value": dsh::DEFAULT_ONLINE_MODEL }, { "op": "set", "path": ["reasoningEffort"], "value": "high" }], "expectedRevision": rev(&adm) }));
            }
        }
```

</details>

**依据 6 · 源码核查**：[desktop/src-tauri/src/dsh.rs:203-219](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src-tauri/src/dsh.rs#L203-L219)

允许配置外部 MCP 调用。

<details>
<summary>查看原文（17行）</summary>

```text
        inserts.push("    - id: auto-review\n      name: '@deepseek-ai/dsh-experimental-auto-review'".into());
        // 每个 MCP 服务一个 dsh-mcp-client 实例(工具名 mcp__<name>__<tool>);字段按 insert 的两层缩进(6/8 空格)。
        for m in mcp.iter().filter(|m| m.enabled != Some(false)) {
            let name: String = m.name.chars().filter(|c| c.is_ascii_alphanumeric() || *c == '_' || *c == '-').take(32).collect();
            if name.is_empty() { continue; }
            let mut y = format!("    - id: mcp-{name}\n      name: '@deepseek-ai/dsh-mcp-client'\n      config:\n        serverName: {name}\n");
            if m.transport == "streamable-http" {
                if m.url.trim().is_empty() { continue; }
                y.push_str(&format!("        transport: streamable-http\n        url: {}\n", yaml_str(m.url.trim())));
            } else {
                if m.command.trim().is_empty() { continue; }
                y.push_str(&format!("        transport: stdio\n        command: {}\n", yaml_str(m.command.trim())));
                if !m.args.is_empty() { y.push_str(&format!("        args: [{}]\n", m.args.iter().map(|a| yaml_str(a)).collect::<Vec<_>>().join(", "))); }
                if !m.env.is_empty() { y.push_str("        env:\n"); for (k, v) in &m.env { y.push_str(&format!("          {k}: {}\n", yaml_str(v))); } }
            }
            y.push_str("        failOnStartupError: false");
            inserts.push(y.trim_end().to_string());
```

</details>

**依据 7 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:203-214](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L203-L214)

复跑会保留带输入副本的临时目录。

<details>
<summary>查看原文（12行）</summary>

```text
def replay(public,submission,docs,seconds=120,temp_root=None):
    start=time.monotonic();root=Path(tempfile.mkdtemp(prefix='v13_delivery_',dir=temp_root))
    # Retain evidence; no deletion of user files or prior replay artifacts.
    inp=root/'inputs';out=root/'out';out.mkdir();cwd=root/'cwd';cwd.mkdir()
    result={'ok':False,'root':str(root),'seconds':None}
    try:
        source=safe_path(submission,'analysis.py')
        if not source.is_file():raise ValueError('analysis.py missing')
        shutil.copy2(source,root/'submitted.py')
        source_inputs=Path(public)/'inputs'
        if any(p.is_symlink() for p in source_inputs.rglob('*')):raise ValueError('input symlink unsupported')
        shutil.copytree(source_inputs,inp)
```

</details>

#### 缺口

- 真实网络、数据清理、时间和费用未确认。
  **影响**：不能把离线标签当作数据隔离或资金承诺。
  **进一步探讨**：用隔离合成样本记录进程、出站、临时目录和版本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样用合成数据验收复跑和失败交付？

**研究主题**：新假设与验证、采用判断

#### 完整回答

准备一份虚构表、固定输入摘要和独立参考脚本，预先声明行键、度量单位和期望输出。比较手工脚本与桌面路径，在正常、缺合同、合同变化、有文件但数值错误及重放失败时分别记录 UI 状态、交付 receipt 和参考差异。假设把‘合同适用、复跑一致、独立对照通过’分开记录，可以降低将界面完成当成正确分析的次数。若数据范围、失败类型或数值对照不明，就停止交付并回到人工审阅。

#### 证据与依据

**依据 1 · 源码核查**：[desktop/src/renderer/src/views/ChatView.tsx:48-59](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/desktop/src/renderer/src/views/ChatView.tsx#L48-L59)

界面有结束和审阅入口，提示仍要核对。

<details>
<summary>查看原文（12行）</summary>

```text
          {taskMeta && !taskMeta.blank && <>
            <button className="btn btn-ghost" onClick={review} disabled={busyTask} title={busyTask ? t('任务运行中，结束后再审阅') : undefined}><BioIcon name="ui-review" size={15} />{t('审阅结论')}</button>
            <button className="btn btn-line" onClick={toPipeline} disabled={busyTask}><BioIcon name="ui-save-workflow" size={15} />{t('存为工作流')}</button>
          </>}
          <button className="icon-btn" title={t('重新加载对话区')} aria-label={t('重新加载对话区')} onClick={() => window.biodsh.dshReload()}><RefreshCw size={14} /></button>
          <button className="icon-btn" title={t('重启智能体')} aria-label={t('重启智能体')} onClick={() => restartDsh()}><RotateCcw size={14} /></button>
        </>
      }>
        {taskMeta ? <>
          <span className="truncate" style={{ maxWidth: 220 }}>{taskMeta.project}</span><span>/</span>
          <span className="cur">{taskMeta.title}</span>
          <span className={`pill ${taskMeta.running ? 'pill-run' : 'pill-off'}`} title={!taskMeta.running && !taskMeta.blank ? t('任务已停止运行；结论是否正确请用「审阅结论」核对') : undefined}>{taskMeta.running ? t('运行中') : taskMeta.blank ? t('新任务') : t('已结束')}</span>
```

</details>

**依据 2 · 源码核查**：[packages/dsh-biodsh/lib/delivery.js:72-96](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery.js#L72-L96)

有无合同及校验结果可观察。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.on('agent/turn-stopping',async({agent,turn,signal})=>{
    if (!get('deliveryEnabled')) return;
    const st=states.get(agent);
    if (!st || st.turn!==turn || (!st.error && !Object.keys(st.docs).length))return;
    let result;
    try {
      if(st.error)throw new Error(st.error);
      if(st.semantic?.error)throw new Error(st.semantic.error);
      if(st.semantic?.applicable)observePlan(st.root,st.semantic,'turn-stopping');
      result=await check(st.root,st.docs,{python:get('deliveryPython') || process.env.BIODSH_PYTHON || 'python3',
        args:get('deliveryPythonArgs') || [],seconds:get('deliveryReplaySeconds'),reconcileChecks:get('reconcileChecks') || st.role==='arbiter',semantic:st.semantic?.applicable ? st.semantic : null},signal);
      if(result.ok && st.semantic && get('coverageReviewEnabled')){
        result.coverage_review=await reviewCoverage(ctx,agent,st.root,st.docs,st.semantic,result,{python:get('deliveryPython')||process.env.BIODSH_PYTHON||'python3',args:get('deliveryPythonArgs')||[]},signal);
        if(!result.coverage_review.ok){result.ok=false;result.errors.push('Independent public-contract coverage review requires repair: '+JSON.stringify({issues:result.coverage_review.issues,uncertain_columns:result.coverage_review.uncertain_columns,error:result.coverage_review.error}));}
      }
    } catch(e) {
      if(signal?.aborted)throw e;
      result={ok:false,errors:[String(e)],infrastructureError:true};
    }
    const reviewError=Boolean(result.coverage_review?.error);
    if(reviewError)result.infrastructureError=true;
    const exhausted=!result.ok && (reviewError || st.repairs>=get('deliveryMaxRepairs'));
    const receipt={...result,turn,recorded_at:new Date().toISOString(),repairs:st.repairs,semantic_applicable:st.semantic?.applicable ?? false,semantic_source_manifest:st.semantic?.public_files ?? {},semantic_plan_history:st.semantic?.plan_history ?? [],status:result.ok?'accepted':exhausted?'rejected':'repair-required'};
    fs.appendFileSync(path.join(st.root,'.biodsh-delivery-events.jsonl'),JSON.stringify(receipt)+'\n');
    fs.writeFileSync(path.join(st.root,'.biodsh-delivery.json'),JSON.stringify(receipt,null,2));
```

</details>

**依据 3 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:288-304](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L288-L304)

合同变化、重放和语义分支。

<details>
<summary>查看原文（17行）</summary>

```text
        docs=contracts(a.public);semantic=None
        if a.snapshot_stdin:
            snapshot=json.load(sys.stdin)
            if snapshot.get('__biodsh_snapshot_version')==14:
                semantic=snapshot['semantic'];snapshot=snapshot['contracts']
            if docs!=snapshot:raise ValueError('public contract changed after session start')
            docs=snapshot
        submission=a.submission or str(Path(a.public)/'submission')
        r=validate(a.public,submission,docs)
        if semantic is not None:
            r['semantic']=check_semantics(a.public,submission,semantic,table_specs(docs)[0])
            r['ok']=r['ok'] and r['semantic']['ok']
            r['errors'].extend('semantic: '+e for e in r['semantic']['errors'])
        if r['triggered'] and r['ok'] and not a.no_replay:
            r['replay']=replay(a.public,submission,docs,a.seconds,a.temp_root)
            r['ok']=r['ok'] and r['replay']['ok']
            if not r['replay']['ok']:r['errors'].append('replay failed: '+json.dumps(r['replay'],ensure_ascii=False))
```

</details>

**依据 4 · 源码核查**：[packages/dsh-biodsh/lib/delivery_check.py:142-169](https://github.com/sagirimo/BioDSH/blob/77f5b17f0a9e8ad25428cb2a5688f5bdf6847ef3/packages/dsh-biodsh/lib/delivery_check.py#L142-L169)

输出声明能用已知错误构造反例。

<details>
<summary>查看原文（28行）</summary>

```text
        except (OSError,ValueError):errors.append(name+': missing or invalid JSON')
    if 'CLAIMS.json' in docs:
        try:
            c=read_json(safe_path(submission,'interpretation_claims.json'))
            if not isinstance(c,dict) or set(c)!={'schema_version','claims','narrative'}:raise ValueError('expected schema_version, claims, narrative object')
            if type(c['schema_version']) is not int or c['schema_version']!=2:raise ValueError('schema_version must be integer 2')
            if not isinstance(c['narrative'],str) or not c['narrative'].strip():raise ValueError('narrative must be nonempty')
            declarations=docs['CLAIMS.json']['claims']
            if not isinstance(c['claims'],dict) or set(c['claims'])!={s['id'] for s in declarations}:raise ValueError('claims exact key set mismatch')
            for s in declarations:
                name=s['id'];v=c['claims'][name];typ=s['type']
                if typ=='number':
                    if type(v) not in (int,float) or not math.isfinite(v):errors.append('claim '+name+': expected finite number');continue
                    if 'binding' in s:
                        try:
                            n=binding_value(s['binding'],loaded)
                            if not math.isclose(v,n,rel_tol=s.get('rel_tol',0),abs_tol=s.get('abs_tol',0)):errors.append('claim '+name+': table binding mismatch')
                        except (ValueError,KeyError,TypeError):errors.append('claim '+name+': invalid table binding')
                elif typ in ('derived','choice'):
                    if not isinstance(v,str) or v not in s.get('options',[]):errors.append('claim '+name+': not a declared option')
                    if typ=='derived' and 'rule' in s:
                        rule=s['rule'];ops={'lt':operator.lt,'le':operator.le,'gt':operator.gt,'ge':operator.ge,'eq':operator.eq,'ne':operator.ne}
                        try:
                            flag=ops[rule['op']](binding_value(rule['binding'],loaded),rule['threshold'])
                            if v!=rule['outcomes'][str(flag).lower()]:errors.append('claim '+name+': public derived rule mismatch')
                        except (ValueError,KeyError,TypeError):errors.append('claim '+name+': unsupported or invalid public rule')
                else:errors.append('claim '+name+': unsupported type')
        except (OSError,ValueError,KeyError,TypeError) as e:errors.append('interpretation_claims.json: '+str(e))
```

</details>

#### 缺口

- 分层状态显示尚未试验。
  **影响**：是否减少审核错误和人工负担待测。
  **进一步探讨**：用合成反例盲评，记录结果正确和证据等级判断。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
