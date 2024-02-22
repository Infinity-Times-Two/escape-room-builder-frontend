// export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(req: Request, res: any) {
  console.log('something happening')
  const devApiKey = process.env.DEV_API;
  if (typeof devApiKey !== 'string') {
    throw new Error('DEV_API is not defined')
  }

  const prodApiKey = process.env.PROD_API;
  if (typeof prodApiKey !== 'string') {
    throw new Error('PROD_API is not defined')
  }

  const response = await fetch('https://api-erb.cloudzack.com/dev/games', {
    headers: {
      'Content-Type': 'application/json',
      'x-api-Key': process.env.NODE_ENV === "development" ? devApiKey : prodApiKey,
    },
  })
  const data = await response.json()
  console.log(data)
 
  // return res.send(JSON.stringify(data))
  return Response.json(data)
}