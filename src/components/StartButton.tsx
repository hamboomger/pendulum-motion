import {Fab, makeStyles} from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import React from "react";
import {AnimationState, PendulumStore} from "../lib/AppState";

const useStyles = makeStyles((theme) => ({
  fabButton: {
    margin: theme.spacing(1),
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const StartButton: React.FC = () => {
  const { animationState, motionObservable } = PendulumStore.useState();
  const classes = useStyles();

  const stateToJsxButton: { [prop in AnimationState]: any } = {
    rest: (
      <>
        <PlayCircleOutlineIcon className={classes.extendedIcon}/>
        Start
      </>
    ),
    inMotion: (
      <>
        <PauseCircleOutlineIcon className={classes.extendedIcon}/>
        Pause
      </>
    ),
    paused: (
      <>
        <RotateLeftIcon className={classes.extendedIcon}/>
        Reset
      </>
    )
  }

  return (
    <Fab onClick={() => {
      PendulumStore.update((s) => {
        switch (animationState) {
          case "rest":
            s.animationState = 'inMotion';
            break;
          case "inMotion":
            s.animationState = 'paused';
            break;
          case "paused":
            s.animationState = 'rest';
            s.resetAnimation = true;
            break;
        }
      });
      if (animationState === 'paused') {
        motionObservable?.stopCalculations();
      }
    }}
         variant="extended"
         color="primary"
         aria-label="add"
         className={classes.fabButton}
    >
      { stateToJsxButton[animationState] }
    </Fab>
  );
}

export default StartButton;
