import { useState } from 'react';
import { StockAnalysis } from '@/types/stock';

export const useAlpacaData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockAnalysis = async (
    symbol: string,
    t1: string,
    duration: number,
    unit: string,
  ): Promise<StockAnalysis | null> => {
    setLoading(true);
    setError(null);

    try {
      // Call your Express backend endpoint
      const res = await fetch('http://localhost:7777/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, t1, duration, unit }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch data');
      }

      const data = await res.json();

      // Map server response → StockAnalysis object
      const analysis: StockAnalysis = {
        id: `${symbol}-${Date.now()}`,
        symbol,
        t1: data.t1,
        duration,
        priceAtT1: data.priceAtT1 ?? null,
        priceAtT2: data.priceAtT2 ?? null,
        maxPrice: data.maxPrice ?? null,
        minPrice: data.minPrice ?? null,
        percentIncreaseToMax: data.pctIncreaseToMax ?? null,
        percentDecreaseToMin: data.pctDecreaseToMin ?? null,
        volumeAtT1: data.volumeAtT1 ?? null,
        timestamp: new Date().toISOString(),
      };

      return analysis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching stock analysis:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchStockAnalysis, loading, error };
};
