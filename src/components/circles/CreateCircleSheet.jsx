import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useInvalidateCircles } from "@/hooks/useCircles";
import { useInvalidateCircleMembers } from "@/hooks/useCircleMembers";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

const typeOptions = [
  { value: "close_friends", label: "Close friends" },
  { value: "partner", label: "Partner" },
  { value: "family", label: "Family" },
  { value: "other", label: "Other" },
];

export default function CreateCircleSheet({ open, onOpenChange }) {
  const { user } = useAuth();
  const invalidateCircles = useInvalidateCircles();
  const invalidateMembers = useInvalidateCircleMembers();
  const [name, setName] = useState("");
  const [circleType, setCircleType] = useState("close_friends");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const canCreate = name.trim().length > 0 && !saving;

  const reset = () => {
    setName("");
    setCircleType("close_friends");
    setDescription("");
  };

  const handleCreate = async () => {
    if (!canCreate) return;
    setSaving(true);
    try {
      const circle = await base44.entities.Circle.create({
        name: name.trim(),
        circle_type: circleType,
        description: description.trim(),
        member_user_ids: [user.id],
        admin_user_ids: [user.id],
        status: "active",
      });
      await base44.entities.CircleMember.create({
        circle_id: circle.id,
        user_id: user.id,
        display_name: user.full_name || user.email?.split("@")[0] || "You",
        role: "owner",
        membership_status: "active",
        joined_at: new Date().toISOString(),
        circle_member_ids: [user.id],
        circle_admin_ids: [user.id],
      });
      invalidateCircles();
      invalidateMembers();
      reset();
      onOpenChange(false);
    } catch (e) {
      console.error("Failed to create circle", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
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
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Description (optional)
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this Circle about?"
              className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button className="w-full" size="lg" disabled={!canCreate} onClick={handleCreate}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Circle"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}