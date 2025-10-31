import { RhDigitalProvider } from "@/contexts/RhDigitalContext";
import ChecklistTab from "./ChecklistTab";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChecklistPage() {
  return (
    <RhDigitalProvider>
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Checklist Operacional</CardTitle>
            <p className="text-muted-foreground">Monitoramento de Compliance Operacional em Campo</p>
          </CardHeader>
        </Card>
        <ChecklistTab />
      </div>
    </RhDigitalProvider>
  );
}
