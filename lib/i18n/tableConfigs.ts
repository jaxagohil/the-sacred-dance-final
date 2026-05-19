// /lib/i18n/tableConfigs.ts

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

    onConflict:
      "emotion_key,language",
  },

  /*
   * ------------------------------------------------
   * 😊 EMOTION SYNONYMS
   * ------------------------------------------------
   */

  {
    table:
      "emotion_synonyms",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "synonym",
    ],

    preserveFields: [

      "emotion_key",
    ],

    onConflict:
      "emotion_key,synonym,language",
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

    onConflict:
      "behaviour_key,language",
  },

  /*
   * ------------------------------------------------
   * 🧠 BEHAVIOUR SYNONYMS
   * ------------------------------------------------
   */

  {
    table:
      "behaviour_synonyms",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "synonym",
    ],

    preserveFields: [

      "behaviour_key",
    ],

    onConflict:
      "behaviour_key,synonym,language",
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

    onConflict:
      "chakra_key,language",
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

    onConflict:
      "behaviour_id,lens,language",
  },

  /*
   * ------------------------------------------------
   * 🎴 ORACLE CARDS
   * ------------------------------------------------
   */

  {
    table:
      "oracle_cards",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "title",

      "message",

      "integration",

      "guide_message",
    ],

    preserveFields: [

      "card_key",

      "guide",

      "archetype",

      "energy_type",
    ],

    onConflict:
      "card_key,language",
  },

  /*
   * ------------------------------------------------
   * 🌞 DAILY PROMPTS
   * ------------------------------------------------
   */

  {
    table:
      "daily_prompts",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "prompt",
    ],

    preserveFields: [

      "category",

      "tone",
    ],

    onConflict:
      "prompt,language",
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

      "section",
    ],

    onConflict:
      "key,language",
  },

  /*
   * ------------------------------------------------
   * 🌍 LANGUAGES
   * ------------------------------------------------
   */

  {
    table:
      "languages",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "name",

      "native_name",
    ],

    preserveFields: [

      "code",

      "rtl",

      "font_family",
    ],

    onConflict:
      "code",
  },
];