import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Track } from './store';

interface SannMusicDB extends DBSchema {
  playlists: {
    key: string;
    value: {
      id: string;
      name: string;
      img: string;
      tracks: Track[];
    };
  };
  liked_songs: {
    key: string;
    value: Track;
  };
}

let dbPromise: Promise<IDBPDatabase<SannMusicDB>>;

if (typeof window !== 'undefined') {
  dbPromise = openDB<SannMusicDB>('SannMusicDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('liked_songs')) {
        db.createObjectStore('liked_songs', { keyPath: 'videoId' });
      }
    },
  });
}

export const db = {
  async getPlaylists() {
    const db = await dbPromise;
    return db.getAll('playlists');
  },
  async addPlaylist(playlist: { id: string; name: string; img: string; tracks: Track[] }) {
    const db = await dbPromise;
    return db.put('playlists', playlist);
  },
  async getPlaylist(id: string) {
    const db = await dbPromise;
    return db.get('playlists', id);
  },
  async deletePlaylist(id: string) {
    const db = await dbPromise;
    return db.delete('playlists', id);
  },
  async getLikedSongs() {
    const db = await dbPromise;
    return db.getAll('liked_songs');
  },
  async addLikedSong(track: Track) {
    const db = await dbPromise;
    return db.put('liked_songs', track);
  },
  async removeLikedSong(videoId: string) {
    const db = await dbPromise;
    return db.delete('liked_songs', videoId);
  },
  async isLiked(videoId: string) {
    const db = await dbPromise;
    const song = await db.get('liked_songs', videoId);
    return !!song;
  },
};
