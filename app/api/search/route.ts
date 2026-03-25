import { NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();
let initialized = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type');
  
  if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });
  
  try {
    if (!initialized) {
      await ytmusic.initialize();
      initialized = true;
    }
    
    if (type === 'playlist') {
      const playlists = await ytmusic.searchPlaylists(query).catch(e => { console.error('Error searching playlists:', e.name === 'ZodError' ? 'ZodError' : e); return []; });
      return NextResponse.json(playlists, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    const [songs, videos, artists] = await Promise.all([
      ytmusic.searchSongs(query).catch(e => { console.error('Error searching songs:', e.name === 'ZodError' ? 'ZodError' : e); return []; }),
      ytmusic.searchVideos(query).catch(e => { console.error('Error searching videos:', e.name === 'ZodError' ? 'ZodError' : e); return []; }),
      ytmusic.searchArtists(query).catch(e => { console.error('Error searching artists:', e.name === 'ZodError' ? 'ZodError' : e); return []; })
    ]);
    const results = [...songs, ...videos, ...artists];
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
