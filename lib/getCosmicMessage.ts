import { generateAIResponse } from "./generateAIResponse";
import { getCosmicData, getCosmicInterpretation } from "./cosmic";

// ✅ TYPE
type CosmicData = {
  sun: string;
  moon: string;
  phase: string;
  sunEnergy: string;
};

export async function getCosmicMessage({
  energy,
  patterns,
}: {
  energy?: any;
  patterns?: any[];
}) {
  // 1. get structured data
  const cosmic: CosmicData = getCosmicData();

  // 2. deterministic interpretation
  const interpretation = getCosmicInterpretation(
    cosmic,
    energy,
    patterns
  );

  // 3. AI refinement (✅ FIXED STRUCTURE)
  const aiText = await generateAIResponse({
    type: "cosmic",
    data: {
      base: interpretation.cosmicMessage, // 🔥 moved inside data
      phase: cosmic.phase,
      sunEnergy: cosmic.sunEnergy,
      sun: cosmic.sun,
      moon: cosmic.moon,
      pattern: patterns?.[0]?.id,
    },
  });

  return {
    ...interpretation,
    aiMessage: aiText || interpretation.cosmicMessage,
    cosmic,
  };
}