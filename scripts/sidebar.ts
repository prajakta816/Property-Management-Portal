import type {Role} from "./role.js";

interface sidebarLink{
    label : string;
    href : string;
}

export function getSideBarLinks(role : Role):sidebarLink[]{
    return sidebarLinks[role];
}
const sidebarLinks : Record<Role , sidebarLink[]> = {
    admin :[
        {
            label: "Dashboard",
            href:"dashboard.html"
        },
        {
            label: "Properties",
            href:"Properties.html"
        },
        {
            label :"Agents",
            href:"agents.html"
        }
    ],
    agent:[
        {
            label : "Dashboard",
            href : "dashboard.html"
        },
        {
            label : "Properties",
            href : "properties.html"
        },
        {
            label : "Deals",
            href :"deals.html"
        }
    ],
"commission-manager":[
    {
        label:"Dashboard",
        href:"dashboard.html"
    },
    {
        label :"Deals",
        href :"deals.html"
    },
    {
        label : "Commission",
        href : "commission.html"
    }
]
};

const sidebar = document.getElementById("sidebar")
if(!sidebar){
    throw new Error("html elemnt is not found");
}

export function renderSidebar(role : Role): void{
    const sidebar = document.getElementById("sidebar");
    if(!sidebar){
        throw new Error("html elemnt is not found");
    }

    const links = getSideBarLinks(role);

    const sidebarHTML = links.map((link)=>{
                                           return`<a href = "${link.href}">${link.label}</a>`
                                        }).join("");

    sidebar.innerHTML = sidebarHTML;
}