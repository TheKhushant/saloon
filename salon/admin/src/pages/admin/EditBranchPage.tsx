import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { getBranch, updateBranch } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";

export default function EditBranchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    branch_name: "",
    city: "",
    address: "",
    contact_number: "",
    status: "active" as "active" | "paused" | "disabled",
  });

  useEffect(() => {
    if (user?.role === "branch_admin" && id !== user.branchId) {
      toast.error("You can only edit your own branch");
      navigate("/admin/branches");
      return;
    }

    const branch = id ? getBranch(id) : undefined;
    if (!branch) {
      toast.error("Branch not found");
      navigate("/admin/branches");
      return;
    }
    setForm({
      branch_name: branch.branch_name,
      city: branch.city,
      address: branch.address,
      contact_number: branch.contact_number,
      status: branch.status,
    });
    setFetching(false);
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    updateBranch(id, form);
    setLoading(false);
    toast.success("Branch updated");
    navigate("/admin/branches");
  };

  if (fetching) return <p className="text-muted-foreground font-body p-6">Loading...</p>;

  return (
    <div className="space-y-6 max-w-lg">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/admin/branches")}>
        <ArrowLeft className="h-4 w-4" /> Back to Branches
      </Button>
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl">Edit Branch</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Branch Name</Label>
              <Input value={form.branch_name} onChange={(e) => setForm({ ...form, branch_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Contact Number</Label>
              <Input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} />
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
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Update Branch"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
