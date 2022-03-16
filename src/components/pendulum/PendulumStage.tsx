import React, {useRef} from "react";
import Konva from "konva";
import {DEGREE_UTF8_SYMBOL, DOT_THETA_UTF8_SYMBOL, THETA_UTF8_SYMBOL} from "../../lib/util";
import {Layer, Stage, Text} from "react-konva";
import PendulumAnimation from "./PendulumAnimation";
import {Vector} from "../../lib/pendulumFunctions";
import {MachineState} from "../../machine/machine";

interface Props {
    width: number
    height: number
    state: MachineState
    onPendDragEnd: (newCoords: Vector) => void
}

const PendulumStage: React.FC<Props> = (props) => {
    const {width: stageWidth, height: stageHeight, state} = props

    const thetaLblRef = useRef<Konva.Text>(null);
    const dotThetaLblRef = useRef<Konva.Text>(null);
    const timeLblRef = useRef<Konva.Text>(null);

    function setLabelsText(thetaRad: number, dotThetaRad: number, dt: number) {
        const theta = thetaRad * 180 / Math.PI
        const dotTheta = dotThetaRad * 180 / Math.PI

        thetaLblRef.current?.setText(`${THETA_UTF8_SYMBOL}: ${theta.toFixed(2)}${DEGREE_UTF8_SYMBOL}`);
        dotThetaLblRef.current?.setText(`${DOT_THETA_UTF8_SYMBOL}: ${dotTheta.toFixed(2)}${DEGREE_UTF8_SYMBOL}/s`);
        timeLblRef.current?.setText(`dt: ${dt.toFixed(2)}s`)
    }

    const verticalMargin = 25
    return (
        <Stage width={stageWidth} height={stageHeight}>
            <Layer>
                <PendulumAnimation
                    state={state}
                    onPendPositionChange={(newCoords, theta, dotTheta, dt) => {
                        setLabelsText(theta, dotTheta, dt)
                    }}
                    onPendDragEnd={props.onPendDragEnd}
                />
                <Text
                    x={stageWidth-200}
                    y={verticalMargin}
                    text={`${THETA_UTF8_SYMBOL}: 0${DEGREE_UTF8_SYMBOL}`}
                    fontSize={18}
                    ref={thetaLblRef}
                />
                <Text
                    x={stageWidth-200}
                    y={verticalMargin*2}
                    text={`${DOT_THETA_UTF8_SYMBOL}: 0${DEGREE_UTF8_SYMBOL}/s`}
                    fontFamily={'sans-serif'}
                    fontSize={18}
                    ref={dotThetaLblRef}
                />
                <Text
                    x={stageWidth-200}
                    y={verticalMargin*3}
                    text={'dt: 0.0s'}
                    fontFamily={'sans-serif'}
                    fontSize={18}
                    ref={timeLblRef}
                />
            </Layer>
        </Stage>
    )
}

export default PendulumStage;
