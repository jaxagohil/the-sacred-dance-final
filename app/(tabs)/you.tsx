import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";

import { processReflection } from "../../db/flow";
import { supabase } from "../../services/supabase";
import { getUserId } from "../../lib/user";

const CHIPS = [
  "safe",
  "seen",
  "loved",
  "happy",
  "alone",
  "confused",
  "insecure",
  "responsible",
];

const guideColors = {
  guide_heart: "#ff6b9a",
  guide_structure: "#4da6ff",
  guide_cosmic: "#ffffff",
};

export default function You() {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [repeats, setRepeats] = useState("");
  const [line, setLine] = useState("");

  const [location, setLocation] = useState("India");
  const [language, setLanguage] = useState("EN");

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<any>(null);

  const [avatar, setAvatar] = useState<string | null>(null);

  const [guideNames, setGuideNames] = useState({
    guide_heart: "nani",
    guide_structure: "lala",
    guide_cosmic: "ammaarah",
  });

  const [sliders, setSliders] = useState({
    givingreceiving: 0,
    flowstructure: 0,
    abundancelack: 0,
  });

  const sliderLabels = {
    givingreceiving: { left: "receiving", right: "giving" },
    flowstructure: { left: "flow", right: "structure" },
    abundancelack: { left: "abundance", right: "lack" },
  };

  const toggleChip = (chip: string) => {
    setSelected((prev) =>
      prev.includes(chip)
        ? prev.filter((c) => c !== chip)
        : [...prev, chip]
    );
  };

    // 🔥 LOAD PROFILE
  useEffect(() => {
    async function loadProfile() {
      const userId = await getUserId();
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("❌ LOAD PROFILE ERROR:", error);
        return;
      }

      if (data) {
        console.log("📥 PROFILE LOADED:", data);

        setOriginalProfile(data); // 🔥 ADD THIS LINE

        setAvatar(data.avatar_url || null);
        setName(data.name || "");
        setLocation(data.location || "India");
        setLanguage(data.language || "EN");

        setSelected(data.childhood_feelings || []);
        setRepeats(data.what_repeats || "");
        setLine(data.line_that_feels_like_you || "");

        setSliders({
          givingreceiving: data.givingreceiving ?? 0,
          flowstructure: data.flowstructure ?? 0,
          abundancelack: data.lackabundance ?? 0,
        });

        setGuideNames({
          guide_heart: data.guide_1_name || "nani",
          guide_structure: data.guide_2_name || "lala",
          guide_cosmic: data.guide_3_name || "ammaarah",
        });
      }
    }

    loadProfile();
  }, []);

const handleSave = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      console.error("❌ No userId");
      return;
    }

    console.log("👤 USER ID:", userId);

    // ---------------------------
    // 🧠 CHANGE DETECTION
    // ---------------------------
    const hasChanged = {
      childhood:
        JSON.stringify(selected) !==
        JSON.stringify(originalProfile?.childhood_feelings || []),

      repeats: repeats !== originalProfile?.what_repeats,

      line: line !== originalProfile?.line_that_feels_like_you,

      sliders:
        sliders.givingreceiving !== originalProfile?.givingreceiving ||
        sliders.flowstructure !== originalProfile?.flowstructure ||
        sliders.abundancelack !== originalProfile?.lackabundance,
    };

    console.log("🔍 CHANGES:", hasChanged);

    // ---------------------------
    // 💾 SAVE PROFILE (always safe)
    // ---------------------------
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          name,
          location,
          language,
          avatar_url: avatar,

          guide_1_name: guideNames.guide_heart,
          guide_2_name: guideNames.guide_structure,
          guide_3_name: guideNames.guide_cosmic,

          givingreceiving: sliders.givingreceiving,
          flowstructure: sliders.flowstructure,
          lackabundance: sliders.abundancelack,

          childhood_feelings: selected,
          what_repeats: repeats,
          line_that_feels_like_you: line,
        },
        { onConflict: "user_id" }
      )
      .select();

    if (error) {
      console.error("❌ SUPABASE ERROR:", error);
      return;
    }

    console.log("✅ PROFILE SAVED:", data);

    // ---------------------------
    // 🚫 NO CHANGES → STOP HERE
    // ---------------------------
    const anythingChanged =
      hasChanged.childhood ||
      hasChanged.repeats ||
      hasChanged.line ||
      hasChanged.sliders;

    if (!anythingChanged) {
      console.log("🟡 No meaningful changes → skipping signals");
      return;
    }

    // ---------------------------
    // SIGNALS (ONLY IF CHANGED)
    // ---------------------------
    const tasks: Promise<any>[] = [];

    // 🌿 CHILDHOOD
    if (hasChanged.childhood && selected.length > 0) {
      for (const feeling of selected) {
        tasks.push(
          processReflection({
            userId,
            source: "baseline",
            signalDepth: 3,
            text: `I often felt ${feeling} as a child`,
          })
        );

        tasks.push(
          processReflection({
            userId,
            source: "baseline",
            signalDepth: 4,
            text: `I learned to feel ${feeling} to feel safe`,
          })
        );
      }
    }

 // 🌿 SLIDERS (SIMPLIFIED — SINGLE SIGNAL)
