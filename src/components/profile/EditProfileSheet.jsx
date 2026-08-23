import React, { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import Avatar from "@/components/Avatar";
import { Loader2, Camera, X } from "lucide-react";

export default function EditProfileSheet({ open, onOpenChange }) {
  const { user, checkUserAuth } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName(user?.display_name || user?.full_name || "");
      setAvatar(user?.avatar || "");
      setDob(user?.date_of_birth || "");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAvatar(file_url);
    } catch (err) {
      toast({ title: "Couldn't upload photo", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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

  const displayName = name || user?.email?.split("@")[0] || "You";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="mt-5 space-y-4">
          {/* Avatar picker */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar
                name={displayName}
                src={avatar || undefined}
                size={88}
                className="bg-primary/15 text-primary ring-4 ring-primary/5"
              />
              {avatar && (
                <button
                  onClick={() => setAvatar("")}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                  aria-label="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow active:scale-95 transition-transform disabled:opacity-50"
                aria-label="Choose photo"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">
              {uploading ? "Uploading..." : "Tap the camera to add a photo"}
            </p>
          </div>

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
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date of birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full mt-1.5 rounded-full border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button className="w-full" size="lg" disabled={saving || uploading || !name.trim()} onClick={handleSave}>
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