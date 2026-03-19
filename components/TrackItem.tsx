'use client';

import { Track, usePlayerStore } from '@/lib/store';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

export function TrackItem({ track, queue }: { track: Track; queue?: Track[] }) {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const isCurrent = currentTrack?.videoId === track.videoId;

  const thumbnail = track.thumbnails?.[0]?.url || 'https://picsum.photos/seed/music/100/100';
  const artistName = Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name || 'Unknown Artist';

  return (
    <div
      className="flex items-center p-3 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors"
      onClick={() => playTrack(track, queue)}
    >
      <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
        <Image src={thumbnail} alt={track.name} fill className="object-cover" />
        {isCurrent && isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex gap-0.5 items-end h-3">
              <div className="w-1 bg-[#FA243C] animate-[bounce_1s_infinite_0ms]" />
              <div className="w-1 bg-[#FA243C] animate-[bounce_1s_infinite_200ms]" />
              <div className="w-1 bg-[#FA243C] animate-[bounce_1s_infinite_400ms]" />
            </div>
          </div>
        )}
      </div>
      <div className="ml-4 flex-1 min-w-0 border-b border-white/5 pb-3 group-hover:border-transparent transition-colors">
        <div className={`font-medium truncate ${isCurrent ? 'text-[#FA243C]' : 'text-white'}`}>
          {track.name}
        </div>
        <div className="text-sm text-gray-400 truncate">{artistName}</div>
      </div>
      <button className="p-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}
