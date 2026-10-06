import './Toggle.css'
import type {ButtonHTMLAttributes} from "react";

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function Toggle({checked, onChange, className, ...props}: ToggleProps) {
    return (
        <button
            type='button'
            role='switch'
            aria-checked={checked}
            className={`toggle${checked ? ' toggle--checked' : ''}${className ? ` ${className}` : ''}`}
            onClick={() => onChange(!checked)}
            {...props}
        >
            <span className='toggle-knob'/>
        </button>
    );
}

export default Toggle;
