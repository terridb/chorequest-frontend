import './Button.css'
import type {ButtonHTMLAttributes} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

function Button({className, variant = 'primary', children, ...props}: ButtonProps) {
    const variantClass = variant === 'primary' ? '' : ` button--${variant}`;

    return (
        <button className={`button${variantClass}${className ? ` ${className}` : ''}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
