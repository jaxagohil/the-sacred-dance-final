import { supabase } from "../services/supabase";

export async function getDailyPrompt(userId: string) {

  //
  // 🌸 PROFILE
  //

  const {
    data: profile,
  } = await supabase

    .from("profiles")

    .select(
     "created_at, language, timezone"
    )

    .eq(
      "user_id",
      userId
    )

    .maybeSingle();

  const timezone =
  profile?.timezone ||
  "Asia/Kolkata";

const today =
  new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: timezone,
    }
  ).format(
    new Date()
  );  

  const language =
    profile?.language || "en";

  //
  // 🌿 HELPER
  //

  const fetchPrompt =
    async (
      query: any
    ) => {

      // 🌍 USER LANGUAGE

      let { data } =
        await query
          .eq(
            "language",
            language
          )
          .maybeSingle();

      // 🌸 FALLBACK ENGLISH

      if (!data && language !== "en") {

        const fallback =
          await query
            .eq(
              "language",
              "en"
            )
            .maybeSingle();

        data =
          fallback.data;
      }

      return data;
    };

  //
  // 🌸 1. ONBOARDING
  //

  if (
    profile?.created_at
  ) {

    const start =
      new Date(
        profile.created_at
      );

    const diffDays =
      Math.floor(

        (
          Date.now() -
          start.getTime()
        ) /

        (
          1000 *
          60 *
          60 *
          24
        )

      ) + 1;

    if (
      diffDays <= 30
    ) {

      const onboarding =
        await fetchPrompt(

          supabase

            .from(
              "daily_prompts"
            )

            .select("*")

            .eq(
              "type",
              "onboarding"
            )

            .eq(
              "day_number",
              diffDays
            )
        );

      if (onboarding) {

        return onboarding.prompt;
      }
    }
  }

  //
  // 🌕 2. SEASONAL
  //

  const seasonal =
    await fetchPrompt(

      supabase

        .from(
          "daily_prompts"
        )

        .select("*")

        .eq(
          "type",
          "seasonal"
        )

        .eq(
          "active",
          true
        )

        .lte(
          "start_date",
          today
        )

        .gte(
          "end_date",
          today
        )

        .order(
          "priority",
          {
            ascending: false,
          }
        )

        .limit(1)
    );

  if (seasonal) {

    return seasonal.prompt;
  }

  //
  // 🌿 3. DEFAULT
  //

  const fallback =
    await fetchPrompt(

      supabase

        .from(
          "daily_prompts"
        )

        .select("*")

        .eq(
          "type",
          "default"
        )

        .limit(1)
    );

  return (
    fallback?.prompt ||

    "Love remembering itself 🩷"
  );
}