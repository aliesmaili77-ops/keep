import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/circles", icon: Users, label: "Circles" },
  { to: "/create", icon: Plus, label: "Keep", primary: true },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-50"
      style={{ bottom: "max(env(safe-area-inset-bottom), 12px)" }}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 px-2 py-2">
        {items.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          if (item.primary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 ml-1"
              >
                <Icon className="w-6 h-6" strokeWidth={2.2} />
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                active ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}