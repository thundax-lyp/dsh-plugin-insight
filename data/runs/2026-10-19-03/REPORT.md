# 十插件研究：采用价值与证据边界

## 范围与来源

运行 20261019T091725Z-init10，列表截止 2026-10-19T09:22:16.636Z，2026-10-19（北京时间）。用户显式调用 init 10；本轮研究上限10，按主目录结构化文件名顺序，在身份已确认的候选中取前10。单插件洞察完成后才归纳列表与推荐，未执行目标代码或安装插件。

- [主目录](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/13dcda27177db72e1004b6116f0d589675176fba)：data/plugins 5,945 个结构化条目。README 超过 Contents API 内联大小限制，本次通过固定SHA的Git blob补取；只读checkout也固定在相同SHA。
- [补充目录](https://github.com/0xsline/awesome-deepseek-harness/tree/cd4faf97da814f06fab4a5e307e5ba0f62c638af)：读取 README 与 CATALOG；收集GitHub根仓库链接，合并来源，不把链接自动认作可安装插件。
- [原始候选](snapshots/PLUGIN-CANDIDATES.json)：共7,401条候选引用；[身份查询](snapshots/REPOSITORY-IDENTITIES.json)核实6,787个仓库，318个仓库无法确认；对应319条候选引用单独保存在[问题清单](snapshots/UNRESOLVED-CANDIDATES.json)。GraphQL按80仓库分批，共89批，保留每个缺失身份的错误；没有伪造ID。
- [固定会话](SESSION.json)：去重后6,966个已核实仓库身份的组件候选，本轮所选10、完成10、受阻0、未选6,956。组件路径来自条目URL，尚未深评条目的类型、安装性、组件边界仍待核查；根仓库引用和子组件可同时存在，不能把6,966称作可用插件数。

来源 complete=false：候选身份存在缺口、补充目录包含工具与资料、前轮只是3插件样本，不能据此推断生态删除或全量可用性。未确认身份候选在入队前排除；已选后受阻仍占额度。本次无研究受阻项，不代表无采集失败。

## 变化与结果

相对前轮三插件样本，完整候选列表标记added 6,963、content_changed 3、removed_from_source 0；added仅表示进入本工程候选，不能当作近期发布。所选10项中9项首次纳入深评，1项重新分析。memory提交仍为fe7ac6c；本轮调整兼容性指纹输入口径，使机器标记content_changed，不能据此声称源码新增功能。未选的旧发票和TaskSwarm结论与原始材料保留在catalog／历史文件中，不作为本轮新研究推荐。

| [dsh-project-memory](insights/00080000--dsh-project-memory.md) | content_changed | complete | 检索方便不等于任务恢复正确；项目经验进入全局作用域后是否误召回，仍需对照测试。 |
| [dsh-status-rotator](insights/01virex--dsh-status-rotator.md) | added | complete | 装饰层已带来较大的前后端维护面；更多动效是否帮助判断运行状态，还是增加干扰和兼容负担？ |
| [元冰可 ybkkasi](insights/01men--ybkkasi.md) | added | complete | 它是平台型工程而非轻量增效插件；DSH 形态仍为 experimental，治理模型是否贴合现有业务比功能数量更重要。 |
| [api-balance](insights/02muller25--dsh-api-balance.md) | added | complete | 余额不是任务预算或成本预警；凭证被拼入 curl 子进程命令，不能将“不发给浏览器”写成“不出宿主进程”。 |
| [DSH Telemetry Redactor](insights/030611--dsh-telemetry-redactor.md) | added | complete | 过滤规则和监听器顺序都有边界，原始日志仍含原值；它不能作为全面数据防泄漏证明。 |
| [DSH Verification Receipt](insights/030611--dsh-verification-receipt.md) | added | complete | 词法命中 test/check 不证明测试执行或代码正确；独立行哈希也不能证明日志未删改。 |
| [Qiushi Evidence Audit](insights/030611--qiushi-dsh-evidence-audit.md) | added | complete | 没有外部锚点，完整重写重算、删整文件或完整尾段都可能逃过检测；不等于可信审计账本。 |
| [dsh-discord-richpresence](insights/0qwq0--dsh-discord-richpresence.md) | added | complete | 社交可见性不是任务完成提醒或效率证明；丰富模式和自定义文案仍可能暴露工作节奏或标量使用信息。 |
| [dsh-ui-auth](insights/0qwq0--dsh-ui-auth.md) | added | complete | 共享服务的安全边界依赖宿主路由、传输与升级契约；有登录页不等于所有数据面已隔离，也不抵御控制服务进程的管理员。 |
| [dsh-workspace-menu](insights/0imzero--dsh-workspace-menu.md) | added | complete | React fiber识别依赖界面内部结构；二次确认在浏览器侧，不能证明删除端点被限制在当前工作区。 |

## 本轮洞察

1. **观测、证据、放行是三个不同层次。** [Verification Receipt](insights/030611--dsh-verification-receipt.md)记录词法验证信号，[Evidence Audit](insights/030611--qiushi-dsh-evidence-audit.md)检查本地链的一致性，都不能直接回答代码正确或是谁在何时可信地证明了结果。使用者若只需发现漏做检查，轻量摘要可能足够；若需要可信存证，还需独立产物、外部锚点与写入协调。最小实验必须包含echo tests、删完整尾段和重算全链这些反例。
2. **局部省操作可能扩大权限与恢复负担。** [余额插件](insights/02muller25--dsh-api-balance.md)把控制台查询搬到输入区，但代码经shell子进程传凭证；[workspace-menu](insights/0imzero--dsh-workspace-menu.md)减少菜单切换，却带入跨插件永久删除流程。不能按点击次数评价总复杂度；对前者查凭证边界，对后者验证服务端对象授权与失败补偿。
3. **共享部署的增量价值来自身份贯穿所有数据面。** [ui-auth](insights/0qwq0--dsh-ui-auth.md)覆盖REST与mux帧归属，[ybkkasi](insights/01men--ybkkasi.md)向资源、授权、计量与交付扩展。它们的价值依赖真实多人治理需求，不来自模块数量；与每人独立实例对照时，必须同时计入升级回归、管理员恢复与持续运维。
4. **无额外模型调用也有总成本。** 脱敏是同步遍历，链式收据有同步I/O，外观插件有浏览器动效，余额插件有轮询子进程。未做实测不填ROI，分别观察CPU／磁盘／网络、人工复核和合格交付。

以上是固定源码支持的机制判断与采用假设，未形成运行效果排名或生态需求确认。

## 用户反馈线索与发布差异

[Issue采集](snapshots/ISSUE-RECOVERY.json)保留题目、状态与作者；本轮未逐条审读讨论及修复，不把关闭等同修复有效。可追查线索包括memory的[客户端挂载报告](https://github.com/00080000/dsh-project-memory/issues/7)、[OOM报告](https://github.com/00080000/dsh-project-memory/issues/5)，api-balance的[宿主等待问题](https://github.com/02Muller25/dsh-api-balance/issues/1)，ui-auth的[mux隔离报告](https://github.com/0QwQ0/dsh-ui-auth/issues/6)。这些是用户报告线索，不能据题目判定当前版本仍有相同缺陷，也不能用已关闭计数证明安全。目录收录邀请与词库投稿不当作业务采用证据。

Verification Receipt源码package.json为0.1.1，npm latest仍为0.1.0；[公开Issue #3](https://github.com/030611/dsh-verification-receipt/issues/3)题目报告发布包prepare构建问题，需先核对安装产物，不能把默认分支的窄版本兼容声明套在已发布包。Discord源码有包名，但npm latest404，GitHub发布包需另外验收。ybkkasi及api-balance为private根包，不借用同名npm下载量。

## META、验证与交付边界

初次Issue搜索触发GitHub搜索限流，部分仓库请求超时；保留initial-attempt快照，改用一次GraphQL查询获取10个仓库的全部Issue（各仓库hasNextPage=false，最多43条），重算未关闭／已关闭及30天活动。Issue不含PR。Python注册表访问遭本地证书错误，改用Node fetch读取官方npm注册表；不将证书错误记为未发布。计数恢复材料均可追溯，未伪造0。

10项均有固定版本文本、sloc/AST统计、单项观察批次及摘要检查点。代码／文档按扩展名与角色分列，lib/src交付副本及scripts分类的局限写在详情里，不把LOC当原创量。正式SKILL.md入口本轮10项均未发现；Agent资源、事件监听和运行实例没有计作Agent定义。ybkkasi多域只抽读关键启动／授权／桥接链，不能声明全仓审计完成。

[推荐与最小试用](RECOMMENDATIONS.md) · [当前分类索引](../../views/categories/INDEX.md)。本工程本地校验另记录在[执行结果](snapshots/EXECUTION.json)，不作为目标插件测试证据。原始研究与检查点不可改写，README和展示页由模板合成；未提交、未推送、未自动安排额外研究。
