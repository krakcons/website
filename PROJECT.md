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
- Code holds layouts, styling, shared interface translations, and currently the shared homepage service-card copy.
- New installations require CMS schema and content setup; no seed content is bundled with the application.

Marketing copy currently spans CMS entries and shared translations in `src/utils/i18n.ts`. Check both when making changes so the homepage and detail pages remain consistent.

## Contact forms and email

- Contact calls to action open the localized Contact page, never the visitor's email client. The email address has an accessible copy button.
- `@emdash-cms/plugin-forms` handles validation, honeypot spam protection, submission storage, and notifications. A custom bilingual frontend submits to its public API; its success message means the submission was stored, not that email delivery is guaranteed.
- Register the Forms and SMTP plugins in `astro.config.mjs`. Restart the dev server after changing plugin registration.
- With the restarted local server running, use `npm run setup:contact -- http://localhost:4321` to create `contact-en` and `contact-fr`. This command is local-only and leaves existing forms unchanged.
- Form definitions live in plugin storage, not page entries or the seed file. Develop and test the frontend locally, but create and maintain production form definitions directly in the production Forms admin. Deploying code or running the local setup command does not create production forms.
- For production, create/review the same two slugs in the Forms admin. Required fields: `name` (text, maximum 150), `email` (email, maximum 254), `message` (textarea, 10–5000 characters). Optional: `organization` (text, maximum 200). Enable honeypot protection and set notification recipient to `info@krakconsultants.com`. Translate labels and confirmation copy for each form.
- Configure an email provider in the SMTP plugin admin, select the active provider under Settings → Email, and send a test email before launch. Do not copy production credentials into dev. For local testing, use EmDash's development console provider and inspect captured messages at `/_emdash/api/dev/emails`.
- The SMTP plugin currently depends on an outdated Nodemailer release. `package.json` overrides its Node transport dependency to a patched version. Recheck compatibility and `npm audit` when updating these packages; do not remove the override without checking advisories. Real SMTP delivery still requires a configured provider and end-to-end testing.
- Review submission retention and stronger spam protection before production launch. This frontend currently supports honeypot forms only; do not switch a form to Turnstile without adding the corresponding frontend challenge.
