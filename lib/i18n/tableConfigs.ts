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

      "word",

      "integration",

      "core_need",

      "somatic_expression",
    ],

    preserveFields: [

      "id",

      "emotional_family",

      "nervous_system_state",
    ],

    onConflict:
      "id,language",
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

      "emotion_id",
    ],

    onConflict:
      "emotion_id,synonym,language",
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

      "behaviour_id",
    ],

    onConflict:
      "behaviour_id,synonym,language",
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

      "id",

      "name",
    ],

    preserveFields: [

      "color",
    ],

    onConflict:
      "id,language",
  },

  /*
   * ------------------------------------------------
   * 🌈 PATTERN CHAKRA MANIFESTATIONS
   * ------------------------------------------------
   */

  {
    table:
      "pattern_chakra_manifestations",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "wound_expression",

      "body_response",

      "nervous_system_expression",

      "relational_expression",

      "manifestation",

      "masculine_manifestation",

      "feminine_manifestation",

      "integrated_expression",

      "embodiment",

      "integration_path",

      "affirmation",

      "mirror_observation",

      "mirror_realisation",

      "reflective_prompt",
    ],

    preserveFields: [

      "pattern_key",

      "chakra_key",

      "weight",

      "polarity_direction",
    ],

    onConflict:
      "pattern_key,chakra_key,language",
  },

  /*
   * ------------------------------------------------
   * 🎴 ORACLE CARD TRANSLATIONS
   * ------------------------------------------------
   */

  {
    table:
      "oracle_card_translations",

    mode: "full_rows",

    sourceLanguage: "en",

    translatableFields: [

      "title",

      "affirmation",
    ],

    preserveFields: [

      "card_number",
    ],

    onConflict:
      "card_number,language",
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

    "type",

    "day_number",

    "event_key",

    "tone",
  ],

  onConflict:
    "type,day_number,language",
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