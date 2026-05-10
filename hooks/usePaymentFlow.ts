"use client";

import { useCallback } from "react";

import type { PaymentFormValues } from "@/types/payment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initializeTransaction,
  resetLifecycle,
  setResult,
  startProcessing,
} from "@/store/paymentSlice";
import { requestPayment, PaymentApiError } from "@/utils/paymentApi";
import { sanitizeCardNumber } from "@/utils/card";

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const usePaymentFlow = () => {
  const dispatch = useAppDispatch();
  const { currentTransaction, status } = useAppSelector((state) => state.payment);

  const submitPayment = useCallback(
    async (values: PaymentFormValues, isRetry: boolean): Promise<void> => {
      if (status === "processing") {
        return;
      }

      const isRetryFlow = isRetry && currentTransaction !== null;
      const existingAttempts = isRetryFlow ? currentTransaction.attempts : 0;

      if (isRetryFlow && existingAttempts >= 3) {
        return;
      }

      const transactionId = isRetryFlow ? currentTransaction.id : crypto.randomUUID();
      const amount = Number(values.amount);
      const nowIso = new Date().toISOString();

      if (!isRetryFlow) {
        dispatch(
          initializeTransaction({
            id: transactionId,
            amount,
            currency: values.currency,
            timestamp: nowIso,
          }),
        );
      }

      const attempt = existingAttempts + 1;

      dispatch(startProcessing({ attempt, timestamp: nowIso }));

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 6000);
      const processingDelay = delay(2000);

      try {
        const response = await requestPayment(
          {
            transactionId,
            cardholderName: values.cardholderName.trim(),
            cardNumber: sanitizeCardNumber(values.cardNumber),
            expiry: values.expiry,
            cvv: values.cvv,
            amount,
            currency: values.currency,
          },
          controller.signal,
        );

        await processingDelay;

        if (response.status === "success") {
          dispatch(
            setResult({
              status: "success",
              timestamp: new Date().toISOString(),
              message: "Payment completed successfully.",
            }),
          );
          return;
        }

        const reachedLimit = attempt >= 3;
        dispatch(
          setResult({
            status: "failed",
            timestamp: new Date().toISOString(),
            reason: response.reason,
            message: reachedLimit
              ? `Payment failed: ${response.reason}. Maximum retry attempts reached.`
              : `Payment failed: ${response.reason}`,
          }),
        );
      } catch (error) {
        await processingDelay;

        const reachedLimit = attempt >= 3;

        if (error instanceof DOMException && error.name === "AbortError") {
          dispatch(
            setResult({
              status: "timeout",
              timestamp: new Date().toISOString(),
              reason: "Gateway timeout",
              message: reachedLimit
                ? "Gateway timed out. Maximum retry attempts reached."
                : "Gateway timed out after 6 seconds. Please retry.",
            }),
          );
          return;
        }

        if (error instanceof PaymentApiError) {
          dispatch(
            setResult({
              status: "failed",
              timestamp: new Date().toISOString(),
              reason: "Gateway rejected the request",
              message: reachedLimit
                ? "Gateway could not process the payment. Maximum retry attempts reached."
                : "Gateway could not process the payment. Please retry.",
            }),
          );
          return;
        }

        dispatch(
          setResult({
            status: "failed",
            timestamp: new Date().toISOString(),
            reason: "Network issue",
            message: reachedLimit
              ? "Network issue while contacting gateway. Maximum retry attempts reached."
              : "Network issue while contacting gateway. Please check your connection and retry.",
            networkError: true,
          }),
        );
      } finally {
        window.clearTimeout(timeoutId);
      }
    },
    [currentTransaction, dispatch, status],
  );

  const resetForNewPayment = useCallback(() => {
    dispatch(resetLifecycle());
  }, [dispatch]);

  return {
    submitPayment,
    resetForNewPayment,
  };
};
