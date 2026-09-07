import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createBooking, updateBookingStatus } from "@/lib/bookingStore";
import { getBranches } from "@/lib/branchStore";
import { getServices } from "@/lib/serviceStore";
import useAuth from "@/hooks/useAuth";
import type { Booking, Branch, Service } from "@/data/mockData";

export default function AddBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    branchId: isBranchAdmin ? user?.branchId ?? "" : "",
    serviceId: "",
    date: "",
    time: "",
    status: "Pending" as Booking["status"],
  });

  useEffect(() => {
    (async () => {
      const [allBranches, allServices] = await Promise.all([getBranches(), getServices()]);
      setBranches(isBranchAdmin ? allBranches.filter((b) => b.id === user?.branchId) : allBranches);
      setServices(allServices);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.customerName.trim() ||
      !form.customerPhone.trim() ||
      !form.branchId ||
      !form.serviceId ||
      !form.date ||
      !form.time
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const created = await createBooking({
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        branchId: form.branchId,
        serviceId: form.serviceId,
        date: form.date,
        time: form.time,
      });

      // A new booking always starts "Pending" on the backend - if the admin
      // picked a different initial status, apply it as a follow-up update.
      if (form.status !== "Pending") {
        await updateBookingStatus(created.id, form.status);
      }

      toast.success("Booking added successfully");
      navigate("/admin/bookings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/admin/bookings")}>
        <ArrowLeft className="h-4 w-4" /> Back to Bookings
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Add Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Customer Name</Label>
              <Input
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">Customer Phone</Label>
              <Input
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">Branch</Label>
              <Select
                value={form.branchId}
                onValueChange={(v) => setForm({ ...form, branchId: v })}
                disabled={isBranchAdmin}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.branch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-body">Service</Label>
              <Select value={form.serviceId} onValueChange={(v) => setForm({ ...form, serviceId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter((s) => s.active && (!s.branchId || s.branchId === form.branchId))
                    .map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} – ₹{service.price}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Time</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body">Status</Label>
              <Select value={form.status} onValueChange={(v: Booking["status"]) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
