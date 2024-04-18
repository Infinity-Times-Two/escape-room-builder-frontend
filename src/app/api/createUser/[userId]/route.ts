import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { DBuser } from '@/app/types/types';

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
    const putCommand = new PutCommand({
      TableName: process.env.AWS_TABLE_NAME,
      Item: {
        userId: userId,
        firstName: '',
        savedGames: [],
        createdGames: [],
        isAdmin: false,
        recentGameTimestamps: [],
      },
    });
    try {
      await docClient.send(putCommand);
      const getCommand = new GetCommand({
        TableName: process.env.AWS_TABLE_NAME,
        Key: { userId }
      });
      const response = await docClient.send(getCommand);
      return response.Item;
    } catch (error) {
      throw error;
    }
  };

  const response = await createNewUser(params.userId);
  console.log('response in /createUser/{userId}: ', response)
  return Response.json(response);
}
