import { NextResponse } from "next/server";

import type { PaymentPayload } from "@/types/payment";

const failureReasons = [
  "Insufficient funds",
  "Card issuer declined the transaction",
  "Velocity limit exceeded",
  "Suspicious activity detected",
];

export async function POST(request: Request) {
  let payload: PaymentPayload;

  try {
    payload = (await request.json()) as PaymentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload.transactionId || !payload.currency || !Number.isFinite(payload.amount)) {
    return NextResponse.json({ error: "Missing required payment fields." }, { status: 400 });
  }

  const probability = Math.random();

  if (probability < 0.6) {
    return NextResponse.json({ status: "success" });
  }

  if (probability < 0.85) {
    const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
    return NextResponse.json({ status: "failed", reason });
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 8000);
  });

  return NextResponse.json({
    status: "failed",
    reason: "Provider timeout upstream",
  });
}
