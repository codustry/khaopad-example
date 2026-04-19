# Example Setup — `khaopad-example`

This repo is a **showcase fork** of [`codustry/khaopad`](https://github.com/codustry/khaopad). Use it to:

- See a working `cms.*` + `www.*` pair on Cloudflare Workers
- Edit content in the CMS and watch it appear on the public site
- Stay in sync with upstream Khao Pad releases (a weekly PR will appear)

If you want to start your **own** site instead of this demo, click "Use this template" on the upstream repo. This file is for getting `khaopad-example` itself live.

---

## What you need (one-time)

- A Cloudflare account with `wrangler login` working locally
- `pnpm` 9+ and Node 20+
- Push access to `codustry/khaopad-example` (or your fork of it)

The GitHub Actions deploy pipeline already inherits these org-wide secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

So **CI handles every deploy after the first push** — but Cloudflare resources (D1 / R2 / KV) have to be provisioned interactively once, because `wrangler` needs your login session to create them under your account. That's the only manual step.

---

## Phase 2 — Bring up the demo

Run these locally, in order. Total time: ~10 minutes.

### 1. Install

```bash
git clone git@github.com:codustry/khaopad-example.git
cd khaopad-example
pnpm install
```

### 2. Provision Cloudflare resources

```bash
wrangler login                # opens browser, one-time
pnpm setup                    # creates D1 db, R2 bucket, KV namespace
```

`pnpm setup` prints the IDs you need. Open `wrangler.toml` and replace the placeholders:

| Placeholder         | Where to find it                               |
| ------------------- | ---------------------------------------------- |
| `LOCAL_DB_ID`       | `wrangler d1 create khaopad-db` output         |
| `LOCAL_KV_ID`       | `wrangler kv namespace create CONTENT_CACHE`   |
| `STAGING_DB_ID`     | Reuse `LOCAL_DB_ID` for the demo (single env)  |
| `STAGING_KV_ID`     | Reuse `LOCAL_KV_ID`                            |
| `PRODUCTION_DB_ID`  | Reuse `LOCAL_DB_ID`                            |
| `PRODUCTION_KV_ID`  | Reuse `LOCAL_KV_ID`                            |

> The demo uses a single set of Cloudflare resources for all envs to keep setup short. A real production site should provision separate D1/R2/KV per environment — see `docs/DEPLOYMENT.md`.

### 3. Set the auth secret

```bash
# 32+ random chars. CI deploys read this from a wrangler secret, not from wrangler.toml.
openssl rand -base64 32 | tr -d '\n' | wrangler secret put BETTER_AUTH_SECRET
```

### 4. Migrate + seed

```bash
pnpm db:migrate:remote        # apply Drizzle migrations to remote D1
pnpm db:seed:example -- --remote   # 5 Thai fried rice articles, 1 category, 5 tags
```

### 5. Push → CI deploys

```bash
git push origin main
```

Watch the **Deploy** workflow in the Actions tab. When it finishes:

- Public site: `https://khaopad-example.<your-subdomain>.workers.dev`
- CMS: same host, but the route group `(cms)` is currently gated by host header — easiest path is to bind both `www` and `cms` subdomains to the worker. See `docs/DEPLOYMENT.md` → "Custom routes" if you want true subdomain split. For the workers.dev demo, all routes are reachable from one host.

### 6. Create the first admin

The seed inserts a *placeholder* admin row but does **not** set a password (Better Auth requires the user to set their own).

1. Visit `/register` on your deployed worker.
2. Sign up with the email you actually want to use as super-admin.
3. The first signup is auto-promoted to `super_admin` and `/register` is then locked off (this is the M3 first-admin-only pattern).

Now log in at `/sign-in` and edit any of the seeded articles. Refresh the public route — the change is live.

---

## Phase 3 — Stay in sync with upstream

A workflow (`.github/workflows/sync-upstream.yml`) runs **every Monday at 03:00 UTC** and on demand from the Actions tab. It:

1. Fetches `codustry/khaopad@main`
2. If we're behind, opens a PR titled `chore: sync from codustry/khaopad@<sha>`
3. Surfaces any merge conflict in the PR body so you can resolve by hand

Merge that PR to deploy upstream changes to staging; tag a `vX.Y.Z` to promote to production.

---

## Troubleshooting

**`pnpm db:migrate:remote` fails with "no such database"**
→ You skipped step 2 or didn't paste the new D1 `database_id` into `wrangler.toml`.

**Deploy succeeds but `/` returns 500**
→ `BETTER_AUTH_SECRET` not set as a worker secret. Re-run step 3.

**`/register` returns 404 after signup**
→ Working as designed. Sign-up is one-shot. Use `/sign-in` from now on.

**Sync PR has merge conflicts**
→ Pull the branch, resolve, push. The workflow won't force-push over your fix.

---

## Resetting the demo

Want to wipe and re-seed?

```bash
wrangler d1 execute khaopad-db --remote --command "DELETE FROM article_tags; DELETE FROM article_localizations; DELETE FROM articles; DELETE FROM tag_localizations; DELETE FROM tags; DELETE FROM category_localizations; DELETE FROM categories;"
pnpm db:seed:example -- --remote
```

Users / sessions are preserved so you stay logged in.
