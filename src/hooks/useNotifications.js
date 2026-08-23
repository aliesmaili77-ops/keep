import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const notifications = await base44.entities.Notification.list("-created_date", 50);
      return notifications;
    },
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return (data || []).filter((n) => !n.read).length;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return base44.entities.Notification.update(id, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const unread = (queryClient.getQueryData(["notifications"]) || []).filter((n) => !n.read);
      if (unread.length === 0) return;
      await base44.entities.Notification.bulkUpdate(
        unread.map((n) => ({ id: n.id, read: true }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function invalidateNotifications(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
}