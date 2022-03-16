import _ from "lodash";
import React, {useEffect, useRef, useState} from "react";
import Konva from "konva";
import {precision} from "../../lib/util";
import {pendulum, Vector} from "../../lib/pendulumFunctions";
import {
    AppParametersStore,
    PendulumStoreFunctions,
    PIVOT_COORDS
} from "../../lib/AppState";
import {Line} from "react-konva";
import PendulumCircle from "./PendulumCircle";
import {MachineState} from "../../machine/machine";

interface Props {
    onPendPositionChange: (newCoords: Vector, theta: number, dotTheta: number, dt: number) => void
    onPendDragEnd: (newCoords: Vector) => void
    state: MachineState
}

const PendulumAnimation: React.FC<Props> = (props) => {
    const { onPendPositionChange, onPendDragEnd, state } = props
    const { context: ctx } = state
    const params = AppParametersStore.useState();

    const pendRef = useRef<Konva.Circle>(null);
    const lineRef = useRef<Konva.Line>(null);
    const [konvaAnimation, setKonvaAnimation] = useState<Konva.Animation>();

    console.log(`animation.state: ${state.value}`)

    useEffect(() => {
        if (
            state.matches('inMotion')
        ) {
            const circle = pendRef.current!;
            const line = lineRef.current!;
            console.log('inMotion animation!')
            const konvaAnimation = new Konva.Animation((frame => {
                const { time } = frame!;

                const roundedTime = _.round(time/100, precision(params.dt));

                const { motionBuffer, pendCoords } = ctx
                const pendulumPosition = motionBuffer!.getPosition(roundedTime)
                const sLength = pendulum.getStringLength(pendCoords);
                if (!pendulumPosition) {
                    console.log(`failed to find position at time: ${roundedTime}`);
                } else {
                    const [theta, dotTheta] = pendulumPosition;
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
    }, [state.value])

    useEffect(() => {
        if (
            !state.matches('inMotion') && konvaAnimation
        ) {
            konvaAnimation!.stop();
            setKonvaAnimation(undefined);
            PendulumStoreFunctions.setPendulumCoords([pendRef.current!.x(), pendRef.current!.y()])
        }
    }, [state.value])

    const currentPendCoords: Vector = pendRef?.current
            ? [pendRef.current.x(), pendRef.current.y()]
            : ctx.pendCoords
    return (
        <>
            <Line
                stroke="black"
                points={[...PIVOT_COORDS, ...currentPendCoords]}
                ref={lineRef}
            />
            <PendulumCircle
                onPendulumDragMove={(newPendulumCoords) => {
                    lineRef?.current?.points([...PIVOT_COORDS, ...newPendulumCoords]);

                    const theta = pendulum.theta(newPendulumCoords, 'rad')
                    onPendPositionChange(newPendulumCoords, theta, 0, 0)
                }}
                onPendulumDragEnd={onPendDragEnd}
             pendRef={pendRef}/>
        </>
    );
}

export default PendulumAnimation
