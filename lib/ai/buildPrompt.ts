import { buildDivinePrompt } from "./prompts/buildDivinePrompt";
import { buildGuidePrompt } from "./prompts/guides/buildGuidePrompt";

export function buildPrompt({

  type,

  context,

  data,

}: any) {

  switch (type) {

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

      return buildGuidePrompt({

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