import { supabase } from "../../services/supabase";

type TranslationMap = Record<string, string>;

let currentLanguage = "en";

let translations: TranslationMap = {};

export const getLanguage =
  () => currentLanguage;

//
// 🌍 SET LANGUAGE
//

export const setLanguage = async (
  lang: string
) => {

  currentLanguage =
    lang || "en";

  console.log(
    "🌍 LANGUAGE SET:",
    currentLanguage
  );

  await loadTranslations();
};

//
// 📚 LOAD TRANSLATIONS
//

export const loadTranslations =
  async () => {

    try {

      const { data, error } =
        await supabase

          .from("ui_translations")

          .select(
            "screen, key, value"
          )

          .eq(
            "language",
            currentLanguage
          );

      if (error) {

        console.log(
          "❌ TRANSLATION ERROR",
          error
        );

        return;
      }

      const mapped:
        TranslationMap = {};

      data?.forEach((item) => {

        mapped[
          `${item.screen}.${item.key}`
        ] = item.value;
      });

      translations = mapped;

      //console.log( "✅ TRANSLATIONS LOADED",  translations);

    } catch (err) {

      console.log(
        "❌ LOAD TRANSLATIONS FAILED",
        err
      );
    }
  };

//
// ✨ TRANSLATE
//

export const t = (
  key: string
) => {

  return (
    translations[key] ||
    key
  );
};