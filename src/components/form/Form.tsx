import './Form.css'
import type {FormEventHandler, ReactNode} from "react";
import Button from "../button/Button.tsx";

interface FormProps {
    onSubmit: FormEventHandler<HTMLFormElement>;
    submitLabel: ReactNode;
    submitDisabled?: boolean;
    error?: string;
    children: ReactNode;
}

function Form({onSubmit, submitLabel, submitDisabled, error, children}: FormProps) {
    return (
        <form className='form' onSubmit={onSubmit}>
            <div className='form-fields'>
                {children}
            </div>
            <div className='action-bar'>
                {error && <p className='form-error'>{error}</p>}
                <Button variant='primary' type='submit' size='large' disabled={submitDisabled}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}

export default Form;
