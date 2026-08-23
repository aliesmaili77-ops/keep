import React from "react";
import Avatar from "@/components/Avatar";
import VoicePlayer from "@/components/keep/VoicePlayer";
import ReactionRow from "@/components/keep/ReactionRow";
import { formatKeepDate, isRTLText } from "@/lib/keepUtils";
import { Milestone } from "lucide-react";
import MotionCard from "@/components/common/MotionCard";

export default function KeepCard({ keep, circleName, currentUserId, onClick }) {
  const displayName =
    keep.speaker_name || (keep.created_by_id === currentUserId ? "You" : "Someone");
  const rtl = isRTLText(keep.text);
  const showKeptByYou = keep.created_by_id === currentUserId && keep.speaker_name;

  return (
    <MotionCard
      onClick={onClick}
      className="px-5 py-5 border-b border-border/50 cursor-pointer hover:bg-muted/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar name={displayName} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-medium leading-tight truncate">{displayName}</p>
          {showKeptByYou && (
            <p className="text-xs text-muted-foreground leading-tight truncate">Kept by you</p>
          )}
        </div>
      </div>

      {/* Content by type */}
      {keep.keep_type === "quote" && (
        <blockquote
          className="text-lg leading-snug text-foreground"
          dir={rtl ? "rtl" : "ltr"}
          style={rtl ? { textAlign: "right" } : undefined}
        >
          {keep.text}
        </blockquote>
      )}

      {keep.keep_type === "memory" && (
        <div>
          {keep.milestone_tag && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
              <Milestone className="w-3 h-3" />
              {keep.milestone_tag}
            </div>
          )}
          {keep.title && (
            <p className="text-base font-medium text-foreground mb-1">{keep.title}</p>
          )}
          <p className="text-[15px] leading-relaxed text-foreground">{keep.text}</p>
        </div>
      )}

      {keep.keep_type === "voice" && (
        <div>
          {keep.text && <p className="text-sm text-muted-foreground mb-2">{keep.text}</p>}
          <VoicePlayer duration={keep.duration || 0} />
        </div>
      )}

      {/* Context */}
      {keep.context && (
        <p
          className="text-sm text-muted-foreground mt-2"
          dir={isRTLText(keep.context) ? "rtl" : "ltr"}
          style={isRTLText(keep.context) ? { textAlign: "right" } : undefined}
        >
          {keep.context}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
        {circleName && <span className="font-medium">{circleName}</span>}
        {circleName && keep.happened_at && <span aria-hidden="true">·</span>}
        {keep.happened_at && <span>{formatKeepDate(keep.happened_at)}</span>}
      </div>

      {/* Reactions */}
      <ReactionRow reactions={[]} commentCount={0} />
    </MotionCard>
  );
}