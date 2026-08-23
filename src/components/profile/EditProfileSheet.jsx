import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function EditProfileSheet({ open, onOpenChange }) {
  const { user, checkUserAuth } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user?.display_name || user?.full_name || "");
      setAvatar(user?.avatar || "");
      setDob(user?.date_of_birth || "");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        display_name: name.trim(),
        avatar: avatar.trim() || undefined,
        date_of_birth: dob || undefined,
      });
      await checkUserAuth();
      toast({ title: "Profile updated" });
      onOpenChange(false);
    } catch (e) {
      toast({ title: "Couldn't update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Avatar URL</label>
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date of birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button className="w-full" size="lg" disabled={saving || !name.trim()} onClick={handleSave}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}