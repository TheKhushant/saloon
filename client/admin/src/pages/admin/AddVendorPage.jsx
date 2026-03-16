import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AddVendorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ salon_name: "", owner_name: "", email: "", phone: "", status: "active" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.salon_name.trim() || !form.owner_name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("vendors").insert([form]);
    setLoading(false);
    if (error) { toast.error("Failed to add vendor: " + error.message); return; }
    toast.success("Vendor added successfully");
    navigate("/admin/vendors");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/admin/vendors")}>
        <ArrowLeft className="h-4 w-4" /> Back to Vendors
      </Button>
      <Card>
        <CardHeader><CardTitle className="font-heading text-xl">Add Vendor</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Salon Name</Label>
              <Input value={form.salon_name} onChange={(e) => setForm({ ...form, salon_name: e.target.value })} placeholder="e.g. Glow Beauty Salon" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Owner Name</Label>
              <Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} placeholder="e.g. Sarah Ahmed" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. sarah@salon.com" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +971501234567" />
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
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save Vendor"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
