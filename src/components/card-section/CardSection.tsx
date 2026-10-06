import './CardSection.css';
import Card from "../card/Card.tsx";
import SectionTitle from "../section-title/SectionTitle.tsx";
import type {TaskAssignment} from "../../types/task.ts";
import type {HouseholdMember} from "../../types/household.ts";

function CardSection({householdId, members, assignments, title}: {
    householdId: string;
    members: HouseholdMember[];
    assignments: TaskAssignment[];
    title: string;
}) {

    const findMemberId = (assignment: TaskAssignment): string | undefined =>
        members.find(member => member.user.id === assignment.user.id)?.id;

    return (
        <section className='inner-container quest-card-section'>
            <SectionTitle danger={title === 'late'}>
                {title} x{assignments.length}
            </SectionTitle>
            <ul className='quests-list'>
                {assignments.map((assignment) =>
                    <Card
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

export default CardSection;