# Codex Switch

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d59d3df](https://github.com/kuangre123/codex-switch/tree/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974)

<!-- BEGIN META -->
[![GitHub ★ 75](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=75&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kuangre123/codex-switch)
<!-- END META -->

> **功能**：独立macOS配置工具，切换Codex供应商、桥接Responses与Chat并管理本地代理。

> **亮点**：[Q01](#research-q01) 双provider配置及可达GUI探测；[Q03](#research-q03) 本地协议转换。

> **主要限制**：[Q02](#research-q02) 正常GUI重启批量改历史provider/model，与README不符；[Q04](#research-q04) 卸载不停止持久服务。

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
  - [Q01 · 真实保存入口如何切换官方与自定义？](#detail-section-11)
  - [Q02 · 正常GUI切换是否真的不动历史归属？](#detail-section-12)
  - [Q03 · 本地适配器是否透明并有可靠停止边界？](#detail-section-13)
  - [Q04 · 代理修复、后台服务与卸载怎样退出？](#detail-section-14)
  - [Q05 · 保存前预览历史重标记能否减少误路由？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿意备份配置和历史、核对第三方路由的本地Codex用户。

手改auth/config和自行运行协议代理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 配置切换 | 保留双provider并选默认 | GUI重启会重标历史 |
| 协议适配 | Responses优先与可选Chat | 清字段reasoning及工具边界 |
| 代理管理 | shell及launchd持久配置 | 影响用户全局环境 |
| 历史修复 | 旧message ID定向备份修复 | 不可当无历史修改 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| macOS Codex/Python | 正常GUI必需 | 配置和应用重启 | 版本兼容待核 |
| 完整Xcode | 源码构建需要 | SwiftUI通用程序 | 非目标运行证据 |
| launchctl及用户目录写权限 | 服务必需 | adapter和代理持久化 | 关GUI仍可运行 |
| 第三方API key | 自定义需要 | probe和模型请求 | 完整历史可能出站 |
| 多类独立备份 | 切换前必要 | 配置/凭据/SQLite/rollout/env | 三文件恢复不够 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 复制CODEX_HOME备份数据库rollout/env与plist | 真实任务停止 |
| 核查 | 查看GUI固定restart及历史改两列 | 接受再用测试账户 |
| 试验 | probe unverified与协议工具对照 | 成功HTTP非完整兼容 |
| 退出 | bootout两个Agent核无监听并恢复env/库 | 删App不能代替退出 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 构建下载与API探测费未知 | 备份历史及查实际路由 | 不承诺签名实测 |
| 持续 | 重试/长上下文API费 | 维护协议有损和模型兼容 | 断线不证明上游停止 |
| 恢复 | 多类备份含secret占盘 | 修数据库/rollout及全局env | 无跨文件事务 |
| 退出 | 服务日志和凭据残留 | 撤销测试key并bootout | uninstall不覆盖 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配置集中 | 双provider与明确probe分支 | 真实保存兼容 |
| 协议适配 | passthrough清理及chat转换 | 工具/多模态等价性 |
| 历史处理 | 备份与ID修复、两列重标记 | 实际继续会话目的地 |

> **思考**：[Q02](#research-q02) 正常GUI重启批量改历史provider/model，与README不符；[Q04](#research-q04) 卸载不停止持久服务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 双provider配置及可达GUI探测；[Q03](#research-q03) 本地协议转换。

[Q02](#research-q02) 不得沿用“归属不变”，源码可达重启会同时重标provider/model。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 正常GUI重启批量改历史provider/model，与README不符；[Q04](#research-q04) 卸载不停止持久服务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 独立副本先核历史和退出，不在生产历史直接试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查Swift可达入口和Python核心，未运行Codex或签名发布物。

- 已检查：作者 README、包清单、源码路径 README.md、app/CodexSwitchApp.swift、scripts/package-app.sh、scripts/uninstall.sh、src/codex_switch/cli.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根macOS独立工具及Python本地adapter；不属于DSH宿主插件。
- 下一步：副本核历史列/ID、探测暂不可验、上游工具和完整退出，未执行目标。

**分析版本**

- **仓库**：[kuangre123/codex-switch](https://github.com/kuangre123/codex-switch)
- **版本号**：未声明（[固定提交 d59d3df](https://github.com/kuangre123/codex-switch/tree/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 保存前历史改动预览能否减少误路由需对照。

副本核历史列/ID、探测暂不可验、上游工具和完整退出，未执行目标。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 675 | — | — | 5666 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/kuangre123/codex-switch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/kuangre123/codex-switch/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/kuangre123/codex-switch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Codex Switch怎样切换配置与桥接协议，历史修改、凭据和退出的实际副作用是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实保存入口如何切换官方与自定义？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根交付是macOS SwiftUI配Python CLI的独立配置工具，entry_type=tool，不是DSH插件。Swift保存可达configure --restart-codex，自定义还传--probe，replacement key经stdin避免进进程参数。configure保存官方与custom两套provider/profile，并选顶层默认；API key来自stdin/参数/现auth/工具state，写入state与auth，provider_base_url总是本地adapter，即使关闭Chat桥接也走adapter Responses passthrough，不是README所称原生接口直连。

探测先responses再chat，只收HTTP200即ok，不验证完整工具/流能力；两处均明确4xx才rejected中止，网络/429/5xx为unverified警告继续保存，不能当“都不通绝不保存”。探测携现有key到用户base URL、可产生小推理费。操作先quit Codex并等最多15秒未退出则拒写，再备份auth/config/catalog，按保留登录token顺序分别写state/auth，删旧catalog、启动LaunchAgent、最后写config/proxy；单文件temp600 replace并非多文件原子事务，后续失败可已改变登录。

#### 证据与依据

**依据 1 · 源码核查**：[app/CodexSwitchApp.swift:311-350](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/app/CodexSwitchApp.swift#L311-L350)

GUI实际调用和stdin

<details>
<summary>查看原文（40行）</summary>

```text
    private func configureCodex(baseURL: String, customModel: String, displayName: String, officialModel: String, mode: ProviderMode, useChatAdapter: Bool, skipLogin: Bool, reasoningEffort: String, replacementKey: String) {
        let defaultProvider = mode == .custom ? "custom" : "openai"
        var arguments = [
            "configure",
            "--base-url", baseURL,
            "--custom-model", customModel,
            "--custom-model-name", displayName,
            "--official-model", officialModel,
            "--default-provider", defaultProvider,
            "--reasoning-effort", reasoningEffort,
            "--restart-codex",
        ]
        if useChatAdapter {
            arguments.append("--chat-adapter")
        }
        if skipLogin {
            arguments.append("--skip-login")
        }
        if mode == .custom {
            // Smart routing: verify the custom API responds before saving, so a
            // wrong endpoint/model/key fails fast with a clear message instead of
            // a broken Codex session.
            arguments.append("--probe")
        }
        var switchInput: String?
        if !replacementKey.isEmpty {
            arguments.append("--api-key-stdin")
            switchInput = replacementKey + "\n"
        }
        let configured = run(arguments, standardInput: switchInput)
        let status = run(["status"])
        DispatchQueue.main.async {
            self.output = configured.output
            self.statusValues = self.parse(status.output)
            self.isBusy = false
            self.busyOperation = nil
            self.completedTarget = .codex
            self.completedMode = mode
            if configured.status == 0 {
                self.replacementAPIKey = ""
```

</details>

**依据 2 · 源码核查**：[src/codex_switch/cli.py:2794-2852](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2794-L2852)

probe及凭据来源

<details>
<summary>查看原文（59行）</summary>

```text
def configure_codex(args: argparse.Namespace) -> int:
    home = codex_home()
    auth_path = home / "auth.json"
    config_path = home / "config.toml"
    catalog_path = model_catalog_path(home)
    backup_dir = home / "backups"

    auth = load_auth(auth_path)
    state = load_state(home)
    remember_current_auth(home, auth, state)
    base_url = args.base_url or effective_setting(state, "local_base_url", DEFAULT_BASE_URL)
    requested_model = args.custom_model or args.model or upstream_model_for_state(state, DEFAULT_UPSTREAM_MODEL)
    display_name = args.custom_model_name or effective_setting(state, "local_model_display_name", requested_model)
    official_model = resolve_official_model(home, args.official_model or effective_setting(state, "official_model", ""), warn=True)
    default_provider = args.default_provider or effective_setting(state, "default_provider", "openai")
    if default_provider not in {"openai", CUSTOM_PROVIDER_ID}:
        raise SwitchError("default_provider must be openai or custom")
    reasoning_effort = getattr(args, "reasoning_effort", None) or reasoning_effort_for_state(state)
    custom_model = args.custom_model_slug or custom_slug_for_upstream(home, requested_model, official_model)
    ensure_distinct_custom_model(home, custom_model, official_model)
    if not display_name:
        display_name = requested_model
    cached_key = state.get("local_api_key")
    stdin_key = ""
    if getattr(args, "api_key_stdin", False):
        stdin_key = sys.stdin.readline().strip()
        if not stdin_key:
            raise SwitchError("API key from stdin was empty.")
    api_key = stdin_key or args.api_key or str(auth.get("OPENAI_API_KEY") or "").strip()
    if not api_key and isinstance(cached_key, str):
        api_key = cached_key.strip()
    if not api_key:
        raise SwitchError("No API key found. Re-run with --api-key, or login once with `codex login --with-api-key`.")

    # Smart routing: at save time, probe the custom upstream so the user gets
    # immediate feedback instead of a broken Codex session. Only a clear
    # rejection (endpoint/model/key wrong on both protocols) blocks the save;
    # transient errors (rate limit, 5xx, can't connect) just warn and proceed,
    # and the probe never crashes the save.
    if getattr(args, "probe", False) and default_provider == CUSTOM_PROVIDER_ID:
        status, protocol, detail = probe_custom_upstream(base_url, requested_model, api_key)
        if status == "rejected":
            raise SwitchError(
                "自定义 API 验证失败，请检查接入点、模型 ID 和 API Key。\n"
                f"{detail}"
            )
        if status == "unverified":
            print("probe_warn: 暂时无法验证自定义 API（可能限流或临时不可用），已继续保存。")
            print(detail)
        else:
            print(f"probe_ok: {protocol}")

    codex_stopped = stop_codex_before_switch(args)
    backup_file(auth_path, backup_dir)
    backup_file(config_path, backup_dir)
    backup_file(catalog_path, backup_dir)
    state["local_api_key"] = api_key
    state["local_base_url"] = base_url
    state["local_model"] = custom_model
```

</details>

**依据 3 · 源码核查**：[src/codex_switch/cli.py:2853-2910](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2853-L2910)

写序和本地adapter

<details>
<summary>查看原文（58行）</summary>

```text
    state["local_upstream_model"] = requested_model
    state["local_model_display_name"] = display_name
    state["official_model"] = official_model
    state["default_provider"] = default_provider
    if getattr(args, "chat_adapter", False):
        state["chat_adapter"] = "true"
    else:
        state["chat_adapter"] = "false"
    state["adapter_upstream_base_url"] = base_url
    state["adapter_upstream_model"] = requested_model
    provider_base_url = DEFAULT_ADAPTER_BASE_URL
    skip_login = getattr(args, "skip_login", False)
    state["skip_login"] = "true" if skip_login else "false"
    state["local_reasoning_effort"] = reasoning_effort
    # A custom default must authenticate as api-key regardless of the toggle:
    # the new Codex rejects custom models on a ChatGPT account. Official default
    # keeps the ChatGPT login unless the user explicitly bypasses it.
    use_api_key_auth = skip_login or default_provider == CUSTOM_PROVIDER_ID

    auth["OPENAI_API_KEY"] = api_key
    # Write ordering matters: whichever file still holds the login must be
    # written second, so a crash between the two writes never loses it (the
    # next restore prefers live auth.json tokens and drops the stash).
    if use_api_key_auth:
        stash_login_tokens(auth, state)
        auth["auth_mode"] = "api-key"
        auth.pop("tokens", None)
        save_state(home, state)
        write_auth(auth_path, auth)
    else:
        auth["auth_mode"] = "chatgpt"
        restored_login = restore_login_tokens(auth, state)
        write_auth(auth_path, auth)
        save_state(home, state)
        if restored_login:
            print("Restored the stashed ChatGPT login; no re-login needed.")
    # cc-switch lesson: never write a custom model_catalog_json. It REPLACES
    # Codex's built-in catalog (shrinking the official model list and breaking
    # model resolution), and a single malformed catalog makes Codex fail to load
    # config -> the conversation list disappears. Switching must not retag saved
    # conversations; only the one-time legacy message-ID repair may edit rollouts.
    if catalog_path.exists():
        catalog_path.unlink()
    adapter_plist = start_adapter_launch_agent(home)
    config = rewrite_config_for_parallel(
        read_config(config_path),
        provider_base_url,
        official_model,
        custom_model,
        api_key,
        None,
        default_provider,
        skip_login,
        reasoning_effort,
    )
    atomic_write(config_path, config, 0o600)
    apply_proxy_for_provider(home, default_provider, state)
    if not getattr(args, "restart_codex", False):
```

</details>

**依据 4 · 源码核查**：[src/codex_switch/cli.py:1409-1433](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1409-L1433)

探测明确拒绝/暂不可验

<details>
<summary>查看原文（25行）</summary>

```text
def probe_custom_upstream(base_url: str, model: str, api_key: str, timeout: float = 20.0) -> tuple[str, str, str]:
    """Probe the custom API at save time. Try the Codex-native Responses API
    first, then Chat Completions. Returns (status, protocol, detail) where
    status is "ok" (reachable), "rejected" (endpoint/model/key clearly wrong on
    both protocols), or "unverified" (transient / couldn't reach — don't block)."""
    code1, detail1 = _probe_endpoint(
        responses_url(base_url),
        {"model": model, "input": "hi", "max_output_tokens": 16, "stream": False},
        api_key,
        timeout,
    )
    if code1 == 200:
        return "ok", "responses", "ok"
    code2, detail2 = _probe_endpoint(
        chat_completions_url(base_url),
        {"model": model, "messages": [{"role": "user", "content": "hi"}], "max_tokens": 16, "stream": False},
        api_key,
        timeout,
    )
    if code2 == 200:
        return "ok", "chat", "ok"
    detail = f"/responses → {detail1}\n/chat/completions → {detail2}"
    if code1 in _PROBE_CONFIG_ERROR_CODES and code2 in _PROBE_CONFIG_ERROR_CODES:
        return "rejected", "", detail
    return "unverified", "", detail
```

</details>

**依据 5 · 源码核查**：[src/codex_switch/cli.py:2473-2497](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2473-L2497)

先等Codex退出

<details>
<summary>查看原文（25行）</summary>

```text
def stop_codex_before_switch(args: argparse.Namespace) -> bool:
    if not getattr(args, "restart_codex", False):
        return False
    subprocess.run(
        ["osascript", "-e", 'tell application "Codex" to quit'],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    # Relaunching while the old process is still terminating makes
    # LaunchServices fail with -609 (connectionInvalid). A fixed pause is not
    # enough: a Codex with hundreds of threads takes several seconds to flush
    # state on quit, so poll until the process is actually gone (up to ~15s).
    for _ in range(30):
        probe = subprocess.run(
            ["pgrep", "-x", "Codex"],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        if probe.returncode != 0:
            return True
        time.sleep(0.5)
    raise SwitchError("Codex did not quit within 15 seconds; configuration was not changed. Please close Codex and retry.")

```

</details>

**依据 6 · 源码核查**：[src/codex_switch/cli.py:233-263](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L233-L263)

单文件备份和替换

<details>
<summary>查看原文（31行）</summary>

```text
def backup_file(path: Path, backup_dir: Path) -> Path | None:
    if not path.exists():
        return None
    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    target = backup_dir / f"{path.name}.{timestamp}.bak"
    counter = 1
    while target.exists():
        target = backup_dir / f"{path.name}.{timestamp}.{counter}.bak"
        counter += 1
    shutil.copy2(path, target)
    return target


def atomic_write(path: Path, content: str, mode: int = 0o600) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=str(path.parent), text=True)
    tmp_path = Path(tmp_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(content)
        os.chmod(tmp_path, mode)
        os.replace(tmp_path, path)
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


def write_auth(auth_path: Path, auth: dict[str, object]) -> None:
    atomic_write(auth_path, json.dumps(auth, indent=2, sort_keys=True) + "\n", 0o600)

```

</details>

#### 缺口

- 当前Codex版本配置兼容与真实供应商工具流未运行
  **影响**：保存成功不证明完整路由，失败不代表无已写变化
  **进一步探讨**：独立CODEX_HOME副本测试探测unverified及中途写失败readback

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 正常GUI切换是否真的不动历史归属？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README说不重写历史provider/model，但实际GUI总传restart，restart_codex在修复旧ID后无条件调用sync_thread_provider_tags。该函数备份匹配SQLite DB后UPDATE threads SET model_provider=?, model=? WHERE不同，既改provider也改model，并非只改顶层默认或只provider。正文不变仍不等于归属不变，旧会话继续请求可能携全历史去当前供应商，用户需明确这一行为。数据库失败只warn不终止切换；重启成功后校验只读config的provider/model，不是实际新进程请求确认。

旧适配器ID修复扫描rollout中response_item/message的item_前缀，先逐文件备份再改msg_，保留mtime并置一次标记，非目标行保留；读错误不置完成标记可下次再扫。该修复有窄条件，但仍实改历史文件，不能声称完全不碰会话。切换无restart时也调用修复，CLI调用者自己承担并发写风险。需独立备份SQLite及rollout，不能只恢复auth/config就认为历史回退完成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-47](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/README.md#L30-L47)

历史归属不变作者主张

<details>
<summary>查看原文（18行）</summary>

```text
- **国内大模型快速预设**：DeepSeek、Kimi、智谱 GLM、通义千问、豆包（火山引擎）、百度文心、MiniMax、阶跃星辰 StepFun，以及「第三方 / 中转 API（手动填写）」——选完自动填好接入点和模型，只需粘贴 API Key。
- **自定义 / 第三方供应商卡片**：支持任意 OpenAI 兼容的第三方 / 中转 API，填接入点 + 模型 ID + Key 即可。
- **Chat 适配器**：接口只支持 `/chat/completions`（如 DeepSeek/Kimi/千问等）时，在本地启动一个代理，自动把 Codex 的 Responses 请求转成 Chat Completions；原生支持 `/responses` 的接口则直连。
- **保存时智能探测**：保存前先用你的 Key 试探接入点（先 `/responses` 再 `/chat/completions`），都不通就当场报错「请检查设置」，不会留下一个用不了的会话。
- **跳过登录**：可选绕过 ChatGPT OAuth，用 API‑Key 模式。
- **代理修复**：一键把本机 HTTP/mixed 代理写入 Codex shell 环境、当前 macOS `launchd` 环境和登录后恢复用的 LaunchAgent，修复官方模式下新任务反复 Reconnecting。代理**只在官方 OpenAI 模式生效**：切到自定义 API 时自动关闭（自定义链路走本地 adapter + 国内直连中转，经代理反而会断流），切回官方时按你的设置自动恢复。
- **CLI 通用**：同时写入 `[profiles.ccswitch]`（自定义）和 `[profiles.official]`（官方），终端里 `codex` / `codex-official` 直接用。
- 自动备份到 `~/.codex/backups`；工具栏自动检查 GitHub 新版本；保存后自动重启 Codex 让配置生效。

## 切换原理 / How switching works

**provider 切换工具只应写实时配置文件，绝不动会话数据**。

- 选「自定义 API」→ 顶层 `model_provider = "custom"`，Codex 走你的自定义 provider。
- 选「官方 OpenAI」→ 顶层 `model_provider = "openai"`，Codex 走官方，用其内置模型目录（官方模型列表完整）。
- 官方模型下拉列表读取本机 Codex 的 `models_cache.json`；已保存的模型不在当前可见目录时，保存会自动改用目录中优先级最高的官方模型，并同步配置与任务恢复模型。
- 两个 provider 段和 CLI profiles 始终保留；切换只改顶层默认 + auth。
- **不写自定义模型目录（model_catalog_json）** —— 早期版本写过，但它会替换 Codex 内置目录、还容易让对话列表加载失败，已彻底移除。
```

</details>

**依据 2 · 源码核查**：[app/CodexSwitchApp.swift:313-322](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/app/CodexSwitchApp.swift#L313-L322)

GUI重启可达

<details>
<summary>查看原文（10行）</summary>

```text
        var arguments = [
            "configure",
            "--base-url", baseURL,
            "--custom-model", customModel,
            "--custom-model-name", displayName,
            "--official-model", officialModel,
            "--default-provider", defaultProvider,
            "--reasoning-effort", reasoningEffort,
            "--restart-codex",
        ]
```

</details>

**依据 3 · 源码核查**：[src/codex_switch/cli.py:2434-2470](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2434-L2470)

实际改两列

<details>
<summary>查看原文（37行）</summary>

```text
def sync_thread_provider_tags(home: Path, provider: str, model: str) -> int:
    """Retag conversations to the active provider AND model after a switch.

    The merged ChatGPT.app filters the sidebar by model_provider (verified
    2026-07: with the custom provider active every openai-tagged conversation
    vanishes, and vice versa), so retagging the provider keeps history visible.
    But provider and model must move together: a custom-model row left tagged
    to the openai provider (or vice versa) is an invalid pair the new Codex
    rejects with "model … is not supported when using Codex with a ChatGPT
    account". Custom models also can't be detected by name (slugs like
    stealth/ox-alpha carry no codex-switch/ prefix), so both columns are set
    to the active pair — a continued conversation uses the active model anyway.
    Only sqlite is touched (the source Codex reads for a thread's model);
    rollout files are never rewritten (that corrupted message IDs before
    0.7.13). Databases are backed up first, and failures never abort the switch.
    """
    updated = 0
    for db_path in thread_database_paths(home):
        try:
            backup_sqlite_database(
                db_path,
                home / "backups_state" / "provider-tag" / datetime.now().strftime("%Y%m%d-%H%M%S"),
            )
            connection = sqlite3.connect(str(db_path), timeout=5)
            try:
                with connection:
                    cursor = connection.execute(
                        "UPDATE threads SET model_provider = ?, model = ? "
                        "WHERE model_provider != ? OR model != ?",
                        (provider, model, provider, model),
                    )
                    updated += cursor.rowcount
            finally:
                connection.close()
        except sqlite3.Error as exc:
            print(f"provider_tag_warn: {db_path}: {exc}")
    return updated
```

</details>

**依据 4 · 源码核查**：[src/codex_switch/cli.py:2499-2547](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2499-L2547)

重启调用retag及只查配置

<details>
<summary>查看原文（49行）</summary>

```text
def restart_codex(
    args: argparse.Namespace,
    home: Path,
    expected_provider: str,
    expected_model: str,
    already_stopped: bool = False,
) -> None:
    if not getattr(args, "restart_codex", False):
        return
    if not already_stopped:
        stop_codex_before_switch(args)
    # Repair after Codex has flushed and closed its rollout files. The repair is
    # intentionally narrow and backed up; doing it here avoids racing a live
    # desktop process during a normal app-driven switch.
    repair_legacy_message_ids_and_report(home)
    # The merged ChatGPT.app filters the conversation sidebar by
    # model_provider (unlike the old standalone desktop), so retag the sqlite
    # rows to the newly selected provider while Codex is stopped — otherwise
    # the whole history vanishes from the list after a switch. Only the
    # provider column changes; conversation content, per-thread models, and
    # rollout files stay untouched (see sync_thread_provider_tags).
    tagged = sync_thread_provider_tags(home, expected_provider, expected_model)
    if tagged:
        print(f"Tagged {tagged} conversation(s) to {expected_provider}/{expected_model} so they stay listed and usable.")
    launched = None
    for attempt in range(3):
        if attempt:
            time.sleep(2.0)
        launched = subprocess.run(["open", "-a", "Codex"], check=False, capture_output=True, text=True)
        if launched.returncode == 0:
            break
    if launched is None or launched.returncode != 0:
        # The switch itself already succeeded by this point; a failed relaunch
        # must not report the whole operation as failed.
        print("restart_warn: 配置已保存成功，但自动重启 Codex 失败，请手动打开 Codex.app。")
        detail = ((launched.stderr or launched.stdout or "").strip() if launched is not None else "")
        if detail:
            print(detail)
        return
    time.sleep(RESTART_SETTLE_SECONDS)
    config = read_config(home / "config.toml")
    actual_provider = configured_provider(config)
    actual_model = configured_model(config)
    if actual_provider != expected_provider or actual_model != expected_model:
        raise SwitchError(
            f"Codex restarted with provider/model {actual_provider}/{actual_model}, "
            f"not {expected_provider}/{expected_model}."
        )
    print("Restarted Codex.app to reload the selected provider.")
```

</details>

**依据 5 · 源码核查**：[src/codex_switch/cli.py:1027-1113](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1027-L1113)

ID修复与备份

<details>
<summary>查看原文（87行）</summary>

```text
def repair_legacy_message_ids(home: Path) -> tuple[int, int, Path | None]:
    """Repair message IDs emitted by Codex Switch versions before 0.7.13.

    The chat-stream bridge accidentally used ``item_`` for assistant messages.
    Codex persists those IDs in rollout files and later includes them when a
    conversation is resumed. Native Responses endpoints require message IDs to
    start with ``msg_``, so switching that conversation to an official/native
    provider fails before the model can answer.

    Only the invalid ID prefix is changed; message content and conversation
    metadata are left untouched. Every changed rollout is backed up first.
    """
    state = load_state(home)
    if state.get(MESSAGE_ID_REPAIR_STATE_KEY) == MESSAGE_ID_REPAIR_VERSION:
        return 0, 0, None

    changed_files = 0
    changed_ids = 0
    backup_root: Path | None = None
    scan_complete = True
    for path in rollout_files(home):
        try:
            if path.stat().st_size == 0:
                continue
            with path.open("rb") as handle, mmap.mmap(handle.fileno(), 0, access=mmap.ACCESS_READ) as mapped:
                if (
                    mapped.find(b'"item_') < 0
                    or mapped.find(b'"response_item"') < 0
                    or mapped.find(b'"message"') < 0
                ):
                    continue
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError, ValueError):
            scan_complete = False
            continue
        # Most installations have hundreds of large rollouts but only a small
        # number written by the affected adapter. The memory-mapped prefilter
        # avoids decoding unaffected files, and the one-time migration marker
        # skips all rollout I/O on subsequent switches.
        output: list[str] = []
        file_changes = 0
        for segment in text.splitlines(keepends=True):
            line = segment[:-1] if segment.endswith("\n") else segment
            ending = "\n" if segment.endswith("\n") else ""
            if line.endswith("\r"):
                line = line[:-1]
                ending = "\r\n"
            next_line = line
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                output.append(segment)
                continue
            payload = record.get("payload")
            if (
                record.get("type") == "response_item"
                and isinstance(payload, dict)
                and payload.get("type") == "message"
                and isinstance(payload.get("id"), str)
                and payload["id"].startswith("item_")
            ):
                payload["id"] = "msg_" + payload["id"][len("item_"):]
                next_line = json.dumps(record, ensure_ascii=False, separators=(",", ":"))
                file_changes += 1
            output.append(next_line + ending)
        if not file_changes:
            continue
        if backup_root is None:
            backup_root = home / "backups_state" / "message-id-repair" / datetime.now().strftime("%Y%m%d-%H%M%S")
            suffix = 1
            while backup_root.exists():
                backup_root = backup_root.with_name(f"{backup_root.name}-{suffix}")
                suffix += 1
        relative = path.relative_to(home)
        backup_path = backup_root / relative
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup_path)
        original_stat = path.stat()
        atomic_write(path, "".join(output), stat.S_IMODE(original_stat.st_mode) or 0o600)
        os.utime(path, (original_stat.st_atime, original_stat.st_mtime))
        changed_files += 1
        changed_ids += file_changes
    if scan_complete:
        state = load_state(home)
        state[MESSAGE_ID_REPAIR_STATE_KEY] = MESSAGE_ID_REPAIR_VERSION
        save_state(home, state)
    return changed_files, changed_ids, backup_root
```

</details>

**依据 6 · 源码核查**：[src/codex_switch/cli.py:2906-2912](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2906-L2912)

无restart也修ID

```text
        reasoning_effort,
    )
    atomic_write(config_path, config, 0o600)
    apply_proxy_for_provider(home, default_provider, state)
    if not getattr(args, "restart_codex", False):
        repair_legacy_message_ids_and_report(home)

```

#### 缺口

- 当前Codex实际读取数据库及历史继续请求未验证
  **影响**：可能改变历史模型路由与外传目的地，不可据README承诺无修改
  **进一步探讨**：只副本库对比列值与rollout，再逐会话确认目标供应商

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地适配器是否透明并有可靠停止边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

HTTP默认loopback:17638但serve可传host，POST handler无Authorization或Origin验证，用Content-Length直接读body无明确上限，转发时忽略调用方token而用state/auth存key。因此回环降低暴露面，不是本机其他进程的授权边界；不得监听公网。Responses passthrough会分层删除store/include/cache/metadata及reasoning/text/truncation以兼容4xx，还规范message ID并丢reasoning条目，故非字节透明。Chat桥接只搬文本、function tools/call/output和少量采样字段，additional_tools、完整多模态/Responses状态并未等价保留。

Responses失败可在Chat开关下回退chat，chat连接前最多3试且HTTP错误不重试，但发送失败不能证明供应商未收到或未计费。stream长urlopen timeout1800秒，未见客户端disconnect对应上游abort控制器；写SSE失败可能终止本地handler但不能证明远端取消。纯passthrough开关应先验工具和reasoning需求，不把合成response.completed或HTTP200当任务正确；错误原文可能回UI，日志和凭据副本需保护。

#### 证据与依据

**依据 1 · 源码核查**：[src/codex_switch/cli.py:1594-1663](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1594-L1663)

handler无认证且存key

<details>
<summary>查看原文（70行）</summary>

```text
class AdapterServer(http.server.ThreadingHTTPServer):
    def __init__(self, server_address: tuple[str, int], home: Path):
        super().__init__(server_address, AdapterHandler)
        self.home = home


class AdapterHandler(http.server.BaseHTTPRequestHandler):
    server: AdapterServer

    def log_message(self, format: str, *args: object) -> None:
        return

    def send_json(self, status: int, payload: dict[str, object]) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:
        if self.path in {"/health", "/v1/health"}:
            self.send_json(200, {"status": "ok"})
            return
        if self.path in {"/models", "/v1/models"}:
            self._serve_models()
            return
        self.send_json(404, {"error": {"message": "not found"}})

    def _serve_models(self) -> None:
        state = load_state(self.server.home)
        model = effective_setting(state, "local_model", DEFAULT_CUSTOM_MODEL)
        display = effective_setting(state, "local_model_display_name", model)
        ts = int(time.time())
        self.send_json(200, {
            "object": "list",
            "data": [
                {
                    "id": model,
                    "object": "model",
                    "created": ts,
                    "owned_by": "custom",
                    "name": display,
                },
            ],
        })

    def do_POST(self) -> None:
        if self.path not in {"/responses", "/v1/responses"}:
            self.send_json(404, {"error": {"message": "not found"}})
            return
        try:
            length = int(self.headers.get("Content-Length") or "0")
            body = self.rfile.read(length)
            request = json.loads(body.decode("utf-8"))
            if not isinstance(request, dict):
                raise ValueError("request body must be a JSON object")
            self.proxy_response(request)
        except Exception as exc:
            self.send_json(500, {"error": {"message": str(exc)}})

    def proxy_response(self, request: dict[str, object]) -> None:
        state = load_state(self.server.home)
        auth = load_auth(self.server.home / "auth.json")
        upstream_base_url = effective_setting(state, "adapter_upstream_base_url", effective_setting(state, "local_base_url", DEFAULT_BASE_URL))
        upstream_model = upstream_model_for_state(state, DEFAULT_UPSTREAM_MODEL)
        api_key = effective_setting(state, "local_api_key", str(auth.get("OPENAI_API_KEY") or ""))
        if not api_key:
            raise SwitchError("adapter API key is missing")
        # "Chat 适配器" toggle. Off (the default) is pure Responses passthrough:
```

</details>

**依据 2 · 源码核查**：[src/codex_switch/cli.py:1665-1730](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1665-L1730)

桥接开关与回退

<details>
<summary>查看原文（66行）</summary>

```text
        # the chat bridge can't carry, so a bridged reply would arrive with no
        # tools at all. Returning the upstream error lets Codex retry or show it.
        chat_bridge = effective_setting(state, "chat_adapter", "false") == "true"
        stream = bool(request.get("stream"))
        resp_id = f"resp_{uuid.uuid4().hex}"

        if stream:
            errors: list[str] = []
            if self.relay_responses_stream(
                request, upstream_base_url, upstream_model, api_key, errors,
                remember_unsupported=chat_bridge,
            ):
                return
            if chat_bridge and self.relay_chat_stream(request, upstream_base_url, upstream_model, api_key, resp_id, errors):
                return
            message = upstream_failure_message(errors)
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.write_sse("response.failed", {
                "type": "response.failed",
                "response": {
                    "id": resp_id, "object": "response",
                    "created_at": int(time.time()), "status": "failed",
                    "model": upstream_model, "output": [],
                    "error": {"message": message},
                },
            })
            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
            return

        errors = []
        passthrough = self.passthrough_responses(
            request, upstream_base_url, upstream_model, api_key, resp_id, errors,
            remember_unsupported=chat_bridge,
        )
        if passthrough is not None:
            self.send_json(200, passthrough)
            return
        if not chat_bridge:
            self.send_json(502, {"error": {"message": upstream_failure_message(errors)}})
            return
        payload = responses_request_to_chat_payload(request, upstream_model, False)
        upstream_request = urllib.request.Request(
            chat_completions_url(upstream_base_url),
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
                "User-Agent": UPSTREAM_USER_AGENT,
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(upstream_request, timeout=600) as response:
                chat = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            error_body = exc.read().decode("utf-8", errors="replace")
            if errors:
                error_body += " ; " + " ; ".join(errors)
            self.send_json(exc.code, {"error": {"message": error_body}})
            return

        result = chat_response_to_responses(chat, upstream_model)
```

</details>

**依据 3 · 源码核查**：[src/codex_switch/cli.py:1206-1241](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1206-L1241)

sanitize字段层次

<details>
<summary>查看原文（36行）</summary>

```text
# generation-tuning fields as a last resort. Tools are never dropped — losing
# function calls would silently break Codex.
_RESPONSES_PASSTHROUGH_DROP_TIERS: tuple[tuple[str, ...], ...] = (
    ("store", "include", "prompt_cache_key", "safety_identifier", "service_tier", "stream_options", "user", "metadata"),
    ("reasoning", "text", "truncation"),
)

# Statuses that suggest the upstream rejected a request field, so a sanitized
# retry may succeed. Anything else (401/403/404/429/5xx) won't be fixed by
# removing fields.
_SANITIZE_RETRY_CODES = {400, 415, 422}

# Routes (base_url, model) whose /v1/responses endpoint decisively rejected
# even the most sanitized payload. Remembered for the adapter's lifetime so
# every subsequent request goes straight to the chat bridge instead of paying
# 3 rejected round-trips first — which also multiplies rate-limit pressure on
# the relay during Codex's automatic reconnects. The adapter is restarted on
# every config save, so this never pins a stale verdict across saves.
_RESPONSES_UNSUPPORTED_ROUTES: set[tuple[str, str]] = set()


def normalize_responses_message_ids(payload: dict[str, object]) -> dict[str, object]:
    """Return a request copy with legacy ``item_`` message IDs made valid.

    This is the in-flight safety net for conversations already loaded by Codex;
    the on-disk repair handles subsequent official-provider resumes.
    """
    normalized = dict(payload)
    raw_input = payload.get("input")
    if not isinstance(raw_input, list):
        return normalized
    normalized_input: list[object] = []
    for raw_item in raw_input:
        if not isinstance(raw_item, dict):
            normalized_input.append(raw_item)
            continue
```

</details>

**依据 4 · 源码核查**：[src/codex_switch/cli.py:1326-1357](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1326-L1357)

reasoning删除

<details>
<summary>查看原文（32行）</summary>

```text
    reasoning shell that the official Responses API later 404s on.

    A relay reasoning item carries a temporary id and no real
    ``encrypted_content``. Codex stores it verbatim, and after switching back
    to the official provider (``store=false``) the API does a store lookup on
    that id and fails ("Item with id 'rs_tmp_…' not found"). Emptying the
    content (the old behavior) wasn't enough — the id itself is the problem —
    so the reasoning item must not reach Codex at all.

    Returns ``True`` when ``obj`` is itself a standalone reasoning SSE event
    whose entire ``event:``/``data:`` frame the caller should drop (a per-item
    ``output_item.*`` event whose ``item`` is reasoning, or a reasoning-scoped
    ``response.reasoning*`` delta/summary event). Otherwise reasoning entries
    are stripped from any ``output`` array in place and ``False`` is returned.
    """
    if not isinstance(obj, dict):
        return False
    if _is_reasoning_item(obj.get("item")):
        return True
    event_type = obj.get("type")
    if isinstance(event_type, str) and event_type.startswith("response.reasoning"):
        return True
    _drop_reasoning_from_output(obj)
    _drop_reasoning_from_output(obj.get("response"))
    return False


def _http_error_detail(exc: urllib.error.HTTPError) -> str:
    try:
        return exc.read(500).decode("utf-8", errors="replace")
    except Exception:
        return ""
```

</details>

**依据 5 · 源码核查**：[src/codex_switch/cli.py:1451-1541](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1451-L1541)

有损chat转换

<details>
<summary>查看原文（91行）</summary>

```text
def responses_input_to_chat_messages(request: dict[str, object]) -> list[dict[str, object]]:
    messages: list[dict[str, object]] = []
    instructions = request.get("instructions")
    if isinstance(instructions, str) and instructions.strip():
        messages.append({"role": "system", "content": instructions})
    raw_input = request.get("input")
    if isinstance(raw_input, str):
        messages.append({"role": "user", "content": raw_input})
    elif isinstance(raw_input, list):
        for item in raw_input:
            if not isinstance(item, dict):
                continue
            item_type = item.get("type")
            role = item.get("role")
            if item_type == "message" or role in {"system", "developer", "user", "assistant"}:
                chat_role = "system" if role == "developer" else role if isinstance(role, str) else "user"
                msg: dict[str, object] = {"role": chat_role, "content": response_content_to_text(item.get("content"))}
                if chat_role == "assistant":
                    reasoning = item.get("reasoning_content")
                    if not reasoning:
                        content = item.get("content")
                        if isinstance(content, list):
                            for part in content:
                                if isinstance(part, dict) and part.get("type") == "reasoning" and isinstance(part.get("text"), str):
                                    reasoning = part["text"]
                                    break
                    if reasoning:
                        msg["reasoning_content"] = reasoning
                messages.append(msg)
            elif item_type == "function_call":
                call_id = str(item.get("call_id") or item.get("id") or "")
                tool_call = {
                    "id": call_id,
                    "type": "function",
                    "function": {
                        "name": str(item.get("name") or "tool"),
                        "arguments": str(item.get("arguments") or "{}"),
                    },
                }
                if messages and messages[-1].get("role") == "assistant" and isinstance(messages[-1].get("tool_calls"), list):
                    messages[-1]["tool_calls"].append(tool_call)
                else:
                    messages.append({
                        "role": "assistant",
                        "content": None,
                        "tool_calls": [tool_call],
                    })
            elif item_type == "function_call_output":
                messages.append({
                    "role": "tool",
                    "tool_call_id": str(item.get("call_id") or ""),
                    "content": response_content_to_text(item.get("output")) or str(item.get("output") or ""),
                })
    if not messages:
        messages.append({"role": "user", "content": ""})
    return messages


def responses_tools_to_chat_tools(tools: object) -> list[dict[str, object]]:
    if not isinstance(tools, list):
        return []
    output: list[dict[str, object]] = []
    for tool in tools:
        if not isinstance(tool, dict):
            continue
        if tool.get("type") == "function" and isinstance(tool.get("name"), str):
            output.append({
                "type": "function",
                "function": {
                    "name": tool["name"],
                    "description": tool.get("description") or "",
                    "parameters": tool.get("parameters") or {},
                },
            })
    return output


def responses_request_to_chat_payload(request: dict[str, object], upstream_model: str, stream: bool) -> dict[str, object]:
    payload: dict[str, object] = {
        "model": upstream_model,
        "messages": responses_input_to_chat_messages(request),
        "stream": stream,
    }
    tools = responses_tools_to_chat_tools(request.get("tools"))
    if tools:
        payload["tools"] = tools
    for key in ("temperature", "top_p", "max_tokens", "max_completion_tokens"):
        if key in request:
            payload[key] = request[key]
    return payload

```

</details>

**依据 6 · 源码核查**：[src/codex_switch/cli.py:1800-1837](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L1800-L1837)

连接重试和1800秒

<details>
<summary>查看原文（38行）</summary>

```text
        payload = responses_request_to_chat_payload(request, upstream_model, True)
        upstream_req = urllib.request.Request(
            chat_completions_url(upstream_base_url),
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
                "Accept": "text/event-stream",
                "User-Agent": UPSTREAM_USER_AGENT,
            },
            method="POST",
        )
        body_size = len(upstream_req.data or b"")
        response = None
        last_error: Exception | None = None
        for attempt in range(3):
            if attempt:
                time.sleep(0.5 * attempt)
            try:
                response = urllib.request.urlopen(upstream_req, timeout=1800)
                break
            except urllib.error.HTTPError as exc:
                # The upstream answered — retrying the same request won't help.
                _append_error(errors, f"/chat/completions → HTTP {exc.code} {_http_error_detail(exc)}".strip())
                return False
            except Exception as exc:
                if _is_connection_drop(exc) and body_size > _BODY_CAP_HINT_BYTES:
                    # Deterministic body-cap rejection: don't burn retries on it,
                    # tell the user how to get back under the limit instead.
                    _append_error(
                        errors,
                        f"/chat/completions → 连接被上游中断（请求体 {body_size / 1048576:.1f}MB）。"
                        "中转站通常限制请求体约 1MB，当前会话上下文过长——请在 Codex 中执行 /compact 压缩会话，或开启新会话",
                    )
                    return False
                # Otherwise (e.g. RemoteDisconnected on a small request): relays
                # under load close connections without answering. Nothing has
                # been sent to Codex yet, so the request is safe to retry.
```

</details>

**依据 7 · 源码核查**：[src/codex_switch/cli.py:2327-2332](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2327-L2332)

可配置监听地址

```text
def run_adapter(args: argparse.Namespace) -> int:
    home = Path(args.codex_home).expanduser() if args.codex_home else codex_home()
    server = AdapterServer((args.host, args.port), home)
    print(f"Codex Switch adapter listening on http://{args.host}:{args.port}/v1")
    server.serve_forever()
    return 0
```

#### 缺口

- 真实工具/多模态兼容、断线取消与重试计费未运行
  **影响**：不能用于要求无损协议或强本地调用者隔离的部署
  **进一步探讨**：无敏感测试key与工具任务核上游体，断客户端检查供应商状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 代理修复、后台服务与卸载怎样退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖macOS Codex、Python、launchctl，源码SwiftUI构建需完整Xcode；签名公证仅README主张未核发布物。state含local_api_key及stash登录tokens，auth/config/backups也可含secret，600是文件权限不是Keychain加密。LaunchAgent复制脚本到CODEX_HOME、RunAtLoad+KeepAlive、日志在home，即关GUI服务仍可运行。代理修复写Codex shell env，同时launchctl setenv影响当前用户GUI会话及登录后LaunchAgent；custom模式检测到HTTP_PROXY等会deactivate并unset一组proxy/no_proxy，未恢复原先外部工具设置，因此不只是应用内开关。

试用只在复制CODEX_HOME和可丢弃账户配置，先导出launchd env、SQLite/rollouts、auth/config/state与两个LaunchAgent，停止真实任务；不带生产会话请求第三方。首次probe和重试会花API费，长上下文可能大量数据出站，备份含凭据。退出先停adapter/proxy两个LaunchAgent并核无监听，恢复原env和多文件/数据库备份，再移除程序；uninstall.sh仅删~/.local工具和~/Applications App，明确保留Codex设置且不bootout adapter/proxy。单删app不能完成退出，也不能证明API key撤销，需按供应商另行撤销测试key。

#### 证据与依据

**依据 1 · 源码核查**：[src/codex_switch/cli.py:183-211](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L183-L211)

stash登录token

<details>
<summary>查看原文（29行）</summary>

```text
def remember_current_auth(home: Path, auth: dict[str, object], state: dict[str, object]) -> None:
    api_key = auth.get("OPENAI_API_KEY")
    if isinstance(api_key, str) and api_key.strip():
        state["local_api_key"] = api_key.strip()
    state.pop("official_auth", None)


STASHED_LOGIN_KEY = "stashed_chatgpt_login"


def stash_login_tokens(auth: dict[str, object], state: dict[str, object]) -> None:
    """Move the ChatGPT OAuth login from auth.json into the state file.

    Skip-login must remove `tokens` from auth.json (Codex would otherwise keep
    preferring the ChatGPT login), but deleting them forced a fresh OAuth login
    on the next switch to the official provider. Stash them instead; the state
    file has the same 0600 permissions as auth.json. When auth.json has no
    tokens (already skipped before), any earlier stash is kept as-is.
    """
    tokens = auth.get("tokens")
    if isinstance(tokens, dict) and tokens:
        stash: dict[str, object] = {"tokens": tokens}
        last_refresh = auth.get("last_refresh")
        if last_refresh:
            stash["last_refresh"] = last_refresh
        state[STASHED_LOGIN_KEY] = stash


def restore_login_tokens(auth: dict[str, object], state: dict[str, object]) -> bool:
```

</details>

**依据 2 · 源码核查**：[src/codex_switch/cli.py:508-566](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L508-L566)

launchd全局环境

<details>
<summary>查看原文（59行）</summary>

```text
def set_launchd_proxy(proxy_url: str, no_proxy: str) -> None:
    if sys.platform != "darwin":
        print("launchd_warn: launchctl setenv is only available on macOS; skipped.")
        return
    for key in PROXY_ENV_KEYS:
        subprocess.run(["launchctl", "setenv", key, proxy_url], check=True)
    for key in NO_PROXY_ENV_KEYS:
        subprocess.run(["launchctl", "setenv", key, no_proxy], check=True)


def unset_launchd_proxy() -> None:
    if sys.platform != "darwin":
        return
    for key in (*PROXY_ENV_KEYS, *NO_PROXY_ENV_KEYS):
        subprocess.run(["launchctl", "unsetenv", key], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def write_proxy_launch_agent(proxy_url: str, no_proxy: str) -> Path:
    path = proxy_launch_agent_path()
    commands = []
    for key in PROXY_ENV_KEYS:
        commands.append(f"launchctl setenv {shlex.quote(key)} {shlex.quote(proxy_url)}")
    for key in NO_PROXY_ENV_KEYS:
        commands.append(f"launchctl setenv {shlex.quote(key)} {shlex.quote(no_proxy)}")
    command = "; ".join(commands)
    content = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>{PROXY_LAUNCH_AGENT_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>-c</string>
    <string>{xml_escape(command)}</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>
'''
    atomic_write(path, content, 0o644)
    if sys.platform == "darwin":
        subprocess.run(["launchctl", "bootout", launchctl_gui_target(), str(path)], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        enable_launch_agent(PROXY_LAUNCH_AGENT_LABEL)
        subprocess.run(["launchctl", "bootstrap", launchctl_gui_target(), str(path)], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return path


def remove_proxy_launch_agent() -> None:
    path = proxy_launch_agent_path()
    if sys.platform == "darwin":
        subprocess.run(["launchctl", "bootout", launchctl_gui_target(), str(path)], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        path.unlink()
    except FileNotFoundError:
        pass

```

</details>

**依据 3 · 源码核查**：[src/codex_switch/cli.py:590-643](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L590-L643)

切custom清代理

<details>
<summary>查看原文（54行）</summary>

```text
def activate_proxy_runtime(home: Path, proxy_url: str, no_proxy: str) -> None:
    """Apply the proxy to launchd, the login LaunchAgent and config.toml."""
    config_path = home / "config.toml"
    set_launchd_proxy(proxy_url, no_proxy)
    write_proxy_launch_agent(proxy_url, no_proxy)
    backup_file(config_path, home / "backups")
    atomic_write(config_path, rewrite_config_for_proxy(read_config(config_path), proxy_url, no_proxy), 0o600)


def deactivate_proxy_runtime(home: Path) -> None:
    """Remove the proxy from launchd, the LaunchAgent and config.toml. Only the
    runtime is cleared; the caller decides what to do with the saved
    preference (proxy_preference / proxy_url) so it can be reapplied later."""
    config_path = home / "config.toml"
    unset_launchd_proxy()
    remove_proxy_launch_agent()
    if shell_proxy_config_values(read_config(config_path)):
        backup_file(config_path, home / "backups")
        atomic_write(config_path, rewrite_config_without_proxy(read_config(config_path)), 0o600)


def proxy_runtime_present(home: Path) -> bool:
    return bool(shell_proxy_config_values(read_config(home / "config.toml"))) or launchctl_getenv("HTTP_PROXY") is not None


def apply_proxy_for_provider(home: Path, provider: str, state: dict[str, object]) -> None:
    """Keep the HTTP proxy scoped to official mode.

    The custom API path is Codex -> local adapter (127.0.0.1) -> China-direct
    relay; none of it should traverse a proxy, and Codex's HTTP client ignores
    NO_PROXY, so a global proxy silently breaks the local adapter's streaming.
    Switching to custom therefore deactivates the proxy runtime while keeping
    the user's saved preference; switching to official reactivates it when the
    user has one enabled. proxy_enabled tracks the *actual* runtime state (the
    desktop reads it for its status badge); proxy_preference is the intent that
    survives custom switches."""
    wants_proxy = effective_setting(state, "proxy_preference", "false") == "true"
    proxy_url = effective_setting(state, "proxy_url", "")
    no_proxy = effective_setting(state, "proxy_no_proxy", DEFAULT_NO_PROXY)
    if provider == "openai":
        if wants_proxy and proxy_url:
            activate_proxy_runtime(home, proxy_url, no_proxy)
            state["proxy_enabled"] = "true"
            save_state(home, state)
            print(f"Re-enabled the HTTP proxy for official mode: {proxy_url}")
        return
    # Custom (or any non-official) provider: the proxy must not be active.
    if proxy_runtime_present(home) or effective_setting(state, "proxy_enabled", "false") == "true":
        deactivate_proxy_runtime(home)
        state["proxy_enabled"] = "false"
        save_state(home, state)
        print("Disabled the HTTP proxy for custom API mode (it only applies to official mode).")


```

</details>

**依据 4 · 源码核查**：[src/codex_switch/cli.py:2343-2391](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2343-L2391)

持久adapter及日志

<details>
<summary>查看原文（49行）</summary>

```text
def write_adapter_launch_agent(home: Path, host: str = DEFAULT_ADAPTER_HOST, port: int = DEFAULT_ADAPTER_PORT) -> Path:
    path = adapter_launch_agent_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    # Copy the running script to a stable location under codex_home and point the
    # LaunchAgent there. The app bundle can be run via macOS App Translocation
    # from a temporary, read-only path that disappears when the app quits/updates;
    # baking that path into the LaunchAgent kills the adapter mid-stream
    # ("stream closed before response.completed"). A stable copy survives all that.
    source = Path(sys.argv[0]).resolve()
    stable_script = home / "codex-switch-adapter.py"
    try:
        shutil.copy2(source, stable_script)
        stable_script.chmod(0o755)
        cli_path = str(stable_script)
    except OSError:
        cli_path = str(source)
    log_path = str(home / "codex-switch-adapter.log")
    content = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>{ADAPTER_LAUNCH_AGENT_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>{xml_escape(cli_path)}</string>
    <string>adapter</string>
    <string>serve</string>
    <string>--host</string>
    <string>{host}</string>
    <string>--port</string>
    <string>{port}</string>
    <string>--codex-home</string>
    <string>{xml_escape(str(home))}</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>{xml_escape(log_path)}</string>
  <key>StandardErrorPath</key>
  <string>{xml_escape(log_path)}</string>
</dict>
</plist>
'''
    atomic_write(path, content, 0o644)
    return path

```

</details>

**依据 5 · 源码核查**：[scripts/uninstall.sh:1-8](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/scripts/uninstall.sh#L1-L8)

卸载范围有限

```text
#!/usr/bin/env bash
set -euo pipefail

rm -f "$HOME/.local/bin/codex-switch"
rm -rf "$HOME/.local/share/codex-switch"
rm -rf "$HOME/Applications/Codex Switch.app"

echo "Removed Codex Switch. User Codex settings under ~/.codex were not deleted."
```

**依据 6 · 源码核查**：[scripts/package-app.sh:10-38](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/scripts/package-app.sh#L10-L38)

Xcode构建条件

<details>
<summary>查看原文（29行）</summary>

```text

# A full Xcode (not just Command Line Tools) is required to build SwiftUI code,
# because CLT lacks the SwiftUI macro plugins. Search common install locations.
if [[ -z "$XCODE_DEVELOPER_DIR" ]]; then
  for candidate in \
    "$HOME/Desktop/Xcode-beta.app" \
    "$HOME/Downloads/Xcode-beta.app" \
    "/Applications/Xcode.app" \
    "/Applications/Xcode-beta.app" \
    "$HOME/Applications/Xcode.app"; do
    if [[ -d "$candidate/Contents/Developer" ]]; then
      XCODE_DEVELOPER_DIR="$candidate/Contents/Developer"
      break
    fi
  done
fi

# Fall back to the active developer dir if it is a full Xcode.
if [[ -z "$XCODE_DEVELOPER_DIR" ]]; then
  active="$(xcode-select -p 2>/dev/null || true)"
  if [[ "$active" == *"/Xcode"*".app/"* ]]; then
    XCODE_DEVELOPER_DIR="$active"
  fi
fi

if [[ -n "$XCODE_DEVELOPER_DIR" ]]; then
  SWIFTC="$XCODE_DEVELOPER_DIR/Toolchains/XcodeDefault.xctoolchain/usr/bin/swiftc"
  SDK_PATH="$XCODE_DEVELOPER_DIR/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk"
else
```

</details>

#### 缺口

- 发布签名、实际退出及各Codex版本效果未知
  **影响**：全局env与凭据/历史副作用使回退成本高
  **进一步探讨**：副本测试完整bootout/恢复后核监听与env，无生产切换

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 保存前预览历史重标记能否减少误路由？

**研究主题**：新假设与验证

#### 完整回答

现有备份和quit等待是已有设计，候选增量是在GUI保存前展示将修改多少threads的provider/model、哪些rollout ID会修复，并允许只改默认或明确同意历史迁移。对照只改新会话需求、继续旧会话需求、读库失败和当前模式不变，记录用户选择与实际路由一致性、恢复操作数及切换耗时。若当前Codex不重标记就无法显示历史，需呈现该权衡而不能预称不改库即可兼容；也不能把预览替代数据库事务。

#### 证据与依据

**依据 1 · 源码核查**：[app/CodexSwitchApp.swift:313-322](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/app/CodexSwitchApp.swift#L313-L322)

GUI固定重启

<details>
<summary>查看原文（10行）</summary>

```text
        var arguments = [
            "configure",
            "--base-url", baseURL,
            "--custom-model", customModel,
            "--custom-model-name", displayName,
            "--official-model", officialModel,
            "--default-provider", defaultProvider,
            "--reasoning-effort", reasoningEffort,
            "--restart-codex",
        ]
```

</details>

**依据 2 · 源码核查**：[src/codex_switch/cli.py:2434-2470](https://github.com/kuangre123/codex-switch/blob/d59d3dffe64c11c2fc28c3e6a82f8eee9b1d7974/src/codex_switch/cli.py#L2434-L2470)

批量改历史两列

<details>
<summary>查看原文（37行）</summary>

```text
def sync_thread_provider_tags(home: Path, provider: str, model: str) -> int:
    """Retag conversations to the active provider AND model after a switch.

    The merged ChatGPT.app filters the sidebar by model_provider (verified
    2026-07: with the custom provider active every openai-tagged conversation
    vanishes, and vice versa), so retagging the provider keeps history visible.
    But provider and model must move together: a custom-model row left tagged
    to the openai provider (or vice versa) is an invalid pair the new Codex
    rejects with "model … is not supported when using Codex with a ChatGPT
    account". Custom models also can't be detected by name (slugs like
    stealth/ox-alpha carry no codex-switch/ prefix), so both columns are set
    to the active pair — a continued conversation uses the active model anyway.
    Only sqlite is touched (the source Codex reads for a thread's model);
    rollout files are never rewritten (that corrupted message IDs before
    0.7.13). Databases are backed up first, and failures never abort the switch.
    """
    updated = 0
    for db_path in thread_database_paths(home):
        try:
            backup_sqlite_database(
                db_path,
                home / "backups_state" / "provider-tag" / datetime.now().strftime("%Y%m%d-%H%M%S"),
            )
            connection = sqlite3.connect(str(db_path), timeout=5)
            try:
                with connection:
                    cursor = connection.execute(
                        "UPDATE threads SET model_provider = ?, model = ? "
                        "WHERE model_provider != ? OR model != ?",
                        (provider, model, provider, model),
                    )
                    updated += cursor.rowcount
            finally:
                connection.close()
        except sqlite3.Error as exc:
            print(f"provider_tag_warn: {db_path}: {exc}")
    return updated
```

</details>

#### 缺口

- 用户是否理解历史目的地及兼容代价未知
  **影响**：确认可能增加摩擦但不改变底层限制
  **进一步探讨**：副本库任务比较预览选择与继续请求目的地

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
