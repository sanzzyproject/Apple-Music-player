'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Track } from '@/lib/store';
import { TrackItem } from '@/components/TrackItem';
import { Heart, Plus, ListMusic, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { usePlayerStore } from '@/lib/store';

export default function Library() {
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists'>('liked');
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistImg, setNewPlaylistImg] = useState('');
  const { playTrack } = usePlayerStore();

  const loadLibrary = async () => {
    const liked = await db.getLikedSongs();
    const pl = await db.getPlaylists();
    setLikedSongs(liked);
    setPlaylists(pl);
  };

  useEffect(() => {
    let mounted = true;
    const fetchLib = async () => {
      const liked = await db.getLikedSongs();
      const pl = await db.getPlaylists();
      if (mounted) {
        setLikedSongs(liked);
        setPlaylists(pl);
      }
    };
    fetchLib();
    return () => { mounted = false; };
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      img: newPlaylistImg || 'https://picsum.photos/seed/playlist/200/200',
      tracks: [],
    };
    await db.addPlaylist(newPlaylist);
    setShowCreate(false);
    setNewPlaylistName('');
    setNewPlaylistImg('');
    loadLibrary();
  };

  const handleDeletePlaylist = async (id: string) => {
    await db.deletePlaylist(id);
    loadLibrary();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlaylistImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-12 px-4 pb-24">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Library</h1>
      
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('liked')}
          className={`text-lg font-semibold transition-colors ${activeTab === 'liked' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Liked Songs
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`text-lg font-semibold transition-colors ${activeTab === 'playlists' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Playlists
        </button>
      </div>

      {activeTab === 'liked' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Liked Songs</h2>
              <p className="text-gray-400">{likedSongs.length} songs</p>
              {likedSongs.length > 0 && (
                <button
                  onClick={() => playTrack(likedSongs[0], likedSongs)}
                  className="mt-2 text-sm bg-white text-black px-4 py-1.5 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Play All
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1">
            {likedSongs.map((track) => (
              <TrackItem key={track.videoId} track={track} queue={likedSongs} />
            ))}
            {likedSongs.length === 0 && (
              <div className="text-center text-gray-500 py-12">No liked songs yet.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-4 w-full p-4 bg-[#1C1C1E] rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-medium text-white">New Playlist</span>
          </button>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {playlists.map((pl) => (
              <div key={pl.id} className="bg-[#1C1C1E] rounded-xl p-4 group relative">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                  <Image src={pl.img} alt={pl.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks);
                      }}
                      className="w-12 h-12 bg-[#FA243C] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-white truncate">{pl.name}</h3>
                <p className="text-sm text-gray-400">{pl.tracks.length} songs</p>
                <button
                  onClick={() => handleDeletePlaylist(pl.id)}
                  className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-white/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Create Playlist</h2>
            
            <div className="flex justify-center mb-6">
              <label className="relative w-32 h-32 rounded-xl overflow-hidden cursor-pointer group bg-white/5 flex items-center justify-center border border-dashed border-white/20 hover:border-white/50 transition-colors">
                {newPlaylistImg ? (
                  <Image src={newPlaylistImg} alt="Preview" fill className="object-cover" />
                ) : (
                  <ListMusic className="w-8 h-8 text-white/50" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-xs font-semibold text-white">Upload Image</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="w-full bg-black text-white rounded-xl py-3 px-4 mb-6 focus:outline-none focus:ring-2 focus:ring-[#FA243C] border border-white/10"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-[#FA243C] hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
