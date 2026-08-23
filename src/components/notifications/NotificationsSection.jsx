import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import Avatar from "@/components/Avatar";
import { Bell, Check } from "lucide-react";

export default function NotificationsSection() {
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unread = (notifications || []).filter((n) => !n.read);
  const recent = (notifications || []).slice(0, 5);
  const isEmpty = !notifications || notifications.length === 0;

  const handleCta = (n) => {
    if (!n.read) markRead.mutate(n.id);
    if (n.cta_route) navigate(n.cta_route);
  };

  const handleTap = (n) => {
    if (!n.read) markRead.mutate(n.id);
  };

  return (
    <div className="mx-5 mt-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Notifications
          </span>
          {unread.length > 0 && (
            <span className="text-xs font-medium text-primary">{unread.length}</span>
          )}
        </div>
        {unread.length > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="text-xs text-primary font-medium active:scale-95 transition-transform flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Mark all
          </button>
        )}
      </div>
      <div className="space-y-2">
        {isEmpty ? (
          <div className="glass-tight rounded-2xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          recent.map((n) => (
            <div
              key={n.id}
              onClick={() => handleTap(n)}
              className={`glass-tight rounded-2xl p-3 flex items-start gap-2.5 transition-all ${
                !n.read ? "ring-1 ring-primary/20" : ""
              }`}
            >
              <Avatar
                name={n.actor_name || "Keep"}
                size={32}
                className="bg-primary/15 text-primary shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{n.title}</p>
                {n.body && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{n.body}</p>
                )}
                {n.cta_label && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCta(n);
                    }}
                    className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-medium active:scale-95 transition-transform"
                  >
                    {n.cta_label}
                  </button>
                )}
              </div>
              {!n.read && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}