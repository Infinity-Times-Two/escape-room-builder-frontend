import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';

// Removes a gameId from a user's list of saved games
export async function DELETE(
  req: Request,
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
