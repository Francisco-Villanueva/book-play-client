import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TExceptionRule } from "@/models/exception-rule.model";
import { ExceptionRuleService } from "@/services/exception-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchExceptionRules = async (businessId: string): Promise<TExceptionRule[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return ExceptionRuleService.getExceptionRules(businessId);
};

const fetchExceptionRule = async (
  businessId: string,
  ruleId: string,
): Promise<TExceptionRule> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return ExceptionRuleService.getExceptionRuleDetails(businessId, ruleId);
};

export const useExceptionRulesByBusinessQuery = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId, "exception-rules"],
    queryFn: () => fetchExceptionRules(businessId),
    enabled: !!businessId,
  });
};

export const useExceptionRuleQuery = (businessId: string, ruleId: string) => {
  return useQuery({
    queryKey: ["exception-rule", ruleId],
    queryFn: () => fetchExceptionRule(businessId, ruleId),
    enabled: !!businessId && !!ruleId,
  });
};
