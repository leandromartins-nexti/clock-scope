import AnalyticsLockedSection from "./AnalyticsLockedSection";

const tabs = [
  { id: "pesquisas", label: "Checklist" },
  { id: "reconhecimento", label: "Direct" },
  { id: "comunicacao", label: "Avisos" },
];

export default function AnalyticsEngajamento() {
  return <AnalyticsLockedSection sectionName="Engajamento" sectionId="engajamento" tabs={tabs} />;
}
