import _ from 'lodash'
import {PhaseSpaceData, PhaseSpaceParams} from "./pendulumFunctions";

export type PendulumPosition = [theta: number, dotTheta: number]
export type PendulumPositionWithDt = [theta: number, dotTheta: number, dt: number]
export type PendulumMotionData = {[dt: string]: PendulumPosition}
type Buffer = PendulumMotionData

export class PendulumMotionBuffer {
    private buffer: Buffer = {}
    private bufferSize: number
    private config: PhaseSpaceParams

    constructor(config: PhaseSpaceParams) {
        console.log('New motion buffer created')
        this.config = config
        this.bufferSize = config.iterations * 2;
    }

    getLastPositionWithDt(): PendulumPositionWithDt | null {
        if (_.isEmpty(this.buffer)) {
            return null
        }

        const sortedKeys = Object.keys(this.buffer)
            .sort((a, b) => parseFloat(a) - parseFloat(b));
        const lastKey = sortedKeys[Object.keys(this.buffer).length - 1]
        return [...this.buffer[lastKey], Number(lastKey)]
    }

    getPosition(dt: number): PendulumPosition | null {
        return this.buffer[dt]
    }

    getPositionsWithDt(fromDt: number, iterations: number): PendulumPositionWithDt[] {
        const sortedKeys = Object.keys(this.buffer)
            .map(n => parseFloat(n))
            .sort((a, b) => a - b)
        console.log(`sorted keys: ${sortedKeys}`)
        const startFrom = sortedKeys.findIndex(n => n === fromDt)
        const targetKeys = sortedKeys.slice(startFrom, startFrom + iterations)
        return targetKeys.map(key => {
            const [theta, dotTheta] = this.buffer[key]
            return [theta, dotTheta, key]
        })
    }

    private deleteOldestData(nOfElementsToDelete: number) {
        const keysToDelete = Object.keys(this.buffer)
            .sort((a, b) => parseFloat(a) - parseFloat(b))
            .slice(0, nOfElementsToDelete);
        keysToDelete.forEach(key => {
            delete this.buffer[key];
        });
    }

    addData(bufferElements: PendulumMotionData) {
        Object.assign(this.buffer, bufferElements)

        const bufferOverflow = Object.keys(this.buffer).length - this.bufferSize
        if (bufferOverflow > 0) {
            this.deleteOldestData(bufferOverflow)
        }

        console.log(`buffer data added`)
    }

    addPhaseSpaceData(data: PhaseSpaceData) {
        const convertedData: PendulumMotionData = _(data)
            .keyBy(d => d[0])
            .mapValues(d => d[1])
            .value()

        this.addData(convertedData)
    }
}
