import {Fab, makeStyles} from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import React from "react";
import {AnimationState, PendulumStore, PendulumStoreFunctions} from "../../lib/AppState";

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

const StartButton: React.FC = () => {
    const {animationState} = PendulumStore.useState();
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
            switch (animationState) {
                case "rest":
                    PendulumStoreFunctions.changeAnimationState('inMotion')
                    break;
                case "inMotion":
                    PendulumStoreFunctions.changeAnimationState('paused')
                    break;
                case "paused":
                    PendulumStoreFunctions.changeAnimationState('rest')
                    break;
            }
        }}
             variant="extended"
            // color="primary"
             aria-label="add"
             className={classes.fabButton}
        >
            {stateToJsxButton[animationState]}
        </Fab>
    );
}

export default StartButton;
