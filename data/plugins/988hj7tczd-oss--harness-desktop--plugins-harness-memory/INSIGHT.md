# harness-memory

> 为 DSH 保存长期记忆，并在后续会话的系统提示中分类注入。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9808ab7](https://github.com/988hj7tczd-oss/harness-desktop/tree/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/harness-desktop) · [![npm 30d 224](https://img.shields.io/static/v1?label=npm+30d&message=224&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/harness-memory) · [![首次发布 2026-03-29](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-03-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/harness-memory)
<!-- END META -->

**使用建议**：个人先保存少量非敏感稳定偏好；跨项目使用前核对适用范围，重要约定保留文档真相，定期清理错误记忆。

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

- **用途**：个人跨会话保留偏好、项目约定和成功做法，交付持久文本记忆；需自己管理过期和敏感信息。

- **建议**：待验证假设：为记忆增加来源、适用项目/用户、有效期和冲突关系，并按当前任务检索，可减少陈旧/越域指令。由全表最近注入与精确文本去重推导，未实现。用双项目矛盾规则、超过50条和过期偏好对照误召回/漏重要约定与token成本；模型提炼不能自作真值。

个人先保存少量非敏感稳定偏好；跨项目使用前核对适用范围，重要约定保留文档真相，定期清理错误记忆。

核查状态：源码确认存取与注入；未验证storage持久恢复、真实召回效果或多用户隔离。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照手写AGENTS/偏好文件和常规KV记忆；不声称语义记忆创新。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：memory_save与memory_forget。
- **后台**：持久记忆域与分类系统提示注入。

**流程与依赖**

组件index声明storageDomain表，memory_save按完整文本去重更新tags/时间，forget按ID或完整文本删；systemPrompt每次按updatedAt取最近maxMemories并按tag分类。

DSH storageDomain、systemPrompt、tools与组件依赖；持久性由宿主存储提供。

用户/Agent保存文本→精确去重入表→后续组装最近条目分类注入→按ID/文本删除；没有自动过期或检索验证。

plugins/harness-memory子包，依赖storageDomain/systemPrompt/tools及zod/schemastery；不能从根桌面发行版推断子包独立安装已验。

**效果与成本**

首次匹配存储域，持续清理过期/矛盾记忆和系统提示token；人工维护和收益未测。

降低重复描述上下文，但不能保证记忆真实、完整或在正确场景生效。

- **思考**：长期记忆是否可靠且范围合适？表未按会话/项目/用户分区，所有记忆直接注入系统提示；最近50条排序会挤掉旧但重要约定，文本精确去重不处理矛盾。工具描述称ID可从提示获得，render实际只列text无ID，删除便利也需核对。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对反复手贴偏好，增量是DSH存储域加工具和每次组装时分类注入，简单且透明；没有语义检索/自动事实验证，不将宿主整套桌面能力算入本组件。

相对反复手贴偏好，增量是DSH存储域加工具和每次组装时分类注入，简单且透明；没有语义检索/自动事实验证，不将宿主整套桌面能力算入本组件。

声明存储schema与lifecycle close、每次提示求值不另缓存可借鉴；需要来源/范围控制及暴露稳定删除ID。

固定源码依据：[plugins/harness-memory/index.js](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/index.js)、[plugins/harness-memory/package.json](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/package.json)、[plugins/harness-memory/cordis.patch.yml](https://github.com/988hj7tczd-oss/harness-desktop/blob/9808ab77392c7cd285f87de094daff1fcd322109/plugins/harness-memory/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

长期记忆是否可靠且范围合适？表未按会话/项目/用户分区，所有记忆直接注入系统提示；最近50条排序会挤掉旧但重要约定，文本精确去重不处理矛盾。工具描述称ID可从提示获得，render实际只列text无ID，删除便利也需核对。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.0；版本日期：2026-08-31（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[9808ab77](https://github.com/988hj7tczd-oss/harness-desktop/tree/9808ab77392c7cd285f87de094daff1fcd322109)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：仅组件3文件统计，抽读index与manifest/bundle；根README仅提供作者记忆功能说明，不审整套desktop。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：为记忆增加来源、适用项目/用户、有效期和冲突关系，并按当前任务检索，可减少陈旧/越域指令。由全表最近注入与精确文本去重推导，未实现。用双项目矛盾规则、超过50条和过期偏好对照误召回/漏重要约定与token成本；模型提炼不能自作真值。

隔离存储测试重启、同文更新、矛盾条目、50条截断、ID删除与双项目隔离；本轮不执行。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 218 | 172 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/harness-desktop/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
