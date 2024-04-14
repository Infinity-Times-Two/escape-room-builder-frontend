import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Game } from '../../types/types'

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

  // This adds a timestamp when a game is created and will store the three most recent timestamps
  // Front-end will not allow a user to create more than 3 games in a 24 hour period
  // The first timestamp in the array is the oldest
  const updateUser = async (userId: string) => {
    console.log('Adding timestamp to recentGameTimestamps');

    try {
      // Fetch the item from DynamoDB containing the list
      const user = await docClient.send(
        new GetCommand({
          TableName: process.env.AWS_TABLE_NAME,
          Key: { userId: userId },
        })
      );
      if (!user.Item) {
        return 'User not found';
      }

      // Extract the savedGames list from the fetched item
      const recentGameTimestamps: number[] =
        user.Item.recentGameTimestamps || [];

      recentGameTimestamps.push(Date.now());

      while (recentGameTimestamps.length > 3) recentGameTimestamps.shift();

      const command = new UpdateCommand({
        TableName: process.env.AWS_TABLE_NAME,
        Key: { userId: userId },
        ExpressionAttributeNames: {
          '#recentGameTimestamps': 'recentGameTimestamps',
        },
        ExpressionAttributeValues: {
          ':recentGameTimestamps': recentGameTimestamps,
        },
        UpdateExpression: `SET #recentGameTimestamps = :recentGameTimestamps`,
        ReturnValues: 'UPDATED_NEW',
      });

      const response = await docClient.send(command);
      return response;
    } catch (error) {
      return Response.json(`There was error: ${error}`);
    }
  };
  const updateTimestampsResponse = await updateUser(newGame.authorId);
  return Response.json({ createGameResponse, updateTimestampsResponse });
}
