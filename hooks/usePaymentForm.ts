"use client";

import { useMemo, useState } from "react";

import type { PaymentFieldErrors, PaymentFormValues } from "@/types/payment";
import { detectCardType, formatCardNumber, sanitizeExpiry } from "@/utils/card";
import { isFormValid, validatePaymentForm } from "@/utils/validation";

const initialFormValues: PaymentFormValues = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

type FieldName = keyof PaymentFieldErrors;

type TouchedFields = Record<FieldName, boolean>;

const initialTouched: TouchedFields = {
  cardholderName: false,
  cardNumber: false,
  expiry: false,
  cvv: false,
  amount: false,
};

export const usePaymentForm = () => {
  const [values, setValues] = useState<PaymentFormValues>(initialFormValues);
  const [touched, setTouched] = useState<TouchedFields>(initialTouched);

  const cardType = useMemo(() => detectCardType(values.cardNumber), [values.cardNumber]);

  const errors = useMemo(() => validatePaymentForm(values), [values]);

  const visibleErrors = useMemo<PaymentFieldErrors>(() => {
    return {
      cardholderName: touched.cardholderName ? errors.cardholderName : undefined,
      cardNumber: touched.cardNumber ? errors.cardNumber : undefined,
      expiry: touched.expiry ? errors.expiry : undefined,
      cvv: touched.cvv ? errors.cvv : undefined,
      amount: touched.amount ? errors.amount : undefined,
    };
  }, [errors, touched]);

  const onChangeField = (field: keyof PaymentFormValues, rawValue: string) => {
    let nextValue = rawValue;

    if (field === "cardNumber") {
      nextValue = formatCardNumber(rawValue);
    }

    if (field === "expiry") {
      nextValue = sanitizeExpiry(rawValue);
    }

    if (field === "cvv") {
      const expectedLength = cardType === "amex" ? 4 : 3;
      nextValue = rawValue.replace(/\D/g, "").slice(0, expectedLength);
    }

    if (field === "amount") {
      const sanitized = rawValue.replace(/[^\d.]/g, "");
      if (sanitized === "" || /^\d+(\.\d{0,2})?$/.test(sanitized)) {
        nextValue = sanitized;
      } else {
        return;
      }
    }

    setValues((previous) => ({
      ...previous,
      [field]: nextValue,
    }));

    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  };

  const onChangeCurrency = (currency: PaymentFormValues["currency"]) => {
    setValues((previous) => ({
      ...previous,
      currency,
    }));
  };

  const onBlurField = (field: FieldName) => {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  };

  const resetForm = () => {
    setValues(initialFormValues);
    setTouched(initialTouched);
  };

  return {
    values,
    cardType,
    errors: visibleErrors,
    isValid: isFormValid(errors),
    onChangeField,
    onChangeCurrency,
    onBlurField,
    resetForm,
  };
};
