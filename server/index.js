// server/index.js
// Simple Express server for fetching Alpaca historical trade/bar data and computing metrics

const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { Console } = require('console');
const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const ALPACA_KEY = process.env.ALPACA_KEY_ID;
const ALPACA_SECRET = process.env.ALPACA_SECRET_KEY;
const BASE = process.env.ALPACA_BASE_URL || 'https://data.alpaca.markets/v2';


if (!ALPACA_KEY || !ALPACA_SECRET) {
  console.warn('ALPACA keys not set. Set ALPACA_KEY_ID and ALPACA_SECRET_KEY env vars.');
}

function headers() {
  return {
    'APCA-API-KEY-ID': ALPACA_KEY,
    'APCA-API-SECRET-KEY': ALPACA_SECRET,
    'Content-Type': 'application/json',
  };
}

// helper: convert JS Date -> ISO string that Alpaca expects (RFC3339)
function toISO(d) {
  return new Date(d).toISOString();
}

// fetch trades (ticks) between start and end — handles pagination via next_page_token
async function fetchAllTrades(symbol, startISO, endISO) {
    const all = [];
    let nextPageToken = null;
    do {
        let url = `${BASE}/stocks/trades?symbols=${encodeURIComponent(symbol)}&start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}&limit=10000`;
        if (nextPageToken) url += `&page_token=${encodeURIComponent(nextPageToken)}`;

        const res = await fetch(url, { headers: headers() });
        if (!res.ok) throw new Error(`Alpaca trades error ${res.status}: ${await res.text()}`);
        const j = await res.json();

        if (!j.trades || !j.trades[symbol]) break;
        all.push(...j.trades[symbol]);

        // Update nextPageToken
        nextPageToken = j.next_page_token || null;
    } while (nextPageToken);
    return all;
}

// fetch minute bars between start and end (fallback)
async function fetchBars(symbol, startISO, endISO) {
  const url = `${BASE}/stocks/bars?symbols=${encodeURIComponent(symbol)}&timeframe=1Min&start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}&limit=1000`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Alpaca bars error ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return (j.bars && j.bars[symbol]) || [];
}

app.post('/api/fetch', async (req, res) => {
  try {
    const { symbol, t1, duration, unit } = req.body;
    if (!symbol || !t1 || !duration || !unit) return res.status(400).json({ error: 'symbol, t1, duration required' });

    const startDate = new Date(t1);
    if (isNaN(+startDate)) return res.status(400).json({ error: 't1 not a valid date' });
    const durationMs = (unit === "seconds") ? duration * 1000 : duration * 60_000; // seconds -> ms, minutes -> ms

    const endDate = new Date(+startDate + durationMs);

    const startISO = toISO(startDate);
    const endISO = toISO(endDate);

    // Try to fetch trades first (tick-level). If that fails or returns empty, fallback to bars.
    let trades = [];
    try {
      trades = await fetchAllTrades(symbol, startISO, endISO);
    } catch (e) {
      console.warn('trades fetch failed, falling back to bars:', e.message);
      trades = [];
    }

    let result = {
      symbol,
      t1: startISO,
      t2: endISO,
      source: trades.length ? 'trades' : 'bars',
      priceAtT1: null,
      priceAtT2: null,
      maxPrice: null,
      minPrice: null,
      pctIncreaseToMax: null,
      pctDecreaseToMin: null,
      pctChangeT1ToT2: null,
      volumeAtT1: null,
    };

    if (trades.length) {
      // Each trade typically: { p: price, s: size, t: timestamp }
      // Normalize timestamps and sort just in case
      trades.sort((a,b) => new Date(a.t) - new Date(b.t));
      // find price at or after t1
      const idxAtOrAfter = trades.findIndex(tr => new Date(tr.t) >= startDate);
      const idxAtOrBeforeT2 = (() => {
        for (let i = trades.length -1; i >=0; --i) if (new Date(trades[i].t) <= endDate) return i;
        return -1;
      })();

      if (idxAtOrAfter !== -1) {
        result.priceAtT1 = trades[idxAtOrAfter].p;
        result.volumeAtT1 = trades[idxAtOrAfter].s;
      }
      if (idxAtOrBeforeT2 !== -1) {
        result.priceAtT2 = trades[idxAtOrBeforeT2].p;
      }

      const prices = trades.map(tr => tr.p);
      result.maxPrice = prices.reduce((a, b) => (a > b ? a : b));
      result.minPrice = prices.reduce((a, b) => (a < b ? a : b));

      if (result.priceAtT1 != null) {
        result.pctIncreaseToMax = ((result.maxPrice - result.priceAtT1) / result.priceAtT1) * 100;
        result.pctDecreaseToMin = ((result.minPrice - result.priceAtT1) / result.priceAtT1) * 100; // negative if fall
      
        if (result.priceAtT2 != null) {
          result.pctChangeT1ToT2 = ((result.priceAtT2 - result.priceAtT1) / result.priceAtT1) * 100;
        } else {
          result.pctChangeT1ToT2 = null;
        }
      }

    } else {
      // fallback to minute bars
      const bars = await fetchBars(symbol, startISO, endISO);
      // bars are objects with { t: timestamp, o, h, l, c, v }
      if (bars.length === 0) return res.status(404).json({ error: 'no bars or trades found for timeframe' });

      // find bar that contains t1: bar.t <= t1 < bar.t + 1 minute
      // Alpaca bars timestamps are ISO; convert to Date
      const t1BarIdx = bars.findIndex(b => new Date(b.t) <= startDate && new Date(b.t).getTime() + 60_000 > startDate.getTime());
      // If no exact containing bar, pick first bar whose t >= t1
      const firstBarIdx = t1BarIdx !== -1 ? t1BarIdx : bars.findIndex(b => new Date(b.t) >= startDate);
      if (firstBarIdx !== -1) {
        result.priceAtT1 = bars[firstBarIdx].o; // open of that bar
        result.volumeAtT1 = bars[firstBarIdx].v;
      }

      // last bar at or before t2
      const lastIdx = (() => {
        for (let i = bars.length-1; i>=0; --i) if (new Date(bars[i].t) <= endDate) return i;
        return -1;
      })();

      if (lastIdx !== -1) result.priceAtT2 = bars[lastIdx].c;

      result.maxPrice = bars.reduce((a, b) => (a.h > b.h ? a.h : b.h));
      result.minPrice = bars.reduce((a, b) => (a.l < b.l ? a.l : b.l));

      if (result.priceAtT1 != null) {
        result.pctIncreaseToMax = ((result.maxPrice - result.priceAtT1) / result.priceAtT1) * 100;
        result.pctDecreaseToMin = ((result.minPrice - result.priceAtT1) / result.priceAtT1) * 100;
      }
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 7777;
app.listen(port, () => console.log(`Server listening on ${port}`));
