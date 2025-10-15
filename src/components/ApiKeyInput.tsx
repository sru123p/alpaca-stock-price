import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  onSave: (apiKey: string, apiSecret: string) => void;
  hasKeys: boolean;
}

export const ApiKeyInput = ({ onSave, hasKeys }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showForm, setShowForm] = useState(!hasKeys);

  useEffect(() => {
    setShowForm(!hasKeys);
  }, [hasKeys]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() && apiSecret.trim()) {
      onSave(apiKey, apiSecret);
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">API Keys Configured</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
              Update Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alpaca API Configuration</CardTitle>
        <CardDescription>
          Enter your Alpaca API credentials to fetch historical stock data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key ID</Label>
            <Input
              id="apiKey"
              type="text"
              placeholder="Your Alpaca API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret Key</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder="Your Alpaca API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Save API Keys
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
