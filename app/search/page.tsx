'use client';

import { useState, useEffect } from 'react';
import { Track } from '@/lib/store';
import { TrackItem } from '@/components/TrackItem';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');

  const tabs = ['Semua', 'Lagu', 'Video', 'Album', 'Artis', 'Daftar putar'];

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          // In a real app, you'd pass the tab type to the API
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeTab]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-12 px-4 pb-32">
      <div className="flex overflow-x-auto no-scrollbar gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
              activeTab === tab 
                ? 'bg-white/20 text-white border-white/20' 
                : 'bg-transparent text-white/70 border-white/10 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-white/50" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mencari"
          className="w-full bg-[#1C1C1E] text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all border border-white/5"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Top result</h2>
            <TrackItem track={results[0]} queue={results} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
            <div className="space-y-1">
              {results.slice(1).map((track) => (
                <TrackItem key={track.videoId} track={track} queue={results} />
              ))}
            </div>
          </div>
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center mt-20 text-white/50">
          <SearchIcon className="w-16 h-16 mb-4 opacity-20" />
          <p>Tidak ada hasil yang ditemukan</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-white/50">
          <SearchIcon className="w-16 h-16 mb-4 opacity-20" />
          <p>Cari lagu, album, atau artis</p>
        </div>
      )}
    </main>
  );
}
