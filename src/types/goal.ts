import type {GoalStatus} from "./enums.ts";

export interface HouseholdMemberSimple {
    id: string;
    user: {
        id: string;
        firstName: string;
        avatarUrl: string | null;
    };
    points: number;
}

export interface GoalContribution {
    id: string;
    member: HouseholdMemberSimple;
    rewardedPoints: number;
}

export interface Goal {
    id: string;
    householdId: string;
    goalPoints: number;
    title: string;
    description: string | null;
    completionDate: string | null;
    currentPoints: number;
    status: GoalStatus;
    contributions: GoalContribution[];
}

export interface GoalSimple {
    id: string;
    householdId: string;
    goalPoints: number;
    title: string;
    status: GoalStatus;
}

export interface GoalRequest {
    goalPoints: number;
    title: string;
    description?: string;
}

export interface GoalPatch {
    goalPoints?: number;
    title?: string;
    description?: string;
    status?: GoalStatus;
}
