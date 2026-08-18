import React, { useState } from "react";
import VoiceRecorder from "./VoiceRecorder";
import AutoTextarea from "./AutoTextarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function VoiceContent({ onContinue }) {
  const [hasRecording, setHasRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [caption, setCaption] = useState("");

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-6 flex-1">
        <h2 className="text-xl font-semibold tracking-tight">Record a voice note</h2>
        <p className="text-muted-foreground text-sm mt-1">Tap the button to start recording</p>

        <div className="mt-10">
          <VoiceRecorder
            onRecorded={(_blob, dur) => {
              setHasRecording(true);
              setDuration(dur);
            }}
            onCleared={() => {
              setHasRecording(false);
              setDuration(0);
            }}
          />
        </div>

        {hasRecording && (
          <div className="mt-8 pt-4 border-t border-border/40">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Add a note
            </label>
            <AutoTextarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's this about? (optional)"
              className="w-full bg-transparent text-[15px] leading-relaxed resize-none outline-none placeholder:text-muted-foreground/50 mt-2 font-body"
              minHeight={60}
              autoFocus={false}
            />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 px-5 pb-[calc(max(env(safe-area-inset-bottom),16px)+72px)] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Button
          className="w-full"
          size="lg"
          disabled={!hasRecording}
          onClick={() => onContinue({ text: caption.trim(), audioDuration: duration })}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}