import type {HouseholdInviteStatus} from "./enums.ts";

export interface HouseholdInvite {
    id: string;
    code: string;
    expiresAt: string;
    status: HouseholdInviteStatus;
}

export interface HouseholdInvitePreview {
    householdName: string;
}
