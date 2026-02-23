import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TExceptionRule, TCreateExceptionRuleInput } from "@/models/exception-rule.model";
import { ExceptionRuleService } from "@/services/exception-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createExceptionRule = async ({
  businessId,
  data,
}: {
  businessId: string;
  data: TCreateExceptionRuleInput;
}): Promise<TExceptionRule> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return ExceptionRuleService.createExceptionRule(businessId, data);
};

export const useCreateExceptionRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExceptionRule,
    mutationKey: ["exception-rule"],
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId, "exception-rules"] });
    },
  });
};
