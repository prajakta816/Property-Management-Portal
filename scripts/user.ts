import type { Role , Gender } from "./role";

export interface User{
    id:string;
    name: string ;
    email: string ;
    password: string ;
    gender: string;
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

export function initializeUsers(): void{
    const existingUsers = localStorage.getItem(USERS_KEY);
    if(existingUsers){
        return ;
    }

    const initializeAdmin : User = {
        id:"1",
        name:"admin",
        email:"admin@gmal.com",
        password:"admin@123",
        gender:"prefere-not-to-say",
        role:"admin"
        }

        saveUsers([initializeAdmin]);
}
