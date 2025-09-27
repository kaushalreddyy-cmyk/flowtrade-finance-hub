import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

interface PortfolioAsset {
  id: string;
  ticker: string;
  shares: number;
  currentPrice: number;
  currentValue: number;
}

export default function PortfolioPage() {
  useSession({ required: true });
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    const res = await fetch('/api/portfolio');
    if (res.ok) {
      setPortfolio(await res.json());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker: ticker.toUpperCase(), shares }),
    });
    if (res.ok) {
      setTicker('');
      setShares('');
      fetchPortfolio(); // Refresh portfolio data after adding a new asset
    }
  };
  
  const totalPortfolioValue = portfolio.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <>
      <Head><title>My Portfolio | FlowTrade</title></Head>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6"><Link href="/" className="text-blue-400 hover:text-blue-300">&larr; Back to Home</Link></div>
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-400">My Portfolio</h1>
          <p className="text-center text-2xl mb-6 text-green-400 font-semibold">${totalPortfolioValue.toFixed(2)}</p>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add Asset</h2>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="ticker-port" className="block text-sm font-medium text-gray-400">Ticker</label>
                <input type="text" id="ticker-port" value={ticker} onChange={e => setTicker(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" required />
              </div>
              <div className="flex-1">
                <label htmlFor="shares" className="block text-sm font-medium text-gray-400">Shares</label>
                <input type="number" step="any" id="shares" value={shares} onChange={e => setShares(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" required />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Add</button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ticker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font--medium uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (<tr><td colSpan={4} className="text-center p-4">Loading portfolio...</td></tr>) : 
                (portfolio.map(asset => (
                  <tr key={asset.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">{asset.ticker}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{asset.shares}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${asset.currentPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">${asset.currentValue.toFixed(2)}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
