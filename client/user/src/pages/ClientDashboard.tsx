import { useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, Calendar, User, Clock, Heart, LogOut, Star } from "lucide-react";
import { mockBookings } from "@/data/mockData";

const statusColors: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

type Tab = "bookings" | "profile" | "favorites";

const ClientDashboard = () => {
  const [tab, setTab] = useState<Tab>("bookings");

  const tabs = [
    { id: "bookings" as const, label: "My Bookings", icon: Calendar },
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "favorites" as const, label: "Favorites", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="glass border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold">BookSalon</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">J</div>
            <Link to="/" className="text-muted-foreground hover:text-foreground"><LogOut className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl font-bold mb-1">Welcome back, John! 👋</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage your bookings & profile</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? "gradient-gold text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {tab === "bookings" && (
          <div className="space-y-4">
            {mockBookings.map((b) => (
              <div key={b.id} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{b.salon}</h3>
                  <p className="text-sm text-muted-foreground">{b.service} · ${b.price}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.time}</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full self-start ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Profile */}
        {tab === "profile" && (
          <div className="bg-card rounded-2xl border border-border p-8 max-w-lg">
            <h2 className="font-heading text-xl font-semibold mb-6">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <input defaultValue="John Doe" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input defaultValue="john@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <input defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <button className="btn-gold">Save Changes</button>
            </div>
          </div>
        )}

        {/* Favorites */}
        {tab === "favorites" && (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No favorite salons yet. Start exploring!</p>
            <Link to="/salons" className="btn-gold inline-block mt-4">Browse Salons</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
