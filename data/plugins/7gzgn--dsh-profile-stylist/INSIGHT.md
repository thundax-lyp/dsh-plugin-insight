# dsh-profile-stylist

> 借助宿主模型生成资料草稿，并通过浏览器填写 GitHub 或 Gitee 个人资料。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[05dfa3e](https://github.com/7gzgn/dsh-profile-stylist/tree/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：要修改GitHub或Gitee自己资料的人先生成草稿并检查账号；小范围填一个字段后重新打开资料页确认，头像和批量字段待验证后再用。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

用户修改自己代码托管账号的昵称、简介、链接与头像，先审草稿再填表，交付站点保存结果需回读确认。

参照手工填表与通用浏览器自动化；未对模型文案质量或账号操作可靠性做基准。

<a id="detail-section-3"></a>

### 能力、流程与依赖

author调用宿主LLM，compose/hosts按站点白名单与长度收敛字段；profile_apply默认dry-run，confirm=true后browser.openUrl/evaluate填DOM、DataTransfer上传头像并点击保存。

- **模型工具**：profile_assets、profile_author、profile_apply。

DSH browser/session与LLM、浏览器站点登录态、本地头像或Canvas；插件不持API key但使用现有登录权限。

描述愿望→模型草稿→字段/头像计划→dry-run预览→显式confirm参数→开资料页填表/上传/点保存→返回填写信息；当前持久保存需另查。

host工具依赖DSH浏览器与LLM，支持GitHub/Gitee显式档案，其他站点拒绝；Gitee location不支持。

<a id="detail-section-4"></a>

### 效果、成本与限制

减少文案与填表来回，但身份准确和持久保存仍需人确认；不适合安全设置或非白名单站点。

首次检查登录账号与字段、准备头像；持续维护站点DOM和复核文案。LLM费用按宿主，人工审稿/保存核对未测。

点击保存是否等于正确账号资料已保存？confirm仅工具布尔参数，不是用户批准事件；脚本btn.click后置saved=true，未独立回读站点持久字段。浏览器当前登录谁就写谁，缺少预期账号绑定；DOM选择器验证注释也不能保证站点改版后行为。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对通用浏览器Agent临时猜选择器，增量是显式两站字段档案、先草稿后应用和头像素材/Canvas路径，把资料编辑组织成较窄操作。模型文案、浏览器登录与站点保存为上游能力，不能算插件独有保证。

站点档案、字段收敛与LLM生成分层，默认dry-run和http(s)网址过滤有借鉴处；应把clicked与persisted区分，并绑定目标账号。

源码依据：[lib/index.js](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js)、[lib/author.js](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/author.js)、[lib/compose.js](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/compose.js)、[lib/hosts.js](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/hosts.js)、[lib/constants.js](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/constants.js)、[package.json](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：用户修改自己代码托管账号的昵称、简介、链接与头像，先审草稿再填表，交付站点保存结果需回读确认。

- **建议**：待验证假设：应用计划绑定预期账号ID与字段/头像摘要，写后重新读取资料并逐字段核对，可减少错账号和点击成功但保存失败。由当前登录态依赖与saved点击标记推导，未实现。用切换账号、站点校验拒绝、部分字段成功三类对照，测误报成功和回滚负担；账号身份不可验证时应停在草稿。

要修改GitHub或Gitee自己资料的人先生成草稿并检查账号；小范围填一个字段后重新打开资料页确认，头像和批量字段待验证后再用。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认草稿/白名单/dry-run和表单自动化；作者两站真机声明未复现，未打开浏览器或改资料。未来身份与回读契约是假设。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：profile_assets、profile_author、profile_apply。

- **思考**：点击保存是否等于正确账号资料已保存？confirm仅工具布尔参数，不是用户批准事件；脚本btn.click后置saved=true，未独立回读站点持久字段。浏览器当前登录谁就写谁，缺少预期账号绑定；DOM选择器验证注释也不能保证站点改版后行为。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对通用浏览器Agent临时猜选择器，增量是显式两站字段档案、先草稿后应用和头像素材/Canvas路径，把资料编辑组织成较窄操作。模型文案、浏览器登录与站点保存为上游能力，不能算插件独有保证。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.2.2；版本日期：2026-10-18（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[05dfa3ed](https://github.com/7gzgn/dsh-profile-stylist/tree/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读index、author、compose、hosts与字段/URL限制；未访问站点、调用模型或上传图片。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：cc296b46505fa79a2a0ffad90ea4dbbeef79b9b69fcc5b5f1a261b3a292c3aa7。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 1360 | 972 | 307 | — |
| .md | source | 1 | 103 | — | — | 1116 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：应用计划绑定预期账号ID与字段/头像摘要，写后重新读取资料并逐字段核对，可减少错账号和点击成功但保存失败。由当前登录态依赖与saved点击标记推导，未实现。用切换账号、站点校验拒绝、部分字段成功三类对照，测误报成功和回滚负担；账号身份不可验证时应停在草稿。

隔离测试账号核对切换登录、选择器失效、服务器拒绝、部分保存和头像裁剪；本轮不对外写入。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-profile-stylist/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
