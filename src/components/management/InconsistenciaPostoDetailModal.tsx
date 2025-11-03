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

interface InconsistenciaPostoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  posto: string;
  colaboradores: Array<{
    nome: string;
    inconsistencias: number;
  }>;
}

export function InconsistenciaPostoDetailModal({
  isOpen,
  onClose,
  posto,
  colaboradores,
}: InconsistenciaPostoDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Colaboradores com Inconsistências - {posto}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead className="text-right">Total de Inconsistências</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradores.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="text-right">{item.inconsistencias}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
