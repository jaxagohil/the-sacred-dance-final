export type OracleCard = {
  card: number;
  title: string;
  affirmation: string;
  message?: string; // made optional (since some cards don't have it yet)
  prompts: string[];

  colour:
    | "grey"
    | "greygold"
    | "silver"
    | "copper"
    | "gold"
    | "pink"
    | "black"
    | "royalblue"
    | "silvergold"
    | "white"
    | "navy"
    | "maroon"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple";

  theme:
    | "cosmic"
    | "energy"
    | "healing"
    | "divine"
    | "chakras"
    | "guides"
    | "soul"
    | "ascension"
    | "masculine"
    | "feminine"; // added because you used it

  intensity: "high" | "medium" | "low";

  chakra?:
    | "root"
    | "sacral"
    | "solarplexus"
    | "heart"
    | "throat"
    | "thirdeye"
    | "crown"
    | "soulstar"
    | "earthstar";
};

export const ORACLE_CARDS: OracleCard[] = [

  {
    card: 1,
    title: "SOUL MEMORY",
    affirmation: "I am a Soul Having a Human Experience.",
    message: "I am a Soul Having a Human Experience.",
    prompts: [
      "What part of you is ready to remember what you’ve always known?",
      "How would life feel if you took it a little less seriously today?",
      "What is rising within you that feels like a memory, not a discovery?"
    ],
    colour: "silver",
    theme: "soul", // meaning
    intensity: "high",
  },

  {
    card: 2,
    title: "PURPOSE",
    affirmation: "I Know I Chose my Assignments — All People, Places & Things",
    message: "I Know I Chose my Assignments — All People, Places & Things",
    prompts: [
      "What if your purpose is already unfolding simply by you being you?",
      "What are the assignments you chose... and can you see them now?",
      "Do you hear the whispers beneath all the noise?"
    ],
    colour: "silver",
    theme: "soul", // meaning
    intensity: "high",
  },

  {
    card: 3,
    title: "ALIGNMENT",
    affirmation: "I Let My Mind Follow the Truth My Heart already Knows.",
    message: "I Let My Mind Follow the Truth My Heart already Knows.",
    prompts: [
      "What happens when you let your heart lead before your mind interferes?",
      "Do you know the longest journey you’ll ever travel is 15 inches, from head to heart?",
      "What is the feeling when you are in alignment... how do you use your emotions?"
    ],
    colour: "silver",
    theme: "soul", // meaning
    intensity: "high",
  },

  {
    card: 4,
    title: "TRUTH",
    affirmation: "I Know who I Am",
    message: "I Know who I Am",
    prompts: [
      "What truth within you has been waiting for you to finally admit it?",
      "How much energy would you save if you stopped pretending?",
      "Who are you beneath the masks. — and which one could you remove today?"
    ],
    colour: "silver",
    theme: "soul", // meaning
    intensity: "high",
  },

  {
    card: 5,
    title: "DESTINY",
    affirmation: "I Trust the Timing of My Life.",
    message: "I Trust the Timing of My Life.",
    prompts: [
      "What if destiny is less about trying and more about allowing?",
      "Where is life placing signs and synchronicities you’ve been avoiding?",
      "What if the timing you doubt is actually protecting you?"
    ],
    colour: "silver",
    theme: "soul", // meaning
    intensity: "high",
  },

  {
    card: 6,
    title: "EXPANSION",
    affirmation: "I am Becoming",
    message: "I am Becoming",
    prompts: [
      "Where do you feel expanded... and where do you feel constricted?",
      "What possibility keeps tapping you on the shoulder — could you explore?",
      "What dream lives in your heart... and you know you placed it there for a reason?"
    ],
    colour: "silver",
    theme: "soul", // meaning
    intensity: "high",
  }

  ,
{
  card: 7,
  title: "SACRED MIRROR",
  affirmation: "I See the Truth of who I am Through Every Reflection.",
  message: "I See the Truth of who I am Through Every Reflection.",
  prompts: [
    "Where is someone reflecting a truth you’ve been avoiding?",
    "What if every trigger is just a mirror with a sense of humour?",
    "What softens when you look at the reflection with love instead of defence?"
  ],
  colour: "copper",
  theme: "ascension", // meaning
  intensity: "high",
},

{
  card: 8,
  title: "EXPRESSION",
  affirmation: "I Express Myself with Honesty & Heart.",
  message: "I Express Myself with Honesty & Heart.",
  prompts: [
    "What truth wants to be spoken instead of swallowed?",
    "What if sharing how you feel isn’t risky — just necessary?",
    "What changes in connection when you let yourself be heard?"
  ],
  colour: "copper",
  theme: "ascension", // meaning
  intensity: "high",
},

{
  card: 9,
  title: "GROWTH",
  affirmation: "I Grow into who I am Becoming with Awareness & Grace.",
  message: "I Grow into who I am Becoming with Awareness & Grace.",
  prompts: [
    "Where is love stretching you into a fuller version of yourself?",
    "What if growing together sometimes looks messy... and that’s okay?",
    "What becomes possible when you choose evolution over comfort?"
  ],
   colour: "copper",
  theme: "ascension", // meaning
  intensity: "high",
},

{
  card: 10,
  title: "VULNERABLE",
  affirmation: "I Let Myself be Seen — By Me First, then by Others.",
  message: "I Let Myself be Seen — By Me First, then by Others.",
  prompts: [
    "Where could you let someone in just a little more?",
    "What if being vulnerable doesn’t break connection — it builds it?",
    "What rises in you when you stop hiding the parts that want to be loved?"
  ],
  colour: "copper",
  theme: "ascension", // meaning
  intensity: "high",
},

{
  card: 11,
  title: "SACRED UNION",
  affirmation: "I Open Myself to the Love that is Meant for Me.",
  message: "I Open Myself to the Love that is Meant for Me.",
  prompts: [
    "Where are you being invited into deeper harmony — within yourself or with another?",
    "What if union isn’t two halves becoming whole, but two wholes choosing to dance?",
    "What shifts when you tend to your inner union before seeking the outer one?"
  ],
  colour: "copper",
  theme: "ascension", // meaning
  intensity: "high",
},

{
  card: 12,
  title: "PRESENCE",
  affirmation: "I Choose to be Fully Here.",
  message: "I Choose to be Fully Here.",
  prompts: [
    "Where in your life are you being asked to truly show up?",
    "What if presence has nothing to do with perfection — and just attention?",
    "What changes when you stop escaping the moment and actually enter it?"
  ],
  colour: "royalblue",
  theme: "masculine", // meaning
  intensity: "high",
},

{
  card: 13,
  title: "INTEGRITY",
  affirmation: "I Choose what Aligns with My Truth.",
  message: "I Choose what Aligns with My Truth.",
  prompts: [
    "Where are your actions asking to match your values more closely?",
    "What if you stopped saying “yes” when your whole body is quietly saying “no”?",
    "What becomes possible when you choose truth over convenience?"
  ],
  colour: "royalblue",
  theme: "masculine", // meaning
  intensity: "high",
},

{
  card: 14,
  title: "COURAGE",
  affirmation: "I Act with Courage, even when I Feel Fear.",
  message: "I Act with Courage, even when I Feel Fear.",
  prompts: [
    "What would courage look like in your life today?",
    "What if fear is just excitement wearing the wrong outfit?",
    "What rises in you when you choose the path that grows you?"
  ],
  colour: "royalblue",
  theme: "masculine", // meaning
  intensity: "high",
},

{
  card: 15,
  title: "DOING",
  affirmation: "I Take Aligned Action with Clarity & Heart.",
  message: "I Take Aligned Action with Clarity & Heart.",
  prompts: [
    "What is one step you could take at this moment to make a change?",
    "What if doing something is easier than overthinking everything?",
    "What opens when you choose movement over hesitation?"
  ],
  colour: "royalblue",
  theme: "masculine", // meaning
  intensity: "high",
},

{
  card: 16,
  title: "PROTECTION",
  affirmation: "I Protect my Energy with Love & Honesty.",
  message: "I Protect my Energy with Love & Honesty.",
  prompts: [
    "Where do you need a boundary to feel safe again?",
    "What if protecting your space isn’t selfish — just sacred?",
    "What strengthens in you when you honour what you can no longer tolerate?"
  ],
  colour: "royalblue",
  theme: "masculine", // meaning
  intensity: "high",
},

{
  card: 17,
  title: "DEVOTION",
  affirmation: "I Show Up with Consistency, Love & Intention.",
  message: "I Show Up with Consistency, Love & Intention.",
  prompts: [
    "What are you devoted to becoming or creating?",
    "What if devotion is simply daily love in action?",
    "What transforms when you honour what matters to you again and again?"
  ],
  colour: "royalblue",
  theme: "masculine", // meaning
  intensity: "high",
}

,
{
  card: 18,
  title: "FLOW",
  affirmation: "I Move with Life, Not Against it.",
  message: "I Move with Life, Not Against it.",
  prompts: [
    "Where are you trying to force and what actually wants to unfold?",
    "What part of you relaxes when you trust the moment?",
    "What opens when you let life happen through you?"
  ],
  colour: "pink",
  theme: "feminine", // meaning
  intensity: "high",
},

{
  card: 19,
  title: "INTUITION",
  affirmation: "I Trust what I Feel Before I Understand it.",
  message: "I Trust what I Feel Before I Understand it.",
  prompts: [
    "What is your inner voice whispering before your mind gets in the way?",
    "What shifts when you trust the first feeling instead of the safe one?",
    "Do you trust your intuition?"
  ],
  colour: "pink",
  theme: "feminine", // meaning
  intensity: "high",
},

{
  card: 20,
  title: "BEING",
  affirmation: "I Allow Myself to Simply Be.",
  message: "I Allow Myself to Simply Be.",
  prompts: [
    "When was the last time you could simply be without fixing or improving anything?",
    "What if your worth has nothing to do with how much you do?",
    "What opens in you when you choose presence over performance?"
  ],
  colour: "pink",
  theme: "feminine", // meaning
  intensity: "high",
},

{
  card: 21,
  title: "RECEIVING",
  affirmation: "I Open Myself to Receiving.",
  message: "I Open Myself to Receiving.",
  prompts: [
    "Where are you blocking what you’ve been praying for?",
    "Why does receiving still feel harder than giving... and what if that changed today?",
    "What softens in you when you allow others to do something for you?"
  ],
  colour: "pink",
  theme: "feminine", // meaning
  intensity: "high",
},

{
  card: 22,
  title: "EMBODYING",
  affirmation: "I Honour the Wisdom of My Body.",
  message: "I Honour the Wisdom of My Body.",
  prompts: [
    "Where are you ready to show up as your whole self?",
    "What if being fully you isn’t risky — just overdue?",
    "What energy rises in you when you stop performing and start embodying?"
  ],
  colour: "pink",
  theme: "feminine", // meaning
  intensity: "high",
},

{
  card: 23,
  title: "NURTURING",
  affirmation: "I Nurture Myself with Softness, Patience & Care.",
  message: "I Nurture Myself with Softness, Patience & Care.",
  prompts: [
    "Where does your heart need gentleness today?",
    "Why is it so easy to care for others — but harder to offer yourself the same grace?",
    "What grows within you when you choose kindness over pressure?"
  ],
  colour: "pink",
  theme: "feminine", // meaning
  intensity: "high",
}

,
{
  card: 24,
  title: "AMMAARAH",
  affirmation: "I Open My Heart to Guidance That Leads with Love.",
  message: "I Open My Heart to Guidance That Leads with Love.",
  prompts: [
    "Where is your heart gently guiding you, even if it makes you feel uncomfortable?",
    "What if you chose love over fear, just this once?",
    "What truth rises when you listen to the whisper beneath your emotions?"
  ],
  colour: "gold",
  theme: "guides", // meaning
  intensity: "high",
},

{
  card: 25,
  title: "AUREON",
  affirmation: "I Trust the Purpose My Soul Chose for this Lifetime.",
  message: "I Trust the Purpose My Soul Chose for this Lifetime.",
  prompts: [
    "What assignments have you noticed and understood why you chose them?",
    "What if you stopped overthinking and let this be simpler than you’re making it?",
    "What becomes clear when you trust that you’re exactly where you’re meant to be?"
  ],
  colour: "gold",
  theme: "guides", // meaning
  intensity: "high",
},

{
  card: 26,
  title: "SOREN",
  affirmation: "I Align with the Timeline that Serves My Highest Evolution.",
  message: "I Align with the Timeline that Serves My Highest Evolution.",
  prompts: [
    "Which version of your future feels closest to the person you’re becoming?",
    "What if you’re not running late or falling behind, just syncing to your own timeline?",
    "What opens when you trust that the future you want is already moving toward you?"
  ],
  colour: "gold",
  theme: "guides", // meaning
  intensity: "high",
},

{
  card: 27,
  title: "GAIA",
  affirmation: "I Feel Supported, Held & Grounded by Gaia.",
  message: "I Feel Supported, Held & Grounded by Gaia.",
  prompts: [
    "When was the last time you slowed down... and just be one with nature?",
    "Have you ever walked barefoot on the earth... or hugged a tree?",
    "Do you see Gaia as a living being just as you are?"
  ],
  colour: "gold",
  theme: "guides", // meaning
  intensity: "high",
},

{
  card: 28,
  title: "GANGA",
  affirmation: "I Allow Myself to Flow with Faith & Purity.",
  message: "I Allow Myself to Flow with Faith & Purity.",
  prompts: [
    "Where in life could you be a little more like water?",
    "What if you stopped trying to control and allowed yourself to flow?",
    "What if you allowed Ganga carry you this one time?"
  ],
  colour: "gold",
  theme: "guides", // meaning
  intensity: "high",
}
,
{
  card: 29,
  title: "INNER CHILD",
  affirmation: "I Hold My Younger Self with Love & Safety.",
  message: "I Hold My Younger Self with Love & Safety.",
  prompts: [
    "Where is your inner child asking for comfort or attention today?",
    "What if the part of you that “overreacts” is just a younger you wanting a hug?",
    "What softens when you listen to the feeling beneath the story?"
  ],
  colour: "silvergold",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 30,
  title: "FORGIVE",
  affirmation: "I Choose Forgiveness to Free My Heart.",
  message: "I Choose Forgiveness to Free My Heart.",
  prompts: [
    "Who are you ready to forgive — including yourself?",
    "What if forgiveness doesn’t mean “it was okay,” but “I deserve peace”?",
    "What shifts in you when you release the story that keeps you hurting?"
  ],
  colour: "silvergold",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 31,
  title: "LET GO",
  affirmation: "I Let Go of What No Longer Aligns with My Becoming.",
  message: "I Let Go of What No Longer Aligns with My Becoming.",
  prompts: [
    "What are you still holding onto that your soul is gently asking you to let go?",
    "What if letting go isn’t losing — but making space for something truer?",
    "What opens when you stop gripping what you’ve already outgrown?"
  ],
  colour: "silvergold",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 32,
  title: "BOUNDARIES",
  affirmation: "I Honour What Protects My Peace.",
  message: "I Honour What Protects My Peace.",
  prompts: [
    "Where do you need a boundary to feel safe and spacious again?",
    "What if saying “no” is actually saying “yes” to yourself?",
    "What strengthens in you when you stop abandoning your limits?"
  ],
  colour: "silvergold",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 33,
  title: "PATTERNS",
  affirmation: "I Recognise My Patterns with Honesty & Compassion.",
  message: "I Recognise My Patterns with Honesty & Compassion.",
  prompts: [
    "Which pattern keeps repeating itself in your life right now?",
    "What if this pattern is a gentle teacher and you need to make a different choice?",
    "What if this pattern is part of a larger generational cycle you chose to complete?"
  ],
   colour: "silvergold",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 34,
  title: "SELF LOVE",
  affirmation: "I Choose to Love Myself Without Conditions.",
  message: "I Choose to Love Myself Without Conditions.",
  prompts: [
    "Where could you begin to see your body as a temple?",
    "What if the way you speak to yourself is the real love story?",
    "What shifts when you stop abandoning yourself emotionally?"
  ],
  colour: "silvergold",
  theme: "healing", // meaning
  intensity: "high",
}

,
{
  card: 35,
  title: "BREATHE",
  affirmation: "I Return to My Breath & To Myself.",
  message: "I Return to My Breath & To Myself.",
  prompts: [
    "Where is your breath asking you to slow down and be present?",
    "When was the last time you let yourself be in silence and not be distracted?",
    "What softens in you when you breathe deeply?"
  ],
  colour: "white",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 36,
  title: "NATURE",
  affirmation: "I Connect with Gaia to Ground My Energy.",
  message: "I Connect with Gaia to Ground My Energy.",
  prompts: [
    "When was the last time you let nature regulate your nervous system?",
    "What if going for a walk in a forest is the medicine your mind keeps forgetting?",
    "What do the cycles of nature show you — do you see your own cycles?"
  ],
  colour: "white",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 37,
  title: "GRATITUDE",
  affirmation: "I Choose Gratitude to Expand My Heart.",
  message: "I Choose Gratitude to Expand My Heart.",
  prompts: [
    "What is one simple thing you’re grateful for in this moment?",
    "What if gratitude isn’t about the big things but the tiny miracles every day?",
    "What shifts in your energy when you notice what’s already here?"
  ],
  colour: "white",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 38,
  title: "CREATIVITY",
  affirmation: "I Express Myself Freely & Without Judgment.",
  message: "I Express Myself Freely & Without Judgment.",
  prompts: [
    "Where is your creative energy asking to move today?",
    "What if creativity isn’t about being perfect — just being alive?",
    "What part of you awakens when you create without a goal?"
  ],
  colour: "white",
  theme: "healing", // meaning
  intensity: "high",
},

{
  card: 39,
  title: "JOY",
  affirmation: "I Allow Joy to Move Freely Through My Life.",
  message: "I Allow Joy to Move Freely Through My Life.",
  prompts: [
    "Where does joy already exist in your life, waiting to be noticed?",
    "What if joy isn’t something to earn, but something to let yourself feel every day?",
    "What opens in you when you allow joy to be simple instead of perfect?"
  ],
  colour: "white",
  theme: "healing", // meaning
  intensity: "high",
}
,
{
  card: 40,
  title: "PORTAL ACTIVATION",
  affirmation: "I Step into New Possibilities with Openness & Trust.",
  message: "I Step into New Possibilities with Openness & Trust.",
  prompts: [
    "What threshold are you standing at right now?",
    "What if the 'strange pull' you feel is simply a portal opening for you?",
    "What becomes possible when you stop resisting the next version of yourself?"
  ],
  colour: "navy",
  theme: "cosmic", // meaning
  intensity: "high",
},

{
  card: 41,
  title: "THE MOON",
  affirmation: "I Honour My Inner Tides, Cycles & Intuition.",
  message: "I Honour My Inner Tides, Cycles & Intuition.",
  prompts: [
    "What emotion or truth is surfacing in you right now?",
    "What if your mood isn’t chaos — just the moon moving through you?",
    "What is the moon inviting you to see more clearly within yourself?"
  ],
  colour: "navy",
  theme: "cosmic", // meaning
  intensity: "high",
},

{
  card: 42,
  title: "THE SUN",
  affirmation: "I Rise into Clarity, Warmth & Confidence.",
  message: "I Rise into Clarity, Warmth & Confidence.",
  prompts: [
    "Where are you being asked to shine without dimming?",
    "What if standing in your light is the medicine you’ve been avoiding?",
    "What awakens in you when you let yourself be fully seen and happy?"
  ],
  colour: "navy",
  theme: "cosmic", // meaning
  intensity: "high",
},

{
  card: 43,
  title: "COSMIC NEIGHBOURS",
  affirmation: "I am Open to Loving Connections Across Realms & Dimensions.",
  message: "I am Open to Loving Connections Across Realms & Dimensions.",
  prompts: [
    "Where do you feel support, guidance, or connection from beyond the physical?",
    "What if you’ve never been alone — just more connected than you realised?",
    "What would your first words be to your Cosmic Neighbours?"
  ],
  colour: "navy",
  theme: "cosmic", // meaning
  intensity: "high",
},

{
  card: 44,
  title: "LIGHT CODES",
  affirmation: "I Receive the Energies that Support My Evolution.",
  message: "I Receive the Energies that Support My Evolution.",
  prompts: [
    "What new gift, awareness or sensation is rising in you lately?",
    "What if your 'symptoms' are actually upgrades, not problems?",
    "What becomes clear when you trust what your body is integrating?"
  ],
  colour: "navy",
  theme: "cosmic", // meaning
  intensity: "high",
},

{
  card: 45,
  title: "TIMELINE SHIFT",
  affirmation: "I Align with the Timeline that Matches My Becoming.",
  message: "I Align with the Timeline that Matches My Becoming.",
  prompts: [
    "Where do you feel a subtle pull toward a different version of your life?",
    "What if things falling apart are simply you shifting timelines?",
    "Which version of you is asking to be lived now?"
  ],
  colour: "navy",
  theme: "cosmic", // meaning
  intensity: "high",
},

{
  card: 46,
  title: "QUANTUM ENTANGLED",
  affirmation: "I Trust the Connections Written in My Soul’s Blueprint.",
  message: "I Trust the Connections Written in My Soul’s Blueprint.",
  prompts: [
    "Who or what is your energy naturally entangled with right now?",
    "What if some connections make no sense because they were destined?",
    "What shifts in you when you honour the bonds that feel destined?"
  ],
  colour: "navy",
  theme: "cosmic", // meaning
  intensity: "high",
}

,
{
  card: 47,
  title: "LOVE WINS",
  affirmation: "I Choose Love, Again & Again.",
  message: "I Choose Love, Again & Again.",
  prompts: [
    "Where in your life is love asking to lead instead of fear?",
    "What if choosing love is actually the most rebellious thing you can do?",
    "What softens in you when you return to love, even quietly?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 48,
  title: "ALL MIRRORS",
  affirmation: "I See Every Experience as a Reflection for My Growth.",
  message: "I See Every Experience as a Reflection for My Growth.",
  prompts: [
    "What is life mirroring back into your reality right now?",
    "What if the trigger isn’t the problem — just the messenger?",
    "What changes when you look at the mirror with curiosity instead of defence?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 49,
  title: "DIVINE TIMING",
  affirmation: "I Trust the Timing of My Life.",
  message: "I Trust the Timing of My Life.",
  prompts: [
    "Where are you rushing or resisting what wants its own pace?",
    "What if delays aren’t detours but divine orchestration?",
    "What opens when you trust that everything is unfolding for you, not against you?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 50,
  title: "SURRENDER",
  affirmation: "I Release Control and Allow Life to Move Through Me.",
  message: "I Release Control and Allow Life to Move Through Me.",
  prompts: [
    "Where are you gripping too tightly out of fear?",
    "What if surrender isn’t giving up — but giving in to something wiser?",
    "What becomes possible when you let life support you?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 51,
  title: "ABUNDANCE",
  affirmation: "I Receive Fully, Knowing the Universe is Generous with Me.",
  message: "I Receive Fully, Knowing the Universe is Generous with Me.",
  prompts: [
    "Where do you already feel abundance in your life, even if small?",
    "What if abundance is an energy you tune into, not something you chase?",
    "What expands when you trust that you are supported?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 52,
  title: "NEW EARTH",
  affirmation: "I Live in Unity Consciousness, Compassion & Love.",
  message: "I Live in Unity Consciousness, Compassion & Love.",
  prompts: [
    "What is good for you and good for humanity and good for the planet?",
    "What if New Earth isn’t a place, but a choice you make daily?",
    "What is one small shift you can make today to choose unity over separation?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 53,
  title: "THAKORJI",
  affirmation: "I Never Walk Alone.",
  message: "I Never Walk Alone.",
  prompts: [
    "Where in your life do you feel quietly guided?",
    "What if divine love, support, protection isn’t loud — just consistent?",
    "What rises within you when you trust the presence walking with you?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 54,
  title: "ROOT CHAKRA",
  affirmation: "I am Connected, Grounded & Safe.",
  prompts: [
    "Where does your body already know it is safe, even if your mind forgets?",
    "What if grounding yourself in the moment dissolves the fear of not having enough?",
    "What part of you relaxes when you stop preparing for what might go wrong?"
  ],
  colour: "maroon",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "root"
},

{
  card: 55,
  title: "SACRAL CHAKRA",
  affirmation: "I am Worthy of Love, Pleasure & Joy.",
  prompts: [
    "Where are you holding back your authentic expression?",
    "What if pleasure and play are just as spiritual as discipline?",
    "What is your relationship with intimacy — with yourself and with others?"
  ],
  colour: "orange",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "sacral"
},

{
  card: 56,
  title: "SOLAR PLEXUS CHAKRA",
  affirmation: "I am Strong, Powerful & Confident.",
  prompts: [
    "Where do you need to take your power back?",
    "What if confidence doesn’t come first — what if action creates it?",
    "What shifts in your body when you trust yourself fully?"
  ],
  colour: "yellow",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "solarplexus"
},

{
  card: 57,
  title: "HEART CHAKRA",
  affirmation: "I am Love, Loved & Lovable.",
  prompts: [
    "Where is your heart asking for softness today?",
    "What if opening your heart isn’t risky — just real?",
    "What if tears are simply a beautiful expression of what matters to the heart?"
  ],
  colour: "green",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "heart"
},

{
  card: 58,
  title: "THROAT CHAKRA",
  affirmation: "I Speak my Truth.",
  prompts: [
    "What truth is waiting to be spoken?",
    "What if using your voice is less scary than holding it in?",
    "What could be the deeper message behind your sore throat or cough?"
  ],
  colour: "blue",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "throat"
},

{
  card: 59,
  title: "THIRD EYE CHAKRA",
  affirmation: "I Trust my Intuition.",
  prompts: [
    "What inner knowing have you been ignoring?",
    "What if your intuition is already giving you the next step?",
    "Where do you need to work on your imposter syndrome?"
  ],
  colour: "purple",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "thirdeye"
},

{
  card: 60,
  title: "CROWN CHAKRA",
  affirmation: "I am One with All that Is.",
  prompts: [
    "Where do you feel supported in ways you can’t explain?",
    "What if you’re more guided than you realise?",
    "What expands in you when you trust that you are divine?"
  ],
  colour: "pink",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "crown"
},

{
  card: 61,
  title: "EARTH STAR",
  affirmation: "I am Rooted Beyond this Lifetime.",
  prompts: [
    "Where in your life are you seeking deeper stability or belonging?",
    "What if you’re more supported by Gaia than you realise — literally held?",
    "What strengthens in you when you trust the foundation beneath your feet?"
  ],
  colour: "grey",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "earthstar"
},

{
  card: 62,
  title: "SOUL STAR",
  affirmation: "I Receive Guidance from the Higher Wisdom of My Soul.",
  prompts: [
    "What guidance keeps returning to you again and again?",
    "What if the “random signs” are actually your soul tapping you on the shoulder?",
    "What expands when you align with what your soul already knows?"
  ],
  colour: "grey",
  theme: "chakras", // meaning
  intensity: "high",
  chakra: "soulstar"
},

{
  card: 63,
  title: "Feminine Energy",
  affirmation: "I am Open to Intuition, Softness & Inner Flow.",
  message: "You are being invited to soften into receiving. Your feminine energy is not passive — it is magnetic. When you stop pushing and begin allowing, life reorganises around you in a more natural flow.",
  prompts: [
    "Where can you allow things to be easier for yourself?",
    "What if receiving isn’t indulgent, but overdue?",
    "What shifts when you stop chasing and allow yourself to attract?"
  ],
  colour: "greygold",
  theme: "energy", // meaning
  intensity: "high",
},

{
  card: 64,
  title: "Masculine Energy",
  affirmation: "I Honour My Inner Strength, Clarity & Direction.",
  message: "Your masculine energy is asking to come into alignment. This is not about control — it is about direction with integrity. When your actions match your truth, your energy stabilises and becomes deeply supportive.",
  prompts: [
    "Where is your life asking for direction or structure?",
    "Where might control soften into protection — for yourself or others?",
    "What grows when your actions align with your truth?"
  ],
  colour: "greygold",
  theme: "energy", // meaning
  intensity: "high",
},

{
  card: 65,
  title: "Higher Heart",
  affirmation: "I Let Love Move Through Me with Compassion & Grace.",
  message: "This is love beyond condition. You are being invited to soften — not in weakness, but in strength. Compassion is not something you give others first; it is something you allow yourself to feel. Let love move through you, not from you.",
  prompts: [
    "Where could you offer yourself more kindness today?",
    "What if compassion is strength, not softness?",
    "What shifts when you ask: what would love do?"
  ],
  colour: "greygold",
  theme: "energy", // meaning
  intensity: "high",
},

{
  card: 66,
  title: "Aura",
  affirmation: "I Keep My Energy Field Clear, Open & Protected.",
  message: "Your energy field is sensitive right now. You may be carrying what is not yours. This is not about closing — it is about clarity. When you honour your space as sacred, what does not belong naturally falls away.",
  prompts: [
    "What energies are you absorbing that don’t belong to you?",
    "What if your aura has been quietly asking for boundaries?",
    "What changes when you treat your energy as sacred space?"
  ],
  colour: "greygold",
  theme: "energy", // meaning
  intensity: "high",
},

{
  card: 67,
  title: "Balance",
  affirmation: "I Allow My Energies to Settle into Peace.",
  message: "Balance is not perfection — it is awareness. You are being invited to listen to your inner world more closely. Where something feels off, it is simply asking to be seen, not fixed. Let your emotional body guide you back to centre.",
  prompts: [
    "Where is your inner world asking for more balance?",
    "What if balance isn’t symmetry, but finding your middle path?",
    "Where can you begin to trust your emotions as a navigation system?"
  ],
    colour: "greygold",
  theme: "energy", // meaning
  intensity: "high",
},

{
  card: 68,
  title: "I AM MAGIC",
  affirmation: "I AM MAGIC",
  message: "Balance is not perfection — it is awareness. You are being invited to listen to your inner world more closely. Where something feels off, it is simply asking to be seen, not fixed. Let your emotional body guide you back to centre.",
  prompts: [
    "Where is your inner world asking for more balance?",
    "What if balance isn’t symmetry, but finding your middle path?",
    "Where can you begin to trust your emotions as a navigation system?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
},

{
  card: 68,
  title: "NOTHING IS A COINCIDENCE",
  affirmation: "NOTHING IS A COINCIDENCE",
  message: "Balance is not perfection — it is awareness. You are being invited to listen to your inner world more closely. Where something feels off, it is simply asking to be seen, not fixed. Let your emotional body guide you back to centre.",
  prompts: [
    "Where is your inner world asking for more balance?",
    "What if balance isn’t symmetry, but finding your middle path?",
    "Where can you begin to trust your emotions as a navigation system?"
  ],
  colour: "black",
  theme: "divine", // meaning
  intensity: "high",
}

];
