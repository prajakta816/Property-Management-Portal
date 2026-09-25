export type Role = "admin"|"agent"|"commission-manager"

export function saveRole(role : Role) : void {
    sessionStorage.setItem("role" , role);
}

export function getRole(): Role | null{
    const storedRole = sessionStorage.getItem("role");

    if(storedRole ===  "admin" || storedRole === "agent" || storedRole === "commission-manager")
        {
        return storedRole;
        }
        return null;
}