import React from "react";
import {AppParametersStore} from "../../lib/AppState";
import SliderWithText from "../common/SliderWithText";
import PlayForWorkIcon from "@material-ui/icons/PlayForWork";

const MIN_GRAVITY_VALUE = 1;
const MAX_GRAVITY_VALUE = 30;
const GRAVITY_STEP = 0.1;

const GravitySlider: React.FC = () => {
    const { g } = AppParametersStore.useState();
    return (
        <SliderWithText
            minValue={MIN_GRAVITY_VALUE}
            maxValue={MAX_GRAVITY_VALUE}
            step={GRAVITY_STEP}
            label="Gravity:"
            onValueChange={(newValue) => {
                AppParametersStore.update(s => {
                    s.g = newValue
                })
            }}
            icon={<PlayForWorkIcon fontSize="large" />}
            initialValue={g}
            metrics="m/s²"
        />
    )
}

export default GravitySlider
