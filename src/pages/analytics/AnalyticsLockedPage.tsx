import { useParams } from "react-router-dom";
import { lockedTabs } from "@/lib/analytics-mock-data";
import LockedTabOverlay from "@/components/analytics/LockedTabOverlay";

export default function AnalyticsLockedPage() {
  const { tabId } = useParams<{ tabId: string }>();
  const tab = lockedTabs.find((t) => t.id === tabId);

  if (!tab) {
    return <div className="p-6 text-muted-foreground">Página não encontrada.</div>;
  }

  return (
    <div className="bg-[hsl(var(--surface))] min-h-screen flex flex-col">
      <div className="px-6 py-4 flex-1">
        <LockedTabOverlay nome={tab.nome} descricao={tab.descricao} />
      </div>
    </div>
  );
}
