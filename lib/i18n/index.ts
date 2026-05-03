import { mirrorMessages as en } from "./en";
import { mirrorMessages as hi } from "./hi";
import { getLanguage } from "./i18n";

// ------------------------
// 🌍 LOCALES
// ------------------------

const locales = {
  en,
  hi,
};

// ------------------------
// 🔑 TYPES (auto-safe keys)
// ------------------------

export type MirrorKey = keyof typeof en;

// ------------------------
// 🌿 TRANSLATOR
// ------------------------

export function tMirror(key: MirrorKey): string {
  const lang = getLanguage();

  // pick language dictionary
  const dict = locales[lang] || locales.en;

  // fallback to English if missing
  return dict[key] || locales.en[key] || "";
}