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
    const results = await ytmusic.search(query);
    const songs = results.filter((item: any) => item.type === 'SONG' || item.type === 'VIDEO');
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
