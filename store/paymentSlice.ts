import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Currency, PaymentStatus, Transaction } from "@/types/payment";

interface PaymentState {
  status: PaymentStatus;
  history: Transaction[];
  currentTransaction: Transaction | null;
  selectedTransactionId: string | null;
  userMessage: string | null;
  networkError: boolean;
}

const initialState: PaymentState = {
  status: "idle",
  history: [],
  currentTransaction: null,
  selectedTransactionId: null,
  userMessage: null,
  networkError: false,
};

const upsertTransaction = (
  history: Transaction[],
  nextTransaction: Transaction,
): Transaction[] => {
  const index = history.findIndex((transaction) => transaction.id === nextTransaction.id);

  if (index === -1) {
    return [nextTransaction, ...history];
  }

  const cloned = [...history];
  cloned[index] = nextTransaction;
  return cloned;
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    hydrateHistory(state, action: PayloadAction<Transaction[]>) {
      state.history = action.payload;
    },
    initializeTransaction(
      state,
      action: PayloadAction<{
        id: string;
        amount: number;
        currency: Currency;
        timestamp: string;
      }>,
    ) {
      const transaction: Transaction = {
        id: action.payload.id,
        amount: action.payload.amount,
        currency: action.payload.currency,
        timestamp: action.payload.timestamp,
        status: "idle",
        attempts: 0,
      };

      state.currentTransaction = transaction;
      state.status = "idle";
      state.userMessage = null;
      state.networkError = false;
      state.selectedTransactionId = transaction.id;
      state.history = upsertTransaction(state.history, transaction);
    },
    startProcessing(state, action: PayloadAction<{ attempt: number; timestamp: string }>) {
      if (!state.currentTransaction) {
        return;
      }

      state.status = "processing";
      state.userMessage = "Processing your payment...";
      state.networkError = false;
      state.currentTransaction = {
        ...state.currentTransaction,
        attempts: action.payload.attempt,
        timestamp: action.payload.timestamp,
        status: "processing",
      };
      state.history = upsertTransaction(state.history, state.currentTransaction);
    },
    setResult(
      state,
      action: PayloadAction<{
        status: Exclude<PaymentStatus, "idle" | "processing">;
        timestamp: string;
        reason?: string;
        message: string;
        networkError?: boolean;
      }>,
    ) {
      if (!state.currentTransaction) {
        return;
      }

      state.status = action.payload.status;
      state.userMessage = action.payload.message;
      state.networkError = action.payload.networkError ?? false;

      state.currentTransaction = {
        ...state.currentTransaction,
        timestamp: action.payload.timestamp,
        status: action.payload.status,
        reason: action.payload.reason,
      };

      state.selectedTransactionId = state.currentTransaction.id;
      state.history = upsertTransaction(state.history, state.currentTransaction);
    },
    selectTransaction(state, action: PayloadAction<string>) {
      state.selectedTransactionId = action.payload;
    },
    clearSelection(state) {
      state.selectedTransactionId = null;
    },
    resetLifecycle(state) {
      state.status = "idle";
      state.userMessage = null;
      state.networkError = false;
      state.currentTransaction = null;
    },
  },
});

export const {
  hydrateHistory,
  initializeTransaction,
  startProcessing,
  setResult,
  selectTransaction,
  clearSelection,
  resetLifecycle,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
