const API_URL = "https://wing-manor-unsecured.ngrok-free.dev";

type AIType = "tarot" | "energy" | "lens" | "guide" | "distortion" | "cosmic";
type GuideKey = "guide_heart" | "guide_structure" | "guide_cosmic";

type Oracle = { title: string; message: string };
type Tarot = { title: string; message: string };

type UserContext = {
  name?: string;
  energyType?: "feminine" | "masculine";
};

type AIInput = {
  type: AIType;
  data: {
    oracle?: Oracle;
    tarot?: Tarot;
    chakra?: string;
    lens?: string;
    phase?: string;

    base?: string;
    moon?: string;
    sun?: string;

    pattern?: string;
    patternState?: string;
    patternTrend?: string;

    guide?: GuideKey;
    guideName?: string;
    message?: string;

    user?: UserContext;

    cosmic?: {
      phase?: string;
      sunEnergy?: string;
    };

    sunEnergy?: string;
  };
};

export async function generateAIResponse({ type, data }: AIInput) {
  const prompt = buildPrompt(type, data);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(`${API_URL}/api/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await response.text();

    let result: any = null;

    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("❌ RAW AI RESPONSE (not JSON):", text);
      return data.base || "...";
    }

    console.log("🧠 PROMPT:", prompt);
    console.log("📦 BACKEND RESULT:", result);

    if (!response.ok) {
      console.error("AI ERROR:", result);
      return data.base || "Something didn’t come through.";
    }

    return (result?.text || "").trim() || data.base || "...";

  } catch (err: any) {
    console.error("AI FETCH ERROR:", err?.message || err);

    if (err?.name === "AbortError") {
      return "Taking a little longer…";
    }

    return data.base || "...";
  }
}

function buildPrompt(type: AIType, data: AIInput["data"]) {
  const baseTone = `
Tone:
- simple
- human
- grounded
- gentle but clear
- no advice
- no fixing
- no jargon
`;

  const patternContext = `
Core Pattern:
- Pattern: ${data.pattern || "unknown"}
- State: ${data.patternState || "unknown"}
- Trend: ${data.patternTrend || "stable"}
`;

  switch (type) {

    // ---------------------------
    // TAROT
    // ---------------------------
    case "tarot":
      return `
${baseTone}

Oracle: ${data.oracle?.title} — ${data.oracle?.message}
Tarot: ${data.tarot?.title}

Write ONE short sentence.

Rules:
- Start with "I"
- Very simple language
- No poetic tone
- No explanation
`;

    // ---------------------------
    // COSMIC
    // ---------------------------
    case "cosmic":
      return `
${baseTone}

Base message:
"${data.base || ""}"

Context:
- Moon Phase: ${data.phase || "unknown"}
- Active Pattern: ${data.pattern || "unknown"}

Subtle influences:
- Emotional tone (Moon): ${data.moon || "unknown"}
- Underlying field (Sun): ${data.sunEnergy || data.sun || "unknown"}

Rewrite the base message in 1–2 short sentences.

Rules:
- Keep the same meaning
- Speak directly to the user ("you")
- Keep it grounded and calm
- No advice
- No spiritual jargon
`;

    // ---------------------------
    // ENERGY
    // ---------------------------
    case "energy":
      return `
${baseTone}

${patternContext}

Context:
- Chakra: ${data.chakra || "unknown"}
- Lens: ${data.lens || "none"}

User:
- Name: ${data.user?.name || "unknown"}
- EnergyType: ${data.user?.energyType || "unknown"}

Write 1–2 short sentences.

Rules:
- Speak directly ("you")
- Reflect what is happening (not why)
- Keep it grounded and real
- Do not generalise
- No advice
`;

    // ---------------------------
    // LENS
    // ---------------------------
    case "lens":
      return `
${baseTone}

${patternContext}

Context:
- Lens: ${data.lens}
- Chakra: ${data.chakra || "unknown"}

Start with:
"The pattern is ..."

Then include:

Emotion:
Boundary:
Behaviour:
Integration:

Rules:
- Each line short
- Very simple language
- Specific, not abstract
- No advice
`;

    // ---------------------------
    // GUIDE
    // ---------------------------
    case "guide":
      return `
${baseTone}

You are ${data.guideName || "a guide"}.

User said:
${data.message}

${
  data.guide === "guide_heart"
    ? `
Context (internal, do not name directly):
- Pattern: ${data.pattern}
- State: ${data.patternState}
- Trend: ${data.patternTrend}

You speak from feeling.

Focus:
- What is being felt underneath
- What feels vulnerable or tender

Style:
- soft, close, human
- slightly slower tone

Structure:
- First sentence reflects emotion
- Second sentence gently grounds

Rules:
- Do NOT name the pattern directly
- Stay with feeling (not analysis)
- Use simple emotional language
- No advice
- No fixing
`
    : data.guide === "guide_structure"
    ? `
Core Pattern:
- Pattern: ${data.pattern}
- State: ${data.patternState}
- Trend: ${data.patternTrend}

You speak from clarity.

Focus:
- What pattern is happening
- What behaviour is repeating

Style:
- direct, clear, grounded
- precise

Structure:
- One or two sentences only
- Name what is happening clearly

Rules:
- You CAN name the pattern directly
- Be clear, not soft
- No emotional cushioning
- No judgement
- No advice
`
    : `
Context (wider view):
- Pattern: ${data.pattern}
- State: ${data.patternState}
- Trend: ${data.patternTrend}

You speak from a wider perspective.

Focus:
- The bigger picture
- What this might be showing
- What is opening through this

Style:
- spacious, calm, reflective
- slightly abstract but grounded

Structure:
- One or two sentences
- Expand the view

Rules:
- Do NOT directly name the pattern
- Refer to it indirectly
- Do not become vague
- No advice
- No fixing
`
}

Write 1–2 short sentences.
`;

    // ---------------------------
    // DISTORTION
    // ---------------------------
    case "distortion":
      return `
${baseTone}

${patternContext}

Context:
- Lens: ${data.lens}
- Chakra: ${data.chakra || "heart"}
- Expression: ${data.message || "holding something back"}

Write ONE short sentence.

Rules:
- Start with "I"
- Very simple
- Behaviour only
- Direct and clear
- No explanation
`;
  }
}