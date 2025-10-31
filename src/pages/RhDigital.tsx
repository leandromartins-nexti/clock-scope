import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlineFilters } from "@/components/dashboard/InlineFilters";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import DirectPage from "./rh-digital/DirectPage";
import AvisosPage from "./rh-digital/AvisosPage";
import ChecklistPage from "./rh-digital/ChecklistPage";

const RhDigital = () => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="direct" className="w-full">
        <InlineFilters isExpanded={isFiltersExpanded} />
        
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <TabsList className="h-auto bg-transparent p-0 gap-6 flex-1">
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
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="h-9 w-9 ml-4"
              >
                <Settings className="h-5 w-5 text-[#003399]" />
              </Button>
            </div>
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
