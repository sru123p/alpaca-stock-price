import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface StockFormProps {
  onSubmit: (symbol: string, t1: string, duration: number, unit: string) => void;
  loading: boolean;
}

export const StockForm = ({ onSubmit, loading }: StockFormProps) => {
  const [symbol, setSymbol] = useState('');
  const [t1, setT1] = useState('');
  const [duration, setDuration] = useState('');
  const [unit, setUnit] = useState('min');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let fixedT1 = t1;
    if (t1 && t1.length === 16) {
      fixedT1 = `${t1}:00`; // Add :00 seconds if user didn’t select seconds
    }

    if (!symbol.trim() || !fixedT1 || !duration) {
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

    onSubmit(symbol.toUpperCase(), fixedT1, durationNum, unit);
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
            <div className="space-y-2">
              <Label htmlFor="t1">Start Time (T1)</Label>
              <Input
                id="t1"
                type="datetime-local"
                step="1"
                value={t1}
                onChange={(e) => setT1(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <div className="flex gap-2">
                <Input
                  id="duration"
                  type="number"
                  placeholder="5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={loading}
                />
                <Select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  disabled={loading}
                  className="border rounded px-2 py-1"
                >
                  <option value="min">Min</option>
                  <option value="sec">Sec</option>
                </Select>
              </div>
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
