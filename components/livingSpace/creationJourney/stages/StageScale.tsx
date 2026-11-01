
import React, { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Fonts } from "../../../../constants/theme";
import { getUserId } from "../../../../lib/user";
import { supabase } from "../../../../services/supabase";

import {
    generateScalePossibilities,
} from "../../../../lib/consciousCreating/agents/scale/generateScalePossibilities";

const MUTED = "#AAA2B6";
const GOLD = "#C9AD70";
const CREAM = "#EEECE6";

const SCALE_PORTALS = [
  {
    id: "people",
    label: "PEOPLE",
    question: "Who wants to be part of this creation?",
  },
  {
    id: "places",
    label: "PLACES",
    question: "Where does this creation want to live?",
  },
  {
    id: "things",
    label: "THINGS",
    question: "What does this creation want to bring into the world?",
  },
] as const;

type PortalId = (typeof SCALE_PORTALS)[number]["id"];

type PortalResponse = {
  selectedOptions: string[];
  text: string;
};

type ScaleState = {
  activePortal: PortalId;
  portals: Record<PortalId, PortalResponse>;
};

type Props = {
  intentionId: string | null;
};

const createEmptyState = (): ScaleState => ({
  activePortal: "people",
  portals: {
    people: { selectedOptions: [], text: "" },
    places: { selectedOptions: [], text: "" },
    things: { selectedOptions: [], text: "" },
  },
});

