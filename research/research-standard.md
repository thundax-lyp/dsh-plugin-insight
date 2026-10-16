# Plugin research standard

## Discovery and classification

Start with user-selected sources. Default discovery inputs are
`awesome-dsh-plugin/awesome-dsh-plugin` (prefer structured data/plugins entries over
its generated README) and `0xsline/awesome-deepseek-harness` (README and CATALOG).
Capture exact commits, file paths, retrieval times, pagination/truncation and access
failures. Report entry counts, unique component counts and repository counts
separately. Do not describe discovered entries as currently usable plugins.

Use technical categories: agent-workflow, context-search, memory-knowledge,
model-provider, tools-integration, interface-input, sessions-messages,
channels-remote, runtime-deployment, observability-cost, security-governance, other.
Use business categories: software-delivery, research-knowledge, office-operations,
customer-service, content-creation, personal-productivity, infrastructure, other.
Keep uncertain entries in other with an uncertainty tag rather than inventing certainty.
Classify the primary capability and user workflow; add tags for secondary functions.

## Research depth and evidence

Catalog depth covers identity, type, description, classification and source.
Source depth examines entrypoints, core mechanisms, host APIs, dependencies and
release/compatibility conditions. Tested depth requires recorded local execution;
host_verified requires a real host task with exact plugin/host/model/OS versions.
Do not install or execute every discovered repository as part of basic initialization.
Use the user's authorized scope and isolate optional runtime experiments.

Keep author claims, source inspection, local tests, real host acceptance and independent
feedback separate. Source presence does not prove runtime behavior; passing mocked
tests does not prove host compatibility. Unsupported claims remain unverified.
Distinguish confirmed defects, design limits, compatibility risks and missing evidence.

## Deep review

For priority plugins assess:
- Target user, concrete problem, conditions and falsifiable core claims.
- Input-to-output mechanism, state, algorithms/protocols and upstream attribution.
- Technical difficulty versus avoidable implementation complexity; original mechanism,
  adaptation, integration and engineering improvement are distinct kinds of contribution.
- Technical and business innovation, incremental value and workflow completion.
- Baselines: native DSH, comparable plugins, simple scripts and current manual process.
- Evidence for benefit, cost, necessity of complex components, failure cases and reproduction.
- Engineering completeness: install, configure, complete task, fail, recover, uninstall;
  test effectiveness, publication consistency, API coupling and observability.
- Security/data flows, permissions, external side effects, isolation and migration/export.
- Adoption recommendation: priority trial, conditional adoption, observe or not recommended;
  state environment, evidence limits and the smallest useful acceptance experiment.

Record findings by topic rather than one opaque total score. Assess engineering maturity,
technical increment, business value, differentiation and evidence sufficiency separately.

## Engineering updates

Report 7/30/90-day activity windows only with a cutoff and complete-enough history.
Separate functional commits, fixes, compatibility, refactors, docs, dependency/robot work.
Describe code area (modules/effective additions/deletions), functional area (user flows,
platforms, integrations), and risk area (interfaces, permissions, persistence, migration,
external side effects). File counts alone do not measure impact.

Distinguish original development, integration, verification and ongoing maintenance.
Exclude vendored/generated/copied code from effective engineering size; never infer
person-days from line counts. Stars, forks, downloads and supply are not active users,
reliability or demand. A stale directory is not proof that its ecosystem is declining.

## Updating conclusions

Inspect diffs before revising research. Bind affected findings to fingerprints and mark
obsolete dependencies needs_review. Recheck dependent comparisons and ecosystem gaps.
Changes to directory coverage require reconsidering ecosystem conclusions even if
existing plugin code stayed the same. Old tested versions remain historical evidence.

A complete run report states scope/cutoff, successful and failed sources, new/changed
entries, affected code/function/risk areas, changed or stale conclusions, validation
performed and unresolved boundaries. If nothing substantive changed, say so without
regenerating all prose. This project updates local research artifacts; it does not
publish recommendations or modify third-party repositories as a side effect.
