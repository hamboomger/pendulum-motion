import _ from 'lodash'
import {PhaseSpaceData} from "./pendulumFunctions";

export type PendulumPosition = [theta: number, dotTheta: number]
export type PendulumMotionData = {[dt: string]: PendulumPosition}
type Buffer = PendulumMotionData

export class PendulumMotionBuffer {
    private buffer: Buffer = {}
    private bufferSize: number

    constructor(bufferSize: number) {
        console.log('New motion buffer created')
        this.bufferSize = bufferSize;
    }

    getLastPositionWithDt(): [position: PendulumPosition, dt: number] | null {
        if (_.isEmpty(this.buffer)) {
            return null
        }

        const sortedKeys = Object.keys(this.buffer)
            .sort((a, b) => parseFloat(a) - parseFloat(b));
        const lastKey = sortedKeys[Object.keys(this.buffer).length - 1]
        return [this.buffer[lastKey], Number(lastKey)]
    }

    getPosition(dt: number): PendulumPosition | null {
        return this.buffer[dt]
    }

    private deleteOldestData(nOfElementsToDelete: number) {
        const keysToDelete = Object.keys(this.buffer)
            .sort((a, b) => parseFloat(a) - parseFloat(b))
            .slice(0, nOfElementsToDelete);
        keysToDelete.forEach(key => {
            delete this.buffer[key];
        });
        console.log(`Keys deleted: ${keysToDelete.length}`)
    }

    addData(bufferElements: PendulumMotionData) {
        Object.assign(this.buffer, bufferElements)

        const bufferOverflow = Object.keys(this.buffer).length - this.bufferSize
        if (bufferOverflow > 0) {
            this.deleteOldestData(bufferOverflow)
        }
    }

    addPhaseSpaceData(data: PhaseSpaceData) {
        const convertedData: PendulumMotionData = _(data)
            .keyBy(d => d[0])
            .mapValues(d => d[1])
            .value()

        this.addData(convertedData)
    }
}
