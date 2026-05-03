import * as Localization from "expo-localization";

export type Language = "en" | "hi";

// 🌍 SAFE device language detection (Expo-compatible)
const locales = Localization.getLocales();

const deviceLang =
  locales?.[0]?.languageCode === "hi" ? "hi" : "en";

// fallback safety
let currentLang: Language = deviceLang;

// allow override later (user profile)
export function setLanguage(lang: Language) {
  currentLang = lang;
}

export function getLanguage(): Language {
  return currentLang;
}

// ------------------------
// 🧾 TRANSLATIONS
// ------------------------
const translations = {
  en: {
    landing: {
      inputPlaceholder: "Feel... type...",
      send: "send",
    },

    journal: {
      placeholder: "write freely…",
      post: "post",
      reflection: "what feels most true in this right now?",
    },

    guide: {
      placeholder: "share what’s coming up…",
      send: "send",
    },

    profile: {
      name: "your name",
      location: "location",
      language: "language",
      feelsTrue: "what feels true?",
      repeats: "what repeats?",
      theme: "what are you moving through?",
      line: "a line that feels like you…",
      save: "save",
    },
  },

  hi: {
    landing: {
      inputPlaceholder: "महसूस करें... लिखें...",
      send: "भेजें",
    },

    journal: {
      placeholder: "स्वतंत्र रूप से लिखें…",
      post: "पोस्ट करें",
      reflection: "इसमें अभी सबसे सच्चा क्या लगता है?",
    },

    guide: {
      placeholder: "जो आ रहा है उसे साझा करें…",
      send: "भेजें",
    },

    profile: {
      name: "आपका नाम",
      location: "स्थान",
      language: "भाषा",
      feelsTrue: "क्या सच्चा लगता है?",
      repeats: "क्या दोहराता है?",
      theme: "आप किससे गुजर रहे हैं?",
      line: "एक पंक्ति जो आपको दर्शाती है…",
      save: "सहेजें",
    },
  },
} as const;

// ------------------------
// 🔍 HELPER
// ------------------------

type TranslationSchema = typeof translations.en;

export function t(path: string): string {
  const keys = path.split(".");
  let value: any = translations[currentLang];

  for (const key of keys) {
    value = value?.[key];
  }

  return value || "";
}