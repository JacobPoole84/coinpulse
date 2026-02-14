import React from "react";
import { fetcher } from "@/lib/coingecko.actions";
import DataTable, { DataTableColumn } from "../DataTable";
import Image from "next/image";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const TrendingCoins = async () => {
  let trendingCoins: { coins: TrendingCoin[] } | null = null;
  let error: Error | null = null;

  try {
    trendingCoins = await fetcher<{ coins: TrendingCoin[] }>("/search/trending", undefined, 300);
  } catch (err) {
    console.error("Failed to fetch trending coins data:", err);
    error = err instanceof Error ? err : new Error("Unknown error");
  }

  if (error || !trendingCoins) {
    return (
      <div id="trending-coins">
        <h4>Trending Coins</h4>
        <div className="p-5 text-red-500 text-center">
          <p>Failed to load trending coins</p>
          <p className="text-sm text-gray-400 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: (coin) => {
        const item = coin.item;
        return (
          <Link href={`/coins/${item.id}`} className="flex items-center gap-3">
            <Image src={item.large} alt={item.name} width={36} height={36} />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-gray-500">{item.symbol.toUpperCase()}</p>
            </div>
          </Link>
        );
      },
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;
        const change = item.data.price_change_percentage_24h.usd;

        return (
          <div
            className={cn(
              "flex items-center gap-2",
              isTrendingUp ? "text-green-500" : "text-red-500"
            )}
          >
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => formatCurrency(coin.item.data.price),
    },
  ];

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
        <DataTable
          data={trendingCoins.coins.slice(0, 6) || []}
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3"
          bodyCellClassName="py-2!"
        />
    </div>
  );
};

export default TrendingCoins;
