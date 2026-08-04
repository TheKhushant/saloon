import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";

import { Button } from "@/components/ui/button";
import { LogOut, Sun, Moon } from "lucide-react";

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-2 sm:px-4 bg-card gap-2">
            <div className="flex items-center min-w-0">
              <SidebarTrigger className="mr-2 sm:mr-4 shrink-0" />
              <span className="font-heading text-base sm:text-lg text-foreground truncate">Admin Panel</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-muted-foreground font-body hidden md:inline max-w-[180px] truncate">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 px-2 sm:px-3">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
