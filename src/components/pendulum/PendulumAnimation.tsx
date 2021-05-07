import _ from "lodash";
import React, {useEffect, useRef, useState} from "react";
import Konva from "konva";
import {precision} from "../../lib/util";
import {pendulum, Vector} from "../../lib/pendulumFunctions";
import {
    AppParametersStore,
    INITIAL_PEND_COORDS,
    PendulumStore,
    PendulumStoreFunctions,
    PIVOT_COORDS
} from "../../lib/AppState";
import {Line} from "react-konva";
import PendulumCircle from "./PendulumCircle";

interface Props {
    onPendPositionChange: (newCoords: Vector, theta: number, dotTheta: number, dt: number) => void
}

const PendulumAnimation: React.FC<Props> = (props) => {
    const { onPendPositionChange } = props
    const {pendCoords, animationState, prevAnimationState, resetAnimation, motionBuffer} = PendulumStore.useState();
    const params = AppParametersStore.useState();

    const pendRef = useRef<Konva.Circle>(null);
    const lineRef = useRef<Konva.Line>(null);
    const [konvaAnimation, setKonvaAnimation] = useState<Konva.Animation>();

    useEffect(() => {
        if (
            animationState === 'inMotion'
            && motionBuffer !== undefined
        ) {
            const circle = pendRef.current!;
            const line = lineRef.current!;
            const konvaAnimation = new Konva.Animation((frame => {
                const { time } = frame!;

                const roundedTime = _.round(time/100, precision(params.dt));

                const pendulumPosition = motionBuffer.getPosition(roundedTime)
                if (!pendulumPosition) {
                    const lastPositionWithDt = motionBuffer.getLastPositionWithDt()

                    const theta = pendulum.theta([circle.x(), circle.y()], 'rad')
                    const L = pendulum.getStringLength([circle.x(), circle.y()])

                    if (lastPositionWithDt) {
                        const [theta, dotTheta, dt] = lastPositionWithDt
                        motionBuffer.addPhaseSpaceData(
                            pendulum.phaseSpace(theta, L, params, dotTheta, dt)
                        )
                        PendulumStoreFunctions.updateCurrentDt(dt)
                    } else {
                        motionBuffer.addPhaseSpaceData(
                            pendulum.phaseSpace(theta, L, params)
                        )
                        PendulumStoreFunctions.updateCurrentDt(0)
                    }
                    PendulumStoreFunctions.setPendulumCoords([pendRef.current!.x(), pendRef.current!.y()])
                } else {
                    const [theta, dotTheta] = pendulumPosition;
                    const sLength = pendulum.getStringLength(pendCoords);
                    const newCoords = pendulum.thetaToCoords(theta, sLength);

                    onPendPositionChange(newCoords, theta, dotTheta, roundedTime/10)

                    circle.move({x: newCoords[0] - circle.x(), y: newCoords[1] - circle.y()});
                    line.points([...PIVOT_COORDS, circle.x(), circle.y()]);
                }
            }));
            setKonvaAnimation(konvaAnimation);
            konvaAnimation.addLayer(pendRef.current?.getLayer());
            konvaAnimation.start();
        }
    }, [animationState, motionBuffer])

    useEffect(() => {
        if (
            animationState === 'paused' && prevAnimationState === 'inMotion'
        ) {
            konvaAnimation!.stop();
            setKonvaAnimation(undefined);
            PendulumStoreFunctions.setPendulumCoords([pendRef.current!.x(), pendRef.current!.y()])
        } else if (animationState === 'inMotion' && konvaAnimation) {
            konvaAnimation.start();
        }
    }, [animationState, prevAnimationState])

    useEffect(() => {
        if (resetAnimation) {
            PendulumStore.update(s => {
                s.pendCoords = INITIAL_PEND_COORDS;
            });

            lineRef.current?.points([...PIVOT_COORDS, INITIAL_PEND_COORDS[0], INITIAL_PEND_COORDS[1]]);
            pendRef.current?.position({ x: INITIAL_PEND_COORDS[0], y: INITIAL_PEND_COORDS[1]});
            onPendPositionChange(INITIAL_PEND_COORDS, 0, 0, 0)
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

                    const theta = pendulum.theta(newPendulumCoords, 'rad')
                    onPendPositionChange(newPendulumCoords, theta, 0, 0)
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
