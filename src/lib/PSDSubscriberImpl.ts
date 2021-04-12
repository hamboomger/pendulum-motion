import {PSDSubscriber} from "./PhaseSpaceDataObservable";
import {PhaseSpace} from "./pendulumFunctions";
import _ from "lodash";

const CACHE_PATCHES_SIZE = 8;

export type PSData = { [t: string]: [theta: number, dotTheta: number]};

export class PSDSubscriberImpl implements PSDSubscriber {
  entireDataCache: PSData;
  private bottomPatchNumber: number;
  private readonly setPSData?: (data: PSData) => void
  private readonly setCurrentPatch?: (data: PSData) => void

  constructor(setPSData?: (data: PSData) => void, setCurrentPatch?: (data: PSData) => void) {
    this.setPSData = setPSData;
    this.setCurrentPatch = setCurrentPatch;
    this.entireDataCache = {};
    this.bottomPatchNumber = 0;
  }

  private clearPartOfCache(elementsPerPatch: number, currentPatch: number) {
    if (currentPatch - this.bottomPatchNumber > CACHE_PATCHES_SIZE) {
      const keysToDelete = Object.keys(this.entireDataCache)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .slice(0, elementsPerPatch);
      keysToDelete.forEach(key => {
        delete this.entireDataCache[key];
      });
      this.bottomPatchNumber++;
    }
  }

  notify(patchNumber: number, phaseSpace: PhaseSpace) {
    const currentPatchData = _.chain(phaseSpace)
      .groupBy(elem => elem[0])
      .mapValues(elem => elem[0][1])
      .value();
    const updatedPSData = _.chain(currentPatchData)
      .clone()
      .assign(this.entireDataCache)
      .value();

    this.entireDataCache = updatedPSData;
    this.clearPartOfCache(phaseSpace.length, patchNumber);
    if (this.setPSData) {
      this.setPSData(updatedPSData);
    }
    if (this.setCurrentPatch) {
      this.setCurrentPatch(currentPatchData);
    }

    console.log(`elements in cache: ${Object.keys(this.entireDataCache).length}`);
  }
}
