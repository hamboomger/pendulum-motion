import _ from 'lodash';
import {PIVOT_COORDS} from "./AppState";
type AngleUnits = 'rad' | 'deg';

export type Vector = [x: number, y: number]
export type PhaseSpaceData = Array<[t: number, coord: Vector, vector: Vector]>

export interface PhaseSpaceParams {
  dt: number,
  friction: number,
  g: number,
  precision: number
}

export const pendulum = {
  theta(pendulum: [number, number], units: AngleUnits): number {
    const adjSide = pendulum[1] - PIVOT_COORDS[1];
    const oppSide = pendulum[0] - PIVOT_COORDS[0];

    const angleRad = Math.atan(oppSide / adjSide) ;
    return units === 'rad' ? angleRad : angleRad * 180 / Math.PI
  },

  getStringLength(pendulum: [number, number]): number {
    const adjSide = Math.abs(PIVOT_COORDS[1] - pendulum[1]);
    const oppSide = Math.abs(PIVOT_COORDS[0] - pendulum[0]);
    return Math.sqrt(Math.pow(adjSide, 2) + Math.pow(oppSide, 2));
  },

  thetaFunction(maxAngleRad: number, sLength: number): (t: number) => number {
    const g = 9.807;
    const T = 2 * Math.PI * Math.sqrt(sLength / g);
    return (t) => (maxAngleRad * Math.cos(2*Math.PI/T*t)) * 180 / Math.PI;
  },

  thetaToCoords(angleRad: number, sLength: number): [number, number] {
    const angleDeg = angleRad * 180 / Math.PI
    const adjSide = sLength * Math.cos(angleDeg * Math.PI / 180);
    const oppSide = sLength * Math.sin(angleDeg * Math.PI / 180);

    return [PIVOT_COORDS[0]+oppSide, PIVOT_COORDS[1]+adjSide];
  },

  phaseSpace(theta: number, L: number, params: PhaseSpaceParams, dotTheta = 0, t0 = 0): PhaseSpaceData {
    const result: PhaseSpaceData = [];
    const { friction, g, dt } = params;
    let currIter = 0;
    let t = t0;
    while (currIter++ < 1000) {
      const coord: Vector = [theta, dotTheta];
      const doubleDotTheta = -friction*dotTheta - g / L * Math.sin(theta);
      const vector: Vector = [dotTheta, doubleDotTheta];
      result.push([_.round(t, params.precision), coord, vector]);

      theta += dotTheta*dt;
      dotTheta += doubleDotTheta*dt;
      t += dt;
    }

    return result;
  }
}
