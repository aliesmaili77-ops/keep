import React, { useState } from "react";
import AutoTextarea from "./AutoTextarea";
import VoiceRecorder from "./VoiceRecorder";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ContentScreen({ initialData, onContinue }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [text, setText] = useState(initialData?.text || "");
  const [speaker, setSpeaker] = useState(initialData?.speaker_name || "");
  const [context, setContext] = useState(initialData?.context || "");
  const [hasRecording, setHasRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const hasContent = text.trim().length > 0 || hasRecording;

  const handleContinue = () => {
    onContinue({
      title: title.trim(),
      text: text.trim(),
      speaker_name: speaker.trim(),
      context: context.trim(),
      hasRecording,
      audioDuration: duration,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-6 flex-1">
        {/* Optional title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground/50"
        />

        {/* Main text area */}
        <div className="mt-4 pt-4 border-t border-border/40">
          <AutoTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did they say? What happened?"
            className="w-full bg-transparent text-[15px] leading-relaxed resize-none outline-none placeholder:text-muted-foreground/50 font-body"
            minHeight={140}
          />
        </div>

        {/* Speaker */}
        <div className="mt-4 pt-4 border-t border-border/40">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Who said it?
          </label>
          <input
            type="text"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            placeholder="Add a name (optional)"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/50 mt-2 pb-1"
          />
        </div>

        {/* Context */}
        <div className="mt-4 pt-4 border-t border-border/40">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Context
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. After three beers at trivia night"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/50 mt-2 pb-1"
          />
        </div>

        {/* Voice recorder section */}
        <div className="mt-6 pt-5 border-t border-border/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Add a voice note
          </p>
          <p className="text-[13px] text-muted-foreground/70 mt-0.5 mb-5">
            A replay, an impression, or just say it in your own voice
          </p>
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
      </div>

      {/* Sticky continue */}
      <div className="sticky bottom-0 px-5 pb-[calc(max(env(safe-area-inset-bottom),16px)+72px)] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Button
          className="w-full"
          size="lg"
          disabled={!hasContent}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
        {!hasContent && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Write something or record a voice note
          </p>
        )}
      </div>
    </div>
  );
}