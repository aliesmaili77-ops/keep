import React, { useState } from "react";
import AutoTextarea from "./AutoTextarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function MemoryContent({ initialData, onContinue }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [text, setText] = useState(initialData?.text || "");

  const canContinue = text.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-6 flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground/50"
        />
        <div className="mt-4 pt-4 border-t border-border/40">
          <AutoTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What happened?"
            className="w-full bg-transparent text-[15px] leading-relaxed resize-none outline-none placeholder:text-muted-foreground/50 font-body"
            minHeight={160}
          />
        </div>
      </div>

      <div className="sticky bottom-0 px-5 pb-[calc(max(env(safe-area-inset-bottom),16px)+72px)] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Button
          className="w-full"
          size="lg"
          disabled={!canContinue}
          onClick={() => onContinue({ text: text.trim(), title: title.trim() })}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}