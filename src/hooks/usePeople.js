import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function usePeople() {
  return useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const [members, connections] = await Promise.all([
        base44.entities.CircleMember.filter({}),
        base44.entities.Connection.filter({}),
      ]);

      const unique = new Map();

      // Add circle members
      const active = members.filter(
        (m) => m.membership_status !== "left" && m.membership_status !== "removed"
      );
      active.forEach((m) => {
        if (!m.user_id) return;
        if (!unique.has(m.user_id)) {
          unique.set(m.user_id, { ...m, circle_ids: [m.circle_id] });
        } else {
          unique.get(m.user_id).circle_ids.push(m.circle_id);
        }
      });

      // Add standalone connections
      connections.forEach((c) => {
        if (!c.connected_user_id) return;
        if (!unique.has(c.connected_user_id)) {
          unique.set(c.connected_user_id, {
            user_id: c.connected_user_id,
            display_name: c.display_name,
            circle_ids: [],
          });
        }
      });

      return Array.from(unique.values());
    },
  });
}

export function invalidatePeople(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["people"] });
}