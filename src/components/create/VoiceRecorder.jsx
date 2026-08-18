import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, RotateCcw, Play, Pause, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BAR_COUNT = 36;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VoiceRecorder({ onRecorded, onCleared }) {
  const [state, setState] = useState("idle"); // idle | recording | recorded | denied
  const [elapsed, setElapsed] = useState(0);
  const [bars, setBars] = useState(new Array(BAR_COUNT).fill(3));
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const updateWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const newBars = [];
    const step = Math.floor(data.length / BAR_COUNT);
    for (let i = 0; i < BAR_COUNT; i++) {
      const value = data[i * step] || 0;
      newBars.push(Math.max(3, (value / 255) * 100));
    }
    setBars(newBars);
    rafRef.current = requestAnimationFrame(updateWaveform);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        if (onRecorded) onRecorded(blob, elapsed);
      };

      mediaRecorder.start();
      setState("recording");
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      rafRef.current = requestAnimationFrame(updateWaveform);
    } catch (err) {
      setState("denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setState("recorded");
  };

  const retry = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (audioRef.current) audioRef.current.pause();
    setElapsed(0);
    setBars(new Array(BAR_COUNT).fill(3));
    setIsPlaying(false);
    setState("idle");
    if (onCleared) onCleared();
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Waveform */}
      <div className="flex items-center gap-[3px] h-16 w-full justify-center">
        {bars.map((h, i) => (
          <div
            key={i}
            className={cn(
              "w-[3px] rounded-full transition-all duration-75",
              state === "recording" ? "bg-primary" : state === "recorded" ? "bg-primary/70" : "bg-muted-foreground/25"
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Time / status */}
      <p className="text-sm font-mono text-muted-foreground mt-3 h-5">
        {state === "recording" && formatTime(elapsed)}
        {state === "recorded" && formatTime(elapsed)}
        {state === "idle" && "Ready to record"}
        {state === "denied" && "Access denied"}
      </p>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-6">
        {state === "idle" && (
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
            aria-label="Start recording"
          >
            <Mic className="w-7 h-7" strokeWidth={2.2} />
          </button>
        )}

        {state === "recording" && (
          <button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground shadow-lg shadow-destructive/30 transition-transform active:scale-95 animate-pulse"
            aria-label="Stop recording"
          >
            <Square className="w-6 h-6 fill-current" strokeWidth={0} />
          </button>
        )}

        {state === "recorded" && (
          <>
            <button
              onClick={retry}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-transform active:scale-95"
              aria-label="Retry recording"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayback}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
            </button>
          </>
        )}
      </div>

      {state === "recorded" && (
        <p className="text-xs text-muted-foreground mt-3">Tap play to preview, or retry to re-record</p>
      )}

      {state === "denied" && (
        <div className="mt-4 flex flex-col items-center text-center px-6">
          <AlertCircle className="w-8 h-8 text-destructive mb-2" />
          <p className="text-sm font-medium">Microphone access denied</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[260px]">
            Allow microphone access in your browser settings to record voice notes.
          </p>
          <button
            onClick={startRecording}
            className="text-sm text-primary font-medium mt-3"
          >
            Try again
          </button>
        </div>
      )}

      {audioUrlRef.current && state === "recorded" && (
        <audio
          ref={audioRef}
          src={audioUrlRef.current}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
}