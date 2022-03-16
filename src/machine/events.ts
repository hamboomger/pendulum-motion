import {PendulumMotionWorker} from "../workers/pendulumMotionWorkerConnector";
import {PendulumMotionBuffer} from "../lib/PendulumMotionBuffer";
import {Vector} from "../lib/pendulumFunctions";

export type MachineEvent =
  | SetMotionWorkerEvent
  | SetPendulumCoordsEvent
  | { type: 'WORKER_INITIALIZED' }
  | { type: 'START_MOTION' }
  | { type: 'PAUSE_MOTION' }
  | { type: 'RESET_PENDULUM' };

export type SetMotionWorkerEvent = {
  type: 'SET_MOTION_WORKER'
  motionWorker: PendulumMotionWorker
  motionBuffer: PendulumMotionBuffer
}

export type SetPendulumCoordsEvent = {
  type: 'UPDATE_PEND_COORDS'
  coords: Vector
}
