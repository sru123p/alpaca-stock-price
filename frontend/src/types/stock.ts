export interface StockAnalysis {
  id: string;
  symbol: string;
  inputTime: string;
  t1: string;
  t2: string;
  duration: number;
  timeUnit: string;
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
