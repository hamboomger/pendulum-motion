import _ from 'lodash';
import React from "react";
import {makeStyles, Paper, Slider, Typography} from "@material-ui/core";
import {AppParametersStore} from "../../lib/AppState";

const MIN_GRAVITY_VALUE = 2;
const MAX_GRAVITY_VALUE = 40;
const GRAVITY_STEP = 2;

const useStyles = makeStyles((theme) => ({
  settingsBlock: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: theme.spacing(1),
    width: theme.spacing(42),
    // height: theme.spacing(32),
    position: 'absolute',
    bottom: '5px',
    left: '5px'
  },
  innerBlock: {
    padding: '5px 30px',
  },
  settingsHeader: {
    backgroundColor: '#3ce4ff',
    // color: 'white',
    // fontWeight: 'bold'
  },
  optionLabel: {
    marginTop: 6,
    marginBottom: 6,
    textAlign: 'left',
  },
}));

const MotionSettings: React.FC = () => {
  const classes = useStyles();
  const { friction, g } = AppParametersStore.useState();

  const range = MAX_GRAVITY_VALUE - MIN_GRAVITY_VALUE;
  const marksIndexes = _.range(MIN_GRAVITY_VALUE, MAX_GRAVITY_VALUE+1, Math.round(range/4));
  marksIndexes.push(MAX_GRAVITY_VALUE);
  const gravityMarks = marksIndexes.map(n => ({
      value: n,
      label: `${n}m/s\u00b2`
  }));
  const frictionMarks = [0, 0.25, 0.5, 0.75, 1].map(n => ({
    value: n,
    label: `${n}`
  }));

  function valuetext(value: number) {
    return `${value}m/s\u00b2`;
  }

  return (
    <Paper elevation={3} className={classes.settingsBlock}>
      <Typography className={classes.settingsHeader} variant='h6' align='center'>
        Parameters
      </Typography>
      <div className={classes.innerBlock}>
        <Typography className={classes.optionLabel}>
          Gravity:
        </Typography>
        <Slider
          defaultValue={g}
          getAriaValueText={valuetext}
          onChange={(event, val) => AppParametersStore.update(s => {
              s.g = val as number;
          })}
          valueLabelDisplay="auto"
          marks={gravityMarks}
          step={GRAVITY_STEP}
          min={MIN_GRAVITY_VALUE}
          max={MAX_GRAVITY_VALUE}
        />
        <Typography className={classes.optionLabel}>
          Friction:
        </Typography>
        <Slider
          defaultValue={friction*10}
          getAriaValueText={valuetext}
          onChange={(event, val) => AppParametersStore.update(s => {
            s.friction = (val as number) / 10;
          })}
          valueLabelDisplay="auto"
          marks={frictionMarks}
          step={0.1}
          min={0}
          max={1}
        />
      </div>
    </Paper>
  )
}

export default MotionSettings;
