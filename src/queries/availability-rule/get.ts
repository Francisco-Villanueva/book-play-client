import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TAvailabilityRule } from "@/models/availability-rule.model";
import { AvailabilityRuleService } from "@/services/availability-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchAvailabilityRules = async (businessId: string): Promise<TAvailabilityRule[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return AvailabilityRuleService.getAvailabilityRules(businessId);
};

const fetchAvailabilityRule = async (ruleId: string): Promise<TAvailabilityRule> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return AvailabilityRuleService.getAvailabilityRuleDetails(ruleId);
};

export const useAvailabilityRulesByBusinessQuery = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId, "availability-rules"],
    queryFn: () => fetchAvailabilityRules(businessId),
    enabled: !!businessId,
  });
};

export const useAvailabilityRuleQuery = (ruleId: string) => {
  return useQuery({
    queryKey: ["availability-rule", ruleId],
    queryFn: () => fetchAvailabilityRule(ruleId),
    enabled: !!ruleId,
  });
};
