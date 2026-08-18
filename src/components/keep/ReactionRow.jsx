import React from "react";
import { reactionEmojis } from "@/lib/mockData";
import { MessageCircle } from "lucide-react";

export default function ReactionRow({ reactions = [], commentCount = 0 }) {
  if (!reactions.length && !commentCount) return null;
  return (
    <div className="flex items-center gap-2 mt-3">
      {reactions.map((r) => (
        <button
          key={r.type}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/60 hover:bg-muted transition-colors"
          aria-label={`${r.count} ${r.type} reactions: ${r.users?.join(", ")}`}
        >
          <span className="text-xs">{reactionEmojis[r.type]}</span>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">{r.count}</span>
        </button>
      ))}
      {commentCount > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 text-muted-foreground">
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="text-xs font-medium tabular-nums">{commentCount}</span>
        </div>
      )}
    </div>
  );
}