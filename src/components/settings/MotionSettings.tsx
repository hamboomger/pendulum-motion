import React from "react";
import {makeStyles, Paper, Typography} from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import '@fontsource/roboto';
import GravitySlider from "./GravitySlider";
import FrictionSlider from "./FrictionSlider";

const useStyles = makeStyles((theme) => ({
  settingsBlock: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: theme.spacing(2),
    width: theme.spacing(52),
    position: 'absolute',
    bottom: '5px',
    left: '5px'
  },
  innerBlock: {
    padding: '5px 25px',
    paddingBottom: '15px'
  },
  settingsHeaderBlock: {
    padding: '5px 0',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#f71d1d'
  },
  settingsHeader: {
    color: 'white',
  },
  settingsIcon: {
    color: 'white',
    marginRight: '5px',
  },
}));

const MotionSettings: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.settingsBlock}>
      <div className={classes.settingsHeaderBlock}>
        <SettingsIcon className={classes.settingsIcon}/>
        <Typography className={classes.settingsHeader} variant='h6' align='center'>
          Parameters
        </Typography>
      </div>
      <div className={classes.innerBlock}>
        <GravitySlider />
        <FrictionSlider />
      </div>
    </Paper>
  )
}

export default MotionSettings;
