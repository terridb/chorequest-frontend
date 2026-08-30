import type {GoalStatus} from "./enums.ts";
import type {HouseholdMember} from "./household.ts";

export interface SimpleGoal {
    id: string;
    householdId: string;
    goalPoints: number;
    title: string;
    status: GoalStatus;
}

export interface Goal extends SimpleGoal {
    description: string;
    completionDate: string;
    currentPoints: number;
    contributions: SimpleGoalContribution[];
}

export interface SimpleGoalContribution {
    id: string;
    member: HouseholdMember;
    points: number;
}

export interface GoalContribution extends SimpleGoalContribution {
    goal: SimpleGoal;
}

export interface GoalInput {
    goalPoints: number;
    title: string;
    description?: string;
}

export interface GoalPatchInput {
    goalPoints?: number;
    title?: string;
    description?: string;
    status?: GoalStatus;
}