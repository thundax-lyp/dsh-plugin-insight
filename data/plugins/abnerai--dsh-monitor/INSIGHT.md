# dsh-monitor

> 轮询文件或命令输出，将新增内容送入 DSH 会话并唤醒 Agent。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[4ef3cc6](https://github.com/AbnerAI/dsh-monitor/tree/4ef3cc6f3e4332a85d913a13ae929f5eb587818a)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AbnerAI/dsh-monitor) [![npm 30d 831](https://img.shields.io/static/v1?label=npm+30d&message=831&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-monitor) [![首次发布 2026-08-14](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-monitor)
<!-- END META -->

**使用建议**：仅在已授权、可信本地消息源且能接受进程内监视语义时评估；不据“persistent”措辞当作跨重启队列或权限隔离。

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

- **用途**：Agent在等待追加式消息源时避免自行忙轮询；交付物是属于原Agent的插件notice，不是监控源事实已核验。

- **建议**：把每watcher做串行状态机：完整行缓冲、owner校验、投递确认后推进游标，并显式定义重启恢复，可能改善可靠性。用半行分次追加、命令超poll时长、两个会话互停和投递失败案例，要求不拆消息、不重叠、不跨会话并可说明未知投递；没有回执时应标至少一次/可能丢失而非“已送达”。

仅在已授权、可信本地消息源且能接受进程内监视语义时评估；不据“persistent”措辞当作跨重启队列或权限隔离。

核查状态：文件/命令轮询与唤醒接线可确认；可靠投递、会话隔离和跨重启持久未获验证，源码watcher仅内存。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

模型自己轮询shell、宿主调度或外部消息队列；本项轻量适合单进程观察，不替代带ack/持久化/授权的队列。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：monitor、monitor_list、monitor_stop管理后台watcher。
- **后台**：定时读文件或执行shell，按Agent idle/busy送followup/inject。

**流程与依赖**

monitor创建内存watcher，文件从当前尾部记录字节游标，命令定时/bin/sh -c并对stdout作前缀差分；新增内容封成plugin notice，idle用followup、busy用inject。monitor_list与monitor_stop管理同插件Map，卸载清timer。

DSH tools/systemPrompt和Agent followup/inject、Node文件读取与POSIX shell，命令10秒timeout/maxBuffer16MiB；文件/命令权限由进程继承。

Agent显式arm→从文件当前尾开始或执行命令→定时差分→notice唤醒→list/stop；进程重启丢watcher，文件截断从头读，命令输出变更非追加时整体重发。

MIT DSH bundle，依赖宿主schemastery/llm/tools/systemPrompt；命令硬编码/bin/sh，README跨工具类比不证明跨平台运行。

**效果与成本**

现金为唤醒Agent产生的模型调用，命令可自行触发外部费用；人工选择可信只读命令、管理watcher和处理失败。文件每次变化readFileSync全文件，增长日志有IO与内存开销。

把重复轮询从模型上下文移到后台，有条件节省等待开销；未量化token/延迟，重叠命令和重复唤醒可能抵消。

- **思考**：新增消息能否不丢不重且仅原会话可管理？文件按当前size推进游标，即使末行没换行也发送，下一段会成为另一条；setInterval的async tick无busy锁，慢命令可重叠并乱序更新cursor。list列全部watcher，stop仅按ID不校owner；计数在未await followup/inject后递增。maxNoticeBytes配置被读但未用于noticeFor，不能承诺配置的字节上限。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把Agent忙等改成后台timer，在宿主空闲与运行中使用不同消息入口，统一文件与命令差分；相较Agent循环调用shell减少上下文轮询。作者以Claude Monitor作类比，但本项并非同等耐久消息队列或完整跨会话授权。

把Agent忙等改成后台timer，在宿主空闲与运行中使用不同消息入口，统一文件与命令差分；相较Agent循环调用shell减少上下文轮询。作者以Claude Monitor作类比，但本项并非同等耐久消息队列或完整跨会话授权。

消息有plugin/notice来源，空闲与忙态走宿主不同入口、卸载有清理；但游标与投递非事务，Map共享且stop未核owner，不能由有timer清理推断可靠消息系统。

固定源码依据：[lib/index.js](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js)、[package.json](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/package.json)、[cordis.patch.yml](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

新增消息能否不丢不重且仅原会话可管理？文件按当前size推进游标，即使末行没换行也发送，下一段会成为另一条；setInterval的async tick无busy锁，慢命令可重叠并乱序更新cursor。list列全部watcher，stop仅按ID不校owner；计数在未await followup/inject后递增。maxNoticeBytes配置被读但未用于noticeFor，不能承诺配置的字节上限。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.1；版本日期：2026-08-14（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[4ef3cc6f](https://github.com/AbnerAI/dsh-monitor/tree/4ef3cc6f3e4332a85d913a13ae929f5eb587818a)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根lib/index.js完整监听生命周期、文件差分、命令执行与三工具注册，README及package；未运行目标或命令，不验证Claude工具等价性。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

把每watcher做串行状态机：完整行缓冲、owner校验、投递确认后推进游标，并显式定义重启恢复，可能改善可靠性。用半行分次追加、命令超poll时长、两个会话互停和投递失败案例，要求不拆消息、不重叠、不跨会话并可说明未知投递；没有回执时应标至少一次/可能丢失而非“已送达”。

未执行；最小验证覆盖分块半行、轮询重叠、输出回退、投递拒绝、跨会话list/stop及重启，并分别记录读取与送达状态。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 383 | 324 | 41 | — |
| .md | source | 1 | 130 | — | — | 714 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbnerAI/dsh-monitor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AbnerAI/dsh-monitor/issues?q=is%3Aissue+created%3A2026-09-21T05%3A34%3A26.816Z..2026-10-21T05%3A34%3A26.816Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
