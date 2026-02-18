import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DataTable from "@/components/DataTable";
import CoinsPagination from "@/components/CoinsPagination";

const EXCLUDED_COIN_IDS = new Set(["figure-heloc", "whitebit"]);

const Coins = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const perPage = 10;

  const targetVisibleCount = currentPage * perPage + 1;
  const visibleCoins: CoinMarketData[] = [];
  let apiPage = 1;
  let reachedEnd = false;

  while (visibleCoins.length < targetVisibleCount && !reachedEnd) {
    const pageCoins = await fetcher<CoinMarketData[]>(`/coins/markets`, {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page: apiPage,
      sparkline: "false",
      price_change_percentage: "24h",
    });

    const filteredPageCoins = pageCoins.filter((coin) => !EXCLUDED_COIN_IDS.has(coin.id));
    visibleCoins.push(...filteredPageCoins);

    if (pageCoins.length < perPage) {
      reachedEnd = true;
    }

    apiPage += 1;

    if (apiPage > currentPage + 25) {
      break;
    }
  }

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const pageCoins = visibleCoins.slice(startIndex, endIndex);
  const displayRanks = new Map(pageCoins.map((coin, index) => [coin.id, startIndex + index + 1]));

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
      cell: (coin) => (
        <Link href={`/coins/${coin.id}`} aria-label={`View name`}>
          #{displayRanks.get(coin.id) ?? "-"}
        </Link>
      ),
    },
    {
      header: "Token",
      cellClassName: "token-cell",
      cell: (coin) => (
        <Link href={`/coins/${coin.id}`} aria-label={`View ${coin.name}`}>
          <div className="token-info">
            <Image src={coin.image} alt={coin.name} width={36} height={36} />
            <p>
              {coin.name} ({coin.symbol.toUpperCase()})
            </p>
          </div>
        </Link>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;
        return (
          <div className={cn("change-value", isTrendingUp ? "text-green-500" : "text-red-500")}>
            <p className="flex items-center">
              {formatPercentage(coin.price_change_percentage_24h)}
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  const hasMorePages = visibleCoins.length > endIndex || !reachedEnd;

  const estimatedTotalPages = currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>
        <DataTable
          data={pageCoins}
          columns={columns}
          rowKey={(coin) => coin.id}
          tableClassName="coins-table"
          headerCellClassName="py-3"
          bodyCellClassName="py-2!"
        />
        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default Coins;
