import React from "react";
import { useEnergyBallProps } from "./EnergyBallContext";
import EnergyBallSkia from "./energyBallSkia";

export default function EnergyBallSkiaWeb() {
  const props = useEnergyBallProps();

  return <EnergyBallSkia {...props} />;
}