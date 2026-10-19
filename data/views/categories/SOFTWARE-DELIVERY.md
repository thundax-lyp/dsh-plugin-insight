# 软件交付

[返回首页](../../../README.md)

## 分类导航

- [DSH Verification Receipt](#plugin-1333370288-root)：为每轮已记录工具活动生成隐私最小化 JSONL 摘要，提示可能发生的验证动作。
- [dsh-project-memory](#plugin-1339316901-root)：在同一开发项目跨会话恢复任务、文件线索和经验，减少重复梳理。
- [Qiushi Evidence Audit](#plugin-1333357514-root)：把会话事件与工具结果的哈希收据顺序写入本地链，辅助事后核对记录一致性。

### 软件交付（3）

<a id="plugin-1333370288-root"></a>

#### [DSH Verification Receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) · [![npm 30d 873](https://img.shields.io/static/v1?label=npm+30d&message=873&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) · 最后更新：1个月前（2026-09-03）

- **用途**：为每轮已记录工具活动生成隐私最小化 JSONL 摘要，提示可能发生的验证动作。
- **亮点**：不保存工具参数／正文，按 turn/end 投影工具结果，并在卸载时关闭接收、等待写队列排空。
- **思考**：词法命中 test/check 不证明测试执行或代码正确；独立行哈希也不能证明日志未删改。
- **建议**：适合排查“这一轮记录了什么”的开发者试用，不能替代 CI、测试产物或审计放行。

<a id="plugin-1339316901-root"></a>

#### [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4537](https://img.shields.io/static/v1?label=npm+30d&message=4%2C537&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) · 最后更新：前天（2026-10-17）

- **用途**：在同一开发项目跨会话恢复任务、文件线索和经验，减少重复梳理。
- **亮点**：12 个工具把任务、文档／代码索引和有出处召回接起来，默认自动注入与可选增强分开。
- **思考**：检索方便不等于任务恢复正确；项目经验进入全局作用域后是否误召回，仍需对照测试。
- **建议**：适合同项目反复中断的开发者小规模试用，先与交接文档加 rg 对照，暂不作安装推荐。

<a id="plugin-1333357514-root"></a>

#### [Qiushi Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) · [![npm 30d 1190](https://img.shields.io/static/v1?label=npm+30d&message=1%2C190&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) · 最后更新：2个月前（2026-08-14）

- **用途**：把会话事件与工具结果的哈希收据顺序写入本地链，辅助事后核对记录一致性。
- **亮点**：规范化 JSON、启动验证已有链、观察器异常隔离及同步卸载关闭，让有限保证可检查。
- **思考**：没有外部锚点，完整重写重算、删整文件或完整尾段都可能逃过检测；不等于可信审计账本。
- **建议**：适合单进程、私有目录内的取证流程试验；有合规或多进程诉求时先补外部锚定与写入协调。

## 更新时间

2026-10-19
