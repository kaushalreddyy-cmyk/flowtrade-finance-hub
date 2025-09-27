import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout'; // 1. Import the Layout
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      {/* 2. Wrap the main component with your Layout */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

