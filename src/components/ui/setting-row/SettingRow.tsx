import './SettingRow.css'
import type {ReactNode} from "react";

function SettingRow({title, subtitle, icon, children}: {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <div className='setting-row'>
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
