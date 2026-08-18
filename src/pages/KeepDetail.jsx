import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import VoicePlayer from "@/components/keep/VoicePlayer";
import ReactionBar from "@/components/keep/ReactionBar";
import CommentInput from "@/components/keep/CommentInput";
import { mockKeeps, formatKeepDate } from "@/lib/mockData";
import { ArrowLeft, Milestone } from "lucide-react";

export default function KeepDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const keep = mockKeeps.find((k) => k.id === id);
  const [comments, setComments] = useState(keep?.comments || []);

  if (!keep) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-muted-foreground">This Keep couldn't be found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
          Back to feed
        </Button>
      </div>
    );
  }

  const displayName = keep.speaker_name || keep.kept_by;
  const subtitle =
    keep.keep_type === "voice"
      ? `Remembered by ${keep.kept_by}`
      : keep.speaker_name && keep.speaker_name !== keep.kept_by
      ? `Kept by ${keep.kept_by}`
      : null;

  const handleAddComment = (text) => {
    setComments((prev) => [...prev, { user: "You", text }]);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center px-5 pt-[max(env(safe-area-inset-top),12px)] pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-2 pb-4">
        {/* Author */}
        <div className="flex items-center gap-2.5 mb-4">
          <Avatar name={displayName} size={40} />
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
            className="text-xl leading-snug text-foreground"
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
              <p className="text-lg font-medium text-foreground mb-1">{keep.title}</p>
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
            className="text-sm text-muted-foreground mt-3"
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
        <ReactionBar reactions={keep.reactions} />

        {/* Comments */}
        <div className="border-t border-border/40 mt-6 pt-4">
          <p className="text-sm font-semibold mb-3">Comments ({comments.length})</p>
          <div className="space-y-3">
            {comments.map((c, i) => (
              <div key={i} className="flex gap-2.5">
                <Avatar name={c.user} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{c.user}</span>{" "}
                    <span className="text-muted-foreground">{c.text}</span>
                  </p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Start the conversation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Comment input */}
      <CommentInput onAdd={handleAddComment} />
    </div>
  );
}