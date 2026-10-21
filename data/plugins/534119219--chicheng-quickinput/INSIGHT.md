# chicheng-quickinput（vault）

> 在 DSH 输入区管理常用信息与私密记录，支持自动识别建议和 WebDAV 备份。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[ac7c50b](https://github.com/534119219/chicheng-quickinput/tree/ac7c50b364bec5899a96628c5cbefb19b8dc6bea)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-quickinput)
<!-- END META -->

**使用建议**：先只存非敏感常用片段；在建议明文写盘问题修正并验证前，关闭自动识别且不要把它当安全凭据库。私密片段进入草稿或发送前应检查会话与模型接收范围。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
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

频繁在DSH输入地址、服务器或凭据的人保存常用片段并填入草稿；含私密内容时需要同时核对加密库、建议缓存与会话记录。

参照密码管理器、片段工具与手工复制；没有实测达到通用密码管理器的安全保障。

<a id="detail-section-3"></a>

### 能力、流程与依赖

host监听session/event提取模式并排队建议、持久化store与suggestions、代理WebDAV；client用PBKDF2和AES-GCM包裹随机库密钥、解锁私密记录，并调用inputActions.setDraft/submit。

- **事件监听**：会话模式识别与待收录建议。
- **Host 路由**：库/建议管理及WebDAV代理。
- **界面**：记录搜索、解锁、填入与发送。

浏览器WebCrypto、DSH session/event和inputActions、可用WebDAV目标与host HTTP fence；恢复会覆盖当前库需独立备份。

会话事件→模式识别→pending建议及明文缓存→用户确认收录→私密加密或普通明文store→点击填入草稿/快捷发送→可选WebDAV备份；锁库不清除既有会话内容。

仓库名quickinput、包/界面称vault；web bundle，数据在DSH_HOME/vault，非私密记录明文；WebDAV配置解锁后通过host代理出站。

<a id="detail-section-4"></a>

### 效果、成本与限制

可减少重复查找输入，但当前无法支持“自动识别不落明文”的安全价值承诺；敏感场景采用价值受该路径直接限制。

首次分类私密性、设主密码和安全词、核对建议缓存；持续需管理备份、锁定与会话外发，迁移须先保留原件。无付费服务必需证据，人工安全核查与误发送代价未量化。

私密明文是否只存在解锁后的浏览器内存？queueSuggestions把item.value保存在pending，flushSuggestions将pending写入suggestions.json，覆盖密钥/JWT等识别候选；hash用于去重并未去掉value。这与README明确承诺冲突，库记录加密不能补偿前置建议明文副本。点击私密记录填入/直接发送后还会进入会话和模型请求，库锁定也不能撤回这些副本。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对通用剪贴板或手工复制，增量是直接接DSH会话识别和输入动作，把待收录建议、常用字段与私密库整合；密码派生与AES-GCM来自WebCrypto。随机K分别由主密码/安全词包裹使重置不必重加密每条记录，是成熟信封加密在此流程的应用。

host识别与client WebCrypto分离、随机K多重包裹及原子JSON写入有借鉴处；需要把数据流全链路纳入威胁模型，不能只审加密store而遗漏pending与会话副本。

源码依据：[lib/index.js](https://github.com/534119219/chicheng-quickinput/blob/ac7c50b364bec5899a96628c5cbefb19b8dc6bea/lib/index.js)、[lib/client.js](https://github.com/534119219/chicheng-quickinput/blob/ac7c50b364bec5899a96628c5cbefb19b8dc6bea/lib/client.js)、[test/crypto.test.mjs](https://github.com/534119219/chicheng-quickinput/blob/ac7c50b364bec5899a96628c5cbefb19b8dc6bea/test/crypto.test.mjs)、[README.md](https://github.com/534119219/chicheng-quickinput/blob/ac7c50b364bec5899a96628c5cbefb19b8dc6bea/README.md)、[package.json](https://github.com/534119219/chicheng-quickinput/blob/ac7c50b364bec5899a96628c5cbefb19b8dc6bea/package.json)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：频繁在DSH输入地址、服务器或凭据的人保存常用片段并填入草稿；含私密内容时需要同时核对加密库、建议缓存与会话记录。

- **建议**：待验证假设：自动识别只在内存保留短时候选，用户明确收录后立即经浏览器加密，再持久化密文与hash，可消除建议文件的敏感旁路。依据是现有识别与加密路径分离，当前未实现。以已知测试密钥触发建议、重启、收录、拒绝和锁定，扫描所有插件文件及备份确认无明文；同时测重启后丢建议的可接受性，不能把丢失提示作为无损设计。

先只存非敏感常用片段；在建议明文写盘问题修正并验证前，关闭自动识别且不要把它当安全凭据库。私密片段进入草稿或发送前应检查会话与模型接收范围。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认加密记录与快捷输入，但作者“自动识别只存hash、不落明文”被当前pending写盘路径反驳；未验证真实加密迁移或备份恢复。未来缓存改造是假设。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **事件监听**：会话模式识别与待收录建议。
- **Host 路由**：库/建议管理及WebDAV代理。
- **界面**：记录搜索、解锁、填入与发送。

- **思考**：私密明文是否只存在解锁后的浏览器内存？queueSuggestions把item.value保存在pending，flushSuggestions将pending写入suggestions.json，覆盖密钥/JWT等识别候选；hash用于去重并未去掉value。这与README明确承诺冲突，库记录加密不能补偿前置建议明文副本。点击私密记录填入/直接发送后还会进入会话和模型请求，库锁定也不能撤回这些副本。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对通用剪贴板或手工复制，增量是直接接DSH会话识别和输入动作，把待收录建议、常用字段与私密库整合；密码派生与AES-GCM来自WebCrypto。随机K分别由主密码/安全词包裹使重置不必重加密每条记录，是成熟信封加密在此流程的应用。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.1.0；版本日期：2026-08-26（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[ac7c50b3](https://github.com/534119219/chicheng-quickinput/tree/ac7c50b364bec5899a96628c5cbefb19b8dc6bea)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读候选识别/持久化、WebDAV代理与浏览器加密/输入动作；未运行密码库、测试、迁移或真实备份，不作完整密码学审计。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a8b2c5dbf47a78c361db6d26d8660f23b7b2f52032699cd12f36dd4e02bb8942。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 196 | — | — | 3688 |
| .js | source | 2 | 3154 | 2746 | 199 | — |
| .mjs | test | 4 | 863 | 696 | 101 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：自动识别只在内存保留短时候选，用户明确收录后立即经浏览器加密，再持久化密文与hash，可消除建议文件的敏感旁路。依据是现有识别与加密路径分离，当前未实现。以已知测试密钥触发建议、重启、收录、拒绝和锁定，扫描所有插件文件及备份确认无明文；同时测重启后丢建议的可接受性，不能把丢失提示作为无损设计。

用合成凭据在隔离目录追踪suggestions/store/备份/会话各副本，覆盖锁定、迁移、恢复和重启；当前只做源码对照，不接触真实秘密。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/534119219/chicheng-quickinput/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
