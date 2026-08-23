import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import InviteOptions from "@/components/circles/InviteOptions";
import ShareOptions from "@/components/circles/ShareOptions";
import { Loader2, Mail, Check } from "lucide-react";

const genToken = () => crypto.randomUUID().replace(/-/g, "").slice(0, 16);

export default function InviteSheet({ open, onOpenChange, circle: fixedCircle }) {
  const { user } = useAuth();
  const [invitation, setInvitation] = useState(null);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (open && !invitation) {
      createInvitation();
    }
    if (!open) {
      setInvitation(null);
      setEmail("");
      setEmailSent(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const createInvitation = async () => {
    setInvitationLoading(true);
    try {
      const token = genToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      const inv = await base44.entities.Invitation.create({
        circle_id: fixedCircle ? fixedCircle.id : null,
        invited_by: user.id,
        invite_email: "",
        invite_token: token,
        status: "pending",
        expires_at: expiresAt.toISOString(),
        circle_member_ids: fixedCircle ? fixedCircle.member_user_ids : [user.id],
        circle_admin_ids: fixedCircle ? fixedCircle.admin_user_ids : [user.id],
      });
      setInvitation(inv);
    } catch (e) {
      console.error(e);
    } finally {
      setInvitationLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) return;
    setSending(true);
    try {
      const token = genToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      const inviteLink = `${window.location.origin}/invite?token=${token}`;
      await base44.entities.Invitation.create({
        circle_id: fixedCircle ? fixedCircle.id : null,
        invited_by: user.id,
        invite_email: email.trim(),
        invite_token: token,
        status: "pending",
        expires_at: expiresAt.toISOString(),
        circle_member_ids: fixedCircle ? fixedCircle.member_user_ids : [user.id],
        circle_admin_ids: fixedCircle ? fixedCircle.admin_user_ids : [user.id],
      });
      await base44.functions.invoke("sendInviteEmail", {
        to: email.trim(),
        circleName: fixedCircle?.name,
        inviteLink,
        inviterName: user.full_name || user.email?.split("@")[0] || "Someone",
      });
      setEmailSent(true);
      setEmail("");
      setTimeout(() => setEmailSent(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const renderEmailSection = () => {
    if (emailSent) {
      return (
        <div className="glass-tight rounded-2xl px-4 py-3 flex items-center gap-2 text-primary">
          <Check className="w-4 h-4" />
          <span className="text-sm">Invitation sent!</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 glass-tight rounded-full px-4 py-2.5">
          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
            placeholder="email@example.com"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={handleSendEmail}
          disabled={!email.trim() || sending}
          className="rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium active:scale-95 transition-transform disabled:opacity-50 shrink-0"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
        </button>
      </div>
    );
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
            <SheetTitle>Invite to {fixedCircle.name}</SheetTitle>
          </SheetHeader>
          {invitationLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : invitation ? (
            <div className="mt-5">
              <InviteOptions invitation={invitation} circle={fixedCircle} />
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

  // ---- Standalone Add People — single view, no Circle step ----
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Add People</SheetTitle>
        </SheetHeader>
        {invitationLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : invitation ? (
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Invite by Email
              </p>
              {renderEmailSection()}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground">or share</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <ShareOptions token={invitation.invite_token} circleName="" />
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