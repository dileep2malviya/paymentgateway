"use client";

import { useEffect, useRef } from "react";

import type { PaymentStatus } from "@/types/payment";

interface StatusScreenProps {
  status: PaymentStatus;
  message: string | null;
  attempts: number;
  maxAttempts: number;
  canRetry: boolean;
  onRetry: () => void;
  onNewPayment: () => void;
}

const statusTone: Record<
  Exclude<PaymentStatus, "idle">,
  { title: string; classes: string }
> = {
  processing: {
    title: "Processing",
    classes: "border-amber-200 bg-amber-50 text-amber-900",
  },
  success: {
    title: "Success",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  failed: {
    title: "Failed",
    classes: "border-rose-200 bg-rose-50 text-rose-900",
  },
  timeout: {
    title: "Timeout",
    classes: "border-orange-200 bg-orange-50 text-orange-900",
  },
};

export function StatusScreen({
  status,
  message,
  attempts,
  maxAttempts,
  canRetry,
  onRetry,
  onNewPayment,
}: StatusScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status !== "idle") {
      headingRef.current?.focus();
    }
  }, [status]);

  if (status === "idle") {
    return null;
  }

  const tone = statusTone[status];

  return (
    <section className={`rounded-2xl border p-4 ${tone.classes}`} aria-live="polite">
      <h2 ref={headingRef} tabIndex={-1} className="text-lg font-bold outline-none">
        {tone.title}
      </h2>

      <p className="mt-2 text-sm">{message ?? "No status message available."}</p>

      {status !== "processing" ? (
        <p className="mt-2 text-xs font-semibold">
          Attempt {attempts} of {maxAttempts}
        </p>
      ) : null}

      {status === "success" ? (
        <button
          type="button"
          onClick={onNewPayment}
          className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          New Payment
        </button>
      ) : null}

      {(status === "failed" || status === "timeout") ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRetry}
            disabled={!canRetry}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Retry Payment
          </button>
          <button
            type="button"
            onClick={onNewPayment}
            className="rounded-lg border border-current px-4 py-2 text-sm font-semibold"
          >
            Start New Transaction
          </button>
        </div>
      ) : null}

      {!canRetry && (status === "failed" || status === "timeout") ? (
        <p className="mt-3 text-xs font-semibold">
          Final failure: retry limit reached for this transaction.
        </p>
      ) : null}
    </section>
  );
}
