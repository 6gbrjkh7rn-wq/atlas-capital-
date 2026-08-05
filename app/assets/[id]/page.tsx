import Link from "next/link";

import { AssetActions } from "@/components/AssetActions";
import { AppShell } from "@/components/layout/AppShell";
import {
  formatAssetDate,
  formatCurrency,
  formatQuantity,
  getAsset,
  toNumber,
} from "@/lib/assets";

type DetailItemProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

function DetailItem({ label, value, valueClassName }: DetailItemProps) {
  return (
    <div className="rounded-lg border border-neutral-200/80 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <dt className="text-sm text-neutral-500 dark:text-white/50">{label}</dt>
      <dd
        className={`mt-1.5 text-base font-medium tabular-nums text-neutral-900 dark:text-white ${valueClassName ?? ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export default async function AssetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await getAsset(id);

  if (!asset) {
    return (
      <AppShell title="Assets">
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Asset not found
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-white/50">
            This asset may have been deleted or the link is invalid.
          </p>
          <Link
            href="/assets"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Back to assets
          </Link>
        </div>
      </AppShell>
    );
  }

  const quantity = toNumber(asset.quantity);
  const averagePrice = toNumber(asset.average_price);
  const currentPrice = toNumber(asset.current_price);
  const totalValue = quantity * currentPrice;
  const gainLoss = quantity * (currentPrice - averagePrice);
  const gainLossPercent = averagePrice === 0 ? 0 : ((currentPrice - averagePrice) / averagePrice) * 100;
  const gainLossClassName = gainLoss > 0
    ? "text-emerald-700 dark:text-emerald-400"
    : gainLoss < 0
      ? "text-rose-700 dark:text-rose-400"
      : undefined;

  return (
    <AppShell title="Assets" action={<AssetActions asset={asset} />}>
      <div className="mb-6">
        <Link
          href="/assets"
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-white/50 dark:hover:text-white"
        >
          ← All assets
        </Link>
        <div className="mt-3 flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
            {asset.name}
          </h1>
          {asset.ticker ? (
            <span className="text-sm font-medium text-neutral-500 dark:text-white/50">
              {asset.ticker}
            </span>
          ) : null}
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="Name" value={asset.name} />
        <DetailItem label="Ticker" value={asset.ticker || "—"} />
        <DetailItem label="Asset Type" value={asset.asset_type} />
        <DetailItem label="Currency" value={asset.currency || "EUR"} />
        <DetailItem label="Quantity" value={formatQuantity(asset.quantity)} />
        <DetailItem
          label="Average Price"
          value={formatCurrency(asset.average_price, asset.currency)}
        />
        <DetailItem
          label="Current Price"
          value={formatCurrency(asset.current_price, asset.currency)}
        />
        <DetailItem
          label="Total Value"
          value={formatCurrency(totalValue, asset.currency)}
        />
        <DetailItem
          label="Gain/Loss (€)"
          value={formatCurrency(gainLoss, asset.currency)}
          valueClassName={gainLossClassName}
        />
        <DetailItem
          label="Gain/Loss (%)"
          value={`${gainLossPercent > 0 ? "+" : ""}${gainLossPercent.toFixed(2)}%`}
          valueClassName={gainLossClassName}
        />
        <DetailItem label="Created At" value={formatAssetDate(asset.created_at)} />
      </dl>
    </AppShell>
  );
}