if (hasChanged.sliders) {
  tasks.push(
    processReflection({
      userId,
      source: "baseline",
      signalDepth: 3,
      text: `Core patterns from my energy balance`,
      metadata: {
        type: "slider",
        sliders, // 🔥 THIS is what matters
      },
    })
  );
}

    // 🌿 REPEATS
    if (hasChanged.repeats && repeats) {
      tasks.push(
        processReflection({
          userId,
          source: "baseline",
          signalDepth: 3,
          text: `This keeps repeating: ${repeats}`,
        })
      );

      tasks.push(
        processReflection({
          userId,
          source: "baseline",
          signalDepth: 4,
          text: `I keep recreating this pattern: ${repeats}`,
        })
      );
    }

    // 🌿 LINE
    if (hasChanged.line && line) {
      tasks.push(
        processReflection({
          userId,
          source: "baseline",
          signalDepth: 4,
          text: `Core belief: ${line}`,
        })
      );

      tasks.push(
        processReflection({
          userId,
          source: "baseline",
          signalDepth: 5,
          text: `A truth I hold is: ${line}`,
        })
      );
    }

    // 🔥 RUN ONLY IF WE HAVE TASKS
    if (tasks.length > 0) {
      await Promise.all(tasks);
      console.log("✨ Signals created:", tasks.length);
    }

    setOriginalProfile({
  user_id: userId,
  name,
  location,
  language,
  avatar_url: avatar,

  guide_1_name: guideNames.guide_heart,
  guide_2_name: guideNames.guide_structure,
  guide_3_name: guideNames.guide_cosmic,

  givingreceiving: sliders.givingreceiving,
  flowstructure: sliders.flowstructure,
  lackabundance: sliders.abundancelack,

  childhood_feelings: selected,
  what_repeats: repeats,
  line_that_feels_like_you: line,
});

  } catch (err) {
    console.error("❌ Save error:", err);
  }
};

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black", paddingTop: 70, paddingBottom: 80 }}>

      {/* HEADER */}
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={pickImage}>
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            backgroundColor: "#222", justifyContent: "center",
            alignItems: "center", overflow: "hidden", marginBottom: 30
          }}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text style={{ color: "#888", fontSize: 24 }}>+</Text>
            )}
          </View>
        </TouchableOpacity>

        <TextInput
          placeholder="your name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          style={{
            color: "white",
            borderBottomWidth: 1,
            borderBottomColor: "#333",
            width: "70%",
            textAlign: "center",
            marginBottom: 5,
          }}
        />

        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 15 }}>
  
<TouchableOpacity onPress={() => setShowLocationPicker(true)}>
  <Text
    style={{
      color: "#888",
      fontSize: 12,
      marginTop: 4,
      marginBottom: 10,
      textAlign: "center",
    }}
  >
    {location} • {language}
  </Text>
</TouchableOpacity>

