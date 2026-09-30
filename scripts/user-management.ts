// user-management.ts
import { getRole ,getGenders,getRoles} from "./role.js";

// Gender options come from role.ts so the form and filter use the same source.
function populateGenders(): void {
    const genders = getGenders();

    genderSelect.innerHTML = `<option value="">Select Gender</option>`;
    genderFilter.innerHTML = `<option value="">All Gender</option>`;

    genders.forEach((gender) => {
        const option = document.createElement("option");

        option.value = gender;
        option.textContent = gender === "prefer-not-to-say"
            ? "Prefer not to say"
            : gender.charAt(0).toUpperCase() + gender.slice(1);

        genderSelect.appendChild(option);

        const filterOption = document.createElement("option");

        filterOption.value = gender;
        filterOption.textContent = option.textContent;

        genderFilter.appendChild(filterOption);
    });
}

//Role options come from role.ts so the form and filter use the same source.
function populateRoles(): void{
    const roles = getRoles().filter((role)=>role != "admin");//now admin role will not be in any roe dropdown 
    
    roleSelect.innerHTML =  `<option value="">Select Role</option>`;
    roleFilter.innerHTML = `<option value="">All Role</option>`;

    roles.forEach((role) => {
    const option = document.createElement("option");
    
    option.value = role ;
    option.textContent = role === "commission-manager" ? "commission manager" :role.charAt(0).toUpperCase() + role.slice(1);

    roleSelect.appendChild(option);

    const filterOption = document.createElement("option");
   
    filterOption.value = role;
    filterOption.textContent = option.textContent;

    roleFilter.appendChild(filterOption);

    });
}

import { showLoader, hideLoader } from "./loader.js";
function waitForTwoSeconds(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

import { getCurrentUser, clearCurrentUser, getUsers, saveUsers, User } from "./user.js";
import { renderSidebar } from "./sidebar.js";
import { loginUrl } from "./constant.js";
import { isValidName, isValidEmail, isValidPassword, isValidGender, isValidRole } from "./validation.js";

// Check if user is logged in as admin.
const currentRole = getRole();

if (currentRole !== "admin") {
    alert("Access denied. Admin access only.");
    window.location.href = loginUrl;
}

renderSidebar("admin");

const currentUser = getCurrentUser();
const currentUserDisplay = document.getElementById("currentUserDisplay");

if (currentUserDisplay && currentUser) {
    currentUserDisplay.textContent = `${currentUser.name} (${currentUser.role})`;
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        clearCurrentUser();
        window.location.href = loginUrl;
    });
}

// We use one form for both Add and Edit.
// null means Add mode, while a user ID means Edit mode.
let currentEditId: string | null = null;

// During Edit, the old password is never displayed.
// An empty password during Edit means that the existing password should stay unchanged.
let originalPassword = "";

const userForm = document.getElementById("userForm") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const confirmPasswordInput = document.getElementById("confirmPassword") as HTMLInputElement;
const genderSelect = document.getElementById("gender") as HTMLSelectElement;
const roleSelect = document.getElementById("role") as HTMLSelectElement;

const clearRoleButton = document.getElementById("clearRoleButton") as HTMLButtonElement;
const clearGenderButton = document.getElementById("clearGenderButton") as HTMLButtonElement;

const togglePasswordButton = document.getElementById("togglePasswordButton") as HTMLButtonElement;
const toggleConfirmPasswordButton = document.getElementById("toggleConfirmPasswordButton") as HTMLButtonElement;

const searchUser = document.getElementById("searchUser") as HTMLInputElement;
const roleFilter = document.getElementById("roleFilter") as HTMLSelectElement;
const genderFilter = document.getElementById("genderFilter") as HTMLSelectElement;

const usersTableBody = document.getElementById("usersTableBody") as HTMLTableSectionElement;

const userModalTitle = document.getElementById("userModalTitle") as HTMLElement;
const addUserButton = document.getElementById("addUserButton") as HTMLButtonElement;

const viewUserModal = document.getElementById("viewUserModal") as HTMLDivElement;
const viewUserName = document.getElementById("viewUserName") as HTMLSpanElement;
const viewUserEmail = document.getElementById("viewUserEmail") as HTMLSpanElement;
const viewUserGender = document.getElementById("viewUserGender") as HTMLSpanElement;
const viewUserRole = document.getElementById("viewUserRole") as HTMLSpanElement;

const userModal = document.getElementById("userModal") as HTMLDivElement;

const nameError = document.getElementById("nameError") as HTMLDivElement;
const emailError = document.getElementById("emailError") as HTMLDivElement;
const passwordError = document.getElementById("passwordError") as HTMLDivElement;
const confirmPasswordError = document.getElementById("confirmPasswordError") as HTMLDivElement;
const genderError = document.getElementById("genderError") as HTMLDivElement;
const roleError = document.getElementById("roleError") as HTMLDivElement;

