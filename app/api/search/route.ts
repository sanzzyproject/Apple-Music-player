import { NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();
let initialized = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });
  
  try {
    if (!initialized) {
      await ytmusic.initialize();
      initialized = true;
    }
    const [songs, videos] = await Promise.all([
      ytmusic.searchSongs(query),
      ytmusic.searchVideos(query)
    ]);
    const results = [...songs, ...videos];
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
