import type { GatewayResponse, PaymentPayload } from "@/types/payment";

export class PaymentApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentApiError";
  }
}

export const requestPayment = async (
  payload: PaymentPayload,
  signal: AbortSignal,
): Promise<GatewayResponse> => {
  const response = await fetch("/api/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new PaymentApiError("Payment gateway responded with an unexpected status.");
  }

  const data = (await response.json()) as GatewayResponse;
  return data;
};
