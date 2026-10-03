import type {HouseholdMember} from "../../types/household.ts";
import Avatar from "../avatar/Avatar.tsx";
import OptionCard from "../option-card/OptionCard.tsx";
import OptionContainer from "../option-container/OptionContainer.tsx";

function MemberPicker({members, value, onChange}: {
    members: HouseholdMember[];
    value?: string;
    onChange: (memberId: string) => void;
}) {
    return (
        <OptionContainer>
            {members.map(member => (
                <OptionCard
                    key={member.id}
                    icon={
                        <Avatar
                            src={member.user.avatarUrl}
                            name={member.user.firstName}
                            seed={member.id}
                            selected={member.id === value}
                        />
                    }
                    label={member.user.firstName}
                    selected={member.id === value}
                    onClick={() => onChange(member.id)}
                />
            ))}
        </OptionContainer>
    );
}

export default MemberPicker;
