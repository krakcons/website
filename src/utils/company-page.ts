import { getEmDashEntry } from "emdash";
import seed from "../../seed/seed.json";
import type { Locale } from "./i18n";

export const loadCompanyPage = async (slug: string, locale: Locale) => {
  const result = await getEmDashEntry("pages", slug, { locale });
  // Never silently serve English copy as a French production page.
  const entry =
    result.fallbackLocale && result.fallbackLocale !== locale
      ? null
      : result.entry;
  const defaults = seed.content.pages.find(
    (page) => page.slug === slug && (page.locale ?? "en") === locale,
  );
  return {
    ...result,
    entry,
    defaults,
    data: entry?.data ?? (import.meta.env.DEV ? defaults?.data : undefined),
  };
};
