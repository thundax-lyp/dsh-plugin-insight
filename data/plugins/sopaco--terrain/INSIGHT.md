# Terrain

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ff51104](https://github.com/sopaco/terrain/tree/ff51104e4057815b8406df953833191b720203d0)

<!-- BEGIN META -->
[![GitHub ★ 274](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=274&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sopaco/terrain)
<!-- END META -->

> **功能**：独立桌面与CLI将仓库知识、Agent工具和Git漂移组织到一起；文档完整、资料同步和回答正确是不同判据，Ask还可自动准备并写知识资产。

> **亮点**：仓库资料共址、增量/skip和分层漂移信任、GUI与真实检索工具组合；独立能力主表、步骤见Q01，结果边界见[Q02](#research-q02)。

> **主要限制**：完整/新鲜不等语义正确；无freshness和ledger时预载默许，Ask可写知识/调模型，Hybrid异常fallback不证明未写，见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · Terrain对象与知识生成的真实桌面活动链是什么？](#detail-section-11)
  - [Q02 · 生成完整性和Freshness到底证明什么，失败如何显示？](#detail-section-12)
  - [Q03 · Ask是否真实消费知识/工具并返回UI，查询有什么隐藏准备成本？](#detail-section-13)
  - [Q04 · 环境集成依赖与首次、持续、失败和退出成本是什么？](#detail-section-14)
  - [Q05 · 哪些生产方向尚可检验，怎样不重复现有freshness/增量机制？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：仓库维护者和编码Agent复用架构/源索引、查证变更影响；需求强度与相对手写文档收益待核，见[Q01](#research-q01)。

现有AGENTS.md/手写架构文档+Git diff/grep和通用编码Agent；模型/ADK/ACP既有能力不计新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 仓库scan/pack | 生成源码索引/项目材料 | feature/同步状态影响是否打包，不等全产品离线 |
| Human知识生成 | 产出架构/深探索文档 | ACP/native及Skill，full会清旧，文件集完整不等正确 |
| Agent context更新 | 增量或全量维护上下文 | 最低结构/字数与基线，不是事实验收 |
| Freshness | 显示分层Git漂移/年龄信任 | 启发式分数，未知预载分支另核 |
| DeepWiki Ask | 将问题交模型与工具并回回答 | 缺/旧资产可先写/生成，建engine失败搜索降级 |
| search_knowledge | 搜文档并回JSON | 实际KnowledgeSearch，命中不证明回答事实 |
| read_doc/pack grep/read | 为模型读取文档/源码包片段 | 版本/路径/引用仍需对真实仓复核 |
| read_agent_context | 按节读上下文 | ensure_ready可能生成，不能统称纯读 |
| 来源引用 | 返回路径/行及可查看来源 | 正则解析不等存在/语义已核 |
| 环境apply | 部署选定工具/Skill/约定 | 命令真实执行、可部分失败，非全量事务/卸载保证 |

**流程与依赖**

成品/CLI、可读写项目目录/磁盘，Git为漂移/基线/相应增量条件，与所选ACP/native后端、按需Skill/工具各自约束；完整四列表见[Q04](#research-q04)。

选择仓库→scan/pack→选后端生成/增量/skip→文件集检查→事件/UI；Ask会准备资产并检索；完整步骤表见[Q01](#research-q01)。

**效果与成本**

首次固定版本/副本与后端；持续/Ask生成有资源，失败部分安装和全量清旧需保全，退出撤规则/工具按差异处理；现金/人工四阶段表见[Q04](#research-q04)。

已有完整性/同步/指标和引文返回能使资料状态可见，不等事实正确或已节时；四项效果表见[Q02](#research-q02)。

> **思考**：完整/新鲜不等语义正确；无freshness和ledger时预载默许，Ask可写知识/调模型，Hybrid异常fallback不证明未写，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：仓库资料共址、增量/skip和分层漂移信任、GUI与真实检索工具组合；独立能力主表、步骤见Q01，结果边界见[Q02](#research-q02)。

保留缺基线降信任、文档集/最低结构报错、事件与部分错误可见；同步启发式和未知预载/输入树边界须单独核，不许文档数量当结果，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

完整/新鲜不等语义正确；无freshness和ledger时预载默许，Ask可写知识/调模型，Hybrid异常fallback不证明未写，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

复制允许处理的仓库，先生成少量知识并核源码定位/更新；明确接受Ask准备写入及模型路由，环境安装另按选择评估，见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源闭合桌面真实生成/事件消费、完整性/Freshness判据、Ask真实工具与自动资产准备、env命令执行。未运行或验发布物/真实问答，不全审大工程/外部SDK；限副本及允许模型/知识写入的试用。

- 已检查：作者 README、包清单、源码路径 Cargo.toml、crates/terrain-agent/Cargo.toml、crates/terrain-agent/src/agent_assets.rs、crates/terrain-agent/src/agent_context.rs、crates/terrain-agent/src/builder.rs、crates/terrain-agent/src/chat/mod.rs、crates/terrain-agent/src/chat/native.rs、crates/terrain-agent/src/chat/prompt.rs、crates/terrain-agent/src/litho.rs、crates/terrain-agent/src/runtime.rs、crates/terrain-agent/src/tools.rs、crates/terrain-agent/src/workflows/ask.rs、crates/terrain-agent/src/workflows/quick_refresh.rs、crates/terrain-core/src/assets/agent_context.rs、crates/terrain-core/src/assets/env/apply.rs、crates/terrain-core/src/assets/litho.rs、crates/terrain-core/src/citations.rs、crates/terrain-core/src/freshness/compute.rs、crates/terrain-core/src/freshness/mod.rs、crates/terrain-core/src/freshness/scoring.rs、crates/terrain-core/src/paths.rs、crates/terrain-core/src/repo.rs、package.json、src-tauri/Cargo.toml、src-tauri/src/commands/assets.rs、src-tauri/src/commands/util.rs、src-tauri/src/commands/workflows.rs、src-tauri/src/lib.rs、src-tauri/tauri.conf.json、src/App.svelte、src/lib/api.ts、src/lib/components/DeepWikiPanel.svelte、src/main.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计仅Markdown/TS/JS/MJS列项，未计核心Rust与Svelte，不代表全工程代码量，不补造数量。固定材料摘要/身份版本已核；当前根对象无正式旧研究。检查真实Tauri/前端消费者、生成dispatch/文件判据、分层freshness/预载、Ask/FunctionTool/citation/自动写与env执行。未运行/装包/调用模型、未全审所有SDD/外部SDK内部循环、目录权限/下载脱敏/平台退出或安全。
- 下一步：复制仓库核正确/故错文档与真实源码、缺基线/无ledger、同提交/增量/并发变化、Ask自动写和部分安装；相对现有grep的错误与总投入另测，见[Q05](#research-q05)。

**分析版本**

- **仓库**：[sopaco/terrain](https://github.com/sopaco/terrain)
- **版本号**：0.9.8（Rust workspace/Tauri应用；私有前端package为0.9.7）（[固定提交 ff51104](https://github.com/sopaco/terrain/tree/ff51104e4057815b8406df953833191b720203d0)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

超出现有Git分层指标与正则引用，检验固定树的关键架构命题和变更反证；独立任务/指标/停止条件见[Q05](#research-q05)。

复制仓库核正确/故错文档与真实源码、缺基线/无ledger、同提交/增量/并发变化、Ask自动写和部分安装；相对现有grep的错误与总投入另测，见[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

本表仅覆盖Markdown/TS/JS/MJS，未计核心Rust与Svelte，不代表全部工程代码量。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 75 | 12236 | — | — | 111525 |
| .ts | source | 154 | 5551 | 4671 | 446 | — |
| .js | source | 3 | 73 | 68 | 2 | — |
| .mjs | source | 5 | 223 | 189 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sopaco/terrain/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/sopaco/terrain/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/sopaco/terrain/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核固定源码的知识生成/同步/提问直接活动与采用失败、成本和可证伪方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Terrain对象与知识生成的真实桌面活动链是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Terrain是独立Tauri/Svelte桌面客户端、Rust核心和CLI的仓库工程环境，不是一个可直接当DSH bundle安装的根插件。Rust workspace/App crate及Tauri应用配置为0.9.8，私有前端package仍0.9.7，分别记录，不当线上统一版本。面向维护代码仓库与编码Agent的人，把源码包、架构知识、统一Agent约定/工具环境组织到repo/.terrain；场景具体，真实团队采用及相对手写AGENTS.md/文档+grep的收益未知。

真实前端main mount App；App调用runLithoGeneration，API invoke run_litho_generation_cmd，Tauri注册该command；command验证repo、取模型/ACP/knowledge设置，调用run_litho_generation，progress/done发回App更新项目状态。不是只看export或README截图。生成调度可用ACP strict、hybrid或native；本轮核dispatch到相应prompt函数与文件检查，没有展开所有外部ACP/ADK实现。FullRebuild明确清旧human与research工作区；已有完整集则进入incremental-or-skip，不能把“增量”理解为每次都零模型或不写已有文档。Agent写知识，不是此客户端已保证实际软件开发任务完成。

| 步骤 | 执行者与动作 | 结果/失败 |
|---|---|---|
| 选择仓库/启动 | GUI App或Rust CLI，解析repo与设置 | 数据目录是仓库.terrain，不是根DSH preset |
| 扫描/打包 | quick refresh调ProjectScanner.scan_repo | pack是否启用/同步会形成notes，不同于生成文档 |
| 生成/更新 | 后端选ACP/native、完整或增量/skip | 缺Skill/后端失败、无文档/不完整会报错 |
| 回显 | command发litho-progress/done，App消费数量/complete | complete文件集不是架构内容正确 |
| 提问/核源 | DeepWiki→Ask/tools，查看回答/引用 | 会自动准备缺/旧资产，成本/写入见Q03 |

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:1-16](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/Cargo.toml#L1-L16)

workspace真实对象/0.9.8/Rust要求。

<details>
<summary>查看原文（16行）</summary>

```text
[workspace]
resolver = "2"
members = [
    "crates/terrain-core",
    "crates/terrain-agent",
    "crates/terrain-cli",
    "crates/terrain-ts-export",
    "src-tauri",
]

[workspace.package]
version = "0.9.8"
edition = "2024"
license = "MIT"
rust-version = "1.94"

```

</details>

**依据 2 · 源码核查**：[src-tauri/Cargo.toml:1-17](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src-tauri/Cargo.toml#L1-L17)

独立桌面crate继承workspace。

<details>
<summary>查看原文（17行）</summary>

```text
[package]
name = "terrain"
version.workspace = true
edition.workspace = true
license.workspace = true
rust-version.workspace = true
description = "Terrain desktop application"

[lib]
name = "terrain_lib"
crate-type = ["lib", "cdylib", "staticlib"]

[[bin]]
name = "terrain-app"
path = "src/main.rs"

[build-dependencies]
```

</details>

**依据 3 · 源码核查**：[src-tauri/tauri.conf.json:1-10](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src-tauri/tauri.conf.json#L1-L10)

Tauri应用版本0.9.8与frontendDist。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Terrain",
  "version": "0.9.8",
  "identifier": "com.terrain.app",
  "build": {
    "beforeDevCommand": "bun run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "bun run build",
    "frontendDist": "../dist"
```

</details>

**依据 4 · 源码核查**：[package.json:1-16](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/package.json#L1-L16)

私有前端0.9.7不当应用统一版本。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "terrain",
  "private": true,
  "version": "0.9.7",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:app": "tauri dev",
    "build": "vite build",
    "build:app": "tauri build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "check:i18n": "bun run scripts/check-i18n-parity.ts",
    "gen:types": "cargo run -p terrain-ts-export --bin export-ts-types",
    "tauri": "tauri"
  },
```

</details>

**依据 5 · 源码核查**：[src/main.ts:1-27](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src/main.ts#L1-L27)

真实App mount入口。

<details>
<summary>查看原文（27行）</summary>

```text
import "./app.css";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { mount } from "svelte";
import App from "./App.svelte";
import UsageWindow from "./UsageWindow.svelte";
import { loadAppBootstrap } from "./lib/appBootstrap";
import { applyLocale } from "./lib/i18n";

const target = document.getElementById("app")!;

async function bootstrap() {
  try {
    const boot = await loadAppBootstrap();
    applyLocale(boot.model_settings.language);
  } catch {
    applyLocale("system");
  }

  const label = getCurrentWindow().label;
  if (label === "usage") {
    mount(UsageWindow, { target });
    return;
  }
  mount(App, { target });
}

void bootstrap();
```

</details>

**依据 6 · 源码核查**：[src/App.svelte:840-858](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src/App.svelte#L840-L858)

当前界面实际触发生成。

<details>
<summary>查看原文（19行）</summary>

```text
                ? forceRefresh
                : (project.projectOverview?.litho.human_docs_complete ??
                  false);
        setProjectTask(slug, {
            lithoBusy: true,
            lithoProgress: force
                ? t("app.status.regeneratingHuman", {
                      term: t("terms.humanKnowledge"),
                  })
                : t("app.status.generatingHuman", {
                      term: t("terms.humanKnowledge"),
                  }),
        });
        try {
            await runLithoGeneration(project.selectedRepoPath, slug, force);
        } catch (e) {
            setErrorStatus(e);
            setProjectTask(slug, { lithoBusy: false, lithoProgress: "" });
        }
```

</details>

**依据 7 · 源码核查**：[src/App.svelte:1044-1078](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src/App.svelte#L1044-L1078)

实际监听progress/done并消费complete/数量。

<details>
<summary>查看原文（35行）</summary>

```text
                project_slug: string;
                stage: string;
                message: string;
            }>("litho-progress", (ev) => {
                const { project_slug, stage, message } = ev.payload;
                const label = `[${stage}] ${message}`;
                setProjectTask(project_slug, { lithoProgress: label });
            });
            unlistenDone = await listen<{
                project_slug: string;
                result: {
                    human_doc_count: number;
                    human_docs_complete: boolean;
                };
            }>("litho-done", async (ev) => {
                const { project_slug, result } = ev.payload;
                setProjectTask(project_slug, {
                    lithoBusy: false,
                    lithoProgress: "",
                });
                const count = result.human_doc_count;
                const complete = result.human_docs_complete;
                const msg = !complete
                    ? count === 0
                        ? t("app.status.lithoDoneNoDocs", {
                              term: t("terms.humanKnowledge"),
                              slug: project_slug,
                          })
                        : t("app.status.lithoIncompleteWithCount", {
                              term: t("terms.humanKnowledge"),
                              slug: project_slug,
                              count,
                          })
                    : t("app.status.lithoReady", {
                          term: t("terms.humanKnowledge"),
```

</details>

**依据 8 · 源码核查**：[src/lib/api.ts:64-86](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src/lib/api.ts#L64-L86)

API到实际invoke command。

<details>
<summary>查看原文（23行）</summary>

```text
export const generateHumanDocs = (repoPath: string, projectSlug?: string) =>
  invoke<LithoGenerationJob>("generate_human_docs_cmd", {
    repoPath,
    projectSlug: projectSlug || null,
  });

export const runLithoGeneration = (
  repoPath: string,
  projectSlug?: string,
  forceRefresh = false,
) =>
  invoke<void>("run_litho_generation_cmd", {
    repoPath,
    projectSlug: projectSlug || null,
    forceRefresh,
  });

export const checkLlm = () => invoke<LlmStatus>("check_llm");

/** Real network probe: one minimal request against the configured endpoint. */
export const testLlm = () => invoke<LlmStatus>("test_llm_cmd");

/** Model ids served by the provider endpoint (sorted alphabetically). */
```

</details>

**依据 9 · 源码核查**：[src-tauri/src/lib.rs:56-98](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src-tauri/src/lib.rs#L56-L98)

注册知识/生成/Ask等commands。

<details>
<summary>查看原文（43行）</summary>

```text
        .invoke_handler(tauri::generate_handler![
            commands::get_knowledge_root,
            commands::list_projects,
            commands::scan_project,
            commands::search_knowledge,
            commands::read_document,
            commands::bootstrap_app,
            commands::check_acp,
            commands::check_opencode,
            commands::acp_spawn_command_cmd,
            commands::check_llm,
            commands::test_llm_cmd,
            commands::list_provider_models_cmd,
            commands::get_model_settings,
            commands::save_model_settings_cmd,
            commands::copy_image_to_clipboard,
            commands::copy_text_to_clipboard,
            commands::save_png_files,
            commands::pack_agent_assets_cmd,
            commands::compute_freshness_cmd,
            commands::read_project_freshness_cached_cmd,
            commands::run_quick_refresh_cmd,
            commands::plan_litho_cmd,
            commands::plan_assets_cmd,
            commands::list_human_docs_cmd,
            commands::read_source_slice_cmd,
            commands::resolve_source_citation_cmd,
            commands::open_repo_folder_cmd,
            commands::generate_human_docs_cmd,
            commands::run_litho_generation_cmd,
            commands::get_project_overview_cmd,
            commands::save_project_remark_cmd,
            commands::get_sdd_status_cmd,
            commands::create_sdd_session_cmd,
            commands::set_active_sdd_session_cmd,
            commands::delete_sdd_session_cmd,
            commands::save_sdd_output_cmd,
            commands::remove_project_cmd,
            commands::initialize_project_cmd,
            commands::list_registry_projects_cmd,
            commands::run_sdd_phase_cmd,
            commands::run_agent_context_generation_cmd,
            commands::ask_knowledge_cmd,
```

</details>

**依据 10 · 源码核查**：[src-tauri/src/commands/assets.rs:79-123](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src-tauri/src/commands/assets.rs#L79-L123)

实际调用生成并向UI发事件。

<details>
<summary>查看原文（45行）</summary>

```text
pub async fn run_litho_generation_cmd(
    app: AppHandle,
    state: State<'_, AppState>,
    repo_path: String,
    project_slug: Option<String>,
    force_refresh: Option<bool>,
) -> Result<(), String> {
    validate_repo(&repo_path)?;
    let slug = project_slug.unwrap_or_else(|| slugify_repo(&repo_path));
    let paths = state.paths().clone();

    let emit_progress = |p: LithoProgress| {
        let _ = app.emit(
            "litho-progress",
            LithoProgressPayload {
                project_slug: slug.clone(),
                stage: p.stage,
                message: p.message,
            },
        );
    };

    let acp = resolved_acp_settings();
    let model_config = state.model_config();
    // `force_refresh` is the UI's 「重新生成」 — an explicit rebuild bypasses incremental update.
    let result = run_litho_generation(
        &paths,
        &slug,
        &repo_path,
        &acp,
        &model_config,
        &resolved_knowledge_settings(),
        LithoRunMode::from_force_refresh(force_refresh.unwrap_or(false)),
        emit_progress,
    )
    .await
    .map_err(|e| e.to_string())?;

    app.emit(
        "litho-done",
        LithoDonePayload {
            project_slug: slug,
            result,
        },
    )
```

</details>

**依据 11 · 源码核查**：[crates/terrain-agent/src/litho.rs:721-759](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/litho.rs#L721-L759)

实际生成入口、缺skill、full清除/增量选择。

<details>
<summary>查看原文（39行）</summary>

```text
pub async fn run_litho_generation(
    paths: &KnowledgePaths,
    project_slug: &str,
    repo_path: &str,
    acp_settings: &AcpSettings,
    model_config: &ModelConfig,
    knowledge: &KnowledgeSettings,
    mode: LithoRunMode,
    mut on_progress: impl FnMut(LithoProgress),
) -> anyhow::Result<LithoGenerationResult> {
    let job = prepare_litho_generation(paths, project_slug, repo_path, acp_settings, model_config);
    if !job.plan.skill_ready {
        anyhow::bail!("Litho skill not found at {}", job.plan.skill_dir);
    }
    let transport = litho_transport(paths, model_config, repo_path, &job.plan, acp_settings);

    let lang = terrain_core::current_language();
    let human_dir = paths.human_docs_dir(project_slug);
    let litho_workspace = PathBuf::from(&job.plan.litho_workspace_dir);

    if mode == LithoRunMode::FullRebuild {
        on_progress(ProgressEvent::litho(
            "starting",
            lang.tr(
                "正在清理旧的人类友好知识库以便重新生成…",
                "Clearing the old human-friendly knowledge base for regeneration…",
            ),
        ));
        clear_litho_outputs(&human_dir, &litho_workspace)?;
    } else if human_complete(&human_dir, &litho_workspace) {
        return run_litho_incremental_or_skip(
            paths,
            project_slug,
            repo_path,
            &transport,
            knowledge,
            job,
            &human_dir,
            &litho_workspace,
```

</details>

**依据 12 · 源码核查**：[crates/terrain-agent/src/litho.rs:485-527](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/litho.rs#L485-L527)

ACP/hybrid真实调用与fallback。

<details>
<summary>查看原文（43行）</summary>

```text
    match transport {
        LithoTransport::AcpStrict(cfg) => {
            prompt_agent_with_doc_poll(
                litho_acp_config(&cfg.acp, &cfg.repo_path, &cfg.plan),
                prompt,
                human_dir,
                research_dir,
                litho_workspace,
                stage,
                waiting_message,
                on_progress,
            )
            .await
        }
        LithoTransport::AcpWithFallback { acp, native } => {
            match prompt_agent_with_doc_poll(
                litho_acp_config(&acp.acp, &acp.repo_path, &acp.plan),
                prompt.clone(),
                human_dir.clone(),
                research_dir.clone(),
                litho_workspace.clone(),
                stage,
                waiting_message.clone(),
                &mut *on_progress,
            )
            .await
            {
                Ok(response) => Ok(response),
                Err(acp_err) if acp_failure_warrants_fallback(&acp_err) => {
                    native_litho_fallback(native, &acp_err, stage, on_progress);
                    prompt_native_with_doc_poll(
                        native.clone(),
                        prompt,
                        human_dir,
                        research_dir,
                        litho_workspace,
                        stage,
                        waiting_message,
                        on_progress,
                    )
                    .await
                }
                Err(e) => Err(e),
```

</details>

**依据 13 · 源码核查**：[crates/terrain-agent/src/workflows/quick_refresh.rs:31-56](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/workflows/quick_refresh.rs#L31-L56)

scanner真实执行/pack状态notes。

<details>
<summary>查看原文（26行）</summary>

```text
    let lang = terrain_core::current_language();
    let mut notes = Vec::new();

    let scanner = ProjectScanner::new(paths.clone());
    let scan = scanner
        .scan_repo(repo_path, Some(project_slug))
        .await?;

    let pack_tokens = scan.agent_pack.as_ref().map(|pack| pack.total_tokens);
    if scan.agent_pack.as_ref().is_some_and(|p| p.pack_skipped) {
        notes.push(
            lang.tr(
                "源码索引：已与当前提交同步，已跳过",
                "Source index: in sync with the current commit, skipped",
            )
            .into(),
        );
    } else if pack_tokens.is_none() {
        notes.push(
            lang.tr(
                "源码索引：scan 未执行 repomix 打包（terrain-core 未启用 repomix feature）",
                "Source index: scan did not run repomix packing (terrain-core built without the repomix feature)",
            )
            .into(),
        );
    }
```

</details>

#### 缺口

- 未启动成品/CLI或所有SDD/环境功能，未有团队任务对照。
  **影响**：不能把多页UI或已注册命令等同稳定可分发成品、开发任务自主交付和广泛需求。
  **进一步探讨**：固定平台与发行包、复制仓库，核GUI动作到文件/事件，再对照原AGENTS.md+文档/grep完成相同架构定位任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 生成完整性和Freshness到底证明什么，失败如何显示？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Human生成结束检查有Markdown、必需文件集/深探索模块及research预期模块计数；不完整即失败而非只以模型回复“完成”为准。context另要求≥500字符/≥4个二级节；纯ACP回复摘要不合格时可恢复磁盘已有合格文档，再write_agent_context。它规范标题/大小、写Markdown与meta，基线取写入时git_snapshot.head；不是对每条架构命题的源码证明，也不据HEAD印章保证生成期间全部读同一不变树。

Freshness真实计算分层ready、各自baseline、Git drift与同步年龄。已存在Git提交而资产缺baseline，标不可测而非零漂移；score_layer不可测扣饱和漂移分、未知年龄按满年龄罚，dirty另扣；Agent context按0.9折扣且不高于source pack。阈值80显示fresh、低于50不预载macro；这些是启发式同步可信度，不是内容正确率或用户价值分。须区分另一分支：chat prompt在freshness与ledger都取不到时macro_preload用unwrap_or(true)，因此不能笼统称一切未知都拒绝预载；这是固定条件边界，未复现误答。

Hybrid ACP异常是否fallback以错误字符串不含wall timeout判断；命中后实际调用native路径。它避免已知wall timeout直接整轮重做，但不是ACP未写入、执行无副作用或业务可安全重放证明。失败应先看已有文档/研究目录/变化再决定重做；full rebuild又会清旧输出，不能用“重试”抹掉恢复成本。

| 效果 | 当前实现支持 | 不能推出 |
|---|---|---|
| 输出完整 | human文件/模块检查，context最低结构，失败可见 | 架构事实正确、每模块确被研究 |
| 同步可见 | baseline/Git/年龄/dirty分层、缺基线不当同步 | freshness即准确率或并发读写一致快照 |
| 降低重复生成 | 增量/skip/上下文限额机制 | 实际token/工时下降比例 |
| 回退有分类 | wall timeout不作该fallback，其余传输错误可native | 未写入/无重复效应或自动恢复成功 |

#### 证据与依据

**依据 1 · 源码核查**：[crates/terrain-core/src/assets/litho.rs:256-287](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/assets/litho.rs#L256-L287)

必需文件与深模块数量实际完整性判据。

<details>
<summary>查看原文（32行）</summary>

```text
pub fn litho_human_complete_with_research(
    human_dir: impl AsRef<Path>,
    litho_workspace: Option<&Path>,
) -> bool {
    let dir = human_dir.as_ref();
    if !dir.is_dir() {
        return false;
    }
    let core_complete = [
        crate::language::ResolvedLanguage::ZhCn,
        crate::language::ResolvedLanguage::En,
    ]
    .iter()
    .any(|lang| {
        lang.litho_required_files()
            .iter()
            .all(|name| dir.join(name).is_file())
    });
    if !core_complete {
        return false;
    }
    let deep_count = count_deep_exploration_modules(dir);
    if deep_count == 0 {
        return false;
    }
    if let Some(workspace) = litho_workspace {
        let expected = count_litho_research_modules(workspace);
        if expected > 0 && deep_count < expected {
            return false;
        }
    }
    true
```

</details>

**依据 2 · 源码核查**：[crates/terrain-agent/src/litho.rs:811-859](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/litho.rs#L811-L859)

补composition、无文档/不完整报错与写meta/done。

<details>
<summary>查看原文（49行）</summary>

```text
        if !human_complete(&human_dir, &litho_workspace)
            && (litho_research_ready(&litho_workspace) || has_litho_research_artifacts(&litho_workspace))
        {
            excerpt = run_composition_with_retries(
                &transport,
                &job,
                human_dir.clone(),
                litho_workspace.clone(),
                &mut on_progress,
            )
            .await?;
        }
        excerpt
    };

    let human_doc_count = count_markdown_in_dir(&human_dir);
    if human_doc_count == 0 {
        anyhow::bail!(
            "Litho generation finished but no human docs were written to {}. \
             Research artifacts under {}. Agent response excerpt: {}",
            human_dir.display(),
            litho_workspace.display(),
            response_excerpt.chars().take(300).collect::<String>()
        );
    }

    if !human_complete(&human_dir, &litho_workspace) {
        anyhow::bail!(
            "Litho generation finished but the human doc set is still incomplete \
             ({human_doc_count} file(s) under {}). Research workspace: {}.",
            human_dir.display(),
            litho_workspace.display()
        );
    }

    let _ = write_human_docs_meta(paths, project_slug, repo_path, "full");

    on_progress(ProgressEvent::litho(
        "done",
        format!("Generation finished — {human_doc_count} human doc(s) on disk"),
    ));

    Ok(build_result(
        job,
        response_excerpt,
        &human_dir,
        &litho_workspace,
        KnowledgeRefreshMode::Full,
        None,
```

</details>

**依据 3 · 源码核查**：[crates/terrain-agent/src/agent_context.rs:185-219](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/agent_context.rs#L185-L219)

纯ACP磁盘恢复、最低结构、实际写context。

<details>
<summary>查看原文（35行）</summary>

```text
    // ACP agents are told to return the full document, but often write it to
    // TERRAIN_AGENT_CONTEXT_OUTPUT and reply with only a completion summary. Terrain persists the
    // reply verbatim, so recover the real document from disk when the reply is not usable.
    if !context_body_ready(&body) && execution_pure_acp(acp_settings) {
        let on_disk = read_agent_context_body(paths, project_slug).unwrap_or_default();
        if context_body_ready(&on_disk) {
            tracing::info!(
                project = project_slug,
                "agent context: recovered document from disk (ACP wrote file; reply was summary only)"
            );
            body = on_disk;
            refresh_reason = refresh_reason.or_else(|| {
                Some("recovered_from_disk_after_summary_reply".into())
            });
        }
    }

    if !context_body_ready(&body) {
        anyhow::bail!(
            "Agent context generation produced an incomplete document (need ≥500 chars and ≥4 \
             ## sections) — {} left unchanged",
            paths.agent_context_main(project_slug).display()
        );
    }

    let meta = write_agent_context(paths, project_slug, repo_path, &body)?;
    let output_path = paths.agent_context_main(project_slug);
    let excerpt: String = body.chars().take(300).collect();

    Ok(AgentContextGenerationResult {
        output_path: output_path.display().to_string(),
        meta,
        response_excerpt: excerpt,
        refresh_mode,
        refresh_reason,
```

</details>

**依据 4 · 源码核查**：[crates/terrain-core/src/assets/agent_context.rs:381-423](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/assets/agent_context.rs#L381-L423)

规范/大小/写Markdown、meta基线取当前HEAD。

<details>
<summary>查看原文（43行）</summary>

```text
pub fn write_agent_context(
    paths: &KnowledgePaths,
    project_slug: &str,
    repo_path: &str,
    body: &str,
) -> Result<AgentContextMeta> {
    std::fs::create_dir_all(paths.agent_pack_dir(project_slug))?;
    let path = paths.agent_context_main(project_slug);
    let body = normalize_context_headings(&prepare_model_markdown(body));
    let (body, _size_capped) = crate::assets::enforce_context_max_size(
        &body,
        crate::assets::AGENT_CONTEXT_SAVE_MAX_CHARS,
    );

    if body.trim().is_empty() {
        return Err(crate::error::CoreError::InvalidDoc(
            "agent context body is empty after sanitization".into(),
        ));
    }

    let fm = DocFrontmatter {
        doc_type: DocType::AgentContext,
        project: project_slug.to_string(),
        module: None,
        title: Some("Agent Architecture Context".into()),
        source: Some(stored_repo_path(Path::new(repo_path))),
        refs: vec![],
        deps: vec![],
        extra: serde_json::Map::new(),
    };
    write_doc(&path, &fm, &body)?;

    let meta = AgentContextMeta {
        project: project_slug.to_string(),
        repo_path: stored_repo_path(Path::new(repo_path)),
        output_file: "context.md".into(),
        generated_at: Utc::now().to_rfc3339(),
        section_count: body.matches("\n## ").count(),
        char_count: body.len(),
        baseline_git_head: git_snapshot(repo_path).head,
        language: Some(crate::language::current_language().code().to_string()),
    };
    crate::doc::write_json(paths.agent_context_meta(project_slug), &meta)?;
```

</details>

**依据 5 · 源码核查**：[crates/terrain-core/src/freshness/compute.rs:29-43](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/freshness/compute.rs#L29-L43)

Git存在但无baseline按不可测。

<details>
<summary>查看原文（15行）</summary>

```text
/// Drift for one asset layer, resolving how — or whether — it can be measured.
///
/// A layer that is ready inside a Git repo but records no baseline is exactly as unverifiable
/// as one whose baseline was rewritten away, so it takes the same fail-closed basis instead of
/// silently reading as zero drift. Two cases deliberately keep the sync-age estimate: a non-Git
/// repo (the `not_git` factor explains it) and a repo with no commits yet, where there is
/// nothing to compare against.
fn layer_drift(repo_path: &str, baseline: Option<&str>, git: &GitSnapshot) -> GitDrift {
    match baseline {
        Some(baseline) => git_drift_since(repo_path, Some(baseline)),
        None if git.is_git_repo && git.head.is_some() => {
            GitDrift::unmeasured(DriftBasis::BaselineMissing)
        }
        None => git_drift_since(repo_path, None),
    }
```

</details>

**依据 6 · 源码核查**：[crates/terrain-core/src/freshness/compute.rs:46-89](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/freshness/compute.rs#L46-L89)

实际分层ready/meta/score调用。

<details>
<summary>查看原文（44行）</summary>

```text
/// Compute freshness for all knowledge assets and persist `freshness.json`.
pub fn compute_freshness(
    paths: &KnowledgePaths,
    project_slug: &str,
    repo_path: &str,
) -> Result<FreshnessSummary> {
    let repo_path = resolve_project_repo_path(paths, project_slug, Some(repo_path))
        .unwrap_or_else(|_| repo_path.to_string());
    let git = git_snapshot(&repo_path);
    let pack_meta = read_json::<AgentPackMeta>(paths.agent_pack_meta(project_slug)).ok();
    let ctx_meta = read_json::<AgentContextMeta>(paths.agent_context_meta(project_slug)).ok();
    let sync_meta = read_json::<SyncMeta>(paths.sync_meta_path(project_slug)).ok();

    let pack_ready = agent_pack_ready(paths, project_slug);
    let ctx_ready = agent_context_ready(paths, project_slug);

    let pack_baseline = pack_meta
        .as_ref()
        .and_then(|m| m.baseline_git_head.clone());
    let pack_drift = layer_drift(&repo_path, pack_baseline.as_deref(), &git);
    let pack_days = pack_meta
        .as_ref()
        .and_then(|m| days_since_rfc3339(&m.synced_at))
        .or_else(|| sync_meta.as_ref().and_then(|m| days_since_rfc3339(&m.synced_at)));
    let pack_total_files = pack_meta.as_ref().map(|m| m.total_files as u32).unwrap_or(0);
    let pack_score = if pack_ready {
        score_layer(&pack_drift, pack_days, pack_total_files.max(1), git.dirty)
    } else {
        0
    };

    let ctx_baseline = ctx_meta
        .as_ref()
        .and_then(|m| m.baseline_git_head.clone())
        .or(pack_baseline.clone());
    let ctx_drift = layer_drift(&repo_path, ctx_baseline.as_deref(), &git);
    let ctx_days = ctx_meta
        .as_ref()
        .and_then(|m| days_since_rfc3339(&m.generated_at))
        .or(pack_days);
    let ctx_score_raw = if ctx_ready {
        score_layer(&ctx_drift, ctx_days, pack_total_files.max(1), git.dirty)
    } else {
        0
```

</details>

**依据 7 · 源码核查**：[crates/terrain-core/src/freshness/scoring.rs:8-47](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/freshness/scoring.rs#L8-L47)

各罚分/context折扣与pack上限。

<details>
<summary>查看原文（40行）</summary>

```text
/// Commit drift penalty per commit behind baseline (capped).
pub(crate) const COMMITS_PENALTY_PER: i32 = 2;
pub(crate) const COMMITS_PENALTY_CAP: i32 = 40;

/// Changed-file ratio penalty cap.
pub(crate) const FILES_PENALTY_CAP: i32 = 30;

/// Calendar age since last asset sync — light penalty so stale packs are not over-penalized.
pub(crate) const SYNC_AGE_PENALTY_PER_DAY: i32 = 1;
pub(crate) const SYNC_AGE_PENALTY_CAP: i32 = 5;

/// Uncommitted source changes in the working tree.
pub(crate) const DIRTY_TREE_PENALTY: i32 = 5;

/// Deducted when drift could not be measured at all — an unreachable baseline commit, or an
/// asset that records no baseline inside a Git repo.
///
/// We cannot tell whether the code moved, so the layer is scored as if it had drifted as far
/// as the measurable penalties allow (commits + files + age). That lands it below
/// [`FRESH_THRESHOLD`] and below `MACRO_PRELOAD_THRESHOLD`, so preloaded macro context is
/// withheld until the assets are regenerated against a reachable commit.
pub(crate) const UNMEASURED_DRIFT_PENALTY: i32 =
    COMMITS_PENALTY_CAP + FILES_PENALTY_CAP + SYNC_AGE_PENALTY_CAP;

/// `None` days-since-sync is unknown, not "today": charge the saturated age penalty.
const UNKNOWN_AGE_DAYS: u32 = SYNC_AGE_PENALTY_CAP as u32;

/// `agent/context.md` is an LLM-generated derivative of the source pack, so its score is
/// discounted — the architecture layer never claims to be as trustworthy as raw source.
/// Consequence: this layer caps at 90, and so does the overall (minimum) score.
pub(crate) const CONTEXT_DISCOUNT: f32 = 0.9;

/// Discounted context score before the source-index ceiling is applied.
pub(crate) fn discount_context_score(raw: u8) -> u8 {
    ((raw as f32) * CONTEXT_DISCOUNT) as u8
}

/// Final context score: discounted raw score, never above the source index it derives from.
pub(crate) fn context_score_from_raw(raw: u8, pack_score: u8) -> u8 {
    discount_context_score(raw).min(pack_score)
```

</details>

**依据 8 · 源码核查**：[crates/terrain-core/src/freshness/scoring.rs:58-100](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/freshness/scoring.rs#L58-L100)

不可测/未知年龄与真实分数计算。

<details>
<summary>查看原文（43行）</summary>

```text
pub(crate) fn score_layer(
    drift: &GitDrift,
    days_since_sync: Option<u32>,
    total_tracked_estimate: u32,
    working_tree_dirty: bool,
) -> u8 {
    if !drift.is_measured() {
        let mut score = 100 - UNMEASURED_DRIFT_PENALTY;
        if working_tree_dirty {
            score -= DIRTY_TREE_PENALTY;
        }
        return score.clamp(0, 100) as u8;
    }
    score_asset(
        drift.commits_since_baseline,
        drift.changed_files.len() as u32,
        total_tracked_estimate,
        days_since_sync.unwrap_or(UNKNOWN_AGE_DAYS),
        working_tree_dirty,
    )
}

/// Compute asset freshness score (0–100) from measured drift counts.
pub fn score_asset(
    commits_since: u32,
    changed_files_count: u32,
    total_tracked_estimate: u32,
    days_since_sync: u32,
    working_tree_dirty: bool,
) -> u8 {
    let mut score: i32 = 100;
    score -= (commits_since as i32 * COMMITS_PENALTY_PER).min(COMMITS_PENALTY_CAP);
    if total_tracked_estimate > 0 {
        let ratio = (changed_files_count as f64 / total_tracked_estimate as f64).min(1.0);
        score -= (ratio * FILES_PENALTY_CAP as f64).round() as i32;
    } else if changed_files_count > 0 {
        score -= (changed_files_count as i32).min(FILES_PENALTY_CAP);
    }
    score -= (days_since_sync as i32 * SYNC_AGE_PENALTY_PER_DAY).min(SYNC_AGE_PENALTY_CAP);
    if working_tree_dirty {
        score -= DIRTY_TREE_PENALTY;
    }
    score.clamp(0, 100) as u8
```

</details>

**依据 9 · 源码核查**：[crates/terrain-core/src/freshness/mod.rs:19-26](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/freshness/mod.rs#L19-L26)

80/70/50真实阈值。

```text
/// Below this score, Ask mode will not preload macro architecture context.
pub const MACRO_PRELOAD_THRESHOLD: u8 = 50;

/// Score at or above this is considered fresh for UI green state.
pub const FRESH_THRESHOLD: u8 = 80;

/// Warn band — verify with repomix before architecture claims.
pub const VERIFY_THRESHOLD: u8 = 70;
```

**依据 10 · 源码核查**：[crates/terrain-agent/src/chat/prompt.rs:55-73](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/prompt.rs#L55-L73)

freshness/ledger不可得时macro默许分支。

<details>
<summary>查看原文（19行）</summary>

```text
    let pack_meta = read_json::<AgentPackMeta>(paths.agent_pack_meta(slug)).ok();

    let freshness = if !repo_path.is_empty() {
        resolve_freshness_summary(paths, slug, &repo_path).ok().or_else(|| {
            read_freshness_ledger(paths, slug).map(|l| l.summary)
        })
    } else {
        None
    };

    let macro_preload = freshness
        .as_ref()
        .map(|f| f.macro_preload_allowed)
        .unwrap_or(true);

    let macro_rule = if macro_preload {
        "• Macro: architecture overview preloaded below (do NOT call read_agent_context without section)"
    } else {
        "• Macro: architecture context is STALE — do NOT trust any preloaded overview; use grep_agent_pack to verify"
```

</details>

**依据 11 · 源码核查**：[crates/terrain-agent/src/chat/prompt.rs:135-160](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/prompt.rs#L135-L160)

宏观上下文预载或withhold实际分支。

<details>
<summary>查看原文（26行）</summary>

```text
    if ctx.ready && macro_preload {
        let context_path = paths.agent_context_main(slug);
        let body = terrain_core::read_doc(&context_path)
            .map(|d| d.body)
            .unwrap_or_default();
        let overview = build_context_overview(&body, AGENT_CONTEXT_ASK_OVERVIEW_MAX_CHARS);
        sections.push(format!(
            "## Preloaded architecture context (macro layer)\n\
Total stored: {} chars in {} sections{}. Do NOT re-fetch overview.\n\n\
{}\n",
            overview.total_chars,
            overview.section_titles.len(),
            if overview.size_capped {
                " (overview capped)"
            } else {
                ""
            },
            overview.macro_markdown,
        ));
    } else if ctx.ready {
        let quick_refresh_button = lang.tr("快速保鲜", "Quick Refresh");
        sections.push(format!(
            "## Architecture context: STALE (score < {MACRO_PRELOAD_THRESHOLD})\n\
Macro overview withheld due to low freshness. Use read_agent_context(section=\"…\") \
only after grep_agent_pack verification, or tell the user to run {quick_refresh_button} in Terrain.\n"
        ));
```

</details>

**依据 12 · 源码核查**：[crates/terrain-agent/src/litho.rs:462-470](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/litho.rs#L462-L470)

fallback字符串分类，不证明未写。

```text
/// A failure that triggers the hybrid native-LLM fallback: anything the ACP transport
/// itself reports (spawn failure, protocol error, agent crash). Our own wall-timeout
/// bail does NOT qualify — after 45 minutes a retry from scratch would be wrong.
/// # ponytail: string check on the timeout message; switch to a typed error if the
/// timeout text ever changes.
#[cfg(feature = "opencode")]
fn acp_failure_warrants_fallback(err: &anyhow::Error) -> bool {
    !format!("{err:#}").contains("wall timeout")
}
```

**依据 13 · 源码核查**：[crates/terrain-agent/src/litho.rs:510-527](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/litho.rs#L510-L527)

异常后实际native调用与传播其他错误。

<details>
<summary>查看原文（18行）</summary>

```text
            .await
            {
                Ok(response) => Ok(response),
                Err(acp_err) if acp_failure_warrants_fallback(&acp_err) => {
                    native_litho_fallback(native, &acp_err, stage, on_progress);
                    prompt_native_with_doc_poll(
                        native.clone(),
                        prompt,
                        human_dir,
                        research_dir,
                        litho_workspace,
                        stage,
                        waiting_message,
                        on_progress,
                    )
                    .await
                }
                Err(e) => Err(e),
```

</details>

#### 缺口

- 未构造错内容但结构完整、缺ledger/重写历史、并发改仓或ACP部分写后失败对照。
  **影响**：同步与文件绿态不能承担内容验收；失败回退/重建的安全与费用还受已有输出和后端行为影响。
  **进一步探讨**：在副本注入一条错误架构、无baseline/无ledger、并发修改和部分输出后异常，分别验状态、差异、残留与人读源码结果，不以单分取代核实。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Ask是否真实消费知识/工具并返回UI，查询有什么隐藏准备成本？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

DeepWikiPanel实际askKnowledge并把reply.answer/citations/tool_calls/usage完成到对话；API invoke到command，用Channel收流；command调用Runtime的ask_knowledge，后者建chat engine、调用engine.ask并发工具/文本/usage/done。只有建engine失败分支会转本地search回复；engine.ask后续错误用?传播，不称任意LLM错误都自动搜索成功。fallback明确写LLM unavailable与文档结果，不冒充模型完成。

Runtime实际从当前model/ACP设置构造ChatEngine；run_turn按纯ACP选择run_turn_acp，其余进入native，本题展开native代表链，不声称各后端等价。Native backend实际把模型与ask-mode FunctionTools交给ADK Runner；builder有max_iterations=50，注册search_knowledge/read_doc/read_agent_context/pack grep/read等；search工具真实调KnowledgeSearch.search并回JSON，Runner.run_str消费用户context并收事件。可证有真实模型Runner入口及工具callee，不是工作流示意图；外部ADK内部工具结果→下一模型调度本轮未展开，不以其API名额外证明所有自主任务结果。完成后从tool记录/回答提取或检索引用并merge。extract_source_citations只是正则路径/行解析到SourceCitation，不执行事实蕴含或文件内容正确检查；点击定位也不等引用支撑命题，最终回答须对源码复核。

Ask不能一概当纯只读/零模型准备。ChatEngine.ask发现pack/context未与HEAD同步会prepare_agent_assets_for_ask；后者ensure pack、generate context，可能先打包、模型/ACP生成并写repo/.terrain。read_agent_context工具还ensure_ready→ChatContextGenerator→ensure_agent_assets，缺/旧时再走生成；名称read并不消除这些活动。已同步可跳过；具体权限/远端模型由配置决定，没有把所有路径统一许为离线。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/components/DeepWikiPanel.svelte:604-635](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src/lib/components/DeepWikiPanel.svelte#L604-L635)

真实提问和消费完整reply，异常显示。

<details>
<summary>查看原文（32行）</summary>

```text
        ...messages,
        { role: "user", content: question, timestamp: Date.now() },
      ];
      onmessageschange(() => userMessages);
      void persistAskMessages(projectSlug, sessionId, userMessages);
      input = "";

      const reply = await askKnowledge(
        question,
        projectSlug,
        requestRepo ?? undefined,
        handleAskStreamEvent,
      );
      if (!turnCompleted) {
        completeAssistantTurn({
          answer: reply.answer,
          citations: reply.citations,
          toolCalls: reply.tool_calls ?? [],
          usage: reply.usage,
          completedAt: reply.completed_at,
        });
      }
    } catch (e) {
      if (!turnCompleted) {
        try {
          const formatted = formatErrorDisplay(e);
          onmessageschange((prev) => [
            ...prev,
            {
              role: "assistant",
              content: formatted.summary,
              isError: true,
```

</details>

**依据 2 · 源码核查**：[src/lib/api.ts:124-146](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src/lib/api.ts#L124-L146)

实际Ask invoke/stream参数。

<details>
<summary>查看原文（23行）</summary>

```text
export const askKnowledge = (
  query: string,
  project?: string,
  repoPath?: string,
  onStream?: (event: AskStreamEvent) => void,
) => {
  const streamChannel = new Channel<AskStreamEvent>();
  if (onStream) {
    streamChannel.onmessage = onStream;
  }
  return invoke<AskKnowledgeReply>("ask_knowledge_cmd", {
    query,
    project: project || null,
    repoPath: repoPath || null,
    onStream: streamChannel,
  });
};

export const listAskSessions = (projectSlug: string) =>
  invoke<AskSessionInfo[]>("list_ask_sessions_cmd", { projectSlug });

export const loadAskMessages = (projectSlug: string, sessionId: string) =>
  invoke<ChatMessage[]>("load_ask_messages_cmd", { projectSlug, sessionId });
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/commands/workflows.rs:13-42](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src-tauri/src/commands/workflows.rs#L13-L42)

Channel/Runtime实际caller。

<details>
<summary>查看原文（30行）</summary>

```text
pub async fn ask_knowledge_cmd(
    state: State<'_, AppState>,
    query: String,
    project: Option<String>,
    repo_path: Option<String>,
    on_stream: Channel<AskStreamEvent>,
) -> Result<ChatReply, String> {
    let stream_id = format!(
        "ask-{}",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_nanos())
            .unwrap_or(0)
    );
    let on_event = move |event: AskStreamEvent| {
        if let Err(err) = on_stream.send(event) {
            tracing::warn!(error = %err, "ask stream channel send failed");
        }
    };

    ask_knowledge(
        &state.runtime,
        &stream_id,
        &query,
        project.as_deref(),
        repo_path.as_deref(),
        on_event,
    )
    .await
    .map_err(ipc_string)
```

</details>

**依据 4 · 源码核查**：[crates/terrain-agent/src/workflows/ask.rs:21-76](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/workflows/ask.rs#L21-L76)

建engine fallback与后续ask错误/事件。

<details>
<summary>查看原文（56行）</summary>

```text
    let engine = match runtime.chat_engine() {
        Ok(engine) => engine,
        Err(err) => {
            let reply =
                fallback_search_reply(&runtime.paths, query, project, repo_path, &err.to_string());
            if let Ok(mut guard) = on_event.lock() {
                guard(AskStreamEvent::Done { reply: reply.clone() });
            }
            return Ok(reply);
        }
    };

    let reply = engine
        .ask(
            session_id,
            query,
            project,
            repo_path,
            |chunk| {
                if let Ok(mut guard) = on_event.lock() {
                    guard(AskStreamEvent::Chunk { text: chunk.to_string() });
                }
            },
            |chunk| {
                if let Ok(mut guard) = on_event.lock() {
                    guard(AskStreamEvent::ThinkingChunk {
                        text: chunk.to_string(),
                    });
                }
            },
            |calls| {
                if let Ok(mut guard) = on_event.lock() {
                    guard(AskStreamEvent::ToolCalls {
                        tool_calls: calls.to_vec(),
                    });
                }
            },
            |phase| {
                if let Ok(mut guard) = on_event.lock() {
                    guard(AskStreamEvent::Phase { phase });
                }
            },
            |usage| {
                if let Ok(mut guard) = on_event.lock() {
                    guard(AskStreamEvent::Usage {
                        usage: usage.clone(),
                    });
                }
            },
        )
        .await?;

    if let Ok(mut guard) = on_event.lock() {
        guard(AskStreamEvent::Done { reply: reply.clone() });
    }
    Ok(reply)
```

</details>

**依据 5 · 源码核查**：[crates/terrain-agent/src/workflows/ask.rs:86-124](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/workflows/ask.rs#L86-L124)

真实搜索与LLM不可用明示。

<details>
<summary>查看原文（39行）</summary>

```text
    let hits = KnowledgeSearch::new(paths)
        .search(
            query,
            SearchOptions {
                project: project.map(str::to_string),
                doc_type: None,
                limit: 5,
            },
        )
        .unwrap_or_default();

    let citations: Vec<SourceCitation> = hits
        .iter()
        .map(|h| SourceCitation {
            kind: if h.path.contains("/human/") {
                CitationKind::HumanDoc
            } else {
                CitationKind::StructuredDoc
            },
            title: h.title.clone().unwrap_or_else(|| h.path.clone()),
            path: h.path.clone(),
            repo_path: repo_path.map(str::to_string),
            start_line: None,
            end_line: None,
            excerpt: Some(h.snippet.clone()),
        })
        .collect();

    let citations = merge_citations(citations, extract_source_citations(query, repo_path));

    let lang = terrain_core::current_language();
    let answer = if citations.is_empty() {
        lang.tr(
            &format!("LLM 不可用（{llm_error}）。未找到匹配文档。"),
            &format!("LLM unavailable ({llm_error}). No matching documents found."),
        )
        .to_string()
    } else {
        lang.tr(
```

</details>

**依据 6 · 源码核查**：[crates/terrain-agent/src/runtime.rs:55-67](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/runtime.rs#L55-L67)

Runtime从真实设置构造ChatEngine。

<details>
<summary>查看原文（13行）</summary>

```text
    pub fn chat_engine(&self) -> anyhow::Result<Arc<ChatEngine>> {
        let config = self.model_config();
        let acp = self.acp_settings();
        let mut guard = self.chat.lock().unwrap_or_else(|e| e.into_inner());
        if let Some(engine) = guard.as_ref() {
            if engine.model_config() == &config && engine.acp_settings() == &acp {
                return Ok(engine.clone());
            }
            *guard = None;
        }
        let engine = Arc::new(ChatEngine::with_settings(self.paths.clone(), config, acp)?);
        *guard = Some(engine.clone());
        Ok(engine)
```

</details>

**依据 7 · 源码核查**：[crates/terrain-agent/src/chat/mod.rs:176-203](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/mod.rs#L176-L203)

按纯ACP/native设置实际选择run_turn。

<details>
<summary>查看原文（28行）</summary>

```text
        if execution_pure_acp(&self.acp_settings) {
            return self
                .run_turn_acp(
                    session_id,
                    query,
                    project,
                    repo_path,
                    on_chunk,
                    on_tool_calls,
                    on_phase,
                    on_usage,
                )
                .await;
        }

        self.run_turn_native(
            session_id,
            query,
            project,
            repo_path,
            on_chunk,
            on_thinking_chunk,
            on_tool_calls,
            on_phase,
            on_usage,
        )
        .await
    }
```

</details>

**依据 8 · 源码核查**：[crates/terrain-agent/src/chat/native.rs:48-81](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/native.rs#L48-L81)

真实native模型/工具/Runner组装。

<details>
<summary>查看原文（34行）</summary>

```text
pub(crate) fn build_native_backend(
    paths: &KnowledgePaths,
    model_config: &ModelConfig,
) -> Result<NativeBackend> {
    ensure_llm(model_config)?;
    let llm = build_llm(model_config)?;
    let context_generator: Arc<dyn AgentContextGenerator> = Arc::new(ChatContextGenerator {
        paths: paths.clone(),
        model_config: model_config.clone(),
    });
    let agent = build_agent(
        llm,
        AgentConfig {
            knowledge_root: paths.clone(),
            project_cwd: None,
            acp_settings: resolve_acp_settings(),
            enable_acp_delegate: false,
            ask_mode: true,
            context_generator: Some(context_generator),
        },
    )?;

    let session_service = Arc::new(InMemorySessionService::new());
    let runner = Runner::builder()
        .app_name(CHAT_APP_NAME)
        .agent(agent)
        .session_service(session_service.clone())
        .run_config(
            RunConfig::builder()
                .streaming_mode(StreamingMode::SSE)
                .build(),
        )
        .build()
        .context("failed to build chat runner")?;
```

</details>

**依据 9 · 源码核查**：[crates/terrain-agent/src/builder.rs:147-187](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/builder.rs#L147-L187)

真实ask FunctionTool集合与iterations。

<details>
<summary>查看原文（41行）</summary>

```text
pub fn build_agent(model: Arc<dyn Llm>, config: AgentConfig) -> Result<Arc<dyn Agent>> {
    let paths = config.knowledge_root.clone();
    let cooldown = call_cooldown_from_env();

    let lang = terrain_core::current_language();
    let base_instruction = if config.ask_mode {
        ask_instruction(lang)
    } else {
        instruction(lang)
    };
    let instruction = format!("{base_instruction}\n\n{}", lang.reply_language_directive());

    let mut builder = LlmAgentBuilder::new("terrain")
        .instruction(instruction.as_str())
        .model(model)
        .max_iterations(50)
        .max_output_tokens(64000)
        .tool(wrap_tool(list_projects_tool(paths.clone()), cooldown));

    if config.ask_mode {
        let generator = config
            .context_generator
            .clone()
            .context("ask_mode requires context_generator for read_agent_context")?;

        builder = builder
            .tool(wrap_tool(search_knowledge_tool(paths.clone()), cooldown))
            .tool(wrap_tool(read_doc_ask_tool(paths.clone()), cooldown))
            .tool(wrap_tool(
                read_agent_context_tool(paths.clone(), generator),
                cooldown,
            ))
            .tool(wrap_tool(
                read_agent_pack_meta_tool(paths.clone()),
                cooldown,
            ))
            .tool(wrap_tool(grep_agent_pack_tool(paths.clone()), cooldown))
            .tool(wrap_tool(
                read_agent_pack_file_tool(paths.clone()),
                cooldown,
            ));
```

</details>

**依据 10 · 源码核查**：[crates/terrain-agent/src/tools.rs:201-233](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/tools.rs#L201-L233)

实际search工具callee返回JSON。

<details>
<summary>查看原文（33行）</summary>

```text
pub fn search_knowledge_tool(paths: KnowledgePaths) -> Arc<dyn Tool> {
    Arc::new(
        FunctionTool::new(
            "search_knowledge",
            "Full-text search for structured docs (interfaces/, routes/, modules/) only. \
             Architecture is preloaded — do not search for overview/architecture topics. \
             Each hit includes `rel_path` for read_doc.",
            move |_ctx, args| {
                let paths = paths.clone();
                async move {
                    let params: SearchArgs = serde_json::from_value(args).map_err(|e| {
                        adk_core::AdkError::new(
                            ErrorComponent::Tool,
                            adk_core::ErrorCategory::InvalidInput,
                            "tool.invalid_args",
                            e.to_string(),
                        )
                    })?;
                    KnowledgeSearch::new(&paths)
                        .search(
                            &params.query,
                            SearchOptions {
                                project: params.project,
                                doc_type: None,
                                limit: params.limit.unwrap_or(10),
                            },
                        )
                        .map_err(map_core_err)
                        .map(|hits| json!({ "hits": hits }))
                }
            },
        )
        .with_parameters_schema::<SearchArgs>(),
```

</details>

**依据 11 · 源码核查**：[crates/terrain-agent/src/chat/native.rs:146-158](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/native.rs#L146-L158)

Runner.run_str实际调用。

<details>
<summary>查看原文（13行）</summary>

```text

        self.ensure_session(session_id).await?;

        let backend = self.native()?;
        let content = Content::new("user").with_text(context);
        let mut stream = backend
            .runner
            .run_str(CHAT_USER_ID, session_id, content)
            .await
            .context("agent run failed")?;

        let mut answer_collector = ModelAnswerCollector::new();
        let mut tool_tracker = ToolCallTracker::new();
```

</details>

**依据 12 · 源码核查**：[crates/terrain-agent/src/chat/native.rs:250-290](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/native.rs#L250-L290)

引用/空回答边界/最终reply。

<details>
<summary>查看原文（41行）</summary>

```text
        let mut citations = if tool_tracker
            .records()
            .iter()
            .any(|r| matches!(r.name.as_str(), "grep_agent_pack" | "read_agent_pack_file" | "read_agent_context"))
        {
            extract_source_citations(&answer, repo_path)
        } else {
            self.search_citations(query, project, repo_path)
                .unwrap_or_else(|e| {
                    tracing::warn!(error = %e, "citation search failed; continuing without search hits");
                    Vec::new()
                })
        };
        citations = merge_citations(citations, extract_source_citations(&answer, repo_path));

        if answer.trim().is_empty() {
            answer = if citations.is_empty() && tool_tracker.records().is_empty() {
                "I could not find relevant information in the knowledge base.".into()
            } else if citations.is_empty() {
                "I finished reviewing the knowledge base and agent pack, but the model returned no final text. Expand tool calls above for retrieved context.".into()
            } else {
                format!(
                    "I found {} reference(s) in the knowledge base. See citations below.",
                    citations.len()
                )
            };
        }

        tracing::info!(
            session_id,
            answer_chars = answer.len(),
            tool_calls = tool_tracker.records().len(),
            "ask completed"
        );

        Ok(ChatReply {
            answer,
            citations,
            tool_calls: tool_tracker.records().to_vec(),
            usage,
            completed_at: now_ms(),
```

</details>

**依据 13 · 源码核查**：[crates/terrain-core/src/citations.rs:46-90](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/citations.rs#L46-L90)

实际路径/行正则构造，不是事实校验。

<details>
<summary>查看原文（45行）</summary>

```text
pub fn extract_source_citations(text: &str, repo_path: Option<&str>) -> Vec<SourceCitation> {
    let mut out = Vec::new();
    let mut seen = std::collections::HashSet::new();

    for cap in SOURCE_REF.captures_iter(text) {
        let path = cap.get(1).map(|m| m.as_str()).unwrap_or_default();
        if path.is_empty() {
            continue;
        }
        if path == "agent/repomix.md" || path.contains("/agent/repomix.md") {
            continue;
        }
        let start = cap.get(2).and_then(|m| m.as_str().parse().ok());
        let end = cap
            .get(3)
            .and_then(|m| m.as_str().parse().ok())
            .or(start);

        let key = format!("{path}:{start:?}:{end:?}");
        if !seen.insert(key) {
            continue;
        }

        let title = if let (Some(s), Some(e)) = (start, end) {
            if s == e {
                format!("{path}:{s}")
            } else {
                format!("{path}:{s}-{e}")
            }
        } else {
            path.to_string()
        };

        out.push(SourceCitation {
            kind: citation_kind_for_path(path),
            title,
            path: path.to_string(),
            repo_path: repo_path.map(str::to_string),
            start_line: start,
            end_line: end,
            excerpt: None,
        });
    }

    out
```

</details>

**依据 14 · 源码核查**：[crates/terrain-agent/src/chat/mod.rs:127-159](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/mod.rs#L127-L159)

Ask自动prepare条件。

<details>
<summary>查看原文（33行）</summary>

```text
        if let Some(slug) = project {
            let repo = resolve_project_repo_path(
                &self.paths,
                slug,
                normalize_repo_hint(repo_path),
            )
            .unwrap_or_default();
            if !agent_pack_synced_with_head(&self.paths, slug, &repo)
                || !agent_context_synced_with_head(&self.paths, slug, &repo)
            {
                prepare_agent_assets_for_ask(
                    &self.paths,
                    &self.model_config,
                    slug,
                    normalize_repo_hint(repo_path),
                    &mut on_phase,
                )
                .await?;
            }
        }

        self.run_turn(
            session_id,
            query,
            project,
            repo_path,
            on_chunk,
            on_thinking_chunk,
            on_tool_calls,
            on_phase,
            on_usage,
        )
        .await
```

</details>

**依据 15 · 源码核查**：[crates/terrain-agent/src/agent_assets.rs:20-85](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/agent_assets.rs#L20-L85)

pack/生成context实际活动。

<details>
<summary>查看原文（66行）</summary>

```text
/// Pack repomix when missing. Returns true if a new pack was written.
pub async fn ensure_agent_pack(
    paths: &KnowledgePaths,
    project_slug: &str,
    repo_path_hint: Option<&str>,
) -> anyhow::Result<(String, bool)> {
    let repo_path = resolve_project_repo_path(paths, project_slug, repo_path_hint)?;
    if agent_pack_synced_with_head(paths, project_slug, &repo_path) {
        return Ok((repo_path, false));
    }
    tracing::info!(
        project = project_slug,
        repo = %repo_path,
        "agent repomix pack missing or stale — packing automatically"
    );
    maybe_pack_agent_assets(paths, project_slug, &repo_path).await?;
    Ok((repo_path, true))
}

/// Generate context.md when missing or baseline drifted (repomix must already exist).
pub async fn generate_agent_context_if_missing(
    paths: &KnowledgePaths,
    model_config: &ModelConfig,
    project_slug: &str,
    repo_path: &str,
) -> anyhow::Result<bool> {
    if agent_context_synced_with_head(paths, project_slug, repo_path) {
        return Ok(false);
    }
    tracing::info!(
        project = project_slug,
        "agent context missing or stale — generating automatically"
    );
    let acp = resolve_acp_settings();
    let engine = if execution_uses_native_llm(&acp) {
        Some(Arc::new(ChatEngine::new_native(paths.clone(), model_config.clone())?))
    } else {
        None
    };
    run_agent_context_generation(
        paths,
        engine,
        &acp,
        project_slug,
        repo_path,
        &resolve_knowledge_settings(),
        false,
    )
    .await?;
    Ok(true)
}

/// Ensure repomix pack and agent/context.md exist; run generation when missing.
pub async fn ensure_agent_assets(
    paths: &KnowledgePaths,
    model_config: &ModelConfig,
    project_slug: &str,
    repo_path_hint: Option<&str>,
) -> anyhow::Result<AgentAssetsEnsureReport> {
    let (repo_path, packed) = ensure_agent_pack(paths, project_slug, repo_path_hint).await?;
    let context_generated =
        generate_agent_context_if_missing(paths, model_config, project_slug, &repo_path).await?;
    Ok(AgentAssetsEnsureReport {
        packed,
        context_generated,
    })
```

</details>

**依据 16 · 源码核查**：[crates/terrain-agent/src/agent_assets.rs:96-106](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/agent_assets.rs#L96-L106)

准备阶段分别发起pack/context。

<details>
<summary>查看原文（11行）</summary>

```text
    let repo_path = resolve_project_repo_path(paths, project_slug, repo_path_hint)?;

    if !agent_pack_synced_with_head(paths, project_slug, &repo_path) {
        on_phase(ChatPhase::PreparingPack);
        ensure_agent_pack(paths, project_slug, repo_path_hint).await?;
    }

    if !agent_context_synced_with_head(paths, project_slug, &repo_path) {
        on_phase(ChatPhase::PreparingContext);
        generate_agent_context_if_missing(paths, model_config, project_slug, &repo_path).await?;
    }
```

</details>

**依据 17 · 源码核查**：[crates/terrain-agent/src/tools.rs:115-127](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/tools.rs#L115-L127)

read_agent_context也会ensure_ready。

<details>
<summary>查看原文（13行）</summary>

```text
                    let was_pack_ready = agent_pack_ready(&paths, &params.project);
                    let was_context_ready = agent_context_ready(&paths, &params.project);

                    let report = generator
                        .ensure_ready(&params.project, None)
                        .await
                        .map_err(|e| adk_core::AdkError::tool(e.to_string()))?;

                    let doc = terrain_core::read_doc_at_in_project(
                        &paths,
                        "agent/context.md",
                        Some(&params.project),
                    )
```

</details>

**依据 18 · 源码核查**：[crates/terrain-agent/src/chat/native.rs:32-40](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/chat/native.rs#L32-L40)

ensure_ready实际委托ensure_agent_assets。

```text
#[async_trait::async_trait]
impl AgentContextGenerator for ChatContextGenerator {
    async fn ensure_ready(
        &self,
        project_slug: &str,
        repo_path: Option<&str>,
    ) -> anyhow::Result<AgentAssetsEnsureReport> {
        ensure_agent_assets(&self.paths, &self.model_config, project_slug, repo_path).await
    }
```

#### 缺口

- 无真实问答/引用正确率或SDK内部完整循环/所有后端权限核查。
  **影响**：不能把检索命中/可点击引用、ask completed日志当回答正确或开发任务完成，也不能把提问当无写入/无准备费用。
  **进一步探讨**：副本仓记录提问前后文件/模型请求，比较已同步与缺资产两种路径；独立核答案与引用事实，再决定是否允许自动准备和所选远端服务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 环境集成依赖与首次、持续、失败和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

资料真实落repo/.terrain，注册解析定位项目，不当只写应用全局缓存。Tauri validate_repo委托core validate_repo_path只验存在/目录；一般文件处理的目录/磁盘条件与Git漂移/提交基线/相应增量条件分开，compute也有非Git/无commit分支，不据此推非Git所有功能等价。知识生成需所选ACP/native模型；scan/打包/freshness等局部可不调模型，不外推全部产品离线。Rust源码构建要求1.94，桌面有Tauri/WebView及Bun前端构建；成品兼容、签名、npm CLI二进制与本轮固定源对应未验证。

环境apply是真写操作：根据选项/依赖派发skill、tool、AGENTS.md、ignore/git策略；tool安装步骤最终process command在repo cwd执行，按退出码报错；optional失败记skipped，其他记errors，最后仍写manifest并失效缓存，返回applied/skipped/errors。它不是全有全无事务或全局卸载保证；本轮不全审所有catalog安装脚本/下载链。预设Skill/Agent约定及外部工具独立版本不能当Terrain0.9.8的一套远端统一版本。

| 依赖/条件 | 是否必需 | 用途 | 缺失/不满足 |
|---|---|---|---|
| 匹配桌面成品/CLI | 所选入口必需 | GUI/无头处理 | 平台/签名/工件未核，源码不证明安装成功 |
| 可读写项目目录/磁盘 | 本轮文件处理必需 | 读源、写pack/meta/文档 | validate_repo仅验路径存在/目录；权限仍需满足 |
| Git提交/可达基线 | Git漂移、基线比对与相应增量路径需 | 计算变更并确定可复用资料 | 非Git/无commit有独立分支，不以缺Git一概拒绝目录，也不许全产品等价 |
| ACP或native LLM/配置 | 生成/智能问答需，局部扫描不需 | 知识产出/推理 | 模型不可用时部分搜索降级/错误，不保证任意功能 |
| Skill/RTK/CodeGraph等选定项 | 环境功能按选择 | 提供外部能力/规则 | 版本/权限/安装步骤另核，非存在就已生效 |

| 阶段 | 现金与资源 | 人工与时间 | 已知/未知 |
|---|---|---|---|
| 首次 | 成品/工具、模型或ACP资源、仓库包磁盘；金额未知 | 固定版本/副本，配置后端与资料范围、核文档和命令差异 | 未装/生成，工时未知 |
| 持续 | 增量或全量模型调用、pack/知识占用 | 复核源码变化与回答，Ask缺资产也会更新 | skip/增量是机制，不是节省比例 |
| 失败恢复 | partial文档/工具安装与重复模型费用 | 保留diff/研究材料，核applied/errors、ACP已有写；full重建前备份 | 无跨外部安装事务/必成功证明 |
| 退出 | .terrain、约定/ignore、全局工具/会话与设置残留可能 | 先保存知识与作品，再按实际diff撤规则/卸选定工具和停后端 | 不许删用户手写文件；未核统一完整卸载/所有后端子进程退出 |

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/commands/util.rs:8-10](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src-tauri/src/commands/util.rs#L8-L10)

实际validate_repo委托core。

```text
pub fn validate_repo(path: &str) -> Result<PathBuf, String> {
    validate_repo_path(path).map_err(|e| e.to_string())?;
    Ok(PathBuf::from(path))
```

**依据 2 · 源码核查**：[crates/terrain-core/src/repo.rs:5-18](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/repo.rs#L5-L18)

只验存在/目录，不验Git。

<details>
<summary>查看原文（14行）</summary>

```text
pub fn validate_repo_path(repo_path: &str) -> Result<()> {
    let path = Path::new(repo_path);
    if !path.exists() {
        return Err(TerrainError::validation(format!(
            "repository path does not exist: {repo_path}"
        )));
    }
    if !path.is_dir() {
        return Err(TerrainError::validation(format!(
            "repository path is not a directory: {repo_path}"
        )));
    }
    Ok(())
}
```

</details>

**依据 3 · 源码核查**：[crates/terrain-core/src/freshness/compute.rs:29-43](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/freshness/compute.rs#L29-L43)

非Git/无commit与Git缺基线分支区分。

<details>
<summary>查看原文（15行）</summary>

```text
/// Drift for one asset layer, resolving how — or whether — it can be measured.
///
/// A layer that is ready inside a Git repo but records no baseline is exactly as unverifiable
/// as one whose baseline was rewritten away, so it takes the same fail-closed basis instead of
/// silently reading as zero drift. Two cases deliberately keep the sync-age estimate: a non-Git
/// repo (the `not_git` factor explains it) and a repo with no commits yet, where there is
/// nothing to compare against.
fn layer_drift(repo_path: &str, baseline: Option<&str>, git: &GitSnapshot) -> GitDrift {
    match baseline {
        Some(baseline) => git_drift_since(repo_path, Some(baseline)),
        None if git.is_git_repo && git.head.is_some() => {
            GitDrift::unmeasured(DriftBasis::BaselineMissing)
        }
        None => git_drift_since(repo_path, None),
    }
```

</details>

**依据 4 · 源码核查**：[crates/terrain-core/src/paths.rs:8-39](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/paths.rs#L8-L39)

实际repo/.terrain与workspace路径。

<details>
<summary>查看原文（32行）</summary>

```text
/// Registry-backed resolver for per-repository knowledge at `{repo}/.terrain/`.
#[derive(Debug, Clone, Default)]
pub struct KnowledgePaths {
    /// When set, CLI and workspace tools default to this repository.
    workspace_repo: Option<PathBuf>,
}

impl KnowledgePaths {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_workspace_repo(repo: impl Into<PathBuf>) -> Self {
        Self {
            workspace_repo: Some(repo.into()),
        }
    }

    /// Knowledge root inside a repository (`.terrain/`).
    pub fn for_repo(repo_path: impl AsRef<Path>) -> Self {
        Self::with_workspace_repo(repo_path.as_ref().to_path_buf())
    }

    pub fn workspace_repo(&self) -> Option<&Path> {
        self.workspace_repo.as_deref()
    }

    /// `{workspace_repo}/.terrain` when a workspace repo is set.
    pub fn workspace_knowledge_root(&self) -> Option<PathBuf> {
        self.workspace_repo
            .as_ref()
            .map(|repo| registry::knowledge_root_for_repo(repo))
```

</details>

**依据 5 · 源码核查**：[Cargo.toml:11-16](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/Cargo.toml#L11-L16)

Rust构建版本约束。

```text
[workspace.package]
version = "0.9.8"
edition = "2024"
license = "MIT"
rust-version = "1.94"

```

**依据 6 · 源码核查**：[src-tauri/tauri.conf.json:5-10](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/src-tauri/tauri.conf.json#L5-L10)

Bun/前端构建与桌面配置。

```text
  "identifier": "com.terrain.app",
  "build": {
    "beforeDevCommand": "bun run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "bun run build",
    "frontendDist": "../dist"
```

**依据 7 · 源码核查**：[crates/terrain-agent/Cargo.toml:9-12](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/Cargo.toml#L9-L12)

默认opencode feature。

```text
[features]
default = ["opencode"]
opencode = ["dep:adk-acp"]
ts-export = ["dep:ts-rs", "terrain-core/ts-export"]
```

**依据 8 · 源码核查**：[crates/terrain-core/src/assets/env/apply.rs:77-125](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/assets/env/apply.rs#L77-L125)

实际apply派发、部分错误/manifest输出。

<details>
<summary>查看原文（49行）</summary>

```text
        }
        if !dependencies_satisfied(def, &selected, &integrated) {
            continue;
        }

        on_progress(ProgressEvent::env(
            def.id.clone(),
            lang.tr(
                &format!("正在集成 {}…", def.label),
                &format!("Integrating {}…", def.label),
            )
            .to_string(),
        ));

        let result = match def.kind.as_str() {
            "skill" => apply_skill(repo, def),
            "tool" => apply_tool(repo, def).await,
            "agents_md" => patch_agents_md(repo).map(|p| {
                lang.tr(&format!("已更新 {p}"), &format!("Updated {p}"))
                    .to_string()
            }),
            "terrain_ignore" => apply_terrain_git_policy(repo),
            "gitignore" => apply_gitignore(repo, &def.patterns),
            _ => Err(CoreError::InvalidDoc(format!("unknown kind {}", def.kind))),
        };

        match result {
            Ok(msg) => {
                applied.push(format!("{}: {msg}", def.id));
            }
            Err(e) => {
                if def.optional {
                    skipped.push(format!("{}: {e}", def.id));
                } else {
                    errors.push(format!("{}: {e}", def.id));
                }
            }
        }
    }

    ensure_knowledge_dir(repo)?;

    let manifest_path = write_manifest(repo, &applied, &catalog.version)?;
    invalidate_env_status_cache_for_repo(repo);

    Ok(EnvApplyResult {
        repo_path: repo.display().to_string(),
        applied,
        skipped,
```

</details>

**依据 9 · 源码核查**：[crates/terrain-core/src/assets/env/apply.rs:190-198](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/assets/env/apply.rs#L190-L198)

真实安装步骤循环。

```text
    }

    let mut messages = Vec::new();
    for step in &def.install_steps {
        let args = substitute_install_args(repo, def, &step.args);
        run_command(repo, &step.cmd, &args).await?;
        messages.push(format!("{} {}", step.cmd, args.join(" ")));
    }
    Ok(messages.join("; "))
```

**依据 10 · 源码核查**：[crates/terrain-core/src/assets/env/apply.rs:300-317](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/assets/env/apply.rs#L300-L317)

真实命令cwd/执行/退出码。

<details>
<summary>查看原文（18行）</summary>

```text
async fn run_command(cwd: &Path, cmd: &str, args: &[String]) -> Result<()> {
    let output = crate::process::async_command(cmd)
        .args(args)
        .current_dir(cwd)
        .output()
        .await
        .map_err(|e| CoreError::InvalidDoc(format!("failed to run {cmd}: {e}")))?;

    if output.status.success() {
        return Ok(());
    }
    let stderr = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);
    Err(CoreError::InvalidDoc(format!(
        "{cmd} {} failed ({}): {stderr}{stdout}",
        args.join(" "),
        output.status
    )))
```

</details>

**依据 11 · 源码核查**：[crates/terrain-agent/src/agent_assets.rs:39-69](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/agent_assets.rs#L39-L69)

缺/旧context可起native/ACP生成，非纯读。

<details>
<summary>查看原文（31行）</summary>

```text
/// Generate context.md when missing or baseline drifted (repomix must already exist).
pub async fn generate_agent_context_if_missing(
    paths: &KnowledgePaths,
    model_config: &ModelConfig,
    project_slug: &str,
    repo_path: &str,
) -> anyhow::Result<bool> {
    if agent_context_synced_with_head(paths, project_slug, repo_path) {
        return Ok(false);
    }
    tracing::info!(
        project = project_slug,
        "agent context missing or stale — generating automatically"
    );
    let acp = resolve_acp_settings();
    let engine = if execution_uses_native_llm(&acp) {
        Some(Arc::new(ChatEngine::new_native(paths.clone(), model_config.clone())?))
    } else {
        None
    };
    run_agent_context_generation(
        paths,
        engine,
        &acp,
        project_slug,
        repo_path,
        &resolve_knowledge_settings(),
        false,
    )
    .await?;
    Ok(true)
```

</details>

**依据 12 · 源码核查**：[crates/terrain-agent/src/litho.rs:40-44](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/litho.rs#L40-L44)

默认45分钟wall预算/重试常量不等真实耗时。

```text
const POLL_INTERVAL_SECS: u64 = 3;
const POLL_INTERVAL_STABLE_SECS: u64 = 6;
const STABLE_TICKS: u32 = 10;
const MAX_COMPOSITION_ATTEMPTS: u32 = 3;
const DEFAULT_WALL_TIMEOUT_SECS: u64 = 45 * 60;
```

#### 缺口

- 无安装/部署/费用测量、全catalog副作用与完整退出审计。
  **影响**：不能承诺环境一键配置后无残留或离线零成本；按需限定选择和副本方能将失败/退出责任具体化。
  **进一步探讨**：对允许的选项留前后仓库与用户目录diff、进程/费用记录，核partial failure与退出；先不在真实工作仓执行未评估安装项。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些生产方向尚可检验，怎样不重复现有freshness/增量机制？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可先试用“受控仓库的知识入口+可复核源码引用”，不把绿色freshness或完整文档当免复核的架构真相。现有增量/skip、缺基线降信任、context折扣、分层预载与问答准备均已存在，不能再把加Git标签、索引或文档集数量作为新方向。独立桌面/CLI是分发形态，是否值得再封一层DSH插件需先证明用户本来就在DSH完成此类任务，而不是多一套重复知识库。

后续假说是“架构命题到固定源码证据的变更核验”：选少量关键接口/权限/依赖关系，存命题、固定tree/file行内容摘要和允许的推断；变更后将受影响命题标待核，并给人最小反证片段，而非只有提交数/文件比率/回答正则引用。还需在生成开始/写入后验证输入树边界，避免把写入时HEAD当全文研究快照；这是假说，不称当前已出错。现有分层freshness继续负责同步风险，新增层只检验命题与行为是否仍成立，无法判定必须unknown。

最低对照：两三个真实维护者、合法可用仓库，各取架构定位、一次函数移动/权限变更、无业务影响变更、故意错误但结构完整文档；比较手写AGENTS/文档+grep、当前Terrain、Terrain+命题核验，同问题/提交/模型预算，由独立源码评审给答案。指标为错误架构命题、失效引用、漏报/误报、最终定位与修正分钟、模型/打包资源、配置/维护时间；不能只报文档产量或freshness均值。若现有Terrain已足够准确、命题层增加提示疲劳却不降错/工时，或用户无需第二知识入口，则停止独立插件方向，将必要的输入版本/未知预载修复留在原项目。

#### 证据与依据

**依据 1 · 源码核查**：[crates/terrain-core/src/freshness/scoring.rs:35-47](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/freshness/scoring.rs#L35-L47)

现有context折扣与pack上限不当未来新贡献。

<details>
<summary>查看原文（13行）</summary>

```text
/// `agent/context.md` is an LLM-generated derivative of the source pack, so its score is
/// discounted — the architecture layer never claims to be as trustworthy as raw source.
/// Consequence: this layer caps at 90, and so does the overall (minimum) score.
pub(crate) const CONTEXT_DISCOUNT: f32 = 0.9;

/// Discounted context score before the source-index ceiling is applied.
pub(crate) fn discount_context_score(raw: u8) -> u8 {
    ((raw as f32) * CONTEXT_DISCOUNT) as u8
}

/// Final context score: discounted raw score, never above the source index it derives from.
pub(crate) fn context_score_from_raw(raw: u8, pack_score: u8) -> u8 {
    discount_context_score(raw).min(pack_score)
```

</details>

**依据 2 · 源码核查**：[crates/terrain-agent/src/agent_context.rs:20-45](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-agent/src/agent_context.rs#L20-L45)

现有增量规划不当新方向。

<details>
<summary>查看原文（26行）</summary>

```text
/// Generate `agent/context.md` — architecture-level context for agents (not source code).
///
/// With `force_full` unset and incremental refresh enabled, an existing document that has only
/// drifted a few commits is *updated* from `git diff` rather than rebuilt, which is the
/// difference between a short turn and a full architecture pass. `force_full` is what the
/// UI's 「重新生成」 sets — an explicit rebuild request always rebuilds.
pub async fn run_agent_context_generation(
    paths: &KnowledgePaths,
    engine: Option<Arc<ChatEngine>>,
    acp_settings: &AcpSettings,
    project_slug: &str,
    repo_path: &str,
    knowledge: &KnowledgeSettings,
    force_full: bool,
) -> anyhow::Result<AgentContextGenerationResult> {
    let mode = if force_full {
        KnowledgeUpdateMode::Full {
            reason: "explicit_rebuild",
        }
    } else {
        plan_incremental_update(
            repo_path,
            agent_context_recorded_baseline_head(paths, project_slug).as_deref(),
            agent_context_ready(paths, project_slug),
            IncrementalOptions::from(knowledge),
        )
```

</details>

**依据 3 · 源码核查**：[crates/terrain-core/src/assets/agent_context.rs:411-423](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/assets/agent_context.rs#L411-L423)

当前内容与写入时HEAD元数据；未来不应混淆快照。

<details>
<summary>查看原文（13行）</summary>

```text
    write_doc(&path, &fm, &body)?;

    let meta = AgentContextMeta {
        project: project_slug.to_string(),
        repo_path: stored_repo_path(Path::new(repo_path)),
        output_file: "context.md".into(),
        generated_at: Utc::now().to_rfc3339(),
        section_count: body.matches("\n## ").count(),
        char_count: body.len(),
        baseline_git_head: git_snapshot(repo_path).head,
        language: Some(crate::language::current_language().code().to_string()),
    };
    crate::doc::write_json(paths.agent_context_meta(project_slug), &meta)?;
```

</details>

**依据 4 · 源码核查**：[crates/terrain-core/src/citations.rs:46-90](https://github.com/sopaco/terrain/blob/ff51104e4057815b8406df953833191b720203d0/crates/terrain-core/src/citations.rs#L46-L90)

现有正则引用和新增命题核验区分。

<details>
<summary>查看原文（45行）</summary>

```text
pub fn extract_source_citations(text: &str, repo_path: Option<&str>) -> Vec<SourceCitation> {
    let mut out = Vec::new();
    let mut seen = std::collections::HashSet::new();

    for cap in SOURCE_REF.captures_iter(text) {
        let path = cap.get(1).map(|m| m.as_str()).unwrap_or_default();
        if path.is_empty() {
            continue;
        }
        if path == "agent/repomix.md" || path.contains("/agent/repomix.md") {
            continue;
        }
        let start = cap.get(2).and_then(|m| m.as_str().parse().ok());
        let end = cap
            .get(3)
            .and_then(|m| m.as_str().parse().ok())
            .or(start);

        let key = format!("{path}:{start:?}:{end:?}");
        if !seen.insert(key) {
            continue;
        }

        let title = if let (Some(s), Some(e)) = (start, end) {
            if s == e {
                format!("{path}:{s}")
            } else {
                format!("{path}:{s}-{e}")
            }
        } else {
            path.to_string()
        };

        out.push(SourceCitation {
            kind: citation_kind_for_path(path),
            title,
            path: path.to_string(),
            repo_path: repo_path.map(str::to_string),
            start_line: start,
            end_line: end,
            excerpt: None,
        });
    }

    out
```

</details>

#### 缺口

- 没有维护者对照、真实需求频率/切换成本与命题核验净收益。
  **影响**：只能限定复制仓试用，独立生产插件仍需证伪；不因代码链长/设计清晰就许收益。
  **进一步探讨**：先取得真实任务和独立源码答案，预设误报/错误/总投入与继续使用门槛，达不到就停独立方向。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
