import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useInvalidateCircles } from "@/hooks/useCircles";
import { useInvalidateCircleMembers } from "@/hooks/useCircleMembers";
import { invalidatePeople } from "@/hooks/usePeople";
import { useQueryClient } from "@tanstack/react-query";
import InviteOptions from "@/components/circles/InviteOptions";
import {
  Loader2,
  ArrowLeft,
  X,
  Plus,
  CheckCircle2,
  Mail,
  Link as LinkIcon,
} from "lucide-react";

const typeOptions = [
  { value: "close_friends", label: "Close friends" },
  { value: "partner", label: "Partner" },
  { value: "family", label: "Family" },
  { value: "other", label: "Other" },
];

export default function InviteSheet({ open, onOpenChange, circle: fixedCircle }) {
  const { user } = useAuth();
  const invalidateCircles = useInvalidateCircles();
  const invalidateMembers = useInvalidateCircleMembers();
  const queryClient = useQueryClient();

  // Flow state (no fixedCircle): "people" → "circle" → "done"
  const [step, setStep] = useState("people");
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [circleName, setCircleName] = useState("");
  const [circleType, setCircleType] = useState("close_friends");
  const [creating, setCreating] = useState(false);
  const [newCircle, setNewCircle] = useState(null);

  // Invitation for link/code/QR sharing
  const [invitation, setInvitation] = useState(null);
  const [invitationLoading, setInvitationLoading] = useState(false);

  const circle = fixedCircle || newCircle;

  useEffect(() => {
    if (open && circle && !invitation) {
      createInvitation();
    }
    if (!open) {
      reset();
    }
  }, [open, circle]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setStep("people");
    setEmails([]);
    setEmailInput("");
    setCircleName("");
    setCircleType("close_friends");
    setNewCircle(null);
    setInvitation(null);
  };

  const createInvitation = async () => {
    setInvitationLoading(true);
    try {
      const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      const inv = await base44.entities.Invitation.create({
        circle_id: circle.id,
        invited_by: user.id,
        invite_email: "",
        invite_token: token,
        status: "pending",
        expires_at: expiresAt.toISOString(),
        circle_member_ids: circle.member_user_ids || [],
        circle_admin_ids: circle.admin_user_ids || [],
      });
      setInvitation(inv);
    } catch (e) {
      console.error(e);
    } finally {
      setInvitationLoading(false);
    }
  };

  const handleAddEmail = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || emails.includes(trimmed)) return;
    setEmails([...emails, trimmed]);
    setEmailInput("");
  };

  const handleRemoveEmail = (em) => {
    setEmails(emails.filter((e) => e !== em));
  };

  const handleCreateCircle = async () => {
    if (!circleName.trim()) return;
    setCreating(true);
    try {
      const created = await base44.entities.Circle.create({
        name: circleName.trim(),
        circle_type: circleType,
        member_user_ids: [user.id],
        admin_user_ids: [user.id],
        status: "active",
      });

      await base44.entities.CircleMember.create({
        circle_id: created.id,
        user_id: user.id,
        display_name: user.full_name || user.email?.split("@")[0] || "You",
        role: "owner",
        membership_status: "active",
        joined_at: new Date().toISOString(),
        circle_member_ids: [user.id],
        circle_admin_ids: [user.id],
      });

      const inviterName = user.full_name || user.email?.split("@")[0] || "Someone";
      await Promise.all(
        emails.map(async (em) => {
          const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);
          const inviteLink = `${window.location.origin}/invite?token=${token}`;
          await base44.entities.Invitation.create({
            circle_id: created.id,
            invited_by: user.id,
            invite_email: em,
            invite_token: token,
            status: "pending",
            expires_at: expiresAt.toISOString(),
            circle_member_ids: [user.id],
            circle_admin_ids: [user.id],
          });
          await base44.functions.invoke("sendInviteEmail", {
            to: em,
            circleName: created.name,
            inviteLink,
            inviterName,
          });
        })
      );

      invalidateCircles();
      invalidateMembers();
      invalidatePeople(queryClient);
      setNewCircle(created);
      setStep("done");
    } catch (e) {
      console.error("Failed to create circle", e);
    } finally {
      setCreating(false);
    }
  };

  // ---- Fixed circle (CircleDetail) — existing flow ----
  if (fixedCircle) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Invite to {circle?.name}</SheetTitle>
          </SheetHeader>
          {invitationLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : invitation ? (
            <div className="mt-5">
              <InviteOptions invitation={invitation} circle={circle} />
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              Failed to create invitation
            </p>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  // ---- No fixed circle — new flow: add people → create circle → done ----
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {step === "circle" && (
              <button
                onClick={() => setStep("people")}
                className="w-7 h-7 -ml-1 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {step === "people" && "Add People"}
            {step === "circle" && "Create Circle"}
            {step === "done" && "All Set!"}
          </SheetTitle>
        </SheetHeader>

        {step === "people" && (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Add people by email. You'll create a Circle with them next.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 glass-tight rounded-full px-4 py-2.5">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                  placeholder="email@example.com"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={handleAddEmail}
                disabled={!emailInput.trim()}
                className="shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                aria-label="Add email"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emails.map((em) => (
                  <span
                    key={em}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-sm px-3 py-1.5"
                  >
                    {em}
                    <button
                      onClick={() => handleRemoveEmail(em)}
                      className="active:scale-90 transition-transform"
                      aria-label={`Remove ${em}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => setStep("circle")}
              className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium active:scale-95 transition-transform"
            >
              {emails.length > 0
                ? `Continue with ${emails.length} ${emails.length === 1 ? "person" : "people"}`
                : "Continue"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <button
              onClick={() => setStep("circle")}
              className="w-full glass-tight rounded-2xl px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <LinkIcon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Share a link, code, or QR</p>
                <p className="text-xs text-muted-foreground">Create a Circle to get your share options</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 shrink-0" />
            </button>
          </div>
        )}

        {step === "circle" && (
          <div className="mt-5 space-y-4">
            {emails.length > 0 && (
              <div className="glass-tight rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Inviting {emails.length} {emails.length === 1 ? "person" : "people"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {emails.map((em) => (
                    <span key={em} className="text-xs text-muted-foreground">
                      {em}
                      {emails.indexOf(em) < emails.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Circle Name
              </label>
              <input
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
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
            <button
              onClick={handleCreateCircle}
              disabled={!circleName.trim() || creating}
              className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Circle & Send Invites"
              )}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="mt-5 space-y-5">
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{circle?.name} created!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {emails.length > 0
                  ? `Invitations sent to ${emails.length} ${emails.length === 1 ? "person" : "people"}.`
                  : "Share the link below to invite people."}
              </p>
            </div>

            {invitation && <InviteOptions invitation={invitation} circle={circle} />}

            <button
              onClick={() => onOpenChange(false)}
              className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium active:scale-95 transition-transform"
            >
              Done
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}