import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function usePeople() {
  return useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const members = await base44.entities.CircleMember.filter({});
      const active = members.filter(
        (m) => m.membership_status !== "left" && m.membership_status !== "removed"
      );
      const unique = new Map();
      active.forEach((m) => {
        if (!m.user_id) return;
        if (!unique.has(m.user_id)) {
          unique.set(m.user_id, { ...m, circle_ids: [m.circle_id] });
        } else {
          unique.get(m.user_id).circle_ids.push(m.circle_id);
        }
      });
      return Array.from(unique.values());
    },
  });
}

export function invalidatePeople(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["people"] });
}