# 模型信息补全

> 从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill) · [![最后更新 6天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=6%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/commits)
<!-- END META -->

## 版本

固定提交 [d377291f5ef8ad2bccbd54e26e641b9d89016bba](https://github.com/11zld22/dsh-model-info-fill/tree/d377291f5ef8ad2bccbd54e26e641b9d89016bba)

## 用途与采用点评

- **用途**：维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。
- **亮点**：Host 拉取并缓存能力目录，构造缺失字段操作，通过 settings.mutate 带版本写入；模型保存可单独调整。
- **思考**：不凭会思考就编造离散档位是合理边界；默认值仍是用户假设而非外部事实。
- **建议**：先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

## 场景与替代办法

维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。

手填官方参数更慢但可追源；目录同步适合模型较多且接受逐项核对的用户。

## 依赖与流程

依赖 models.dev 可用性、名称映射、宿主模型设置契约；没有 API Key 或 Base URL 时不会自动创造提供商。

更新百科、查看待确认项、补齐缺失并核对真实调用；异常恢复备份并调整匹配或默认值。

## 成本与效果

批量维护节省与错误默认值带来的排查成本都需计入，没有测量净收益。

不凭会思考就编造离散档位是合理边界；默认值仍是用户假设而非外部事实。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：56e4a09cf358bdec736968593e5cbde037dba029633eb7a8bffa5aace259f1fd。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 127 | — | — | 2350 |
| .js | source | 3 | 2058 | 1835 | 88 | — |
| .mjs | test | 2 | 1038 | 974 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：模型目录同步与缺失字段补齐。
- **Host 路由**：补全、确认及模型保存端点。

## 工程亮点

目录缓存、填充计划与版本写入分离可借鉴；与其他补全插件并用可能争写相同字段。

## 分发与兼容

版本 0.2.4，入口 src/index.js，依赖 settings 和 Web 路由，外部 models.dev 是数据依赖。

## 历史对照

前次代码指纹为 d377291f5ef8ad2bccbd54e26e641b9d89016bba；本轮固定为 d377291f5ef8ad2bccbd54e26e641b9d89016bba。手填官方参数更慢但可追源；目录同步适合模型较多且接受逐项核对的用户。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：模型名字匹配和百科数据不保证实际端点一致；未验证请求兼容与输出边界。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试同名异端点、缺档位、已有配置、并发编辑、目录离线和旧版误填撤销。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 1](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+created%3A2026-09-20T02%3A57%3A33.548Z..2026-10-20T02%3A57%3A33.548Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A57%3A33.548Z..2026-10-20T02%3A57%3A33.548Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A57%3A33.548Z..2026-10-20T02%3A57%3A33.548Z)

统计日期：2026-10-20。
