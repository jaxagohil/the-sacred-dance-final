// /lib/cosmic/getCosmicData.ts

export function getCosmicData() {

  const now = new Date();

  const month =
    now.getUTCMonth() + 1;

  const day =
    now.getUTCDate();

  const sun =
    getSunSign(
      month,
      day
    );

  const phase =
    getMoonPhase(now);

  const moon =
    getMoonSignApprox(now);

  return {

    sun,

    moon,

    phase,

    sunEnergy:
      getSunEnergy(sun),
  };
}

//
// 🌞 SUN SIGN
//

function getSunSign(
  month: number,
  day: number
): string {

  if (
    (month === 3 && day >= 21) ||
    (month === 4 && day <= 19)
  ) return "Aries";

  if (
    (month === 4 && day >= 20) ||
    (month === 5 && day <= 20)
  ) return "Taurus";

  if (
    (month === 5 && day >= 21) ||
    (month === 6 && day <= 20)
  ) return "Gemini";

  if (
    (month === 6 && day >= 21) ||
    (month === 7 && day <= 22)
  ) return "Cancer";

  if (
    (month === 7 && day >= 23) ||
    (month === 8 && day <= 22)
  ) return "Leo";

  if (
    (month === 8 && day >= 23) ||
    (month === 9 && day <= 22)
  ) return "Virgo";

  if (
    (month === 9 && day >= 23) ||
    (month === 10 && day <= 22)
  ) return "Libra";

  if (
    (month === 10 && day >= 23) ||
    (month === 11 && day <= 21)
  ) return "Scorpio";

  if (
    (month === 11 && day >= 22) ||
    (month === 12 && day <= 21)
  ) return "Sagittarius";

  if (
    (month === 12 && day >= 22) ||
    (month === 1 && day <= 19)
  ) return "Capricorn";

  if (
    (month === 1 && day >= 20) ||
    (month === 2 && day <= 18)
  ) return "Aquarius";

  return "Pisces";
}

//
// 🌙 MOON PHASE
//

function getMoonPhase(
  date: Date
): string {

  const synodicMonth =
    29.53058867;

  const knownNewMoon =
    new Date(
      "2024-01-11T11:57:00Z"
    );

  const daysSince =
    (
      date.getTime() -
      knownNewMoon.getTime()
    ) /

    (
      1000 *
      60 *
      60 *
      24
    );

  const phase =
    daysSince %
    synodicMonth;

  if (
    phase < 1.84566 ||
    phase > 27.68493
  ) {
    return "New";
  }

  if (
    phase < 12.91963
  ) {
    return "Waxing";
  }

  if (
    phase < 16.61096
  ) {
    return "Full";
  }

  return "Waning";
}

//
// 🌙 MOON SIGN
//

function getMoonSignApprox(
  date: Date
): string {

  const signs = [

    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",

    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const baseDate =
    new Date(
      "2024-01-01T00:00:00Z"
    );

  const days =
    Math.floor(

      (
        date.getTime() -
        baseDate.getTime()
      ) /

      (
        1000 *
        60 *
        60 *
        24
      )
    );

  const index =
    Math.floor(
      days / 2.3
    ) % 12;

  return signs[
    (index + 12) % 12
  ];
}

//
// ⚡ SUN ENERGY
//

function getSunEnergy(
  sign: string
): string {

  const map:
    Record<string, string> = {

    Aries:
      "Initiate",

    Taurus:
      "Ground",

    Gemini:
      "Express",

    Cancer:
      "Feel",

    Leo:
      "Shine",

    Virgo:
      "Refine",

    Libra:
      "Balance",

    Scorpio:
      "Transform",

    Sagittarius:
      "Expand",

    Capricorn:
      "Build",

    Aquarius:
      "Innovate",

    Pisces:
      "Surrender",
  };

  return (
    map[sign] ||
    "Flow"
  );
}