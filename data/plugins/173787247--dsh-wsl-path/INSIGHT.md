# dsh-wsl-path

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e82233f](https://github.com/173787247/dsh-wsl-path/tree/e82233f94e1d77c35657e06bfd032a03e353e3ba)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-path)
<!-- END META -->

> **实现功能**：在WSL中的DSH提供Linux盘符挂载和Windows/WSL UNC路径文本转换，并附文件系统使用提示。

> **核心亮点**：将盘符/WSL UNC文字映射、WSL识别和词法FS提示接到并发安全的小工具，减少手改分隔符。详见[Q02](#research-q02)。

> **风险与缺陷**：UNC发行版被helper解析后在工具输出丢弃，默认/mnt与字面WSL假设/盘符相对路径和特殊名不保真；ok非存在/权限保证，raw注册需核宿主。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 解决什么跨环境任务，结果能证明路径有效吗？](#detail-section-11)
  - [Q02 · 转换、环境识别和建议如何产生？](#detail-section-12)
  - [Q03 · 哪些路径会变错或丢失身份？](#detail-section-13)
  - [Q04 · 如何启动使用，成本与效果是什么？](#detail-section-14)
  - [Q05 · 推荐结论与可继续探讨入口是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向DSH实际运行在WSL、频繁把/mnt/c或Linux home路径交给Windows程序的用户。path_convert双向生成文本路径并给drvfs/Linux提示，不打开、不复制、不执行目标，不检查文件存在或权限。

合格结果应是保留目标发行版/卷与文件名语义、区分只是文本推导和可访问性，无法确定时不误指另一文件。基线是手改分隔符或WSL系统路径工具，增量是DSH模型工具内统一输出/标签提示；不意味着拥有跨文件系统挂载或隔离能力。

手改路径或系统路径工具；增量是模型内提示，未证明物理正确或错误率更低。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 双向映射 | /mnt盘符/WSL UNC | 默认mount，同distro常规路径 |
| 自动方向 | 盘符/UNC语法识别 | C:foo与显式方向不同 |
| FS建议 | drvfs/Linux提示 | 非mount/CRLF/权限探测 |
| 环境门 | 非WSL错误 | apply缓存env，默认distro可能不实 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18和DSH tools/systemPrompt | ESM/注册与指引 | package无精确宿主peer，套件矩阵为作者外部声明 |
| 实际WSL且发行版env可信 | 工具启用与UNC名称 | 无env退WSL不是探测真实名称 |
| 默认/mnt卷映射与同发行版 | 规则成立 | 定制挂载/跨distro需额外核 |
| 可披露路径文本 | 参数/结果给模型 | 不读内容也可能暴露用户名/目录 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主注册/WSL env | 非WSL返回明确错误 |
| 输入 | 明确绝对路径和目标方向 | 避免C:foo/非支持UNC/特殊名 |
| 核身份 | 对照发行版/卷根与输出 | 跨distro不把/home误当当前文件 |
| 下游使用 | 先确认存在/权限再交其他工具 | ok仅字符串映射，无打开授权 |
| 维护 | 核mount和发行版变化 | apply缓存需重载才能更新 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地小包/环境字符串与内核release读取 | 核WSL/发行版/挂载/宿主schema | 工时和金额未知 |
| 持续使用 | 字符串转换/提示与tool上下文 | 核目标身份和提示适用 | 无独立模型/网络/目标文件读取，不等总token费0 |
| 失败恢复 | 重转文本，无目标文件回滚 | 纠正错distro/挂载/特殊名，复核下游动作 | 工具自身无写副作用，但下游用错路径的恢复另计且未知 |



#### 效果

| 目标 | 增量 | 边界 |
| --- | --- | --- |
| 少手改路径 | 盘符/WSL UNC文字映射 | 非全文件名/定制挂载 |
| 少FS混用 | tags/advice | 词法提示非真实诊断 |
| 低副作用 | 不执行开文件/命令 | 输出路径仍有隐私/下游风险 |

作者测试只有几个常规正例/tag提示，不覆盖跨distro/特殊路径与物理同文件；本轮只读，不运行测试或Windows调用。

> **思考**：UNC发行版被helper解析后在工具输出丢弃，默认/mnt与字面WSL假设/盘符相对路径和特殊名不保真；ok非存在/权限保证，raw注册需核宿主。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将盘符/WSL UNC文字映射、WSL识别和词法FS提示接到并发安全的小工具，减少手改分隔符。详见[Q02](#research-q02)。

将盘符/WSL UNC文字映射、WSL识别和词法FS提示接到并发安全的小工具，减少手改分隔符。详见[Q02](#research-q02)。

toLinuxPath解析UNC得到r.distro，但不与当前distro比较；index返回仅r.linux/kind，丢发行版字段。从当前Ubuntu转换`\\wsl$\Debian\home\a`，输出`/home/a`看似当前Ubuntu路径，可能指另一文件。它没有真的跨发行版访问，问题是文本身份被压扁。env缺失而仅内核判WSL时toWindows用字面WSL，也不保证对应可用发行版。

盘符正则允许斜线缺失，所以显式toLinux的C:foo被当/mnt/c/foo，未区分Windows盘符相对路径；auto对同串又走toWindows失败，方向行为不一致。默认/mnt映射未读wsl.conf/挂载表，定制automount或非Windows挂载处不保证正确。函数trim输入会丢合法首尾空格，Linux路径中的反斜线被换为分隔符，不保所有合法文件名。相对路径和常规网络共享UNC不支持，点段/符号链接不realpath，成功只代表规则接受。

SECURITY要求不返回秘密，但工具原样回input/output及目录名，不做secret识别；路径若含敏感标识仍会进入工具结果/会话模型上下文。它不读目标文件内容、不另持久化/外发；不要用“无文件操作”推零披露。注册用raw工具对象/JSONSchema风格，包无宿主peer版本，实际兼容需按目标契约核，不能仅凭README套件兼容矩阵推全部有效。

<a id="detail-section-5"></a>

### 1.4 主要限制

UNC发行版被helper解析后在工具输出丢弃，默认/mnt与字面WSL假设/盘符相对路径和特殊名不保真；ok非存在/权限保证，raw注册需核宿主。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，仅默认挂载/同distro/常规绝对路径先人工核身份；多distro或特殊名先观察。详见[Q05](#research-q05)。

合格结果应是保留目标发行版/卷与文件名语义、区分只是文本推导和可访问性，无法确定时不误指另一文件。基线是手改分隔符或WSL系统路径工具，增量是DSH模型工具内统一输出/标签提示；不意味着拥有跨文件系统挂载或隔离能力。

采用建议：有试用，仅默认挂载/同distro/常规绝对路径先人工核身份；多distro或特殊名先观察。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。常规同发行版默认挂载的文字转换明确，跨发行版/定制挂载/特殊名需显式边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SECURITY.md、index.js、lib/path.js、lib/wsl-host.js、test/path.test.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：三运行JS完整与package/SECURITY/测试设计；不运行WSL/PowerShell/目标测试或打开路径。
- 下一步：可继续固定路径/挂载mock核distro丢失/盘符相对/特殊名与可表示状态，不执行目标文件或系统命令。

**分析版本**

- **仓库**：[173787247/dsh-wsl-path](https://github.com/173787247/dsh-wsl-path)
- **版本号**：0.2.0（[固定提交 e82233f](https://github.com/173787247/dsh-wsl-path/tree/e82233f94e1d77c35657e06bfd032a03e353e3ba)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索保发行版/卷映射来源与可表示状态的转换收据，拒绝身份歧义，比较误转与探测代价；未实现。详见[Q05](#research-q05)。

可继续固定路径/挂载mock核distro丢失/盘符相对/特殊名与可表示状态，不执行目标文件或系统命令。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 164 | — | — | 835 |
| .js | source | 3 | 255 | 228 | 10 | — |
| .js | test | 1 | 27 | 24 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-path/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-path/issues?q=is%3Aissue+created%3A2026-09-22T09%3A23%3A22.394Z..2026-10-22T09%3A23%3A22.394Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-path/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A23%3A22.394Z..2026-10-22T09%3A23%3A22.394Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核路径映射/物理文件区别、发行版身份/挂载/特殊名、实际读取执行范围、成本与采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 解决什么跨环境任务，结果能证明路径有效吗？

**研究主题**：场景与需求

#### 完整回答

面向DSH实际运行在WSL、频繁把/mnt/c或Linux home路径交给Windows程序的用户。path_convert双向生成文本路径并给drvfs/Linux提示，不打开、不复制、不执行目标，不检查文件存在或权限。

合格结果应是保留目标发行版/卷与文件名语义、区分只是文本推导和可访问性，无法确定时不误指另一文件。基线是手改分隔符或WSL系统路径工具，增量是DSH模型工具内统一输出/标签提示；不意味着拥有跨文件系统挂载或隔离能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/README.md#L5-L13)

作者转换定位。

```text
DeepSeek Harness tool: **`path_convert`** — convert between Linux (`/home`, `/mnt/c`) and Windows (`C:\`, `\\wsl$\`) paths, with `/mnt/c` caveats.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Converts a WSL path to a Windows path and back, including /mnt tags.
```

**依据 2 · 源码核查**：[index.js:62-94](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/index.js#L62-L94)

仅生成输出。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const input = String(args?.path ?? "").trim();
      let direction = args?.direction === "toWindows" || args?.direction === "toLinux"
        ? args.direction
        : "auto";
      if (direction === "auto") {
        direction = /^[a-zA-Z]:[\\/]/.test(input) || /^\\\\/.test(input) ? "toLinux" : "toWindows";
      }
      if (direction === "toWindows") {
        const r = toWindowsPath(input, { distro });
        if (!r.ok) return r;
        return {
          ok: true,
          direction,
          kind: r.kind,
          input,
          output: r.windows,
          tags: pathTags(input),
          advice: adviceFor(r.kind, direction, { input, output: r.windows }),
        };
      }
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
      };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 转换、环境识别和建议如何产生？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

apply一次detectWsl，环境含WSL_DISTRO_NAME/WSL_INTEROP或/proc内核release含microsoft即true，发行版取env否则字面WSL，之后不随请求刷新。工具非WSL返回错误，即使纯字符串函数本可离线转换也不对外开放。

auto以盘符后斜线或UNC前缀决定toLinux，否则toWindows。Linux /mnt/<字母>转盘符，其余绝对路径拼`\\wsl$\<当前distro>\…`；Windows盘符转/mnt/<小写盘符>，wsl$/wsl.localhost UNC提取发行版和余路径。tags/advice是路径字符串规则，不检查真实mount/FS/CRLF或文件权限，不能把建议当检测报告。

贡献是成熟字符串映射加WSL识别、结构化错误/提示与systemPrompt接线，不是新跨平台路径算法。共享wsl-host含runPowerShell/runCmd函数，但index只导入detectWsl且转换未调用它们；不能因为文件存在就声称该工具会启动Windows命令。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl-host.js:21-31](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/wsl-host.js#L21-L31)

环境判定/默认发行版。

<details>
<summary>查看原文（11行）</summary>

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
```

</details>

**依据 2 · 源码核查**：[index.js:14-25](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/index.js#L14-L25)

一次判定和提示。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx) {
  const wsl = detectWsl();
  const distro = distroName();

  ctx.systemPrompt.section({
    name: "tool:path_convert",
    order: 119,
    text: [
      "Use path_convert to translate between Linux (/home, /mnt/c) and Windows (C:\\, \\\\wsl$\\) paths.",
      "Prefer Linux home for git/npm; treat /mnt/c as Windows NTFS with CRLF and permission caveats — pair with mnt_doctor / encoding_doctor.",
    ].join(" "),
  });
```

</details>

**依据 3 · 源码核查**：[index.js:62-94](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/index.js#L62-L94)

auto与转换分发。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const input = String(args?.path ?? "").trim();
      let direction = args?.direction === "toWindows" || args?.direction === "toLinux"
        ? args.direction
        : "auto";
      if (direction === "auto") {
        direction = /^[a-zA-Z]:[\\/]/.test(input) || /^\\\\/.test(input) ? "toLinux" : "toWindows";
      }
      if (direction === "toWindows") {
        const r = toWindowsPath(input, { distro });
        if (!r.ok) return r;
        return {
          ok: true,
          direction,
          kind: r.kind,
          input,
          output: r.windows,
          tags: pathTags(input),
          advice: adviceFor(r.kind, direction, { input, output: r.windows }),
        };
      }
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
      };
```

</details>

**依据 4 · 源码核查**：[lib/path.js:8-47](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/path.js#L8-L47)

映射规则。

<details>
<summary>查看原文（40行）</summary>

```text
export function toWindowsPath(linuxPath, { distro = distroName() } = {}) {
  const normalized = String(linuxPath || "").trim().replace(/\\/g, "/");
  if (!normalized.startsWith("/")) return { ok: false, error: "linux path must be absolute" };

  const mnt = normalized.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mnt) {
    const rest = mnt[2].replace(/\//g, "\\");
    return { ok: true, windows: `${mnt[1].toUpperCase()}:\\${rest}`, kind: "drvfs" };
  }
  const mntRoot = normalized.match(/^\/mnt\/([a-zA-Z])\/?$/);
  if (mntRoot) {
    return { ok: true, windows: `${mntRoot[1].toUpperCase()}:\\`, kind: "drvfs" };
  }
  const trimmed = normalized.replace(/^\//, "").replace(/\//g, "\\");
  return { ok: true, windows: `\\\\wsl$\\${distro}\\${trimmed}`, kind: "wsl$" };
}

export function toLinuxPath(windowsPath, { distro = distroName() } = {}) {
  const raw = String(windowsPath || "").trim();
  if (!raw) return { ok: false, error: "empty windows path" };

  const drive = raw.match(/^([a-zA-Z]):[\\/]?(.*)$/);
  if (drive) {
    const rest = drive[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return {
      ok: true,
      linux: rest ? `/mnt/${drive[1].toLowerCase()}/${rest}` : `/mnt/${drive[1].toLowerCase()}`,
      kind: "drvfs",
    };
  }

  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
  }

  return { ok: false, error: "unrecognized windows path" };
```

</details>

**依据 5 · 源码核查**：[lib/path.js:50-81](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/path.js#L50-L81)

标签/建议词法。

<details>
<summary>查看原文（32行）</summary>

```text
export function pathTags(linuxOrWinPath) {
  const s = String(linuxOrWinPath || "").replace(/\\/g, "/");
  const tags = [];
  if (/\/mnt\/[a-zA-Z](\/|$)/i.test(s) || /^[a-zA-Z]:\//.test(s)) tags.push("drvfs");
  if (/\/(Desktop|Downloads|Documents)(\/|$)/i.test(s)) tags.push("windows_user_folder");
  if (/\/Users\//i.test(s)) tags.push("windows_users");
  if (/^\/home\//.test(s) || /\\\\wsl/i.test(String(linuxOrWinPath || ""))) tags.push("linux_fs");
  return tags;
}

export function adviceFor(kind, direction, { input = "", output = "" } = {}) {
  const tips = [];
  const tags = pathTags(direction === "toWindows" ? input : output || input);

  if (kind === "drvfs") {
    tips.push("Path is on /mnt/<drive> (Windows NTFS). Prefer not to chmod/chown or run heavy git metadata ops here.");
    tips.push("Line endings may be CRLF; set git core.autocrlf carefully. Use encoding_doctor path=… on .sh files.");
    tips.push("For workspace hygiene run mnt_doctor on this path — prefer cloning under /home.");
  }
  if (kind === "wsl$") {
    tips.push("Path lives on the Linux filesystem (\\\\wsl$\\…). Best place for git, npm, and chmod.");
    if (direction === "toWindows") {
      tips.push("Windows apps open this via \\\\wsl$\\<distro>\\… — Explorer and some editors support it. Chat click-open: dsh-wsl-open.");
    }
  }
  if (tags.includes("windows_user_folder")) {
    tips.push("Desktop/Downloads/Documents: fine to open files with dsh-wsl-open; avoid as the agent git/npm root.");
  }
  if (direction === "toLinux" && kind === "drvfs") {
    tips.push(`Linux form: ${output || "(see output)"} — use this in WSL shells, not C:\\…`);
  }
  return tips;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些路径会变错或丢失身份？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

toLinuxPath解析UNC得到r.distro，但不与当前distro比较；index返回仅r.linux/kind，丢发行版字段。从当前Ubuntu转换`\\wsl$\Debian\home\a`，输出`/home/a`看似当前Ubuntu路径，可能指另一文件。它没有真的跨发行版访问，问题是文本身份被压扁。env缺失而仅内核判WSL时toWindows用字面WSL，也不保证对应可用发行版。

盘符正则允许斜线缺失，所以显式toLinux的C:foo被当/mnt/c/foo，未区分Windows盘符相对路径；auto对同串又走toWindows失败，方向行为不一致。默认/mnt映射未读wsl.conf/挂载表，定制automount或非Windows挂载处不保证正确。函数trim输入会丢合法首尾空格，Linux路径中的反斜线被换为分隔符，不保所有合法文件名。相对路径和常规网络共享UNC不支持，点段/符号链接不realpath，成功只代表规则接受。

SECURITY要求不返回秘密，但工具原样回input/output及目录名，不做secret识别；路径若含敏感标识仍会进入工具结果/会话模型上下文。它不读目标文件内容、不另持久化/外发；不要用“无文件操作”推零披露。注册用raw工具对象/JSONSchema风格，包无宿主peer版本，实际兼容需按目标契约核，不能仅凭README套件兼容矩阵推全部有效。

#### 证据与依据

**依据 1 · 源码核查**：[lib/path.js:25-44](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/path.js#L25-L44)

盘符相对接受/UNC发行版。

<details>
<summary>查看原文（20行）</summary>

```text
export function toLinuxPath(windowsPath, { distro = distroName() } = {}) {
  const raw = String(windowsPath || "").trim();
  if (!raw) return { ok: false, error: "empty windows path" };

  const drive = raw.match(/^([a-zA-Z]):[\\/]?(.*)$/);
  if (drive) {
    const rest = drive[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return {
      ok: true,
      linux: rest ? `/mnt/${drive[1].toLowerCase()}/${rest}` : `/mnt/${drive[1].toLowerCase()}`,
      kind: "drvfs",
    };
  }

  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
```

</details>

**依据 2 · 源码核查**：[index.js:84-94](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/index.js#L84-L94)

工具返回丢distro。

<details>
<summary>查看原文（11行）</summary>

```text
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
      };
```

</details>

**依据 3 · 源码核查**：[lib/path.js:8-22](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/path.js#L8-L22)

trim/反斜线/mnt假设。

<details>
<summary>查看原文（15行）</summary>

```text
export function toWindowsPath(linuxPath, { distro = distroName() } = {}) {
  const normalized = String(linuxPath || "").trim().replace(/\\/g, "/");
  if (!normalized.startsWith("/")) return { ok: false, error: "linux path must be absolute" };

  const mnt = normalized.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mnt) {
    const rest = mnt[2].replace(/\//g, "\\");
    return { ok: true, windows: `${mnt[1].toUpperCase()}:\\${rest}`, kind: "drvfs" };
  }
  const mntRoot = normalized.match(/^\/mnt\/([a-zA-Z])\/?$/);
  if (mntRoot) {
    return { ok: true, windows: `${mntRoot[1].toUpperCase()}:\\`, kind: "drvfs" };
  }
  const trimmed = normalized.replace(/^\//, "").replace(/\//g, "\\");
  return { ok: true, windows: `\\\\wsl$\\${distro}\\${trimmed}`, kind: "wsl$" };
```

</details>

**依据 4 · 源码核查**：[index.js:27-42](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/index.js#L27-L42)

raw参数注册。

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.tools.register({
    name: "path_convert",
    description: "Convert paths between WSL Linux and Windows forms and explain /mnt/c vs \\\\wsl$ caveats.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: { type: "string", description: "Absolute Linux or Windows path." },
        direction: {
          type: "string",
          enum: ["auto", "toWindows", "toLinux"],
          description: "Default auto: detect by looking for drive letter or UNC vs leading /.",
        },
      },
    },
```

</details>

**依据 5 · 作者声明**：[SECURITY.md:1-5](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/SECURITY.md#L1-L5)

作者不返回秘密要求。

```text
# Security

`dsh-wsl-path` must not log, print, or return secrets (tokens, passwords, PEM keys).

Report issues via GitHub Issues on this repository.
```

#### 缺口

- 定制挂载、跨发行版/特殊文件名与目标宿主注册契约未作系统矩阵核对。
  **影响**：不承诺文本roundtrip等于物理同文件或全宿主可用。
  **进一步探讨**：用固定无秘密路径矩阵与挂载元数据mock核身份/不可表示情况，先静态对宿主schema，不执行文件打开/转换命令。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何启动使用，成本与效果是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18和DSH tools/systemPrompt | ESM/注册与指引 | package无精确宿主peer，套件矩阵为作者外部声明 |
| 实际WSL且发行版env可信 | 工具启用与UNC名称 | 无env退WSL不是探测真实名称 |
| 默认/mnt卷映射与同发行版 | 规则成立 | 定制挂载/跨distro需额外核 |
| 可披露路径文本 | 参数/结果给模型 | 不读内容也可能暴露用户名/目录 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主注册/WSL env | 非WSL返回明确错误 |
| 输入 | 明确绝对路径和目标方向 | 避免C:foo/非支持UNC/特殊名 |
| 核身份 | 对照发行版/卷根与输出 | 跨distro不把/home误当当前文件 |
| 下游使用 | 先确认存在/权限再交其他工具 | ok仅字符串映射，无打开授权 |
| 维护 | 核mount和发行版变化 | apply缓存需重载才能更新 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地小包/环境字符串与内核release读取 | 核WSL/发行版/挂载/宿主schema | 工时和金额未知 |
| 持续使用 | 字符串转换/提示与tool上下文 | 核目标身份和提示适用 | 无独立模型/网络/目标文件读取，不等总token费0 |
| 失败恢复 | 重转文本，无目标文件回滚 | 纠正错distro/挂载/特殊名，复核下游动作 | 工具自身无写副作用，但下游用错路径的恢复另计且未知 |

#### 效果

| 目标 | 增量 | 边界 |
| --- | --- | --- |
| 少手改路径 | 盘符/WSL UNC文字映射 | 非全文件名/定制挂载 |
| 少FS混用 | tags/advice | 词法提示非真实诊断 |
| 低副作用 | 不执行开文件/命令 | 输出路径仍有隐私/下游风险 |

作者测试只有几个常规正例/tag提示，不覆盖跨distro/特殊路径与物理同文件；本轮只读，不运行测试或Windows调用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-22](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/package.json#L14-L22)

Node/包和测试。

```text
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/path.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.zh.md", "LICENSE",
    "CHANGELOG.md",
    "CONTRIBUTING.md"],
  "keywords": ["dsh-plugin", "deepseek-harness", "wsl", "path"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

**依据 2 · 源码核查**：[index.js:11-25](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/index.js#L11-L25)

工具/提示依赖。

<details>
<summary>查看原文（15行）</summary>

```text
export const name = "dsh-wsl-path";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx) {
  const wsl = detectWsl();
  const distro = distroName();

  ctx.systemPrompt.section({
    name: "tool:path_convert",
    order: 119,
    text: [
      "Use path_convert to translate between Linux (/home, /mnt/c) and Windows (C:\\, \\\\wsl$\\) paths.",
      "Prefer Linux home for git/npm; treat /mnt/c as Windows NTFS with CRLF and permission caveats — pair with mnt_doctor / encoding_doctor.",
    ].join(" "),
  });
```

</details>

**依据 3 · 源码核查**：[test/path.test.js:5-25](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/test/path.test.js#L5-L25)

作者常规测试设计。

<details>
<summary>查看原文（21行）</summary>

```text
describe("path_convert", () => {
  it("maps /mnt/c and linux home", () => {
    assert.equal(toWindowsPath("/mnt/c/Users/a", { distro: "Ubuntu" }).windows, "C:\\Users\\a");
    assert.equal(
      toWindowsPath("/home/a/x", { distro: "Ubuntu-24.04" }).windows,
      "\\\\wsl$\\Ubuntu-24.04\\home\\a\\x",
    );
  });

  it("maps Windows drive and UNC back", () => {
    assert.equal(toLinuxPath("C:\\Users\\a").linux, "/mnt/c/Users/a");
    assert.equal(toLinuxPath("\\\\wsl$\\Ubuntu\\home\\a").linux, "/home/a");
    assert.equal(toLinuxPath("\\\\wsl.localhost\\Ubuntu-24.04\\home\\a").linux, "/home/a");
  });

  it("tags Desktop on drvfs and points to mnt_doctor", () => {
    const tags = pathTags("/mnt/c/Users/a/Desktop/proj");
    assert.ok(tags.includes("windows_user_folder"));
    const tips = adviceFor("drvfs", "toWindows", { input: "/mnt/c/Users/a/Desktop/proj" });
    assert.ok(tips.some((t) => /mnt_doctor/i.test(t)));
    assert.ok(tips.some((t) => /encoding_doctor/i.test(t)));
```

</details>

**依据 4 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/wsl-host.js#L21-L27)

实际读取边界。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

#### 缺口

- 与手工/wslpath的误转率、人工步骤与上下文成本未比较。
  **影响**：不量化省时或可靠性提升。
  **进一步探讨**：固定路径/挂载身份样本，比较可表示率与错误目标，记录人工核对，不执行目标文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 推荐结论与可继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。适合默认/mnt、同发行版、常规绝对路径的个人WSL用户，工具无目标文件写/命令副作用，输出易人工对照。多发行版/定制mount/特殊文件名先观察，不把ok当可访问路径或自动授权其他文件动作。

由UNC发行版在helper里存在却被工具丢弃，以及默认卷路径假设，可推导“显式身份/映射来源的转换收据”。输出保sourceDistro/targetDistro、卷映射来源与可表示状态；跨distro不静默降为当前Linux绝对路径，盘符相对/特殊名拒绝或标不支持。可选只读挂载元数据提高映射依据，但仍不做目标打开。

未实现。反例是符号链接/动态mount令语法roundtrip成立但物理文件不同；不能因加收据就承诺同文件。最小对照含跨distroUNC、env缺失、C:foo、定制挂载、空格/反斜线文件名。若身份仍丢/不支持却ok，假设失败；若元数据探测增加披露与延迟却不降误转，净收益也不成立。判据为明确可表示/身份，而非仅输出字符串相似。

#### 证据与依据

**依据 1 · 源码核查**：[lib/path.js:25-44](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/path.js#L25-L44)

保发行版收据基线。

<details>
<summary>查看原文（20行）</summary>

```text
export function toLinuxPath(windowsPath, { distro = distroName() } = {}) {
  const raw = String(windowsPath || "").trim();
  if (!raw) return { ok: false, error: "empty windows path" };

  const drive = raw.match(/^([a-zA-Z]):[\\/]?(.*)$/);
  if (drive) {
    const rest = drive[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return {
      ok: true,
      linux: rest ? `/mnt/${drive[1].toLowerCase()}/${rest}` : `/mnt/${drive[1].toLowerCase()}`,
      kind: "drvfs",
    };
  }

  // \\wsl$\Distro\... or \\wsl.localhost\Distro\...
  const unc = raw.match(/^\\\\wsl(?:\$|\.localhost)\\([^\\/]+)[\\/]?(.*)$/i);
  if (unc) {
    const name = unc[1];
    const rest = unc[2].replace(/\\/g, "/").replace(/^\/+/, "");
    return { ok: true, linux: rest ? `/${rest}` : "/", kind: "wsl$", distro: name };
```

</details>

**依据 2 · 源码核查**：[index.js:84-94](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/index.js#L84-L94)

工具丢身份基线。

<details>
<summary>查看原文（11行）</summary>

```text
      const r = toLinuxPath(input, { distro });
      if (!r.ok) return r;
      return {
        ok: true,
        direction,
        kind: r.kind,
        input,
        output: r.linux,
        tags: pathTags(r.linux),
        advice: adviceFor(r.kind, direction, { input, output: r.linux }),
      };
```

</details>

**依据 3 · 源码核查**：[lib/path.js:8-22](https://github.com/173787247/dsh-wsl-path/blob/e82233f94e1d77c35657e06bfd032a03e353e3ba/lib/path.js#L8-L22)

映射来源基线。

<details>
<summary>查看原文（15行）</summary>

```text
export function toWindowsPath(linuxPath, { distro = distroName() } = {}) {
  const normalized = String(linuxPath || "").trim().replace(/\\/g, "/");
  if (!normalized.startsWith("/")) return { ok: false, error: "linux path must be absolute" };

  const mnt = normalized.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mnt) {
    const rest = mnt[2].replace(/\//g, "\\");
    return { ok: true, windows: `${mnt[1].toUpperCase()}:\\${rest}`, kind: "drvfs" };
  }
  const mntRoot = normalized.match(/^\/mnt\/([a-zA-Z])\/?$/);
  if (mntRoot) {
    return { ok: true, windows: `${mntRoot[1].toUpperCase()}:\\`, kind: "drvfs" };
  }
  const trimmed = normalized.replace(/^\//, "").replace(/\//g, "\\");
  return { ok: true, windows: `\\\\wsl$\\${distro}\\${trimmed}`, kind: "wsl$" };
```

</details>

#### 缺口

- 身份/挂载来源收据方案未实现。
  **影响**：不计现有身份保真或创新优势。
  **进一步探讨**：固定mock矩阵比较错误拒绝/误指目标和元数据成本，不执行文件动作。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
