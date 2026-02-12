import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const CoinOverviewFallback: React.FC = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton animate-pulse" />
        <div className="info">
          <div className="header-line-sm skeleton animate-pulse rounded" />
          <div className="header-line-lg skeleton animate-pulse rounded" />
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton animate-pulse rounded-xl" />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback: React.FC = () => {
  // Generate 3 skeleton rows for the table
  const skeletonRows = Array.from({ length: 3 });

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <div className="trending-coins-table">
        <Table className="custom-scrollbar">
          <TableHeader>
            <TableRow className="hover:bg-transparent!">
              <TableHead className="bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5">
                Name
              </TableHead>
              <TableHead className="bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5">
                24h Change
              </TableHead>
              <TableHead className="bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5">
                Price
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30! relative"
              >
                <TableCell className="py-4 first:pl-5 last:pr-5">
                  <div className="name-link">
                    <div className="name-image skeleton animate-pulse rounded-full" />
                    <div className="name-line skeleton animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell className="change-cell py-4 first:pl-5 last:pr-5">
                  <div className="change-line skeleton animate-pulse rounded" />
                </TableCell>
                <TableCell className="price-cell py-4 first:pl-5 last:pr-5">
                  <div className="h-4 w-20 skeleton animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
