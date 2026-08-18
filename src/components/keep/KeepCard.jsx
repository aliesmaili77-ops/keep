import React from "react";
import Avatar from "@/components/Avatar";
import VoicePlayer from "@/components/keep/VoicePlayer";
import ReactionRow from "@/components/keep/ReactionRow";
import { formatKeepDate } from "@/lib/mockData";
import { Milestone } from "lucide-react";

export default function KeepCard({ keep }) {
  const displayName = keep.speaker_name || keep.kept_by;
  const subtitle =
    keep.keep_type === "voice"
      ? `Remembered by ${keep.kept_by}`
      : keep.speaker_name && keep.speaker_name !== keep.kept_by
      ? `Kept by ${keep.kept_by}`
      : null;

  return (
    <article className="px-5 py-5 border-b border-border/50">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar name={displayName} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-medium leading-tight truncate">{displayName}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-tight truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content by type */}
      {keep.keep_type === "quote" && (
        <blockquote
          className="text-lg leading-snug text-foreground"
          dir={keep.is_rtl ? "rtl" : "ltr"}
          style={keep.is_rtl ? { textAlign: "right" } : undefined}
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
          {keep.text && (
            <p className="text-sm text-muted-foreground mb-2">{keep.text}</p>
          )}
          <VoicePlayer duration={keep.duration} />
        </div>
      )}

      {/* Context */}
      {keep.context && (
        <p
          className="text-sm text-muted-foreground mt-2"
          dir={keep.is_rtl ? "rtl" : "ltr"}
          style={keep.is_rtl ? { textAlign: "right" } : undefined}
        >
          {keep.context}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
        <span className="font-medium">{keep.circle_name}</span>
        <span aria-hidden="true">·</span>
        <span>{formatKeepDate(keep.happened_at)}</span>
      </div>

      {/* Reactions */}
      <ReactionRow reactions={keep.reactions} commentCount={keep.comments?.length || 0} />

      {/* Comments preview */}
      {keep.comments?.length > 0 && (
        <div className="mt-3 pl-3 border-l-2 border-border/60 space-y-1.5">
          {keep.comments.map((c, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{c.user}</span>{" "}
              {c.text}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}