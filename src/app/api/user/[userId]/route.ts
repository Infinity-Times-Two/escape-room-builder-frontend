import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
  res: NextApiResponse<ResponseData>
) {
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);

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

  const response = await getUser(params.userId);
  if (!response.Item) {
    return Response.json({ message: 'User not found' });
  }
  return Response.json(response.Item);
}
