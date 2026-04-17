import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes (shadcn/ui helper) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string for display */
export function formatDate(date: string, locale: string = "en"): string {
  return new Date(date).toLocaleDateString(
    locale === "th" ? "th-TH" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

/**
 * Generate a URL-safe ASCII slug from text.
 *
 * Slugs are always English-only and shared across all locales — when the user
 * writes a Thai title, they must provide an English title (or explicit slug)
 * for the canonical URL. Non-ASCII characters are stripped, not transliterated.
 *
 * Examples:
 *   slugify("Hello World")        -> "hello-world"
 *   slugify("My First Post!")     -> "my-first-post"
 *   slugify("สวัสดี Hello")       -> "hello"
 *   slugify("สวัสดี")              -> ""   (caller must validate non-empty)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .replace(/[^\x20-\x7e]/g, "") // ASCII printable only
    .replace(/[^a-z0-9\s-]/g, "") // letters/digits/space/hyphen
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Auto-generate a slug from the English title of an article.
 *
 * The slug is derived from the English locale's title (the canonical one for URLs).
 * Throws if the English title would produce an empty slug — slugs cannot be derived
 * from non-Latin titles, so the user must supply an English title.
 */
export function generateSlugFromTitle(englishTitle: string): string {
  const slug = slugify(englishTitle);
  if (!slug) {
    throw new Error(
      "Cannot generate slug: English title is required and must contain ASCII letters or digits.",
    );
  }
  return slug;
}

/** Truncate text to a max length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
