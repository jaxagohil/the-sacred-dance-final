
import { supabase } from "../services/supabase";

export type CreationNextStepPortal =
  | "can"
  | "cant"
  | "wont";

type ProcessCreationNextStepInput = {
  userId: string;
  intentionId: string;
  portal: CreationNextStepPortal;
  glimmerId: string;
  glimmerTitle: string;
  glimmerDetail: string;
  reality?: string;
  language?: string;
};

export async function processCreationNextStep({
  userId,
  intentionId,
  portal,
  glimmerId,
  glimmerTitle,
  glimmerDetail,
  reality,
  language = "en",
}: ProcessCreationNextStepInput) {
  try {
    if (
      !userId ||
      !intentionId ||
      !glimmerId ||
      !glimmerTitle?.trim() ||
      !glimmerDetail?.trim()
    ) {
      return null;
    }

    const portalLabels: Record<
      CreationNextStepPortal,
      string
    > = {
      can: "CAN CHANGE",
      cant: "CAN'T CHANGE",
      wont: "WON'T CHANGE",
    };

    const portalLabel = portalLabels[portal];

    const text = `
CREATION JOURNEY — MY 1 NEXT STEP

PORTAL:
${portalLabel}

SELECTED GLIMMER:
${glimmerTitle.trim()}

GLIMMER DETAIL:
${glimmerDetail.trim()}

REALITY LAYER:
${reality || "Not specified"}

This is the Glimmer the person selected as
their next step in the Creation Journey.

Preserve the distinction between the selected
portal and the person's actual Living Field.
Do not treat the selection as proof that an
action has already been completed.
`;

    const { data, error } =
      await supabase.functions.invoke(
        "process-reflection",
        {
          body: {
            userId,
            language,
            source: "sovereign_i",
            baselineType: "creation_next_step",
            signalDepth: 2.5,
            text,
            emotions: [],
            metadata: {
              processing_layer:
                "sovereign_i.creation_journey.next_step",
              generated_from: "creation_journey",
              intention_id: intentionId,
              stage: "next_step",
              event_type: "creation_next_step",
              portal,
              portal_label: portalLabel,
              glimmer_id: glimmerId,
              glimmer_title: glimmerTitle.trim(),
              glimmer_detail: glimmerDetail.trim(),
              reality: reality || null,
            },
          },
        }
      );

    if (error) throw error;

    if (!data) {
      throw new Error(
        "No Next Step processing result returned."
      );
    }

    return {
      reflection: data.reflection || null,
      signals: data.signals || [],
      behaviours: data.behaviours || [],
      emotions: data.emotions || [],
      patterns: data.patterns || [],
    };
  } catch (error) {
    console.error(
      "PROCESS CREATION NEXT STEP ERROR:",
      error
    );
    throw error;
  }
}
