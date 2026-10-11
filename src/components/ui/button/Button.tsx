import './Button.css'
import type {ButtonHTMLAttributes} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger' | 'danger-secondary';
    size?: 'default' | 'small' | 'large';
}

function Button({className, variant = 'primary', size = 'default', children, ...props}: ButtonProps) {
    const variantClass = variant === 'primary' ? '' : ` button--${variant}`;
    const sizeClass = size === 'default' ? '' : ` button--${size}`;

    return (
        <button className={`button${variantClass}${sizeClass}${className ? ` ${className}` : ''}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
