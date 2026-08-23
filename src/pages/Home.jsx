import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import KeepCard from "@/components/keep/KeepCard";
import { useKeeps } from "@/hooks/useKeeps";
import { useCircles } from "@/hooks/useCircles";
import EmptyState from "@/components/common/EmptyState";
import NotificationsSection from "@/components/notifications/NotificationsSection";
import { Sparkles, Loader2, Bookmark } from "lucide-react";
import { formatKeepDate } from "@/lib/keepUtils";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: keeps, isLoading } = useKeeps();
  const { data: circles } = useCircles();

  const circleMap = {};
  circles?.forEach((c) => {
    circleMap[c.id] = c.name;
  });

  const resurfaced = keeps && keeps.length > 1 ? keeps[keeps.length - 1] : null;

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">Keeps</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Recent memories from all your Circles
        </p>
      </div>

      <NotificationsSection />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !keeps || keeps.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Keeps yet"
          description="Capture a quote, a story, or a moment you don't want to forget."
        />
      ) : (
        <>
          {resurfaced && (
            <button
              onClick={() => navigate(`/keep/${resurfaced.id}`)}
              className="mx-5 mt-3 flex items-center gap-3 w-[calc(100%-2.5rem)] px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-left hover:bg-primary/15 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-primary">Remember this?</p>
                <p className="text-sm text-muted-foreground truncate">
                  "{resurfaced.text}" — {circleMap[resurfaced.circle_id] || "Circle"},{" "}
                  {formatKeepDate(resurfaced.happened_at)}
                </p>
              </div>
            </button>
          )}

          <div className="mt-2">
            {keeps.map((keep) => (
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