import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBookings, updateBookingStatus, deleteBooking } from "@/lib/bookingStore";
import useAuth from "@/hooks/useAuth";
import type { Booking } from "@/data/mockData";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";

  const loadBookings = () => {
    const all = getBookings();
    setBookings(isBranchAdmin ? all.filter((b) => b.branch === user?.branchName) : all);
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, []);

  const filtered = bookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase()) ||
      b.branch.toLowerCase().includes(search.toLowerCase())
  );

  const setStatus = (id: string, status: Booking["status"]) => {
    updateBookingStatus(id, status);
    toast.success(`Booking marked as ${status}`);
    loadBookings();
  };

  const handleDelete = (id: string) => {
    deleteBooking(id);
    toast.success("Booking deleted");
    loadBookings();
  };

  if (loading) return <p className="text-muted-foreground font-body p-6">Loading bookings...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {isBranchAdmin ? `${user?.branchName} Bookings` : "Bookings"}
        </h1>
        <Button className="gap-2" onClick={() => navigate("/admin/bookings/add")}>
          <Plus className="h-4 w-4" /><span>Add Booking</span>
        </Button>
      </div>

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
              <TableHead className="font-body hidden md:table-cell">Branch</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Date</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Time</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-body font-medium">{booking.customerName}</TableCell>
                <TableCell className="font-body">{booking.service}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{booking.branch}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">{booking.date}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">{booking.time}</TableCell>
                <TableCell><StatusBadge status={booking.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    {(booking.status === "Confirmed" || booking.status === "Pending") && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => setStatus(booking.id, "Completed")}>Complete</Button>
                        <Button size="sm" variant="outline" onClick={() => setStatus(booking.id, "Cancelled")}>Cancel</Button>
                      </>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(booking.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground font-body py-8">No bookings found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
