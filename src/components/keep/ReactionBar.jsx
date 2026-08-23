import React from "react";
import { reactionEmojis } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const reactionTypes = Object.keys(reactionEmojis);

export default function ReactionBar({ counts = {}, myReactionIds = {}, onToggle, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {reactionTypes.map((type) => {
        const count = counts[type] || 0;
        const active = !!myReactionIds[type];
        return (
          <button
            key={type}
            onClick={() => onToggle?.(type)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all active:scale-95 disabled:opacity-50",
              active ? "bg-primary/15 ring-1 ring-primary/30" : "bg-muted/60 hover:bg-muted"
            )}
          >
            <span className="text-base">{reactionEmojis[type]}</span>
            {count > 0 && (
              <span className="text-xs font-medium text-muted-foreground tabular-nums">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}