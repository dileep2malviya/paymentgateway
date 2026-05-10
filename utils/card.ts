import type { CardType } from "@/types/payment";

export const sanitizeCardNumber = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 16);
};

export const formatCardNumber = (value: string): string => {
  const digits = sanitizeCardNumber(value);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

export const detectCardType = (cardNumber: string): CardType => {
  const digits = sanitizeCardNumber(cardNumber);

  if (/^4/.test(digits)) {
    return "visa";
  }

  if (/^3[47]/.test(digits)) {
    return "amex";
  }

  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) {
    return "mastercard";
  }

  return "unknown";
};

export const sanitizeExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length < 3) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const getCardLast4 = (cardNumber: string): string => {
  const digits = sanitizeCardNumber(cardNumber);
  return digits.slice(-4);
};

export const maskCardNumber = (cardNumber: string): string => {
  const digits = sanitizeCardNumber(cardNumber);
  if (digits.length === 0) {
    return "";
  }

  const hidden = digits.slice(0, -4).replace(/\d/g, "*");
  const visible = digits.slice(-4);
  return formatCardNumber(`${hidden}${visible}`);
};
