import React from "react";
import { useNavigate } from "react-router-dom";
import KeepCard from "@/components/keep/KeepCard";
import { mockKeeps, resurfacedKeep, formatKeepDate } from "@/lib/mockData";
import { Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">Keeps</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Recent memories from all your Circles</p>
      </div>

      {/* Resurfacing */}
      <button
        onClick={() => navigate(`/keep/${resurfacedKeep.id}`)}
        className="mx-5 mt-3 flex items-center gap-3 w-[calc(100%-2.5rem)] px-4 py-3 rounded-2xl backdrop-blur-xl bg-primary/10 border border-primary/20 text-left hover:bg-primary/15 transition-colors shadow-sm"
        aria-label="Remember this? An old keep from The Boys"
      >
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-primary">Remember this?</p>
          <p className="text-sm text-muted-foreground truncate">
            "{resurfacedKeep.text}" — {resurfacedKeep.circle_name}, {formatKeepDate(resurfacedKeep.happened_at)}
          </p>
        </div>
      </button>

      {/* Feed */}
      <div className="mt-2">
        {mockKeeps.map((keep) => (
          <KeepCard
            key={keep.id}
            keep={keep}
            onClick={() => navigate(`/keep/${keep.id}`)}
          />
        ))}
      </div>
    </div>
  );
}