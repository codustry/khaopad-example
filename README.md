# Khao Pad — example deployment

The official live demo of [Khao Pad](https://github.com/codustry/khaopad), the open-source website platform for Cloudflare. This repo is a real fork of the template, deployed to Cloudflare Workers with the same pipeline you'd use for your own project.

🌐 **Live**: [khaopad-example.codustry.workers.dev](https://khaopad-example.codustry.workers.dev)

## What this demo is

A content-rich showcase, not a generic placeholder. Read it to see what a finished Khao Pad site looks like before you commit to the platform.

- **Subject**: a short history of khao pad — Thailand's most ubiquitous dish — told as a 5-essay series across origin, royal kitchens, regional variants, day-old rice, and the modern global diaspora
- **Bilingual**: every essay published in English and Thai (well, English fully; Thai partial — exactly the editorial reality of most multilingual sites)
- **Brand polish**: paypers-style visual reskin on the public surface — sticky topbar with a `ข` glyph mark, IBM Plex Sans Thai + Inter Tight typography, radial gradient background, story-led hero, numbered essay-list blog index, generous reading column
- **All eleven Khao Pad milestones live**: SEO (full meta + JSON-LD + sitemap + RSS), analytics (privacy-friendly D1 page-views), comments (dual-toggle), forms, newsletter (single-opt-in with no provider configured), webhooks, public REST API. Everything you can do upstream is wired up here.

## What's different from upstream

This fork carries:

1. **Brand polish on the public surface** (4 files): `(www)/+layout.svelte`, `(www)/[locale]/+page.svelte`, `(www)/[locale]/blog/+page.svelte`, `(www)/[locale]/blog/[slug]/+page.svelte`. Same shadcn admin reskin as upstream — no example-specific changes inside `(cms)/`.
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
4. Sign up at `/cms/signup` — first user becomes `super_admin`, signup then locks
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

- Sign up your first user at `/cms/signup` (first becomes super_admin, signup then locks)
- Delete the seed articles via `/cms/articles`
- Delete the seed categories + tags
- Delete the seed media files in R2 (or via `/cms/media`)
- Update site name + locales in `/cms/settings`
- Edit the home/blog intro copy in `messages/en.json` + `messages/th.json` (search for `home_*` and `blog_subtitle`)

You keep: the paypers shell, font choices, reading-column layout, and all eleven milestones of features.

## Staying in sync with upstream

Khao Pad ships features in numbered milestones. To pull a new release into your fork:

```bash
git remote add upstream https://github.com/codustry/khaopad.git
git fetch upstream

git checkout -b cherry-pick/v2.X
git checkout upstream/main -- <list of upstream files that changed>
```

Two manual rules during the cherry-pick:

1. **`messages/*.json`**: field-merge new upstream keys into your file — never wholesale-overwrite. Your example-specific copy lives in the same JSON.
2. **The 4 paypers-reskinned files** (the `(www)` svelte files listed above): take upstream's diff against the **upstream** version of the file, and apply only the new wiring (Seo mount, CookieBanner, nav-menu iteration, beacon, etc.) into your existing paypers shell.

Apply any new D1 migrations via `pnpm db:migrate:remote`, then PR into `main`:

```bash
gh pr create --title "feat(v2.X): cherry-pick upstream PR #N"
```

The full sync history is in the merged PRs of this repo — every cherry-pick PR's title links back to the upstream PR number.

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
