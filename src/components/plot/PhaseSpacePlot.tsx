import React, {useEffect, useRef, useState} from "react";
import {PendulumStore} from "../../lib/AppState";
import {D3PlotBuilder} from "./D3PlotBuilder";
import {PSData, PSDSubscriberImpl} from "../../lib/PSDSubscriberImpl";

interface Props {
  width: number
  height: number
}

const PhaseSpacePlot: React.FC<Props> = ({width, height}) => {
  const svgRef = useRef(null);
  const {animationState, pendCoords, resetAnimation, motionBuffer} = PendulumStore.useState();
  const [plotBuilder, setPlotBuilder] = useState<D3PlotBuilder>();
  const [currentPatchData, setCurrentPatchData] = useState<PSData>();

  useEffect(() => {
    const newPlotBuilder = new D3PlotBuilder(width, height, svgRef.current!);
    newPlotBuilder.buildPlotPlane();
    setPlotBuilder(newPlotBuilder);
  }, [])
  useEffect(() => {
    if (animationState === 'inMotion' && motionBuffer) {
      // motionObservable.subscribe(new PSDSubscriberImpl(undefined, setCurrentPatchData));
      // PendulumStore.update(s => { s.subscribers++ });
    } else if (animationState === 'paused') {
      plotBuilder?.pauseDrawing();
    }
  }, [animationState, pendCoords]);
  useEffect(() => {
    if (animationState === 'inMotion' && currentPatchData && plotBuilder) {
      plotBuilder.drawPlotLine(currentPatchData);
    }
  }, [currentPatchData])
  useEffect(() => {
    if (resetAnimation) {
      plotBuilder?.resetDrawings();
      // PendulumStore.update(s => { s.subscribers-- });
    }
  }, [resetAnimation])
  return (
    <>
      <svg style={{width: '100%'}} ref={svgRef}/>
    </>
  )
}

export default PhaseSpacePlot
