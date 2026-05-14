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
     * CARDS
     * -------------------------------------------------------
     */

    case "cards":

      return buildGuidePrompt({

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