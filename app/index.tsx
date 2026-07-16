import { useRouter } from "expo-router";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


import WelcomeOverlay from "../components/WelcomeOverlay";

import {
  useMirrorStore,
} from "../stores/mirrorStore";

import { getOrCreateProfile } from "../db/getProfile";
import { processLandingReflection } from "../db/processLandingReflection";
import { getDailyPrompt } from "../db/prompts";
import { getUserId, initUser } from "../lib/user";

import {
  Audio,
} from "expo-av";

import {
  pickImageForVision,
} from "../lib/pickImageForVision";

 import {
  buildReflectionPacket,
} from "../lib/buildReflectionsPacket";

import {
  Colors,
  Fonts,
  Spacing
} from "../constants/theme";

import { setLanguage, t } from "../lib/i18n/t";

import {
  getDailyField,
} from "../lib/cosmic/getDailyField";

import {
  getDailyCosmicMessage,
} from "../lib/cosmic/getDailyCosmicMessage";

import {
  supabase,
} from "../services/supabase";

import {
  loadAlignmentModules,
} from "../lib/alignment/loadAlignmentModules";

export default function LandingScreen() {
  const router = useRouter();

  const {

  setDailyField,

  setCosmic,

  setLanguage:

    setGlobalLanguage,

  setLanguageContext,

  setReady,

} = useMirrorStore();

  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showActions, setShowActions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const [prompt, setPrompt] = useState("...");
  const [loading, setLoading] = useState(true);

  const [
  showWelcome,
  setShowWelcome,
] = useState(false);

const [
  aiConsent,
  setAiConsent,
] = useState(false);

  const [saving,
  setSaving] =
    useState(false);

const [
  profileId,
  setProfileId,
] = useState<string | null>(null);    

  const [language, setAppLanguage] = useState("en");

  const [imageBase64, setImageBase64] = useState<string | null>(null);
 const [audioUri,
  setAudioUri] =
    useState<string | null>(
      null
    );

    const [recording,
  setRecording] =
    useState<Audio.Recording | null>(
      null
    );

  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  const [tapCount,
  setTapCount] =
    useState(0);

    const CREATOR_ID =
  "145649f8-2c0f-4883-9d0c-1c3b2c72d17a";

  // INIT
  useEffect(() => {
    const init = async () => {
      await initUser();

      const userId = await getUserId();

      const p = await getOrCreateProfile(userId);
      setProfileId(p.id);

      await setLanguage(
        p?.language || "en"
      );

      setAppLanguage(
  p?.language || "en"
);
      //console.log("LANGUAGE:", p?.language);

      /*
 * --------------------------------------------------
 * 🌍 LANGUAGE CONTEXT
 * --------------------------------------------------
 */

const currentLanguage =

  p?.language || "en";

setGlobalLanguage(
  currentLanguage
);

const {
  data:
    languageData,
} = await supabase

  .from("languages")

  .select("*")

  .eq(
    "code",
    currentLanguage
  )

  .maybeSingle();

setLanguageContext(
  languageData || {}
);

/*
 * --------------------------------------------------
 * 🌿 ALIGNMENT OS + DAILY FIELD
 * --------------------------------------------------
 */


//console.log("➡️ About to load Alignment Modules");

const [

  _,

  field,

] = await Promise.all([

loadAlignmentModules(),

  getDailyField(userId),

]);

//console.log("✅ Finished loading Alignment Modules");

setDailyField(
  field
);

/*
 * --------------------------------------------------
 * 🌙 COSMIC
 * --------------------------------------------------
 */

const cosmicMessage =

  await getDailyCosmicMessage({

    dailyField:
      field,

    language:
      currentLanguage,

    languageContext:
      languageData || {},
  });

setCosmic({

  ...cosmicMessage,

  cosmic:
    field.cosmic,

  dailyField:
    field,
});

const pr =
  await getDailyPrompt(
    userId
  );

setPrompt(pr);

setAiConsent(
  p?.ai_consent ?? false
);

setReady(true);
setLoading(false);
    };

    init();
  }, []);

  // EMOJIS
  const emoji_emotions = [
    { id: "calm", icon: "😌" },
    { id: "open", icon: "✨" },
    { id: "grateful", icon: "💛" },
    { id: "loving", icon: "❤️" },
    { id: "happy", icon: "😊" },
    { id: "hopeful", icon: "🌿" },
    { id: "tired", icon: "😴" },
    { id: "sad", icon: "😔" },
  ];

  const toggleEmotion = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id]
    );
    setShowEmojis(false);
  };

  // TYPING
  const handleTyping = (t: string) => {
    setText(t);
    setShowActions(true);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      setShowActions(false);
    }, 3000);

    setTypingTimeout(timeout);
  };


