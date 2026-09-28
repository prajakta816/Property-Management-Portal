import { getCurrentUser, clearCurrentUser } from "./user.js";
import { getRole } from "./role.js";
import { renderSidebar } from "./sidebar.js";
import { loginUrl } from "./constant.js";

const userRole = getRole();
if (userRole !== "agent") {
    alert("Access denied. Agent access only.");
    window.location.href = loginUrl;
}

renderSidebar("agent");

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
