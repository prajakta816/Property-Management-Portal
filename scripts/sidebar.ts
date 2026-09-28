import {
    adminUrl,
    agentUrl,
    commissionUrl,
    userManagementUrl,
    propertiesUrl,
    buyersUrl,
    dealsUrl,
    commissionsUrl,
    settingsUrl,
    commissionRequestsUrl,
    invoicesUrl,
    processedRequestsUrl
} from "./constant.js";
import type { Role } from "./role.js";

export interface SidebarLink {
    label: string;
    href: string;
    icon: string;
}

const SIDEBAR_LINKS_BY_ROLE: Record<Role, SidebarLink[]> = {
    admin: [
        { label: "Dashboard", href: adminUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
        { label: "Properties", href: propertiesUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>` },
        { label: "User Management", href: userManagementUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>` },
        { label: "Buyers", href: buyersUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
        { label: "Deals", href: dealsUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` },
        { label: "Commissions", href: commissionsUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>` },
        { label: "Settings", href: settingsUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>` },
    ],
    agent: [
        { label: "Dashboard", href: agentUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
        { label: "Properties", href: propertiesUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>` },
        { label: "My Buyers", href: buyersUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
        { label: "My Deals", href: dealsUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` },
        { label: "Commission Requests", href: commissionRequestsUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>` },
        { label: "My Invoices", href: invoicesUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
    ],
    "commission-manager": [
        { label: "Dashboard", href: commissionUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
        { label: "Commission Requests", href: commissionRequestsUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>` },
        { label: "Processed Requests", href: processedRequestsUrl, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>` },
    ]
};

function getCurrentPage(): string {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1) || adminUrl;
}

export function getSidebarLinks(role: Role): SidebarLink[] {
    return SIDEBAR_LINKS_BY_ROLE[role] || [];
}

export function renderSidebar(role: Role): void {
    const sidebarElement = document.getElementById("sidebar");
    if (!sidebarElement) {
        return;
    }

    const links = getSidebarLinks(role);
    const formattedRoleName = role.replace("-", " ").toUpperCase();
    const currentPage = getCurrentPage();

    const linksHtml = links
        .map((link) => {
            const linkBaseName = link.href.split("/").pop() || link.href;
            const isActive = linkBaseName === currentPage;
            return `
            <a href="${link.href}" class="sidebar-link ${isActive ? "active" : ""}">
                <span class="sidebar-icon">${link.icon}</span>
                <span class="sidebar-label">${link.label}</span>
            </a>
        `;
        })
        .join("");

    sidebarElement.innerHTML = `
        <div class="sidebar-brand">
            <div class="brand-header">
                <div class="brand-logo-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                        <path d="M9 21V12h6v9"/>
                    </svg>
                </div>
                <div class="brand-info">
                    <span class="brand-title">Realty Manager</span>
                    <span class="role-badge badge-${role}">${formattedRoleName}</span>
                </div>
            </div>

            
            <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
                <svg class="toggle-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>   

            <button class="sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close sidebar">
                &times;
            </button>
        </div>
        <nav class="sidebar-nav">
            ${linksHtml}
        </nav>
    `;

    // restoring saved sidebar state so if new page open it will stay in its chosen state
    const isSavedCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    if (isSavedCollapsed) {
        sidebarElement.classList.add("collapsed");
    }

    // collapse button click event
    const toggleButton = document.getElementById("sidebarToggle");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            const isCollapsed = sidebarElement.classList.toggle("collapsed");
            localStorage.setItem("sidebarCollapsed", String(isCollapsed));
        });
    }


    setupResponsiveSidebar(sidebarElement);
}

function setupResponsiveSidebar(sidebarElement: HTMLElement): void {
    let backdrop = document.getElementById("sidebarBackdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "sidebarBackdrop";
        backdrop.className = "sidebar-backdrop";
        document.body.appendChild(backdrop);
    }

    const closeSidebar = (): void => {
        sidebarElement.classList.remove("mobile-open");
        backdrop?.classList.remove("active");
        document.body.classList.remove("sidebar-open");
    };

    const openSidebar = (): void => {
        sidebarElement.classList.add("mobile-open");
        backdrop?.classList.add("active");
        document.body.classList.add("sidebar-open");
    };

    const mobileToggle = document.getElementById("sidebarMobileToggle");
    if (mobileToggle) {
        mobileToggle.onclick = (e) => {
            e.stopPropagation();
            if (sidebarElement.classList.contains("mobile-open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        };
    }

    const closeBtn = document.getElementById("sidebarCloseBtn");
    if (closeBtn) {
        closeBtn.onclick = () => closeSidebar();
    }

    backdrop.onclick = () => closeSidebar();

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992 && sidebarElement.classList.contains("mobile-open")) {
            closeSidebar();
        }
    });
}