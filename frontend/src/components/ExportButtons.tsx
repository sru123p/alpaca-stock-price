import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Clock } from 'lucide-react';
import { StockAnalysis } from '@/types/stock';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Input } from '@/components/ui/input';
import { useAlpacaData } from '@/hooks/useAlpacaData';
import { useToast } from '@/hooks/use-toast';
import { Select } from '@/components/ui/select'

interface ExportButtonsProps {
  stocks: StockAnalysis[];
  onUpdateStocks: (updated: StockAnalysis[]) => void;
}

export const ExportButtons = ({ stocks, onUpdateStocks }: ExportButtonsProps) => {
  const { fetchStockAnalysis } = useAlpacaData();
  const { toast } = useToast();
  const [newDuration, setNewDuration] = useState('');
  const [newUnit, setNewUnit] = useState('min');
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    const data = stocks.map((stock) => ({
      Symbol: stock.symbol,
      'T1': stock.inputTime,
      'Duration': `${stock.duration} ${stock.timeUnit}`,
      'Price at T1': stock.priceAtT1.toFixed(4),
      'Price at T2': stock.priceAtT2.toFixed(4),
      'Max Price': stock.maxPrice.toFixed(4),
      'Min Price': stock.minPrice.toFixed(4),
      '% Rise to Max': stock.percentIncreaseToMax.toFixed(2),
      '% Fall to Min': stock.percentDecreaseToMin.toFixed(2),
      '% T1 to T2': stock.percentChangeT1toT2.toFixed(2),
      'Volume at T1': stock.volumeAtT1,
      'Occured First': stock.firstEvent,
      'Ask at T1': stock.askAtT1,
      'Bid at T2': stock.bidAtT2,
      '% Ask to Bid': stock.percentChangeAsktoBid.toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Analysis');

    XLSX.writeFile(wb, `stock-analysis-${Date.now()}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Stock Analysis Report', 14, 15);

    const tableData = stocks.map((stock) => [
      stock.symbol,
      `${stock.inputTime}`,
      `${stock.duration} ${stock.timeUnit}`,
      `$${stock.priceAtT1.toFixed(4)}`,
      `$${stock.priceAtT2.toFixed(4)}`,
      `$${stock.maxPrice.toFixed(4)}`,
      `$${stock.minPrice.toFixed(4)}`,
      `${stock.percentIncreaseToMax.toFixed(2)}%`,
      `${stock.percentDecreaseToMin.toFixed(2)}%`,
      `${stock.percentChangeT1toT2.toFixed(2)}%`,
      stock.volumeAtT1.toLocaleString(),
      stock.firstEvent,
      `$${stock.askAtT1.toFixed(4)}`,
      `$${stock.bidAtT2.toFixed(4)}`,
      `${stock.percentChangeAsktoBid.toFixed(2)}%`,
    ]);

    autoTable(doc, {
      head: [
        [
          'Symbol',
          'T1',
          'Duration',
          'Price T1',
          'Price T2',
          'Max Price',
          'Min Price',
          '% Rise',
          '% Fall',
          '% T1 to T2',
          'Volume at T1',
          'Occured First',
          'Ask at T1',
          'Bid at T2',
          '% Ask to Bid'
        ],
      ],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`stock-analysis-${Date.now()}.pdf`);
  };

  const exportToCSV = () => {
    const headers = [
      'Symbol',
      'T1',
      'Duration',
      'Price at T1',
      'Price at T2',
      'Max Price',
      'Min Price',
      '% Rise to Max',
      '% Fall to Min',
      '% T1 to T2',
      'Volume at T1',
      'Occured First',
      'Ask at T1',
      'Bid at T2',
      '% Ask to Bid',
    ];

    const rows = stocks.map((stock) => [
      stock.symbol,
      stock.inputTime,
      `${stock.duration} ${stock.timeUnit}`,
      stock.priceAtT1.toFixed(4),
      stock.priceAtT2.toFixed(4),
      stock.maxPrice.toFixed(4),
      stock.minPrice.toFixed(4),
      stock.percentIncreaseToMax.toFixed(2),
      stock.percentDecreaseToMin.toFixed(2),
      stock.percentChangeT1toT2.toFixed(2),
      stock.volumeAtT1,
      stock.firstEvent,
      stock.askAtT1.toFixed(4),
      stock.bidAtT2.toFixed(4),
      stock.percentChangeAsktoBid.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-analysis-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // =====================
  //  APPLY NEW DURATION
  // =====================
  const handleApplyDuration = async () => {
    if (!stocks.length) return;
    setLoading(true);
    try {
      const updatedStocks: StockAnalysis[] = [];
      for (const stock of stocks) {
        const updated = await fetchStockAnalysis(stock.symbol, stock.t1, parseInt(newDuration), newUnit);
        if (updated) updatedStocks.push(updated);
      }
      onUpdateStocks(updatedStocks);
      toast({
        title: 'Success',
        description: `All rows updated with ${newDuration} ${stocks[0]?.timeUnit}`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to update duration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={exportToExcel} disabled={stocks.length === 0} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export to Excel
      </Button>
      <Button onClick={exportToPDF} disabled={stocks.length === 0} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export to PDF
      </Button>
      <Button onClick={exportToCSV} disabled={stocks.length === 0} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export to CSV
      </Button>
      {/* Divider */}
      <div className="w-px h-6 bg-border mx-2" />

      {/* Dynamic duration input */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <Input
          type="number"
          min={1}
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
          className="w-24"
          placeholder="5"
        />
        <Select
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          disabled={loading}
          className="border rounded px-2 py-1"
        >
          <option value="min">Min</option>
          <option value="sec">Sec</option>
        </Select>

        <Button
          onClick={handleApplyDuration}
          disabled={loading || !stocks.length}
        >
          {loading ? 'Applying...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
};