// 🌌 CREATOR ACCESS
const handleLogoPress =
  async () => {

    const next =
      tapCount + 1;

    setTapCount(next);

    if (next >= 3) {

      const userId =
        await getUserId();

      if (
        userId ===
        CREATOR_ID
      ) {

router.push("/creator");
      }

      setTapCount(0);
    }

    setTimeout(() => {

      setTapCount(0);

    }, 1500);
  };

  // IMAGE
const handleImage =
  async () => {

    const image =

      await pickImageForVision();

    setImageBase64(
      image
    );
  };

const handleVoice =
  async () => {

    try {

      /*
       * --------------------------------------------------
       * 🎙 START
       * --------------------------------------------------
       */

      if (!recording) {

        await Audio
          .requestPermissionsAsync();

        await Audio
          .setAudioModeAsync({

            allowsRecordingIOS:
              true,

            playsInSilentModeIOS:
              true,
          });

        const {
          recording,
        } = await Audio
          .Recording
          .createAsync(

            Audio
              .RecordingOptionsPresets
              .HIGH_QUALITY
          );

        setRecording(
          recording
        );

        //console.log("🎙 Recording started");

        return;
      }

      /*
       * --------------------------------------------------
       * ⏹ STOP
       * --------------------------------------------------
       */

      await recording
        .stopAndUnloadAsync();

      const uri =
        recording.getURI();

      setAudioUri(
        uri || null
      );

      setRecording(
        null
      );

      //console.log( "🎙 Saved:",  uri);

    } catch (err) {

      //console.log(  "🎤 AUDIO ERROR",  err);
    }
  };

const handleDiamondPress =
  async () => {

    handleSubmit();
  };  

  // SUBMIT (UNCHANGED)
