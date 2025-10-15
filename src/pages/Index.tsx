import { useState, useEffect } from 'react';
import { StockAnalysis } from '@/types/stock';
import { StockForm } from '@/components/StockForm';
import { StockTable } from '@/components/StockTable';
import { ExportButtons } from '@/components/ExportButtons';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { useAlpacaData } from '@/hooks/useAlpacaData';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp } from 'lucide-react';

const STORAGE_KEYS = {
  STOCKS: 'stock-analysis-data',
  API_KEY: 'alpaca-api-key',
  API_SECRET: 'alpaca-api-secret',
};

const Index = () => {
  const [stocks, setStocks] = useState<StockAnalysis[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const { fetchStockAnalysis, loading, error } = useAlpacaData();
  const { toast } = useToast();

  useEffect(() => {
    const savedStocks = localStorage.getItem(STORAGE_KEYS.STOCKS);
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    const savedApiSecret = localStorage.getItem(STORAGE_KEYS.API_SECRET);

    if (savedStocks) {
      setStocks(JSON.parse(savedStocks));
    }
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedApiSecret) setApiSecret(savedApiSecret);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCKS, JSON.stringify(stocks));
  }, [stocks]);

  const handleSaveApiKeys = (key: string, secret: string) => {
    setApiKey(key);
    setApiSecret(secret);
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    localStorage.setItem(STORAGE_KEYS.API_SECRET, secret);
    toast({
      title: 'API Keys Saved',
      description: 'Your Alpaca API credentials have been saved locally',
    });
  };

  const handleAddStock = async (symbol: string, t1: string, duration: number) => {
    if (!apiKey || !apiSecret) {
      toast({
        title: 'API Keys Required',
        description: 'Please configure your Alpaca API keys first',
        variant: 'destructive',
      });
      return;
    }

    const analysis = await fetchStockAnalysis(apiKey, apiSecret, symbol, t1, duration);

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
          <ApiKeyInput onSave={handleSaveApiKeys} hasKeys={!!apiKey && !!apiSecret} />
          <StockForm onSubmit={handleAddStock} loading={loading} />
          <ExportButtons stocks={stocks} />
          <StockTable stocks={stocks} />
        </div>
      </div>
    </div>
  );
};

export default Index;
