import {Store} from "pullstate";
import {config} from "./config";
import {PhaseSpaceParams, Vector} from "./pendulumFunctions";
import {precision} from "./util";
import {PendulumMotionBuffer} from "./PendulumMotionBuffer";

export const INITIAL_PEND_COORDS: [number, number] = [window.innerWidth/4, window.innerHeight/2];
export const PIVOT_COORDS: [number, number] = [window.innerWidth/4, 0];
export const PENDULUM_RADIUS = 25;

export type AnimationState = 'rest' | 'inMotion' | 'paused'

export interface IPendulumStore {
  pendCoords: Vector
  prevAnimationState: AnimationState,
  animationState: AnimationState,
  resetAnimation: boolean,
  motionBuffer?: PendulumMotionBuffer,
}

export const PendulumStore = new Store<IPendulumStore>({
  prevAnimationState: 'rest',
  animationState: 'rest',
  pendCoords: INITIAL_PEND_COORDS,
  resetAnimation: false,
});

export const PendulumStoreFunctions = {
  changeAnimationState: (newAnimationState: AnimationState) => {
    PendulumStore.update(state => {
      state.prevAnimationState = state.animationState
      state.animationState = newAnimationState
    })
  },
  setPendulumCoords: (newPendulumCoords: Vector) => {
    PendulumStore.update(state => {
      state.pendCoords = newPendulumCoords
    })
  }
}

export const AppParametersStore = new Store<PhaseSpaceParams>({
  g: config.g,
  friction: config.friction,
  dt: config.dt,
  iterations: config.iterations,
  precision: precision(config.dt),
});
