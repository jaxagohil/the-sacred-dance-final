// lib/sacredDance/interpretation/buildGuideInterpretation.ts

import {
    getGuideConfig,
} from "../guides/getGuideConfig";

//
// 🌌 TYPES
//

type Input = {

  guide?: string;

  theme?: string;

  chakra?: string;
};

export type GuideInterpretation = {

  guideName: string;

  energeticRole: string;

  emotionalStyle: string;

  transmissionStyle: string;

  reflection: string;
};

//
// ✨ MAIN
//

export function buildGuideInterpretation({
  guide,
  theme,
  chakra,
}: Input): GuideInterpretation {

  const config =
    getGuideConfig(
      guide
    );

  return {

    guideName:
      config.name,

    energeticRole:
      config.archetype,

    emotionalStyle:
      config.emotionalStyle,

    transmissionStyle:
      config.toneStyle,

    reflection: `

${config.name}
appears to be guiding this reflection through themes of
${theme || "awareness"}
while supporting movement within
${chakra || "the energetic field"}.

The emotional quality of this guidance feels
${config.emotionalStyle},
with emphasis on
${config.emotionalFocus.join(", ")}.

`,
  };
}