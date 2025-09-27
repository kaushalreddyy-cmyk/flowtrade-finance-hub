import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { ticker } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ message: 'Ticker symbol is required.' });
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'API key is not configured.' });
  }

  try {
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker.toUpperCase()}&token=${apiKey}`;
    const quoteResponse = await fetch(quoteUrl);
    if (!quoteResponse.ok) {
        throw new Error(`Finnhub API error: ${quoteResponse.statusText}`);
    }
    const quoteData = await quoteResponse.json();

    // Check if Finnhub returned a valid price (c: current price)
    if (quoteData.c === 0) {
        return res.status(404).json({ message: `No data found for ticker: ${ticker}` });
    }

    res.status(200).json(quoteData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stock data.' });
  }
}
