import type {Effort} from "../types/enums.ts";

export const EFFORT_LEVELS: Record<Effort, number> = {
    NONE: 0,
    SMALL: 1,
    MEDIUM: 2,
    BIG: 3,
};

export const EFFORT_HINTS: Record<Effort, string> = {
    NONE: 'Just needs tracking',
    SMALL: 'Under 10 min',
    MEDIUM: '10-30 min',
    BIG: '30 min or more',
};
