# Architecture Decision Records

Every decision this project has taken, newest first. The numbered files in
this directory are the source of truth; this index is generated from them by
`rule_tool_process_adr`, so editing it by hand is work the next call throws away.

## Index

| #                                                                                    | Title                                                                  | Date       | Status   | Tags                                           |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------- | -------- | ---------------------------------------------- |
| [001](001-drive-releases-from-conventional-commits-with-one-pnpm-release-command.md) | Drive releases from conventional commits with one pnpm release command | 2026-11-09 | accepted | release, toolchain, pnpm, conventional-commits |

## What each decision says

The opening sentence of each decision and of what it cost, lifted from the
file. Where a line stops short the rest is in the ADR.

| ADR                                                                                  | Decision                                                                                                                                                                                                                  | Consequence                                                                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [001](001-drive-releases-from-conventional-commits-with-one-pnpm-release-command.md) | Each talk repository exposes exactly seven scripts (dev, build, clean, format, lint, deps, release). release runs release-it with @release-it/conventional-changelog and preset conventionalcommits: it rebuilds dist,... | One command per repo, a changelog nobody writes by hand, and no caret ranges left to drift. |

## By theme

Tags carried by 3 or more decisions. A decision appears under every
theme it carries, and the early ADRs that predate the tag field are listed last.

## Operating rules

- Write an ADR with rule_tool_process_adr when the project ADR policy allows it (default: at handoff; mid-task only under full).
- Never rewrite an accepted decision. Supersede it with a new one that says why.
- Never edit this file. Edit the ADR and let the next call regenerate it.
