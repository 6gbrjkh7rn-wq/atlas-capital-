"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AssetTableRow } from "@/components/AssetTableRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAssetGainLoss, getAssetTotalValue, toNumber, type Asset } from "@/lib/assets";

const rowsPerPage = 10;

type SortKey =
  | "name"
  | "asset_type"
  | "quantity"
  | "currentPrice"
  | "totalValue"
  | "gainLoss";
type SortDirection = "ascending" | "descending";

type SortButtonProps = {
  children: string;
  sortKey: SortKey;
  activeSort: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
};

function SortButton({
  children,
  sortKey,
  activeSort,
  direction,
  onSort,
}: SortButtonProps) {
  const isActive = activeSort === sortKey;
  const Icon = isActive
    ? direction === "ascending"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:hover:text-white dark:focus-visible:ring-white/60"
      onClick={() => onSort(sortKey)}
    >
      {children}
      <Icon className="size-3" aria-hidden="true" />
    </button>
  );
}

export function AssetManagementTable({ assets }: { assets: Asset[] }) {
  const [search, setSearch] = useState("");
  const [assetType, setAssetType] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ascending");
  const [page, setPage] = useState(1);

  const assetTypes = useMemo(
    () => [...new Set(assets.map((asset) => asset.asset_type))].sort(),
    [assets],
  );
  const currencies = useMemo(
    () => [...new Set(assets.map((asset) => asset.currency || "EUR"))].sort(),
    [assets],
  );
  const filteredAssets = useMemo(() => {
    const searchTerm = search.trim().toLocaleLowerCase();

    return assets
      .filter((asset) => {
        const matchesSearch =
          !searchTerm ||
          asset.name.toLocaleLowerCase().includes(searchTerm) ||
          asset.ticker?.toLocaleLowerCase().includes(searchTerm);
        const matchesType = assetType === "all" || asset.asset_type === assetType;
        const matchesCurrency = currency === "all" || (asset.currency || "EUR") === currency;

        return matchesSearch && matchesType && matchesCurrency;
      })
      .sort((left, right) => {
        let comparison = 0;

        if (sortKey === "name" || sortKey === "asset_type") {
          comparison = left[sortKey].localeCompare(right[sortKey]);
        } else if (sortKey === "quantity") {
          comparison = toNumber(left.quantity) - toNumber(right.quantity);
        } else if (sortKey === "currentPrice") {
          comparison = toNumber(left.current_price) - toNumber(right.current_price);
        } else if (sortKey === "totalValue") {
          comparison = getAssetTotalValue(left) - getAssetTotalValue(right);
        } else {
          comparison = getAssetGainLoss(left) - getAssetGainLoss(right);
        }

        return sortDirection === "ascending" ? comparison : -comparison;
      });
  }, [assetType, assets, currency, search, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const visibleAssets = filteredAssets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  function updateFilters(update: () => void) {
    update();
    setPage(1);
  }

  function handleSort(nextSortKey: SortKey) {
    setSortDirection((currentDirection) =>
      sortKey === nextSortKey && currentDirection === "ascending"
        ? "descending"
        : "ascending",
    );
    setSortKey(nextSortKey);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:max-w-sm sm:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <span className="sr-only">Search assets</span>
          <input
            type="search"
            value={search}
            onChange={(event) => updateFilters(() => setSearch(event.target.value))}
            placeholder="Search name or ticker..."
            className="h-10 w-full rounded-lg border border-neutral-200 bg-white pr-3 pl-9 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="asset-type-filter">
            Filter by asset type
          </label>
          <select
            id="asset-type-filter"
            value={assetType}
            onChange={(event) => updateFilters(() => setAssetType(event.target.value))}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10"
          >
            <option value="all">All asset types</option>
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="currency-filter">
            Filter by currency
          </label>
          <select
            id="currency-filter"
            value={currency}
            onChange={(event) => updateFilters(() => setCurrency(event.target.value))}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10"
          >
            <option value="all">All currencies</option>
            {currencies.map((currencyOption) => (
              <option key={currencyOption} value={currencyOption}>
                {currencyOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
              <TableHead aria-sort={sortKey === "name" ? sortDirection : "none"}>
                <SortButton sortKey="name" activeSort={sortKey} direction={sortDirection} onSort={handleSort}>
                  Name
                </SortButton>
              </TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead aria-sort={sortKey === "asset_type" ? sortDirection : "none"}>
                <SortButton sortKey="asset_type" activeSort={sortKey} direction={sortDirection} onSort={handleSort}>
                  Asset Type
                </SortButton>
              </TableHead>
              <TableHead className="text-right" aria-sort={sortKey === "quantity" ? sortDirection : "none"}>
                <SortButton sortKey="quantity" activeSort={sortKey} direction={sortDirection} onSort={handleSort}>
                  Quantity
                </SortButton>
              </TableHead>
              <TableHead className="text-right" aria-sort={sortKey === "currentPrice" ? sortDirection : "none"}>
                <SortButton sortKey="currentPrice" activeSort={sortKey} direction={sortDirection} onSort={handleSort}>
                  Current Price
                </SortButton>
              </TableHead>
              <TableHead className="text-right" aria-sort={sortKey === "totalValue" ? sortDirection : "none"}>
                <SortButton sortKey="totalValue" activeSort={sortKey} direction={sortDirection} onSort={handleSort}>
                  Total Value
                </SortButton>
              </TableHead>
              <TableHead className="text-right" aria-sort={sortKey === "gainLoss" ? sortDirection : "none"}>
                <SortButton sortKey="gainLoss" activeSort={sortKey} direction={sortDirection} onSort={handleSort}>
                  Gain/Loss
                </SortButton>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleAssets.length > 0 ? (
              visibleAssets.map((asset) => <AssetTableRow key={asset.id} asset={asset} />)
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-neutral-500 dark:text-white/50">
                  No assets match your search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between dark:text-white/50">
        <p>
          {filteredAssets.length === 0
            ? "No assets found"
            : `Showing ${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, filteredAssets.length)} of ${filteredAssets.length} assets`}
        </p>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-16 text-center tabular-nums">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
            onClick={() => setPage((currentPage) => Math.min(pageCount, currentPage + 1))}
            disabled={currentPage === pageCount}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
