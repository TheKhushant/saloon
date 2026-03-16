import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditBranchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [vendors, setVendors] = useState<{ id: string; salon_name: string }[]>([]);
  const [form, setForm] = useState({ vendor_id: "", branch_name: "", city: "", address: "", contact_number: "", status: "active" });

  useEffect(() => {
    supabase.from("vendors").select("id, salon_name").order("salon_name").then(({ data }) => setVendors(data || []));
    const fetch = async () => {
      const { data, error } = await supabase.from("branches").select("*").eq("id", id!).single();
      if (error || !data) { toast.error("Branch not found"); navigate("/admin/branches"); return; }
      setForm({ vendor_id: data.vendor_id, branch_name: data.branch_name, city: data.city, address: data.address, contact_number: data.contact_number, status: data.status });
      setFetching(false);
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("branches").update(form).eq("id", id!);
    setLoading(false);
    if (error) { toast.error("Failed to update branch"); return; }
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
              <Label className="font-body">Vendor</Label>
              <Select value={form.vendor_id} onValueChange={(v) => setForm({ ...form, vendor_id: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.salon_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
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
