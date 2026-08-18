import React from "react";
import Avatar from "@/components/Avatar";
import { Calendar } from "lucide-react";

export default function ProfileHeader({ user, stats }) {
  const displayName = user?.full_name || user?.email?.split("@")[0] || "You";
  const joinedDate = user?.created_date
    ? new Date(user.created_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "August 2026";

  return (
    <div className="px-5 pt-14 pb-2">
      <div className="flex items-center gap-4">
        <Avatar name={displayName} size={72} className="bg-primary/15 text-primary" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight truncate">{displayName}</h1>
          <p className="text-muted-foreground text-sm truncate">{user?.email}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Calendar className="w-3 h-3" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-muted/50 px-3 py-3 text-center">
            <p className="text-xl font-semibold">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}