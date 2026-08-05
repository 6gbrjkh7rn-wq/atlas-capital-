import { supabase } from "./supabase";

export type Asset = {
  id: string;
  name: string;
  ticker: string | null;
  asset_type: string;
  quantity: number | string | null;
  average_price: number | string | null;
  current_price: number | string | null;
  currency: string | null;
  created_at: string | null;
};

export function toNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

export function formatCurrency(value: unknown, currency: string | null) {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 2,
    }).format(toNumber(value));
  } catch {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(toNumber(value));
  }
}

export function formatQuantity(value: unknown) {
  return new Intl.NumberFormat("en-IE", {
    maximumFractionDigits: 8,
  }).format(toNumber(value));
}

export function formatAssetDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function getAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Asset[];
}

export async function getAsset(id: string): Promise<Asset | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Asset | null;
}
