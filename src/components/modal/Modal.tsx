import './Modal.css'
import {type ReactNode, useEffect} from "react";
import {createPortal} from "react-dom";

function Modal({open, onClose, children}: { open: boolean, onClose: () => void, children: ReactNode }) {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className='modal-backdrop' onClick={onClose}>
            <div className='modal-panel' onClick={event => event.stopPropagation()}>
                <button className='modal-close' onClick={onClose} aria-label='Close'>×</button>
                <div className='modal-content'>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Modal;
