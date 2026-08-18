import React from "react";
import Avatar from "@/components/Avatar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCircles } from "@/lib/mockData";

const roleBadge = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

// Mock: current user's role in each circle
const myRoles = {
  c1: "owner",
  c2: "admin",
  c3: "member",
  c4: "member",
};

export default function ProfileCircles() {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 mb-1.5">
        Your Circles
      </p>
      <div className="mx-4 rounded-2xl bg-card border border-border/60 overflow-hidden">
        {mockCircles.map((circle, i) => (
          <div
            key={circle.id}
            className={cn("flex items-center gap-3 px-4 py-3", i > 0 && "border-t border-border/40")}
          >
            <Avatar name={circle.name} size={36} className="bg-primary/10 text-primary text-xs" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{circle.name}</p>
              <p className="text-xs text-muted-foreground">
                {circle.keep_count} Keeps · {circle.members.length} members
              </p>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {roleBadge[myRoles[circle.id]]}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}