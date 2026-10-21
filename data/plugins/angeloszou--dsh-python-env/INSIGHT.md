# dsh-python-env

> 为DSH提供工作区Python虚拟环境发现、创建、安装、卸包和删除工具，并处理镜像/代理回退。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d24039c](https://github.com/AngelosZou/dsh-python-env/tree/d24039c579b644101577383ef5734fff78d43439)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env) [![npm 30d 1,346](https://img.shields.io/static/v1?label=npm+30d&message=1%2C346&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-python-env) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-python-env)
<!-- END META -->

**使用建议**：适合可信项目依赖的环境管理，先核对允许根、包规格和索引。对不可信包继续用容器/沙箱，不把venv当安全隔离。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：项目Python依赖因Shell网络/临时目录限制安装失败，需要可追踪环境和明确写权限。

- **建议**：由host执行补偿控制推导，可将包规格收窄为解析过的依赖表达式，禁止路径/全局改写选项，realpath核对并在受限执行环境装包。未验证；symlink、恶意requirements选项和构建脚本越界样本应被阻止，正常包安装成功率/维护成本另测。

适合可信项目依赖的环境管理，先核对允许根、包规格和索引。对不可信包继续用容器/沙箱，不把venv当安全隔离。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

Shell pip最透明但受环境限制，uv/容器更完整；插件补DSH集成而非包隔离保证。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：项目venv发现、创建、安装、卸包及删除。
- **Skill**：Python环境管理指导。
- **后台**：受限时后台安装与索引/代理回退。

**流程与依赖**

DSH tools/skills/subprocess/jobs/sandboxPolicy、Python>=3.8、包索引与可选multi-folder根；ensurepip只修pip不解决所有构建依赖。

discover→确认write模式→选/建venv→准备工作区cache/tmp→pip有限回退→报告结果/后台job；删除只接受环境标记但仍需核真实路径。

**效果与成本**

首次Python/venv与索引选择，持续下载、构建、磁盘、锁版本和恢复排错；自动回退可能增加等待，未测节时。

可能减少网络环境排错，host安装权限与供应链责任增加。

- **思考**：“工作区内”是否真的限制所有写入？路径guard是词法resolve/relative，未核realpath；packages普通字符串直接入pip argv，除editable外未拒绝--target等选项，包构建代码亦可在host权限执行。检查mode防只读，不等于OS沙箱或保证全局环境绝不受影响。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手写Shell pip，增量是环境发现、权限模式核对、依赖故障分类与安装过程收据；venv/pip和软件供给来自上游，不是新的隔离机制。

相对手写Shell pip，增量是环境发现、权限模式核对、依赖故障分类与安装过程收据；venv/pip和软件供给来自上游，不是新的隔离机制。

写模式fail-closed、argv无shell、故障分类与限时job可借鉴；路径词法检查和pip选项需收紧，重定向tmp只是惯例非强制边界。 源码依据：[lib/index.js](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/index.js)、[lib/policy.js](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/policy.js)、[lib/guard.js](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/guard.js)、[lib/envdir.js](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/envdir.js)、[lib/pip.js](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js)、[lib/tools/install.js](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/install.js)。

<a id="detail-section-5"></a>

### 主要限制

“工作区内”是否真的限制所有写入？路径guard是词法resolve/relative，未核realpath；packages普通字符串直接入pip argv，除editable外未拒绝--target等选项，包构建代码亦可在host权限执行。检查mode防只读，不等于OS沙箱或保证全局环境绝不受影响。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AngelosZou/dsh-python-env](https://github.com/AngelosZou/dsh-python-env)
- **版本号**：0.1.2（[固定提交 d24039c5](https://github.com/AngelosZou/dsh-python-env/tree/d24039c579b644101577383ef5734fff78d43439)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/policy.js、lib/guard.js、lib/envdir.js、lib/pip.js、lib/tools/install.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/policy.js、lib/guard.js、lib/envdir.js、lib/pip.js、lib/tools/install.js；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：临时根验证read-only拒绝、symlink/--target/requirements越界、网络与解析错误分类及超时部分安装；核对退出后环境状态再重试。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由host执行补偿控制推导，可将包规格收窄为解析过的依赖表达式，禁止路径/全局改写选项，realpath核对并在受限执行环境装包。未验证；symlink、恶意requirements选项和构建脚本越界样本应被阻止，正常包安装成功率/维护成本另测。

临时根验证read-only拒绝、symlink/--target/requirements越界、网络与解析错误分类及超时部分安装；核对退出后环境状态再重试。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：2c65483ff83a967cb4a4fd0964de2052fe3c9a6afd070135a58e8573f9d5bd16。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 735 | — | — | 6673 |
| .js | source | 20 | 2205 | 1639 | 464 | — |
| .js | test | 10 | 1267 | 1119 | 65 | — |
| .mjs | test | 1 | 51 | 37 | 11 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env/issues?q=is%3Aissue+created%3A2026-09-21T08%3A03%3A08.828Z..2026-10-21T08%3A03%3A08.828Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A03%3A08.828Z..2026-10-21T08%3A03%3A08.828Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
