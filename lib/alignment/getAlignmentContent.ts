// /lib/alignment/getAlignmentContent.ts

import {
  useAlignmentStore,
} from "../../stores/alignmentStore";

/*
 * --------------------------------------------------------
 * 🌿 GET ALIGNMENT CONTENT
 * --------------------------------------------------------
 *
 * Returns the combined Alignment OS content
 * for the requested modules.
 *
 * Example:
 *
 * getAlignmentContent([
 *   "alignment_core",
 *   "alignment_foundation",
 *   "people_evidence",
 * ]);
 *
 * --------------------------------------------------------
 */

export function getAlignmentContent(

  keys: string[]

): string {

  const {

    getModule,

  } = useAlignmentStore.getState();

  console.log("📖 Requested modules:", keys);

  return keys

    .map((key) => {

      const module = getModule(key);

      console.log(
        "🔍",
        key,
        module
      );

      if (!module) {

        console.warn(
          `Alignment module not found: ${key}`
        );

        return "";

      }

      return module.content;

    })

    .filter(Boolean)

    .join("\n\n");

}