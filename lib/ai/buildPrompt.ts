// /lib/ai/buildPrompt.ts

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

export function buildPrompt({

  type,

  context,

  data,

}: any) {

  switch (type) {

    /*
     * -------------------------------------------------------
     * DIVINE
     * -------------------------------------------------------
     */

    case "divine":

      return buildDivinePrompt({

        context,

        data,
      });

    /*
     * -------------------------------------------------------
     * GUIDE
     * -------------------------------------------------------
     */

    case "guide":

      return buildGuidePrompt({

        context,

        data,
      });

    /*
     * -------------------------------------------------------
     * LENS
     * -------------------------------------------------------
     */

    case "lens":

      return buildLensPrompt({

        context,

        data,
      });

      /*
 * -------------------------------------------------------
 * TAROT
 * -------------------------------------------------------
 */

case "tarot":

  return buildTarotPrompt({

    context,

    data,
  });

    /*
     * -------------------------------------------------------
     * CONNECTIONS
     * -------------------------------------------------------
     */

    case "transmission":

      return buildConnectionsPrompt({

        context,

        data,
      });

    /*
     * -------------------------------------------------------
     * COSMIC
     * -------------------------------------------------------
     */

    case "cosmic":

      return buildCosmicPrompt({

        context,

        data,
      });

    /*
     * -------------------------------------------------------
     * DEFAULT
     * -------------------------------------------------------
     */

    default:

      return buildGuidePrompt({

        context,

        data,
      });
  }
}