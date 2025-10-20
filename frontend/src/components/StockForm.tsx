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
              <div className="flex gap-2">
                {/* Main datetime input */}
                <Input
                  id="t1"
                  type="datetime-local"
                  step="1"
                  value={t1}
                  onChange={(e) => setT1(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />

                {/* Seconds input - visible only on mobile */}
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="ss"
                  onChange={(e) => {
                    const date = new Date(t1); // parse the current datetime-local string
                    date.setSeconds(Number(e.target.value) || 0);

                    // convert back to "YYYY-MM-DDTHH:MM:SS" (local time, datetime-local compatible)
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const seconds = String(date.getSeconds()).padStart(2, "0");

                    setT1(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
                  }}
                  className="w-16 block md:hidden"  // TO only show on mobile
                />
              </div>
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
