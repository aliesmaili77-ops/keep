import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export default function ChangePasswordSheet({ open, onOpenChange }) {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await base44.auth.resetPasswordRequest(user.email);
    } catch (e) {
      // generic success per SDK guidance
    } finally {
      setSent(true);
      setSending(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setSent(false);
      }}
    >
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
        <SheetHeader>
          <SheetTitle>Change Password</SheetTitle>
        </SheetHeader>
        {sent ? (
          <div className="mt-5 flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              If an account exists for {user?.email}, a reset link has been sent. Check your inbox and follow the link to set a new password.
            </p>
            <Button className="w-full mt-5" size="lg" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="glass-tight rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Reset link will be sent to</p>
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              We'll email you a secure link to set a new password.
            </p>
            <Button className="w-full" size="lg" disabled={sending} onClick={handleSend}>
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}