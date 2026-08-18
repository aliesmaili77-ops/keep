import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { formatDuration } from "@/lib/mockData";

const WAVEFORM = [
  0.3, 0.5, 0.7, 0.4, 0.8, 0.6, 0.9, 0.5, 0.7, 0.3, 0.6, 0.8, 0.4, 0.5, 0.7,
  0.9, 0.6, 0.3, 0.5, 0.8, 0.4, 0.6, 0.7, 0.5, 0.3, 0.8, 0.6, 0.4, 0.7, 0.5,
  0.9, 0.3, 0.6, 0.7, 0.4, 0.5, 0.8, 0.6, 0.3,
];

export default function VoicePlayer({ duration = 120 }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const timerRef = useRef(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 100 / (duration * 10);
          if (next >= 100) {
            setPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, duration]);

  const playedBars = Math.floor((progress / 100) * WAVEFORM.length);
  const currentSec = Math.floor((progress / 100) * duration);

  return (
    <div
      className="flex items-center gap-3 rounded-full bg-muted/50 px-4 py-2.5 mt-1"
      role="region"
      aria-label="Voice keep playback"
    >
      <button
        onClick={() => setPlaying(!playing)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shrink-0 transition-transform active:scale-95"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <Pause className="w-4 h-4" fill="currentColor" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
        )}
      </button>
      <div className="flex items-center gap-[2px] h-8 flex-1" aria-hidden="true">
        {WAVEFORM.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-colors ${
              i < playedBars ? "bg-primary" : "bg-muted-foreground/30"
            }`}
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
        {formatDuration(playing || progress > 0 ? currentSec : duration)}
      </span>
    </div>
  );
}