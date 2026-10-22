# dsh-at-skill

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[7502c9b](https://github.com/452926826/dsh-at-skill/tree/7502c9bce1a65597188c12d4ab1e33e9365e3a22)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-at-skill)
<!-- END META -->

> **实现功能**：为 DSH 增加 @name 技能候选和发送前确定性技能加载。

> **核心亮点**：相对只给输入补全，将匹配token的Skill在模型步骤前确定性加载；同时遵循next拒绝决定、用户可调用过滤与会话cwd/scope查找，保持宿主作用域。

> **风险与缺陷**：文本token不携带来源身份。与subagent/plugin同名或用户仅讨论@名称时，宿主仍可加载匹配Skill。客户端会话缓存只在connection/reset清理，Skill变更后候选与宿主即时查找可能不同；“确定性”不等于用户意图准确。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在输入框选择可调用Skill并确保模型开始前加载其指令，减少记忆斜杠命令或依赖模型自行判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照现有斜杠Skill入口和@subagent/@plugin；本次不主张底层Skill能力由该插件创造。

客户端向inputTriggers注册@候选，按会话缓存skills列表；宿主agent/pre-step扫描用户文本中空白边界的@名称，查可调用Skill并注入带skill-invocation来源的用户消息。


DSH agents/skills和inputTriggers/connection服务；预建lib可安装，开发构建引用本地Harness路径需配置。

输入@列会话Skill候选，选择插入token；发送后pre-step查可调用Skill，将renderSkillContent注入后进入模型步骤；连接重置清候选缓存。

本地候选缓存和消息注入开销；人工为命名冲突、候选陈旧和重复指令核对，构建配置还引用本地Harness路径，升级维护需处理。

让显式Skill选择更可预测；同名歧义是文本协议边界，不能靠菜单分组消除。

**能力**

- **界面**：@Skill候选补全
- **事件监听**：agent/pre-step确定性Skill加载

> **思考**：文本token不携带来源身份。与subagent/plugin同名或用户仅讨论@名称时，宿主仍可加载匹配Skill。客户端会话缓存只在connection/reset清理，Skill变更后候选与宿主即时查找可能不同；“确定性”不等于用户意图准确。

<a id="detail-section-4"></a>

### 1.3 工程贡献

客户端注册源生命周期与连接重置缓存清理明确；宿主先尊重拒绝再追加Skill消息，查找带signal/cwd/scope。复用需保留原始用户消息与类型身份，不能将正则匹配当授权。 源码依据：[src/index.ts](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/index.ts#L28)、[src/client/index.ts](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L8)。

> **亮点**：相对只给输入补全，将匹配token的Skill在模型步骤前确定性加载；同时遵循next拒绝决定、用户可调用过滤与会话cwd/scope查找，保持宿主作用域。

<a id="detail-section-5"></a>

### 1.4 使用建议

Skill命名清晰的用户可评估；与插件或子代理重名时谨慎使用，发送前确认文本，加载不代表任务执行验收。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[452926826/dsh-at-skill](https://github.com/452926826/dsh-at-skill)
- **版本号**：0.1.0（[固定提交 7502c9b](https://github.com/452926826/dsh-at-skill/tree/7502c9bce1a65597188c12d4ab1e33e9365e3a22)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：让输入选择携带类型化skill引用并由宿主核对，可在保持补全体验时减少名称碰撞；由当前文字注入和README承认的冲突推导，需要宿主消息格式支持而非只改正则。

最小验证：建立同名Skill/子代理/插件和仅讨论@名称的消息，比较文字token与类型引用的误加载；热更新Skill后比较菜单与宿主解析一致性，若仍有误加载则假设失败。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 103 | — | — | 722 |
| .js | source | 2 | 114 | 106 | 9 | — |
| .ts | source | 3 | 111 | 96 | 2 | — |
| .js | test | 1 | 16 | 14 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/452926826/dsh-at-skill/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
