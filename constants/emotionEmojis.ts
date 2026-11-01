export const EMOTION_EMOJIS = [
  { id: "calm", icon: "😌" },
  { id: "open", icon: "✨" },
  { id: "grateful", icon: "💛" },
  { id: "loving", icon: "❤️" },
  { id: "happy", icon: "😊" },
  { id: "hopeful", icon: "🌿" },
  { id: "tired", icon: "😴" },
  { id: "sad", icon: "😔" },
  { id: "moved", icon: "🥹" },
  { id: "overwhelmed", icon: "😢" },
] as const;

export type EmotionId =
  (typeof EMOTION_EMOJIS)[number]["id"];