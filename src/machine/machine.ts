import {assign, createMachine, State} from "xstate";
import {getInitialContext, MachineContext} from "./context";
import {MachineEvent, SetMotionWorkerEvent} from "./events";
import {initMotionWorker} from "./services";
import {setPendulumCoords} from "./actions";
import {INITIAL_PEND_COORDS} from "../lib/AppState";

export const pendulumMachine = createMachine({
  initial: 'idle',
  context: getInitialContext(),
  states: {
    idle: {
      on: {
        START_MOTION: 'initialization',
        RESET_PENDULUM: {
          actions: assign<MachineContext>({
            pendCoords: INITIAL_PEND_COORDS,
            currentDt: 0,
          }),
        },
      },
    },
    initialization: {
      invoke: {
        src: initMotionWorker,
      },
      on: {
        SET_MOTION_WORKER: {
          actions: assign<MachineContext, SetMotionWorkerEvent>({
            motionWorker: (_, event) => event.motionWorker,
            motionBuffer: (_, event) => event.motionBuffer,
          })
        },
        WORKER_INITIALIZED: 'inMotion',
      }
    },
    inMotion: {
      on: {
        PAUSE_MOTION: 'idle'
      }
    }
  },
  on: {
    UPDATE_PEND_COORDS: { actions: setPendulumCoords }
  },
  schema: {
    context: {} as MachineContext,
    events: {} as MachineEvent,
  }
});

export type MachineState = State<MachineContext>
