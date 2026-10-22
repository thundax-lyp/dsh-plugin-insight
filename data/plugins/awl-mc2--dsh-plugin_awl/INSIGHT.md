# type-tune（DSH-Plugin_awl）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[02b8cec](https://github.com/AWL-MC2/DSH-Plugin_awl/tree/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19)

<!-- BEGIN META -->
[![npm 30d 290](https://img.shields.io/static/v1?label=npm+30d&message=290&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-type-tune) [![最新发布 2026-09-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-type-tune)
<!-- END META -->

> **实现功能**：调节 DSH Web 字体、文字对比度、光晕与内容特效。

> **核心亮点**：相较手写CSS，把字体发现、阅读对比与预设调节做成双入口，并用present区分尚未配置和明确恢复默认，避免迁移抹掉旧偏好。它是可读性配置集成，不能由WCAG预览徽标推出壁纸背景上所有文字均达标。

> **风险与缺陷**：共享状态是否真有持久确认？saveState写临时文件rename失败被吞掉，仍返回新revision；浏览器可把未落盘状态当成功且下一次重启丢失。全量配置POST没有expected revision，多标签并发可覆盖。字体/manifest读路由无认证，暴露网络的Host会扩大可读范围，不能用写同源检查代替访问授权。

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

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：壁纸或主题使次要文字难读的用户调整会话阅读样式；交付物是可恢复的个人排版配置，不是模型结果质量提升。

宿主字号/主题设置或用户CSS能覆盖部分需求；插件增加字体发现、恢复与双入口同步。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：字体manifest、字体内容及共享style状态读写。
- **用户命令**：/style查看与改变预设、字体、对比、特效和恢复默认。
- **界面**：设置卡、动态排版CSS、自定义字体与浮动预览。

**流程与依赖**

Host扫描两处字体目录、解析sfnt家族名并以manifest/font/state路由服务；/style命令与浏览器共享DSH_HOME/type-tune.json。浏览器动态CSS与预览渲染，localStorage作缓存，宿主不可达则降级本地；可见页每两秒轮询新revision。

DSH Web React/slots/locale、CSS color-mix等浏览器能力，Host字体目录和DSH_HOME写权限；字体授权由用户自行确保。

放字体→扫描manifest→调预设/预览→POST共享状态并缓存→/style局部修改→浏览器轮询→recover写null配置；Host缺失时退本地模式。

Apache-2.0双面bundle，无构建的提交JS，Host可选注入webServer/commands；桌面无路由时仅浏览器缓存，命令共享不成立。

**效果与成本**

现金无新增API；人工是字体文件管理、偏好调整、升级CSS选择器维护。动画/正文特效会增加渲染负担，字体首次加载有开销，收益未实测。

统一字体/样式与恢复操作，主价值是阅读舒适和减少手调CSS；不保证无障碍合规或提高工作产出。

> **思考**：共享状态是否真有持久确认？saveState写临时文件rename失败被吞掉，仍返回新revision；浏览器可把未落盘状态当成功且下一次重启丢失。全量配置POST没有expected revision，多标签并发可覆盖。字体/manifest读路由无认证，暴露网络的Host会扩大可读范围，不能用写同源检查代替访问授权。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相较手写CSS，把字体发现、阅读对比与预设调节做成双入口，并用present区分尚未配置和明确恢复默认，避免迁移抹掉旧偏好。它是可读性配置集成，不能由WCAG预览徽标推出壁纸背景上所有文字均达标。

相较手写CSS，把字体发现、阅读对比与预设调节做成双入口，并用present区分尚未配置和明确恢复默认，避免迁移抹掉旧偏好。它是可读性配置集成，不能由WCAG预览徽标推出壁纸背景上所有文字均达标。

sfnt解析做边界检查、字体数量与体积有限制，同名家族确定性取舍且报告落选；write-rename减少半文件，但吞错与无并发条件令耐久性声明过强。

固定源码依据：[index.js](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js)、[client.js](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/client.js)、[package.json](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/package.json)、[cordis.patch.yml](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 1.4 主要限制

共享状态是否真有持久确认？saveState写临时文件rename失败被吞掉，仍返回新revision；浏览器可把未落盘状态当成功且下一次重启丢失。全量配置POST没有expected revision，多标签并发可覆盖。字体/manifest读路由无认证，暴露网络的Host会扩大可读范围，不能用写同源检查代替访问授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要修复主题文字可读性者可评估静态阅读预设；先确认本地状态可持久，特效是否有利于阅读应按实际长文测量。

核查状态：字体发现、共享状态和样式渲染源码可确认；视觉可读性、对比达标和真实兼容未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.1；版本日期：2026-09-30（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[02b8cec9](https://github.com/AWL-MC2/DSH-Plugin_awl/tree/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根Host字体解析/扫描、共享状态/路由/命令，以及client状态同步与settings注册；视觉效果未渲染测量，不执行目标。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

把写入错误和expectedRevision纳入状态协议，浏览器只在持久成功后推进revision，可能减少假成功和双标签丢配置。对只读home、rename失败和两个标签同时更改不同字段验证不回成功且冲突可见；若配置仍静默覆盖，则协议未实现预期。

未运行或渲染；拟先故障注入持久化与并发测试，再在真实壁纸/长文本上测对比与动画开销，不把预览值替代全页测量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2147 | 1608 | 408 | — |
| .md | source | 1 | 137 | — | — | 1865 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AWL-MC2/DSH-Plugin_awl/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AWL-MC2/DSH-Plugin_awl/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AWL-MC2/DSH-Plugin_awl/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
