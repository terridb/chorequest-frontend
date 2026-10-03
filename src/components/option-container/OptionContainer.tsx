import './OptionContainer.css'
import type {ReactNode} from "react";

function OptionContainer({children}: { children: ReactNode }) {
    return (
        <div className='option-container'>
            {children}
        </div>
    );
}

export default OptionContainer;
