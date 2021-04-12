import {Store} from "pullstate";
import {config} from "./config";
import {PhaseSpaceParams} from "./pendulumFunctions";
import {precision} from "./util";
import {PhaseSpaceDataObservable} from "./PhaseSpaceDataObservable";

export const INITIAL_PEND_COORDS: [number, number] = [window.innerWidth/4, window.innerHeight/3];

export type AnimationState = 'rest' | 'inMotion' | 'paused'

export interface IPendulumStore {
  pivotCoords: [x: number, y: number]
  pendCoords: [x: number, y: number]
  animationState: AnimationState,
  motionObservable?: PhaseSpaceDataObservable,
  subscribers: number,
  resetAnimation: boolean,
}

export const PendulumStore = new Store<IPendulumStore>({
  animationState: 'rest',
  pivotCoords: [window.innerWidth/4, 0],
  pendCoords: INITIAL_PEND_COORDS,
  subscribers: 0,
  resetAnimation: false
});

export const AppParametersStore = new Store<PhaseSpaceParams>({
  g: config.g,
  friction: config.friction,
  dt: config.dt,
  iterations: config.iterations,
  precision: precision(config.dt),
});
