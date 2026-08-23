import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useComments(keepId) {
  return useQuery({
    queryKey: ["comments", keepId],
    queryFn: () => base44.entities.Comment.filter({ keep_id: keepId }, "created_date", 100),
    enabled: !!keepId,
  });
}

export function useInvalidateComments() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["comments"] });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ keepId, circleId, text, circleMemberIds, displayName }) =>
      base44.entities.Comment.create({
        keep_id: keepId,
        circle_id: circleId,
        text,
        status: "active",
        circle_member_ids: circleMemberIds,
      }),
    onMutate: async ({ keepId, text }) => {
      await qc.cancelQueries({ queryKey: ["comments", keepId] });
      const previousData = qc.getQueryData(["comments", keepId]);
      if (previousData) {
        qc.setQueryData(["comments", keepId], [
          ...previousData,
          {
            id: "temp-" + Date.now(),
            keep_id: keepId,
            text,
            created_by_id: "me",
            created_date: new Date().toISOString(),
          },
        ]);
      }
      return { previousData };
    },
    onError: (_err, vars, context) => {
      if (context?.previousData) {
        qc.setQueryData(["comments", vars.keepId], context.previousData);
      }
    },
    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: ["comments", vars.keepId] });
    },
  });
}