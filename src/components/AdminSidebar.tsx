import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  History,
  Database,
  Settings,
  Upload,
  FileText,
  Building2,
  MapPin,
  Plane,
  UserCheck,
  ChevronDown,
  Menu,
  Bookmark,
  BadgeDollarSign,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Subscriptions", url: "/subscriptions", icon: BadgeDollarSign },
  { title: "Banner", url: "/banner", icon: Bookmark },
  { title: "Login History", url: "/login-history", icon: History },
];

const dataManagementItems = [
  { title: "MCA Management", url: "/data/mca", icon: Building2 },
  { title: "GST Management", url: "/data/gst", icon: FileText },
  { title: "Import/Export", url: "/data/import-export", icon: Plane },
];

const systemItems = [
  { title: "User & Roles", url: "/users-roles", icon: UserCheck },
  { title: "Import Data", url: "/import-data", icon: Upload },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [dataManagementOpen, setDataManagementOpen] = useState(true);

  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                Admin Panel
              </h2>
            </div>
          </div>
        )}
        <SidebarTrigger className="text-sidebar-foreground" />
      </div>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider font-medium">
            {!isCollapsed && "Main"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon
                        className={`w-4 h-4 ${
                          isCollapsed ? "mx-auto" : "mr-2"
                        }`}
                      />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Data Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider font-medium">
            {!isCollapsed && "Data Management"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={dataManagementOpen}
                onOpenChange={setDataManagementOpen}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent/50">
                    <div className="flex items-center">
                      <Database
                        className={`w-4 h-4 ${
                          isCollapsed ? "mx-auto" : "mr-2"
                        }`}
                      />
                      {!isCollapsed && <span>Data Management</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          dataManagementOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1">
                  {dataManagementItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavClass}>
                          <item.icon
                            className={`w-4 h-4 ${
                              isCollapsed ? "mx-auto" : "mr-2 ml-4"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="ml-2">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider font-medium">
            {!isCollapsed && "System"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon
                        className={`w-4 h-4 ${
                          isCollapsed ? "mx-auto" : "mr-2"
                        }`}
                      />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
