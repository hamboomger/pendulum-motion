import {ActionFunction, assign} from "xstate";
import {MachineContext} from "./context";
import {MachineEvent, SetPendulumCoordsEvent} from "./events";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Action<T extends MachineEvent = MachineEvent> = ActionFunction<MachineContext, T>

export const setPendulumCoords = assign<MachineContext, SetPendulumCoordsEvent>({
  pendCoords: (_, event) => event.coords,
})
