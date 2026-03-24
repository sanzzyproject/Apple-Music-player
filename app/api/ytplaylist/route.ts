import { NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    await ytmusic.initialize();
    try {
      const playlist = await ytmusic.getPlaylist(id);
      return NextResponse.json(playlist);
    } catch (e) {
      console.log('getPlaylist failed, trying getAlbum', e);
      const album = await ytmusic.getAlbum(id);
      // Map album to playlist format
      return NextResponse.json({
        playlistId: album.albumId,
        name: album.name,
        artist: album.artist,
        thumbnails: album.thumbnails,
        videos: album.songs.map((song: any) => ({
          videoId: song.videoId,
          name: song.name,
          artist: song.artist,
          duration: song.duration,
          thumbnails: song.thumbnails,
        }))
      });
    }
  } catch (error) {
    console.error('Error fetching playlist/album:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
  }
}
