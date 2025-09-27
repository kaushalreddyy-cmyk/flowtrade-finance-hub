import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

interface StockQuote {
  c: number; // current price
  h: number; // high price of the day
  l: number; // low price of the day
  o: number; // open price of the day
  pc: number; // previous close price
  t: number; // timestamp
}

export default function StocksPage() {
  useSession({ required: true });
  const [ticker, setTicker] = useState('');
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setQuote(null);

    const res = await fetch(`/api/stock-data?ticker=${ticker}`);
    if (res.ok) {
      const data = await res.json();
      setQuote(data);
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Failed to fetch data.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Stock Search | FlowTrade</title>
      </Head>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6"><Link href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link></div>
          <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">Stock Search</h1>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <form onSubmit={fetchStockData}>
              <label htmlFor="ticker" className="block text-sm font-medium text-gray-400">Enter Stock Ticker (e.g., AAPL)</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="ticker"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="flex-1 block w-full bg-gray-700 border-gray-600 rounded-none rounded-l-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700">
                  Search
                </button>
              </div>
            </form>
          </div>

          {isLoading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}
          {quote && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
              <h2 className="text-2xl font-bold mb-4">{ticker} Quote</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-400">Current Price</p><p className="text-2xl font-semibold text-green-400">${quote.c.toFixed(2)}</p></div>
                <div><p className="text-gray-400">Previous Close</p><p className="text-xl">${quote.pc.toFixed(2)}</p></div>
                <div><p className="text-gray-400">Open</p><p className="text-xl">${quote.o.toFixed(2)}</p></div>
                <div><p className="text-gray-400">Day High</p><p className="text-xl">${quote.h.toFixed(2)}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
