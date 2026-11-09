# 001: Drive releases from conventional commits with one pnpm release command

- **Date**: 2026-11-09
- **Status**: accepted
- **Tags**: release, toolchain, pnpm, conventional-commits
- **Author**: Emiliano Pisu <emiliano.pisu@webidoo.com>

## Context

Every talk repository carried four release scripts (rel:push, rel:major, rel:minor, rel:patch) plus deps:push, clear:*, format/* and lint/* variants that had drifted apart. Each repository is a separate git repo consumable through a pnpm workspace that links ../talks-libraries/packages/*, so the release command has to work per repo, must keep the dist/ folder committed for the GitHub Pages workflow triggered on v*.*.* tags, and must produce a commit message the pre-push commit-lint hook accepts.

## Decision

Each talk repository exposes exactly seven scripts (dev, build, clean, format, lint, deps, release). release runs release-it with @release-it/conventional-changelog and preset conventionalcommits: it rebuilds dist, commits the refreshed assets, derives patch/minor/major from the commits since the last v* tag, writes CHANGELOG.md, commits chore(release): v<version>, tags v<version> and pushes. talks-libraries keeps lerna because it publishes three npm packages; lerna.json owns the version, the changelog preset and the release commit message, and the root package version field is removed so lerna.json is the only source of truth. Every dependency is pinned to its latest exact release except sharp, frozen at 0.33.5, and each repo carries save-exact=true. The default branch is main everywhere.

## Consequences

One command per repo, a changelog nobody writes by hand, and no caret ranges left to drift. The cost is two new devDependencies per repo (release-it and its changelog plugin), a CHANGELOG.md in every repository, and the loss of the manual major/minor/patch override: an explicit major now requires an exclamation mark or a BREAKING CHANGE footer. release aborts on a dirty working tree, so uncommitted slide edits must be committed before releasing.

## What would end this

A release has to be cut from CI rather than a maintainer machine, or a repository needs a version bump its commits do not justify.

## Alternatives Considered

1. semantic-release in GitHub Actions: no local release, needs tokens and write permissions
1. A custom scripts/release.mjs built on conventional-recommended-bump: two fewer dependencies but a script to maintain in 22 repos
1. Keeping rel:major/minor/patch and only removing the duplicate push helper
