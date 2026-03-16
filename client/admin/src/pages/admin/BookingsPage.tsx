import { useState, useEffect } from "react";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface DbBooking {
  id: string;
  customer_name: string;
  service: string;
  date: string;
  time: string;
  status: string;
  vendor_id: string | null;
  branch_id: string | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load bookings"); return; }
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = bookings.filter(
    (b) => b.customer_name.toLowerCase().includes(search.toLowerCase()) || b.service.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update booking"); return; }
    toast.success(`Booking ${status}`);
    fetchBookings();
  };

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" };
    return map[s] || s;
  };

  if (loading) return <p className="text-muted-foreground font-body p-6">Loading bookings...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Bookings</h1>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Customer</TableHead>
              <TableHead className="font-body">Service</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Date</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Time</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-body font-medium">{booking.customer_name}</TableCell>
                <TableCell className="font-body">{booking.service}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">{booking.date}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">{booking.time}</TableCell>
                <TableCell><StatusBadge status={statusLabel(booking.status)} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    {(booking.status === "confirmed" || booking.status === "pending") && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, "completed")}>Complete</Button>
                        <Button size="sm" variant="destructive" onClick={() => updateStatus(booking.id, "cancelled")}>Cancel</Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground font-body py-8">No bookings found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
