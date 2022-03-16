import {PendulumMotionBuffer} from "../lib/PendulumMotionBuffer";
import {PendulumMotionWorker} from "../workers/pendulumMotionWorkerConnector";
import {PhaseSpaceParams, Vector} from "../lib/pendulumFunctions";
import {INITIAL_PEND_COORDS} from "../lib/AppState";
import {config} from "../lib/config";
import {precision} from "../lib/util";

export interface MachineContext {
  params: PhaseSpaceParams
  pendCoords: Vector
  currentDt: number,
  plotColor: string,
  motionBuffer?: PendulumMotionBuffer
  motionWorker?: PendulumMotionWorker
}

export const getInitialContext = (): MachineContext => ({
  params: {
    g: config.g,
    friction: config.friction,
    dt: config.dt,
    precision: precision(config.dt),
  },
  pendCoords: INITIAL_PEND_COORDS,
  currentDt: -1,
  plotColor: "#20d400"
})
