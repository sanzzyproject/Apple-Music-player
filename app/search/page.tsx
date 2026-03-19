'use client';

import { useState, useEffect } from 'react';
import { Track } from '@/lib/store';
import { TrackItem } from '@/components/TrackItem';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
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
  }, [query]);

  return (
    <main className="min-h-screen bg-black pt-12 px-4">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Search</h1>
      
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artists, Songs, Lyrics, and More"
          className="w-full bg-[#1C1C1E] text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FA243C] transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 text-[#FA243C] animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-1 pb-24">
          <h2 className="text-xl font-bold text-white mb-4">Top Results</h2>
          {results.map((track) => (
            <TrackItem key={track.videoId} track={track} queue={results} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center text-gray-500 mt-12">
          No results found for &quot;{query}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {['Pop', 'Indie', 'K-Pop', 'Hip-Hop', 'Rock', 'Jazz'].map((cat, i) => (
            <div
              key={i}
              onClick={() => setQuery(cat)}
              className="bg-[#1C1C1E] rounded-xl p-4 h-24 flex items-end cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden"
            >
              <span className="font-bold text-lg relative z-10">{cat}</span>
              <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-50 blur-xl ${['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'][i % 6]}`} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
