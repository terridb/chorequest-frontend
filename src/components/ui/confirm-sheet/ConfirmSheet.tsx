import './ConfirmSheet.css'
import BottomSheet from "../bottom-sheet/BottomSheet.tsx";
import Button from "../button/Button.tsx";

function ConfirmSheet({open, onClose, title, message, confirmLabel, pendingLabel, onConfirm, isPending = false, error}: {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmLabel: string;
    pendingLabel: string;
    onConfirm: () => void;
    isPending?: boolean;
    error?: string;
}) {
    const handleClose = () => {
        if (!isPending) onClose();
    }

    return (
        <BottomSheet open={open} onClose={handleClose} title={title}>
            <div className='confirm-sheet'>
                <p className='confirm-sheet-message'>{message}</p>
                {error && <p className='confirm-sheet-error'>{error}</p>}
                <Button
                    variant='danger'
                    type='button'
                    size='large'
                    onClick={onConfirm}
                    disabled={isPending}
                >
                    {isPending ? pendingLabel : confirmLabel}
                </Button>
            </div>
        </BottomSheet>
    );
}

export default ConfirmSheet;
