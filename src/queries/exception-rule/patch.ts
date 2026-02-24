import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type {
  TExceptionRule,
  TUpdateExceptionRuleInput,
} from "@/models/exception-rule.model";
import { ExceptionRuleService } from "@/services/exception-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateExceptionRule = async ({
  ruleId,
  data,
  businessId,
}: {
  businessId: string;
  ruleId: string;
  data: TUpdateExceptionRuleInput;
}): Promise<TExceptionRule> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return ExceptionRuleService.updateExceptionRule(businessId, ruleId, data);
};

export const useUpdateExceptionRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExceptionRule,
    mutationKey: ["exception-rule"],
    onSuccess: (_, { ruleId }) => {
      queryClient.invalidateQueries({ queryKey: ["exception-rule", ruleId] });
    },
  });
};
