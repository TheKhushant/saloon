import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
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
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "@/lib/customerStore";
import { getBranches } from "@/lib/branchStore";
import useAuth from "@/hooks/useAuth";
import type { Customer, Branch } from "@/data/mockData";

const ANY_BRANCH = "__any__";

export default function CustomersPage() {
  const { user } = useAuth();
  const isBranchAdmin = user?.role === "branch_admin";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    active: true,
    branchId: isBranchAdmin ? (user?.branchId ?? "") : ANY_BRANCH,
  });

  const loadCustomers = () => {
    const all = getCustomers();
    const scoped = isBranchAdmin
      ? all.filter((c) => !c.branchId || c.branchId === user?.branchId)
      : all;
    setCustomers(scoped);
    const allBranches = getBranches();
    setBranches(isBranchAdmin ? allBranches.filter((b) => b.id === user?.branchId) : allBranches);
    setLoading(false);
  };

  useEffect(() => { loadCustomers(); }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const branchLabel = (branchId?: string) => {
    if (!branchId) return "Any Branch";
    return getBranches().find((b) => b.id === branchId)?.branch_name ?? branchId;
  };

  const openAdd = () => {
    setSelected(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      notes: "",
      active: true,
      branchId: isBranchAdmin ? (user?.branchId ?? "") : ANY_BRANCH,
    });
    setDialogOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setSelected(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      notes: customer.notes ?? "",
      active: customer.active,
      branchId: customer.branchId ?? ANY_BRANCH,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error("Please fill in name, phone, and email");
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes.trim() || undefined,
      active: form.active,
      branchId: form.branchId === ANY_BRANCH ? undefined : form.branchId,
    };

    if (selected) {
      updateCustomer(selected.id, payload);
      toast.success("Customer updated");
    } else {
      addCustomer(payload);
      toast.success("Customer added");
    }
    closeDialog();
    loadCustomers();
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    toast.success("Customer deleted");
    loadCustomers();
  };

  if (loading) return <p className="text-muted-foreground font-body p-6">Loading customers...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {isBranchAdmin ? `${user?.branchName} Customers` : "Customers"}
        </h1>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" /><span>Add Customer</span>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body hidden md:table-cell">Phone</TableHead>
              <TableHead className="font-body hidden lg:table-cell">Email</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Bookings</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Total Spent</TableHead>
              {!isBranchAdmin && <TableHead className="font-body hidden lg:table-cell">Branch</TableHead>}
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-body font-medium">{customer.name}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{customer.phone}</TableCell>
                <TableCell className="font-body hidden lg:table-cell">{customer.email}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">{customer.totalBookings}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">₹{customer.totalSpent}</TableCell>
                {!isBranchAdmin && <TableCell className="font-body hidden lg:table-cell">{branchLabel(customer.branchId)}</TableCell>}
                <TableCell><StatusBadge status={customer.active ? "Active" : "Disabled"} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(customer)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={isBranchAdmin ? 6 : 7} className="text-center text-muted-foreground font-body py-8">No customers found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{selected ? "Edit Customer" : "Add Customer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rohan Deshmukh" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +919922001001" />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. rohan@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Home Branch</Label>
              <Select
                value={form.branchId}
                onValueChange={(v) => setForm({ ...form, branchId: v })}
                disabled={isBranchAdmin}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {!isBranchAdmin && <SelectItem value={ANY_BRANCH}>Any Branch</SelectItem>}
                  {(isBranchAdmin ? branches : getBranches()).map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Notes (optional)</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Prefers evening slots" />
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
    </div>
  );
}
