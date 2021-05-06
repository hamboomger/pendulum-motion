import React, {useEffect, useRef, useState} from "react";
import {PendulumStore} from "../../lib/AppState";
import Konva from "konva";
import {DEGREE_UTF8_SYMBOL, DOT_THETA_UTF8_SYMBOL, THETA_UTF8_SYMBOL} from "../../lib/util";
import {PendulumMotionBuffer} from "../../lib/PendulumMotionBuffer";
import {Layer, Stage, Text} from "react-konva";
import PendulumAnimation from "./PendulumAnimation";

interface Props {
    width: number,
    height: number
}

const PendulumStage: React.FC<Props> = (props) => {
    const {width: stageWidth, height: stageHeight} = props
    const {animationState, prevAnimationState, motionBuffer} = PendulumStore.useState();

    const thetaLblRef = useRef<Konva.Text>(null);
    const dotThetaLblRef = useRef<Konva.Text>(null);

    function setLabelsText(thetaRad: number, dotThetaRad: number) {
        const theta = thetaRad * 180 / Math.PI
        const dotTheta = dotThetaRad * 180 / Math.PI

        thetaLblRef.current?.setText(`${THETA_UTF8_SYMBOL}: ${theta.toFixed(2)}${DEGREE_UTF8_SYMBOL}`);
        dotThetaLblRef.current?.setText(`${DOT_THETA_UTF8_SYMBOL}: ${dotTheta.toFixed(2)}${DEGREE_UTF8_SYMBOL}/s`);
    }

    useEffect(() => {
        console.log(`animation state: ${animationState}, prev state: ${prevAnimationState}`)
        if (animationState === 'inMotion'
            && (prevAnimationState === 'rest' || prevAnimationState === 'paused'))
        {
            PendulumStore.update(s => {
                s.motionBuffer = new PendulumMotionBuffer(1000)
            })
        }
    }, [animationState, prevAnimationState]);
    return (
        <Stage width={stageWidth} height={stageHeight}>
            <Layer>
                <PendulumAnimation
                    motionBuffer={motionBuffer}
                    onPendPositionChange={(newCoords, theta, dotTheta) => {
                        setLabelsText(theta, dotTheta)
                    }}
                />
                <Text
                    x={stageWidth-200}
                    y={20}
                    text={`${THETA_UTF8_SYMBOL}: 0${DEGREE_UTF8_SYMBOL}`}
                    fontSize={15}
                    ref={thetaLblRef}
                />
                <Text
                    x={stageWidth-200}
                    y={40}
                    text={`${DOT_THETA_UTF8_SYMBOL}: 0${DEGREE_UTF8_SYMBOL}/s`}
                    fontFamily={'sans-serif'}
                    fontSize={15}
                    ref={dotThetaLblRef}
                />
            </Layer>
        </Stage>
    )
}

export default PendulumStage;
