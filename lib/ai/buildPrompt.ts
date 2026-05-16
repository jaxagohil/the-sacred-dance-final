// /lib/ai/buildPrompt.ts

import {
  getLanguageName,
} from "../i18n/getLanguageName";

import {
  buildDivinePrompt,
} from "./prompts/buildDivinePrompt";

import {
  buildGuidePrompt,
} from "./prompts/guides/buildGuidePrompt";

import {
  buildLensPrompt,
} from "./prompts/lenses/buildLensPrompt";

import {
  buildConnectionsPrompt,
} from "./prompts/buildConnectionsPrompts";

import {
  buildCosmicPrompt,
} from "./prompts/buildCosmicPrompt";

import {
  buildTarotPrompt,
} from "./prompts/buildTarotPrompt";

export async function buildPrompt({

  type,

  context,

  data,

}: any) {

  /*
   * -------------------------------------------------------
   * 🌍 LANGUAGE NAME
   * -------------------------------------------------------
   */

  const languageName =
    await getLanguageName(
      data?.language
    );

  const enrichedData = {

    ...data,

    languageName,
  };

  switch (type) {

    /*
     * -------------------------------------------------------
     * DIVINE
     * -------------------------------------------------------
     */

    case "divine":

      return buildDivinePrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * GUIDE
     * -------------------------------------------------------
     */

    case "guide":

      return buildGuidePrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * LENS
     * -------------------------------------------------------
     */

    case "lens":

      return buildLensPrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * TAROT
     * -------------------------------------------------------
     */

    case "tarot":

      return buildTarotPrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * CONNECTIONS
     * -------------------------------------------------------
     */

    case "transmission":

      return buildConnectionsPrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * COSMIC
     * -------------------------------------------------------
     */

    case "cosmic":

      return buildCosmicPrompt({

        context,

        data: enrichedData,
      });

    /*
     * -------------------------------------------------------
     * DEFAULT
     * -------------------------------------------------------
     */

    default:

      return buildGuidePrompt({

        context,

        data: enrichedData,
      });
  }
}