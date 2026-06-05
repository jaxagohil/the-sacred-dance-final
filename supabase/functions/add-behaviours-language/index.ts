import "@supabase/functions-js/edge-runtime.d.ts";

import {
  addBehavioursLanguage,
} from "./addBehavioursLanguage.ts";

Deno.serve(
  async (req) => {

    try {

      const {
        language,
      } =
        await req.json();

      await addBehavioursLanguage({

        language,
      });

      return Response.json({

        success: true,

        language,
      });

    } catch (error: any) {

      console.error(error);

      return Response.json(
        {

          success: false,

          error:
            error?.message ??
            String(error),
        },
        {
          status: 500,
        }
      );
    }
  }
);