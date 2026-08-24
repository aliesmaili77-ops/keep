import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Plus, User, History } from "lucide-react";
import { cn } from "@/lib/utils";
import CirclesIcon from "@/components/CirclesIcon";

const springPill = { type: "spring", stiffness: 400, damping: 32 };

const tabForPath = (path) => {
  if (path === "/") return "/";
  if (path.startsWith("/circles") || path.startsWith("/circle/")) return "/circles";
  if (path.startsWith("/create")) return "/create";
  if (path.startsWith("/memories")) return "/memories";
  if (path.startsWith("/profile")) return "/profile";
  return null;
};

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/circles", icon: CirclesIcon, label: "Circles" },
  { to: "/create", icon: Plus, label: "Keep", primary: true },
  { to: "/memories", icon: History, label: "Memories" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const tabRoutes = useRef({});
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

  // Store last visited subroute per tab
  useEffect(() => {
    const tab = tabForPath(location.pathname);
    if (tab) {
      tabRoutes.current[tab] = location.pathname;
    }
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
      <div className="glass flex items-center gap-2 rounded-full px-2 py-1.5">
        {items.map((item) => {
          const active =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          const handleClick = (e) => {
            e.preventDefault();
            if (active) {
              delete tabRoutes.current[item.to];
              navigate(item.to);
            } else {
              navigate(tabRoutes.current[item.to] || item.to);
            }
          };
          if (item.primary) {
            return (
              <motion.button
                key={item.to}
                onClick={handleClick}
                aria-label={item.label}
                whileTap={reduced ? undefined : { scale: 0.9 }}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground transition-transform mx-0.5"
                style={{
                  boxShadow:
                    "0 4px 16px -2px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.25)",
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </motion.button>
            );
          }
          return (
            <motion.button
              key={item.to}
              onClick={handleClick}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              whileTap={reduced ? undefined : { scale: 0.88 }}
              className={cn(
                "relative flex items-center justify-center w-11 h-11 rounded-full transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {active && (
                <motion.div
                  layoutId="navActivePill"
                  className="absolute inset-0 rounded-full bg-primary/10"
                  transition={reduced ? { duration: 0 } : springPill}
                />
              )}
              <Icon className="relative z-10 w-[18px] h-[18px]" strokeWidth={active ? 2.4 : 2} />
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}