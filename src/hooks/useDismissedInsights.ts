import { useState, useCallback } from "react";

export function useDismissedInsights(customerId: string | number = "642") {
  const key = `dismissed_insights_${customerId}`;

  const read = (): string[] => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const [dismissed, setDismissed] = useState<string[]>(read);

  const dismiss = useCallback(
    (id: string) => {
      setDismissed((prev) => {
        const next = [...prev, id];
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  const restore = useCallback(() => {
    localStorage.removeItem(key);
    setDismissed([]);
  }, [key]);

  return { dismissed, dismiss, restore };
}
