import { useState, useEffect } from 'react';
import { StockAnalysis } from '@/types/stock';
import { StockForm } from '@/components/StockForm';
import { StockTable } from '@/components/StockTable';
import { ExportButtons } from '@/components/ExportButtons';
import { useAlpacaData } from '@/hooks/useAlpacaData';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp } from 'lucide-react';

const Index = () => {
  const [stocks, setStocks] = useState<StockAnalysis[]>([]);
  const { fetchStockAnalysis, loading, error } = useAlpacaData();
  const { toast } = useToast();

  const handleAddStock = async (symbol: string, t1: string, duration: number) => {
    const analysis = await fetchStockAnalysis(symbol, t1, duration);

    if (analysis) {
      setStocks((prev) => [...prev, analysis]);
      toast({
        title: 'Success',
        description: `Analysis for ${symbol} added successfully`,
      });
    } else if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Stock Analysis Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Analyze historical stock data with second-level precision using Alpaca API
          </p>
        </div>

        <div className="space-y-6">
          <StockForm onSubmit={handleAddStock} loading={loading} />
          <ExportButtons stocks={stocks} />
          <StockTable stocks={stocks} />
        </div>
      </div>
    </div>
  );
};

export default Index;
