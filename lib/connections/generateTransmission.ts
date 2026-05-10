// /lib/connections/generateTransmission.ts

type Params = {
  context: any;
};

export function
generateTransmission({
  context,
}: Params) {

  const {
    spaceType,

    emotionalTone,

    stillness,

    fieldState,

    resonanceLevel,

    activeHumans,

    dominantEmotion,

    recentConnectionEnergy,

  } = context || {};

  //
  // 🌙 STILLNESS
  //

  if (stillness) {

    return {

      transmission:
        "Quietness is moving gently through your field today.",

      whisper:
        "Stillness is also a form of presence.",
    };
  }

  //
  // 🌌 SELF SPACE
  //

  if (
    spaceType === "self"
  ) {

    if (
      emotionalTone === "tender"
    ) {

      return {

        transmission:
          "Your nervous system seems to be asking for gentleness.",

        whisper:
          "Healing often begins softly.",
      };
    }

    if (
      emotionalTone === "warm"
    ) {

      return {

        transmission:
          "Your field feels more open to connection today.",

        whisper:
          "Love changes the atmosphere around us.",
      };
    }

    return {

      transmission:
        "You are softly available to resonance today.",

      whisper:
        "Presence reshapes the field quietly.",
    };
  }

  //
  // 🌍 HUMAN SPACE
  //

  if (
    spaceType === "human"
  ) {

    if (
      recentConnectionEnergy ===
      "resonant"
    ) {

      return {

        transmission:
          "This connection carries emotional movement.",

        whisper:
          "Some people arrive to help us remember ourselves.",
      };
    }

    if (
      emotionalTone === "quiet"
    ) {

      return {

        transmission:
          "Not all connection needs words to deepen.",

        whisper:
          "Silence can also be relational.",
      };
    }

    return {

      transmission:
        "The field is holding this connection softly.",

      whisper:
        "Resonance forms slowly between human hearts.",
    };
  }

  //
  // 🌌 CIRCLE SPACE
  //

  if (
    spaceType === "circle"
  ) {

    if (
      fieldState === "alive"
    ) {

      return {

        transmission:
          "Many emotional currents are moving through this field today.",

        whisper:
          `${activeHumans} souls are presently resonating here.`,
      };
    }

    if (
      dominantEmotion ===
      "hopeful"
    ) {

      return {

        transmission:
          "Hope is quietly circulating through this space.",

        whisper:
          "Humanity heals in small moments too.",
      };
    }

    if (
      fieldState === "still"
    ) {

      return {

        transmission:
          "This field is resting in quiet spaciousness today.",

        whisper:
          "Not all sacred spaces need activity.",
      };
    }

    return {

      transmission:
        "Resonance is gently moving through this collective field.",

      whisper:
        "Every reflection subtly changes the atmosphere.",
    };
  }

  //
  // ✨ DEFAULT
  //

  return {

    transmission:
      "The field is listening softly.",

    whisper:
      "Presence is already enough.",
  };
}