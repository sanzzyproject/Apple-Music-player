'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/lib/store';
import { db } from '@/lib/db';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Heart, ChevronDown, ListMusic, Mic2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Player() {
  const {
    currentTrack,
    isPlaying,
    isExpanded,
    progress,
    duration,
    togglePlay,
    setPlaying,
    setExpanded,
    setProgress,
    setDuration,
    playNext,
    playPrev,
  } = usePlayerStore();

  const [isLiked, setIsLiked] = useState(false);
  const [lyrics, setLyrics] = useState<{ text: string }[] | null>(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (currentTrack) {
      db.isLiked(currentTrack.videoId).then(setIsLiked);
      fetch(`/api/lyrics?id=${currentTrack.videoId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.lyrics && data.lyrics.lyrics) {
            // ytmusic-api returns lyrics as a string or object.
            // Let's assume it's a string or object with runs.
            setLyrics([{ text: data.lyrics.lyrics || data.lyrics }]);
          } else {
            setLyrics(null);
          }
        })
        .catch(() => setLyrics(null));
    }
  }, [currentTrack]);

  const handleLike = async () => {
    if (!currentTrack) return;
    if (isLiked) {
      await db.removeLikedSong(currentTrack.videoId);
      setIsLiked(false);
    } else {
      await db.addLikedSong(currentTrack);
      setIsLiked(true);
    }
  };

  const onReady = (event: any) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const onStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      setPlaying(true);
      setDuration(event.target.getDuration());
    } else if (event.data === YouTube.PlayerState.PAUSED) {
      setPlaying(false);
    } else if (event.data === YouTube.PlayerState.ENDED) {
      playNext();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        setProgress(playerRef.current.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setProgress]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setProgress(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  if (!currentTrack) return null;

  const thumbnail = currentTrack.thumbnails?.[currentTrack.thumbnails.length - 1]?.url || 'https://picsum.photos/seed/music/500/500';
  const artistName = Array.isArray(currentTrack.artist) ? currentTrack.artist.map(a => a.name).join(', ') : currentTrack.artist?.name || 'Unknown Artist';

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <YouTube
          videoId={currentTrack.videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              playsinline: 1,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      {/* Mini Player */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[64px] left-2 right-2 z-50 bg-[#1C1C1E]/90 backdrop-blur-xl rounded-xl p-2 flex items-center shadow-2xl border border-white/10"
            onClick={() => setExpanded(true)}
          >
            <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
              <Image src={thumbnail} alt={currentTrack.name} fill className="object-cover" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="text-white font-medium truncate">{currentTrack.name}</div>
              <div className="text-gray-400 text-sm truncate">{artistName}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-3 text-white"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playNext();
              }}
              className="p-3 text-white"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Player */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#1C1C1E] flex flex-col"
          >
            {/* Blurred Background */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 blur-3xl scale-110"
              style={{ backgroundImage: `url(${thumbnail})` }}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col h-full p-6 pb-12">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => setExpanded(false)} className="p-2 -ml-2 text-white/80 hover:text-white">
                  <ChevronDown className="w-8 h-8" />
                </button>
                <div className="text-xs font-semibold tracking-widest text-white/60 uppercase">
                  {showLyrics ? 'Lyrics' : 'Now Playing'}
                </div>
                <div className="w-8" />
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col justify-center min-h-0">
                {showLyrics ? (
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
                    {lyrics ? (
                      <div className="text-2xl font-bold leading-relaxed text-white/90 space-y-6">
                        {lyrics.map((line, i) => (
                          <p key={i} className="whitespace-pre-wrap">{line.text}</p>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-white/50 text-lg">
                        Lyrics not available
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-[400px]"
                    animate={{ scale: isPlaying ? 1 : 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  >
                    <Image src={thumbnail} alt={currentTrack.name} width={500} height={500} className="w-full h-full object-cover" />
                  </motion.div>
                )}
              </div>

              {/* Controls Area */}
              <div className="mt-8">
                <div className="flex justify-between items-end mb-6">
                  <div className="min-w-0 flex-1 pr-4">
                    <h2 className="text-2xl font-bold text-white truncate">{currentTrack.name}</h2>
                    <p className="text-lg text-white/60 truncate">{artistName}</p>
                  </div>
                  <button onClick={handleLike} className="p-2 -mr-2 text-white">
                    <Heart className={cn("w-7 h-7", isLiked && "fill-[#FA243C] text-[#FA243C]")} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-2 font-mono">
                    <span>{formatTime(progress)}</span>
                    <span>-{formatTime(duration - progress)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex justify-center items-center gap-8 mb-8">
                  <button onClick={playPrev} className="text-white/80 hover:text-white transition">
                    <SkipBack className="w-10 h-10 fill-current" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-20 h-20 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                  </button>
                  <button onClick={playNext} className="text-white/80 hover:text-white transition">
                    <SkipForward className="w-10 h-10 fill-current" />
                  </button>
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-between items-center px-4">
                  <button
                    onClick={() => setShowLyrics(!showLyrics)}
                    className={cn("p-3 rounded-full transition", showLyrics ? "bg-white/20 text-white" : "text-white/50 hover:text-white")}
                  >
                    <Mic2 className="w-6 h-6" />
                  </button>
                  <button className="p-3 text-white/50 hover:text-white transition">
                    <ListMusic className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
