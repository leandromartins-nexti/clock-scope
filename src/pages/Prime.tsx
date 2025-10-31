import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeTrackingPrime from "./prime/TimeTrackingPrime";
import OperationalPrime from "./prime/OperationalPrime";
import DevicesPrime from "./prime/DevicesPrime";
import EngagementPrime from "./prime/EngagementPrime";
import AusenciasCoberturasPrime from "./prime/AusenciasCoberturasPrime";

const Prime = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="registro-ponto" className="w-full">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6">
            <TabsList className="h-auto bg-transparent p-0 gap-6">
              <TabsTrigger 
                value="registro-ponto" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Registro de ponto
              </TabsTrigger>
              <TabsTrigger 
                value="operacional"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Operacional
              </TabsTrigger>
              <TabsTrigger 
                value="coletor"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Coletor
              </TabsTrigger>
              <TabsTrigger 
                value="engajamento"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Engajamento e retenção
              </TabsTrigger>
              <TabsTrigger 
                value="ausencias"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Ausências e coberturas
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="registro-ponto" className="mt-0">
          <TimeTrackingPrime />
        </TabsContent>
        
        <TabsContent value="operacional" className="mt-0">
          <OperationalPrime />
        </TabsContent>
        
        <TabsContent value="coletor" className="mt-0">
          <DevicesPrime />
        </TabsContent>
        
        <TabsContent value="engajamento" className="mt-0">
          <EngagementPrime />
        </TabsContent>
        
        <TabsContent value="ausencias" className="mt-0">
          <AusenciasCoberturasPrime />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Prime;
