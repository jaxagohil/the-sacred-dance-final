// /lib/guidance/orchestration/interpretGuidanceFragment.ts

/*

* ---
* 🌌 INTERPRET GUIDANCE FRAGMENT
* ---
*
* PURPOSE:
*
* Apply subtle guide consciousness
* to already-orchestrated fragments.
*
* IMPORTANT:
*
* This file:
* * does NOT generate meaning
* * does NOT orchestrate
* * does NOT rewrite heavily
*
* It ONLY:
* * softens
* * archetype-tints
* * adjusts pacing feel
* * applies gentle guide flavour
*
* ---

*/

import {
  GUIDE_TYPES,
} from "../../../components/guidance/guideConfig";

/*

* ---
* 🌊 INTERPRET
* ---

*/

export const interpretGuidanceFragment = ({

fragment = "",

guide =
GUIDE_TYPES.COSMIC,

emotionalField =
"soft",

pacing =
"slow",

}: any) => {

/*

* ---
* 🌌 EMPTY
* ---

*/

if (!fragment) {

return "";

}

/*

* ---
* 🌊 BASE
* ---

*/

let interpreted =

fragment
  ?.trim?.()

  || "";

/*

* ---
* 🌌 NORMALIZED
* ---

*/

const normalized =

interpreted
  ?.toLowerCase?.()

  || "";

/*

* ---
* 🌿 COSMIC GUIDE
* ---

*/

if (
guide ===
GUIDE_TYPES.COSMIC
) {

interpreted =

  interpreted

    .replace(
      /patterns/gi,
      "patterns across the field"
    )

    .replace(
      /timing/gi,
      "sacred timing"
    )

    .replace(
      /awareness/gi,
      "expanded awareness"
    );

}

/*

* ---
* 🌊 HEART GUIDE
* ---

*/

if (
guide ===
GUIDE_TYPES.HEART
) {

interpreted =

  interpreted

    .replace(
      /protection/gi,
      "soft protection"
    )

    .replace(
      /trust/gi,
      "gentle trust"
    )

    .replace(
      /heart/gi,
      "heart space"
    );

}

/*

* ---
* 🌿 STRUCTURE GUIDE
* ---

*/

if (
guide ===
GUIDE_TYPES.STRUCTURE
) {

interpreted =

  interpreted

    .replace(
      /awareness/gi,
      "grounded awareness"
    )

    .replace(
      /regulation/gi,
      "nervous system regulation"
    )

    .replace(
      /patterns/gi,
      "observable patterns"
    );

}

/*

* ---
* 🌌 EMOTIONAL FIELD
* ---

*/

if (
emotionalField ===
"tender"
) {

interpreted =

  interpreted.replace(
    /force/gi,
    "gentleness"
  );

}

/*

* ---
* 🌊 PACING
* ---

*/

if (
pacing ===
"slow"
) {

interpreted =
  interpreted.trim();

}

/*

* ---
* 🌌 RETURN
* ---

*/

return interpreted;
};
