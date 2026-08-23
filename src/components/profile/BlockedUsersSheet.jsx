import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/AuthContext";
import { usePeople } from "@/hooks/usePeople";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/common/EmptyState";
import { Loader2, Shield, Trash2 } from "lucide-react";

export default function BlockedUsersSheet({ open, onOpenChange }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: people } = usePeople();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.Block.filter({ blocker_user_id: user.id });
      setBlocks(list);
    } catch (e) {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) load();
  }, [open, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const nameFor = (uid) => {
    const p = (people || []).find((x) => x.user_id === uid);
    return p?.display_name || "Blocked user";
  };

  const handleUnblock = async (block) => {
    try {
      await base44.entities.Block.delete(block.id);
      setBlocks((b) => b.filter((x) => x.id !== block.id));
      toast({ title: "User unblocked" });
    } catch (e) {
      toast({ title: "Couldn't unblock", variant: "destructive" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Blocked Users</SheetTitle>
        </SheetHeader>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : blocks.length === 0 ? (
          <div className="mt-2">
            <EmptyState
              icon={Shield}
              title="No blocked users"
              description="People you block will appear here."
            />
          </div>
        ) : (
          <div className="mt-3 glass-tight rounded-2xl overflow-hidden">
            {blocks.map((b, i) => (
              <div
                key={b.id}
                className={`w-full flex items-center gap-3 px-4 py-3 ${
                  i > 0 ? "border-t border-border/40" : ""
                }`}
              >
                <Avatar
                  name={nameFor(b.blocked_user_id)}
                  size={36}
                  className="bg-primary/15 text-primary"
                />
                <span className="flex-1 text-sm font-medium truncate">
                  {nameFor(b.blocked_user_id)}
                </span>
                <button
                  onClick={() => handleUnblock(b)}
                  className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Unblock"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}