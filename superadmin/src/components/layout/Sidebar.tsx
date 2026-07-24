import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Users,
  UserRound,
  Tag,
  LayoutTemplate,
  Package,
  CalendarOff,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/services", label: "Services", icon: Scissors },
  { to: "/barbers", label: "Barbers", icon: Users },
  { to: "/customers", label: "Customers", icon: UserRound },
  { to: "/offers", label: "Offers", icon: Tag },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/products", label: "Products", icon: Package },
  { to: "/holidays", label: "Holidays", icon: CalendarOff },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Scissors className="h-5 w-5" />
        </div>
        <div>
          <div className="font-heading text-base font-semibold leading-tight">Glam Aura</div>
          <div className="text-xs text-muted-foreground">Booking System</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4 text-xs text-muted-foreground">v1.0.0</div>
    </aside>
  );
}
