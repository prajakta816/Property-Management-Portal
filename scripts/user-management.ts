let currentEditId: string | null = null;

import { getUsers, saveUsers, User } from "./user.js";

const userForm = document.getElementById("userForm") as HTMLFormElement
const nameInput = document.getElementById("name") as HTMLInputElement
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const genderSelect = document.getElementById("gender") as HTMLSelectElement;
const roleSelect = document.getElementById("role") as HTMLSelectElement;

const clearRoleButton = document.getElementById("clearRoleButton") as HTMLButtonElement;
const clearGenderButton = document.getElementById("clearGenderButton") as HTMLButtonElement;

//filter1
const searchUser = document.getElementById( "searchUser" ) as HTMLInputElement;
searchUser.addEventListener("input", () => {
    renderUsers();
});
//flter2
const roleFilter = document.getElementById( "roleFilter" ) as HTMLSelectElement;
roleFilter.addEventListener("change", () => { renderUsers(); });
//filter3
const genderFilter = document.getElementById( "genderFilter" ) as HTMLSelectElement;
genderFilter.addEventListener("change", () => { renderUsers(); });

const usersTableBody = document.getElementById("usersTableBody") as HTMLTableSectionElement;
const userModalTitle =document.getElementById("userModalTitle") as HTMLElement;
const addUserButton =document.getElementById("addUserButton") as HTMLButtonElement;
addUserButton.addEventListener("click", () => {
  currentEditId = null;
  userModalTitle.textContent = "Add User";

  userForm.reset();

    // Clear validation messages
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    genderError.textContent = "";
    roleError.textContent = "";

    // Remove validation styles
    const fields = [
        nameInput,
        emailInput,
        passwordInput,
        genderSelect,
        roleSelect
    ];

    fields.forEach((field) => {
        field.classList.remove("is-valid", "is-invalid");
    });

    clearGenderButton.classList.remove("visible");
    clearRoleButton.classList.remove("visible");

});

//view action
const viewUserModal = document.getElementById( "viewUserModal" ) as HTMLDivElement;
const viewUserName = document.getElementById( "viewUserName" ) as HTMLSpanElement;
const viewUserEmail = document.getElementById( "viewUserEmail" ) as HTMLSpanElement;
const viewUserGender = document.getElementById( "viewUserGender" ) as HTMLSpanElement;
const viewUserRole = document.getElementById( "viewUserRole" ) as HTMLSpanElement;

declare const bootstrap: {
    Modal: {
        getInstance(element: HTMLElement): {
            hide(): void;
        } | null;
    };
};
const userModal = document.getElementById("userModal") as HTMLDivElement;
userModal.addEventListener("hidden.bs.modal", () => {
    document.body.setAttribute("tabindex", "-1");
    document.body.focus();
});

const nameError = document.getElementById("nameError") as HTMLDivElement;
const emailError = document.getElementById("emailError") as HTMLDivElement;
const passwordError = document.getElementById("passwordError") as HTMLDivElement;
const genderError = document.getElementById("genderError") as HTMLDivElement;
const roleError = document.getElementById("roleError") as HTMLDivElement;

import { isValidName , isValidEmail , isValidPassword, isValidGender ,isValidRole}  from "./validation.js";

function validateName(): boolean{
    const name = nameInput.value?.trim();

    if(!name){
        nameError.textContent = "Fill your name";
        nameInput.classList.add("is-invalid");
        return false;
    }
    if(!isValidName(name)){
        nameError.textContent ="Enter a valid name";
        nameInput.classList.add("is-invalid");
        return false;
    }

    nameError.textContent="";
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");
    return true;
}

nameInput.addEventListener("input",()=>{validateName();});
nameInput.addEventListener("blur" , ()=>{validateName();});//when user leave the field 

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

    //admin will not add existing user tat decides on emai
    const users = getUsers();
    const emailExists = users.some((user)=>    user.id !== currentEditId && user.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
    emailError.textContent = "This email already exists";
    emailInput.classList.add("is-invalid");
    emailInput.classList.remove("is-valid");
    return false;
}

    emailError.textContent = "";
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
    return true;
}

emailInput.addEventListener("input",()=>{validateEmail();});
emailInput.addEventListener("blur",()=>{validateEmail();});

function validatePassword(): boolean {
    const password = passwordInput.value.trim();

    if (password === "") {
        passwordError.textContent = "Fill your password";
        passwordInput.classList.add("is-invalid");
        return false;
    }

    if (!isValidPassword(password)) {
        passwordError.textContent =
            "Password must be at least 8 characters with uppercase, lowercase, number and special character";
        passwordInput.classList.add("is-invalid");
        return false;
    }

    passwordError.textContent = "";
    passwordInput.classList.remove("is-invalid");
    passwordInput.classList.add("is-valid");

    return true;
}

passwordInput.addEventListener("input",()=>{validatePassword();});
passwordInput.addEventListener("blur",()=>{validatePassword();});

function validateGender(): boolean {
    const gender = genderSelect.value;

    if (gender === "") {
        genderError.textContent = "Select your gender";
        genderSelect.classList.add("is-invalid");
        return false;
    }

    if (!isValidGender(gender)) {
        genderError.textContent = "Select a valid gender";
        genderSelect.classList.add("is-invalid");
        return false;
    }

    genderError.textContent = "";
    genderSelect.classList.remove("is-invalid");
    genderSelect.classList.add("is-valid");

    return true;
}

