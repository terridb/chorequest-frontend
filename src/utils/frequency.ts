import type {Frequency} from "../types/enums.ts";
import type {Task} from "../types/task.ts";
import {formatDayAndMonth, formatDayOfMonth, formatWeekday, parseLocalDate} from "./date.ts";

export type RepeatingFrequency = Exclude<Frequency, 'AS_NEEDED' | 'ONCE'>;

export type FrequencyUnit = 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';

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

const FREQUENCY_SCHEDULES: Record<RepeatingFrequency, { unit: FrequencyUnit, interval: number }> = {
    DAILY: {unit: 'DAYS', interval: 1},
    EVERY_OTHER_DAY: {unit: 'DAYS', interval: 2},
    EVERY_THREE_DAYS: {unit: 'DAYS', interval: 3},
    EVERY_FOUR_DAYS: {unit: 'DAYS', interval: 4},
    WEEKLY: {unit: 'WEEKS', interval: 1},
    EVERY_OTHER_WEEK: {unit: 'WEEKS', interval: 2},
    MONTHLY: {unit: 'MONTHS', interval: 1},
    EVERY_TWO_MONTHS: {unit: 'MONTHS', interval: 2},
    EVERY_THREE_MONTHS: {unit: 'MONTHS', interval: 3},
    EVERY_SIX_MONTHS: {unit: 'MONTHS', interval: 6},
    YEARLY: {unit: 'YEARS', interval: 1},
};

const UNIT_SINGULAR: Record<FrequencyUnit, string> = {
    DAYS: 'day',
    WEEKS: 'week',
    MONTHS: 'month',
    YEARS: 'year',
};

export function formatFrequency(frequency: Frequency): string {
    return FREQUENCY_LABELS[frequency];
}

export function isRepeatingFrequency(frequency: Frequency): frequency is RepeatingFrequency {
    return frequency !== 'AS_NEEDED' && frequency !== 'ONCE';
}

export function getFrequencySchedule(frequency: RepeatingFrequency): { unit: FrequencyUnit, interval: number } {
    return FREQUENCY_SCHEDULES[frequency];
}

export function getFrequenciesForUnit(unit: FrequencyUnit): RepeatingFrequency[] {
    return (Object.keys(FREQUENCY_SCHEDULES) as RepeatingFrequency[])
        .filter(frequency => FREQUENCY_SCHEDULES[frequency].unit === unit);
}

// "every week", "every 2 weeks"
export function formatRecurrence(frequency: RepeatingFrequency): string {
    const {unit, interval} = FREQUENCY_SCHEDULES[frequency];
    return interval === 1
        ? `every ${UNIT_SINGULAR[unit]}`
        : `every ${interval} ${UNIT_SINGULAR[unit]}s`;
}

// "Weekly · Mondays", "Monthly · on the 14th", "Every 3 days"
// The day is only shown when the quest always lands on the same day, otherwise it drifts with each completion
export function formatSchedule({frequency, startingDate, alwaysSameDay}: Pick<Task, 'frequency' | 'startingDate' | 'alwaysSameDay'>): string {
    const label = formatFrequency(frequency);
    if (!isRepeatingFrequency(frequency) || !alwaysSameDay) return label;

    const date = parseLocalDate(startingDate);
    switch (FREQUENCY_SCHEDULES[frequency].unit) {
        case 'DAYS':
            return label;
        case 'WEEKS':
            return `${label} · ${formatWeekday(date)}s`;
        case 'MONTHS':
            return `${label} · on the ${formatDayOfMonth(date)}`;
        case 'YEARS':
            return `${label} · on ${formatDayAndMonth(date)}`;
    }
}
