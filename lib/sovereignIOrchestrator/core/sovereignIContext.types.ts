
/**
 * Sovereign I — Context Types
 *
 * Defines the context domains available to Sovereign I
 * and the metadata required to preserve their provenance.
 */

import type {
    SovereignIContextDomain,
} from "../events/sovereignIEvent.types";

export type SovereignIContextPersistence =
  | "persistent"
  | "transient"
  | "system-generated";

export type SovereignIEvidenceType =
  | "observed"
  | "user-expressed"
  | "calculated"
  | "interpreted";

export type SovereignIRealityState =
  | "established"
  | "emerging";

/**
 * Common metadata attached to context information.
 */
export interface SovereignIContextMetadata {
  source: string;
  updatedAt: string;
  persistence: SovereignIContextPersistence;
  evidenceType: SovereignIEvidenceType;
  confidence?: number;
}

/**
 * Established and emerging Living Field information
 * remain distinguishable.
 */
export interface SovereignILivingFieldContext {
  established: {
    realityLayers?: unknown;
    energyField?: unknown;
    chakras?: unknown;
    patterns?: unknown;
    manifestations?: unknown;
  };

  emerging: {
    realityLayers?: unknown;
    energyField?: unknown;
    chakras?: unknown;
    observations?: unknown;
  };
}

/**
 * A context domain and its associated information.
 */
export interface SovereignIContextSection<T = unknown> {
  domain: SovereignIContextDomain;
  data: T;
  metadata: SovereignIContextMetadata;
}

/**
 * Context assembled for a Sovereign I decision.
 */
export interface SovereignIContextPackage {
  assembledAt: string;

  eventId?: string;

  userContext?: SovereignIContextSection;
  livingField?: SovereignIContextSection<SovereignILivingFieldContext>;
  liveUIContext?: SovereignIContextSection;
  creationContext?: SovereignIContextSection;
  cosmicContext?: SovereignIContextSection;
  capabilityContext?: SovereignIContextSection;
}
