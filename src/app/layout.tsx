import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import CompositeContextProvider from './contexts/combinedContexts';
import { Work_Sans, Cabin } from 'next/font/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { neobrutalism } from '@clerk/themes';
import './globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
});

const cabin = Cabin({ subsets: ['latin'], variable: '--font-cabin' });

export const metadata: Metadata = {
  title: 'Quiz Buddies',
  description: 'Create and play quizzes with your friends',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${cabin.variable} ${workSans.variable} flex flex-col min-h-screen`}
      >
        <ClerkProvider
          appearance={{
            baseTheme: neobrutalism,
          }}
        >
          <CompositeContextProvider>
            <Header />
            <main className='flex flex-col items-center justify-center flex-1 py-8 sm:py-20 sm:px-12 min-h-[80%] gap-8 relative max-w-full'>
              {children}
            </main>
            <Footer />
          </CompositeContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
