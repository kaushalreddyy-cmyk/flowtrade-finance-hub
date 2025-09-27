import { ReactNode } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Head from 'next/head';

// The 'export default' is crucial for this file to be recognized as a module.
export default function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>FlowTrade Finance Hub</title>
        <meta name="description" content="Your personal finance dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-gray-800 shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
                FlowTrade
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {status === "authenticated" && (
                  <>
                    <Link href="/expenses" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Expenses</Link>
                    <Link href="/stocks" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Stocks</Link>
                    <Link href="/portfolio" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Portfolio</Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              {status === "authenticated" && (
                <button 
                  onClick={() => signOut()} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}

