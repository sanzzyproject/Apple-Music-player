'use client';

import { useEffect, useState } from 'react';
import { Track, usePlayerStore } from '@/lib/store';
import { Loader2, History, Cast, User, Play } from 'lucide-react';
import Image from 'next/image';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { getHighResImage } from '@/lib/utils';
import { motion } from 'motion/react';

export default function Home() {
  const [heroTracks, setHeroTracks] = useState<Track[]>([]);
  const [communityTracks, setCommunityTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Track[]>([]);
  const [categories, setCategories] = useState<{ title: string; tracks: Track[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayerStore();

  const pills = ['Relax', 'Commute', 'Sad', 'Energize', 'Feel good', 'Workout', 'Focus'];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const resHero = await fetch(`/api/search?q=dave+how+i+met+my+ex`);
        const dataHero = await resHero.json();
        if (dataHero) setHeroTracks(dataHero.slice(0, 3));

        const resComm = await fetch(`/api/search?q=indie+pop+hits`);
        const dataComm = await resComm.json();
        if (dataComm) setCommunityTracks(dataComm.slice(0, 20));

        const resArtists = await fetch(`/api/search?q=top+indonesian+artists`);
        const dataArtists = await resArtists.json();
        if (dataArtists) setArtists(dataArtists.slice(0, 6));

        const queries = [
          { title: 'Trending Now', q: 'lagu indonesia hits terbaru' },
          { title: 'New Releases', q: 'lagu pop indonesia rilis terbaru' },
          { title: 'Top 50 Indonesia', q: 'top 50 indonesia playlist update' },
          { title: 'Viral on TikTok', q: 'lagu fyp tiktok viral' },
          { title: 'For Eid Getaways', q: 'lagu lebaran idul fitri' },
          { title: 'Surrender to the Beat', q: 'lagu edm jedag jedug' },
        ];

        const results = await Promise.all(
          queries.map(async ({ title, q }) => {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            return { title, tracks: data.slice(0, 10) };
          })
        );

        setCategories(results);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-12 pb-32">
      <div className="flex items-center justify-between px-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Beranda</h1>
        <div className="flex items-center gap-4 text-white/80">
          <History className="w-6 h-6" />
          <Cast className="w-6 h-6" />
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 mb-8 snap-x snap-mandatory scroll-smooth">
        {pills.map((pill) => (
          <motion.button 
            key={pill} 
            initial={{ opacity: 0.5, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="whitespace-nowrap px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/5 snap-center"
          >
            {pill}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#FA243C] animate-spin" />
        </div>
      ) : (
        <div className="space-y-10">
          {heroTracks.length > 0 && (
            <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 snap-x snap-mandatory scroll-smooth pb-4">
              {heroTracks.map((track) => (
                <motion.div 
                  key={track.videoId}
                  initial={{ opacity: 0.5, scale: 0.9, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-[85vw] sm:w-[400px] shrink-0 aspect-[4/5] sm:aspect-video rounded-3xl overflow-hidden cursor-pointer group shadow-2xl snap-center"
                  onClick={() => playTrack(track, heroTracks, 'similar')}
                >
                  <Image 
                    src={getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 800)} 
                    alt={track.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">{track.name}</h2>
                    <p className="text-white/80 font-medium drop-shadow-md">
                      {Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name}
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <p className="text-sm text-white/60 truncate pr-4">Sounds like Raindance • Dave, Tems</p>
                    <div className="w-12 h-12 bg-[#FA243C] rounded-full flex items-center justify-center shadow-lg shadow-[#FA243C]/30 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Play className="w-6 h-6 text-white ml-1 fill-current" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {communityTracks.length > 0 && (
            <div className="px-4">
              <h2 className="text-2xl font-bold text-white mb-4">From the community</h2>
              <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth pb-4">
                {Array.from({ length: Math.ceil(communityTracks.length / 4) }).map((_, i) => {
                  const chunk = communityTracks.slice(i * 4, i * 4 + 4);
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0.5, scale: 0.9, x: 20 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.4 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                      className="w-[85vw] sm:w-[400px] shrink-0 bg-[#1C1C1E]/60 backdrop-blur-md rounded-3xl p-4 border border-white/5 snap-center shadow-xl"
                    >
                      <div className="space-y-3">
                        {chunk.map((track) => (
                          <motion.div 
                            key={track.videoId} 
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-4 p-2 rounded-xl cursor-pointer transition-colors group"
                            onClick={() => playTrack(track, communityTracks, 'similar')}
                          >
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                              <Image src={getHighResImage(track.thumbnails?.[0]?.url, 200)} alt={track.name} fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-white fill-current" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{track.name}</h3>
                              <p className="text-white/60 text-sm truncate">
                                {Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {artists.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 px-4">Tetap mendengarkan</h2>
              <div className="flex overflow-x-auto no-scrollbar gap-6 px-4 pb-4 snap-x snap-mandatory scroll-smooth">
                {artists.map((artist, i) => {
                  const artistName = Array.isArray(artist.artist) ? artist.artist.map(a => a.name).join(', ') : artist.artist?.name || 'Artist';
                  return (
                    <motion.div
                      key={artist.videoId}
                      initial={{ opacity: 0.5, scale: 0.9, x: 20 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.4 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 snap-center"
                      onClick={() => playTrack(artist, artists, 'similar')}
                    >
                      <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg transition-transform duration-300">
                        <Image src={getHighResImage(artist.thumbnails?.[artist.thumbnails.length - 1]?.url, 400)} alt={artistName} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-white line-clamp-1">{artistName}</div>
                        <div className="text-xs text-white/50">Artis</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {categories.map((cat, i) => (
            <HorizontalScroll key={i} title={cat.title} tracks={cat.tracks} />
          ))}
        </div>
      )}
    </main>
  );
}