</View>

        <TouchableOpacity onPress={handleSave} style={{
          borderWidth: 1, borderColor: "#555",
          paddingHorizontal: 20, paddingVertical: 6,
          borderRadius: 20, marginTop: 10, marginBottom: 25
        }}>
          <Text style={{ color: "#ccc" }}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* SLIDERS */}
      {(Object.keys(sliders) as (keyof typeof sliders)[]).map((key) => {
        const value = sliders[key];
        const config = sliderLabels[key as keyof typeof sliderLabels];

        return (
          <View key={key} style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "#aaa", width: 70, fontSize: 10 }}>
                {config.left}
              </Text>

              <View style={{ flex: 1, transform: [{ scaleY: 0.3 }] }}>
                <Slider
                  value={value}
                  onValueChange={(v) =>
                    setSliders((prev) => ({ ...prev, [key]: v }))
                  }
                  minimumValue={-1}
                  maximumValue={1}
                  step={0.01}
                  minimumTrackTintColor="#666"
                  maximumTrackTintColor="#666"
                  thumbTintColor="#fff"
                />
              </View>

              <Text style={{ color: "#aaa", width: 70, fontSize: 10, textAlign: "right" }}>
                {config.right}
              </Text>
            </View>
          </View>
        );
      })}

<Text
  style={{
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,           // slightly smaller
    textAlign: "center",
    marginTop: 30,
    marginBottom: 2,
    letterSpacing: 0.5,
    fontStyle: "italic",    // ✨ this is the key change
  }}
>
  Childhood Memories
</Text>
      {/* CHILDHOOD */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 30 }}>
        {CHIPS.map((chip) => {
          const active = selected.includes(chip);
          return (
            <TouchableOpacity
              key={chip}
              onPress={() => toggleChip(chip)}
              style={{
                borderWidth: 1,
                borderColor: active ? "white" : "#333",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                margin: 4
              }}
            >
              <Text style={{ color: active ? "white" : "#888" }}>{chip}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TEXT */}
      <View style={{ paddingHorizontal: 20 }}>
        <TextInput
          placeholder="what repeats?"
          placeholderTextColor="#666"
          value={repeats}
          onChangeText={setRepeats}
          style={{
            backgroundColor: "#111",
            color: "white",
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="a line that resonates with you..."
          placeholderTextColor="#666"
          value={line}
          onChangeText={setLine}
          style={{
            backgroundColor: "#111",
            color: "white",
            borderRadius: 12,
            padding: 14,
            marginBottom: 30,
          }}
        />
      </View>

      {/* GUIDES */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {(Object.keys(guideNames) as (keyof typeof guideNames)[]).map((key) => {
          const value = guideNames[key];
          return (
            <TextInput
              key={key}
              value={value}
              onChangeText={(text) =>
                setGuideNames((prev) => ({ ...prev, [key]: text }))
              }
              style={{
                borderWidth: 1,
                borderColor: guideColors[key],
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                color: guideColors[key],
                minWidth: 80,
                textAlign: "center",
                marginHorizontal: 5,
              }}
            />
          );
        })}
      </View>

      {showLocationPicker && (
  <View
    style={{
      position: "absolute",
      bottom: 100,
      left: 20,
      right: 20,
      backgroundColor: "#111",
      borderRadius: 20,
      padding: 20,
    }}
  >

    {/* LOCATION */}
    <Text style={{ color: "#aaa", marginBottom: 10 }}>Location</Text>

    {["India", "UK", "USA"].map((loc) => (
      <TouchableOpacity
        key={loc}
        onPress={() => {
  setLocation(loc);
  setShowLocationPicker(false);
}}
        style={{ paddingVertical: 8 }}
      >
        <Text style={{ color: "white" }}>
          {loc === location ? "✓ " : ""}{loc}
        </Text>
      </TouchableOpacity>
    ))}

    {/* LANGUAGE */}
    <Text style={{ color: "#aaa", marginTop: 20, marginBottom: 10 }}>
      Language
    </Text>

    {["EN", "HI"].map((lang) => (
      <TouchableOpacity
        key={lang}
        onPress={() => {
  setLanguage(lang);
  setShowLocationPicker(false);
}}
        style={{ paddingVertical: 8 }}
      >
        <Text style={{ color: "white" }}>
          {lang === language ? "✓ " : ""}{lang}
        </Text>
      </TouchableOpacity>
    ))}

    {/* DONE BUTTON */}
    <TouchableOpacity
      onPress={() => setShowLocationPicker(false)}
      style={{ marginTop: 20 }}
    >
      <Text style={{ color: "#888", textAlign: "center" }}>
        Done
      </Text>
    </TouchableOpacity>

  </View>
)}

    </View>
  );
}