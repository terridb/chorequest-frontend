import './BottomSheet.css'
import {type ReactNode, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import Button from "../button/Button.tsx";

function BottomSheet({open, onClose, title, children}: {
    open: boolean,
    onClose: () => void,
    title: string,
    children: ReactNode
}) {
    const [shouldRender, setShouldRender] = useState(open);

    // Mount as soon as it opens; after closing it stays mounted until the close animation has finished
    if (open && !shouldRender) setShouldRender(true);
    const isClosing = !open && shouldRender;

    useEffect(() => {
        if (!shouldRender) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shouldRender, onClose]);

    useEffect(() => {
        if (!shouldRender) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [shouldRender]);

    if (!shouldRender) return null;

    const handlePanelAnimationEnd = () => {
        if (isClosing) setShouldRender(false);
    };

    return createPortal(
        <section
            className={`bottom-sheet-backdrop${isClosing ? ' bottom-sheet-backdrop--closing' : ''}`}
            onClick={onClose}
        >
            <div
                className={`bottom-sheet-panel${isClosing ? ' bottom-sheet-panel--closing' : ''}`}
                onClick={e => e.stopPropagation()}
                onAnimationEnd={handlePanelAnimationEnd}
            >
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