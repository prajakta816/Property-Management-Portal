import { getCurrentUser, clearCurrentUser, getUsers } from "./user.js";
import { getRole } from "./role.js";
import { renderSidebar } from "./sidebar.js";
import { loginUrl } from "./constant.js";

const userRole = getRole();
if (userRole !== "admin") {
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

function loadAdminDashboardMetrics(): void {
    const users = getUsers();
    const agentCount = users.filter((user) => user.role === "agent").length;

    const totalAgentsCount = document.getElementById("totalAgentsCount");
    if (totalAgentsCount) {
        totalAgentsCount.textContent = agentCount.toString();
    }

    const storedProperties = JSON.parse(localStorage.getItem("properties") || "[]");
    const openProperties = storedProperties.filter((property: any) => property.status === "Open");

    const totalPropertiesCount = document.getElementById("totalPropertiesCount");
    if (totalPropertiesCount) {
        totalPropertiesCount.textContent = storedProperties.length.toString();
    }

    const openPropertiesCount = document.getElementById("openPropertiesCount");
    if (openPropertiesCount) {
        openPropertiesCount.textContent = openProperties.length.toString();
    }

    const storedDeals = JSON.parse(localStorage.getItem("deals") || "[]");
    const totalDealsCount = document.getElementById("totalDealsCount");
    if (totalDealsCount) {
        totalDealsCount.textContent = storedDeals.length.toString();
    }
}

loadAdminDashboardMetrics();
