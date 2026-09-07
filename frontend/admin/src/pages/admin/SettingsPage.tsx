import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roles = [
  {
    role: "User",
    permissions: ["Book salon services"],
  },
  {
    role: "Admin",
    permissions: [
      "Manage branches, bookings, customers, and products",
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Role Access Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((r) => (
            <div key={r.role} className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 border rounded-lg">
              <Badge variant="secondary" className="font-body font-semibold w-fit">
                {r.role}
              </Badge>
              <div className="flex flex-wrap gap-2">
                {r.permissions.map((p) => (
                  <span key={p} className="text-sm font-body text-muted-foreground">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground font-body">
            Additional platform configuration options will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
