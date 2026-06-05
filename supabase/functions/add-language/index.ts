import "@supabase/functions-js/edge-runtime.d.ts";

import { addLanguage } from "./addLanguage.ts";

Deno.serve(async (req) => {

  try {

    const { language } =
      await req.json();

    console.log(
      `🚀 Starting request for ${language}`
    );

    await addLanguage({
      language,
    });

    console.log(
      `✅ addLanguage completed for ${language}`
    );

    console.log(
      "🚀 RETURNING SUCCESS RESPONSE"
    );

    return Response.json({
      success: true,
      language,
    });

  } catch (error: any) {

    console.error(
      "🔥 TOP LEVEL ERROR"
    );

    console.error(error);

    console.error(
      error?.message
    );

    console.error(
      error?.stack
    );

    return Response.json(
      {
        success: false,

        error:
          error?.message ||
          String(error),
      },
      {
        status: 500,
      }
    );
  }
});