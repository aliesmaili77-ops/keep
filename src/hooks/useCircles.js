import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useCircles() {
  return useQuery({
    queryKey: ["circles"],
    queryFn: () => base44.entities.Circle.list("-created_date", 50),
  });
}

export function useInvalidateCircles() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["circles"] });
}