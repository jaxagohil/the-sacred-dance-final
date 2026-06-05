// /stores/mirrorStore.ts

import { create } from "zustand";

/*
 * --------------------------------------------------------
 * 🌌 MIRROR STORE
 * --------------------------------------------------------
 *
 * Shared living consciousness field
 * across:
 *
 * - Mirror
 * - Guidance
 * - Energy
 * - Lenses
 * - Sacred Dance
 *
 * --------------------------------------------------------
 */

interface MirrorStore {

  /*
 * --------------------------------------------------------
 * 🌍 FOUNDATIONAL FIELD
 * --------------------------------------------------------
 */

dailyField: any;

cosmic: any;

language: string | null;

languageContext: any;

/*
 * --------------------------------------------------------
 * 🌊 LIVING FIELD
 * --------------------------------------------------------
 */

  userContext: any;

  mirrorContext: any;

  activeLens: string | null;

  contextVersion: number;

lastSignalTimestamp:
  number | null;

  preloadedWhispers:
  any[];

  /*
   * --------------------------------------------------------
   * 🌌 FIELD STATUS
   * --------------------------------------------------------
   */

  ready: boolean;

  /*
   * --------------------------------------------------------
   * 🌿 SETTERS
   * --------------------------------------------------------
   */

  setUserContext:
    (context: any) => void;

  setMirrorContext:
    (context: any) => void;

  setCosmic:
    (cosmic: any) => void;

  setDailyField:
    (field: any) => void;

  setLanguage:
    (language: string) => void;

  setLanguageContext:
    (context: any) => void;

  setActiveLens:
    (lens: string) => void;

  setContextVersion:
  (version: number) => void;

setLastSignalTimestamp:
  (timestamp: number) => void;

  setPreloadedWhispers:
  (whispers: any[]) => void;

markFieldUpdated:
  () => void;  

  setReady:
    (ready: boolean) => void;
    

  /*
   * --------------------------------------------------------
   * 🌊 RESET
   * --------------------------------------------------------
   */

  resetField:
    () => void;
}

/*
 * --------------------------------------------------------
 * 🌌 STORE
 * --------------------------------------------------------
 */

export const useMirrorStore =

  create<MirrorStore>(

    (set) => ({

      /*
       * --------------------------------------------------------
       * 🌊 INITIAL STATE
       * --------------------------------------------------------
       */

      userContext: null,

      mirrorContext: null,

      cosmic: null,

      dailyField: null,

      language: null,

      languageContext: null,

      activeLens: null,

      contextVersion: 1,

lastSignalTimestamp:
  null,

  preloadedWhispers:
  [],

      ready: false,

      /*
       * --------------------------------------------------------
       * 🌿 SETTERS
       * --------------------------------------------------------
       */

      setUserContext:

        (context) =>

          set({

            userContext:
              context,
          }),

      setMirrorContext:

        (context) =>

          set({

            mirrorContext:
              context,
          }),

      setCosmic:

        (cosmic) =>

          set({
            cosmic,
          }),

      setDailyField:

        (field) =>

          set({

            dailyField:
              field,
          }),

      setLanguage:

        (language) =>

          set({
            language,
          }),

      setLanguageContext:

        (context) =>

          set({

            languageContext:
              context,
          }),

      setActiveLens:

        (lens) =>

          set({

            activeLens:
              lens,
          }),

          setContextVersion:

  (version) =>

    set({

      contextVersion:
        version,
    }),

setLastSignalTimestamp:

  (timestamp) =>

    set({

      lastSignalTimestamp:
        timestamp,
    }),

setPreloadedWhispers:

  (whispers) =>

    set({

      preloadedWhispers:
        whispers,
    }),

markFieldUpdated:

  () =>

    set((state) => ({

      contextVersion:

        state.contextVersion + 1,

      lastSignalTimestamp:
        Date.now(),
    })),

      setReady:

        (ready) =>

          set({
            ready,
          }),

      /*
       * --------------------------------------------------------
       * 🌊 RESET FIELD
       * --------------------------------------------------------
       */

      resetField: () =>

        set({

          userContext: null,

          mirrorContext: null,

          cosmic: null,

          dailyField: null,

          language: null,

          languageContext: null,

          activeLens: null,

          contextVersion: 1,

lastSignalTimestamp:
  null,

  preloadedWhispers:
  [],

          ready: false,
        }),
    })
  );