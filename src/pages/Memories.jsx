import React from "react";
import KeepCard from "@/components/keep/KeepCard";
import { mockKeeps, resurfacedKeep, formatKeepDate } from "@/lib/mockData";
import { Sparkles } from "lucide-react";

export default function Memories() {
  // For the mockup, resurface older keeps (sorted by oldest first)
  const olderKeeps = [...mockKeeps].reverse();

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">Memories</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Keeps worth revisiting</p>
      </div>

      {/* Featured resurfacing */}
      <div className="mx-5 mt-3 rounded-full bg-primary/5 border border-primary/20 px-4 py-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Remember this?</p>
        </div>
        <blockquote className="text-base leading-snug text-foreground">
          {resurfacedKeep.text}
        </blockquote>
        <p className="text-xs text-muted-foreground mt-2">
          {resurfacedKeep.speaker_name} · {resurfacedKeep.circle_name} · {formatKeepDate(resurfacedKeep.happened_at)}
        </p>
      </div>

      {/* Older keeps */}
      <div className="mt-2">
        {olderKeeps.map((keep) => (
          <KeepCard key={keep.id} keep={keep} />
        ))}
      </div>
    </div>
  );
}