import React from "react";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function ProfileHeader({ user, stats }) {
  const displayName = user?.display_name || user?.full_name || user?.email?.split("@")[0] || "You";
  const joinedDate = user?.created_date
    ? new Date(user.created_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Aug 2026";

  return (
    <div className="px-5 pt-14 pb-2">
      {/* Avatar + stats row */}
      <div className="flex items-center gap-6">
        <Avatar name={displayName} size={72} className="bg-primary/15 text-primary" />
        <div className="flex-1 flex justify-around">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Name + bio */}
      <div className="mt-3">
        <p className="text-base font-semibold">{displayName}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Calendar className="w-3 h-3" />
          <span>Joined {joinedDate}</span>
        </div>
      </div>

      {/* Action button */}
      <Button variant="secondary" className="w-full mt-4" size="sm">
        Edit Profile
      </Button>
    </div>
  );
}