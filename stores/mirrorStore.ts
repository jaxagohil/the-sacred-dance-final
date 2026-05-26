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
   * 🌊 CORE FIELD
   * --------------------------------------------------------
   */

  userContext: any;

  mirrorContext: any;

  cosmic: any;

  dailyField: any;

  language: string | null;

  languageContext: any;

  activeLens: string | null;

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

          ready: false,
        }),
    })
  );