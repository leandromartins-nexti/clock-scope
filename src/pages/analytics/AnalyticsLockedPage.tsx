import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { lockedTabs } from "@/lib/analytics-mock-data";
import LockedTabOverlay from "@/components/analytics/LockedTabOverlay";

export default function AnalyticsLockedPage() {
  const { tabId } = useParams<{ tabId: string }>();
  const navigate = useNavigate();
  const tab = lockedTabs.find((t) => t.id === tabId);

  if (!tab) {
    return <div className="p-6 text-muted-foreground">Página não encontrada.</div>;
  }

  return (
    <div className="bg-[hsl(var(--surface))] min-h-screen flex flex-col">
      <header className="border-b border-border px-6 py-3 bg-[hsl(var(--surface))]">
        <div className="flex items-center gap-2 text-sm">
          <span
            className="text-[#FF5722] font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/analytics")}
          >
            Home
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span
            className="text-[#FF5722] font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{tab.grupo}</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground font-semibold">{tab.nome}</span>
        </div>
      </header>

      <div className="px-6 py-4 flex-1">
        <LockedTabOverlay nome={tab.nome} descricao={tab.descricao} />
      </div>
    </div>
  );
}
