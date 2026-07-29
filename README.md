# Khao Pad — example deployment

The official live demo of [Khao Pad](https://github.com/codustry/khaopad), the open-source website platform for Cloudflare. This repo is a real fork of the template, deployed to Cloudflare Workers with the same pipeline you'd use for your own project.

🌐 **Live**: [khaopad-example.codustry.workers.dev](https://khaopad-example.codustry.workers.dev)

## Sign in and play

The CMS is open with a demo editor account. Nothing you do can break it — the database resets every night at 03:00 Bangkok time.

| | |
| --- | --- |
| **URL** | [khaopad-example.codustry.workers.dev/admin](https://khaopad-example.codustry.workers.dev/admin) |
| **Email** | `demo@khaopad.dev` |
| **Password** | `KhaoPadDemo!2026` |

The account is an **editor**: it can write, publish, moderate, and manage the shop catalog, but not change site settings or users — those screens are visible but read-only, so one visitor can't reconfigure the demo for everyone else.

Things worth trying:

- **Write a post** — `/admin/articles/new`, markdown editor with split preview; publish it and it's live on the public blog immediately
- **Embed a product in an article** — the related-products panel on the article form; the embed renders inline on the public post and attributes any resulting purchase back to that article
- **Run a checkout** — add something to the cart on the public site and check out. Payments hit BeamCheckout's **sandbox**, so no real charge is ever made. Then watch the order appear at `/admin/shop/orders`
- **Create a discount code** — `/admin/shop/discounts`, then apply it in the cart
- **Watch the funnel** — `/admin/dashboard` shows page views, article reads, and the shop funnel from view through purchase

## What this demo is

A content-rich showcase, not a generic placeholder. Read it to see what a finished Khao Pad site looks like before you commit to the platform.

- **Subject**: a short history of khao pad — Thailand's most ubiquitous dish — told as a 5-essay series across origin, royal kitchens, regional variants, day-old rice, and the modern global diaspora
- **Bilingual**: every essay published in English and Thai (well, English fully; Thai partial — exactly the editorial reality of most multilingual sites)
- **Brand polish**: paypers-style visual reskin on the public surface — sticky topbar with a `ข` glyph mark, IBM Plex Sans Thai + Inter Tight typography, radial gradient background, story-led hero, numbered essay-list blog index, generous reading column
- **Every plugin active**: the v3.0 plugin runtime is live here with both the `hello` example plugin and the full `shop` plugin enabled, so the sidebar shows the real platform surface rather than a trimmed-down one.
- **All upstream milestones through v3.5**: SEO (full meta + JSON-LD + sitemap + RSS), analytics (privacy-friendly D1 events + funnel dashboards), comments, forms, newsletter, webhooks, public REST API, and the shop — catalog, cart, Beam checkout, orders, discounts, abandoned-cart recovery.

## What's different from upstream

This fork carries:

1. **Brand polish on the public surface** (4 files): `(www)/+layout.svelte`, `(www)/[locale]/+page.svelte`, `(www)/[locale]/blog/+page.svelte`, `(www)/[locale]/blog/[slug]/+page.svelte`. Same shadcn admin reskin as upstream — no example-specific changes inside `(admin)/`.
2. **Seed content**: the history-of-khao-pad essay series in EN + TH, the categories, tags, and the cover images (in R2).
3. **Custom i18n keys** for the home and blog intro (`home_eyebrow`, `home_title_a`, `home_title_b`, `home_subtitle`, `home_chip_*`, `blog_subtitle`).
4. **Wrangler config** points at the example's own D1 / R2 / KV bindings + the `khaopad-example.codustry.workers.dev` route.

Everything else flows from upstream via cherry-pick PRs. A typical upstream feature lands as one PR per milestone (e.g. PR #14 = v2.0d webhooks + REST API), with field-merged i18n keys and the brand-polish files preserved.

## Use this fork as a starting point for your own project

Two paths.

### A — Fork the upstream template (recommended for new projects)

If you want a clean slate with no example-specific copy:

1. Click **"Use this template"** on [`codustry/khaopad`](https://github.com/codustry/khaopad)
2. Follow the [Setup section in the upstream README](https://github.com/codustry/khaopad#setup)
3. Run `pnpm setup` to provision your own D1 / R2 / KV
4. Sign up at `/admin/signup` — first user becomes `super_admin`, signup then locks
5. Start writing

You get every feature, no demo content to delete.

### B — Fork this example (if you want the brand polish as a starting design)

If you like the paypers-style public reskin and want to start from it:

```bash
git clone https://github.com/codustry/khaopad-example.git my-site
cd my-site

# Provision your own Cloudflare resources
pnpm install
pnpm setup
```

Then in the CMS:

- Sign up your first user at `/admin/signup` (first becomes super_admin, signup then locks)
- Delete the seed articles via `/admin/articles`
- Delete the seed categories + tags
- Delete the seed media files in R2 (or via `/admin/media`)
- Update site name + locales in `/admin/settings`
- Edit the home/blog intro copy in `messages/en.json` + `messages/th.json` (search for `home_*` and `blog_subtitle`)

You keep: the paypers shell, font choices, reading-column layout, and every upstream feature through v3.5.

## Staying in sync with upstream

[`.github/workflows/sync-upstream.yml`](.github/workflows/sync-upstream.yml) runs every Monday and opens a PR whenever `codustry/khaopad@main` has advanced. A human reviews and merges it, so a breaking upstream change never lands silently. You can also trigger it by hand from the Actions tab.

When the merge conflicts, resolve on this rule:

1. **Upstream wins by default.** Every file outside the list below should take upstream's version — `git checkout --theirs <file>`. Divergence anywhere else is drift, not intent.
2. **`messages/*.json`**: field-merge new upstream keys — never wholesale-overwrite. The example's own copy (`home_*`, `blog_subtitle`) lives in the same JSON.
3. **The paypers-reskinned `(www)` files**: keep this repo's shell, then graft in any *new wiring* upstream added (a `<Seo>` mount, a tracker component, a nav iteration change). Diff upstream's new version against upstream's old one to see what's actually new — the raw conflict is mostly formatting drift and will mislead you.
4. **`wrangler.toml`**: keep this repo's bindings, URLs, and triggers. Upstream's staging/production env blocks are placeholders and are intentionally not carried here.

Then apply any new D1 migrations with `pnpm db:migrate:remote` before merging.

> **Known tax:** this fork diverges on route files, so every sync re-conflicts on them. The durable fix is to move the brand polish into theme overrides (CSS variables + i18n keys) so the demo becomes content-and-config only and upstream merges clean. Tracked as a follow-up.

## Local dev

```bash
pnpm install
pnpm wrangler:dev
```

- Public: `http://localhost:5173`
- CMS: `http://localhost:5173/cms`

For full architecture, bindings, deployment, and config docs, see the [upstream README](https://github.com/codustry/khaopad#readme) — this fork doesn't repeat it.

## License

MIT — Codustry. Same as upstream.

---

Built with 🍳 by [Codustry](https://codustry.com) · Powered by [Khao Pad](https://github.com/codustry/khaopad)