export default function StageScale({ intentionId }: Props) {
  const [scaleState, setScaleState] =
    useState<ScaleState>(createEmptyState);

  const [possibilities, setPossibilities] = useState<
    Record<PortalId, string[]>
  >({
    people: [],
    places: [],
    things: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // LOAD SAVED SCALE RESPONSES

  useEffect(() => {
    let active = true;

    const loadScale = async () => {
      if (!intentionId) {
        setScaleState(createEmptyState());
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "scale")
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        if (!data?.response) {
          setScaleState(createEmptyState());
          return;
        }

        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        const loaded = parsed?.portals || {};

        const validPortal: PortalId =
          ["people", "places", "things"].includes(
            parsed?.activePortal
          )
            ? parsed.activePortal
            : "people";

        const getPortal = (id: PortalId): PortalResponse => ({
          selectedOptions: Array.isArray(
            loaded[id]?.selectedOptions
          )
            ? loaded[id].selectedOptions
            : [],
          text:
            typeof loaded[id]?.text === "string"
              ? loaded[id].text
              : "",
        });

        setScaleState({
          activePortal: validPortal,
          portals: {
            people: getPortal("people"),
            places: getPortal("places"),
            things: getPortal("things"),
          },
        });
      } catch (error) {
        console.error("SCALE LOAD ERROR:", error);
      }
    };

    void loadScale();

    return () => {
      active = false;
    };
  }, [intentionId]);

  // GENERATE AI POSSIBILITIES

  useEffect(() => {
    let active = true;

    const loadPossibilities = async () => {
      if (!intentionId) {
        setPossibilities({
          people: [],
          places: [],
          things: [],
        });
        return;
      }

      try {
        setIsGenerating(true);

        const userId = await getUserId();
        if (!userId) return;

        const result = await generateScalePossibilities({
          userId,
          intentionId,
        });

        if (!active) return;

        setPossibilities({
          people: result.people.map((item) => item.text),
          places: result.places.map((item) => item.text),
          things: result.things.map((item) => item.text),
        });
      } catch (error) {
        console.error("SCALE POSSIBILITIES ERROR:", error);
      } finally {
        if (active) setIsGenerating(false);
      }
    };

    void loadPossibilities();

    return () => {
      active = false;
    };
  }, [intentionId]);

  // SAVE SCALE

  const saveScale = async (nextState: ScaleState) => {
    if (!intentionId) return;

    try {
      const response = {
        activePortal: nextState.activePortal,
        portals: nextState.portals,
      };

      const { data: existing, error: findError } =
        await supabase
          .from("sovereign_intention_steps")
          .select("id")
          .eq("intention_id", intentionId)
          .eq("step", "scale")
          .maybeSingle();

      if (findError) throw findError;

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({ response })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "scale",
            response,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("SCALE SAVE ERROR:", error);
    }
  };

  // SELECT PORTAL

  const selectPortal = (portalId: PortalId) => {
    const nextState = {
      ...scaleState,
      activePortal: portalId,
    };

    setScaleState(nextState);
    void saveScale(nextState);
  };

  // SELECT / DESELECT POSSIBILITY

  const toggleOption = (option: string) => {
    const current = scaleState.portals[scaleState.activePortal];

    const selected = current.selectedOptions.includes(option);

    const selectedOptions = selected
      ? current.selectedOptions.filter((item) => item !== option)
      : [...current.selectedOptions, option];

    const nextState: ScaleState = {
      ...scaleState,
      portals: {
        ...scaleState.portals,
        [scaleState.activePortal]: {
          ...current,
          selectedOptions,
        },
      },
    };

    setScaleState(nextState);
    void saveScale(nextState);
  };

  // UPDATE HUMAN REFLECTION

  const updateText = (text: string) => {
    setScaleState((current) => ({
      ...current,
      portals: {
        ...current.portals,
        [current.activePortal]: {
          ...current.portals[current.activePortal],
          text,
        },
      },
    }));
  };

  const saveText = () => {
    void saveScale(scaleState);
  };

  const activePortal =
    SCALE_PORTALS.find(
      (portal) => portal.id === scaleState.activePortal
    ) || SCALE_PORTALS[0];

  const activeResponse =
    scaleState.portals[scaleState.activePortal];

  const activePossibilities =
    possibilities[scaleState.activePortal];

  return (
    <View style={styles.container}>

      {/* THREE PORTALS */}

      <View style={styles.portals}>
        {SCALE_PORTALS.map((portal) => {
          const selected =
            scaleState.activePortal === portal.id;

          const response = scaleState.portals[portal.id];

          const hasResponse =
            response.selectedOptions.length > 0 ||
            response.text.trim().length > 0;

          return (
            <Pressable
              key={portal.id}
              onPress={() => selectPortal(portal.id)}
              style={styles.portal}
            >
              <View
                style={[
                  styles.portalCircle,
                  selected && styles.portalCircleActive,
                ]}
              >
                <View
                  style={[
                    styles.portalInner,
                    selected && styles.portalInnerActive,
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.portalLabel,
                  selected && styles.portalLabelActive,
                ]}
              >
                {portal.label}
              </Text>

              {hasResponse && (
                <View style={styles.responseDot} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* ACTIVE PORTAL */}

      <View style={styles.expanded}>
        <Text style={styles.question}>
          {activePortal.question}
        </Text>

        {/* AI POSSIBILITIES */}

        <View style={styles.options}>
          {activePossibilities.map((option) => {
            const selected =
              activeResponse.selectedOptions.includes(option);

            return (
              <Pressable
                key={option}
                onPress={() => toggleOption(option)}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* HUMAN REFLECTION */}

        <View style={styles.textBox}>
          <TextInput
            value={activeResponse.text}
            onChangeText={updateText}
            onBlur={saveText}
            multiline
            placeholder="Add, change, reject, or describe what you see..."
            placeholderTextColor="#77746F"
            style={styles.textInput}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  prompt: {
    color: MUTED,
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
    maxWidth: 430,
  },

  portals: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },

  portal: {
    flex: 1,
    alignItems: "center",
  },

  portalCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.025)",
    alignItems: "center",
    justifyContent: "center",
  },

  portalCircleActive: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderColor: CREAM,
    backgroundColor: "rgba(238,236,230,0.08)",
  },

  portalInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  portalInnerActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderColor: "rgba(238,236,230,0.55)",
  },

  portalLabel: {
    marginTop: 10,
    color: "rgba(255,255,255,0.52)",
    fontFamily: Fonts.light,
    fontSize: 10,
    letterSpacing: 1.2,
  },

  portalLabelActive: {
    color: CREAM,
  },

  responseDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: CREAM,
    marginTop: 7,
  },

  expanded: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: 14,
  },

  question: {
    color: CREAM,
    fontFamily: Fonts.light,
    fontSize: 12,
    lineHeight: 20,
  },

  loading: {
    color: MUTED,
    fontSize: 10,
    marginTop: 12,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 12,
  },

  option: {
    flexGrow: 1,
    flexBasis: "28%",
    minWidth: 0,
    minHeight: 42,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  optionSelected: {
    backgroundColor: CREAM,
    borderColor: CREAM,
  },

  optionText: {
    color: "rgba(255,255,255,0.62)",
    fontFamily: Fonts.light,
    fontSize: 9,
    lineHeight: 12,
    textAlign: "center",
  },

  optionTextSelected: {
    color: "#2A2927",
  },

  textBox: {
    marginTop: 14,
    minHeight: 58,
    padding: 11,
    borderRadius: 10,
    backgroundColor: CREAM,
  },

  textInput: {
    minHeight: 38,
    color: "#2A2927",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
    padding: 0,
   // outlineStyle: "none" as const,
    textAlignVertical: "top" as const,
  },
});
