# dsh-text-inject

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

> 从独立Markdown文件加载系统提示和上下文块，提供设置页编辑、热加载与历史备份。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject) · [![最后更新 19天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=19%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject/commits)
<!-- END META -->

## 版本

固定提交 [42970dd9743730259ba04af40f5ece1db1e7c7bc](https://github.com/1497105876/dsh-text-inject/tree/42970dd9743730259ba04af40f5ece1db1e7c7bc)

## 用途与采用点评

- **用途**：用户需要维护独立于宿主配置的常驻规则，并能查看或恢复旧文本，成功标准是实际注入与文件一致。
- **亮点**：lib/index.js解析块后先释放旧注册，再用systemPrompt.section/context注册；监听目录处理原子保存，路由保存与恢复历史。
- **思考**：独立文件与历史便于回退；注入入口更方便也可能让过期规则长期影响不同任务。
- **建议**：先用少量无冲突规则验证每轮实际上下文，并确认删除与恢复生效；需要关键词门控时先核实当前版本，不能仅照README。

## 场景与替代办法

此前未入档；项目AGENTS.md或原生提示配置更直接，本项适合确需独立文件与Web编辑的人。

## 依赖与流程

需要文件可读写、宿主注入服务与受保护Web部署；规则来源可信和模型遵循程度是效果前提。

在设置页编辑块或直接保存文件，核对注册错误与预览，启动任务观察实际注入；故障时停用块或从历史恢复，避免多处同时修改。

## 成本与效果

常驻块会增加每轮输入tokens，历史备份与文件监测占IO；规则冲突排查和迁移维护是人工成本，没有节省量实测。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：09ed6b113912c121ad7630ec3f78ee1fbc3a2740c8eabe55f3b831f60dce68c1。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 800 | — | — | 7117 |
| .js | source | 3 | 2288 | 1833 | 296 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Host 路由**：状态、保存和历史恢复。
- **界面**：独立提示块编辑与预览。
- **后台**：目录监测和提示重新注册。

## 工程亮点

先撤旧再注册避免重名残留，盯目录而非文件兼容编辑器重命名保存；历史钉住和限额清理有可借鉴性，文档与实现需对齐。

## 分发与兼容

0.2.0-rc.2，Node>=18；Host硬依赖systemPrompt和webServer，客户端经同源路由编辑独立文件。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：README仍描述trigger与kind门控，当前实现说明已去除trigger且走官方context接口；不能按旧文档承诺关键词注入。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试重复标题、外部原子保存、非法块、历史恢复和卸载，检查旧注册不残留，并核对context实际出现频率。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
