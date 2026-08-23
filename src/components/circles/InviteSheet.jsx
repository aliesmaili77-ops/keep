import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useCircles } from "@/hooks/useCircles";
import Avatar from "@/components/Avatar";
import {
  Copy,
  Check,
  Mail,
  Loader2,
  Link as LinkIcon,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

export default function InviteSheet({ open, onOpenChange, circle: fixedCircle }) {
  const { user } = useAuth();
  const { data: circles } = useCircles();
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const circle = fixedCircle || selectedCircle;

  useEffect(() => {
    if (open && circle && !invitation) {
      createInvitation();
    }
    if (!open) {
      setSelectedCircle(null);
      setInvitation(null);
      setCopied(false);
      setCodeCopied(false);
      setEmail("");
      setEmailSent(false);
    }
  }, [open, circle]); // eslint-disable-line react-hooks/exhaustive-deps

  const createInvitation = async () => {
    if (!circle) return;
    setCreating(true);
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
      setCreating(false);
    }
  };

  const handleBack = () => {
    setSelectedCircle(null);
    setInvitation(null);
    setCopied(false);
    setCodeCopied(false);
    setEmailSent(false);
  };

  const inviteLink = invitation
    ? `${window.location.origin}/invite?token=${invitation.invite_token}`
    : "";
  const inviteCode = invitation
    ? invitation.invite_token.slice(0, 8).toUpperCase()
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

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

  const showPicker = !circle;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {!fixedCircle && selectedCircle && (
              <button
                onClick={handleBack}
                className="w-7 h-7 -ml-1 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Back to circle picker"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {showPicker ? "Add People" : `Invite to ${circle?.name}`}
          </SheetTitle>
        </SheetHeader>

        {showPicker ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Choose a Circle to invite someone to:
            </p>
            {circles && circles.length > 0 ? (
              <div className="space-y-2">
                {circles.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCircle(c)}
                    className="w-full flex items-center gap-3 glass-tight rounded-2xl px-4 py-3 active:scale-[0.98] transition-transform text-left"
                  >
                    <Avatar
                      name={c.name}
                      size={36}
                      className="bg-primary/15 text-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(c.member_user_ids || []).length} members
                      </p>
                    </div>
                    <UserPlus className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Create a Circle first to start adding people.
              </p>
            )}
          </div>
        ) : creating ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : invitation ? (
          <div className="mt-5 space-y-5">
            {/* Shareable link */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Shareable Link
              </p>
              <div className="flex items-center gap-2 glass-tight rounded-full pl-4 pr-1.5 py-1.5">
                <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-xs truncate text-muted-foreground">
                  {inviteLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 h-8 px-3 rounded-full bg-primary/10 flex items-center gap-1 text-primary text-xs font-medium active:scale-95 transition-transform"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                QR Code
              </p>
              <div className="flex flex-col items-center glass-tight rounded-2xl py-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(
                    inviteLink
                  )}`}
                  alt="Invite QR code"
                  className="w-40 h-40 rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Scan to join {circle?.name}
                </p>
              </div>
            </div>

            {/* Invite code */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Invite Code
              </p>
              <div className="glass-tight rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-lg font-mono font-semibold tracking-widest">
                  {inviteCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="text-xs text-primary font-medium flex items-center gap-1"
                >
                  {codeCopied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {codeCopied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

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
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </button>
                </div>
              )}
            </div>
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