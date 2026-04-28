// src/app/(protected)/subscription/page.tsx
import { universalApi } from "@/actions/universal-api";
import SubscriptionClient from "@/components/subscription/SubscriptionClient";

export const metadata = { title: "Premium – primehalf" };

async function fetchPlans() {
  // Server-side fetch — IP এখানে detect করা হবে না
  // Backend সব plans এর BDT + GBP দুটো amount-ই return করে
  // currency detection হবে SubscriptionClient এ browser থেকে
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/v1/subscriptions/plans`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  // Backend returns: { data: { plans: [...], detectedCountry, detectedCurrency } }
  return data.data?.plans ?? data.data ?? [];
}

async function fetchMySubscription() {
  const res = await universalApi<unknown>({
    endpoint: "/subscriptions/my",
  });
  if (!res.success) return null;
  const outer = res.data as Record<string, unknown> | undefined;
  return (outer?.data as Record<string, unknown>) || null;
}

async function fetchPaymentHistory() {
  const res = await universalApi<unknown>({
    endpoint: "/subscriptions/history?page=1&limit=5",
  });
  if (!res.success) return { data: [], meta: null };
  const outer = res.data as Record<string, unknown> | undefined;
  return {
    data: (outer?.data as unknown[]) || [],
    meta: (outer?.meta as Record<string, unknown>) || null,
  };
}

export default async function SubscriptionPage() {
  const [plans, subscription, history] = await Promise.all([
    fetchPlans().catch(() => []),
    fetchMySubscription().catch(() => null),
    fetchPaymentHistory().catch(() => ({ data: [], meta: null })),
  ]);

  return (
    <SubscriptionClient
      plans={plans}
      subscription={subscription as any}
      paymentHistory={history.data as any[]}
    />
  );
}