import './LabeledGroup.css'
import {type ReactNode, useId} from "react";

function LabeledGroup({label, hint, children}: { label?: string; hint?: string; children: ReactNode }) {
    const labelId = useId();

    return (
        <div className='labeled-group' role='group' aria-labelledby={labelId}>
            <div className='labeled-group-header'>
                <h6 id={labelId} className='labeled-group-label'>{label}</h6>
                {hint && <p className='labeled-group-hint'>{hint}</p>}
            </div>
            {children}
        </div>
    );
}

export default LabeledGroup;
