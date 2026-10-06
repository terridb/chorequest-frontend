import type {ReactNode} from "react";
import OptionCard from "../option-card/OptionCard.tsx";

export interface PickerOption<T> {
    value: T;
    label: string;
    icon: ReactNode;
    detail?: string;
}

function OptionPicker<T extends string | number>({options, value, onChange, decorative = false}: {
    options: PickerOption<T>[];
    value?: T;
    onChange?: (value: T) => void;
    decorative?: boolean;
}) {
    return (
        <div className='option-container'>
            {options.map(option => (
                <OptionCard
                    key={option.value}
                    icon={option.icon}
                    value={option.detail}
                    label={option.label}
                    selected={option.value === value}
                    decorative={decorative}
                    onClick={() => onChange?.(option.value)}
                />
            ))}
        </div>
    );
}

export default OptionPicker;
