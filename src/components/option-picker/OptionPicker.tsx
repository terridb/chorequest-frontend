import type {ReactNode} from "react";
import OptionCard from "../option-card/OptionCard.tsx";
import OptionContainer from "../option-container/OptionContainer.tsx";

export interface PickerOption<T> {
    value: T;
    label: string;
    icon: ReactNode;
    detail?: string;
}

function OptionPicker<T extends string | number>({options, value, onChange}: {
    options: PickerOption<T>[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <OptionContainer>
            {options.map(option => (
                <OptionCard
                    key={option.value}
                    icon={option.icon}
                    value={option.detail}
                    label={option.label}
                    selected={option.value === value}
                    onClick={() => onChange(option.value)}
                />
            ))}
        </OptionContainer>
    );
}

export default OptionPicker;
