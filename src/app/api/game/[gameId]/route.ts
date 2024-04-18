import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { Game } from '../../../types/types';

// GET, POST (update) and DELETE single games

export async function GET(
  req: Request,
  { params }: { params: { gameId: string } }
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
  const gameId: string = params.gameId;

  const fetchGame = async (gameId: string | null) => {
    const command = new GetCommand({
      TableName: gamesTable,
      Key: { id: gameId }
    });
    try {
      const response = await docClient.send(command);
      return response;
    } catch (error) {
      return Response.json(`There was an error: ${error}`);
    }
  };

  try {
    const response = await fetchGame(gameId);
    console.log(response);
    return Response.json(response);
  } catch (error) {
    return Response.json(error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
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
  const updatedGame: Game = await req.json();

  const updateGame = async (gameId: string | null) => {
    const command = new PutCommand({
      TableName: gamesTable,
      Item: updatedGame,
    });
    try {
      const response = await docClient.send(command);
      return response;
    } catch (error) {
      return Response.json(`There was an error: ${error}`);
    }
  };

  const updateGameResponse = await updateGame(params.gameId);
  return Response.json({ updateGameResponse });
}

export async function DELETE(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const dbClient = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY as string,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY as string,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dbClient);

  const gameId = params.gameId;
  const env = process.env.NODE_ENV === 'development' ? '-dev' : '-main';
  const gamesTable = process.env.AWS_GAMES_TABLE_NAME + env;

  const deleteGame = async (gameId: string) => {
    console.log(`Deleting ${gameId}`)
    const command = new DeleteCommand({
      TableName: gamesTable,
      Key: { id: gameId }
    })
    const response = await docClient.send(command);
    return response
  }

  try {
    const data = await deleteGame(gameId)
    console.log(data);
    return Response.json(data);
  } catch (error) {
    return Response.json(error);
  }
}
