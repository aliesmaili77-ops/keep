import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { usePeople } from "@/hooks/usePeople";
import { useCircles } from "@/hooks/useCircles";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/common/EmptyState";
import InviteSheet from "@/components/circles/InviteSheet";
import { UserPlus, Users, Loader2 } from "lucide-react";

export default function People() {
  const { user } = useAuth();
  const { data: people, isLoading } = usePeople();
  const { data: circles } = useCircles();
  const [inviteOpen, setInviteOpen] = useState(false);

  const circleNameMap = new Map((circles || []).map((c) => [c.id, c.name]));
  const visiblePeople = (people || []).filter((p) => p.user_id !== user?.id);

  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">People</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Your connections</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="rounded-full bg-primary text-primary-foreground flex items-center gap-1.5 px-4 py-2 text-sm font-medium active:scale-95 transition-transform"
        >
          <UserPlus className="w-4 h-4" />
          Add People
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : visiblePeople.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No connections yet"
          description="Add people to your Circles to see them here."
          action={
            <button
              onClick={() => setInviteOpen(true)}
              className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium active:scale-95 transition-transform"
            >
              Add People
            </button>
          }
        />
      ) : (
        <div className="mt-2 px-5 space-y-2">
          {visiblePeople.map((person) => {
            const sharedCircles = (person.circle_ids || [])
              .map((id) => circleNameMap.get(id))
              .filter(Boolean);
            return (
              <div
                key={person.user_id}
                className="glass rounded-2xl p-3.5 flex items-center gap-3"
              >
                <Avatar name={person.display_name || "Person"} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {person.display_name || "Unknown"}
                  </p>
                  {sharedCircles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sharedCircles.map((name) => (
                        <span
                          key={name}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <InviteSheet open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}