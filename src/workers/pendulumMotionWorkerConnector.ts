import {PhaseSpaceData, PhaseSpaceParams} from "../lib/pendulumFunctions";

export interface StartMotionWorkerMessage {
  theta: number,
  L: number,
  params: PhaseSpaceParams
}

export class PendulumMotionWorker {
  constructor(
    private readonly worker: Worker
  ) {}

  sendStartMessage(message: StartMotionWorkerMessage) {
    this.worker.postMessage({
      type: 'start',
      theta: message.theta,
      L: message.L,
      params: message.params,
    })
  }

  onMessage(callback: (data: PhaseSpaceData) => void) {
    this.worker.onmessage = (event) => {
      callback(event.data);
    }
  }
}

export const startPendMotionWorker = (
  message: StartMotionWorkerMessage,
): PendulumMotionWorker => {
  const worker = new PendulumMotionWorker(
    new Worker('workers/pendulumMotionWorker.js')
  )
  worker.sendStartMessage(message)
  return worker
}