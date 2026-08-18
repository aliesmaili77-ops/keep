import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, User, History } from "lucide-react";
import { cn } from "@/lib/utils";
import CirclesIcon from "@/components/CirclesIcon";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/circles", icon: CirclesIcon, label: "Circles" },
  { to: "/create", icon: Plus, label: "Keep", primary: true },
  { to: "/memories", icon: History, label: "Memories" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const [scrollHidden, setScrollHidden] = useState(false);
  const [commentHidden, setCommentHidden] = useState(false);
  const hidden = scrollHidden || commentHidden;

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrollHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setScrollHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide when a comment input is focused, show when blurred
  useEffect(() => {
    const hide = () => setCommentHidden(true);
    const show = () => setCommentHidden(false);
    window.addEventListener("nav-hide", hide);
    window.addEventListener("nav-show", show);
    return () => {
      window.removeEventListener("nav-hide", hide);
      window.removeEventListener("nav-show", show);
    };
  }, []);

  // Reset on route change
  useEffect(() => {
    setScrollHidden(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 ease-out",
        hidden && "translate-y-[calc(100%+24px)]"
      )}
      style={{ bottom: "max(env(safe-area-inset-bottom), 12px)" }}
      aria-label="Main navigation"
    >
      <div
        className="flex items-center gap-2 rounded-full border border-white/30 bg-gradient-to-b from-white/50 to-white/20 backdrop-blur-2xl backdrop-saturate-150 px-2 py-1.5"
        style={{
          boxShadow:
            "0 8px 32px -8px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.4)",
        }}
      >
        {items.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          if (item.primary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 mx-0.5"
                style={{
                  boxShadow:
                    "0 4px 16px -2px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.25)",
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
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
                "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                active ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.4 : 2} />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}