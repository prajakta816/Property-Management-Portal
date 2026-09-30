const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

import { isGender, isRole } from "./role.js";
import type { Role , Gender} from "./role.js";

export function isValidName(name : string): boolean{
    return nameRegex.test(name.trim());
}

export function isValidEmail(email : string) : boolean{
    return emailRegex.test(email.trim());
}

export function isValidPassword(password : string) : boolean{
    return passwordRegex.test(password.trim());
}

export function isValidRole(value : string) : value is Role{
    return  isRole(value);
}

export function isValidGender(value : string) : value is Gender{
    return isGender(value);
}