---
name: dsh-plugin-update
description: Check an existing DSH plugin research catalog for directory, source, release, compatibility and maintenance changes, then apply evidence-backed incremental updates and flag affected conclusions for review. Use for refreshes and newly discovered entries after initialization.
---

# Update DSH plugin research

This is a repository-scoped skill. Run from the dsh-plugin-insight root with its shared
resources. Read [the data contract](../../research/data-model.md) and
[the research standard](../../research/research-standard.md).

1. Inspect current data, prior runs and Git state. Validate the baseline:
   `python3 scripts/plugin_data.py validate`. An empty baseline belongs to the init
   skill. Preserve manual research and unrelated changes; use a branch for protected main.
2. Set a new run id and cutoff, honor requested plugin/source scope. Check both discovery
   sources (new/removed entries) and target repositories (code/releases/maintenance).
   Capture fresh evidence with `scripts/capture_github.py` or equivalent pinned APIs.
   Compare against prior snapshots. A changed source-directory commit need not change
   every plugin; compare the specific entry content. Record API limits, truncation,
   permissions and failed fetches. Do not infer removal from absence in partial results.
3. Match stable repository/component ids, including renames and path moves. Existing
   catalog plus newly discovered entries use update mode. Preserve disappeared records;
   require successful complete comparison before marking removed_from_source. Archive
   state and source membership are separate facts; describe both in evidence/findings.
4. Inspect relevant diffs and classify their code, functional and risk areas. Refresh
   successful metadata and inspected fingerprints. Omit uninspected fingerprint areas.
   For unchanged commentary submit `findings: []`; previous findings are retained.
   Add immutable evidence/source items with new ids. Failed targets belong in errors,
   not replacement plugin records. An error-only batch is valid.
5. Review affected findings, including cross-plugin comparisons and ecosystem gaps.
   Keep conclusions with obsolete evidence as needs_review. Revalidate only with new
   inspection/execution appropriate to the claim, updating dependencies and reviewed_at.
   Do not claim that historical tests validate a new published version. This skill
   can leave explicit review work outstanding when the necessary environment is absent.
6. Prepare `data/observations/<run_id>.json`, raw snapshots and a concise report. Run:
   ```sh
   python3 scripts/plugin_data.py plan --mode update --observations data/observations/<run_id>.json --out /tmp/dsh-update-plan.json
   ```
   Inspect the candidate and change summary. The plan also invalidates dependent
   findings in other records. If the proposed changes match the evidence and authorized
   scope, run:
   ```sh
   python3 scripts/plugin_data.py apply --plan /tmp/dsh-update-plan.json
   python3 scripts/plugin_data.py validate
   python3 -m unittest discover -s tests -v
   ```
   If the catalog changed after planning, regenerate against the new baseline. Never
   force replacement or reuse an applied run id. A repeat check uses a new id and
   preserves findings when content is unchanged.

Report substantive additions/changes, affected conclusions, unchanged checks, failures
and validation limits. Show the Git diff; do not rewrite every review for cosmetic
consistency. A request to update local research does not schedule future checks,
publish results, modify upstream repositories or automatically merge a PR.
