# Shared data contract (version 1)

The authoritative schemas are [catalog](../schemas/catalog.schema.json) and
[observations](../schemas/observations.schema.json). JSON is UTF-8; unknown fields,
duplicate keys and invalid dates are errors. `data/catalog.json` is the current
catalog and append-only run history. Evidence and source snapshots are append-only
within each plugin; changing their contents requires a new id. Git retains earlier
finding text and catalog versions. Commit applied batches with their source artifacts
and run reports so historical conclusions remain recoverable.

## Identity and scope

`id` is `github:<numeric repository_id>:<component_id>`. GitHub repository id survives
renames. `component_id` is an assigned stable slug (`root` for a single project),
not a moving directory path. A monorepo may have several components. Preserve the
component id on moves and record former locations in aliases. Do not assign another
id merely because a name or URL changes. Resolve ambiguous component matches before
applying a batch. A repository recreated at the same URL has a different identity.

`entry_type` distinguishes plugin, skill, tool, client, infrastructure, resource,
placeholder and unknown. Inclusion in an Awesome list does not prove installability.
Keep one technical and one business category, plus multiple tags. Use the taxonomy
in [research-standard.md](research-standard.md); additions need a documented meaning.

## Versions, evidence and conclusions

`fingerprints` contains last successfully observed content revisions by area:
`directory`, `code`, `release`, `compatibility`, `maintenance`. Use a commit/tree/blob
SHA or a deterministic content hash; never use fetch time as the fingerprint. Omit
areas not inspected in a batch: update preserves their previous fingerprints. A
release fingerprint should describe published version/assets; branch code and
published packages are separate evidence. Compatibility fingerprint covers host
support declarations and, when available, the exact validated environment.

`sources` records pinned URLs/revisions and retrieval times. Give each snapshot a
new id; submit only new source snapshots or exact existing objects in observations.
Directory snapshots may set `membership` to present, removed or unknown. Compare
the newest successful snapshot for each source URL; one source removing an entry
does not mean the plugin disappeared from every source. Use removed_from_source
only after checking the relevant source set; record mixed membership in evidence.
Store sizeable raw captures under `data/snapshots/<run_id>/` and cite them via evidence
`artifact`; do not store credentials. `capture_github.py` captures GitHub metadata,
commit/tree, selected root files and up to 100 releases through authenticated `gh`.
It does not discover every plugin, follow every dependency or run untrusted code.
Directory parsing and component matching remain explicit research steps.

Evidence `kind` is one of author_claim, source_inspection, local_test, host_acceptance,
independent_feedback. Every item binds to a revision and states limitations. Runtime
evidence also requires an environment and artifact (command log/result). Evidence ids
are globally unique, e.g. `<plugin-id>:<revision>:<purpose>`.

A finding contains a topic, text, evidence ids, basis and dependencies. Dependencies
bind a plugin id and area to the fingerprint actually reviewed. Cross-plugin
comparisons and ecosystem-gap findings must include other affected plugins. This
allows an update to invalidate comparisons outside the changed record. For ecosystem
claims also track the directory population fingerprint; changes in coverage must
trigger explicit reconsideration of those claims.
Represent a tracked source population as a resource record with its own repository
and stable component id, then depend on its directory fingerprint. This makes new
entries invalidate gap findings without pretending an individual plugin changed.

`needs_review` means a dependency changed, not that a finding became false. Old
text/evidence are retained. Revalidate by submitting an explicitly reviewed finding
with refreshed dependencies, evidence and reviewed_at. An already stale finding is
never automatically promoted by a later update. `research_depth` describes the
submitted research record: catalog, source, tested, host_verified. Raising it requires
corresponding evidence; it does not imply that old execution evidence covers the
current version. Check finding statuses and evidence revisions before recommending.

## Observation batches and application

An observation contains full current metadata for each successfully checked plugin,
but only newly collected evidence/sources and newly reviewed findings are needed.
Use `findings: []` to retain commentary without rewriting it. Unchecked plugin records
are omitted. Failed fetches go in `errors` with target and message; do not fabricate
an unavailable/removed state from timeout, 403, 404 or a truncated source. Directory
removal requires a complete successful source comparison. Preserve removed/archived
records and history; this version has no destructive delete operation.

`run_id` identifies one check. A new unchanged check uses a new run id; replaying an
already applied id is rejected without writing. `last_checked_at` advances only for
successful plugin checks. A no-change check records the run and checkpoints, while
keeping finding text intact. An error-only batch records errors and leaves all
plugin records unchanged.

`plan` writes a candidate catalog, base/result digests, semantic changes and errors.
Review its summary and catalog diff, then `apply` uses a file lock and atomic replace.
A changed base, corrupted plan or invalid result is rejected. Regenerate from the
latest catalog rather than overwriting a concurrent update. This local lock supports
macOS/Linux; multi-machine coordination uses Git branches/PRs. Plans are local data,
not executable scripts. Initialization requires a genuinely empty catalog. Existing
baselines always use update, including newly discovered plugins.
