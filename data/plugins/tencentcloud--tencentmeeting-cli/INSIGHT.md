# Tencent Meeting CLI

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[bd9ab53](https://github.com/TencentCloud/tencentmeeting-cli/tree/bd9ab5357abb17b669e5cda33b73d547f0132ae1)

<!-- BEGIN META -->
[![GitHub ★ 248](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=248&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloud/tencentmeeting-cli) [![npm 30d 10,141](https://img.shields.io/static/v1?label=npm+30d&message=10%2C141&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencentcloud/tmeet) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencentcloud/tmeet)
<!-- END META -->

> **功能**：基于 OAuth2 的腾讯会议命令行工具，支持会议、录制、纪要、报告及事件操作。

> **亮点**：[Q01](#research-q01) 会议API命令化与配套范围/确认指引降低对接负担，独立tool非原生DSH插件。

> **主要限制**：[Q02](#research-q02) 远程写重试/取消不等未发生，设备/Agent元数据会随请求发出；Skill护栏不等服务端权限与幂等。

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
  - [Q01 · CLI如何服务会议任务，真实条目是什么？](#detail-section-11)
  - [Q02 · 凭证、远程调用和结果未知如何处理？](#detail-section-12)
  - [Q03 · 授权、安装与退出有什么成本？](#detail-section-13)
  - [Q04 · 采用范围和可证伪增量是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：授权会议用户/Agent需用结构化命令查会议内容与报告。

腾讯会议GUI/直接开放API；工具复用会议服务能力并统一CLI入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| OAuth与凭证 | 授权访问会议API | 账号权益/OS后端另核 |
| 结构化会议读取 | 列表/录制/报告入口 | 单场链已核，其他域未全审 |
| 会议写控制 | 邀请/修改/分享等 | 需目标确认，远程未知先对账 |
| Skill护栏 | 控范围/原文/分页 | Agent指引非服务端强制授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持平台产物/Node>=14或Go构建 | 必需 | CLI执行 | shim不含业务逻辑 |
| 网络/OAuth/账号权限 | 必需 | 远程会议API | 功能不可用应停 |
| 明确会议/成员/内容范围 | 必需 | 正确结果与最小披露 | 不猜ID/扩查人 |
| Python3 | Skill初始化需要 | 写Agent/model配置 | 后续元数据请求需知悉 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装/授权测试账号 | 核包版本与权限 |
| 查询 | Agent按目标选域/分页 | 明确范围/来源 |
| 写前 | 用户确认目标和影响 | 不以Skill代授权 |
| 异常 | 查最终状态/部分结果 | 不盲重复写 |
| 退出 | 停消费者/注销/移包 | 不用logout修普通错误 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 平台/网络/包 | 登录最多300秒/权限核对 | 权益价格未核 |
| 持续 | API/内容/模型上下文 | 核原文与分页 | 资源及费未知 |
| 失败恢复 | 查询对账/部分重做 | 核远端是否提交 | 不保证取消回滚 |
| 退出 | 凭证/缓存/订阅 | 处理consumer再注销 | 全OS/event未审 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化入口 | Go列表/REST链 | 各账号所有域可用 |
| 凭证保护 | 加密/锁/原子写 | 全OS密钥威胁 |
| Agent护栏 | 范围/确认/未知规则 | 实际Agent遵守 |
| 效率 | API工作流可组合 | 节时/错误率/服务价格 |

> **思考**：[Q02](#research-q02) 远程写重试/取消不等未发生，设备/Agent元数据会随请求发出；Skill护栏不等服务端权限与幂等。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 会议API命令化与配套范围/确认指引降低对接负担，独立tool非原生DSH插件。

[Q02](#research-q02) 真实token锁/AES-GCM/原子写可取，不能外推全OS密钥安全或端点幂等。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 远程写重试/取消不等未发生，设备/Agent元数据会随请求发出；Skill护栏不等服务端权限与幂等。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 小范围只读核身份/分页/原文，写和上传须具体授权；状态不明停并回GUI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核shim/认证/单场列表/API与加密核心，未运行CLI/登录/发请求；限定授权测试账号只读试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、scripts/tmeet.js、skills/tmeet-skill/SKILL.md、skills/tmeet-skill/references/tmeet-auth.md、cmd/auth/login.go、cmd/meeting/list.go、internal/config/user.go、internal/core/keychain/crypto.go、internal/proxy/rest-proxy/proxy.go、internal/core/thttp/client.go、skills/tmeet-skill/scripts/agent_init.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读README/package/shim、Skill/认证参考，定向补同提交Go login/list/proxy/client/keychain与初始化Python原件；未审所有会议/录制/event命令及OS后端，不执行目标。
- 下一步：授权测试账号比较GUI/CLI单场只读任务、分页与原文，单独审端点重试/密钥/元数据后再谈写或订阅。

**分析版本**

- **仓库**：[TencentCloud/tencentmeeting-cli](https://github.com/TencentCloud/tencentmeeting-cli)
- **版本号**：v1.1.0（[固定提交 bd9ab53](https://github.com/TencentCloud/tencentmeeting-cli/tree/bd9ab5357abb17b669e5cda33b73d547f0132ae1)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 连接trace/目标/分页/最终状态收据，若现有JSON等价或隐私负担更高即否定。

授权测试账号比较GUI/CLI单场只读任务、分页与原文，单独审端点重试/密钥/元数据后再谈写或订阅。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 7426 | — | — | 73223 |
| .js | source | 3 | 278 | 178 | 73 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/TencentCloud/tencentmeeting-cli/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/TencentCloud/tencentmeeting-cli/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/TencentCloud/tencentmeeting-cli/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查独立会议CLI的实际API入口、授权/元数据与远程结果边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · CLI如何服务会议任务，真实条目是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是独立会议CLI工具及配套Skill，不是原生DSH插件。面向已获授权的会议用户/Agent，把会议查找、录制内容和报告等远程能力变成JSON命令及按需参考。相对人工切腾讯会议查信息，统一参数与输出便于工作流；相对直接开放API省OAuth/分页/字段处理，服务端会议能力仍归腾讯平台。合格结果需明确会议/录制身份、权限和已读范围，不能把摘要当逐字原话。

npm shim选择平台Go产物并execFileSync透传argv/stdio，源码Go meeting list确实构建userid/分页、调用REST proxy并补录制/纪要后输出。Skill提供任务路由与确认规则，属于Agent指引不是服务端强制授权。对只看一场会议的人GUI可能足够；无真实任务对照不能声称自动化更可靠。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-23](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/package.json#L1-L23)

独立bin分发。

<details>
<summary>查看原文（23行）</summary>

```text
{
  "name": "@tencentcloud/tmeet",
  "version": "v1.1.0",
  "description": "腾讯会议 CLI 工具",
  "bin": {
    "tmeet": "./scripts/tmeet.js"
  },
  "scripts": {
    "postinstall": "node scripts/cleanup.js"
  },
  "files": [
    "scripts/",
    "dist/"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/TencentCloud/tencentmeeting-cli.git"
  },
  "engines": {
    "node": ">=14"
  },
  "license": "MIT"
}
```

</details>

**依据 2 · 源码核查**：[scripts/tmeet.js:40-67](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/scripts/tmeet.js#L40-L67)

平台产物选择。

<details>
<summary>查看原文（28行）</summary>

```text
// ── 平台 → 产物文件名映射 ────────────────────────────────────────────────────
const PLATFORM_MAP = {
    "darwin-x64":   "tmeet-macOS-Intel",
    "darwin-arm64": "tmeet-macOS-AppleSilicon",
    "linux-x64":    "tmeet-Linux-x86_64",
    "linux-arm64":  "tmeet-Linux-ARM64",
    "win32-x64":    "tmeet-Windows-x86_64.exe",
};

const platform = os.platform();   // darwin | linux | win32
const arch     = os.arch();       // x64 | arm64

const key = `${platform}-${arch}`;
const binaryName = PLATFORM_MAP[key];

if (!binaryName) {
    console.error(`[tmeet] 不支持的平台: ${platform}/${arch}`);
    console.error(`支持的平台: ${Object.keys(PLATFORM_MAP).join(", ")}`);
    process.exit(1);
}

const binaryPath = path.join(__dirname, "..", "dist", binaryName);

if (!fs.existsSync(binaryPath)) {
    console.error(`[tmeet] 找不到可执行文件: ${binaryPath}`);
    console.error("请先运行 bash build.sh 编译产物");
    process.exit(1);
}
```

</details>

**依据 3 · 源码核查**：[scripts/tmeet.js:120-138](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/scripts/tmeet.js#L120-L138)

真正执行Go产物。

<details>
<summary>查看原文（19行）</summary>

```text
// 透传所有参数并继承 stdio，保持与直接调用二进制完全一致的体验。
//
// 注入 TMEET_NPM_PACKAGE_DIR：Go 侧的 update 流程需要定位本次运行所属
// 的 npm 包根目录来反推全局 prefix（供 `npm install -g --prefix=<>` 使用）。
// 单纯依赖 os.Executable() 不够可靠——当 ensureExecutable 的沙箱兜底
// 把二进制拷贝到 os.tmpdir() 时，Go 看到的路径就与 npm 布局完全脱节。
// 由 shim 把真实 package root 透传给子进程，是最权威、最廉价的信号。
// 使用 path.resolve 确保始终是绝对路径。
const pkgDir = path.resolve(__dirname, "..");
try {
    execFileSync(execPath, process.argv.slice(2), {
        stdio: "inherit",
        env: Object.assign({}, process.env, {
            TMEET_NPM_PACKAGE_DIR: pkgDir,
        }),
    });
} catch (err) {
    process.exit(err.status != null ? err.status : 1);
}
```

</details>

**依据 4 · 源码核查**：[cmd/meeting/list.go:51-108](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/cmd/meeting/list.go#L51-L108)

会议读取实际API链。

<details>
<summary>查看原文（58行）</summary>

```text
func (o *ListOptions) Run(cmd *cobra.Command, args []string) error {
	queryParams := thttp.QueryParams{}
	queryParams.Set("userid", o.tmeet.UserConfig.OpenId)
	queryParams.Set("instanceid", "1") // PC, fixed value

	// page handler
	// special page-size max，not 30
	pageSize, err := cmdutil.ClampingPageSize(cmd, o.PageSize, 20)
	if err != nil {
		return err
	}
	queryParams.Set("page_size", strconv.Itoa(pageSize))
	queryParams.Set("page_token", o.PageToken)
	queryParams.Set("page_type", strconv.Itoa(cmdutil.PageTypeToken))

	// Filter meeting_info_list by the requested start/end time range.
	var filterStart, filterEnd int64
	if o.Pos != "" {
		posTs, err := utils.ISO8601ToTimeStamp(o.Pos)
		if err != nil {
			return exception.InvalidArgsError.With("--start format error: %v", err)
		}
		filterStart = posTs
		if o.PageToken == "" {
			queryParams.Set("pos", strconv.FormatInt(posTs, 10))
		}
	}
	if o.Cursory != "" {
		cursoryTs, err := utils.ISO8601ToTimeStamp(o.Cursory)
		if err != nil {
			return exception.InvalidArgsError.With("--end format error: %v", err)
		}
		// Millisecond-level timestamp, needs conversion.
		filterEnd = cursoryTs
	}
	if o.IsShowAllSubMeetings != 0 {
		queryParams.Set("is_show_all_sub_meetings", strconv.Itoa(o.IsShowAllSubMeetings))
	}

	req := &thttp.Request{
		ApiURI:      "/v1/meetings",
		QueryParams: queryParams,
	}
	rsp, err := restProxy.RequestProxy(cmd.Context(), http.MethodGet, o.tmeet, req)
	if err != nil {
		return err
	}

	if filterStart > 0 || filterEnd > 0 {
		rsp.Data = string(utils.FilterMeetingsByTimeRange(
			[]byte(rsp.Data), "meeting_info_list", "start_time", "end_time", filterStart, filterEnd))
	}

	// Enrich each meeting with its recording basic info.
	rsp.Data = string(enrichMeetingsWithRecords(cmd.Context(), o.tmeet, []byte(rsp.Data), "meeting_info_list", false))

	// Enrich each meeting with its Yuanbao minute summary.
	rsp.Data = string(enrichMeetingsWithMinutes(cmd.Context(), o.tmeet, []byte(rsp.Data), "meeting_info_list", false))
```

</details>

**依据 5 · 源码核查**：[skills/tmeet-skill/SKILL.md:135-153](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/SKILL.md#L135-L153)

摘要/原话与范围区分。

<details>
<summary>查看原文（19行）</summary>

```text
- **复用目标与结果**：已有可靠文件 ID/链接就直接读，不固定补查会议、地址或所有配置。已有纪要包含所需待办时直接使用，不再取 todos。结果足够回答就停止。
- **保持任务范围**：content/access 每次选择一个 action。确需两个 action 时分两次调用；已有结果满足另一诉求时直接复用。不得为了使用某个参数而换成无关 action、其他文件或更大范围的链接查询。
- **取原话**：只能引用实际转写正文；检索只给 pid/sid/offset 时再按真实 pid 读取正文，已有足够正文则不补查。纪要、目录与时间轴不能代替原话。
- **搜索范围**：record search 默认最近 30 天。用户给了时间范围，尤其超过 30 天时，同时传明确 start/end；范围不明确的空结果只说明本次范围未命中，不反复换词猜测。
- **权限范围**：按会议线索定位录制、了解某场会议的录制权限或补齐必要会议信息时，按会议查询链路处理；已有可靠文件 ID/链接则直接读。search 空结果、缺 records 字段或普通读取错误不等于没有录制，也不等于可以申请。
- **申请条件**：录制已就绪且 permission_status=can_apply 才可准备申请。closed/deleted 不申请；录制中/转码中等待；password_required 只在支持 pwd 的读取路径处理。

### 元宝纪要查询

元宝纪要用 `minutes get/search`，录制纪要用 `record content --action minutes`。用户指定来源时按指定来源；具体元宝参数见 [references/tmeet-minutes.md](references/tmeet-minutes.md)。

| 用户需求 | 处理 |
|------|------|
| 已有录制文件 ID 或分享链接 | 直接读录制内容，不固定先判会议权限 |
| 指定某场会议但没有可读文件目标 | 按需查 meeting get；有可读录制则取录制纪要，不能读取时可取元宝摘要并标明来源 |
| 按时间批量找元宝纪要 | minutes search 按时间搜索，不先列会议再逐场读取 |
| 不知哪场会、只记得说过某内容，未限定来源 | 搜元宝纪要与录制原文两条链路，按会议去重并标明来源和覆盖范围 |

用户要原话而无法取得正文时，说明限制；仅在用户接受替代内容后交付元宝摘要。两种内容分别查询，一侧失败不丢弃另一侧结果，不把摘要称作原文。
```

</details>

#### 缺口

- 实际账号/服务和Agent任务结果未验。
  **影响**：不能保证全部命令可用或质量收益。
  **进一步探讨**：在授权测试账号先比较单场只读列表/内容与GUI。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭证、远程调用和结果未知如何处理？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

Go login持token锁、复查已有有效登录，再取授权URL/轮询，令牌保存到keychain；保存失败返回错误。加密基础层确有AES-GCM随机nonce/AAD及临时写+Sync+Rename/文件锁，不应说安全存储只是口号；但本轮未全面审各OS主密钥后端，不能从AES推出主机或Agent被攻破仍安全。

REST proxy先刷新token，retry.Do包裹所有method，过滤token过期/不可重试业务错，网络/408/504归网络错误。底层NewRequestWithContext真实传ctx，但远端写已提交而响应丢失仍可能未知；此层未看到操作幂等键，重试写是否重复需核各端点，不能宣称已发生重复。Skill已明确部分成功/未知先查状态不整批重跑，是有效使用护栏而非协议幂等证明。

Skill要求首轮/换模型静默agent_init；该Python实际只写agent/model到本地agent.json，API proxy又确把os/agent/model等作为Tmeet-Device-Info请求头发出。必须区分本地初始化与后续网络元数据，不称Python自己上报或声称无元数据传输。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/auth/login.go:35-105](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/cmd/auth/login.go#L35-L105)

锁/授权/保存链。

<details>
<summary>查看原文（71行）</summary>

```text
			lockPath := config.GetTokenLockPath()
			return filelock.WithLock(lockPath, func() error {
				return opts.Run(cmd, args)
			})
		},
	}
	cmdutil.InjectSkipPreCheckAnnotation(cmd)

	cmd.Flags().BoolVar(&opts.NoBrowser, "no-browser", false, "disable auto-opening the browser, only print the authorization URL")

	return cmd
}

func (o *LoginOptions) Run(cmd *cobra.Command, args []string) error {
	// Lock contention above; re-read the file config here.
	config.ResetCache()
	userConfig, _ := config.GetUserConfig()
	if userConfig != nil &&
		userConfig.RefreshTokenExpires > time.Now().Unix() {
		// Already logged in && refreshToken not expired, return directly.
		return exception.UserHasBeenInitializedError
	}
	// Get authorization URL.
	tmeetAuth := auth.NewTmeetAuth(o.tmeet)
	authorizationLocation, authCode, err := tmeetAuth.GeneralOauth2Address(cmd.Context())
	if err != nil {
		log.Errorf(cmd.Context(), "get authorization url failed: %v", err)
		return err
	}
	output.PrintInfof(cmd, "")
	output.PrintInfof(cmd, "Please open the following URL in your browser to authorize")
	output.PrintInfof(cmd, "")
	output.PrintInfof(cmd, "authorize url: %s", authorizationLocation)
	output.PrintInfof(cmd, "")
	output.PrintInfof(cmd, "waiting for authorization...")
	output.PrintInfof(cmd, "")

	if !o.NoBrowser {
		// Try to open the default browser automatically
		_ = browser.Open(authorizationLocation)
	}

	// Poll for authorization result.
	authTokenData, err := tmeetAuth.PollingOauth2Result(cmd.Context(), authCode)
	if err != nil {
		log.Errorf(cmd.Context(), "polling authorization result failed: %v", err)
		return err
	}

	userConfig = &config.UserConfig{
		SdkId:        authTokenData.SdkId,
		OpenId:       authTokenData.OpenID,
		AccessToken:  authTokenData.AccessToken,
		RefreshToken: authTokenData.RefreshToken,
	}
	userConfig.Expires, _ = strconv.ParseInt(authTokenData.AccessTokenExpireTime, 10, 64)
	userConfig.RefreshTokenExpires, _ = strconv.ParseInt(authTokenData.RefreshTokenExpireTime, 10, 64)
	err = retry.Do(cmd.Context(), func(ctx context.Context) error {
		err = config.SaveUserConfig(userConfig)
		if err != nil {
			log.Errorf(ctx, "save user config failed: %v", err)
			return exception.AuthorizationFailedError
		}
		return nil
	}, retry.DefaultOptions)

	if err != nil {
		return err
	}

	output.PrintInfof(cmd, "Login successful. Start managing your meetings using tmeet.")
```

</details>

**依据 2 · 源码核查**：[internal/config/user.go:124-146](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/internal/config/user.go#L124-L146)

实际keychain写入。

<details>
<summary>查看原文（23行）</summary>

```text
func SaveUserConfig(config *UserConfig) error {
	if config == nil {
		return exception.InvalidArgsError.With("config cannot be nil")
	}
	if err := validateOpenId(config.OpenId); err != nil {
		return exception.InvalidArgsError.With("invalid OpenId: %v", err)
	}

	data, err := json.Marshal(config)
	if err != nil {
		return exception.InitializeFailedError.With("failed to serialize user config: %v", err)
	}

	if err = getKeychain().Set(keychain.ServiceName, config.OpenId, string(data)); err != nil {
		return exception.InitializeFailedError.With("failed to save encrypted config: %v", err)
	}

	if err = saveMeta(&AppMeta{ActiveOpenId: config.OpenId}); err != nil {
		return exception.InitializeFailedError.With("failed to update app metadata (encrypted data saved, please retry): %v", err)
	}

	userConfig = config
	return nil
```

</details>

**依据 3 · 源码核查**：[internal/core/keychain/crypto.go:39-61](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/internal/core/keychain/crypto.go#L39-L61)

AES-GCM实现。

<details>
<summary>查看原文（23行）</summary>

```text
// encrypt performs authenticated encryption of plaintext using AES-256-GCM.
//
// Return format: nonce(12B) || ciphertext || tag(16B)
// Each encryption uses a new random nonce, ensuring different ciphertexts for the same plaintext.
// additionalData is used as GCM AAD for authentication but not encrypted, binding context (e.g. account key) to prevent cross-account replacement (SEC-009).
func encrypt(masterKey, plaintext, additionalData []byte) ([]byte, error) {
	block, err := aes.NewCipher(masterKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("failed to create GCM: %w", err)
	}

	nonce := make([]byte, nonceSize)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, fmt.Errorf("failed to generate random nonce: %w", err)
	}

	ciphertext := gcm.Seal(nonce, nonce, plaintext, additionalData)
	return ciphertext, nil
```

</details>

**依据 4 · 源码核查**：[internal/core/keychain/crypto.go:128-160](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/internal/core/keychain/crypto.go#L128-L160)

锁与原子写。

<details>
<summary>查看原文（33行）</summary>

```text
func atomicWriteFile(filePath string, data []byte) error {
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0700); err != nil {
		return fmt.Errorf("failed to create data directory: %w", err)
	}
	if err := os.Chmod(dir, 0700); err != nil { // SEC-002: umask may cause MkdirAll to create 0755
		return fmt.Errorf("failed to set data directory permissions: %w", err)
	}

	lockPath := filePath + ".lock"
	return filelock.WithLock(lockPath, func() error { // SEC-012: 跨进程排他锁
		tmpFile, err := os.CreateTemp(dir, "."+filepath.Base(filePath)+"-*.tmp")
		if err != nil {
			return fmt.Errorf("failed to create temp file: %w", err)
		}
		tmpPath := tmpFile.Name()

		defer func() { _ = os.Remove(tmpPath) }()

		if _, err = tmpFile.Write(data); err != nil {
			_ = tmpFile.Close()
			return fmt.Errorf("failed to write temp file: %w", err)
		}
		if err = tmpFile.Sync(); err != nil {
			_ = tmpFile.Close()
			return fmt.Errorf("failed to sync temp file: %w", err)
		}
		if err = tmpFile.Close(); err != nil {
			return fmt.Errorf("failed to close temp file: %w", err)
		}

		if err = os.Rename(tmpPath, filePath); err != nil {
			return fmt.Errorf("failed to atomically replace encrypted file: %w", err)
```

</details>

**依据 5 · 源码核查**：[internal/proxy/rest-proxy/proxy.go:46-102](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/internal/proxy/rest-proxy/proxy.go#L46-L102)

刷新/重试与网络错误。

<details>
<summary>查看原文（57行）</summary>

```text
// RequestProxy is the restapi request proxy.
func RequestProxy(ctx context.Context, method string, tmeet *internal.Tmeet, req *thttp.Request) (*ProxyRsp, error) {
	// Validate & refresh token.
	if err := auth.NewTmeetAuth(tmeet).RefreshToken(ctx, config.ClearUserConfig); err != nil {
		return nil, err
	}

	var rsp *ProxyRsp
	opts := retry.DefaultOptions
	// Stop retrying immediately on token expiry or non-retryable business errors to avoid pointless retries.
	opts.RetryIf = func(err error) bool {
		return !exception.Is(err, exception.TokenExpiredError) &&
			!exception.Is(err, exception.NotRetryRequestError)
	}

	err := retry.Do(ctx, func(ctx context.Context) error {
		tempRsp, err := requestProxy(ctx, method, tmeet, req)
		if err != nil {
			if err == exception.TokenExpiredError {
				// Token expired, clear local token and propagate error; RetryIf will stop retrying.
				_ = config.ClearUserConfig()
			}
			return err
		}
		rsp = tempRsp
		return nil
	}, opts)

	if err != nil {
		// restapi common err log
		log.Errorf(ctx, "restapi proxy err: %v", err)
		return nil, err
	}
	return rsp, nil
}

func requestProxy(ctx context.Context, method string, tmeet *internal.Tmeet, req *thttp.Request) (*ProxyRsp, error) {
	opts := []thttp.RequestOptionFunc{
		header(ctx,
			tmeet.UserConfig.OpenId,
			tmeet.SystemInfo.MachineID,
			tmeet.CLIVersion,
			tmeet.SystemInfo.OS,
			tmeet.SystemInfo.Agent,
			tmeet.SystemInfo.Model,
			tmeet.CmdPath,
			apicmdctx.Get(ctx)),
		authenticator(tmeet.UserConfig.OpenId, tmeet.UserConfig.AccessToken),
	}

	rsp, err := doRequest(ctx, method, tmeet, req, opts)
	if err != nil {
		return nil, exception.NetworkError
	}
	if rsp.StatusCode == http.StatusRequestTimeout ||
		rsp.StatusCode == http.StatusGatewayTimeout {
		return nil, exception.NetworkError
```

</details>

**依据 6 · 源码核查**：[internal/proxy/rest-proxy/proxy.go:132-179](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/internal/proxy/rest-proxy/proxy.go#L132-L179)

所有method和设备/Agent元数据头。

<details>
<summary>查看原文（48行）</summary>

```text
// doRequest dispatches HTTP requests by method.
func doRequest(ctx context.Context, method string, tmeet *internal.Tmeet, req *thttp.Request, opts []thttp.RequestOptionFunc) (*thttp.Response, error) {
	switch method {
	case http.MethodGet:
		return tmeet.RestClient.Get(ctx, req, opts...)
	case http.MethodPost:
		return tmeet.RestClient.Post(ctx, req, opts...)
	case http.MethodPut:
		return tmeet.RestClient.Put(ctx, req, opts...)
	case http.MethodDelete:
		return tmeet.RestClient.Delete(ctx, req, opts...)
	default:
		return nil, exception.InvalidRestApiMethodError
	}
}

// authenticator builds the authentication information.
func authenticator(openId, accessToken string) thttp.RequestOptionFunc {
	// oauth2 authenticator
	nonce := uint64(100000 + rand.IntN(900000))
	curTs := strconv.FormatInt(time.Now().Unix(), 10)
	x := &thttp.OAuth2Authenticator{
		Nonce:       nonce,
		Timestamp:   curTs,
		AccessToken: accessToken,
		OpenId:      openId,
	}

	return thttp.WithRequestAuthenticator(x)
}

// header builds the common request headers.
//
// apiCmd is the api-schema identifier of the current invocation (see
// internal/cmdutil/api_schema.go). When it is empty, the Tmeet-Cli-Name
// header is omitted.
func header(ctx context.Context, openId, machineId, version,
	os, agent, model, cmdPath, apiCmd string) thttp.RequestOptionFunc {
	x := http.Header{}
	x.Set("Tmeet-Unique-ID", common.BuildUniqueID(openId, machineId))
	x.Set("Tmeet-Device-Info", fmt.Sprintf("%s;%s;%s", os, agent, model))
	x.Set("Tmeet-Open-Source", OpenSourceCLI)
	x.Set("Tmeet-Cli-Ver", version)
	x.Set("Tmeet-Trace", fmt.Sprintf("%s;%s", cmdPath, ctx.Value(log.CtxTraceIDKey)))
	if apiCmd != "" {
		x.Set("Tmeet-Cli-Name", apiCmd)
	}
	return thttp.WithRequestHeader(x)
```

</details>

**依据 7 · 源码核查**：[internal/core/thttp/client.go:202-241](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/internal/core/thttp/client.go#L202-L241)

ctx传到HTTP请求。

<details>
<summary>查看原文（40行）</summary>

```text
	// Generate the URL.
	u, err := req.GenerateURL(fmt.Sprintf("%s://%s", c.protocol, c.host))
	if err != nil {
		return nil, err
	}
	// Build the native HTTP request.
	httpReq, err := http.NewRequestWithContext(ctx, method, u.String(), bodyReader)
	if err != nil {
		return nil, err
	}

	// Set request headers.
	for k, v := range req.header {
		httpReq.Header[k] = v
	}
	// Add authentication headers.
	if req.authenticators != nil {
		for _, authenticator := range req.authenticators {
			if err = authenticator.AuthHeader(httpReq); err != nil {
				return nil, err
			}
		}
	}

	// Get the native HTTP client.  A per-request override (req.client, set
	// via WithRequestClient) takes precedence over the client-level default,
	// so a caller can retry the same request over a different transport
	// (e.g. a direct-connection client) without mutating the shared client.
	clt := c.clt
	if req.client != nil {
		clt = req.client
	}
	if clt == nil {
		clt = http.DefaultClient
	}

	// Send the request.
	httpRsp, err := clt.Do(httpReq)
	if err != nil {
		return nil, err
```

</details>

**依据 8 · 源码核查**：[skills/tmeet-skill/SKILL.md:163-177](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/SKILL.md#L163-L177)

既有确认与未知结果规则。

<details>
<summary>查看原文（15行）</summary>

```text
### 写操作确认

以下操作先展示具体目标、变更和影响，取得真实用户确认后执行；尚未确认时结束回复等待，不自问自答、不代选、不虚构同意。已有确认覆盖同一目标和变更时可复用；范围变化时重新确认。真实账号的相依写测另需明确恢复步骤及授权，普通业务写操作不因此追加恢复确认。

| 操作 | 需说明的影响 |
|------|------|
| meeting cancel/update | 取消不可恢复；修改会议信息影响参会人 |
| meeting invitees-add/remove/replace | 添加、移除或替换受邀者；添加会通知成员 |
| control call/kick | 呼叫打扰成员；踢出使成员离会 |
| auth logout | 清除本地凭证 |
| record share-set/settings-set | 具体权限、成员或智能配置变更及联动 |
| record permission-apply --action commit | 先展示有效 prepare 预览，再确认提交审批 |
| event stop --force | 先查 event status，展示 consumer_count、subscribed_keys；说明会驱逐活跃消费者并清理守护进程残留 |

写入返回部分成功时按子操作核对，不能把非零退出当成全部失败后整批重跑；提交超时或结果未知时先核对状态，不盲目重复提交。
```

</details>

**依据 9 · 源码核查**：[skills/tmeet-skill/scripts/agent_init.py:42-80](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/scripts/agent_init.py#L42-L80)

初始化只本地写。

<details>
<summary>查看原文（39行）</summary>

```text
def save_agent_config(config_dir: Path, agent: str, model: str) -> Path:
    """Atomically write AgentConfig to <config_dir>/agent.json.

    Uses tmp-file + os.replace to mirror the Go implementation's atomic write.
    Empty fields are omitted from the JSON output.
    """
    config_dir.mkdir(parents=True, exist_ok=True)
    try:
        os.chmod(config_dir, 0o700)
    except OSError:
        # Best-effort; ignore on filesystems that do not support chmod (e.g. Windows).
        pass

    payload: dict = {}
    if agent:
        payload["agent"] = agent
    if model:
        payload["model"] = model

    data = json.dumps(payload, indent=2, ensure_ascii=False)

    target = config_dir / AGENT_CONFIG_FILE

    # Write to a temp file in the same directory, then atomically rename.
    fd, tmp_path = tempfile.mkstemp(
        prefix="." + AGENT_CONFIG_FILE + "-",
        suffix=".tmp",
        dir=str(config_dir),
    )
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        try:
            os.chmod(tmp_path, 0o600)
        except OSError:
            pass
        os.replace(tmp_path, target)
```

</details>

#### 缺口

- 各OS密钥、端点幂等及服务端写结果未知未验。
  **影响**：不能把加密/取消/重试当端到端安全完成。
  **进一步探讨**：测试账号对延迟响应/部分成功逐项查状态，单审密钥后端与重试范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 授权、安装与退出有什么成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要平台支持的Go二进制/npm Node>=14 shim或自行Go构建、网络/OAuth账号/对应服务权限；不是所有功能账号都有，Skill对500284说停而不臆测商业化原因。服务价格/套餐未核，本轮不保证免费或开放。npx技能缺CLI会安装latest是目标Skill指令，本轮仅研究未执行。

首次登录最多300秒与账号批准、权限/元数据核对，持续是API/内容/分页与Agent上下文成本，会议原文/成员信息进模型不等只在本地。写会议/邀请/分享/踢人会影响他人，应按明确目标确认，录制权限prepare/commit不等任意会议写都有两阶段。事件守护进程和日志上传另有生命周期/隐私负担，本轮未审全部event。退出先停订阅/处理活跃consumer，再logout清凭证和移除包/Skill；logout或rm目录不应当普通业务错误恢复。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:35-82](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/README.md#L35-L82)

构建/授权和退出说明。

<details>
<summary>查看原文（48行）</summary>

````text
#### 方式二：从源码构建

```bash
git clone https://github.com/TencentCloud/tencentmeeting-cli
cd tencentmeeting-cli
go build -ldflags "-X tmeet/cmd.Version=v1.0.0" -o tmeet .
# 或
make build VERSION=v1.0.0
```

### 第二步：安装 CLI-SKILL

```bash
npx skills add TencentCloud/tencentmeeting-cli -y -g
```

## 卸载

### 方式一：通过 npm 安装的用户

先运行官方卸载脚本完成清理（停止守护进程 → 清除凭证 → 删除 `~/.tmeet/`），然后卸载 npm 包：

```bash
node $(npm root -g)/@tencentcloud/tmeet/scripts/uninstall.js
npm uninstall -g @tencentcloud/tmeet
npx skills remove TencentCloud/tencentmeeting-cli -g   # 可选：同时卸载 CLI-SKILL
```

### 方式二：从源码构建的用户

依次手动清理守护进程、凭证、配置目录和自建的二进制：

```bash
tmeet event stop --force
tmeet auth logout
rm -rf ~/.tmeet
rm -f /usr/local/bin/tmeet   # 替换为你的二进制实际路径
```

## 快速开始

### 1. 登录授权

```bash
tmeet auth login
```

执行后会自动尝试打开系统默认浏览器跳转到授权 URL；若无默认浏览器，则输出授权 URL，手动在浏览器中打开完成扫码授权。CLI 自动轮询结果（超时 5 分钟），凭证加密保存到本地。
````

</details>

**依据 2 · 源码核查**：[skills/tmeet-skill/SKILL.md:17-43](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/SKILL.md#L17-L43)

安装/初始化/登录要求。

<details>
<summary>查看原文（27行）</summary>

````text
在使用本技能前，必须检测是否已安装 `tmeet` 命令行工具：

- 如果检测到 `tmeet` 命令已存在，直接使用即可
- 如果未检测到 `tmeet` 命令，会自动执行以下安装命令：
  ```bash
  npm install -g @tencentcloud/tmeet@latest
  ```
  安装最新版本的腾讯会议 CLI 工具包

> **注意**：自动安装需要网络连接和 npm 环境支持。如果安装失败，请手动执行上述命令或检查网络环境。

以下相对路径均相对于技能目录。

> **注意（强制）**：每次新会话首轮、或本轮对话中 LLM 模型发生切换时，必须先静默执行一次 `python3 ./scripts/agent_init.py --agent "<当前 Agent>" --model "<当前模型>"`（不询问用户、失败即忽略、同一组合不重复调用），再执行任何 `tmeet` 命令。

## 认证

已有有效登录态时直接调用；尚未确认登录态时用 `tmeet auth status`，未登录再执行 login，不重复登录或以 logout 修复普通业务错误。

```bash
tmeet auth status
tmeet auth login
# 清除凭证前取得明确确认
tmeet auth logout
```

login 输出授权 URL 后前台等待最多 300 秒，不使用 `&` 后台执行。Hermes 无默认浏览器时，请用户在终端执行 login 并打开授权链接。auth login/status 与 event list/schema/status/stop 无需已有登录态，其他业务调用需要登录。
````

</details>

**依据 3 · 源码核查**：[skills/tmeet-skill/SKILL.md:163-177](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/SKILL.md#L163-L177)

不同写影响与event退出。

<details>
<summary>查看原文（15行）</summary>

```text
### 写操作确认

以下操作先展示具体目标、变更和影响，取得真实用户确认后执行；尚未确认时结束回复等待，不自问自答、不代选、不虚构同意。已有确认覆盖同一目标和变更时可复用；范围变化时重新确认。真实账号的相依写测另需明确恢复步骤及授权，普通业务写操作不因此追加恢复确认。

| 操作 | 需说明的影响 |
|------|------|
| meeting cancel/update | 取消不可恢复；修改会议信息影响参会人 |
| meeting invitees-add/remove/replace | 添加、移除或替换受邀者；添加会通知成员 |
| control call/kick | 呼叫打扰成员；踢出使成员离会 |
| auth logout | 清除本地凭证 |
| record share-set/settings-set | 具体权限、成员或智能配置变更及联动 |
| record permission-apply --action commit | 先展示有效 prepare 预览，再确认提交审批 |
| event stop --force | 先查 event status，展示 consumer_count、subscribed_keys；说明会驱逐活跃消费者并清理守护进程残留 |

写入返回部分成功时按子操作核对，不能把非零退出当成全部失败后整批重跑；提交超时或结果未知时先核对状态，不盲目重复提交。
```

</details>

**依据 4 · 源码核查**：[skills/tmeet-skill/SKILL.md:234-250](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/SKILL.md#L234-L250)

反馈授权与功能不可用。

<details>
<summary>查看原文（17行）</summary>

```text
## 自动反馈规则

遇到工具缺失、报错、能力不足、结果异常或改进建议时，先处理原任务；确需上报时读取 [tmeet-tshoot](references/tmeet-tshoot.md)。category 分别为 tool_not_found/tool_error/tool_inadequate/unexpected_result/suggestion。

展示拟反馈内容并取得用户明确同意后才执行 feedback。如实填写 intent、actions-tried、result，必要时记录 tool-name/error-code；姓名、电话、会议号、链接、主题和参会人等先脱敏。依赖登录；同一会话同一问题只报一次，拒绝则不上报。

## 常见错误

| 现象 | 处理 |
|------|------|
| user config is empty | 未登录，走认证流程 |
| user has been initialized | 已登录，复用状态，不自动 logout/login |
| start format error | 修正时间格式，不原样重试 |
| unknown command / 参数不识别 | 核对配套版本与当前命令帮助；客户端命令按客户端规则；不混用旧版参数 |
| 参数不适用于当前 content form | 查目标行的允许参数，保持用户指定目标与任务，移除错误参数；不是轮流试其他 form |
| 500284 / 该功能暂不可使用 | 不重试；说明当前账号功能不可用，不擅自认定灰度或商业化原因，也不承诺开通 |
| 读取无权限、录制未就绪、链接无效 | 按 record 状态与权限规则处理，不轮流尝试无关 action |
```

</details>

**依据 5 · 源码核查**：[scripts/tmeet.js:93-108](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/scripts/tmeet.js#L93-L108)

临时可执行缓存。

<details>
<summary>查看原文（16行）</summary>

```text
    // ③ 拷贝到 tmpdir 再 chmod
    const cacheDir = path.join(os.tmpdir(), "tmeet-cache");
    fs.mkdirSync(cacheDir, { recursive: true });
    const tmpBin = path.join(cacheDir, binaryName);

    // 简易缓存：size 与 mtime 均匹配则复用副本，避免每次冷启动都产生 IO
    let needCopy = true;
    try {
        const a = fs.statSync(srcPath);
        const b = fs.statSync(tmpBin);
        if (a.size === b.size && a.mtimeMs <= b.mtimeMs) needCopy = false;
    } catch (_) { /* 副本不存在，需要复制 */ }

    if (needCopy) fs.copyFileSync(srcPath, tmpBin);
    fs.chmodSync(tmpBin, 0o755);
    return tmpBin;
```

</details>

#### 缺口

- 账号权益/价格、完整event/日志和所有OS退出未核。
  **影响**：无法估全周期成本或敏感会议安全。
  **进一步探讨**：测试只读任务先核授权、实际网络/保存位置，再单独批准写/订阅与清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用范围和可证伪增量是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议授权测试账号的小范围只读查询试用，核会议身份/分页/原文来源，并保持既有确认和隐私规则；不把一般研究授权扩为邀请、取消、分享或日志上传。若结果缺权限/范围冲突，说明已读范围并回GUI，不靠换action探权限；写结果未知先查状态而非重跑。

可探索命令级结果收据：把trace_id、目标、分页范围、各子操作结果和可查询的最终状态连接起来；对已有信封/分页/部分成功规则的增量是机器可对账且不把HTTP失败当未发生。最小验证用延迟提交响应、分页token不前进、部分受邀人成功，与当前Skill+GUI查状态比较重复动作、漏页与人工恢复时间。若平台无幂等/查状态能力，应保留UNKNOWN并停，而非收据伪造成功；若现有JSON已等效或额外记录增加隐私负担就否定。未实现，不计现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/meeting/list.go:58-64](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/cmd/meeting/list.go#L58-L64)

现有token分页。

```text
	pageSize, err := cmdutil.ClampingPageSize(cmd, o.PageSize, 20)
	if err != nil {
		return err
	}
	queryParams.Set("page_size", strconv.Itoa(pageSize))
	queryParams.Set("page_token", o.PageToken)
	queryParams.Set("page_type", strconv.Itoa(cmdutil.PageTypeToken))
```

**依据 2 · 源码核查**：[internal/proxy/rest-proxy/proxy.go:125-129](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/internal/proxy/rest-proxy/proxy.go#L125-L129)

既有trace_id信封。

```text
	return &ProxyRsp{
		Data:    string(rsp.RawBody),
		TraceId: traceId,
		Message: Success,
	}, nil
```

**依据 3 · 源码核查**：[skills/tmeet-skill/SKILL.md:177-177](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/SKILL.md#L177-L177)

既有未知结果规则。

```text
写入返回部分成功时按子操作核对，不能把非零退出当成全部失败后整批重跑；提交超时或结果未知时先核对状态，不盲目重复提交。
```

**依据 4 · 源码核查**：[skills/tmeet-skill/SKILL.md:207-215](https://github.com/TencentCloud/tencentmeeting-cli/blob/bd9ab5357abb17b669e5cda33b73d547f0132ae1/skills/tmeet-skill/SKILL.md#L207-L215)

分页范围护栏。

```text
### 分页

仅对应能力支持时使用 page-token/page-size。record 文件正文用 pid/limit 定位，不用 token 分页；详情按 record 参数表，不能把通用分页套给所有 action。

- 首页不传 token；下一页原样复制该查询返回的 next_page_token，保持目标、action、筛选条件及已显式指定的语言/密码/页大小。
- token 不能跨文件、来源或 action 使用；页大小按接口外层列表项计数，不等于内部段落或词数。
- 按各能力既有契约的结束信号判定完成；明确约定末页省略 token 的能力，且无相反信号时按该约定处理。record 中预期字段异常缺失、has_more 与 token 冲突或 token 不前进，不能直接称为读完，按 record 的分页规则停止核对并说明范围。
- 用户未要求完整结果时不自行连续翻页；说明还有更多，继续展示前询问。用户要求全部时可按既有能力续页；连续超过 5 页或累计超过 200 条时提示并征询是否继续。
- 不主动使用已弃用的 page/pos/size；record 不自动读取多页，不支持 all/out 参数。
```

#### 缺口

- 统一收据未实现、端点最终结果可查性未核。
  **影响**：不能承诺消除重复或漏读。
  **进一步探讨**：先选单端点只读对照，再经明确授权测可恢复写。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
