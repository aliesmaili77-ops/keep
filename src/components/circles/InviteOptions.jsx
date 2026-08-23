import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ShareOptions from "@/components/circles/ShareOptions";
import { Check, Mail, Loader2 } from "lucide-react";

export default function InviteOptions({ invitation, circle }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const inviteLink = invitation
    ? `${window.location.origin}/invite?token=${invitation.invite_token}`
    : "";

  const handleSendEmail = async () => {
    if (!email.trim() || !invitation || !circle) return;
    setSending(true);
    try {
      await base44.entities.Invitation.update(invitation.id, {
        invite_email: email.trim(),
      });
      await base44.functions.invoke("sendInviteEmail", {
        to: email.trim(),
        circleName: circle.name,
        inviteLink,
        inviterName: user.full_name || user.email?.split("@")[0] || "Someone",
      });
      setEmailSent(true);
      setEmail("");
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <ShareOptions token={invitation.invite_token} circleName={circle?.name} />

      {/* Email invite */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Invite by Email
        </p>
        {emailSent ? (
          <div className="glass-tight rounded-2xl px-4 py-3 flex items-center gap-2 text-primary">
            <Check className="w-4 h-4" />
            <span className="text-sm">Invitation sent!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 glass-tight rounded-full px-4 py-2.5">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
        )}
      </div>
    </div>
  );
}