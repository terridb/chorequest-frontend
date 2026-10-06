import './Checkbox.css'
import type {ButtonHTMLAttributes} from "react";
import {CheckIcon} from "../icons/NavIcons.tsx";

interface CheckboxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    checked: boolean;
}

function Checkbox({checked, className, ...props}: CheckboxProps) {
    return (
        <button
            type='button'
            className={`checkbox${checked ? ' checkbox--checked' : ''}${className ? ` ${className}` : ''}`}
            {...props}
        >
            {checked && <CheckIcon className='checkbox-icon'/>}
        </button>
    );
}

export default Checkbox;
