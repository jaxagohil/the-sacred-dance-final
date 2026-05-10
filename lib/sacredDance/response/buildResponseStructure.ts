// lib/sacredDance/response/buildResponseStructure.ts

//
// 🌌 TYPES
//

export type ResponseSection = {

  id: string;

  purpose: string;

  tone?: string;

  optional?: boolean;
};

export type ResponseStructure = {

  format: string;

  pacing: string;

  sections: ResponseSection[];
};

export type BuildResponseStructureInput = {

  guide?: string;

  lens?: string;

  chakra?: string;

  theme?: string;

  hasOracle?: boolean;

  hasTarot?: boolean;
};

//
// ✨ MAIN
//

export function buildResponseStructure(
  input: BuildResponseStructureInput
): ResponseStructure {

  const {

    guide,

    lens,

    chakra,

    theme,

    hasOracle = true,

    hasTarot = true,

  } = input;

  //
  // 🌙 BASE STRUCTURE
  //

  const structure: ResponseStructure = {

    format:
      "flowing sacred reflection",

    pacing:
      "slow",

    sections: [

      {
        id:
          "opening",

        purpose:
          "soft emotional arrival",

        tone:
          "gentle",
      },

      {
        id:
          "mirror",

        purpose:
          "reflect emotional and energetic patterns",

        tone:
          "emotionally precise",
      },

      {
        id:
          "guidance",

        purpose:
          "offer grounded sacred insight",

        tone:
          "supportive",
      },

      {
        id:
          "integration",

        purpose:
          "leave the user feeling calm and aware",

        tone:
          "spacious",
      },
    ],
  };

  //
  // 🃏 ORACLE LAYER
  //

  if (hasOracle) {

    structure.sections.splice(
      2,
      0,
      {

        id:
          "oracle",

        purpose:
          "weave oracle symbolism naturally into the reflection",

        tone:
          "symbolic",
      }
    );
  }

  //
  // 🔮 TAROT LAYER
  //

  if (hasTarot) {

    structure.sections.splice(
      3,
      0,
      {

        id:
          "tarot",

        purpose:
          "add archetypal emotional resonance",

        tone:
          "reflective",
      }
    );
  }

  //
  // 🌸 GUIDE MODULATION
  //

  switch (
    guide?.toLowerCase()
  ) {

    case "nani":

      structure.pacing =
        "very slow";

      break;

    case "lala":

      structure.format =
        "grounded mirror reflection";

      break;

    case "ammaarah":

      structure.format =
        "expanded consciousness reflection";

      break;

    case "thakorji":

      structure.format =
        "devotional sacred reflection";

      break;
  }

  //
  // ⚡ CHAKRA MODULATION
  //

  switch (
    chakra?.toLowerCase()
  ) {

    case "root":

      structure.sections.push({

        id:
          "grounding",

        purpose:
          "restore stability and presence",

        tone:
          "grounded",
      });

      break;

    case "heart":

      structure.sections.push({

        id:
          "heart_opening",

        purpose:
          "soften emotional protection gently",

        tone:
          "warm",
      });

      break;

    case "crown":

      structure.sections.push({

        id:
          "expansion",

        purpose:
          "create spacious spiritual awareness",

        tone:
          "cosmic",
      });

      break;
  }

  //
  // 🪞 LENS MODULATION
  //

  switch (
    lens?.toLowerCase()
  ) {

    case "people":

      structure.sections.push({

        id:
          "relationship_mirror",

        purpose:
          "reflect relational emotional patterns",

        tone:
          "intimate",
      });

      break;

    case "places":

      structure.sections.push({

        id:
          "environmental_reflection",

        purpose:
          "explore energetic resonance with places",

        tone:
          "spacious",
      });

      break;

    case "things":

      structure.sections.push({

        id:
          "symbolic_attachment",

        purpose:
          "reflect attachment and meaning patterns",

        tone:
          "observant",
      });

      break;
  }

  //
  // 🌙 THEMES
  //

  switch (
    theme?.toLowerCase()
  ) {

    case "abandonment":

      structure.sections.push({

        id:
          "safety",

        purpose:
          "restore emotional safety gently",

        tone:
          "nurturing",
      });

      break;

    case "awakening":

      structure.sections.push({

        id:
          "awakening",

        purpose:
          "support consciousness expansion",

        tone:
          "mystical",
      });

      break;

    case "truth":

      structure.sections.push({

        id:
          "clarity",

        purpose:
          "bring grounded emotional honesty",

        tone:
          "clear",
      });

      break;
  }

  //
  // 🌌 RETURN
  //

  return structure;
}