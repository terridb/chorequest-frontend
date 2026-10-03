import type { AssignmentStrategy, Effort, Frequency } from './enums';
import type {SimpleUser} from "./user.ts";

export interface Task {
    id: string;
    title: string;
    description: string;
    effort: Effort;
    frequency: Frequency;
    startingDate: string;
    alwaysSameDay: boolean;
    defaultPoints: number;
    strategy: AssignmentStrategy;
    responsibleMemberId: string;
    householdId: string;
}

export interface TaskAssignment {
    id: string;
    task: Task;
    user: SimpleUser;
    dueDate: string;
}

export interface TaskCompletion {
    id: string;
    completedAt: string;
    rewardedPoints: number;
    taskAssignment: TaskAssignment;
    completedBy: SimpleUser;
}

export interface TaskInput {
    title: string;
    description?: string;
    effort: Effort;
    frequency: Frequency;
    startingDate: string;
    alwaysSameDay?: boolean;
    strategy: AssignmentStrategy;
    responsibleMemberId?: string;
}

export type TaskPatchInput = Partial<TaskInput>;

export interface TaskCompletionInput {
    completedByMemberId: string;
}

export interface EffortDetail {
    effort: Effort;
    points: number;
}