const totalUsers = document.getElementById("totalUsers") as HTMLElement;
const totalAgents = document.getElementById("totalAgents") as HTMLElement;
const totalManagers = document.getElementById("totalManagers") as HTMLElement;

declare const bootstrap: {
    Modal: {
        getInstance(element: HTMLElement): {
            hide(): void;
        } | null;
    };
};

// We reset all validation state when the same form is opened again.
// This prevents errors from a previous Add/Edit operation from appearing in a new form.
function clearValidationState(): void {
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    genderError.textContent = "";
    roleError.textContent = "";

    const fields = [
        nameInput,
        emailInput,
        passwordInput,
        confirmPasswordInput,
        genderSelect,
        roleSelect
    ];

    fields.forEach((field) => {
        field.classList.remove("is-valid", "is-invalid");
    });
}

// The password fields are always reset to hidden when Add/Edit starts.
function resetPasswordFields(): void {
    passwordInput.value = "";
    confirmPasswordInput.value = "";

    passwordInput.type = "password";
    confirmPasswordInput.type = "password";

    const passwordIcon = togglePasswordButton.querySelector("i") as HTMLElement;
    const confirmPasswordIcon = toggleConfirmPasswordButton.querySelector("i") as HTMLElement;

    passwordIcon.className = "bi bi-eye";
    confirmPasswordIcon.className = "bi bi-eye";

    togglePasswordButton.setAttribute("aria-label", "Show password");
    toggleConfirmPasswordButton.setAttribute("aria-label", "Show confirm password");
}

// Add mode starts with an empty form and an editable email field.
addUserButton.addEventListener("click", () => {
    currentEditId = null;
    originalPassword = "";

    userModalTitle.textContent = "Add User";

    userForm.reset();

    emailInput.readOnly = false;

    resetPasswordFields();
    clearValidationState();

    clearGenderButton.classList.remove("visible");
    clearRoleButton.classList.remove("visible");
});

// The browser password icon is not used because the project has its own Show/Hide control.
togglePasswordButton.addEventListener("click", () => {
    const passwordIcon = togglePasswordButton.querySelector("i") as HTMLElement;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.className = "bi bi-eye-slash";
        togglePasswordButton.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.type = "password";
        passwordIcon.className = "bi bi-eye";
        togglePasswordButton.setAttribute("aria-label", "Show password");
    }
});

toggleConfirmPasswordButton.addEventListener("click", () => {
    const confirmPasswordIcon = toggleConfirmPasswordButton.querySelector("i") as HTMLElement;

    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        confirmPasswordIcon.className = "bi bi-eye-slash";
        toggleConfirmPasswordButton.setAttribute("aria-label", "Hide confirm password");
    } else {
        confirmPasswordInput.type = "password";
        confirmPasswordIcon.className = "bi bi-eye";
        toggleConfirmPasswordButton.setAttribute("aria-label", "Show confirm password");
    }
});

userModal.addEventListener("hidden.bs.modal", () => {
    document.body.setAttribute("tabindex", "-1");
    document.body.focus();
});

function validateName(): boolean {
    const name = nameInput.value.trim();

    if (name === "") {
        nameError.textContent = "Fill your name";
        nameInput.classList.add("is-invalid");
        nameInput.classList.remove("is-valid");
        return false;
    }

    if (!isValidName(name)) {
        nameError.textContent = "Enter a valid name";
        nameInput.classList.add("is-invalid");
        nameInput.classList.remove("is-valid");
        return false;
    }

    nameError.textContent = "";
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");

    return true;
}

function validateEmail(): boolean {
    const email = emailInput.value.trim();

    if (email === "") {
        emailError.textContent = "Fill your email";
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
        return false;
    }

    if (!isValidEmail(email)) {
        emailError.textContent = "Enter a valid email";
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
        return false;
    }

    // Email is read-only during Edit, so duplicate checking is only needed when adding a new user.
    if (currentEditId === null) {
        const users = getUsers();

        const emailExists = users.some(
            (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExists) {
            emailError.textContent = "This email already exists";
            emailInput.classList.add("is-invalid");
            emailInput.classList.remove("is-valid");
            return false;
        }
    }

    emailError.textContent = "";
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");

    return true;
}

function validatePassword(): boolean {
    const password = passwordInput.value.trim();

    // During Edit, empty password means keep the existing password.
    if (currentEditId !== null && password === "") {
        passwordError.textContent = "";
        passwordInput.classList.remove("is-invalid", "is-valid");
        return true;
    }

    if (password === "") {
        passwordError.textContent = "Fill your password";
        passwordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        return false;
    }

    if (!isValidPassword(password)) {
        passwordError.textContent = "Password must be at least 8 characters with uppercase, lowercase, number and special character";
        passwordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        return false;
    }

    passwordError.textContent = "";
    passwordInput.classList.remove("is-invalid");
    passwordInput.classList.add("is-valid");

    return true;
}

function validateConfirmPassword(): boolean {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // During Edit, both fields can stay empty when the password is not being changed.
    if (currentEditId !== null && password === "" && confirmPassword === "") {
        confirmPasswordError.textContent = "";
        confirmPasswordInput.classList.remove("is-invalid", "is-valid");
        return true;
    }

    if (confirmPassword === "") {
        confirmPasswordError.textContent = "Confirm your password";
        confirmPasswordInput.classList.add("is-invalid");
        confirmPasswordInput.classList.remove("is-valid");
        return false;
    }

    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match";
        confirmPasswordInput.classList.add("is-invalid");
        confirmPasswordInput.classList.remove("is-valid");
        return false;
    }

    confirmPasswordError.textContent = "";
    confirmPasswordInput.classList.remove("is-invalid");
    confirmPasswordInput.classList.add("is-valid");

    return true;
}

