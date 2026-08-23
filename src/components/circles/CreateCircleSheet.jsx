import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { usePeople, invalidatePeople } from "@/hooks/usePeople";
import { useInvalidateCircles } from "@/hooks/useCircles";
import { useInvalidateCircleMembers } from "@/hooks/useCircleMembers";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Avatar from "@/components/Avatar";
import { Loader2, Check, UserPlus, Users } from "lucide-react";

const typeOptions = [
  { value: "close_friends", label: "Close friends" },
  { value: "partner", label: "Partner" },
  { value: "family", label: "Family" },
  { value: "other", label: "Other" },
];

export default function CreateCircleSheet({ open, onOpenChange, onAddPeople }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: people, isLoading } = usePeople();
  const invalidateCircles = useInvalidateCircles();
  const invalidateMembers = useInvalidateCircleMembers();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [circleType, setCircleType] = useState("close_friends");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);

  const visiblePeople = (people || []).filter((p) => p.user_id !== user?.id);

  const togglePerson = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const reset = () => {
    setName("");
    setCircleType("close_friends");
    setSelectedIds(new Set());
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const selectedPeople = visiblePeople.filter((p) => selectedIds.has(p.user_id));
      const memberIds = [user.id, ...selectedPeople.map((p) => p.user_id)];

      const circle = await base44.entities.Circle.create({
        name: name.trim(),
        circle_type: circleType,
        member_user_ids: memberIds,
        admin_user_ids: [user.id],
        status: "active",
      });

      // Add self as owner
      await base44.entities.CircleMember.create({
        circle_id: circle.id,
        user_id: user.id,
        display_name: user.full_name || user.email?.split("@")[0] || "You",
        role: "owner",
        membership_status: "active",
        joined_at: new Date().toISOString(),
        circle_member_ids: memberIds,
        circle_admin_ids: [user.id],
      });

      // Add selected people as members
      await Promise.all(
        selectedPeople.map((p) =>
          base44.entities.CircleMember.create({
            circle_id: circle.id,
            user_id: p.user_id,
            display_name: p.display_name || "Member",
            role: "member",
            membership_status: "active",
            joined_at: new Date().toISOString(),
            circle_member_ids: memberIds,
            circle_admin_ids: [user.id],
          })
        )
      );

      invalidateCircles();
      invalidateMembers();
      invalidatePeople(queryClient);
      reset();
      onOpenChange(false);
      navigate(`/circle/${circle.id}`);
    } catch (e) {
      console.error("Failed to create circle", e);
    } finally {
      setSaving(false);
    }
  };

  // ---- No people: allow empty circle, prompt to invite afterward ----
  if (!isLoading && visiblePeople.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Create a Circle</SheetTitle>
          </SheetHeader>
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Boys"
                className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Type
              </label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCircleType(opt.value)}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                      circleType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-card text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-tight rounded-2xl p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium">No connections yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                You can create this Circle now and invite people to join it afterward.
              </p>
              <button
                onClick={() => {
                  onOpenChange(false);
                  onAddPeople?.();
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium active:scale-95 transition-transform"
              >
                <UserPlus className="w-4 h-4" />
                Invite People
              </button>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!name.trim() || saving}
              onClick={handleCreate}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Circle"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ---- Normal create flow with people selector ----
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Create a Circle</SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Boys"
              className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Type
            </label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCircleType(opt.value)}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                    circleType === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-card text-muted-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* People selector */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Add People ({selectedIds.size} selected)
            </label>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="mt-1.5 glass-tight rounded-2xl max-h-52 overflow-y-auto">
                {visiblePeople.map((person, idx) => {
                  const selected = selectedIds.has(person.user_id);
                  return (
                    <button
                      key={person.user_id}
                      onClick={() => togglePerson(person.user_id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        idx > 0 ? "border-t border-border/40" : ""
                      } ${selected ? "bg-primary/5" : ""}`}
                    >
                      <Avatar
                        name={person.display_name || "Person"}
                        size={36}
                        className="bg-primary/15 text-primary"
                      />
                      <span className="flex-1 text-sm font-medium truncate">
                        {person.display_name || "Unknown"}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected
                            ? "bg-primary border-primary"
                            : "border-border/60"
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!name.trim() || saving}
            onClick={handleCreate}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Circle"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}