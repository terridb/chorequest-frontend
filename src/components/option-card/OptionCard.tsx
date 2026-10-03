import './OptionCard.css'
import type {ButtonHTMLAttributes, ReactNode} from "react";

interface OptionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    value?: string;
    label: string;
    selected?: boolean;
}

function OptionCard({icon, value, label, selected = false, className, ...props}: OptionCardProps) {
    return (
        <button
            type='button'
            className={`option-card${selected ? ' option-card--selected' : ''}${className ? ` ${className}` : ''}`}
            {...props}
        >
            <span className='option-card-icon'>{icon}</span>
            {value && <span className='option-card-value'>{value}</span>}
            <span className='option-card-label'>{label}</span>
        </button>
    );
}

export default OptionCard;