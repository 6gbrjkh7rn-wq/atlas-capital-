"use client";

import { useRouter } from "next/navigation";

import { AssetActions } from "@/components/AssetActions";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  formatCurrency,
  formatQuantity,
  toNumber,
  type Asset,
} from "@/lib/assets";

export function AssetTableRow({ asset }: { asset: Asset }) {
  const router = useRouter();
  const totalValue = toNumber(asset.quantity) * toNumber(asset.current_price);

  function openAsset() {
    router.push(`/assets/${asset.id}`);
  }

  return (
    <TableRow
      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:focus-visible:ring-white/60"
      tabIndex={0}
      role="link"
      aria-label={`View ${asset.name}`}
      onClick={openAsset}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openAsset();
        }
      }}
    >
      <TableCell className="font-medium text-neutral-900 dark:text-white">
        {asset.name}
      </TableCell>
      <TableCell>{asset.ticker || "—"}</TableCell>
      <TableCell>{asset.asset_type}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatQuantity(asset.quantity)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCurrency(asset.current_price, asset.currency)}
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums text-neutral-900 dark:text-white">
        {formatCurrency(totalValue, asset.currency)}
      </TableCell>
      <TableCell className="text-right">
        <AssetActions asset={asset} />
      </TableCell>
    </TableRow>
  );
}
