"use server";

import { universalApi } from "@/actions/universal-api";

export interface SubscriptionPlan {
  plan: string;
  label: string;
  amount: number;           
  amountConverted: number; 
  amountFormatted: string; 
  months: number;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  chargeNote: string | null;
}

export interface ActiveSubscription {
  _id: string;
  userId: string;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface PaymentRecord {
  _id: string;
  plan: string;
  amount: number;
  merchantTransactionId: string;
  epsTransactionId?: string;
  paymentStatus: "pending" | "success" | "failed" | "cancelled";
  paidAt?: string;
  createdAt: string;
}

export interface InitiatePaymentResult {
  success: boolean;
  message?: string;
  data?: {
    merchantTransactionId: string;
    paymentUrl: string;
    plan: string;
    planLabel: string;
    amount: number;
  };
}

export async function initiatePaymentAction(
  plan: string
): Promise<InitiatePaymentResult> {
  const res = await universalApi<unknown>({
    endpoint: "/subscriptions/initiate",
    method: "POST",
    data: { plan },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Payment শুরু করতে সমস্যা হয়েছে।" };
  }

  const outer = res.data as Record<string, unknown> | undefined;
  const data = (outer?.data || outer) as Record<string, unknown> | undefined;

  return {
    success: true,
    data: {
      merchantTransactionId: data?.merchantTransactionId as string,
      paymentUrl: data?.paymentUrl as string,
      plan: data?.plan as string,
      planLabel: data?.planLabel as string,
      amount: data?.amount as number,
    },
  };
}