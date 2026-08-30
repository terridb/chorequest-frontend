import './AddButton.css'
import {PlusIcon} from "../icons/NavIcons.tsx";

function AddButton() {
    return (
        <button className='add-button'>
            <PlusIcon className='add-button-icon'/>
        </button>
    );
}

export default AddButton;
