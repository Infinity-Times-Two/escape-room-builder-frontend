import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
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

  const createGameResponse = await createNewGame(newGame);

  const getUser = async (userId: string | any) => {
    const command = new GetCommand({
      TableName: process.env.AWS_TABLE_NAME,
      Key: { userId: userId },
    });
    try {
      const response = await docClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  };

  try {
    const getUserResponse = await getUser(newGame.aurhorId);
    if (!getUserResponse.Item) {
      return Response.json({ message: 'User not found' });
    }
    return Response.json(getUserResponse.Item);
  } catch (error) {
    return Response.json(error);
  }

  return Response.json(createGameResponse);
}
