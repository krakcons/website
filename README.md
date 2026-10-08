# website

KRAK Consultants' bilingual company website, built with Astro and EmDash. Canadian-first software consulting, hosting, and digital solutions for nonprofits and organizations working for good.

## Run locally

Requires Node.js 24 and npm.

```bash
npm install
npm run dev
```

- Website: http://localhost:4321
- French website: http://localhost:4321/fr/
- CMS: http://localhost:4321/_emdash/admin/

The scaffolder generated a private `EMDASH_ENCRYPTION_KEY` in the gitignored `.env`. For a new checkout, generate one with `npx emdash secrets generate` and save it in `.env`.

On a fresh database, complete the CMS setup wizard with your own email and passkey. **Keep “Include sample content” selected** to populate the English and French pages and projects.

For local development only, EmDash also offers `http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin`. It creates a dev admin, imports the sample content, and signs you in. CLI commands can create this dev account automatically; if the normal wizard says “Admin user already exists”, use the dev shortcut rather than resetting the database. Do not use a development account as the production setup strategy.

Before setup, development mode previews the copy from `seed/seed.json`. Published CMS content takes precedence. Production never falls back to sample content: an unpublished/missing page returns 404, and a missing homepage returns a 503 “Coming soon” page.

## Pages and editing

| URL                | Content                                                   |
| ------------------ | --------------------------------------------------------- |
| `/`                | Homepage, backed by the `home` entry in Pages             |
| `/about-us`        | About the team                                            |
| `/mission`         | Mission, with a separate “How we work” subsection         |
| `/process`         | Permanent redirect to `/mission`                          |
| `/specializations` | Services                                                  |
| `/projects`        | Client/nonprofit work, internal products, and open source |
| `/contact`         | Email contact                                             |

Edit titles, display headings, introductions, and body copy in **Pages**. Navigation comes from the **primary** CMS menu. The shared CTA, contact email, homepage service cards, and short process overview currently live in the Astro components; we can move these into structured CMS fields as the content model becomes real.

## Bilingual content and projects

English uses unprefixed URLs; French uses `/fr/` with the same page slugs. Astro i18n and EmDash's native translations connect the two versions. The language switcher follows the published counterpart, and the header displays **🇨🇦 Proudly Canadian / Fièrement canadien**.

In **Pages** or **Projects**, use the locale filter or the entry's **Translations** panel to edit each language. Save and publish English and French independently. Production does not silently substitute English page content when the French translation is unpublished.

**Projects** entries contain a project name, company/organization, category, short description, optional logo, website and separate GitHub repository link, and display order. Select one of the three category values (`Client & nonprofit work`, `Internal products`, `Open source`) in both translations; the website translates the category headings. Add real client projects only when their names and details are approved for public use.

The portfolio includes the 211 Canada app (linked to the Canadian App Store), CompanionLink, Bread (with Technology Helps), Sage Project, internal products Nuonn and Kokobi Learning, and KrakStack open-source tools. KrakStack's default package, registry, and components are one project; Auth and Uptime have separate entries. Descriptions stay within the confirmed scope; detailed case studies can be added later. Kokobi Learning replaces the earlier CocoBee display name, while its existing CMS slug is preserved. Project cards use compact outlined white logo squares beside their names. CompanionLink uses its standalone symbol in project cards; its wordmark remains in the homepage logo row. Kokobi Learning uses the product icon from `learning.kokobi.org`.

**Organizations** controls the homepage's “Worked with” logo section. Edit names, logos, optional websites, and display order in each locale. Each organization has one CMS entry per language, independently of its number of projects. The section includes 211, CompanionLink, Bread, Technology Helps, Sage Project, VolunteerConnector, Mentor Canada, the Government of New Brunswick, and Findhelp. The single-row logo strip scrolls continuously; a repeated visual set keeps the loop seamless without adding duplicate keyboard or screen-reader stops. Hover, keyboard focus, and the pause control stop movement; reduced-motion users get a manually scrollable row. Logos load eagerly to avoid empty spots as they move into view. Logos were sourced from their official websites (source URLs are in the seed), with PNG copies uploaded to the local CMS. `public/logos/` supplies development previews before setup; production uses published CMS entries and media.

The starter also retains an optional Insights/posts collection, but there are no sample articles or public navigation links to it.

Key files:

- `src/layouts/Base.astro`: shared header, footer, SEO and EmDash wiring.
- `src/components/Home.astro`, `ContentPage.astro`, `Projects.astro`: shared bilingual page views.
- `src/pages/` and `src/pages/fr/`: English/French server-rendered routes.
- `src/utils/i18n.ts`: shared English/French UI copy and locale URLs.
- `src/styles/theme.css`: responsive design.
- `seed/seed.json`: initial content model and starter copy.
- `astro.config.mjs`: deployment adapters.

Seed changes do not overwrite an existing database. After setup, edit through the CMS or use EmDash's schema/content tooling. Do not delete a live database to apply a new seed.

## Docker, PostgreSQL and S3

The Docker image defaults to PostgreSQL and S3-compatible storage, ready to integrate with the infrastructure project's Kubernetes deployment workflow. It does not provision databases, buckets, ingress, or cluster resources.

