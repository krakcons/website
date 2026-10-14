# Development and production workflow

## Decision

Develop and test code locally, then deploy approved code changes through Git. Edit CMS-managed content directly in the confirmed production CMS, using drafts, preview, and explicit publication. Do not promote local CMS content to production as the normal workflow.

- Local development uses its own database and uploads.
- Never connect the local application directly to the production database.
- Local CMS content is representative test data, not the source of truth for production. Refresh it from approved production content when needed, without copying production credentials or visitor submissions.
- The repository has no bundled seed or sample-content fallback; CMS databases own the schema and content.
- Do not reseed, replace the production database, or import the whole dev site to promote routine content edits.

## Code and content workflow

1. Implement and test code changes locally against a separate development database. This includes layouts, styling, components, plugin registration, and copy stored in shared UI translations.
2. Review and commit approved code changes, then deploy the tested commit to production.
3. For CMS-managed content, confirm the production URL and read the current entries, including pending drafts, before editing.
4. Edit English and French content in the production CMS. Save drafts and preview before publishing; preserve unrelated fields and existing editorial work.
5. Publish approved content and verify both production locales.

When code and content change together, keep code compatible with old and new content where possible. Prepare content drafts, deploy the compatible code, then publish the approved content. Code deployment does not update database-owned content.

Use staging when a change cannot safely separate code deployment from content publication.

## Safe production content edits

Production content can be edited through the admin UI or, for an explicitly requested batch, the EmDash CLI or API. Agents must:

- Confirm the explicit production URL; never assume a CMS tool connection targets localhost or production.
- Identify entries by collection, slug, and locale. Resolve IDs from production; do not reuse dev IDs.
- Read the current production values and review proposed field-level changes before writing.
- Update only the requested entries and fields, including their English and French versions.
- Preserve unrelated production fields and content.
- Read production revision tokens before updates and stop for review on conflicts, pending drafts, or editor locks. Never override locks automatically.
- Require approval before writes and a separate explicit publication step.
- Handle approved site-setting changes as partial updates, separate from entry updates.
- Never overwrite production with a local database, seed, or whole-site import for routine content edits.
- Keep credentials out of source control and logs.

CLI content updates publish by default, so use `--draft` when staging changes. There is no automatic local-to-production content sync, and a content promotion script is no longer planned as part of the normal workflow.

## Content ownership

- Production CMS entries are the source of truth for editable page headings, summaries, body content, and project information.
- Code holds layouts, styling, and shared interface translations. Homepage service and project teasers are CMS-owned Cards blocks in the localized home entries.
- New installations require CMS schema and content setup; no seed content is bundled with the application.

Marketing copy currently spans CMS entries and shared translations in `src/utils/i18n.ts`. Check both when making changes so the homepage and detail pages remain consistent.

## Contact forms and email

Production's canonical origin is `https://krakconsultants.com`. Keep the build workflow's `vite_site_url`, runtime `EMDASH_SITE_URL`, and EmDash's Site URL aligned. `www` redirects to the apex, preserving paths and queries. Public page metadata must use the public origin, never the container's `localhost` address. Domain changes do not require replacing mail DNS records or moving CMS data; update the site setting separately and verify canonical URLs, language alternates, sitemaps, robots.txt, and media after deployment.

- Contact calls to action open the localized Contact page, never the visitor's email client. The email address has an accessible copy button.
- `@emdash-cms/plugin-forms` handles validation, honeypot spam protection, submission storage, and notifications. A custom bilingual frontend submits to its public API; its success message means the submission was stored, not that email delivery is guaranteed.
- Register Forms and the site's minimal native `krakstack-smtp` plugin in `astro.config.mjs`. Restart the dev server after changing plugin registration.
- With the restarted local server running, use `npm run setup:contact -- http://localhost:4321` to create `contact-en` and `contact-fr`. This command is local-only and leaves existing forms unchanged.
- Form definitions live in plugin storage, not page entries or the seed file. Develop and test the frontend locally, but create and maintain production form definitions directly in the production Forms admin. Deploying code or running the local setup command does not create production forms.
- For production, create/review the same two slugs in the Forms admin. Required fields: `name` (text, maximum 150), `email` (email, maximum 254), `message` (textarea, 10–5000 characters). Optional: `organization` (text, maximum 200). Enable honeypot protection and set notification recipient to `info@krakconsultants.com`. Translate labels and confirmation copy for each form.
- Production email is configured only through runtime environment variables: inject `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM`; optionally set `SMTP_NAME` (defaults to Krak Consultants). Select `krakstack-smtp` under Settings → Email and send a test email before launch. The small native hook connects EmDash email delivery to Nodemailer; no third-party SMTP plugin, provider settings UI, or CMS-stored SMTP credentials are needed. If migrating from `emdash-smtp` or the former `runtime-smtp` ID, verify that `krakstack-smtp` is selected after deployment; EmDash normally auto-selects it as the sole active provider. Secrets are read at delivery time, not embedded in the build. Port 465 uses implicit TLS; other ports require STARTTLS and certificate validation. Missing/invalid configuration fails without falling back. Runtime failures surface through EmDash's email logs without SMTP credentials or message bodies. Verify production delivery with the Settings → Email test and both public contact forms.
- For local testing, leave SMTP variables unset, select EmDash's development console provider under Settings → Email, and inspect captured messages at `/_emdash/api/dev/emails`. Do not copy production credentials into dev.
- The website does not inherit the shared WordPress SMTP service. Enable and configure project-specific SES in infrastructure to provision the project's sending identity and credentials. For `krak-consultants-website-prod`, infrastructure then supplies the SMTP settings and defaults `SMTP_FROM` to `noreply@` the first configured SES domain (unless explicitly overridden). With project SES disabled, only explicitly configured SMTP variables are used; there is no automatic shared fallback. Apply the project deployment after configuration and verify delivery. Run `npm run test:smtp` for isolated transport tests; no real emails or production secrets are used.
- Review submission retention and stronger spam protection before production launch. This frontend currently supports honeypot forms only; do not switch a form to Turnstile without adding the corresponding frontend challenge.
