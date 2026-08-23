import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { useCircles } from "@/hooks/useCircles";
import EmptyState from "@/components/common/EmptyState";
import CreateCircleSheet from "@/components/circles/CreateCircleSheet";
import InviteSheet from "@/components/circles/InviteSheet";
import { Users, Plus, UserPlus, Loader2 } from "lucide-react";

const typeLabels = {
  close_friends: "Close friends",
  partner: "Partner",
  family: "Family",
  other: "Other",
};

export default function Circles() {
  const navigate = useNavigate();
  const { data: circles, isLoading } = useCircles();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Circles</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Your private spaces</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInviteOpen(true)}
            className="w-9 h-9 rounded-full glass-tight flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Add Friends"
          >
            <UserPlus className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => setSheetOpen(true)}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Create Circle"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !circles || circles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Circles yet"
          description="Create a Circle to start keeping moments with your closest people."
          action={
            <button
              onClick={() => setSheetOpen(true)}
              className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium active:scale-95 transition-transform"
            >
              Create a Circle
            </button>
          }
        />
      ) : (
        <div className="mt-2">
          {circles.map((circle) => (
            <button
              key={circle.id}
              onClick={() => navigate(`/circle/${circle.id}`)}
              className="flex items-center gap-3 w-full px-5 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors text-left"
            >
              <Avatar name={circle.name} size={44} className="bg-primary/15 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium truncate">{circle.name}</p>
                <p className="text-xs text-muted-foreground">
                  {typeLabels[circle.circle_type]} · {(circle.member_user_ids || []).length} members
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <CreateCircleSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      <InviteSheet open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}