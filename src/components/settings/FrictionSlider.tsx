import React from "react";
import WavesIcon from '@material-ui/icons/Waves';
import SliderWithText from "../common/SliderWithText";
import {AppParametersStore} from "../../lib/AppState";

const MIN_FRICTION_VALUE = 0;
const MAX_FRICTION_VALUE = 0.1;
const GRAVITY_STEP = 0.005;

const FrictionSlider: React.FC = () => {
    const { friction } = AppParametersStore.useState()
    return (
        <SliderWithText
            minValue={MIN_FRICTION_VALUE}
            maxValue={MAX_FRICTION_VALUE}
            initialValue={friction}
            step={GRAVITY_STEP}
            label="Friction:"
            onValueChange={(newValue) => {
                AppParametersStore.update(s => {
                    s.friction = newValue
                })
            }}
            icon={<WavesIcon />}
            metrics="μ"
        />
    )
}

export default FrictionSlider
