import './QuestCard.css'
import type {TaskAssignment} from "../../../types/task.ts";
import {formatFrequency} from "../../../utils/frequency.ts";
import {formatDueDate, isDueDatePast} from "../../../utils/date.ts";
import Meter from "../../ui/meter/Meter.tsx";
import {EFFORT_LEVELS} from "../../../utils/effort.ts";
import {useCompleteTask} from "../../../hooks/tasks/useCompleteTask.ts";
import Checkbox from "../../ui/checkbox/Checkbox.tsx";
import {Link} from "react-router";

function QuestCard({item, householdId, memberId, preview = false}: {
    item: TaskAssignment,
    householdId?: string,
    memberId: string | undefined,
    preview?: boolean
}) {
    const isLate = item.dueDate ? isDueDatePast(item.dueDate) : false;

    const completeTask = useCompleteTask(householdId);

    const handleComplete = () => {
        if (!memberId) return;
        completeTask.mutate({assignmentId: item.id, completedByMemberId: memberId});
    }

    return (
        <li className={`quest-card${isLate ? ' quest-card--late' : ''}`}>
            <div className='quest-card-header'>
                <Checkbox
                    checked={completeTask.isPending}
                    onClick={handleComplete}
                    disabled={completeTask.isPending || !memberId}
                />
                <div className='quest-card-title'>
                    {preview ? (
                        <p className='quest-title'>{item.task.title}</p>
                    ) : (
                        <Link to={`/quests/${item.task.id}`} className='quest-card-link'>
                            <p className='quest-title'>{item.task.title}</p>
                        </Link>
                    )}
                    <div className='quest-card-meta'>
                        <p>{formatFrequency(item.task.frequency)}</p>
                        <p>-</p>
                        <Meter filled={EFFORT_LEVELS[item.task.effort]} total={3}/>
                    </div>
                </div>
                <p className='points'>+{item.task.defaultPoints}</p>
            </div>
            <div className='quest-card-body'>
                <p>{item.user.firstName}</p>
                {item.dueDate &&
                    <>
                        <p>-</p>
                        <p className={isLate ? 'due-date--late' : undefined}>{formatDueDate(item.dueDate)}</p>
                    </>
                }
            </div>
            {completeTask.isError &&
                <p className='quest-card-error'>Couldn't complete this quest. Please try again.</p>
            }
        </li>
    );
}

export default QuestCard;