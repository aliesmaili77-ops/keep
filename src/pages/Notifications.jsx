import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/common/EmptyState";
import { Bell, ArrowLeft } from "lucide-react";

function resolveNotificationRoute(notification) {
  if (notification.cta_route) return notification.cta_route;
  switch (notification.type) {
    case "connection_added":
      return "/people";
    case "circle_invite_accepted":
      return notification.circle_id ? `/circle/${notification.circle_id}` : "/circles";
    case "connection_followup":
      return "/create";
    case "comment_added":
    case "reaction_added":
      return notification.cta_route || null;
    case "keep_reminder":
      return "/create";
    default:
      return null;
  }
}

export default function Notifications() {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const handleCta = (notification) => {
    if (!notification.read) markRead.mutate(notification.id);
    if (notification.cta_route) navigate(notification.cta_route);
  };

  const handleTap = (notification) => {
    if (!notification.read) markRead.mutate(notification.id);
    const route = resolveNotificationRoute(notification);
    if (route) navigate(route);
  };

  return (
    <div className="max-w-md mx-auto pb-32">
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full glass-tight flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-muted-foreground text-sm mt-0.5">{unreadCount} unread</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="text-sm text-primary font-medium active:scale-95 transition-transform"
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When people accept your invitations or react to your Keeps, you'll see it here."
        />
      ) : (
        <div className="mt-2 px-5 space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleTap(n)}
              className={`glass rounded-2xl p-4 flex items-start gap-3 transition-all ${
                !n.read ? "ring-1 ring-primary/20" : ""
              }`}
            >
              <Avatar
                name={n.actor_name || "Keep"}
                size={40}
                className="bg-primary/15 text-primary shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                {n.body && (
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                )}
                {n.cta_label && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCta(n);
                    }}
                    className="mt-2.5 inline-flex items-center rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-xs font-medium active:scale-95 transition-transform"
                  >
                    {n.cta_label}
                  </button>
                )}
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}