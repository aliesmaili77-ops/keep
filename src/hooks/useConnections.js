import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useConnections() {
  return useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      return base44.entities.Connection.filter({ status: "active" });
    },
  });
}

export function invalidateConnections(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["connections"] });
}