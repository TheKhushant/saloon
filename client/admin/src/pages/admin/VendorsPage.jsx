import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function VendorsPage() {

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ---------------- FETCH VENDORS ---------------- */

  const fetchVendors = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://localhost:5000/api/vendors", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setVendors(data || []);
      setLoading(false);

    } catch (error) {

      toast.error("Failed to load vendors");

    }

  };

  useEffect(() => {
    fetchVendors();
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */

  const filtered = vendors.filter((v) =>
    (v.salonName || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.name || "").toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UPDATE STATUS ---------------- */

  const toggleStatus = async (id, newStatus) => {

    try {

      await fetch(`http://localhost:5000/api/vendors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      toast.success(`Vendor status updated to ${newStatus}`);

      fetchVendors();

    } catch (error) {

      toast.error("Failed to update status");

    }

  };

  /* ---------------- DELETE VENDOR ---------------- */

  const deleteVendor = async (id) => {

    try {

      await fetch(`http://localhost:5000/api/vendors/${id}`, {
        method: "DELETE"
      });

      toast.success("Vendor deleted");

      fetchVendors();

    } catch (error) {

      toast.error("Failed to delete vendor");

    }

  };

  const statusLabel = (s) =>
    s === "active" ? "Active" :
    s === "paused" ? "Paused" :
    "Disabled";

  if (loading) {
    return (
      <p className="text-muted-foreground p-6">
        Loading vendors...
      </p>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <h1 className="text-2xl font-semibold">
          Vendors
        </h1>

        <Button
          className="gap-2"
          onClick={() => navigate("/admin/vendors/add")}
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>

      </div>

      {/* SEARCH */}

      <div className="relative max-w-sm">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />

      </div>

      {/* TABLE */}

      <div className="border rounded-lg overflow-auto">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Salon Name</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {filtered.map((vendor) => (

              <TableRow
                key={vendor._id}
                className={cn(vendor.status === "paused" && "row-paused")}
              >

                <TableCell className="font-medium">
                  {vendor.salonName}
                </TableCell>

                <TableCell>
                  {vendor.name}
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  {vendor.phone}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  {vendor.email}
                </TableCell>

                <TableCell>
                  <StatusBadge status={statusLabel(vendor.status)} />
                </TableCell>

                <TableCell className="text-right">

                  <div className="flex items-center justify-end gap-1 flex-wrap">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/vendors/${vendor._id}/edit`)}
                    >
                      Edit
                    </Button>

                    {vendor.status === "paused" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(vendor._id, "active")}
                      >
                        Re-activate
                      </Button>
                    ) : vendor.status === "active" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(vendor._id, "paused")}
                      >
                        Pause
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(vendor._id, "active")}
                      >
                        Activate
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVendor(vendor._id)}
                    >
                      Delete
                    </Button>

                  </div>

                </TableCell>

              </TableRow>

            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No vendors found
                </TableCell>
              </TableRow>
            )}

          </TableBody>

        </Table>

      </div>

    </div>

  );
}