# DSH Beauty Skins

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[28e4e38](https://github.com/XieRW/dsh-beauty-skins/tree/28e4e38e99c8f8636f3d220891816a0899a93084)

<!-- BEGIN META -->
[![GitHub ★ 101](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=101&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/XieRW/dsh-beauty-skins)
<!-- END META -->

> **功能**：从壁纸提取配色并替换宿主主题源码

> **亮点**：[Q01](#research-q01) 集中管理壁纸与配色。

> **主要限制**：[Q03](#research-q03) 源码覆盖和版本冲突带来恢复成本。

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
  - [Q01 · 用户得到什么？](#detail-section-11)
  - [Q02 · 安装机制？](#detail-section-12)
  - [Q03 · 主要限制？](#detail-section-13)
  - [Q04 · 采用退出成本？](#detail-section-14)
  - [Q05 · 怎样验证价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户定制 DSH 壁纸和配色。

内置主题。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 内置主题。 | 可直接比较 | 保留人工步骤 |
| DSH Beauty Skins | 集中管理壁纸与配色。 | 源码覆盖和版本冲突带来恢复成本。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 覆盖主题源码并应用宿主补丁。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 个人用户定制 DSH 壁纸和配色。 | 保留原流程 |
| 试验 | 覆盖主题源码并应用宿主补丁。 | 观察固定版本 |
| 复核 | 仅在可备份源码环境验证冲突和恢复。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在自选壁纸下维持输入和阅读可用 | 可在保留操作可用时满足个性化需求。 | 仅在可备份源码环境验证冲突和恢复。 |

> **思考**：[Q03](#research-q03) 源码覆盖和版本冲突带来恢复成本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中管理壁纸与配色。

提供备份与恢复脚本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 源码覆盖和版本冲突带来恢复成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在可备份源码环境验证冲突和恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在自选壁纸下维持输入和阅读可用。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/install.sh、scripts/uninstall.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在自选壁纸下维持输入和阅读可用。未执行目标代码或实际宿主验证。
- 下一步：保留文件摘要与任务时间。

**分析版本**

- **仓库**：[XieRW/dsh-beauty-skins](https://github.com/XieRW/dsh-beauty-skins)
- **版本号**：未声明（[固定提交 28e4e38](https://github.com/XieRW/dsh-beauty-skins/tree/28e4e38e99c8f8636f3d220891816a0899a93084)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可在保留操作可用时满足个性化需求。

保留文件摘要与任务时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 316 | — | — | 4683 |
| .mjs | source | 2 | 277 | 179 | 73 | — |
| .ts | source | 26 | 4121 | 2340 | 1495 | — |
| .tsx | source | 1 | 394 | 310 | 60 | — |
| .tsx | test | 2 | 555 | 461 | 41 | — |
| .ts | test | 17 | 3277 | 2590 | 392 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/XieRW/dsh-beauty-skins/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在自选壁纸下维持输入和阅读可用

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户选择壁纸并获得相应配色，可含动态背景。相对默认主题，验收以选图、对比度和原生操作可达为准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-16](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/README.md#L5-L16)

作者描述壁纸、配色及素材归属

<details>
<summary>查看原文（12行）</summary>

```text
给 DeepSeek Harness 用的**美女系列**皮肤：设置里从 [哲风壁纸](https://haowallpaper.com/homeView?page=1&lbName=%E7%BE%8E%E5%A5%B3&sortType=3&rows=9&wpType=3,4) 拉预览网格，点一张即应用，配色从壁纸提取。支持动态壁纸，也保留自定义选图。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Repo](https://img.shields.io/badge/repo-dsh--beauty--skins-111827)
![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.1.0--rc.7-4D6BFE)
![Skins](https://img.shields.io/badge/skins-catalog%20wallpapers-c8447e)
[![dsh.so security](https://www.dsh.so/badge/dsh-beauty-skins.svg)](https://www.dsh.so/artifact/dsh-beauty-skins)
[![dsh.so install](https://www.dsh.so/badge/install/dsh-beauty-skins.svg)](https://www.dsh.so/artifact/dsh-beauty-skins)

[快速开始](#快速开始) · [长这样](#长这样) · [怎么选](#怎么选) · [English](README.en.md)

本仓库基于 HeiGeAi 的皮肤系统改写，与 DeepSeek 官方无隶属关系。壁纸来自 [哲风壁纸](https://haowallpaper.com)，版权归原站及作者。
```

</details>

#### 缺口

- 图像喜好和可读性不同。
  **影响**：提供个性化外观。
  **进一步探讨**：检查长文和窄屏。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装机制？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

脚本先备份 ui-theme 和指定宿主文件，再覆盖主题包并打宿主集成补丁，要求重新安装依赖和构建。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/install.sh:36-63](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/scripts/install.sh#L36-L63)

备份和覆盖

<details>
<summary>查看原文（28行）</summary>

```text
else
  STAMP="$(date +%Y%m%d-%H%M%S)"
  BACKUP="$HOME/.dsh-skin-backups/$STAMP"
  mkdir -p "$BACKUP/packages/client"
  cp -R "$TARGET/packages/client/ui-theme" "$BACKUP/packages/client/ui-theme"
  while IFS= read -r rel; do
    mkdir -p "$BACKUP/$(dirname "$rel")"
    cp "$TARGET/$rel" "$BACKUP/$rel"
  done < "$HERE/scripts/patched-files.txt"
  printf '%s\n' "$TARGET" > "$BACKUP/.target"
  ok "已备份到 $BACKUP"
fi

# 2. 覆盖 ui-theme 包（Windows Git Bash 往往没有 rsync）
copy_theme() {
  local src="$1" dest="$2"
  mkdir -p "$dest"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude 'node_modules' --exclude 'dist' --exclude 'lib' "$src/" "$dest/"
    return
  fi
  (cd "$src" && tar -cf - --exclude=node_modules --exclude=dist --exclude=lib .) \
    | (cd "$dest" && tar -xf -)
}

copy_theme "$HERE/tree/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
node "$HERE/scripts/pin-theme-version.mjs" "$TARGET/packages/client/ui-theme/package.json" "$HOST_VER"
ok "已写入 ui-theme 皮肤包（壁纸目录 + 自定义皮肤 + 更新检查）"
```

</details>

**依据 2 · 源码核查**：[scripts/install.sh:65-87](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/scripts/install.sh#L65-L87)

打补丁与构建提示

<details>
<summary>查看原文（23行）</summary>

```text
# 3. 打宿主集成补丁（背景层、标题栏挂钩、消息气泡、皮肤 CSS 入口）
cd "$TARGET"
PATCH="$HERE/patches/host-integration.patch"
if git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  if git apply --check "$PATCH" 2>/dev/null; then
    git apply "$PATCH"
    ok "已打宿主集成补丁"
  elif git apply --check --reverse "$PATCH" 2>/dev/null; then
    ok "宿主集成补丁已在，跳过"
  else
    die "补丁打不上。你的 deepseek-harness 版本可能和本皮肤包不匹配（本包基于 ${BASELINE}），请手工比对 patches/host-integration.patch"
  fi
else
  patch -p1 --forward --silent < "$PATCH" \
    || die "补丁打不上，请手工比对 patches/host-integration.patch"
  ok "已打宿主集成补丁"
fi

printf '\n\033[1m接下来手动跑这三条\033[0m\n'
say "cd $TARGET"
say "pnpm install"
say "pnpm run build"
say "pnpm dsh web"
```

</details>

#### 缺口

- 部分失败可能发生在覆盖后。
  **影响**：适配依赖源码布局。
  **进一步探讨**：在测试 checkout 记录全过程差异。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 主要限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

补丁冲突会报错，且动作发生在先覆盖后打补丁。恢复需要未带皮肤的较早备份，不能用任意最新备份。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/install.sh:61-79](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/scripts/install.sh#L61-L79)

覆盖后检查补丁

<details>
<summary>查看原文（19行）</summary>

```text
copy_theme "$HERE/tree/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
node "$HERE/scripts/pin-theme-version.mjs" "$TARGET/packages/client/ui-theme/package.json" "$HOST_VER"
ok "已写入 ui-theme 皮肤包（壁纸目录 + 自定义皮肤 + 更新检查）"

# 3. 打宿主集成补丁（背景层、标题栏挂钩、消息气泡、皮肤 CSS 入口）
cd "$TARGET"
PATCH="$HERE/patches/host-integration.patch"
if git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  if git apply --check "$PATCH" 2>/dev/null; then
    git apply "$PATCH"
    ok "已打宿主集成补丁"
  elif git apply --check --reverse "$PATCH" 2>/dev/null; then
    ok "宿主集成补丁已在，跳过"
  else
    die "补丁打不上。你的 deepseek-harness 版本可能和本皮肤包不匹配（本包基于 ${BASELINE}），请手工比对 patches/host-integration.patch"
  fi
else
  patch -p1 --forward --silent < "$PATCH" \
    || die "补丁打不上，请手工比对 patches/host-integration.patch"
```

</details>

**依据 2 · 源码核查**：[scripts/uninstall.sh:36-51](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/scripts/uninstall.sh#L36-L51)

拒绝带皮肤备份并覆盖还原

<details>
<summary>查看原文（16行）</summary>

```text
# 备份本身带皮肤就说明它记录的是「装过之后」的状态，还原它等于没卸载
[ -f "$BACKUP/packages/client/ui-theme/src/skin-version.ts" ] \
  && die "这份备份里已经含皮肤（$BACKUP），还原它退不回原生。请指定更早的时间戳：ls $ROOT"

printf '\n\033[1mDeepSeek Harness Skin 卸载\033[0m\n'
say "目标仓库：$TARGET"
say "还原自：$BACKUP"

rm -rf "$TARGET/packages/client/ui-theme"
cp -R "$BACKUP/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
ok "已还原 ui-theme 包"

while IFS= read -r rel; do
  [ -f "$BACKUP/$rel" ] || continue
  cp "$BACKUP/$rel" "$TARGET/$rel"
done < "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/patched-files.txt"
```

</details>

#### 缺口

- 源码本地修改可能被恢复文件覆盖。
  **影响**：退出需确认备份对应版本。
  **进一步探讨**：先构造补丁冲突。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需宿主源码、依赖构建及备份空间，维护随宿主升级。退出按备份恢复并重建，自定义图片仍留本机目录。素材许可应按原站与作者声明另核。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/uninstall.sh:44-57](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/scripts/uninstall.sh#L44-L57)

恢复、重建与图片留存

<details>
<summary>查看原文（14行）</summary>

```text
rm -rf "$TARGET/packages/client/ui-theme"
cp -R "$BACKUP/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
ok "已还原 ui-theme 包"

while IFS= read -r rel; do
  [ -f "$BACKUP/$rel" ] || continue
  cp "$BACKUP/$rel" "$TARGET/$rel"
done < "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/patched-files.txt"
ok "已还原宿主集成补丁涉及的 8 个文件"

printf '\n\033[1m接下来手动跑这两条\033[0m\n'
say "cd $TARGET"
say "pnpm install && pnpm run build"
printf '\n本机上传过的自定义背景图仍留在 ~/.dsh/skins/，不用可以自行删除。\n\n'
```

</details>

**依据 2 · 作者声明**：[README.md:14-16](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/README.md#L14-L16)

第三方壁纸归属

```text
[快速开始](#快速开始) · [长这样](#长这样) · [怎么选](#怎么选) · [English](README.en.md)

本仓库基于 HeiGeAi 的皮肤系统改写，与 DeepSeek 官方无隶属关系。壁纸来自 [哲风壁纸](https://haowallpaper.com)，版权归原站及作者。
```

#### 缺口

- 壁纸服务和版本兼容未实测。
  **影响**：部署比单一 bundle 更重。
  **进一步探讨**：固定宿主及原文件摘要。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证价值？

**研究主题**：新假设与验证

#### 完整回答

同尺寸对比默认、静态和动态主题，测阅读、键盘和内存，卸载后对账原文件。若补丁失败未恢复或关键控件遮挡则不适合当前宿主。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/install.sh:65-87](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/scripts/install.sh#L65-L87)

宿主补丁边界

<details>
<summary>查看原文（23行）</summary>

```text
# 3. 打宿主集成补丁（背景层、标题栏挂钩、消息气泡、皮肤 CSS 入口）
cd "$TARGET"
PATCH="$HERE/patches/host-integration.patch"
if git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  if git apply --check "$PATCH" 2>/dev/null; then
    git apply "$PATCH"
    ok "已打宿主集成补丁"
  elif git apply --check --reverse "$PATCH" 2>/dev/null; then
    ok "宿主集成补丁已在，跳过"
  else
    die "补丁打不上。你的 deepseek-harness 版本可能和本皮肤包不匹配（本包基于 ${BASELINE}），请手工比对 patches/host-integration.patch"
  fi
else
  patch -p1 --forward --silent < "$PATCH" \
    || die "补丁打不上，请手工比对 patches/host-integration.patch"
  ok "已打宿主集成补丁"
fi

printf '\n\033[1m接下来手动跑这三条\033[0m\n'
say "cd $TARGET"
say "pnpm install"
say "pnpm run build"
say "pnpm dsh web"
```

</details>

**依据 2 · 源码核查**：[scripts/uninstall.sh:44-57](https://github.com/XieRW/dsh-beauty-skins/blob/28e4e38e99c8f8636f3d220891816a0899a93084/scripts/uninstall.sh#L44-L57)

退出对照路径

<details>
<summary>查看原文（14行）</summary>

```text
rm -rf "$TARGET/packages/client/ui-theme"
cp -R "$BACKUP/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
ok "已还原 ui-theme 包"

while IFS= read -r rel; do
  [ -f "$BACKUP/$rel" ] || continue
  cp "$BACKUP/$rel" "$TARGET/$rel"
done < "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/patched-files.txt"
ok "已还原宿主集成补丁涉及的 8 个文件"

printf '\n\033[1m接下来手动跑这两条\033[0m\n'
say "cd $TARGET"
say "pnpm install && pnpm run build"
printf '\n本机上传过的自定义背景图仍留在 ~/.dsh/skins/，不用可以自行删除。\n\n'
```

</details>

#### 缺口

- 暂无浏览器测试。
  **影响**：可量化外观收益和维护负担。
  **进一步探讨**：保留文件摘要与任务时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
