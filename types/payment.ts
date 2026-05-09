export type Currency = "INR" | "USD";

export type CardType = "visa" | "mastercard" | "amex" | "unknown";

export interface PaymentFieldErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  amount?: string;
}

export interface PaymentFormValues {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: Currency;
}