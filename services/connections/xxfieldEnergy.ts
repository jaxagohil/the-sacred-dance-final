// services/connections/fieldEnergy.ts

type Message = {

  content?: string | null;

  metadata?: {

    name?: string;

    avatar_url?: string;
  };
};

type Presence = {

  name?: string;

  avatar_url?: string;

  metadata?: {

    stillness?: boolean;
  };
};

type FieldTone =
  | "soft"
  | "tender"
  | "grieving"
  | "hopeful"
  | "open"
  | "reflective"
  | "heavy"
  | "quiet";

type FieldDensity =
  | "quiet"
  | "active"
  | "resonant";

type FieldEnergyResult = {

  tone: FieldTone;

  density: FieldDensity;

  whisper: string;

  color: string;

  scores: Record<
    string,
    number
  >;
};

//
// 🌊 EMOTIONAL KEYWORDS
//

const toneKeywords = {

  soft: [
    "soft",
    "gentle",
    "ease",
    "calm",
    "breathe",
    "peace",
    "still",
    "quiet",
    "slow",
  ],

  tender: [
    "heart",
    "love",
    "held",
    "care",
    "tender",
    "open",
    "warm",
    "trust",
  ],

  grieving: [
    "grief",
    "loss",
    "cry",
    "sad",
    "alone",
    "pain",
    "miss",
    "hurt",
    "heavy",
  ],

  hopeful: [
    "hope",
    "light",
    "beginning",
    "healing",
    "growth",
    "future",
    "rise",
    "new",
  ],

  open: [
    "truth",
    "honest",
    "share",
    "seen",
    "receive",
    "allow",
    "vulnerable",
  ],

  reflective: [
    "learning",
    "realising",
    "realizing",
    "understand",
    "observe",
    "notice",
    "becoming",
  ],

  heavy: [
    "overwhelmed",
    "tired",
    "stuck",
    "fear",
    "anxious",
    "confused",
    "blocked",
  ],
};

//
// ✨ TONE COLORS
//

const toneColors = {

  soft:
    "#B7C9C3",

  tender:
    "#D7B8C8",

  grieving:
    "#8C93A8",

  hopeful:
    "#D8C690",

  open:
    "#AFCFE8",

  reflective:
    "#C6C1D9",

  heavy:
    "#7A7A86",

  quiet:
    "#A8A8A8",
};

//
// 🌊 MAIN ENGINE
//

export function deriveFieldEnergy(
  messages: Message[] = [],
  presence: Presence[] = []
): FieldEnergyResult {

  try {

    //
    // 🌊 EMPTY FIELD
    //

    if (
      messages.length === 0 &&
      presence.length === 0
    ) {

      return {

        tone: "quiet",

        density: "quiet",

        whisper:
          "The field is resting softly today.",

        color:
          toneColors.quiet,

        scores: {},
      };
    }

    //
    // ✨ SCORE MAP
    //

    const scores:
      Record<string, number> =
      {};

    Object.keys(
      toneKeywords
    ).forEach((tone) => {

      scores[tone] = 0;
    });

    //
    // 🌊 SCORE MESSAGES
    //

    messages.forEach(
      (message) => {

        const content =
          message.content
            ?.toLowerCase() || "";

        Object.entries(
          toneKeywords
        ).forEach(
          ([tone, keywords]) => {

            keywords.forEach(
              (keyword) => {

                if (
                  content.includes(
                    keyword
                  )
                ) {

                  scores[tone] += 1;
                }
              }
            );
          }
        );
      }
    );

    //
    // 🌙 STILLNESS BONUS
    //

    const stillnessCount =
      presence.filter(
        (p) =>
          p?.metadata
            ?.stillness
      ).length;

    if (
      stillnessCount >= 2
    ) {

      scores.soft += 2;

      scores.reflective += 1;
    }

    //
    // ✨ RELATIONAL SOFTENING
    //

    if (
      messages.length >= 2 &&
      presence.length >= 2
    ) {

      scores.open += 1;

      scores.tender += 1;
    }

    //
    // ✨ QUIET HUMAN FIELD
    //

    if (
      messages.length <= 1 &&
      presence.length >= 1
    ) {

      scores.soft += 1;
    }

    //
    // ✨ FIND DOMINANT TONE
    //

    let dominantTone:
      FieldTone = "quiet";

    let highest = 0;

    Object.entries(scores)
      .forEach(
        ([tone, value]) => {

          if (
            value > highest
          ) {

            highest = value;

            dominantTone =
              tone as FieldTone;
          }
        }
      );

    //
    // 🌍 DENSITY
    //

    let density:
      FieldDensity =
      "quiet";

    const totalActivity =
      messages.length +
      presence.length;

    if (
      totalActivity >= 12
    ) {

      density =
        "resonant";

    } else if (
      totalActivity >= 5
    ) {

      density =
        "active";
    }

    //
    // ✨ WHISPERS
    //

    const whispers = {

      soft: [

        "A softer emotional atmosphere is moving through the field today.",

        "The field feels calm, gentle, and emotionally spacious.",

        "A quieter tenderness is settling into the space.",

        "The field is moving slowly and softly right now.",
      ],

      tender: [

        "A quiet tenderness is moving through the collective.",

        "The field feels emotionally open and heart-led today.",

        "A gentler relational energy is present between beings.",

        "The space feels quietly caring and emotionally available.",
      ],

      grieving: [

        "There is grief moving gently through the field today.",

        "The collective space feels emotionally heavy, but deeply human.",

        "The field is holding sadness with softness and care.",
      ],

      hopeful: [

        "A hopeful energy is beginning to emerge through the field.",

        "The field feels quietly healing and future-facing.",

        "Something lighter is beginning to move through the space.",
      ],

      open: [

        "Honesty and emotional openness are moving through the field.",

        "The collective space feels more emotionally available today.",

        "The field feels relationally open and emotionally receptive.",
      ],

      reflective: [

        "A contemplative stillness is shaping the field today.",

        "The field feels inward, aware, and emotionally observant.",

        "Something reflective and aware is moving through the space.",
      ],

      heavy: [

        "The field is holding emotional weight and uncertainty today.",

        "A denser emotional atmosphere is moving through the collective.",

        "The space feels emotionally full and slightly overwhelmed.",
      ],

      quiet: [

        "The field is resting softly today.",

        "A quieter emotional rhythm is present in the field.",

        "Presence is enough for this moment.",
      ],
    };

    const toneWhispers =
      whispers[
        dominantTone
      ] || whispers.quiet;

    const whisper =
      toneWhispers[
        Math.floor(
          Math.random() *
          toneWhispers.length
        )
      ];

    //
    // 🌈 RESULT
    //

    return {

      tone:
        dominantTone,

      density,

      whisper,

      color:
        toneColors[
          dominantTone
        ],

      scores,
    };

  } catch (error) {

    console.log(
      "❌ FIELD ENERGY ERROR",
      error
    );

    return {

      tone: "quiet",

      density: "quiet",

      whisper:
        "The field is resting softly today.",

      color:
        toneColors.quiet,

      scores: {},
    };
  }
}