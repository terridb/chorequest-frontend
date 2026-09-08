import type {Frequency} from "../types/enums.ts";

const FREQUENCY_LABELS: Record<Frequency, string> = {
    AS_NEEDED: 'As needed',
    ONCE: 'Once',
    DAILY: 'Daily',
    EVERY_OTHER_DAY: 'Every other day',
    EVERY_THREE_DAYS: 'Every 3 days',
    EVERY_FOUR_DAYS: 'Every 4 days',
    WEEKLY: 'Weekly',
    EVERY_OTHER_WEEK: 'Every other week',
    MONTHLY: 'Monthly',
    EVERY_TWO_MONTHS: 'Every 2 months',
    EVERY_THREE_MONTHS: 'Every 3 months',
    EVERY_SIX_MONTHS: 'Every 6 months',
    YEARLY: 'Yearly',
};

export function formatFrequency(frequency: Frequency): string {
    return FREQUENCY_LABELS[frequency];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

export function isDueDateToday(dueDate: string): boolean {
    return startOfDay(new Date(dueDate)).getTime() === startOfDay(new Date()).getTime();
}

export function isDueDatePast(dueDate: string): boolean {
    return startOfDay(new Date(dueDate)).getTime() < startOfDay(new Date()).getTime();
}

export function isDueDateFuture(dueDate: string): boolean {
    return startOfDay(new Date(dueDate)).getTime() > startOfDay(new Date()).getTime();
}

export function formatDueDate(dueDate: string): string {
    const due = startOfDay(new Date(dueDate));
    const today = startOfDay(new Date());

    const diffDays = Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);

    if (isDueDatePast(dueDate)) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} late`;
    if (diffDays === 0) return 'due today';
    if (diffDays === 1) return 'due tomorrow';
    return `due in ${diffDays} days`;
}