import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminLayout() {
  const { signOut, user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <span className="font-heading text-lg text-foreground">Admin Panel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground font-body hidden sm:inline">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
