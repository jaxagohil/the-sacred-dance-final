// /lib/connections/localizeConnectionContent.ts

import {
    translateEmotionally,
} from "./translateEmotionally";

type Item = {

  id?: string;

  content: string;

  language?: string;

  [key: string]: any;
};

type Params = {

  items: Item[];

  viewerLanguage?: string;
};

export async function
localizeConnectionContent({

  items,

  viewerLanguage = "en",

}: Params) {

  /*
   * ---------------------------------------------------------
   * 🌍 LOCALIZE
   * ---------------------------------------------------------
   */

  const localized =
    await Promise.all(

      items.map(
        async (item) => {

          /*
           * -------------------------------------------------
           * ✨ DEFAULT
           * -------------------------------------------------
           */

          let translatedContent =
            item.content;

          /*
           * -------------------------------------------------
           * 🌍 TRANSLATE
           * -------------------------------------------------
           */

          if (

            item.language &&

            viewerLanguage &&

            item.language !==
              viewerLanguage

          ) {

            translatedContent =
              await translateEmotionally({

                text:
                  item.content,

                sourceLanguage:
                  item.language,

                targetLanguage:
                  viewerLanguage,
              });
          }

          /*
           * -------------------------------------------------
           * ✨ RETURN
           * -------------------------------------------------
           */

          return {

            ...item,

            translatedContent,
          };
        }
      )
    );

  return localized;
}