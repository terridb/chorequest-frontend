import type {HouseholdMemberRole, HouseholdType} from "./enums.ts";
import type {SimpleUser} from "./user.ts";

export interface Household {
    id: string;
    name: string;
    householdType: HouseholdType;
    photoUrl: string;
    city: string;
    zipcode: string;
    members: HouseholdMember[];
}

export interface HouseholdMember {
    id: string;
    user: SimpleUser;
    points: number;
    role: HouseholdMemberRole;
}

export interface HouseholdInput {
    name: string;
    type: HouseholdType;
    photo?: File;
    city?: string;
    zipcode?: string;
}