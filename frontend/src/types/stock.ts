export interface StockAnalysis {
  id: string;
  symbol: string;
  t1: string;
  duration: number;
  priceAtT1: number;
  priceAtT2: number;
  maxPrice: number;
  minPrice: number;
  percentIncreaseToMax: number;
  percentDecreaseToMin: number;
  percentChangeT1toT2: number;
  volumeAtT1: number;
  timestamp: string;
}

export interface AlpacaBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}
