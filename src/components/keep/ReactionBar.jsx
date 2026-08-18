import React, { useState } from "react";
import { reactionEmojis } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const reactionTypes = Object.keys(reactionEmojis);

export default function ReactionBar({ reactions = [] }) {
  const [myReactions, setMyReactions] = useState([]);

  const counts = {};
  reactions.forEach((r) => {
    counts[r.type] = r.count;
  });
  myReactions.forEach((type) => {
    counts[type] = (counts[type] || 0) + 1;
  });

  const toggle = (type) => {
    setMyReactions((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {reactionTypes.map((type) => {
        const count = counts[type] || 0;
        const active = myReactions.includes(type);
        return (
          <button
            key={type}
            onClick={() => toggle(type)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all active:scale-95",
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