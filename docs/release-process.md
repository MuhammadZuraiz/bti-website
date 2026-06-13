# Release Process

## Quality gates

Every pull request and push to `main` runs `.github/workflows/ci.yml`:
frozen-lockfile install, dependency audit (high+), Prisma generate, deploy
migration against a fresh PostgreSQL service container, database round-trip
verification, full lint, TypeScript lint, type-check, unit tests, production
build, and the Playwright E2E + accessibility suite. A failing gate blocks
the merge.

## Branch protection (configure in GitHub settings)

- Protect `main`.
- Require a pull request before merging; no direct pushes.
- Require at least one approving review.
- Require the `quality` and `e2e` CI checks to pass.
- Block force pushes and branch deletion.

## Release tagging

- Tag every production deployment: `v<major>.<minor>.<patch>` (for example
  `v1.0.0` for launch, `v1.0.1` for a fix).
- Create the tag from the exact commit that was deployed:
  `git tag -a v1.0.0 -m "Production launch" && git push origin v1.0.0`.
- Record the tag, date and deployer in the PR or release notes.

## Dependency policy

- All versions in `package.json` are pinned exactly; `pnpm-lock.yaml` is
  committed and CI installs with `--frozen-lockfile`.
- Node version is pinned in `.nvmrc` (and `engines`); pnpm version in
  `packageManager`.
- Dependabot (`.github/dependabot.yml`) opens weekly grouped update PRs.
  Each must pass full CI before merge. Review major upgrades manually and
  read changelogs — do not merge majors just to stay current.
- `pnpm audit` runs in CI at `--audit-level high`. Transitive advisories are
  patched through `overrides` in `pnpm-workspace.yaml` (current overrides:
  `postcss` and `@hono/node-server` security patches).
- Known constraint: ESLint stays on 9.x until `eslint-plugin-react`
  supports ESLint 10 (it crashes under 10 today).

## Rollback strategy

1. Hosting rollback: redeploy the previous release tag (or use the host's
   "promote previous deployment" feature). The application is stateless;
   only the database carries state.
2. Database: migrations are additive whenever possible. Before any
   destructive migration, take a manual backup and write a documented down
   path in the PR description.
3. If a bad migration reached production: restore the latest backup to a
   new database, point `DATABASE_URL` at it, redeploy the previous tag,
   then investigate offline.
4. Verify after rollback: `/robots.txt`, a lead submission smoke test, and
   `pnpm db:verify` against the restored database.

## Routine

- Review Dependabot PRs weekly.
- Re-run `pnpm audit` before every release.
- Quarterly: review pinned majors (Next.js, Prisma, React) and plan
  upgrades deliberately.
