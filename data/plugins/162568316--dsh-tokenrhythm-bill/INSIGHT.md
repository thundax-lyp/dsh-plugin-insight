# dsh-tokenrhythm-bill

> 集中展示基元律动等平台的余额、用量、模型与密钥，并提供账号切换和连通探测。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[df72615](https://github.com/162568316/dsh-tokenrhythm-bill/tree/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/162568316/dsh-tokenrhythm-bill) · [![npm 30d 1667](https://img.shields.io/static/v1?label=npm+30d&message=1%2C667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tokenrhythm-bill) · [![首次发布 2026-08-31](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-31&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tokenrhythm-bill)
<!-- END META -->

**使用建议**：先只接入常用平台，对照控制台核验当前账号和限时额度，按需启用模型探测；敏感凭据留在受控宿主。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：多个中转或套餐用户需要对齐账户额度与模型清单，验收是当前账号的真实数据和明确的有效期。

此前未入档；平台控制台是对账依据，插件改善聚合入口，不替代账务真相或统一模型计费。

## 能力与限制

- **Host 路由**：账户、余额、模型、探测与平台会话代理。
- **界面**：五页签费用中心及账号/平台切换。

**流程与依赖**

需要平台账号、Cookie或key及宿主配置文件访问；依赖服务商接口和会话签名语义，网络失败不能当作余额为零。

选择平台和账号，读取余额/模型，核对有效期，按需探测；401先重新确认身份和登录，再刷新，避免跨账号缓存混用。

**兼容条件**

0.7.2，Node>=20，多文件平台适配与Web Client；可选平台需显式启用，不能认为默认全接入。

**效果与成本**

模型探测是实际调用，即使输出1token也不代表免费；Cookie续期、账号维护和平台接口漂移占人工，未测总对账成本。

- **思考**：同屏对齐到期额度和用量减少切换；平台金额聚合只有在身份、币种和冻结/限时口径一致时才有意义。

## 工程分析

- **亮点**：Host读取配置/凭据并代理平台账户接口，状态文件保存会话Cookie和账号信息；模型探测会发真实小请求，Client展示分平台面板。

Host侧限制秘密返回并为状态文件设置权限，账号缓存有身份守卫；读取凭据文件与多平台登录流程增加长期兼容负担。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：余额、套餐和模型列表依赖未统一的平台接口；Cookie过期或身份变化可能取错账户，未验证多账号切换与数据准确性。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用两个脱敏测试账号切换并模拟Cookie过期，核对限时/冻结金额和探测请求数，确认没有残留旧账号数据。

**分析版本**

固定提交 [df72615](https://github.com/162568316/dsh-tokenrhythm-bill/tree/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 17110 | 12610 | 4123 | — |
| .md | source | 2 | 299 | — | — | 23933 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/162568316/dsh-tokenrhythm-bill/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
