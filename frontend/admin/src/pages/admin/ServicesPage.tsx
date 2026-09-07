import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { getServices, addService, updateService, deleteService } from "@/lib/serviceStore";
import { getBranches } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";
import type { Service, Branch } from "@/data/mockData";

const ALL_BRANCHES = "__all__";

export default function ServicesPage() {
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";

  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    durationMinutes: "",
    price: "",
    description: "",
    active: true,
    branchId: isBranchAdmin ? (user?.branchId ?? "") : ALL_BRANCHES,
  });

  const load = async () => {
    const all = await getServices();
    const scoped = isBranchAdmin
      ? all.filter((s) => !s.branchId || s.branchId === user?.branchId)
      : all;
    setServices(scoped);
    const allBranches = await getBranches();
    setBranches(isBranchAdmin ? allBranches.filter((b) => b.id === user?.branchId) : allBranches);
  };

  useEffect(() => { load(); }, []);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const branchLabel = (branchId?: string) => {
    if (!branchId) return "All Branches";
    return branches.find((b) => b.id === branchId)?.branch_name ?? branchId;
  };

  const openAdd = () => {
    setSelected(null);
    setForm({
      name: "",
      category: "",
      durationMinutes: "",
      price: "",
      description: "",
      active: true,
      branchId: isBranchAdmin ? (user?.branchId ?? "") : ALL_BRANCHES,
    });
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setSelected(service);
    setForm({
      name: service.name,
      category: service.category ?? "",
      durationMinutes: String(service.durationMinutes),
      price: String(service.price),
      description: service.description ?? "",
      active: service.active,
      branchId: service.branchId ?? ALL_BRANCHES,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a service name");
      return;
    }
    if (!form.durationMinutes || isNaN(Number(form.durationMinutes)) || Number(form.durationMinutes) <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || undefined,
      durationMinutes: Number(form.durationMinutes),
      price: Number(form.price),
      description: form.description.trim() || undefined,
      active: form.active,
      branchId: form.branchId === ALL_BRANCHES ? undefined : form.branchId,
    };

    try {
      if (selected) {
        await updateService(selected.id, payload);
        toast.success("Service updated");
      } else {
        await addService(payload);
        toast.success("Service added");
      }
      closeDialog();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save service");
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await updateService(service.id, { active: !service.active });
      toast.success(`Service ${service.active ? "disabled" : "enabled"}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update service");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteService(deleteTarget.id);
      toast.success("Service deleted");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Services</h1>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /><span>Add Service</span>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or category..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body hidden md:table-cell">Category</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Duration</TableHead>
              <TableHead className="font-body">Price</TableHead>
              <TableHead className="font-body hidden lg:table-cell">Branch</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-body font-medium">{service.name}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{service.category ?? "-"}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">{service.durationMinutes} min</TableCell>
                <TableCell className="font-body">₹{service.price}</TableCell>
                <TableCell className="font-body hidden lg:table-cell">{branchLabel(service.branchId)}</TableCell>
                <TableCell><StatusBadge status={service.active ? "Active" : "Disabled"} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(service)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(service)}>
                        {service.active ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(service)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground font-body py-8">No services found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{selected ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Service Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Haircut" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Hair" />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Duration (min)</Label>
                <Input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} placeholder="e.g. 30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Price (₹)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 149" />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Branch</Label>
                <Select
                  value={form.branchId}
                  onValueChange={(v) => setForm({ ...form, branchId: v })}
                  disabled={isBranchAdmin}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {!isBranchAdmin && <SelectItem value={ALL_BRANCHES}>All Branches</SelectItem>}
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional short description" />
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
        title="Delete this service?"
        description="This removes the service from the catalog. This can't be undone."
        confirmText="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
