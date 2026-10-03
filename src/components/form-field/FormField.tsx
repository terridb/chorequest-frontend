import './FormField.css'
import {type ReactNode, useId} from "react";

function FormField({label, hint, children}: { label: string; hint?: string; children: ReactNode }) {
    const labelId = useId();

    return (
        <div className='form-field' role='group' aria-labelledby={labelId}>
            <div className='form-field-header'>
                <h6 id={labelId} className='form-field-label'>{label}</h6>
                {hint && <p className='form-field-hint'>{hint}</p>}
            </div>
            {children}
        </div>
    );
}

export default FormField;
