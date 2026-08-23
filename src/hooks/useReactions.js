import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useReactions(keepId) {
  return useQuery({
    queryKey: ["reactions", keepId],
    queryFn: () => base44.entities.Reaction.filter({ keep_id: keepId }),
    enabled: !!keepId,
  });
}

export function useInvalidateReactions() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["reactions"] });
}

export function useToggleReaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ keepId, circleId, type, circleMemberIds, existingId }) => {
      if (existingId) {
        await base44.entities.Reaction.delete(existingId);
        return { deleted: true };
      }
      await base44.entities.Reaction.create({
        keep_id: keepId,
        circle_id: circleId,
        reaction_type: type,
        circle_member_ids: circleMemberIds,
      });
      return { created: true };
    },
    onMutate: async ({ keepId, type, existingId }) => {
      await qc.cancelQueries({ queryKey: ["reactions", keepId] });
      const previousData = qc.getQueryData(["reactions", keepId]);
      if (previousData) {
        if (existingId) {
          qc.setQueryData(
            ["reactions", keepId],
            previousData.filter((r) => r.id !== existingId)
          );
        } else {
          qc.setQueryData(["reactions", keepId], [
            ...previousData,
            { id: "temp-" + Date.now(), keep_id: keepId, reaction_type: type, created_by_id: "me" },
          ]);
        }
      }
      return { previousData };
    },
    onError: (_err, vars, context) => {
      if (context?.previousData) {
        qc.setQueryData(["reactions", vars.keepId], context.previousData);
      }
    },
    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: ["reactions", vars.keepId] });
    },
  });
}