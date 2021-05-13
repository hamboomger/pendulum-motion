import React from "react";
import {Grid, Input, InputAdornment, makeStyles, Slider, Typography} from "@material-ui/core";
import {PendulumStore} from "../../lib/AppState";

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    optionLabel: {
        marginTop: 6,
        marginBottom: 6,
        textAlign: 'left',
    },
    input: {
        // width: 42,
    },
});

interface Props {
    minValue: number,
    maxValue: number,
    initialValue: number,
    step: number,
    label: string,
    onValueChange: (newValue: number) => void
    metrics?: string,
    icon: React.ReactNode
}

const SliderWithText: React.FC<Props> = (props) => {
    const classes = useStyles();
    const { animationState } = PendulumStore.useState()

    const { minValue, maxValue, initialValue, step, label, onValueChange, metrics, icon } = props
    const [value, setValue] = React.useState(initialValue);

    const settingsDisabled = animationState === 'inMotion' || animationState === 'paused'

    const handleSliderChange = (newValue: number) => {
        setValue(newValue);
    };
    const handleSliderDragStop = (newValue: number) => {
        onValueChange(newValue)
    }
    const handleInputChange = (event: any) => {
        const newValue = event.target.value ?? Number(event.target.value)
        setValue(newValue);
        onValueChange(newValue);
    };
    const handleBlur = () => {
        if (value < minValue) {
            setValue(minValue);
        } else if (value > maxValue) {
            setValue(maxValue);
        }
    };

    return (
        <div>
            <Typography className={classes.optionLabel}>
                {label}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                    {icon}
                </Grid>
                <Grid item xs={7}>
                    <Slider
                        disabled={settingsDisabled}
                        value={value}
                        onChange={(event, val) => handleSliderChange(val as number)}
                        onChangeCommitted={(event, val) => handleSliderDragStop(val as number)}
                        valueLabelDisplay="auto"
                        step={step}
                        min={minValue}
                        max={maxValue}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        disabled={settingsDisabled}
                        className={classes.input}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step,
                            min: minValue,
                            max: maxValue,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        { ...(
                                metrics ?
                                    { endAdornment: <InputAdornment position="end">{metrics}</InputAdornment> }
                                    : {}
                        )}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default SliderWithText
