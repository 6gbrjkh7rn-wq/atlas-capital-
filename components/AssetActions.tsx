"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AddAssetDialog } from "@/components/AddAssetDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Asset } from "@/lib/assets";
import { supabase } from "@/lib/supabase";

export function AssetActions({ asset }: { asset: Asset }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteAsset() {
    setError(null);
    setIsDeleting(true);

    const { error: deleteError } = await supabase
      .from("assets")
      .delete()
      .eq("id", asset.id);

    setIsDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
      <AddAssetDialog asset={asset} />
      <button
        type="button"
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:text-rose-400 dark:hover:bg-rose-400/10"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete Asset
      </button>
      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete asset?</DialogTitle>
            <DialogDescription>
              This will permanently remove {asset.name} from your portfolio.
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <p className="mt-4 text-sm text-rose-700 dark:text-rose-400" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="h-10 rounded-lg px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-10 rounded-lg bg-rose-700 px-4 text-sm font-medium text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={deleteAsset}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Asset"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
