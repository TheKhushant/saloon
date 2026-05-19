// pages/admin/AddBranchPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AddBranchPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Array<{ id: string, salon_name: string }>>([]);

  const [form, setForm] = useState({
    id: Date.now().toString(),
    vendor_id: "",
    branch_name: "",
    city: "",
    address: "",
    contact_number: "",
    status: "active",
    created_at: new Date().toISOString()
  });

  // Load vendors from localStorage
  useEffect(() => {
    const savedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    setVendors(savedVendors);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.vendor_id || !form.branch_name.trim() || !form.city.trim() || 
        !form.address.trim() || !form.contact_number.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const existingBranches = JSON.parse(localStorage.getItem("branches") || "[]");
    existingBranches.push(form);
    localStorage.setItem("branches", JSON.stringify(existingBranches));

    setLoading(false);
    toast.success("Branch added successfully");
    navigate("/admin/branches");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/admin/branches")}>
        <ArrowLeft className="h-4 w-4" /> Back to Branches
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">Add Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select value={form.vendor_id} onValueChange={(v) => setForm({ ...form, vendor_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.salon_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Branch Name</Label>
              <Input
                value={form.branch_name}
                onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
                placeholder="e.g. Downtown Branch"
              />
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Dubai"
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Downtown Blvd, Tower 3"
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                value={form.contact_number}
                onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                placeholder="e.g. +971501234567"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Branch"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}