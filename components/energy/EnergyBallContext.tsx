import { createContext, useContext } from "react";

export const EnergyBallContext = createContext<any>(null);

export function useEnergyBallProps() {
  return useContext(EnergyBallContext);
}