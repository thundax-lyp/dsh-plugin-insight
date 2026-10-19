# DSH Telemetry Redactor

> 在 DSH 遥测副本导出前遮盖支持的敏感键和凭证模式，保留原始会话日志。

- **用途**：在遥测副本送往已配置后端前遮盖支持的凭证模式，保留原始会话日志。
- **亮点**：敏感键与字符串模式联合处理，区分 token 计量字段；拒绝循环、访问器及超深记录。
- **思考**：过滤规则和监听器顺序都有边界，原始日志仍含原值；它不能作为全面数据防泄漏证明。
- **建议**：适合已有遥测导出的部署先做合成凭证试用，同时检查完整监听链和本地日志权限。

## 版本

固定提交 [811b0b1abf424e57045ab5a5eaa203660ca43908](https://github.com/030611/dsh-telemetry-redactor/tree/811b0b1abf424e57045ab5a5eaa203660ca43908)

## 场景、替代办法与合格交付

运维希望保留可观测性又降低遥测后端收到凭证的概率。合格结果是支持的假密钥在导出副本被替换、计量字段保留且原始记录不变；基线是不开遥测或后端事后清洗。

## 实现机制与依据

src/index.ts 通过 prepend 的 session-telemetry/record waterfall 对 next() 的结果递归复制脱敏。keyWords 拆分键名并保留 token counters；深度上限64，对循环和访问器拒绝。插件本身不启用后端，也不向模型增加提示。

本轮重点审读：[src/index.ts](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts)、[tests/loader-composition.spec.ts](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/tests/loader-composition.spec.ts)、[SECRET-MATRIX.md](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/SECRET-MATRIX.md)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

需要具有对应 waterfall 的宿主遥测协调器、Cordis ^4.0.1 和 schemastery 3.18.1；是否扣留异常副本由协调器行为决定。效果依赖所有出口经过此链、密钥格式在规则覆盖内，以及后续外层监听器不重新加入秘密。

发布核查：已读取 npm latest 0.1.0；源码 package.json 为 0.1.0。版本号一致仍不证明 tarball 内容一致。未安装、未比对发布包字节。

## 用户、后台与失败流程

安装到已有遥测 profile → 检查组合配置 → 用合成记录发送 → 查看后端副本与原始会话 → 对新增密钥格式补测试。故障时要辨认是单条导出被扣留、后端异常还是链路绕过，不能只看模型继续运行就认为保护成立。

## 首次、持续与迁移成本

不新增模型调用；每条副本同步遍历，成本随内容大小增长。首次成本是规则矩阵与出口盘点，持续成本是格式变化、监听顺序与性能回归；不在本轮编造吞吐或延迟。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 8 | 393 | 4906 | — |
| .mjs | source | 4 | 110 | — | 102 |
| .ts | source | 4 | 313 | — | 273 |
| .ts | test | 3 | 408 | — | 363 |

- **事件监听**：1 个遥测 waterfall

## 工程亮点

实现短且安全边界写得较具体，覆盖键名碰撞、对象形态和深度，测试包含组合与对抗用例。65层拒绝有上限，但宽而浅记录仍线性耗时。作者测试结果和官方fixture只是仓库材料，本轮未独立执行。

可借鉴复制变换、拒绝不支持对象及明确 secret matrix；移植时绑定真实的导出协调器，验证异常被扣留，避免只复用正则就声称整个系统 fail-closed。

上述工程判断依据：[src/index.ts](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts)、[tests/loader-composition.spec.ts](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/tests/loader-composition.spec.ts)、[SECRET-MATRIX.md](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/SECRET-MATRIX.md)。

## 采用判断与最小验证

构造已覆盖密钥、未知格式、token counters、64/65层、键名碰撞和外层后置注入，核查后端实际收到的字节及代理主流程。未知格式通过时应缩小保护声明，不能以整体测试通过掩盖。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 1／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-19。
