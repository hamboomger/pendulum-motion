import React from "react";
import {Circle} from "react-konva";
import {PENDULUM_RADIUS, PendulumStore, PendulumStoreFunctions} from "../../lib/AppState";
import {Vector} from "../../lib/pendulumFunctions";
import Konva from "konva";

interface Props {
    onPendulumDragMove: (newPendulumCoords: Vector) => void
    onPendulumDragEnd: (newPendulumCoords: Vector) => void
    pendRef: React.RefObject<Konva.Circle>
}

const PendulumCircle: React.FC<Props> = (props) => {
    const { onPendulumDragMove, onPendulumDragEnd, pendRef } = props
    const { pendCoords } = PendulumStore.useState();

    const [x, y] = [pendRef.current?.x() ?? pendCoords[0], pendRef.current?.y() ?? pendCoords[1]];

    return (
        <Circle
            stroke="#b91515"
            strokeWidth={1}
            fill="#f71d1d"
            x={x}
            y={y}
            radius={PENDULUM_RADIUS}
            ref={pendRef}
            draggable={true}
            onDragMove={(e) => onPendulumDragMove([e.target.x(), e.target.y()])}
            onDragStart={() => PendulumStoreFunctions.changeAnimationState('paused')}
            onDragEnd={(e) => onPendulumDragEnd([e.target.x(), e.target.y()])}
        />
    )
}

export default PendulumCircle
