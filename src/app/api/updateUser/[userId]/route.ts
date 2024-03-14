import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {

  const user = await currentUser();
  const { firstName } = user || {};
  console.log('FIRST NAME:')
  console.log(firstName)

  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);

  const updateUser = async (userId: string | null) => {
    const command = new UpdateCommand({
      TableName: process.env.AWS_TABLE_NAME,
      Key: { userId: userId },
      ExpressionAttributeNames: {
        "#firstName": "firstName",
      },
      ExpressionAttributeValues: {
        ":firstName": firstName,
      },
      UpdateExpression: 'SET #firstName = :firstName',
      ReturnValues: "UPDATED_NEW",
    });
    try {
      const response = await docClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const response = await updateUser(params.userId);
  return Response.json(response);
}
