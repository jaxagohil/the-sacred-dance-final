import { serve } from "https://deno.land/std/http/server.ts";

import {
  addOracleCardsLanguage,
} from "./addOracleCardsLanguage.ts";

serve(
  async (req) => {

    try {

      const body =
        await req.json();

      await addOracleCardsLanguage(
        body
      );

      return new Response(

        JSON.stringify({

          success: true,

          language:
            body.language,
        }),

        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

    } catch (error) {

      return new Response(

        JSON.stringify({

          success: false,

          error:
            error.message,
        }),

        {
          status: 500,

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );
    }
  }
);