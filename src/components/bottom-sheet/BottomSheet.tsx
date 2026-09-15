import './BottomSheet.css'
import {type ReactNode, useEffect} from "react";
import {createPortal} from "react-dom";
import Button from "../button/Button.tsx";

function BottomSheet({open, onClose, title, children}: { open: boolean, onClose: () => void, title: string, children: ReactNode }) {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <section className='bottom-sheet-backdrop' onClick={onClose}>
            <div className='bottom-sheet-panel' onClick={e => e.stopPropagation()}>
                <div className='bottom-sheet-title'>
                    <Button variant='ghost' onClick={onClose} aria-label='Close'>Cancel</Button>
                    <h3>{title}</h3>
                </div>
                <div className='bottom-sheet-content'>
                    {children}
                </div>
            </div>
        </section>,
        document.body
    );
}

export default BottomSheet;