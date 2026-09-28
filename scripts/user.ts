//user.ts
import type { Role , Gender } from "./role";

export interface User{
    id:string;
    name: string ;
    email: string ;
    password: string ;
    gender: Gender;
    role: Role;
}

const USERS_KEY = "users";

export function getUsers():User[]{
    const storedUsers = localStorage.getItem(USERS_KEY);
    if(!storedUsers){
        return [];
    }

    return JSON.parse(storedUsers) as User[];
}

export function saveUsers(users : User[] ) : void{
    localStorage.setItem(USERS_KEY,JSON.stringify(users));
}

export function initializeUsers(): void {
    const existingUsers = localStorage.getItem(USERS_KEY);
    if (!existingUsers) {
        const initializeAdmin: User = {
            id: "1",
            name: "Admin",
            email: "admin@gmail.com",
            password: "Admin@123",
            gender: "prefer-not-to-say",
            role: "admin"
        };

        saveUsers([initializeAdmin]);
        return;
    }
///\extra
    try {
        const users: User[] = JSON.parse(existingUsers);
        let updated = false;

        users.forEach((user) => {
            if (user.id === "1" && user.email.toLowerCase() === "admin@gmal.com") {
                user.email = "admin@gmail.com";
                updated = true;
            }
        });

        if (updated) {
            saveUsers(users);
        }
    } catch {
        // ignore parse errors
    }
}

const CURRENT_USER_KEY = "currentUser";

export function saveCurrentUser(user: User): void {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
    const data = sessionStorage.getItem(CURRENT_USER_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data) as User;
    } catch {
        return null;
    }
}

export function clearCurrentUser(): void {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem("role");
}

