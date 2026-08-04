import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { getBarbers, addBarber, updateBarber, deleteBarber } from "@/lib/barberStore";
import { getBranches } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";
import type { Barber, Branch } from "@/data/mockData";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function BarbersPage() {
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Barber | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Barber | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    specialties: "",
    active: true,
    branchId: isBranchAdmin ? (user?.branchId ?? "") : "",
  });

  const load = () => {
    const all = getBarbers();
    const scoped = isBranchAdmin ? all.filter((b) => b.branchId === user?.branchId) : all;
    setBarbers(scoped);
    const allBranches = getBranches();
    setBranches(isBranchAdmin ? allBranches.filter((b) => b.id === user?.branchId) : allBranches);
  };

  useEffect(() => { load(); }, []);

  const filtered = barbers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.toLowerCase().includes(search.toLowerCase())
  );

  const branchLabel = (branchId: string) =>
    getBranches().find((b) => b.id === branchId)?.branch_name ?? branchId;

  const openAdd = () => {
    setSelected(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      specialties: "",
      active: true,
      branchId: isBranchAdmin ? (user?.branchId ?? "") : "",
    });
    setDialogOpen(true);
  };

  const openEdit = (barber: Barber) => {
    setSelected(barber);
    setForm({
      name: barber.name,
      phone: barber.phone,
      email: barber.email ?? "",
      specialties: (barber.specialties ?? []).join(", "),
      active: barber.active,
      branchId: barber.branchId,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please enter name and phone");
      return;
    }
    if (!form.branchId) {
      toast.error("Please select a branch");
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      specialties: form.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      active: form.active,
      branchId: form.branchId,
    };

    if (selected) {
      updateBarber(selected.id, payload);
      toast.success("Barber updated");
    } else {
      addBarber(payload);
      toast.success("Barber added");
    }
    closeDialog();
    load();
  };

  const toggleActive = (barber: Barber) => {
    updateBarber(barber.id, { active: !barber.active });
    toast.success(`Barber ${barber.active ? "disabled" : "enabled"}`);
    load();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteBarber(deleteTarget.id);
    toast.success("Barber deleted");
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {isBranchAdmin ? `${user?.branchName} Barbers` : "Barbers"}
          </h1>
          <p className="text-sm text-muted-foreground font-body">Manage staff who take appointments</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /><span>Add Barber</span>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Barber</TableHead>
              {!isBranchAdmin && <TableHead className="font-body hidden sm:table-cell">Branch</TableHead>}
              <TableHead className="font-body hidden md:table-cell">Contact</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((barber) => (
              <TableRow key={barber.id}>
                <TableCell className="font-body">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs font-medium bg-secondary text-secondary-foreground">
                        {initials(barber.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{barber.name}</p>
                      {(barber.specialties ?? []).length > 0 && (
                        <p className="text-xs text-muted-foreground">{(barber.specialties ?? []).join(", ")}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                {!isBranchAdmin && <TableCell className="font-body hidden sm:table-cell">{branchLabel(barber.branchId)}</TableCell>}
                <TableCell className="font-body hidden md:table-cell">
                  <p>{barber.phone}</p>
                  {barber.email && <p className="text-xs text-muted-foreground">{barber.email}</p>}
                </TableCell>
                <TableCell><StatusBadge status={barber.active ? "Active" : "Disabled"} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(barber)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(barber)}>
                        {barber.active ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(barber)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={isBranchAdmin ? 4 : 5} className="text-center text-muted-foreground font-body py-8">No barbers found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{selected ? "Edit Barber" : "Add Barber"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ramesh Kadam" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +919822001001" />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Email (optional)</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. ramesh@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Specialties (comma separated)</Label>
              <Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="e.g. Haircut, Beard Trim" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Branch</Label>
              <Select
                value={form.branchId}
                onValueChange={(v) => setForm({ ...form, branchId: v })}
                disabled={isBranchAdmin}
              >
                <SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger>
                <SelectContent>
                  {(isBranchAdmin ? branches : getBranches()).map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <Label className="font-body">Active</Label>
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this barber?"
        description="This removes the barber from your staff list. This can't be undone."
        confirmText="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
