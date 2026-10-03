import './Card.css'
import type {TaskAssignment} from "../../types/task.ts";
import {formatFrequency} from "../../utils/frequency.ts";
import {formatDueDate, isDueDatePast} from "../../utils/date.ts";
import EffortMeter from "../effort-meter/EffortMeter.tsx";

function Card({item}: { item: TaskAssignment }) {
    const isLate = item.dueDate ? isDueDatePast(item.dueDate) : false;

    return (
        <li className={`quest-card${isLate ? ' quest-card--late' : ''}`}>
            <div className='quest-card-header'>
                <span className='checkbox'></span>
                <div className='quest-card-title'>
                    <p className='quest-title'>{item.task.title}</p>
                    <div className='quest-details'>
                        <p>{formatFrequency(item.task.frequency)}</p>
                        <p>-</p>
                        <EffortMeter effort={item.task.effort}/>
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
        </li>
    );
}

export default Card;