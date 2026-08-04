import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { getBranches, deleteBranch, updateBranch } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";
import type { Branch } from "@/data/mockData";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";

  const loadBranches = () => {
    const all = getBranches();
    setBranches(isBranchAdmin ? all.filter((b) => b.id === user?.branchId) : all);
    setLoading(false);
  };

  useEffect(() => { loadBranches(); }, []);

  const filtered = branches.filter(
    (b) =>
      b.branch_name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string, newStatus: Branch["status"]) => {
    updateBranch(id, { status: newStatus });
    toast.success(`Branch status updated to ${newStatus}`);
    loadBranches();
  };

  const handleDelete = (id: string) => {
    deleteBranch(id);
    toast.success("Branch deleted");
    loadBranches();
  };

  const statusLabel = (s: string) => (s === "active" ? "Active" : s === "paused" ? "Paused" : "Disabled");

  if (loading) return <p className="text-muted-foreground font-body p-6">Loading branches...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {isBranchAdmin ? `${user?.branchName} Branch` : "Branches"}
        </h1>
        {!isBranchAdmin && (
          <Button className="gap-2" onClick={() => navigate("/admin/branches/add")}>
            <Plus className="h-4 w-4" /><span>Add Branch</span>
          </Button>
        )}
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
                    {!isBranchAdmin && (
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(branch.id)}>Delete</Button>
                    )}
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
