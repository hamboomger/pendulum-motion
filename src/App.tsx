import React from 'react';
import './App.css';
import FloatingActionButton from "./components/misc/StartButton";
import PhaseSpacePlot from "./components/plot/PhaseSpacePlot";
import MotionSettings from "./components/settings/MotionSettings";
import PendulumStage from "./components/pendulum/PendulumStage";
import {AppParametersStore, PendulumStore, PendulumStoreFunctions} from "./lib/AppState";
import {pendulum, PhaseSpaceParams, Vector} from "./lib/pendulumFunctions";
import {startPendMotionWorker} from "./workers/pendulumMotionWorkerConnector";
import {PendulumMotionBuffer} from "./lib/PendulumMotionBuffer";

function App() {
  const params = AppParametersStore.useState()
  return (
    <div className="App">
      <PendulumStage
        height={window.innerHeight}
        width={window.innerWidth/2}
        onAnimationStart={
          (pendCoords) => startAnimation(params, pendCoords)
        }
      />
      <PhaseSpacePlot height={window.innerHeight} width={window.innerWidth/2} />
      <MotionSettings />
      <FloatingActionButton
        onClick={(animationState) => {
            PendulumStoreFunctions.changeAnimationState(animationState)
        }
      }/>
    </div>
  );
}

const startAnimation = (params: PhaseSpaceParams, pendCoords: Vector) => {
  const L = pendulum.getStringLength(pendCoords)
  const theta = pendulum.theta(pendCoords, 'rad')
  const pendMotionWorker = startPendMotionWorker({
    L, theta, params
  })
  PendulumStore.update(s => {
    s.motionWorker = pendMotionWorker
    s.motionBuffer = new PendulumMotionBuffer(params, pendMotionWorker)
  })
}

export default App;
