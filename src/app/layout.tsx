import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import CompositeContextProvider from './contexts/combinedContexts';
import { Work_Sans, Cabin } from 'next/font/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './globals.css';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
// import { auth, currentUser } from '@clerk/nextjs';
// import { User } from '@clerk/backend';

// const dbClient = new DynamoDBClient({
//   credentials: {
//     accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
//     secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
//   },
// });
// const docClient = DynamoDBDocumentClient.from(dbClient);

// export const getUser = async (userId: string | any) => {
//   const command = new GetCommand({
//     TableName: process.env.AWS_TABLE_NAME,
//     Key: { userId: userId },
//   });
//   try {
//     const response = await docClient.send(command);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createNewUser = async (userId: string | null) => {
//   const command = new PutCommand({
//     TableName: process.env.AWS_TABLE_NAME,
//     Item: {
//       userId: userId,
//       savedGames: [],
//       createdGames: [],
//     },
//     // ReturnValues: 'ALL_OLD',
//   });
//   try {
//     const response = await docClient.send(command);
//     console.log(`Response from creating user: ${response}`);
//     return response;
//   } catch (error) {
//     console.log(
//       `Error when creating user`
//     );
//     throw error;
//   }
// };

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
  // const describeTable = new DescribeTableCommand({
  //   TableName: 'escape-room-users'
  // })
  // const tableInfo = await docClient.send(describeTable);
  // console.log('Table info:')
  // console.log(tableInfo.Table);

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
