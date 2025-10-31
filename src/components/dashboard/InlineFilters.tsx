import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InlineFiltersProps {
  className?: string;
  isExpanded: boolean;
}

export function InlineFilters({ className, isExpanded }: InlineFiltersProps) {
  return (
    <>
      {isExpanded && (
        <div className={cn("border-b border-border bg-card", className)}>
          <div className="container mx-auto px-6 py-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cargo *</label>
                <Input placeholder="Digite o cargo" />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Posto *</label>
                <Input placeholder="Digite o posto" />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cliente *</label>
                <Input placeholder="Digite o cliente" />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Área *</label>
                <Input placeholder="Digite a área" />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Unidade de negócio *</label>
                <Input placeholder="Digite a unidade" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Centro de custo *</label>
                <Input placeholder="Digite o centro de custo" />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Data início *</label>
                <Input type="date" placeholder="dd/mm/aaaa" defaultValue="2024-01-01" />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Data fim *</label>
                <Input type="date" placeholder="dd/mm/aaaa" defaultValue="2024-12-31" />
              </div>

              <div className="lg:col-span-2 flex gap-2">
                <Button variant="outline" className="flex-1">
                  Limpar
                </Button>
                <Button className="flex-1 bg-[#003399] hover:bg-[#002266]">
                  Filtrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
