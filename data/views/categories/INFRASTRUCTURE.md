# 基础设施

[返回首页](../../../README.md)

## 分类导航

- [@zzerx/dsh-plugin-usage-billing](#plugin-1363429979-plugin-usage-billing)：从会话日志聚合 token 用量，并按事件时价格显示预算与费用。
- [dsh-about](#plugin-1354283280-root)：在设置页展示当前 DSH 与插件版本及项目入口。
- [dsh-model-info-fill](#plugin-1358816037-root)：按 models.dev 补齐自定义模型的上下文、输出、推理和图片能力。
- [dsh-plugin-quota](#plugin-1400927706-root)：实时跟踪会话 token、轮次与估算费用，并向模型注入预算信号。
- [dsh-reasoning-tiers](#plugin-1367305514-root)：为第三方模型补齐推理档位与模型能力元数据。
- [dsh-web-restart](#plugin-1335060007-root)：在 Web 侧栏提供单击重启 DSH Web 进程的入口。
- [dsh-web-url-view](#plugin-1366583376-root)：在设置页显示临时与固定 Web 访问地址，支持局域网访问。

### 基础设施（7）

<a id="plugin-1363429979-plugin-usage-billing"></a>

#### [@zzerx/dsh-plugin-usage-billing](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：从会话日志聚合 token 用量，并按事件时价格显示预算与费用。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：费用准确性依赖日志完整、模型键匹配和历史价格表；估算不可直接当账单或财务凭证。
- **建议**：抽取已知模型与价格的一组会话，逐条复算 token 和费用；差异无法解释时只作趋势参考。

<a id="plugin-1354283280-root"></a>

#### [dsh-about](../../plugins/1010n111--dsh-about/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1010n111/dsh-about) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-about) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1010n111/dsh-about/commits)

- **用途**：在设置页展示当前 DSH 与插件版本及项目入口。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：它改善可见性但不执行升级或兼容判断；显示版本若来自不同运行副本仍可能误导排障。
- **建议**：在升级前后核对页面、CLI 与实际加载包版本一致，把它作为诊断入口而非更新保证。

<a id="plugin-1358816037-root"></a>

#### [dsh-model-info-fill](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-info-fill) · [![最后更新 5天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=5%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/commits)

- **用途**：按 models.dev 补齐自定义模型的上下文、输出、推理和图片能力。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：名称匹配和外部目录都可能过时或碰撞；自动补值若覆盖人工配置会影响任务成本与正确性。
- **建议**：用一组已知模型检查匹配、未匹配和人工覆盖优先级，错误匹配出现时保持手工配置。

<a id="plugin-1400927706-root"></a>

#### [dsh-plugin-quota](../../plugins/121212165--dsh-plugin-quota/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 147](https://img.shields.io/static/v1?label=npm+30d&message=147&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/commits)

- **用途**：实时跟踪会话 token、轮次与估算费用，并向模型注入预算信号。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：估算和预测不等于供应商账单；每轮注入本身占上下文，错误价格会让模型做出错误自限。
- **建议**：用已知 token 记录核对仪表和账单，比较注入开销；偏差超出容忍度时只保留只读面板。

<a id="plugin-1367305514-root"></a>

#### [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers) · [![npm 30d 1066](https://img.shields.io/static/v1?label=npm+30d&message=1%2C066&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) · [![最后更新 13天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=13%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers/commits)

- **用途**：为第三方模型补齐推理档位与模型能力元数据。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：内置知识表会随供应商模型变化而过时；错误上下文或推理档位可能导致失败或意外成本。
- **建议**：用实际供应商模型逐一核对上下文、输出与图片能力，并保留未知项而非自动猜测。

<a id="plugin-1335060007-root"></a>

#### [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-restart) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart/commits)

- **用途**：在 Web 侧栏提供单击重启 DSH Web 进程的入口。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：无二次确认的重启会中断活动连接；持久按钮不等于会话与后台任务能安全恢复。
- **建议**：只在可恢复环境试用，先验证活动任务、未保存输入和重启后的连接状态。

<a id="plugin-1366583376-root"></a>

#### [dsh-web-url-view](../../plugins/1032740078--dsh-web-url-view/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-url-view) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/commits)

- **用途**：在设置页显示临时与固定 Web 访问地址，支持局域网访问。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：稳定地址提高可达性也扩大暴露面；必须结合认证、监听接口与网络边界判断安全性。
- **建议**：先在受控局域网核对绑定地址、认证和重启后稳定性，不应把可访问等同于安全远程接入。

## 更新时间

2026-10-19
