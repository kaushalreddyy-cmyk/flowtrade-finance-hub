import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  // Google SVG Icon Component
  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white selection:bg-blue-500/30">
      <Head>
        <title>FlowTrade Finance Hub</title>
        <meta name="description" content="The modern dashboard for your financial life." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">FlowTrade</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
            The modern, minimalist dashboard for your financial life.
          </p>
        </div>

        <div className="mt-12">
          {status === "loading" && <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-white"></div>}
          
          {status === "authenticated" && session && (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-sm text-gray-400">
                Signed in as <span className="font-medium text-gray-200">{session.user?.email}</span>
              </p>
              <Link 
                href="/expenses" 
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all"
              >
                Go to Dashboard
                <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-lg text-gray-300">Get started by signing in.</p>
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-gray-800 border border-gray-600 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all sm:w-auto"
              >
                <GoogleIcon />
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

