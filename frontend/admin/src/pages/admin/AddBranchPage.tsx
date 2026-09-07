import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { addBranch } from "@/lib/branchStore";

export default function AddBranchPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    branch_name: "",
    city: "",
    address: "",
    contact_number: "",
    status: "active" as "active" | "paused" | "disabled",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.branch_name.trim() || !form.city.trim() || !form.address.trim() || !form.contact_number.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addBranch(form);
      toast.success("Branch added successfully");
      navigate("/admin/branches");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add branch");
    } finally {
      setLoading(false);
    }
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
              <Label className="font-body">Branch Name</Label>
              <Input
                value={form.branch_name}
                onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
                placeholder="e.g. Downtown Branch"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">City</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Dubai"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Downtown Blvd, Tower 3"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">Contact Number</Label>
              <Input
                value={form.contact_number}
                onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                placeholder="e.g. +971501234567"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body">Status</Label>
              <Select value={form.status} onValueChange={(v: "active" | "paused" | "disabled") => setForm({ ...form, status: v })}>
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
