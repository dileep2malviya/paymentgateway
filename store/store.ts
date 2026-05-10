import { configureStore } from "@reduxjs/toolkit";

import { paymentReducer } from "@/store/paymentSlice";
import { loadHistoryFromStorage, saveHistoryToStorage } from "@/utils/storage";

const preloadedHistory = loadHistoryFromStorage();

export const store = configureStore({
  reducer: {
    payment: paymentReducer,
  },
  preloadedState: {
    payment: {
      status: "idle" as import("@/types/payment").PaymentStatus,
      history: preloadedHistory,
      currentTransaction: null,
      selectedTransactionId: null,
      userMessage: null,
      networkError: false,
    },
  },
});

let previousHistory = JSON.stringify(store.getState().payment.history);

store.subscribe(() => {
  const currentHistory = store.getState().payment.history;
  const serialized = JSON.stringify(currentHistory);

  if (serialized !== previousHistory) {
    previousHistory = serialized;
    saveHistoryToStorage(currentHistory);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
