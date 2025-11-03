import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AusenciaPostoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  posto: string;
  tipo: "atestados" | "ausencias";
  colaboradores: Array<{
    nome: string;
    quantidade: number;
  }>;
}

export function AusenciaPostoDetailModal({
  isOpen,
  onClose,
  posto,
  tipo,
  colaboradores,
}: AusenciaPostoDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Colaboradores com {tipo === "atestados" ? "Atestados" : "Ausências"} - {posto}
          </DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradores.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="text-right">{item.quantidade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
