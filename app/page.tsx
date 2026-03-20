'use client';

import { useEffect, useState } from 'react';
import { Track, usePlayerStore } from '@/lib/store';
import { Loader2, History, Cast, User, Play } from 'lucide-react';
import Image from 'next/image';
import { HorizontalScroll } from '@/components/HorizontalScroll';

export default function Home() {
  const [heroTrack, setHeroTrack] = useState<Track | null>(null);
  const [communityTracks, setCommunityTracks] = useState<Track[]>([]);
  const [categories, setCategories] = useState<{ title: string; tracks: Track[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayerStore();

  const pills = ['Relax', 'Commute', 'Sad', 'Energize', 'Feel good', 'Workout', 'Focus'];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const resHero = await fetch(`/api/search?q=dave+how+i+met+my+ex`);
        const dataHero = await resHero.json();
        if (dataHero && dataHero.length > 0) setHeroTrack(dataHero[0]);

        const resComm = await fetch(`/api/search?q=indie+pop+hits`);
        const dataComm = await resComm.json();
        if (dataComm) setCommunityTracks(dataComm.slice(0, 4));

        const queries = [
          { title: 'Trending Now', q: 'lagu indonesia hits terbaru' },
          { title: 'New Releases', q: 'lagu pop indonesia rilis terbaru' },
          { title: 'Top 50 Indonesia', q: 'top 50 indonesia playlist update' },
          { title: 'Viral on TikTok', q: 'lagu fyp tiktok viral' },
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

      <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 mb-8">
        {pills.map((pill) => (
          <button key={pill} className="whitespace-nowrap px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/5">
            {pill}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#FA243C] animate-spin" />
        </div>
      ) : (
        <div className="space-y-10">
          {heroTrack && (
            <div className="px-4">
              <div 
                className="relative w-full aspect-[4/5] sm:aspect-video rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                onClick={() => playTrack(heroTrack, [heroTrack], 'similar')}
              >
                <Image 
                  src={heroTrack.thumbnails?.[heroTrack.thumbnails.length - 1]?.url || 'https://picsum.photos/seed/hero/800/800'} 
                  alt={heroTrack.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">{heroTrack.name}</h2>
                  <p className="text-white/80 font-medium drop-shadow-md">
                    {Array.isArray(heroTrack.artist) ? heroTrack.artist.map(a => a.name).join(', ') : heroTrack.artist?.name}
                  </p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <p className="text-sm text-white/60 truncate pr-4">Sounds like Raindance • Dave, Tems</p>
                  <div className="w-12 h-12 bg-[#FA243C] rounded-full flex items-center justify-center shadow-lg shadow-[#FA243C]/30 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Play className="w-6 h-6 text-white ml-1 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {communityTracks.length > 0 && (
            <div className="px-4">
              <h2 className="text-2xl font-bold text-white mb-4">From the community</h2>
              <div className="bg-[#1C1C1E]/60 backdrop-blur-md rounded-3xl p-4 border border-white/5">
                <div className="space-y-3">
                  {communityTracks.map((track) => (
                    <div 
                      key={track.videoId} 
                      className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
                      onClick={() => playTrack(track, communityTracks, 'similar')}
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <Image src={track.thumbnails?.[0]?.url || 'https://picsum.photos/seed/track/100/100'} alt={track.name} fill className="object-cover" />
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
