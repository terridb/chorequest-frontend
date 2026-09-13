import './AddButton.css'
import {PlusIcon} from "../icons/NavIcons.tsx";
import type {ButtonHTMLAttributes} from "react";

function AddButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className='add-button' {...props}>
            <PlusIcon className='add-button-icon'/>
        </button>
    );
}

export default AddButton;
