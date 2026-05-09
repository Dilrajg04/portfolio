"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const SRC = "/The Plan - Travis Scott.mp3";

interface AudioCtx {
  playing: boolean;
  progress: number;
  toggle: () => void;
  analyser: AnalyserNode | null;
  visualizerMode: boolean;
  setVisualizerMode: (v: boolean) => void;
}

const AudioContext = createContext<AudioCtx>({
  playing: false,
  progress: 0,
  toggle: () => {},
  analyser: null,
  visualizerMode: false,
  setVisualizerMode: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const webAudioRef = useRef<{ ctx: globalThis.AudioContext; analyser: AnalyserNode } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [visualizerMode, setVisualizerMode] = useState(false);

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
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (!webAudioRef.current) {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const source = ctx.createMediaElementSource(audio);
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.75;
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);
        webAudioRef.current = { ctx, analyser: analyserNode };
        setAnalyser(analyserNode);
      } else {
        webAudioRef.current.ctx.resume();
      }
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <AudioContext.Provider value={{ playing, progress, toggle, analyser, visualizerMode, setVisualizerMode }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() { return useContext(AudioContext); }
