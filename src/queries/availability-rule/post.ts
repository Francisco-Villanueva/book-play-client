import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TAvailabilityRule, TCreateAvailabilityRuleInput } from "@/models/availability-rule.model";
import { AvailabilityRuleService } from "@/services/availability-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createAvailabilityRule = async ({
  businessId,
  data,
}: {
  businessId: string;
  data: TCreateAvailabilityRuleInput;
}): Promise<TAvailabilityRule> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return AvailabilityRuleService.createAvailabilityRule(businessId, data);
};

export const useCreateAvailabilityRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAvailabilityRule,
    mutationKey: ["availability-rule"],
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId, "availability-rules"] });
    },
  });
};
