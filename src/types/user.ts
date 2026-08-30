export interface SimpleUser {
    id: string;
    firstName: string;
    avatarUrl: string;
}

export interface User extends SimpleUser {
    lastName: string;
    householdIds: string[];
}

export interface UserInput {
    firstName: string;
    lastName: string;
    avatar?: File;
}