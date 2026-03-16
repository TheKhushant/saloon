import { useState } from "react";
import { templates as initialTemplates, Template } from "@/data/mockData";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function TemplatesPage() {
  const [templateList, setTemplateList] = useState<Template[]>(initialTemplates);

  const toggleStatus = (id: string) => {
    setTemplateList((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Active" ? "Disabled" : "Active" }
          : t
      )
    );
    toast.success("Template status updated");
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Templates</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateList.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">{template.name}</h3>
                <StatusBadge status={template.status} />
              </div>
              <p className="text-xs text-muted-foreground font-body">ID: {template.id}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info("Assign to vendor flow coming soon")}>
                  Assign to Vendor
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Edit template coming soon")}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={template.status === "Active" ? "destructive" : "default"}
                  onClick={() => toggleStatus(template.id)}
                >
                  {template.status === "Active" ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
