export const TABLE_CONFIGS = [

  /*
   * ------------------------------------------------
   * 😊 EMOTIONS
   * ------------------------------------------------
   */

  {
    table: "emotions",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "name",

      "description",

      "integration",

      "core_need",

      "somatic_expression",
    ],

    preserveFields: [

      "emotion_key",

      "emotional_family",

      "nervous_system_state",
    ],
  },

  /*
   * ------------------------------------------------
   * 🧠 BEHAVIOURS
   * ------------------------------------------------
   */

  {
    table: "behaviours",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "shadow_meaning",

      "integrated_meaning",

      "nervous_system_need",

      "mirror_question",

      "integration_step",

      "embodiment",
    ],

    preserveFields: [

      "behaviour_key",

      "quality",

      "chakra_weights",

      "contraction",

      "expansion",

      "masculine",

      "feminine",
    ],
  },

  /*
   * ------------------------------------------------
   * 🌈 CHAKRAS
   * ------------------------------------------------
   */

  {
    table: "chakras",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "name",

      "description",

      "guidance",
    ],

    preserveFields: [

      "chakra_key",

      "color",
    ],
  },

  /*
   * ------------------------------------------------
   * 🪞 BEHAVIOUR LENS WEIGHTS
   * ------------------------------------------------
   */

  {
    table:
      "behaviour_lens_weights",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "manifestation",

      "observable_scene",

      "body_response",

      "coping_strategy",

      "relational_effect",

      "mirror_prompt",

      "integrated_expression",
    ],

    preserveFields: [

      "behaviour_id",

      "lens",

      "weight",

      "activation_level",
    ],
  },

];