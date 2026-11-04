# zeromd

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[eb09957](https://github.com/yuukiLike/zeromd/tree/eb09957079cfe80b39616fe9c0d720be5851dfe3)

<!-- BEGIN META -->
[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yuukiLike/zeromd)
<!-- END META -->

> **功能**：为 macOS 上的 Obsidian iCloud 笔记库配置定时 Git 提交、远端同步与诊断。

> **亮点**：[Q01](#research-q01) 将库发现、Git 接入、定时推送和错误诊断组合成独立 Bash 工具，贡献是操作编排，AI 文件访问和 iCloud 同步不归本项目原创。

> **主要限制**：[Q02](#research-q02) 已建立上游后，无本地变化会直接退出，远端单独变化不会触发拉取；跨端同步承诺因此必须收窄。

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
  - [Q01 · 它为哪类笔记工作流增加了什么，而不是新的 DSH 插件？](#detail-section-11)
  - [Q02 · 定时同步能否保证两端修改都汇合？](#detail-section-12)
  - [Q03 · 首次接入和冲突恢复由谁承担，零维护是否成立？](#detail-section-13)
  - [Q04 · 怎样减少用户将远端副本误认为完整同步的风险？](#detail-section-14)
  - [Q05 · 什么条件下可以试用，何时应退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：zeromd 面向已有 macOS 与 iCloud Obsidian 笔记库、希望再保留 Git 历史和远端副本的人。输入是本地 Markdown 文件，合格结果是笔记可读且期望变更出现在指定远端提交中。README 将 AI 直接读写目录作为场景，但这种文件访问由 AI 工具和文件系统提供，zeromd 的增量是把 Git 初始化、定时任务、诊断和推送串起来；它不是 DSH 注册扩展。相对手动 git add/commit/pull/push，它减少重复执行步骤；相对只用 iCloud，它增加 Git 历史与 GitHub 副本。README 的零维护及秒级同步只是作者主张，iOS 同步实际委托 Apple，不能归因为本脚本的实测收益。

比较基线为手动执行 Git 提交、拉取和推送，以及仅依赖 iCloud 的 Apple 设备同步；没有同条件实测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 定时 Git 提交与推送 | 为笔记增加远端历史副本 | macOS库、Git认证；无本地变化不拉远端 |
| 首轮备份分支 | 对齐远端前保留本地Git快照 | 用户需掌握分支恢复 |
| 卸载任务 | 停止后台任务 | 可选删除Git会删除本机历史 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| macOS、Git 与 iCloud Obsidian 库 | 必需 | 本机定时任务与笔记目录 | 不能按本路径接入 |
| 远端 Git 认证与网络 | 推送必需 | 获取和推送历史 | 记录认证或网络错误 |
| 用户掌握 Git 分叉恢复 | 冲突时必需 | 处理 rebase 与备份分支 | 应停止并人工恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份测试库并检查远端 | 明确哪些文件会提交 |
| 接入 | setup 配置Git与launchd | 路径、认证和首次分支可核对 |
| 使用 | 后台每轮检查本地变化 | 有变更时提交、拉取再推送 |
| 验收 | 用户对照远端和本地提交 | 遗漏或冲突时停用并人工Git恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储与远端服务费用未知 | 库备份、认证、初始化耗时未知 | 首次对齐可能创建备份分支 |
| 持续使用 | 定时Git网络与存储量未知 | 查看诊断与提交 | 无本地变化不拉远端 |
| 失败恢复 | 额外备份空间未知 | 手工解决rebase与恢复分支 | 恢复耗时未测 |
| 退出 | 远端保留费用未知 | 卸载时选择保留历史 | 删除Git前需另存备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动历史副本 | 有本地变化时串联Git提交、拉取和推送 | 真实合格备份率及节时 |
| 跨设备同步 | iCloud由Apple承担 | 实际延迟；Git远端单独变化不能由当前跳过路径发现 |

> **思考**：[Q02](#research-q02) 已建立上游后，无本地变化会直接退出，远端单独变化不会触发拉取；跨端同步承诺因此必须收窄。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将库发现、Git 接入、定时推送和错误诊断组合成独立 Bash 工具，贡献是操作编排，AI 文件访问和 iCloud 同步不归本项目原创。

[Q02](#research-q02) 分类错误与首次备份分支便于诊断，但无变更跳过远端和提交失败成功退出会影响用户判断；不能从纯Bash结构推断零维护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 已建立上游后，无本地变化会直接退出，远端单独变化不会触发拉取；跨端同步承诺因此必须收窄。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先观察；现有作者定位为跨设备同步，而远端单独编辑后不拉取的路径会直接影响这个核心预期。熟悉 Git 的用户可以把它作为单一 Mac 编辑、向远端增加历史副本的候选，但应先在复制笔记库确认首次备份分支可恢复、认证失败可见、远端编辑能被发现，并明确 iCloud 是独立同步层。若要求多端持续双向同步，或无法自行处理 rebase 和本地历史恢复，应继续用已验收的现有同步方式。即使本次源码可完整解释流程，也没有运行目标代码或真实笔记库验收，不给持续安装建议。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持定时 Git 操作编排；完整双向同步和零维护没有得到支持。未来远端状态提示是假设。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/setup.sh、scripts/sync.sh、scripts/uninstall.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的README、setup、sync、卸载关键链路；统计来自完整组件inventory，抽读不构成全仓审计。
- 下一步：未执行目标代码、安装、测试、iCloud或宿主验收。后续应在复制库验证三种编辑方向、认证错误和备份恢复。

**分析版本**

- **仓库**：[yuukiLike/zeromd](https://github.com/yuukiLike/zeromd)
- **版本号**：未声明（[固定提交 eb09957](https://github.com/yuukiLike/zeromd/tree/eb09957079cfe80b39616fe9c0d720be5851dfe3)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将远端轮询与本地提交拆开并暴露分叉状态可能减少误判，但需要三种编辑方向的受控比较，当前未实现。

未执行目标代码、安装、测试、iCloud或宿主验收。后续应在复制库验证三种编辑方向、认证错误和备份恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1516 | — | — | 9868 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/yuukiLike/zeromd/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yuukiLike/zeromd/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：zeromd 能否以可恢复且可辨认的状态替代手工笔记 Git 同步？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为哪类笔记工作流增加了什么，而不是新的 DSH 插件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

zeromd 面向已有 macOS 与 iCloud Obsidian 笔记库、希望再保留 Git 历史和远端副本的人。输入是本地 Markdown 文件，合格结果是笔记可读且期望变更出现在指定远端提交中。README 将 AI 直接读写目录作为场景，但这种文件访问由 AI 工具和文件系统提供，zeromd 的增量是把 Git 初始化、定时任务、诊断和推送串起来；它不是 DSH 注册扩展。相对手动 git add/commit/pull/push，它减少重复执行步骤；相对只用 iCloud，它增加 Git 历史与 GitHub 副本。README 的零维护及秒级同步只是作者主张，iOS 同步实际委托 Apple，不能归因为本脚本的实测收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-43](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/README.md#L11-L43)

作者定位本地笔记、AI直接文件访问和同步职责

<details>
<summary>查看原文（33行）</summary>

````text
Local-first Obsidian multi-device sync. Zero cost. Zero signup. Zero maintenance.

## Why This Exists

The most AI-native knowledge base isn't a SaaS product with an API. It's a folder of markdown files on your disk.

And `.md` isn't done evolving — Mermaid already turned plain text into live diagrams. Interactivity might be its next chapter.

Obsidian stores everything as plain `.md` files. AI tools like Claude Code can **read and write your knowledge base directly**:

`No API` &ensp; `No plugins` &ensp; `No middleware`

```bash
# Claude Code works with your vault natively
Grep "system design" ~/vault/       # search all notes
Read ~/vault/some-note.md           # read content
Edit ~/vault/some-note.md           # modify content
Glob "**/*.md" ~/vault/             # traverse entire knowledge base
```

Compare with cloud-based solutions:

|  | Obsidian vault | Notion |
|--|---------------|--------|
| AI access | Read files directly, zero config | API + OAuth + MCP required |
| Data format | Standard markdown | Proprietary blocks, needs parsing |
| Read/write speed | Local I/O, milliseconds | Network requests + rate limits |
| Version history | Full Git log of every change | None |
| Data ownership | Files on your disk | Stored on someone else's server |

**Local files + standard format = no "integration" needed. It just works.**

zeromd simply keeps this local knowledge base in sync across all your devices.
````

</details>

**依据 2 · 源码核查**：[scripts/setup.sh:475-505](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/setup.sh#L475-L505)

安装launchd和CLI，不是DSH注册

<details>
<summary>查看原文（31行）</summary>

```text
phase 5 "Install sync daemon"

mkdir -p "$LAUNCH_AGENTS_DIR"

if launchctl list 2>/dev/null | grep -q "com.zeromd.sync"; then
    skip "launchd job already loaded"
else
    # Generate plist from template
    sed -e "s|__ZEROMD_SYNC_SCRIPT__|$SYNC_SCRIPT|g" \
        -e "s|__ZEROMD_HOME__|$HOME|g" \
        "$PLIST_TEMPLATE" > "$PLIST_TARGET"

    # Add environment variables
    /usr/libexec/PlistBuddy -c "Add :EnvironmentVariables dict" "$PLIST_TARGET" 2>/dev/null || true
    /usr/libexec/PlistBuddy -c "Set :EnvironmentVariables:ZEROMD_VAULT_DIR '$VAULT_DIR'" "$PLIST_TARGET" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Add :EnvironmentVariables:ZEROMD_VAULT_DIR string '$VAULT_DIR'" "$PLIST_TARGET"
    /usr/libexec/PlistBuddy -c "Add :EnvironmentVariables:PATH string '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin'" "$PLIST_TARGET" 2>/dev/null || true

    launchctl unload "$PLIST_TARGET" 2>/dev/null || true
    launchctl load "$PLIST_TARGET"
    ok "sync daemon installed (every 5 min)"
fi

# =========================================================================
# Phase 6: CLI install
# =========================================================================
phase 6 "Install gmd CLI"

mkdir -p "$HOME/.local/bin"
ln -sf "$SCRIPT_DIR/zeromd" "$HOME/.local/bin/gmd"
ln -sf "$SCRIPT_DIR/zeromd" "$HOME/.local/bin/md"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 定时同步能否保证两端修改都汇合？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

不能把当前实现视为无条件双向同步。正常有本地变更时会 add、commit、pull --rebase、push，并在拉取或推送失败时记录错误；但没有本地变更且没有待推送提交时，脚本直接退出，因而已建立上游后远端单独新增的提交不会在这一轮被拉取。首次接入另走 fetch 与建立上游流程，必要时先备份再将 main 对齐 origin/main。这是明确可见的条件分支，不是已复现的数据丢失。还有一个可见可靠性问题，git commit 的任意失败都被写成 Nothing to commit 并成功退出，可能把钩子或身份配置错误当成无变化；是否触发需环境验证。贡献因此应限定为以本地编辑触发的自动 Git 推送，不能承诺每五分钟完整双向合并。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync.sh:158-204](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L158-L204)

首次fetch及备份对齐路径

<details>
<summary>查看原文（47行）</summary>

```text
establish_upstream_if_needed() {
    if ! git remote get-url origin >/dev/null 2>&1; then
        return 0
    fi

    if upstream_already_established; then
        return 0
    fi

    log "First upstream sync on this machine, checking origin/$SYNC_BRANCH..."

    if ! run_git_with_classified_error "fetch" git fetch origin "$SYNC_BRANCH"; then
        exit 1
    fi

    local remote_ref="refs/remotes/origin/$SYNC_BRANCH"
    if ! git show-ref --verify --quiet "$remote_ref"; then
        mark_upstream_established
        return 0
    fi

    local local_head remote_head need_backup=0
    local_head="$(git rev-parse HEAD)"
    remote_head="$(git rev-parse "$remote_ref")"

    if [ "$local_head" = "$remote_head" ]; then
        mark_upstream_established
        return 0
    fi

    if has_local_changes; then
        need_backup=1
    fi

    if ! git merge-base --is-ancestor HEAD "$remote_ref" >/dev/null 2>&1; then
        need_backup=1
    fi

    if [ "$need_backup" -eq 1 ]; then
        create_backup_branch
    else
        log "First upstream sync: local main is behind origin/$SYNC_BRANCH, fast-forwarding."
    fi

    reset_main_to_origin
    mark_upstream_established
}
```

</details>

**依据 2 · 源码核查**：[scripts/sync.sh:265-314](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L265-L314)

无变更直接退出，提交失败被当无事，正常路径pull/push

<details>
<summary>查看原文（50行）</summary>

```text
establish_upstream_if_needed

# 工作区干净但本地有未推送 commit：补推，不要直接 skip
if ! has_local_changes && has_unpushed_commits; then
    log "Local branch is ahead of origin/$SYNC_BRANCH, pushing existing commits..."
    if ! run_git_with_classified_error "push" git push origin main; then
        exit 1
    fi

    mark_upstream_established
    record_success
    log "Existing local commits pushed successfully."
    exit 0
fi

# 检查是否有变更
if ! has_local_changes; then
    log "No changes detected, skip."
    exit 0
fi

log "Changes detected, syncing..."

# 添加所有变更（iCloud 文件锁可能导致失败）
if ! git add -A 2>> "$LOG_FILE"; then
    log "ERROR: git add failed. Likely iCloud file lock, will retry next cycle."
    record_error "git add failed (iCloud file lock)"
    exit 1
fi

# 提交
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
if ! git commit -m "auto-sync: $TIMESTAMP" --no-gpg-sign 2>> "$LOG_FILE"; then
    log "Nothing to commit after staging."
    exit 0
fi

# 拉取远程变更并 rebase
if ! run_git_with_classified_error "pull --rebase" git pull --rebase origin main; then
    exit 1
fi

# 推送
if ! run_git_with_classified_error "push" git push origin main; then
    exit 1
fi

mark_upstream_established
record_success
log "Sync completed successfully."
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 首次接入和冲突恢复由谁承担，零维护是否成立？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

用户必须已有可访问的 Obsidian iCloud 库、macOS Git 和可认证的远端；setup 安装 launchd 用户任务并写入库路径，日常 Git 则禁用交互认证。网络或认证失败会分类记录；rebase 尚未结束时停止而非自动解决。首次接入可能将本地变更提交到 zeromd-backup 分支后重置 main，备份保全的是 Git 已纳入的文件，并不构成独立离线备份。用户仍需判断冲突、恢复本地分支及检查敏感笔记是否应该推送。卸载可停任务、删本机配置并选择保留 Git；选择删除 Git 会失去本机分支和历史，因此退出前应保存备份。未采集现金费用、配置耗时、冲突频率或维护时间，不能把作者零成本口号当全周期成本结论。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/setup.sh:475-505](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/setup.sh#L475-L505)

用户任务与CLI安装

<details>
<summary>查看原文（31行）</summary>

```text
phase 5 "Install sync daemon"

mkdir -p "$LAUNCH_AGENTS_DIR"

if launchctl list 2>/dev/null | grep -q "com.zeromd.sync"; then
    skip "launchd job already loaded"
else
    # Generate plist from template
    sed -e "s|__ZEROMD_SYNC_SCRIPT__|$SYNC_SCRIPT|g" \
        -e "s|__ZEROMD_HOME__|$HOME|g" \
        "$PLIST_TEMPLATE" > "$PLIST_TARGET"

    # Add environment variables
    /usr/libexec/PlistBuddy -c "Add :EnvironmentVariables dict" "$PLIST_TARGET" 2>/dev/null || true
    /usr/libexec/PlistBuddy -c "Set :EnvironmentVariables:ZEROMD_VAULT_DIR '$VAULT_DIR'" "$PLIST_TARGET" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Add :EnvironmentVariables:ZEROMD_VAULT_DIR string '$VAULT_DIR'" "$PLIST_TARGET"
    /usr/libexec/PlistBuddy -c "Add :EnvironmentVariables:PATH string '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin'" "$PLIST_TARGET" 2>/dev/null || true

    launchctl unload "$PLIST_TARGET" 2>/dev/null || true
    launchctl load "$PLIST_TARGET"
    ok "sync daemon installed (every 5 min)"
fi

# =========================================================================
# Phase 6: CLI install
# =========================================================================
phase 6 "Install gmd CLI"

mkdir -p "$HOME/.local/bin"
ln -sf "$SCRIPT_DIR/zeromd" "$HOME/.local/bin/gmd"
ln -sf "$SCRIPT_DIR/zeromd" "$HOME/.local/bin/md"
```

</details>

**依据 2 · 源码核查**：[scripts/sync.sh:62-86](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L62-L86)

非交互Git及分类错误

<details>
<summary>查看原文（25行）</summary>

```text
run_git_with_classified_error() {
    local action="$1"
    shift

    local err_file err_output error_message
    err_file="$(mktemp)"

    if env GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND="${GIT_SSH_COMMAND:-ssh -oBatchMode=yes}" "$@" 2>"$err_file"; then
        if [ -s "$err_file" ]; then
            cat "$err_file" >> "$LOG_FILE"
        fi
        rm -f "$err_file"
        return 0
    fi

    err_output="$(cat "$err_file")"
    if [ -n "$err_output" ]; then
        printf '%s\n' "$err_output" >> "$LOG_FILE"
    fi
    rm -f "$err_file"

    error_message="$(classify_git_error "$action" "$err_output")"
    log "ERROR: $error_message"
    record_error "$error_message"
    return 1
```

</details>

**依据 3 · 源码核查**：[scripts/sync.sh:113-138](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L113-L138)

首次本地快照分支

<details>
<summary>查看原文（26行）</summary>

```text
create_backup_branch() {
    local backup_branch="zeromd-backup-$(date '+%Y%m%d-%H%M%S')"
    local snapshot_msg="backup: pre-first-sync snapshot $(date '+%Y-%m-%d %H:%M:%S')"

    if has_local_changes; then
        log "First upstream sync: snapshotting dirty worktree to $backup_branch"
        if ! git add -A 2>> "$LOG_FILE"; then
            log "ERROR: git add failed while creating first-sync backup."
            record_error "first-sync backup git add failed"
            exit 1
        fi
        if ! git commit -m "$snapshot_msg" --no-gpg-sign 2>> "$LOG_FILE"; then
            log "ERROR: git commit failed while creating first-sync backup."
            record_error "first-sync backup git commit failed"
            exit 1
        fi
    fi

    if ! git branch "$backup_branch" HEAD 2>> "$LOG_FILE"; then
        log "ERROR: failed to create backup branch $backup_branch."
        record_error "first-sync backup branch failed"
        exit 1
    fi

    log "First upstream sync: preserved local state in $backup_branch"
}
```

</details>

**依据 4 · 源码核查**：[scripts/sync.sh:258-263](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L258-L263)

rebase冲突交人工

```text
# rebase 卡死检测
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; then
    log "ERROR: Git rebase in progress. Run 'cd $VAULT_DIR && git rebase --abort' or resolve manually."
    record_error "REBASE_CONFLICT"
    exit 1
fi
```

**依据 5 · 源码核查**：[scripts/uninstall.sh:33-99](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/uninstall.sh#L33-L99)

卸载任务及可选删除Git历史

<details>
<summary>查看原文（67行）</summary>

```text
# =========================================================================
# 第 1 步：停止并移除定时任务
# =========================================================================
# 必须先 unload 再删文件
# 如果只删文件不 unload，任务会继续运行直到重启
if [ -f "$PLIST_TARGET" ]; then
    echo "停止定时同步任务..."
    launchctl unload "$PLIST_TARGET" 2>/dev/null || true
    rm "$PLIST_TARGET"
    echo "已停止并移除定时任务。"
else
    echo "定时任务不存在，跳过。"
fi

# =========================================================================
# 第 2 步：删除配置和日志
# =========================================================================
# ~/.zeromd/ 目录下有：vault-path、sync.log、launchd 日志
if [ -d "$CONFIG_DIR" ]; then
    echo ""
    echo "删除配置和日志 ($CONFIG_DIR)..."
    rm -rf "$CONFIG_DIR"
    echo "已删除。"
else
    echo "配置目录不存在，跳过。"
fi

# =========================================================================
# 第 3 步：可选 - 移除 vault 里的 Git
# =========================================================================
# 读取之前保存的 vault 路径
# 注意：如果第 2 步已经删了 ~/.zeromd，这里就读不到了
# 所以我们在第 2 步之前先读出来
echo ""
echo "是否移除 vault 中的 Git 仓库？"
echo "  输入 y：删除 .git 和 .gitignore，vault 彻底脱离 Git"
echo "  输入 n：保留 Git 历史，以后还能恢复"
read -r -p "你的选择 (y/n): " REMOVE_GIT

if [ "$REMOVE_GIT" = "y" ]; then
    if [ -n "$SAVED_VAULT_DIR" ]; then
        echo "检测到 vault 路径：$SAVED_VAULT_DIR"
        read -r -p "使用这个路径？(y/n): " USE_SAVED
        if [ "$USE_SAVED" = "y" ]; then
            VAULT_DIR="$SAVED_VAULT_DIR"
        else
            read -r -p "请输入 vault 路径: " VAULT_DIR
            VAULT_DIR="${VAULT_DIR/#\~/$HOME}"
        fi
    else
        read -r -p "请输入 vault 路径: " VAULT_DIR
        VAULT_DIR="${VAULT_DIR/#\~/$HOME}"
    fi

    if [ -d "$VAULT_DIR/.git" ]; then
        rm -rf "$VAULT_DIR/.git"
        echo "已删除 $VAULT_DIR/.git"
    else
        echo "$VAULT_DIR/.git 不存在，跳过。"
    fi

    if [ -f "$VAULT_DIR/.gitignore" ]; then
        rm "$VAULT_DIR/.gitignore"
        echo "已删除 $VAULT_DIR/.gitignore"
    else
        echo "$VAULT_DIR/.gitignore 不存在，跳过。"
    fi
```

</details>

#### 缺口

- 没有同任务的手动Git与脚本长期同步对照
  **影响**：无法量化节时、冲突率或每次合格备份成本
  **进一步探讨**：对测试笔记库记录完整一周任务量、失败次数和人工恢复时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少用户将远端副本误认为完整同步的风险？

**研究主题**：新假设与验证

#### 完整回答

由无本地变更即退出的机制，可以推导一个未验证设计假设：把“轮询远端”与“提交本地修改”分开，并显式报告本地、远端与分叉状态，可能比单一最近同步时间更容易发现遗漏。相对当前仅在本地变更后拉取，它增加每轮远端检查与状态分类，代价是网络请求和离线告警。最小验证在隔离笔记库安排远端单独编辑、本地单独编辑和双端冲突，比较是否最终达到预期提交且提示准确；若新增状态提示仍漏掉远端变化，或者明显增加无法处置的告警而不改善发现时间，该假设应被否定。它尚未实现，也不意味着当前所有同步失败。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync.sh:267-314](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L267-L314)

由跳过分支和现有错误记录推导，当前不包含该新设计

<details>
<summary>查看原文（48行）</summary>

```text
# 工作区干净但本地有未推送 commit：补推，不要直接 skip
if ! has_local_changes && has_unpushed_commits; then
    log "Local branch is ahead of origin/$SYNC_BRANCH, pushing existing commits..."
    if ! run_git_with_classified_error "push" git push origin main; then
        exit 1
    fi

    mark_upstream_established
    record_success
    log "Existing local commits pushed successfully."
    exit 0
fi

# 检查是否有变更
if ! has_local_changes; then
    log "No changes detected, skip."
    exit 0
fi

log "Changes detected, syncing..."

# 添加所有变更（iCloud 文件锁可能导致失败）
if ! git add -A 2>> "$LOG_FILE"; then
    log "ERROR: git add failed. Likely iCloud file lock, will retry next cycle."
    record_error "git add failed (iCloud file lock)"
    exit 1
fi

# 提交
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
if ! git commit -m "auto-sync: $TIMESTAMP" --no-gpg-sign 2>> "$LOG_FILE"; then
    log "Nothing to commit after staging."
    exit 0
fi

# 拉取远程变更并 rebase
if ! run_git_with_classified_error "pull --rebase" git pull --rebase origin main; then
    exit 1
fi

# 推送
if ! run_git_with_classified_error "push" git push origin main; then
    exit 1
fi

mark_upstream_established
record_success
log "Sync completed successfully."
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下可以试用，何时应退出？

**研究主题**：采用判断

#### 完整回答

建议先观察；现有作者定位为跨设备同步，而远端单独编辑后不拉取的路径会直接影响这个核心预期。熟悉 Git 的用户可以把它作为单一 Mac 编辑、向远端增加历史副本的候选，但应先在复制笔记库确认首次备份分支可恢复、认证失败可见、远端编辑能被发现，并明确 iCloud 是独立同步层。若要求多端持续双向同步，或无法自行处理 rebase 和本地历史恢复，应继续用已验收的现有同步方式。即使本次源码可完整解释流程，也没有运行目标代码或真实笔记库验收，不给持续安装建议。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync.sh:179-204](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L179-L204)

首轮对齐及备份需要用户理解

<details>
<summary>查看原文（26行）</summary>

```text
    local local_head remote_head need_backup=0
    local_head="$(git rev-parse HEAD)"
    remote_head="$(git rev-parse "$remote_ref")"

    if [ "$local_head" = "$remote_head" ]; then
        mark_upstream_established
        return 0
    fi

    if has_local_changes; then
        need_backup=1
    fi

    if ! git merge-base --is-ancestor HEAD "$remote_ref" >/dev/null 2>&1; then
        need_backup=1
    fi

    if [ "$need_backup" -eq 1 ]; then
        create_backup_branch
    else
        log "First upstream sync: local main is behind origin/$SYNC_BRANCH, fast-forwarding."
    fi

    reset_main_to_origin
    mark_upstream_established
}
```

</details>

**依据 2 · 源码核查**：[scripts/sync.sh:280-314](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/scripts/sync.sh#L280-L314)

远端轮询限制决定采用边界

<details>
<summary>查看原文（35行）</summary>

```text
# 检查是否有变更
if ! has_local_changes; then
    log "No changes detected, skip."
    exit 0
fi

log "Changes detected, syncing..."

# 添加所有变更（iCloud 文件锁可能导致失败）
if ! git add -A 2>> "$LOG_FILE"; then
    log "ERROR: git add failed. Likely iCloud file lock, will retry next cycle."
    record_error "git add failed (iCloud file lock)"
    exit 1
fi

# 提交
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
if ! git commit -m "auto-sync: $TIMESTAMP" --no-gpg-sign 2>> "$LOG_FILE"; then
    log "Nothing to commit after staging."
    exit 0
fi

# 拉取远程变更并 rebase
if ! run_git_with_classified_error "pull --rebase" git pull --rebase origin main; then
    exit 1
fi

# 推送
if ! run_git_with_classified_error "push" git push origin main; then
    exit 1
fi

mark_upstream_established
record_success
log "Sync completed successfully."
```

</details>

**依据 3 · 作者声明**：[README.md:109-119](https://github.com/yuukiLike/zeromd/blob/eb09957079cfe80b39616fe9c0d720be5851dfe3/README.md#L109-L119)

作者验证路径与新Mac说明

<details>
<summary>查看原文（11行）</summary>

````text
## How Sync Works

**iCloud** (macOS ↔ iOS): Handled by Apple automatically. Vault lives at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/<vault>/`. Syncs in seconds.

**Git** (macOS ↔ GitHub): A launchd job runs sync.sh every 5 minutes:

```mermaid
flowchart TD
    subgraph trigger ["⏰ Every 5 min — launchd"]
        check{"📂<br/>Any changes?"}
    end
````

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
