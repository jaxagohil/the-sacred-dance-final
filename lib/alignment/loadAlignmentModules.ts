// /lib/alignment/loadAlignmentModules.ts

import { supabase } from "../../services/supabase";

import {
  AlignmentModule,
  useAlignmentStore,
} from "../../stores/alignmentStore";

/*
 * --------------------------------------------------------
 * 🌿 LOAD ALIGNMENT MODULES
 * --------------------------------------------------------
 *
 * Loads the active Alignment OS modules
 * from Supabase into the Alignment Store.
 *
 * This is called once when the app starts.
 *
 * --------------------------------------------------------
 */

export async function loadAlignmentModules() {

  console.log("🚀 loadAlignmentModules START");

  const {
    loaded,
    setModules,
  } = useAlignmentStore.getState();

  //console.log("loaded =", loaded);

  /*
   * --------------------------------------------------------
   * Already Loaded
   * --------------------------------------------------------
   */

  if (loaded) {

    return;

  }

  /*
   * --------------------------------------------------------
   * Fetch Modules
   * --------------------------------------------------------
   */

  const {

    data,

    error,

  } = await supabase

    .from("alignment_os")

    .select("*")

    .eq("active", true)

    .order("sort_order");

 // console.log("🌍 Alignment rows:", data); 
//console.log("❌ Query error:", error);

  if (error) {

    console.error(

      "Failed to load Alignment OS:",

      error.message

    );

    return;

  }

  /*
   * --------------------------------------------------------
   * Store Modules
   * --------------------------------------------------------
   */

  setModules(

    (data || []) as AlignmentModule[]

  );

  setModules((data || []) as AlignmentModule[]);

console.log(
  "✅ Store keys:",
  Object.keys(useAlignmentStore.getState().modules)
);

}