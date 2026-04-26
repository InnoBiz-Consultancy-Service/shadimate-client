import { universalApi } from "@/actions/universal-api";
import SubscriptionClient from "@/components/subscription/SubscriptionClient";
import { headers } from "next/headers";

export const metadata = { title: "Premium – ShadiMate" };

async function fetchPlans(userIp: string) {
  const res = await fetch(`${process.env.BASE_URL}/subscriptions/plans`, {
    cache: "no-store",
    headers: {
      "x-forwarded-for": userIp,
      "x-real-ip": userIp,
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.plans || data.data || [];
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
  const headersList = await headers();

  const forwarded = headersList.get("x-forwarded-for");
  const userIp =
    forwarded?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    "127.0.0.1";

  const [plans, subscription, history] = await Promise.all([
    fetchPlans(userIp).catch(() => []),
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