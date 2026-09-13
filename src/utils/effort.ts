import type {Effort} from "../types/enums.ts";

const EFFORT_LABELS: Record<Effort, string> = {
    NONE: 'None',
    SMALL: 'Small',
    MEDIUM: 'Medium',
    BIG: 'Big',
};

export function formatEffort(effort: Effort): string {
    return EFFORT_LABELS[effort];
}
