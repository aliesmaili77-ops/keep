import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import VoicePlayer from "@/components/keep/VoicePlayer";
import ReactionBar from "@/components/keep/ReactionBar";
import CommentInput from "@/components/keep/CommentInput";
import { useCircles } from "@/hooks/useCircles";
import { useKeeps, useInvalidateKeeps } from "@/hooks/useKeeps";
import { useComments, useAddComment } from "@/hooks/useComments";
import { useReactions, useToggleReaction } from "@/hooks/useReactions";
import { formatKeepDate, isRTLText } from "@/lib/keepUtils";
import { ArrowLeft, Milestone, Trash2, Loader2 } from "lucide-react";

export default function KeepDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const invalidateKeeps = useInvalidateKeeps();

  const { data: circles } = useCircles();
  const { data: keeps, isLoading: keepsLoading } = useKeeps();
  const { data: comments, isLoading: commentsLoading } = useComments(id);
  const { data: reactions } = useReactions(id);
  const addComment = useAddComment();
  const toggleReaction = useToggleReaction();

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const keep = keeps?.find((k) => k.id === id);
  const circle = circles?.find((c) => c.id === keep?.circle_id);
  const circleMemberIds = circle?.member_user_ids || [];

  if (keepsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

  const displayName = keep.speaker_name || (keep.created_by_id === user?.id ? "You" : "Someone");
  const subtitle =
    keep.keep_type === "voice"
      ? null
      : keep.speaker_name && keep.created_by_id === user?.id
      ? "Kept by you"
      : null;
  const isMine = keep.created_by_id === user?.id;
  const rtl = isRTLText(keep.text);

  // Aggregate reactions by type
  const reactionCounts = {};
  const myReactionIds = {};
  (reactions || []).forEach((r) => {
    reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
    if (r.created_by_id === user?.id) {
      myReactionIds[r.reaction_type] = r.id;
    }
  });

  const handleToggleReaction = (type) => {
    toggleReaction.mutate(
      {
        keepId: id,
        circleId: keep.circle_id,
        type,
        circleMemberIds,
        existingId: myReactionIds[type],
      },
      {
        onSuccess: () => {
          // Only notify on add, not remove
          if (!myReactionIds[type]) {
            base44.functions
              .invoke("notifyKeepInteraction", {
                keep_id: id,
                interaction_type: "reaction",
              })
              .catch(() => {});
          }
        },
      }
    );
  };

  const handleAddComment = (text) => {
    addComment.mutate(
      {
        keepId: id,
        circleId: keep.circle_id,
        text,
        circleMemberIds,
        displayName: user?.full_name,
      },
      {
        onSuccess: () => {
          base44.functions
            .invoke("notifyKeepInteraction", {
              keep_id: id,
              interaction_type: "comment",
            })
            .catch(() => {});
        },
      }
    );
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.entities.Keep.delete(id);
      invalidateKeeps();
      navigate(-1);
    } catch (e) {
      console.error(e);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),12px)] pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {isMine && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-9 h-9 flex items-center justify-center -mr-2 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Delete Keep"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        )}
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
              <p className="text-lg font-medium text-foreground mb-1">{keep.title}</p>
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
            className="text-sm text-muted-foreground mt-3"
            dir={isRTLText(keep.context) ? "rtl" : "ltr"}
            style={isRTLText(keep.context) ? { textAlign: "right" } : undefined}
          >
            {keep.context}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          {circle?.name && <span className="font-medium">{circle.name}</span>}
          {circle?.name && keep.happened_at && <span aria-hidden="true">·</span>}
          {keep.happened_at && <span>{formatKeepDate(keep.happened_at)}</span>}
        </div>

        {/* Reactions */}
        <ReactionBar
          counts={reactionCounts}
          myReactionIds={myReactionIds}
          onToggle={handleToggleReaction}
          disabled={toggleReaction.isPending}
        />

        {/* Comments */}
        <div className="border-t border-border/40 mt-6 pt-4">
          <p className="text-sm font-semibold mb-3">
            Comments ({(comments || []).length})
          </p>
          <div className="space-y-3">
            {commentsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {(comments || []).map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <Avatar name={c.created_by_id === user?.id ? "You" : "Member"} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">
                          {c.created_by_id === user?.id ? "You" : "Member"}
                        </span>{" "}
                        <span className="text-muted-foreground">{c.text}</span>
                      </p>
                    </div>
                  </div>
                ))}
                {(comments || []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No comments yet. Start the conversation.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comment input */}
      <CommentInput onAdd={handleAddComment} disabled={addComment.isPending} />

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="w-full max-w-md bg-card rounded-t-3xl p-5 pb-[calc(max(env(safe-area-inset-bottom),20px)+16px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">Delete this Keep?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This can't be undone. The Keep will be permanently removed from the Circle.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full rounded-full bg-destructive text-destructive-foreground py-3 text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full rounded-full bg-muted py-3 text-sm font-medium active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}