export const TABLE_CONFIGS = [

 
  /*
   * ------------------------------------------------
   * 🌌 GUIDANCE ORCHESTRATION CONTENT
   * ------------------------------------------------
   */

  {
    table:
      "guidance_orchestration_content",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "text",
    ],

    preserveFields: [

      "language",

      "active",

      "priority",

      "type",

      "category",

      "subtype",

      "guide",

      "content_key",

      "symbolic_weight",

      "emotional_intensity",

      "emergence_weight",

      "spiral_phase",

      "nervous_system_state",

      "chakra",

      "lens",

      "distortion_dot",

      "emotional_field",

      "allow_echo",

      "metadata",

      "symbol",

      "render_style",
    ],

    onConflict:
      "content_key,language",
  },

  /*
   * ------------------------------------------------
   * 🌍 UI TRANSLATIONS
   * ------------------------------------------------
   */

  {
    table:
      "ui_translations",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "value",
    ],

    preserveFields: [

      "key",

      "screen",
    ],

    onConflict:
      "screen,key,language",
  },
   

];