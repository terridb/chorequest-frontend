import './SectionTitle.css'
import type {ReactNode} from "react";

function SectionTitle({danger = false, children}: { danger?: boolean; children: ReactNode }) {
    return (
        <h4 className={`section-title${danger ? ' section-title--danger' : ''}`}>
            {children}
        </h4>
    );
}

export default SectionTitle;
