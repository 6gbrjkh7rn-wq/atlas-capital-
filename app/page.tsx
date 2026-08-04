import { Banknote, Landmark, WalletCards, Waypoints } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { AddAssetDialog } from "@/components/AddAssetDialog";
import { KPICard } from "@/components/ui/KPICard";
import { getAssets } from "@/lib/assets";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function toNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

export default async function Home() {
  const assets = (await getAssets()) ?? [];
  const netWorth = assets.reduce(
    (total, asset) =>
      total + toNumber(asset.quantity) * toNumber(asset.current_price),
    0,
  );
  const liquidity = assets.reduce(
    (total, asset) =>
      asset.asset_type === "Cash"
        ? total + toNumber(asset.current_price)
        : total,
    0,
  );
  const portfolioValue = netWorth - liquidity;

  return (
    <AppShell action={<AddAssetDialog />}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <KPICard
          title="Net Worth"
          value={currencyFormatter.format(netWorth)}
          change="Current total"
          trend="neutral"
          icon={Landmark}
          emphasized
        />
        <KPICard
          title="Portfolio Value"
          value={currencyFormatter.format(portfolioValue)}
          change="Current total"
          trend="neutral"
          icon={Waypoints}
        />
        <KPICard
          title="Liquidity"
          value={currencyFormatter.format(liquidity)}
          change="Cash holdings"
          trend="neutral"
          icon={WalletCards}
        />
        <KPICard
          title="Number of Assets"
          value={assets.length.toString()}
          change="Total holdings"
          trend="neutral"
          icon={Banknote}
        />
      </div>
    </AppShell>
  );
}
