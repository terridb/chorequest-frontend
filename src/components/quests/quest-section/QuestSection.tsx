import './QuestSection.css';
import QuestCard from "../quest-card/QuestCard.tsx";
import SectionTitle from "../../ui/section-title/SectionTitle.tsx";
import type {TaskAssignment} from "../../../types/task.ts";
import type {HouseholdMember} from "../../../types/household.ts";

function QuestSection({householdId, members, assignments, title, danger = false}: {
    householdId: string;
    members: HouseholdMember[];
    assignments: TaskAssignment[];
    title: string;
    danger?: boolean;
}) {

    const findMemberId = (assignment: TaskAssignment): string | undefined =>
        members.find(member => member.user.id === assignment.user.id)?.id;

    return (
        <section className='inner-container quest-section'>
            <SectionTitle danger={danger}>
                {title} x{assignments.length}
            </SectionTitle>
            <ul className='quest-section-list'>
                {assignments.map((assignment) =>
                    <QuestCard
                        item={assignment}
                        key={assignment.id}
                        householdId={householdId}
                        memberId={findMemberId(assignment)}
                    />
                )}
            </ul>
        </section>
    );
}

export default QuestSection;