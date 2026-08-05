import { AddAssetDialog } from "@/components/AddAssetDialog";
import { AssetTableRow } from "@/components/AssetTableRow";
import { AppShell } from "@/components/layout/AppShell";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAssets } from "@/lib/assets";

export default async function AssetsPage() {
  const assets = (await getAssets()) ?? [];

  return (
    <AppShell title="Assets" action={<AddAssetDialog />}>
      {assets.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-white/50">No assets found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Asset Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <AssetTableRow key={asset.id} asset={asset} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AppShell>
  );
}