function validateGender(): boolean {
    const gender = genderSelect.value;

    if (gender === "") {
        genderError.textContent = "Select your gender";
        genderSelect.classList.add("is-invalid");
        genderSelect.classList.remove("is-valid");
        return false;
    }

    if (!isValidGender(gender)) {
        genderError.textContent = "Select a valid gender";
        genderSelect.classList.add("is-invalid");
        genderSelect.classList.remove("is-valid");
        return false;
    }

    genderError.textContent = "";
    genderSelect.classList.remove("is-invalid");
    genderSelect.classList.add("is-valid");

    return true;
}

// Selection only clears old validation. It does not validate while the user is selecting.
genderSelect.addEventListener("change", () => {
    genderSelect.classList.remove("is-invalid", "is-valid");
    genderError.textContent = "";

    if (genderSelect.value !== "") {
        clearGenderButton.classList.add("visible");
    } else {
        clearGenderButton.classList.remove("visible");
    }
});

clearGenderButton.addEventListener("click", () => {
    genderSelect.value = "";
    clearGenderButton.classList.remove("visible");

    genderError.textContent = "";
    genderSelect.classList.remove("is-valid", "is-invalid");
});

function validateRole(): boolean {
    const role = roleSelect.value;

    if (role === "") {
        roleError.textContent = "Select a role";
        roleSelect.classList.add("is-invalid");
        roleSelect.classList.remove("is-valid");
        return false;
    }

    if (!isValidRole(role)) {
        roleError.textContent = "Select a valid role";
        roleSelect.classList.add("is-invalid");
        roleSelect.classList.remove("is-valid");
        return false;
    }

    roleError.textContent = "";
    roleSelect.classList.remove("is-invalid");
    roleSelect.classList.add("is-valid");

    return true;
}

// Selection only clears old validation. Actual validation happens when Save User is clicked.
roleSelect.addEventListener("change", () => {
    roleSelect.classList.remove("is-invalid", "is-valid");
    roleError.textContent = "";

    if (roleSelect.value !== "") {
        clearRoleButton.classList.add("visible");
    } else {
        clearRoleButton.classList.remove("visible");
    }
});

clearRoleButton.addEventListener("click", () => {
    roleSelect.value = "";
    clearRoleButton.classList.remove("visible");

    roleError.textContent = "";
    roleSelect.classList.remove("is-valid", "is-invalid");
});

