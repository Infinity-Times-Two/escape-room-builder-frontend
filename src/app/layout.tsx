import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import CompositeContextProvider from './contexts/combinedContexts';
import { Work_Sans, Cabin } from 'next/font/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
});

const cabin = Cabin({ subsets: ['latin'], variable: '--font-cabin' });

export const metadata: Metadata = {
  title: 'Escape Room Builder',
  description: 'Build and play escape rooms with your friends',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
      <ClerkProvider>
        <body
          className={`${cabin.variable} ${workSans.variable} flex flex-col min-h-screen`}
        >
          <CompositeContextProvider>
            <Header />
            <main className='flex flex-col items-center flex-1 sm:py-20 sm:px-12 min-h-[80%] gap-8 relative'>
              {children}
            </main>
            <Footer />
          </CompositeContextProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
