import React from "react";
import Image from "next/image";
import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;
  let error: Error | null = null;

  try {
    coin = await fetcher<CoinDetailsData>("/coins/bitcoin", {
      dex_pair_format: "symbol",
    });
  } catch (err) {
    console.error("Failed to fetch coin overview data:", err);
    error = err instanceof Error ? err : new Error("Unknown error");
  }

  if (error || !coin) {
    return (
      <div id="coin-overview">
        <div className="header pt-2">
          <div className="info">
            <p className="text-red-500">Failed to load coin data</p>
            <p className="text-sm text-gray-400">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="coin-overview">
      <div className="header pt-2">
        <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
        <div className="info">
          <p>
            {coin.name} / {coin.symbol.toUpperCase()}
          </p>
          <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
        </div>
      </div>
    </div>
  );
};

export default CoinOverview;
