import React from "react";
import { useNavigate } from "react-router-dom";
import { Quote, BookOpen, Mic } from "lucide-react";
import { mockKeeps } from "@/lib/mockData";

const typeIcon = {
  quote: Quote,
  memory: BookOpen,
  voice: Mic,
};

export default function KeepsGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-2 px-4 mt-4">
      {mockKeeps.map((keep) => {
        const Icon = typeIcon[keep.keep_type] || Quote;
        return (
          <button
            key={keep.id}
            onClick={() => navigate(`/keep/${keep.id}`)}
            className="rounded-xl bg-card border border-border/60 p-3 text-left hover:bg-muted/30 transition-colors flex flex-col min-h-[120px]"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                {keep.keep_type}
              </span>
            </div>
            <p className="text-xs leading-snug line-clamp-3 flex-1 text-foreground/80">
              {keep.text}
            </p>
            <p className="text-[10px] text-muted-foreground mt-2 truncate">{keep.circle_name}</p>
          </button>
        );
      })}
    </div>
  );
}