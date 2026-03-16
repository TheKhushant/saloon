import { useState } from "react";
import { hostEntries as initialEntries, HostEntry } from "@/data/mockData";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function HostingPage() {
  const [entries, setEntries] = useState<HostEntry[]>(initialEntries);

  const updateStatus = (id: string, status: HostEntry["hostingStatus"]) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, hostingStatus: status } : e)));
    toast.success(`Hosting ${status.toLowerCase()}`);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Hosting entry deleted");
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Hosting Management</h1>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">ID</TableHead>
              <TableHead className="font-body">Vendor ID</TableHead>
              <TableHead className="font-body">Branch ID</TableHead>
              <TableHead className="font-body">Assigned Template</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className={cn(entry.hostingStatus === "Paused" && "row-paused")}>
                <TableCell className="font-body text-sm">{entry.id}</TableCell>
                <TableCell className="font-body">{entry.vendorId}</TableCell>
                <TableCell className="font-body">{entry.branchId}</TableCell>
                <TableCell className="font-body">{entry.assignedTemplate}</TableCell>
                <TableCell><StatusBadge status={entry.hostingStatus} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    {entry.hostingStatus === "Paused" ? (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(entry.id, "Active")}>Re-activate</Button>
                    ) : entry.hostingStatus === "Active" ? (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(entry.id, "Paused")}>Pause</Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(entry.id, "Active")}>Deploy</Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteEntry(entry.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
