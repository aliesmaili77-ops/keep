import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsList({ title, items }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 mb-1.5">
        {title}
      </p>
      <div className="mx-4 rounded-2xl bg-card border border-border/60 overflow-hidden">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors",
              i > 0 && "border-t border-border/40",
              item.danger
                ? "hover:bg-destructive/5"
                : "hover:bg-muted/50",
              item.disabled && "opacity-50 pointer-events-none"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                item.danger
                  ? "bg-destructive/10"
                  : "bg-primary/10"
              )}
            >
              <item.icon
                className={cn(
                  "w-[17px] h-[17px]",
                  item.danger ? "text-destructive" : "text-primary"
                )}
                strokeWidth={2}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", item.danger && "text-destructive")}>
                {item.label}
              </p>
              {item.subtext && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{item.subtext}</p>
              )}
            </div>
            {item.trailing !== undefined ? (
              <span className="text-sm text-muted-foreground shrink-0">{item.trailing}</span>
            ) : null}
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}