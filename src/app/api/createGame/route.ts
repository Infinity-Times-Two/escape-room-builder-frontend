import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { Game } from '@/app/types/types';

export async function POST(req: Request) {
  const newGame = await req.json();
 
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);
  const env = process.env.NODE_ENV === 'development' ? '-dev' : '-main';
  const gamesTable = process.env.AWS_GAMES_TABLE_NAME + env;
  console.log(gamesTable);
  const createNewGame = async (game: Game) => {
    const command = new PutCommand({
      TableName: gamesTable,
      Item: game,
      // ReturnValues: 'ALL_OLD',
    });
    try {
      const response = await docClient.send(command);
      return response;
    } catch (error) {
      console.log('There was an error: ', error);
      throw error;
    }
  };

  const response = await createNewGame(newGame);
  console.log(response)
  return Response.json(response);
}
