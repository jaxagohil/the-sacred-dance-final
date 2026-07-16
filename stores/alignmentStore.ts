// /stores/alignmentStore.ts

import { create } from "zustand";

/*
 * --------------------------------------------------------
 * 🌿 ALIGNMENT STORE
 * --------------------------------------------------------
 *
 * Shared Alignment OS knowledge.
 *
 * Stores the Alignment OS modules that
 * power every Sacred Dance experience.
 *
 * Examples:
 *
 * - alignment_core
 * - alignment_foundation
 * - people_evidence
 * - places_evidence
 * - things_evidence
 * - heart_guide
 * - structure_guide
 * - cosmic_guide
 *
 * --------------------------------------------------------
 */

export interface AlignmentModule {

  id: string;

  key: string;

  type: string;

  title: string;

  description: string | null;

  content: string;

  workflows: string[];

  sort_order: number;

  active: boolean;

  notes: string | null;
}

interface AlignmentStore {

  /*
   * --------------------------------------------------------
   * 🌿 MODULES
   * --------------------------------------------------------
   */

  modules:
    Record<string, AlignmentModule>;

  loaded: boolean;

  version: number;

  /*
   * --------------------------------------------------------
   * 🌿 SETTERS
   * --------------------------------------------------------
   */

  setModules:
    (modules: AlignmentModule[]) => void;

  getModule:
    (key: string) => AlignmentModule | null;

  markLoaded:
    () => void;

  reset:
    () => void;
}

/*
 * --------------------------------------------------------
 * 🌿 STORE
 * --------------------------------------------------------
 */

export const useAlignmentStore =

create<AlignmentStore>((set, get) => ({

  modules: {},

  loaded: false,

  version: 1,

  /*
   * --------------------------------------------------------
   * 🌿 SET MODULES
   * --------------------------------------------------------
   */

  setModules:

    (modules) => {

      const map:

      Record<string, AlignmentModule> = {};

      modules.forEach((module) => {

        map[module.key] = module;

      });

      set({

        modules: map,

        loaded: true,

        version:
          get().version + 1,

      });

    },

  /*
   * --------------------------------------------------------
   * 🌿 GET MODULE
   * --------------------------------------------------------
   */

  getModule:

    (key) =>

      get().modules[key] || null,

  /*
   * --------------------------------------------------------
   * 🌿 READY
   * --------------------------------------------------------
   */

  markLoaded:

    () =>

      set({

        loaded: true,

      }),

  /*
   * --------------------------------------------------------
   * 🌿 RESET
   * --------------------------------------------------------
   */

  reset:

    () =>

      set({

        modules: {},

        loaded: false,

        version: 1,

      }),

}));