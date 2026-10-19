# DSH Verification Receipt

> 在每轮会话结束后生成隐私最小化的工具活动与验证信号摘要，并保存为本地 JSONL 收据。

- **用途**：为每轮已记录工具活动生成隐私最小化 JSONL 摘要，提示可能发生的验证动作。
- **亮点**：不保存工具参数／正文，按 turn/end 投影工具结果，并在卸载时关闭接收、等待写队列排空。
- **思考**：词法命中 test/check 不证明测试执行或代码正确；独立行哈希也不能证明日志未删改。
- **建议**：适合排查“这一轮记录了什么”的开发者试用，不能替代 CI、测试产物或审计放行。

## 版本

固定提交 [87f3fb0198090f0f26a37a52840db150609db748](https://github.com/030611/dsh-verification-receipt/tree/87f3fb0198090f0f26a37a52840db150609db748)

## 场景、替代办法与合格交付

开发者需要快速发现代理似乎没做验证的回合；合格结果是摘要与原始事件一致、不会把回显文本当验收结论。基线是查看工具日志和真实测试报告。

## 实现机制与依据

src/index.ts 在 session/event 的 turn/end 回调 snapshotEvents，交给 receipt.ts 做该轮投影；工具名称／command词法分类测试、lint、build等。JSONL writer 用 promise链串行追加，dispose 时先关gate、取消监听再drain。

本轮重点审读：[src/index.ts](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts)、[src/receipt.ts](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts)、[tests/receipt.spec.ts](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/tests/receipt.spec.ts)、[docs/compatibility-0.1.1.md](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/docs/compatibility-0.1.1.md)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

支持范围明确锁在 DSH 0.1.2-alpha.3／4／5，Node ^22.19.0 或 >=24.0.0，宿主 sessions 与 Cordis；本地路径必须可写。效果取决于工具参数形态、持久事件完整性和状态语义，不存在任意宿主／自定义shell都能正确识别的保证。

发布核查：已读取 npm latest 0.1.0；源码 package.json 为 0.1.1。两者版本不同，默认分支机制不代表当前 npm 包具备相同行为。未安装、未比对发布包字节。

## 用户、后台与失败流程

安装到指定 profile → 完成一轮 → 读取 receipts.jsonl → 对照真实命令产物 → 定位缺失验证；后台任务可能留 unresolved，需要额外查 job 结果。写入失败记警告，不阻断代理，所以不能以文件没报错推断完整性。

## 首次、持续与迁移成本

不新增模型调用，增加每轮事件投影、哈希和异步磁盘写入；长期有文件保留与分析成本。首次需确认宿主窄版本支持，升级迁移需重验事件结构。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 5 | 482 | 4515 | — |
| .mjs | source | 2 | 131 | — | 124 |
| .ts | source | 3 | 424 | — | 327 |
| .ts | test | 3 | 391 | — | 361 |

- **事件监听**：turn/end
- **后台**：1 个 JSONL 写队列

## 工程亮点

纯投影与宿主挂载分离、卸载排空顺序可审读；正则不解析shell语义，因此 echo含test 的文本可命中。未绑定可信测试产物、无链锚；源码清楚标明 execution-trace-only 是优点，也限定了它能承担的责任。

可借鉴最小化持久字段和卸载gate／drain设计；移植时把摘要指标与验收证据分开存储，别让 succeeded 字段进入质量门禁。

上述工程判断依据：[src/index.ts](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts)、[src/receipt.ts](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts)、[tests/receipt.spec.ts](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/tests/receipt.spec.ts)、[docs/compatibility-0.1.1.md](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/docs/compatibility-0.1.1.md)。

## 采用判断与最小验证

输入真实失败命令、echo tests、后台命令、别名和嵌套工具，逐条对照产物；模拟磁盘拒写和中途卸载。只有发现误报／漏报不会导致放行且记录完整性可解释，才扩大使用。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 2／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-19。
