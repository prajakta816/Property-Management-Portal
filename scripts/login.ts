import { getUsers, initializeUsers, saveCurrentUser } from "./user.js";
import { saveRole } from "./role.js";
import { isValidEmail, isValidPassword } from "./validation.js";
import { adminUrl, agentUrl, commissionUrl } from "./constant.js";
import { showLoader, hideLoader } from "./loader.js";

const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const emailInput = document.getElementById("emailInput") as HTMLInputElement;
const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;

const emailErrorMessage = document.getElementById("emailErrorMessage") as HTMLDivElement;
const passwordErrorMessage = document.getElementById("passwordErrorMessage") as HTMLDivElement;
const loginErrorMessage = document.getElementById("loginErrorMessage") as HTMLDivElement;

const togglePasswordButton = document.getElementById("togglePasswordButton") as HTMLButtonElement;
const passwordEyeSlash = document.getElementById("passwordEyeSlash") as HTMLElement;

if (!passwordEyeSlash) {
    throw new Error("passwordEyeSlash not found");
}

function waitForTwoSeconds(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

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

    passwordInput.type = "password";
    passwordEyeSlash.style.display = "none";

    togglePasswordButton.setAttribute("aria-label", "Show password");

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

// We don't validate while typing because errors should appear only after Login is clicked.
emailInput.addEventListener("input", () => {
    hideLoginError();
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

// Same here, typing should not trigger validation before clicking Login.
passwordInput.addEventListener("input", () => {
    hideLoginError();
});

// The eye icon only changes the password visibility.
togglePasswordButton.addEventListener("click", () => {
    const isPasswordHidden = passwordInput.type === "password";

    passwordInput.type = isPasswordHidden ? "text" : "password";
    passwordEyeSlash.style.display = isPasswordHidden ? "block" : "none";

    togglePasswordButton.setAttribute(
        "aria-label",
        isPasswordHidden ? "Hide password" : "Show password"
    );
});

if (!loginForm) {
    throw new Error("loginForm not found");
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideLoginError();

    // Validation now happens only when the user clicks Login.
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    // The loader starts only after both fields pass validation.
    showLoader();

    try {
        await waitForTwoSeconds();

        const users = getUsers();
        const enteredEmail = emailInput.value.trim().toLowerCase();
        const enteredPassword = passwordInput.value.trim();

        const selectedUser = users.find(
            (user) =>
                user.email.toLowerCase() === enteredEmail ||
                (enteredEmail === "admin@gmail.com" &&
                    user.email.toLowerCase() === "admin@gmal.com")
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
                window.location.href = adminUrl;
                break;

            case "agent":
                window.location.href = agentUrl;
                break;

            case "commission-manager":
                window.location.href = commissionUrl;
                break;

            default:
                loginErrorMessage.textContent =
                    "Unrecognized user role. Please contact administrator.";
                loginErrorMessage.classList.remove("d-none");
        }
    } finally {
        // The loader is always removed after login processing finishes.
        hideLoader();
    }
});