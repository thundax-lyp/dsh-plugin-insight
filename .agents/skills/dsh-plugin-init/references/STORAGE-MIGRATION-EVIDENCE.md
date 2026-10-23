# 当前研究目录迁移验证

验证日期为2026-10-23。依据为[数据契约](../../_shared/references/DATA-CONTRACT.md)与[输出标准](OUTPUT-STANDARD.md)。本次仅重构本仓库的存储、过程路径和生成流程，没有重新分析、安装或运行任何目标插件。

## 迁移范围

正式组件由 MD5 分桶迁至与 plugins 一致的稳定 slug 目录，每项保存 research.json 与 meta.json。418项组件档案与425份必要证据已迁移；全目录扫描候选退出正式组件文件，后续扫描只进入本轮 INPUT／WORK。持久受阻原因保留在全局 state，失败不创建或覆盖研究成果。

迁移逐项核对 catalog、reports、metadata、artifacts、registry、research_blocks、unavailable_artifacts 的完整语义摘要；发布 records、summaries、capabilities、advice 也分别比较，全部不变。证据正文按原字节内容及 SHA-256 保存，没有为迁移重新统一原材料格式、更新研究版本或刷新研究时间。META 路径改为同组件 meta.json。

有一项历史发票插件档案缺少原稿及有效发布记录，但磁盘保留既有 INSIGHT。迁移仅将该稿字节与哈希保存为 retained_documents，并支持原样重建；没有反向编造研究原稿，没有将有效发布数量从417提升到418，也没有恢复推荐。

旧物理文件及原有未提交修改已保存到本地 `data/tmp/catalog-v4-originals/`，随后由迁移事务移除旧 components 分桶与共享 evidence 文件。此备份不参与当前读取、生成或下一轮研究。原有 runs 保留，不批量重命名其内容，避免破坏历史检查点；新过程按 `runs/<round>/<plugin-slug>/` 直接存放材料、问题、原稿和观察。

## 实际验证

使用仓库声明的 Node 24.19.0 与现有真实研究数据执行，未引入合成研究档案。

| 验证 | 结果 |
|---|---|
| 从空输出目录重建，无 runs、manifest 或 checkout | 生成431份 Markdown，包括418份插件稿与首页、分类、栏目页 |
| 对比迁移前全部稿件 SHA-256 | 431份全部一致；包括上述原样保留稿 |
| 暂时移开实际工作区 runs／manifests 后重建并检查 | 成功，之后已恢复原目录 |
| 删除隔离副本索引，再执行 reindex | 索引逐字节重建一致，整体语义摘要一致 |
| 写入完全相同的当前快照 | 返回 unchanged，不重写组件 |
| 单独更新隔离副本的 META | 全部418份 research.json 字节不变 |
| 尝试写入扫描候选或缺失必要证据 | 拒绝，正式副本保持原状 |
| 无旧 runs 时新建研究 WORK | 队列与额度可生成，已有研究文件不变；未执行所选插件研究 |
| 两个研究 Skill 的 quick_validate | 通过 |
| 修改文档的本地 Markdown 文件链接 | 目标均存在 |
| npm run check | 格式、快照、过程及生成一致性通过 |

局部验证脚本和逐项摘要保存在本地 `data/tmp/catalog-v4-audit/`，不作为日后生成或研究的依赖。本项目不新增 testcase。未执行远端 CI、Git 提交或推送。

## 操作入口

- 重建全部文档运行 `npm run render:research`，只读取当前 catalog 与生成模板。
- 校验当前成果运行 `npm run check`，旧 runs 可不存在。
- 丢失查询索引时运行 `npm run snapshot -- reindex`，由当前 slug 目录和全局 state 重建。
- 迁移与中断恢复、旧未合并 WORK 的基线限制见[会话与合并恢复](SESSION-OPERATIONS.md)。

## 后续遗漏核查

2026-10-23补充检查发现并修复了暂存流程仍将历史 artifact 标签当作本机文件路径读取的遗漏。现在 stage 从当前成果复制已归档证据，WORK／SESSION 及检查点从单项内嵌正文校验 SHA-256；同名材料的正文冲突仍被拒绝。隔离目录只复制39项真实完成记录的过程索引、观察和原稿，不复制源码材料文件，WORK校验、SESSION校验及重新建立一个检查点均通过。篡改内嵌证据正文会被拒绝。

同时补齐存储读取的严格性检查。索引重建不得静默忽略未登记的非空 META，组件的缺失证据声明必须对应本组件实际引用且与全局声明一致，数组型组件节必须匹配自身身份；错误在写入索引前被拒绝。隔离副本中注入未登记 META 或无效缺失证据标签后，重建均拒绝且 index／state 字节不变。另修正空索引解析和迁移备份位置的路径边界判断。

这些修复只修改工程脚本与契约，没有重新分析插件或改写现有研究、指标和发布稿。原有迁移与逐字重建结论保留；局部验证材料仍仅保存在 data/tmp，不作为当前成果依赖。未提交或推送。
