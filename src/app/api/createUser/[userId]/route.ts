import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);

  const createNewUser = async (userId: string | null) => {
    const command = new PutCommand({
      TableName: process.env.AWS_TABLE_NAME,
      Item: {
        userId: userId,
        savedGames: [],
        createdGames: [],
        isAdmin: false,
        recentGameTimestamps: [],
      },
    });
    try {
      const response = await docClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const response = await createNewUser(params.userId);
  return Response.json(response);
}
