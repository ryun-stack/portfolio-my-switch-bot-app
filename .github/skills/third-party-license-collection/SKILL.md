---
name: third-party-license-collection
description: "Use when the user asks to collect, list, audit, or generate a report of third-party/open-source licenses used by this repository's dependencies (e.g. \"third party license\", \"サードパーティライセンス\", \"OSSライセンス一覧\", NOTICE file generation, license compliance audit). Covers this repo's npm-workspaces monorepo (apps/api, apps/client, packages/shared-types)."
---

# Third-Party License Collection

## Purpose

Collect the licenses of every third-party (npm) package this repository depends on,
across all workspaces, and produce a single human-reviewable report.

## Repo shape (verified)

- Single npm workspaces monorepo, root `package.json` declares `workspaces: ["apps/*", "packages/*"]`.
- Workspaces: `apps/api` (NestJS), `apps/client` (Vue), `packages/shared-types`.
- One hoisted `node_modules` at the repo root — dependency scanning must be run from the
  **repo root**, not from inside an individual workspace, or the scanner will miss hoisted
  packages (or fail outright, see gotcha below).
- No `LICENSE`/`THIRD_PARTY_LICENSES` file currently exists at the repo root.
- No `.csproj`, `go.mod`, or `requirements.txt` in this repo — npm is the only package
  manager to check. Re-verify with `Get-ChildItem` if new ecosystems are added later.

## Tool

Use `license-checker-rseidelsohn` (maintained fork of the deprecated `license-checker`) via
`npx` — no need to add it as a project dependency unless the user asks for a persistent
`license-check` script.

```powershell
npx --yes license-checker-rseidelsohn --summary
```

### Known gotcha: `--production` breaks workspace detection

In this repo, running with `--production` throws `Error: No packages found in this path...`
because the Arborist-based production filter does not resolve npm workspace hoisting
correctly. **Do not use `--production`.** Instead generate the full report (prod + dev) and,
if the user only wants production/distributed dependencies, filter the output afterward
(e.g. by cross-referencing each workspace's `dependencies` — not `devDependencies` — in
`package.json`, or by post-filtering the JSON).

## Steps

1. From the repo root, generate the full machine-readable report, excluding this repo's own
   private workspace packages (`@my-switch-bot-app/*`) since they aren't third-party:

   ```powershell
   npx --yes license-checker-rseidelsohn --excludePrivatePackages --json --out third-party-licenses.json
   ```

2. Get a quick sanity-check summary of license types found:

   ```powershell
   npx --yes license-checker-rseidelsohn --excludePrivatePackages --summary
   ```

3. Flag anything needing manual review — copyleft or missing licenses are the ones that
   matter most:

   ```powershell
   npx --yes license-checker-rseidelsohn --excludePrivatePackages --failOn "GPL;AGPL;LGPL;UNLICENSED"
   ```

   A non-zero exit here doesn't mean stop — it means read the flagged packages and confirm
   with the user whether they're acceptable (e.g. `UNLICENSED` in `license-checker` output
   usually means "no SPDX license field detected", not necessarily "no license exists" —
   check that package's own repo/README before concluding it's actually unlicensed).

4. Convert the JSON into a readable Markdown report grouped by license type (package name,
   version, license, repository URL). Save it as `THIRD_PARTY_LICENSES.md` at the repo root
   (or wherever the user requests) unless they only asked for a summary in chat.

5. Delete any intermediate `third-party-licenses.json` scratch file once the final report is
   written, unless the user wants the raw JSON kept.

## Output format

Group by license, one table per license type:

```markdown
## MIT

| Package | Version | Repository |
|---|---|---|
| lodash | 4.17.21 | https://github.com/lodash/lodash |
```

Put `UNLICENSED` / unrecognized-license packages in their own section at the top, since
those need human attention first.

## Checklist

- ran the scan from the repo root (not from inside `apps/api`, `apps/client`, or
  `packages/shared-types`) so hoisted `node_modules` is fully covered
- excluded this repo's own `@my-switch-bot-app/*` workspace packages from the report
- did not use `--production` (breaks on this repo's workspace layout) — filtered
  prod-vs-dev afterward instead, if requested
- called out any copyleft (GPL/AGPL/LGPL) or unrecognized-license package by name for the
  user to review before treating the report as final
- cleaned up scratch JSON files, keeping only the requested final report
