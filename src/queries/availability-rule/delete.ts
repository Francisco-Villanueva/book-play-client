import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { AvailabilityRuleService } from "@/services/availability-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteAvailabilityRule = async ({
  ruleId,
}: {
  ruleId: string;
}): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await AvailabilityRuleService.deleteAvailabilityRule(ruleId);
};

export const useDeleteAvailabilityRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAvailabilityRule,
    mutationKey: ["availability-rule"],
    onSuccess: (_, { ruleId }) => {
      queryClient.invalidateQueries({
        queryKey: ["availability-rule", ruleId],
      });
    },
  });
};
