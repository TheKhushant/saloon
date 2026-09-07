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
import { getOffers, addOffer, updateOffer, deleteOffer } from "@/lib/offerStore";
import { getBranches } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";
import type { Offer, DiscountType, Branch } from "@/data/mockData";

const ALL_BRANCHES = "__all__";

export default function OffersPage() {
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";

  const [offers, setOffers] = useState<Offer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState(ALL_BRANCHES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);

  const [form, setForm] = useState({
    title: "",
    code: "",
    discountType: "percentage" as DiscountType,
    discountValue: "",
    expiresAt: "",
    description: "",
    active: true,
    branchId: isBranchAdmin ? (user?.branchId ?? "") : ALL_BRANCHES,
  });

  const load = async () => {
    const all = await getOffers();
    const scoped = isBranchAdmin
      ? all.filter((o) => !o.branchId || o.branchId === user?.branchId)
      : all;
    setOffers(scoped);
    const allBranches = await getBranches();
    setBranches(isBranchAdmin ? allBranches.filter((b) => b.id === user?.branchId) : allBranches);
  };

  useEffect(() => { load(); }, []);

  const branchLabel = (branchId?: string) => {
    if (!branchId) return "All Branches";
    return branches.find((b) => b.id === branchId)?.branch_name ?? branchId;
  };

  const filtered = offers.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase());
    const matchesBranch =
      branchFilter === ALL_BRANCHES ||
      (branchFilter === "unassigned" ? !o.branchId : o.branchId === branchFilter);
    return matchesSearch && matchesBranch;
  });

  const isExpired = (offer: Offer) => offer.expiresAt && new Date(offer.expiresAt) < new Date();

  const openAdd = () => {
    setSelected(null);
    setForm({
      title: "",
      code: "",
      discountType: "percentage",
      discountValue: "",
      expiresAt: "",
      description: "",
      active: true,
      branchId: isBranchAdmin ? (user?.branchId ?? "") : ALL_BRANCHES,
    });
    setDialogOpen(true);
  };

  const openEdit = (offer: Offer) => {
    setSelected(offer);
    setForm({
      title: offer.title,
      code: offer.code,
      discountType: offer.discountType,
      discountValue: String(offer.discountValue),
      expiresAt: offer.expiresAt ?? "",
      description: offer.description ?? "",
      active: offer.active,
      branchId: offer.branchId ?? ALL_BRANCHES,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.code.trim()) {
      toast.error("Please enter a title and code");
      return;
    }
    if (!form.discountValue || isNaN(Number(form.discountValue)) || Number(form.discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }
    if (form.discountType === "percentage" && Number(form.discountValue) > 100) {
      toast.error("Percentage discount can't exceed 100");
      return;
    }

    const payload = {
      title: form.title.trim(),
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      expiresAt: form.expiresAt || undefined,
      description: form.description.trim() || undefined,
      active: form.active,
      branchId: form.branchId === ALL_BRANCHES ? undefined : form.branchId,
    };

    try {
      if (selected) {
        await updateOffer(selected.id, payload);
        toast.success("Offer updated");
      } else {
        await addOffer(payload);
        toast.success("Offer added");
      }
      closeDialog();
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save offer");
    }
  };

  const toggleActive = async (offer: Offer) => {
    try {
      await updateOffer(offer.id, { active: !offer.active });
      toast.success(`Offer ${offer.active ? "disabled" : "enabled"}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update offer");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOffer(deleteTarget.id);
      toast.success("Offer deleted");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete offer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Offers</h1>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /><span>Add Offer</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {!isBranchAdmin && (
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Filter by branch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_BRANCHES}>All Branches</SelectItem>
              <SelectItem value="unassigned">Unassigned (All Branches offers)</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Title</TableHead>
              <TableHead className="font-body">Code</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Discount</TableHead>
              <TableHead className="font-body hidden lg:table-cell">Branch</TableHead>
              <TableHead className="font-body hidden md:table-cell">Expires</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-body font-medium">{offer.title}</TableCell>
                <TableCell className="font-body">
                  <code className="text-xs bg-muted px-2 py-1 rounded">{offer.code}</code>
                </TableCell>
                <TableCell className="font-body hidden sm:table-cell">
                  {offer.discountType === "percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                </TableCell>
                <TableCell className="font-body hidden lg:table-cell">{branchLabel(offer.branchId)}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{offer.expiresAt ?? "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={!offer.active ? "Disabled" : isExpired(offer) ? "Cancelled" : "Active"} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(offer)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(offer)}>
                        {offer.active ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(offer)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground font-body py-8">No offers found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{selected ? "Edit Offer" : "Add Offer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. New Customer Discount" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Code</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. NEW20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Discount Type</Label>
                <Select value={form.discountType} onValueChange={(v: DiscountType) => setForm({ ...form, discountType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body">Value</Label>
                <Input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 50"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Expires On (optional)</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
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
        title="Delete this offer?"
        description="This removes the offer/promo code. This can't be undone."
        confirmText="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
