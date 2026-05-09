export type TarotCard = {
  name: string;
  arcana: "major" | "minor";
  suit?: "cups" | "wands" | "swords" | "pentacles";
  number?: number;
  message: string;
};

export const TAROT_CARDS: TarotCard[] = [

  // 🔮 MAJOR ARCANA
  { name: "The Fool", arcana: "major", number: 0, message: "A new beginning is closer than you think." },
  { name: "The Magician", arcana: "major", number: 1, message: "You already have what you need." },
  { name: "The High Priestess", arcana: "major", number: 2, message: "Trust what you feel but cannot explain." },
  { name: "The Empress", arcana: "major", number: 3, message: "Notice what this stirs within you." },
  { name: "The Emperor", arcana: "major", number: 4, message: "Structure brings clarity right now." },
  { name: "The Hierophant", arcana: "major", number: 5, message: "There is wisdom in tradition or guidance." },
  { name: "The Lovers", arcana: "major", number: 6, message: "A choice aligned with truth is unfolding." },
  { name: "The Chariot", arcana: "major", number: 7, message: "Direction is available if you commit to it." },
  { name: "Strength", arcana: "major", number: 8, message: "Softness is not weakness." },
  { name: "The Hermit", arcana: "major", number: 9, message: "Step back. There is wisdom in the pause." },
  { name: "Wheel of Fortune", arcana: "major", number: 10, message: "Something is shifting beyond your control." },
  { name: "Justice", arcana: "major", number: 11, message: "Truth is balancing itself out." },
  { name: "The Hanged Man", arcana: "major", number: 12, message: "A new perspective is waiting." },
  { name: "Death", arcana: "major", number: 13, message: "Something is ending to make space for truth." },
  { name: "Temperance", arcana: "major", number: 14, message: "Balance is forming through patience." },
  { name: "The Devil", arcana: "major", number: 15, message: "What feels binding may not be as fixed as it seems." },
  { name: "The Tower", arcana: "major", number: 16, message: "What is unstable is being cleared." },
  { name: "The Star", arcana: "major", number: 17, message: "There is quiet hope returning." },
  { name: "The Moon", arcana: "major", number: 18, message: "Not everything is clear yet — stay with the feeling." },
  { name: "The Sun", arcana: "major", number: 19, message: "Clarity and warmth are available." },
  { name: "Judgement", arcana: "major", number: 20, message: "You are being called into a deeper truth." },
  { name: "The World", arcana: "major", number: 21, message: "A cycle is completing." },

  // 💧 CUPS (emotions)
  ...createSuit("cups"),

  // 🔥 WANDS (action)
  ...createSuit("wands"),

  // 🌬 SWORDS (mind)
  ...createSuit("swords"),

  // 🌱 PENTACLES (material)
  ...createSuit("pentacles"),
];


// 🧩 Helper to generate Minor Arcana
function createSuit(
  suit: "cups" | "wands" | "swords" | "pentacles"
): TarotCard[] {
  const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);

  const baseMessages: Record<string, string> = {
    cups: "Notice what you are feeling beneath the surface.",
    wands: "Energy is moving — what wants to be acted on?",
    swords: "Your thoughts are shaping your experience.",
    pentacles: "What is grounding you in reality right now?",
  };

  const cards: TarotCard[] = [];

  const names = [
    "Ace",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Page",
    "Knight",
    "Queen",
    "King",
  ];

  names.forEach((n, i) => {
    cards.push({
      name: `${n} of ${suitName}`,
      arcana: "minor",
      suit,
      number: i + 1,
      message: baseMessages[suit],
    });
  });

  return cards;
}