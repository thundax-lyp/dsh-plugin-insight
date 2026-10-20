# dsh-vision-fallback

> 将 DSH 图片交给独立视觉模型，并把观察结果返回当前主模型。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e94fffb](https://github.com/1HelloMan1/dsh-vision-fallback/tree/e94fffbfd1297881e80a1a02304e116541d01368)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-vision-fallback) · [![npm 30d 932](https://img.shields.io/static/v1?label=npm+30d&message=932&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback)
<!-- END META -->

**使用建议**：适合确需保留纯文本主模型的图片任务；先核对视觉服务的数据范围和难图准确率，重要文字回看原图。

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

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：偏好纯文本主模型的用户仍需处理截图或图片；交付物是主模型基于视觉观察形成的回答。

采用建议：适合确需保留纯文本主模型的图片任务；先核对视觉服务的数据范围和难图准确率，重要文字回看原图。

参照手动视觉模型切换与主模型原生多模态；未做精度、隐私或延迟实测。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：视觉模型设置
- **后台**：图片视觉预处理、观察缓存与压缩复用

**流程与依赖**

需要符合声明的 DSH 附件、LLM、凭据和 settings 服务，视觉 API 账号/密钥、可联网模型；附件读取仍经过宿主策略，近期上下文默认会进入视觉提示。

配置视觉模型和凭据；发送图片后按能力判断是否转交，读取附件、生成观察并替换模型输入；失败删除缓存项以供重试；压缩请求复用已有观察或占位，而非保证重新识图成功。

**效果与成本**

每张图增加视觉 API 费用、预处理延迟及主模型读取观察的token；缓存减少重复请求但错误观察也可能被复用；人工成本是识别失败和重要图中文字复核。

减少切模型步骤的集成价值有源码依据；两模型组合未必比单视觉模型更便宜或准确。

- **思考**：观察文本会成为主模型看到的替代输入，关键是视觉误读是否被主模型当成图像事实。近期上下文能改善问题相关性，也增加向外部 API 暴露文本的范围；缓存隔离了会话与消息，但不证明观察准确。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手动切换视觉模型并复制描述，增量是把视觉作为受限预处理并保留主模型工作流；lib/index.js 的压缩旁路复用避免摘要请求再反复发图。视觉识别能力属于外部模型，不是插件原创。

相对手动切换视觉模型并复制描述，增量是把视觉作为受限预处理并保留主模型工作流；lib/index.js 的压缩旁路复用避免摘要请求再反复发图。视觉识别能力属于外部模型，不是插件原创。

lib/index.js 的缓存键绑定附件与会话消息，失败清缓存；重入 WeakSet 避免压缩 stream 递归，且构造新对象适配宿主冻结请求。可借鉴分层预处理，但 surface 与压缩生命周期耦合需版本回归。 源码：[lib/index.js](https://github.com/1HelloMan1/dsh-vision-fallback/blob/e94fffbfd1297881e80a1a02304e116541d01368/lib/index.js)、[lib/client.js](https://github.com/1HelloMan1/dsh-vision-fallback/blob/e94fffbfd1297881e80a1a02304e116541d01368/lib/client.js)。

<a id="detail-section-5"></a>

### 主要限制

观察文本会成为主模型看到的替代输入，关键是视觉误读是否被主模型当成图像事实。近期上下文能改善问题相关性，也增加向外部 API 暴露文本的范围；缓存隔离了会话与消息，但不证明观察准确。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：同一组含小字、歧义和敏感上下文的截图，对比原生视觉主模型、手动描述与自动旁路；统计答案正确率、错误继承、总token和延迟。若额外证据不减错误则不增加这层格式负担。

**分析版本**

- **仓库**：[1HelloMan1/dsh-vision-fallback](https://github.com/1HelloMan1/dsh-vision-fallback)
- **版本号**：0.10.0（[固定提交 e94fffb](https://github.com/1HelloMan1/dsh-vision-fallback/tree/e94fffbfd1297881e80a1a02304e116541d01368)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：让视觉观察对不确定文字给出坐标/局部证据，并在主模型回答中追踪不确定性，可降低两阶段推理过度自信。由“原图变观察文本”的信息瓶颈推导，额外输出长度必须计入同预算对照。

同一组含小字、歧义和敏感上下文的截图，对比原生视觉主模型、手动描述与自动旁路；统计答案正确率、错误继承、总token和延迟。若额外证据不减错误则不增加这层格式负担。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 419 | — | — | 3582 |
| .js | source | 2 | 1216 | 1080 | 50 | — |
| .mjs | test | 1 | 1084 | 1017 | 4 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1HelloMan1/dsh-vision-fallback/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
