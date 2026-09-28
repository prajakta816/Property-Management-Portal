import { getUsers, initializeUsers, saveCurrentUser } from "./user.js";
import { saveRole } from "./role.js";
import { isValidEmail, isValidPassword } from "./validation.js";

const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const emailInput = document.getElementById("emailInput") as HTMLInputElement;
const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;

const emailErrorMessage = document.getElementById("emailErrorMessage") as HTMLDivElement;
const passwordErrorMessage = document.getElementById("passwordErrorMessage") as HTMLDivElement; 
const loginErrorMessage = document.getElementById("loginErrorMessage") as HTMLDivElement;
const togglePasswordBtn = document.getElementById("togglePasswordBtn") as HTMLButtonElement | null;

// Ensure default admin user is initialized if empty
initializeUsers();

function hideLoginError(): void {
    if (loginErrorMessage) {
        loginErrorMessage.textContent = "";
        loginErrorMessage.classList.add("d-none");
    }
}

function resetLoginForm(): void {
    if (loginForm) {
        loginForm.reset();
    }
    emailInput.value = "";
    passwordInput.value = "";
    emailInput.classList.remove("is-valid", "is-invalid");
    passwordInput.classList.remove("is-valid", "is-invalid");
    emailErrorMessage.textContent = "";
    passwordErrorMessage.textContent = "";
    hideLoginError();
}

// Always clear fields on initial load and when navigating back
resetLoginForm();
window.addEventListener("pageshow", () => {
    resetLoginForm();
});

function validateEmail(): boolean {
    const email = emailInput.value.trim();

    if (email === "") {
        emailErrorMessage.textContent = "Fill your email";
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
        return false;
    }

    if (!isValidEmail(email)) {
        emailErrorMessage.textContent = "Enter a valid email";
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
        return false;
    }

    emailErrorMessage.textContent = "";
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");

    return true;
}

emailInput.addEventListener("input", () => {
    hideLoginError();
    validateEmail();
});

emailInput.addEventListener("blur", () => {
    validateEmail();
});

function validatePassword(): boolean {
    const password = passwordInput.value.trim();

    if (password === "") {
        passwordErrorMessage.textContent = "Fill your password";
        passwordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        return false;
    }

    if (!isValidPassword(password)) {
        passwordErrorMessage.textContent =
            "Password must be at least 8 characters with uppercase, lowercase, number and special character";
        passwordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        return false;
    }

    passwordErrorMessage.textContent = "";
    passwordInput.classList.remove("is-invalid");
    passwordInput.classList.add("is-valid");

    return true;
}

passwordInput.addEventListener("input", () => {
    hideLoginError();
    validatePassword();
});

passwordInput.addEventListener("blur", () => {
    validatePassword();
});

// Show / Hide Password toggle if button exists
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        togglePasswordBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
        togglePasswordBtn.innerHTML = isPassword
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>`;
    });
}

if (!loginForm) {
    throw new Error("loginForm not found");
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideLoginError();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    const users = getUsers();
    const enteredEmail = emailInput.value.trim().toLowerCase();
    const enteredPassword = passwordInput.value.trim();

    const selectedUser = users.find(
        (user) =>
            user.email.toLowerCase() === enteredEmail ||
            (enteredEmail === "admin@gmail.com" && user.email.toLowerCase() === "admin@gmal.com")
    );

    if (!selectedUser || selectedUser.password !== enteredPassword) {
        loginErrorMessage.textContent = "Invalid email or password";
        loginErrorMessage.classList.remove("d-none");
        return;
    }

    // Save session data
    saveCurrentUser(selectedUser);
    saveRole(selectedUser.role);

    // Clear inputs so credentials do not linger in the form
    resetLoginForm();

    // Redirect to the respective role dashboard
    switch (selectedUser.role) {
        case "admin":
            window.location.href = "admin-dashboard.html";
            break;
        case "agent":
            window.location.href = "agent-dashboard.html";
            break;
        case "commission-manager":
            window.location.href = "commission-dashboard.html";
            break;
        default:
            loginErrorMessage.textContent = "Unrecognized user role. Please contact administrator.";
            loginErrorMessage.classList.remove("d-none");
    }
});