export async function GET(req: Request, res: any) {
  const devApiKey = process.env.DEV_API;
  if (typeof devApiKey !== 'string') {
    throw new Error('DEV_API is not defined');
  }

  const prodApiKey = process.env.PROD_API;
  if (typeof prodApiKey !== 'string') {
    throw new Error('PROD_API is not defined');
  }
  try {
    const response = await fetch('https://api-erb.cloudzack.com/dev/games', {
      headers: {
        'Content-Type': 'application/json',
        'x-api-Key':
          process.env.NODE_ENV === 'development' ? devApiKey : prodApiKey,
      },
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(error);
  }
}

export async function POST(req: Request, res: Response) {
  const info = await req.json();
  const devApiKey = process.env.DEV_API;
  if (typeof devApiKey !== 'string') {
    throw new Error('DEV_API is not defined');
  }

  const prodApiKey = process.env.PROD_API;
  if (typeof prodApiKey !== 'string') {
    throw new Error('PROD_API is not defined');
  }
  const response = await fetch('https://api-erb.cloudzack.com/dev/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-Key':
        process.env.NODE_ENV === 'development' ? devApiKey : prodApiKey,
    },
    body: JSON.stringify(info),
  });

  const data = await response.json();
  return Response.json(data);
}