// All form validation happens here so errors appear only after Save User is clicked.
userForm.addEventListener("submit", async(event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isGenderValid = validateGender();
    const isRoleValid = validateRole();

    if (
        !isNameValid ||
        !isEmailValid ||
        !isPasswordValid ||
        !isConfirmPasswordValid ||
        !isGenderValid ||
        !isRoleValid
    ) {
        return;
    }

    showLoader();
    try{
        await waitForTwoSeconds();
    const enteredPassword = passwordInput.value.trim();

    // During Edit, an empty password means the admin did not request a password change.
    const savedPassword =
        currentEditId !== null && enteredPassword === ""
            ? originalPassword
            : enteredPassword;

    const newUser: User = {
        id: currentEditId ?? Date.now().toString(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: savedPassword,
        gender: genderSelect.value as User["gender"],
        role: roleSelect.value as User["role"]
    };

    const users = getUsers();

    if (currentEditId !== null) {
        const userIndex = users.findIndex(
            (user) => user.id === currentEditId
        );

        if (userIndex !== -1) {
            users[userIndex] = newUser;
        }
    } else {
        users.push(newUser);
    }

    saveUsers(users);
    renderUsers();

    const modal = bootstrap.Modal.getInstance(userModal);

    if (modal) {
        modal.hide();
    }

    userForm.reset();
    currentEditId = null;
    originalPassword = "";

    console.log("User saved successfully");
}finally{
    hideLoader();
}
});

// Search and filters only refresh the displayed table.
searchUser.addEventListener("input", () => {
    renderUsers();
});

roleFilter.addEventListener("change", () => {
    renderUsers();
});

genderFilter.addEventListener("change", () => {
    renderUsers();
});

function updateSummaryCards(): void {
    const users = getUsers();

    const agents = users.filter(
        (user) => user.role === "agent"
    );

    const managers = users.filter(
        (user) => user.role === "commission-manager"
    );

    totalUsers.textContent = users.length.toString();
    totalAgents.textContent = agents.length.toString();
    totalManagers.textContent = managers.length.toString();
}

function renderUsers(): void {
    updateSummaryCards();

    const allUsers = getUsers();
    const searchText = searchUser.value.trim().toLowerCase();
    const selectedRole = roleFilter.value;
    const selectedGender = genderFilter.value;

    const users = allUsers.filter((user) => {
        const matchesSearch =
            (user.name || "").toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText);

        const matchesRole =
            selectedRole === "" || user.role === selectedRole;

        const matchesGender =
            selectedGender === "" || user.gender === selectedGender;

        return matchesSearch && matchesRole && matchesGender;
    });

    usersTableBody.innerHTML = "";

    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">No users found</td>
            </tr>
        `;

        return;
    }

    users.forEach((user) => {
        const row = document.createElement("tr");

        // Actions are grouped into one column to keep the table compact and easier to scan.
        row.innerHTML = `
            <td class="text-center">
                <div class="action-buttons">
                    <button type="button" class="btn btn-sm btn-primary user-action-button view-user" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#viewUserModal" title="View user" aria-label="View user">
                        <i class="bi bi-eye"></i>
                    </button>

                    ${user.id !== "1" ? `
                    <button type="button" class="btn btn-sm btn-warning user-action-button edit-user" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#userModal" title="Edit user" aria-label="Edit user">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button type="button" class="btn btn-sm btn-danger user-action-button delete-user" data-id="${user.id}" title="Delete user" aria-label="Delete user">
                        <i class="bi bi-trash"></i>
                    </button>
                    ` : ""}
                </div>
            </td>
            <td>${!user.name || user.name === "undefined" ? "Unknown" : user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
        `;

        usersTableBody.appendChild(row);
    });
}


populateRoles();
populateGenders();
renderUsers();

usersTableBody.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    const viewButton = target.closest(".view-user") as HTMLButtonElement | null;

    if (!viewButton) {
        return;
    }

    const userId = viewButton.dataset.id;

    if (!userId) {
        return;
    }

    const users = getUsers();
    const selectedUser = users.find((user) => user.id === userId);

    if (!selectedUser) {
        return;
    }

    viewUserName.textContent = selectedUser.name || "Unknown";
    viewUserEmail.textContent = selectedUser.email || "Unknown";
    viewUserGender.textContent = selectedUser.gender || "Unknown";
    viewUserRole.textContent = selectedUser.role || "Unknown";
});

usersTableBody.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    const editButton = target.closest(".edit-user") as HTMLButtonElement | null;

    if (!editButton) {
        return;
    }

    const userId = editButton.dataset.id;

    if (!userId) {
        return;
    }

    // The default admin account is protected from Edit operations.
    if (userId === "1") {
        alert("Admin account cannot be edit.");
        return;
    }

    const users = getUsers();
    const selectedUser = users.find((user) => user.id === userId);

    if (!selectedUser) {
        return;
    }

    currentEditId = selectedUser.id;
    originalPassword = selectedUser.password || "";

    userModalTitle.textContent = "Edit User";

    nameInput.value = selectedUser.name || "";
    emailInput.value = selectedUser.email || "";

    // Never display the existing password. The admin can enter a new one if required.
    resetPasswordFields();

    genderSelect.value = selectedUser.gender || "";
    roleSelect.value = selectedUser.role || "";

    emailInput.readOnly = true;

    clearValidationState();

    clearGenderButton.classList.toggle("visible", !!genderSelect.value);
    clearRoleButton.classList.toggle("visible", !!roleSelect.value);
});

usersTableBody.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    const deleteButton = target.closest(".delete-user") as HTMLButtonElement | null;

    if (!deleteButton) {
        return;
    }

    const userId = deleteButton.dataset.id;

    if (!userId) {
        return;
    }

    // The default admin account is protected from Delete operations.
    if (userId === "1") {
        alert("Admin account cannot be deleted.");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) {
        return;
    }

    const users = getUsers();

    const updatedUsers = users.filter(
        (user) => user.id !== userId
    );

    saveUsers(updatedUsers);
    renderUsers();

    console.log("User deleted successfully");
});