```bash
docker build -t krak-website .
docker run --rm --env-file .env.production -p 4321:4321 krak-website
```

Create `.env.production` using `.env.example` as a guide. Supply:

- `DATABASE_URL`: a dedicated PostgreSQL database and stable owning role.
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
- `EMDASH_SITE_URL=https://krakconsultants.com`.
- `EMDASH_ENCRYPTION_KEY`: preserve and back up this key separately.

Adapter selection happens **at build time**. For a direct PostgreSQL/S3 build:

```bash
EMDASH_DATABASE=postgres EMDASH_STORAGE=s3 npm run build
```

`src/db/postgres.ts` resolves `DATABASE_URL` when the server starts, rather than serializing credentials into Astro's build. S3 credentials also resolve at runtime. Never pass secrets as Docker build arguments.

The image's public origin defaults to `https://krakconsultants.com`. For another environment, set `--build-arg EMDASH_SITE_URL=https://your-host.example.com` and the same runtime variable.

Operational notes:

- Start with one replica. PostgreSQL and S3 hold persistent content; the application needs no content volume. Astro's default session storage is local to the process/container—configure shared sessions before horizontal scaling.
- The PostgreSQL role needs ownership of EmDash objects and `CREATE`/`USAGE` on its schema because the CMS manages content schemas and migrations.
- Keep the S3 bucket private by default. Presigned uploads require a browser-reachable S3 endpoint and suitable CORS. Do not expose the `backups/` prefix through a public media domain.
- Migrations run automatically on the first request. Protect the setup wizard and complete setup yourself before exposing a new deployment publicly.
- Scheduled publishing runs while the Node process is running.
- `/health` is a liveness endpoint, not a database/storage readiness check.
- Back up the database, media, and encryption key. Use separate databases and buckets for staging.
- Sandboxed marketplace/registry plugins are not enabled. Add the Node `workerd` runner if we need them later.

## CI and GHCR images

GitHub Actions in `.github/workflows/production-build.yml` uses the same shared
build-and-deploy helper as the KrakStack template:
`krakcons/krakstack/.github/workflows/project-deploy.yml@main`.
Pushes to `main` build the PostgreSQL/S3 Docker image and publish:

- `ghcr.io/krakcons/website:latest`
- `ghcr.io/krakcons/website:<full-commit-sha>` (used by the admin release)

Images target `linux/amd64`, matching the Krak cluster. Actions authenticate with
the repository's built-in `GITHUB_TOKEN`; no registry password is needed in
repository secrets. The package is linked to this repository through OCI labels.
Keep it private; the cluster's registry account must have access to the package.

The workflow's `vite_site_url` is `https://newwebsite.krakconsultants.net`.
The Dockerfile maps that shared helper argument to `EMDASH_SITE_URL` for the
Astro build. Change the workflow input when changing the public origin, and set
the same `EMDASH_SITE_URL` in the admin project's runtime variables.
Database, S3, and encryption credentials belong in the admin project's runtime
variables, never in Actions variables or Docker build arguments.

After publishing, the shared helper releases the exact commit-tagged image through
`https://admin.krakconsultants.net`. It targets project
`krak-consultants-website-prod`, group `app`, task `krak-consultants-website`.
Pull requests do not trigger this workflow. Run type checking locally before
pushing; the Docker build runs `npm run build` but not `npm run typecheck`.

Configure the Actions secret `KRAK_RELEASE_TOKEN` in this repository (or its
`production` environment) with a token authorized to release this project.
The workflow cannot complete an authenticated release without this secret.
The release job uses the GitHub `production` environment; any configured approval
rules still apply. Database and CMS content are not imported by this workflow.

### Admin project handoff

1. Create the website project with PostgreSQL and private S3 storage.
2. Use `ghcr.io/krakcons/website:latest` initially (or a full commit-SHA tag for
   reproducibility), application port `4321`, and one replica.
3. Supply the runtime variables listed above. For private GHCR pulls, use
   `REGISTRY_USERNAME` and `REGISTRY_TOKEN` with package read access, or inherit
   the shared registry credentials if that account can access this package.
4. Deploy initially through the admin. With `KRAK_RELEASE_TOKEN` configured,
   subsequent successful `main` builds trigger an admin release automatically
   using the full commit-SHA image tag, rather than relying on `latest` updates.
5. Complete protected CMS setup and migrate the approved local CMS content and
   media before switching production traffic. The Git repository contains the
   starter seed, not the live SQLite database or uploaded media.

Use `/health` for liveness. It does not check database or S3 readiness. To roll
back application code, redeploy a previous image digest; database migrations
and CMS content require their own backup/restore plan.

## Checks

```bash
npm run typecheck
npm run build
```

## Next

Review the English/French wording, add approved client organizations and project details, refine the design, and connect the site's own database/bucket and production deployment. The contact link uses `info@krakconsultants.com`; no email form or delivery service is configured.

[EmDash documentation](https://docs.emdashcms.com/) · [Node deployment](https://docs.emdashcms.com/deployment/nodejs/)
