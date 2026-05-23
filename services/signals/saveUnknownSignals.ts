import { supabase } from "../supabase";

type Props = {

  rawTerms: string[];

  signalType:
    | "behaviour"
    | "emotion";

  source?: string;
};

export async function saveUnknownSignals({

  rawTerms,

  signalType,

  source = "runtime",

}: Props) {

  try {

    if (
      !rawTerms?.length
    ) {
      return;
    }

    /*
     * ----------------------------------
     * 🧹 UNIQUE
     * ----------------------------------
     */

    const unique = [

      ...new Set(
        rawTerms
      ),
    ];

    /*
     * ----------------------------------
     * 🔍 EXISTING
     * ----------------------------------
     */

    const { data: existing } =

      await supabase

        .from(
          "unknown_signals"
        )

        .select(
          "raw_term"
        )

        .eq(
          "signal_type",
          signalType
        )

        .in(
          "raw_term",
          unique
        );

    const existingTerms =

      new Set(

        (existing || []).map(
          (e) => e.raw_term
        )
      );

    /*
     * ----------------------------------
     * ✨ NEW TERMS ONLY
     * ----------------------------------
     */

    const newTerms =

      unique.filter(
        (term) =>
          !existingTerms.has(
            term
          )
      );

    if (
      !newTerms.length
    ) {
      return;
    }

    /*
     * ----------------------------------
     * 📦 INSERT
     * ----------------------------------
     */

    const rows =

      newTerms.map(
        (term) => ({

          source,

          signal_type:
            signalType,

          raw_term:
            term,

          suggested_match:
            null,

          confidence:
            0,
        })
      );

    const { error } =

      await supabase

        .from(
          "unknown_signals"
        )

        .insert(rows);

    if (error) {

      console.log(
        "❌ SAVE UNKNOWN SIGNALS ERROR",
        error
      );
    }

  } catch (e) {

    console.log(
      "❌ saveUnknownSignals crash",
      e
    );
  }
}