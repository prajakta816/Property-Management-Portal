const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
import type { Role , Gender} from "./role";

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
    return(
        value === "admin" || value === "agent" || value ==="commission-manager"
    )
}

export function isValidGender(value : string) : value is Gender{
    return(
        value==="male" || value==="female" || value==="other" || value==="prefer-not-to-say"
        )
}