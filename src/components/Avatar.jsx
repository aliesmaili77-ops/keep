import React from "react";
import { cn } from "@/lib/utils";

export default function Avatar({ name, src, size = 40, className }) {
  const initials = (name || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden flex items-center justify-center bg-muted text-muted-foreground font-medium shrink-0 select-none",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? (
        <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
      ) : (
        <span aria-label={name || "Unknown"}>{initials || "?"}</span>
      )}
    </div>
  );
}