import { useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, Users, CalendarDays, Store, DollarSign, BarChart3, Settings, LogOut, Star, Trash2, Ban, Eye } from "lucide-react";
import { adminStats, salons, mockBookings } from "@/data/mockData";

type Tab = "overview" | "users" | "salons" | "bookings" | "reviews";

const mockUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 555-111", bookings: 12, status: "Active" },
  { id: 2, name: "Michael Chen", email: "michael@example.com", phone: "+1 555-222", bookings: 8, status: "Active" },
  { id: 3, name: "Emily Davis", email: "emily@example.com", phone: "+1 555-333", bookings: 5, status: "Blocked" },
  { id: 4, name: "James Wilson", email: "james@example.com", phone: "+1 555-444", bookings: 15, status: "Active" },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState<Tab>("overview");

  const sideLinks = [
    { id: "overview" as const, label: "Dashboard", icon: BarChart3 },
    { id: "users" as const, label: "Users", icon: Users },
    { id: "salons" as const, label: "Salons", icon: Store },
    { id: "bookings" as const, label: "Bookings", icon: CalendarDays },
    { id: "reviews" as const, label: "Reviews", icon: Star },
  ];

  const stats = [
    { label: "Total Users", value: adminStats.totalUsers.toLocaleString(), icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Total Bookings", value: adminStats.totalBookings.toLocaleString(), icon: CalendarDays, color: "from-green-500 to-green-600" },
    { label: "Total Salons", value: adminStats.totalSalons.toString(), icon: Store, color: "from-purple-500 to-purple-600" },
    { label: "Revenue", value: `$${adminStats.revenue.toLocaleString()}`, icon: DollarSign, color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 gradient-dark text-accent-foreground p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 gradient-gold rounded-lg flex items-center justify-center">
            <Scissors className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold">BookSalon</span>
        </Link>
        <span className="text-xs uppercase tracking-wider opacity-40 mb-4">Admin Panel</span>
        <nav className="space-y-1 flex-1">
          {sideLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => setTab(l.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                tab === l.id ? "bg-primary/20 text-primary font-medium" : "opacity-60 hover:opacity-100"
              }`}
            >
              <l.icon className="w-4 h-4" /> {l.label}
            </button>
          ))}
        </nav>
        <Link to="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 text-sm mt-4">
          <LogOut className="w-4 h-4" /> Logout
        </Link>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="font-heading font-bold">Admin Panel</span>
        <select
          value={tab}
          onChange={(e) => setTab(e.target.value as Tab)}
          className="text-sm border border-border rounded-lg px-2 py-1 bg-background"
        >
          {sideLinks.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-10 overflow-auto">
        {tab === "overview" && (
          <div>
            <h1 className="font-heading text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold font-heading">{s.value}</p>
                </div>
              ))}
            </div>
            <h2 className="font-heading text-lg font-semibold mb-4">Recent Bookings</h2>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Salon</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Service</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                      <td className="px-4 py-3">{b.salon}</td>
                      <td className="px-4 py-3">{b.service}</td>
                      <td className="px-4 py-3">{b.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                          b.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          b.status === "Completed" ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div>
            <h1 className="font-heading text-2xl font-bold mb-6">Manage Users</h1>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Bookings</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3 hidden md:table-cell">{u.bookings}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                          <button className="text-muted-foreground hover:text-yellow-600"><Ban className="w-4 h-4" /></button>
                          <button className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "salons" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-heading text-2xl font-bold">Manage Salons</h1>
              <button className="btn-gold text-sm">+ Add Salon</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {salons.map((s) => (
                <div key={s.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                  <img src={s.image} alt={s.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs">{s.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button className="text-xs text-primary hover:underline">Edit</button>
                    <button className="text-xs text-destructive hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <h1 className="font-heading text-2xl font-bold mb-6">Manage Bookings</h1>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Salon</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Service</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                      <td className="px-4 py-3">{b.salon}</td>
                      <td className="px-4 py-3">{b.service}</td>
                      <td className="px-4 py-3">{b.date}</td>
                      <td className="px-4 py-3">
                        <select defaultValue={b.status} className="text-xs border border-border rounded px-2 py-1 bg-background">
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-destructive hover:underline">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div>
            <h1 className="font-heading text-2xl font-bold mb-6">Manage Reviews</h1>
            <div className="space-y-4">
              {[
                { id: 1, user: "Sarah J.", salon: "Luxe Beauty Lounge", rating: 5, comment: "Amazing experience!", date: "Mar 1, 2026" },
                { id: 2, user: "Mike C.", salon: "The Style Studio", rating: 4, comment: "Great service, will return.", date: "Feb 28, 2026" },
                { id: 3, user: "Emily D.", salon: "Glow & Grace Spa", rating: 5, comment: "Best spa in town!", date: "Feb 25, 2026" },
              ].map((r) => (
                <div key={r.id} className="bg-card rounded-xl border border-border p-5 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{r.user}</span>
                      <span className="text-xs text-muted-foreground">on {r.salon}</span>
                    </div>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">{r.date}</span>
                  </div>
                  <button className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
