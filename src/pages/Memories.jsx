import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import KeepCard from "@/components/keep/KeepCard";
import { useKeeps } from "@/hooks/useKeeps";
import { useCircles } from "@/hooks/useCircles";
import EmptyState from "@/components/common/EmptyState";
import { Sparkles, Loader2, History } from "lucide-react";
import { formatKeepDate } from "@/lib/keepUtils";

export default function Memories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: keeps, isLoading } = useKeeps();
  const { data: circles } = useCircles();

  const circleMap = {};
  circles?.forEach((c) => {
    circleMap[c.id] = c.name;
  });

  const olderKeeps = keeps ? [...keeps].reverse() : [];
  const featured = olderKeeps[0];

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">Memories</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Keeps worth revisiting</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !keeps || keeps.length === 0 ? (
        <EmptyState
          icon={History}
          title="No memories yet"
          description="Your past Keeps will resurface here over time."
        />
      ) : (
        <>
          {featured && (
            <div className="mx-5 mt-3 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Remember this?
                </p>
              </div>
              <blockquote className="text-base leading-snug text-foreground">
                {featured.text}
              </blockquote>
              <p className="text-xs text-muted-foreground mt-2">
                {featured.speaker_name || ""} · {circleMap[featured.circle_id] || ""} ·{" "}
                {formatKeepDate(featured.happened_at)}
              </p>
            </div>
          )}

          <div className="mt-2">
            {olderKeeps.map((keep) => (
              <KeepCard
                key={keep.id}
                keep={keep}
                circleName={circleMap[keep.circle_id]}
                currentUserId={user?.id}
                onClick={() => navigate(`/keep/${keep.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}