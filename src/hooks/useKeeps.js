import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useKeeps(circleId) {
  return useQuery({
    queryKey: ["keeps", circleId ?? "all"],
    queryFn: () => {
      if (circleId) {
        return base44.entities.Keep.filter({ circle_id: circleId }, "-created_date", 50);
      }
      return base44.entities.Keep.list("-created_date", 50);
    },
  });
}

export function useInvalidateKeeps() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["keeps"] });
}