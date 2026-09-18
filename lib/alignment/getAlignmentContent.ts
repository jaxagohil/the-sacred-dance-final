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

  //console.log("📖 Requested modules:", keys);

  return keys

    .map((key) => {

      const module = getModule(key);

      //console.log(  "🔍",  key,  module);

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

/*
 * --------------------------------------------------------
 * 🌿 GET ALIGNMENT CONTENT BY TYPE
 * --------------------------------------------------------
 *
 * Returns the combined Alignment OS content
 * for every active module of the requested type.
 *
 * Example:
 *
 * getAlignmentContentByType("conversation");
 *
 * --------------------------------------------------------
 */

export function getAlignmentContentByType(

  type: string

): string {

  const {

    getModulesByType,

  } = useAlignmentStore.getState();

  const modules =
    getModulesByType(type);

  //console.log(  "📖 Requested module type:",  type);

  return modules

    .map(
      (module) => module.content
    )

    .filter(Boolean)

    .join("\n\n");

}

/*
 * --------------------------------------------------------
 * 🌿 GET ALIGNMENT WORKFLOW
 * --------------------------------------------------------
 *
 * Returns a workflow module.
 *
 * Example:
 *
 * getAlignmentWorkflow("orchestration");
 * getAlignmentWorkflow("transmission");
 *
 * --------------------------------------------------------
 */

export function getAlignmentWorkflow(
  key: "orchestration" | "transmission"
): string {

  const { getModule } =
    useAlignmentStore.getState();

  const module = getModule(key);

  if (!module) {

    console.warn(
      `Workflow not found: ${key}`
    );

    return "";

  }

  return module.content;

}