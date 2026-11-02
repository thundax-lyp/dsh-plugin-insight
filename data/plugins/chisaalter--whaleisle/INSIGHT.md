# 鲸屿 Whale Isle

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[511b57c](https://github.com/ChisaAlter/WhaleIsle/tree/511b57c1fb45fdfd014c10e9910341ab6a8e43b4)

<!-- BEGIN META -->
[![GitHub ★ 200](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=200&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChisaAlter/WhaleIsle)
<!-- END META -->

> **功能**：基于 DeepSeek Harness 的社区桌面客户端，整合对话、文件预览、终端与 Git。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)桌面统一生命周期、独立home与真实Host准入协调，基础Agent继承上游。

> **主要限制**：[Q03](#research-q03)排空注册操作非业务任务结束，force更新/退出deadline可继续；未知远端结果不能当取消成功。

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
  - [Q01 · 根项目是什么，客户端增量在哪里？](#detail-section-11)
  - [Q02 · 独立home与任务保护是否真正接线？](#detail-section-12)
  - [Q03 · 排空、更新和退出能承诺什么？](#detail-section-13)
  - [Q04 · 怎样可控采用，结果收据有什么增量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望同窗口完成DSH对话与文件/终端/Git的桌面用户。

官方DSH CLI/Web加浏览器及独立工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面统一入口 | 对话/文件/终端/Git | Agent能力继承DSH |
| 独立home | 分开官方配置 | 非OS隔离/自动迁移 |
| 任务准入 | 退出更新前检查锁/排空 | 注册操作非业务完成 |
| 强制收尾 | 显式操作不中断等待无限 | 需对账未知外部结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Electron/Node/Harness | 必需 | 桌面与Agent运行 | 发行等价未验 |
| 内置task-control/Host服务 | 生命周期必需 | 准入与检查 | overlay缺失启动拒绝 |
| 模型API/工作区权限 | 任务需要 | 工具执行 | 费用与外部结果另核 |
| 数据备份/迁出方法 | 采用必需 | 恢复/退出 | home分离非自动兼容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份/副本工作区 | 核desktop与官方home |
| 任务 | 低风险模型/后台job | 记录操作与原文件 |
| 退出更新 | 壳检查/锁/排空/commit | 区分forced和业务结果 |
| 异常退出 | 停写保留日志/会话 | 回CLI/Web对账远端与数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包/数据副本 | 安装/模型/迁移配置 | 平台耗时未验 |
| 持续 | 模型/内置Host资源 | 维护扩展/更新核验 | 净节时未知 |
| 失败恢复 | 备份/日志 | 分清排空与业务结果 | 远端取消未验 |
| 退出 | 独立home/导出 | 重配CLI/Web/核兼容 | 非复制即兼容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一桌面 | 根客户端与主入口 | 真实开发效率 |
| home分离 | 覆盖spawn环境 | OS隔离不成立 |
| 任务协调 | token/准入/epoch/释放 | 全任务完成不成立 |
| 退出更新 | 明确force/deadline路径 | 业务恢复/远端停止 |

> **思考**：[Q03](#research-q03)排空注册操作非业务任务结束，force更新/退出deadline可继续；未知远端结果不能当取消成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)桌面统一生命周期、独立home与真实Host准入协调，基础Agent继承上游。

[Q02](#research-q02)必需overlay、启动token、同步job wrapper、TTL/epoch及commit失败释放；非全任务事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)排空注册操作非业务任务结束，force更新/退出deadline可继续；未知远端结果不能当取消成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)熟悉DSH者用备份/副本工作区核home与退出重开，异常停更新回官方CLI/Web对账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根客户端home/任务控制/退出更新关键链静态核查，未运行安装包、模型或远程任务。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/shared/dsh-home.js、src/shared/child-spawn-env.js、src/main/index.js、src/main/dsh.js、src/main/update.js、src/main/harness-controller.js、src/main/task-control-overlay.js、src/main/task-protection.js、vendor/dsh-task-control/lib/index.js、vendor/dsh-task-control/lib/state.js、vendor/dsh-task-control/lib/http.js、vendor/dsh-task-control/lib/wrap.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根客户端身份与独立home、task-protection/Host admission/退出更新关键段；非全UI、Android、远程安全、所有扩展或更新器审计，不执行目标。
- 下一步：固定包独立home/后台job/HTTP写/模型断连/退出重开/安装失败/外部结果对账与原Web基线。

**分析版本**

- **仓库**：[ChisaAlter/WhaleIsle](https://github.com/ChisaAlter/WhaleIsle)
- **版本号**：0.3.13（[固定提交 511b57c](https://github.com/ChisaAlter/WhaleIsle/tree/511b57c1fb45fdfd014c10e9910341ab6a8e43b4)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)将已有forced/pending诊断形成重开待对账收据可探索，日志同效或提示误导即否定。

固定包独立home/后台job/HTTP写/模型断连/退出重开/安装失败/外部结果对账与原Web基线。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 651 | 53401 | — | — | 982820 |
| .mjs | source | 235 | 42964 | 38435 | 2293 | — |
| .js | source | 323 | 169888 | 150115 | 11160 | — |
| .cjs | source | 39 | 6824 | 6019 | 522 | — |
| .mjs | example | 2 | 105 | 100 | 6 | — |
| .js | test | 282 | 73245 | 66716 | 2947 | — |
| .mjs | test | 40 | 11292 | 10081 | 552 | — |
| .cjs | example | 1 | 38 | 36 | 1 | — |
| .tsx | source | 34 | 6475 | 5487 | 727 | — |
| .ts | source | 124 | 24873 | 20339 | 3185 | — |
| .js | example | 2 | 233 | 202 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ChisaAlter/WhaleIsle/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 33](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=33&color=737b86&logo=github)](https://github.com/ChisaAlter/WhaleIsle/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/ChisaAlter/WhaleIsle/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核根客户端独立home与退出/更新任务保护接线和状态边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是什么，客户端增量在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Whale Isle根是Electron桌面客户端而非可装到DSH的单个插件。面向希望对话、文件预览、终端和Git在一个窗口工作的用户，另有手机连接入口。Agent loop、模型工具和会话基础继承DeepSeek Harness；客户端承担桌面生命周期、运行目录及内置插件组合。本轮核独立home与退出/更新任务保护，相对直接dsh web加浏览器的增量是同一壳管理运行态/资源退出，不把UI皮肤、手机或全市场列成功能验收。合格结果是用户能明确任务状态和数据去向，升级/退出不会被误报为完成。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:6-9](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/README.md#L6-L9)

作者统一工作入口。

```text

<p align="center">
  基于 DeepSeek Harness 的开源社区客户端<br />
  AI 对话、文件预览、终端与 Git，一个窗口完成。
```

**依据 2 · 源码核查**：[README.md:30-58](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/README.md#L30-L58)

独立社区客户端/平台与费用声明。

<details>
<summary>查看原文（29行）</summary>

```text
社区独立维护，非 DeepSeek 官方产品。

## 下载 v0.3.13

| 平台 | GitHub | 国内镜像 |
| --- | --- | --- |
| Windows 10+ · x64 | [安装包](https://github.com/ChisaAlter/WhaleIsle/releases/download/v0.3.13/Whale-Isle-Setup-0.3.13.exe) | [CNB](https://cnb.cool/ayasealter/WhaleIsle/-/releases/download/v0.3.13/Whale-Isle-Setup-0.3.13.exe) |
| macOS 14+ · Apple Silicon | [ARM64 DMG](https://github.com/ChisaAlter/WhaleIsle/releases/download/v0.3.13/Whale-Isle-0.3.13-mac-arm64.dmg) | [CNB](https://cnb.cool/ayasealter/WhaleIsle/-/releases/download/v0.3.13/Whale-Isle-0.3.13-mac-arm64.dmg) |
| Android 8.0+ | [APK](https://github.com/ChisaAlter/WhaleIsle/releases/download/android-v0.3.11/Whale-Isle-0.3.11-android.apk) | [CNB](https://cnb.cool/ayasealter/WhaleIsle/-/releases/download/android-v0.3.11/Whale-Isle-0.3.11-android.apk) |

桌面安装包未签名，Mac 首次打开需右键「打开」；Android 独立发布。各发布页附 SHA512 校验清单。

## 快速开始

1. 安装桌面端，在「设置 → 模型」配置 API 服务（费用由模型服务商收取）。
2. 选择工作目录，或直接新建会话。
3. 手机安装 Android 客户端，扫描桌面「远程」二维码连接。

## 功能

- **对话与协作**：工具调用、审批、Agent 团队与 Project。
- **文件与开发**：文件编辑、网页与 Diff 预览、终端、Git。
- **实时面板**：悬浮面板，可用命令、HTTP 或 AI 持续刷新。
- **扩展**：MCP、技能、插件市场；Windows 可安装[鲸桥](docs/features/launcher-components.md)。
- **外观与用量**：Codex / Claude 皮肤、壁纸、Live2D 鲸鱼娘、Token 与费用统计。

<table>
  <tr><th>启动器</th><th>Android 连接页</th></tr>
  <tr>
```

</details>

**依据 3 · 源码核查**：[package.json:1-9](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/package.json#L1-L9)

Electron根客户端main/private。

```text
{
  "name": "deepseek-harness-desktop",
  "productName": "Whale Isle",
  "version": "0.3.13",
  "description": "Whale Isle desktop app based on DeepSeek Harness",
  "author": "Chisa",
  "license": "MIT",
  "main": "src/main/index.js",
  "private": true,
```

#### 缺口

- 完整桌面/Android/远程/全部扩展与真实开发任务未审。
  **影响**：不能对全产品/跨端安全和效率背书。
  **进一步探讨**：独立运行目录做对话→文件修改→退出重开小任务；远程另立边界验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 独立home与任务保护是否真正接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

main启动先sanitize packaged DSHD_HOME再将userData/dsh-home设为desktop home；spawn环境删DSH_HOME大小写变体后覆盖桌面路径并清Electron变量。DSH进程和插件安装应使用此环境，PTY/官方命令不应由此推成同一路径。独立数据目录是配置分离，不是OS权限隔离。

harness-controller每次启动先ensure任务控制overlay，缺声明/运行文件失败就拒启动；dsh.spawnEnv送每次启动token。Host插件挂webServer/connection、resolveAgent、jobs.start准入，控制路由Bearer缺失拒绝。壳coordinate先inspect，再acquire锁/排空已准入操作，再复查、commit；Host锁有owner/epoch/TTL，排空后检查是否已过期/被替代，超时返回pending标签并释放。jobs.start wrapper保持同步返回，跟踪注册操作而非把JobId改Promise；实际活跃job需独立inspection。commit失败释放，terminal成功才清附属资源/锁定committed。

#### 证据与依据

**依据 1 · 源码核查**：[src/main/index.js:1106-1116](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/index.js#L1106-L1116)

主进程home设置。

<details>
<summary>查看原文（11行）</summary>

```text
    const homeEnv = sanitizePackagedDshHomeEnv({ isPackaged: app.isPackaged });
    setRenderHintsSource(detectGpuTier(app).then((tier) => {
      dsh.log(`显卡：${tier.device || '未知'}（${tier.reason}）${tier.lowPower ? '，默认关闭重渲染特效' : ''}`, 'app');
      return tier;
    }));
    if (homeEnv.dropped) {
      dsh.log(`忽略继承的 DSHD_HOME=${homeEnv.value}（packaged 下需要 DSHD_ALLOW_ENV_HOME=1）`, 'app');
    }
    const desktopHome = setDesktopDshHome(desktopDshHomeFromUserData(app.getPath('userData')));
    fs.mkdirSync(desktopHome, { recursive: true });

```

</details>

**依据 2 · 源码核查**：[src/shared/dsh-home.js:50-83](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/shared/dsh-home.js#L50-L83)

打包环境保护/DSH_HOME覆盖。

<details>
<summary>查看原文（34行）</summary>

```text
 * desktop home away from `userData/dsh-home`; it is honored only with the
 * explicit `DSHD_ALLOW_ENV_HOME=1` switch. Dev / debug (non-packaged) runs
 * keep the override as-is. Call once at main-process startup, before the
 * home is first resolved.
 * @param {{ isPackaged?: boolean, env?: NodeJS.ProcessEnv }} [options]
 * @returns {{ dropped: boolean, value: string }}
 */
function sanitizePackagedDshHomeEnv({ isPackaged = false, env = process.env } = {}) {
  const value = typeof env.DSHD_HOME === 'string' ? env.DSHD_HOME : '';
  if (!isPackaged || !value.trim() || env.DSHD_ALLOW_ENV_HOME === '1') {
    return { dropped: false, value };
  }
  delete env.DSHD_HOME;
  return { dropped: true, value };
}

function applyDesktopDshHome(env = {}) {
  const next = { ...env };
  for (const key of Object.keys(next)) {
    if (key.toUpperCase() === 'DSH_HOME') delete next[key];
  }
  next.DSH_HOME = getDesktopDshHome();
  return next;
}

module.exports = {
  DESKTOP_DSH_HOME_DIRNAME,
  desktopDshHomeFromUserData,
  setDesktopDshHome,
  clearDesktopDshHome,
  getDesktopDshHome,
  tryGetDesktopDshHome,
  applyDesktopDshHome,
  sanitizePackagedDshHomeEnv,
```

</details>

**依据 3 · 源码核查**：[src/shared/child-spawn-env.js:28-39](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/shared/child-spawn-env.js#L28-L39)

环境构造。

<details>
<summary>查看原文（12行）</summary>

```text
function childSpawnEnv(config, { extras = [], baseEnv = process.env } = {}) {
  const env = applyDesktopDshHome({ ...baseEnv });
  delete env.ELECTRON_RUN_AS_NODE;
  delete env.ELECTRON_NO_ASAR;
  applyOfficialDeepSeekSpawnEnv(env, config);
  env.npm_config_update_notifier = 'false';
  env.DSHD_PLUGIN_MARKET_INDEX = 'https://realguan.github.io/dsh-plugin-market/dsh-index.json';
  prependPath(env, extras);
  return env;
}

module.exports = { childSpawnEnv };
```

</details>

**依据 4 · 源码核查**：[src/main/harness-controller.js:580-595](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/harness-controller.js#L580-L595)

overlay先挂/失败拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
    // before dsh-im.
    const patchFiles = [];
    // Task control mounts first among the overlay plugins so its webServer /
    // resolveAgent guards are installed before dsh-im and remote plugins
    // register their routes during apply.
    try {
      const taskControl = await this.ensureTaskControlPlugin();
      checkCurrent();
      if (taskControl && taskControl.ok === false) {
        throw new Error(`桌面内置任务保护失败：${taskControl.error || 'unknown'}`);
      }
      if (taskControl?.overlayFile) {
        patchFiles.push(taskControl.overlayFile);
      }
      if (taskControl && taskControl.ok) {
        this.dsh.log(taskControl.added ? '已接入桌面任务保护' : '桌面任务保护已就绪', 'app');
```

</details>

**依据 5 · 源码核查**：[src/main/task-control-overlay.js:40-77](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/task-control-overlay.js#L40-L77)

声明文件/依赖缺失拒绝。

<details>
<summary>查看原文（38行）</summary>

```text
 *
 * @param {{ sourceDir?: string, profileDir?: string }} [options]
 */
function ensureDesktopTaskControl(options = {}) {
  const sourceDir = options.sourceDir || defaultSourceDir();
  const profileDir = options.profileDir || webProfileDir();
  const pkgFile = path.join(sourceDir, 'package.json');
  if (!fs.existsSync(pkgFile)) {
    return { ok: false, added: false, sourceDir: null, error: 'missing-source:package.json' };
  }

  let manifest = null;
  try {
    manifest = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
  } catch {
    // An unreadable manifest cannot declare entries; reported below.
  }
  const missingEntries = manifest ? missingDeclaredEntries(sourceDir, manifest) : ['package.json'];
  const missingDeps = missingRuntimeFiles(sourceDir);
  if (missingEntries.length || missingDeps.length) {
    return {
      ok: false,
      added: false,
      sourceDir,
      error: `missing-source:${[...missingEntries, ...missingDeps].join(',')}`,
    };
  }

  const destDir = path.join(profileDir, 'desktop-plugins', 'dsh-task-control');
  const overlayFile = path.join(destDir, TASK_CONTROL_OVERLAY_FILENAME);
  const existed = fs.existsSync(overlayFile);

  linkIntoProfileModules(sourceDir, profileDir);

  fs.mkdirSync(destDir, { recursive: true });
  const overlayContents = [
    '# Desktop-managed overlay passed to EVERY start (full and skip) via',
    '# --patch: the task-control insert is required for quit/update protection.',
```

</details>

**依据 6 · 源码核查**：[src/main/dsh.js:863-883](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/dsh.js#L863-L883)

同环境与control token。

<details>
<summary>查看原文（21行）</summary>

```text
    const env = childSpawnEnv(config, { extras });
    env.npm_config_yes = 'true';
    if (root) {
      env.DSH_HARNESS_ROOT = root;
    }
    Object.assign(env, desktopInstallEnv());
    // Default rows precede user patches so plugin management can configure and disable them.
    delete env.DSHD_PROFILE_DEFAULT_PATCH;
    if (config.defaultPatchFile) env.DSHD_PROFILE_DEFAULT_PATCH = config.defaultPatchFile;
    // Carrier declaration for Office rows in any profile layer that reads it;
    // the desktop overlay already carries absolute paths, so a missing
    // payload simply leaves this unset.
    Object.assign(env, officeRuntimeEnv());
    env.DSHD_TASK_CONTROL_TOKEN = taskControlToken();
    env.DSHD_PLATFORM_TOKEN = platformToken();
    env.DSHD_WHALE_UI_ENABLED = '1';
    env.DSHD_WHALE_UI_HOST = require('./whale-ui-host').whaleUiHostFile();
    // Producer-coverage declarations: the control plugin reports these as
    // `unavailable` (not `intentional-disabled`) when the flag is set but the
    // service is missing — a load failure must never read as "deliberately off".
    if (config.scheduleEnabled === true) env.DSHD_SCHEDULE_ENABLED = '1';
```

</details>

**依据 7 · 源码核查**：[vendor/dsh-task-control/lib/index.js:28-98](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/index.js#L28-L98)

Host实际guard/connection接线。

<details>
<summary>查看原文（71行）</summary>

```text
  const state = createControlState();
  const token = String(process.env.DSHD_TASK_CONTROL_TOKEN || '');
  const controlRoutes = [];

  ctx.effect(() => () => {
    state.stopping = true;
    for (const { webServer, route, dispose } of controlRoutes) {
      // A later owner may have replaced this path after unregistering our row.
      // Its registration must survive disposal of this plugin.
      if (webServer.prefixes.get(CONTROL_PREFIX) === route) dispose();
    }
    disposeGuards(state);
  }, 'dsh-task-control.lifecycle');

  const installGuards = () => {
    if (state.stopping) return;
    wrapSessionController(state, ctx.get('sessionController'));
    wrapJobs(state, ctx.get('jobs'));
    const webServer = ctx.get('webServer');
    if (wrapWebServer(state, webServer)) {
      const route = {
        kind: 'prefix',
        path: CONTROL_PREFIX,
        handler: createControlHandler(ctx, state, {
          token,
          onUnlock() {
            // Refused schedule deliveries stay armed; re-drive the runtime so
            // an unlocked Host dispatches them at the next window instead of
            // waiting for the next registration-side trigger.
            const schedule = ctx.get('schedule');
            try {
              schedule?.runtime?.requestDrive?.();
            } catch (error) {
              ctx.logger?.warn?.(`task-control: schedule re-drive failed: ${String(error)}`);
            }
          },
        }),
      };
      controlRoutes.push({ webServer, route, dispose: webServer.register(route) });
    }
  };

  installGuards();
  ctx.on('internal/service', (serviceName) => {
    if (serviceName === 'webServer' || serviceName === 'sessionController' || serviceName === 'jobs') {
      installGuards();
    }
  });

  // Second gate on the /api waterfall: the connection route was registered
  // before this plugin loaded, so it cannot be gated solely by the wrapped
  // registration path in compositions where the route table is rebuilt.
  ctx.on('connection/request', async (request, response, next) => {
    if (admittedBefore(request)) return next();
    const admission = admit(state, `conn ${request.method} ${request.url}`);
    if (!admission.accepted) {
      response.writeHead(503, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: { code: admission.code } }));
      return;
    }
    markAdmitted(request);
    if (undrained(request)) {
      admission.done();
      return next();
    }
    try {
      await next();
    } finally {
      admission.done();
    }
  });
```

</details>

**依据 8 · 源码核查**：[vendor/dsh-task-control/lib/http.js:61-97](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/http.js#L61-L97)

Bearer鉴权到状态操作。

<details>
<summary>查看原文（37行）</summary>

```text
 * @param {{ token: string }} options
 */
export function createControlHandler(ctx, state, options) {
  const token = String(options.token || '');
  const onUnlock = typeof options.onUnlock === 'function' ? options.onUnlock : () => {};
  return async function controlRoute(req, res) {
    if (!authorized(req, token)) {
      sendJson(res, 401, { ok: false, code: 'dshd/unauthorized' });
      return;
    }
    const op = new URL(req.url || '/', 'http://x').pathname.slice(CONTROL_PREFIX.length).replace(/^\/+|\/+$/g, '');
    let body = {};
    if (req.method === 'POST') {
      try {
        body = await readBody(req);
      } catch (error) {
        sendJson(res, 400, { ok: false, code: 'dshd/bad-request', detail: error.message });
        return;
      }
    }
    try {
      switch (op) {
        case 'status':
          sendJson(res, 200, { ok: true, ...lockStatus(state) });
          return;
        case 'inspect': {
          sendJson(res, 200, await collectInspection(ctx, state));
          return;
        }
        case 'acquire': {
          sendJson(res, 200, await acquireLock(state, body));
          return;
        }
        case 'renew':
          sendJson(res, 200, renewLock(state, body));
          return;
        case 'release': {
```

</details>

**依据 9 · 源码核查**：[vendor/dsh-task-control/lib/state.js:45-68](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/state.js#L45-L68)

同步admit/pending。

<details>
<summary>查看原文（24行）</summary>

```text
 * Admit one unit of independent work while unlocked. Admitted work registers
 * in `pending` until `done()` runs; a lock acquire drains exactly this set, so
 * the admit check and the pending add stay synchronous/atomic. `label`
 * identifies the admission kind in drain-timeout diagnostics.
 * @param {ReturnType<typeof createControlState>} state
 * @param {string} [label]
 * @returns {{ accepted: true, done: () => void } | { accepted: false, code: string }}
 */
export function admit(state, label) {
  pruneExpiredLock(state, Date.now());
  if (state.stopping) return { accepted: false, code: 'dshd/host-stopping' };
  if (lockLive(state, Date.now())) return { accepted: false, code: LOCKED_CODE };
  let settle;
  const entry = { label: String(label || '?'), promise: new Promise((resolve) => { settle = resolve; }) };
  state.pending.add(entry);
  let closed = false;
  return {
    accepted: true,
    done() {
      if (closed) return;
      closed = true;
      state.pending.delete(entry);
      settle();
    },
```

</details>

**依据 10 · 源码核查**：[vendor/dsh-task-control/lib/state.js:103-155](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/state.js#L103-L155)

锁generation/TTL排空检查。

<details>
<summary>查看原文（53行）</summary>

```text
  const owner = String(request.owner || '').trim();
  if (!owner) return { ok: false, code: 'dshd/bad-owner' };
  const ttlMs = Number.isFinite(request.ttlMs) && request.ttlMs > 0 ? request.ttlMs : 60000;
  if (lockLive(state, now)) {
    if (state.lock.owner === owner) {
      // Same-owner re-acquire renews and re-drains; the lock identity is stable
      // so a held lockId remains valid.
      state.lock.expiresAt = now + ttlMs;
    } else {
      return { ok: false, code: 'dshd/lock-held', owner: state.lock.owner };
    }
  } else {
    state.lock = {
      lockId: randomUUID(),
      owner,
      kind: String(request.kind || 'generic'),
      generation: ++state.lockEpoch,
      acquiredAt: now,
      expiresAt: now + ttlMs,
    };
  }
  const generation = state.lock.generation;
  const drain = await waitForDrain(state, Number(request.drainTimeoutMs) || 30000);
  if (state.stopping) {
    releaseLock(state, { lockId: state.lock.lockId, owner });
    return { ok: false, code: 'dshd/host-stopping' };
  }
  // Expiry is lazy — prune BEFORE the generation check so a lock whose TTL
  // lapsed mid-drain reads as superseded rather than committing stale.
  pruneExpiredLock(state, Date.now());
  if (state.lock === null || state.lock.generation !== generation) {
    return { ok: false, code: 'dshd/lock-superseded' };
  }
  if (!drain.drained) {
    releaseLock(state, { lockId: state.lock.lockId, owner });
    return { ok: false, code: 'dshd/drain-timeout', pendingCount: drain.count, pendingLabels: drain.labels };
  }
  return {
    ok: true,
    lockId: state.lock.lockId,
    owner,
    generation,
    hostGeneration: state.hostGeneration,
    expiresAt: state.lock.expiresAt,
    drainedPending: drain.count,
  };
}

/**
 * @param {ReturnType<typeof createControlState>} state
 * @param {{ lockId: string, owner: string }} request
 */
export function releaseLock(state, request) {
```

</details>

**依据 11 · 源码核查**：[vendor/dsh-task-control/lib/wrap.js:263-285](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/wrap.js#L263-L285)

jobs同步返回仅注册。

<details>
<summary>查看原文（23行）</summary>

```text
/** Wrap `jobs.start` so background-job producers cannot start during a lock. */
export function wrapJobs(state, jobs) {
  jobs = jobs?.[ORIGINAL] || jobs;
  if (jobs === undefined || jobs === null || jobs[WRAPPED]) return false;
  const original = jobs.start;
  if (typeof original !== 'function') return false;
  const guard = createGuard(state, jobs);
  replaceOwnedProperty(guard, jobs, 'start', function jobsStartGuarded(...args) {
    if (!guard.active) return original.apply(this, args);
    const admission = admit(state, 'jobs.start');
    if (!admission.accepted) {
      throw new AdmissionLockedError('job start refused while locked');
    }
    try {
      // JobRegistry.start is synchronous: shell consumers immediately use
      // its returned JobId in wait/read/kill. Active jobs are inspected
      // separately; admission tracks only this registration operation.
      return original.apply(this, args);
    } finally {
      admission.done();
    }
  });
  return true;
```

</details>

**依据 12 · 源码核查**：[src/main/task-protection.js:208-277](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/task-protection.js#L208-L277)

协调/失败释放/terminal commit。

<details>
<summary>查看原文（70行）</summary>

```text
  async function coordinate(operation, opts = {}) {
    if (committed) {
      // A committed protection decision is not re-coordinated — the shutdown
      // sequence it authorized is already running.
      if (typeof opts.commit === 'function') await opts.commit();
      return { proceeded: true };
    }
    if (coordinating !== null) {
      return { proceeded: false, code: 'busy' };
    }
    coordinating = operation;
    try {
      const first = mergedInspection(await inspect());
      if (!inspectionClean(first) && opts.preConfirmed !== true) {
        if (!(await confirmWithUser(operation, first))) {
          return { proceeded: false, code: 'cancelled', inspection: first };
        }
      }
      let forced = null;
      if (hostRunning() && opts.hostLock !== false) {
        const acquired = await acquire(operation, opts.drainTimeoutMs);
        if (acquired.ok !== true) {
          const failure = {
            code: acquired.code || 'acquire-failed',
            detail: acquired.detail,
            pendingCount: acquired.pendingCount,
            pendingLabels: acquired.pendingLabels,
          };
          if (opts.force !== true) return { proceeded: false, ...failure };
          forced = failure;
          log(`task-protection ${operation}: proceeding without Host admission ${JSON.stringify(failure)}`);
        }
        const second = forced ? first : mergedInspection(await inspect());
        if (!forced && !inspectionClean(second) && inspectionClean(first) && opts.preConfirmed !== true) {
          // Work arrived between the first look and the lock — re-confirm
          // against the fresh picture rather than riding an obsolete prompt.
          if (!(await confirmWithUser(operation, second))) {
            await release();
            return { proceeded: false, code: 'cancelled', inspection: second };
          }
        }
      }
      try {
        if (typeof opts.commit === 'function') {
          await opts.commit();
        }
      } catch (error) {
        // A failed commit must not freeze Host admissions for the TTL —
        // release before the error propagates.
        if (opts.hostLock !== false) await release();
        throw error;
      }
      // Keep supervised services and their cleanup registrations intact when
      // a terminal commit fails (for example, an installer rejected at spawn).
      // A successful terminal commit is followed by cleanup before app.quit.
      if (opts.terminal === true) await runCommitCleanups();
      if (opts.terminal === true) committed = true;
      else if (opts.hostLock !== false) {
        // The Host may have survived a failed non-terminal commit; release so
        // admissions are not frozen for the TTL.
        await release();
      }
      return forced ? { proceeded: true, forced } : { proceeded: true };
    } finally {
      coordinating = null;
    }
  }

  return {
    coordinate,
```

</details>

#### 缺口

- 实际安装包overlay等价、活跃producer覆盖与持久会话恢复未运行。
  **影响**：静态接线不等所有工作被观测或无状态损失。
  **进一步探讨**：真实Host同时跑job/Agent/HTTP写并执行锁/退出/重开，核源数据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 排空、更新和退出能承诺什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

准入锁只限制已接的入口，排空集是有限操作，不是所有Agent/job任务生命周期；读请求/watch和next-prompt按设计不等待。不能把acquire成功理解为业务任务完成。token是每次启动内部控制鉴权，不替代所有远程/模型/扩展授权，本轮未核全网路由。

显式peer停止/安装和update入口preConfirmed并force，排空失败仍可能commit；这是用户操作优先的可用性取舍。正常quit保留3秒drain、30秒总等待，失败记诊断后最多再清理5秒并app.exit；最终窗口也有5秒deadline。因而任务保护不是永不强退、持久任务恢复或远端副作用回滚。超时/进程退出只说明本地等待结束，不证明模型/SSH/外部命令停止或未执行，应按未知结果核查。文档有历史QA/包号，不能继承成当前提交/当前安装包验收；本轮全为静态源码。

#### 证据与依据

**依据 1 · 源码核查**：[vendor/dsh-task-control/lib/wrap.js:63-79](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/wrap.js#L63-L79)

无损请求不排空。

<details>
<summary>查看原文（17行）</summary>

```text
// locked, but a lock does not wait for them. Reads have no side effect to
// protect, and watch streams such as `GET /api/dsh-pad.stream` stay open for
// as long as the window shows them. The composer's next-prompt suggestion is
// a POST that holds its request open for up to 30 s of model time, the whole
// default drain window.
const UNDRAINED_PATHS = new Set(['/api/conversation.next-prompt']);

export function undrained(req) {
  if (isReadMethod(req)) return true;
  const path = String(req.url || '').split('?', 1)[0];
  return UNDRAINED_PATHS.has(path);
}

// One HTTP request passes two gates: the `connection/request` waterfall and
// the route or fallback wrapper behind it. The first gate to admit it owns the
// admission, so the request counts once in inspection and drain.
const ADMITTED = Symbol('dsh-task-control.admitted');
```

</details>

**依据 2 · 源码核查**：[vendor/dsh-task-control/lib/wrap.js:263-285](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/wrap.js#L263-L285)

job注册非job完成。

<details>
<summary>查看原文（23行）</summary>

```text
/** Wrap `jobs.start` so background-job producers cannot start during a lock. */
export function wrapJobs(state, jobs) {
  jobs = jobs?.[ORIGINAL] || jobs;
  if (jobs === undefined || jobs === null || jobs[WRAPPED]) return false;
  const original = jobs.start;
  if (typeof original !== 'function') return false;
  const guard = createGuard(state, jobs);
  replaceOwnedProperty(guard, jobs, 'start', function jobsStartGuarded(...args) {
    if (!guard.active) return original.apply(this, args);
    const admission = admit(state, 'jobs.start');
    if (!admission.accepted) {
      throw new AdmissionLockedError('job start refused while locked');
    }
    try {
      // JobRegistry.start is synchronous: shell consumers immediately use
      // its returned JobId in wait/read/kill. Active jobs are inspected
      // separately; admission tracks only this registration operation.
      return original.apply(this, args);
    } finally {
      admission.done();
    }
  });
  return true;
```

</details>

**依据 3 · 源码核查**：[src/main/index.js:850-882](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/index.js#L850-L882)

peer显式force。

<details>
<summary>查看原文（33行）</summary>

```text
  onPeerStop: async () => {
    // "Stop the desktop" for an external launcher means this process exits —
    // the legacy path was taskkill, so the protected equivalent is a
    // terminal coordinate followed by the normal quit funnel. The launcher's
    // stop button is explicit consent: preConfirmed keeps the
    // inspect/acquire/drain sequencing but skips the confirm — prompting
    // again would double-prompt one click (and with every desktop window
    // hidden it fell back to a native box).
    // Like quit, an explicit stop proceeds after a short drain even with work
    // still running.
    const result = await taskProtection.coordinate('stop', {
      terminal: true, preConfirmed: true, force: true, drainTimeoutMs: 10_000,
    });
    if (!result.proceeded) {
      return { ok: false, code: result.code || 'cancelled' };
    }
    setTimeout(() => quitApp(), 250);
    return { ok: true, quit: true };
  },
  onPeerInstall: async () => {
    // Same explicit-consent rule as onPeerStop: the launcher's install/更新
    // click already authorized replacing the running desktop.
    const result = await taskProtection.coordinate('install', {
      terminal: true, preConfirmed: true, force: true, drainTimeoutMs: 10_000,
    });
    if (!result.proceeded) {
      return { ok: false, code: result.code || 'cancelled' };
    }
    // Flush the response before the process starts its protected quit.
    setTimeout(() => quitApp(), 250);
    return { ok: true, quit: true };
  },
});
```

</details>

**依据 4 · 源码核查**：[src/main/update.js:1000-1025](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/update.js#L1000-L1025)

update force与commit。

<details>
<summary>查看原文（26行）</summary>

```text
    // Every entry into this lane is already an explicit user action (update
    // ask, version-install card, 「在线安装」 button), so the inspect/
    // acquire/drain sequencing stays but the confirm gate is skipped —
    // asking again would double-prompt one click.
    // The launch belongs inside commit so a rejected spawn releases Host
    // admission and never latches the coordinator into a shutdown state.
    // Unfinished work gets a short drain, then the update proceeds anyway:
    // nothing running may hold back an update the user confirmed.
    const result = await protection.coordinate('update', {
      terminal: quitAfterInstall, preConfirmed: true, force: true, drainTimeoutMs: 10_000, commit: launch,
    });
    if (!result.proceeded) {
      return {
        ...info,
        launched: false,
        cancelled: true,
        code: result.code || 'cancelled',
        ...(result.code === 'busy' ? { message: '另一个退出或更新操作正在进行，请稍候。' } : {}),
      };
    }
  } else await launch();
  // Self-update semantics quit the packaged app so the installer can replace
  // it. A runtime install (slim launcher → desktop) must keep the launcher
  // alive to report progress, so callers opt out explicitly.
  if (quitAfterInstall) {
    setTimeout(() => app.quit(), 800);
```

</details>

**依据 5 · 源码核查**：[src/main/index.js:1591-1616](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/index.js#L1591-L1616)

quit时限。

<details>
<summary>查看原文（26行）</summary>

```text
    };
    try {
      let result;
      try {
        result = await Promise.race([
          taskProtection.coordinate('quit', {
            terminal: true,
            preConfirmed: true,
            // Quit gives no feedback until the drain ends; a 30 s wait read as
            // an ignored click. Work still running is cleaned up either way.
            drainTimeoutMs: 3000,
            commit: async () => {
              stoppingForQuit = true;
              closingOverlayActive = true;
              const win = getMainWindow();
              await showClosingOverlay(win, loadConfig().locale,
                getHarnessWebContents(win) || win?.webContents).catch(() => undefined);
              await shutdownForQuit();
              // Keep the current surface until the native window closes.
            },
          }),
          new Promise((_, reject) => {
            shutdownTimer = setTimeout(() => {
              const error = new Error('后台关停未在 30 秒内完成');
              error.code = 'dshd/shutdown-timeout';
              reject(error);
```

</details>

**依据 6 · 源码核查**：[src/main/index.js:1626-1658](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/index.js#L1626-L1658)

窗口/失败后自动exit。

<details>
<summary>查看原文（33行）</summary>

```text
      if (result.proceeded) {
        // app.quit() can be cancelled by close/beforeunload or stall waiting
        // for a renderer. Keep the original attempt latched until the process
        // actually quits, with a deadline after resources have stopped.
        nativeQuitReady = true;
        const nativeQuitTimer = setTimeout(() => {
          dsh.log('退出：窗口关闭等待超时，结束桌面进程', 'error');
          app.exit(0);
        }, 5000);
        app.once('quit', () => clearTimeout(nativeQuitTimer));
        app.quit();
        return;
      }
      dsh.log(`退出：自动完成关停：${JSON.stringify({
        code: result.code, detail: result.detail,
        pendingCount: result.pendingCount, pendingLabels: result.pendingLabels,
      })}`, 'error');
      let finalTimer;
      try {
        await Promise.race([
          shutdownForQuit().catch(() => {}),
          new Promise((resolve) => {
            finalTimer = setTimeout(() => {
              dsh.log('退出：资源清理等待超时，结束桌面进程', 'error');
              resolve();
            }, 5000);
          }),
        ]);
      } finally {
        clearTimeout(finalTimer);
      }
      app.exit(0);
    } finally {
```

</details>

**依据 7 · 源码核查**：[src/main/task-protection.js:228-249](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/task-protection.js#L228-L249)

force保留失败诊断。

<details>
<summary>查看原文（22行）</summary>

```text
        const acquired = await acquire(operation, opts.drainTimeoutMs);
        if (acquired.ok !== true) {
          const failure = {
            code: acquired.code || 'acquire-failed',
            detail: acquired.detail,
            pendingCount: acquired.pendingCount,
            pendingLabels: acquired.pendingLabels,
          };
          if (opts.force !== true) return { proceeded: false, ...failure };
          forced = failure;
          log(`task-protection ${operation}: proceeding without Host admission ${JSON.stringify(failure)}`);
        }
        const second = forced ? first : mergedInspection(await inspect());
        if (!forced && !inspectionClean(second) && inspectionClean(first) && opts.preConfirmed !== true) {
          // Work arrived between the first look and the lock — re-confirm
          // against the fresh picture rather than riding an obsolete prompt.
          if (!(await confirmWithUser(operation, second))) {
            await release();
            return { proceeded: false, code: 'cancelled', inspection: second };
          }
        }
      }
```

</details>

#### 缺口

- 真实远端调用取消与重开恢复、包签名/供应链和更新器全链未审。
  **影响**：不能推荐关键不可重复任务依赖壳退出作为确认。
  **进一步探讨**：有外部副作用时先记录操作id/查远端状态再重试，单独验恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样可控采用，结果收据有什么增量？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

建议熟悉DSH的桌面用户用独立数据备份和副本工作区，确认userData/dsh-home与官方home区别，再做低风险模型工具任务、后台job、退出/重开和安装失败对照。不把覆盖安装留数据当完整备份。出现准入异常、未解释强退或重开任务丢失时停自动更新/外部写，保留日志和会话文件，回官方CLI/Web并逐项核外部结果；迁出需要导出/重配资料，不能复制目录便保证兼容。

依赖匹配Electron/Node/内置Harness与插件、模型API、工作区权限；发行包未签名是README声明，平台下载/现价未在线验证。首次下载配置/迁移，持续模型token/内置扩展更新，故障恢复对账，退出迁出及远端清理都有成本；免费MIT不算经济创新。

可探索退出/更新的任务结果收据：将当前forced/pending/coverage诊断和已知操作id形成下次重开可见的待对账列表。已有generation、pendingLabels与日志不是没有观察；增量是把本地排空和业务结果分开并持续呈现。用长job/模型断连/安装spawn失败与正常退出对照现有日志，计误认完成、重复外部操作、恢复工时和提示负担；若日志已同效或收据产生错误确定性就否定，未实现。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:40-46](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/README.md#L40-L46)

作者包/费用与启动。

```text
桌面安装包未签名，Mac 首次打开需右键「打开」；Android 独立发布。各发布页附 SHA512 校验清单。

## 快速开始

1. 安装桌面端，在「设置 → 模型」配置 API 服务（费用由模型服务商收取）。
2. 选择工作目录，或直接新建会话。
3. 手机安装 Android 客户端，扫描桌面「远程」二维码连接。
```

**依据 2 · 源码核查**：[README.md:69-80](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/README.md#L69-L80)

源码依赖/数据位置。

<details>
<summary>查看原文（12行）</summary>

````text
git clone https://github.com/ChisaAlter/WhaleIsle.git
cd WhaleIsle
npm ci
npm run setup:harness
npm start
```

## 数据与文档

数据保存在 Windows `%APPDATA%\Deepseek-Harness-Desktop` 或 macOS `~/Library/Application Support/Deepseek-Harness-Desktop`，覆盖安装会保留。

[产品手册](docs/handbook/README.md) · [开发文档](docs/maintenance/README.md) · [贡献指南](CONTRIBUTING.md) · [反馈问题](https://github.com/ChisaAlter/WhaleIsle/issues/new/choose)
````

</details>

**依据 3 · 源码核查**：[src/main/task-protection.js:229-238](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/src/main/task-protection.js#L229-L238)

已有pending/forced诊断。

<details>
<summary>查看原文（10行）</summary>

```text
        if (acquired.ok !== true) {
          const failure = {
            code: acquired.code || 'acquire-failed',
            detail: acquired.detail,
            pendingCount: acquired.pendingCount,
            pendingLabels: acquired.pendingLabels,
          };
          if (opts.force !== true) return { proceeded: false, ...failure };
          forced = failure;
          log(`task-protection ${operation}: proceeding without Host admission ${JSON.stringify(failure)}`);
```

</details>

**依据 4 · 源码核查**：[vendor/dsh-task-control/lib/state.js:146-155](https://github.com/ChisaAlter/WhaleIsle/blob/511b57c1fb45fdfd014c10e9910341ab6a8e43b4/vendor/dsh-task-control/lib/state.js#L146-L155)

已有generation/hostGeneration。

<details>
<summary>查看原文（10行）</summary>

```text
    expiresAt: state.lock.expiresAt,
    drainedPending: drain.count,
  };
}

/**
 * @param {ReturnType<typeof createControlState>} state
 * @param {{ lockId: string, owner: string }} request
 */
export function releaseLock(state, request) {
```

</details>

#### 缺口

- 当前包安装/升级/迁出与真实任务收益、收据方案未验。
  **影响**：限定副本试用，不能生产长期托管背书。
  **进一步探讨**：固定安装包验独立home/备份/重开和日志对账，再决定扩展。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
