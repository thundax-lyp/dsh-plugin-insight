# 基础设施

[返回首页](../../../README.md)

## 分类导航

- [DSH Telemetry Redactor](#plugin-1333368566-root)：向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。
- [dsh-reasoning-tiers](#plugin-1367305514-root)：自定义供应商模型缺少档位元数据时，用户需要恢复可选档位并识别无效配置。
- [dsh-ui-auth](#plugin-1343420855-root)：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- [dsh-web-restart](#plugin-1335060007-root)：Windows 本机调试人员希望从浏览器重启 DSH，不再切回终端。
- [dsh-web-url-view](#plugin-1366583376-root)：桌面版每次重启更换端口和令牌时，用户希望有稳定的浏览器入口。
- [Forge 用量计费](#plugin-1363429979-plugin-usage-billing)：需要了解模型使用支出的开发者希望把日志用量与预算放在同一视图。
- [Qiushi DSH Evidence Audit](#plugin-1333357514-root)：需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。
- [Quota 用量仪表](#plugin-1400927706-root)：长任务开发者希望在继续调用前看到消耗趋势和可能的预算边界。
- [元冰可 AI 资源治理平台](#plugin-1416699252-root)：已有多个 AI 资源和使用部门的团队需要资产归属、权限及审计，而非单一聊天增强。
- [模型信息补全](#plugin-1358816037-root)：维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。

### 基础设施（10）

<a id="plugin-1333368566-root"></a>

#### [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1216](https://img.shields.io/static/v1?label=npm+30d&message=1%2C216&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/commits)

- **用途**：向观测后端发送会话遥测的部署者需要减少凭据外传，输入是遥测副本。
- **亮点**：session-telemetry/record 前置规则调用 next 后递归生成脱敏记录，不重写规范会话。
- **思考**：在统一出口处理副本有清晰边界；它是遥测防护的一层，不能替代凭据权限和全链路审计。
- **建议**：先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

<a id="plugin-1367305514-root"></a>

#### [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers) · [![npm 30d 1061](https://img.shields.io/static/v1?label=npm+30d&message=1%2C061&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) · [![最后更新 14天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=14%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1069137617/dsh-reasoning-tiers/commits)

- **用途**：自定义供应商模型缺少档位元数据时，用户需要恢复可选档位并识别无效配置。
- **亮点**：按知识表和实时模型信息生成设置补丁，带版本写入、重算冲突并记录撤销日志，不接管请求适配器。
- **思考**：配置缝修复比拦截模型请求侵入小；声明能力仍须与真实提供商行为一致。
- **建议**：先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。

<a id="plugin-1343420855-root"></a>

#### [dsh-ui-auth](../../plugins/0qwq0--dsh-ui-auth/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/commits)

- **用途**：需要让多个用户访问 DSH Web 的部署者，需要认证入口和数据访问边界。
- **亮点**：包装 HTTP 与 upgrade 入口，现代网关按会话处理认证；宿主能力缺失时 fail-closed。
- **思考**：统一入口与关闭式失败路径是有效机制；全接口安全仍依赖覆盖、宿主升级和反代配置。
- **建议**：先在隔离环境逐一测试 HTTP、WebSocket 和多用户访问，不把安装成功当成公网安全保证。

<a id="plugin-1335060007-root"></a>

#### [dsh-web-restart](../../plugins/1123762794--dsh-web-restart/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-restart) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart/commits)

- **用途**：Windows 本机调试人员希望从浏览器重启 DSH，不再切回终端。
- **亮点**：POST /restart-dsh 延迟启动隐藏 PowerShell，读取硬编码 D:\1\dsh-web-host.ps1；健康路由只报告当前进程存活。
- **思考**：便利入口不能替代可靠的进程管理；返回触发成功不能当作重启完成。
- **建议**：当前更适合参考实现，先在可丢弃 profile 验证脚本路径、失败反馈和会话恢复。

<a id="plugin-1366583376-root"></a>

#### [dsh-web-url-view](../../plugins/1032740078--dsh-web-url-view/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-url-view) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1032740078/dsh-web-url-view/commits)

- **用途**：桌面版每次重启更换端口和令牌时，用户希望有稳定的浏览器入口。
- **亮点**：固定端口代理在内部换取当前实例会话 cookie，转发 HTTP/WebSocket 并处理 Host、Origin 与 cookie。
- **思考**：稳定地址能减少复制地址的操作；将访问扩展到局域网会改变访问控制需求。
- **建议**：先保持回环绑定，测试重启后的令牌更新与拒绝外部 Origin，再考虑受控网络访问。

<a id="plugin-1363429979-plugin-usage-billing"></a>

#### [Forge 用量计费](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：需要了解模型使用支出的开发者希望把日志用量与预算放在同一视图。
- **亮点**：服务聚合账本分片并锁定价格快照，联网价表与汇率有缓存和降级；未知项目不静默记零。
- **思考**：锁定历史价格能避免改价反写旧账；价格来源或使用日志不准时，账本仍可能精确记录错误值。
- **建议**：先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。

<a id="plugin-1333357514-root"></a>

#### [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) · [![npm 30d 1208](https://img.shields.io/static/v1?label=npm+30d&message=1%2C208&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/commits)

- **用途**：需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。
- **亮点**：工具结果和事件被规范化、哈希化，再以 previousRecordHash 连接到追加记录。
- **思考**：不记录参数明文可减少隐私暴露，但也限制事后解释；不能把不可读哈希当成充分审计证据。
- **建议**：用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。

<a id="plugin-1400927706-root"></a>

#### [Quota 用量仪表](../../plugins/121212165--dsh-plugin-quota/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 138](https://img.shields.io/static/v1?label=npm+30d&message=138&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/commits)

- **用途**：长任务开发者希望在继续调用前看到消耗趋势和可能的预算边界。
- **亮点**：监听 assistant/message usage 累加本地账本，通过 systemPrompt 注入一行仪表，/qm 与工具展示统计。
- **思考**：及时可见的消耗有助于做继续决策；金额和下步预测不能替代账单与强制限额。
- **建议**：先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。

<a id="plugin-1416699252-root"></a>

#### [元冰可 AI 资源治理平台](../../plugins/01men--ybkkasi/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/01men/ybkkasi) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01men/ybkkasi/commits)

- **用途**：已有多个 AI 资源和使用部门的团队需要资产归属、权限及审计，而非单一聊天增强。
- **亮点**：Cordis 插件树装配业务域，REST gate 汇集权限声明；同时提供独立宿主与实验性 DSH 接入。
- **思考**：权限归属和资源生命周期有明确组织价值，但小团队用配置文件可能更经济。
- **建议**：仅在确有多用户资源治理需求时试部署，先验证最小权限、备份恢复和一条完整业务链。

<a id="plugin-1358816037-root"></a>

#### [模型信息补全](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-info-fill) · [![最后更新 6天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=6%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/commits)

- **用途**：维护多个自定义模型的用户需要减少重复填写上下文、输出上限与推理声明。
- **亮点**：Host 拉取并缓存能力目录，构造缺失字段操作，通过 settings.mutate 带版本写入；模型保存可单独调整。
- **思考**：不凭会思考就编造离散档位是合理边界；默认值仍是用户假设而非外部事实。
- **建议**：先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

## 更新时间

2026-10-20
