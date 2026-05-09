export type Currency = "INR" | "USD";

export type CardType = "visa" | "mastercard" | "amex" | "unknown";

export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

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

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: string;
  attempts: number;
  reason?: string;
}