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