import { create } from 'zustand';

export interface Track {
  videoId: string;
  name: string;
  artist: { name: string } | { name: string }[];
  thumbnails: { url: string; width: number; height: number }[];
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  isExpanded: boolean;
  volume: number;
  progress: number;
  duration: number;
  playContext: 'playlist' | 'similar';
  
  playTrack: (track: Track, queue?: Track[], context?: 'playlist' | 'similar') => void;
  playNext: () => Promise<void>;
  playPrev: () => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  isExpanded: false,
  volume: 100,
  progress: 0,
  duration: 0,
  playContext: 'similar',

  playTrack: (track, queue, context = 'similar') => {
    set({
      currentTrack: track,
      isPlaying: true,
      queue: queue || [track],
      queueIndex: queue ? queue.findIndex((t) => t.videoId === track.videoId) : 0,
      progress: 0,
      playContext: context,
    });
  },

  playNext: async () => {
    const { queue, queueIndex, playContext, currentTrack } = get();
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      set({
        currentTrack: queue[nextIndex],
        queueIndex: nextIndex,
        isPlaying: true,
        progress: 0,
      });
    } else {
      if (playContext === 'similar' && currentTrack) {
        try {
          const res = await fetch(`/api/upnext?id=${currentTrack.videoId}`);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const nextTracks = data.filter((t: any) => t.videoId !== currentTrack.videoId);
            if (nextTracks.length > 0) {
              const nextTrack = nextTracks[0];
              set({
                queue: [...queue, ...nextTracks],
                currentTrack: nextTrack,
                queueIndex: queueIndex + 1,
                isPlaying: true,
                progress: 0,
              });
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      set({ isPlaying: false, progress: 0 });
    }
  },

  playPrev: () => {
    const { queue, queueIndex, progress } = get();
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      set({
        currentTrack: queue[prevIndex],
        queueIndex: prevIndex,
        isPlaying: true,
        progress: 0,
      });
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setExpanded: (expanded) => set({ isExpanded: expanded }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
}));
