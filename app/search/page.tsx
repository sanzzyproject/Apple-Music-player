'use client';

import { useState, useEffect } from 'react';
import { Track } from '@/lib/store';
import { TrackItem } from '@/components/TrackItem';
import { Search as SearchIcon, Loader2, ArrowLeft, X, ArrowUpLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const tabs = ['Semua', 'Lagu', 'Video', 'Album', 'Artis', 'Daftar putar'];

  const getSuggestions = (q: string) => {
    if (!q) return [];
    return [
      `${q} pandang`,
      `${q} pandang tenxi`,
      `${q} pandang dj`,
      `${q} pandang remix`,
      `${q}`,
      `${q.replace(' ', '-')} pandang`
    ];
  };

  const suggestions = getSuggestions(query);

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
    <main className="min-h-screen bg-[#121212] pt-12 pb-32">
      <div className="px-4 mb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Mencari"
            autoFocus
            className="w-full bg-[#2A2A2A] text-white rounded-full py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all border border-white/5"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {!query && (
        <div className="flex overflow-x-auto no-scrollbar gap-3 mb-6 px-4 snap-x snap-mandatory scroll-smooth">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0.5, scale: 0.9, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border snap-center ${
                activeTab === tab 
                  ? 'bg-white/20 text-white border-white/20' 
                  : 'bg-transparent text-white/70 border-white/10 hover:bg-white/5'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      )}

      {query && isFocused && (
        <div className="mb-6">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => {
                setQuery(suggestion);
                setIsFocused(false);
              }}
            >
              <div className="flex items-center gap-4">
                <SearchIcon className="w-5 h-5 text-white/50" />
                <span className="text-white text-base">{suggestion}</span>
              </div>
              <ArrowUpLeft className="w-5 h-5 text-white/50" />
            </div>
          ))}
        </div>
      )}

      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-1 border-t border-white/10 pt-4">
            {results.map((track) => (
              <TrackItem key={track.videoId} track={track} queue={results} />
            ))}
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
      </div>
    </main>
  );
}
