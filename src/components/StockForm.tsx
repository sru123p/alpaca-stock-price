import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface StockFormProps {
  onSubmit: (symbol: string, t1: string, duration: number) => void;
  loading: boolean;
}

export const StockForm = ({ onSubmit, loading }: StockFormProps) => {
  const [symbol, setSymbol] = useState('');
  const [t1, setT1] = useState('');
  const [duration, setDuration] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol.trim() || !t1 || !duration) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Duration must be a positive number',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(symbol.toUpperCase(), t1, durationNum);
    setSymbol('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Stock Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                disabled={loading}
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="t1">Start Time (T1)</Label>
              <Input
                id="t1"
                type="datetime-local"
                value={t1}
                onChange={(e) => setT1(e.target.value)}
                disabled={loading}
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="t1">Start Time (T1)</Label>
              <Input
                id="t1"
                type="text"
                value={t1}
                onChange={(e) => setT1(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Analyzing...' : 'Analyze Stock'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
