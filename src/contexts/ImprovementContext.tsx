import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ImprovementStatus = "pending" | "resolved" | "cancelled";

export interface ImprovementComment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface ImprovementPosition {
  x: number;
  y: number;
  route: string;
}

export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  status: ImprovementStatus;
  comments: ImprovementComment[];
  createdAt: Date;
  position?: ImprovementPosition;
}

interface ImprovementContextType {
  items: ImprovementItem[];
  addItem: (item: Omit<ImprovementItem, "id" | "createdAt" | "comments" | "status">) => void;
  addComment: (itemId: string, text: string) => void;
  setStatus: (itemId: string, status: ImprovementStatus) => void;
  editItem: (itemId: string, title: string, description: string) => void;
  removeItem: (itemId: string) => void;
  showPins: boolean;
  togglePins: () => void;
}

const ImprovementContext = createContext<ImprovementContextType | null>(null);

export function useImprovement() {
  const ctx = useContext(ImprovementContext);
  if (!ctx) throw new Error("useImprovement must be used within ImprovementProvider");
  return ctx;
}

export function ImprovementProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ImprovementItem[]>([]);
  const [showPins, setShowPins] = useState(true);

  // Load items from DB
  const fetchItems = useCallback(async () => {
    const { data: improvements } = await supabase
      .from("improvements")
      .select("*")
      .order("created_at", { ascending: true });

    if (!improvements) return;

    const { data: comments } = await supabase
      .from("improvement_comments")
      .select("*")
      .order("created_at", { ascending: true });

    const mapped: ImprovementItem[] = improvements.map((imp: any) => ({
      id: imp.id,
      title: imp.title,
      description: imp.description,
      status: imp.status as ImprovementStatus,
      createdAt: new Date(imp.created_at),
      position: imp.position_x != null ? {
        x: Number(imp.position_x),
        y: Number(imp.position_y),
        route: imp.position_route || "",
      } : undefined,
      comments: (comments || [])
        .filter((c: any) => c.improvement_id === imp.id)
        .map((c: any) => ({
          id: c.id,
          text: c.text,
          author: c.author,
          createdAt: new Date(c.created_at),
        })),
    }));

    setItems(mapped);
  }, []);

  useEffect(() => {
    fetchItems();

    // Realtime subscription
    const channel = supabase
      .channel("improvements-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "improvements" }, () => fetchItems())
      .on("postgres_changes", { event: "*", schema: "public", table: "improvement_comments" }, () => fetchItems())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchItems]);

  const addItem = async (item: Omit<ImprovementItem, "id" | "createdAt" | "comments" | "status">) => {
    const insertData: any = {
      title: item.title,
      description: item.description,
      status: "pending",
    };
    if (item.position) {
      insertData.position_x = item.position.x;
      insertData.position_y = item.position.y;
      insertData.position_route = item.position.route;
    }
    await supabase.from("improvements").insert(insertData);
  };

  const addComment = async (itemId: string, text: string) => {
    await supabase.from("improvement_comments").insert({
      improvement_id: itemId,
      text,
      author: "UI Team",
    });
  };

  const setStatus = async (itemId: string, status: ImprovementStatus) => {
    await supabase.from("improvements").update({ status, updated_at: new Date().toISOString() }).eq("id", itemId);
  };

  const editItem = async (itemId: string, title: string, description: string) => {
    await supabase.from("improvements").update({ title, description, updated_at: new Date().toISOString() }).eq("id", itemId);
  };

  const removeItem = async (itemId: string) => {
    // Optimistic removal
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await supabase.from("improvements").delete().eq("id", itemId);
  };

  const togglePins = () => setShowPins((v) => !v);

  return (
    <ImprovementContext.Provider value={{ items, addItem, addComment, setStatus, editItem, removeItem, showPins, togglePins }}>
      {children}
    </ImprovementContext.Provider>
  );
}
