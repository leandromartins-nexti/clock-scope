import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DirectPage from "./rh-digital/DirectPage";
import AvisosPage from "./rh-digital/AvisosPage";
import ChecklistPage from "./rh-digital/ChecklistPage";

const RhDigital = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="direct" className="w-full">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6">
            <TabsList className="h-auto bg-transparent p-0 gap-6">
              <TabsTrigger 
                value="direct" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Direct
              </TabsTrigger>
              <TabsTrigger 
                value="avisos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Avisos e Convocações
              </TabsTrigger>
              <TabsTrigger 
                value="checklist"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#003399] rounded-none bg-transparent px-0 pb-3 data-[state=active]:bg-transparent data-[state=active]:text-[#003399] data-[state=active]:shadow-none"
              >
                Check-list
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="direct" className="mt-0">
          <DirectPage />
        </TabsContent>
        
        <TabsContent value="avisos" className="mt-0">
          <AvisosPage />
        </TabsContent>
        
        <TabsContent value="checklist" className="mt-0">
          <ChecklistPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RhDigital;
