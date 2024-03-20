export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const devApiKey = process.env.DEV_API;
  if (typeof devApiKey !== 'string') {
    throw new Error('DEV_API is not defined');
  }

  const prodApiKey = process.env.PROD_API;
  if (typeof prodApiKey !== 'string') {
    throw new Error('PROD_API is not defined');
  }
  const gameId = params.id;
  try {
    const response = await fetch(
      `https://api-erb.cloudzack.com/dev/games/${gameId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-Key':
            process.env.NODE_ENV === 'development' ? devApiKey : prodApiKey,
          Accept: 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return Response.json(data);
  } catch (error) {
    return Response.json(error);
  }
}
