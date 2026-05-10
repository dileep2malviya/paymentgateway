"use client";

import { PaymentForm } from "@/components/PaymentForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { usePaymentForm } from "@/hooks/usePaymentForm";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Home() {
  const dispatch = useAppDispatch();
  const { values, cardType, errors, isValid, onChangeField, onChangeCurrency, onBlurField, resetForm } =
    usePaymentForm();

    const { submitPayment, resetForNewPayment } = usePaymentFlow();

  const handleSubmit = async () => {
    await submitPayment(values, false);
  };

  return (
    <div className="app-shell flex-1">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Payment Gateway UI
          </h1>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <PaymentForm
              values={values}
              errors={errors}
              cardType={cardType}
              isValid={isValid}
              isProcessing={false}
              onChangeField={onChangeField}
              onChangeCurrency={onChangeCurrency}
              onBlurField={onBlurField}
              onSubmit={handleSubmit}
            />
          </div>

          <TransactionHistory />
        </div>
      </main>
    </div>
  );
}
