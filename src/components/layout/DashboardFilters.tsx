import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardFiltersProps {
  onClear?: () => void;
}

export function DashboardFilters({ onClear }: DashboardFiltersProps) {
  const location = useLocation();
  const isHaasPage = location.pathname.startsWith("/haas");

  const handleClear = () => {
    onClear?.();
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* First Row - Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Cargo *</Label>
              <Input placeholder="Cargo" />
            </div>
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Posto *</Label>
              <Input placeholder="Posto" />
            </div>
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Cliente *</Label>
              <Input placeholder="Cliente" />
            </div>
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Área *</Label>
              <Input placeholder="Área" />
            </div>
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Unidade de negócio *</Label>
              <Input placeholder="Unidade de negócio" />
            </div>
          </div>

          {/* Second Row - Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Centro de custo *</Label>
              <Input placeholder="Centro de Custo" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Data início *</Label>
              <Input type="date" placeholder="dd/mm/aaaa" defaultValue="2024-01-01" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Data fim *</Label>
              <Input type="date" placeholder="dd/mm/aaaa" defaultValue="2024-12-31" />
            </div>
            
            {/* Haas specific filters */}
            {isHaasPage && (
              <>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Versão do Smart</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a versão" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Todas as versões</SelectItem>
                      <SelectItem value="smart-v1">Smart v1.0</SelectItem>
                      <SelectItem value="smart-v2">Smart v2.0</SelectItem>
                      <SelectItem value="smart-v3">Smart v3.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Versão do Terminal</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a versão" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Todas as versões</SelectItem>
                      <SelectItem value="terminal-v1">Terminal v1.0</SelectItem>
                      <SelectItem value="terminal-v2">Terminal v2.0</SelectItem>
                      <SelectItem value="terminal-v3">Terminal v3.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex items-end gap-2 lg:col-start-4 lg:col-span-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClear}
              >
                Limpar
              </Button>
              <Button className="flex-1">
                Filtrar
              </Button>
            </div>
          </div>

          {/* Third Row - Haas additional filters */}
          {isHaasPage && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Label className="text-xs text-muted-foreground mb-1.5 block">IMEI</Label>
                <Input placeholder="IMEI" />
              </div>
              <div className="relative">
                <Label className="text-xs text-muted-foreground mb-1.5 block">MAC</Label>
                <Input placeholder="MAC" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
