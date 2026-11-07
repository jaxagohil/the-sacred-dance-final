
import React, { useEffect, useState } from "react";
import {
  PanResponder,
  Text,
  TextInput,
  View
} from "react-native";

import { Fonts } from "../../../../constants/theme";
import { processCreationGrow } from "../../../../db/processCreationGrow";
import { sovereignI } from "../../../../lib/sovereignIOrchestrator/core/sovereignI";
import { supabase } from "../../../../services/supabase";

type Props = {
  intentionId: string | null;
};

const GROW_VALUES = [
  { id: "oneness", label: "Oneness", invitation: "Be with nature", chakra: "earth_star" },
  { id: "abundance", label: "Abundance", invitation: "Trust and receive", chakra: "root" },
  { id: "aliveness", label: "Aliveness", invitation: "Everyday moments", chakra: "sacral" },
  { id: "presence", label: "Presence", invitation: "Just be", chakra: "solar_plexus" },
  { id: "wellbeing", label: "Wellbeing", invitation: "Love yourself", chakra: "heart" },
  { id: "freedom", label: "Freedom", invitation: "Express yourself", chakra: "throat" },
  { id: "possibility", label: "Possibility", invitation: "See the magic", chakra: "third_eye" },
  { id: "clarity", label: "Clarity", invitation: "Keep it simple", chakra: "crown" },
  { id: "connection", label: "Connection", invitation: "The bigger picture", chakra: "soul_star" },
] as const;

const CHAKRA_COLORS: Record<string, string> = {
  earth_star: "#6B4F3A",
  root: "#D94A4A",
  sacral: "#E88935",
  solar_plexus: "#E5C94A",
  heart: "#62A86B",
  throat: "#4F8FBF",
  third_eye: "#6657A6",
  crown: "#9A72B5",
  soul_star: "#D8C7A2",
};

const createDefaultSliders = (): Record<string, number> =>
  Object.fromEntries(
    GROW_VALUES.map((item) => [item.id, 0.5])
  );

export default function StageGrow({ intentionId }: Props) {
  const [sliders, setSliders] = useState<Record<string, number>>(
    createDefaultSliders
  );
  const [additionalText, setAdditionalText] = useState("");

const processGrow = async (
  nextSliders: Record<string, number>,
  nextAdditionalText: string
) => {
  if (!intentionId) return;

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("User not authenticated.");

    const result = await processCreationGrow({
      userId: user.id,
      intentionId,
      sliders: nextSliders,
      additionalText: nextAdditionalText,
    });

    if (!result) return;

    try {
      await sovereignI({
        eventId: `creation-grow-${Date.now()}`,
        eventType: "creation.updated",
        category: "domain",
        source: "creation_journey",
        occurredAt: new Date().toISOString(),
        payload: {
          intentionId,
          stage: "grow",
        },
        persistence: "persistent",
        contextImpact: ["user", "livingField", "creation"],
      });
    } catch (error) {
      console.error("SOVEREIGN I GROW EVENT ERROR:", error);
    }
  } catch (error) {
    console.error("GROW PROCESSING ERROR:", error);
  }
};

  // LOAD SAVED GROW RESPONSES
  useEffect(() => {
    let active = true;

    const loadGrowStep = async () => {
      setSliders(createDefaultSliders());
      setAdditionalText("");

      if (!intentionId) return;

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "grow")
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        if (!data?.response) return;

        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;

        setSliders(
          parsed?.sliders &&
          typeof parsed.sliders === "object"
            ? { ...createDefaultSliders(), ...parsed.sliders }
            : createDefaultSliders()
        );

        setAdditionalText(
          typeof parsed?.additionalText === "string"
            ? parsed.additionalText
            : ""
        );
      } catch (error) {
        console.error("GROW LOAD ERROR:", error);
      }
    };

    void loadGrowStep();

    return () => {
      active = false;
    };
  }, [intentionId]);

  // SAVE GROW RESPONSES
