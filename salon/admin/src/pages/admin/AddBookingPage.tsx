import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { addBooking } from "@/lib/bookingStore";
import { getBranches } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";
import { menSalonServices, type Booking } from "@/data/mockData";

export default function AddBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<{ id: string; branch_name: string }[]>([]);

  const [form, setForm] = useState({
    customerName: "",
    branch: isBranchAdmin ? user?.branchName ?? "" : "",
    service: "",
    date: "",
    time: "",
    status: "Pending" as Booking["status"],
  });

  useEffect(() => {
    const all = getBranches();
    setBranches(isBranchAdmin ? all.filter((b) => b.id === user?.branchId) : all);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.customerName.trim() || !form.branch || !form.service.trim() || !form.date || !form.time) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    addBooking(form);
    setLoading(false);
    toast.success("Booking added successfully");
    navigate("/admin/bookings");
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
              <Label className="font-body">Branch</Label>
              <Select
                value={form.branch}
                onValueChange={(v) => setForm({ ...form, branch: v })}
                disabled={isBranchAdmin}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.branch_name}>
                      {b.branch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-body">Service</Label>
              <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {menSalonServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
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
