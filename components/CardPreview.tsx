import type { CardType, PaymentFormValues } from "@/types/payment";

interface CardPreviewProps {
  values: PaymentFormValues;
  cardType: CardType;
}

const cardTypeLabel: Record<CardType, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  unknown: "Card",
};

const placeholderCardNumber = "#### #### #### ####";

export function CardPreview({ values, cardType }: CardPreviewProps) {
  const number = values.cardNumber || placeholderCardNumber;
  const holderName = values.cardholderName.trim() || "CARDHOLDER NAME";
  const expiry = values.expiry || "MM/YY";

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-700 via-cyan-600 to-emerald-500 p-5 text-white shadow-lg">
      <div className="absolute -top-14 right-0 h-36 w-36 rounded-full bg-white/20" />
      <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-amber-300/30" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-start justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-cyan-100">Live Preview</span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{cardTypeLabel[cardType]}</span>
        </div>

        <p className="font-mono text-xl tracking-[0.15em]">{number}</p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase text-cyan-100">Cardholder</p>
            <p className="text-sm font-semibold uppercase tracking-wide">{holderName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-cyan-100">Expiry</p>
            <p className="text-sm font-semibold tracking-wide">{expiry}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
