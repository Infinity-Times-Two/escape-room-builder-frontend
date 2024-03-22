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
    const env = process.env.NODE_ENV === 'development' ? 'dev' : 'main';
    const response = await fetch(
      // use ${env} for production
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const newGame = await req.json();

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
    const env = process.env.NODE_ENV === 'development' ? 'dev' : 'main';
    const response = await fetch(
      `https://api-erb.cloudzack.com/dev/games/${gameId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-Key':
            process.env.NODE_ENV === 'development' ? devApiKey : prodApiKey,
          Accept: 'application/json',
        },
        body: JSON.stringify(newGame),
      }
    );
    const data = await response.json();
    console.log('api response');
    console.log(data);
    return Response.json(data);
  } catch (error) {
    console.log('server error');
    return Response.json(error);
  }
}

export async function DELETE(
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
    const env = process.env.NODE_ENV === 'development' ? 'dev' : 'main';
    const response = await fetch(
      `https://api-erb.cloudzack.com/dev/games/${gameId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-Key':
            process.env.NODE_ENV === 'development' ? devApiKey : prodApiKey,
        },
      }
    );
    const data = await response.json();
    console.log('api response');
    console.log(data);
    return Response.json(data);
  } catch (error) {
    console.log('server error');
    return Response.json(error);
  }
}
