import './OptionCard.css'
import type {ButtonHTMLAttributes, ReactNode} from "react";

interface OptionCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    value?: string;
    label: string;
    selected?: boolean;
    decorative?: boolean;
}

function OptionCard({icon, value, label, selected = false, decorative = false, className, ...props}: OptionCardProps) {
    const classes = `option-card${selected ? ' option-card--selected' : ''}${decorative ? ' option-card--decorative' : ''}${className ? ` ${className}` : ''}`;

    const content = (
        <>
            <span className='option-card-icon'>{icon}</span>
            {value && <span className='option-card-value'>{value}</span>}
            <span className='option-card-label'>{label}</span>
        </>
    );

    if (decorative) {
        return <span className={classes}>{content}</span>;
    }

    return (
        <button
            type='button'
            className={classes}
            {...props}
        >
            {content}
        </button>
    );
}

export default OptionCard;
