import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use getServerSession for API route protection, as it's the modern way for Next.js API routes.
  const session = await getServerSession(req, res, authOptions);

  // 1. SECURE THE ENDPOINT
  // If no session is found, or the session doesn't contain a user ID, deny access.
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;

  // 2. HANDLE GET REQUEST (To fetch data)
  if (req.method === 'GET') {
    try {
      const expenses = await prisma.expense.findMany({
        where: { userId: userId }, // Crucially, only fetch expenses for the logged-in user
        orderBy: { date: 'desc' },
      });
      return res.status(200).json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return res.status(500).json({ message: 'Something went wrong while fetching expenses.' });
    }
  }

  // 3. HANDLE POST REQUEST (To create data)
  else if (req.method === 'POST') {
    try {
      const { title, amount, category } = req.body;

      // Basic server-side validation
      if (!title || !amount || !category) {
        return res.status(400).json({ message: 'Missing required fields: title, amount, and category.' });
      }

      const newExpense = await prisma.expense.create({
        data: {
          title,
          amount: parseFloat(amount),
          category,
          userId, // This links the new expense directly to the logged-in user
        },
      });
      return res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      return res.status(500).json({ message: 'Something went wrong while creating the expense.' });
    }
  }

  // 4. HANDLE OTHER UNSUPPORTED HTTP METHODS
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

