// lib/sacredDance/interpretation/buildCardInterpretation.ts

//
// 🌌 TYPES
//

type Input = {

  oracle?: any;

  tarot?: any;

  chakra?: string;

  theme?: string;

  lens?: string;
};

export type CardInterpretation = {

  oracleLayer: {

    emotionalMeaning: string;

    energeticMeaning: string;

    relationalMeaning: string;
  };

  tarotLayer: {

    emotionalMeaning: string;

    energeticMeaning: string;

    archetypalMeaning: string;
  };

  synthesis: string;
};

//
// ✨ MAIN
//

export function buildCardInterpretation({
  oracle,
  tarot,
  chakra,
  theme,
  lens,
}: Input): CardInterpretation {

  //
  // 🌙 ORACLE
  //

  const oracleLayer = {

    emotionalMeaning:
      buildOracleEmotion(
        oracle,
        theme
      ),

    energeticMeaning:
      buildOracleEnergy(
        oracle,
        chakra
      ),

    relationalMeaning:
      buildOracleRelationship(
        oracle,
        lens
      ),
  };

  //
  // 🔮 TAROT
  //

  const tarotLayer = {

    emotionalMeaning:
      buildTarotEmotion(
        tarot,
        theme
      ),

    energeticMeaning:
      buildTarotEnergy(
        tarot,
        chakra
      ),

    archetypalMeaning:
      buildTarotArchetype(
        tarot
      ),
  };

  //
  // 🌌 SYNTHESIS
  //

  const synthesis = `

The emotional field appears to be moving through
${theme || "a transition"} while inviting deeper awareness around
${chakra || "the energetic field"}.

The oracle layer reflects:
${oracle?.title || "inner emotional movement"}.

The tarot layer reflects:
${tarot?.name || "archetypal transformation"}.

Together they suggest a period of emotional integration,
soft reflection, and energetic re-alignment.

`;

  //
  // 🌌 RETURN
  //

  return {

    oracleLayer,

    tarotLayer,

    synthesis,
  };
}

//
// ✨ HELPERS
//

function buildOracleEmotion(
  oracle?: any,
  theme?: string
): string {

  return `

${oracle?.title || "This oracle"} appears connected to
the emotional theme of ${theme || "self-awareness"}.

It suggests emotional softening,
gentle reflection,
and increased inner honesty.

`;
}

function buildOracleEnergy(
  oracle?: any,
  chakra?: string
): string {

  return `

Energetically, this card resonates with
${chakra || "the current energetic field"}.

It may reflect subtle movement,
release,
or emotional rebalancing.

`;
}

function buildOracleRelationship(
  oracle?: any,
  lens?: string
): string {

  return `

Within the ${lens || "personal"} lens,
this oracle reflects deeper relational mirrors,
emotional resonance,
and unspoken emotional truths.

`;
}

function buildTarotEmotion(
  tarot?: any,
  theme?: string
): string {

  return `

${tarot?.name || "This tarot archetype"}
reflects emotional movement connected to
${theme || "transformation"}.

It suggests awareness emerging through emotional experience.

`;
}

function buildTarotEnergy(
  tarot?: any,
  chakra?: string
): string {

  return `

This archetype activates themes connected to
${chakra || "energetic awareness"}.

The movement appears subtle but meaningful.

`;
}

function buildTarotArchetype(
  tarot?: any
): string {

  return `

The archetype of
${tarot?.name || "this card"}
invites reflection around identity,
growth,
and emotional evolution.

`;
}