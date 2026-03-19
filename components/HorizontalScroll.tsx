'use client';

import { Track, usePlayerStore } from '@/lib/store';
import Image from 'next/image';

export function HorizontalScroll({ title, tracks }: { title: string; tracks: Track[] }) {
  const { playTrack } = usePlayerStore();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4 px-4">{title}</h2>
      <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4">
        {tracks.map((track) => {
          const thumbnail = track.thumbnails?.[track.thumbnails.length - 1]?.url || 'https://picsum.photos/seed/music/300/300';
          const artistName = Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name || 'Unknown Artist';

          return (
            <div
              key={track.videoId}
              className="flex-none w-36 cursor-pointer group"
              onClick={() => playTrack(track, tracks)}
            >
              <div className="relative w-36 h-36 rounded-xl overflow-hidden mb-2 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Image src={thumbnail} alt={track.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-white line-clamp-2 leading-tight">{track.name}</div>
              <div className="text-xs text-gray-400 truncate mt-1">{artistName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
