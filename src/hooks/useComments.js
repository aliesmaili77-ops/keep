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
  const invalidate = useInvalidateComments();
  return useMutation({
    mutationFn: ({ keepId, circleId, text, circleMemberIds, displayName }) =>
      base44.entities.Comment.create({
        keep_id: keepId,
        circle_id: circleId,
        text,
        status: "active",
        circle_member_ids: circleMemberIds,
      }),
    onSuccess: () => invalidate(),
  });
}