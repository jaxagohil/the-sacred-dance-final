
/*
 * --------------------------------------------------------
 * ✨ BUILD ORCHESTRATION WHISPERS
 * --------------------------------------------------------
 *
 * PURPOSE
 *
 * Collect simple signs and symbols from the
 * existing Sacred Dance Living Field.
 *
 * Whispers are:
 * - symbols
 * - little signs
 * - aha moments
 * - playful synchronicities
 *
 * No AI calls.
 * No database queries.
 * No interpretation.
 *
 * --------------------------------------------------------
 */

type WhisperSource =
  | "chakra"
  | "pattern"
  | "oracle"
  | "cosmic"
  | "manifestation";

interface Whisper {
  text: string;
  source: WhisperSource;
}

interface BuildWhispersInput {
  activeChakras?: any[];
  activePatterns?: any[];
  oracleCard?: any;
  manifestations?: any[];
  cosmicContext?: any;
}

const addSymbol = (
  whispers: Whisper[],
  symbol: any,
  source: WhisperSource
) => {
  if (
    typeof symbol !== "string" ||
    !symbol.trim()
  ) {
    return;
  }

  whispers.push({
    text: symbol.trim(),
    source,
  });
};

export function buildOrchestrationWhispers({
  activeChakras = [],
  activePatterns = [],
  oracleCard,
  manifestations = [],
  cosmicContext,
}: BuildWhispersInput): Whisper[] {

  const whispers: Whisper[] = [];

  // CHAKRA SYMBOLS
  activeChakras.forEach((chakra) => {
    addSymbol(
      whispers,
      chakra?.symbol,
      "chakra"
    );
  });

  // PATTERN SYMBOLS
  activePatterns.forEach((pattern) => {
    addSymbol(
      whispers,
      pattern?.symbol,
      "pattern"
    );
  });

  // ORACLE CARD SYMBOL
  addSymbol(
    whispers,
    oracleCard?.symbol,
    "oracle"
  );

  // MANIFESTATION SYMBOLS
  manifestations.forEach((item) => {
    addSymbol(
      whispers,
      item?.symbol,
      "manifestation"
    );
  });

  // COSMIC SIGNS
  if (cosmicContext?.isFullMoon) {
    addSymbol(whispers, "🌕", "cosmic");
  }

  if (cosmicContext?.isEclipse) {
    addSymbol(whispers, "🌑", "cosmic");
  }

  if (cosmicContext?.isPortal) {
    addSymbol(whispers, "🌀", "cosmic");
  }

  // REMOVE DUPLICATES
  const unique = Array.from(
    new Map(
      whispers.map((item) => [
        item.text,
        item,
      ])
    ).values()
  );

  // KEEP THE FIELD LIGHT
  return unique
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}
