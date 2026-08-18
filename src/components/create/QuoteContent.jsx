import React, { useState } from "react";
import AutoTextarea from "./AutoTextarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function QuoteContent({ initialData, onContinue }) {
  const [text, setText] = useState(initialData?.text || "");
  const [speaker, setSpeaker] = useState(initialData?.speaker_name || "");

  const canContinue = text.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-6 flex-1">
        <h2 className="text-xl font-semibold tracking-tight">What did they say?</h2>
        <AutoTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the quote..."
          className="w-full bg-transparent text-lg leading-relaxed resize-none outline-none placeholder:text-muted-foreground/50 mt-4 font-body"
          minHeight={140}
        />
        <div className="mt-6 pt-4 border-t border-border/40">
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
      </div>

      <div className="sticky bottom-0 px-5 pb-[calc(max(env(safe-area-inset-bottom),16px)+72px)] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Button
          className="w-full"
          size="lg"
          disabled={!canContinue}
          onClick={() => onContinue({ text: text.trim(), speaker_name: speaker.trim() })}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}