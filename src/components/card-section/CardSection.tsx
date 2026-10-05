import './CardSection.css';
import Card from "../card/Card.tsx";
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
        <section className='quest-card-section'>
            <h4 className={`quest-section-title${title === 'late' ? ' quest-section-title--late' : ''}`}>
                {title} x{assignments.length}
            </h4>
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