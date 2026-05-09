import type { CardType, PaymentFieldErrors, PaymentFormValues } from "@/types/payment";

import { CardInput } from "@/components/CardInput";
import { CardPreview } from "@/components/CardPreview";

interface PaymentFormProps {
  values: PaymentFormValues;
  errors: PaymentFieldErrors;
  cardType: CardType;
  isValid: boolean;
  isProcessing: boolean;
  onChangeField: (field: keyof PaymentFormValues, value: string) => void;
  onChangeCurrency: (currency: PaymentFormValues["currency"]) => void;
  onBlurField: (field: keyof PaymentFieldErrors) => void;
  onSubmit: () => void;
}

export function PaymentForm({
  values,
  errors,
  cardType,
  isValid,
  isProcessing,
  onChangeField,
  onChangeCurrency,
  onBlurField,
  onSubmit,
}: PaymentFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Card Payment</h2>

      <div className="mt-4">
        <CardPreview values={values} cardType={cardType} />
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="space-y-2">
          <label htmlFor="cardholderName" className="block text-sm font-semibold text-slate-800">
            Cardholder Name
          </label>
          <input
            id="cardholderName"
            value={values.cardholderName}
            onChange={(event) => onChangeField("cardholderName", event.target.value)}
            onBlur={() => onBlurField("cardholderName")}
            autoComplete="cc-name"
            aria-invalid={Boolean(errors.cardholderName)}
            aria-describedby={errors.cardholderName ? "cardholderName-error" : undefined}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Alex Johnson"
          />
          {errors.cardholderName ? (
            <p id="cardholderName-error" className="text-xs text-rose-700">
              {errors.cardholderName}
            </p>
          ) : null}
        </div>

        <CardInput
          id="cardNumber"
          value={values.cardNumber}
          cardType={cardType}
          error={errors.cardNumber}
          onChange={(value) => onChangeField("cardNumber", value)}
          onBlur={() => onBlurField("cardNumber")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="expiry" className="block text-sm font-semibold text-slate-800">
              Expiry (MM/YY)
            </label>
            <input
              id="expiry"
              value={values.expiry}
              onChange={(event) => onChangeField("expiry", event.target.value)}
              onBlur={() => onBlurField("expiry")}
              inputMode="numeric"
              autoComplete="cc-exp"
              aria-invalid={Boolean(errors.expiry)}
              aria-describedby={errors.expiry ? "expiry-error" : undefined}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="08/29"
            />
            {errors.expiry ? (
              <p id="expiry-error" className="text-xs text-rose-700">
                {errors.expiry}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="cvv" className="block text-sm font-semibold text-slate-800">
              CVV
            </label>
            <input
              id="cvv"
              value={values.cvv}
              onChange={(event) => onChangeField("cvv", event.target.value)}
              onBlur={() => onBlurField("cvv")}
              inputMode="numeric"
              autoComplete="cc-csc"
              aria-invalid={Boolean(errors.cvv)}
              aria-describedby={errors.cvv ? "cvv-error" : undefined}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder={cardType === "amex" ? "1234" : "123"}
            />
            {errors.cvv ? (
              <p id="cvv-error" className="text-xs text-rose-700">
                {errors.cvv}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[130px_1fr]">
          <div className="space-y-2">
            <label htmlFor="currency" className="block text-sm font-semibold text-slate-800">
              Currency
            </label>
            <select
              id="currency"
              value={values.currency}
              onChange={(event) => onChangeCurrency(event.target.value as PaymentFormValues["currency"])}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-semibold text-slate-800">
              Amount
            </label>
            <input
              id="amount"
              value={values.amount}
              onChange={(event) => onChangeField("amount", event.target.value)}
              onBlur={() => onBlurField("amount")}
              inputMode="decimal"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="1500.00"
            />
            {errors.amount ? (
              <p id="amount-error" className="text-xs text-rose-700">
                {errors.amount}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || isProcessing}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </section>
  );
}