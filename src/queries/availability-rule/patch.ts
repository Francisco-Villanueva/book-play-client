import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type {
  TAvailabilityRule,
  TUpdateAvailabilityRuleInput,
} from "@/models/availability-rule.model";
import { AvailabilityRuleService } from "@/services/availability-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateAvailabilityRule = async ({
  ruleId,
  data,
}: {
  ruleId: string;
  data: TUpdateAvailabilityRuleInput;
}): Promise<TAvailabilityRule> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return AvailabilityRuleService.updateAvailabilityRule(ruleId, data);
};

export const useUpdateAvailabilityRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAvailabilityRule,
    mutationKey: ["availability-rule"],
    onSuccess: (_, { ruleId }) => {
      queryClient.invalidateQueries({
        queryKey: ["availability-rule", ruleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", "availability-rules"],
      });
    },
  });
};
