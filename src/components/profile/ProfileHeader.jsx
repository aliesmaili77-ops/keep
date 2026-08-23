import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil } from "lucide-react";

export default function ProfileHeader({ user, stats, onEdit }) {
  const navigate = useNavigate();
  const displayName = user?.display_name || user?.full_name || user?.email?.split("@")[0] || "You";
  const joinedDate = user?.created_date
    ? new Date(user.created_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Aug 2026";

  const statRoutes = { Keeps: "/memories", People: "/people" };

  return (
    <div className="px-4 pt-14 pb-2">
      <div className="glass rounded-3xl p-5">
        {/* Avatar + stats */}
        <div className="flex items-center gap-5">
          <Avatar
            name={displayName}
            src={user?.avatar || undefined}
            size={80}
            className="bg-primary/15 text-primary ring-4 ring-primary/5"
          />
          <div className="flex-1 flex justify-around">
            {stats.map((s) => {
              const route = statRoutes[s.label];
              return (
                <button
                  key={s.label}
                  onClick={() => route && navigate(route)}
                  className="flex flex-col items-center group"
                >
                  <span className="text-xl font-bold tracking-tight group-active:scale-95 transition-transform">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name + bio */}
        <div className="mt-4">
          <h1 className="text-lg font-bold tracking-tight">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
            <Calendar className="w-3 h-3" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* Action button */}
        <Button variant="secondary" className="w-full mt-4" size="sm" onClick={onEdit}>
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}