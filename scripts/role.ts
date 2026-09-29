export type Role = "admin"|"agent"|"commission-manager";

export type Gender = "male"|"female"|"other"|"prefer-not-to-say";

const roles: Role[] = [
    "admin",
    "agent",
    "commission-manager"
];

const genders: Gender[] = [
    "male",
    "female",
    "other",
    "prefer-not-to-say"
];

export function getRoles(): Role[] {
    return [...roles];
}

export function getGenders(): Gender[] {
    return [...genders];
}

//to remove hardcode values of genders in validation.ts we are using these logic
export function isGender(value:string):value is Gender{
return genders.includes(value as Gender)
}

//to remove hardcoded values of validation.ts for role 
export function isRole(value : string): value is Role{
    return roles.includes(value as Role)
}
export function saveRole(role: Role): void {
    sessionStorage.setItem("role", role);
}

export function getRole(): Role | null {
    const storedRole = sessionStorage.getItem("role");

    if (storedRole && roles.includes(storedRole as Role)) {
        return storedRole as Role;
    }

    return null;
}