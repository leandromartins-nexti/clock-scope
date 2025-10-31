import { RhDigitalProvider } from "@/contexts/RhDigitalContext";
import AvisosConvocacoesTab from "./AvisosConvocacoesTab";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
export default function AvisosPage() {
  return <RhDigitalProvider>
      <div className="container mx-auto p-6 space-y-6">
        
        <AvisosConvocacoesTab />
      </div>
    </RhDigitalProvider>;
}