import './DateInput.css'
import type {InputHTMLAttributes} from "react";

function DateInput({className, ...props}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            type='date'
            className={`date-input${className ? ` ${className}` : ''}`}
            {...props}
        />
    );
}

export default DateInput;
