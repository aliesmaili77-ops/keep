import React, { useState } from "react";
import AutoTextarea from "./AutoTextarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ContentScreen({ initialData, onContinue }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [text, setText] = useState(initialData?.text || "");
  const [speaker, setSpeaker] = useState(initialData?.speaker_name || "");
  const [context, setContext] = useState(initialData?.context || "");

  const hasContent = text.trim().length > 0;

  const handleContinue = () => {
    onContinue({
      title: title.trim(),
      text: text.trim(),
      speaker_name: speaker.trim(),
      context: context.trim(),
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
            Write something to keep
          </p>
        )}
      </div>
    </div>
  );
}