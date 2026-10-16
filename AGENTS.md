# Plugin research work

This repository owns two Skills and their shared resources. For first-time catalog
research read `skills/dsh-plugin-init/SKILL.md`; for an existing baseline read
`skills/dsh-plugin-update/SKILL.md`. Both depend on `research/data-model.md` and
`research/research-standard.md`. Keep those contracts consistent when changing data
or tooling. `examples/observations.json` is synthetic and must not be imported as
real research. Preserve unrelated local IDE files.

Before submitting changes run `python3 scripts/plugin_data.py validate` and
`python3 -m unittest discover -s tests -v`. Keep the existing `Repository checks`
job name stable because main branch protection requires it. Use a branch and PR
for changes to protected main.
