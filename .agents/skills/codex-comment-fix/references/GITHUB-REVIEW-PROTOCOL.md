# GitHub Codex Review 协议

本协议只在执行 `$codex-comment-fix` 时读取，维护 Codex 评论来源、幂等处置和 GitHub API 边界。

## 评论来源与去重

读取以下四类资源：

- GraphQL `reviewThreads`，用于 thread、`isResolved` 和 thread ID；
- REST PR review comments，用于评论正文、作者、位置、reaction 和 reply；
- REST PR reviews，用于 review summary；
- REST issue comments，用于 summary 处置标记及纯额度提示。

只有作者确认是 Codex，且 review summary 同时包含具体 blob URL／文件行范围和可执行技术内容时，才把 summary 段识别为 finding。常见 raw body 结构是：

```text
https://github.com/<owner>/<repo>/blob/<commit>/<path>#L<start>-L<end>
<P1/P2 标题>

<触发条件、影响和建议>
---
```

按 actionable finding 出现顺序生成稳定来源键 `review:<review-id>:finding:<1-based-index>`。说明性尾注、普通引导语和纯额度提示不编号。

同一内容已有 review comment/thread 时，以 thread 为唯一来源；按 review ID、文件与行范围、标题和正文共同核对，不能只凭标题相似。Summary finding 没有逐项 reaction API，也没有可 resolve 的 thread，reaction 与 resolve 均记录为 `Not Applicable`。

## Summary 处置标记

同一 review 的 summary findings 使用一条汇总 PR issue comment 回复，逐项记录来源键、文件/行、分类、依据、fix PR/commit 和验证。每项包含稳定标记：

```html
<!-- codex-comment-fix review=5244237476 finding=1 disposition=fixed -->
```

`disposition` 只使用 `fixed|rejected|deferred`。运行前读取已有标记：最新的 `fixed|rejected` 视为已处置；最新为 `deferred` 且仍没有实际 fix PR/commit 时不重复回复。后续修复完成可以为同一来源键发布新的 `fixed` 标记，以最新标记为准。

回复成功后回读 issue comment，确认正文、全部标记和 comment ID；命令成功但未回读不算完成。

## 额度提示

精确正文 `You have reached your Codex usage limits for code reviews.` 及其仅包含 dashboard/settings 链接的标准补充文字是冗余通知，不是 finding。只有同时满足以下条件才可删除其他额度提示：

- 作者已确认是 Codex；
- 正文只报告 review token、budget 或额度耗尽；
- 不含文件、行号、触发条件、影响或修复建议；
- thread 中没有其他需要保留的评论。

正文混有任何可执行技术内容时按普通 finding 处理。删除必须匹配资源：review comment 使用 `/pulls/comments/{comment-id}`，issue comment 使用 `/issues/comments/{comment-id}`；review summary 只有正文完全是额度通知时才删除对应 review。删除后回读确认；失败或身份不确定时保留并报告，不能改为 resolve。

## 修复归属与追踪

始终区分：

- `comment PR`：评论来源 PR；
- `fix PR`：当前修复 commit 所属 PR；
- `fix commit`：实际修复提交。

Thread 来源写入 commit body：

```text
Refs: PR #4, Codex comment #3859728727
```

Summary 来源写入：

```text
Refs: PR #87, Codex review #5244237476, finding #1
```

回复必须同时给出 comment PR、fix PR、fix commit 和实际验证。评论来自其他 PR 且尚无 fix PR/commit 时，只能说明 follow-up 尚未发布；后续发布后回到原评论补充实际归属，thread 才可 resolve。

## GitHub 写入

优先使用已连接的 GitHub 工具；能力缺失或权限不足时，可改用已认证的 `gh`。Fallback 只改变通道，不扩大授权。

使用 `gh` 前核对账号、仓库、PR、review/thread/comment ID。Reaction 使用 `+1` 或 `-1`；reply 成功后才能通过 GraphQL `resolveReviewThread`。每次 reaction、delete、reply、resolve 或 push 后都回读对应资源，不能用命令退出码替代最终状态。

不得删除普通 issue comment、非 Codex 评论、含 actionable finding 的评论或需要保留的 thread 内容。不得把 resolve 当作 reply、fix 或删除的替代品。

## 固定命令与本地计划

评论读取与受控写入统一使用根命令 `npm run codex-review --`。`inspect` 返回完整评论集合的归一化 JSON；输出文件及 apply plan 是本地过程数据，不进入 Git。脚本只识别配置中的 Codex 登录名，不用正文风格猜测作者。

`apply` 默认 dry-run，只有显式 `--apply` 才写 GitHub。计划格式为：

```json
{
  "schema_version": 1,
  "repository": "owner/repo",
  "pr": 4,
  "operations": [
    {"op":"reaction","resource":"review_comment","id":3859728727,"content":"+1"},
    {"op":"delete_quota","resource":"issue_comment","id":123,"expected_login":"chatgpt-codex-connector[bot]","expected_body_sha256":"<sha256>"},
    {"op":"reply","thread_id":"PRRT_...","key":"pr4-comment3859728727-reply-v1","body":"修复归属与验证结果"},
    {"op":"resolve","thread_id":"PRRT_...","reply_key":"pr4-comment3859728727-reply-v1"},
    {"op":"summary_comment","key":"pr4-review5244237476-v1","body":"逐项处置及稳定 disposition 标记"}
  ]
}
```

`key` 形成隐藏幂等标记；重复执行会读取目标状态后跳过已有 reaction、reply、summary comment 和已 resolved thread。额度删除必须同时匹配资源类型、Codex 作者、原正文 SHA-256 和纯额度提示规则。一项失败时停止并报告，后续操作不得标记为成功。

脚本刻意不执行代码修改、暂存、commit、push、PR 创建或合并：这些动作需要结合 finding、工作区和工程授权判断，继续由 Agent 按提交与 PR 规则完成。
