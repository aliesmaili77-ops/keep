import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CommentInput({ onAdd, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <div className="sticky bottom-0 px-5 py-3 bg-background border-t border-border/60 pb-[calc(max(env(safe-area-inset-bottom),16px)+72px)]">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onFocus={() => window.dispatchEvent(new CustomEvent("nav-hide"))}
          onBlur={() => window.dispatchEvent(new CustomEvent("nav-show"))}
          placeholder="Add a comment..."
          className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="text-primary font-semibold text-sm disabled:opacity-40 px-2 shrink-0 flex items-center gap-1"
        >
          {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
        </button>
      </div>
    </div>
  );
}