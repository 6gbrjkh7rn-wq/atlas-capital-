import { AddAssetDialog } from "@/components/AddAssetDialog";
import { AssetManagementTable } from "@/components/AssetManagementTable";
import { AppShell } from "@/components/layout/AppShell";
import { getAssets } from "@/lib/assets";

export default async function AssetsPage() {
  const assets = (await getAssets()) ?? [];

  return (
    <AppShell title="Assets" action={<AddAssetDialog />}>
      <AssetManagementTable assets={assets} />
    </AppShell>
  );
}
