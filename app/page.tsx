'use client';

import { useEffect, useState } from 'react';
import { Track, usePlayerStore } from '@/lib/store';
import { Loader2, History, Cast, User, Play, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { getHighResImage } from '@/lib/utils';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function Home() {
  const [heroTracks, setHeroTracks] = useState<Track[]>([]);
  const [speedDialTracks, setSpeedDialTracks] = useState<Track[]>([]);
  const [quickPicksTracks, setQuickPicksTracks] = useState<Track[]>([]);
  const [communityTracks, setCommunityTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Track[]>([]);
  const [categories, setCategories] = useState<{ title: string; tracks: Track[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterData, setFilterData] = useState<{ title: string; tracks: Track[] }[]>([]);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const { playTrack } = usePlayerStore();

  const pills = ['Relax', 'Commute', 'Sad', 'Energize', 'Feel good', 'Workout', 'Focus'];

  useEffect(() => {
    if (!activeFilter) return;
    const fetchFilterData = async () => {
      setLoadingFilter(true);
      try {
        const queries = [
          { title: `Feeling ${activeFilter.toLowerCase()}`, q: `${activeFilter} mood songs` },
          { title: `${activeFilter} hits`, q: `top ${activeFilter} songs` },
          { title: `More like ${activeFilter}`, q: `best ${activeFilter} tracks` },
        ];
        const results = await Promise.all(
          queries.map(async ({ title, q }) => {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            return { title, tracks: data.slice(0, 10) };
          })
        );
        setFilterData(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFilter(false);
      }
    };
    fetchFilterData();
  }, [activeFilter]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const resHero = await fetch(`/api/search?q=dave+how+i+met+my+ex`);
        const dataHero = await resHero.json();
        if (dataHero) setHeroTracks(dataHero.slice(0, 3));

        const resSpeedDial = await fetch(`/api/search?q=top+hits+2024`);
        const dataSpeedDial = await resSpeedDial.json();
        if (dataSpeedDial) setSpeedDialTracks(dataSpeedDial.slice(0, 45));

        const resQuickPicks = await fetch(`/api/search?q=viral+hits+indonesia`);
        const dataQuickPicks = await resQuickPicks.json();
        if (dataQuickPicks) setQuickPicksTracks(dataQuickPicks.slice(0, 20));

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
          <Link href="/history" className="hover:text-white transition-colors">
            <History className="w-6 h-6" />
          </Link>
          <Cast className="w-6 h-6" />
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 mb-8 snap-x snap-mandatory scroll-smooth">
        {pills.map((pill) => (
          <button 
            key={pill} 
            onClick={() => setActiveFilter(activeFilter === pill ? null : pill)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border snap-center ${
              activeFilter === pill 
                ? 'bg-white text-black border-white' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/5'
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      {loading || (activeFilter && loadingFilter) ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#FA243C] animate-spin" />
        </div>
      ) : activeFilter ? (
        <div className="space-y-10">
          {filterData.map((cat, i) => (
            <HorizontalScroll key={i} title={cat.title} tracks={cat.tracks} />
          ))}
          
          <div className="px-4 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Suasana Hati dan Genre</h2>
            <div className="grid grid-cols-2 gap-3">
              {pills.map((p, idx) => {
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
                const color = colors[idx % colors.length];
                return (
                  <button
                    key={p}
                    onClick={() => setActiveFilter(p)}
                    className="relative overflow-hidden bg-white/5 hover:bg-white/10 text-white font-medium py-4 px-4 rounded-xl text-left transition-colors border border-white/5"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${color}`} />
                    <span className="ml-2">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {heroTracks.length > 0 && (
            <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 snap-x snap-mandatory scroll-smooth pb-4">
              {heroTracks.map((track) => (
                <motion.div 
                  key={track.videoId}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-[85vw] sm:w-[400px] shrink-0 aspect-[4/5] sm:aspect-video rounded-3xl overflow-hidden cursor-pointer group shadow-2xl snap-center hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
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

          {speedDialTracks.length > 0 && (
            <div className="px-4">
              <h2 className="text-2xl font-bold text-white mb-4">Speed dial</h2>
              <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth pb-4">
                {Array.from({ length: Math.ceil(speedDialTracks.length / 9) }).map((_, i) => {
                  const chunk = speedDialTracks.slice(i * 9, i * 9 + 9);
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-[85vw] sm:w-[400px] shrink-0 snap-center grid grid-cols-3 gap-2"
                    >
                      {chunk.map((track) => (
                        <div 
                          key={track.videoId}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                          onClick={() => playTrack(track, speedDialTracks, 'similar')}
                        >
                          <Image src={getHighResImage(track.thumbnails?.[0]?.url, 200)} alt={track.name} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-medium truncate drop-shadow-md">{track.name}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {quickPicksTracks.length > 0 && (
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Pilihan cepat</h2>
                <button 
                  className="text-sm font-medium text-white/80 hover:text-white border border-white/20 rounded-full px-4 py-1.5 transition-colors"
                  onClick={() => playTrack(quickPicksTracks[0], quickPicksTracks, 'similar')}
                >
                  Putar semua
                </button>
              </div>
              <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth pb-4">
                {Array.from({ length: Math.ceil(quickPicksTracks.length / 4) }).map((_, i) => {
                  const chunk = quickPicksTracks.slice(i * 4, i * 4 + 4);
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-[85vw] sm:w-[400px] shrink-0 snap-center flex flex-col gap-3"
                    >
                      {chunk.map((track) => (
                        <div 
                          key={track.videoId}
                          className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 -mx-2 rounded-xl active:scale-[0.98] transition-all duration-200"
                          onClick={() => playTrack(track, quickPicksTracks, 'similar')}
                        >
                          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                            <Image src={getHighResImage(track.thumbnails?.[0]?.url, 100)} alt={track.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-5 h-5 text-white fill-current" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate text-base">{track.name}</h3>
                            <p className="text-white/60 text-sm truncate">
                              {Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name}
                            </p>
                          </div>
                          <button className="p-2 text-white/60 hover:text-white transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  );
                })}
              </div>
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
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-[85vw] sm:w-[400px] shrink-0 bg-[#1C1C1E]/60 backdrop-blur-md rounded-3xl p-4 border border-white/5 snap-center shadow-xl"
                    >
                      <div className="space-y-3">
                        {chunk.map((track) => (
                          <div 
                            key={track.videoId} 
                            className="flex items-center gap-4 p-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 active:scale-95 group"
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
                          </div>
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
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 snap-center hover:scale-105 active:scale-95 transition-transform duration-200"
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
