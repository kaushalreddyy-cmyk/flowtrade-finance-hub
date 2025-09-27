import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import type { Expense } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';

// NOTE: We will create and import the Pie Chart in a later step.
// For now, any chart-related code will be commented out or omitted.

export default function ExpensesPage() {
  // 'required: true' will automatically redirect unauthenticated users to the sign-in page.
  const { data: session, status } = useSession({ required: true }); 
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [isLoading, setIsLoading] = useState(true);

  // This effect fetches expenses from our API as soon as the user is authenticated.
  useEffect(() => {
    const fetchExpenses = async () => {
      if (status === 'authenticated') {
        setIsLoading(true);
        try {
          const res = await fetch('/api/expenses');
          if (res.ok) {
            const data = await res.json();
            setExpenses(data);
          }
        } catch (error) {
          console.error("Failed to fetch expenses:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchExpenses();
  }, [status]);

  // This function handles the form submission to create a new expense.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, amount, category }),
    });

    if (res.ok) {
      const newExpense = await res.json();
      // Add the new expense to the top of the list for immediate feedback
      setExpenses([newExpense, ...expenses]);
      // Clear the form fields
      setTitle('');
      setAmount('');
      setCategory('Food');
    } else {
      // Handle potential errors from the API
      alert("Failed to add expense. Please try again.");
    }
  };

  // Display a loading state while session is being verified or data is being fetched.
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-400"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Expense Manager | FlowTrade</title>
      </Head>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 selection:bg-blue-500/30">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              &larr; Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Expense Manager
          </h1>

          {/* Add Expense Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Utilities</option>
                  <option>Entertainment</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="md:col-start-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300">Add Expense</button>
            </form>
          </div>

          {/* Expenses List */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg shadow-lg">
             <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>
             <div className="overflow-x-auto">
               <ul className="divide-y divide-gray-700">
                 {expenses.length > 0 ? expenses.map(expense => (
                   <li key={expense.id} className="py-4 flex justify-between items-center">
                     <div>
                       <p className="text-lg font-medium">{expense.title}</p>
                       <p className="text-sm text-gray-400">{expense.category} &middot; {new Date(expense.date).toLocaleDateString()}</p>
                     </div>
                     <p className="text-xl font-semibold text-gray-200">${expense.amount.toFixed(2)}</p>
                   </li>
                 )) : <p className="text-gray-400 text-center py-4">No expenses added yet. Add one above to get started!</p>}
               </ul>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}

