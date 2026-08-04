import {
  LayoutDashboard,
  GitBranch,
  CalendarDays,
  Users,
  BarChart3,
  Package,
  Settings,
  Scissors,
  UserRound,
  Tag,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, adminOnly: false },
  // { title: "Branches", url: "/admin/branches", icon: GitBranch, adminOnly: false },
  { title: "Services", url: "/admin/services", icon: Scissors, adminOnly: false },
  { title: "Barbers", url: "/admin/barbers", icon: UserRound, adminOnly: false },
  { title: "Bookings", url: "/admin/bookings", icon: CalendarDays, adminOnly: false },
  { title: "Customers", url: "/admin/customers", icon: Users, adminOnly: false },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3, adminOnly: false },
  { title: "Products", url: "/admin/products", icon: Package, adminOnly: false },
  { title: "Offers", url: "/admin/offers", icon: Tag, adminOnly: false },
  { title: "Settings", url: "/admin/settings", icon: Settings, adminOnly: false },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user } = useAuth();

  const visibleItems = menuItems.filter((item) => !item.adminOnly || user?.role === "admin");

  const isActive = (url: string) => {
    if (url === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Scissors className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-sidebar-foreground leading-tight">
                Glam Aura
              </h2>
              <p className="text-xs text-muted-foreground font-body">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="font-body text-sm">{item.title}</span>}
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
