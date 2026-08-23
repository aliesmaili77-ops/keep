import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useCircleMembers(circleId) {
  return useQuery({
    queryKey: ["circleMembers", circleId],
    queryFn: () => base44.entities.CircleMember.filter({ circle_id: circleId }),
    enabled: !!circleId,
  });
}

export function useInvalidateCircleMembers() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["circleMembers"] });
}