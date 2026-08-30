import './Card.css'
import type {TaskAssignment} from "../../types/task.ts";
import {formatDueDate, formatFrequency} from "../../utils/frequency.ts";
import EffortMeter from "../effort-meter/EffortMeter.tsx";

function Card({item}: { item: TaskAssignment }) {

    return (
        <li className='quest-card'>
            <div className='quest-card-header'>
                <span className='checkbox'></span>
                <div className='quest-card-title'>
                    <p className='quest-title'>{item.task.title}</p>
                    <div className='quest-details'>
                        <p>{formatFrequency(item.task.frequency)}</p>
                        <span>-</span>
                        <EffortMeter effort={item.task.effort}/>
                    </div>
                </div>
                <p className='points'>+{item.task.defaultPoints}</p>
            </div>
            <div className='quest-card-body'>
                <p>{item.user.firstName}</p>
                {item.dueDate &&
                    <>
                        <span>-</span>
                        <p>{formatDueDate(item.dueDate)}</p>
                    </>
                }
            </div>
        </li>
    );
}

export default Card;