import type {HouseholdMember} from "../../../types/household.ts";
import type {PickerOption} from "./OptionPicker.tsx";
import Avatar from "../avatar/Avatar.tsx";

export function toMemberOptions(members: HouseholdMember[]): PickerOption<string>[] {
    return members.map(member => ({
        value: member.id,
        label: member.user.firstName,
        icon: <Avatar src={member.user.avatarUrl} name={member.user.firstName} seed={member.id}/>,
    }));
}
