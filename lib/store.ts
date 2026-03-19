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
  
  playTrack: (track: Track, queue?: Track[]) => void;
  playNext: () => void;
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

  playTrack: (track, queue) => {
    set({
      currentTrack: track,
      isPlaying: true,
      queue: queue || [track],
      queueIndex: queue ? queue.findIndex((t) => t.videoId === track.videoId) : 0,
      progress: 0,
    });
  },

  playNext: () => {
    const { queue, queueIndex } = get();
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      set({
        currentTrack: queue[nextIndex],
        queueIndex: nextIndex,
        isPlaying: true,
        progress: 0,
      });
    } else {
      set({ isPlaying: false, progress: 0 });
    }
  },

  playPrev: () => {
    const { queue, queueIndex, progress } = get();
    if (progress > 3) {
      // If played for more than 3 seconds, restart track
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
