"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const SRC = "/The Plan - Travis Scott.mp3";

interface AudioCtx {
  playing: boolean;
  progress: number;
  toggle: () => void;
}

const AudioContext = createContext<AudioCtx>({ playing: false, progress: 0, toggle: () => {} });

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  return (
    <AudioContext.Provider value={{ playing, progress, toggle }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() { return useContext(AudioContext); }
