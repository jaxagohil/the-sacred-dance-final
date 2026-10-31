
import { useMirrorStore } from "../../stores/mirrorStore";
import { buildGuidanceWhispers } from "../guidance/orchestration/buildGuidanceWhispers";
import { getUserId } from "../user";
import { buildUserContext } from "./buildUserContext";

// --------------------------------------------------
// 🌌 INITIALISE SHARED ALIGNMENT OS CONTEXT
// --------------------------------------------------

export async function initialiseAlignmentOSContext() {
  const store = useMirrorStore.getState();

  store.setReady(false);

  try {
    // 1. AUTHENTICATED USER
    const userId = await getUserId();

    if (!userId) {
      throw new Error("No authenticated user found");
    }

    // 2. BUILD USER INTELLIGENCE
    // This already calls buildMirrorContext(),
    // which already calls buildLensContext().
    // Do NOT call either again here.

    const userContext = await buildUserContext({
      userId,
      source: "livingSpace",
      activeLens: "general",
    });

    console.log("USER CONTEXT READY:", userContext?.ready);
console.log("SIGNALS:", userContext?.signals?.length);
console.log("ENERGY:", userContext?.energy);
console.log("MIRROR CONTEXT:", !!userContext?.context);

    const mirrorContext = userContext?.context ?? null;

    // 3. POPULATE SHARED STORE
    store.setUserContext(userContext);

    store.setMirrorContext(mirrorContext);

    store.setEntityLenses(
      userContext?.entityLenses || []
    );

    store.setExpressionProfile(
      userContext?.expressionProfile || null
    );

    store.setSpiralScores(
      userContext?.spiralScores || null
    );

    store.setActiveLens("general");

    // 4. PRELOAD GUIDANCE WHISPERS
    const currentState = useMirrorStore.getState();

    if (
      mirrorContext &&
      currentState.cosmic &&
      currentState.languageContext
    ) {
      const whispers = buildGuidanceWhispers({
        mirrorContext,

        cosmicContext: currentState.cosmic,

        activePatterns:
          userContext?.enrichedPatterns || [],

        activeChakras:
          userContext?.energy?.activeChakras || [],

        manifestations:
          userContext?.manifestations || [],

        emergenceMemory:
          userContext?.emergenceMemory || {},

        resolvedContent: {
          whispers: [],
        },
      });

      store.setPreloadedWhispers(whispers);
    } else {
      store.setPreloadedWhispers([]);
    }

    // 5. INITIALISATION COMPLETE
    // Ready means loading has completed.
    // It does not mean the user must already have signals.

    store.setReady(true);

    return useMirrorStore.getState();

  } catch (error) {
    console.error(
      "ALIGNMENT OS INITIALISATION ERROR:",
      error
    );

    store.setReady(false);

    throw error;
  }
}
