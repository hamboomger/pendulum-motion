import React, {useEffect, useRef} from "react";
import {AppParametersStore, PendulumStore} from "../../lib/AppState";
import Konva from "konva";
import {DEGREE_UTF8_SYMBOL, DOT_THETA_UTF8_SYMBOL, THETA_UTF8_SYMBOL} from "../../lib/util";
import {PendulumMotionBuffer} from "../../lib/PendulumMotionBuffer";
import {Layer, Stage, Text} from "react-konva";
import PendulumAnimation from "./PendulumAnimation";
import {pendulum, PhaseSpaceParams, Vector} from "../../lib/pendulumFunctions";
import {startPendMotionWorker} from "../../workers/pendulumMotionWorkerConnector";

interface Props {
    width: number
    height: number
    onAnimationStart: (pendCoords: Vector) => void
}

const startAnimation = (params: PhaseSpaceParams, pendCoords: Vector) => {
    const L = pendulum.getStringLength(pendCoords)
    const theta = pendulum.theta(pendCoords, 'rad')
    const pendMotionWorker = startPendMotionWorker({
        L,
        theta,
        params
    })
    PendulumStore.update(s => {
        s.motionWorker = pendMotionWorker
        s.motionBuffer = new PendulumMotionBuffer(params, pendMotionWorker)
    })
}

const PendulumStage: React.FC<Props> = (props) => {
    const {width: stageWidth, height: stageHeight, onAnimationStart} = props
    const {animationState, prevAnimationState, pendCoords} = PendulumStore.useState()
    const params = AppParametersStore.useState()

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

    useEffect(() => {
        if (animationState === 'inMotion'
            && (prevAnimationState === 'rest' || prevAnimationState === 'paused'))
        {
            onAnimationStart(pendCoords);
        }
    }, [animationState, prevAnimationState]);
    const verticalMargin = 25
    return (
        <Stage width={stageWidth} height={stageHeight}>
            <Layer>
                <PendulumAnimation
                    onPendPositionChange={(newCoords, theta, dotTheta, dt) => {
                        setLabelsText(theta, dotTheta, dt)
                    }}
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
