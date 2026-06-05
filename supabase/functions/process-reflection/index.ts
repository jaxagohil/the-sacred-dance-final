import { serve } from "https://deno.land/std/http/server.ts";

import { processReflection } from "./flow.ts";

serve(async (req) => {

  try {

    const body =
      await req.json();

    const result =
      await processReflection(body);

    return new Response(
      JSON.stringify(result),
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
        error: String(error),
      }),
      {
        status: 500,
      }
    );
  }
});