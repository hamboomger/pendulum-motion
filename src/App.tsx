import React from 'react';
import './App.css';
import StartButton from "./components/misc/StartButton";
import PhaseSpacePlot from "./components/plot/PhaseSpacePlot";
import MotionSettings from "./components/misc/MotionSettings";
import PendulumStage from "./components/pendulum/PendulumStage";

function App() {
  return (
    <div className="App">
      <PendulumStage height={window.innerHeight} width={window.innerWidth/2}/>
      <PhaseSpacePlot height={window.innerHeight} width={window.innerWidth/2} />
      <MotionSettings />
      <StartButton />
    </div>
  );
}

export default App;
