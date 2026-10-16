---
name: dsh-plugin-init
description: Initialize a versioned DSH plugin research catalog from selected directory sources, with stable identities, technical and business classification, source evidence and tiered reviews. Use for the first baseline in dsh-plugin-insight; use dsh-plugin-update for an existing catalog.
---

# Initialize DSH plugin research

This is a repository-scoped skill. Locate the dsh-plugin-insight checkout; run commands
from its root. Keep this skill with its shared `research/`, `schemas/` and `scripts/`
resources rather than copying its directory alone.

Read [the data contract](../../research/data-model.md) and
[the research standard](../../research/research-standard.md) before preparing data.

1. Inspect the catalog and Git state. Use an isolated branch when the main branch is
   protected. If `data/catalog.json` has a baseline, use the update skill. Preserve
   unrelated files. Install shared tooling with `python3 -m pip install -r requirements-dev.txt`
   in the project's environment when needed.
2. Establish source scope and cutoff. Use the default discovery inputs in the research
   standard unless the user specifies others. Capture source repositories at exact
   revisions, for example:
   `python3 scripts/capture_github.py awesome-dsh-plugin/awesome-dsh-plugin --out data/snapshots/<run_id>/awesome-dsh-plugin.json`.
   Read structured entries at that revision using `gh api` or a source checkout;
   capture additional files explicitly. The helper captures selected root files and
   the tree, not all directory entry contents. Record incomplete coverage and failures.
3. Extract candidate entries, resolve stable repository/component identity and deduplicate.
   Preserve multiple subpackages in one repository. Separate plugins, tools, skills,
   resources and unknown entries. Assign technical/business categories and tags.
4. Build catalog-depth records for all successfully identified entries. Deepen only
   priority records as requested/justified: inspect code and published versions;
   record actual local/host tests only when performed. Do not upgrade author claims
   into verification. Follow the shared review dimensions and evidence boundaries.
5. Prepare `data/observations/<run_id>.json` using the observation schema. Use
   [the synthetic example](../../examples/observations.json) for field structure, never
   as real research data. Save raw evidence under `data/snapshots/<run_id>/` and a report
   under `data/reports/<run_id>.md`. Put failed targets in errors rather than deleting
   or inventing records. Bind each finding to the reviewed fingerprints.
6. Run:
   ```sh
   python3 scripts/plugin_data.py plan --mode init --observations data/observations/<run_id>.json --out /tmp/dsh-init-plan.json
   ```
   Inspect the summary/candidate for duplicate identities, classification uncertainty,
   source coverage and unsupported conclusions. Correct the observation and regenerate
   if needed. When the plan matches the authorized initialization, apply it:
   ```sh
   python3 scripts/plugin_data.py apply --plan /tmp/dsh-init-plan.json
   python3 scripts/plugin_data.py validate
   python3 -m unittest discover -s tests -v
   ```

Deliver counts by entry/component/repository, actual research depths, evidence boundaries,
failures and follow-up research priorities. Keep the result reviewable through Git diff;
do not automatically publish, merge or schedule recurring research. Running this skill
initializes research data, not third-party plugins or their runtime environments.
