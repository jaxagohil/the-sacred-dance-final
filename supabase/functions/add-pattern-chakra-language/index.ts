// index.ts

import {
  addPatternChakraLanguage,
} from "./addPatternChakraLanguage.ts";

Deno.serve(
  async (req) => {

    const {
      language,
    } = await req.json();

    await addPatternChakraLanguage({
      language,
    });

    return Response.json({
      success: true,
      language,
    });
  }
);