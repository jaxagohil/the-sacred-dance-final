
import React, { useEffect, useState } from "react";
import {
    PanResponder,
    Text,
    TextInput,
    View,
} from "react-native";

import { Fonts } from "../../../../constants/theme";
import { getCreationContext } from "../../../../lib/consciousCreating";
import { getUserId } from "../../../../lib/user";
import { supabase } from "../../../../services/supabase";

type Props = {
  intentionId: string | null;
};

const GROW_VALUES = [
  {
    id: "oneness",
    label: "Oneness",
    invitation: "Be with nature",
    chakra: "earth_star",
  },
  {
    id: "abundance",
    label: "Abundance",
    invitation: "Trust and receive",
    chakra: "root",
  },
  {
    id: "aliveness",
    label: "Aliveness",
    invitation: "Everyday moments",
    chakra: "sacral",
  },
  {
    id: "presence",
    label: "Presence",
    invitation: "Just be",
    chakra: "solar_plexus",
  },
  {
    id: "wellbeing",
    label: "Wellbeing",
    invitation: "Love yourself",
    chakra: "heart",
  },
  {
    id: "freedom",
    label: "Freedom",
    invitation: "Express yourself",
    chakra: "throat",
  },
  {
    id: "possibility",
    label: "Possibility",
    invitation: "See the magic",
    chakra: "third_eye",
  },
  {
    id: "clarity",
    label: "Clarity",
    invitation: "Keep it simple",
    chakra: "crown",
  },
  {
    id: "connection",
    label: "Connection",
    invitation: "The bigger picture",
    chakra: "soul_star",
  },
];

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

