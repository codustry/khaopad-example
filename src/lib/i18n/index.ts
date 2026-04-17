import type { Locale } from "$lib/server/content/types";

export const SUPPORTED_LOCALES: Locale[] = ["en", "th"];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  th: "ไทย",
  en: "English",
};

/** Narrow `string` (e.g. from layout data) to {@link Locale} without `as` in components. */
export function toLocale(value: string): Locale {
  if (value === "en" || value === "th") return value;
  return DEFAULT_LOCALE;
}

/** First path segment locale (`/en/...`, `/th/...`), or default when missing. */
export function localeFromPathname(
  pathname: string,
  supported: readonly string[] = SUPPORTED_LOCALES,
  defaultLocale: string = DEFAULT_LOCALE,
): string {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  return supported.includes(segment) ? segment : defaultLocale;
}

/** Get the other locale (for language switcher) */
export function getAlternateLocale(current: Locale): Locale {
  return current === "en" ? "th" : "en";
}

/** Build a localized path */
export function localePath(locale: Locale, path: string): string {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
