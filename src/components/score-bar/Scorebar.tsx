import './Scorebar.css'
import type {Goal} from "../../types/goal.ts";
import {useEffect, useRef, useState} from "react";

// If CSS changes, these need to change too.
const BLOCK_WIDTH = 14;
const BLOCK_GAP = 3;

function Scorebar({title, goal}: {title: string, goal: Goal}) {
    const barRef = useRef<HTMLDivElement>(null);
    const [totalBlocks, setTotalBlocks] = useState(0);

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            const count = Math.floor((width + BLOCK_GAP) / (BLOCK_WIDTH + BLOCK_GAP));
            setTotalBlocks(Math.max(count, 1));
        });

        observer.observe(bar);
        return () => observer.disconnect();
    }, []);

    const progress = Math.min(goal.currentPoints / goal.goalPoints, 1);
    const activeBlocks = Math.round(progress * totalBlocks);

    return (
        <div className='score-bar-wrapper'>
            <div className='score-bar-title-wrapper'>
                <span>{title}</span>
                <div className='score-bar-points-wrapper'>
                    <span className='score-bar-points-current'>{goal.currentPoints}</span>
                    <span className='score-bar-points-goal'>/{goal.goalPoints}</span>
                </div>
            </div>
            <div className='score-bar' ref={barRef}>
                {Array.from({length: totalBlocks}, (_, i) => (
                    <span key={i} className={`score-bar-block${i < activeBlocks ? '' : ' inactive'}`}></span>
                ))}
            </div>
        </div>
    );
}

export default Scorebar;