# dsh-update-checker

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d9b20e1](https://github.com/Airmetro/dsh-update-checker/tree/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-update-checker)
<!-- END META -->

> **功能**：在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。

> **亮点**：将多源版本/频道判断、staging/备份/锁目录原地同步、声明回执与平台更新委托整合到GUI，工程增量在维护编排而非新包管理算法。详见[Q03](#research-q03)。

> **主要限制**：writeGate拒绝返回err=json(...)而json无返回值，if(g.err)无法退出；多条写路由拒绝后仍可继续副作用，且全局ok可能包持久化失败/身份未知。未运行复现。详见[Q04](#research-q04)、[Q05](#research-q05)。

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
  - [Q01 · 更新管理实际交付什么，谁适合使用？](#detail-section-11)
  - [Q02 · 版本、来源和profile选择怎样判断？](#detail-section-12)
  - [Q03 · 实际更新、备份与声明同步有哪些贡献和限制？](#detail-section-13)
  - [Q04 · loopback和confirm拒绝是否真正阻断副作用？](#detail-section-14)
  - [Q05 · Web恢复、健康与Desktop委托分别验收到哪？](#detail-section-15)
  - [Q06 · 启用与三阶段成本应怎样核算？](#detail-section-16)
  - [Q07 · 推荐与继续研究应从哪里入手？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向自行维护DSH Web部署/profile插件、希望少在命令行查版本/备份/更新/恢复的维护者。基线npm/pnpm或Git tag手工查询、备份、安装、声明同步与重启；插件在GUI合并主程序/第三方插件通知、更新与回退回执。客户端加载和定期检查本身会访问源，不能理解成纯离线只读。

合格交付应区分候选版本/来源、落盘版本、manifest/lock同步、启动实例与业务可用，而不是下载成功或HTTP200。Desktop主程序由原生应用管理，插件仅查feed/引导更新窗，拒绝插件直接npm改签名应用；第三方插件仍可更新。涉及安装脚本、删除/复制目录、锁文件/备份和进程重启，不能当一般通知组件授权。

手动查npm/Git tag、备份、包管理/同步声明和重启；当前交付为维护编排与多阶段回执，仍需人工业务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 版本检查 | npm/GitHub与Desktopfeed候选 | 非兼容/可信性证明 |
| 插件维护 | staging/备份/声明同步 | 脚本执行/部分成功 |
| Web主更新/重启 | 后台安装/恢复 | 当前拒绝守卫有缺陷 |
| Desktop引导 | 原生更新窗口 | 不由插件npm替换签名应用 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH webServer/client slots/locale和React18 | 路由/通知/设置页 | 固定宿主接口兼容需核 |
| npm/pnpm、可写profile/部署/DSH_HOME | staging/同步/备份 | 会跑第三方脚本/自动mount |
| npm/GitHub或Desktop feed网络 | 候选版本/下载 | GitHub TLS被关闭，源可信性需审查 |
| Web进程探测/launcher/磁盘空间 | 停启与恢复 | POSIX需ss/lsof等，Desktop交原生更新 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定审查 | 先修writeGate并核Host访问策略 | 拒绝请求必须零副作用 |
| 检查 | 核来源/频道/安装目标副本 | 高版本非兼容保证 |
| 备份计划 | 查看dry/备份范围与空间 | 安装脚本/共享依赖另审 |
| 更新 | 明确授权单项/批次 | 核installed/persisted/mount/leftovers分别状态 |
| 恢复 | 核新进程/资产/业务/声明锁 | 不能只看ok/端口/安装版本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 内联UI/备份目录、网络registry/feed | 核部署/profile/权限/脚本信任并先修守卫 | 工时/磁盘需求未知 |
| 持续使用 | 定期版本探测、tar下载/解压、staging与依赖重装 | 审来源/版本/变更/声明一致性 | 网络/安装时长未知，无独立模型API非总费用0 |
| 失败恢复 | 多份快照/临时树/日志、重装/重启资源与停机 | 分辨部分安装/声明失败/旧实例并人工回滚 | 非全树原子回滚，停机与恢复工时未知 |



#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少手动维护 | GUI候选/备份/安装/回退入口 | 当前拒绝守卫有控制流缺陷 |
| 便于追踪 | 分阶段进度/日志/manifest回执 | ok可包部分失败 |
| 平台分流 | Desktop委托原生，Web包管理 | 不保证所有部署自动恢复 |

这是有高权限副作用的维护组件，不能因纯Node内置依赖就称低风险/零成本。

> **思考**：writeGate拒绝返回err=json(...)而json无返回值，if(g.err)无法退出；多条写路由拒绝后仍可继续副作用，且全局ok可能包持久化失败/身份未知。未运行复现。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多源版本/频道判断、staging/备份/锁目录原地同步、声明回执与平台更新委托整合到GUI，工程增量在维护编排而非新包管理算法。详见[Q03](#research-q03)。

后台main worker在安装/树校验失败尝试rollbackFromBackup，先还原main-snapshot的@deepseek-ai子树，缺失/不匹配再npm重装；该快照不是整部署和全部第三方依赖/状态/锁的原子快照。Host公开rollbackMain则直接npm安装备份版本再sync，并不使用worker的离线snapshot分支，故“回滚都离线”不成立。

worker health检查首页200或401/403/407，探本插件instanceId拒绝同一旧实例；若instanceId不可用，只写note后仍可ok=true，auth-gated分支直接跳前端资产检查，非要求必须新身份。首页200最多看30个assets/plugins引用，不能证明插件全部加载或业务可用。重启等待后仍不健康记录E_RESTART/restartPending、installed新版本并再次尝试startService，区分安装完成与恢复失败值得保留，文案不应让用户以为可直接使用。

Desktop detection由Electron/argv/resources等识别，读app-update.yml和平台feed，404才fallback裸feed；主update/rollback拒绝改app、restart给手动退出指南。client调用原生bridge更新窗/订阅状态，不能把Web npm方案套Desktop。作者大量测试针对平台/锁/文件交换和身份分支，数量不等独立执行或所有恢复链正确。

<a id="detail-section-5"></a>

### 1.4 主要限制

writeGate拒绝返回err=json(...)而json无返回值，if(g.err)无法退出；多条写路由拒绝后仍可继续副作用，且全局ok可能包持久化失败/身份未知。未运行复现。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前不推荐日常安装，先修拒绝零副作用与阶段回执，再核隔离恢复；不在用户部署运行复现。详见[Q07](#research-q07)。

合格交付应区分候选版本/来源、落盘版本、manifest/lock同步、启动实例与业务可用，而不是下载成功或HTTP200。Desktop主程序由原生应用管理，插件仅查feed/引导更新窗，拒绝插件直接npm改签名应用；第三方插件仍可更新。涉及安装脚本、删除/复制目录、锁文件/备份和进程重启，不能当一般通知组件授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。维护编排细节丰富，但当前写拒绝控制流缺陷阻止日常采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、scripts/main-update-worker.mjs、scripts/unit-health-identity.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：Host版本/扫描/源/安装/交换/持久/写路由与Desktop关键分支，worker身份/快照/恢复，client检查/确认关键段和作者身份测试；未逐行全审所有range/依赖闭包/平台脚本/测试，未运行安装/请求/宿主。
- 下一步：可继续假webServer/fs/spawn/registry的负路径零副作用和部分失败回执矩阵，再核隔离恢复，原型未实现。

**分析版本**

- **仓库**：[Airmetro/dsh-update-checker](https://github.com/Airmetro/dsh-update-checker)
- **版本号**：1.7.3（[固定提交 d9b20e1](https://github.com/Airmetro/dsh-update-checker/tree/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索显式拒绝判别与绑定计划、分阶段更新收据，以假副作用日志证伪拒绝后写入/部分成功混同，未实现。详见[Q07](#research-q07)。

可继续假webServer/fs/spawn/registry的负路径零副作用和部分失败回执矩阵，再核隔离恢复，原型未实现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 477 | — | — | 12475 |
| .js | source | 2 | 8396 | 7754 | 1 | — |
| .mjs | test | 49 | 5722 | 5058 | 50 | — |
| .mjs | source | 4 | 2126 | 1959 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Airmetro/dsh-update-checker/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/Airmetro/dsh-update-checker/issues?q=is%3Aissue+created%3A2026-09-22T10%3A14%3A28.197Z..2026-10-22T10%3A14%3A28.197Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/Airmetro/dsh-update-checker/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A14%3A28.197Z..2026-10-22T10%3A14%3A28.197Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核版本源/部署识别、备份安装持久化、写拒绝控制流、平台与恢复验收、成本和可证伪更新事务。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 更新管理实际交付什么，谁适合使用？

**研究主题**：场景与需求

#### 完整回答

面向自行维护DSH Web部署/profile插件、希望少在命令行查版本/备份/更新/恢复的维护者。基线npm/pnpm或Git tag手工查询、备份、安装、声明同步与重启；插件在GUI合并主程序/第三方插件通知、更新与回退回执。客户端加载和定期检查本身会访问源，不能理解成纯离线只读。

合格交付应区分候选版本/来源、落盘版本、manifest/lock同步、启动实例与业务可用，而不是下载成功或HTTP200。Desktop主程序由原生应用管理，插件仅查feed/引导更新窗，拒绝插件直接npm改签名应用；第三方插件仍可更新。涉及安装脚本、删除/复制目录、锁文件/备份和进程重启，不能当一般通知组件授权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1150-1225](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/client.js#L1150-L1225)

定期检查与单个/批量更新。

<details>
<summary>查看原文（76行）</summary>

```text
        fetchStatus(PLUGIN_STATUS_URL, force)
          .then((data) => {
            setState({ status: "done", data, error: null });
            markCheckDone("plugin");
          })
          .catch((err) => {
            console.error("[dsh-update-checker] plugin check failed", err);
            setState({ status: "error", data: null, error: String(err && err.message ? err.message : err) });
            markCheckDone("plugin");
          });
      };

      react.useEffect(() => {
        runCheck();
        const timer = setInterval(() => runCheck(), CHECK_INTERVAL);
        return () => clearInterval(timer);
      }, []);

      
      react.useEffect(() => {
        const handler = () => setCoreDone(true);
        if (typeof window !== "undefined") window.addEventListener("dsh-update-core-done", handler);
        return () => {
          if (typeof window !== "undefined") window.removeEventListener("dsh-update-core-done", handler);
        };
      }, []);

      const doUpdate = (name) => {
        if (busy) return;
        if (typeof window !== "undefined" && !window.confirm(t("plugin.confirmOne", { name }))) return;
        busy = true;
        updater.set("plugin", name);
        setUpdatingName(name);
        setProgress(null);
        setLastBatchTotal((state.data && state.data.plugins || []).filter((p) => p.hasUpdate).length);
        setResults([]);
        postJson(PLUGIN_UPDATE_URL, { name })
          .then((res) => {
            if (res && res.ok) {
              setResults([{ name, ok: true, version: res.installed || "?" }]);
            } else {
              setResults([{ name, ok: false, error: (res && res.error) || "update failed" }]);
            }
          })
          .catch((err) => {
            setResults([{ name, ok: false, error: String(err && err.message ? err.message : err) }]);
          })
          .finally(() => {
            busy = false;
            updater.set(null);
            setUpdatingName(null);
            runCheck(true);
          });
      };

      const doUpdateAll = () => {
        if (busy) return;
        const updatable = (state.data && state.data.plugins || []).filter((p) => p.hasUpdate);
        if (updatable.length === 0) return;
        if (typeof window !== "undefined" && !window.confirm(t("plugin.confirmAll", { count: updatable.length }))) return;
        busy = true;
        setLastBatchTotal(updatable.length);
        setResults([]);
        const results = [];
        const run = (i) => {
          if (i >= updatable.length) {
            busy = false;
            updater.set(null);
            setUpdatingName(null);
            setProgress(null);
            setResults(results);
            runCheck(true);
            return;
          }
          const p = updatable[i];
          updater.set("plugin", p.name);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:5462-5477](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5462-L5477)

Desktop主更新委托。

<details>
<summary>查看原文（16行）</summary>

```text
        handler: async (req, res) => {
          const g = await writeGate(req, res);
          if (g.err) return;
          if (IS_DESKTOP) {
            const feed = await readDesktopFeed(true).catch(() => null);
            await opsLog({
              op: "main-update-desktop-delegated",
              version: feed ? feed.version : null,
              channel: feed ? feed.channel : null,
              installed: readDesktopAppVersion(),
            });
            return desktopGuardUpdate(res, feed);
          }
          const platformError = mainUpdatePlatformError();
          if (platformError) return json(res, 501, { ok: false, ...platformError });
          const body = g.body;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4361-4428](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4361-L4428)

实际安装与落盘回执。

<details>
<summary>查看原文（68行）</summary>

```text
async function finalizePluginInstall(target, pkgRoot, depRoot, extra, copyFilter) {
  const newPkg = JSON.parse(await readFile(join(pkgRoot, "package.json"), "utf8"));
  const newVersion =
    typeof newPkg.version === "string" && newPkg.version ? newPkg.version : null;
  if (!newVersion) throw new Error("new plugin package.json has no version");
  const manifestSpec = await readManifestSpecFor(target.name, target.dir);
  const replaced = await backupAndReplace(target.dir, pkgRoot, copyFilter, manifestSpec);
  const backupDir = replaced.backupDir;
  const installMode = replaced.swap && replaced.swap.inPlace ? "in-place" : "swap";
  const declaredGitSpec = /^(?:github:|git\+|git:|https?:\/\/)/i.test(String(manifestSpec || ""));
  const persistWarning =
    declaredGitSpec && extra && extra.source === "npm"
      ? `profile 声明为 ${manifestSpec}，本次从 npm 安装 ${newVersion}；为避免改写声明来源，manifest 未改动（如需跟随 GitHub tag，请手动改 pin 后再更新）`
      : null;
  const merged = await mergeDependencies(depRoot, target.dir);
  npmLatestCache.delete(target.name);
  if (target.ghRepo) ghLatestCache.delete(target.ghRepo);
  await writeSuppressPluginBanner(false);
  
  
  const persisted = await persistPluginUpdate({
    name: target.name,
    newVersion,
    targetDir: target.dir,
    gh:
      extra && extra.source === "github"
        ? {
            source: "github",
            owner: target.ghRepo ? String(target.ghRepo).split("/")[0] : null,
            repo: target.ghRepo ? String(target.ghRepo).split("/")[1] : null,
            tag: extra.ghTag || null,
          }
        : null,
  }).catch((err) => ({
    manifest: [],
    lockfile: [],
    error: truncate(String((err && err.message) || err), 1000),
  }));
  
  
  
  
  let mount = null;
  try {
    mount = await ensurePluginMount();
    lastMountReport = mount;
  } catch (err) {
    mount = { ok: false, errors: [{ step: "mount", error: String((err && err.message) || err) }] };
  }
  return {
    ok: true,
    name: target.name,
    installed: newVersion,
    backupDir,
    merged,
    source: extra.source,
    installMode,
    persisted,
    persistWarning,
    leftovers: replaced.swap && replaced.swap.sync ? replaced.swap.sync.leftoverCount || 0 : 0,
    npmOutput: extra.npmOutput || null,
    allowScripts: extra.allowScripts || null,
    mount,
  };
}



```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 版本、来源和profile选择怎样判断？

**研究主题**：功能与机制

#### 完整回答

Web主程序用npm完整版本表，stable-first与预发布频道门控制目标；compareVersions实现数字core和预发布段，非法版本返回比较相等，parseVersion不支持+build，不能称完整SemVer库。插件同时探npm和GitHub，选较高版本，平手才按downloadSource；因此选择npm并不强制无视更高GitHub版本。根package名称核验防把monorepo根tag认作子包，local link不更新、重复副本按composition profile优先。

扫描跟随pnpm symlink目录但避.pnpm/.bin/临时目录，resolved profile路径逃出store避免只看自己。仍是根据安装布局/声明启发式，不等运行模块加载器实际活跃实例清单。GitHub探测失败单独记录，降级护栏避免故障回落旧npm；不把tag版本更高当兼容或可信代码。

checkPlugin名称不属于分支插值引用未定义ghName，异常被该GitHub段catch写ghError，属于错误说明退化，不是绕过包名判定。本文不逐条证明所有手写range算法正确，只按实际已读选择/守卫分支下结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:958-1017](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L958-L1017)

版本/频道。

<details>
<summary>查看原文（60行）</summary>

```text
function parseVersion(v) {
  const m = String(v || "").trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!m) return null;
  return { core: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4] ? m[4].split(".") : [] };
}

function isPrerelease(v) {
  const p = parseVersion(v);
  return !!p && p.pre.length > 0;
}

function releaseChannel(v) {
  const p = parseVersion(v);
  if (!p) return "unknown";
  if (p.pre.length === 0) return "stable";
  const identifier = String(p.pre[0] || "").trim().toLowerCase();
  return identifier || "unknown";
}

function prereleaseGate(installedVersion, targetVersion, allowPrerelease) {
  const from = releaseChannel(installedVersion);
  const to = releaseChannel(targetVersion);
  if (allowPrerelease === true) return { blocked: false, code: null, from, to };
  if (to === "stable" || to === "unknown" || from === "unknown") return { blocked: false, code: null, from, to };
  if (from === to) return { blocked: false, code: null, from, to };
  return { blocked: true, code: "E_PRERELEASE", from, to };
}



function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return 0;
  for (let i = 0; i < 3; i++) {
    if (pa.core[i] !== pb.core[i]) return pa.core[i] > pb.core[i] ? 1 : -1;
  }
  if (pa.pre.length === 0 && pb.pre.length === 0) return 0;
  if (pa.pre.length === 0) return 1;
  if (pb.pre.length === 0) return -1;
  const n = Math.max(pa.pre.length, pb.pre.length);
  for (let i = 0; i < n; i++) {
    const x = pa.pre[i];
    const y = pb.pre[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    if (x === y) continue;
    const nx = /^\d+$/.test(x);
    const ny = /^\d+$/.test(y);
    if (nx && ny) return Number(x) > Number(y) ? 1 : -1;
    if (nx) return -1; 
    if (ny) return 1;
    return x > y ? 1 : -1;
  }
  return 0;
}




```

</details>

**依据 2 · 源码核查**：[lib/index.js:1159-1181](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L1159-L1181)

稳定优先。

<details>
<summary>查看原文（23行）</summary>

```text
function pickNpmLatest(doc) {
  const tags = (doc && doc["dist-tags"]) || {};
  const versions = Object.keys((doc && doc.versions) || {});
  if (!versions.length) return null;
  const stable = versions.filter((v) => !isPrerelease(v)).sort((a, b) => compareVersions(b, a));
  if (stable.length) return stable[0];
  const tagged = tags.latest;
  if (tagged && versions.includes(tagged)) return tagged;
  return versions.slice().sort((a, b) => compareVersions(b, a))[0];
}





function pickMainLatest(doc, allowPre) {
  const versions = Object.keys((doc && doc.versions) || {});
  if (!versions.length) return null;
  if (allowPre) return versions.slice().sort((a, b) => compareVersions(b, a))[0];
  const stable = versions.filter((v) => !isPrerelease(v)).sort((a, b) => compareVersions(b, a));
  if (stable.length) return stable[0];
  return versions.slice().sort((a, b) => compareVersions(b, a))[0];
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3085-3145](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L3085-L3145)

安装扫描/来源。

<details>
<summary>查看原文（61行）</summary>

```text
async function scanInstalledPlugins() {
  const found = [];
  const byName = new Map();
  const seenReal = new Set();
  const composition = await readCompositionPluginNames();
  const prefRoot = await compositionProfileNodeModules();
  for (const root of await findAllPluginRoots()) {
    let entries;
    try {
      entries = await readdir(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.name === ".bin" || e.name === ".dsh-plugin-backups" || e.name === ".pnpm") continue;
      if (e.name.startsWith(UC_TMP_PREFIX)) continue;
      if (!(await isDirectoryEntry(root, e))) continue;
      if (e.name.startsWith("@")) {
        if (e.name === "@deepseek-ai") continue; 
        let subs;
        try {
          subs = await readdir(join(root, e.name), { withFileTypes: true });
        } catch {
          continue;
        }
        for (const s of subs) {
          if (!(await isDirectoryEntry(join(root, e.name), s))) continue;
          const dir = join(root, e.name, s.name);
          const pkg = await classifyPlugin(dir, `${e.name}/${s.name}`, composition);
          if (pkg && (await isLocalLink(dir))) pkg.localLink = true;
          await pushUnique(found, byName, seenReal, prefRoot, pkg, dir);
        }
      } else {
        const dir = join(root, e.name);
        const pkg = await classifyPlugin(dir, e.name, composition);
        if (pkg && (await isLocalLink(dir))) pkg.localLink = true;
        await pushUnique(found, byName, seenReal, prefRoot, pkg, dir);
      }
    }
  }
  return found;
}





function pickTargetSource(npmV, ghV, pref) {
  if (npmV && ghV) {
    const cmp = compareVersions(ghV, npmV);
    if (cmp > 0) return { target: ghV, src: "github", source: "both" };
    if (cmp < 0) return { target: npmV, src: "npm", source: "both" };
    if (pref === "npm") return { target: npmV, src: "npm", source: "both" };
    return { target: ghV, src: "github", source: "both" }; 
  }
  if (ghV) return { target: ghV, src: "github", source: "github" };
  if (npmV) return { target: npmV, src: "npm", source: "npm" };
  return { target: null, src: null, source: null };
}


```

</details>

**依据 4 · 源码核查**：[lib/index.js:3147-3254](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L3147-L3254)

包名/错误与候选。

<details>
<summary>查看原文（108行）</summary>

```text
async function checkPlugin(p, force) {
  const item = {
    name: p.name,
    installed: p.installed,
    dir: p.dir || null,
    copies: Array.isArray(p.copies) ? p.copies : [],
    latest: null,      
    npmLatest: null,
    ghLatest: null,
    ghTag: null,
    hasUpdate: false,
    onNpm: false,
    onGithub: false,
    source: null,      
    targetSource: null, 
    error: null,
    ghError: null,
    ignored: false,
    ignoreReason: null,
    brief: null,
  };
  if (p.localLink) {
    item.ignored = true;
    item.ignoreReason = "local link (linked from a source directory, not installed from a registry)";
    return item;
  }
  try {
    item.npmLatest = await fetchNpmLatest(p.name, force);
    item.onNpm = true;
  } catch (err) {
    if (err && err.code === "ENOTFOUND") {
      item.onNpm = false;
      item.error = "not on npm registry";
    } else {
      item.error = String(err && err.message ? err.message : err);
    }
  }
  if (p.ghRepo) {
    try {
      const gh = await fetchGitHubLatest(p.ghRepo, force);
      if (gh && gh.none) {
        item.onGithub = false;
      } else {
        
        
        
        
        
        const ghNameRes = await fetchGhPkgName(p.ghRepo, gh.tag);
        const belongs = ghNameRes.hasRootPkg === false ? false : ghTagBelongsTo(ghNameRes.name, p.name);
        if (belongs) {
          item.onGithub = true;
          item.ghTag = gh.tag;
          item.ghLatest = gh.version;
        } else {
          item.onGithub = false;
          item.ghTag = null;
          item.ghLatest = null;
          item.ghError = `github tag ${gh.tag} is for ${ghName} (monorepo root), not ${p.name}; ignored`;
        }
      }
    } catch (err) {
      
      item.ghError = String(err && err.message ? err.message : err);
    }
  }
  const npmV = item.npmLatest;
  const ghV = item.ghLatest;
  
  
  const prefSource = (await readSettings()).downloadSource;
  const { target, src, source } = pickTargetSource(npmV, ghV, prefSource);
  item.source = source;
  item.latest = target;
  item.targetSource = src;
  item.downloadSource = prefSource; 
  item.tie = !!(npmV && ghV && compareVersions(ghV, npmV) === 0); 
  if (item.installed && target) {
    item.hasUpdate = compareVersions(target, item.installed) > 0;
  }
  
  item.status = deriveStatus(item.installed, target, !!(npmV || ghV));
  
  if (!target) {
    const parts = [];
    if (item.error) parts.push("npm: " + item.error);
    if (item.ghError) parts.push("github: " + item.ghError);
    item.error = parts.length ? parts.join("; ") : "no update source";
    
    if (!p.hasDsh) {
      item.ignored = true;
      item.ignoreReason = "no dsh field and not on npm/GitHub (local tool)";
    }
  }
  
  if (item.installed && target) {
    const brief = {
      from: item.installed,
      to: target,
      risk: deriveRisk(item.installed, target),
      notes: null,
    };
    if (p.ghRepo && item.ghTag) {
      brief.notes = await fetchGhReleaseNotes(p.ghRepo, item.ghTag);
    }
    item.brief = brief;
  }
  return item;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:4974-4997](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4974-L4997)

降级拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
function guardPluginUpdate(name, installed, probe) {
  if (!probe || !probe.latest || !installed) return { refuse: false };
  const cmp = compareVersions(probe.latest, installed);
  if (cmp >= 0) return { refuse: false };
  const source = probe.targetSource || probe.source || "unknown";
  const reason = probe.ghError
    ? `GitHub 探测失败（${probe.ghError}），回退到的 npm 版本更旧`
    : `可用更新源（${source}）给出的版本更旧`;
  return {
    refuse: true,
    code: "ENODOWNGRADE",
    name,
    installed,
    planned: probe.latest,
    targetSource: source,
    npmLatest: probe.npmLatest || null,
    ghLatest: probe.ghLatest || null,
    ghError: probe.ghError || null,
    reason,
    message:
      `已阻止降级：${name} 当前安装 ${installed}，而本次探测只给出 ${probe.latest}（${reason}）。` +
      `为避免回退到旧版，本次更新未执行；GitHub 限流通常几分钟后恢复，请稍后重试，或在 profile 中把该插件改到目标 tag 后手动安装。`,
  };
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 实际更新、备份与声明同步有哪些贡献和限制？

**研究主题**：贡献与相对优势、工程质量与复用

#### 完整回答

插件更新先临时目录npm/pnpm安装，GitHub路下载tar.gz检查可用built入口、tag/package版本，之后备份替换目标并合并依赖、持久manifest/lock。目录可rename时staging/trash交换；锁目录时fallback原地同步，失败尝试从备份恢复。相对直接覆盖包，固定备份/回执/降级护栏与布局适配是实质工程贡献，仍非完整事务。

安装会运行第三方生命周期/native脚本，npm>=12可自动allow-scripts，pnpm fallback可rebuild；“临时目录”不是沙箱。GitHub请求对匹配github/githubusercontent/githubassets域关闭TLS证书验证，npm严格TLS，降低本地代理兼容成本同时移除该来源链的一层真实性验证。tar解包先gunzipSync，下载压缩包大小上限不限制解压总量；target.startsWith(destDir)未加路径分隔边界，不等严格目录包含。仅检查入口存在/版本不证明代码可信或内容完整校验。

finalizePluginInstall先改目标/依赖再persist，persist异常被catch成嵌套error，mount失败也保留返回，最外仍ok=true。UI单项主要看res.ok呈现成功，用户必须看persisted/mount/leftovers，不能把它当全链提交成功。启动apply还会自动ensurePluginMount改profile链接/依赖，未等用户点更新；已有新真实版本有降级保护，但“仅检查”也可能有装配副作用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3851-3889](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L3851-L3889)

备份与替换。

<details>
<summary>查看原文（39行）</summary>

```text
async function backupAndReplace(dst, src, filter, manifestSpec) {
  try {
    const st = await lstat(dst);
    if (st.isSymbolicLink()) await rm(dst, { recursive: false, force: true });
  } catch {
    
  }
  let backupDir = null;
  if (await exists(dst)) {
    await migrateLegacyBackups();
    backupDir = join((await backupDirs()).plugins, `${basename(dst)}-${Date.now()}`);
    await mkdir(backupDir, { recursive: true });
    await cp(dst, join(backupDir, basename(dst)), { recursive: true, force: true });
    let pkgName = null;
    try {
      pkgName = JSON.parse(await readFile(join(dst, "package.json"), "utf8")).name;
    } catch {
      
    }
    await writeFile(
      join(backupDir, "backup-info.json"),
      JSON.stringify(
        {
          name: basename(dst),
          pkgName,
          original: dst,
          at: Date.now(),
          manifestSpec: typeof manifestSpec === "string" ? manifestSpec : null,
        },
        null,
        2
      ),
      "utf8"
    );
  }
  const swap = await swapDirectoryInPlace(dst, src, filter, {
    restoreFrom: backupDir ? join(backupDir, basename(dst)) : null,
  });
  return { backupDir, swap };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4018-4103](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4018-L4103)

交换/原地fallback。

<details>
<summary>查看原文（86行）</summary>

```text
async function swapDirectoryInPlace(dst, src, filter, opts = {}) {
  const parent = dirname(dst);
  await mkdir(parent, { recursive: true }).catch(() => {});
  const stamp = `${Date.now()}-${process.pid}`;
  const stagingDir = join(parent, `${UC_TMP_PREFIX}staging-${basename(dst)}-${stamp}`);
  const trashDir = join(parent, `${UC_TMP_PREFIX}trash-${basename(dst)}-${stamp}`);
  await sweepUpdateTempDirs(parent, basename(dst));
  await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
  try {
    await cp(src, stagingDir, { recursive: true, force: true, ...(filter ? { filter } : {}) });
  } catch (err) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw err;
  }
  let movedAside = false;
  try {
    if (await exists(dst)) {
      await rename(dst, trashDir);
      movedAside = true;
    }
    await rename(stagingDir, dst);
  } catch (err) {
    if (!movedAside && isDirectoryRenameBlocked(err)) {
      try {
        const sync = await syncDirectoryInPlace(dst, stagingDir, filter);
        await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
        await opsLog({
          op: "plugin-update-inplace-sync",
          dir: dst,
          reason: truncate(String((err && err.message) || err), 300),
          written: sync.written,
          totalFiles: sync.totalFiles,
          removedFiles: sync.removedFiles,
          removedDirs: sync.removedDirs,
          leftoverCount: sync.leftoverCount,
          leftovers: sync.leftovers,
        });
        return { stagingDir, trashDir: null, movedAside: false, trashRemoved: true, inPlace: true, sync };
      } catch (syncErr) {
        const restored = await restoreDirectoryFromBackup(dst, opts.restoreFrom);
        await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
        await opsLog({
          op: "plugin-update-inplace-sync-failed",
          dir: dst,
          renameError: truncate(String((err && err.message) || err), 300),
          syncError: truncate(String((syncErr && syncErr.message) || syncErr), 500),
          restored,
          backup: opts.restoreFrom || null,
        });
        const hint =
          "该插件目录被宿主（或其技能目录监视器）持有句柄，目录无法重命名且原地同步失败；请关闭 DSH 后在命令行执行插件更新。";
        const wrapped = new Error(
          `${err.message} — in-place sync also failed (${syncErr.message}); ${hint}${
            restored ? " 已从备份还原" : ` 备份保留在 ${opts.restoreFrom || "?"}`
          }`
        );
        wrapped.code = err.code || "EPERM";
        wrapped.leftovers = syncErr.leftovers || null;
        throw wrapped;
      }
    }
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    if (movedAside) {
      try {
        await rename(trashDir, dst);
      } catch (restoreErr) {
        err.message = `${err.message} — rollback of the original directory ALSO FAILED (${restoreErr.message}); original content is kept at ${trashDir}`;
      }
    }
    throw err;
  }
  let trashRemoved = true;
  if (movedAside) {
    try {
      await rm(trashDir, { recursive: true, force: true });
    } catch {
      trashRemoved = false;
      await opsLog({
        op: "plugin-update-trash-kept",
        dir: trashDir,
        note: "a locked file blocked deletion; it is removed on a later update",
      });
    }
  }
  return { stagingDir, trashDir, movedAside, trashRemoved };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4277-4357](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4277-L4357)

安装脚本路径。

<details>
<summary>查看原文（81行）</summary>

```text
function buildPnpmStageAddArgs(dir, spec) {
  return ["add", spec, "--dir", dir, "--registry", REGISTRY, "--reporter", "append-only"];
}


function buildPnpmStageInstallArgs(root) {
  return ["install", "--dir", root, "--prod", "--registry", REGISTRY, "--reporter", "append-only"];
}


async function runStagingInstall({ npmArgs, pnpmArgs, cwd }) {
  if (safeGetNpmCli()) return runNpm(npmArgs, { cwd, timeout: 600000 });
  const pm = desktopPackageManager();
  if (!pm) {
    getNpmCli();
    throw Object.assign(new Error("no package installer available"), { code: "ENPMCLI" });
  }
  await runPnpm(pnpmArgs, { cwd, timeout: 600000 });
  return { stdout: `pnpm staging install (${pm.source})`, stderr: "" };
}


async function ensureScriptsBuilt(nmRoot, extraArgs) {
  if (!safeGetNpmCli() && desktopPackageManager()) {
    const names = await collectScriptPackages(join(nmRoot, "node_modules"));
    if (!names.length) return { npmMajor: null, pass2: false, names: [], pm: "pnpm" };
    await runPnpm(["rebuild", ...names], { cwd: nmRoot, timeout: 600000 });
    return { npmMajor: null, pass2: true, names, pm: "pnpm" };
  }
  const npmMajor = readNpmMajor();
  if (npmMajor === null || npmMajor < 12) return { npmMajor, pass2: false };
  const names = await collectScriptPackages(join(nmRoot, "node_modules"));
  if (!names.length) return { npmMajor, pass2: false, names: [] };
  const args = [
    "install",
    "--prefix",
    nmRoot,
    "--no-save",
    "--package-lock=false",
    "--registry",
    REGISTRY,
    "--no-audit",
    "--no-fund",
    `--allow-scripts=${names.join(",")}`,
  ];
  await runNpm(args, { cwd: nmRoot, timeout: 600000 });
  return { npmMajor, pass2: true, names };
}


function buildPluginInstallArgs(tmp, spec) {
  return [
    "install",
    spec,
    "--prefix",
    tmp,
    "--no-save",
    "--package-lock=false",
    "--registry",
    REGISTRY,
    "--no-audit",
    "--no-fund",
    "--legacy-peer-deps",
  ];
}


function buildStageInstallArgs(root) {
  return [
    "install",
    "--prefix",
    root,
    "--no-save",
    "--package-lock=false",
    "--registry",
    REGISTRY,
    "--no-audit",
    "--no-fund",
    "--omit=dev",
    "--legacy-peer-deps",
  ];
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4361-4428](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4361-L4428)

部分持久失败仍ok。

<details>
<summary>查看原文（68行）</summary>

```text
async function finalizePluginInstall(target, pkgRoot, depRoot, extra, copyFilter) {
  const newPkg = JSON.parse(await readFile(join(pkgRoot, "package.json"), "utf8"));
  const newVersion =
    typeof newPkg.version === "string" && newPkg.version ? newPkg.version : null;
  if (!newVersion) throw new Error("new plugin package.json has no version");
  const manifestSpec = await readManifestSpecFor(target.name, target.dir);
  const replaced = await backupAndReplace(target.dir, pkgRoot, copyFilter, manifestSpec);
  const backupDir = replaced.backupDir;
  const installMode = replaced.swap && replaced.swap.inPlace ? "in-place" : "swap";
  const declaredGitSpec = /^(?:github:|git\+|git:|https?:\/\/)/i.test(String(manifestSpec || ""));
  const persistWarning =
    declaredGitSpec && extra && extra.source === "npm"
      ? `profile 声明为 ${manifestSpec}，本次从 npm 安装 ${newVersion}；为避免改写声明来源，manifest 未改动（如需跟随 GitHub tag，请手动改 pin 后再更新）`
      : null;
  const merged = await mergeDependencies(depRoot, target.dir);
  npmLatestCache.delete(target.name);
  if (target.ghRepo) ghLatestCache.delete(target.ghRepo);
  await writeSuppressPluginBanner(false);
  
  
  const persisted = await persistPluginUpdate({
    name: target.name,
    newVersion,
    targetDir: target.dir,
    gh:
      extra && extra.source === "github"
        ? {
            source: "github",
            owner: target.ghRepo ? String(target.ghRepo).split("/")[0] : null,
            repo: target.ghRepo ? String(target.ghRepo).split("/")[1] : null,
            tag: extra.ghTag || null,
          }
        : null,
  }).catch((err) => ({
    manifest: [],
    lockfile: [],
    error: truncate(String((err && err.message) || err), 1000),
  }));
  
  
  
  
  let mount = null;
  try {
    mount = await ensurePluginMount();
    lastMountReport = mount;
  } catch (err) {
    mount = { ok: false, errors: [{ step: "mount", error: String((err && err.message) || err) }] };
  }
  return {
    ok: true,
    name: target.name,
    installed: newVersion,
    backupDir,
    merged,
    source: extra.source,
    installMode,
    persisted,
    persistWarning,
    leftovers: replaced.swap && replaced.swap.sync ? replaced.swap.sync.leftoverCount || 0 : 0,
    npmOutput: extra.npmOutput || null,
    allowScripts: extra.allowScripts || null,
    mount,
  };
}



```

</details>

**依据 5 · 源码核查**：[lib/index.js:2557-2618](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L2557-L2618)

GitHubTLS/下载。

<details>
<summary>查看原文（62行）</summary>

```text
function ghRequest(url, opts = {}) {
  const maxBytes = opts.maxBytes || MAX_GH_JSON_BYTES;
  const extraHeaders = opts.headers || {};
  return new Promise((resolve, reject) => {
    const doGet = (u, redirects) => {
      let host = "";
      try {
        host = new URL(u).hostname;
      } catch (err) {
        return reject(err);
      }
      const insecure = GH_INSECURE_HOST_RE.test(host);
      const req = https.get(
        u,
        {
          headers: {
            accept: "application/json",
            "user-agent": "dsh-update-checker",
            
            
            ...(host === "api.github.com" && GH_TOKEN
              ? { authorization: `Bearer ${GH_TOKEN}` }
              : {}),
            ...extraHeaders,
          },
          rejectUnauthorized: insecure ? false : true,
          timeout: 30000,
        },
        (res) => {
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
            if (redirects >= 5) {
              res.resume();
              return reject(new Error("too many redirects"));
            }
            const next = new URL(res.headers.location, u).toString();
            res.resume();
            return doGet(next, redirects + 1);
          }
          const chunks = [];
          let size = 0;
          res.on("data", (c) => {
            size += c.length;
            if (size > maxBytes) {
              res.destroy();
              return reject(
                Object.assign(new Error(`download exceeds size cap (${maxBytes} bytes)`), {
                  code: "ETOOBIG",
                })
              );
            }
            chunks.push(c);
          });
          res.on("end", () =>
            resolve({ status: res.statusCode, headers: res.headers, buf: Buffer.concat(chunks) })
          );
        }
      );
      req.on("timeout", () =>
        req.destroy(Object.assign(new Error("github timeout"), { code: "ETIMEDOUT" }))
      );
      req.on("error", reject);
    };
```

</details>

**依据 6 · 源码核查**：[lib/index.js:3628-3651](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L3628-L3651)

解压/前缀路径。

<details>
<summary>查看原文（24行）</summary>

```text
function extractTarGzToDir(buf, destDir) {
  const gz = gunzipSync(buf);
  let off = 0;
  const entries = [];
  while (off + 512 <= gz.length) {
    const nameRaw = gz.subarray(off, off + 100).toString("utf8").replace(/\0.*$/, "");
    if (!nameRaw) break;
    const size = parseInt(gz.subarray(off + 124, off + 136).toString("utf8").replace(/\0.*$/, "").trim(), 8) || 0;
    const type = gz[off + 156] || 48;
    if (type === 48 || type === 0) entries.push({ name: nameRaw, data: gz.subarray(off + 512, off + 512 + size) });
    off += 512 + Math.ceil(size / 512) * 512;
  }
  const top = entries.map((e) => e.name.split("/")[0]).find(Boolean) || "package";
  const root = join(destDir, top);
  for (const e of entries) {
    const rel = e.name.split("/").slice(1).join("/");
    if (!rel) continue;
    const target = resolve(destDir, e.name); 
    if (!target.startsWith(resolve(destDir))) continue;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, e.data);
  }
  return root;
}
```

</details>

**依据 7 · 源码核查**：[lib/index.js:5354-5376](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5354-L5376)

启动自动mount。

<details>
<summary>查看原文（23行）</summary>

```text
export default {
  name: "dsh-update-checker",
  apply(ctx) {
    
    
    
    ctx.inject(["webServer"], (webCtx) => {
      const webServer = webCtx.webServer;

      reconcileStaleUpdateState("dsh restarted while an update record was still marked running").catch(() => {});
      reconcileStaleUpdateLock().catch(() => {});
      
      
      
      ensurePluginMount()
        .then((r) => {
          lastMountReport = r;
        })
        .catch((err) => {
          lastMountReport = { errors: [{ step: "mount", error: String((err && err.message) || err) }] };
        });

      webServer.register({
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · loopback和confirm拒绝是否真正阻断副作用？

**研究主题**：缺陷与关键质疑

#### 完整回答

源码存在关键控制流缺陷。json辅助函数只调用writeHead/end而不return值；writeGate拒绝非loopback、超大/坏JSON、缺confirm时返回{err:json(...)}，因此err实际为undefined。所有已核写路由用if(g.err)return，拒绝响应已经发出却不能使调用者退出。socket对端精确loopback条件本身比只信Host头好，但错误传递让这道守卫失效。

逐路由不能一概而论。suppress/plugin-suppress、mount、backups-clear不需要body就继续写状态/链接/删除备份；Web restart不依body，满足后续部署条件便可spawn watchdog。主update用body&&body.dry/allowRemove，缺body时仍默认非dry并继续锁/备份/后台worker，是否走到取决部署/平台/锁与版本源。rollback也不需body可继续恢复路径。plugin-update/plugin-rollback需要name/id，body缺失被空值检查拦下，settings直接body[k]可能TypeError，不是同等任意参数安装结论。

这些是固定源码可推导的拒绝后执行路径，未发真实请求/未复现越权。实际外层Host鉴权/路由可达性决定谁能到达，不把缺陷扩大成已部署远程攻击；但代码不能支持README“所有写入需loopback+confirm”的保证，也不能从403日志认定没有副作用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5303-5310](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5303-L5310)

json无返回值。

```text
function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}
```

**依据 2 · 源码核查**：[lib/index.js:5331-5352](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5331-L5352)

拒绝err接undefined。

<details>
<summary>查看原文（22行）</summary>

```text
function isLoopback(req) {
  const a = req && req.socket && req.socket.remoteAddress;
  return a === "127.0.0.1" || a === "::1" || a === "::ffff:127.0.0.1";
}


async function writeGate(req, res) {
  if (!isLoopback(req)) {
    return { err: json(res, 403, { ok: false, error: "loopback required" }) };
  }
  const body = await readJsonBody(req);
  if (body && body.tooLarge) {
    return { err: json(res, 413, { ok: false, error: "body too large" }) };
  }
  if (body && body.parseError) {
    return { err: json(res, 400, { ok: false, error: "invalid JSON body" }) };
  }
  if (body && body.confirm !== true) {
    return { err: json(res, 400, { ok: false, error: "confirm required" }) };
  }
  return { body };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5417-5448](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5417-L5448)

mount/suppress调用方式。

<details>
<summary>查看原文（32行）</summary>

```text
        },
      });

      
      
      
      
      webServer.register({
        kind: "exact",
        path: "/dsh-update-checker/mount",
        handler: async (req, res) => {
          const g = await writeGate(req, res);
          if (g.err) return;
          try {
            lastMountReport = await ensurePluginMount();
          } catch (err) {
            lastMountReport = {
              ok: false,
              errors: [{ step: "mount", error: String((err && err.message) || err) }],
            };
          }
          return json(res, lastMountReport.ok === false ? 500 : 200, lastMountReport);
        },
      });

      
      webServer.register({
        kind: "exact",
        path: "/dsh-update-checker/suppress",
        handler: async (req, res) => {
          const g = await writeGate(req, res);
          if (g.err) return;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:5477-5510](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5477-L5510)

主更新继续与非dry默认。

<details>
<summary>查看原文（34行）</summary>

```text
          const body = g.body;
          const LOCK_FILE = UPDATE_LOCK_FILE;
          if (updateInFlight && Date.now() - updateStartedAt < 600000)
            return json(res, 409, { ok: false, error: "update already running" });
          const lockState = await reconcileStaleUpdateLock();
          if (lockState.changed === false && lockState.live === true)
            return json(res, 409, { ok: false, error: "update already running (background worker alive)" });
          if (lockState.changed === false && lockState.fresh === true)
            return json(res, 409, { ok: false, error: "update already running (lock file)" });
          const root = await findDeployRoot();
          if (!root) return json(res, 500, { ok: false, error: "deployment root not found" });
          if (isNpxCacheRoot(root)) {
            return json(res, 400, { ok: false, error: "检测到 dsh 通过 npx 缓存运行（_npx），主框架自动更新暂不支持；请改用官方本地部署或 npm i -g @deepseek-ai/dsh", code: "E_NPX_CACHE" });
          }
          if (!(await findDshPackageDir(root, "dsh-web-frontend"))) {
            return json(res, 400, { ok: false, error: "未在部署根发现 dsh-web-frontend（顶层或嵌套均无），该目录可能不是合法的 dsh 部署或已被破坏；请确认 dsh 通过官方本地部署或 npm i -g 安装后重试，而不是装到错误位置再回滚", code: "E_LAYOUT" });
          }
          const dry = body && body.dry === true;
          const allowRemove = body && body.allowRemove === true;
          updateInFlight = true;
          updateStartedAt = Date.now();
          try {
            await mkdir(DSH_HOME, { recursive: true }).catch(() => {});
            await writeFile(
              LOCK_FILE,
              JSON.stringify({ at: Date.now(), pid: process.pid }),
              "utf8"
            );
            await clearProgress();
            await writeProgress({ phase: "check", label: "正在查询最新版本…", percent: 2 });
            const latestInfo = await resolveMainTarget(true); 
            const setts = await readSettings();
            const installedForGate = await readInstalledVersion().catch(() => null);
            const gate = prereleaseGate(installedForGate, latestInfo.version, setts.allowPrerelease);
```

</details>

**依据 5 · 源码核查**：[lib/index.js:5788-5862](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5788-L5862)

restart不依body。

<details>
<summary>查看原文（75行）</summary>

```text
        },
      });

      
      
      webServer.register({
        kind: "exact",
        path: "/dsh-update-checker/restart",
        handler: async (req, res) => {
          const g = await writeGate(req, res);
          if (g.err) return;
          if (IS_DESKTOP) {
            await opsLog({ op: "restart-desktop-manual", pid: process.pid, guide: desktopRestartGuide() });
            return json(res, 409, {
              ok: false,
              code: "E_DESKTOP_RESTART_MANUAL",
              manual: true,
              guide: desktopRestartGuide(),
              error: desktopRestartGuide(),
            });
          }
          const now = Date.now();
          if (restartScheduled && now - restartStartedAt < 180000)
            return json(res, 409, { ok: false, error: "restart already scheduled" });
          restartScheduled = true;
          restartStartedAt = now;
          const root = await findDeployRoot();
          if (!root) return json(res, 500, { ok: false, error: "deployment root not found" });
          const port = typeof webServer.port === "number" ? webServer.port : 3080;
          try {
            const scriptPath = fileURLToPath(
              new URL(IS_WIN32 ? "../scripts/restart-watchdog.ps1" : "../scripts/restart-watchdog.sh", import.meta.url)
            );
            const launcherInfo = deriveLauncher();
            const env = {
              ...process.env,
              DSH_RESTART_PORT: String(port),
              DSH_RESTART_WORKDIR: launcherInfo ? launcherInfo.cwd : root,
              DSH_RESTART_LOG: RESTART_LOG,
              DSH_RESTART_RESULT: RESTART_RESULT,
              DSH_RESTART_OUT_LOG: RESTART_RELAUNCH_OUT,
              DSH_RESTART_ERR_LOG: RESTART_RELAUNCH_ERR,
              DSH_RESTART_PID: String(process.pid),
            };
            if (launcherInfo) {
              env.DSH_RESTART_NODE_FILE = launcherInfo.file;
              env.DSH_RESTART_NODE_ARGS = JSON.stringify(launcherInfo.args);
            } else {
              env.DSH_RESTART_LAUNCHER = await findLauncher(root);
            }
            let child;
            if (IS_WIN32) {
              const inner = `Start-Process -WindowStyle Hidden -FilePath '${POWERSHELL_EXE}' -ArgumentList '-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File','${scriptPath}'`;
              child = spawn(POWERSHELL_EXE, ["-NoProfile", "-NonInteractive", "-Command", inner], {
                stdio: "ignore",
                windowsHide: true,
                env,
              });
            } else {
              child = spawn("sh", [scriptPath], {
                stdio: "ignore",
                detached: true,
                env,
              });
            }
            child.on("error", () => {});
            child.unref();

            await opsLog({
              op: "restart-scheduled",
              port,
              pid: process.pid,
              launcher: launcherInfo ? launcherInfo.args : env.DSH_RESTART_LAUNCHER,
            });
            return json(res, 200, {
```

</details>

**依据 6 · 源码核查**：[lib/index.js:5922-5940](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5922-L5940)

plugin name另有检查。

<details>
<summary>查看原文（19行）</summary>

```text
          const body = g.body;
          const name = body && typeof body.name === "string" ? body.name.trim() : "";
          if (!name) return json(res, 400, { ok: false, error: "name required" });
          if (pluginUpdateInFlight && Date.now() - pluginUpdateStartedAt < 600000)
            return json(res, 409, { ok: false, error: "plugin update already running" });
          pluginUpdateInFlight = true;
          pluginUpdateStartedAt = Date.now();
          try {
            const result = await updatePlugin(name);
            await opsLog({
              op: "plugin-update-ok",
              name,
              to: result.installed || null,
              planned: result.planned || null,
              from: result.installedBefore || null,
              source: result.source || null,
              targetSource: result.targetSource || null,
              ghTag: result.ghTag || null,
              ghError: result.ghError || null,
```

</details>

**依据 7 · 源码核查**：[lib/index.js:6036-6054](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L6036-L6054)

settings body访问。

<details>
<summary>查看原文（19行）</summary>

```text
        handler: async (req, res) => {
          json(res, 200, await readSettings());
        },
      });

      
      
      webServer.register({
        kind: "exact",
        path: "/dsh-update-checker/settings",
        handler: async (req, res) => {
          const g = await writeGate(req, res);
          if (g.err) return;
          const body = g.body;
          const patch = {};
          for (const k of ["floatingEnabled", "notifyEnabled", "suppressUpToDate", "suppressPluginBanner", "allowPrerelease"]) {
            if (typeof body[k] === "boolean") patch[k] = body[k];
          }
          if (["github", "npm", "smart"].includes(body.downloadSource)) patch.downloadSource = body.downloadSource;
```

</details>

#### 缺口

- 外围Host鉴权/代理和各部署后续条件未独立核。
  **影响**：不声称已发生远程未授权更新，但拒绝不阻副作用须先修。
  **进一步探讨**：以纯假webServer/假fs/spawn记录每个拒绝分支零副作用，不调用真实更新器。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · Web恢复、健康与Desktop委托分别验收到哪？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

后台main worker在安装/树校验失败尝试rollbackFromBackup，先还原main-snapshot的@deepseek-ai子树，缺失/不匹配再npm重装；该快照不是整部署和全部第三方依赖/状态/锁的原子快照。Host公开rollbackMain则直接npm安装备份版本再sync，并不使用worker的离线snapshot分支，故“回滚都离线”不成立。

worker health检查首页200或401/403/407，探本插件instanceId拒绝同一旧实例；若instanceId不可用，只写note后仍可ok=true，auth-gated分支直接跳前端资产检查，非要求必须新身份。首页200最多看30个assets/plugins引用，不能证明插件全部加载或业务可用。重启等待后仍不健康记录E_RESTART/restartPending、installed新版本并再次尝试startService，区分安装完成与恢复失败值得保留，文案不应让用户以为可直接使用。

Desktop detection由Electron/argv/resources等识别，读app-update.yml和平台feed，404才fallback裸feed；主update/rollback拒绝改app、restart给手动退出指南。client调用原生bridge更新窗/订阅状态，不能把Web npm方案套Desktop。作者大量测试针对平台/锁/文件交换和身份分支，数量不等独立执行或所有恢复链正确。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/main-update-worker.mjs:525-616](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/scripts/main-update-worker.mjs#L525-L616)

身份未知/auth-gated放行与快照。

<details>
<summary>查看原文（92行）</summary>

```text

function classifyInstanceIdentity(prevInstanceId, probedInstanceId) {
  if (typeof prevInstanceId !== "string" || prevInstanceId === "") return "unavailable";
  if (typeof probedInstanceId !== "string" || probedInstanceId === "") return "unavailable";
  return probedInstanceId === prevInstanceId ? "stale" : "fresh";
}

async function probeInstanceId(fetchOnce, base) {
  for (const route of ["/dsh-update-checker/update-progress.json", "/dsh-update-checker/status.json"]) {
    const res = await fetchOnce(base + route);
    if (!res || res.status !== 200) continue;
    try {
      const data = JSON.parse(res.body);
      if (data && typeof data.instanceId === "string" && data.instanceId !== "") return data.instanceId;
    } catch {
      
    }
  }
  return null;
}

async function healthCheck() {
  const base = `http://127.0.0.1:${PORT}`;
  const problems = [];
  const notes = [];
  const fetchOnce = (url) =>
    new Promise((resolve) => {
      const mod = String(url).startsWith("https:") ? https : http;
      const req = mod.get(url, { timeout: 8000 }, (res) => {
        let ct = res.headers["content-type"] || "";
        let body = "";
        res.on("data", (d) => { body += d; if (body.length > 512 * 1024) res.destroy(); });
        res.on("end", () => resolve({ status: res.statusCode, ct, body }));
      });
      req.on("error", () => resolve(null));
      req.on("timeout", () => { req.destroy(); resolve(null); });
    });
  const home = await fetchOnce(base + "/");
  const kind = home ? classifyHealthStatus(home.status) : "unreachable";
  if (kind === "unreachable" || kind === "bad") {
    problems.push(`GET / -> ${home ? home.status : "no response"}`);
    return { ok: false, problems, notes, error: problems.join("; ") };
  }
  const probedInstance = await probeInstanceId(fetchOnce, base);
  const identity = classifyInstanceIdentity(PREV_INSTANCE, probedInstance);
  if (identity === "stale") {
    problems.push(
      `instance identity: ${probedInstance} is still the dsh instance that ran before the restart (previous ${PREV_INSTANCE}) — something answers on ${PORT}, but the updated build did not come up`
    );
    return { ok: false, problems, notes, error: problems.join("; ") };
  }
  if (identity === "fresh") notes.push(`instance identity: ${probedInstance} (new process, previous ${PREV_INSTANCE})`);
  else notes.push("instance identity: unavailable (this plugin's routes reported no new instance id, so only the port answer was verified)");
  if (kind === "auth-gated") {
    notes.push(`GET / -> ${home.status} (auth-gated: the service answers but serves no frontend on /, so the dist/assets check is skipped)`);
    await opsLog({ op: "main-update-health-auth-gated", status: home.status, port: PORT });
    return { ok: true, problems, notes, error: null };
  }
  const refs = [...home.body.matchAll(/["'](\/(?:assets|plugins)\/[^"']+)["']/g)].map((m) => m[1]);
  for (const ref of refs.slice(0, 30)) {
    const r = await fetchOnce(base + ref);
    if (!r) { problems.push(`${ref} no response`); continue; }
    const isHtml = (r.ct || "").includes("text/html");
    if (r.status !== 200 || isHtml) problems.push(`${ref} -> ${r.status} ${isHtml ? "text/html(SPA fallback)" : r.ct}`);
  }
  return { ok: problems.length === 0, problems, notes, error: problems.length ? problems.join("; ") : null };
}


async function rollbackFromBackup() {
  const restoreFromSnapshot = async () => {
    const nmSrc = join(BACKUP, "main-snapshot", "node_modules", "@deepseek-ai");
    if (!(await exists(nmSrc))) return { ok: false, error: "no snapshot" };
    if (await exists(join(ROOT, "node_modules", "@deepseek-ai"))) {
      await rm(join(ROOT, "node_modules", "@deepseek-ai"), { recursive: true, force: true });
    }
    await mkdir(join(ROOT, "node_modules"), { recursive: true });
    await cp(nmSrc, join(ROOT, "node_modules", "@deepseek-ai"), { recursive: true });
    const meta = await readJson(join(BACKUP, "backup-meta.json"));
    const installed = await readInstalledVersion();
    if (installed && meta && compareVersions(installed, meta.installed) !== 0) {
      return { ok: false, error: `snapshot mismatch (${installed} != ${meta.installed})` };
    }
    const pjPath = join(ROOT, "package.json");
    try {
      const pj = JSON.parse(await readFile(pjPath, "utf8"));
      if (pj.dependencies && typeof pj.dependencies[PACKAGE] === "string" && meta && meta.installed) {
        pj.dependencies[PACKAGE] = meta.installed;
        await writeFile(pjPath, JSON.stringify(pj, null, 2), "utf8");
      }
    } catch {  }
    return { ok: true, installed, restored: "snapshot" };
```

</details>

**依据 2 · 源码核查**：[scripts/main-update-worker.mjs:1512-1598](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/scripts/main-update-worker.mjs#L1512-L1598)

恢复等待/安装与启动分离。

<details>
<summary>查看原文（87行）</summary>

```text
    await writeProgress({ phase: "health", label: "健康检查…", percent: 99 });
    let health = await healthCheck();
    const restartWatchStartedAt = Date.now();
    let restartsSpawned = 1;
    let waitRound = 0;
    const watchProgress = (round) => async () => {
      const waited = Math.round((Date.now() - restartWatchStartedAt) / 1000);
      await writeProgress({
        phase: "restart-pending",
        label: "安装已完成，正在等待服务恢复…",
        percent: 99,
        detail: `已等待 ${waited}s（大版本首次启动可能较慢，安装与同步均已成功）`,
      });
    };
    while (!health.ok && Date.now() - restartWatchStartedAt < RESTART_EXTRA_WINDOW_MS) {
      waitRound += 1;
      await watchProgress(waitRound)();
      const listening = await waitPortQuiet(10000, watchProgress(waitRound));
      if (listening) {
        health = await healthCheck();
        continue;
      }
      if (restartsSpawned < RESTART_MAX_SPAWNS) {
        restartsSpawned += 1;
        const spawnTicker = startProgressTicker(99, 99, 1000, () => ({
          phase: "restart-pending",
          label: "安装已完成，正在重新拉起服务…",
          percent: 99,
          detail: `第 ${restartsSpawned}/${RESTART_MAX_SPAWNS} 次尝试`,
        }));
        try {
          startRes = await startService();
        } finally {
          await spawnTicker.stop();
        }
      } else {
        await sleep(5000);
      }
      health = await healthCheck();
    }
    if (!health.ok) {
      const waited = Math.round((Date.now() - restartWatchStartedAt) / 1000);
      const reason = [startRes.error, health.problems.join("; ")].filter(Boolean).join(" / ") || "unknown";
      const detail =
        `安装已完成（installed=${TARGET}，完整性校验与版本声明同步均通过），` +
        `但服务在约 ${waited} 秒的等待后仍未恢复健康：${reason}。` +
        `本次更新并未失败——请手动重启 dsh（或刷新页面）后即可使用新版本。`;
      progressFrozen = true;
      await writeProgress({
        phase: "error",
        running: false,
        percent: null,
        label: "安装完成，但服务未自动恢复",
        detail: null,
        count: null,
        error: detail,
        code: "E_RESTART",
        installed: TARGET,
        restartPending: true,
        restartOk: startRes.ok,
        healthProblems: health.problems || null,
      });
      await opsLog({
        op: "main-update-restart-pending",
        installed: TARGET,
        waitedSec: waited,
        restartOk: startRes.ok,
        healthProblems: health.problems || null,
      });
      const recover = await startService();
      await opsLog({ op: "main-update-crash-recovery", startOk: recover.ok, error: recover.error || null });
      return { ok: false, installed: TARGET, restartPending: true, error: detail, code: "E_RESTART" };
    }

    await opsLog({ op: "main-update-ok", to: TARGET, type, backup: BACKUP, forced: false, installVia });
    progressFrozen = true;
    await writeProgress({
      phase: "done",
      running: false,
      percent: 100,
      label: "更新完成",
      detail: null,
      count: null,
      result: { ok: true, installed, latest: TARGET },
    });
    return { ok: true, installed, latest: TARGET, type };
  } catch (err) {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5160-5197](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5160-L5197)

手动rollback走npm。

<details>
<summary>查看原文（38行）</summary>

```text
async function rollbackMain() {
  const root = await findDeployRoot();
  if (!root) throw Object.assign(new Error("deployment root not found"), { code: "ENOENT" });
  const backups = await listMainBackups();
  if (!backups.length) {
    throw Object.assign(new Error("no main-program backup found"), { code: "ENOBACKUP" });
  }
  const target = backups[0];
  if (!target.installed) {
    throw Object.assign(
      new Error(`backup ${target.id} is missing the recorded installed version`),
      { code: "ENOBACKUP" }
    );
  }
  const spec = `${PACKAGE}@${target.installed}`;
  await dryRunGuard(root, spec, { allowRemove: true }); 
  const safetyBackup = await backupForUpdate(root); 
  const { args, type } = buildNpmInstallArgs(root, spec);
  const { stdout, stderr } = await runNpm(args, { cwd: root, timeout: 600000 });
  const installed = await readInstalledVersion();
  const ok = installed && target.installed && compareVersions(installed, target.installed) === 0;
  const plan = await planSync(root);
  const synced = await runSync(root, plan.todo);
  const failed = synced.filter((s) => !s.ok);
  await writeSuppressUpToDate(false);
  return {
    ok,
    installed,
    expected: target.installed,
    type,
    backup: target.id,
    safetyBackup,
    synced: synced.map((s) => (s.ok ? s.name : `${s.name} (FAILED: ${s.error})`)),
    syncFailed: failed.length,
    output: truncate((stdout || "") + (stderr || ""), 2000),
  };
}

```

</details>

**依据 4 · 源码核查**：[lib/index.js:317-375](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L317-L375)

Desktop识别。

<details>
<summary>查看原文（59行）</summary>

```text
function detectDesktopRuntime(facts = {}) {
  const env = facts.env || {};
  const versions = facts.versions || {};
  const argv = facts.argv || [];
  const exists = typeof facts.exists === "function" ? facts.exists : () => false;
  const explicitResources = typeof facts.resourcesPath === "string" && facts.resourcesPath ? facts.resourcesPath : null;
  const electron = typeof versions.electron === "string" && versions.electron ? versions.electron : null;
  const entry = typeof argv[1] === "string" && argv[1] ? argv[1] : null;
  const hostEntry = entry && /[\\/]dsh-desktop-host[\\/]lib[\\/]index\.js$/i.test(entry) ? entry : null;
  const forced = String(env.DSH_UC_FORCE_PLATFORM || "").trim().toLowerCase();
  const envRuntimeDir = String(env.DSH_UC_RUNTIME_DIR || "").trim();
  const envResourcesDir = String(env.DSH_UC_RESOURCES_DIR || "").trim();
  let runtimeDir = null;
  if (hostEntry) runtimeDir = hostEntry.split(/[\\/]node_modules[\\/]/)[0] || null;
  if (!runtimeDir && envRuntimeDir) runtimeDir = resolve(envRuntimeDir);
  let resourcesDir = explicitResources || envResourcesDir || null;
  if (!resourcesDir && runtimeDir) {
    const idx = runtimeDir.toLowerCase().lastIndexOf("app.asar");
    if (idx > 0) resourcesDir = runtimeDir.slice(0, idx).replace(/[\\/]+$/, "");
  }
  const desktopHosted = electron !== null || hostEntry !== null;
  const isDesktop = forced === "desktop" || (forced !== "web" && desktopHosted);
  const appUpdateFile = resourcesDir ? join(resourcesDir, "app-update.yml") : null;
  const appPackageFiles = [];
  if (resourcesDir) {
    appPackageFiles.push(join(resourcesDir, "app.asar", "package.json"));
    appPackageFiles.push(join(resourcesDir, "app", "package.json"));
  }
  if (runtimeDir) {
    appPackageFiles.push(join(runtimeDir, "package.json"));
    appPackageFiles.push(resolve(runtimeDir, "..", "package.json"));
  }
  return {
    platform: isDesktop ? "desktop" : "web",
    desktop: isDesktop,
    electron,
    electronVersion: electron,
    runAsNode: String(env.ELECTRON_RUN_AS_NODE || "") === "1",
    desktopHost: hostEntry !== null,
    entry: hostEntry || entry,
    runtimeDir,
    resourcesDir,
    appRoot: resourcesDir ? dirname(resourcesDir) : null,
    appPackageFiles,
    appUpdateFile,
    updateSourceAvailable: Boolean(appUpdateFile && exists(appUpdateFile)),
  };
}

const RUNTIME = detectDesktopRuntime({
  env: process.env,
  versions: process.versions,
  argv: process.argv,
  resourcesPath: process.resourcesPath,
  exists: existsSync,
});

const IS_DESKTOP = RUNTIME.platform === "desktop";

```

</details>

**依据 5 · 源码核查**：[lib/index.js:399-482](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L399-L482)

feed平台/404fallback。

<details>
<summary>查看原文（84行）</summary>

```text
async function readDesktopFeed(force, deps = {}) {
  const fetchImpl = deps.fetchImpl || fetch;
  const readText = deps.readText || ((p) => readFile(p, "utf8"));
  const now = Date.now();
  if (!force && desktopFeedCache && now - desktopFeedCache.at < CHECK_TTL_MS) return desktopFeedCache;
  const platform = deps.platform || process.platform;
  const overrideUrl = String(process.env.DSH_UC_FEED_URL || "").trim();
  let feedUrl = overrideUrl || null;
  let provider = "generic";
  let channel = null;
  let baseUrl = null;
  let candidates = [];
  if (feedUrl) {
    const m = /([^\\/]+)\.ya?ml$/i.exec(feedUrl);
    channel = m ? m[1] : "override";
    provider = "override";
    candidates = [feedUrl];
  } else {
    if (!RUNTIME.appUpdateFile) {
      throw Object.assign(new Error("desktop update source not found (app-update.yml)"), { code: "E_DESKTOP_SOURCE" });
    }
    const src = parseDesktopUpdateSource(await readText(RUNTIME.appUpdateFile));
    if (!src.url) {
      throw Object.assign(new Error("desktop update source has no url in app-update.yml"), { code: "E_DESKTOP_SOURCE" });
    }
    provider = src.provider || "generic";
    channel = src.channel || "latest";
    baseUrl = src.url;
    candidates = desktopFeedUrlCandidates(src.url, channel, platform);
    feedUrl = candidates[0] || null;
  }
  let feed = null;
  let feedError = null;
  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    try {
      const res = await fetchImpl(candidate, {
        headers: { accept: "text/yaml, text/plain, application/octet-stream, */*" },
        signal: AbortSignal.timeout(DESKTOP_FEED_TIMEOUT_MS),
      });
      if (!res.ok) {
        throw Object.assign(new Error(`desktop update feed HTTP ${res.status}`), {
          status: res.status,
          feedUrl: candidate,
          attempts: candidates.slice(),
          code: "E_DESKTOP_FEED",
        });
      }
      feed = parseDesktopFeed(await res.text());
      feedUrl = candidate;
      break;
    } catch (err) {
      if (!feedError) feedError = err;
      const fallback = candidates[i + 1] || null;
      if (!fallback || !err || err.status !== 404) {
        const reported = feedError || err;
        if (reported !== err && err) {
          reported.attempts = candidates.slice();
          reported.lastError = String((err && err.message) || err);
        }
        throw reported;
      }
      await opsLog({
        op: "main-update-desktop-feed-fallback",
        status: err.status,
        from: candidate,
        to: fallback,
        platform,
      });
    }
  }
  if (!feed) throw feedError || new Error("desktop update feed unavailable");
  if (!feed.version) throw new Error("desktop update feed carries no version");
  desktopFeedCache = {
    at: now,
    provider,
    channel,
    feedUrl,
    baseUrl,
    version: feed.version,
    releaseDate: feed.releaseDate,
    downloadUrl: feed.url,
    current: readDesktopAppVersion(),
  };
```

</details>

**依据 6 · 源码核查**：[scripts/unit-health-identity.test.mjs:25-54](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/scripts/unit-health-identity.test.mjs#L25-L54)

作者假服务身份测试设计。

<details>
<summary>查看原文（30行）</summary>

```text
      res.writeHead(401, { 'content-type': 'text/plain' });
      res.end('unauthorized');
      return;
    }
    if (req.url === '/dsh-update-checker/update-progress.json') {
      if (servedInstanceId === null) {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('no progress');
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ phase: 'health', instanceId: servedInstanceId }));
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('nope');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  port = server.address().port;

  process.env.DSH_UC_UPDATE_ROOT = root;
  process.env.DSH_UC_UPDATE_TARGET = '9.9.9';
  process.env.DSH_UC_UPDATE_BACKUP = join(root, '.backup');
  process.env.DSH_UC_UPDATE_PROGRESS = join(root, 'progress.json');
  process.env.DSH_UC_UPDATE_OPS = join(root, 'ops.log');
  process.env.DSH_UC_UPDATE_DSH_HOME = root;
  process.env.DSH_UC_UPDATE_NO_RUN = '1';
  process.env.DSH_UC_UPDATE_PORT = String(port);
  process.env.DSH_UC_UPDATE_PREV_INSTANCE = PREV;
  worker = await loadWorker('base');
```

</details>

#### 缺口

- 所有支持布局与故障下恢复后的完整业务可用性、跨依赖状态一致性未知。
  **影响**：新版本/端口答复不能代替全任务验收。
  **进一步探讨**：用隔离假树/假进程的事务记录核复制/声明/锁/身份，不在用户当前部署执行。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 启用与三阶段成本应怎样核算？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH webServer/client slots/locale和React18 | 路由/通知/设置页 | 固定宿主接口兼容需核 |
| npm/pnpm、可写profile/部署/DSH_HOME | staging/同步/备份 | 会跑第三方脚本/自动mount |
| npm/GitHub或Desktop feed网络 | 候选版本/下载 | GitHub TLS被关闭，源可信性需审查 |
| Web进程探测/launcher/磁盘空间 | 停启与恢复 | POSIX需ss/lsof等，Desktop交原生更新 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定审查 | 先修writeGate并核Host访问策略 | 拒绝请求必须零副作用 |
| 检查 | 核来源/频道/安装目标副本 | 高版本非兼容保证 |
| 备份计划 | 查看dry/备份范围与空间 | 安装脚本/共享依赖另审 |
| 更新 | 明确授权单项/批次 | 核installed/persisted/mount/leftovers分别状态 |
| 恢复 | 核新进程/资产/业务/声明锁 | 不能只看ok/端口/安装版本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 内联UI/备份目录、网络registry/feed | 核部署/profile/权限/脚本信任并先修守卫 | 工时/磁盘需求未知 |
| 持续使用 | 定期版本探测、tar下载/解压、staging与依赖重装 | 审来源/版本/变更/声明一致性 | 网络/安装时长未知，无独立模型API非总费用0 |
| 失败恢复 | 多份快照/临时树/日志、重装/重启资源与停机 | 分辨部分安装/声明失败/旧实例并人工回滚 | 非全树原子回滚，停机与恢复工时未知 |

#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少手动维护 | GUI候选/备份/安装/回退入口 | 当前拒绝守卫有控制流缺陷 |
| 便于追踪 | 分阶段进度/日志/manifest回执 | ok可包部分失败 |
| 平台分流 | Desktop委托原生，Web包管理 | 不保证所有部署自动恢复 |

这是有高权限副作用的维护组件，不能因纯Node内置依赖就称低风险/零成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4277-4324](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4277-L4324)

包管理/脚本。

<details>
<summary>查看原文（48行）</summary>

```text
function buildPnpmStageAddArgs(dir, spec) {
  return ["add", spec, "--dir", dir, "--registry", REGISTRY, "--reporter", "append-only"];
}


function buildPnpmStageInstallArgs(root) {
  return ["install", "--dir", root, "--prod", "--registry", REGISTRY, "--reporter", "append-only"];
}


async function runStagingInstall({ npmArgs, pnpmArgs, cwd }) {
  if (safeGetNpmCli()) return runNpm(npmArgs, { cwd, timeout: 600000 });
  const pm = desktopPackageManager();
  if (!pm) {
    getNpmCli();
    throw Object.assign(new Error("no package installer available"), { code: "ENPMCLI" });
  }
  await runPnpm(pnpmArgs, { cwd, timeout: 600000 });
  return { stdout: `pnpm staging install (${pm.source})`, stderr: "" };
}


async function ensureScriptsBuilt(nmRoot, extraArgs) {
  if (!safeGetNpmCli() && desktopPackageManager()) {
    const names = await collectScriptPackages(join(nmRoot, "node_modules"));
    if (!names.length) return { npmMajor: null, pass2: false, names: [], pm: "pnpm" };
    await runPnpm(["rebuild", ...names], { cwd: nmRoot, timeout: 600000 });
    return { npmMajor: null, pass2: true, names, pm: "pnpm" };
  }
  const npmMajor = readNpmMajor();
  if (npmMajor === null || npmMajor < 12) return { npmMajor, pass2: false };
  const names = await collectScriptPackages(join(nmRoot, "node_modules"));
  if (!names.length) return { npmMajor, pass2: false, names: [] };
  const args = [
    "install",
    "--prefix",
    nmRoot,
    "--no-save",
    "--package-lock=false",
    "--registry",
    REGISTRY,
    "--no-audit",
    "--no-fund",
    `--allow-scripts=${names.join(",")}`,
  ];
  await runNpm(args, { cwd: nmRoot, timeout: 600000 });
  return { npmMajor, pass2: true, names };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4361-4428](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4361-L4428)

多阶段回执。

<details>
<summary>查看原文（68行）</summary>

```text
async function finalizePluginInstall(target, pkgRoot, depRoot, extra, copyFilter) {
  const newPkg = JSON.parse(await readFile(join(pkgRoot, "package.json"), "utf8"));
  const newVersion =
    typeof newPkg.version === "string" && newPkg.version ? newPkg.version : null;
  if (!newVersion) throw new Error("new plugin package.json has no version");
  const manifestSpec = await readManifestSpecFor(target.name, target.dir);
  const replaced = await backupAndReplace(target.dir, pkgRoot, copyFilter, manifestSpec);
  const backupDir = replaced.backupDir;
  const installMode = replaced.swap && replaced.swap.inPlace ? "in-place" : "swap";
  const declaredGitSpec = /^(?:github:|git\+|git:|https?:\/\/)/i.test(String(manifestSpec || ""));
  const persistWarning =
    declaredGitSpec && extra && extra.source === "npm"
      ? `profile 声明为 ${manifestSpec}，本次从 npm 安装 ${newVersion}；为避免改写声明来源，manifest 未改动（如需跟随 GitHub tag，请手动改 pin 后再更新）`
      : null;
  const merged = await mergeDependencies(depRoot, target.dir);
  npmLatestCache.delete(target.name);
  if (target.ghRepo) ghLatestCache.delete(target.ghRepo);
  await writeSuppressPluginBanner(false);
  
  
  const persisted = await persistPluginUpdate({
    name: target.name,
    newVersion,
    targetDir: target.dir,
    gh:
      extra && extra.source === "github"
        ? {
            source: "github",
            owner: target.ghRepo ? String(target.ghRepo).split("/")[0] : null,
            repo: target.ghRepo ? String(target.ghRepo).split("/")[1] : null,
            tag: extra.ghTag || null,
          }
        : null,
  }).catch((err) => ({
    manifest: [],
    lockfile: [],
    error: truncate(String((err && err.message) || err), 1000),
  }));
  
  
  
  
  let mount = null;
  try {
    mount = await ensurePluginMount();
    lastMountReport = mount;
  } catch (err) {
    mount = { ok: false, errors: [{ step: "mount", error: String((err && err.message) || err) }] };
  }
  return {
    ok: true,
    name: target.name,
    installed: newVersion,
    backupDir,
    merged,
    source: extra.source,
    installMode,
    persisted,
    persistWarning,
    leftovers: replaced.swap && replaced.swap.sync ? replaced.swap.sync.leftoverCount || 0 : 0,
    npmOutput: extra.npmOutput || null,
    allowScripts: extra.allowScripts || null,
    mount,
  };
}



```

</details>

**依据 3 · 源码核查**：[lib/index.js:5320-5329](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5320-L5329)

平台探测依赖。

<details>
<summary>查看原文（10行）</summary>

```text
function mainUpdatePlatformError(platform = process.platform, caps = null) {
  if (platform === "win32") return null;
  const c = caps || detectPosixUpdateCaps(platform);
  if (c.probe) return null;
  return {
    code: "E_PLATFORM_UNSUPPORTED",
    error:
      "One-click core updates on Linux/macOS need `ss` or `lsof` to find the process listening on the service port, and neither is available on this host. Stop DSH, update it manually, then restart DSH.",
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1150-1166](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/client.js#L1150-L1166)

定期检查。

<details>
<summary>查看原文（17行）</summary>

```text
        fetchStatus(PLUGIN_STATUS_URL, force)
          .then((data) => {
            setState({ status: "done", data, error: null });
            markCheckDone("plugin");
          })
          .catch((err) => {
            console.error("[dsh-update-checker] plugin check failed", err);
            setState({ status: "error", data: null, error: String(err && err.message ? err.message : err) });
            markCheckDone("plugin");
          });
      };

      react.useEffect(() => {
        runCheck();
        const timer = setInterval(() => runCheck(), CHECK_INTERVAL);
        return () => clearInterval(timer);
      }, []);
```

</details>

#### 缺口

- 维护人工、停机、备份增长及与手工包管理的收益没有对照。
  **影响**：不填节省工时/金额或全自动恢复率。
  **进一步探讨**：固定隔离部署样例，分别计检查/安装/恢复资源与人工时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐与继续研究应从哪里入手？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前不推荐直接安装到日常部署。目的与恢复工程有价值，但拒绝函数返回值错误触及写权限底线；源码已足以要求先修，不需要在真实宿主尝试危险操作。修后仍应把源/脚本信任、部分成功与恢复验收分别审查，而非一次“更新成功”总括。

由拒绝不终止、多阶段ok与身份未知放行可推导“拒绝可证明、分阶段可验收的更新事务”。gate返回显式discriminant并要求调用者先判allowed，路由按方法/来源/授权共同拒绝；计划绑定目标版本/来源摘要与具体部署，执行receipt逐阶段installed/manifest/lock/mount/restart/application，拒绝和取消均没有后续mutation。

未实现。最小对照当前版/原型，假webServer+fs/spawn/registry记录拒绝、坏JSON、缺confirm/异源/重复操作、脚本失败、声明写失败、身份未知/旧身份；要求拒绝零副作用、部分失败不变成全成功、计划变更需重授权。反例是崩溃在落盘与回执之间难原子提交、强制新身份遇鉴权会不可判定、备份不足需停而非盲恢复；用unknown显式交人工，不伪造成功。若仍拒绝后写盘/spawn、换目标未确认或身份未知当完整恢复，则假设被反证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5303-5352](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L5303-L5352)

拒绝事务推导。

<details>
<summary>查看原文（50行）</summary>

```text
function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function truncate(s, max) {
  const str = s == null ? "" : String(s);
  return str.length <= max ? str : str.slice(0, max) + "\n…(truncated)";
}




function mainUpdatePlatformError(platform = process.platform, caps = null) {
  if (platform === "win32") return null;
  const c = caps || detectPosixUpdateCaps(platform);
  if (c.probe) return null;
  return {
    code: "E_PLATFORM_UNSUPPORTED",
    error:
      "One-click core updates on Linux/macOS need `ss` or `lsof` to find the process listening on the service port, and neither is available on this host. Stop DSH, update it manually, then restart DSH.",
  };
}

function isLoopback(req) {
  const a = req && req.socket && req.socket.remoteAddress;
  return a === "127.0.0.1" || a === "::1" || a === "::ffff:127.0.0.1";
}


async function writeGate(req, res) {
  if (!isLoopback(req)) {
    return { err: json(res, 403, { ok: false, error: "loopback required" }) };
  }
  const body = await readJsonBody(req);
  if (body && body.tooLarge) {
    return { err: json(res, 413, { ok: false, error: "body too large" }) };
  }
  if (body && body.parseError) {
    return { err: json(res, 400, { ok: false, error: "invalid JSON body" }) };
  }
  if (body && body.confirm !== true) {
    return { err: json(res, 400, { ok: false, error: "confirm required" }) };
  }
  return { body };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4361-4428](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js#L4361-L4428)

阶段状态推导。

<details>
<summary>查看原文（68行）</summary>

```text
async function finalizePluginInstall(target, pkgRoot, depRoot, extra, copyFilter) {
  const newPkg = JSON.parse(await readFile(join(pkgRoot, "package.json"), "utf8"));
  const newVersion =
    typeof newPkg.version === "string" && newPkg.version ? newPkg.version : null;
  if (!newVersion) throw new Error("new plugin package.json has no version");
  const manifestSpec = await readManifestSpecFor(target.name, target.dir);
  const replaced = await backupAndReplace(target.dir, pkgRoot, copyFilter, manifestSpec);
  const backupDir = replaced.backupDir;
  const installMode = replaced.swap && replaced.swap.inPlace ? "in-place" : "swap";
  const declaredGitSpec = /^(?:github:|git\+|git:|https?:\/\/)/i.test(String(manifestSpec || ""));
  const persistWarning =
    declaredGitSpec && extra && extra.source === "npm"
      ? `profile 声明为 ${manifestSpec}，本次从 npm 安装 ${newVersion}；为避免改写声明来源，manifest 未改动（如需跟随 GitHub tag，请手动改 pin 后再更新）`
      : null;
  const merged = await mergeDependencies(depRoot, target.dir);
  npmLatestCache.delete(target.name);
  if (target.ghRepo) ghLatestCache.delete(target.ghRepo);
  await writeSuppressPluginBanner(false);
  
  
  const persisted = await persistPluginUpdate({
    name: target.name,
    newVersion,
    targetDir: target.dir,
    gh:
      extra && extra.source === "github"
        ? {
            source: "github",
            owner: target.ghRepo ? String(target.ghRepo).split("/")[0] : null,
            repo: target.ghRepo ? String(target.ghRepo).split("/")[1] : null,
            tag: extra.ghTag || null,
          }
        : null,
  }).catch((err) => ({
    manifest: [],
    lockfile: [],
    error: truncate(String((err && err.message) || err), 1000),
  }));
  
  
  
  
  let mount = null;
  try {
    mount = await ensurePluginMount();
    lastMountReport = mount;
  } catch (err) {
    mount = { ok: false, errors: [{ step: "mount", error: String((err && err.message) || err) }] };
  }
  return {
    ok: true,
    name: target.name,
    installed: newVersion,
    backupDir,
    merged,
    source: extra.source,
    installMode,
    persisted,
    persistWarning,
    leftovers: replaced.swap && replaced.swap.sync ? replaced.swap.sync.leftoverCount || 0 : 0,
    npmOutput: extra.npmOutput || null,
    allowScripts: extra.allowScripts || null,
    mount,
  };
}



```

</details>

**依据 3 · 源码核查**：[scripts/main-update-worker.mjs:546-591](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/scripts/main-update-worker.mjs#L546-L591)

身份未知边界。

<details>
<summary>查看原文（46行）</summary>

```text
async function healthCheck() {
  const base = `http://127.0.0.1:${PORT}`;
  const problems = [];
  const notes = [];
  const fetchOnce = (url) =>
    new Promise((resolve) => {
      const mod = String(url).startsWith("https:") ? https : http;
      const req = mod.get(url, { timeout: 8000 }, (res) => {
        let ct = res.headers["content-type"] || "";
        let body = "";
        res.on("data", (d) => { body += d; if (body.length > 512 * 1024) res.destroy(); });
        res.on("end", () => resolve({ status: res.statusCode, ct, body }));
      });
      req.on("error", () => resolve(null));
      req.on("timeout", () => { req.destroy(); resolve(null); });
    });
  const home = await fetchOnce(base + "/");
  const kind = home ? classifyHealthStatus(home.status) : "unreachable";
  if (kind === "unreachable" || kind === "bad") {
    problems.push(`GET / -> ${home ? home.status : "no response"}`);
    return { ok: false, problems, notes, error: problems.join("; ") };
  }
  const probedInstance = await probeInstanceId(fetchOnce, base);
  const identity = classifyInstanceIdentity(PREV_INSTANCE, probedInstance);
  if (identity === "stale") {
    problems.push(
      `instance identity: ${probedInstance} is still the dsh instance that ran before the restart (previous ${PREV_INSTANCE}) — something answers on ${PORT}, but the updated build did not come up`
    );
    return { ok: false, problems, notes, error: problems.join("; ") };
  }
  if (identity === "fresh") notes.push(`instance identity: ${probedInstance} (new process, previous ${PREV_INSTANCE})`);
  else notes.push("instance identity: unavailable (this plugin's routes reported no new instance id, so only the port answer was verified)");
  if (kind === "auth-gated") {
    notes.push(`GET / -> ${home.status} (auth-gated: the service answers but serves no frontend on /, so the dist/assets check is skipped)`);
    await opsLog({ op: "main-update-health-auth-gated", status: home.status, port: PORT });
    return { ok: true, problems, notes, error: null };
  }
  const refs = [...home.body.matchAll(/["'](\/(?:assets|plugins)\/[^"']+)["']/g)].map((m) => m[1]);
  for (const ref of refs.slice(0, 30)) {
    const r = await fetchOnce(base + ref);
    if (!r) { problems.push(`${ref} no response`); continue; }
    const isHtml = (r.ct || "").includes("text/html");
    if (r.status !== 200 || isHtml) problems.push(`${ref} -> ${r.status} ${isHtml ? "text/html(SPA fallback)" : r.ct}`);
  }
  return { ok: problems.length === 0, problems, notes, error: problems.length ? problems.join("; ") : null };
}
```

</details>

#### 缺口

- 显式拒绝/绑定计划/分阶段事务回执未实现。
  **影响**：不是现有授权/恢复保证。
  **进一步探讨**：先用纯假副作用日志验证负路径，再评隔离部署，不在日常profile试错。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
