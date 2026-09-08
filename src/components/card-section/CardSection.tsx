import './CardSection.css';
import Card from "../card/Card.tsx";
import type {TaskAssignment} from "../../types/task.ts";

function CardSection({assignments, title}: { assignments: TaskAssignment[]; title: string }) {
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
                    />
                )}
            </ul>
        </section>
    );
}

export default CardSection;