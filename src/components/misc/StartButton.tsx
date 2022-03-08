import {Fab, makeStyles} from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import React from "react";
import {AnimationState, PendulumStore} from "../../lib/AppState";

interface IProps {
    onClick: (state: AnimationState) => void
}

const useStyles = makeStyles((theme) => ({
    fabButton: {
        margin: theme.spacing(2),
        background: 'red',
        position: 'absolute',
        color: 'white',
        fontWeight: 500,
        right: 20,
        bottom: 20,
        '&:hover': {
            background: '#a006dc',
            cursor: 'pointer'
        }
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const StartButton: React.FC<IProps> = (props) => {
    const {animationState: currentState} = PendulumStore.useState();
    const classes = useStyles();

    const stateToJsxButton: { [prop in AnimationState]: any } = {
        rest: (
            <>
                <PlayCircleOutlineIcon className={classes.extendedIcon}/>
                <h3>Start</h3>
            </>
        ),
        inMotion: (
            <>
                <PauseCircleOutlineIcon className={classes.extendedIcon}/>
                <h3>Pause</h3>
            </>
        ),
        paused: (
            <>
                <RotateLeftIcon className={classes.extendedIcon}/>
                <h3>Reset</h3>
            </>
        )
    }

    return (
        <Fab onClick={() => {
            const nextState = buttonStateTransitions[currentState]
            props.onClick(nextState)
        }}
             variant="extended"
            // color="primary"
             aria-label="add"
             className={classes.fabButton}
        >
            {stateToJsxButton[currentState]}
        </Fab>
    );
}

const buttonStateTransitions: { [prop in AnimationState]: AnimationState } = {
    rest: 'inMotion',
    inMotion: 'paused',
    paused: 'rest'
}

export default StartButton;
