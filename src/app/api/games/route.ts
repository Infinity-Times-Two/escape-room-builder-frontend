export const dynamic = 'force-dynamic'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function GET(req: Request) {
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
    region: process.env.AWS_REGION
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);
  const env = process.env.NODE_ENV === 'development' ? '-dev' : '-main';
  const gamesTable = process.env.AWS_GAMES_TABLE_NAME + env;

  const fetchAllGames = async () => {
    const command = new ScanCommand({
      TableName: gamesTable,
      FilterExpression: '#private = :privateValue OR attribute_not_exists(#private)',
      ExpressionAttributeNames: {
        '#private': 'private', 
      },
      ExpressionAttributeValues: {
        ':privateValue': false, 
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

  const response = await fetchAllGames();

  return Response.json(response);
}
