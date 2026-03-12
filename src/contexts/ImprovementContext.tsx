import { createContext, useContext, useState, ReactNode } from "react";

export type ImprovementStatus = "pending" | "resolved" | "cancelled";

export interface ImprovementComment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  status: ImprovementStatus;
  comments: ImprovementComment[];
  createdAt: Date;
}

interface ImprovementContextType {
  items: ImprovementItem[];
  addComment: (itemId: string, text: string) => void;
  setStatus: (itemId: string, status: ImprovementStatus) => void;
  editItem: (itemId: string, title: string, description: string) => void;
  showPins: boolean;
  togglePins: () => void;
}

const ImprovementContext = createContext<ImprovementContextType | null>(null);

export function useImprovement() {
  const ctx = useContext(ImprovementContext);
  if (!ctx) throw new Error("useImprovement must be used within ImprovementProvider");
  return ctx;
}

const initialItems: ImprovementItem[] = [
  {
    id: "marcacoes-tipo-labels",
    title: "Traduzir variáveis de tipo de marcação",
    description: "Transformar a variável em inglês em texto legível:\n• INVALID_TIME = Horário Inválido\n• NOT_REGISTERED = Esquecimento",
    status: "pending",
    comments: [],
    createdAt: new Date("2026-03-12"),
  },
  {
    id: "coletores-tipo-labels",
    title: "Traduzir tipos de coletores",
    description: "Rever as traduções dos tipos de coletores:\n• SYSTEM = Sistema\n• TERMINAL = Terminal\n• MOBILE = Dispositivo Móvel",
    status: "pending",
    comments: [],
    createdAt: new Date("2026-03-12"),
  },
];

export function ImprovementProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ImprovementItem[]>(initialItems);
  const [showPins, setShowPins] = useState(true);

  const addComment = (itemId: string, text: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              comments: [
                ...item.comments,
                {
                  id: crypto.randomUUID(),
                  text,
                  author: "UI Team",
                  createdAt: new Date(),
                },
              ],
            }
          : item
      )
    );
  };

  const setStatus = (itemId: string, status: ImprovementStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
  };

  const editItem = (itemId: string, title: string, description: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, title, description } : item))
    );
  };

  const togglePins = () => setShowPins((v) => !v);

  return (
    <ImprovementContext.Provider value={{ items, addComment, setStatus, editItem, showPins, togglePins }}>
      {children}
    </ImprovementContext.Provider>
  );
}
