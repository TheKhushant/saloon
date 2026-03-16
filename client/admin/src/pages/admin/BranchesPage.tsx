import { useState, useEffect } from "react";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DbBranch {
  id: string;
  vendor_id: string;
  branch_name: string;
  city: string;
  address: string;
  contact_number: string;
  status: string;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<DbBranch[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBranches = async () => {
    const { data, error } = await supabase.from("branches").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load branches"); return; }
    setBranches(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBranches(); }, []);

  const filtered = branches.filter(
    (b) => b.branch_name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("branches").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Branch status updated to ${newStatus}`);
    fetchBranches();
  };

  const deleteBranch = async (id: string) => {
    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) { toast.error("Failed to delete branch"); return; }
    toast.success("Branch deleted");
    fetchBranches();
  };

  const statusLabel = (s: string) => s === "active" ? "Active" : s === "paused" ? "Paused" : "Disabled";

  if (loading) return <p className="text-muted-foreground font-body p-6">Loading branches...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Branches</h1>
        <Button className="gap-2" onClick={() => navigate("/admin/branches/add")}>
          <Plus className="h-4 w-4" /><span>Add Branch</span>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Branch Name</TableHead>
              <TableHead className="font-body hidden md:table-cell">City</TableHead>
              <TableHead className="font-body hidden lg:table-cell">Address</TableHead>
              <TableHead className="font-body hidden md:table-cell">Contact</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((branch) => (
              <TableRow key={branch.id} className={cn(branch.status === "paused" && "row-paused")}>
                <TableCell className="font-body font-medium">{branch.branch_name}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{branch.city}</TableCell>
                <TableCell className="font-body hidden lg:table-cell">{branch.address}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{branch.contact_number}</TableCell>
                <TableCell><StatusBadge status={statusLabel(branch.status)} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/admin/branches/${branch.id}/edit`)}>Edit</Button>
                    {branch.status === "paused" ? (
                      <Button size="sm" variant="outline" onClick={() => toggleStatus(branch.id, "active")}>Re-activate</Button>
                    ) : branch.status === "active" ? (
                      <Button size="sm" variant="outline" onClick={() => toggleStatus(branch.id, "paused")}>Pause</Button>
                    ) : null}
                    <Button size="sm" variant="destructive" onClick={() => deleteBranch(branch.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground font-body py-8">No branches found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
