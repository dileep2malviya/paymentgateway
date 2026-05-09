import type { CardType } from "@/types/payment";

interface CardInputProps {
  id: string;
  value: string;
  cardType: CardType;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const cardTypeLabel: Record<CardType, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  amex: "AMEX",
  unknown: "CARD",
};

export function CardInput({ id, value, cardType, error, onChange, onBlur }: CardInputProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        Card Number
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="w-full bg-transparent text-sm text-slate-900 outline-none"
        />
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold tracking-wide text-emerald-800">
          {cardTypeLabel[cardType]}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
