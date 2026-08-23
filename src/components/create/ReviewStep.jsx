import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCircles } from "@/hooks/useCircles";
import { Check, Calendar, Tag, Plus, Mic, Quote, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const optionalFields = {
  quote: [{ key: "happened_at", label: "When", icon: Calendar, type: "date" }],
  memory: [
    { key: "happened_at", label: "When", icon: Calendar, type: "date" },
    { key: "milestone_tag", label: "Milestone", icon: Tag, type: "text", placeholder: "e.g. first trip" },
  ],
  voice: [{ key: "happened_at", label: "When", icon: Calendar, type: "date" }],
};

const typeMeta = {
  quote: { icon: Quote, label: "Quote" },
  memory: { icon: BookOpen, label: "Memory" },
  voice: { icon: Mic, label: "Voice note" },
};

export default function ReviewStep({ keepType, data, onKeep, saving }) {
  const { data: circles, isLoading } = useCircles();
  const [circleId, setCircleId] = useState(data.circle_id || "");
  const [fields, setFields] = useState({
    happened_at: data.happened_at || "",
    milestone_tag: data.milestone_tag || "",
  });
  const [activeChips, setActiveChips] = useState({});

  const selectedCircle = circles?.find((c) => c.id === circleId);
  const canKeep = circleId !== "" && !saving;
  const optionals = optionalFields[keepType] || [];
  const TypeIcon = typeMeta[keepType]?.icon;

  const toggleChip = (key) => {
    setActiveChips((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleKeep = () => {
    onKeep({
      circle_id: circleId,
      circle_member_ids: selectedCircle?.member_user_ids || [],
      ...fields,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-6 flex-1 overflow-y-auto pb-4">
        <h2 className="text-xl font-semibold tracking-tight">One last look</h2>
        <p className="text-muted-foreground text-sm mt-1">Review and pick where to keep it</p>

        {/* Preview card */}
        <div className="mt-5 rounded-2xl bg-card border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {TypeIcon && <TypeIcon className="w-4 h-4 text-primary" />}
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {typeMeta[keepType]?.label}
            </span>
          </div>

          {keepType === "memory" && data.title && (
            <p className="font-semibold text-[15px] mb-1">{data.title}</p>
          )}

          {data.text && <p className="text-[15px] leading-relaxed">{data.text}</p>}

          {data.context && (
            <p className="text-xs text-muted-foreground mt-3 italic">{data.context}</p>
          )}

          {data.speaker_name && (
            <p className="text-xs text-muted-foreground mt-2">— {data.speaker_name}</p>
          )}
        </div>

        {/* Circle selector */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Post to Circle <span className="text-destructive">*</span>
          </p>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : !circles || circles.length === 0 ? (
            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">You need a Circle first</p>
              <Link to="/circles" className="text-sm text-primary font-medium mt-1 inline-block">
                Create a Circle
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {circles.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCircleId(c.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
                    circleId === c.id
                      ? "border-primary bg-primary/5"
                      : "border-border/60 bg-card hover:bg-muted/30"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(c.member_user_ids || []).length} members
                    </p>
                  </div>
                  {circleId === c.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Optional detail chips */}
        {optionals.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Optional details
            </p>
            <div className="flex flex-wrap gap-2">
              {optionals.map((f) => {
                const Icon = f.icon;
                const active = activeChips[f.key] || fields[f.key];
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleChip(f.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-card text-muted-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {f.label}
                    {!active && <Plus className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>

            {/* Expanded inputs */}
            <div className="mt-3 space-y-2">
              {optionals.map((f) => {
                const active = activeChips[f.key] || fields[f.key];
                if (!active) return null;
                return (
                  <input
                    key={f.key}
                    type={f.type}
                    value={fields[f.key]}
                    onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder || ""}
                    className="w-full rounded-full border border-border/60 bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 px-5 pb-[calc(max(env(safe-area-inset-bottom),16px)+72px)] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Button className="w-full" size="lg" disabled={!canKeep} onClick={handleKeep}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Keep it"}
        </Button>
        {!canKeep && !saving && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Pick a Circle to keep this
          </p>
        )}
      </div>
    </div>
  );
}