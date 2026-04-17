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
    <div className="bg-[hsl(var(--surface))] min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <div className="px-3 sm:px-6 py-3 sm:py-4 flex-1 min-w-0">
        <LockedTabOverlay nome={tab.nome} descricao={tab.descricao} />
      </div>
    </div>
  );
}
