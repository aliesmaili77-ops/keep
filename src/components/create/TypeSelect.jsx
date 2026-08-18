import React from "react";
import { Quote, BookOpen, Mic, ChevronRight } from "lucide-react";

const types = [
  {
    type: "quote",
    icon: Quote,
    title: "Someone said something",
    subtitle: "Capture a funny or meaningful quote",
  },
  {
    type: "memory",
    icon: BookOpen,
    title: "Something happened",
    subtitle: "Preserve a moment or story",
  },
  {
    type: "voice",
    icon: Mic,
    title: "Record a voice note",
    subtitle: "Save a voice memo or conversation",
  },
];

export default function TypeSelect({ onSelect }) {
  return (
    <div className="px-5 pt-6 pb-32 flex-1">
      <h2 className="text-xl font-semibold tracking-tight">What do you want to keep?</h2>
      <p className="text-muted-foreground text-sm mt-1">Choose one to get started</p>

      <div className="mt-6 space-y-3">
        {types.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.type}
              onClick={() => onSelect(t.type)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-[0.98] text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[15px]">{t.title}</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">{t.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}