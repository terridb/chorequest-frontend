import './EffortMeter.css'
import type {Effort} from "../../types/enums.ts";

const EFFORT_LEVELS: Record<Effort, number> = {
    NONE: 0,
    SMALL: 1,
    MEDIUM: 2,
    BIG: 3,
};

function EffortMeter({effort}: { effort: Effort }) {
    const filled = EFFORT_LEVELS[effort];

    return (
        <span className='effort-meter'>
            {Array.from({length: 3}, (_, i) =>
                <span
                    className={i < filled ? 'effort-square filled' : 'effort-square'}
                    key={i}
                />
            )}
        </span>
    );
}

export default EffortMeter;
