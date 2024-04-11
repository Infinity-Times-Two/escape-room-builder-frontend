import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';


// This adds a timestamp when a game is created and will store the three most recent timestamps
// Front-end will not allow a user to create more than 3 games in a 24 hour period
// The first timestamp in the array is the oldest
export async function GET(
  req: NextApiRequest,
  { params }: { params: { userId: string; gameId: string } }
) {
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);

  const userId: string = params.userId;
  const gameId: string = params.gameId;

  const updateUser = async (userId: string, gameId: string) => {
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
      return 'Internal Server Error. Shit!';
    }
  };
  const response = await updateUser(userId, gameId);
  console.log(response);
  return Response.json(response);
}


// This removes a gameId from a user's list of saved games
export async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { userId: string; gameId: string } }
) {
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);

  const userId: string = params.userId;
  const gameId: string = params.gameId;

  const updateUser = async (userId: string, gameId: string) => {
    console.log(`REMOVING ${gameId} from list!`);

    try {
      // Fetch the item from DynamoDB containing the list
      const user = await docClient.send(
        new GetCommand({
          TableName: process.env.AWS_TABLE_NAME,
          Key: { userId: userId },
        })
      );
      if (!user.Item || !user.Item.savedGames) {
        return 'User or savedGames list not found';
      }

      // Extract the savedGames list from the fetched item
      const savedGames: string[] = user.Item.savedGames;

      // Find the index of the gameId in the savedGames list
      const index = savedGames.indexOf(gameId);

      if (index === -1) {
        return 'Game ID not found in the list';
      }

      const command = new UpdateCommand({
        TableName: process.env.AWS_TABLE_NAME,
        Key: { userId: userId },
        ExpressionAttributeNames: {
          '#savedGames': 'savedGames',
        },
        UpdateExpression: `REMOVE #savedGames[${index}]`, // Remove the item by index
        ReturnValues: 'UPDATED_NEW',
      });

      const response = await docClient.send(command);
      return response;
    } catch (error) {
      return 'Internal Server Error. Shit!';
    }
  };

  const response = await updateUser(userId, gameId);
  console.log(response);
  return Response.json(response);
}
