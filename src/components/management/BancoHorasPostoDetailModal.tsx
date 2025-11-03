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

interface BancoHorasPostoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  posto: string;
  colaboradores: Array<{
    nome: string;
    saldo: number;
  }>;
}

export function BancoHorasPostoDetailModal({
  isOpen,
  onClose,
  posto,
  colaboradores,
}: BancoHorasPostoDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Saldos de Banco de Horas - {posto}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead className="text-right">Saldo (horas)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradores.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className={`text-right font-semibold ${item.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.saldo > 0 ? '+' : ''}{item.saldo}h
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
