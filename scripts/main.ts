import type {Role} from "./role.js";
import { saveRole , getRole } from "./role.js";
import { renderSidebar } from "./sidebar.js";
import { showLoader,hideLoader } from "./loader.js";
import { initializeUsers } from "./user.js";

initializeUsers();

function isValidRole(value : String) : value is Role{
    return (
        value ==="admin" ||
        value === "agent" ||
        value === "commission-manager"
    );
}
const roleSelect = document.getElementById("roleSelect") as HTMLSelectElement

//to protect from refresh of selected role
const savedRole = getRole()
if(savedRole){
    roleSelect.value = savedRole;
    renderSidebar(savedRole);
}

roleSelect.addEventListener("change" , ()=>{
    const selectedRole = roleSelect.value;
    if(isValidRole(selectedRole)){
        showLoader();

        setTimeout(() => {
            saveRole(selectedRole);

            hideLoader();

            renderSidebar(selectedRole);

        }, 500);
        
    console.log("selected role is : " ,selectedRole);}
});

