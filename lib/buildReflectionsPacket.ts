// /lib/buildReflectionPacket.ts

import {
    ingestImage,
} from "./ai/ingestImage";

import {
    ingestVoice,
} from "./ai/ingestvoice";

type BuildPacketArgs = {

  text?: string;

  emotions?: string[];

  imageBase64?: string | null;

  audioUri?: string | null;
};

export async function buildReflectionPacket({

  text = "",

  emotions = [],

  imageBase64,

  audioUri,

}: BuildPacketArgs) {

  /*
   * --------------------------------------------------
   * 🌊 BASE PACKET
   * --------------------------------------------------
   */

  const packet = {

    text,

    emotions:
      [...emotions],

    observableScenes:
      [] as string[],

    bodyResponses:
      [] as string[],

    copingStrategies:
      [] as string[],

    manifestations:
      [] as string[],

    nervousSystem:
      null as string | null,
  };

  /*
   * --------------------------------------------------
   * 📷 IMAGE
   * --------------------------------------------------
   */

  if (imageBase64) {

    const imageData =

      await ingestImage(

        `data:image/jpeg;base64,${imageBase64}`
      );

    packet.text +=

      ` ${imageData.reflection}`;

    packet.emotions.push(
      ...(imageData
        .emotions || [])
    );

    packet.observableScenes.push(
      ...(imageData
        .observableScenes || [])
    );

    packet.bodyResponses.push(
      ...(imageData
        .bodyResponses || [])
    );

    packet.copingStrategies.push(
      ...(imageData
        .copingStrategies || [])
    );

    packet.manifestations.push(
      ...(imageData
        .manifestations || [])
    );

    if (
      imageData.nervousSystem
    ) {

      packet.nervousSystem =

        imageData.nervousSystem;
    }
  }

  /*
   * --------------------------------------------------
   * 🎤 VOICE
   * --------------------------------------------------
   */

  if (audioUri) {

    const voiceData =

      await ingestVoice(
        audioUri
      );

    packet.text +=

      ` ${voiceData.reflection}`;

    packet.emotions.push(
      ...(voiceData
        .emotions || [])
    );

    packet.observableScenes.push(
      ...(voiceData
        .observableScenes || [])
    );

    packet.bodyResponses.push(
      ...(voiceData
        .bodyResponses || [])
    );

    packet.copingStrategies.push(
      ...(voiceData
        .copingStrategies || [])
    );

    packet.manifestations.push(
      ...(voiceData
        .manifestations || [])
    );

    if (
      voiceData.nervousSystem
    ) {

      packet.nervousSystem =

        voiceData.nervousSystem;
    }
  }

  /*
   * --------------------------------------------------
   * 🧠 CLEAN DUPLICATES
   * --------------------------------------------------
   */

  packet.emotions =

    [...new Set(
      packet.emotions
    )];

  packet.observableScenes =

    [...new Set(
      packet
        .observableScenes
    )];

  packet.bodyResponses =

    [...new Set(
      packet
        .bodyResponses
    )];

  packet.copingStrategies =

    [...new Set(
      packet
        .copingStrategies
    )];

  packet.manifestations =

    [...new Set(
      packet
        .manifestations
    )];

  /*
   * --------------------------------------------------
   * 🌌 RETURN
   * --------------------------------------------------
   */

  return packet;
}