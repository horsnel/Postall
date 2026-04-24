// PostAll i18n Module
// Re-exports the language store, translation provider, hook, and types.

export { useLanguageStore } from "@/lib/i18n/translations-store";
export { TranslationProvider, useTranslation } from "@/lib/i18n/provider";
export { translations, locales } from "@/lib/i18n/translations";
export type { Locale, LocaleInfo, TranslationKey } from "@/lib/i18n/translations";
