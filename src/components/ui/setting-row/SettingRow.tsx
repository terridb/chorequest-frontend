import './SettingRow.css'
import type {ReactNode} from "react";

function SettingRow({title, subtitle, icon, size = 'default', children}: {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    size?: 'default' | 'large';
    children?: ReactNode;
}) {
    return (
        <div className={`setting-row${size === 'default' ? '' : ` setting-row--${size}`}`}>
            <div className='setting-row-main'>
                {icon}
                <div className='setting-row-text'>
                    <p className='setting-row-title'>{title}</p>
                    {subtitle && <p className='setting-row-subtitle'>{subtitle}</p>}
                </div>
            </div>
            {children}
        </div>
    );
}

export default SettingRow;
