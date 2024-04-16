export const dynamic = 'force-dynamic'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: Request) {
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
    region: process.env.AWS_REGION
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);
  const env = process.env.NODE_ENV === 'development' ? '-dev' : '-main';
  const gamesTable = process.env.AWS_GAMES_TABLE_NAME + env;

  const fetchAllGames = async () => {
    const command = new ScanCommand({
      TableName: gamesTable,
      FilterExpression: '#private = :privateValue OR attribute_not_exists(#private)',
      ExpressionAttributeNames: {
        '#private': 'private', 
      },
      ExpressionAttributeValues: {
        ':privateValue': false, 
      },
    });
    try {
      const response = await docClient.send(command);
      return response;
    } catch (error) {
      console.log('There was an error: ', error);
      throw error;
    }
  };

  const response = await fetchAllGames();

  return Response.json(response);
}

// Keeping this as backup, using /api/createGame instead to directly add to DB

// export async function POST(req: Request, res: Response) {
//   const info = await req.json();
//   const devApiKey = process.env.DEV_API;
//   if (typeof devApiKey !== 'string') {
//     throw new Error('DEV_API is not defined');
//   }

//   const prodApiKey = process.env.PROD_API;
//   if (typeof prodApiKey !== 'string') {
//     throw new Error('PROD_API is not defined');
//   }
//   const env = process.env.NODE_ENV === 'development' ? 'dev' : 'main'
//   const response = await fetch(`https://api-erb.cloudzack.com/dev/games`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-api-Key':
//         process.env.NODE_ENV === 'development' ? devApiKey : prodApiKey,
//     },
//     body: JSON.stringify(info),
//   });

//   const data = await response.json();
//   return Response.json(data);
// }
