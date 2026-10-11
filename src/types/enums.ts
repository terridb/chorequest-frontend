export type AssignmentStrategy = 'SOLO' | 'ROTATING';

export const ASSIGNMENT_STRATEGIES: AssignmentStrategy[] = ['SOLO', 'ROTATING'];

export type Effort = 'NONE' | 'SMALL' | 'MEDIUM' | 'BIG';

export const EFFORTS: Effort[] = ['NONE', 'SMALL', 'MEDIUM', 'BIG'];

export type Frequency =
    | 'AS_NEEDED'
    | 'ONCE'
    | 'DAILY'
    | 'EVERY_OTHER_DAY'
    | 'EVERY_THREE_DAYS'
    | 'EVERY_FOUR_DAYS'
    | 'WEEKLY'
    | 'EVERY_OTHER_WEEK'
    | 'MONTHLY'
    | 'EVERY_TWO_MONTHS'
    | 'EVERY_THREE_MONTHS'
    | 'EVERY_SIX_MONTHS'
    | 'YEARLY';

export const FREQUENCIES: Frequency[] = [
    'AS_NEEDED', 'ONCE', 'DAILY', 'EVERY_OTHER_DAY', 'EVERY_THREE_DAYS', 'EVERY_FOUR_DAYS',
    'WEEKLY', 'EVERY_OTHER_WEEK', 'MONTHLY', 'EVERY_TWO_MONTHS', 'EVERY_THREE_MONTHS',
    'EVERY_SIX_MONTHS', 'YEARLY',
];

export type HouseholdType = 'COUPLE' | 'FAMILY' | 'SHARED';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type HouseholdMemberRole = 'ADMIN' | 'MEMBER';
