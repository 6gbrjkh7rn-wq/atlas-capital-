"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

const assetTypes = [
  "Cash",
  "Stock",
  "ETF",
  "Crypto",
  "Bond",
  "Real Estate",
  "Other",
];

const initialAssetForm = {
  name: "",
  ticker: "",
  assetType: "Stock",
  quantity: "0",
  averagePrice: "0",
  currentPrice: "0",
  currency: "EUR",
};

type AssetForm = typeof initialAssetForm;

const fieldClassName =
  "mt-1.5 h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10";

export function AddAssetDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AssetForm>(initialAssetForm);

  function updateForm(field: keyof AssetForm, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: insertError } = await supabase.from("assets").insert({
      name: form.name.trim(),
      ticker: form.ticker.trim() || null,
      asset_type: form.assetType,
      quantity: Number(form.quantity),
      average_price: Number(form.averagePrice),
      current_price: Number(form.currentPrice),
      currency: form.currency.trim().toUpperCase(),
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setForm(initialAssetForm);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#111214]"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Asset
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
          <DialogDescription>
            Add a holding to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Name
            <input
              className={fieldClassName}
              name="name"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              required
            />
          </label>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Ticker
            <input
              className={fieldClassName}
              name="ticker"
              value={form.ticker}
              onChange={(event) => updateForm("ticker", event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Asset Type
            <select
              className={fieldClassName}
              name="assetType"
              value={form.assetType}
              onChange={(event) => updateForm("assetType", event.target.value)}
            >
              {assetTypes.map((assetType) => (
                <option key={assetType} value={assetType}>
                  {assetType}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Quantity
              <input
                className={fieldClassName}
                name="quantity"
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={(event) => updateForm("quantity", event.target.value)}
                required
              />
            </label>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Average Price
              <input
                className={fieldClassName}
                name="averagePrice"
                type="number"
                min="0"
                step="any"
                value={form.averagePrice}
                onChange={(event) =>
                  updateForm("averagePrice", event.target.value)
                }
                required
              />
            </label>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Current Price
              <input
                className={fieldClassName}
                name="currentPrice"
                type="number"
                min="0"
                step="any"
                value={form.currentPrice}
                onChange={(event) =>
                  updateForm("currentPrice", event.target.value)
                }
                required
              />
            </label>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Currency
              <input
                className={fieldClassName}
                name="currency"
                value={form.currency}
                onChange={(event) => updateForm("currency", event.target.value)}
                maxLength={3}
                required
              />
            </label>
          </div>
          {error ? (
            <p className="text-sm text-rose-700 dark:text-rose-400" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              className="h-10 rounded-lg px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isSubmitting ? "Adding..." : "Add Asset"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
