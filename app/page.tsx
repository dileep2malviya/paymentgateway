"use client";

import { PaymentForm } from "@/components/PaymentForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import type { PaymentFieldErrors, PaymentFormValues } from "@/types/payment";

export default function Home() {
  const values: PaymentFormValues = {
    cardholderName: "Alex Johnson",
    cardNumber: "4242 4242 4242 4242",
    expiry: "08/29",
    cvv: "123",
    amount: "1500.00",
    currency: "INR",
  };

  const errors: PaymentFieldErrors = {};
  const cardType = "visa" as const;
  const isValid = true;

  const onChangeField = () => {};
  const onChangeCurrency = () => {};
  const onBlurField = () => {};

  const handleSubmit = async () => {
    console.log("Submitting payment");
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
