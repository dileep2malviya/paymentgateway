import type { CardType, PaymentFieldErrors, PaymentFormValues } from "@/types/payment";
import { detectCardType, sanitizeCardNumber } from "@/utils/card";

const namePattern = /^[A-Za-z\s.'-]{2,}$/;

const luhnCheck = (cardNumber: string): boolean => {
  const digits = sanitizeCardNumber(cardNumber);
  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return digits.length > 0 && sum % 10 === 0;
};

export const validateCardholderName = (name: string): string | undefined => {
  if (!name.trim()) {
    return "Cardholder name is required.";
  }

  if (!namePattern.test(name.trim())) {
    return "Enter a valid name.";
  }

  return undefined;
};

export const validateCardNumber = (cardNumber: string, cardType: CardType): string | undefined => {
  const digits = sanitizeCardNumber(cardNumber);
  const expectedLength = cardType === "amex" ? 15 : 16;

  if (digits.length === 0) {
    return "Card number is required.";
  }

  if (digits.length !== expectedLength) {
    return `Card number must be ${expectedLength} digits.`;
  }

  if (!luhnCheck(digits)) {
    return "Card number is invalid.";
  }

  return undefined;
};

export const validateExpiry = (expiry: string): string | undefined => {
  if (!expiry.trim()) {
    return "Expiry date is required.";
  }

  if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) {
    return "Use MM/YY format.";
  }

  const [monthStr, yearStr] = expiry.split("/");
  const month = Number(monthStr);
  const year = Number(yearStr);

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired.";
  }

  return undefined;
};

export const validateCvv = (cvv: string, cardType: CardType): string | undefined => {
  const digits = cvv.replace(/\D/g, "");
  const expectedLength = cardType === "amex" ? 4 : 3;

  if (digits.length === 0) {
    return "CVV is required.";
  }

  if (digits.length !== expectedLength) {
    return `CVV must be ${expectedLength} digits.`;
  }

  return undefined;
};

export const validateAmount = (amount: string): string | undefined => {
  if (!amount.trim()) {
    return "Amount is required.";
  }

  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    return "Use a valid amount with up to 2 decimals.";
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "Amount must be greater than 0.";
  }

  return undefined;
};

export const validatePaymentForm = (values: PaymentFormValues): PaymentFieldErrors => {
  const cardType = detectCardType(values.cardNumber);

  return {
    cardholderName: validateCardholderName(values.cardholderName),
    cardNumber: validateCardNumber(values.cardNumber, cardType),
    expiry: validateExpiry(values.expiry),
    cvv: validateCvv(values.cvv, cardType),
    amount: validateAmount(values.amount),
  };
};

export const isFormValid = (errors: PaymentFieldErrors): boolean => {
  return Object.values(errors).every((value) => value === undefined);
};
