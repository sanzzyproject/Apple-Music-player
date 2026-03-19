import { NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();
let initialized = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  try {
    if (!initialized) {
      await ytmusic.initialize();
      initialized = true;
    }
    const lyrics = await ytmusic.getLyrics(id);
    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error('Lyrics error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
