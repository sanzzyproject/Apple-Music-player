'use client';

import { useEffect, useState } from 'react';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { Track } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState<{ title: string; tracks: Track[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
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
    <main className="min-h-screen bg-black pt-12">
      <div className="px-4 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Listen Now</h1>
        <p className="text-gray-400 mt-1">SANN404 FORUM</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#FA243C] animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat, i) => (
            <HorizontalScroll key={i} title={cat.title} tracks={cat.tracks} />
          ))}
        </div>
      )}
    </main>
  );
}
