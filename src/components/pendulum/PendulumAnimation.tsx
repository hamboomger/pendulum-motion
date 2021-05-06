import React, {useEffect, useRef, useState} from "react";
import Konva from "konva";
import _ from "lodash";
import {precision} from "../../lib/util";
import {pendulum, PhaseSpaceData, Vector} from "../../lib/pendulumFunctions";
import {
    AppParametersStore,
    INITIAL_PEND_COORDS,
    PendulumStore,
    PendulumStoreFunctions,
    PIVOT_COORDS
} from "../../lib/AppState";
import {Line} from "react-konva";
import PendulumCircle from "./PendulumCircle";
import {PendulumMotionBuffer} from "../../lib/PendulumMotionBuffer";

interface Props {
    motionBuffer: PendulumMotionBuffer | undefined
    onPendPositionChange: (newCoords: Vector, theta: number, dotTheta: number) => void
}

const PendulumAnimation: React.FC<Props> = (props) => {
    const { motionBuffer, onPendPositionChange } = props
    const {pendCoords, animationState, resetAnimation} = PendulumStore.useState();
    const params = AppParametersStore.useState();

    const pendRef = useRef<Konva.Circle>(null);
    const lineRef = useRef<Konva.Line>(null);
    const [konvaAnimation, setKonvaAnimation] = useState<Konva.Animation>();

    useEffect(() => {
        console.log('use effect triggered')
        if (
            animationState === 'inMotion'
            && konvaAnimation === undefined
            && motionBuffer !== undefined
        ) {
            const circle = pendRef.current!;
            const line = lineRef.current!;
            const konvaAnimation = new Konva.Animation((frame => {
                const { time } = frame!;

                const roundedTime = _.round(time/100, precision(params.dt));
                const pendulumPosition = motionBuffer.getPosition(roundedTime)
                if (!pendulumPosition) {
                    console.log('Motion data updated')
                    const lastPositionWithDt = motionBuffer.getLastPositionWithDt()

                    const theta = pendulum.theta([circle.x(), circle.y()], 'rad')
                    const L = pendulum.getStringLength([circle.x(), circle.y()])

                    let phaseSpaceData: PhaseSpaceData
                    if (lastPositionWithDt) {
                        const [lastPosition, dt] = lastPositionWithDt
                        const [theta, dotTheta] = lastPosition
                        phaseSpaceData = pendulum.phaseSpace(theta, L, params, dotTheta, dt)
                    } else {
                        phaseSpaceData = pendulum.phaseSpace(theta, L, params)
                    }
                    motionBuffer.addPhaseSpaceData(phaseSpaceData)
                } else {
                    const [theta, dotTheta] = pendulumPosition;
                    const sLength = pendulum.getStringLength(pendCoords);
                    const newCoords = pendulum.thetaToCoords(theta, sLength);

                    onPendPositionChange(newCoords, theta, dotTheta)

                    circle.move({x: newCoords[0] - circle.x(), y: newCoords[1] - circle.y()});
                    line.points([...PIVOT_COORDS, circle.x(), circle.y()]);
                }
            }));
            setKonvaAnimation(konvaAnimation);
            konvaAnimation.addLayer(pendRef.current?.getLayer());
            konvaAnimation.start();
        }
        if (
            animationState === 'paused'
            && konvaAnimation !== undefined
            && konvaAnimation.isRunning
        ) {
            konvaAnimation.stop();
            setKonvaAnimation(undefined);
        } else if (animationState === 'inMotion' && konvaAnimation) {
            konvaAnimation.start();
        }
    }, [animationState, konvaAnimation, motionBuffer])

    useEffect(() => {
        if (resetAnimation) {
            PendulumStore.update(s => {
                s.pendCoords = INITIAL_PEND_COORDS;
            });

            lineRef.current?.points([...PIVOT_COORDS, INITIAL_PEND_COORDS[0], INITIAL_PEND_COORDS[1]]);
            pendRef.current?.position({ x: INITIAL_PEND_COORDS[0], y: INITIAL_PEND_COORDS[1]});
            onPendPositionChange(INITIAL_PEND_COORDS, 0, 0)
        }
    }, [resetAnimation])
    return (
        <>
            <Line
                stroke="black"
                points={[...PIVOT_COORDS, ...pendCoords]}
                ref={lineRef}
            />
            <PendulumCircle
                onPendulumDragMove={(newPendulumCoords) => {
                    lineRef?.current?.points([...PIVOT_COORDS, ...newPendulumCoords]);

                    const theta = pendulum.theta(newPendulumCoords, 'deg')
                    onPendPositionChange(newPendulumCoords, theta, 0)
                }}
                onPendulumDragEnd={(newPendulumCoords) => {
                    PendulumStoreFunctions.setPendulumCoords(newPendulumCoords)
                    PendulumStoreFunctions.changeAnimationState('inMotion')
                }}
             pendRef={pendRef}/>
        </>
    );
}

export default PendulumAnimation
