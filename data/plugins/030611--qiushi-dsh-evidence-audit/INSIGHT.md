# Qiushi Evidence Audit

> 被动观察 DSH 会话事件与工具结果，将内容摘要写入本地哈希链收据，供后续核对。

- **用途**：把会话事件与工具结果的哈希收据顺序写入本地链，辅助事后核对记录一致性。
- **亮点**：规范化 JSON、启动验证已有链、观察器异常隔离及同步卸载关闭，让有限保证可检查。
- **思考**：没有外部锚点，完整重写重算、删整文件或完整尾段都可能逃过检测；不等于可信审计账本。
- **建议**：适合单进程、私有目录内的取证流程试验；有合规或多进程诉求时先补外部锚定与写入协调。

## 版本

固定提交 [94fae130b2845309e1dcabac14696fddb18f8f3a](https://github.com/030611/qiushi-dsh-evidence-audit/tree/94fae130b2845309e1dcabac14696fddb18f8f3a)

## 场景、替代办法与合格交付

操作者需要核对一批已保存事件或工具结果是否与收据一致。合格结果是能发现未重算链的改动并解释检测不了的情形；基线是原始日志加独立签名／外部存证，而非靠本地哈希满足可信审计。

## 实现机制与依据

src/index.ts 分别观察 session/event 和 tools/result，将标识／参数／结果转为哈希；receipt.ts 做规范化JSON、序号／前链hash和同步追加。启动先验证既有文件，运行追加失败隔离于主事件流程。

本轮重点审读：[src/index.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts)、[src/receipt.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/receipt.ts)、[tests/concurrency.spec.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/tests/concurrency.spec.ts)、[tests/receipt.spec.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/tests/receipt.spec.ts)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

Cordis 4.0.1、schemastery 3.18.1、可写私有目录；默认文件在 DSH_HOME/evidence-audit。只允许每进程独立输出文件，可信时间／作者身份／防整链替换需要本插件以外的机制。

发布核查：已读取 npm latest 0.1.0；源码 package.json 为 0.1.0。版本号一致仍不证明 tarball 内容一致。未安装、未比对发布包字节。

## 用户、后台与失败流程

配置进程独立路径 → 启动校验旧链 → 观察新事件与工具结果 → 外部保存待核对原材料 → 验证链和内容摘要。损坏旧链会影响插件启动，运行时写失败则警告；恢复必须辨明缺失段，不能直接删文件当恢复成功。

## 首次、持续与迁移成本

每次观察做规范化、SHA-256和同步I/O，启动校验随历史文件长度增长；需要日志轮转与外部锚点运维。无额外模型调用，但全量内容哈希仍有CPU和磁盘成本，未实测延迟。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 4 | 323 | 4549 | — |
| .mjs | source | 5 | 212 | — | 196 |
| .ts | source | 4 | 481 | — | 404 |
| .ts | test | 5 | 467 | — | 428 |
| .mjs | example | 1 | 27 | — | 24 |

- **事件监听**：session/event、tools/result

## 工程亮点

严格拒绝非JSON值／访问器、固定哈希测试与多进程对抗测试，说明作者主动界定边界；两个事件feed可产生对同一活动的不同收据，不宜直接按行数计业务次数。writeSync并非fsync，多进程冲突只能后验发现而不能避免。

可借鉴规范化序列化、输入范围拒绝和启动校验；复用时显式决定锚点、签名、轮转和进程所有权，防止把“发现局部损坏”升级成“记录不可篡改”。

上述工程判断依据：[src/index.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts)、[src/receipt.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/receipt.ts)、[tests/concurrency.spec.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/tests/concurrency.spec.ts)、[tests/receipt.spec.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/tests/receipt.spec.ts)。

## 采用判断与最小验证

用合成事件验证单行改写、删头、完整删尾、重算全链、两进程并写和断电模拟；按预期明确记录哪些能检出。若需求包含可信作者／时间而无外部锚点，停止将其作为独立审计依据。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 1／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-19。
