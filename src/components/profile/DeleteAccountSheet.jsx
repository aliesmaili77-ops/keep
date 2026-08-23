import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertTriangle } from "lucide-react";

export default function DeleteAccountSheet({ open, onOpenChange, onDeleted }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.auth.updateMe({ status: "deletion_requested" });
      toast({
        title: "Deletion requested",
        description: "Your account will be reviewed for removal.",
      });
      onDeleted?.();
    } catch (e) {
      toast({ title: "Couldn't submit request", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setConfirmText("");
      }}
    >
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
        <SheetHeader>
          <SheetTitle>Delete Account</SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-4">
          <div className="glass-tight rounded-2xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">This is permanent</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your Keeps, Circles, and connections will be scheduled for removal. This cannot be undone.
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Type DELETE to confirm
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-destructive"
            />
          </div>
          <Button
            variant="destructive"
            className="w-full"
            size="lg"
            disabled={deleting || confirmText !== "DELETE"}
            onClick={handleDelete}
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Request Deletion"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}