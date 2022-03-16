import React from 'react';
import './App.css';
import FloatingActionButton from "./components/misc/StartButton";
import PhaseSpacePlot from "./components/plot/PhaseSpacePlot";
import MotionSettings from "./components/settings/MotionSettings";
import PendulumStage from "./components/pendulum/PendulumStage";
import {useMachine} from "@xstate/react";
import {MachineState, pendulumMachine} from "./machine/machine";

function App() {
  const [state, send] = useMachine(pendulumMachine)
  console.log(`app.state: ${state.value}`)
  return (
    <div className="App">
      <PendulumStage
        height={window.innerHeight}
        width={window.innerWidth/2}
        state={
          // @ts-ignore
          (state as MachineState)
        }
        onPendDragEnd={(newCoords) => {
          send({
            type: 'UPDATE_PEND_COORDS',
            coords: newCoords,
          })
          send({
            type: 'START_MOTION',
          })
        }}
      />
      <PhaseSpacePlot height={window.innerHeight} width={window.innerWidth/2} />
      <MotionSettings />
      <FloatingActionButton
        onClick={(nextAnimationState) => {
          if (nextAnimationState === 'inMotion') {
            send({
              type: 'START_MOTION',
            })
          }
          if (nextAnimationState === 'paused') {
            send({
              type: 'PAUSE_MOTION',
            })
          }
          if (nextAnimationState === 'rest') {
            send({
              type: 'RESET_PENDULUM',
            })
          }
        }
      }/>
    </div>
  );
}

export default App;