const saveGrow = async (
  nextSliders: Record<string, number>,
  nextAdditionalText: string
): Promise<boolean> => {
if (!intentionId) return false;
    try {
      const response = {
        sliders: nextSliders,
        additionalText: nextAdditionalText,
      };

      const { data: existing, error: findError } = await supabase
        .from("sovereign_intention_steps")
        .select("id")
        .eq("intention_id", intentionId)
        .eq("step", "grow")
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
            step: "grow",
            response,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("GROW SAVE ERROR:", error);
      return false;
    }
      return true;
  };

  const saveAndProcessGrow = async (
  nextSliders: Record<string, number>,
  nextAdditionalText: string
) => {
  const saved = await saveGrow(
    nextSliders,
    nextAdditionalText
  );

  if (!saved) return;

  await processGrow(
    nextSliders,
    nextAdditionalText
  );
};

  // UPDATE SLIDER
  const updateSlider = (id: string, value: number) => {
    const nextValue = Math.max(0, Math.min(1, value));

    const nextSliders = {
      ...sliders,
      [id]: nextValue,
    };

    setSliders(nextSliders);
  };

  // UPDATE ADDITIONAL TEXT
  const updateAdditionalText = (value: string) => {
    setAdditionalText(value);
  };

const saveAdditionalText = () => {
  void saveAndProcessGrow(sliders, additionalText);
};

  // RENDER VERTICAL SLIDERS
  const renderSlider = (item: (typeof GROW_VALUES)[number]) => {
    const value = sliders[item.id] ?? 0.5;

    const lineHeight = 45;
    const thumbSize = 8;

    const updateFromY = (y: number) => {
      const position = Math.max(0, Math.min(lineHeight, y));
      const nextValue = 1 - position / lineHeight;

      updateSlider(item.id, nextValue);
    };

const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: () => true,

  onPanResponderGrant: (event) => {
    updateFromY(event.nativeEvent.locationY);
  },

  onPanResponderMove: (event) => {
    updateFromY(event.nativeEvent.locationY);
  },

  onPanResponderRelease: () => {
    void saveAndProcessGrow(sliders, additionalText);
  },
});

    const thumbTop =
      (1 - value) * lineHeight - thumbSize / 2;

    return (
      <View
        key={item.id}
        style={{
          flex: 1,
          alignItems: "center",
          minWidth: 45,
        }}
      >
        <View
          {...panResponder.panHandlers}
          style={{
            height: lineHeight,
            width: 20,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 2,
              borderRadius: 2,
              backgroundColor: CHAKRA_COLORS[item.chakra],
              opacity: 0.65,
            }}
          />

          <View
            style={{
              position: "absolute",
              top: thumbTop,
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: CHAKRA_COLORS[item.chakra],
              borderWidth: 1,
              borderColor: "#EEECE6",
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 4,
            color: "#B8B4AC",
            fontFamily: Fonts.light,
            fontSize: 8,
            lineHeight: 10,
            textAlign: "center",
          }}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 1,
          paddingHorizontal: 2,
          minHeight: 52,
        }}
      >
        {GROW_VALUES.map(renderSlider)}
      </View>

      <View style={{ marginTop: 1 }}>
        <View
          style={{
            width: "100%",
            height: 38,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 9,
            borderWidth: 1,
            borderColor: "rgba(201,173,112,0.22)",
            backgroundColor: "#08090A",
          }}
        >
          <TextInput
            value={additionalText}
            onChangeText={updateAdditionalText}
            onBlur={saveAdditionalText}
            multiline
            placeholder="Anything else you want to notice..."
            placeholderTextColor="#77746F"
            style={{
              flex: 1,
              color: "#EEECE6",
              fontFamily: Fonts.light,
              fontSize: 10,
              lineHeight: 14,
              padding: 0,
              textAlignVertical: "top",
            }}
          />
        </View>
      </View>
    </View>
  );
}