genderSelect.addEventListener("change", () => { 
    validateGender();
 
    if(genderSelect.value != ""){
        clearGenderButton.classList.add("visible");
    }else{
        clearGenderButton.classList.remove("visible");
    }
});

clearGenderButton.addEventListener("click",()=>{
    genderSelect.value = "";

    clearGenderButton.classList.remove("visible");

    genderError.textContent="";
    genderSelect.classList.remove("is-valid")
})

function validateRole(): boolean {
    const role = roleSelect.value;

    if (role === "") {
        roleError.textContent = "Select a role";
        roleSelect.classList.add("is-invalid");
        return false;
    }

    if (!isValidRole(role)) {
        roleError.textContent = "Select a valid role";
        roleSelect.classList.add("is-invalid");
        return false;
    }

    roleError.textContent = "";
    roleSelect.classList.remove("is-invalid");
    roleSelect.classList.add("is-valid");

    return true;
}

roleSelect.addEventListener("change", () => { 
    validateRole();
    
    if(roleSelect.value != ""){
        clearRoleButton.classList.add("visible");
    }else{
        clearRoleButton.classList.remove("visible");    
    }
});

clearRoleButton.addEventListener("click",()=>{
 roleSelect.value ="";

 clearRoleButton.classList.remove("visible");

 roleError.textContent ="";
 roleSelect.classList.remove("is-valid");

})

//now all form field validation and essential things are done. now that form save button
userForm.addEventListener("submit",(event)=>{
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid =validateEmail ();
    const isPasswordValid = validatePassword();
    const isGenderValid = validateGender();
    const isRoleValid =validateRole ();

    if (
        isNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isGenderValid &&
        isRoleValid
    ) {
    const newUser : User =   {
        id: currentEditId ?? Date.now().toString(),//edited user also et te same id
        name : nameInput.value.trim(),
        email : emailInput.value.trim(),
        password : passwordInput.value.trim(),
        gender : genderSelect.value as User["gender"],
        role : roleSelect.value as User["role"]
    };

    //now saving in the local stg
    const users = getUsers();

    //adding the edited users also
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
    console.log("user saved successfully");
    }

});


// Summary card elements
const totalUsers = document.getElementById( "totalUsers" ) as HTMLElement;
const totalAgents = document.getElementById( "totalAgents" ) as HTMLElement;
const totalManagers = document.getElementById( "totalManagers" ) as HTMLElement;

// Update summary cards
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
console.log("Selected gender:", selectedGender);
console.log(
    "Available genders:",
    allUsers.map((user) => user.gender)
);

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

//hyamule atta no user found sarakh nahi disanar
usersTableBody.innerHTML = "";
    //if user didnt find show user not found in table 
if (users.length === 0) {
    usersTableBody.innerHTML = `
        <tr> <td colspan="5" class="text-center py-4 text-muted"> No users found </td> </tr>
    `;
} else {
    users.forEach((user)=>{
        const row = document.createElement("tr");

        row.innerHTML =`
            <td>${!user.name || user.name === "undefined" ? "Unknown" : user.name}</td>            
            <td>${user.email}</td>
            
            <td><button type="button" class="btn btn-sm btn-primary view-user" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#viewUserModal" > View </button></td>
            <td>${user.id !== "1" ? `<button type="button" class="btn btn-sm btn-warning edit-user" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#userModal" > Edit </button>`:""}</td>
            <td>${user.id !== "1" ? ` <button type="button" class="btn btn-sm btn-danger delete-user" data-id="${user.id}"> Delete </button> ` : ""}</td>            
             `;
            usersTableBody.appendChild(row);
    });
}
}
renderUsers();

usersTableBody.addEventListener("click",(event)=>{
          const target = event.target as HTMLElement;

          const viewButton = target.closest(".view-user") as HTMLButtonElement | null;

          if(!viewButton){return ;}

          const userId = viewButton.dataset.id;

          const users = getUsers();


          const selectedUser = users.find((user)=> user.id === userId);
          if(!selectedUser){return ;}

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
    if (!userId) { return; }
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

    userModalTitle.textContent = "Edit User";

    nameInput.value = selectedUser.name || "";
    emailInput.value = selectedUser.email || "";
    passwordInput.value = selectedUser.password || "";
    genderSelect.value = selectedUser.gender || "";
    roleSelect.value = selectedUser.role || "";

    clearGenderButton.classList.toggle("visible", !!genderSelect.value);
    clearRoleButton.classList.toggle("visible", !!roleSelect.value);
});

usersTableBody.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    const deleteButton = target.closest( ".delete-user" ) as HTMLButtonElement | null;
    if (!deleteButton) { return; }

    const userId = deleteButton.dataset.id;
    if (!userId) { return; }
    if (userId === "1") {
    alert("Admin account cannot be deleted.");
    return;
    }

    const confirmDelete = confirm( "Are you sure you want to delete this user?" );
    if (!confirmDelete) { return; }

    const users = getUsers();

    const updatedUsers = users.filter(
        (user) => user.id !== userId
    );

    saveUsers(updatedUsers);
    renderUsers();

    console.log("User deleted successfully");
});