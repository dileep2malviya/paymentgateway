import type { Transaction } from "@/types/payment";

export const HISTORY_STORAGE_KEY = "payment-gateway-history";

export const loadHistoryFromStorage = (): Transaction[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Transaction[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

export const saveHistoryToStorage = (history: Transaction[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
};
