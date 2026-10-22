import './AddAdminSheet.css'
import type {HouseholdMember} from "../../../types/household.ts";
import BottomSheet from "../../ui/bottom-sheet/BottomSheet.tsx";
import Button from "../../ui/button/Button.tsx";
import OptionPicker from "../../ui/option-picker/OptionPicker.tsx";
import {toMemberOptions} from "../../ui/option-picker/memberOptions.tsx";

function AddAdminSheet({open, onClose, members, selectedId, onSelect, onConfirm, isPending = false, error}: {
    open: boolean;
    onClose: () => void;
    members: HouseholdMember[];
    selectedId: string | null;
    onSelect: (memberId: string) => void;
    onConfirm: () => void;
    isPending?: boolean;
    error?: string;
}) {
    const selected = members.find(member => member.id === selectedId);

    const handleClose = () => {
        if (!isPending) onClose();
    }

    return (
        <BottomSheet open={open} onClose={handleClose} title='Add admin'>
            <div className='add-admin-sheet'>
                <p className='add-admin-sheet-message'>Choose a housemate to make admin. This can't be undone.</p>
                <OptionPicker options={toMemberOptions(members)} value={selectedId ?? undefined} onChange={onSelect}/>
                {error && <p className='add-admin-sheet-error'>{error}</p>}
                <Button
                    variant='primary'
                    type='button'
                    size='large'
                    onClick={onConfirm}
                    disabled={!selected || isPending}
                >
                    {isPending ? 'Adding...' : selected ? `Make ${selected.user.firstName} admin` : 'Make admin'}
                </Button>
            </div>
        </BottomSheet>
    );
}

export default AddAdminSheet;
