import type {Effort} from "../../types/enums.ts";
import type {EffortDetail} from "../../types/task.ts";
import {capitalize} from "../../utils/textUtils.ts";
import EffortMeter from "../effort-meter/EffortMeter.tsx";
import OptionCard from "../option-card/OptionCard.tsx";
import OptionContainer from "../option-container/OptionContainer.tsx";

function EffortPicker({efforts, value, onChange}: {
    efforts: EffortDetail[];
    value: Effort;
    onChange: (effort: Effort) => void;
}) {
    return (
        <OptionContainer>
            {efforts.map(item => (
                <OptionCard
                    key={item.effort}
                    icon={<EffortMeter effort={item.effort}/>}
                    value={`+${item.points}`}
                    label={capitalize(item.effort)}
                    selected={item.effort === value}
                    onClick={() => onChange(item.effort)}
                />
            ))}
        </OptionContainer>
    );
}

export default EffortPicker;
