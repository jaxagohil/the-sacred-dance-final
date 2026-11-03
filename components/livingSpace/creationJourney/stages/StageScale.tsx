
import React, { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Fonts } from "../../../../constants/theme";
import { supabase } from "../../../../services/supabase";

const MUTED = "#AAA2B6";
const GOLD = "#C9AD70";

const SCALE_PORTALS = [
  {
    id: "people",
    label: "People",
    placeholder: "Who would you like alongside you?",
  },
  {
    id: "places",
    label: "Places",
    placeholder: "Where would you like this creation to happen?",
  },
  {
    id: "things",
    label: "Things",
    placeholder: "What would help bring this creation to life?",
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

  // LOAD SAVED SCALE RESPONSES
  useEffect(() => {
    let active = true;

    const loadScale = async () => {
      if (!intentionId) {
        setScaleState(createEmptyState());
        return;
      }

      setScaleState(createEmptyState());

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

        const validPortal: PortalId = [
          "people",
          "places",
          "things",
        ].includes(parsed?.activePortal)
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

  // SAVE SCALE RESPONSES
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

  // SELECT PEOPLE / PLACES / THINGS
  const selectPortal = (portalId: PortalId) => {
    const nextState: ScaleState = {
      ...scaleState,
      activePortal: portalId,
    };

    setScaleState(nextState);
    void saveScale(nextState);
  };

  // UPDATE TEXT
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

  // SAVE TEXT WHEN LEAVING THE INPUT
  const saveText = () => {
    void saveScale(scaleState);
  };

  const activeResponse =
    scaleState.portals[scaleState.activePortal];

  const activePortal = SCALE_PORTALS.find(
    (portal) => portal.id === scaleState.activePortal
  ) ?? SCALE_PORTALS[0];

  return (
    <View style={styles.scaleLayout}>
      {/* WRITING AREA */}
      <View style={styles.textBox}>
        <TextInput
          value={activeResponse.text}
          onChangeText={updateText}
          onBlur={saveText}
          multiline
          placeholder={activePortal.placeholder}
          placeholderTextColor="#77746F"
          style={styles.textInput}
        />
      </View>

      {/* PEOPLE / PLACES / THINGS */}
      <View style={styles.portals}>
        {SCALE_PORTALS.map((portal) => {
          const selected =
            scaleState.activePortal === portal.id;

          const hasResponse =
            scaleState.portals[portal.id].text.trim().length > 0 ||
            scaleState.portals[portal.id].selectedOptions.length > 0;

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
                {hasResponse && (
                  <View style={styles.responseDot} />
                )}
              </View>

              <Text
                style={[
                  styles.portalLabel,
                  selected && styles.portalLabelActive,
                ]}
              >
                {portal.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scaleLayout: {
    width: "100%",
    height: 90,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },

  textBox: {
    flex: 1,
    minWidth: 0,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.22)",
    backgroundColor: "#08090A",
    padding: 11,
  },

  textInput: {
    flex: 1,
    color: "#EEECE6",
    fontFamily: Fonts.light,
    fontSize: 11,
    lineHeight: 17,
    padding: 0,
    textAlignVertical: "top",
  },

  portals: {
    width: 76,
    justifyContent: "space-around",
    alignItems: "center",
  },

  portal: {
    alignItems: "center",
    justifyContent: "center",
  },

  portalCircle: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(201,173,112,0.45)",
    backgroundColor: "rgba(201,173,112,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  portalCircleActive: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderColor: GOLD,
    backgroundColor: "rgba(201,173,112,0.18)",
  },

  responseDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: GOLD,
  },

  portalLabel: {
    marginTop: 3,
    color: MUTED,
    fontFamily: Fonts.light,
    fontSize: 7,
  },

  portalLabelActive: {
    color: GOLD,
  },
});
