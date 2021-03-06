import React, {useEffect, useRef, useState} from "react";
import {AppParametersStore, PendulumStore} from "../../lib/AppState";
import {D3PlotBuilder} from "./D3PlotBuilder";

interface Props {
  width: number
  height: number
}

const PhaseSpacePlot: React.FC<Props> = ({width, height}) => {
  const svgRef = useRef(null);
  const {
    animationState, prevAnimationState, resetAnimation, motionBuffer, currentDt, plotColor
  } = PendulumStore.useState();
  const params = AppParametersStore.useState()
  const [transitionEndMillis, setTransitionEndMillis] = useState(0.1)
  const [plotBuilder, setPlotBuilder] = useState<D3PlotBuilder>();

  useEffect(() => {
    const newPlotBuilder = new D3PlotBuilder(width, height, svgRef.current!);
    newPlotBuilder.buildPlotPlane();
    setPlotBuilder(newPlotBuilder);
  }, [])

  useEffect(() => {
    if (animationState === 'inMotion' && motionBuffer) {
      const motionData = motionBuffer.getPositionsWithDt(currentDt, params.iterations)
      if (motionData.length !== 0) {
        plotBuilder?.drawPlotLine(motionData, params.iterations, plotColor)
        setTransitionEndMillis(transitionEndMillis + params.iterations)
      }
    } else if (animationState === 'paused') {
      plotBuilder?.pauseDrawing();
    }

    if (animationState === 'rest' && prevAnimationState === 'paused') {
      plotBuilder?.resetDrawings();
    }
  }, [animationState, currentDt]);

  useEffect(() => {
    if (resetAnimation) {
      plotBuilder?.resetDrawings();
    }
  }, [resetAnimation])
  return (
    <>
      <svg style={{width: '100%'}} ref={svgRef}/>
    </>
  )
}

export default PhaseSpacePlot