const handleSubmit =
  async () => {

    //console.log("✦ SUBMIT");
    if (saving)
      return;

    try {

      setSaving(true);

      // --------------------------------------------------
// 🌌 EMPTY ENTRY
// --------------------------------------------------

const hasInput =

  text?.trim() ||

  selected.length > 0 ||

  imageBase64 ||

  audioUri;

if (!hasInput) {

  router.push(
    "/mirror"
  );

  return;
}

      const userId =
        await getUserId();
      const batchId =
  uuidv4();

      const packet =

        await buildReflectionPacket({

          text,

          emotions:
            selected,

          imageBase64,

          audioUri,
        });

       

await processLandingReflection({

  userId,

  language,

  batchId,

  text:
    packet.text,

  emotions:
    packet.emotions,

  imageBase64,

  audioUri,

  observableScenes:
    packet.observableScenes,

  bodyResponses:
    packet.bodyResponses,

  copingStrategies:
    packet.copingStrategies,

  manifestations:
    packet.manifestations,

  nervousSystem:
    packet.nervousSystem,
});

      setText("");
setSelected([]);
setImageBase64(null);
setAudioUri(null);

      router.push(
        "/mirror"
      );

    } catch (error) {

      console.log(
        "❌ LANDING ERROR",
        error
      );

    } finally {

      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" }}>
<ActivityIndicator
  size="small"
  color="white"
/>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
<Pressable
  style={{ flex: 1, paddingHorizontal: 20 }}

onPress={() => {

  setShowActions(true);

if (!aiConsent) {

  setShowWelcome(true);
}

  Keyboard.dismiss();
}}
>
        {/* TOP */}
        <View style={{ alignItems: "center", marginTop: 140 }}>
<TouchableOpacity
  onPress={
    handleLogoPress
  }
>

  <Image
    source={require(
      "../assets/logo.png"
    )}

    style={{
      width: 100,
      height: 100,
      marginBottom: 20,
    }}
  />

</TouchableOpacity>

          <Text
  style={{

    color:
      Colors.softText,

    textAlign:
      "center",

    fontFamily:
      Fonts.orchestration,

    fontSize: 16,

    lineHeight: 32,

    paddingHorizontal:
      Spacing.lg,
  }}
>
            {prompt}
          </Text>
        </View>

        {/* EMOJIS */}
        {showEmojis && (
          <View
            style={{
              position: "absolute",
              bottom: 140,
              left: 20,
              right: 20,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {emoji_emotions.map((e) => (
              <TouchableOpacity
                key={e.id}
                onPress={() => toggleEmotion(e.id)}
              >
                <Text style={{ fontSize: 28, margin: 8 }}>
                  {e.icon}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

 {/* ✨ ENTRY */}

{showActions && (

  <View
    style={{
      position: "absolute",

      bottom: 70,

      left: 20,
      right: 20,

      alignItems: "center",
    }}
  >

    {/* ✦ ENTER */}

<TouchableOpacity

  disabled={saving}

  onPress={handleDiamondPress}

      style={{
        marginBottom: 26,
        opacity:
  saving
    ? 0.35
    : 0.92,
      }}
    >

<Text
  style={{

    color: "white",

    fontFamily:
      Fonts.light,

    fontSize: 24,

    opacity: 0.92,

    marginBottom: 50,
  }}
>
        ✦
      </Text>

    </TouchableOpacity>

    {/* 🌊 MODALITIES */}

    <View
      style={{
        flexDirection: "row",

        gap: 28,

        marginBottom: 24,

        opacity: 0.82,
      }}
    >

      <TouchableOpacity
        onPress={handleImage}
      >

        <Text
          style={{
            color:Colors.mutedText,

            fontSize: 18,
          }}
        >
          📷
        </Text>

      </TouchableOpacity>

<TouchableOpacity
  onPress={
    handleVoice
  }
>

            <Text
              style={{
                color:
                  Colors.mutedText,

                fontSize: 18,
              }}
            >
{
  recording
    ? "⏺"
    : "🎤"
}
            </Text>

          </TouchableOpacity>

      <TouchableOpacity

        onPress={() =>
          setShowEmojis(
            !showEmojis
          )
        }
      >

        <Text
          style={{
            color:Colors.mutedText,

            fontSize: 18,
          }}
        >

          {
            selected.length > 0

              ? "✨"

              : "😊"
          }

        </Text>

      </TouchableOpacity>

    </View>

    {/* ✍️ INPUT */}

    <View
      style={{
        width: "82%",
      }}
    >

<TextInput

  value={text}

  onChangeText={
    handleTyping
  }

placeholder={t("landing.placeholder")}

  placeholderTextColor={
    Colors.subtleText
  }

  multiline

  blurOnSubmit={false}

  style={{

    color:
      Colors.softText,

    fontFamily:
      Fonts.light,

    fontSize: 15,

    lineHeight: 28,

    textAlign:
      "center",

    minHeight: 70,

    paddingHorizontal:
      Spacing.md,
  }}
/>

    </View>

  </View>

  

)}
</Pressable>

<WelcomeOverlay
  visible={showWelcome}
  onClose={async () => {

    if (!profileId) return;

    const { error } = await supabase

      .from("profiles")

      .update({

        ai_consent: true,

        ai_consent_at: new Date().toISOString(),

      })

      .eq("id", profileId);

    if (error) {

      console.error(error);

      return;

    }

    setAiConsent(true);

    setShowWelcome(false);

  }}
/>

</KeyboardAvoidingView>
  );

}