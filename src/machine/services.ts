import {MachineContext} from "./context";
import {pendulum} from "../lib/pendulumFunctions";
import {startPendMotionWorker} from "../workers/pendulumMotionWorkerConnector";
import {PendulumMotionBuffer} from "../lib/PendulumMotionBuffer";
import {InvokeCreator} from "xstate";
import {MachineEvent} from "./events";

type Service = InvokeCreator<MachineContext, MachineEvent>

export const initMotionWorker: Service =
  (context) =>
    (send) => {
      const {
          pendCoords, params
      } = context;
      const L = pendulum.getStringLength(pendCoords)
      const theta = pendulum.theta(pendCoords, 'rad')
      const motionWorker = startPendMotionWorker({
          L, theta, params
      })
      const motionBuffer = new PendulumMotionBuffer(params, motionWorker)
      send({
        type: 'SET_MOTION_WORKER',
        motionWorker,
        motionBuffer
      })
      motionWorker.onFirstMessage(() => {
        // this event causes animation to start, so it's better to wait until
        // the web worker returns initial phase space data first
        console.log('on first message')
        send({
          type: 'WORKER_INITIALIZED',
        })
      })
  }
