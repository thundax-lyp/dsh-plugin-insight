# See Wxapkg

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[adad9c3](https://github.com/Leslie-SSS/seeWxapkg/tree/adad9c351df4982a639364f85b793347bea547f8)

<!-- BEGIN META -->
[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Leslie-SSS/seeWxapkg)
<!-- END META -->

> **功能**：自托管微信小程序 wxapkg 静态恢复工具，提供解密、解包、工程整理与结果报告。

> **亮点**：[Q01](#research-q01) 与[Q02](#research-q02) 将多阶段恢复、来源和不完整状态组织成可下载工程与报告；第三方fallback明确归属。

> **主要限制**：[Q02](#research-q02) 静态分数与completed不证明原工程语义等价；[Q03](#research-q03) 启用诊断样本时，partial/failed保留包与AppID至后台周期清理，不能承诺终态立即全删，停机或删除失败也可能延后。

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
  - [Q01 · See Wxapkg 交付什么，恢复流程由哪些部分负责？](#detail-section-11)
  - [Q02 · completed 和静态分数能够证明恢复正确吗？](#detail-section-12)
  - [Q03 · 自托管、凭据和重启恢复的真实边界是什么？](#detail-section-13)
  - [Q04 · 适合怎样试用，如何验证比单一静态分数更有用的报告？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：See Wxapkg 是独立自托管Web工具，不是DSH原生插件。它面向有权分析小程序编译包的开发者，把上传、类型识别、AppID解密、解包、结构归一、静态恢复、格式整理、检查及ZIP交付串成任务。输入是wxapkg和必要AppID，合格结果是有来源与缺口说明、可以继续阅读的恢复工程，不是原始源码或可运行保证。实际StartTask保存上传与一次性凭据、创建任务并入队，RunTask按阶段调用解密、解包、归一与恢复，再验证和打包。相对单独调用解包脚本，它增加任务状态、部分结果和报告；fallback明确来自wxappUnpacker，不能把第三方恢复能力归为原创。

基线为直接运行解包/恢复脚本后手动整理；未进行同样本恢复率与运行语义对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 上传与任务队列 | 持久化包处理任务 | 本机存储；taskId需保护 |
| 解密与静态恢复 | 形成可阅读工程 | 加密包需AppID；不保证原源码 |
| 产物验证与报告 | 标明partial及静态缺口 | 不等于业务运行正确 |
| ZIP交付 | 下载恢复工程 | 检查报告后再使用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Docker Compose或Go/Node环境 | 必需 | API、Worker与静态辅助进程 | Readiness可能拒绝任务 |
| 受控可写任务与输出目录 | 必需 | 上传、报告、ZIP与重启恢复 | 保存或排队失败 |
| 匹配AppID | 加密包必需 | 解密一次 | 不匹配失败；中断后可能重传 |
| 前置鉴权、限流和Worker隔离 | 公网部署必需 | 控制访问和资源 | 不应公开服务 |
| 诊断样本配置审阅 | 敏感包必需 | 确认包与AppID保留、后台清理及删除结果 | 未确认时停止上传 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选自有样本并核对保留配置 | 明确上传与诊断数据范围 |
| 提交 | API保存包与凭据、入队 | 返回taskId，保护其访问能力 |
| 处理 | Worker恢复、检查、打包 | 状态可为partial，失败不伪装完成 |
| 验收 | 用户查报告及关键页面 | 来源与缺口可解释，非运行等价 |
| 退出 | 停服务并确认卷/诊断目录清理 | 原工程与需要的报告已另存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 容器构建和磁盘资源未测 | 部署、鉴权、配置耗时未知 | 本机卷保留数据 |
| 持续使用 | CPU、内存与产物存储未知 | 复核报告与页面 | 静态分数不代替语义复核 |
| 失败恢复 | 重传与重复计算资源未知 | 检查AppID、包结构与残留 | 加密凭据已销毁时需重传 |
| 退出 | 备份与清理空间未知 | 明确删除卷及诊断目录 | 停机、清理关闭或删除失败时可能延后 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工程交付 | 恢复到静态验证与ZIP的链路 | 原源码等价、运行正确性 |
| 不完整提示 | partial与静态检查分层 | 真实样本恢复率及复核节时 |

> **思考**：[Q02](#research-q02) 静态分数与completed不证明原工程语义等价；[Q03](#research-q03) 启用诊断样本时，partial/failed保留包与AppID至后台周期清理，不能承诺终态立即全删，停机或删除失败也可能延后。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与[Q02](#research-q02) 将多阶段恢复、来源和不完整状态组织成可下载工程与报告；第三方fallback明确归属。

[Q02](#research-q02) 终态与静态分数分离值得借鉴；[Q03](#research-q03) 默认不采诊断样本，但启用后凭据副本由独立诊断目录的后台保留清理管理。部署应同时核对配置、清理进程与实际删除结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 静态分数与completed不证明原工程语义等价；[Q03](#research-q03) 启用诊断样本时，partial/failed保留包与AppID至后台周期清理，不能承诺终态立即全删，停机或删除失败也可能延后。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只在受控环境用自有样本试阅读恢复工程，先查诊断保留和报告，停止于等价保证不足的任务。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查任务链路、静态终态和诊断样本分支；未验证恢复效果、容器隔离和真实清理，报告改进为假设。

- 已检查：作者 README、包清单、源码路径 README.md、THIRD_PARTY_NOTICES.md、backend/internal/app/compile_service.go、backend/internal/pipeline/verify/score.go、backend/internal/api/http/router.go、backend/internal/config/config.go、backend/internal/infra/storage/local_fs.go、backend/cmd/server/main.go、backend/cmd/worker/main.go、docker-compose.yml、deploy/production/docker-compose.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读上传入队、恢复/检查/终态、路由、诊断样本、后台清理接线、Compose保留配置和评分源码；未审计全部解包安全代码或公网部署。
- 下一步：未执行目标代码、容器、真实包恢复和测试；未访问在线体验站。后续固定自有样本对照和清理核验仍未完成。

**分析版本**

- **仓库**：[Leslie-SSS/seeWxapkg](https://github.com/Leslie-SSS/seeWxapkg)
- **版本号**：未声明（[固定提交 adad9c3](https://github.com/Leslie-SSS/seeWxapkg/tree/adad9c351df4982a639364f85b793347bea547f8)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 以每项产物来源和缺口替代单总分决策，可能更容易识别不可运行的恢复结果，尚待用户对照。

未执行目标代码、容器、真实包恢复和测试；未访问在线体验站。后续固定自有样本对照和清理核验仍未完成。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1000 | — | — | 9616 |
| .js | source | 17 | 4749 | 4175 | 257 | — |
| .js | test | 9 | 1290 | 1136 | 34 | — |
| .ts | test | 4 | 1179 | 1041 | 2 | — |
| .ts | source | 5 | 1331 | 1191 | 21 | — |
| .tsx | test | 7 | 814 | 709 | 7 | — |
| .tsx | source | 9 | 1932 | 1816 | 5 | — |
| .mjs | source | 6 | 1149 | 1005 | 18 | — |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Leslie-SSS/seeWxapkg/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：See Wxapkg 能否交付带可信边界的可阅读恢复工程？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · See Wxapkg 交付什么，恢复流程由哪些部分负责？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

See Wxapkg 是独立自托管Web工具，不是DSH原生插件。它面向有权分析小程序编译包的开发者，把上传、类型识别、AppID解密、解包、结构归一、静态恢复、格式整理、检查及ZIP交付串成任务。输入是wxapkg和必要AppID，合格结果是有来源与缺口说明、可以继续阅读的恢复工程，不是原始源码或可运行保证。实际StartTask保存上传与一次性凭据、创建任务并入队，RunTask按阶段调用解密、解包、归一与恢复，再验证和打包。相对单独调用解包脚本，它增加任务状态、部分结果和报告；fallback明确来自wxappUnpacker，不能把第三方恢复能力归为原创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-37](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/README.md#L25-L37)

作者声明静态恢复与工具定位

<details>
<summary>查看原文（13行）</summary>

```text
See Wxapkg 可以直接在浏览器中反编译 `.wxapkg` 文件。它会自动识别包类型，在需要时使用 AppID 解密，并完成解包、反编译、排版整理和结果检查。

> [!IMPORTANT]
> 本项目所称“反编译”是对编译产物的**尽力静态恢复**，不是提取原始源码。结果可能缺少原变量名、注释、目录结构或运行时生成内容；“反编译结果已生成”也不代表与原工程完全一致或可以直接运行。

## 主要功能

- 支持普通包、加密包和常见微信 4.x 结构；加密包需要匹配的 AppID。
- 静态反编译，不通过 `eval`、`Function` 或 VM 执行包内 JavaScript。
- 自动反编译并整理 JSON、JavaScript、WXML 和 WXSS，无法确认的内容会如实标记。
- 提供实时进度、结果状态、静态质量分、检查提示和技术报告。
- 下载 ZIP 只包含 `src/`，原始解包依据不会混入交付文件。
- 支持在线使用与单机 Docker Compose 自托管，不依赖外部数据库、缓存或消息队列。
```

</details>

**依据 2 · 源码核查**：[backend/internal/app/compile_service.go:133-190](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L133-L190)

上传持久化与任务入队

<details>
<summary>查看原文（58行）</summary>

```text
func (s *CompileService) StartTask(ctx context.Context, cmd StartCompileCommand) (*task.Task, error) {
	createdAt := time.Now()
	t := &task.Task{
		ID:     uuid.New().String(),
		Status: task.TaskQueued,
		RequestedOptions: task.RequestedOptions{
			Beautify:        cmd.Beautify,
			Decompile:       cmd.Decompile,
			RemoveGuideHTML: cmd.RemoveGuideHTML,
		},
		CreatedAt: createdAt,
		UpdatedAt: createdAt,
	}

	dirs, err := storage.EnsureTaskDirs(s.cfg.TempDir, t.ID)
	if err != nil {
		return nil, err
	}
	if _, err := storage.SaveUploadedFile(dirs, cmd.File); err != nil {
		return nil, err
	}
	keepSecret := false
	defer func() {
		if !keepSecret {
			_ = storage.DeleteAppIDSecret(dirs)
			_ = storage.DeleteTaskInput(dirs)
		}
	}()
	if err := storage.SaveAppIDSecret(dirs, cmd.AppID); err != nil {
		return nil, err
	}

	s.broker.Create(t.ID)
	if err := s.repo.Create(ctx, t); err != nil {
		return nil, err
	}
	s.publish(t, task.TaskEvent{
		Type:    "progress",
		Stage:   "queued",
		Status:  string(task.TaskQueued),
		Percent: 0,
		Message: "任务已创建，等待处理",
	})

	if s.queue != nil {
		if err := s.queue.Enqueue(ctx, t.ID); err != nil {
			return nil, s.markFailed(ctx, t, "queue_enqueue_failed", "任务暂时无法进入处理队列", err)
		}
	} else {
		go func() {
			if err := s.RunTask(context.Background(), t.ID); err != nil {
				log.Printf("[Task] pipeline failed: %v", err)
			}
		}()
	}
	keepSecret = true

	return t.Clone(), nil
```

</details>

**依据 3 · 源码核查**：[backend/internal/app/compile_service.go:261-340](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L261-L340)

分类到恢复的实际调用链

<details>
<summary>查看原文（80行）</summary>

```text
	profile, err := s.classify(ctx, t, data, "")
	if err != nil {
		return s.markFailed(ctx, t, "classify_failed", "包类型识别失败", err)
	}
	inputWasEncrypted := profile.IsEncrypted
	t.PackageProfile = profile
	if err := s.repo.Update(ctx, t); err != nil {
		return err
	}
	appID, err := storage.ReadAppIDSecret(dirs)
	if err != nil {
		return s.markFailed(ctx, t, "app_id_read_failed", "读取解密凭据失败", err)
	}
	decryptedData, decryptErr := s.decrypt(ctx, t, data, appID)
	// With sample collection enabled, keep the package (decrypted bytes when
	// available) and the one-shot AppID for offline analysis before the
	// credential is destroyed. Best-effort: a storage failure must not change
	// task outcomes.
	if sampleErr := s.saveDiagnosticSample(t, dirs, data, decryptedData, appID); sampleErr != nil {
		log.Printf("[Task] save diagnostic sample failed (%T)", sampleErr)
	}
	deleteSecretErr := storage.DeleteAppIDSecret(dirs)
	if deleteSecretErr != nil {
		return s.markFailed(ctx, t, "app_id_cleanup_failed", "清理解密凭据失败，任务已安全终止", deleteSecretErr)
	}
	if decryptErr != nil {
		if errors.Is(decryptErr, dec.ErrNeedAppID) {
			return s.markFailed(ctx, t, "app_id_required", "这是加密包，需要提供正确的小程序 AppID 才能解密", decryptErr)
		}
		if errors.Is(decryptErr, dec.ErrBadAppID) {
			return s.markFailed(ctx, t, "app_id_invalid", "AppID 格式错误，应为 wx 开头的 18 位标识", decryptErr)
		}
		return s.markFailed(ctx, t, "decrypt_failed", "解密失败", decryptErr)
	}

	_, err = s.unpack(ctx, t, decryptedData, dirs.SourceDir)
	if err != nil {
		return s.markFailed(ctx, t, "unpack_failed", "解包失败", err)
	}
	// The user chose to drop WeChat 4.x page-entry `.html` runtime-guide
	// scaffolds; remove them before any later stage (collect/format/verify)
	// can touch them, so the delivered tree and ZIP stay source-only.
	if t.RequestedOptions.RemoveGuideHTML {
		if err := storage.RemoveGuideHTMLFiles(dirs.SourceDir); err != nil {
			return s.markFailed(ctx, t, "guide_files_cleanup_failed", "清理运行时引导文件失败", err)
		}
	}

	profile, err = s.classify(ctx, t, decryptedData, dirs.SourceDir)
	if err != nil {
		return s.markFailed(ctx, t, "classify_failed", "解包后包类型识别失败", err)
	}
	// The second classification sees decrypted bytes. Preserve how the user
	// supplied the package while keeping all structural signals from the
	// decrypted/extracted representation.
	profile.IsEncrypted = inputWasEncrypted
	t.PackageProfile = profile

	normalized, err := s.normalize(ctx, t, dirs.SourceDir, profile)
	if err != nil {
		return s.markFailed(ctx, t, "normalize_failed", "规范化包结构失败", err)
	}

	manifestResult, err := s.recoverManifest(ctx, t, normalized, dirs.SourceDir, dirs.ReportsDir)
	if err != nil {
		return s.markFailed(ctx, t, "manifest_recover_failed", "manifest 恢复失败", err)
	}
	artifactFiles := []task.ArtifactFile{
		{
			Path:   filepath.ToSlash(filepath.Join("src", filepath.Base(manifestResult.OutputPath))),
			Kind:   "json",
			Source: "manifest",
		},
	}

	decompileArtifacts, fallbackUsed, decompilePartial, err := s.recoverDecompile(ctx, t, normalized, decryptedData, dirs)
	if err != nil {
		return s.markFailed(ctx, t, "decompile_failed", "深度恢复阶段失败", err)
	}
	artifactFiles = append(artifactFiles, decompileArtifacts...)
```

</details>

**依据 4 · 源码核查**：[THIRD_PARTY_NOTICES.md:3-13](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/THIRD_PARTY_NOTICES.md#L3-L13)

fallback上游归属

<details>
<summary>查看原文（11行）</summary>

```text
SeeWxapkg is distributed under the MIT license except where a nested component
declares a different license.

The compatibility fallback under
`backend/internal/beautify/wxappUnpacker/` is derived from wxappUnpacker and is
licensed under GNU GPL version 3 or later (`GPL-3.0-or-later`). Its source,
local modifications and license text are shipped together in this repository.
The fallback runs as a separate Node.js process and its results are explicitly
labelled `fallback`. This notice does not determine the license status of input
packages or recovered artifacts; users are responsible for assessing their own
rights and compliance obligations.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · completed 和静态分数能够证明恢复正确吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。RunTask先验证恢复产物、计算分数，再由determineFinalStatus区分failed、partial、completed；核心manifest无页或严重产物失败会failed，缺失WXML等会partial。评分按manifest完整度、JS/WXML/WXSS可解析性和验证标志加权，还会扣fallback及生成比例，这是一套可解释静态质量指标，不比较原工程语义。比如可解析的代码仍可能缺失运行时注入、原变量名或业务行为，completed只说明核心静态检查通过。流程的工程价值是把不确定性作为交付状态，而不是把ZIP存在当成功；它的可复用条件是恢复器能报告来源、缺口和关键失败，不能只搬走分数公式当通用正确率。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/compile_service.go:388-420](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L388-L420)

验证、评分、状态与打包后终态

<details>
<summary>查看原文（33行）</summary>

```text
	manifestVerifyResult, artifactVerifyResult, err := s.verify(ctx, t, normalized, dirs.SourceDir)
	if err != nil {
		return s.markFailed(ctx, t, "verify_failed", "恢复结果验证失败", err)
	}

	t.RecoveryScore = verify.ComputeRecoveryScore(manifestVerifyResult, artifactVerifyResult, t.RequestedOptions.Decompile, fallbackUsed)
	t.Diagnostics = dedupeDiagnostics(t.Diagnostics)

	reportPath := filepath.Join(dirs.ReportsDir, "recovery-report.json")
	diagnosticsPath := filepath.Join(dirs.ReportsDir, "diagnostics.json")

	t.ArtifactSummary = s.buildArtifactSummary(t, dirs, reportPath, diagnosticsPath, artifactFiles)
	finalFileCount := t.ArtifactSummary.FileCount
	status, code, message := determineFinalStatus(manifestVerifyResult, artifactVerifyResult, decompilePartial)
	switch status {
	case task.TaskPartial:
		if t.PackageProfile != nil && t.PackageProfile.IsGamePackage {
			// Mini-game packages render via Canvas and carry no WXML pages;
			// the generic "missing WXML" message would mislead.
			message = fmt.Sprintf("已整理 %d 个源码文件（小游戏包，无 WXML 页面，以 Canvas 渲染）", finalFileCount)
			break
		}
		message = fmt.Sprintf("已整理 %d 个源码文件；%s，详见 recovery-report.json", finalFileCount, message)
	case task.TaskCompleted:
		message = fmt.Sprintf("处理完成，共整理 %d 个源码文件", finalFileCount)
	}

	if err := s.packageResult(ctx, t, dirs); err != nil {
		return s.markFailed(ctx, t, "package_failed", "打包结果失败", err)
	}
	s.refreshArtifactSummary(t)

	return s.finalizeTask(ctx, t, status, code, message, nil)
```

</details>

**依据 2 · 源码核查**：[backend/internal/app/compile_service.go:1198-1217](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L1198-L1217)

终态判据

<details>
<summary>查看原文（20行）</summary>

```text
func determineFinalStatus(manifest *verify.ManifestVerifyResult, artifacts *verify.ArtifactVerifyResult, decompilePartial bool) (task.TaskStatus, string, string) {
	if manifest == nil || manifest.PageCount == 0 {
		return task.TaskFailed, "manifest_incomplete", "manifest 恢复结果未通过核心校验"
	}
	if artifacts != nil && artifacts.CriticalFailure {
		return task.TaskFailed, "artifact_critical", "恢复结果存在关键产物缺失或解析失败"
	}
	artifactQualityFailed := artifacts != nil && artifacts.WXMLQualityIssueFiles > 0
	if !manifest.Success || decompilePartial || artifactQualityFailed || artifacts == nil || !artifacts.Success {
		// Verify grades the merged tree independently of the decompile toggle:
		// a package whose pages lack any parseable WXML must never be reported
		// as completed, and the message should say exactly what is missing.
		if artifacts != nil && artifacts.TotalPages > 0 && artifacts.WXMLFiles == 0 {
			// The generic partial branch appends "详见 recovery-report.json" at
			// the call site; keep the specific message free of the suffix.
			return task.TaskPartial, "", "WXML 模板未还原（0 个可解析 WXML 文件）"
		}
		return task.TaskPartial, "", "部分内容需检查"
	}
	return task.TaskCompleted, "", "恢复结果通过核心校验"
```

</details>

**依据 3 · 源码核查**：[backend/internal/pipeline/verify/score.go:29-68](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/pipeline/verify/score.go#L29-L68)

静态加权分数与失败上限

<details>
<summary>查看原文（40行）</summary>

```text
	if artifacts != nil {
		if artifacts.TotalPages == 0 {
			score.JS, score.WXML, score.WXSS = 0, 0, 0
		} else {
			score.JS = ratio(artifacts.JSParseable, max(artifacts.TotalPages, artifacts.JSFiles))
			score.WXML = ratio(artifacts.WXMLParseable, max(artifacts.TotalPages, artifacts.WXMLFiles))
			if artifacts.WXMLQualityIssueFiles > 0 {
				qualityTotal := max(artifacts.TotalPages, artifacts.WXMLFiles)
				cleanFiles := max(artifacts.WXMLFiles-min(artifacts.WXMLQualityIssueFiles, artifacts.WXMLFiles), 0)
				score.WXML = min(score.WXML, ratio(cleanFiles, qualityTotal))
			}
			if artifacts.WXSSFiles == 0 {
				// A page without a wxss file is valid in Mini Programs. Absence must
				// not reduce the recovery score; existing style files still must parse.
				score.WXSS = 100
			} else {
				score.WXSS = ratio(artifacts.WXSSParseable, artifacts.WXSSFiles)
			}
		}
		if artifacts.TotalPages > 0 {
			missingRatio := ratio(len(artifacts.MissingPageTriplet), artifacts.TotalPages)
			score.GeneratedRatio = max(missingRatio, 0)
		}
	}
	score.VerifierPassed = manifest != nil && manifest.Success && artifacts != nil && artifacts.Success && artifacts.VerifierPassed

	if fallbackUsed {
		score.FallbackPenalty = 10
	}
	verifierWeight := 0
	if score.VerifierPassed {
		verifierWeight = 100
	}
	overall := float64(score.Manifest)*0.3 + float64(score.JS)*0.2 + float64(score.WXML)*0.2 + float64(score.WXSS)*0.2 + float64(verifierWeight)*0.1
	score.Overall = max(int(overall)-score.FallbackPenalty-score.GeneratedRatio/4, 0)
	if !score.VerifierPassed {
		// A report with a failed verification gate must not look like an
		// excellent recovery merely because the remaining files parse.
		score.Overall = min(score.Overall, 79)
	}
```

</details>

**依据 4 · 作者声明**：[README.md:102-120](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/README.md#L102-L120)

作者明确状态和恢复限制

<details>
<summary>查看原文（19行）</summary>

```text
| 结果状态                                | 含义                                     | 建议                                 |
| --------------------------------------- | ---------------------------------------- | ------------------------------------ |
| 反编译结果已生成（`completed`）         | 核心结果存在且静态检查通过               | 可以继续分析，但不代表与原始源码一致 |
| 结果已生成，部分内容需检查（`partial`） | 已生成可下载结果，但部分内容无法完全确认 | 先阅读检查提示和报告                 |
| 反编译未完成（`failed`）                | 核心步骤无法安全完成                     | 检查 AppID、文件完整性和错误提示     |

结果评分衡量结构完整度和静态可解析性，不表示原始源码复现程度，也不保证运行正确性。

## 支持范围与限制

| 包类型或结构      | 当前支持情况                                                 |
| ----------------- | ------------------------------------------------------------ |
| 标准包            | 支持识别、解包和静态反编译                                   |
| 加密包            | 支持，但必须提供与目标包匹配的 AppID                         |
| 微信 4.x 聚合结构 | 支持常见结构，不承诺覆盖所有客户端版本和编译形态             |
| 独立分包          | 可以识别；缺少主包运行时时会跳过不可靠处理并标记为 `partial` |
| 小游戏包          | 当前仅做分类识别，不承诺完整反编译                           |

反编译无法重新生成编译时已经丢失的注释、原始变量名、源码目录和构建配置，也无法静态确定所有动态生成、运行时注入或强混淆内容。输出工程不保证可直接重新编译或运行；fallback、生成内容和推断结果会保留来源，不会伪装成原始源码。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自托管、凭据和重启恢复的真实边界是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

部署需要Docker Compose或者Go/Node开发环境、可写本机任务卷及Worker资源；源码Readiness会检查目录写入、Node与fallback/验证脚本是否存在。任务路由按taskId提供进度、下载和报告，README明确没有内置用户认证，任务ID应作为临时访问凭证；因此公网需外部鉴权与资源限制，不能把随机ID当用户权限。一次解密后删除任务凭据，所以中断后的加密任务可能需要用户重传。另一个容易忽略的条件是DIAGNOSTIC_SAMPLES_DIR默认空；启用后会在删除一次性凭据前把包和AppID保存到独立诊断目录。只有completed在终态立即尝试删除诊断样本，partial/failed仍由后台保留清理处理。Server与Worker均接入清理函数，保留小时数大于0时启动即清理、随后每小时按样本目录修改时间删除过期目录；保留小时数为0则不启动，停止服务后也不会继续清理。普通Compose由API负责共享卷清理，保留24小时且未启用诊断样本；生产Compose启用独立samples卷并由API按72小时配置清理，Worker清理设为0。样本删除错误被忽略，故配置周期不是保证准时成功删除的承诺。部署者应先核对实际配置、API存活及清理结果，再处理敏感包。没有运行容器、检验资源隔离或保留清理，也没有恢复率、配置时间和存储量实测。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/compile_service.go:62-129](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L62-L129)

启动前资源检查

<details>
<summary>查看原文（68行）</summary>

```text
// Readiness verifies the local capabilities required to accept a task. Queue
// and repository backends still enforce their own errors when a task is
// created; this check focuses on writable artifact storage and the optional
// formatter process, which previously failed silently.
func (s *CompileService) Readiness() (map[string]interface{}, error) {
	capabilities := map[string]interface{}{
		"repository": s.cfg.TaskRepoDriver,
		"queue":      s.cfg.QueueDriver,
		"beautify":   legacyservice.BeautifyStatus(),
		"recovery": map[string]bool{
			"native":   s.cfg.NativeRecoverEnabled,
			"fallback": s.cfg.FallbackRecoverEnabled,
			"verify":   s.cfg.VerificationEnabled,
		},
	}
	for label, dir := range map[string]string{"temp": s.cfg.TempDir, "output": s.cfg.OutputDir} {
		probe, err := os.CreateTemp(dir, ".readiness-*")
		if err != nil {
			return capabilities, fmt.Errorf("%s directory is not writable: %w", label, err)
		}
		name := probe.Name()
		if err := probe.Close(); err != nil {
			_ = os.Remove(name)
			return capabilities, fmt.Errorf("close %s readiness probe: %w", label, err)
		}
		if err := os.Remove(name); err != nil {
			return capabilities, fmt.Errorf("remove %s readiness probe: %w", label, err)
		}
	}
	if s.cfg.BeautifyEnabled {
		stats := legacyservice.BeautifyStatus()
		enabled, _ := stats["enabled"].(bool)
		healthy, _ := stats["healthy"].(bool)
		if !enabled || !healthy {
			return capabilities, fmt.Errorf("safe formatter is configured but unavailable")
		}
	}
	if s.cfg.FallbackRecoverEnabled || s.cfg.VerificationEnabled {
		binary := s.cfg.NodeBinary
		if binary == "" {
			binary = "node"
		}
		if _, err := exec.LookPath(binary); err != nil {
			return capabilities, fmt.Errorf("node.js runtime required by recovery is unavailable: %w", err)
		}
	}
	resources := map[string]bool{}
	if s.cfg.FallbackRecoverEnabled {
		_, err := process.ResolveExistingPath(
			filepath.Join("backend", "internal", "beautify", "wxappUnpacker", "wuWxapkg.js"),
			filepath.Join("internal", "beautify", "wxappUnpacker", "wuWxapkg.js"),
		)
		if err != nil {
			return capabilities, fmt.Errorf("fallback recovery resource unavailable: %w", err)
		}
		resources["fallbackScript"] = true
	}
	if s.cfg.VerificationEnabled {
		_, err := process.ResolveExistingPath(
			filepath.Join("backend", "internal", "beautify", "runtime", "verify_artifacts.js"),
			filepath.Join("internal", "beautify", "runtime", "verify_artifacts.js"),
		)
		if err != nil {
			return capabilities, fmt.Errorf("artifact verifier resource unavailable: %w", err)
		}
		resources["artifactVerifier"] = true
	}
	capabilities["resources"] = resources
```

</details>

**依据 2 · 源码核查**：[backend/internal/api/http/router.go:21-35](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/api/http/router.go#L21-L35)

按taskId访问路由

<details>
<summary>查看原文（15行）</summary>

```text
func (r *Router) RegisterRoutes(engine *gin.Engine) {
	api := engine.Group("/api")
	api.Use(privateResponseHeaders)
	{
		api.GET("/health", r.compile.HealthCheck)
		api.GET("/github/stars", r.stars.Get)
		api.POST("/compile", r.compile.Compile)
		api.GET("/events", r.task.StreamTaskEvents)
		api.GET("/download/:taskId", r.download.DownloadArtifacts)
		api.HEAD("/download/:taskId", r.download.DownloadArtifacts)
		api.GET("/tasks/:taskId", r.task.GetTask)
		api.GET("/tasks/:taskId/report", r.task.GetTaskReport)
		api.GET("/tasks/:taskId/diagnostics", r.task.GetTaskDiagnostics)
		api.GET("/tasks/:taskId/artifacts", r.task.GetTaskArtifacts)
	}
```

</details>

**依据 3 · 作者声明**：[README.md:63-69](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/README.md#L63-L69)

卷保留与加密重传说明

````text
默认 Compose 使用本地文件任务仓库、文件队列和独立 Worker，任务数据只保存在配置的本机卷中。这是单机部署方案，不依赖数据库、缓存或消息队列。停止服务时运行：

```bash
docker compose down
```

Named volumes 会保留任务状态与文件，已进入文件队列的普通未完成任务可在下次启动后继续；服务停机期间自动清理不会运行。为避免长期保存凭据，AppID 在一次解密尝试后即销毁，因此此后若进程意外中断，加密任务需要重新提交。如需立即删除所有上传文件、任务记录和产物，可确认不再需要这些数据后运行 `docker compose down -v`。
````

**依据 4 · 作者声明**：[README.md:124-132](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/README.md#L124-L132)

无认证和部署边界

```text
- 项目不接入外部数据库、缓存或消息队列；任务状态、队列和产物只保存在配置的本地目录或 Docker 卷中。
- 首页 Star 数由 API 服务端向固定的 GitHub 仓库接口查询并短时缓存；浏览器不会直接联系 GitHub，也不会向 GitHub 转发访客 IP、任务信息或上传内容。反编译 Worker 仍保持无外网权限。
- 为让独立 Worker 完成解密，AppID 会短暂写入权限为 `0600` 的一次性凭据文件，不进入任务状态、队列或报告；完成一次解密尝试或任务失败后立即删除。若删除前进程意外退出，凭据最迟随任务目录按保留策略清理；若删除后任务中断，加密包需重新提交。原始文件名和文件大小也不会写入任务记录，升级时还会自动清理旧任务状态中的遗留敏感字段。
- 任务目录权限为 `0700`，任务状态、队列文件和产物权限为 `0600`；生产 Worker 默认禁用外部网络。
- 应用请求日志不记录客户端 IP、查询参数或真实任务 ID，生产网关也默认关闭访问日志。极少量严重基础设施错误日志仍应按敏感数据保护。任务 ID 仍应视为临时访问凭证，不要公开分享。
- 解包与打包会检查路径穿越、绝对路径、重复 ZIP 条目和符号链接。
- Node 辅助进程具有执行超时、输出上限和 V8 old-space 限制；严格的内存隔离仍应依赖容器资源限制。
- API 没有内置用户认证和按用户划分的任务权限。公网部署必须在前置网关增加 TLS、身份认证和限流，并隔离 Worker 网络。
- 正常终态会立即删除原始上传、AppID、fallback 工作区和 raw 重复副本；异常中断遗留、任务记录、恢复源码、报告、失败队列记录及 ZIP 按 `RETAIN_ARTIFACTS_HOURS` 周期清理。代码默认值为 24 小时，公开体验站当前为 72 小时。
```

**依据 5 · 源码核查**：[backend/internal/app/compile_service.go:270-285](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L270-L285)

保存诊断样本后删除一次性凭据

<details>
<summary>查看原文（16行）</summary>

```text
	appID, err := storage.ReadAppIDSecret(dirs)
	if err != nil {
		return s.markFailed(ctx, t, "app_id_read_failed", "读取解密凭据失败", err)
	}
	decryptedData, decryptErr := s.decrypt(ctx, t, data, appID)
	// With sample collection enabled, keep the package (decrypted bytes when
	// available) and the one-shot AppID for offline analysis before the
	// credential is destroyed. Best-effort: a storage failure must not change
	// task outcomes.
	if sampleErr := s.saveDiagnosticSample(t, dirs, data, decryptedData, appID); sampleErr != nil {
		log.Printf("[Task] save diagnostic sample failed (%T)", sampleErr)
	}
	deleteSecretErr := storage.DeleteAppIDSecret(dirs)
	if deleteSecretErr != nil {
		return s.markFailed(ctx, t, "app_id_cleanup_failed", "清理解密凭据失败，任务已安全终止", deleteSecretErr)
	}
```

</details>

**依据 6 · 源码核查**：[backend/internal/app/compile_service.go:763-807](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L763-L807)

诊断样本保留条件及仅completed删除

<details>
<summary>查看原文（45行）</summary>

```text
// saveDiagnosticSample retains the package (decrypted bytes when available)
// and the one-shot AppID for offline analysis. Only invoked before the
// credential is destroyed; successful tasks delete their sample at finalize.
func (s *CompileService) saveDiagnosticSample(t *task.Task, dirs storage.TaskDirs, original, decrypted []byte, appID string) error {
	if s.cfg.DiagnosticSamplesDir == "" {
		return nil
	}
	data := original
	if decrypted != nil {
		data = decrypted
	}
	if err := storage.SaveDiagnosticSample(s.cfg.DiagnosticSamplesDir, t.ID, data, appID); err != nil {
		return err
	}
	return nil
}

// discardDiagnosticSample removes a collected sample for a task that ended up
// completing: only failed/partial inputs are worth keeping for analysis.
func (s *CompileService) discardDiagnosticSample(t *task.Task) {
	if s.cfg.DiagnosticSamplesDir == "" {
		return
	}
	if err := os.RemoveAll(filepath.Join(s.cfg.DiagnosticSamplesDir, t.ID)); err != nil {
		log.Printf("[Task] discard diagnostic sample failed (%T)", err)
	}
}

func (s *CompileService) finalizeTask(ctx context.Context, t *task.Task, status task.TaskStatus, code, msg string, cause error) error {
	msg = report.SanitizeText(msg)
	now := time.Now()
	dirs, dirsErr := storage.EnsureTaskDirs(s.cfg.TempDir, t.ID)
	if dirsErr == nil {
		dirsErr = storage.DeleteAppIDSecret(dirs)
	}
	if dirsErr != nil {
		status = task.TaskFailed
		code = "app_id_cleanup_failed"
		msg = "清理解密凭据失败，任务已安全终止"
		cause = errors.Join(cause, dirsErr)
	}
	applyTerminalState(t, status, code, msg, cause, now)
	if status == task.TaskCompleted {
		// Sample collection is for failed/partial inputs only.
		s.discardDiagnosticSample(t)
```

</details>

**依据 7 · 源码核查**：[backend/internal/config/config.go:80-81](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/config/config.go#L80-L81)

默认关闭诊断样本

```text
		RetainArtifactsHours: getEnvInt("RETAIN_ARTIFACTS_HOURS", 24),
		DiagnosticSamplesDir: getEnv("DIAGNOSTIC_SAMPLES_DIR", ""),
```

**依据 8 · 源码核查**：[backend/internal/infra/storage/local_fs.go:122-169](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/infra/storage/local_fs.go#L122-L169)

诊断包与AppID写入独立目录，过期删除按目录mtime且忽略删除错误

<details>
<summary>查看原文（48行）</summary>

```text
func SaveDiagnosticSample(samplesDir string, taskID string, data []byte, appID string) error {
	if samplesDir == "" || taskID == "" || len(data) == 0 {
		return nil
	}
	dir := filepath.Join(samplesDir, taskID)
	if err := os.MkdirAll(dir, 0700); err != nil {
		return err
	}
	if err := writePrivateFileAtomic(filepath.Join(dir, "input.wxapkg"), func(file *os.File) error {
		_, err := file.Write(data)
		return err
	}); err != nil {
		return err
	}
	if appID != "" {
		if err := writePrivateFileAtomic(filepath.Join(dir, "appid.txt"), func(file *os.File) error {
			_, err := file.Write([]byte(appID))
			return err
		}); err != nil {
			return err
		}
	}
	return syncDirectory(dir)
}

// CleanupDiagnosticSamples removes per-task sample directories older than the
// cutoff. The janitor calls this alongside artifact cleanup; the samples dir is
// a separate root so a failure there never disturbs artifact retention.
func CleanupDiagnosticSamples(samplesDir string, cutoff time.Duration) {
	if samplesDir == "" {
		return
	}
	entries, err := os.ReadDir(samplesDir)
	if err != nil {
		return
	}
	deadline := time.Now().Add(-cutoff)
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		info, err := entry.Info()
		if err != nil {
			continue
		}
		if info.ModTime().Before(deadline) {
			_ = os.RemoveAll(filepath.Join(samplesDir, entry.Name()))
		}
```

</details>

**依据 9 · 源码核查**：[backend/internal/infra/storage/local_fs.go:432-451](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/infra/storage/local_fs.go#L432-L451)

保留期为0禁用，启动和每小时清理，取消时退出

<details>
<summary>查看原文（20行）</summary>

```text
func StartRetentionJanitorWithSamples(ctx context.Context, tempDir, outputDir, samplesDir string, retainHours int) {
	if retainHours <= 0 {
		return
	}
	ticker := time.NewTicker(time.Hour)
	go func() {
		defer ticker.Stop()
		cutoff := time.Duration(retainHours) * time.Hour
		cleanupRetentionRoots(tempDir, outputDir, cutoff)
		CleanupDiagnosticSamples(samplesDir, cutoff)
		for {
			select {
			case <-ticker.C:
				cleanupRetentionRoots(tempDir, outputDir, cutoff)
				CleanupDiagnosticSamples(samplesDir, cutoff)
			case <-ctx.Done():
				return
			}
		}
	}()
```

</details>

**依据 10 · 源码核查**：[backend/cmd/server/main.go:71-76](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/cmd/server/main.go#L71-L76)

API实际将配置中的诊断目录和保留小时数传入清理入口

```text
	compileService := app.NewCompileService(cfg, repo, broker, jobQueue)
	queryService := app.NewTaskQueryService(cfg, repo)
	workerCtx, workerCancel := context.WithCancel(context.Background())
	defer workerCancel()
	persistence.StartRetentionJanitor(workerCtx, repo, cfg.RetainArtifactsHours)
	storage.StartRetentionJanitorWithSamples(workerCtx, cfg.TempDir, cfg.OutputDir, cfg.DiagnosticSamplesDir, cfg.RetainArtifactsHours)
```

**依据 11 · 源码核查**：[backend/cmd/worker/main.go:44-51](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/cmd/worker/main.go#L44-L51)

Worker也接入同一清理入口

```text
	compileService := app.NewCompileService(cfg, repo, events.NewBroker(), jobQueue)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	persistence.StartRetentionJanitor(ctx, repo, cfg.RetainArtifactsHours)
	storage.StartRetentionJanitorWithSamples(ctx, cfg.TempDir, cfg.OutputDir, cfg.DiagnosticSamplesDir, cfg.RetainArtifactsHours)
	jobQueue.StartWorkers(ctx, cfg.MaxConcurrentTasks, func(workerCtx context.Context, taskID string) error {
		return compileService.RunTask(workerCtx, taskID)
```

**依据 12 · 源码核查**：[docker-compose.yml:26-29](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/docker-compose.yml#L26-L29)

本地API保留期24小时

```text
      NATIVE_RECOVER_ENABLED: "true"
      FALLBACK_RECOVER_ENABLED: "true"
      RETAIN_ARTIFACTS_HOURS: 24
    volumes:
```

**依据 13 · 源码核查**：[docker-compose.yml:64-70](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/docker-compose.yml#L64-L70)

本地Worker关闭清理，由API管理共享卷

```text
      NATIVE_RECOVER_ENABLED: "true"
      FALLBACK_RECOVER_ENABLED: "true"
      # The API owns retention cleanup for the shared volumes.
      RETAIN_ARTIFACTS_HOURS: 0
      MAX_CONCURRENT_TASKS: 2
    volumes:
      - backend-output:/output
```

**依据 14 · 源码核查**：[deploy/production/docker-compose.yml:40-50](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/deploy/production/docker-compose.yml#L40-L50)

生产API保留72小时且配置独立诊断目录与卷

<details>
<summary>查看原文（11行）</summary>

```text
      REPORT_ENABLED: "true"
      NODE_EXEC_TIMEOUT_SECONDS: 120
      NODE_EXEC_MEMORY_MB: 512
      RETAIN_ARTIFACTS_HOURS: 72
      # Failed/partial inputs are retained temporarily for offline analysis.
      DIAGNOSTIC_SAMPLES_DIR: /data/samples
      TZ: Asia/Shanghai
    volumes:
      - backend-tasks:/data/tasks
      - backend-output:/data/output
      - backend-samples:/data/samples
```

</details>

**依据 15 · 源码核查**：[deploy/production/docker-compose.yml:102-111](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/deploy/production/docker-compose.yml#L102-L111)

生产Worker共享诊断卷但保留期0，由API清理

<details>
<summary>查看原文（10行）</summary>

```text
      NODE_EXEC_MEMORY_MB: 512
      # The API owns retention cleanup for the shared volumes.
      RETAIN_ARTIFACTS_HOURS: 0
      # Failed/partial inputs are retained temporarily for offline analysis.
      DIAGNOSTIC_SAMPLES_DIR: /data/samples
      TZ: Asia/Shanghai
    volumes:
      - backend-tasks:/data/tasks
      - backend-output:/data/output
      - backend-samples:/data/samples
```

</details>

#### 缺口

- 缺少与已知原工程逐项对齐的恢复结果和故障重启记录
  **影响**：无法判定业务语义恢复率及真实可恢复性
  **进一步探讨**：用自有固定小程序的普通、聚合、分包样本对齐文件与行为，分别记录partial和中断后重传成本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 适合怎样试用，如何验证比单一静态分数更有用的报告？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可以给拥有目标包分析权限、需要阅读恢复工程的开发者试用受控自托管实例。先用自有最小样本核对输出来源、缺失文件、报告和下载内容，再用加密/分包样本观察partial与重传；不把恢复输出直接部署或视为原作者源码。若关键页面缺失、报告来源不清、需要原工程等价保证或部署没有鉴权隔离，应停用并回到原工程或人工静态分析。由分数只度量可解析性而来源信息独立保存，可推导未验证假设：报告按“可直接阅读、推断、缺失”标明每项产物与原包位置，比单总分更能减少错误采用。最小比较同一批恢复结果分别展示单分数与来源/缺口标注，观察开发者识别不可运行页面的比例与复核时间；若标注不能提高识别或大量错标使信任降低，该假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/compile_service.go:328-340](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L328-L340)

产物保留来源信息

<details>
<summary>查看原文（13行）</summary>

```text
	artifactFiles := []task.ArtifactFile{
		{
			Path:   filepath.ToSlash(filepath.Join("src", filepath.Base(manifestResult.OutputPath))),
			Kind:   "json",
			Source: "manifest",
		},
	}

	decompileArtifacts, fallbackUsed, decompilePartial, err := s.recoverDecompile(ctx, t, normalized, decryptedData, dirs)
	if err != nil {
		return s.markFailed(ctx, t, "decompile_failed", "深度恢复阶段失败", err)
	}
	artifactFiles = append(artifactFiles, decompileArtifacts...)
```

</details>

**依据 2 · 源码核查**：[backend/internal/app/compile_service.go:399-420](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/backend/internal/app/compile_service.go#L399-L420)

摘要和状态已存在，作为假设参照

<details>
<summary>查看原文（22行）</summary>

```text
	t.ArtifactSummary = s.buildArtifactSummary(t, dirs, reportPath, diagnosticsPath, artifactFiles)
	finalFileCount := t.ArtifactSummary.FileCount
	status, code, message := determineFinalStatus(manifestVerifyResult, artifactVerifyResult, decompilePartial)
	switch status {
	case task.TaskPartial:
		if t.PackageProfile != nil && t.PackageProfile.IsGamePackage {
			// Mini-game packages render via Canvas and carry no WXML pages;
			// the generic "missing WXML" message would mislead.
			message = fmt.Sprintf("已整理 %d 个源码文件（小游戏包，无 WXML 页面，以 Canvas 渲染）", finalFileCount)
			break
		}
		message = fmt.Sprintf("已整理 %d 个源码文件；%s，详见 recovery-report.json", finalFileCount, message)
	case task.TaskCompleted:
		message = fmt.Sprintf("处理完成，共整理 %d 个源码文件", finalFileCount)
	}

	if err := s.packageResult(ctx, t, dirs); err != nil {
		return s.markFailed(ctx, t, "package_failed", "打包结果失败", err)
	}
	s.refreshArtifactSummary(t)

	return s.finalizeTask(ctx, t, status, code, message, nil)
```

</details>

**依据 3 · 作者声明**：[README.md:102-120](https://github.com/Leslie-SSS/seeWxapkg/blob/adad9c351df4982a639364f85b793347bea547f8/README.md#L102-L120)

静态可解析性与原工程语义的差别

<details>
<summary>查看原文（19行）</summary>

```text
| 结果状态                                | 含义                                     | 建议                                 |
| --------------------------------------- | ---------------------------------------- | ------------------------------------ |
| 反编译结果已生成（`completed`）         | 核心结果存在且静态检查通过               | 可以继续分析，但不代表与原始源码一致 |
| 结果已生成，部分内容需检查（`partial`） | 已生成可下载结果，但部分内容无法完全确认 | 先阅读检查提示和报告                 |
| 反编译未完成（`failed`）                | 核心步骤无法安全完成                     | 检查 AppID、文件完整性和错误提示     |

结果评分衡量结构完整度和静态可解析性，不表示原始源码复现程度，也不保证运行正确性。

## 支持范围与限制

| 包类型或结构      | 当前支持情况                                                 |
| ----------------- | ------------------------------------------------------------ |
| 标准包            | 支持识别、解包和静态反编译                                   |
| 加密包            | 支持，但必须提供与目标包匹配的 AppID                         |
| 微信 4.x 聚合结构 | 支持常见结构，不承诺覆盖所有客户端版本和编译形态             |
| 独立分包          | 可以识别；缺少主包运行时时会跳过不可靠处理并标记为 `partial` |
| 小游戏包          | 当前仅做分类识别，不承诺完整反编译                           |

反编译无法重新生成编译时已经丢失的注释、原始变量名、源码目录和构建配置，也无法静态确定所有动态生成、运行时注入或强混淆内容。输出工程不保证可直接重新编译或运行；fallback、生成内容和推断结果会保留来源，不会伪装成原始源码。
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
