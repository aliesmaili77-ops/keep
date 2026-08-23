import React from "react";
import { useNavigate } from "react-router-dom";
import { useKeeps } from "@/hooks/useKeeps";
import { useCircles } from "@/hooks/useCircles";
import EmptyState from "@/components/common/EmptyState";
import { Quote, BookOpen, Mic, Bookmark } from "lucide-react";
import MotionCard from "@/components/common/MotionCard";

const typeIcon = { quote: Quote, memory: BookOpen, voice: Mic };

export default function KeepsGrid() {
  const navigate = useNavigate();
  const { data: keeps, isLoading } = useKeeps();
  const { data: circles } = useCircles();

  const circleMap = {};
  circles?.forEach((c) => {
    circleMap[c.id] = c.name;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 px-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-tight rounded-3xl p-3.5 min-h-[120px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!keeps || keeps.length === 0) {
    return (
      <div className="px-4 mt-4">
        <EmptyState
          icon={Bookmark}
          title="No Keeps yet"
          description="Your kept moments will appear here."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 px-4 mt-4">
      {keeps.map((keep) => {
        const Icon = typeIcon[keep.keep_type] || Quote;
        return (
          <MotionCard
            key={keep.id}
            onClick={() => navigate(`/keep/${keep.id}`)}
            className="glass-tight rounded-3xl p-3.5 text-left flex flex-col min-h-[120px] cursor-pointer"
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
            <p className="text-[10px] text-muted-foreground mt-2 truncate">
              {circleMap[keep.circle_id]}
            </p>
          </MotionCard>
        );
      })}
    </div>
  );
}