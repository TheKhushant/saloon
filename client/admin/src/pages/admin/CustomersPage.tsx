import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface DbCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("customers").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) { toast.error("Failed to load customers"); return; }
      setCustomers(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-muted-foreground font-body p-6">Loading customers...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Customers</h1>
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
              <TableHead className="font-body hidden md:table-cell">Email</TableHead>
              <TableHead className="font-body hidden sm:table-cell">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-body font-medium">{customer.name}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{customer.phone}</TableCell>
                <TableCell className="font-body hidden md:table-cell">{customer.email}</TableCell>
                <TableCell className="font-body hidden sm:table-cell">{new Date(customer.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground font-body py-8">No customers found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
