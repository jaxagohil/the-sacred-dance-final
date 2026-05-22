// --------------------------------------------------
// ⚡ PROCESS ENERGY AXES
// --------------------------------------------------

import { processReflection } from "./flow";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProcessEnergyAxesInput = {

  userId: string;

  language?: string;

  source?: string;

    batchId?: string;

  energyAxes: {

    givingReceiving: number;

    structureFlow: number;

    lackAbundance: number;
  };
};

// --------------------------------------------------
// 🧠 HELPERS
// --------------------------------------------------

const clamp = (
  value: number
) =>

  Math.max(
    -1,
    Math.min(1, value)
  );

// --------------------------------------------------
// 🪞 AXIS → PATTERN MAP
// --------------------------------------------------

const AXIS_PATTERN_MAP = {

  giving_receiving:
    "reciprocity",

  structure_flow:
    "flow",

  lack_abundance:
    "abundance",
};

// --------------------------------------------------
// 🚀 MAIN
// --------------------------------------------------

export async function processEnergyAxes({

  userId,

  language = "en",

  source = "baseline",

  batchId,

  energyAxes,

}: ProcessEnergyAxesInput) {

  try {

    // --------------------------------------------------
    // ⚡ AXES
    // --------------------------------------------------

    const axes = [

      {
        id:
          "giving_receiving",

        value:
          clamp(
            energyAxes
              .givingReceiving
          ),
      },

      {
        id:
          "structure_flow",

        value:
          clamp(
            energyAxes
              .structureFlow
          ),
      },

      {
        id:
          "lack_abundance",

        value:
          clamp(
            energyAxes
              .lackAbundance
          ),
      },
    ];

    // --------------------------------------------------
    // ⚡ PROCESS EACH AXIS
    // --------------------------------------------------

    for (const axis of axes) {

      const value =
        axis.value;

      // --------------------------------------------------
      // ⚖️ SKIP BALANCED
      // --------------------------------------------------

      if (
        Math.abs(value) < 0.2
      ) {

        console.log(
          `⚖️ Skipping balanced axis: ${axis.id}`
        );

        continue;
      }

      // --------------------------------------------------
      // ⚡ INTENSITY
      // --------------------------------------------------

      const intensity =
        Math.abs(value);

      // --------------------------------------------------
      // 🪞 REFLECTION TEXT
      // --------------------------------------------------

      let reflectionText =
        "";

      // --------------------------------------------------
      // ❤️ GIVING / RECEIVING
      // --------------------------------------------------

      if (
        axis.id ===
        "giving_receiving"
      ) {

        // ----------------------------------------------
        // LEFT POLE
        // ----------------------------------------------

        if (value < 0) {

          reflectionText = `

Based on what has been shared so far,
there are signs that giving,
supporting,
or extending energy outward
may sometimes feel safer
than fully receiving support,
care,
or emotional reciprocity.

There may be moments
where emotional self-reliance,
over-functioning,
or staying responsible
becomes easier
than remaining open
to mutual support.

This may become more visible
during emotional closeness,
vulnerability,
or relational imbalance.
`;
        }

        // ----------------------------------------------
        // RIGHT POLE
        // ----------------------------------------------

        if (value > 0) {

          reflectionText = `

Based on what has been shared so far,
there are signs that waiting,
withdrawing,
or holding back energy
may sometimes appear
when emotional movement
or relational reciprocity
feels uncertain.

There may be moments
where receiving feels easier
than initiating,
grounding,
or actively engaging discomfort.

This may become more visible
during uncertainty,
emotional exposure,
or relational tension.
`;
        }
      }

      // --------------------------------------------------
      // 🌊 STRUCTURE / FLOW
      // --------------------------------------------------

      if (
        axis.id ===
        "structure_flow"
      ) {

        // ----------------------------------------------
        // LEFT POLE
        // ----------------------------------------------

        if (value < 0) {

          reflectionText = `

Based on what has been shared so far,
there are signs that structure,
control,
or predictability
may become important
when emotional uncertainty increases.

There may be moments
where planning,
monitoring,
or tightening around outcomes
creates temporary nervous system safety.

This may become more visible
during unpredictability,
change,
or emotional overwhelm.
`;
        }

        // ----------------------------------------------
        // RIGHT POLE
        // ----------------------------------------------

        if (value > 0) {

          reflectionText = `

Based on what has been shared so far,
there are signs that drifting,
avoidance,
or difficulty sustaining structure
may appear
when pressure,
expectation,
or emotional tension increases.

There may be moments
where staying fully grounded
inside responsibility
feels emotionally heavy
or restrictive.

This may become more visible
during emotional pressure,
accountability,
or overstimulation.
`;
        }
      }

      // --------------------------------------------------
      // 💰 LACK / ABUNDANCE
      // --------------------------------------------------

      if (
        axis.id ===
        "lack_abundance"
      ) {

        // ----------------------------------------------
        // LEFT POLE
        // ----------------------------------------------

        if (value < 0) {

          reflectionText = `

Based on what has been shared so far,
there are signs that emotional contraction,
anticipation of limitation,
or protective scarcity
may still shape
how safety,
support,
or trust are experienced.

There may be moments
where the nervous system
prepares for disappointment
before fully allowing openness.

This may become more visible
during uncertainty,
receiving,
or emotional dependency.
`;
        }

        // ----------------------------------------------
        // RIGHT POLE
        // ----------------------------------------------

        if (value > 0) {

          reflectionText = `

Based on what has been shared so far,
there are signs of increasing openness
toward trust,
support,
possibility,
or emotional expansion.

There may also be moments
where openness and flow
become easier
than staying grounded
inside practical emotional reality.

This may become more visible
during emotional excitement,
visioning,
or periods of expansion.
`;
        }
      }

      // --------------------------------------------------
      // 🪞 PATTERN
      // --------------------------------------------------

      const mappedPattern =

        AXIS_PATTERN_MAP[
          axis.id as keyof typeof AXIS_PATTERN_MAP
        ];

      // --------------------------------------------------
      // 🚀 PROCESS
      // --------------------------------------------------

      await processReflection({

        userId,

        language,

        source,

        baselineType:
          "energy_axes",

        signalDepth:
          1.5 * intensity,

        text:
          reflectionText,

        pattern:
          mappedPattern,

        energyAxes: {

          axis:
            axis.id,

          value,
        },

        metadata: {

          axis:
            axis.id,

          raw_value:
            value,

          axis_intensity:
            intensity,

          mapped_pattern:
            mappedPattern,

          processing_layer:
            "you.energy_axes",

          batch_id:
            batchId,

          generated_from:
            "energy_axes",

          generated_at:
            new Date().toISOString(),
        },
      });
    }

    // --------------------------------------------------
    // ✅ DONE
    // --------------------------------------------------

    console.log(
      "⚡ Energy axes processed successfully"
    );

  } catch (error) {

    console.log(
      "❌ processEnergyAxes error",
      error
    );
  }
}