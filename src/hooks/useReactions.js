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
  const invalidate = useInvalidateReactions();
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
    onSuccess: () => invalidate(),
  });
}