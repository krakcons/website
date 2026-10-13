import { getEmDashEntry } from "emdash";
import type { Locale } from "./i18n";

export const loadCompanyPage = async (slug: string, locale: Locale) => {
  const result = await getEmDashEntry("pages", slug, { locale });
  // Never silently serve English copy as a French production page.
  const entry =
    result.fallbackLocale && result.fallbackLocale !== locale
      ? null
      : result.entry;
  return {
    ...result,
    entry,
    data: entry?.data,
  };
};
