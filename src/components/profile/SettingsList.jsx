import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsList({ title, items }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 mb-1.5">
        {title}
      </p>
      <div className="mx-4 rounded-full bg-card border border-border/60 overflow-hidden">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
              i > 0 && "border-t border-border/40",
              item.danger
                ? "text-destructive hover:bg-destructive/5"
                : "hover:bg-muted/50",
              item.disabled && "opacity-50 pointer-events-none"
            )}
          >
            <item.icon className={cn("w-[18px] h-[18px] shrink-0", item.danger && "text-destructive")} strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.label}</p>
              {item.subtext && (
                <p className="text-xs text-muted-foreground truncate">{item.subtext}</p>
              )}
            </div>
            {item.trailing !== undefined ? (
              <span className="text-sm text-muted-foreground">{item.trailing}</span>
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}