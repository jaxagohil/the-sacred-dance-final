// lib/loadValidSignals.ts

import { supabase } from "./supabase.ts";

// --------------------------------------------------
// 🌍 GLOBAL SIGNAL REGISTRIES
// --------------------------------------------------

export let VALID_EMOTIONS: string[] = [];

export let VALID_BEHAVIOURS: string[] = [];

let isLoaded = false;

let loadingPromise:
  Promise<void> | null = null;

// --------------------------------------------------
// 🚀 LOAD SIGNALS FROM DB
// --------------------------------------------------

export async function loadValidSignals() {

  if (isLoaded) return;

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {

    // --------------------------------------------
    // 😭 EMOTIONS
    // --------------------------------------------

    const { data: emotions } =
      await supabase
        .from("emotions")
        .select("id");

    // --------------------------------------------
    // 🧠 BEHAVIOURS
    // --------------------------------------------

    const { data: behaviours } =
      await supabase
        .from("behaviours")
        .select("id");

    VALID_EMOTIONS =
      (emotions || []).map(
        (e) => e.id
      );

    VALID_BEHAVIOURS =
      (behaviours || []).map(
        (b) => b.id
      );

    isLoaded = true;

    console.log(
      "✅ SIGNAL REGISTRIES LOADED"
    );

    console.log(
      "😭 EMOTIONS:",
      VALID_EMOTIONS
    );

    console.log(
      "🧠 BEHAVIOURS:",
      VALID_BEHAVIOURS
    );

  })();

  return loadingPromise;
}

// --------------------------------------------------
// 📦 GETTERS
// --------------------------------------------------

export function getValidEmotions() {
  return VALID_EMOTIONS;
}

export function getValidBehaviours() {
  return VALID_BEHAVIOURS;
}