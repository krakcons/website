This is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

Read `PROJECT.md` for the agreed workflow: develop and test code locally, then deploy it; edit CMS-managed content directly in the confirmed production CMS using drafts, preview, and approved publication. Keep databases separate and do not promote local CMS data as the normal workflow. Code deployment alone does not update published CMS entries.

```bash
npm run dev              # Start the Astro dev server
npx emdash types      # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                    |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                           |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev server start)             |
| `src/layouts/Base.astro` | Base layout with EmDash wiring (menus, search, page contributions)                 |
| `src/pages/`             | Astro pages -- all server-rendered                                                 |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- When Astro's cache is enabled, pass content-query hints to `Astro.cache.set(cacheHint)`. Use the `WithCacheHint` variants for site settings, menus, taxonomies, and widget areas rendered by cached routes.
- Taxonomy names in queries must match the CMS taxonomy name exactly (e.g., `"category"` not `"categories"`).
- CMS body structure belongs in content: render Portable Text intact, using native headings and break/divider blocks. Do not split bodies by heading text or inject page-specific section dividers. Keep heading and divider styling shared in `src/styles/theme.css`.
- Homepage Services and Our projects use one native `cards` block type in the `services_section` and `projects_section` Pages fields. Keep section headings, links, card text, and card order in localized CMS entries, not `src/utils/i18n.ts`. Both slots use `src/components/blocks/Cards.astro`; missing or empty slots render no cards.

## This Template

A general-purpose starting point with posts, pages, categories, and tags. Less opinionated than the themed templates -- a base for sites that want to define their own design.

This project has a green/cream responsive company-site design in `src/styles/theme.css`, imported by `Base.astro`. Its positioning is practical digital solutions for businesses and organizations, with a proudly Canadian identity and no Canadian-only client restriction. Keep the Canadian badge, but avoid "Canadian-first" positioning, geography-qualified audience descriptions, and claims that Canadian clients receive priority. Mention Canadian infrastructure only where its location is confirmed; do not imply mandatory Canadian data residency. Prefer removing repetitive copy to adding geographic disclaimers. Nonprofit support and discounts are a secondary point, not an exclusive target market. Keep changes consistent with this design.

The primary catchphrase is "Your mission. Our expertise." ("Votre mission. Notre expertise."). The supporting catchphrase is "Where good ideas become action" ("Là où les bonnes idées deviennent action"). Prioritize these in homepage messaging while keeping the audience inclusive of businesses and nonprofits.

Contact calls to action must link to the localized Contact page, not `mailto:` URLs. Use `EmailCopy.astro` for the email address and copy button. The bilingual contact frontend uses the official EmDash Forms plugin; setup and email-delivery requirements are in `PROJECT.md`.

All public UI and company/project content must be bilingual (English/French). Astro i18n serves English at `/` and French at `/fr/`; never prefix the default locale, which breaks the EmDash admin. Shared views are in `src/components/`, shared translated UI copy is in `src/utils/i18n.ts`, and CMS entries use native EmDash translations. Query content and menus with the request locale. The language switcher follows published translation siblings. Do not claim Canadian data residency, certifications, client outcomes, or product capabilities without confirmation.

Development and production require published entries in their separate CMS databases. There is no bundled seed or sample-content fallback. New installations require schema and content setup; never delete a live database to reinitialize the site.

Local development uses SQLite and local uploads. Docker defaults to PostgreSQL and S3. Adapter selection is build-time; secrets resolve at runtime. `src/db/postgres.ts` deliberately reads `DATABASE_URL` at runtime so it is not embedded in the image.

## Pages

| Page        | Path            | What it shows                                          |
| ----------- | --------------- | ------------------------------------------------------ |
| Home        | `/`             | Homepage backed by the `home` Pages entry              |
| All posts   | `/posts`        | Post list                                              |
| Post detail | `/posts/[slug]` | Post content                                           |
| Page        | `/[slug]`       | About us, Mission & approach, Specializations, Contact |
| Category | `/category/[slug]` | Posts filtered by category |
| Tag | `/tag/[slug]` | Posts filtered by tag |

Mission and Process share the `/mission` page (`/fr/mission` in French), along with the ecosystem/infrastructure visual. Services has its own `/services` page (`/fr/services` in French), backed by the localized published `services` CMS entry. Query the requested CMS slug directly; do not add Services aliases, legacy redirects, or menu URL rewriting. Both Services translations must use the slug `services`, and the localized `primary` CMS menus must link directly to those pages. Point homepage service links to the standalone page. Legacy `/process` URLs redirect to Mission in both locales. Retained redirects must preserve query parameters, including `_preview`; preview redirects are temporary, not permanent. Keep all Services content and teasers out of Mission; Services remains accessible through the shared navigation.

## Schema

- `posts` collection: `title`, `featured_image`, `content` (Portable Text), `excerpt` (text).
- `pages` collection: `title`, `heading`, `summary`, `content` (Portable Text).
- `projects` collection: `title`, `organization`, `category` (select), `summary`, `url`, `repository_url`, `logo` (image), `sort_order`. Group by Client & nonprofit work, Internal products, and Open source; translate the group labels in UI, not the stored enum values.
- `organizations` collection: `title`, `url`, `logo` (image), `sort_order`. Published entries in the request locale populate the homepage's Worked with logo section; list each organization once, independently of its number of projects.
- Taxonomies: `category`, `tag`.
- Single `primary` menu.

Site settings have `title` and `tagline`.

## Visual character

Green/cream palette, restrained typography, a minimal technology-and-care hero illustration, and responsive card/section layouts. The hero artwork lives in `public/illustrations/technology-for-good.svg`. Use the existing CSS tokens and components.

The customized site includes:

- `src/styles/theme.css` -- shared palette, typography, and responsive layouts.
- `src/utils/navigation.ts` -- fallback navigation before setup.
- `Dockerfile` and `.env.example` -- self-hosted deployment foundation.

## What to do here

If you're customising this template, the work is to add design, not to subtract it. Reasonable first moves:

1. Decide on one display + one body typeface, add them to `astro.config.mjs`, bind them to `--font-display` and `--font-body` CSS variables.
2. Create `src/styles/theme.css` with your colour palette, type scale, and spacing tokens.
3. Import it from `Base.astro`, then add any page-specific styles in the relevant Astro page.
4. Build page-specific styles in each Astro page's `<style>` block, referencing the CSS variables.

The optional posts/Insights scaffold is retained but not linked in the company-site navigation.

## What not to do

- Don't treat this as a finished design. The unstyled output is intentional; shipping it as-is looks unfinished because it is.
- Don't add component libraries (Tailwind UI, shadcn, etc.) without considering what they bring with them. The template is small on purpose.
- Don't recreate the blog template's three-column reading view here. If that's what you want, start from `blog`.
