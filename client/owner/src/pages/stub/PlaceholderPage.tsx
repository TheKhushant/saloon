import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} description="This section is coming next." />
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
          <Construction className="h-10 w-10" />
          <div>
            <div className="font-medium text-foreground">{title} module pending</div>
            <p className="mt-1 text-sm">Request this section to have it built out next.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
