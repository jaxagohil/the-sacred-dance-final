export type GlimmerPortal = "can" | "cant" | "wont";

export interface Glimmer {
  id: string;

  portal: GlimmerPortal;

  // The pattern illuminated by this possibility
  pattern: string;

  // The possibility offered to the user
  title: string;
  possibility: string;

  // Why this Glimmer is relevant
  grounding: string;

  // Supporting context, not a diagnosis or fixed truth
  evidence: string[];

  // User interaction
  selected: boolean;
}

export interface GlimmerCollection {
  generatedAt: string;
  contextVersion: number;
  glimmers: Glimmer[];
}

export interface GlimmerSelection {
  glimmerId: string;
  portal: GlimmerPortal;
  selectedAt: string;
}

export interface GlimmerEngineInput {
  userContext: unknown;
  creationContext: unknown;
  contextVersion: number;
}

export interface GlimmerEngineOutput {
  collection: GlimmerCollection;
  selectedGlimmers: Glimmer[];
}