import { StockAnalysis } from '@/types/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockTableProps {
  stocks: StockAnalysis[];
}

export const StockTable = ({ stocks }: StockTableProps) => {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Price at T1</TableHead>
                <TableHead>Price at T2</TableHead>
                <TableHead>Max Price</TableHead>
                <TableHead>Min Price</TableHead>
                <TableHead>% Rise to Max</TableHead>
                <TableHead>% Fall to Min</TableHead>
                <TableHead>Volume at T1</TableHead>
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
                stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
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
                    <TableCell>{stock.volumeAtT1.toLocaleString()}</TableCell>
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
