import React from "react";
import Avatar from "@/components/Avatar";
import { mockCircles } from "@/lib/mockData";

const typeLabels = {
  close_friends: "Close friends",
  partner: "Partner",
  family: "Family",
  other: "Other",
};

function AvatarStack({ names, max = 3 }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((name, i) => (
        <div
          key={i}
          className="rounded-full ring-2 ring-background"
          style={{ marginLeft: i === 0 ? 0 : -10 }}
        >
          <Avatar name={name} size={28} />
        </div>
      ))}
      {extra > 0 && (
        <div
          className="rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
          style={{ width: 28, height: 28, marginLeft: -10 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

export default function Circles() {
  return (
    <div className="max-w-md mx-auto">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">Circles</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Your private spaces</p>
      </div>
      <div className="mt-2">
        {mockCircles.map((circle) => (
          <button
            key={circle.id}
            className="flex items-center gap-3 w-full px-5 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors text-left"
          >
            <Avatar name={circle.name} size={44} />
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium truncate">{circle.name}</p>
              <p className="text-xs text-muted-foreground">
                {typeLabels[circle.circle_type]} · {circle.keep_count} Keeps · {circle.last_activity}
              </p>
            </div>
            <AvatarStack names={circle.members} />
          </button>
        ))}
      </div>
    </div>
  );
}