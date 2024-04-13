import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

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
  const env = process.env.NODE_ENV === 'development' ? '-dev' : '-main';
  const gamesTable = process.env.AWS_GAMES_TABLE_NAME + env;

  const fetchUserGames = async (userId: string) => {
    const command = new QueryCommand({
      TableName: gamesTable,
      IndexName: 'authorId-index',
      KeyConditionExpression: 'authorId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
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

  const response = await fetchUserGames(params.userId);

  return Response.json(response);
}
