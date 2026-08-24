import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useCircles, useInvalidateCircles } from "@/hooks/useCircles";
import { useCircleMembers, useInvalidateCircleMembers } from "@/hooks/useCircleMembers";
import { useKeeps, useInvalidateKeeps } from "@/hooks/useKeeps";
import PullToRefresh from "@/components/common/PullToRefresh";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import KeepCard from "@/components/keep/KeepCard";
import EmptyState from "@/components/common/EmptyState";
import InviteSheet from "@/components/circles/InviteSheet";
import { ArrowLeft, Crown, Shield, Trash2, UserPlus, Loader2, Users } from "lucide-react";

const typeLabels = {
  close_friends: "Close friends",
  partner: "Partner",
  family: "Family",
  other: "Other",
};

export default function CircleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: circles } = useCircles();
  const { data: members, isLoading: membersLoading } = useCircleMembers(id);
  const { data: keeps, isLoading: keepsLoading } = useKeeps(id);
  const invalidateCircles = useInvalidateCircles();
  const invalidateMembers = useInvalidateCircleMembers();
  const invalidateKeeps = useInvalidateKeeps();
  const [busy, setBusy] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const circle = circles?.find((c) => c.id === id);
  const isAdmin = circle?.admin_user_ids?.includes(user?.id);

  if (!circle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-muted-foreground">Circle not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/circles")}>
          Back to Circles
        </Button>
      </div>
    );
  }

  const handleRemoveMember = async (member) => {
    if (member.role === "owner") return;
    setBusy(member.id);
    try {
      await base44.entities.CircleMember.update(member.id, { membership_status: "left" });
      await base44.entities.Circle.update(circle.id, {
        member_user_ids: (circle.member_user_ids || []).filter((uid) => uid !== member.user_id),
        admin_user_ids: (circle.admin_user_ids || []).filter((uid) => uid !== member.user_id),
      });
      invalidateCircles();
      invalidateMembers();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const handleToggleAdmin = async (member) => {
    setBusy(member.id);
    try {
      const isCurrentlyAdmin = member.role === "admin";
      const newRole = isCurrentlyAdmin ? "member" : "admin";
      await base44.entities.CircleMember.update(member.id, { role: newRole });
      const adminIds = circle.admin_user_ids || [];
      const newAdminIds = isCurrentlyAdmin
        ? adminIds.filter((uid) => uid !== member.user_id)
        : [...adminIds, member.user_id];
      await base44.entities.Circle.update(circle.id, { admin_user_ids: newAdminIds });
      invalidateCircles();
      invalidateMembers();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Circle info */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <Avatar name={circle.name} size={56} className="bg-primary/15 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">{circle.name}</h1>
            <p className="text-sm text-muted-foreground">{typeLabels[circle.circle_type]}</p>
          </div>
        </div>
        {circle.description && (
          <p className="text-sm text-muted-foreground mt-3">{circle.description}</p>
        )}
      </div>

      {/* Members */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Members
          </p>
          {isAdmin && (
            <button
              onClick={() => setInviteOpen(true)}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invite
            </button>
          )}
        </div>
        <div className="glass rounded-2xl overflow-hidden">
          {membersLoading ? (
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : !members || members.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No members</p>
          ) : (
            members.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 px-3.5 py-3 ${
                  i > 0 ? "border-t border-foreground/5" : ""
                }`}
              >
                <Avatar name={m.display_name || "Member"} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {m.display_name || "Member"}
                  </p>
                  <div className="flex items-center gap-1">
                    {m.role === "owner" && <Crown className="w-3 h-3 text-primary" />}
                    {m.role === "admin" && <Shield className="w-3 h-3 text-primary" />}
                    <span className="text-xs text-muted-foreground capitalize">{m.role}</span>
                  </div>
                </div>
                {isAdmin && m.role !== "owner" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleAdmin(m)}
                      disabled={busy === m.id}
                      className="text-xs px-2.5 py-1.5 rounded-full hover:bg-foreground/5 text-muted-foreground"
                    >
                      {m.role === "admin" ? "Demote" : "Promote"}
                    </button>
                    <button
                      onClick={() => handleRemoveMember(m)}
                      disabled={busy === m.id}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Keeps in this circle */}
      <PullToRefresh onRefresh={invalidateKeeps}>
      <div className="mt-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 mb-2">
          Keeps
        </p>
        {keepsLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : !keeps || keeps.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Keeps yet"
            description="Be the first to keep a moment in this Circle."
          />
        ) : (
          keeps.map((keep) => (
            <KeepCard
              key={keep.id}
              keep={keep}
              circleName={circle.name}
              currentUserId={user?.id}
              onClick={() => navigate(`/keep/${keep.id}`)}
            />
          ))
        )}
      </div>
      </PullToRefresh>
      <InviteSheet open={inviteOpen} onOpenChange={setInviteOpen} circle={circle} />
    </div>
  );
}