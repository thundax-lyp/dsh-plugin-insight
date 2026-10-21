# dsh-compaction-route

> 为会话压缩请求指定主模型和备用模型，在失败时切换摘要路由。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6039b26](https://github.com/643048695/dsh-compaction-route/tree/6039b260d96652ce4af606f850cd1a179cd9d4f7)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/643048695/dsh-compaction-route)
<!-- END META -->

**使用建议**：已遇到压缩路由失败时可试。先检查主备都支持实际输入量和推理档位，再测取消、失败及摘要完整性。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代是手工更换摘要模型或宿主原生单路由；项目提供请求级主备而非更好的压缩算法。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js仅拦截purpose=compaction的llm/stream；重新进入ctx.llm.stream传修改路由，以WeakSet避免递归，收集单次流块后按终止状态切换fallback。

- **事件监听**：purpose=compaction的llm/stream主备路由
- **界面**：压缩路由配置

Schemastery、可用llm服务及宿主purpose=compaction约定，主备模型需凭据和足够输入窗口。

压缩请求→读取热配置→primary→检查终止状态→失败尝试fallback→返回选定尝试；用户取消应停止而非继续切换。

<a id="detail-section-4"></a>

### 成本与效果

首次配置有效主备provider/model；失败会多一次摘要请求并增加延迟，现金可能含失败调用，人工需核对压缩后事实和备用路由权限。

可改善单点故障可恢复性，但无真实宿主故障率或长会话成功率数据。

<a id="detail-section-5"></a>

### 工程亮点

WeakSet处理Cordis next闭包不能改参的约束，未配置primary时透明放行；按purpose隔离易复用。全流缓冲及结束标记语义需要与宿主协议保持一致。

源码依据：[lib/index.js](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合主聊天模型可用但压缩模型额度或窗口不足的长会话用户。

- **建议**：待验证假设：主备选择同时核对请求估算与目标模型窗口，可降低盲目重试。用不同窗口和限流故障矩阵比较有效摘要率、请求次数与费用；若估算不准导致误跳过健康路由，则保持显式选择。

已遇到压缩路由失败时可试。先检查主备都支持实际输入量和推理档位，再测取消、失败及摘要完整性。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **事件监听**：purpose=compaction的llm/stream主备路由
- **界面**：压缩路由配置

- **思考**：切换同一长请求到备用模型不保证窗口适配，fallback也可能同样溢出。collectAttempt缓冲整个流，outcomeOf没找到finish会视作无failure，这使异常截断边界值得重点验证；兼容provider的reasoning effort也需检查。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者针对压缩无备用路由的问题；可确认贡献是在请求瀑布层限定purpose，给摘要加入显式主备，而不影响聊天、标题等请求。相对手动改配置重试，故障路径更集中；摘要质量仍取决于实际后端与模型。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[643048695/dsh-compaction-route](https://github.com/643048695/dsh-compaction-route)
- **版本号**：0.1.0（[固定提交 6039b260](https://github.com/643048695/dsh-compaction-route/tree/6039b260d96652ce4af606f850cd1a179cd9d4f7)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：覆盖错误finish、缺finish、迭代器抛错、取消、超窗口与不支持effort；本轮未执行目标代码。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：主备选择同时核对请求估算与目标模型窗口，可降低盲目重试。用不同窗口和限流故障矩阵比较有效摘要率、请求次数与费用；若估算不准导致误跳过健康路由，则保持显式选择。

覆盖错误finish、缺finish、迭代器抛错、取消、超窗口与不支持effort；本轮未执行目标代码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：2646bafa9b771a282f5d80d3e721ffa35ef3bf94078176401ef19cb034b2da76。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 308 | — | — | 3291 |
| .js | source | 2 | 685 | 482 | 157 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+created%3A2026-09-21T03%3A09%3A58.752Z..2026-10-21T03%3A09%3A58.752Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