export default function StageGrow({ intentionId }: Props) {
  const [sliders, setSliders] = useState<Record<string, number>>({});
  const [additionalText, setAdditionalText] = useState("");

  // --------------------------------------------------
  // LOAD GROW
  // Existing saved values take priority.
  // New creations seed from Living Field chakra scores.
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    const loadGrowStep = async () => {
      if (!intentionId) {
        setSliders({});
        setAdditionalText("");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sovereign_intention_steps")
          .select("response")
          .eq("intention_id", intentionId)
          .eq("step", "grow")
          .maybeSingle();

        if (error) {
          console.error("❌ SOVEREIGN GROW LOAD ERROR:", error);
          return;
        }

        if (!active) return;

        // EXISTING GROW
        if (data?.response) {
          const parsed =
            typeof data.response === "string"
              ? JSON.parse(data.response)
              : data.response;

          setSliders(
            parsed?.sliders &&
              typeof parsed.sliders === "object"
              ? parsed.sliders
              : {}
          );

          setAdditionalText(
            typeof parsed?.additionalText === "string"
              ? parsed.additionalText
              : ""
          );

          return;
        }

        // NEW GROW: SEED FROM LIVING FIELD

        const userId = await getUserId();

        if (!userId) {
          setSliders({});
          return;
        }

        const context = await getCreationContext({
          userId,
          intentionId,
          activeStage: "grow",
        });

        if (!active) return;

        const chakraScores =
          context?.livingField?.chakraState?.scores || {};

        const seededSliders: Record<string, number> = {};

        GROW_VALUES.forEach((value) => {
          const chakraScore = Number(chakraScores?.[value.chakra]);

          /*
           * Chakra polarity:
           * -1 = contracted
           *  0 = neutral
           * +1 = expansive
           *
           * Slider:
           *  0 = low
           *  0.5 = neutral
           *  1 = high
           */

          if (Number.isFinite(chakraScore)) {
            seededSliders[value.id] = Math.max(
              0,
              Math.min(1, (chakraScore + 1) / 2)
            );
          } else {
            seededSliders[value.id] = 0.5;
          }
        });

        setSliders(seededSliders);
        setAdditionalText("");
      } catch (error) {
        console.error("❌ SOVEREIGN GROW LOAD ERROR:", error);

        if (active) {
          setSliders({});
          setAdditionalText("");
        }
      }
    };

    void loadGrowStep();

    return () => {
      active = false;
    };
  }, [intentionId]);

  // --------------------------------------------------
  // SAVE GROW
  // --------------------------------------------------

  const saveGrow = async (
    nextSliders: Record<string, number>,
    nextAdditionalText: string
  ) => {
    if (!intentionId) return;

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

      if (findError) {
        console.error("❌ SOVEREIGN GROW FIND ERROR:", findError);
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .update({ response })
          .eq("id", existing.id);

        if (error) {
          console.error("❌ SOVEREIGN GROW UPDATE ERROR:", error);
        }
      } else {
        const { error } = await supabase
          .from("sovereign_intention_steps")
          .insert({
            intention_id: intentionId,
            step: "grow",
            response,
          });

        if (error) {
          console.error("❌ SOVEREIGN GROW SAVE ERROR:", error);
        }
      }
    } catch (error) {
      console.error("❌ SOVEREIGN GROW SAVE ERROR:", error);
    }
  };

  // --------------------------------------------------
  // SLIDER UPDATE
  // --------------------------------------------------

  const updateSlider = (id: string, value: number) => {
    const nextValue = Math.max(0, Math.min(1, value));

    const nextSliders = {
      ...sliders,
      [id]: nextValue,
    };

    setSliders(nextSliders);

    void saveGrow(nextSliders, additionalText);
  };

  // --------------------------------------------------
  // ADDITIONAL TEXT
  // --------------------------------------------------

  const updateAdditionalText = (value: string) => {
    setAdditionalText(value);
  };

  const saveAdditionalText = async () => {
    await saveGrow(sliders, additionalText);
  };

  // --------------------------------------------------
  // VERTICAL SLIDERS
  // --------------------------------------------------

  const renderSlider = (item: (typeof GROW_VALUES)[number]) => {
    const value = sliders[item.id] ?? 0.5;

    const lineHeight = 50;
    const thumbSize = 9;

    const updateFromY = (y: number) => {
      const position = Math.max(
        0,
        Math.min(lineHeight, y)
      );

      // Top = 1, bottom = 0
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
          {/* TRACK */}
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

          {/* THUMB */}
          <View
            style={{
              position: "absolute",
              top: thumbTop,
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: CHAKRA_COLORS[item.chakra],
              borderWidth: 2,
              borderColor: "#EEECE6",
            }}
          />
        </View>

        {/* LABEL */}
        <Text
          style={{
            marginTop: 12,
            color: "#B8B4AC",
            fontFamily: Fonts.light,
            fontSize: 11,
            lineHeight: 15,
            textAlign: "center",
          }}
        >
          {item.label}
        </Text>

        {/* INVITATION */}
        <Text
          style={{
            marginTop: 4,
            color: "rgba(255,255,255,0.58)",
            fontFamily: Fonts.light,
            fontSize: 6,
            lineHeight: 12,
            textAlign: "center",
            maxWidth: 62,
          }}
        >
          {item.invitation}
        </Text>
      </View>
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={{ width: "100%" }}>

      {/* NINE CHAKRA SLIDERS */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 1,
          paddingHorizontal: 2,
          minHeight: 105,
        }}
      >
        {GROW_VALUES.map(renderSlider)}
      </View>

      {/* OPTIONAL ADDITION */}
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            width: "100%",
            minHeight: 70,
            padding: 14,
            borderRadius: 11,
            backgroundColor: "#EEECE6",
          }}
        >
          <TextInput
            value={additionalText}
            onChangeText={updateAdditionalText}
            onBlur={() => void saveAdditionalText()}
            multiline
            placeholder="Anything else you want to notice..."
            placeholderTextColor="#77746F"
            style={{
              minHeight: 40,
              color: "#2A2927",
              fontFamily: Fonts.light,
              fontSize: 12,
              lineHeight: 18,
              padding: 0,
              //outlineStyle: "none",
              textAlignVertical: "top",
            }}
          />
        </View>
      </View>
    </View>
  );
}
