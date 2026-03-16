import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditVendorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ salon_name: "", owner_name: "", email: "", phone: "", status: "active" });

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("vendors").select("*").eq("id", id!).single();
      if (error || !data) { toast.error("Vendor not found"); navigate("/admin/vendors"); return; }
      setForm({ salon_name: data.salon_name, owner_name: data.owner_name, email: data.email, phone: data.phone, status: data.status });
      setFetching(false);
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("vendors").update(form).eq("id", id!);
    setLoading(false);
    if (error) { toast.error("Failed to update vendor"); return; }
    toast.success("Vendor updated");
    navigate("/admin/vendors");
  };

  if (fetching) return <p className="text-muted-foreground font-body p-6">Loading...</p>;

  return (
    <div className="space-y-6 max-w-lg">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/admin/vendors")}>
        <ArrowLeft className="h-4 w-4" /> Back to Vendors
      </Button>
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl">Edit Vendor</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Salon Name</Label>
              <Input value={form.salon_name} onChange={(e) => setForm({ ...form, salon_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Owner Name</Label>
              <Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
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
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Update Vendor"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
