# uiskin-theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a355a9b](https://github.com/chouxiaohuai/dsh-uiskin-theme/tree/a355a9b16ba692b7551ffac0a6a6a9fea1149e49)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chouxiaohuai/dsh-uiskin-theme)
<!-- END META -->

> **功能**：DSH Web海洋视觉皮肤，注入主题token、内联图片、样式和明暗开关。

> **亮点**：[Q02](#research-q02)海洋视觉、内联图片及就近明暗切换接线。

> **主要限制**：[Q01](#research-q01)仅个人原样许可；[Q03](#research-q03)hash/末尾样式竞争/重建侧栏与可读性未知。

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
  - [Q01 · 海洋皮肤给谁什么增量，分发许可是什么？](#detail-section-11)
  - [Q02 · 浏览器实际改什么，明暗偏好怎样保存？](#detail-section-12)
  - [Q03 · 思考计时和兼容/失败路径有何边界？](#detail-section-13)
  - [Q04 · 个人场景值得试到哪步，下一方向怎样证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：uiskin-theme1.1.0是DSH Web原生静态profile bundle，仓库名dsh-uiskin-theme与包名uiskin-theme不同；Host apply空实现，视觉行为在浏览器。针对偏好海洋/玻璃/角色装饰的个人使用者，基线是原生明暗主题或少量局部CSS；成功是可读、控件不被遮挡和切换保持，不是模型更好/完成更快。

package license=UNLICENSED，README作者明确保留所有权利、仅个人原样安装，复制修改再分发和商业使用需书面许可；本轮只报告作者条款未作授权结论，不能作为开源可复用素材/生产皮肤推荐。README开发章节教改模板并不能覆盖前述限制。依赖React/Cordis及Host runtime/theme/slots；README定位DSH0.1.5-rc.1且承认class hash变化，当前Host兼容未知，不依作者“自动加载无需批准”推一般权限安全。

原生DSH主题/少量局部CSS，个人审美与控件可达性实测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 样式 | 视觉替换 | hash/可读性未验 |
| 开关 | Host主题选择 | 持久继承服务 |
| 计时显示 | 现有数字着色 | 非新测量 |
| 清理 | 撤style/observer | 不还原已选Host主题 |

**流程与依赖**

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH Web/theme/slots | 必需 | 载入/开关 | 预发布兼容未知 |
| React/Cordis | peer | UI组件 | 目标Host未运行 |
| 原样个人使用许可 | 前提 | 作者允许范围 | 商业/衍生另核 |

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 个人副本/核版本许可 | 不商业复用 |
| 样例 | 浅深/键盘/窄屏 | 核菜单/输入 |
| 退出 | 移除/还原Host主题 | 不改业务数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/网络未知 | 许可/版本核对 | 未安装 |
| 持续 | 图片/内存/observer未知 | 升级维护 | 无性能实测 |
| 故障 | 恢复资源未知 | 禁用/还原主题 | 无业务回滚 |
| 退出 | 留profile成本未知 | 移除/检查偏好 | 原主题需手动恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 视觉 | 真CSS/token | 审美/可读性 |
| 明暗 | 真setTheme | 重启持久成功 |
| 计时 | 真现有元素着色 | 测量准确性 |

> **思考**：[Q01](#research-q01)仅个人原样许可；[Q03](#research-q03)hash/末尾样式竞争/重建侧栏与可读性未知。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)海洋视觉、内联图片及就近明暗切换接线。

[Q02](#research-q02)effect移除style/observer；[Q03](#research-q03)hash/层叠与一次sticker引用限制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01)仅个人原样许可；[Q03](#research-q03)hash/末尾样式竞争/重建侧栏与可读性未知。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)仅个人受限试用，核控件/明暗/卸载；异常恢复原生，复用须核许可。

package license=UNLICENSED，README作者明确保留所有权利、仅个人原样安装，复制修改再分发和商业使用需书面许可；本轮只报告作者条款未作授权结论，不能作为开源可复用素材/生产皮肤推荐。README开发章节教改模板并不能覆盖前述限制。依赖React/Cordis及Host runtime/theme/slots；README定位DSH0.1.5-rc.1且承认class hash变化，当前Host兼容未知，不依作者“自动加载无需批准”推一般权限安全。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

真实皮肤/开关接线可追，许可与Host兼容限制明确，仅个人受限试用。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/index.js、package.json、scripts/build-client.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项source；核包/patch/Host空实现、实际client token/CSS/内联/slot/theme切换、Host计时样式/observer与卸载、构建脚本；未运行视觉/性能/Host所有版本，未全核图片权属。
- 下一步：只读固定源码；未安装运行目标/构建/测试/浏览器/Host，无独立可读性/兼容/性能或费用验证。

**分析版本**

- **仓库**：[chouxiaohuai/dsh-uiskin-theme](https://github.com/chouxiaohuai/dsh-uiskin-theme)
- **版本号**：1.1.0（[固定提交 a355a9b](https://github.com/chouxiaohuai/dsh-uiskin-theme/tree/a355a9b16ba692b7551ffac0a6a6a9fea1149e49)）
- **版本日期**：2026-09-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)优先验证官方token/slot与可达性保障，比新增装饰/强制层叠更稳定。

只读固定源码；未安装运行目标/构建/测试/浏览器/Host，无独立可读性/兼容/性能或费用验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1008 | 688 | 271 | — |
| .md | source | 1 | 97 | — | — | 1370 |
| .mjs | source | 1 | 46 | 36 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/chouxiaohuai/dsh-uiskin-theme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/chouxiaohuai/dsh-uiskin-theme/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/chouxiaohuai/dsh-uiskin-theme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核皮肤真正浏览器副作用与Host继承能力、许可/兼容/清理，分开审美便利和业务创新，形成个人采用与可证伪方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 海洋皮肤给谁什么增量，分发许可是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

uiskin-theme1.1.0是DSH Web原生静态profile bundle，仓库名dsh-uiskin-theme与包名uiskin-theme不同；Host apply空实现，视觉行为在浏览器。针对偏好海洋/玻璃/角色装饰的个人使用者，基线是原生明暗主题或少量局部CSS；成功是可读、控件不被遮挡和切换保持，不是模型更好/完成更快。

package license=UNLICENSED，README作者明确保留所有权利、仅个人原样安装，复制修改再分发和商业使用需书面许可；本轮只报告作者条款未作授权结论，不能作为开源可复用素材/生产皮肤推荐。README开发章节教改模板并不能覆盖前述限制。依赖React/Cordis及Host runtime/theme/slots；README定位DSH0.1.5-rc.1且承认class hash变化，当前Host兼容未知，不依作者“自动加载无需批准”推一般权限安全。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-11](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/package.json#L1-L11)

真实包名/版本/导出。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "uiskin-theme",
  "version": "1.1.0",
  "description": "Blue Glass Theme (ocean fantasy) for DeepSeek Harness Web — a static profile bundle. 海洋幻想主题：海洋背景、玻璃气泡、海洋侧边栏、鲸鱼设置按钮、炫彩模型文字。",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:21-41](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/package.json#L21-L41)

peer/客户端/UNLICENSED声明。

<details>
<summary>查看原文（21行）</summary>

```text
  "dependencies": {},
  "peerDependencies": {
    "react": "^18.2.0",
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-slots"
      ]
    }
  },
  "license": "UNLICENSED"
}
```

</details>

**依据 3 · 作者声明**：[README.md:15-20](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/README.md#L15-L20)

作者个人原样使用/保留权利条款。

```text
> **License / 许可证**
> This theme is an original work and is **All Rights Reserved** — it is NOT open source.
> Without written permission from the author, you may not copy, modify, redistribute, create derivative works, or use it commercially; it may only be installed as-is and used personally.
>
> 本主题为原创作品，**保留所有权利（All Rights Reserved）**，非开源协议。
> 未经作者书面许可，不得复制、修改、再分发、二次创作或用于商业用途；仅允许按原样安装与个人使用。
```

**依据 4 · 作者声明**：[README.md:85-91](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/README.md#L85-L91)

作者内联体积和预发布兼容边界。

```text
## Notes / 注意事项

- Assets are inlined as base64 into `lib/client.js` (~1.1 MB) and loaded once, suitable for small skin images. To shrink it, compress the images under `assets/` first and rebuild.
  - 素材以 base64 内联在 `lib/client.js`（约 1.1 MB），加载一次即可，适合皮肤类小图片。若想更小，可先把 `assets/` 里的图压缩再构建。
- DSH is currently a `0.1.5-rc.1` pre-release; the plugin API (`dsh.bundle` / `dsh.client` / slots / theme services) and some client class names may change between releases. When upgrading DSH, a few theme elements (bubbles, sidebar) can briefly lose styling if their CSS class hashes change — this theme tracks those renames and adds the matching selectors. If you hit compatibility issues after upgrading DSH, watch this repo's updates.
  - DSH 目前是 `0.1.5-rc.1` 预发布版本，插件 API（`dsh.bundle` / `dsh.client` / slots / theme 服务）及部分客户端类名可能随版本变化。升级 DSH 后，个别主题元素（气泡、侧栏）可能因类名 hash 变化而暂时失去样式——本主题会跟踪这些改名并补充对应选择器；如升级后遇兼容问题，关注本仓库的更新。
- This package only depends on `@deepseek-ai/cordis` (peer) and `react` (peer); no `allowBuilds` approval is needed to run its build scripts.
```

**依据 5 · 源码核查**：[lib/index.js:1-12](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/index.js#L1-L12)

Host真实空apply。

<details>
<summary>查看原文（12行）</summary>

```text
// uiskin-theme — Host half (static profile bundle).
// The whole skin lives in the client half (lib/client.js, served as
// /plugins/uiskin-theme/client.js). This host half exists so the Loader row
// can import the package and activate it; it intentionally does nothing.
export const name = "uiskin-theme";

export function apply() {
  // No host-side work: all assets are inlined into the client bundle, so
  // there is nothing to read from disk or serve over RPC.
}

export const inject = [];
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/cordis.patch.yml#L1-L7)

真实profile加载行。

```text
# uiskin-theme bundle patch — one inserted row, loaded at boot like any web row.
# The loader imports `uiskin-theme` (host half, lib/index.js); the modules
# node half sees the package's `dsh.client` declaration and serves
# /plugins/uiskin-theme/client.js to the browser.
- insert:
    - id: uiskin-theme
      name: uiskin-theme
```

#### 缺口

- 真实偏好/可读性/兼容、全部素材授权范围与体验未独立验证。
  **影响**：仅个人试用，不外推商业/再分发或模型效果。
  **进一步探讨**：低敏个人profile核Host版本/控件可见，超个人原样范围先取得作者许可。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览器实际改什么，明暗偏好怎样保存？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

客户端effect overrideTokens后注入多段CSS/内联图片变量，注册settings.trigger鲸鱼图、sidebar.footer.action装饰与header.utilities明暗按钮；它没有模型请求或文件工具。图片由构建脚本读assets替换模板占位为data URI并写lib/client.js，缺图/未解占位直接exit；安装使用已打包客户端，不应运行构建来证明视觉正确。

明暗按钮读theme.getTheme并订阅theme/change，点击真实调用Host theme.setTheme；该服务是否成功写用户设置属于外部实现，本包不等待/处理失败回执，不能独立保证重启持久。theme缺失fallback只切body属性，不写存储；声明inject theme的正常loader是否允许缺失未知，fallback代码存在不等可用。卸载effect撤token/style并断observer，React事件订阅return off；已设置Host用户主题不会因卸载自动还原。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:20-28](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L20-L28)

真实style创建/卸载remove。

```text
    // twin of the dynamic runner's `styles.insert`).
    function insertStyle(css) {
      const tag = document.createElement("style");
      tag.setAttribute("data-plugin-css", "uiskin-theme");
      tag.textContent = css;
      document.head.appendChild(tag);
      return () => { tag.remove() };
    }

```

**依据 2 · 源码核查**：[lib/client.js:371-397](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L371-L397)

真实token/style/图片变量与清理。

<details>
<summary>查看原文（27行）</summary>

```text
    function apply(ctx) {
      ctx.effect(() => {
        const disposers = []
        const theme = ctx.theme
        if (theme !== undefined) {
          disposers.push(theme.overrideTokens('blue-glass-theme', TOKENS))
        }
        disposers.push(keepThemeCssLast())
        disposers.push(injectSidebarSticker())
        disposers.push(insertStyle(BASE_CSS))
        disposers.push(insertStyle(OCEAN_CSS))
        disposers.push(insertStyle(COMPOSER_CSS))
        disposers.push(insertStyle(PERMISSION_CSS))
        disposers.push(insertStyle(MODEL_CSS))
        disposers.push(insertStyle(SIDEBAR_CSS))
        disposers.push(insertStyle(FOOTER_CSS))
        disposers.push(insertStyle(THEME_TOGGLE_CSS))
        disposers.push(insertStyle(TURN_TIME_CSS))
        return () => { for (let i = 0; i < disposers.length; i++) disposers[i]() }
      })

      ctx.effect(() => {
        const disposers = []
        disposers.push(insertStyle(':root { --ds-theme-bg-image: url("' + BG_URI + '"); }'))
        disposers.push(insertStyle(':root { --ds-new-session-skin: url("' + NEW_SESSION_SKIN_URI + '"); }'))
        return () => { for (let i = 0; i < disposers.length; i++) disposers[i]() }
      })
```

</details>

**依据 3 · 源码核查**：[lib/client.js:432-465](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L432-L465)

真实theme订阅/setTheme及body fallback。

<details>
<summary>查看原文（34行）</summary>

```text
      function ThemeToggle(props) {
        const theme = ctx.theme
        const [dark, setDark] = React.useState(() => {
          if (theme === undefined) return document.body.hasAttribute('data-ds-dark-theme')
          return theme.getTheme().active.colorScheme === 'dark'
        })
        React.useEffect(() => {
          if (theme === undefined) return
          const off = ctx.on('theme/change', (snapshot) => {
            setDark(snapshot.active.colorScheme === 'dark')
          })
          return off
        }, [])
        const toggle = () => {
          if (theme === undefined) {
            // Fallback: flip the body attribute the presenter would own.
            const next = !document.body.hasAttribute('data-ds-dark-theme')
            if (next) document.body.setAttribute('data-ds-dark-theme', '')
            else document.body.removeAttribute('data-ds-dark-theme')
            setDark(next)
            return
          }
          const nextDark = theme.getTheme().active.colorScheme !== 'dark'
          theme.setTheme(nextDark ? 'dark' : 'light')
        }
        return React.createElement('button', {
          type: 'button',
          className: 'uiskin-theme-toggle',
          'aria-label': dark ? '切换到浅色' : '切换到深色',
          title: dark ? '切换到浅色' : '切换到深色',
          'data-uiskin-dark': dark ? 'true' : 'false',
          onClick: toggle,
        }, dark ? React.createElement(MoonIcon) : React.createElement(SunIcon))
      }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:468-492](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L468-L492)

真实三个slot注册。

<details>
<summary>查看原文（25行）</summary>

```text
      if (slots !== undefined) {
        // settings.trigger is a SINGLE slot also claimed by the built-in
        // settings-general trigger at priority 0. Shadow it with a negative
        // priority (lowest renders) — the dynamic runner did the same by
        // allocating a unique descending priority per registration.
        slots.inject('settings.trigger', () => slots.register(
          { name: 'settings.trigger', priority: -100 },
          (props) => React.createElement(SettingsWhaleButton, props),
        ))
        slots.inject('sidebar.footer.action', () => slots.register(
          { name: 'sidebar.footer.action', id: 'theme-divider', order: 0, label: '' },
          (props) => React.createElement(SidebarDivider, props),
        ))
        // Light/dark toggle, placed LEFT of the Session log button: both live in
        // the 'conversation.session.header.utilities' list, which sorts ascending
        // by `order` (session-log-download has no order → 0), so order:-1 puts us
        // first (leftmost).
        slots.inject('conversation.session.header.utilities', () => slots.register(
          { name: 'conversation.session.header.utilities', id: 'theme-dark-toggle', order: -1, label: '主题切换' },
          (props) => React.createElement(ThemeToggle, props),
        ))
      }
    }

    const inject = ["theme", "slots"];
```

</details>

**依据 5 · 源码核查**：[scripts/build-client.mjs:10-46](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/scripts/build-client.mjs#L10-L46)

真实资产内联/占位检查/产物write。

<details>
<summary>查看原文（37行）</summary>

```text
const ASSETS = {
  BG_URI: { file: "assets/bg_1600_q60.jpg", mime: "image/jpeg" },
  STICKER_URI: { file: "assets/sticker2.png", mime: "image/png" },
  SETTINGS_DECOR_URI: { file: "assets/settings_decor.png", mime: "image/png" },
  SETTINGS_DIVIDER_URI: { file: "assets/settings_divider.png", mime: "image/png" },
  NEW_SESSION_SKIN_URI: { file: "assets/new_session_skin_clean.png", mime: "image/png" },
};

const templatePath = join(ROOT, "scripts", "client.template.js");
const outputPath = join(ROOT, "lib", "client.js");

let source = readFileSync(templatePath, "utf8");

for (const [placeholder, { file, mime }] of Object.entries(ASSETS)) {
  const abs = join(ROOT, file);
  if (!existsSync(abs)) {
    console.error(`uiskin-theme: missing asset ${file} — copy the images into assets/ first`);
    process.exit(1);
  }
  const dataUri = `data:${mime};base64,${readFileSync(abs).toString("base64")}`;
  const token = `__${placeholder}__`;
  if (!source.includes(token)) {
    console.error(`uiskin-theme: placeholder ${token} not found in ${templatePath}`);
    process.exit(1);
  }
  source = source.split(token).join(dataUri);
}

const leftovers = source.match(/__[A-Z_]+__/g);
if (leftovers) {
  console.error(`uiskin-theme: unresolved placeholders: ${[...new Set(leftovers)].join(", ")}`);
  process.exit(1);
}

writeFileSync(outputPath, source);
const kb = (Buffer.byteLength(source, "utf8") / 1024).toFixed(1);
console.log(`uiskin-theme: wrote ${outputPath} (${kb} KiB)`);
```

</details>

#### 缺口

- Host theme持久/slot兼容、重复挂载/卸载和真实页面效果未测。
  **影响**：只能证明视觉接线，不能保证偏好重启还原或所有Host可用。
  **进一步探讨**：一次个人profile核开关/重启/卸载，对照原生主题，不改业务数据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 思考计时和兼容/失败路径有何边界？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

所谓紫色实时思考秒数在此只是TURN_TIME_CSS给Host既有turnStatusClock/trigger着色与字重，没有新计时器、模型推理测量或准确性校验；Host已显示数字的语义/误差仍未知。全局具体hash类、后缀_fade、权限菜单重定位和focus轮廓覆盖会影响实际交互，可读性/键盘可达性未运行验证。

keepThemeCssLast监听head子节点，若主题style不在末尾就批量移到末尾竞争层叠，和其他强制最后样式插件并存可能互相重排/带来CPU开销；这只是静态风险未测。sidebar sticker仅首次找到.hHd-Xa_root且img空才append，若Host替换整个sidebar root但旧img引用不空，observer不会重挂，需重载/禁用恢复，不保证热切换自愈。清理有disconnect和img.remove，CSS撤销不撤Host已保存主题；没有业务资料写入/远端任务可取消，恢复主要移除插件并还原Host主题。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:129-141](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L129-L141)

真实计时仅CSS着色。

<details>
<summary>查看原文（13行）</summary>

```text
    // The "thinking time" readouts use the app's palest text tokens
    // (label-tertiary / label-caption), which read as a washed-out grey:
    //   .Q51KRG_trigger          — the "用时 {duration}" clock button under a reply
    //   .EvIC1a_turnStatusClock  — the live elapsed seconds beside 深度求索中…
    // The settled 用时 label gets the theme's secondary tone. The LIVE seconds
    // are tinted purple + medium weight so the running time clearly stands out
    // next to the blue 深度求索中… shimmer (preview: purple, not pushed yet).
    const TURN_TIME_CSS = [
      '.Q51KRG_trigger { color: var(--dsw-alias-label-secondary) !important; }',
      '.Q51KRG_trigger:hover { color: var(--dsw-alias-label-primary) !important; }',
      '.EvIC1a_turnStatusClock { font-weight: 500 !important; color: #7c3aed !important; -webkit-text-fill-color: #7c3aed !important; }',
      'body[data-ds-dark-theme] .EvIC1a_turnStatusClock { color: #c9b3ff !important; -webkit-text-fill-color: #c9b3ff !important; }',
    ].join('\n')
```

</details>

**依据 2 · 源码核查**：[lib/client.js:143-150](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L143-L150)

权限菜单hash定位与强制样式。

```text
    const PERMISSION_CSS = [
      '.uV2eYG_modes { position: relative; }',
      '.uV2eYG_modes [role="menu"] { position: absolute !important; left: 0 !important; right: auto !important; bottom: calc(100% + 8px) !important; top: auto !important; z-index: 1200 !important; width: 300px !important; box-sizing: border-box !important; background: #ffffff !important; border: 1px solid #dfe4ea !important; border-radius: 12px !important; box-shadow: 0 10px 30px rgba(30, 60, 100, 0.16) !important; padding: 6px !important; margin: 0 !important; max-height: none !important; overflow: visible !important; }',
      '.uV2eYG_modes [role="menu"] > [role="presentation"] { display: flex !important; flex-direction: column !important; gap: 2px !important; }',
      '.uV2eYG_modes [role="menu"] [role="menuitem"] { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 12px !important; width: 100% !important; min-height: 52px !important; height: auto !important; box-sizing: border-box !important; padding: 8px 12px !important; background: transparent !important; border: none !important; border-radius: 8px !important; text-align: left !important; color: #16335e !important; font-size: 14px !important; font-weight: 400 !important; opacity: 1 !important; visibility: visible !important; cursor: pointer !important; }',
      '.uV2eYG_modes [role="menu"] [role="menuitem"]:hover { background: rgba(59, 157, 245, 0.08) !important; }',
      '.uV2eYG_modes [role="menu"] [role="menuitem"]:has(> svg) { background: rgba(59, 157, 245, 0.10) !important; }',
      '.uV2eYG_modes [role="menu"] [role="menuitem"] > span:first-child { width: 36px !important; height: 36px !important; min-width: 36px !important; border-radius: 50% !important; background: rgba(59, 157, 245, 0.12) !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex: none !important; color: #3B9DF5 !important; }',
```

**依据 3 · 源码核查**：[lib/client.js:249-259](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L249-L259)

fade后缀/设置trigger focus覆盖。

<details>
<summary>查看原文（11行）</summary>

```text
      // bhn1Oq_fade, etc.).
      '[class$="_fade"] { background: transparent !important; background-image: none !important; }',
      '.qDHVXG_fade { background: transparent !important; background-image: none !important; }',
      '.hHd-Xa_footArea, .hHd-Xa_footerActions, .hHd-Xa_settingsArea { background: transparent; border: none; box-shadow: none; }',
      '.Nqubda_layer { margin: 0; order: 1; }',
      '.hHd-Xa_settingsArea { position: relative; margin-top: 0; padding: 0 0 10px; }',
      '.VOzbGW_trigger { box-sizing: border-box; width: 94%; margin: 0 auto; height: auto; min-height: 0; background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; border-radius: 0 !important; display: block; overflow: visible; transition: filter 0.15s ease, transform 0.1s ease; }',
      '.VOzbGW_trigger:hover { background: transparent !important; filter: brightness(1.08); transform: translateY(-1px); }',
      '.VOzbGW_trigger:active { transform: translateY(0); }',
      '.VOzbGW_trigger:focus-visible { outline: none; }',
    ].join('\n')
```

</details>

**依据 4 · 源码核查**：[lib/client.js:270-308](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L270-L308)

真实末尾CSS observer/首次sticker挂载和清理。

<details>
<summary>查看原文（39行）</summary>

```text
    function keepThemeCssLast() {
      const observer = new MutationObserver(() => {
        const head = document.head
        const tags = [...head.querySelectorAll('style[data-plugin-css="uiskin-theme"]')]
        if (!tags.length) return
        if (tags.includes(head.lastElementChild)) return
        const fragment = document.createDocumentFragment()
        for (const tag of tags) fragment.appendChild(tag)
        head.appendChild(fragment)
      })
      observer.observe(document.head, { childList: true })
      return () => observer.disconnect()
    }


    // The bottom cartoon character becomes a BACKGROUND decoration of the
    // sidebar: injected as a direct child of the sidebar root, absolutely
    // positioned just above the bottom wave divider, with z-index 0 and
    // pointer-events none so every control stays above it. The root's
    // overflow:hidden clips it to the sidebar bounds; the size (96px wide /
    // 40px collapsed) comes from CSS so it follows the sidebar state.
    function injectSidebarSticker() {
      let img = null;
      function build() {
        const root = document.querySelector('.hHd-Xa_root');
        if (!root || img) return;
        img = document.createElement('img');
        img.className = 'uiskin-sidebar-sticker';
        img.src = STICKER_URI;
        img.alt = '';
        img.draggable = false;
        root.appendChild(img);
      }
      build();
      const observer = new MutationObserver(build);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => { observer.disconnect(); if (img) img.remove(); };
    }

```

</details>

**依据 5 · 源码核查**：[lib/client.js:371-397](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L371-L397)

真实effect清理。

<details>
<summary>查看原文（27行）</summary>

```text
    function apply(ctx) {
      ctx.effect(() => {
        const disposers = []
        const theme = ctx.theme
        if (theme !== undefined) {
          disposers.push(theme.overrideTokens('blue-glass-theme', TOKENS))
        }
        disposers.push(keepThemeCssLast())
        disposers.push(injectSidebarSticker())
        disposers.push(insertStyle(BASE_CSS))
        disposers.push(insertStyle(OCEAN_CSS))
        disposers.push(insertStyle(COMPOSER_CSS))
        disposers.push(insertStyle(PERMISSION_CSS))
        disposers.push(insertStyle(MODEL_CSS))
        disposers.push(insertStyle(SIDEBAR_CSS))
        disposers.push(insertStyle(FOOTER_CSS))
        disposers.push(insertStyle(THEME_TOGGLE_CSS))
        disposers.push(insertStyle(TURN_TIME_CSS))
        return () => { for (let i = 0; i < disposers.length; i++) disposers[i]() }
      })

      ctx.effect(() => {
        const disposers = []
        disposers.push(insertStyle(':root { --ds-theme-bg-image: url("' + BG_URI + '"); }'))
        disposers.push(insertStyle(':root { --ds-new-session-skin: url("' + NEW_SESSION_SKIN_URI + '"); }'))
        return () => { for (let i = 0; i < disposers.length; i++) disposers[i]() }
      })
```

</details>

#### 缺口

- 多皮肤观察器冲突/CPU、全Host版本/窗口/键盘/对比度与sidebar重建未测。
  **影响**：不声称性能无开销/全部兼容/无障碍达标或新计时能力。
  **进一步探讨**：固定浅深/窄屏/键盘/多主题样例核控件与重排，失败禁用恢复原生主题。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 个人场景值得试到哪步，下一方向怎样证伪？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议受限个人试用，只给明确偏好海洋视觉且接受作者个人原样条款的人，用可丢弃profile先核目标Host版本、明暗/权限菜单/输入/设置按钮与卸载。相比原生主题增加视觉一致性与就近开关，但未证长时阅读、可达性或净操作效率；不要因为个人喜欢就宣称生产工作流/交付/新客群/经济创新。

首次安装/版本/许可与显示核对，持续内联图片加载/浏览器内存、DOM observer、升级CSS维护，失败禁用与主题恢复、退出profile清理的现金与人工未知不填0；未见本包模型/外部请求链不等Host无费用。作者约1.1MB只是自报体积，非本轮网络/内存实测。

独立假设：在Host官方token/slot上做最小对比度与控件可达性保障，减少hash选择器和最后样式竞争，可能比继续加装饰更利于稳定个人皮肤；先比原生主题/局部CSS，不直接复制受限素材。固定Host升级/浅深/窄屏/键盘/多皮肤与sidebar替换样例，测控件可达、阅读错误、重排CPU和维护时间；若原生足够或维护/授权负担高则否定，不算当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:270-308](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L270-L308)

现有observer与hash/sidebar边界。

<details>
<summary>查看原文（39行）</summary>

```text
    function keepThemeCssLast() {
      const observer = new MutationObserver(() => {
        const head = document.head
        const tags = [...head.querySelectorAll('style[data-plugin-css="uiskin-theme"]')]
        if (!tags.length) return
        if (tags.includes(head.lastElementChild)) return
        const fragment = document.createDocumentFragment()
        for (const tag of tags) fragment.appendChild(tag)
        head.appendChild(fragment)
      })
      observer.observe(document.head, { childList: true })
      return () => observer.disconnect()
    }


    // The bottom cartoon character becomes a BACKGROUND decoration of the
    // sidebar: injected as a direct child of the sidebar root, absolutely
    // positioned just above the bottom wave divider, with z-index 0 and
    // pointer-events none so every control stays above it. The root's
    // overflow:hidden clips it to the sidebar bounds; the size (96px wide /
    // 40px collapsed) comes from CSS so it follows the sidebar state.
    function injectSidebarSticker() {
      let img = null;
      function build() {
        const root = document.querySelector('.hHd-Xa_root');
        if (!root || img) return;
        img = document.createElement('img');
        img.className = 'uiskin-sidebar-sticker';
        img.src = STICKER_URI;
        img.alt = '';
        img.draggable = false;
        root.appendChild(img);
      }
      build();
      const observer = new MutationObserver(build);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => { observer.disconnect(); if (img) img.remove(); };
    }

```

</details>

**依据 2 · 源码核查**：[lib/client.js:432-465](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/lib/client.js#L432-L465)

实际明暗开关与fallback。

<details>
<summary>查看原文（34行）</summary>

```text
      function ThemeToggle(props) {
        const theme = ctx.theme
        const [dark, setDark] = React.useState(() => {
          if (theme === undefined) return document.body.hasAttribute('data-ds-dark-theme')
          return theme.getTheme().active.colorScheme === 'dark'
        })
        React.useEffect(() => {
          if (theme === undefined) return
          const off = ctx.on('theme/change', (snapshot) => {
            setDark(snapshot.active.colorScheme === 'dark')
          })
          return off
        }, [])
        const toggle = () => {
          if (theme === undefined) {
            // Fallback: flip the body attribute the presenter would own.
            const next = !document.body.hasAttribute('data-ds-dark-theme')
            if (next) document.body.setAttribute('data-ds-dark-theme', '')
            else document.body.removeAttribute('data-ds-dark-theme')
            setDark(next)
            return
          }
          const nextDark = theme.getTheme().active.colorScheme !== 'dark'
          theme.setTheme(nextDark ? 'dark' : 'light')
        }
        return React.createElement('button', {
          type: 'button',
          className: 'uiskin-theme-toggle',
          'aria-label': dark ? '切换到浅色' : '切换到深色',
          title: dark ? '切换到浅色' : '切换到深色',
          'data-uiskin-dark': dark ? 'true' : 'false',
          onClick: toggle,
        }, dark ? React.createElement(MoonIcon) : React.createElement(SunIcon))
      }
```

</details>

**依据 3 · 作者声明**：[README.md:15-20](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/README.md#L15-L20)

作者许可限制。

```text
> **License / 许可证**
> This theme is an original work and is **All Rights Reserved** — it is NOT open source.
> Without written permission from the author, you may not copy, modify, redistribute, create derivative works, or use it commercially; it may only be installed as-is and used personally.
>
> 本主题为原创作品，**保留所有权利（All Rights Reserved）**，非开源协议。
> 未经作者书面许可，不得复制、修改、再分发、二次创作或用于商业用途；仅允许按原样安装与个人使用。
```

**依据 4 · 作者声明**：[README.md:85-91](https://github.com/chouxiaohuai/dsh-uiskin-theme/blob/a355a9b16ba692b7551ffac0a6a6a9fea1149e49/README.md#L85-L91)

自报内联体积/兼容风险。

```text
## Notes / 注意事项

- Assets are inlined as base64 into `lib/client.js` (~1.1 MB) and loaded once, suitable for small skin images. To shrink it, compress the images under `assets/` first and rebuild.
  - 素材以 base64 内联在 `lib/client.js`（约 1.1 MB），加载一次即可，适合皮肤类小图片。若想更小，可先把 `assets/` 里的图压缩再构建。
- DSH is currently a `0.1.5-rc.1` pre-release; the plugin API (`dsh.bundle` / `dsh.client` / slots / theme services) and some client class names may change between releases. When upgrading DSH, a few theme elements (bubbles, sidebar) can briefly lose styling if their CSS class hashes change — this theme tracks those renames and adds the matching selectors. If you hit compatibility issues after upgrading DSH, watch this repo's updates.
  - DSH 目前是 `0.1.5-rc.1` 预发布版本，插件 API（`dsh.bundle` / `dsh.client` / slots / theme 服务）及部分客户端类名可能随版本变化。升级 DSH 后，个别主题元素（气泡、侧栏）可能因类名 hash 变化而暂时失去样式——本主题会跟踪这些改名并补充对应选择器；如升级后遇兼容问题，关注本仓库的更新。
- This package only depends on `@deepseek-ai/cordis` (peer) and `react` (peer); no `allowBuilds` approval is needed to run its build scripts.
```

#### 缺口

- 真实需求、可读性/性能、维护总成本与假设收益未测。
  **影响**：只在个人低风险profile试用，不能直接做商业复用方向。
  **进一步探讨**：用原生主题作为基线，小样本可达性/升级维护无净优势则退出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
