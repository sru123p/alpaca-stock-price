import { StockAnalysis } from '@/types/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockTableProps {
  stocks: StockAnalysis[];
  onDelete: (id: string) => void;
}

export const StockTable = ({ stocks, onDelete }: StockTableProps) => {
  const formatPrice = (price: number) => `$${price.toFixed(4)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>T1</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price at T1</TableHead>
                <TableHead>Price at T2</TableHead>
                <TableHead>Max Price</TableHead>
                <TableHead>Min Price</TableHead>
                <TableHead>% Rise to Max</TableHead>
                <TableHead>% Fall to Min</TableHead>
                <TableHead>Occurred First</TableHead>
                <TableHead>% T1 to T2</TableHead>
                <TableHead>Volume at T1</TableHead>
                <TableHead>Ask at T1</TableHead>
                <TableHead>Bid at T2</TableHead>
                <TableHead>% Ask to Bid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No stock data yet. Add a stock to begin analysis.
                  </TableCell>
                </TableRow>
              ) : (
                stocks.map((stock, index) => (
                  <TableRow key={stock.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <TableCell  className="text-center">{index + 1}.</TableCell>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>{stock.inputTime}</TableCell>
                    <TableCell>{stock.duration}{" "}{stock.timeUnit}</TableCell>
                    <TableCell>{formatPrice(stock.priceAtT1)}</TableCell>
                    <TableCell>{formatPrice(stock.priceAtT2)}</TableCell>
                    <TableCell className="text-green-600 dark:text-green-400">
                      {formatPrice(stock.maxPrice)}
                    </TableCell>
                    <TableCell className="text-red-600 dark:text-red-400">
                      {formatPrice(stock.minPrice)}
                    </TableCell>
                    <TableCell className="text-green-600 dark:text-green-400">
                      {formatPercent(stock.percentIncreaseToMax)}
                    </TableCell>
                    <TableCell className="text-red-600 dark:text-red-400">
                      {formatPercent(stock.percentDecreaseToMin)}
                    </TableCell>
                    <TableCell>
                      {stock.firstEvent}
                    </TableCell>
                    <TableCell
                      className={
                        stock.percentChangeT1toT2 < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }
                    >
                      {formatPercent(stock.percentChangeT1toT2)}
                    </TableCell>
                    <TableCell>{stock.volumeAtT1.toLocaleString()}</TableCell>
                    <TableCell>{formatPrice(stock.askAtT1)}</TableCell>
                    <TableCell>{formatPrice(stock.bidAtT2)}</TableCell>
                    <TableCell
                      className={
                        stock.percentChangeT1toT2 < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }
                    >
                      {formatPercent(stock.percentChangeAsktoBid)}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                      onClick={() => onDelete(stock.id)}
                      className="hidden group-hover:inline-flex p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete row"
                      >
                      <X className="w-4 h-4 text-red-600 hover:text-red-700" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
