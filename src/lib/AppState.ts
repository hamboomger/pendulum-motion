import _ from 'lodash';
import {Store} from "pullstate";
import {config} from "./config";
import {PhaseSpaceParams, Vector} from "./pendulumFunctions";
import {precision} from "./util";
import {PendulumMotionBuffer} from "./PendulumMotionBuffer";
import {PendulumMotionWorker} from "../workers/pendulumMotionWorkerConnector";

export const INITIAL_PEND_COORDS: [number, number] = [window.innerWidth/4, window.innerHeight/2];
export const PIVOT_COORDS: [number, number] = [window.innerWidth/4, 0];
export const PENDULUM_RADIUS = 25;
const COLORS_POOL = [
  '#e90000',
  '#0c60fa',
  '#20d400',
  '#ffc600',
  '#0bddab',
  '#964eff'
]

export type AnimationState = 'rest' | 'inMotion' | 'paused'

export interface IPendulumStore {
  pendCoords: Vector
  prevAnimationState: AnimationState,
  animationState: AnimationState,
  resetAnimation: boolean,
  motionWorker?: PendulumMotionWorker,
  motionBuffer?: PendulumMotionBuffer,
  currentDt: number,
  plotColor: string,
}

export const PendulumStore = new Store<IPendulumStore>({
  prevAnimationState: 'rest',
  animationState: 'rest',
  pendCoords: INITIAL_PEND_COORDS,
  resetAnimation: false,
  currentDt: -1,
  plotColor: "#20d400"
});

export const PendulumStoreFunctions = {
  changeAnimationState: (newAnimationState: AnimationState) => {
    PendulumStore.update(state => {
      state.prevAnimationState = state.animationState
      state.animationState = newAnimationState
      if (newAnimationState === 'rest' || newAnimationState === 'paused') {
        // pick random new color after animation reset
        state.plotColor = _(COLORS_POOL)
            .pull(state.plotColor)
            .sample()!
      }
    })
  },
  setPendulumCoords: (newPendulumCoords: Vector) => {
    PendulumStore.update(state => {
      state.pendCoords = newPendulumCoords
    })
  },
  updateCurrentDt: (newDt: number) => {
    PendulumStore.update(state => {
      state.currentDt = newDt
    })
  }
}

export const AppParametersStore = new Store<PhaseSpaceParams>({
  g: config.g,
  friction: config.friction,
  dt: config.dt,
  precision: precision(config.dt),
});
