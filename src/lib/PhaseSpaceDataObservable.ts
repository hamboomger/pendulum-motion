import {pendulum, PhaseSpace, PhaseSpaceParams} from "./pendulumFunctions";

export interface PSDSubscriber {
  notify(patchNumber: number, phaseSpace: PhaseSpace): void
}

export class PhaseSpaceDataObservable {
  private lastTheta: number
  private lastDotTheta: number
  private lastT?: number
  private readonly stringLen: number
  private intervalRef?: NodeJS.Timeout

  subscribers: PSDSubscriber[];

  constructor(theta: number, stringLen: number) {
    this.lastTheta = theta;
    this.stringLen = stringLen;

    this.lastDotTheta = 0;
    this.subscribers = [];
  }

  subscribe(subscriber: PSDSubscriber) {
    this.subscribers.push(subscriber);
  }

  private updateThetaParams(lastData: PhaseSpace) {
    const [t, [theta, dotTheta]] = lastData[lastData.length-1];
    this.lastT = t;
    this.lastTheta = theta;
    this.lastDotTheta = dotTheta;
  }

  startCalculations(params: PhaseSpaceParams, intervalMs: number) {
    let patchNumber = 1;
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
    this.intervalRef = setInterval(() => {
      this.updatePhaseSpaceData(params, patchNumber++);
    }, intervalMs);
    this.updatePhaseSpaceData(params, patchNumber++);
  }

  private updatePhaseSpaceData(params: PhaseSpaceParams, patchNumber: number) {
    const phaseSpaceData = pendulum.phaseSpace(
      this.lastTheta, this.stringLen, params, this.lastDotTheta, this.lastT ?? 0
    );
    this.subscribers.forEach(sub => sub.notify(patchNumber++, phaseSpaceData));

    this.updateThetaParams(phaseSpaceData);
  }

  stopCalculations() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

}
